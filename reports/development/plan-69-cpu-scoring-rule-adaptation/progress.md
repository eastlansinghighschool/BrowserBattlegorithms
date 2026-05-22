# Progress Report — Plan 69: CPU Scoring-Rule Adaptation

- Packet id: Plan 69
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on Plan 67, Plan 68

---

## Summary

Free Play Tactical Attacker CPU now responds sensibly when it is holding the enemy flag but cannot score because its own team's flag is away. Instead of looping at base indefinitely, the blocked carrier identifies the enemy runner carrying its own flag and pursues them — using Area Freeze if in range, pathing toward them otherwise, and falling back to a random legal movement if the flag is dropped mid-field. No guided NPC behavior was changed. 371/371 unit tests pass. Build passes. Lint warnings are all pre-existing.

---

## CPU Behavior Audit

### Tactical Attacker (`FREE_PLAY_TACTICAL_ATTACKER`) — before Plan 69

When `runner.hasEnemyFlag === true`:
- `resolveMoveTowardTarget` resolves `MY_BASE` to the team's flag home cell.
- `calculateMoveTowardsTarget` paths toward that cell.
- If `preferred.actionType === STAY_STILL` (runner is already at or adjacent to base), falls through to `getRandomLegalFallbackMove(runner, state, moveTarget)`.

**Problem under Plan 67:** If the runner reached base but `state.gameFlags[runner.team].isAtBase === false`, scoring is blocked. The runner has no path left (already at base), `calculateMoveTowardsTarget` returns `STAY_STILL`, and it cycles through `getRandomLegalFallbackMove` with `moveTarget = base cell` every turn. From the student's perspective this looks like a CPU that just sits in base doing nothing useful.

### Tactical Defender (`FREE_PLAY_TACTICAL_DEFENDER`) — no change needed

The defender already:
1. Chases any enemy runner holding its team's own flag (`getEnemyFlagCarrier`).
2. Uses Area Freeze if that carrier is in range.
3. Falls back to patrolling the midfield defense cell.

This behavior recovers the own flag without Plan 69 touching it. No changes made.

### Easy CPU (`FREE_PLAY_EASY`) — no change needed

Fully random legal-action selection. No scoring awareness needed. No changes made.

### Guided NPCs (`npcType1.js`, `npcType2.js`) — no change needed

Guided NPCs are deterministic teaching aids. Their behavior is fixed by level design. No changes made.

---

## Changes Made

### `src/ai/npc/freePlayCpu.js`

**Added `getOwnFlagCarrier(state, teamId)` helper** (after `getEnemyFlagCarrier`):

```js
function getOwnFlagCarrier(state, teamId) {
  const ownFlag = state.gameFlags?.[teamId];
  if (!ownFlag || !ownFlag.carriedByRunnerId) return null;
  return state.allRunners.find((r) => r.id === ownFlag.carriedByRunnerId) || null;
}
```

Null-safe via optional chaining on `state.gameFlags?.[teamId]`. Returns `null` if the flag is at base, dropped, or the runner is not found.

**Added `getBlockedCarrierAction(runner, state)` function** (before `getAttackerAction`):

1. Looks up the enemy runner holding the team's own flag via `getOwnFlagCarrier`.
2. If found: uses Area Freeze if the carrier is within `AREA_FREEZE_RADIUS` and freeze is ready; otherwise paths toward the carrier via `calculateMoveTowardsTarget`.
3. If not found (flag dropped mid-field) or pathing returns `STAY_STILL`: falls back to `getRandomLegalFallbackMove(runner, state, null)`.
4. The runner never voluntarily drops the enemy flag — `hasEnemyFlag` is read-only here.

**Modified `getAttackerAction`** — added early return at the top:

```js
if (runner.hasEnemyFlag && !(state.gameFlags?.[runner.team]?.isAtBase)) {
  return getBlockedCarrierAction(runner, state);
}
```

When the attacker is NOT blocked (own flag is home), the function falls through to the existing return-to-base path unchanged.

### `docs/subsystems/npc-and-cpu.md`

- **`FREE_PLAY_TACTICAL_ATTACKER` section:** added a "Blocked-scoring response (Plan 69)" bullet describing the four-step recovery logic.
- **Common traps:** added a trap entry noting that since Plan 69 the attacker chases the own-flag carrier rather than stalling at base.

---

## New Tests (`tests/unit/free-play-contracts.test.js`, 4 new tests)

| Test | Asserts |
|---|---|
| "tactical attacker with enemy flag returns toward base when own flag is home" | `decision.actionType === "MOVE"` and `decision.dx > 0` (regression guard — normal path unaffected) |
| "tactical attacker moves toward enemy runner holding own flag when scoring is blocked" | `decision.actionType === "MOVE"`, `decision.dx === -1` (paths left toward carrier at lower X) |
| "tactical attacker uses area freeze when own flag carrier is within range and scoring is blocked" | `decision.actionType === AI_ACTION_TYPES.FREEZE_OPPONENTS` |
| "tactical attacker falls back to random legal move when own flag is dropped (not carried) and scoring is blocked" | `decision.actionType` is one of the four legal movement types (randomFn pinned to `() => 0`) |

All four tests use the `buildMatch()` fixture (Team 2 = CPU, playDirection -1, home on right). Freeze and pathing assertions use deterministic state.

---

## No Changes Made To

- Guided NPC source (`npcType1.js`, `npcType2.js`)
- Guided level configs
- Scoring logic
- Easy CPU behavior
- Tactical Defender behavior
- Any test fixture or reference solution
- Turn engine
- Game specification

---

## Validation Results

| Suite | Result |
|---|---|
| Focused: free-play-contracts + scoring-and-level-state | **32 / 32 pass** |
| Full `npm test` | **371 / 371 pass** |
| `npm run build` | **Pass** — pre-existing chunk-size warnings only |

---

## Validation Checklist

- [x] Tactical carrier blocked-scoring state is tested
- [x] Tactical carrier no longer stalls indefinitely in the tested blocked-scoring case
- [x] Tactical attacker still behaves normally when scoring is possible (regression guard passes)
- [x] Tactical defender behavior is preserved (no changes; existing tests pass)
- [x] Easy CPU behavior is unchanged
- [x] `state.randomFn` pins randomness in the dropped-flag fallback test
- [x] `docs/subsystems/npc-and-cpu.md` matches runtime behavior
- [x] `npm test` passes (371/371)
- [x] `npm run build` passes
- [x] No guided level source was changed
- [x] No unrelated files were changed

---

## Stop Conditions Assessment

No stop conditions were triggered:
- No full pathfinding was needed — the one-step `calculateMoveTowardsTarget` heuristic is sufficient.
- No new difficulty mode was added.
- No guided NPC behavior was changed.
- No new persistent CPU strategy state was needed — `getOwnFlagCarrier` reads existing flag state.
- The change is tightly scoped to blocked-scoring recovery, not general anti-rut behavior.

Plan 69 is complete and ready for integration alongside Plans 67 and 68.
