# Plan 106: Usage Tracker V2 Durable Ledger And Schema Core - Progress Report

## Summary

- Status: In Progress (Pending Repair 01 Orchestration Re-Review)
- Started: 2026-07-21
- Repair Pass 01 Completed: 2026-07-21
- Goal: Build the Usage Tracker V2 durable per-level learning ledger and schema v2 core (incremental rollups, `level_opened`, guided pass ledger mirror, v1 back-compat hydration, truncation/completeness flags).

## Repair 01 Action Summary

1. **Repair 1 (CRITICAL) - Export Schema Pinned to V1:** Fixed `createExportPayload` in `src/usage/usageFormat.js` to pin `schemaVersion: 1` (`USAGE_SCHEMA_VERSION`) explicitly instead of reading `session.schemaVersion`. Verified export payload contains no V2-only ledger or flag fields.
2. **Repair 2 (CRITICAL) - Registered Test File in package.json:** Added `tests/unit/learning-ledger.test.js` to `package.json` under `test:unit`. Total unit test suite count increased from 479 to 489 tests.
3. **Repair 3 (MAJOR) - Field Names Aligned with Plan 81 Rollup:** Renamed ledger fields to match Plan 81's `guided_level_rollup` table (`reached`, `startedCount`, `completedCount`, `passedCount`, `failedCount`, `revisits`, `turnsSpent`, `durationMs`, `passed`, `firstActivityAt`, `lastActivityAt`, `lastResult`, `startBlockCount`, `endBlockCount`, `finalXmlHash`). Added `revisits` and duration tracking.
4. **Repair 4 (MAJOR) - Live Workspace Data Capture:** Added `getLiveWorkspaceCapture()` helper in `src/usage/usageTracker.js`. `recordLevelOpened`, `recordLevelStarted`, and `recordLevelEnded` now capture live XML and block counts directly from `app.hooks.getWorkspaceXmlText()` and `app.blocklyWorkspace`, falling back to the most recent workspace snapshot on `session.snapshots` if the editor is unmounted.
5. **Repair 5 (MINOR) - Strict Factual Flags:** Updated `hydrateAndBackfillSession` so `ledgerBackfilled: true` is set only when backfill actually executes on a hydrated legacy V1 session. Updated `eventTailTruncated: true` to be set only when FIFO event eviction actually occurs.
6. **Repair 6 (MINOR) - Hash Hygiene:** Replaced custom FNV-1a implementation in `src/usage/learningLedger.js` by importing `hashStarterXml` from `src/ai/blockly/starterVersioning.js`, ensuring whitespace and block position attribute normalization matches the starter-versioning contract.
7. **Repair 7 (MINOR) - Reset Level Opened Idempotency Documented:** Documented in `src/core/levels.js` and `docs/subsystems/usage-and-admin.md` that `resetCurrentLevel` re-enters guided mode and fires `level_opened`, which is idempotent in the ledger.
8. **Repair 8 - Progress Report Honesty:** Rewrote progress report to accurately document initial audit failures, repair pass commands, data source choices, and real test execution counts.

## Files Changed

- `src/usage/learningLedger.js` (NEW): Durable per-level learning ledger, Plan 81 rollup field names, FNV-1a starter hash reuse, V2 hydration/backfill, factual flags.
- `src/usage/usageFormat.js`: Schema V2 session creation, `level_opened` handling, pinned `schemaVersion: 1` in `createExportPayload`.
- `src/usage/usageTracker.js`: Live workspace capture in `recordLevelOpened`, `recordLevelStarted`, `recordLevelEnded`, and attached `app.usageTrackerSession` debug reference.
- `src/core/levels.js`: Fired `recordLevelOpened` on level entry and documented reset idempotency.
- `package.json`: Registered `tests/unit/learning-ledger.test.js` in `test:unit`.
- `tests/unit/learning-ledger.test.js` (NEW): Unit test suite covering rollup fields, live workspace capture, pass mirroring, legacy V1 hydration, factual flags, and export payload format.
- `docs/subsystems/usage-and-admin.md`: Updated subsystem documentation for Plan 81 field alignment, reset idempotency, and flag rules.

## Commands Run & Results

- `node --test tests/unit/learning-ledger.test.js`: PASS (10/10 tests passed)
- `cmd /c npm test`: PASS (489/489 tests passed; registered learning-ledger tests included)
- `cmd /c npm run build`: PASS (Vite production bundle compiled cleanly in 6.13s)

## Validation Checklist

- [x] Exported payload from a v2-internal session reports `schemaVersion: 1` and contains no v2-only fields.
- [x] Test file `tests/unit/learning-ledger.test.js` registered in `package.json` and green (489 total tests).
- [x] Ledger field names match Plan 81 `guided_level_rollup` shape (`startedCount`, `completedCount`, `passedCount`, `failedCount`, `revisits`, `turnsSpent`, `durationMs`, etc.).
- [x] Live producer path captures non-null XML hash and block counts at level start/end.
- [x] Flags are strictly factual (`ledgerBackfilled` set only when legacy backfill ran; `eventTailTruncated` set only when eviction occurs).
- [x] FNV-1a hash imports starter-versioning helper and normalizes position/whitespace edits.
- [x] Reset level_opened idempotency documented in code and subsystem note.
- [x] `docs/subsystems/usage-and-admin.md` updated and reads true post-repair.
- [x] Frontmatter status left at `in-progress` pending orchestration re-review.

## Problems Encountered and How Resolved

- Initial Implementation Review Failure (Repair 01): The first pass failed orchestration review due to an unpinned export `schemaVersion` leaking `schemaVersion: 2`, an unregistered test file in `package.json` (meaning unit tests were not running in `npm test`), invented rollup field names instead of Plan 81 field names, and missing live workspace XML/block count capture.
- Resolution: Addressed all 8 defects named in `repair-01.md`. Pinned export `schemaVersion: 1`, registered `learning-ledger.test.js` in `package.json` (growing test suite from 479 to 489 tests), renamed fields to match Plan 81, wired live `app.hooks.getWorkspaceXmlText()` / `app.blocklyWorkspace` capture with snapshot fallback into level start/end events, and imported `hashStarterXml`.

## Remaining Risks or Follow-ups

- Plan 107 will build Tier 2 (run-version store and value-based pruning).
- Plan 108 will serialize Schema V2 and Tier 1 ledger fields in exported JSON files.

## Ready for Orchestrator Review

- Yes (Repair Pass 01 complete; awaiting orchestration re-review)
