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
| `src/ai/npc/freePlayCpu.js` | Free Play CPU strategies: `FREE_PLAY_EASY` (random), `FREE_PLAY_TACTICAL_ATTACKER`, `FREE_PLAY_TACTICAL_DEFENDER`. |
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

**`FREE_PLAY_TACTICAL_ATTACKER`:**
- Chases the enemy flag or returns home when carrying it.
- Uses the shared `pathing.js` helper.
- Mostly deterministic once the state is fixed.

**`FREE_PLAY_TACTICAL_DEFENDER`:**
- Protects the home side, freezes nearby threats, repositions near a defense cell.
- Uses the shared `pathing.js` helper.
- Mostly deterministic once the state is fixed.

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

## Common traps

- **Changing guided NPC behavior when the intent is to change free-play difficulty.** They are separate files; edits to `npcType1.js` do not affect `freePlayCpu.js` or vice versa.
- **Assuming `pathing.js` is a full pathfinder.** It is a one-step heuristic with obstacle fallback. It does not plan multi-step routes.
- **Assuming `FREE_PLAY_EASY` is deterministic.** It is intentionally random. Pin `state.randomFn` in tests.
- **Expecting CPU role to be chosen per-turn.** Roles are assigned at setup time via team configuration.
- **Adding randomness to guided NPC behaviors.** Guided NPCs are teaching aids; unpredictable behavior makes levels harder to reason about and harder to test.

## Related

- [turn-engine.md](./turn-engine.md) — how the chosen CPU action is resolved by the engine
- [ui-mode-contract.md](./ui-mode-contract.md) — free-play mode selection that drives CPU role assignment
