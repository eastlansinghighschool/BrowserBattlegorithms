# Plan 65 Progress Report

## Summary

Implemented Free Play-only recent-state boolean blocks for runner memory:

- `my last move was blocked`
- `I have not moved for [N] turns`
- `I have been stuck for [N] turns`

Semantics:

- `my last move was blocked` is true when the runner tried to move or jump, the board rejected that move, and the runner did not change cells.
- `I have not moved for [N] turns` is true when the runner has ended N completed own turns without changing cells.
- `I have been stuck for [N] turns` is true when the runner has ended N completed own turns with every recorded end position in the window staying within Manhattan distance 2 of the oldest position in that window.

The packet adds a small runner-local recent-movement helper, wires it through the turn engine and Blockly interpreter, restricts exposure to Free Play, and updates docs and browser/unit coverage.

## Runner State

Recent-state tracking now uses runner-local, match-scoped fields:

- `lastMoveWasBlocked`
- `consecutiveTurnsWithoutMovement`
- `recentEndPositions`

The helper resets on runner reset, level/match setup, and round reset.

## Free Play Gating

The three recent-state blocks are exposed through the Free Play full toolbox only. Guided level toolboxes remain unchanged and do not show the blocks.

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
- `docs/development/future-directions-analysis/state-tracking-and-variables-pathway.md`

## Validation

Ran:

- `node --test --test-isolation=none tests/unit/conditions.test.js tests/unit/blockly-interpreter.test.js tests/unit/free-play-contracts.test.js tests/unit/guided-level-contracts.test.js tests/unit/turn-engine-resilience.test.js`
- `npx playwright test tests/browser/free-play.spec.js tests/browser/guided-ui.spec.js --reporter=line`
- `npm run lint:levels`
- `npm test`
- `npm run build`
- `npm run test:browser:smoke`

Results:

- Targeted Node test suite passed: 59/59
- Targeted browser suite passed: 29/29
- `npm run lint:levels` passed with the same pre-existing baseline warnings.
- `npm test` passed: 361/361.
- `npm run build` passed with the existing Vite warnings.
- `npm run test:browser:smoke` passed: 86/86.

## Notes

- The recent-movement state resets on setup, level start, and round reset.
- Guided toolboxes stay unchanged; the new blocks are Free Play only.
- The packet also preserved the canonical compare/boolean interpreter behavior needed by existing project and reference fixtures.
