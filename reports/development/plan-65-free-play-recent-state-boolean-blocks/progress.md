# Plan 65 Progress Report

## Summary

Implemented Free Play-only recent-state boolean blocks for runner memory:

- `my last move was blocked`
- `I have not moved for [N] turns`

The packet adds a small runner-local recent-movement helper, wires it through the turn engine and Blockly interpreter, restricts exposure to Free Play, and updates docs and browser/unit coverage.

## Files Changed

- `src/core/recentMovement.js`
- `src/entities/Runner.js`
- `src/core/setup.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/workspace.js`
- `src/config/constants.js`
- `tests/unit/conditions.test.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/turn-engine-resilience.test.js`
- `tests/browser/free-play.spec.js`
- `tests/browser/guided-ui.spec.js`
- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/development/README.md`
- `docs/development/archive/plan-65-free-play-recent-state-boolean-blocks.md`
- `docs/development/future-directions-analysis/analysis-index.md`
- `docs/development/future-directions-analysis/state-tracking-and-variables-pathway.md`

## Validation

Ran:

- `node --test --test-isolation=none tests/unit/conditions.test.js tests/unit/blockly-interpreter.test.js tests/unit/free-play-contracts.test.js tests/unit/movement-and-collisions.test.js`
- `npx playwright test tests/browser/free-play.spec.js --reporter=line`
- `npm run lint:levels`
- `npm test`
- `npm run build`
- `npm run test:browser:smoke`
- `npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line`
- `npx playwright test tests/browser/guided-play.spec.js --reporter=line`

Results:

- `npm run lint:levels` passed with the same pre-existing baseline warnings.
- `npm test` passed: 359/359.
- `npm run build` passed with the existing Vite warnings.
- `npm run test:browser:smoke` passed: 85/85.
- Targeted Playwright reruns for `key-capture-passthrough.spec.js` and `guided-play.spec.js` both passed.

## Notes

- The recent-movement state resets on setup, level start, and round reset.
- Guided toolboxes stay unchanged; the new blocks are Free Play only.
- The packet also preserved the canonical compare/boolean interpreter behavior needed by existing project and reference fixtures.
