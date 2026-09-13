# Progress Report: Plan 125 — Worksheet Checkpoint Querystring Parameter

## Overall Summary

Plan 125 implements support for the `worksheetAt` querystring parameter, enabling teachers to compose URLs naming guided levels where students should be prompted to consult their worksheet upon completion.

All three owner recommendations approved at the 2026-09-11 gate, along with the four preflight review adjustments (R1-R4), have been implemented and verified:
1. **Completion Marker & Tab-Session Reminder (R1)**:
   - Appended a non-blocking marker (`Check your worksheet!`) directly to the `.level-result.success` banner when a checkpoint level is completed.
   - Implemented a persistent, dismissible reminder card in the student lesson card below the result banner.
   - Gated the reminder strictly on `worksheetCheckpointsReached` ("this level has been passed at least once in this tab session"), surviving level resets and second-star attempts, while dying with the tab session. It never uses `activeLevelResult` (which resets on replay) or `levelProgress` (which is persisted and would violate D1's anti-stale-configuration principle).
2. **Dedicated Styling (R2)**:
   - The reminder card has its own dedicated CSS class (`.lesson-worksheet-reminder`) to avoid coupling to `.lesson-project-indicator` (which is used by project levels L23-L28 and L29-L37).
   - Reuses `.storage-status-dismiss` for the "Got it" button affordance.
3. **Product Copy (R3)**:
   - Marker copy reads `"Check your worksheet!"`, omitting "paper" to preserve Browser Battlegorithms' agnostic stance regarding the teacher's worksheet medium.
4. **State Initialization (R4)**:
   - Declared worksheet state fields (`worksheetCheckpoints`, `worksheetCheckpointsReached`, `worksheetReminderDismissedLevels`, `worksheetUnknownNoticeDismissed`) in `createInitialState()` in `src/core/state.js` with empty defaults, maintaining uniform state shape across loads.
5. **Mode Disposition (D3)**:
   - The unknown-ID notice in `#blockly-region` is scoped to Guided Levels (`currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS`) and suppressed in Free Play, ensuring Free Play is unaltered.
6. **Invariants & Negative Controls**:
   - `location.search` is parsed exclusively; `location.hash` is strictly ignored (preserving the URL fragment for GAS Stage 1 channel nonces).
   - Level IDs resolve strictly against `app.state.levels`. Nested step/variant IDs (e.g. `bughunt-22-trace`) land in the unknown-ID list.
   - Partial matching: unknown IDs never suppress valid checkpoints.
   - Zero cost when absent: absence of `worksheetAt` incurs no banner, no marker, no reminder, and no reserved DOM.
   - Telemetry: zero usage events, zero export fields, and zero analytics additions.

## Advisor Consultation

- **Capability & Branch**: Branch C — orchestrator-gate-only.
- **Rationale**: Not advisor-capable under the `advisor-capable-providers.json` fail-closed rule (current provider/tool environment Antigravity / Gemini 3.8 Flash is not an entry in `advisor-capable-providers.json`). No consultation ran; standard orchestrator review gate applies.

## Files Created and Modified

- **`src/ui/worksheetCheckpoints.js`** (Created):
  - Pure parsing and resolution functions (`parseWorksheetCheckpointsParam`, `resolveWorksheetCheckpoints`, `getWorksheetCheckpointsFromLocation`).
  - State initialization and check helpers (`initializeWorksheetCheckpoints`, `isWorksheetCheckpointLevel`).
  - UI renderers (`renderWorksheetUnknownIdBanner`, `renderWorksheetResultMarker`, `renderWorksheetReminder`).
- **`src/core/state.js`** (Modified):
  - Declared `worksheetCheckpoints`, `worksheetCheckpointsReached`, `worksheetReminderDismissedLevels`, and `worksheetUnknownNoticeDismissed` defaults in `createInitialState()`.
- **`src/main.js`** (Modified):
  - Imported and called `initializeWorksheetCheckpoints(app, { locationLike: window.location })` immediately after `initializeLevelState(app)`.
- **`src/ui/blocklyPanel.js`** (Modified):
  - Dynamically mounts/updates `#worksheet-unknown-status` in `#blockly-region` only when unknown IDs are present and not dismissed in Guided Levels. Removes element when absent (zero reserved DOM).
- **`src/ui/levels.js`** (Modified):
  - Updated `renderResultBannerMessage` to append `renderWorksheetResultMarker`.
  - Updated `renderLevelPanel` to track `worksheetCheckpointsReached` upon level pass and render `renderWorksheetReminder`.
  - Added click handler in `bindLevelPanel` for reminder dismissal.
- **`src/ui/controls.js`** (Modified):
  - Added delegated click listener for `#worksheetUnknownStatusDismiss`.
- **`src/assets/styles/components/lesson-panel.css`** (Modified):
  - Added scoped CSS for `.worksheet-checkpoint-marker` and `.lesson-worksheet-reminder`.
- **`docs/subsystems/ui-mode-contract.md`** (Modified):
  - Added `## Worksheet checkpoints (Plan 125)` documentation.
- **`tests/unit/worksheet-checkpoints.test.js`** (Created):
  - 17 unit and integration tests covering parsing, hash-ignorance, resolution against real level definitions, negative controls, unknown-ID copy, Free Play suppression, R1 entry/pass/reset reminder lifecycle, marker display, and export payload exclusion.
- **`package.json`** (Modified):
  - Registered `tests/unit/worksheet-checkpoints.test.js` in `scripts["test:unit"]`.

## Verification Commands & Results

1. **Unit Test Suite**:
   ```powershell
   npm test
   ```
   - **Result**: Passed (637/637 tests passing, 0 failures across 56 test files in 13.5s).
   - Includes 17 dedicated tests in `tests/unit/worksheet-checkpoints.test.js`.

2. **Production Bundle Build**:
   ```powershell
   npm run build
   ```
   - **Result**: Passed (Vite built production bundle successfully in 5.78s).

3. **Plan Status Checks**:
   ```powershell
   node scripts/dev/plan-status.js check 125
   node scripts/dev/plan-status.js lint
   ```
   - **Result**: Passed (`RUNNABLE: plan-125 is ready to implement`; `lint: OK (no violations)`).

## Repair 01: Single-Escape Resolution for Unknown IDs

- **Defect**: In `src/ui/worksheetCheckpoints.js`, `renderWorksheetUnknownIdBanner` escaped IDs twice: first via `unknownIds.map(escapeHtml).join(", ")`, and subsequently at interpolation `<span class="storage-status-text">${escapeHtml(copy)}</span>`. On IDs containing `&`, `<`, or `"`, this showed doubled entity text (`Tom &amp; Jerry`, `a&lt;b`) to teachers instead of verbatim characters, violating D2.
- **Resolution**: Kept raw IDs in `copy` and escaped once at interpolation `${escapeHtml(copy)}`.
- **Tests Added**:
  1. Verified single-escape entity rendering for `&`, `<`, and `"` (`Tom &amp; Jerry, a&lt;b, q&quot;z` without doubled entities `&amp;amp;`, `&amp;lt;`, `&amp;quot;`).
  2. Verified XSS safety: `<img src=x onerror=alert(1)>` never renders a live `<img` element and is sanitized to `&lt;img ...&gt;`.
- **Validation**: 639/639 tests passing (19 in `tests/unit/worksheet-checkpoints.test.js`). No existing tests broken.

## Remaining Risks & Follow-ups

- **GAS URL Forwarding Gap**: Under Google Apps Script parent `/exec` shell deployments, query parameters on the parent page do not reach the embedded iframe until parameter forwarding is added to `Shell.html`. This is documented in `docs/subsystems/ui-mode-contract.md` and tracked as a Stage 1 protocol requirement in `docs/open-questions.md`.

## Ready for Orchestrator Review

Yes. All requirements from Plan 125, the owner gate ruling, the preflight review, and Repair 01 are implemented, validated, and documented.

