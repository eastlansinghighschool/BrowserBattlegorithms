# Plan 16 Progress Report

## Summary

The usage-pipeline regression pass is now repaired and green end to end. The main fix was in `tests/regression/student-profiles.js`: normal struggling profiles now append the correct passing attempt after each wrong attempt, while `Gave-Up Gabi` still stops after three failed `jump-if-ready` attempts with no final pass. I also kept the analyzer fingerprint change intentionally in place, documented it, and added unit coverage so workspace churn is ignored while meaningful attempt sequences still distinguish students.

## What Worked

- Synthetic usage-session recording through the in-browser `usageTracker` stayed stable and much less brittle than full gameplay simulation.
- The regression output files now export with valid integrity hashes and readable summary data.
- The admin analyzer path still flags the intended similarity pair: Pat Chen and Casey Chen.
- The browser, unit, regression, and build suites all pass after the repair.

## Repair Details

### Profile attempt construction

- Normal struggling profiles now use:
  - `[...overrideAttempts, defaultCorrect]`
- Exception:
  - if `profilePlan.stopAfterLevel === level.id`, the correct attempt is not appended
  - this preserves `Gave-Up Gabi` as three failed `jump-if-ready` attempts followed by stopping
- Human-input handling remains intact and unchanged.

### Fingerprinting

- The analyzer fingerprint intentionally ignores `workspace_changed` and `workspace_snapshot` events.
- This keeps workspace churn from hiding meaningful student similarity signals.
- I added unit coverage proving:
  - workspace noise is ignored
  - different guided attempt sequences still produce different fingerprints

### Generated artifacts policy

- `tests/regression/output/*.json` and `tests/regression/screenshots/*.png` are run artifacts only.
- They are ignored via `.gitignore` and are not intended to be committed.

## Expected Profile Counts

| Profile | Passed | Failed | Completed | Notes |
| --- | ---: | ---: | ---: | --- |
| Perfect Pat | 37 | 0 | 37 | Full campaign completion |
| Copy-Cat Casey | 37 | 0 | 37 | Same pattern as Pat |
| Struggling Sam | 37 | 6 | 43 | Finishes all required campaign levels |
| Challenged Charlie | 37 | 11 | 48 | Finishes all required campaign levels |
| Gave-Up Gabi | 15 | 3 | 18 | Stops at `jump-if-ready` after three failures |

## Analyzer Output Summary

`node scripts/analyze-usage-files.js` over the generated regression output files produced:

- Pat Chen: `guided=37/37 passed`
- Casey Chen: `guided=37/37 passed`
- Sam Rivera: `guided=37/43 passed`
- Charlie Nguyen: `guided=37/48 passed`
- Gabi Torres: `guided=15/18 passed`
- Similarity flag: `Casey Chen, Pat Chen`

All five files showed `verified hash`.

## Screenshot Artifacts

Generated under `tests/regression/screenshots/`:

- `class-table.png`
- `detail-casey-chen.png`
- `detail-charlie-nguyen.png`
- `detail-gabi-torres.png`
- `detail-pat-chen.png`
- `detail-sam-rivera.png`
- `detail-taylor-reed-tampered.png`
- `flags.png`

## Validation

- `npm run test:regression -- --reporter=line`
  - Passed: 7/7
- `node scripts/analyze-usage-files.js <all generated regression output files>`
  - Passed
- `npm test`
  - Passed: 97/97
- `npm run build`
  - Passed
- `npm run test:browser -- --reporter=line`
  - Passed: 61/61

## Production-Code Changes

- `src/usage/usageFormat.js`
  - kept the fingerprint change that ignores workspace churn
  - documented the intent in code
- `tests/unit/usage-analyzer-browser.test.js`
  - added coverage for workspace-noise-ignored vs meaningful-sequence-different behavior
- `tests/regression/usage-pipeline-admin.spec.js`
  - adds a tampered usage-file copy so the admin page detail view can show the hash-mismatch state

## Notes For Review

- The regression harness is still test-infrastructure-first, with one intentional production-code adjustment in the usage fingerprinting path.
- The saved outputs and screenshots are expected to remain local run artifacts only.
