# NPC and CPU

## Scope

This note owns:
- The split between guided teaching NPC behaviors and free-play CPU behaviors: different design goals, different files.
- Which behaviors are deterministic and which are intentionally random.
- The shared pathing helper and its limitations.
- How mode and team setup maps `cpuBehavior` and `cpuRole` to active behavior functions.
- The `state.randomFn` test hook.

This note does NOT own:
- Turn resolution and how the chosen action is executed — see [turn-engine.md](./turn-engine.md).
- Team setup fields beyond what's needed to understand CPU wiring — see `src/core/teams.js`.
- Free Play mode state and UI — see [ui-mode-contract.md](./ui-mode-contract.md).

## Surface map

| File | Role |
|---|---|
| `src/ai/npc/npcType1.js` | Guided teaching NPC: axis-prioritized flag-chaser. Deterministic. |
| `src/ai/npc/npcType2.js` | Guided teaching NPC: patrol/defender near flag home. Deterministic. |
| `src/ai/npc/freePlayCpu.js` | Free Play CPU strategies plus authored guided exceptions: `FREE_PLAY_EASY` (random), `FREE_PLAY_TACTICAL_ATTACKER`, `FREE_PLAY_TACTICAL_DEFENDER`, `GUIDED_STAY_STILL`, `GUIDED_RANDOM_MOVE_ONLY`, `GUIDED_VERTICAL_PATROL`, `GUIDED_GUARD`, `GUIDED_CHARGER`. |
| `src/ai/npc/pathing.js` | Shared deterministic one-step move-toward helper. Used by `npcType2.js` and the tactical free-play CPU. |
| `src/core/teams.js` | Assigns `cpuBehavior` and `cpuRole` to CPU runner slots during team setup. |
| `src/config/constants.js` | Defines CPU behavior constants referenced by both NPC and free-play CPU code. |

## The teaching NPC vs free-play CPU split

These are two separate systems with different tuning goals. They share no code path beyond the pathing helper.

| Dimension | Guided teaching NPC | Free Play CPU |
|---|---|---|
| Goal | Be understandable and stable so students can reason about behavior | Provide a competitive or deliberately chaotic sandbox opponent |
| Files | `npcType1.js`, `npcType2.js` | `freePlayCpu.js` |
| Randomness | None | Intentional in Easy mode; constrained in Tactical mode |
| Determinism | Fully deterministic given a fixed state | Tactical modes are mostly deterministic; Easy is random |
| Test predictability | High — can assert exact outcomes | Easy mode requires `state.randomFn` hook to pin behavior |

## Guided teaching NPCs

**`npcType1.js` — flag chaser:**
- Chases the enemy flag when it is loose on the field.
- Chases the carrier if the enemy flag is already picked up.
- Returns toward its own base approach when it is holding the enemy flag.
- Uses a simple axis-prioritized move heuristic (not `pathing.js`).
- No random branch. Fully deterministic.

**`npcType2.js` — patrol defender:**
- Checks for threats near its own flag home.
- Patrols within a radius around the flag area.
- Uses the shared `pathing.js` helper for one-step movement decisions.
- No random branch. Fully deterministic.

## Free Play CPU behaviors

**`FREE_PLAY_EASY`:**
- Picks from all legal actions at random.
- Uses `state.randomFn` if available (test hook), otherwise `Math.random`.
- Intentionally low-skill and chaotic.

**`GUIDED_STAY_STILL` / `GUIDED_RANDOM_MOVE_ONLY`:**
- Used by authored guided challenge exceptions that need a stationary defender or a movement-only wandering enemy.
- `GUIDED_STAY_STILL` always returns `STAY_STILL`.
- `GUIDED_RANDOM_MOVE_ONLY` picks from legal cardinal movement actions only, using the same `state.randomFn` test hook and the same runner/blocker legality checks used elsewhere in movement translation.
- These behaviors are narrow guided exceptions, not a change to Free Play Easy.

**`GUIDED_VERTICAL_PATROL`:**
- Used by authored guided challenge exceptions that need a readable up/down defender lane without chase AI.
- Patrol direction is stored on the runner itself as runner-local state and defaults to upward movement when unset.
- The behavior moves vertically until blocked, then reverses, and stays still only when both vertical directions are blocked.
- It is deterministic and not exposed through the Free Play UI.

**`GUIDED_GUARD`** (Plan 99, charter S2 / Appendix A — the Guard archetype):
- Stands at a post. If a player-team runner (any runner on a different team from the Guard) comes within its aggro radius K, the Guard steps toward the nearest one; once nothing is in range, it steps back to its post; on post with nothing in range, it stays still.
- **Post:** defaults to the runner's spawn cell (`initialGridX`/`initialGridY`, captured automatically by team setup). Since Plan 92, an authored `guardPost: {x, y}` on a runner's level-config entry is copied onto the runner by `applyRunnerSetup()` in `src/core/setup.js` and overrides the default; a level that doesn't set it keeps the spawn-cell post.
- **Radius:** defaults to `GUIDED_GUARD_DEFAULT_RADIUS` (3, Manhattan distance). Since Plan 92, an authored `guardRadius` on a runner's level-config entry is wired through the same `applyRunnerSetup()` path and overrides the default (e.g. `enemy-nearby` authors `guardRadius: 1`).
- **Determinism:** "nearest" ties break by ascending runner id (`localeCompare`), matching the tie-break convention already used by `getClosestEnemyTarget` in `src/core/movement.js`. No randomness anywhere in the behavior.
- Reuses `calculateMoveTowardsTarget` from `pathing.js` for every step, both chasing and returning to post — no second pathing routine. `calculateMoveTowardsTarget` already returns `STAY_STILL` when boxed in on all sides, so a cornered Guard degrades to standing still rather than throwing.
- Produces a move decision only. Capture, collision, and freeze consequences are decided entirely by the existing turn-engine collision resolution (`src/core/collisions.js`) — the Guard behavior function never touches runner health/frozen state directly.
- Frozen-turn handling is inherited from the general turn engine: a frozen Guard's behavior function is never consulted, exactly like every other `cpuBehavior`.
- Not exposed through the Free Play UI — a guided-only archetype, like `GUIDED_STAY_STILL`/`GUIDED_RANDOM_MOVE_ONLY`/`GUIDED_VERTICAL_PATROL`.

**`GUIDED_CHARGER`** (Plan 101, charter S2 / Appendix A — the Charger archetype):
- Stands still until a player-team runner (any runner on a different team from the Charger) shares its row or column, then commits to a straight-line charge down that line, one cell per turn, until a wall, barrier, or board edge stops it.
- **Idle:** while nothing is aligned (or nothing is aligned within `chargeRange`, if authored), returns `STAY_STILL` and holds no committed direction (`runner.chargeDirection` is `null`).
- **Trigger and commit:** on the turn a player-team runner is found on the Charger's row or column, the axis and direction are fixed immediately, pointing along that line toward the triggering runner's cell at that instant, and stored on the runner as `chargeDirection: { dx, dy }` (a unit vector, mirroring how `guidedVerticalPatrolDirection` stores the Sentry's direction). **Tie-break** when more than one runner qualifies: row alignment beats column alignment; within the same axis, nearer along the line wins; remaining ties break by ascending runner id (`localeCompare`). No randomness.
- **Charge:** once `chargeDirection` is set, every subsequent call steps one cell in that direction *regardless of whether the triggering runner is still aligned* — the Charger does not re-path or re-target mid-charge. This commit-to-the-line behavior is the point: the counterplay is judging the lane and jumping clear of it before the charge starts, not out-running it after.
- **Stop:** when the next cell in the committed direction is blocked (`isCellBlockedForRunner` — wall, barrier, or board edge), the Charger clears `chargeDirection` back to `null` and returns `STAY_STILL` that same turn, without attempting the blocked step. It does **not** return to a post (unlike the Guard) — it simply resumes idle from wherever it stopped and may trigger a fresh charge later.
- **Optional `chargeRange`:** an authored per-runner Manhattan/along-line trigger distance, wired through `applyRunnerSetup()` in `src/core/setup.js` the same way `guardPost`/`guardRadius` are. Absent means unbounded — any same-row/same-column alignment triggers regardless of distance. This is the deliberate default; a level author who needs a shorter fuse sets `chargeRange` explicitly rather than the default changing.
- Reuses only `isCellBlockedForRunner` from `src/core/movement.js` — no pathing call. The Charger does not path; it charges in a fixed line, so `calculateMoveTowardsTarget`'s dominant-axis/fallback logic does not apply and is not used here.
- Produces a move decision only (`{ actionType: "MOVE", dx, dy }`, the same generic delta shape `calculateMoveTowardsTarget` returns). Capture, collision, and freeze consequences are decided entirely by the existing turn-engine collision resolution — the Charger behavior function never touches runner health/frozen state directly.
- **Frozen-mid-charge:** a frozen Charger's behavior function is never consulted (same general rule as every `cpuBehavior`), and freezing does not touch `chargeDirection`. A charge in progress simply pauses and resumes the same committed direction on thaw — there is no special-case code for this; it falls out of the behavior function not running while frozen.
- `chargeDirection` is reset to `null` in both the `Runner` constructor and `resetToInitial()` (`src/entities/Runner.js`), the same two places `guidedVerticalPatrolDirection` is reset, so a round reset never leaves a stale committed charge pointing at a now-irrelevant line.
- Not exposed through the Free Play UI — a guided-only archetype, like the rest of this table.

### Bestiary mapping (charter S2, Plan 99 / Plan 101)

Appendix A of the campaign rewrite charter (`docs/development/plan-85-campaign-rewrite-charter.md`) names archetypes; archetype *rules* are the contract, archetype *names* are owner-taste and may be renamed before Plan 92's copy lands. This table is the source of truth for which archetype maps to which behavior constant and whether it exists yet:

| Archetype | Behavior constant | Status |
|---|---|---|
| Dummy | `GUIDED_STAY_STILL` | Implemented (existing) |
| Sentry | `GUIDED_VERTICAL_PATROL` | Implemented (existing); authored-route generalization beyond the vertical lane is deferred |
| Wanderer | `GUIDED_RANDOM_MOVE_ONLY` | Implemented (existing); zone-bounding is deferred |
| Guard | `GUIDED_GUARD` | Implemented (Plan 99) |
| Charger | `GUIDED_CHARGER` | Implemented (Plan 101) |
| Raider | — | Deferred, no constant yet (targeted for the Team Strategy Script defense levels) |
| Shadow | — | Deferred, no constant yet; gated on the Plan 97 prediction/inversion prototype |

Guard (Plan 99) and Charger (Plan 101) are the only new archetypes so far. Do not describe Raider or Shadow as implemented — they have no behavior constant, dispatch case, or implementation in `src/ai/npc/` yet.

**`FREE_PLAY_TACTICAL_ATTACKER`:**
- Chases the enemy flag or returns home when carrying it.
- Uses the shared `pathing.js` helper.
- Mostly deterministic once the state is fixed.
The full decision order for `FREE_PLAY_TACTICAL_ATTACKER` is:
1. **Rut escape (Plan 70):** If `hasRunnerBeenStuckForTurns(runner, 4)`, pick a legal cardinal move whose destination avoids the recent position set.
2. **Blocked-scoring recovery (Plan 69):** If carrying the enemy flag but own flag is away, chase the runner holding the own flag; use Area Freeze if they are in range.
3. **Carrier freeze (Plan 71):** If carrying the enemy flag, freeze is ready, and the nearest unfrozen enemy is within `AREA_FREEZE_RADIUS`, fire freeze.
4. **Jump if useful (Plan 71):** If `canJump` is true, the jump landing is legal, and jumping reduces Manhattan distance to the current target, choose `JUMP_FORWARD`.
5. **Normal pathing:** `calculateMoveTowardsTarget` toward the current target.
6. **Barrier-blocked stay-still:** If forward cell has a barrier and pathing returned `STAY_STILL`, stay still.
7. **Random fallback:** `getRandomLegalFallbackMove` biased toward target.

**`FREE_PLAY_TACTICAL_DEFENDER`:**
- Protects the home side, freezes nearby threats, repositions near a defense cell.
- Uses the shared `pathing.js` helper.
- Mostly deterministic once the state is fixed.
- **Rut escape (Plan 70):** Checked first. Same `hasRunnerBeenStuckForTurns(runner, 4)` guard as the attacker. Calls `getRutEscapeAction` when stuck; returns to normal defender logic once the condition clears. No Plan 71 changes to the defender — existing freeze-near-carrier and barrier-at-defense-cell behavior is preserved.

Role assignment (attacker vs defender) is derived from the free-play mode during team setup, not at runtime decision time.

## Shared pathing helper

`src/ai/npc/pathing.js` is a deterministic one-step move-toward heuristic. It is not a pathfinding algorithm.

Algorithm:
1. Choose the dominant axis toward the target (horizontal or vertical, whichever has greater delta).
2. Try the preferred move.
3. If blocked, try the orthogonal move.
4. If both are blocked, stay still.

This helper is used by `npcType2.js` and both tactical free-play CPU behaviors. Its simplicity is intentional: it is predictable enough for tests and pedagogically transparent for students watching guided levels.

## CPU wiring through team setup

The active CPU behavior for a runner is not chosen at decision time. It is assigned during team setup:

- `src/core/teams.js` attaches `cpuBehavior` and `cpuRole` to each CPU runner slot.
- Tactical Free Play derives `cpuRole` (attacker / defender) from the active free-play mode when the match is configured.
- The turn engine calls the appropriate behavior function based on the runner's `cpuBehavior` value.

Changing the free-play mode in the UI triggers a new team setup, which re-assigns `cpuBehavior` and `cpuRole`.

## `state.randomFn` test hook

`state.randomFn` is an optional hook that the free-play CPU Easy behavior uses instead of `Math.random` when present. In tests, inject a deterministic function here to produce repeatable outcomes from the Easy CPU:

```js
app.state.randomFn = () => 0; // always picks the first legal action
```

This hook exists specifically because `FREE_PLAY_EASY` is designed to be random in production but must be testable. The guided NPC behaviors do not use it because they have no random branch.
`GUIDED_RANDOM_MOVE_ONLY` also uses `state.randomFn` so tests can pin the wandering enemy to representative legal steps.

## Common traps

- **Changing guided NPC behavior when the intent is to change free-play difficulty.** They are separate files; edits to `npcType1.js` do not affect `freePlayCpu.js` or vice versa.
- **Assuming `pathing.js` is a full pathfinder.** It is a one-step heuristic with obstacle fallback. It does not plan multi-step routes.
- **Assuming `FREE_PLAY_EASY` is deterministic.** It is intentionally random. Pin `state.randomFn` in tests.
- **Expecting CPU role to be chosen per-turn.** Roles are assigned at setup time via team configuration.
- **Adding randomness to guided NPC behaviors.** Guided NPCs are teaching aids; unpredictable behavior makes levels harder to reason about and harder to test.
- **Confusing guided challenge exceptions with Free Play Easy.** `FREE_PLAY_EASY` still means broad random legal action choice in Free Play. Level-specific guided behaviors should be named and documented separately.
- **Expecting the tactical attacker to stall at base when scoring is blocked.** Since Plan 69, the attacker switches to chasing the enemy runner who holds its own team's flag rather than looping at the scoring cell. This is Free Play behavior only — guided NPCs are unaffected.
- **Expecting the tactical attacker to always move before considering jump or freeze.** Since Plan 71, jump and carrier freeze are checked before the normal pathing step. Jump fires only when landing reduces distance to target; carrier freeze fires only when an unfrozen enemy is within `AREA_FREEZE_RADIUS` and freeze is ready.
- **Assuming rut detection is a global-turn counter.** The rut check uses `hasRunnerBeenStuckForTurns` from `src/core/recentMovement.js`, which reads the runner's own `recentEndPositions` history. It is independent of global turn numbers and resets automatically when the runner moves out of the stuck area.
- **Assuming bestiary names in the charter are already implemented.** Only Dummy, Sentry, Wanderer, Guard, and Charger have behavior constants. Raider and Shadow are deferred — see the bestiary mapping table above before assuming a level can use one.
- **Assuming every Guard uses the default radius/post.** Since Plan 92, `applyRunnerSetup()` in `src/core/setup.js` copies an authored `guardPost`/`guardRadius` from a runner's level-config entry onto the runner. `enemy-nearby` authors `guardRadius: 1` specifically so its reference solution's zigzag detour never enters the Guard's aggro range — check the level source before assuming `GUIDED_GUARD_DEFAULT_RADIUS` (3) applies.
- **Expecting the Charger to re-target mid-charge.** Once triggered, it commits to the line fixed at trigger time and ignores everything else — including the runner that triggered it moving away, and including a *different* runner entering the line partway through. It only re-evaluates once stopped (blocked) and idle again.
- **Expecting a stopped Charger to return to its spawn cell.** Unlike the Guard, the Charger has no post concept. It halts exactly where the blocked step would have landed and stays there, idle, until something re-triggers it from that position.
- **Assuming `chargeRange` defaults to something bounded.** It defaults to unbounded (any same-row/column alignment triggers, regardless of distance) unless a level explicitly authors `chargeRange` on the runner spec.

## Related

- [turn-engine.md](./turn-engine.md) — how the chosen CPU action is resolved by the engine
- [ui-mode-contract.md](./ui-mode-contract.md) — free-play mode selection that drives CPU role assignment
