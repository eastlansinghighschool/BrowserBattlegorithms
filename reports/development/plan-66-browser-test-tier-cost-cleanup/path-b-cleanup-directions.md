# Plan 66 Path B Cleanup Directions

## Current Review Finding

The Path B repair correctly made the release browser command exclude the deferred workbench suite, but the working tree still contains unreported source edits from the abandoned lazy-boot attempt:

- `src/workbench/workbenchApp.js`
- `src/workbench/workbenchData.js`

Those source edits are not required for Path B, are not listed in the Path B repair report, and remain unvalidated because:

- `npm run test:browser:workbench` is still known failing.

Do not integrate unreported, unvalidated workbench source edits as part of a test-tier cleanup packet.

## Required Repair

Prefer this path:

1. Revert the workbench source edits from the abandoned lazy-boot attempt:
   - `src/workbench/workbenchApp.js`
   - `src/workbench/workbenchData.js`
2. Keep the test-tier/config/docs Path B changes:
   - `playwright.release.config.js`
   - `package.json`
   - `playwright.smoke.config.js`
   - `docs/TESTING.md`
   - `docs/development/README.md`
   - Plan 66 progress report
3. Keep `tests/browser/workbench.spec.js` changes only if they are still useful for a manual diagnostic suite and are reported in the file list.
4. Keep the small `tests/browser/free-play.spec.js` `syncUi()` fix only if it is necessary for smoke stability and is reported in the file list.
5. Update the Plan 66 progress report file list so it exactly matches the actual changed files.

Alternative path:

- If you want to keep the workbench source edits, then `npm run test:browser:workbench` must pass and the progress report must list and explain the source changes. That is effectively returning to Path A and should not be done unless the boot issue is genuinely fixed.

## Documentation Note

The release config comment has been corrected in review to say that only `workbench.spec.js` is excluded from the release suite. Broader local/tooling specs such as admin and dev-unlock are excluded from smoke but still run in the release matrix.

Preserve that distinction.

## Validation Commands

Run these sequentially, not in parallel:

```powershell
npm run test:browser:smoke
npm run test:browser:focus
npm run test:browser:tooling
npm run test:browser
npm test
npm run build
```

Do not require `npm run test:browser:workbench` for Path B, but run it if you changed `tests/browser/workbench.spec.js` and report that it remains deferred/known failing.

## Stop Conditions

Stop and ask for review if:

- reverting the workbench source edits would conflict with other active work
- the release command no longer excludes only the deferred workbench suite
- the only way to pass validation is to raise timeouts
- the changed-file list cannot be made to match the actual diff
