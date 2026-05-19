# Plan 50: Browser Test Suite Hygiene

## Packet Metadata

- Packet id: plan-50
- Packet title: Browser Test Suite Hygiene
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: testing / tooling / docs
- Mutation level: tests / package scripts / config / docs
- Approval gate: before deleting any browser coverage outright, before changing product behavior to satisfy a test, or before removing any accessibility, file-pipeline, persistence, keyboard, or deployment guardrail
- Expected artifacts:
  - browser test tiering strategy implemented in scripts/config
  - smoke browser suite that runs materially faster than the current full suite
  - extended browser suite that preserves slower coverage
  - focused cleanup of low-signal or duplicated browser assertions
  - narration-controls-during-tutorial coverage kept or tiered according to the corrected tutorial scrim contract
  - updated docs/package scripts
  - progress report
- Progress report folder: `reports/development/plan-50-browser-test-suite-hygiene/`
- Progress report file: `reports/development/plan-50-browser-test-suite-hygiene/progress.md`

## Packet Summary

Goal: Make the Playwright browser suite easier to run routinely by introducing test tiers, validating safe parallelism, and moving slow/low-signal browser checks out of the default frequent path without losing important classroom, accessibility, persistence, static-deployment, or Blockly workflow guardrails.

Non-goals:

- Do not change product behavior unless a test exposes an approved bug.
- Do not remove accessibility, keyboard, persistence, private-file, usage-file, or static-deployment coverage without preserving equivalent coverage elsewhere.
- Do not rewrite the whole browser suite.
- Do not make full browser regression disappear; it should remain available as an extended command.
- Do not touch deployment.

Depends on:

- Current Playwright suite under `tests/browser/`.
- Current `playwright.config.js`.
- Current `package.json` scripts.
- Browser timing scan from orchestration: `reports/development/browser-test-timing-scan.json` if present, or rerun timing if absent.

Blocks:

- Faster packet validation for UI, guided, Blockly, and mode-flow changes.
- Clearer guidance for future packets about which browser command they should run.

Why this packet exists:

The full browser suite has grown to roughly 110 tests and often takes long enough to cause timeouts in implementation threads. The suite now mixes core smoke coverage, expensive file/persistence flows, modal/accessibility stability checks, dev-only harness checks, and static/content assertions. Future implementation agents need a smaller default browser command that still protects student-facing classroom behavior, plus an extended suite for higher-risk or nightly-style validation.

## Authority And Contracts

Sources of truth:

- `docs/packet-creation-guidance.md`
- `docs/ARCHITECTURE.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/p5-surface-map.md`
- `package.json`
- `playwright.config.js`
- `tests/browser/`
- `tests/unit/`

Do not redefine:

- Browser tests must continue to protect static Vite deployment behavior.
- Guided mode must remain classroom-ready on student laptops and projectors.
- Blockly keyboard navigation, key-capture passthrough, modal/focus behavior, file pipelines, persistence, and accessibility surfaces are not disposable.
- The full browser suite must remain runnable.
- The default smoke suite should favor student-facing flows and high-risk integration points over static copy assertions.

## Required Reading

- `playwright.config.js`
- `package.json`
- `tests/browser/helpers.js`
- `tests/browser/guided-ui.spec.js`
- `tests/browser/persistence.spec.js`
- `tests/browser/modal-stability.spec.js`
- `tests/browser/key-capture-passthrough.spec.js`
- `tests/browser/admin.spec.js`
- `tests/browser/help.spec.js`
- `tests/browser/dev-guided-level-link.spec.js`
- `tests/browser/workspace-starter-versioning.spec.js`
- `tests/browser/narration-controls-during-tutorial.spec.js`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/blockly-workspace.md`

Use:

```powershell
rg "waitForTimeout|test\\(|describe\\(|download|setInputFiles|devGuidedLevel|modal|aria-live|tutorial" tests/browser
```

## Current Evidence

A timing scan from orchestration found:

- Full browser suite: about 110 tests.
- One-worker runtime: roughly 2m15s to 2m35s in recent runs.
- Two-worker runtime: passed in roughly 1m24s in one scan.

Slowest/highest-cost areas:

- `guided-ui.spec.js`: ~19s
- `persistence.spec.js`: ~19s
- `modal-stability.spec.js`: ~11s, mostly deliberate 1500 ms focus-stability waits
- `key-capture-passthrough.spec.js`: ~9s
- `free-play.spec.js`: ~8s
- `dev-guided-level-link.spec.js`: ~8s
- `narration-controls-during-tutorial.spec.js`: ~7s for one test

Likely lower-frequency candidates:

- `admin.spec.js` browser table/content cases
- `help.spec.js` static content/link cases
- `modal-stability.spec.js` focus-stability matrix
- `dev-guided-level-link.spec.js` dev-harness checks
- repeated edge cases in `workspace-starter-versioning.spec.js`
- file-heavy cases in `persistence.spec.js`

Resolved contract concern:

- `tests/browser/narration-controls-during-tutorial.spec.js` appears to assert that tutorial scrim blocks narration controls.
- Product decision: the tutorial scrim should block narration controls. `Show Turn Log`, `Coaching Mode`, and `Voice Narration` are gameplay narration preferences, not the screen-reader live narration channel.
- `docs/subsystems/ui-mode-contract.md` now documents that narration controls should remain dimmed and non-interactive while a tutorial step is active.
- Keep or tier `tests/browser/narration-controls-during-tutorial.spec.js` based on suite hygiene, but do not invert it to make narration controls interactive during tutorial.

## Scope

### In Scope

- Add browser test tiers through scripts, Playwright projects, grep tags, or separate config files.
- Validate whether `workers: 2` is stable enough for the full browser suite.
- Add package scripts for at least:
  - fast smoke browser run
  - full/extended browser run
  - focused accessibility/focus run if useful
- Tag, split, or reorganize browser tests so future packets can run the right level of validation.
- Move duplicated/static browser assertions to unit tests or lower-frequency extended browser coverage where appropriate.
- Keep a progress report with before/after timings and rationale for each moved/retained test.

### Out Of Scope

- Broad app refactors.
- Product behavior changes not explicitly approved.
- Removing all coverage for any subsystem.
- GitHub Actions workflow changes unless the repo already has a matching workflow and the change is tiny; otherwise stop and report.
- Deployment.

### Files And Areas Likely Touched

- `package.json`
- `playwright.config.js` and/or new `playwright.*.config.js`
- `tests/browser/*.spec.js`
- `tests/browser/helpers.js`
- `tests/unit/*` only for converted low-level assertions
- `docs/TESTING.md` if present and relevant
- `docs/development/README.md` only if packet status changes after completion
- `reports/development/plan-50-browser-test-suite-hygiene/progress.md`

## Work Plan

1. Baseline current browser timing.
2. Classify each browser spec/test as smoke, extended, focus/accessibility, dev-harness, file-pipeline, or static/content.
3. Propose the tiering map in the progress report before heavy edits if any deletion or behavior conflict appears.
4. Implement scripts/config/tags for the selected tiering approach.
5. Convert or move only obvious low-signal browser assertions where equivalent unit/static coverage is straightforward.
6. Keep or tier narration-controls tutorial coverage according to the corrected scrim-blocks-controls contract.
7. Run smoke, full browser, unit, and build validation.
8. Report timing deltas, commands, and any coverage moved to extended.

## Implementation Requirements

### Requirement 1: Test Tiers

Required behavior:

- Add a fast browser command that runs a smaller smoke set.
- Keep a full browser command equivalent to today's complete Playwright suite.
- Make the tiering discoverable in `package.json` and docs/progress report.

Recommended script names:

```json
"test:browser": "playwright test",
"test:browser:smoke": "...",
"test:browser:extended": "playwright test",
"test:browser:focus": "..."
```

The exact mechanism may be Playwright projects, grep tags, file globs, or config files. Choose the smallest clear implementation.

Smoke suite should include representative coverage for:

- app startup / mode chooser
- one guided flow
- one Blockly workspace/editing guardrail
- one key-capture/keyboard guardrail
- one Free Play setup or PvP/PvCPU mode guardrail
- one persistence or reset smoke
- one narration/accessibility smoke

Extended suite should include:

- full persistence/file pipeline matrix
- modal stability matrix
- admin browser analyzer surface
- dev-guided harness
- workspace starter versioning edge cases
- full guided UI matrix

### Requirement 2: Parallelism

Required behavior:

- Test `workers: 2` on the full browser suite.
- If stable, update config or scripts to use 2 workers by default unless there is a documented reason not to.
- If unstable, leave workers at 1 and document the failure mode.

Constraints:

- Do not hide shared-state bugs by disabling storage clearing.
- Keep `clearStorageBeforeEach(test)` behavior where specs require isolation.

### Requirement 3: Low-Signal Browser Assertion Cleanup

Candidates to reduce from frequent runs:

- `help.spec.js`: static link/content checks. Keep one smoke or move to extended/static check.
- `admin.spec.js`: keep one browser smoke for upload/render; rely on unit analyzer tests for hash/anomaly semantics.
- `workspace-starter-versioning.spec.js`: keep one browser stale-replace smoke; move edge cases to unit or extended.
- `persistence.spec.js`: keep one or two persistence smoke tests; move private export/import, malformed import, and multi-context edge cases to extended unless touching file pipelines.

Constraints:

- Do not remove all browser coverage for import/export/private files; those are classroom-facing workflows.
- Do not remove all admin browser coverage; the local teacher tool needs at least one end-to-end smoke.
- Do not remove static deployment guard coverage for `admin.html` production exclusion.

### Requirement 4: Modal And Accessibility Coverage

Required behavior:

- Keep modal/focus coverage available.
- It may move out of the smoke suite because its fixed waits are expensive.
- If any modal-stability test is flaky, prefer improving waits/selectors over deleting it.

Required behavior:

- Preserve the product contract that tutorial scrims block narration controls.
- `tests/browser/narration-controls-during-tutorial.spec.js` may stay in smoke or move to a focus/accessibility tier based on runtime cost, but it should continue asserting that gameplay narration controls are blocked while tutorial is active.
- Do not change product behavior to lift narration controls above the tutorial scrim.

### Requirement 5: Reporting

Progress report must include:

- baseline full browser timing
- post-change smoke timing
- post-change full/extended timing
- whether `workers: 2` was adopted
- list of tests moved out of smoke and why
- list of tests deleted or converted, with equivalent remaining coverage
- commands run
- remaining risks

## Commands

Run from repository root:

```powershell
npx playwright test --reporter=line
npx playwright test --workers=2 --reporter=line
npm run test:browser:smoke
npm run test:browser
npm test
npm run build
```

If adding a focus/accessibility tier:

```powershell
npm run test:browser:focus
```

If converting browser assertions to unit tests, run the matching unit files too.

## Validation Checklist

- [ ] Smoke browser command exists and passes.
- [ ] Full/extended browser command exists and passes.
- [ ] Full browser coverage remains available.
- [ ] Browser smoke suite runtime is materially lower than the current full suite.
- [ ] `workers: 2` is either adopted after successful validation or rejected with documented evidence.
- [ ] Modal/focus coverage remains available.
- [ ] File pipeline coverage remains available.
- [ ] Admin browser smoke remains available.
- [ ] Static deployment guard for `admin.html` remains covered.
- [ ] Narration-controls tutorial behavior is aligned with `docs/subsystems/ui-mode-contract.md`: tutorial scrim blocks gameplay narration controls.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report includes timing deltas and coverage rationale.

## Stop Conditions

Stop and ask for owner review if:

- a test contradicts an authoritative subsystem note and the correct product behavior is not already stated in this packet
- the only way to make browser parallelism stable requires changing app behavior or weakening isolation
- deleting a test would remove the only coverage for accessibility, keyboard, persistence, file import/export, usage/admin, or static deployment behavior
- smoke suite selection becomes a broad product-risk decision rather than a test-organization decision
- Playwright config changes would affect deployment or production build behavior
