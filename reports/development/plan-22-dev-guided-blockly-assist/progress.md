# Plan 22 Progress Report

## Summary

Implemented the Plan 22 repair for local-dev guided deep links by adding a dev-only wide guided layout, opening the first toolbox category automatically, and using a one-shot clamped Blockly scroll so the starter `On Each Turn` block stays visible to the right of the drawer in a way that passes the actual `1280x720` browser geometry check.

### What changed

- Added explicit dev-guided Blockly assist state to the app state and dev deep-link helper.
- Tied the assist to valid local-dev `devGuidedLevel` activation only.
- Applied a dev-only wide guided layout that keeps the lesson panel visible and expands the Blockly column in the assisted path.
- Opened the first toolbox category automatically during the assisted guided startup path.
- Revealed the starter guided workspace block with a one-shot, clamped Blockly scroll after the wide layout settles.
- Kept saved workspace paths, guided progression, and production builds untouched.
- Updated the Blockly workspace subsystem note to describe the new local-dev assist behavior.
- Added/updated focused unit coverage for dev-link gating and assist state.
- Added/updated focused browser coverage for dev-link startup behavior.

### Validation

- `node --test --test-isolation=none tests/unit/dev-guided-level-link.test.js`
- `npx playwright test tests/browser/dev-guided-level-link.spec.js --reporter=line`
- `npm test`
- `npm run test:browser`
- `npm run build`

### Notes

- Plan 06 Gemini prompt and level-context files did not need edits after review; there were no stale “open the toolbox first” directions to correct.
- The Playwright browser test now asserts the real `blockRect.left > flyoutRect.right + 8` and `blockRect.right <= blocklyRect.right - 8` geometry promise at `1280x720`, plus the board container/canvas bounds.
- The assist is one-shot, local-dev only, and does not mutate guided unlock progress or production output.
- The wide-layout class reads true with `docs/subsystems/blockly-workspace.md`; the note was updated to reflect the clamped scroll-based assist instead of the older timeout-heavy nudge wording.
- Post-fix geometry at `1280x720`:
  - `#blocklyDiv`: left `752`, right `1512`, width `760`
  - flyout: left `866`, right `1064.796875`, width `198.796875`
  - `On Each Turn`: left `1088.796875`, right `1200.247802734375`, width `111.450927734375`
  - `#canvas-container`: left `-203`, right `403`, width `606`
  - canvas: left `-200`, right `400`, width `600`
- Normal Guided Levels and Free Play were rechecked by the full browser suite and continued to pass unchanged.

### Files changed

- `src/core/state.js`
- `src/ui/devGuidedLevelLink.js`
- `src/ui/levels.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/dev-guided-level-link.test.js`
- `tests/browser/dev-guided-level-link.spec.js`
- `tests/browser/guided-ui.spec.js`
- `src/assets/styles/style.css`
- `docs/subsystems/blockly-workspace.md`
- `docs/development/README.md`

### Remaining risk

- The assist still relies on Blockly scroll/layout settling once during startup, but the browser test now exercises the exact drawer-vs-block spacing requirement and the full browser suite passed.
