# Plan 25b Progress Report: Blockly Trace Playback

## What changed

- Added `TURN_STATES.TRACING_PRE_ACTION` in `src/config/constants.js` and the corresponding trace playback bookkeeping fields in `src/core/state.js`.
- Implemented the pre-action playback branch in `src/core/turnEngine.js` so visible Blockly traces now render before the queued action resolves at or below the trace speed threshold.
- Added `src/ai/blockly/traceRenderer.js` to apply and clear the Blockly trace UI classes, inline true/false glyphs, the selected-action treatment, the overflow badge, and the empty-program hint.
- Kept trace playback tied to Plan 25a's collected trace data without re-evaluating the resolver or changing the selected action.
- Cleared trace playback state on the same reset, mode-switch, level-switch, workspace reload, and threshold-crossing paths that already manage turn/UI cleanup.
- Added unit coverage for trace playback transitions, threshold skipping, cleanup, empty traces, overflow handling, and back-to-back turns.
- Added Playwright coverage for low-speed visible playback, above-threshold skipping, empty-program hints, overflow badges, and cleanup on mode switch.
- Updated the blockly workspace and turn-engine subsystem notes to document the new UI/state contracts.

## Validation

- `node --test --test-isolation=none tests/unit/blockly-trace-playback.test.js tests/unit/blockly-trace-collection.test.js tests/unit/blockly-interpreter.test.js`
  - passed
- `npx playwright test tests/browser/blockly-trace-playback.spec.js --reporter=line`
  - passed
- `npm test`
  - passed, `110/110`
- `npm run build`
  - passed
  - existing Blockly chunking warnings remain
- `npm run test:browser`
  - passed, `71/71`

## Contract notes

- Trace playback is explanatory UI only. It does not change the queued action or the one-action-per-turn rule.
- The empty-program hint only appears for the visible-workspace trace path and clears with the rest of trace UI state.
- Overflow is capped to a short classroom-readable trace, with the final selected action still rendered.

## Remaining risks

- Trace playback depends on Blockly rendering timing and the workspace layout settling; the browser spec now covers the intended low-speed, high-speed, empty, and overflow behaviors.
- The new UI classes should stay aligned with future Blockly styling changes so they continue to stand out from ignored-block and warning states.
