# Plan 66 Repair Directions: Make Browser Test Scripts Internally Consistent

## Context

Plan 66 correctly moved local-dev/tooling specs out of smoke and added targeted browser scripts. The smoke, focus, and tooling tiers are now much healthier:

- `npm run test:browser:smoke` passes when run by itself: 60/60.
- `npm run test:browser:focus` passes: 5/5.
- `npm run test:browser:tooling` passes: 21/21.

However, the packet is not integration-ready because the repository now exposes a known-failing targeted command:

- `npm run test:browser:workbench` still fails because `/workbench.html` remains stuck at `Loading workbench data...`.

There is a second consistency problem: `npm run test:browser` and `npm run test:browser:extended` still run all browser specs through `playwright.config.js`, which means they still include the failing workbench suite. The docs still describe `npm run test:browser` as the full extended/release matrix. A release-validation command cannot knowingly include a failing optional/manual suite.

## Required Reading

- `docs/development/plan-66-browser-test-tier-cost-cleanup.md`
- `reports/development/plan-66-browser-test-tier-cost-cleanup/progress.md`
- `docs/TESTING.md`
- `package.json`
- `playwright.config.js`
- `playwright.smoke.config.js`
- `tests/browser/workbench.spec.js`
- `src/workbench/workbenchApp.js`
- `src/workbench/workbenchData.js`
- `src/workbench/workbenchScratch.js`
- `src/dev/levelReadiness.js`

## Required Repair Decision

Choose one of these two paths. Prefer Path A if it is feasible within a small repair.

### Path A: Make Workbench Validation Pass

Fix the workbench boot path enough that:

- `npm run test:browser:workbench` passes.
- `npm run test:browser` can continue to mean the full browser suite including workbench.
- `docs/TESTING.md` can keep describing workbench as a targeted optional command but not a known-failing one.

Recommended implementation direction:

- Make `/workbench.html` boot light:
  - Populate the level selector from cheap level metadata first.
  - Do not load readiness/scratch/simulation modules before the shell reaches a ready state.
  - Load readiness data only after a level is selected.
  - Load scratch Blockly/readiness simulation modules only when the scratch panel needs them.
- Avoid statically importing `src/dev/levelReadiness.js` through `src/workbench/workbenchScratch.js` during initial workbench boot.
- Keep behavior unchanged from the user's point of view except that the workbench becomes responsive sooner.

If this path is chosen, update the progress report with the boot-path fix and rerun validation.

### Path B: Exclude Workbench From Release/Extended Browser Commands Until A Later Lazy-Boot Packet

If Path A is too large for a Plan 66 repair, make the test command contract honest:

- `npm run test:browser` and `npm run test:browser:extended` must not include the known-failing `tests/browser/workbench.spec.js`.
- Add an explicit script for the deploy/release browser matrix if needed, but avoid confusing names.
- Keep `npm run test:browser:workbench` as a targeted diagnostic/manual command only if docs clearly state it is currently expected to fail pending lazy boot.
- Update `docs/TESTING.md` so it does not claim release validation includes a command that fails because of the workbench.
- Update the Plan 66 progress report to record that workbench validation remains deferred, not complete.

This path is acceptable only if the integration owner agrees that workbench browser coverage can be temporarily deferred. Unit coverage for the readiness/prompt/workbench pure functions must remain intact.

## Non-Negotiable Fixes For Either Path

- Do not leave `Ready for integration: yes` while any required validation command is known to fail.
- Do not document `npm run test:browser` as passing/full/release validation if it includes `workbench.spec.js` and workbench still fails.
- Do not merely raise the workbench timeout.
- Do not delete `workbench.spec.js`.
- Do not change gameplay, level content, Blockly semantics, persistence behavior, or accessibility behavior.
- Do not edit GitHub workflow files unless the owner explicitly approves.
- Preserve the successful smoke/focus/tooling split.

## Additional Documentation Cleanup

Also fix these doc drifts:

- `docs/TESTING.md` currently says the Playwright browser suite is split into "two tiers" but now documents smoke, extended, tooling, workbench, and focus. Reword that introduction.
- `docs/development/README.md` current validation baseline still says "As of Plan 50 completion" and includes stale `npm run test:browser` counts. Update or remove the stale baseline so it does not contradict Plan 66.
- `playwright.smoke.config.js` comment says extended suite is all tests / stable; update this if Path B excludes workbench from extended.

## Validation Commands

Run from repository root, sequentially, not in parallel because the Playwright configs share port 4173:

```powershell
npm run test:browser:smoke
npm run test:browser:focus
npm run test:browser:tooling
npm test
npm run build
```

Then:

- If Path A:

```powershell
npm run test:browser:workbench
npm run test:browser
```

- If Path B:

```powershell
npm run test:browser
```

and explicitly report that `npm run test:browser:workbench` remains deferred/known failing pending a future lazy-boot packet.

## Stop Conditions

Stop and ask for owner/orchestrator review if:

- Workbench lazy boot requires a larger architecture change than expected.
- The implementer wants to rename the core browser scripts in a way that could confuse CI/release validation.
- The only proposed fix is increasing timeouts.
- The repair would remove workbench coverage without a clearly documented targeted/manual replacement.
- The repair requires GitHub Actions workflow changes.
