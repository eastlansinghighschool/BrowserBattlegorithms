# Plan 30 Follow-up: Welcome Modal Focus-Pull

## Summary

Fixed the welcome modal so the periodic emoji animation no longer rebuilds the entire overlay every second. The interval now updates only the emoji text nodes when the modal is already present, which keeps keyboard focus on the "Guided Levels" / "Free Play" buttons instead of dropping back to `document.body`.

## Cause

`renderTutorialOverlay(app)` used to be called every second while `showModePicker` was true. That function replaces `overlay.innerHTML`, so it was destroying and recreating the modal buttons on every tick. Any button with focus lost that focus during the next repaint.

## Diff Summary

- Added stable emoji markers to the welcome modal markup in [`src/ui/tutorialOverlay.js`](C:/AI/BrowserBattlegorithms/src/ui/tutorialOverlay.js).
- Changed the interval handler to toggle the emoji frame and update just the emoji text content when those nodes already exist.
- Left the active tutorial render path unchanged.
- Added a Playwright regression test in [`tests/browser/key-capture-passthrough.spec.js`](C:/AI/BrowserBattlegorithms/tests/browser/key-capture-passthrough.spec.js) that tabs to "Guided Levels", waits longer than the interval, and confirms focus stays put while the emoji strip still contains visible content.
- Kept the broader binding-key coverage in the earlier guided-play and free-play browser tests rather than duplicating it here.

## Validation

- `npx playwright test key-capture-passthrough.spec.js --reporter=line --config=.tmp.playwright.config.mjs`
  - Passed, `7/7` after trimming the follow-up back to the modal focus-retention check.
- `npx playwright test --reporter=line --config=.tmp.playwright.config.mjs`
  - Passed, `79/79`.
- `npm test`
  - Passed, `115/115`.
- `npm run build`
  - Passed, existing Blockly chunking warnings unchanged.

## Notes

- The unrelated Level 24 tutorial demo test in [`tests/browser/guided-play.spec.js`](C:/AI/BrowserBattlegorithms/tests/browser/guided-play.spec.js) remains in place from the earlier packet and still passes.
- Manual smoke of the 2-second focus-retention behavior was not performed in this headless-only environment, but the browser regression now covers the exact failure mode.
