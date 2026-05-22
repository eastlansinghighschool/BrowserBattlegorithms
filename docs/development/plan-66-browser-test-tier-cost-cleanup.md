# Plan 66: Browser Test Tier Cost Cleanup

## Packet Metadata

- Packet id: plan-66
- Packet title: Browser Test Tier Cost Cleanup
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: testing / CI hygiene / docs
- Mutation level: tests / docs / package scripts
- Approval gate: before changing GitHub workflow files, before deleting coverage outright, before changing app runtime behavior
- Expected artifacts:
  - corrected browser test tier membership
  - missing targeted browser scripts added to `package.json`
  - reduced repeated-load cost in the most expensive browser specs where safe
  - updated `docs/TESTING.md`
  - progress report
- Progress report folder: `reports/development/plan-66-browser-test-tier-cost-cleanup/`
- Progress report file: `reports/development/plan-66-browser-test-tier-cost-cleanup/progress.md`

## Packet Summary

Goal: Make routine browser validation faster and less timeout-prone by correcting test-tier drift, removing local-dev/tooling matrices from smoke, avoiding duplicated CI tiers, and reducing repeated whole-app reloads in the most expensive Playwright specs.

Why this packet exists:

Recent CI smoke runs have timed out or failed after spending several minutes in browser validation. The most visible failure was `tests/browser/workbench.spec.js`, where `/workbench.html` remained on `Loading workbench data...` and seven tests cascaded into long waits. That workbench suite is local-dev tooling, not a student gameplay path, and should not gate routine web-deploy confidence.

The broader pattern is tier creep: some local-dev/admin/tooling tests and repeated page-load matrices have drifted into frequent validation. Browser tests are essential for classroom readiness, accessibility, keyboard behavior, and student-visible flows, but routine smoke should prioritize high-signal learner paths over exhaustive local tooling and low-frequency matrices.

Non-goals:

- Do not reduce unit-test coverage.
- Do not delete browser coverage without replacing it with a more appropriate tier or unit test.
- Do not change gameplay rules, level content, Blockly semantics, accessibility behavior, or persistence behavior.
- Do not change GitHub workflow files in this packet unless the integration owner explicitly approves after reviewing the proposed script/tier changes.
- Do not hide failures by only raising timeouts.
- Do not lower confidence in student-facing smoke coverage just to make numbers look better.
- Do not perform a broad workbench architecture rewrite unless it is required for the bounded test-tier fix and approved.

Depends on:

- Plan 50 browser test tiering.
- Plans 60-64 workbench MVP.
- Current Playwright config and package scripts.

Blocks:

- Reliable CI smoke validation for post-pilot development.
- Future workbench lazy-boot packet if still needed after tier cleanup.
- Future CI workflow adjustment packet, if the repo decides to change what GitHub Actions invokes.

## Authority And Contracts

Authoritative sources:

- `docs/TESTING.md`
- `package.json`
- `playwright.config.js`
- `playwright.smoke.config.js`
- `tests/browser/`
- `tests/browser/helpers.js`
- `docs/development/README.md`

Contracts this packet must preserve:

- `npm run test:browser:smoke` remains a fast, representative frequent-validation suite.
- Smoke must keep meaningful student-facing coverage for:
  - app startup and mode selection
  - guided play happy path and at least one advanced/representative guided flow
  - Free Play setup and representative PvP/PvCPU behavior
  - real keyboard routing/key-capture behavior
  - pause/resume
  - one or more core accessibility/narration contracts
  - at least one visible animation/effect contract where unit tests cannot substitute
- Local-dev tooling surfaces, admin matrices, and exhaustive persistence/focus/versioning suites may move to targeted or extended tiers.
- `npm run test:browser` remains the full browser suite, single-worker and stable.
- Any new targeted script must be documented in `docs/TESTING.md`.
- Static Vite build behavior must remain unchanged.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/TESTING.md`
- `package.json`
- `playwright.config.js`
- `playwright.smoke.config.js`
- `tests/browser/helpers.js`
- `tests/browser/workbench.spec.js`
- `tests/browser/admin.spec.js`
- `tests/browser/free-play.spec.js`
- `tests/browser/guided-play.spec.js`
- `tests/browser/key-capture-passthrough.spec.js`
- `tests/browser/aria-narration.spec.js`
- `tests/browser/narration-controls-during-tutorial.spec.js`
- `tests/browser/workspace-reset-button.spec.js`
- `tests/browser/guided-ui.spec.js`
- `tests/browser/persistence.spec.js`

Use `rg "waitForTimeout|page.goto|test.setTimeout|test:browser|workbench.spec|admin.spec|aria-narration|key-capture"` to confirm current cost hot spots before editing.

## Scope

In scope:

- Correct tier drift between `docs/TESTING.md`, `package.json`, and `playwright.smoke.config.js`.
- Remove `tests/browser/workbench.spec.js` from smoke.
- Add a targeted `npm run test:browser:workbench` script.
- Decide and document whether `admin.spec.js` remains in smoke as a full matrix, is reduced to a smaller smoke subset, or moves to a targeted tooling tier.
- Reduce duplicated CI-tier coverage where the same spec is run by both smoke and focus.
- Add targeted scripts if useful, such as `test:browser:tooling` or `test:browser:admin`, but keep script sprawl modest.
- Refactor browser specs only when it reduces repeated full-app reloads without weakening coverage.
- Update browser tier documentation and the current validation baseline.
- Write a progress report that records before/after test counts and observed timings where available.

Out of scope:

- GitHub Actions workflow edits unless the owner explicitly approves.
- Major workbench lazy-loading architecture.
- Changes to app behavior to make tests pass.
- Rewriting all Playwright tests.
- Changing Playwright dependency versions.
- Removing accessibility, keyboard, or persistence coverage without an equivalent targeted/extended path.

Files and areas likely touched:

- `playwright.smoke.config.js`
- `package.json`
- `docs/TESTING.md`
- `docs/development/README.md`
- selected specs under `tests/browser/`
- `reports/development/plan-66-browser-test-tier-cost-cleanup/progress.md`

## Work Plan

1. Inspect current browser spec membership, scripts, and docs.
2. Record the current smoke file list and count.
3. Fix obvious tier drift:
   - remove `workbench.spec.js` from smoke
   - add `test:browser:workbench`
   - align `docs/TESTING.md`
4. Audit overlap between smoke and focus tiers. Propose a small, explicit change before editing if the choice affects accessibility coverage.
5. Reduce repeated-load cost in one or two high-impact specs only if the edit is straightforward and behavior-preserving.
6. Run targeted validation for changed scripts/specs.
7. Run smoke validation and record count/timing.
8. Write the progress report with decisions, tradeoffs, and remaining follow-ups.

## Implementation Requirements

### Requirement 1: Correct Workbench Tiering

Required behavior:

- `tests/browser/workbench.spec.js` must not be included in `playwright.smoke.config.js`.
- Add `npm run test:browser:workbench` to run only `tests/browser/workbench.spec.js` with `--reporter=line`.
- `docs/TESTING.md` must explain that the workbench suite is local-dev tooling and should be run when changing the workbench/readiness/prompt pipeline, not as routine deploy smoke.

Constraints:

- Do not delete `workbench.spec.js`.
- Do not weaken full-suite coverage: `npm run test:browser` should still include workbench.
- Do not add a tiny workbench smoke check unless the boot path is made lazy enough that the shell can load without pulling readiness/scratch/simulation modules immediately.

Expected artifact:

- Updated smoke config, package script, testing docs.

### Requirement 2: Resolve Smoke/Focus Duplication

Required behavior:

- Identify specs run by both smoke and `npm run test:browser:focus`.
- Decide whether each duplicated spec belongs in:
  - smoke only,
  - focus only,
  - both, with a documented reason.

Recommendation:

- Keep one high-value accessibility/narration smoke path in smoke.
- Move broader focus-management matrices to `test:browser:focus`.
- Avoid running the same heavy spec in both routine CI smoke and focus unless it protects a historically fragile classroom-critical path.

Current overlap to inspect:

- `tests/browser/key-capture-passthrough.spec.js`
- `tests/browser/aria-narration.spec.js`
- `tests/browser/narration-controls-during-tutorial.spec.js`

Constraints:

- Do not remove all keyboard/key-capture coverage from smoke. Keyboard reliability is student-facing and pilot-critical.
- Do not remove all narration/accessibility coverage from smoke.
- If the implementer is unsure, preserve coverage and document a follow-up instead of making a silent deletion.

Expected artifact:

- Updated config/docs and progress report explaining overlap decisions.

### Requirement 3: Reclassify Local Tooling And Admin Matrices

Required behavior:

- Inspect `tests/browser/admin.spec.js`, `tests/browser/dev-unlock.spec.js`, `tests/browser/dev-guided-level-link.spec.js`, and `tests/browser/workbench.spec.js` as local-dev/tooling/admin surfaces.
- Decide which of these belong in smoke, targeted tooling scripts, and/or extended only.

Recommendation:

- Workbench: targeted/extended only.
- Dev-guided-level-link: extended only unless the dev harness is actively being edited.
- Dev unlock: keep a small smoke slice only if it is cheap and has a current CI/development value; otherwise targeted/extended.
- Admin: consider moving the full admin matrix to `test:browser:tooling` or `test:browser:admin`, while preserving one lightweight smoke check only if the owner wants teacher/admin tooling in frequent validation.

Constraints:

- `admin.html` and local-dev links are not part of static web deploy, but they matter for classroom operations and usage analysis. Do not erase their test coverage.
- Production-exclusion assertions can be unit-level or targeted browser/tooling coverage; they do not necessarily need to be in smoke.

Expected artifact:

- Clear tier classification and any new targeted script(s).

### Requirement 4: Reduce Repeated Whole-App Reloads Where Safe

Required behavior:

- Identify one or two high-value specs where repeated `page.goto("/")` calls can be collapsed or split without reducing coverage.
- Prefer small, obvious reductions over broad rewrites.

Candidate specs:

- `tests/browser/workbench.spec.js`: many tests reload `/workbench.html`; because it is targeted/extended only, consolidation is useful but not required for smoke.
- `tests/browser/admin.spec.js`: many independent `/admin.html` loads; full matrix may be better as targeted tooling.
- `tests/browser/free-play.spec.js`: many student-facing reloads; keep coverage, but combine simple setup/exposure assertions where possible.
- `tests/browser/workspace-reset-button.spec.js`: smoke may only need one representative reset flow; the matrix can remain extended.

Constraints:

- Do not create brittle serial dependencies in student-facing smoke unless the test explicitly owns the state it leaves behind.
- Do not make tests harder to diagnose by cramming unrelated behaviors into one giant flow.
- Preserve localStorage isolation where a spec relies on it.

Expected artifact:

- Either focused test refactors or a documented rationale for leaving spec structure unchanged.

### Requirement 5: Better Failure Behavior

Required behavior:

- Where a spec waits for a costly app/tooling boot, prefer a shared helper or explicit readiness marker over long repeated waits on missing options.
- Avoid failure cascades that spend 90 seconds per test after the first known boot failure.

Recommendation:

- For `workbench.spec.js`, add a helper such as `openWorkbench(page)` that waits once for `#loadStatus` / populated `#levelSelect` and fails with a clear message. If practical, group workbench tests to avoid repeated boot.
- For app specs, continue using `waitForHeavyReady(page)` when Blockly/board readiness is required.

Constraints:

- Do not add production-only test hooks.
- Do not change app runtime behavior merely to serve Playwright.

Expected artifact:

- Helper changes inside tests, not app behavior, unless a tiny dev-only readiness marker is already available or trivial.

## Validation Commands

Run from repository root:

```powershell
npm run test:browser:smoke
npm run test:browser:focus
npm run test:browser:workbench
npm test
npm run build
```

If new targeted scripts are added, run each one.

Recommended additional checks when time allows:

```powershell
npm run test:browser:extended
```

If the full extended run is skipped because of time, the progress report must say so and list which targeted browser runs were used instead.

## Validation Checklist

- [ ] `playwright.smoke.config.js` no longer includes `workbench.spec.js`.
- [ ] `package.json` includes `test:browser:workbench`.
- [ ] `docs/TESTING.md` matches the actual scripts and smoke membership.
- [ ] Smoke count and expected timing are updated in docs/report.
- [ ] Focus tier duplication is either reduced or explicitly justified.
- [ ] Tooling/admin/dev suites are classified in docs.
- [ ] No browser coverage was deleted without a documented new home.
- [ ] `npm run test:browser:smoke` passes.
- [ ] `npm run test:browser:focus` passes.
- [ ] `npm run test:browser:workbench` passes, or any workbench failure is reported with a proposed follow-up.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report includes commands run, before/after counts, known warnings, and remaining risks.

## Stop Conditions

Stop and ask for owner/orchestrator review if:

- the implementer wants to remove a student-facing smoke area entirely
- the only way to make smoke pass is to raise timeouts
- workbench speed requires a source architecture change beyond lazy import / test helper cleanup
- changing CI workflow files seems necessary
- Playwright worker changes trade speed for new flake risk
- accessibility or keyboard coverage would be materially reduced
- production/static build behavior would change
- a proposed change deletes admin/workbench/dev tooling coverage instead of moving it to a targeted tier
