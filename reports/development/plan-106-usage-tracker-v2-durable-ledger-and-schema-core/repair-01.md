# Plan 106 Repair Directions (Repair 01)

**Date:** 2026-07-21
**Source:** Orchestration review of the first Plan 106 implementation pass. Verdict: send back. Two confirmed contract violations, two majors, three minors.
**Status of this file:** durable work order for the repair pass. The packet (`docs/development/plan-106-usage-tracker-v2-durable-ledger-and-schema-core.md`) remains the contract; this file overrides nothing in it — it names exactly what the first pass got wrong and what "fixed" means.

## What the first pass got right (do not regress these)

- v1 session hydration and best-effort backfill work and are tested.
- Pass-ledger mirror keeps `src/core/levels.js` as writer of record; flow direction documented.
- `tests/unit/learning-ledger.test.js` contains real behavioral assertions — one of them correctly caught Critical 1 below. Keep the tests; make them runnable.

## Repair 1 (CRITICAL): Exports must stay v1-shaped

- **Defect:** `src/usage/usageFormat.js:403` reads `schemaVersion: session.schemaVersion || USAGE_SCHEMA_VERSION`, leaking the internal v2 marker (stamped at `usageFormat.js:120`) into every export. Packet non-goal: exports remain byte-compatible v1 until plan-108.
- **Fix:** pin the exported `schemaVersion` to `USAGE_SCHEMA_VERSION` (1) regardless of the internal session marker. The internal marker may stay on session records; it must not cross the export boundary anywhere in `createExportPayload`.
- **Proof:** the existing test `createExportPayload preserves v1 export shape and schemaVersion: 1` (`tests/unit/learning-ledger.test.js:165`) passes. Also grep the payload construction for any other field that leaks v2-only structure (ledger internals must not appear in the v1 payload).

## Repair 2 (CRITICAL): Register the test file and make it green

- **Defect:** `package.json:21` (`test:unit`) is an explicit file allowlist; `tests/unit/learning-ledger.test.js` was never added, so `npm test`'s 479/479 never executed it. Run directly, it fails 1 of 9.
- **Fix:** add `tests/unit/learning-ledger.test.js` to the `test:unit` file list in `package.json`. Full `npm test` must pass with the new file included.
- **Proof:** `npm test` passes AND the run output's test count includes the learning-ledger tests (state the before/after counts in the progress report).

## Repair 3 (MAJOR): Ledger field names must match Plan 81's rollup

- **Defect:** Packet Req 1 requires matching Plan 81's `guided_level_rollup` field names (see `src/usage/cohortAnalysis.js:319-334`): `reached`, `startedCount`, `completedCount`, `passedCount`, `failedCount`, `revisits`, `turnsSpent`, `durationMs`, `passed`. The first pass invented `attempts`/`passes`/`fails`/`turns`/`lastResult` (`src/usage/learningLedger.js:22-38`) and omitted `revisits` and duration tracking.
- **Fix (owner-approved direction):** rename to the rollup names and add the missing fields (`revisits`, `durationMs`). If the rollup carries a field that is genuinely meaningless at ledger level, keep it present but document its ledger-level semantics in the subsystem note. Do NOT keep the invented names.
- **Stop condition:** if you believe the rollup names distort the ledger's purpose, stop and surface with a concrete side-by-side instead of diverging silently.
- **Proof:** a test asserts the ledger entry keys match the rollup field set; the subsystem note's field list matches the code.

## Repair 4 (MAJOR): `finalXmlHash` and block counts must be live in production

- **Defect:** `finalXmlHash`, `startBlockCount`, `endBlockCount` populate only from event `xmlText`/`blockCount` fields that no real producer sends (`src/usage/usageTracker.js:289-298`, `303-313`, `321-336`; call site `src/core/levels.js:308-313`). Only `workspace_snapshot.blockCounts` feeds `endBlockCount`. Real sessions record `null`; tests pass only on synthetic hand-fed data.
- **Fix:** wire real data at level start and level end: when `recordLevelStarted`/`recordLevelEnded` fire, include the current workspace block count and the workspace XML (or its hash) from the Blockly workspace. Find how existing code reads current workspace XML (see `src/ai/blockly/workspace.js` export/snapshot paths) and reuse that access path; do not restructure producers. If end-of-level XML is genuinely unavailable at the `recordLevelEnded` call site, the cheapest honest source (e.g., the most recent workspace snapshot on the session) is acceptable — document the choice in the progress report.
- **Stop condition:** if honest wiring requires touching turn-engine or Blockly execution internals beyond reading current workspace state, stop and surface.
- **Proof:** a test that drives the real producer call path (not hand-fed event data) shows non-null hash and block counts; the progress report states which source feeds end-of-level XML.

## Repair 5 (MINOR): Flags must be strictly factual

- `src/usage/learningLedger.js:252-253`: `ledgerBackfilled: true` is set for any session with an empty guided ledger, including brand-new v2 sessions where nothing was backfilled. Set it only when backfill actually ran on a hydrated v1 session.
- `src/usage/learningLedger.js:244`: `eventCount >= maxEventsCap` flags a full-but-never-trimmed tail as truncated. A 400-event tail is only known-truncated if eviction actually occurred; track that explicitly (e.g., a counter set when splice/eviction runs) rather than inferring from count.
- **Proof:** targeted tests for both edge cases.

## Repair 6 (MINOR): Hash hygiene

- `src/usage/learningLedger.js:10-20` re-implements FNV-1a. Import the existing workspace-versioning hash instead of duplicating it, and apply the same whitespace/position normalization the starter-versioning contract uses (`docs/subsystems/blockly-workspace.md:66-73`), so the ledger digest is insensitive to pure reformatting. Do not change the starter-versioning hash itself — that algorithm is a stable contract.
- If the existing hash helper is not importable from `src/usage/` without an ugly dependency, duplicating is acceptable ONLY with a comment naming the contract source and a test pinning identical outputs for identical normalized inputs.

## Repair 7 (MINOR): Document `level_opened` on reset

- `src/core/levels.js:405`: `resetCurrentLevel` also fires `level_opened`. This is acceptable (idempotent in the ledger), but the subsystem note and the producer comment must say so explicitly.

## Repair 8: Progress report honesty

- Rewrite the validation section of `reports/development/plan-106-usage-tracker-v2-durable-ledger-and-schema-core/progress.md`: the earlier "479/479" run did not include the new tests, and "Problems Encountered: None" was false. Record the repair-pass commands, real counts, the Repair-4 data-source choice, and any remaining risks.

## Process requirements

- Do NOT run `plan-status.js set plan-106 complete`. Status flips happen only after orchestration re-review accepts the repair. Leave status at `in-progress`.
- Keep the diff scoped to the repairs above. No pruning/retention/export-shape/analyzer changes (plans 107–109).
- If any repair forces a choice the packet or this file does not cover, stop and surface — do not decide silently.

## Validation gate for the repair pass

1. `npm test` passes WITH `learning-ledger.test.js` registered (report counts).
2. `node --test tests/unit/learning-ledger.test.js` green standalone.
3. `npm run build` passes.
4. Exported payload from a v2-internal session still reports `schemaVersion: 1` and contains no v2-only fields (test-backed).
5. `docs/subsystems/usage-and-admin.md` reads true post-repair (field names, reset behavior, flag semantics).
6. Progress report rewritten per Repair 8.
