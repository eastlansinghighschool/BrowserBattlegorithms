# Plan 60 Progress Report: Level Readiness Engine

## Summary

Implemented a reusable per-level readiness engine and CLI for guided levels.

The new readiness command reports a deterministic JSON payload and a readable summary for a selected level. It covers:

- concept matrix agreement
- scoped lint diagnostics for the selected level plus campaign-level diagnostics
- reference fixture presence and runtime for ordinary one-off levels
- project checkpoint fixture presence and runtime for project levels
- toolbox / demo Blockly compatibility where applicable
- non-applicable handling for prediction and human-input levels
- unknown-level-id errors with nearby suggestions

The command is wired into `npm run level:readiness -- --level <levelId>` and `--json`.

## Validation Status

All requested validation now passes.

- `node --test --test-isolation=none tests/unit/level-readiness.test.js tests/unit/level-lint.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js`
  - Passed: 44/44
- `npm run level:readiness -- --level dodge-and-deliver`
  - Passed
- `npm run level:readiness -- --level dodge-and-deliver --json`
  - Passed
- `npm run level:readiness -- --level advanced-scrimmage`
  - Passed
- `npm run level:readiness -- --level human-runner-practice`
  - Passed
- `npm test`
  - Passed: 338/338
- `npm run build`
  - Passed

## Files Touched

- `src/dev/levelReadiness.js`
- `src/dev/levelReadinessProjectPolicy.js`
- `scripts/level-readiness.js`
- `tests/unit/level-readiness.test.js`
- `package.json`
- `docs/TESTING.md`

## Notes

- JSON output is deterministic because `generatedAt` is omitted unless explicitly requested by the caller.
- Project levels now surface only the project-specific readiness checks, which keeps the report readable and avoids duplicating reference no-op checks.
- The readiness report uses the authored exception policy for project arc checkpoints so documented non-pass cases are clearly called out rather than treated as regressions.
