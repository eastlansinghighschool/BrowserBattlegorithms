# Plan 10 Progress Report

## Summary

Implemented the project signifiers required by Plan 10.

- Guided level picker now shows a distinct project badge for project levels.
- Project start levels show a one-time workspace callout near the Blockly panel.
- Project levels show a quiet persistent project indicator in the lesson panel.
- Project challenge capstones continue to show both project and challenge framing.
- L32 `escort-the-carrier` now shows a special note about the carrier start state.

## Files Changed

- `src/ui/projectSignifiers.js`
- `src/ui/levels.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/assets/styles/style.css`
- `tests/unit/display-and-controls.test.js`
- `tests/browser/guided-ui.spec.js`

## Validation

- `node --test --test-isolation=none tests/unit/display-and-controls.test.js tests/unit/guided-level-contracts.test.js`
- `npm test`
- `npx playwright test --reporter=line`
- `npm run build`

## Notes

- The project-start callout is stored per project in localStorage so dismissal is one-time per project.
- Existing unrelated worktree changes were left untouched.
