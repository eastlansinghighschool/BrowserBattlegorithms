# Plan 13 Progress Report

## Summary

- Added project-aware guided reference solution fixtures under `tests/unit/fixtures/guided-project-solutions/` for `strategy-brain` and `team-strategy-script`.
- Split test coverage so one-off guided levels and project guided levels are validated separately.
- Added shared-workspace browser coverage for project back-navigation, forward-navigation, reset preservation, and free-play isolation.
- Kept the existing one-off reference fixture coverage for non-project guided levels.

## Validation

- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js tests/unit/guided-level-contracts.test.js`
  - Passed
- `npx playwright test tests/browser/persistence.spec.js --reporter=line`
  - Passed: 14/14
- `npm test`
  - Passed: 80/80
- `npm run build`
  - Passed, with the repo’s existing Blockly dynamic-import and chunk-size warnings

## Notes

- The project fixture structure is step-based, with `final.xml` aliases for each project capstone checkpoint.
- Project checkpoint fixtures are treated separately from one-off guided fixtures so the harness distinguishes the shared-code arc from standalone levels.
- The existing Blockly deprecation warning about `Workspace.getAllVariables()` still appears in test output and is unrelated to this packet.
