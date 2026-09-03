# Progress Report: Plan 121 - Cloud Evidence Builder And Analyzer Identity Parity

- **Packet ID**: `plan-121`
- **Title**: Cloud Evidence Builder And Analyzer Identity Parity
- **Status**: Completed (ready for review)
- **Date**: 2026-09-02
- **Author**: Antigravity (Google DeepMind)

---

## 1. Advisor Consultation Disclosure

- **Declaration**: Branch C — orchestrator-gate-only mode.
- **Provider / Model**: Google DeepMind Antigravity.
- **Reason**: Evaluated against `advisor-capable-providers.json` under fail-closed discipline. The current provider is not registered in the advisor capability table. In accordance with the repo's delegation rules, no in-thread higher-tier advisor was consulted; validation relies on full test execution and orchestrator review.

---

## 2. Pre-Packet Investigation & Capture

### Premise & Identity Path Reproduction
Before making changes, pre-packet code was inspected and verified via node execution:
- Observed top-level `studentName` path: `payload.studentName`.
- Observed event-data `studentName` paths: `payload.events[<index>].data.studentName` (confirmed in `export_requested` and `export_completed` event families).
- Confirmed that `sanitizeEventsForV2Export` only sanitized `xmlText` without touching `studentName`.

### Pre-Packet Blank-Name Analyzer Defect Reproduction
Constructing two records with blank names (`studentName: ""`) and identical event fingerprints in pre-packet code (`ff69614`) yielded:
```json
{
  "similarSequencesDifferentNames": [
    {
      "fingerprint": "FP123",
      "indices": [0, 1],
      "labels": ["submission-1", "submission-2"]
    }
  ]
}
```
Because `labels` defaulted to positional `submission-1` and `submission-2`, `uniqueNames.size > 1` was trivially true, causing both CLI and admin analyzers to falsely announce "identical attempt sequence under different names" on submissions with no names.

### Pre-Packet Direct-Mode Fixture Capture
- **Commit**: `ff696141f6b0b4ccf30fdf28d891f475e5b6f4fb` (short `ff69614`).
- **Fixture File**: `tests/unit/fixtures/usage-v2-export-direct-fixture.json` (committed at `315a776` and updated with deterministic runner).
- **Execution Workflow**: `initializeUsageTracking` -> `recordLevelStarted` -> `recordLevelEnded` -> `exportUsageFile("Student Gamma")` under deterministic mock timestamps and deterministic session UUID.
- **SHA-256 Digest**: `d8bcae18774fb4feb8284c5c05c5275a12b05e58d889ae816c01b835748b24f3`.

---

## 3. Implementation Summary

### R1 — Shared Payload Construction & Direct-Mode Parity
- `src/usage/usageFormat.js`:
  - Implemented and exported `computeBrowserSha256Hex(text)` using Web Crypto (`globalThis.crypto?.subtle`).
  - Implemented and exported `buildExportPayloadWithIntegrity({ session, studentName, exportedAt, computeSha256, options })` as the single shared construction for both direct download and cloud evidence.
  - Implemented `stripStudentNameDeep(value)` for general recursive stripping of `"studentName"` keys across nested objects and arrays.
  - Updated `sanitizeEventsForV2Export` and `createExportPayload` to support `options.stripStudentName: true`.
- `src/usage/usageTracker.js`:
  - Removed private `computeBrowserSha256Hex` duplicate, eliminating duplicate definitions of the hash helper.
  - Updated `exportUsageFile` to call `buildExportPayloadWithIntegrity`.
  - Verified post-packet output is 100% byte-identical to the pre-packet fixture `tests/unit/fixtures/usage-v2-export-direct-fixture.json`.

### R2 — Pure Cloud Evidence Builder
- `src/usage/cloudEvidence.js`:
  - Implemented `buildCloudEvidencePayload({ session, exportedAt, computeSha256 })`.
  - Pure, DOM-free, network-free, side-effect free (does not append export events to the ledger).
  - Preserves schema-v2 payload shape, durable ledger, pass ledger, boundary XMLs, run-version hashes, flags, and sanitized snapshots.
  - Validates cleanly under unmodified `verifyUsageExport`.
  - Fully handles edge cases: empty sessions, absent/null event data, whitespace-only student names, deeply nested event data structures.

### R3 — Identity Absence Whole-Payload Assertion
- `tests/unit/cloud-evidence.test.js`:
  - Seeded synthetic sentinel string `ZZQX-SENTINEL-NAME` through a realistic session with `export_requested` and `export_completed` events.
  - Built cloud payload and verified via `JSON.stringify(cloudPayload)` that `ZZQX-SENTINEL-NAME` is completely absent from the entire serialized output.
  - Included mirrored negative assertion proving that direct-mode download payload preserves the name.

### R4 — Analyzer Identity Parity & Blank-Name Repairs
- `src/usage/usageAnalyzer.js` & `src/usage/usageAnalyzerBrowser.js`:
  - Added `resolveFileIdentity(summary)` extracting filename from `fileName` or basename of `filePath`.
  - Replaced typed name discriminator with submitter identity (typed name if non-blank, else file identity).
  - Positional indices `submission-N` never satisfy distinct submitters.
  - Preserved same-typed-name resubmission suppression (e.g. Alice and Alice).
  - Implemented the three owner-decided outcome wordings:
    1. *Distinct typed names*: `"identical attempt sequence AND identical captured program states under different names."`
    2. *All names blank, file identities indistinguishable*: `"identical attempt sequence, submitters not distinguishable from these files."`
    3. *All names blank, file identities differ (or mixed)*: `"identical attempt sequence and identical captured program states in separate submissions."`
  - Trimmed returned entry API: single `wording` field on entries, ensuring CLI and browser copies return identical object structures.
- `src/admin/adminApp.js`:
  - Threaded `fileName` into `compareUsageSummaries` input.
  - Rendered similarity flag item using `entry.wording`.
  - Added fallback to `fileName` in the class table student column when `studentName` is blank.
- `scripts/analyze-usage-files.js`:
  - Added fallback to `basename(record.filePath)` in `formatSummaryLine`.
  - Updated similarity flag labels to reflect distinguishability and separate submissions.

### R5 — Docs & Data Dictionary
- `docs/subsystems/usage-and-admin.md`:
  - Added `src/usage/cloudEvidence.js` to the surface map.
  - Documented the Cloud Evidence Builder & Identity Contract (Plan 121), whole-payload identity stripping, and the ratified policy that account attribution belongs in teacher-download filenames.
  - Documented Submitter Identity & Similarity Parity (Plan 121) rules and three outcome wordings.
- `docs/CohortUsageDataDictionary.md`:
  - Added disclosure noting that for identity-stripped cloud exports, `identityMap.details[].studentName` is empty and longitudinal linking relies on the filename.

### Package & Concurrency
- `package.json`: Registered `tests/unit/cloud-evidence.test.js` in `test:unit` (concurrency exception lifted following completion of plans 118 and 119).

---

## 4. Verification Results

| Command | Status | Details |
|---|---|---|
| `node --test tests/unit/cloud-evidence.test.js tests/unit/usage-v2-export.test.js tests/unit/usage-v2-analyzer-integration.test.js tests/unit/usage-analyzer-browser.test.js` | PASS | 37/37 tests passed in 291ms. |
| `npm test` | PASS | 595/595 unit tests passed across all test suites. |
| `npm run build` | PASS | Production Vite bundle built cleanly in 8.09s. |
| `npm run test:browser:tooling` | PASS | 21/21 Playwright browser tests passed (including `admin.spec.js`). |

---

## 5. Files Changed

- `src/usage/cloudEvidence.js` (new)
- `src/usage/usageFormat.js`
- `src/usage/usageTracker.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/admin/adminApp.js`
- `scripts/analyze-usage-files.js`
- `package.json`
- `tests/unit/fixtures/usage-v2-export-direct-fixture.json` (new fixture captured from `ff69614`)
- `tests/unit/cloud-evidence.test.js` (new)
- `docs/subsystems/usage-and-admin.md`
- `docs/CohortUsageDataDictionary.md`
- `reports/development/plan-121-cloud-evidence-builder-and-analyzer-identity/progress.md` (this report)

---

## 6. Risks & Readiness

- **Risks**: None identified. Direct-mode exports are proven byte-identical to pre-packet fixtures. Cloud evidence builder is pure and verified by unmodified `verifyUsageExport`. Analyzer parity is pinned by tests across CLI and browser modules.
- **Readiness**: Ready for integration.
