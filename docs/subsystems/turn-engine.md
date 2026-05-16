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
| `src/core/actions.js` | Action family definitions (move, jump, barrier place/remove, freeze, stay still). |
| `src/core/movement.js` | Target cell translation, board-blocking checks, bounce logic. |
| `src/core/conditions.js` | Sensor and condition evaluation consumed by Blockly block execution. |
| `src/core/scoring.js` | Flag pickup, score increment, `GAME_OVER` transitions, round reset trigger. |
| `src/core/collisions.js` | Winner/loser resolution, freeze application, flag drop. |
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
8. Scoring is checked: if the runner returned the enemy flag to base, a point is scored.
9. If guided mode, level-completion conditions may be evaluated.
10. Engine either resets the round, ends the game, or advances to the next runner.

Human input goes through the same engine pipeline as AI input. There is no parallel human-resolution path.

The trace pause does not consume an extra turn, does not change collision/scoring/level-completion outcomes, and is cleared on reset, level switch, mode switch, workspace reload, game-over, threshold-crossing upward, and PvP team tab switch.

## Bounce vs illegal vs skipped

These three outcomes look similar at the surface but are distinct:

- **Bounce**: the runner attempted to move to a valid target cell, but the cell was blocked (wall, barrier, out of bounds). The runner returns to its origin cell with a bounce animation. The turn is consumed.
- **Illegal / no-op**: the action is structurally invalid (e.g., no action was queued, or the action type cannot apply in this context). The turn advances without movement or animation.
- **Skipped (frozen)**: the runner is frozen and cannot act. Frozen runners still occupy their cell and participate in the turn loop order — they are not absent. The turn is consumed and the runner thaws one step.

Extra blocks in a Blockly program are ignored, not bounced. The engine only reads the first executed action from the program; subsequent action blocks in the same turn are skipped.

## Collision rule tree

Collision resolution is determined by three factors: map side, flag-carrying state, and grace period.
Source: `src/core/collisions.js`.

The map-side defender for a collision cell is the team whose `homeSide` (from the runtime team config) covers that half of the map. `src/core/collisions.js` resolves this by looking up each team's `homeSide` rather than comparing literal team numbers, so the rule is orientation-agnostic and correct in both guided levels (Team 1 always on the left) and Free Play (orientation randomized per match).

**Priority order (first matching rule wins):**

| Priority | Condition | Outcome |
|---|---|---|
| 1 | Attacker carries enemy flag AND attacker's team ≠ map-side owner | Defender wins |
| 2 | Defender carries enemy flag AND defender's team ≠ map-side owner | Attacker wins |
| 3 | Attacker's team = map-side owner | Attacker wins |
| 4 | Defender's team = map-side owner | Defender wins |
| 5 | Default (no rule matched) | Defender wins |

**After winner and loser are determined:**
- If loser is NOT in grace period: loser is frozen for `FROZEN_DURATION_TURNS`.
- If loser is in grace period: loser is NOT frozen (but is still displaced).
- If loser carries the enemy flag: the flag drops and resets to its initial position.
- Loser returns to origin cell (`attackerOriginCell` if available, else attacker's current grid position).

The "defender always wins" shorthand in older docs is an oversimplification. Rules 1 and 2 override the map-side default when a runner is carrying the enemy flag on enemy territory.

## Scoring vs level completion vs round reset

These three events are related but distinct and can happen independently:

- **Scoring** (`scoring.js`): a runner returns the enemy flag to their team's base. The team score increments. A round reset immediately follows: all runners return to their start positions, flags reset. The match continues.
- **Game over**: when a team reaches the win threshold during a scoring check, `GAME_OVER` state is set. The match ends and the end-state overlay appears.
- **Level completion** (guided mode only): after a scoring event, the engine evaluates whether the guided level's win condition is satisfied. A level may require scoring a specific number of points or other conditions. Level pass or fail triggers the level-result overlay and enables the Next Level button.
- **Stateful guided goals**: a small number of guided levels may track an authored staging phase before a later support phase. Those levels still use the same turn pipeline; the win condition simply remembers which phase the player reached and evaluates the final support square after the teammate acquires the flag.
- **Round reset ≠ level reset**: a round reset happens automatically after scoring and preserves workspace state. A level reset re-enters the current level from scratch using the persisted workspace.

A single score event can trigger all three in sequence: increment score → evaluate game-over → if guided, evaluate level completion.

## Common traps

- **Treating frozen runners as absent.** Frozen runners occupy their cell and are processed in turn order. Other runners can collide with them.
- **Assuming "defender always wins."** Flag-carrying state on the wrong map side overrides the home-defender rule (priorities 1 and 2 above).
- **Conflating round reset and level reset.** Round reset is automatic after scoring. Level reset is a user action that re-enters the level.
- **Expecting extra Blockly blocks to cause errors.** The engine reads the first action from the program each turn; extra blocks are silently ignored.
- **Assuming grace period prevents all collision effects.** Grace period skips the freeze, but the loser is still displaced and drops their flag.

## Related

- [npc-and-cpu.md](./npc-and-cpu.md) — how the action sent to the engine is chosen
- [blockly-workspace.md](./blockly-workspace.md) — how Blockly programs produce actions
- [ui-mode-contract.md](./ui-mode-contract.md) — level completion and game-over UI transitions
