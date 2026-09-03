# Plan 118 Progress Report: Embedded and Blocked Storage Resilience

## Status Summary

- **Plan**: `docs/development/plan-118-embedded-storage-resilience.md`
- **State**: Completed, validated, and ready for integration
- **Advisor Disposition**: Branch C (orchestrator-gate-only). Antigravity provider is unlisted in `advisor-capable-providers.json`; full verification is performed inline and gated by orchestrator review.

---

## What Changed

1. **Safe Storage Platform Adapter (`src/platform/safeStorage.js`)**:
   - Implemented exception-safe web storage accessors: `isLocalStorageAvailable()`, `readLocalStorage(key)`, `writeLocalStorage(key, value)`, `removeLocalStorage(key)`, `clearLocalStorage()`, and `setStorageForTesting(storageLike)`.
   - Wrapped all access to `window.localStorage` property inside `try/catch` to guard against `SecurityError` thrown when cross-origin embedding policies (e.g. Chrome's `BlockThirdPartyCookies`) restrict storage access.
   - Performs a round-trip probe (`__bba_storage_probe__`) memoized per session.
   - Distinguishes quota errors (`QuotaExceededError`) from restricted storage: quota errors do not classify storage as blocked (see Quota Gap Disclosure below).
   - Single-log warning deduplication (`warnOnce`).

2. **Call-Site Migrations (R2)**:
   - `src/ai/blockly/workspace.js`: Migrated `getStoredWorkspaceXmlText`, `saveWorkspaceToLocalStorage`, and `resetWorkspaceToCurrentStarter` to use `readLocalStorage`, `writeLocalStorage`, and `isLocalStorageAvailable`.
   - Guided In-Memory Fallback: Introduced module-level `guidedInMemoryWorkspaces` Map to persist guided level and project shared workspaces during the session when storage is blocked.
   - `src/core/levels.js`: Replaced `hasBrowserLocalStorage()` and direct `window.localStorage` calls with `readLocalStorage` and `writeLocalStorage`. When storage is unavailable or throws, defaults to initial level progress (Level 0 available, all subsequent locked) without fabricating unlocks.
   - `src/ui/preferences.js`: Migrated `loadPreference` and `savePreference` to safe storage, maintaining legacy key migration and preserving the local `setCustomStorage` test seam.
   - `src/ui/blocklyLayout.js`: Migrated `getStoredBlocklyPanelSize` and `setBlocklyPanelSize` to safe storage.
   - `src/ui/levels.js`: Migrated `getStoredLessonPanelCollapsed` and toggle panel collapse handler.
   - `src/ui/projectSignifiers.js`: Removed local `getStorage()` and migrated `hasSeenProjectStartCallout` and `dismissProjectStartCallout`.
   - `src/ui/tutorialOverlay.js`: Migrated `getStoredTutorialSeen` and `saveStoredTutorialSeen`.
   - `src/ui/voiceNarration.js`: Removed unused `hasWindowStorage()`.

3. **Student-Facing Warning Banner (R4)**:
   - Added `#storage-status` in `index.html` in `#blockly-region` directly above the status messages and toolbar.
   - Warning styling added in `src/assets/styles/components/base.css` with `.workspace-import-status-warning` and `.storage-status-dismiss`.
   - Render logic in `src/ui/blocklyPanel.js` toggles visibility based on `!isLocalStorageAvailable() && !app.state.storageNoticeDismissed`.
   - Dismiss handler in `src/ui/controls.js` sets `app.state.storageNoticeDismissed = true` and hides the element.
   - Student message: *"This browser is blocking saving. You can keep playing, but your program will be lost if you reload or close this tab."*

4. **Architecture & Documentation**:
   - `AGENTS.md`: Added `src/platform/` to "Where Things Live".
   - `docs/ARCHITECTURE.md`: Documented `src/platform/` role.
   - `docs/subsystems/blockly-workspace.md`: Added Plan 118 storage resilience and in-memory fallback section.
   - `docs/subsystems/ui-mode-contract.md`: Documented storage blocked warning banner.

---

## Probe Verification (Note 1)

### Pre-Packet Reproduction Command & Output
Command executed before code changes:
```bash
node -e "import('./src/ai/blockly/workspace.js').then(({ saveWorkspaceToLocalStorage }) => { globalThis.window = { get localStorage() { const err = new Error('SecurityError: access denied'); err.name = 'SecurityError'; throw err; } }; const app = { blocklyWorkspace: { getAllBlocks: () => [] }, state: { currentModeView: 'GUIDED_LEVELS', currentLevelId: 'level-01', levels: [{ id: 'level-01' }], freePlayPrograms: {} } }; try { saveWorkspaceToLocalStorage(app); console.log('DID NOT THROW'); } catch (e) { console.log('THREW AS EXPECTED:', e.name, e.message); } });"
```
Actual Output:
```text
THREW AS EXPECTED: SecurityError SecurityError: access denied
```

### Post-Packet Verification Command & Output
Command executed on completed implementation:
```bash
node -e "Promise.all([import('blockly'), import('./src/ai/blockly/workspace.js')]).then(([Blockly, { saveWorkspaceToLocalStorage }]) => { globalThis.window = { get localStorage() { const err = new Error('SecurityError: access denied'); err.name = 'SecurityError'; throw err; } }; const ws = new Blockly.Workspace(); const app = { blocklyWorkspace: ws, state: { currentModeView: 'GUIDED_LEVELS', currentLevelId: 'level-01', levels: [{ id: 'level-01' }], freePlayPrograms: {} } }; try { saveWorkspaceToLocalStorage(app); console.log('DID NOT THROW'); } catch (e) { console.log('THREW AS EXPECTED:', e.name, e.message); } });"
```
Actual Output:
```text
[safeStorage] Access to window.localStorage was denied: Error [SecurityError]: SecurityError: access denied
    at get localStorage ([eval]:1:185)
    at getRawStorage (file:///C:/AI/BrowserBattlegorithms/src/platform/safeStorage.js:43:19)
    at isLocalStorageAvailable (file:///C:/AI/BrowserBattlegorithms/src/platform/safeStorage.js:83:15)
    at saveWorkspaceToLocalStorage (file:///C:/AI/BrowserBattlegorithms/src/ai/blockly/workspace.js:1021:8)
    at [eval]:1:477
DID NOT THROW
```

---

## Quota Gap Disclosure (Note 2)

Per requirement R1, `isLocalStorageAvailable()` distinguishes storage quota exhaustion (`QuotaExceededError` or name containing `Quota`) from enterprise/iframe storage denial (`SecurityError`).
- When a storage quota is exceeded, `isLocalStorageAvailable()` returns `true`.
- The storage-blocked banner (`#storage-status`) does **not** fire because storage access is not blocked by browser policy.
- However, individual writes to `localStorage` will fail and return `false`.
- **Known limitation**: In the event a device's browser profile exceeds its disk/origin quota, edits will fail to persist to `localStorage` without triggering the storage-blocked banner. This distinction is intentional so that benign quota edges do not falsely claim to students that their browser is blocking storage.

---

## Banner Behavior Analysis (Note 3)

### (a) Coexistence with Transient Action Messages
`#storage-status` is placed in `#blockly-region` directly above `#workspace-import-status` and `#usage-export-status`.
- All three elements are independent sibling DOM nodes.
- Displaying or hiding transient import/export status messages does not modify `#storage-status`.
- Because `#storage-status` is positioned above the transient elements and rendered on page load, its visual space is reserved/established early, preventing layout jumps or shifting while a student is reading either notice.

### (b) Screen-Reader Live Region (`role="status"`) Behavior
`renderBlocklyPanel(app)` is invoked on each UI synchronization pass.
- In `renderBlocklyPanel`, the banner element's text is static markup in `index.html`.
- The render loop only adjusts `storageStatus.hidden = !shouldShow;` and never mutates `storageStatus.textContent` or child nodes.
- Screen-reader implementations trigger announcements for `role="status"` live regions upon subtree content mutations. Because the text is static and only the boolean `hidden` property is maintained, screen readers announce the warning once when it appears and do not repeatedly re-announce it on every UI tick.

---

## Required Addition Verification

`tests/unit/guided-progress.test.js` was extended with a dedicated test:
- Configures a throwing storage stub simulating strict policy denial.
- Calls `initializeLevelState(app)`: asserts it does not throw, level 0 is `AVAILABLE`, and all subsequent levels remain strictly `LOCKED`.
- Completes level 0 via `completeLevel`: asserts writing progress does not throw and does not report false success.
- Re-initializes state in a new app instance: asserts the new instance still returns the clean default locked state, proving no unlocks were persisted or fabricated.

---

## Test and Validation Results

- `tests/unit/safe-storage.test.js`: 6/6 passed.
- `tests/unit/blockly-workspace.test.js`: 31/31 passed (including regression proof and guided in-memory fallback tests).
- `tests/unit/guided-progress.test.js`: 8/8 passed (including required throwing storage progression test).
- `tests/unit/preferences.test.js`: 9/9 passed.
- `tests/browser/storage-resilience.spec.js`: 1/1 passed in Playwright (verified banner appearance and dismissal under injected SecurityError).
- `npm test`: 571/571 passed across entire repository suite.
- `npm run build`: Vite production build passed cleanly.
- `npm run test:browser:smoke`: 61/61 smoke tests passed.
- Direct search `rg "window.localStorage" src/` matches solely `src/platform/safeStorage.js`.

---

## Files Changed

- `src/platform/safeStorage.js` (NEW)
- `tests/unit/safe-storage.test.js` (NEW)
- `tests/browser/storage-resilience.spec.js` (NEW)
- `package.json`
- `src/ai/blockly/workspace.js`
- `src/core/levels.js`
- `src/ui/blocklyLayout.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/ui/levels.js`
- `src/ui/preferences.js`
- `src/ui/projectSignifiers.js`
- `src/ui/tutorialOverlay.js`
- `src/ui/voiceNarration.js`
- `src/assets/styles/components/base.css`
- `index.html`
- `tests/unit/blockly-workspace.test.js`
- `tests/unit/guided-progress.test.js`
- `tests/unit/preferences.test.js`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `reports/development/plan-118-embedded-storage-resilience/progress.md` (NEW)

---

## Remaining Risks

- No remaining technical blockers or contract drift.
- Behavior under blocked storage has been fully verified in both unit test harnesses and headless Chrome browser runs.
- Ready for orchestrator review and integration.
