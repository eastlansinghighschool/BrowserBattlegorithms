# Plan 40 Progress Report

## Summary

Plan 40 integrated Blockly's official keyboard-navigation plugin into the live workspace while preserving existing game/UI keyboard behavior. The app now supports Blockly focus-scoped keyboard navigation, shortcut help, keyboard block insertion, and field editing without reviving the global key-capture bug fixed in Plan 30.

Installed dependency:

- `@blockly/keyboard-navigation@3.0.5`

## Files Changed

- [package.json](/C:/AI/BrowserBattlegorithms/package.json)
- [package-lock.json](/C:/AI/BrowserBattlegorithms/package-lock.json)
- [src/core/state.js](/C:/AI/BrowserBattlegorithms/src/core/state.js)
- [src/ai/blockly/workspace.js](/C:/AI/BrowserBattlegorithms/src/ai/blockly/workspace.js)
- [src/render/p5App.js](/C:/AI/BrowserBattlegorithms/src/render/p5App.js)
- [index.html](/C:/AI/BrowserBattlegorithms/index.html)
- [tests/browser/key-capture-passthrough.spec.js](/C:/AI/BrowserBattlegorithms/tests/browser/key-capture-passthrough.spec.js)
- [tests/browser/blockly-keyboard-navigation.spec.js](/C:/AI/BrowserBattlegorithms/tests/browser/blockly-keyboard-navigation.spec.js)
- [docs/subsystems/blockly-workspace.md](/C:/AI/BrowserBattlegorithms/docs/subsystems/blockly-workspace.md)
- [docs/subsystems/p5-surface-map.md](/C:/AI/BrowserBattlegorithms/docs/subsystems/p5-surface-map.md)
- [docs/development/plan-40-blockly-keyboard-navigation.md](/C:/AI/BrowserBattlegorithms/docs/development/plan-40-blockly-keyboard-navigation.md)
- [docs/development/README.md](/C:/AI/BrowserBattlegorithms/docs/development/README.md)

## What Changed

- Registered Blockly keyboard-navigation styles before workspace injection and created the keyboard-navigation instance after injection.
- Added the required `#shortcuts` host element in `index.html`.
- Preserved focus-scoped gameplay input by teaching the p5 key handler to stand down when focus is inside Blockly-owned surfaces.
- Verified keyboard navigation can:
  - open the shortcut help surface with `/`
  - reach the toolbox
  - insert a movement block
  - commit the insertion
  - return to the workspace
  - edit a dropdown field with the keyboard
- Added regression coverage showing Blockly focus does not queue a human runner action while a turn is awaiting input.
- Updated subsystem notes so the Blockly workspace and p5 keyboard contract now describe the new focus ownership boundary.

## Validation

- `node --test --test-isolation=none tests/unit/blockly-interpreter.test.js tests/unit/display-and-controls.test.js tests/unit/keyboard-input.test.js` - passed
- `npx playwright test tests/browser/blockly-keyboard-navigation.spec.js --reporter=line` - passed, `3/3`
- `npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line` - passed, `9/9`
- `npm test` - passed, `238/238`
- `npm run build` - passed, with the existing Blockly chunking warnings still present

## Notes

- The plugin's static `registerNavigationDeferringToolbox()` helper in the package root appears to be broken, so the integration uses a local no-op toolbox wrapper plus `registerFlyoutCursor()` to preserve keyboard navigation without destabilizing the existing toolbox.
- Plan 22's dev-guided Blockly assist remains intact; the new keyboard-navigation focus rules only changed the surfaces that Blockly itself owns.
