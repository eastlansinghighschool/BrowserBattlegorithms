# Plan 07 Progress Report

## Summary

Implemented the revised private Free Play program file flow:

- Guided levels no longer show program import/export controls.
- Free Play now uses one compact export button and one compact import button.
- Export opens a modal with normal XML export or private export.
- Private export uses browser Web Crypto with PBKDF2 + AES-GCM and writes a JSON file.
- Import uses one file picker for both XML and private JSON files.
- Private imports prompt for a password and optionally allow editing after import.
- The browser test harness now exposes a direct `sendKey` hook so the guided keyboard-practice test is stable under parallel browser runs.

The packet doc was updated to match the new one-modal / one-import-path UX.

## Files Changed

- [docs/development/plan-07-private-free-play-program-files.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/plan-07-private-free-play-program-files.md)
- [index.html](C:/Codex/BrowserBattlegorithms_CODEX/index.html)
- [src/assets/styles/style.css](C:/Codex/BrowserBattlegorithms_CODEX/src/assets/styles/style.css)
- [src/crypto/privateProgramFile.js](C:/Codex/BrowserBattlegorithms_CODEX/src/crypto/privateProgramFile.js)
- [src/main.js](C:/Codex/BrowserBattlegorithms_CODEX/src/main.js)
- [src/ui/blocklyPanel.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/blocklyPanel.js)
- [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js)
- [tests/browser/guided-play.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/browser/guided-play.spec.js)
- [tests/browser/persistence.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/browser/persistence.spec.js)

## Artifacts

- None beyond the updated report itself.

## Validation

- `node --test --test-isolation=none tests/unit/private-program-file.test.js` - passed
- `npm test` - passed
- `npm run build` - passed with the repo's existing Blockly chunk-size warnings
- `npx playwright test tests/browser/persistence.spec.js --reporter=line` - passed
- `npx playwright test tests/browser/guided-play.spec.js --reporter=line` - passed
- `npm run test:browser` - passed

## Notes

- The private file format is intentionally privacy friction, not strong protection against browser inspection.
- Guided levels stay free of program import/export controls.
- The normal XML flow remains available in Free Play.
- The import path is intentionally unified: one file picker handles both XML and private JSON.
