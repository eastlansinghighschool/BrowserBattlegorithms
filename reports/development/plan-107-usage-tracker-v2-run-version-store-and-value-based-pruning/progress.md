# Plan 107: Usage Tracker V2 Run-Version Store And Value-Based Pruning - Repair 01 Progress Report

## Overall Summary

This repair pass addresses the 8 items in `reports/development/plan-107-usage-tracker-v2-run-version-store-and-value-based-pruning/repair-01.md`. The first implementation pass was functionally close but failed orchestration review on three major design gaps (per-team free-play keying, durable-tier rollover, quota-failure graceful degradation), one untested core behavior (B2 eviction cascade), and four minors (snapshot FIFO disclosure, XML-heavy cap sizing, hydration flag propagation, progress-report honesty, and a missing package.json trailing newline).

The repair pass keeps the first-pass wins intact: D1 8-level LRU, K=5 semantics, B7 snapshot coalescing, execution-path-only run-version capture, and Plan 106 carried follow-ups. It rewrites only the parts needed to satisfy the packet contract and the 2026-07-21 decision-log entries.

## Files Changed

- `src/usage/runVersionStore.js`
  - Free-play context keying is now per team slot: `freeplay:team1` / `freeplay:team2`.
  - `store.freePlay` is now a keyed map of team buckets; legacy flat `freePlay.versions` arrays migrate on rehydration.
  - D2 window and byte-budget eviction operate across all team buckets.
- `src/usage/usageTracker.js`
  - `createTrackerSession` now supports durable-tier carry-over on session rollover (`durableTiersCarriedFrom` flag).
  - Added `persistWithGracefulDegradation` to catch IndexedDB quota errors, run the churn → free-play → guided cascade, retry once, and swallow errors so student-facing flows continue.
- `src/usage/usageFormat.js`
  - Exported `evictLowestValueEvents` for direct B2 cascade testing.
  - Propagates `runVersionStoreTruncated` from the rehydrated store flags to `session.flags`.
- `src/usage/learningLedger.js`
  - Added `durableTiersCarriedFrom` to `createSessionFlags` so the carry-over marker survives persistence.
- `tests/unit/run-version-store.test.js`
  - Updated for keyed free-play shape.
  - Added tests for per-team keying, interleaved PvP dedupe chains, independent D2 windows, and legacy migration.
- `tests/unit/learning-ledger.test.js`
  - Added durable-tier rollover tests.
  - Added quota-failure cascade tests (retry, non-quota swallow, cascade order, high-value survival).
  - Added direct B2 cascade tests and a FIFO-vs-B2 contrast fixture.
  - Added hydration-time `runVersionStoreTruncated` propagation test.
- `docs/subsystems/usage-and-admin.md`
  - Documented per-team free-play keying.
  - Documented durable-tier carry-over.
  - Documented quota-failure graceful degradation.
  - Disclosed snapshot FIFO splice-from-front behavior.
  - Documented XML-heavy event cap sizing rationale.
- `package.json`
  - Restored trailing newline.

## Artifacts Produced

- Updated source files listed above.
- Updated unit-test files with new coverage for Repairs 1–4 and 7.
- Updated subsystem note.
- This progress report.

## Commands Run and Results

- `node scripts/dev/plan-status.js check plan-107` — RUNNABLE ✅
- `node --test --test-isolation=none tests/unit/learning-ledger.test.js tests/unit/run-version-store.test.js` — PASS (40/40 new + existing)
- `npm test` — PASS (519/519); `npm run build` — PASS (see Validation Gate Results below).
## Validation Gate Results

- `node scripts/dev/plan-status.js check plan-107` — RUNNABLE ✅
- `npm test` — PASS (519/519 tests)
- `npm run build` — PASS (with pre-existing Vite chunk-size warnings unrelated to this change)

## Validation Checks Performed

- [x] Free-play per-team keying (`freeplay:team1` / `freeplay:team2`) derived from `runner.team`.
- [x] Interleaved PvP turns do not pollute each other's dedupe chains.
- [x] Durable tiers (`learningLedger`, `passLedger`, `runVersionStore`) carry over at session rollover with `durableTiersCarriedFrom` flag.
- [x] Churn and event tails do NOT carry over at rollover.
- [x] Quota errors trigger one retry, run the cascade, set flags, and do not throw into student flows.
- [x] Non-quota persistence errors are swallowed without cascading.
- [x] B2 cascade evicts `workspace_changed` → `workspace_snapshot`/`export_*` → `tutorial_replayed` → oldest remaining events.
- [x] Fixture included where FIFO front-splice would keep churn and drop a high-value event; B2 keeps the high-value event.
- [x] `runVersionStoreTruncated` propagates from store flags to session flags on hydration.
- [x] Subsystem note updated and reads true on lifecycle retention, snapshot FIFO, XML cap rationale, per-team keying, and quota degradation.
- [x] `package.json` trailing newline restored.

## Problems Encountered and How Resolved

- **Per-team free-play shape change broke existing tests**: the first pass used a flat `freePlay.versions` array. The repair moved to keyed buckets and added legacy migration so existing persisted data rehydrates cleanly.
- **B2 cascade test design**: an initial test expected guided run-versions to survive when churn and free-play were present, but the quota-failure cascade is aggressive (it evicts one guided window as a last-resort measure). The test was corrected to assert the actual cascade order and a separate fixture demonstrates that B2 differs from FIFO.
- **apply_patch context-line format**: patches needed leading spaces on context lines; after adjusting, source edits applied cleanly. Test files with many small changes were rewritten with PowerShell to avoid patch-drift errors.

## Remaining Risks or Follow-Ups

- The quota-failure cascade is heuristic: it discards half of events/snapshots, one version per free-play team bucket, then one guided window, before retrying once. A pathological single-version size could still fail the retry; the error is swallowed and flags are set, but some data is lost.
- `workspace.js` was listed in the repair order as a touched file; the call site already passes `runner` to `recordRunVersion`, so no change was required. This was verified.
- Plan 108 will consume the run-version store helpers; no export-shape changes were made in this packet.

## Ready for Orchestrator Review

Yes.
