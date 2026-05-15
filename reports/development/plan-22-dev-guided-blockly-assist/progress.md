# Plan 22 Progress Report

## Summary

Implemented the final Plan 22 repair for local-dev guided deep links by switching the dev-only assist to a viewport-fitting layout, scaling the board visually, and keeping the starter `On Each Turn` block visible inside Blockly without causing page-wide horizontal overflow at `1280x720`.

### What changed

- Added explicit dev-guided Blockly assist state to the app state and dev deep-link helper.
- Tied the assist to valid local-dev `devGuidedLevel` activation only.
- Replaced the previous wide/max-content assist layout with a dev-only viewport-fitting grid.
- Scaled the board visually inside the assisted path so the canvas and instructions remain fully visible without cropping.
- Kept the lesson panel visible while giving Blockly the remaining width.
- Opened the first toolbox category automatically during the assisted guided startup path.
- Re-tuned the starter guided workspace x-position and kept a one-shot clamped Blockly scroll so `On Each Turn` clears the flyout while staying inside `#blocklyDiv`.
- Kept saved workspace paths, guided progression, and production builds untouched.
- Updated the Blockly workspace subsystem note to describe the new viewport-fitting local-dev assist behavior.
- Added/updated focused unit coverage for dev-link gating and assist state.
- Added/updated focused browser coverage for dev-link startup behavior and viewport containment.

### Validation

- `node --test --test-isolation=none tests/unit/dev-guided-level-link.test.js`
- `npx playwright test tests/browser/dev-guided-level-link.spec.js --reporter=line`
- `npm test`
- `npm run test:browser`
- `npm run build`

### Notes

- The Playwright browser test now asserts the real geometry promise at `1280x720`: the page fits the viewport, the lesson panel remains visible, the canvas stays inside its container, and `On Each Turn` clears the flyout while staying inside Blockly.
- Final measured geometry at `1280x720`:
  - `documentElement.scrollWidth`: `1280`
  - `window.innerWidth`: `1280`
  - `#game-container`: left `0`, right `1280`, width `1280`
  - `#canvas-container`: left `13`, right `469`, width `456`
  - canvas: left `16`, right `466`, width `450`
  - lesson panel: left `484`, right `746`, width `262`
  - `#blockly-region`: left `762`, right `1280`, width `518`
  - `#blocklyDiv`: left `778`, right `1264`, width `486`
  - flyout: left `892`, right `1090.796875`, width `198.796875`
  - `On Each Turn`: left `1114.796875`, right `1226.247802734375`, width `111.450927734375`
- Normal Guided Levels and Free Play were rechecked by the full browser suite and continued to pass unchanged.

### Files changed

- `src/core/state.js`
- `src/ui/devGuidedLevelLink.js`
- `src/ui/levels.js`
- `src/ai/blockly/workspace.js`
- `src/assets/styles/style.css`
- `tests/unit/dev-guided-level-link.test.js`
- `tests/browser/dev-guided-level-link.spec.js`
- `tests/browser/guided-ui.spec.js`
- `docs/subsystems/blockly-workspace.md`
- `docs/development/README.md`

### Remaining risk

- The assist still relies on a single Blockly scroll after layout settles, but the browser test now exercises the exact drawer-vs-block spacing requirement and the full browser suite passed.
