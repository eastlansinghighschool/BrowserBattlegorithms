# Plan 79 Progress Report

- Task or packet: Plan 79 - Admin Guided Progress Story
- Status: complete

## Summary of work completed

- Added `src/usage/guidedProgress.js` as the shared pure helper for catalog-building and sequence-derived guided progress derivation.
- Updated both usage analyzers to emit shared guided-progress summaries, `sessionSpanMinutes`, `needsReview`, and `reviewSignals`.
- Updated the admin UI summary table to show `Highest reached`, `Highest passed`, `Highest passed challenge`, and `Needs review`, while relabeling the time column to `Session span (min)`.
- Added a guided progress story card, an accessible sequence map, and an exact per-level table in the student detail view.
- Added focused unit tests for the helper plus CLI/browser analyzer parity.
- Updated browser admin and regression coverage to assert the new columns and detail story surface.
- Updated `docs/subsystems/usage-and-admin.md` and closed the packet in the development index.

## Files changed

- `src/usage/guidedProgress.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/admin/adminApp.js`
- `src/admin/adminStyle.css`
- `scripts/analyze-usage-files.js`
- `admin.html`
- `tests/unit/guided-progress.test.js`
- `tests/unit/usage-analyzer-browser.test.js`
- `tests/browser/admin.spec.js`
- `tests/regression/usage-pipeline-admin.spec.js`
- `docs/subsystems/usage-and-admin.md`
- `docs/development/plan-79-admin-guided-progress-story.md`
- `docs/development/README.md`
- `package.json`

## Artifacts produced

- Updated local admin UI behavior in the browser build.
- New shared helper coverage and analyzer parity coverage in unit tests.
- Regenerated browser tooling validation after installing the Playwright Chromium runtime.

## Commands run and results

- `node --test --test-isolation=none tests/unit/guided-progress.test.js tests/unit/usage-analyzer-browser.test.js tests/unit/usage-file.test.js` - passed, `25/25`
- `npx playwright test tests/browser/admin.spec.js --reporter=line` - passed, `12/12`
- `npm run test:browser:tooling -- --reporter=line` - passed, `21/21`
- `npm test` - passed, `408/408`
- `npm run build` - passed, with the repo's existing Vite chunk-size and dynamic-import warnings
- `npm run test:regression -- --reporter=line` - failed in shared global setup on a pre-existing regression fixture soundness issue: `index-jobs` unexpectedly passed in `tests/regression/student-profiles.js`

## Approval gates honored

- No grade-specific targets, database storage, new dependencies, or server behavior were added.
- Usage export schema semantics were left intact.
- Admin UI remains local-only and is still excluded from the Vite production build inputs.

## Stop conditions encountered

- The regression harness is currently blocked by a shared fixture-soundness failure unrelated to the Plan 79 admin UI work.

## Remaining risks or follow-ups

- The shared regression harness still needs its fixture issue resolved before it can be used as a green end-to-end signal again.
- Vite continues to report the repo's existing chunk-size and dynamic-import warnings.

## Ready for integration

yes
