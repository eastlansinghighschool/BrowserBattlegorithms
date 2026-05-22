# Turn Engine

## Scope

This note owns:
- The runtime order of events within a single runner's turn.
- The distinction between a bounce, an illegal move, and a skipped action.
- The collision rule tree, including map-side logic, flag-carrying overrides, and grace-period behavior.
- The relationship between a score event, a round reset, level completion, and game-over.

This note does NOT own:
- How Blockly programs are compiled into action choices — see [blockly-workspace.md](./blockly-workspace.md).
- How NPC and CPU behaviors select an action — see [npc-and-cpu.md](./npc-and-cpu.md).
- Play/reset button state and mode-level flow — see [ui-mode-contract.md](./ui-mode-contract.md).

## Surface map

| File | Role |
|---|---|
| `src/core/turnEngine.js` | Main turn loop: activates runners, resolves queued actions, advances the sequence. |
| `src/core/gameplayPause.js` | Gameplay pause/resume helpers and pending-pause boundary decisions. |
| `src/core/actions.js` | Action family definitions (move, jump, barrier place/remove, freeze, stay still). |
| `src/core/areaFreeze.js` | Shared Area Freeze cooldown helpers (`isAreaFreezeReady`, `getAreaFreezeTurnsRemaining`, `markAreaFreezeUsed`). |
| `src/core/recentMovement.js` | Runner-local recent-movement state helpers for blocked-move and no-move streak checks. |
| `src/core/movement.js` | Target cell translation, board-blocking checks, bounce logic. |
| `src/core/conditions.js` | Sensor and condition evaluation consumed by Blockly block execution. |
| `src/core/scoring.js` | Flag pickup, score increment, `GAME_OVER` transitions, round reset trigger. |
| `src/core/levels.js` | Guided level completion, pass/fail resolution, and the `GAME_OVER` level-result safety net. |
| `src/core/collisions.js` | Winner/loser resolution, freeze application, flag drop. |
| `src/core/events.js` | Per-turn event log for narration consumers; passive observer, does not change resolution order. |
| `src/core/invariants.js` | Post-resolution state validation: duplicate positions, invalid flag state, team direction. |

## Turn resolution order

Each runner's turn follows this sequence. Steps are not flat; each can branch or short-circuit:

1. Runner becomes active.
2. Human input may have queued an action, or AI/Blockly may choose one now.
3. If the runner is a Blockly-controlled, visible-workspace runner and `animationSpeedFactor` is at or below `BLOCKLY_TRACE_SPEED_THRESHOLD`, the engine enters `TRACING_PRE_ACTION` and renders the evaluation trace before resolving the queued action. The queued action is not re-evaluated.
4. The turn engine resolves the queued action.
5. Movement, collision, barrier, and freeze legality are checked.
6. Runner finishes the action or bounces back to origin.
7. Flag pickup is checked at the destination cell.
8. Scoring is checked: if the runner returned the enemy flag to base and that runner's own team's flag is at home, a point is scored. If the runner is at base with the enemy flag but their own flag is away, scoring is blocked — a `score.blocked` event is emitted, the runner keeps the enemy flag, and the turn continues without a round reset. Only the completed runner is checked; no scan of other runners happens.
9. If guided mode, level-completion conditions may be evaluated.
10. Engine either resets the round, ends the game, or advances to the next runner.

Human input goes through the same engine pipeline as AI input. There is no parallel human-resolution path.

The trace pause does not consume an extra turn, does not change collision/scoring/level-completion outcomes, and is cleared on reset, level switch, mode switch, workspace reload, game-over, threshold-crossing upward, and PvP team tab switch.

## Gameplay pause / resume

Gameplay pause is a live-match UI state, not a new turn-state enum. `src/core/gameplayPause.js` owns the helper contract and `src/core/turnEngine.js` applies it at clean runner boundaries only.

- `gameplayPaused` halts `processTurnActions()` entirely until resumed.
- `pauseRequested` remembers a pause request that arrived during an in-progress runner turn.
- A pause request applies immediately only when the active runner is already waiting for human input.
- Otherwise, the request becomes pending and takes effect after the current runner's turn fully completes, before the next runner begins planning or auto-skipping.
- Pending pause does not cancel queued actions, trace data, scoring, collisions, jump landing effects, or freeze effects.
- Resume clears both pause flags and returns the engine to normal live processing.

Pause is separate from the trace pause above and separate from the Plan 28 and Plan 55 safety nets. Those safety nets repair invalid turn or level states; gameplay pause simply asks the engine to wait at the next clean boundary.

## Area Freeze cooldown

Area Freeze is a team cooldown, not a once-per-round boolean.
Source: `src/core/areaFreeze.js`.

The shared helper contract is:

- `isAreaFreezeReady(state, teamId)` returns `true` when `state.currentTurnNumber >= teamAreaFreezeNextAvailableTurn[teamId]`.
- `markAreaFreezeUsed(state, teamId)` sets `teamAreaFreezeNextAvailableTurn[teamId]` to `currentTurnNumber + AREA_FREEZE_COOLDOWN_TURNS`.
- `getAreaFreezeTurnsRemaining(state, teamId)` reports the countdown until readiness returns.
- Round reset and level / match reset both restore readiness immediately.

Blockly readiness blocks, the freeze action itself, and free-play CPU logic all use that shared helper so the UI and runtime cannot disagree about whether the resource is ready.

When a freeze succeeds, the turn engine also records a transient `state.areaFreezeEffect` snapshot with the caster cell, affected runner cells, radius, and effect timing. Render code reads that snapshot for the board pulse and affected-runner flash; it does not decide who was frozen.

When a jump lands successfully, the turn engine also records a transient `state.activeJumpLandingDust` snapshot with the landing cell and effect timing. Render code reads that snapshot for the landing dust ring; it does not decide that the jump succeeded.

## Runner recent movement state

Runner recent movement state is a runner-local, match-scoped helper used by Free Play's read-only Advanced boolean blocks. The runtime tracks two pieces of information for each runner:

- whether the most recent attempted movement action was blocked, bounced, illegal, or failed without changing cells
- how many consecutive own turns ended without the runner changing cells

It also keeps a short window of completed turn-end positions so `I have been stuck for [N] turns` can detect bounded local movement in a small area rather than goal-relative progress.

`src/core/recentMovement.js` owns the helper contract, and `src/core/turnEngine.js` updates it only when a runner turn starts and finishes. `Runner.resetToInitial()` clears it, so level start, round reset, and display-state rebuilds all reset the state automatically. The helper never persists to storage and never changes movement, collision, or scoring rules.

## Bounce vs illegal vs skipped

These three outcomes look similar at the surface but are distinct:

- **Bounce**: the runner attempted to move to a valid target cell, but the cell was blocked (wall, barrier, out of bounds). The runner returns to its origin cell with a bounce animation. The turn is consumed.
- **Illegal / no-op**: the action is structurally invalid (e.g., no action was queued, or the action type cannot apply in this context). The turn advances without movement or animation.
- **Skipped (frozen)**: the runner is frozen and cannot act. Frozen runners still occupy their cell and participate in the turn loop order — they are not absent. The turn is consumed and the runner thaws one step.

Extra blocks in a Blockly program are ignored, not bounced. The engine only reads the first executed action from the program; subsequent action blocks in the same turn are skipped.

## Collision rule tree

Collision resolution is determined by flag-carrying state first, then map side, then grace period.
Source: `src/core/collisions.js`.

The map-side defender for a collision cell is the team whose `homeSide` (from the runtime team config) covers that half of the map. `src/core/collisions.js` resolves this by looking up each team's `homeSide` rather than comparing literal team numbers, so the rule is orientation-agnostic and correct in both guided levels (Team 1 always on the left) and Free Play (orientation randomized per match).

**Priority order (first matching rule wins):**

| Priority | Condition | Outcome |
|---|---|---|
| 1 | Exactly one runner carries enemy flag | Flag carrier loses |
| 2 | Both runners carry enemy flag | Moving attacker loses |
| 3 | Neither runner carries enemy flag AND attacker's team = map-side owner | Attacker wins |
| 4 | Neither runner carries enemy flag AND defender's team = map-side owner | Defender wins |
| 5 | Default (no rule matched) | Defender wins |

**After winner and loser are determined:**
- If loser is NOT in grace period: loser is frozen for `FROZEN_DURATION_TURNS`.
- If loser is in grace period: loser is NOT frozen (but is still displaced).
- If loser carries the enemy flag: the flag drops and resets to its initial position.
- Loser returns to origin cell (`attackerOriginCell` if available, else attacker's current grid position).

The old Java percent-chance collision rule is not used here. The "defender always wins" shorthand in older docs is an oversimplification, because flag carriers lose before map-side ownership is considered.

## Scoring vs level completion vs round reset

These three events are related but distinct and can happen independently:

- **Scoring** (`scoring.js`): a runner returns the enemy flag to their team's base while their own flag is also at home. The team score increments. A round reset immediately follows: all runners return to their start positions, flags reset. The match continues.
- **Blocked scoring** (`scoring.js`): a runner is at their team's base with the enemy flag, but their own flag is not at home. No point is scored, no round reset occurs, and the runner keeps the enemy flag. A `score.blocked` event is emitted. The runner can score on a later turn once their own flag returns home. The engine does not scan other runners for parked carriers when a flag returns home; each runner is evaluated only during its own completed turn.
- **No-score round reset (Free Play turn limit)**: in Free Play mode only, when the per-point turn limit is set and the number of turns elapsed since the last round reset reaches the limit, the round resets with no score. Team scores are preserved. Runners, flags, and barriers reset through the same `resetRound` path used after scoring. The check fires at the same turn boundary where `currentTurnNumber` increments (i.e., after the last runner in the round advances). The `freePlayRoundStartTurn` field tracks when the current round began; it is reset to `currentTurnNumber` on every `resetRound` call. When `freePlayPointTurnLimit` is `null`, the limit is disabled.
- **Game over**: when a team reaches the win threshold during a scoring check, `GAME_OVER` state is set. The match ends and the end-state overlay appears.
- **Level completion** (guided mode only): after a scoring event, the engine evaluates whether the guided level's win condition is satisfied. A level may require scoring a specific number of points or other conditions, and it may also fail if one or more authored failure conditions are met, such as the opposing team scoring first or a turn cap being exceeded. Older authored levels still use the singular `failureCondition` field, while newer levels may author a `failureConditions` array. Level pass or fail triggers the level-result overlay and enables the Next Level button.
- **Stateful guided goals**: a small number of guided levels may track an authored staging phase before a later support phase. Those levels still use the same turn pipeline; the win condition simply remembers which phase the player reached and evaluates the final support square after the teammate acquires the flag.
- **Round reset ≠ level reset**: a round reset happens automatically after scoring (or after the Free Play turn limit is reached). It preserves workspace state. A level reset re-enters the current level from scratch using the persisted workspace.

A single score event can trigger all three in sequence: increment score → evaluate game-over → if guided, evaluate level completion.

## Game-over level-result invariant

Whenever `mainGameState === GAME_OVER`, `activeLevelResult` must already be a terminal value: `PASSED` or `FAILED`. It must not remain `IN_PROGRESS`, `NONE`, `null`, or `undefined`.

`src/core/levels.js` enforces that invariant in `evaluateLevelProgress()`. If scoring ends the match before the level's own win condition is satisfied, the safety-net branch records `lastLevelResultReason = "match_ended_without_level_win_condition_satisfied"`, emits `level.forcedFailedAtGameOver` with the `levelId`, `reason`, `winConditionType`, `winConditionRunnerId`, and `scoringTeam`, and finalizes the level as failed while preserving the match-ending `GAME_OVER` state.

This is a separate safety net from the `PROCESSING_ACTION` recovery in `src/core/turnEngine.js`. Plan 28 repairs an orphaned turn-state branch; Plan 55 repairs an orphaned level-result branch after scoring.

## Common traps

- **Treating frozen runners as absent.** Frozen runners occupy their cell and are processed in turn order. Other runners can collide with them.
- **Assuming "defender always wins."** Flag carriers lose before map-side ownership is considered; only the no-carrier case falls back to the home-defender rule.
- **Conflating round reset and level reset.** Round reset is automatic after scoring. Level reset is a user action that re-enters the level.
- **Expecting extra Blockly blocks to cause errors.** The engine reads the first action from the program each turn; extra blocks are silently ignored.
- **Assuming grace period prevents all collision effects.** Grace period skips the freeze, but the loser is still displaced and drops their flag.
- **Treating recent movement state like author-authored variables.** The runner-memory helper is read-only game state, not a player variable, and it resets with match setup and round reset.
- **Expecting a parked carrier to auto-score when the own flag returns home.** Blocked scoring does not create a deferred trigger. The carrier scores only during its own completed turn, not as a side effect of another runner returning the own flag.
- **Assuming the Free Play turn limit applies to guided levels.** The `freePlayPointTurnLimit` check is gated on `currentModeView === FREE_PLAY`. Guided level turn limits are separate authored properties in each level's config.
- **Treating the no-score round reset as a score event.** It resets the round state but neither increments team scores nor emits a scoring event. `lastScoringTeam` remains `null` after the reset.

## Related

- [npc-and-cpu.md](./npc-and-cpu.md) — how the action sent to the engine is chosen
- [blockly-workspace.md](./blockly-workspace.md) — how Blockly programs produce actions
- [ui-mode-contract.md](./ui-mode-contract.md) — level completion and game-over UI transitions
