# Progress Report — Plan 70: Free Play Tactical CPU Rut Escape

- Packet id: Plan 70
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on Plan 65 (recent movement state), Plan 69 (tactical attacker structure)

---

## Summary

Free Play Tactical Attacker and Tactical Defender now detect local ruts using the existing `hasRunnerBeenStuckForTurns` function from Plan 65 and temporarily choose escape movement when stuck. A stuck runner prefers cardinal moves whose destination is not in its recent position set; once it leaves the stuck area the condition clears automatically and normal role behavior resumes. No guided NPC behavior was changed. 375/375 unit tests pass. Build passes. Lint warnings are all pre-existing.

---

## Design Decisions

### Rut detection threshold

`RUT_THRESHOLD_TURNS = 4` — matches the plan's suggested default. `hasRunnerBeenStuckForTurns(runner, 4)` returns true when the last 4 recorded end-of-turn positions are all within Manhattan distance 2 of the oldest of those positions (the definition provided by `recentMovement.js`).

### Escape duration

No explicit escape-duration counter is needed. The rut check fires on every decision turn. Once the runner successfully moves outside its recent position cluster, `hasRunnerBeenStuckForTurns` returns false on the next decision and normal role behavior resumes. Two or three escape moves are typically enough to exit the stuck radius and clear the condition.

### Escape action preference

`getRutEscapeAction` partitions legal cardinal moves into:
1. **Escape candidates** — moves whose target cell is not in `recentEndPositions` (avoids immediately revisiting a recent cell).
2. **Any legal move** — fallback when all legal moves would revisit a recent cell.
3. `STAY_STILL` — only if no legal movement exists at all.

Random tie-breaking within each pool uses `state.randomFn`, making the behavior testable under a pinned function.

### Priority relative to blocked-scoring response (Plan 69)

The rut check fires first in `getAttackerAction`. A stuck attacker in blocked-scoring mode also benefits from escape rather than thrashing against the same pathing obstacle. Once unstuck, the normal blocked-scoring or return-to-base logic resumes.

### Special abilities

Jump, barrier placement, and freeze are not chosen during rut escape — only cardinal movement. Special-ability integration is deferred to Plan 71 per the packet's explicit scope.

---

## Changes Made

### `src/ai/npc/freePlayCpu.js`

**Added import:**
```js
import { hasRunnerBeenStuckForTurns } from "../../core/recentMovement.js";
```

**Added module-level constant:**
```js
const RUT_THRESHOLD_TURNS = 4;
```

**Added `getRutEscapeAction(runner, state)` function** (before `getBlockedCarrierAction`):
- Reads `runner.recentMovementState?.recentEndPositions` into a `Set` of `"x,y"` strings.
- Calls `getLegalMovementCandidates` + `translateActionDecision` to get all legal cardinal moves with target cells.
- Filters for escape candidates (target not in recent set).
- Picks from escape candidates first; falls back to all candidates; falls back to `STAY_STILL`.
- Uses `getRandomFn(state)` for tie-breaking.

**Modified `getAttackerAction`** — added rut check at the top (before blocked-scoring check):
```js
if (hasRunnerBeenStuckForTurns(runner, RUT_THRESHOLD_TURNS)) {
  return getRutEscapeAction(runner, state);
}
```

**Modified `getDefenderAction`** — added rut check at the top (before enemy-carrier pursuit):
```js
if (hasRunnerBeenStuckForTurns(runner, RUT_THRESHOLD_TURNS)) {
  return getRutEscapeAction(runner, state);
}
```

### `docs/subsystems/npc-and-cpu.md`

- **`FREE_PLAY_TACTICAL_ATTACKER` section:** added "Rut escape (Plan 70)" bullet describing the threshold, action preference order, and automatic recovery.
- **`FREE_PLAY_TACTICAL_DEFENDER` section:** added matching "Rut escape (Plan 70)" bullet.
- **Common traps:** added a trap about assuming rut detection is a global-turn counter.

---

## New Tests (`tests/unit/free-play-contracts.test.js`, 4 new tests)

A `makeStuckMovementState(anchorX, anchorY, count)` helper is defined at the top of the test file to build a synthetic `recentMovementState` with the runner oscillating between `(anchorX, anchorY)` and `(anchorX+1, anchorY)` for `count` turns.

| Test | Asserts |
|---|---|
| "tactical attacker in a rut chooses a legal escape move instead of repeating the stuck path" | `decision.actionType` is a cardinal move AND target is not in `{(5,4),(6,4)}` |
| "tactical defender in a rut chooses a legal escape move" | Same shape — confirms defender rut path fires |
| "rut escape prefers a move whose destination is outside the recent local area" | Runner at (2,2) oscillating with (2,3); confirms chosen target is neither (2,2) nor (2,3) |
| "tactical attacker with fewer than threshold recent positions uses normal role behavior" | Only 2 recent positions — stuck check returns false; decision is `"MOVE"` (normal return-to-base pathing) |

All four tests use `randomFn = () => 0` to pin the first escape candidate.

---

## No Changes Made To

- Guided NPC source (`npcType1.js`, `npcType2.js`)
- `src/core/recentMovement.js` — consumed read-only
- Guided level configs or fixtures
- Easy CPU behavior
- Scoring, collision, or movement legality
- Any test fixture or reference solution

---

## Validation Results

| Suite | Result |
|---|---|
| Focused: `free-play-contracts.test.js` | **14 / 14 pass** |
| Full `npm test` | **375 / 375 pass** |
| `npm run build` | **Pass** — pre-existing chunk-size warnings only |

---

## Validation Checklist

- [x] Free Play Tactical CPU rut detection uses existing recent movement state (`hasRunnerBeenStuckForTurns`)
- [x] Tactical Attacker rut escape is covered
- [x] Tactical Defender rut escape is covered
- [x] Easy CPU behavior is unchanged
- [x] Guided NPC behavior is unchanged
- [x] Random tie-breaks are pinned by `state.randomFn` in tests
- [x] `docs/subsystems/npc-and-cpu.md` matches runtime behavior
- [x] `npm test` passes (375/375)
- [x] `npm run build` passes
- [x] No unrelated files were changed

---

## Stop Conditions Assessment

No stop conditions were triggered:
- No full pathfinding needed — the one-step heuristic and recent-position avoidance are sufficient.
- No broad persistent route memory needed — `recentEndPositions` is already maintained by `recentMovement.js`.
- No guided NPC changes made.
- No special-ability selection added (deferred to Plan 71).
- Tactical attacker and defender role expectations are preserved — escape is a temporary override that resolves automatically.

Plan 70 is complete and ready for integration alongside Plans 67, 68, and 69.
