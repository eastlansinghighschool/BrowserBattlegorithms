# Progress Report — Plan 71: Tactical CPU Special Ability Polish

- Packet id: Plan 71
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on existing tactical CPU behavior (Plans 69, 70)

---

## Summary

Free Play Tactical Attacker now uses Jump Forward when it reduces distance to the current target, and fires Area Freeze when carrying the enemy flag and an unfrozen enemy is within freeze radius. Tactical Defender existing special-ability behavior is preserved unchanged. 380/380 unit tests pass. Build passes. Lint warnings are all pre-existing.

---

## Changes Made

### `src/ai/npc/freePlayCpu.js`

**Added `getNearestUnfrozenEnemy(runner, state)` helper** (before `getNearestEnemyOnMySide`):
- Filters enemy runners by `!candidate.isFrozen`, sorts by ascending Manhattan distance, breaks ties by `id.localeCompare`.
- Used by the carrier freeze check to find the closest active threat regardless of map side.

**Refactored `getAttackerAction`** — extracted target coordinates (`targetX`, `targetY`) as named variables shared by the jump check and pathing call, then inserted two new decision steps:

**Step 3 — Carrier freeze:**
```js
if (runner.hasEnemyFlag && isAreaFreezeReady(state, runner.team)) {
  const threat = getNearestUnfrozenEnemy(runner, state);
  if (threat) {
    const dist = Math.abs(threat.gridX - runner.gridX) + Math.abs(threat.gridY - runner.gridY);
    if (dist <= AREA_FREEZE_RADIUS) {
      return { actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS };
    }
  }
}
```
- Only fires when `hasEnemyFlag === true` (returning home).
- Only fires when `isAreaFreezeReady` confirms the cooldown has elapsed.
- Does not change freeze duration, radius, or cooldown rules.

**Step 5 — Jump if useful:**
```js
if (runner.canJump) {
  const jumpCell = getForwardCell(runner, 2);
  if (!isCellBlockedForRunner(jumpCell.x, jumpCell.y, ...)) {
    const distCurrent = Math.abs(targetX - runner.gridX) + Math.abs(targetY - runner.gridY);
    const distAfterJump = Math.abs(targetX - jumpCell.x) + Math.abs(targetY - jumpCell.y);
    if (distAfterJump < distCurrent) {
      return { actionType: AI_ACTION_TYPES.JUMP_FORWARD };
    }
  }
}
```
- Guards: `runner.canJump`, legal landing cell, and strict improvement in distance.
- Jump is not chosen when returning home with the enemy flag and the jump goes the wrong direction (as expected — `distAfterJump > distCurrent` for that case).

**Full decision order** (for reference):

| Priority | Condition | Action |
|---|---|---|
| 1 | Rut detected (Plan 70) | `getRutEscapeAction` |
| 2 | Carrying flag, own flag away (Plan 69) | `getBlockedCarrierAction` |
| 3 | Carrying flag, threat in freeze range (Plan 71) | `FREEZE_OPPONENTS` |
| 4 | Jump available, useful, legal (Plan 71) | `JUMP_FORWARD` |
| 5 | Normal pathing | `calculateMoveTowardsTarget` |
| 6 | Forward barrier + pathing STAY_STILL | `STAY_STILL` |
| 7 | Fallback | `getRandomLegalFallbackMove` |

No changes to `getDefenderAction`.

### `docs/subsystems/npc-and-cpu.md`

- **`FREE_PLAY_TACTICAL_ATTACKER` section:** replaced the two separate bullet points with a numbered decision-order table documenting all seven steps (Plans 69, 70, and 71 in context).
- **`FREE_PLAY_TACTICAL_DEFENDER` section:** noted that Plan 71 made no defender changes and existing behavior is preserved.
- **Common traps:** added a trap noting that jump and carrier freeze are checked before the normal pathing step.

---

## New Tests (`tests/unit/free-play-contracts.test.js`, 5 new tests)

| Test | Asserts |
|---|---|
| "tactical attacker chooses Jump Forward when legal and it reduces distance to target" | `decision.actionType === AI_ACTION_TYPES.JUMP_FORWARD` — attacker at (8,4) going to flag at (1,4), jump to (6,4) reduces dist from 7 to 5 |
| "tactical attacker does not choose Jump Forward when jump would not reduce distance to target" | `decision.actionType !== JUMP_FORWARD` — carrier at (5,4) going home right; jump goes left (further) → `"MOVE"` with `dx > 0` |
| "tactical carrier freezes nearest unfrozen enemy when in range and freeze is ready" | `decision.actionType === FREEZE_OPPONENTS` — enemy at distance 2 = AREA_FREEZE_RADIUS |
| "tactical carrier does not freeze when the nearest enemy is outside freeze radius" | `decision.actionType !== FREEZE_OPPONENTS` — all enemies at distance 5 |
| "tactical carrier does not freeze when freeze is on cooldown" | `decision.actionType !== FREEZE_OPPONENTS` — cooldown turn 100, current turn 1 |

Also updated the existing "tactical attacker with fewer than threshold recent positions" test to set `canJump = false` and `hasEnemyFlag = true`, isolating the rut-escape assertion from jump behavior — the jump previously fired legitimately (going to fetch the enemy flag is improved by jumping left), so the test needed a clean pin.

---

## No Changes Made To

- `getDefenderAction`
- Guided NPC source (`npcType1.js`, `npcType2.js`)
- Guided level configs or fixtures
- Easy CPU behavior
- `src/core/areaFreeze.js` — consumed read-only
- Area Freeze cooldown, radius, or duration rules
- Jump Forward landing legality rules

---

## Validation Results

| Suite | Result |
|---|---|
| Focused: `free-play-contracts.test.js` | **19 / 19 pass** |
| Full `npm test` | **380 / 380 pass** |
| `npm run build` | **Pass** — pre-existing chunk-size warnings only |

---

## Validation Checklist

- [x] Tactical Attacker uses Jump Forward only when legal and useful
- [x] Tactical carrier uses Area Freeze only when ready and relevant
- [x] Tactical Defender behavior is preserved (no changes; existing tests pass)
- [x] Easy CPU behavior is unchanged
- [x] Core special ability rules are unchanged
- [x] `docs/subsystems/npc-and-cpu.md` matches runtime behavior
- [x] `npm test` passes (380/380)
- [x] `npm run build` passes
- [x] No unrelated files were changed

---

## Stop Conditions Assessment

No stop conditions were triggered:
- No pathfinding was needed — distance comparison is purely local.
- No barrier strategy redesign required.
- Tactical CPU is not excessively strengthened — jump fires only when directionally useful, and carrier freeze requires proximity.
- No new UI explanation or rule changes.
- No guided levels affected.

Plan 71 is complete and ready for integration alongside Plans 67–70.
