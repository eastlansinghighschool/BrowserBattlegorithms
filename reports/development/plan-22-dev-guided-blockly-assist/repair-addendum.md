# Plan 22 Repair Addendum: Dev-Guided Wide Blockly Layout

## Status

Plan 22 should be treated as **not complete until this repair lands**.

The first implementation successfully activates dev-guided assist state and opens the first Blockly toolbox category, but integration review found that the core geometry promise is not met at a `1280x720` viewport: the `On Each Turn` block can still overlap the open flyout.

Do not create a Plan 23 for this. This is repair work for Plan 22's original requirement.

## Repair Goal

When a valid local-dev `devGuidedLevel` shortcut is active, the page should give Blockly enough horizontal room that:

- the first toolbox category opens by default
- the required `On Each Turn` starter block is visible to the right of the open flyout
- the directions/lesson panel remains visible and expanded
- normal student-facing layouts remain unchanged

## Required Approach

Prefer a dev-only wide Blockly layout over fragile workspace translation.

1. Add or reuse explicit dev-guided layout state from the existing `devGuidedLevel` activation path.
2. Apply a dev-only class to the page/layout when valid `devGuidedLevel` mode is active.
3. In that class, shrink the simulation/game-board area enough to widen the Blockly column.
4. Keep the directions/lesson panel visible; do not auto-collapse it.
5. Keep Free Play and normal Guided Levels unchanged.
6. Keep the first-toolbox-category auto-open behavior from the first Plan 22 implementation.
7. Remove or reduce the timeout-based workspace translation if the wide layout makes it unnecessary.

The intent is to solve the space problem at the page layout level, not by repeatedly nudging Blockly's internal transform after startup.

## Screen-Width Policy

Validate the repair for the Plan 06 browser-agent workflow, not for all Chromebook responsive cases.

- Required viewport: `1280x720`
- Optional smoke viewport: `1366x768`
- Do not require special `800px` behavior in this repair.
- Do not auto-hide directions on small screens.

Small-screen classroom UX is a separate student-facing responsive-design question and should not be mixed into this Plan 22 repair.

## Test Requirement

The browser test must assert the actual geometry promise.

In the assisted `devGuidedLevel` startup path, assert something equivalent to:

```js
expect(blockRect.left).toBeGreaterThan(flyoutRect.right + 8);
```

Do not calculate `blockRightOfFlyout` and leave it unused. The test name and assertions must agree.

Also keep or add checks that:

- valid local-dev `devGuidedLevel` activates assist state
- missing/invalid links do not activate assist state
- first toolbox category is selected/open
- normal startup does not use the dev-guided wide layout
- production build still passes

## Suggested Sequencing

1. Reproduce the current failure at `1280x720` using a direct browser smoke or Playwright geometry assertion.
2. Add the dev-guided layout class and CSS.
3. Ensure the class is applied only for valid local-dev `devGuidedLevel` startup.
4. Re-run the geometry check.
5. Adjust CSS until `On Each Turn` clears the flyout without hiding the lesson panel.
6. Replace the weak browser assertion with the real geometry assertion.
7. Run targeted tests.
8. Run broader required validation.
9. Update `reports/development/plan-22-dev-guided-blockly-assist/progress.md` with the repair notes.
10. Mark Plan 22 complete in `docs/development/README.md` only after the real geometry assertion passes.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/dev-guided-level-link.test.js
npx playwright test tests/browser/dev-guided-level-link.spec.js --reporter=line
npm test
npm run build
```

Run `npm run test:browser` if the CSS/layout change appears likely to affect broader browser behavior.

## Stop Conditions

Stop and report if:

- the repair requires changing normal student-facing layout
- the repair hides or collapses the directions panel by default
- the repair requires changing Blockly semantics, toolbox contents, or level definitions
- the real geometry assertion remains flaky after moving the fix to page layout
- the only passing solution depends on arbitrary long timeouts
- production/static build behavior changes

## Handoff Note

The existing Plan 22 progress report should not be treated as final. Add a repair section or replacement summary after completing this addendum, including:

- the exact layout change made
- whether timeout-based workspace translation remains
- geometry evidence at `1280x720`
- commands run
- any remaining Gemini/browser-agent interaction risks
