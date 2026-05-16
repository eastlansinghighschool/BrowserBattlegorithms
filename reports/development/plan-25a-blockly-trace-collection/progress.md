# Plan 25a Progress Report: Blockly Trace Collection

## What changed

- Added `BLOCKLY_TRACE_SPEED_THRESHOLD` in `src/config/constants.js` and the companion helper `isBlocklyTraceCollectionActive(state)`.
- Added a per-call Blockly trace collector in `src/ai/blockly/workspace.js` with `recordStep()` and `getSteps()`.
- Threaded an optional collector through Blockly action resolution so traces capture what the resolver actually evaluated without changing the selected action.
- Added `getFirstRunnableActionWithTrace(app, runner)` as a trace-returning entry point alongside the existing action-only API.
- Updated `src/ai/blockly/interpreter.js` so the visible-workspace path uses the trace entry point at or below the trace threshold and stores the latest trace on `window.__bbaLastBlocklyTrace` only for dev inspection.
- Kept the inactive PvP team's hidden-workspace branch trace-free.
- Updated `docs/subsystems/blockly-workspace.md` to describe the data-only collector and defer playback to Plan 25b.
- Added focused trace-collection tests covering invariance, short-circuit honesty, hidden-workspace skipping, and the dev-only window stash.
- Added an explicit re-entrancy/independence test that calls `getFirstRunnableActionWithTrace` twice on separate snapshots and verifies the traces do not share array or step state.

## Validation

- `node --test --test-isolation=none tests/unit/blockly-trace-collection.test.js tests/unit/blockly-interpreter.test.js`
  - passed
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js`
  - passed
- `npm test`
  - passed, `110/110`
- `npm run build`
  - passed
  - existing Blockly chunking warnings remain
- `node --test --test-isolation=none tests/unit/blockly-trace-collection.test.js`
  - passed
- `npm test`
  - passed, `110/110`

## Contract notes

- Action selection is unchanged when tracing is enabled.
- The collector is argument-threaded and does not use module-level mutable state.
- No DOM, turn-engine, or Blockly visual changes were introduced.
- The dev-only trace stash is write-only and only populated when trace collection is active.

## Remaining risks

- Plan 25b still needs to consume the trace shape and render playback without altering turn semantics.
- If future resolver work adds new truthy block types, the trace tests should be expanded so short-circuit and comparison coverage stays honest.
