# Plan 30 Progress Report: Global Key-Capture Bugfix

## Summary

Fixed the p5 window-level keyboard callback in `src/render/p5App.js` so the app only cancels the browser default action when `handleKeyInput(app, p.key)` actually consumed a player binding, and never when Ctrl/Alt/Meta is held. This restores native browser and Blockly keyboard behavior without changing any keybinding or turn-engine logic.

## Root Cause Restated

`p.keyPressed` had been returning `false` unconditionally, which caused p5 to call `event.preventDefault()` for every key on the page. That suppressed Blockly text entry, Tab navigation, focused-button activation, range-slider arrows, browser shortcuts, and other native keyboard behavior. `handleKeyInput` already had the right boolean contract, so the fix was to thread that result back through p5 and pass modifier-decorated keys through untouched.

## Files Changed

- [`src/render/p5App.js`](C:/AI/BrowserBattlegorithms/src/render/p5App.js)
- [`tests/unit/keyboard-input.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/keyboard-input.test.js)
- [`tests/browser/key-capture-passthrough.spec.js`](C:/AI/BrowserBattlegorithms/tests/browser/key-capture-passthrough.spec.js)
- [`tests/browser/guided-play.spec.js`](C:/AI/BrowserBattlegorithms/tests/browser/guided-play.spec.js)
- [`package.json`](C:/AI/BrowserBattlegorithms/package.json)
- [`docs/development/README.md`](C:/AI/BrowserBattlegorithms/docs/development/README.md)

## Subsystem Notes

- [`docs/subsystems/turn-engine.md`](C:/AI/BrowserBattlegorithms/docs/subsystems/turn-engine.md) did not need a content change. Its human-input section already read correctly after the fix.
- [`docs/subsystems/ui-mode-contract.md`](C:/AI/BrowserBattlegorithms/docs/subsystems/ui-mode-contract.md) was not changed.

## Validation

### Unit

- `node --test --test-isolation=none tests/unit/keyboard-input.test.js`
  - Passed.
- `npm test`
  - Passed.
  - Full unit count: `115/115`.

### Browser

- `npx playwright test key-capture-passthrough.spec.js --reporter=line --config=.tmp.playwright.config.mjs`
  - Passed.
  - New browser coverage count: `8/8`.
- `npx playwright test --reporter=line --config=.tmp.playwright.config.mjs`
  - Passed.
  - Full browser count: `80/80`.

### Build

- `npm run build`
  - Passed.
  - Existing Blockly chunking warnings remain unchanged.

## Manual Smoke

- `npm run dev` + F12 to open devtools: not performed in this headless-only toolchain.
- `npm run dev` + Ctrl+R refresh: not performed in this headless-only toolchain.
- Free Play `VALUE_NUMBER` typing and blur: verified automatically in Playwright via Blockly field editing.
- Tab traversal from the page body: verified automatically in Playwright.

## Notes

- The new browser spec verifies:
  - Blockly number fields accept typed digits again.
  - Tab advances focus through the page.
  - Enter activates a focused button.
  - Arrow keys still adjust the speed slider.
  - Non-binding keys do not trigger player actions.
  - Modifier-decorated binding keys do not trigger player actions.
  - P1 and P2 binding keys still queue actions.
- The existing `tests/browser/guided-play.spec.js` keyboard-practice coverage was stabilized with an explicit focus nudge before the keypress, and it still passes.

## Remaining Risk

- Manual GUI smoke for F12 and Ctrl+R remains unverified in this environment because only headless browser automation is available here. The automated browser suite covers the keyboard regression paths that were failing.
