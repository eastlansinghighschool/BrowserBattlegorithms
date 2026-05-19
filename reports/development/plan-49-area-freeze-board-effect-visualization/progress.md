# Plan 49 Progress Report

## Summary

Implemented the Area Freeze board-effect visualization without changing freeze rules, cooldown timing, radius, or duration.

Completed work:

- Added a pure core helper that builds a render-ready Area Freeze effect snapshot with caster cell, affected runner snapshots, radius, and timing metadata.
- Stored transient `areaFreezeEffect` state from the turn engine only when a freeze succeeds.
- Rendered a short icy diamond pulse on the board, an affected-runner flash, and a persistent frozen countdown badge near frozen runners.
- Kept frozen runner badges readable for finite countdowns and simple for infinite auto-skip freezes.
- Added reduced-motion handling so the expanding pulse becomes a static highlight while the badge remains.
- Updated the p5 surface map and turn-engine documentation to match the new contract.
- Added tests for effect-state creation, render-ready badge data, and browser integration.

## Validation

Focused unit coverage:

- `node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js tests/unit/display-and-controls.test.js tests/unit/freeze-visualization.test.js`
- Result: passed

Browser coverage:

- `npx playwright test tests/browser/guided-play.spec.js --reporter=line`
- Result: passed

Required repo validation:

- `npm run lint:levels`
- Result: passed with the repo's existing warnings only
- `npm test`
- Result: passed
- `npm run build`
- Result: passed with the repo's existing Vite chunk warnings
- `npx playwright test tests/browser/guided-ui.spec.js --reporter=line`
- Result: passed
- `npm run test:browser`
- Result: passed

## Manual Visual Smoke

No separate manual pixel-by-pixel smoke was performed. The browser suite exercised the freeze effect path through the live app, and the state assertions confirmed the pulse/badge render data was created correctly.

## Repair: Render/State Boundary Fix (2026-05-18)

**Problem:** `drawAreaFreezePulse()` in `src/render/effects.js` called `scheduleAreaFreezeEffectClear()`, which used a `window.setTimeout` timer to set `app.state.areaFreezeEffect = null` after the effect duration. Plan 49 explicitly requires render functions not to mutate game state.

**Fix:**
- Removed `scheduleAreaFreezeEffectClear`, `areaFreezeEffectTimerId`, and `areaFreezeEffectTimerKey` from `effects.js`.
- `drawAreaFreezePulse` and `drawAreaFreezeRunnerFlash` now compute `elapsedMs` and return early when `elapsedMs >= effect.durationMs`, drawing nothing without touching `state`.
- `state.areaFreezeEffect` now persists until reset (`resetRound`, `initializeMatch`, `initializeDisplayState`) or the next successful freeze — exactly as the core lifecycle already provides.
- Added `tests/unit/freeze-visualization.test.js` to the `npm test` suite in `package.json` (it was missing from the explicit file list).

**New tests added to `tests/unit/freeze-visualization.test.js`:**
- Successful freeze via `processTurnActions` creates `state.areaFreezeEffect` with correct shape.
- Unavailable (on-cooldown) freeze leaves any existing `state.areaFreezeEffect` unchanged.
- `resetRound` clears `state.areaFreezeEffect` to null.

### Repair Validation

- `node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js tests/unit/display-and-controls.test.js tests/unit/freeze-visualization.test.js` — **18/18 pass**
- `npx playwright test tests/browser/guided-play.spec.js --reporter=line` — **7/7 pass**
- `npm test` — **292/292 pass** (was 287 before; 5 tests in freeze-visualization.test.js now in suite)
- `npm run build` — **pass**, pre-existing Vite chunk-size warnings only

### Manual Visual Smoke

No pixel-level canvas smoke was performed. The state-hook assertions confirm the pulse/badge render data is correctly created, preserved, and cleared. The browser spec at `tests/browser/guided-play.spec.js:204` exercises the freeze path through the live app and validates the effect state shape.

## Notes

- The effect is transient UI state only. It does not change collision, scoring, freeze readiness, or freeze duration.
- The render layer reads `state.areaFreezeEffect` and frozen runner state; it does not decide who gets frozen.
- The board pulse uses the p5 canvas, while the frozen countdown badge is drawn next to each frozen runner in the entity render path.
- After the repair, render code is purely read-only with respect to game state: expired effects are silently skipped, not cleared.
