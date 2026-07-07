# Plan 78 Progress Report: Frozen Input And Flag-Home Reconciliation

- Packet: Plan 78
- Date: 2026-07-07
- Implementer: Claude Sonnet 5

## Summary of Work Completed

Repaired three student-reported runtime bugs, matching the packet's investigation summary exactly:

1. **Frozen human input halt** — a frozen active human runner could still queue movement/jump/barrier/freeze/stay-still input, which could leave the turn engine stuck in `ANIMATING` with no active animation flags.
2. **Collision winner occupying own at-base flag cell** — a collision snap could place the winning runner directly onto their own team's just-reset loose home-flag cell, an illegal state normal movement already forbids, creating a permanent unbeatable blocker for future enemy collisions on that cell.
3. **Reset flag landing under a waiting opposing runner without pickup** — a flag reset by `resolveCollision()` could land under a stationary opposing runner without promoting that runner to carrier, requiring a confusing move-away-and-return workaround.

## Root Causes And Fixes

### 1. Frozen Human Input Guard

`handlePlayerInput()` in `src/core/turnEngine.js` did not check `runner.isFrozen`. A frozen human runner passed all five other guard conditions (`isMoving`/`isBouncing` are both cleared to `false` by `setFrozen()`), so a queued movement action could reach `executeQueuedAction()`. There, `startMoveAnimation()`/`startJumpAnimation()` correctly refused to start (both already guarded on `isFrozen`), but the caller unconditionally set `actionResolvedAndAnimating = true` afterward, moving the engine into `ANIMATING` with no runner actually animating — a state `processTurnActions()` could never exit.

**Fix:** Added `runner.isFrozen` to the `handlePlayerInput()` early-return guard. A frozen active human's key press is now silently ignored; the runner continues to be handled by `handleFrozenRunnerTurn()` as before.

### 2. Animation-Start Failure Guard

`executeQueuedAction()` called `startBounceAnimation()`, `startMoveAnimation()`, and `startJumpAnimation()` at several sites without checking their return values, then unconditionally set `actionResolvedAndAnimating = true`. `startBounceAnimation()` in particular never returned a boolean at all (implicit `undefined` on both its early-return and success paths), so its return value could never have been checked even if the caller had tried.

**Fix:**
- `Runner.startBounceAnimation()` (`src/entities/Runner.js`) now returns `true` on success and `false` when it refuses to start (also added a defensive `isFrozen` check to match the other three `start*Animation` methods, which already guarded on it).
- Every animation-start call site in `executeQueuedAction()` now branches on the actual return value: `actionResolvedAndAnimating = true` only when the animation genuinely started; otherwise `actionCompletedImmediately = true`, so `handleActionCompletion()` still runs and the turn cannot stall.
- The `if (!actionResolvedAndAnimating)` gate guarding the blocked-cell/collision logic was changed to `if (!actionResolvedAndAnimating && !actionCompletedImmediately)` so an immediate-completion outcome from the `!canJump` bounce branch correctly skips the rest of the block.

This is defensive hardening: with fix #1 in place, a frozen runner should never reach `executeQueuedAction()` in normal play, but the guard makes the engine correct even if some other future path manages to call these methods on a runner that can't actually animate.

### 3. Flag-Home Occupancy Reconciliation

`resolveCollision()` in `src/core/collisions.js` resets a lost carried flag to its initial position, then `executeQueuedAction()` separately snaps the winner and loser to their final cells — but nothing reconciled the flag's home cell against whichever runner ended up standing there after both snaps.

**Fix:**
- `resolveCollision()` now returns `resetFlag` (the `Flag` instance that was just reset, or `null`) alongside the existing `winner`/`loser`/`loserCell` fields.
- New module `src/core/flagReconciliation.js` exports `reconcileFlagHomeOccupancy(state, flag)`, called from `executeQueuedAction()` immediately after both collision-outcome snaps, only when `outcome.resetFlag` is set:
  - If the flag is still carried or not at base, it does nothing (never touches a flag mid-carry).
  - If an **opposing** runner (relative to the flag's own team) is standing on the flag's home cell, that runner is promoted to carrier immediately via the existing `checkForFlagPickup()` path — same state changes and `flag.pickedUp` event as ordinary pickup, no duplicated logic.
  - If a **same-team** runner is standing there, it is displaced to the nearest legal cell via a deterministic search: the four cardinal neighbors in the order left, right, up, down, then expanding Manhattan radius outward across the board. Each candidate is checked with the same `isCellBlockedForRunner()` legality helper used for normal movement, plus a runner-occupancy check. If no legal cell exists anywhere on the board (should not occur on any authored map given board size and the one-barrier-per-runner rule), the helper throws rather than silently leaving the illegal overlap or teleporting arbitrarily — matching the packet's "stop and report rather than inventing a broad fallback" instruction.
- `snapRunnerToCell()` moved from a private function in `src/core/turnEngine.js` to an exported helper in `src/core/movement.js` so both `turnEngine.js` and the new `flagReconciliation.js` module can share it without a circular import.

Reconciliation is scoped exclusively to the collision flag-reset path. It is not called from `resetRound()`, so ordinary scoring round resets are unaffected.

## Files Changed

| File | Change |
| --- | --- |
| `src/core/turnEngine.js` | Added `isFrozen` guard to `handlePlayerInput()`; hardened all animation-start call sites in `executeQueuedAction()`; removed local `snapRunnerToCell()` (now imported from `movement.js`); wired in `reconcileFlagHomeOccupancy()` after collision snaps; removed now-unused `CELL_SIZE` import. |
| `src/core/movement.js` | Added exported `snapRunnerToCell()` (moved from `turnEngine.js`); added `CELL_SIZE` import. |
| `src/core/collisions.js` | `resolveCollision()` now tracks and returns `resetFlag`. |
| `src/core/flagReconciliation.js` | New module: `reconcileFlagHomeOccupancy()` and the deterministic displacement search. |
| `src/entities/Runner.js` | `startBounceAnimation()` now returns `true`/`false` and guards on `isFrozen`. |
| `tests/unit/turn-engine-resilience.test.js` | Added 3 tests: frozen-human-ignores-input, movement animation-start-failure guard, jump animation-start-failure guard. |
| `tests/unit/movement-and-collisions.test.js` | Added 2 tests: collision-winner-cannot-remain-on-own-flag-cell, reset-flag-under-waiting-opponent-is-picked-up. |
| `docs/subsystems/turn-engine.md` | Added "Frozen human input and animation-start safety (Plan 78)" and "Flag-home occupancy reconciliation (Plan 78)" sections; added `flagReconciliation.js` to the surface map; added two new "Common traps" entries. |
| `docs/development/README.md` | Plan 78 status: `ready` → `complete`. |

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node --test --test-isolation=none tests/unit/turn-engine-resilience.test.js tests/unit/movement-and-collisions.test.js tests/unit/scoring-and-level-state.test.js tests/unit/narration-event-log.test.js` | 61/61 pass |
| `npm test` | 413/413 pass |
| `npm run build` | Pass; same pre-existing chunk-size and dynamic/static Blockly import warnings as prior baseline, no new warnings |

No browser/manual smoke test was run. The three bugs are fully covered by unit tests against the turn engine and collision resolver directly; none of the fixes touch UI or rendering code, so a Playwright run was not required per the packet's guidance.

## Approval Gates Honored

- Collision winner priority rules unchanged — verified by the full existing `movement-and-collisions.test.js` suite passing unmodified (13 pre-existing collision-priority tests, including the map-side-orientation and both-carriers-collide cases).
- Own-flag-home scoring rule unchanged — `scoring-and-level-state.test.js` passes unmodified; reconciliation only fires from the collision flag-reset path, never from `checkForScoring()` or `resetRound()`.
- Flag reset location unchanged — flags still reset to their authored `initialGridX`/`initialGridY` via the existing `resetToInitialPosition()`; reconciliation only decides who occupies that cell afterward, never relocates the flag itself.
- Frozen runners remain non-absent — `handleFrozenRunnerTurn()` is untouched; frozen runners still occupy their cell, consume their turn, and thaw one step per turn exactly as before.
- No UI changes, no guided level source changes, no reference solution changes.

## Design Notes / Deviations From Literal Packet Wording

- The packet's implementation guidance mentioned "possibly a new small `src/core/flagReconciliation.js` helper" — implemented as a new file rather than folding into `collisions.js` or `scoring.js`, since the reconciliation step needs post-snap runner positions that aren't available inside `resolveCollision()` itself (the flag reset happens before winner/loser are snapped to their final cells by the caller). Documented in `docs/subsystems/turn-engine.md` per the packet's instruction.
- `snapRunnerToCell()` was relocated from `turnEngine.js` to `movement.js` (rather than exported in place) to avoid a circular import between `turnEngine.js` and the new `flagReconciliation.js` module, since both need it.

## Remaining Risks Or Follow-Ups

- The "no legal displacement cell" throw path in `flagReconciliation.js` is untested by an explicit unit test (deliberately — constructing a genuinely fully-blocked board on any authored map is not realistic given board size and barrier limits, and the packet's stop condition treats that scenario as one requiring owner review rather than a routine code path to exercise). If a future map or mode change makes this reachable, it will surface as a thrown error during play rather than a silent corruption, and should be escalated per the packet's stop conditions rather than patched with a broader fallback.
- Did not run `npm run test:browser` or any Playwright suite; none of the three fixes touch `src/render/`, `src/ui/`, or DOM wiring, so this was judged unnecessary. If the integration owner wants a manual smoke pass confirming the frozen-input fix specifically (e.g., freezing a human runner in a live match and pressing a movement key), that has not been done in this session.
- `docs/development/README.md`'s "Current Validation Baseline" section still reads "As of Plan 74 completion on 2026-05-21" and was not updated, since the repository has clearly advanced through many more packets (up to at least Plan 90) since that baseline was last refreshed, and refreshing it accurately would require re-running the full browser suite, which is outside this packet's scope.
- `git status` at the end of this session shows `docs/development/plan-85-campaign-rewrite-charter.md` modified and several untracked paths (`docs/development/README.md.template`, `docs/development/packet-template.md`, `docs/workflows/`, `scripts/dev/`) that this session did not create or edit. These are pre-existing working-tree changes from outside this packet's scope and were left untouched.

## Ready For Integration

Yes.
