# Plan 81 Repair Instructions

## Review Summary

The Plan 81 implementation has the right overall architecture: a local-only CLI, path guard use, anonymized JSON/CSV tables, a baseline report, starter query descriptions, documentation, and focused tests. Do not restart the packet.

However, the current implementation has a few evidence-honesty gaps that matter before Plan 82 consumes the outputs. Repair these in place.

## Required Repairs

### 1. Preserve invalid-file evidence in the baseline

Current behavior:
- `scripts/usage-cohort-analysis.js` counts `.json` files, but parse failures are logged and skipped at lines 114-126.
- `buildBaselineReport()` receives `processed.length` at line 191, so the report's `Export Files Processed` count excludes parse-invalid files.
- The packet requires cohort file count plus valid/invalid file count, and invalid/tampered files should produce review flags rather than quietly disappearing.

Required behavior:
- Track total `.json` files discovered, valid JSON payload count, and invalid JSON file count.
- Include that distinction in `analysis/baseline-report.md`.
- If some files are invalid but at least one valid payload exists, continue processing valid payloads but make the baseline report and console output clearly say invalid files were omitted from row-level tables.
- If all files are invalid, failing is acceptable, but the error should say no valid JSON usage payloads could be loaded.
- Do not write raw invalid filenames into tracked reports. Local baseline output may include local file labels if needed, but keep the progress report aggregate-only.

Suggested test:
- Add a synthetic CLI or pure-helper test that simulates one valid payload and one invalid JSON file and verifies the baseline includes total/valid/invalid counts or equivalent review text.

### 2. Include integrity/analyzer review signals in row-level review flags

Current behavior:
- `generateCohortTables()` sets `needsReview` from `summary.needsReview`, but `reviewFlags` only uses `gp.reviewSignals` at `src/usage/cohortAnalysis.js` lines 241-255.
- If a file has an integrity mismatch, `summary.needsReview` can be `1` while `reviewFlags` is null, because `summary.suspiciousSignals` is not included.

Required behavior:
- Include `summary.suspiciousSignals` in the `exports.reviewFlags` and `export_progress.reviewFlags` values.
- Preserve guided progress review signals too.
- Keep raw hashes/session ids out of anonymized tables.

Suggested test:
- Build a synthetic processed export with a stale/mismatched integrity hash and assert:
  - `tables.exports[0].needsReview === 1`
  - `tables.exports[0].reviewFlags` includes `integrity_mismatch`
  - `tables.export_progress[0].reviewFlags` includes the same signal.

### 3. Make baseline wording export-based, not student-identity-based

Current behavior:
- `buildBaselineReport()` uses phrases like "students" in local aggregate interpretation at `scripts/usage-cohort-analysis.js` lines 246 and 252.
- The Plan 81 contract explicitly says anonymized ids identify usage export files, not guaranteed unique humans.

Required behavior:
- Change generated baseline wording to "exports", "student exports", or "files" rather than "students" when referring to counts derived from export files.
- Add a short caveat in the generated baseline report: a single human may appear in more than one export until a future usage format has a stable per-student id.

Suggested test:
- A lightweight string test on the baseline generator is enough if the helper is exported or moved into a testable module.

### 4. Align progress report claims with actual tests

Current behavior:
- `reports/development/plan-81-cohort-usage-dataset-and-baseline/progress.md` says validation confirmed "level backtracking preserves milestones without regression" and that the smoke check "Created synthetic files."
- The focused test file does not currently test milestone non-regression, and the CLI does not create synthetic raw exports by itself.

Required behavior:
- Either add the missing tests and make the smoke wording precise, or update the progress report to match what was actually validated.
- Keep the report free of student-identifying or row-level cohort data.

## Optional Cleanup

- `docs/CohortUsageDataDictionary.md` says `durationReliable` is an integer, but the implementation emits a boolean. Either change the implementation to `0/1` consistently or change the data dictionary type to Boolean.
- `docs/CohortUsageDataDictionary.md` describes the `events` table as "all actions, states, and operations"; the implementation intentionally projects a safe subset of event fields. Consider tightening the wording to "a normalized subset of event metadata."
- `reports/development/plan-81-cohort-usage-dataset-and-baseline/progress.md` uses absolute `file:///c:/...` links. Prefer repo-relative paths in durable progress reports.

## Validation Required After Repair

Run:

```powershell
node --test --test-isolation=none tests/unit/usage-cohort-analysis.test.js
node --test --test-isolation=none tests/unit/usage-cohort-privacy-paths.test.js
npm run plan:check -- plan-81-cohort-usage-dataset-and-baseline
```

If the current Plan 92 working tree still makes `npm test` fail in unrelated guided-reference tests, record that clearly rather than claiming a clean full-suite pass.

Also run a local synthetic smoke only with fake files under `local/usage-cohorts/synthetic-*`, then verify:

```powershell
git status --short local/usage-cohorts
```

Expected: no output.

## Stop Conditions

Stop and escalate if a repair would require:
- Writing generated cohort artifacts outside `local/usage-cohorts/`.
- Including full workspace XML in model-consumed outputs.
- Adding a database or package dependency.
- Changing student usage export semantics.
