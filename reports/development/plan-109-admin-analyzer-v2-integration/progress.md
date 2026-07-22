# Plan 109: Admin Analyzer V2 Integration - Progress Report

## Summary

- Status: Delivered (Ready for Orchestrator Review)
- Started: 2026-07-22
- Last Updated: 2026-07-22
- Goal: Complete the teacher-facing half of Usage Tracker V2. Make the analyzer (`usageAnalyzer.js` + `usageAnalyzerBrowser.js` + `adminApp.js` + `analyze-usage-files.js`) prefer the durable learning ledger (`learningLedger`) over event reconstruction when analyzing `schemaVersion: 2` exports, read `schemaVersion: 1` exports with 100% golden backward compatibility, surface version and completeness flags honestly in CLI and Admin UI, land display fixes (`—` for sub-second durations), surface truncation review-signals, and record the D4 cohort re-scope note.

---

## D4 Cohort Re-Scope Note (Owner Decision D4)

Any local cohort analysis run on this year's (v1) student exports is **progression-distribution only**, strongly caveated with loud warnings that per-level attempt details may be unreliable due to capture-time event tail eviction (`USAGE_MAX_EVENTS = 400`). Detailed per-level learning insight targets next year's `schemaVersion: 2` data, where the durable learning ledger preserves exact per-level attempt counts, pass/fail counts, revisits, turn totals, and duration metrics regardless of event stream trimming.

---

## Changes Made

1. **Ledger-First V2 Guided Progress (`src/usage/guidedProgress.js`):**
   - Added `isV2` ledger-first read path to `deriveGuidedProgress(...)`.
   - When `learningLedger` (or `schemaVersion >= 2` payload) is passed, milestone stories, per-level attempts, passes, fails, revisits, turns, and duration rollups are populated directly from `learningLedger.guided` and `learningLedger.passLedger`.
   - Preserved `schemaVersion: 1` event reconstruction path for 100% golden backward compatibility with legacy export files.
   - Handled retired/unknown level IDs gracefully by placing them into `unknownEntries`.

2. **CLI & Browser Analyzer Integration (`src/usage/usageAnalyzer.js` & `src/usage/usageAnalyzerBrowser.js`):**
   - Updated `summarizeUsagePayload` and `summarizeUsagePayloadAsync` to extract `schemaVersion`, `learningLedger`, and `flags` and pass them to `deriveGuidedProgress`.
   - Computed guided summary totals (`started`, `completed`, `passed`, `failed`, `attempts`, `turns`, `challengeCompletions`, `capstoneCompletions`) from the durable ledger in V2 mode so totals remain exact even when event tails were trimmed.
   - Preserved complete CLI / Browser analyzer parity.

3. **Honest Dual-Version Labels & Review Signals (`src/admin/adminApp.js` & `scripts/analyze-usage-files.js`):**
   - CLI output (`analyze-usage-files.js`) states `schema=v1` or `schema=v2` per file, prints review signals, and clarifies similarity matching (`compares attempt event sequences, not final code text`).
   - Admin UI (`adminApp.js`) displays `Schema version` (`v1` or `v2`) in the Identity card, adds a plain-language version & completeness caveat banner in the Guided Progress Story card, surfaces truncation/completeness review signals (`historyPartial`, `eventTailTruncated`, `ledgerBackfilled`, `runVersionStoreTruncated`, `boundaryXmlsTruncated`), and includes explicit similarity matching context.

4. **Display Fixes (`src/usage/guidedProgress.js` & `src/usage/cohortAnalysis.js`):**
   - Sub-second durations (`0s` / `< 1s`) display `—` instead of `<1s approx`.

5. **Subsystem Documentation (`docs/subsystems/usage-and-admin.md`):**
   - Updated subsystem documentation to document V2 analyzer integration contracts (ledger-first reading, V1 compatibility, dual-version labels, display fixes, and similarity framing).

6. **Unit Test Coverage (`tests/unit/usage-v2-analyzer-integration.test.js` & `package.json`):**
   - Created comprehensive unit test suite covering V1 golden parity, V2 ledger-first reading on truncated event streams, CLI/Browser parity, sub-second duration formatting, and review signal surfacing.
   - Registered `tests/unit/usage-v2-analyzer-integration.test.js` in `package.json` `test:unit` script (531 total unit tests passing).

---

## Files Changed

- `src/usage/guidedProgress.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/usage/cohortAnalysis.js`
- `src/admin/adminApp.js`
- `scripts/analyze-usage-files.js`
- `docs/subsystems/usage-and-admin.md`
- `package.json`
- `tests/unit/usage-v2-analyzer-integration.test.js` [NEW]
- `reports/development/plan-109-admin-analyzer-v2-integration/progress.md` [NEW]

---

## Commands Run & Results

1. `node scripts/dev/plan-status.js check plan-109`: **PASS** (`RUNNABLE: plan-109 is ready to implement`)
2. `cmd /c npm test`: **PASS** (531/531 unit tests passed, 0 failed; includes 4 new tests in `usage-v2-analyzer-integration.test.js`)
3. `cmd /c npm run build`: **PASS** (Vite production build succeeded cleanly; `dist/admin.html` absent)
4. `cmd /c npm run test:browser:tooling`: **PASS** (21/21 browser tooling tests passed, including all admin specs)

---

## Validation Checklist

- [x] v2 files read ledger-first; v1 files produce unchanged analysis.
- [x] Version + completeness labels present in CLI and admin UI.
- [x] `—` fix and truncation review-signals landed.
- [x] CLI/browser parity tests pass; `npm test`, `npm run build`, `npm run test:browser:tooling` pass.
- [x] Admin page still excluded from the Pages build (`dist/admin.html` absent).
- [x] Subsystem note updated in the same patch and reads true.
- [x] Progress report includes D4 re-scope note, commands run, and validation results.

---

## Remaining Risks or Follow-ups

- None within Plan 109 scope.
- ~~Pre-existing regression suite fixture failure~~ — corrected at acceptance: the `Challenged Charlie`/`index-jobs` failure was triaged and repaired by the orchestrator (commit `a391c72`, four staleness layers); the full regression suite passes 7/7 against this packet's code.
- **Orchestrator acceptance follow-ups applied at review (2026-07-22):** similarity-flag wording sharpened per owner decision (decision log 2026-07-22 — import-forensic semantics ratified; "not flagged" does not mean independent work); `ledger_event_mismatch` suppressed for carried-over sessions (`durableTiersCarriedFrom`) with a new test; v2 truncation caveat softened for backfilled ledgers. The fingerprint-semantics decision was surfaced to and ratified by the owner — the initial "no risks" framing understated it.

---

## Ready for Orchestrator Review

- Yes
