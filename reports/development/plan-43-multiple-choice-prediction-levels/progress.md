# Plan 43 Progress Report

## Placement decisions

- `prediction-06` is inserted before `sensor-barrier-branch`, so the first prediction checkpoint lands right after the movement foundation and before the sensor lesson.
- `prediction-25` is inserted in the advanced-logic arc before `bughunt-28`, where students are already reading AND/OR branching and can practice committing to a boolean outcome before execution.
- `prediction-31` is inserted before `bughunt-37`, where runner-index role split is the main reasoning cliff and the prediction prompt can ask which ally takes the first shared-program job.

## What shipped

- Added a `levelKind: "prediction"` schema with prompt, choice, observation, and explanation fields.
- Added inline prediction UI in the guided lesson panel with radio-button choices, run gating, and post-run comparison feedback.
- Added three authored prediction levels:
  - `prediction-06`
  - `prediction-25`
  - `prediction-31`
- Added lint coverage for prediction schema validity.
- Added browser coverage for the prediction gating flow and keyboard navigation.

## Validation

- `npm run lint:levels` passes with warnings only.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/scoring-and-level-state.test.js tests/unit/level-lint.test.js` passes.
- `npx playwright test tests/browser/prediction-levels.spec.js --reporter=line` passes.
- `npx playwright test tests/browser/key-capture-passthrough.spec.js -g "guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline" --reporter=line` passes.
- `npm test` passes.
- `npm run test:browser` passes.
- `npm run build` passes, with the repo’s existing Vite chunk-size warnings.

## Notes

- Prediction levels are intentionally excluded from the Blockly reference-solution sweep because they are not meant to be solved by a code-only fixture contract.
- The real-keypress browser regression needed explicit focus away from Blockly so the document-level key handler could receive the `D` key without tripping the Blockly focus guard.
- Remaining lint warnings are curriculum-policy warnings already present in the authored campaign, not errors blocking integration.
