# Plan 31: Modal Stability Regression Suite

## Packet Metadata

- Packet id: plan-31
- Packet title: Modal Stability Regression Suite
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-16
- Packet type: testing / accessibility
- Mutation level: tests (and source only if a test reveals a bug — see Stop Conditions)
- Approval gate: before mutation of any non-test file — if a test reveals a bug, stop and report rather than silently fix
- Expected artifacts:
  - one Playwright spec covering modal/overlay stability for every enumerated surface
  - a short enumeration table in the progress report listing every surface tested and its result
  - progress report
- Progress report folder: `reports/development/plan-31-modal-stability-regression-suite/`
- Progress report file: `reports/development/plan-31-modal-stability-regression-suite/progress.md`

## Packet Summary

Goal: Build a Playwright regression suite that exercises every modal and overlay surface in the app against a common stability matrix: focus stays where the user puts it, Tab cycles within the modal as expected, Enter and Space activate the focused control, Escape closes the modal where that's the contract, form fields accept typed characters, and no setInterval/setTimeout-driven re-render destroys focus. The Plan 30 follow-up uncovered one such bug on the welcome modal; this packet ensures the rest of the modal surface isn't quietly broken in the same way.

Non-goals:

- Do not change source code unless a test reveals a bug. If a bug is found, stop and surface it for owner review (Stop Conditions); the fix is a separate packet.
- Do not change modal styling, layout, copy, focus-trap behavior, or close semantics. Only verify the current behavior is stable.
- Do not refactor modal implementations into a common framework or component pattern.
- Do not introduce new modals, new focus-trap libraries, or new accessibility wrappers.
- Do not change Plan 30's keyboard fix or any of its tests.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Plan 30 complete (Tab navigation must actually work for the assertions to be meaningful).
- Plan 30 follow-up complete (welcome modal focus-pull fixed; otherwise the welcome-modal assertions in this suite will fail as known regressions, which is fine to document but the suite should pass clean once both land).

Blocks:

- Classroom keyboard accessibility confidence across all in-app modals, not just the welcome screen.
- Future modal additions: this suite becomes the contract for "what a modal must satisfy."

Why this packet exists:

Plan 30 unmasked a focus-pull bug on the welcome modal because tutorialOverlay's emoji-animation interval rebuilds `overlay.innerHTML` every second. That pattern (`innerHTML = \`...\`` in an interval or after an external state change) is the kind of mistake that's easy to repeat. The app has several other modal surfaces (program export, private import, active-tutorial overlay, level-result overlay, end-game overlay) that may or may not have similar issues. A regression suite that enforces the same stability matrix on every surface catches existing problems and prevents future ones, especially as the project moves toward classroom use where keyboard accessibility matters.

## Authority And Contracts

Sources of truth:

- `index.html` — modal/overlay DOM declarations. Known surfaces (as of 2026-05-16):
  - `#tutorial-overlay` (welcome modal in `showModePicker` state, active-tutorial overlay in lesson state).
  - `#programExportModal` (Export workspace XML / private program file).
  - `#privateImportModal` (Import private program file).
  - `#goal-burst-overlay` (decorative, not interactive — likely outside scope; confirm and document).
  - Any level-result or end-game overlay rendered through `tutorial-overlay` or a sibling element (enumerate during implementation).
- `src/ui/tutorialOverlay.js` — tutorial and mode-picker render path.
- `src/ui/controls.js` — modal open/close handlers for export/import.
- `src/render/p5App.js` — confirms the `p.keyPressed` fix from Plan 30 is in place.
- `docs/subsystems/ui-mode-contract.md` — describes which controls appear in which mode; relevant for asserting that a modal closes back into the correct mode state.

Required product contracts:

- Every interactive modal must:
  1. Render its focusable children in DOM order matching its visual order.
  2. Preserve focus on a focused interactive child across at least 1500 ms of idle time (i.e., no interval-driven re-render destroys focus).
  3. Accept Tab and Shift+Tab to advance/retreat focus among its interactive children (whether focus is trapped within the modal or allowed to escape is part of the modal's contract — assert whatever the *current* behavior is, but assert it deterministically).
  4. Allow form fields inside the modal to accept typed characters when focused.
  5. Activate the focused button on Enter (and Space where appropriate).
  6. Close on its documented close trigger (Escape, backdrop click, or explicit Cancel button — whichever is the current behavior).
- A non-interactive overlay (`#goal-burst-overlay`) is not subject to these contracts and should be documented as such.

Do not redefine:

- Whether a modal traps focus or not — assert current behavior.
- Modal copy, styling, or DOM structure.
- The close-trigger contract per modal.

## Required Reading

- `docs/packet-creation-guidance.md`
- `index.html` (modal DOM)
- `src/ui/tutorialOverlay.js`
- `src/ui/controls.js` (modal open/close logic; look for `programExportModal`, `privateImportModal`)
- `tests/browser/key-capture-passthrough.spec.js` (the Plan 30 spec — model for the new tests)
- `tests/browser/guided-play.spec.js` (model for tutorial-overlay-driven flows)

Use `rg "Modal|overlay|hidden\s*=|aria-modal|data-tutorial-action|data-program-modal-action|data-private-import-action"` to find modal surfaces and their close-trigger conventions.

## Scope

### In scope

- Enumerate every modal/overlay surface in the app. Start from the known list (welcome modal, active-tutorial overlay, program export modal, private import modal). Confirm via `rg` and DOM inspection whether other modal-like surfaces exist (level-result overlay, end-game overlay, error toasts, etc.). Document the final enumerated list at the top of the progress report.
- Categorize each surface as interactive or decorative. Decorative surfaces (`#goal-burst-overlay`) get a one-line "not interactive — N/A" entry in the progress report and no test coverage.
- For each interactive surface, write a Playwright test block that exercises the stability matrix (Requirement 2). Group these into a single spec file `tests/browser/modal-stability.spec.js` with `test.describe` blocks per surface.
- Use existing test hooks (`window.__BBA_TEST_HOOKS__`, the workspace-injection helpers used by the Plan 30 spec) to put each modal into its opened state without relying on user-flow simulation through multiple screens.
- If any test fails because of a real bug (not a test-construction issue), stop and report. The fix is a separate packet.
- Write the Plan 31 progress report including the enumerated list and pass/fail per surface.

### Files and areas likely touched

- `tests/browser/modal-stability.spec.js` (new).
- `reports/development/plan-31-modal-stability-regression-suite/progress.md` (new).
- Possibly `src/ui/controls.js` or `src/ui/tutorialOverlay.js` if a narrow test hook is needed to open a modal without simulating a full user flow — keep any hook minimal, dev/test-only, and documented in the progress report. If the hook becomes large or load-bearing, stop and report (it's becoming a feature, not a test affordance).

### Out of scope

- Any production behavior change in modals.
- Adding new modals, modal styling, or modal accessibility wrappers.
- A focus-trap library, dialog component, or DOM-component refactor.
- Coverage for non-modal surfaces (level picker, blockly panel, etc.).
- Visual regression / screenshot comparison.
- Localization of modal copy.
- Dependency installs or build config changes.

## Work Plan

1. Enumerate every modal/overlay surface. Confirm the list with `rg` and DOM inspection. Document the list at the top of the progress report.
2. For each interactive surface, identify how to put it into its opened state from a Playwright test (test hook, user-flow step, or both). Note the chosen approach per surface in the progress report.
3. Write `tests/browser/modal-stability.spec.js` with one `test.describe` block per interactive surface, each running the stability matrix from Requirement 2.
4. Run the spec. Report pass/fail per surface in the progress report.
5. If a test fails because of a real bug (interval-driven re-render, missing focus management, broken close trigger), stop and surface it in the progress report. Do not fix in this packet.
6. Run `npm run test:browser` to confirm no other browser tests regress.
7. Write the progress report.

## Implementation Requirements

### Requirement 1: Surface enumeration

Required behavior:

- The progress report opens with a table listing every modal/overlay surface in the app. Columns: surface name, DOM selector, category (`interactive` / `decorative`), open trigger, close trigger, current focus-trap behavior (traps within / allows escape / N/A), test status.
- The enumeration is exhaustive. If any modal-like surface is unclear, document the ambiguity in the report rather than silently skipping it.

Constraints:

- Treat anything with `role="dialog"`, `aria-modal="true"`, or class names containing `modal`, `overlay`, `popup`, or `dialog` as a candidate. Verify against the known list and discard non-candidates with a one-line rationale.

Edge cases:

- Surfaces that exist only transiently (a toast or a brief error message) — enumerate them and note whether their lifetime is long enough to meaningfully test stability.
- Surfaces that render lazily (e.g. import modal that only exists once user clicks Import) — note the trigger needed to materialize them.

Expected artifact:

- Enumeration table in the progress report.

### Requirement 2: The stability matrix

Required behavior:

For each interactive surface, the spec exercises:

1. **Render stability across idle time.** Open the modal. Focus an interactive child (a button or input). Wait 1500 ms. Assert `document.activeElement` is still the same element. This catches interval-driven `innerHTML` rebuilds and external state churn that destroys focus. (1500 ms is chosen to exceed the welcome modal's 1000 ms emoji interval with margin.)

2. **Tab advances focus among interactive children.** From the first focusable child, press Tab. Assert focus advances to the next focusable child. Repeat through all focusable children. Note whether focus wraps to the first child (focus trap) or escapes the modal (no trap) — assert whichever is the *current* behavior, do not impose a preference.

3. **Shift+Tab retreats focus.** From any non-first focusable child, press Shift+Tab. Assert focus retreats to the previous focusable child.

4. **Form fields accept typed characters.** For any modal that contains an `<input type="text">` or `<input type="password">`, focus the input, type a known string, blur, assert the input's value is the typed string. The password fields in the export and import modals are the obvious cases.

5. **Enter activates the focused button.** Focus a button whose action has a deterministic observable side effect (e.g., the Cancel button closes the modal). Press Enter. Assert the side effect occurred.

6. **Close trigger works.** Trigger the modal's documented close action (Escape key, backdrop click, or explicit Cancel button — whichever applies). Assert the modal is no longer visible. If a modal has multiple close triggers, exercise each.

7. **Backdrop click closes (where applicable).** For modals with a backdrop element that has a `data-*-action="cancel"` attribute, click the backdrop and assert close.

Constraints:

- Waits are hook/class/attribute-based, not arbitrary sleeps. The 1500 ms wait in matrix item 1 is the one deliberate timing-based assertion and is necessary to catch interval-driven re-renders.
- Use `page.keyboard.press` rather than synthetic event dispatch.
- Use `expect(page.locator(...))` patterns from existing specs.
- For each surface, encode whether focus is trapped or escapes. Do not assume a preference.
- Do not test motion or visual styling.

Edge cases:

- A modal with zero focusable children (a pure confirmation toast) — skip Tab/Shift+Tab assertions for that surface and document the skip in the progress report.
- A modal whose close trigger requires a confirmation step — exercise the full close path.
- A modal that closes by mode/state transition (e.g. tutorial overlay closes when the level changes) — assert that path too if it's the primary close mechanism.

Expected artifact:

- One spec file with one `test.describe` per interactive surface, each running the seven applicable matrix items.

### Requirement 3: Decorative-surface handling

Required behavior:

- Decorative overlays (e.g. `#goal-burst-overlay`) are listed in the enumeration table as `decorative` with a one-line rationale and no test coverage.
- If an overlay's category is genuinely ambiguous, document the ambiguity and skip with a note rather than miscategorize.

Constraints:

- Do not add tests for decorative surfaces.
- Do not change ARIA attributes or visibility behavior of decorative surfaces.

Expected artifact:

- Entries in the enumeration table for any decorative surfaces found.

### Requirement 4: Bug-found policy

Required behavior:

- If a test fails because of a real bug, the spec records the failure, the progress report flags it explicitly in a "Bugs found" section, and the implementer stops without writing a fix.
- The progress report lists, for each failing assertion: the surface, the matrix item that failed, the observed vs expected behavior, and a one-line hypothesis about the cause.

Constraints:

- Do not skip or mark-as-expected-failure any failing assertion as a workaround. Failures are the deliverable for this packet — they identify follow-up work.
- Do not edit source files to make a failing test pass. That work belongs to a follow-up packet.

Edge cases:

- A test fails because of a test-construction issue (wrong selector, wrong open trigger) — that's not a bug, fix the test and document the iteration in the progress report.
- A test passes but with concerning behavior the implementer noticed (e.g. focus escapes the modal in a way that might confuse users) — note as an observation, not a bug.

Expected artifact:

- Clean separation in the progress report between "tests added," "bugs found," and "observations not blocking."

### Requirement 5: Test hook discipline

Required behavior:

- If a modal cannot be opened from Playwright with existing test hooks, the implementer adds a narrow test-only hook (e.g. `app.hooks.openProgramExportModalForTest`) under `window.__BBA_TEST_HOOKS__`. The hook is documented in the progress report.
- Hooks must be dev/test-oriented: minimal surface, no production behavior change, no impact on user-facing flows.

Constraints:

- Do not add hooks that expose new functionality. Hooks should only call existing exported open/close functions.
- If a hook would require structural changes to a modal's logic, stop and surface it for owner review.

Expected artifact:

- Any new hooks listed in the progress report with file paths and a one-line rationale.

## Model-Specific Instructions

- Start by enumerating modal surfaces. Confirm the list with `rg` before writing tests. Do not assume the known list is complete.
- Write the stability matrix once as a Playwright helper function (or shared `test.describe.fn` if the patterns align well), then invoke it per surface with surface-specific setup. Copy-paste of the same matrix across surfaces is acceptable if abstraction would obscure surface-specific quirks — implementer's judgment.
- Do not edit source files. The expected outcome of this packet is "tests added, bugs surfaced." If you find a bug, surface it in the progress report and stop.
- Run the spec frequently as you build it. The 1500 ms idle wait per surface adds up; consider grouping tests so the suite stays under a reasonable runtime (<2 minutes total).
- Stop and report if:
  - A modal cannot be opened from Playwright without a hook that would require structural source changes.
  - The stability matrix reveals more than two bugs (suggests modal management needs a packet of its own).
  - A modal's "current behavior" is itself buggy in a way that makes the matrix unimplementable (e.g. focus can never land on a modal child because the modal isn't actually focusable).

## Commands

Run from the repository root:

```powershell
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npm run test:browser
npm test
npm run build
```

## Validation Checklist

- [ ] Every modal/overlay surface in the app is enumerated in the progress report with its category, open trigger, close trigger, and focus-trap behavior.
- [ ] Decorative surfaces are listed with one-line rationales and no tests.
- [ ] Interactive surfaces each have a `test.describe` block in `tests/browser/modal-stability.spec.js` exercising the stability matrix.
- [ ] The 1500 ms idle-focus assertion is present per interactive surface.
- [ ] Tab and Shift+Tab assertions reflect each surface's *current* focus behavior, not an imposed preference.
- [ ] Form-field typing assertions are present for any modal with text/password inputs.
- [ ] Enter-activates-button assertions are present per interactive surface.
- [ ] Close-trigger assertions exercise each documented close path per surface.
- [ ] Test hooks are narrow, dev/test-only, and documented (or absent — also documented).
- [ ] No source files were modified (or, if a narrow test hook was added, it's documented and minimal).
- [ ] `npx playwright test tests/browser/modal-stability.spec.js` runs. Pass/fail per surface is documented in the progress report.
- [ ] `npm run test:browser` passes for all other specs (no regression in unrelated tests).
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report has three clear sections: tests added, bugs found (if any), observations not blocking.

## Stop Conditions

Stop and report for integration-owner review if:

- A modal surface cannot be opened from Playwright without a structural source change.
- The stability matrix reveals more than two bugs across the modal set — that suggests a systemic modal-management problem and needs its own packet rather than scattered fixes.
- A modal's current behavior is internally inconsistent in a way that makes the matrix unimplementable.
- A test would need to assert non-deterministic behavior to pass (e.g. focus depends on user-agent quirks) — surface the ambiguity rather than baking in fragility.
- A new test hook would require more than ~10 lines of production code, exposing internal state or new functionality.
- Implementation requires dependency installs, deployment, or repository settings changes.
