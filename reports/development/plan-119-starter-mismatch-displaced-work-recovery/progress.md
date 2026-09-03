# Plan 119: Starter Mismatch Displaced-Work Recovery - Progress Report

**Date**: 2026-09-02  
**Packet ID**: `plan-119`  
**Status**: Ready for Orchestrator Review  
**Advisor Consultation Mode**: Branch C (Not advisor-capable / Orchestrator-gate-only mode)

---

## 1. Overall Summary

Plan 119 stops the Plan 45 starter mismatch replacement from acting as an unrecoverable silent deletion of student code. Before the corrected starter overwrites a guided level's stored workspace, the student's program is preserved in a bounded recovery slot (`bba:displaced-workspace:<levelId>`) and indexed in `bba:displaced-workspace-index`. A non-blocking notice informs the student that starting blocks were updated and provides a one-click "Restore earlier program" action that restores their XML and re-stamps the current starter version key so subsequent visits do not re-replace it.

All storage mutations are routed through `src/platform/safeStorage.js` with fail-safe write and read-back verification at every step. If writing or verifying the recovery slot fails, preservation-failure safety retains and loads the earlier program, marks the level as preservation-blocked in memory to suppress version stamping on subsequent saves, and presents an honest failure notice without claiming a recovery copy exists.

All five owner approval gate items and review requirements were cleared and implemented verbatim.

---

## 2. Gate Resolutions (Approved by Owner)

1. **Recovery UX Shape**: Non-blocking notice in `#blockly-region` above the toolbar (`#displaced-workspace-status`) with a restore button, shown only when an un-restored displaced copy exists for the current guided level.
2. **Notice & Action Copy (Verbatim)**:
   - Notice: `"This level's starter program was updated, so your earlier program was set aside."`
   - Restore Button: `"Restore earlier program"`
   - Note: Uses the established application term *"starter program"* matching `index.html:133`.
3. **Retention Cap & Pruning**:
   - `MAX_DISPLACED_WORKSPACES = 8` entries across all levels.
   - Pruned oldest-first by `displacedAt`.
   - One slot maximum per level (newer displacement replaces older).
   - Defunct or unknown level IDs are pruned cleanly without throwing.
4. **Reversibility of Restore**:
   - Under Gate 4 resolution, the displaced recovery slot in storage is **never explicitly deleted** upon restore. It survives until superseded by a newer displacement on that level or pruned by the cap. It is not cleared on student edit or cosmetic drags (preventing block-drag events from discarding the safety net).
5. **Failure Copy (Verbatim)**:
   - Preservation failure: `"Could not save a recovery copy, so your earlier program was kept and this level's starter program was not updated."`
   - Restore failure: `"Could not restore your program right now. Your saved copy is still safe and your current blocks were not changed."`

---

## 3. Falsification & Regression Pair Results

### Pre-Packet Falsification Proof
- **Premise**: In pre-packet code (`src/ai/blockly/workspace.js:991-1002`), `getStoredWorkspaceXmlText()` directly executed `writeLocalStorage(storageKey, fallbackXml)` on a starter version mismatch without saving the student's program anywhere.
- **Observed Result**: Seeding `bba:guided-workspace:prediction-06` with `STORED_XML` and `bba:guided-workspace-version:prediction-06` with `"deadbeef"` resulted in `STORED_XML` being permanently replaced with `STARTER_XML` in storage. No displaced slot (`bba:displaced-workspace:prediction-06`) was created, and `STORED_XML` was completely destroyed.

### Post-Packet Preservation & Recovery Proof
- **Observed Result**: Under Plan 119:
  1. `getStoredWorkspaceXmlText()` preserves `STORED_XML` into `bba:displaced-workspace:prediction-06` with metadata (`displacedAt`, `storedVersion`, `currentVersion`) and indexes it before applying `STARTER_XML`.
  2. The notice `#displaced-workspace-status` appears with verbatim copy: `"This level's starter program was updated, so your earlier program was set aside."`.
  3. Activating `#restoreDisplacedWorkspaceButton` restores `STORED_XML` to the workspace, re-stamps `CURRENT_VERSION` into `bba:guided-workspace-version:prediction-06`, updates the live Blockly workspace, and dismisses the notice.
  4. Reloading the page retains `STORED_XML` because the current version key was re-stamped, preventing replacement loops.
  5. The recovery slot in `bba:displaced-workspace:prediction-06` remains intact in storage (reversibility preserved).

---

## 4. Notice Stacking & Usability Verification

- **Mutual Exclusivity**:
  `#storage-status` (storage-blocked banner) and `#displaced-workspace-status` (displaced program notice) are strictly mutually exclusive:
  - `#storage-status` is shown only when `!isLocalStorageAvailable()`.
  - Displaced workspace recovery and notices are strictly gated behind `isLocalStorageAvailable()` and never offered in memory-only mode.
  - Therefore, both banners can never be visible simultaneously.
- **Layout Usability at 1366×768**:
  - The displaced notice occupies a compact flex container (~40px height) directly above the toolbar.
  - When the notice is visible at 1366×768 viewport dimensions (standard Chromebook resolution), the entire Blockly toolbar, category tabs, and workspace canvas remain fully accessible and functional without layout breakage or occlusion.

---

## 5. Advisor Consultation Record

- **Evaluation**: Per Step 1 fail-closed capability rules in `advisor-capable-providers.json`, this environment (Antigravity / Gemini) does not match the listed provider mechanisms (`claude-code`, `codex-cli`, `kimi-code`).
- **Declaration**: **Branch C (Not advisor-capable / Orchestrator-gate-only mode)**.
- Full verification is performed through the test suite, browser specs, and orchestrator review gate.

---

## 6. Files Changed

- `src/ai/blockly/workspace.js`:
  - Added constants `DISPLACED_WORKSPACE_STORAGE_PREFIX`, `DISPLACED_WORKSPACE_INDEX_KEY`, `MAX_DISPLACED_WORKSPACES` (8), and copy strings.
  - Implemented `getDisplacedWorkspaceIndex()`, `getDisplacedWorkspace()`, `saveDisplacedWorkspace()`, `restoreDisplacedWorkspace()`.
  - Updated `getStoredWorkspaceXmlText()` with preservation before replacement, fail-safe write order, and preservation failure fallback.
  - Updated `saveWorkspaceToLocalStorage()` to suppress version key stamping for preservation-blocked levels.
  - Exported test cleanup and helper functions.
- `src/ui/blocklyPanel.js`:
  - Added sync logic for `#displaced-workspace-status`, rendering the notice text and toggling the restore button.
- `src/ui/controls.js`:
  - Wired click listeners for `#restoreDisplacedWorkspaceButton` and `#displacedWorkspaceStatusDismiss`.
- `src/startup/loaders.js`:
  - Installed `app.hooks.restoreDisplacedWorkspace` and `app.hooks.getDisplacedWorkspace`.
- `index.html`:
  - Added `#displaced-workspace-status` in `#blockly-region` with status text span, restore button, and dismiss button.
- `src/assets/styles/components/base.css`:
  - Added styling for `.workspace-import-status-info`, `.displaced-workspace-status-text`, and `.displaced-workspace-restore-button`.
- `tests/unit/blockly-workspace.test.js`:
  - Added 13 unit tests covering round-trip recovery, partial write/read-back failures, cap pruning, one-per-level uniqueness, no-op cases, corrupt slot handling, storage-unavailable fallback, preservation failure, edit-stamp suppression, and unknown level ID pruning (44 total unit tests).
- `tests/browser/workspace-starter-versioning.spec.js`:
  - Added Playwright browser test verifying notice appearance, verbatim copy, keyboard-accessible restore button activation, workspace restoration, and post-reload persistence (version re-stamping).
- `docs/subsystems/blockly-workspace.md`:
  - Updated Storage Key Map with `bba:displaced-workspace:<levelId>` and `bba:displaced-workspace-index`.
  - Rewrote "Replace-on-mismatch (silent by design)" to document Plan 119 displaced recovery, retention rules, failure safety, reversibility, and mutual exclusivity.

---

## 7. Artifacts Produced

- Unit test suite in `tests/unit/blockly-workspace.test.js` (44 passing tests).
- Browser spec in `tests/browser/workspace-starter-versioning.spec.js` (6 passing tests).
- Implementation plan at `<appDataDir>/brain/<conversation-id>/implementation_plan.md`.
- Progress report at `reports/development/plan-119-starter-mismatch-displaced-work-recovery/progress.md`.

---

## 8. Commands Run and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check 119` | Exited 0 | `RUNNABLE: plan-119 is ready to implement` |
| `node --test tests/unit/blockly-workspace.test.js` | Exited 0 | 44/44 unit tests passing |
| `npx playwright test tests/browser/workspace-starter-versioning.spec.js` | Exited 0 | 6/6 browser tests passing |
| `npm run build` | Exited 0 | Vite build clean, production bundle compiled |
| `npm test` | Exited 0 | 584/584 full repository unit test suite passing |
| `npm run test:browser:smoke` | Exited 0 | 61/61 browser smoke tests passing |

---

## 9. Problems Encountered and How Resolved

- **Playwright `addInitScript` re-execution on reload**: In browser tests, `page.addInitScript` evaluates on every page navigation including `page.reload()`, which re-seeded `"deadbeef"` into `localStorage` and caused a second displacement on reload.
  - *Resolution*: Guarded the fixture seeding with `sessionStorage.getItem("__init_seeded__")` so `localStorage` is seeded only on initial navigation, allowing the reload step to test true persistence of the re-stamped version key.
- **Live Blockly XML attribute differences**: Asserting equality against raw XML string literals in unit tests encountered Blockly's automatic serialization of `id`, `x`, `y`, `deletable`, and `disabled-reasons` attributes.
  - *Resolution*: Checked semantic block inclusion (`includes("battlegorithms_stay_still")`) and compared with `getWorkspaceXmlText(app)`.

---

## 10. Remaining Risks or Follow-ups

- None within the scope of Plan 119.
- Cloud sync / GAS Stage 2 portable-state restore will implement checkpoint upload suppression (`displacedByStarterUpdate`) as outlined in review finding F1.

---

## 11. Ready for Orchestrator Review

**YES**. Plan 119 implementation is complete, all tests and builds pass, and the worktree is ready for orchestrator verification.
