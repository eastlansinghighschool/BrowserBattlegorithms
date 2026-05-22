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
| `src/ai/npc/freePlayCpu.js` | Free Play CPU strategies plus authored guided exceptions: `FREE_PLAY_EASY` (random), `FREE_PLAY_TACTICAL_ATTACKER`, `FREE_PLAY_TACTICAL_DEFENDER`, `GUIDED_STAY_STILL`, `GUIDED_RANDOM_MOVE_ONLY`, `GUIDED_VERTICAL_PATROL`. |
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

## Related

- [turn-engine.md](./turn-engine.md) — how the chosen CPU action is resolved by the engine
- [ui-mode-contract.md](./ui-mode-contract.md) — free-play mode selection that drives CPU role assignment
