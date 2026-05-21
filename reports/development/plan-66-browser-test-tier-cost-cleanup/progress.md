# Plan 66 Progress Report: Browser Test Tier Cost Cleanup

## Summary

Plan 66 cleaned up browser tier drift so routine CI stays focused on learner-facing paths:

- removed `workbench.spec.js` from smoke
- moved local-dev/admin/tooling coverage into a dedicated `test:browser:tooling` script
- removed duplicate focus-tier coverage from smoke
- kept student-facing keyboard and narration coverage in smoke
- moved the broad release browser command off the deferred workbench suite so `npm run test:browser` stays internally consistent
- added a dedicated release browser config that excludes the deferred workbench suite
- kept the Free Play pause smoke test in sync with the manual UI state it exercises

The smoke tier now avoids the local-dev workbench, admin matrix, dev unlock matrix, and dev-guided deep-link matrix. The release browser matrix also excludes the deferred workbench suite. Those remain covered by targeted commands.

## Files Changed

- `playwright.release.config.js`
- `playwright.smoke.config.js`
- `package.json`
- `docs/TESTING.md`
- `docs/development/README.md`
- `tests/browser/free-play.spec.js`

## Validation Results

Before the cleanup:

- smoke included 78 tests and still carried local-dev/tooling coverage
- focus duplicated accessibility coverage that smoke also exercised
- the workbench suite remained in frequent validation and was the main CI timeout risk

After the cleanup:

- `npm run test:browser:smoke`
  - Passed: 60/60
  - Runtime: about 56 seconds
- `npm run test:browser:focus`
  - Passed: 5/5
  - Runtime: about 21 seconds
- `npm run test:browser:tooling`
  - Passed: 21/21
  - Runtime: about 1 minute
- `npm run test:browser`
  - Passed: 126/126
  - Runtime: about 2 minutes 10 seconds
- `npm test`
  - Passed: 361/361
- `npm run build`
  - Passed

Targeted workbench validation:

- `npm run test:browser:workbench`
  - Still fails in this environment because the workbench boot path does not reach `Workbench ready.` within the explicit wait
  - Kept as a deferred/manual diagnostic command pending a future lazy-boot packet

## Tier Decisions

- `workbench.spec.js`
  - Removed from smoke
  - Kept as a targeted manual/diagnostic command via `npm run test:browser:workbench`
- `admin.spec.js`
  - Removed from smoke
  - Moved to `npm run test:browser:tooling`
- `dev-unlock.spec.js`
  - Removed from smoke
  - Moved to `npm run test:browser:tooling`
- `dev-guided-level-link.spec.js`
  - Kept out of smoke
  - Grouped with tooling for local-dev validation
- `key-capture-passthrough.spec.js`
  - Kept in smoke because it is student-facing keyboard-routing coverage
- `aria-narration.spec.js`
  - Kept in smoke because it is the core screen-reader narration contract
- `narration-controls-during-tutorial.spec.js`
  - Kept out of smoke and run in `npm run test:browser:focus`

## Remaining Follow-Up

- The workbench boot path is still too slow or brittle for routine validation, which is why it remains out of smoke, out of release validation, and in a manual command.
- If the repository wants the workbench suite to become reliable again, the next step is a lazy-boot workbench packet that defers readiness/scratch/simulation loading until a level is selected and can restore the suite to a supported release tier later.
