---
id: plan-108
title: "Usage Tracker V2 Export Shape And Similarity Verification"
status: complete
resolution: "V2 export per D3: durable ledger + pass ledger + capped boundary XML (K=5, real pass/fail events only, at-or-before timestamp matching, hash-only fallback) + run-version hash list; XML stripped from events and snapshots (81% payload reduction). Gate experiment: v2 changes nothing the detector reads; detector's pre-existing final-code blindness recorded and carried to plan-109. Accepted after Repair 01 re-review."
depends_on: [plan-107]
gate: "before generated output: the similarity-detection experiment must be run and reported before the v2 export shape is accepted"
summary: >-
  Ship the schema v2 export payload per D3 (durable ledger + pass ledger + full XML only at pass/fail boundaries, capped, + run-version hash list), and run the falsifiable experiment proving Plan 04/16 similarity detection still works on boundary-only export XML.
---
# Plan 108: Usage Tracker V2 Export Shape And Similarity Verification

## Packet Metadata

- Packet id: `plan-108`
- Packet title: Usage Tracker V2 Export Shape And Similarity Verification
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-21
- Packet type: implementation / testing
- Mutation level: source-code, tests, docs (subsystem notes), generated-local (synthetic fixtures only)
- Approval gate: before generated output — the similarity-detection experiment must be executed and its results reported before the v2 export shape is treated as accepted. A degraded result is a stop condition, not a footnote.
- Depends on: plan-107 (run-version store, hash list, boundary-XML helpers)
- Blocks: plan-109 (analyzer must read the v2 shape this packet defines)
- Expected artifacts:
  - `schemaVersion: 2` export payload per D3
  - similarity-detection verification experiment + reported results
  - updated regression pipeline expectations
  - updated `docs/subsystems/usage-and-admin.md` and `docs/subsystems/file-pipelines.md`
  - progress report
- Progress report folder: `reports/development/plan-108-usage-tracker-v2-export-shape-and-similarity-verification/`
- Progress report file: `reports/development/plan-108-usage-tracker-v2-export-shape-and-similarity-verification/progress.md`

## Packet Summary

Goal: Make exported usage files schema v2: the durable per-level ledger and guided pass ledger travel with the export (teacher-facing source of truth), full program XML appears only at pass/fail boundaries (capped), and the run-version store is represented by a hash list. Then prove — by experiment, not assertion — that Plan 04/16 similarity detection still works on boundary-only XML.

Non-goals:
- Do not change the admin analyzer's read logic (plan-109); the analyzer must simply not crash on v2 files until then — verify and, if needed, add the minimal guard, flagged for plan-109 completion.
- Do not change cohort tooling (`src/usage/cohortAnalysis.js`) beyond what honest v2 ingestion requires; per-level cohort insight on this year's data stays caveated per D4.
- Do not export run-version XML contents (local-only per the contract; only hashes + boundary XML travel).
- Do not weaken the integrity hash; it covers the new payload as before.

Depends on:
- plan-107 complete: run-version store with hash list and boundary-selection helpers.

Blocks:
- plan-109.

Why this packet exists:
D3 is the privacy-and-size heart of the V2 design: teachers get the learning ledger and boundary programs; raw iteration history stays on the student's machine. But it carries the contract's sharpest falsifiable claim — Plan 84 says stop if boundary-only export XML breaks similarity detection. The v1 similarity fingerprint currently excludes workspace churn (`usageFormat.js` lines ~172–176), which suggests boundary-only XML may suffice; that hypothesis must survive an actual experiment with synthetic look-alike student pairs, not a code-reading argument. This is the falsification check applied to a privacy claim: run the discriminating experiment before accepting the conclusion.

## Authority And Contracts

Required reading:

- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — D3, B5, stop conditions (similarity breakage; v1 analyzer readability).
- `docs/development/plan-106-...md` and `docs/development/plan-107-...md` progress reports — the landed schema and store.
- `docs/subsystems/usage-and-admin.md` — event taxonomy and export ladder; update in this patch.
- `docs/subsystems/file-pipelines.md` — the usage evidence JSON flow and integrity model; update in this patch.
- `src/usage/usageFormat.js` — `createExportPayload` (lines ~380–403), canonical JSON, similarity fingerprint exclusions.
- `src/usage/usageTracker.js` — integrity hash injection (lines ~399–405).
- `src/usage/cohortAnalysis.js` — keys on `payload.integrity.sha256` + `payload.sessionId`.
- `scripts/analyze-usage-files.js` — CLI entry for the similarity path.
- `tests/unit/usage-file.test.js`, `tests/regression/usage-pipeline.spec.js`, `tests/regression/student-profiles.js`.

Contracts to preserve:

- D3 export contents: per-level ledger + pass ledger + full XML only at pass/fail boundaries (capped) + hash list of run-versions.
- Similarity detection (Plan 04/16) must be verified working against boundary-only XML — experiment required.
- v1 files remain analyzable (B1); this packet must not break reading v1 exports anywhere they are currently read.
- Integrity: SHA-256 over canonical JSON of everything except `integrity`, unchanged in mechanism.
- No new PII; boundary-only XML reduces code exposure relative to v1 — preserve that direction.
- Synthetic data only for tests and the experiment; no real student exports in the repo or in `local/` analysis for this packet.

## Carried Follow-Up From Plan 106 Review (2026-07-21)

Plan 106's Repair 4 embedded full workspace `xmlText` in `level_opened`/`level_started`/`level_completed` event payloads (`src/usage/usageTracker.js:313-319, 340-345, 358-364`), and those events are cloned wholesale into the v1 export (`src/usage/usageFormat.js:414`). The similarity fingerprint ignores only `workspace_changed`/`workspace_snapshot` (`usageFormat.js:180-195`), so this XML now enters the Plan 04/16 fingerprint and inflates every v1 export. This packet's similarity experiment must explicitly cover this change: decide whether boundary/level events keep full XML or drop to hash-only in the v2 export, and verify fingerprint behavior against pre-plan-106 exports, not only against v1-with-XML. Record the decision in the progress report.

Additional plan-107 acceptance caveat: the subsystem note's XML-cap math (400 events × ~5 KB ≈ 2 MB) considers a single session only; up to 20 retained sessions multiply worst-case IndexedDB footprint into the tens of MB. Keep this in mind when sizing v2 export contents and when plan-109 labels file sizes for teachers.

## Scope

### In Scope

- `schemaVersion: 2` in `createExportPayload` (or its successor), carrying: durable per-level ledger, guided pass ledger, pass/fail boundary XML (capped), run-version hash list, truncation/completeness flags, plus the v1 fields that remain meaningful.
- Boundary-XML selection rule: define "pass/fail boundary" precisely (the program state at a level pass and at a level-ending fail), cap the number of boundary XMLs per level (align with plan-107's K = 5 where sensible), and document it.
- The similarity experiment (below).
- Updates to the regression usage pipeline (`tests/regression/usage-pipeline.spec.js`, `student-profiles.js`, timestamp spreader) to produce and assert v2 exports.
- Minimal don't-crash guard for v2 files in the current analyzer, if needed, clearly marked as plan-109's to complete.
- Subsystem note updates in the same patch.

### Out of Scope

- Analyzer ledger-first rewrite, honest labeling of old/truncated files, display fixes (plan-109).
- Cohort analysis re-scope beyond honest ingestion (D4 note travels with plan-109's report).
- Any change to what counts as a pass/fail in game rules.
- Restore UI.

### Files And Areas Likely Touched

- `src/usage/usageFormat.js`, `src/usage/usageTracker.js`.
- `tests/unit/usage-file.test.js` and a new v2 export test file if cleaner.
- `tests/regression/usage-pipeline.spec.js`, `student-profiles.js`.
- `docs/subsystems/usage-and-admin.md`, `docs/subsystems/file-pipelines.md`.

## Work Plan

1. Inspect plan-106/107 landed state; confirm hash-list and boundary-XML helpers exist.
2. Summarize the job back before editing.
3. Implement the v2 export payload behind the existing export flow.
4. Write unit tests for payload shape, caps, flags, and integrity.
5. Run the similarity experiment (below) and record results.
6. Update the regression pipeline to v2.
7. Run targeted tests, `npm test`, `npm run build`, and `npm run test:regression` if practical.
8. Update subsystem notes; write the progress report including experiment results.

## Implementation Requirements

### 1. V2 export payload (D3, B5)

- Required behavior: exports carry `schemaVersion: 2`, the durable per-level ledger, the guided pass ledger, capped pass/fail boundary XML, the run-version hash list, and truncation/completeness flags.
- Constraint: v1 fields still consumed by the analyzer (`summary`, `events`, `snapshots`, `sessionId`, `studentName`, integrity) remain present and correct — the analyzer reads both versions until plan-109; shrinking what v1 fields carry is allowed only where the ledger supersedes them and the don't-crash guard holds. Document every v1 field whose semantics changed.
- Edge cases: student with zero passes (no boundary XML — still valid); boundary cap exceeded (keep most recent per level, flag truncation); export immediately after quota degradation (flags must reflect it).

### 2. Similarity-detection verification experiment (the gate)

- Required behavior: construct synthetic student pairs with known overlap (shared solution copied, independent solutions, partially shared), export v2 files, run the existing similarity/duplicate detection path (`scripts/analyze-usage-files.js` and the fingerprint logic), and compare detections against the same pairs exported as v1 (full snapshots).
- Report: which pairs are flagged under v1 vs v2, any detection lost, and why. Percentages over a handful of synthetic cases are fine; this is a discrimination check, not a benchmark.
- If similarity detection materially degrades (a copied-program pair that v1 catches and v2 misses), STOP and surface per Plan 84.

### 3. Regression pipeline update

- `tests/regression/usage-pipeline.spec.js` and student profiles produce v2 exports and assert the new shape plus the preserved `summary.guided` counts. The timestamp spreader and re-hash flow must keep working with the v2 payload.

### 4. Subsystem note updates

- `usage-and-admin.md`: v2 export contents, boundary rule, hash-list semantics, flags.
- `file-pipelines.md`: the usage evidence JSON flow now has two schema versions in the wild; describe both honestly.

## Commands

```powershell
npm test
npm run build
npm run test:regression
npm run analyze:usage
```

## Validation Checklist

- [ ] v2 export carries ledger, pass ledger, capped boundary XML, hash list, flags; integrity verifies.
- [ ] v1 exports still readable everywhere they were before.
- [ ] Similarity experiment executed; results reported; no material detection loss (or stopped and surfaced).
- [ ] Regression pipeline green on v2 exports; `npm test` and `npm run build` pass.
- [ ] No run-version XML contents exported (hashes only).
- [ ] Both subsystem notes updated in the same patch and read true.
- [ ] Analyzer does not crash on v2 files (guard in place and marked for plan-109).
- [ ] Progress report includes the experiment table, commands run, and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- Boundary-only export XML breaks or materially degrades similarity detection (Plan 84 stop condition).
- v1 analyzer reading cannot be preserved through this packet's changes.
- Defining "pass/fail boundary" requires game-rule or pedagogy judgment (e.g., what counts as a boundary on challenge/project levels) — surface the question with options.
- The v2 payload forces cohort tooling changes beyond honest ingestion.
- Any approach requires a new dependency, server behavior, or real student data.
