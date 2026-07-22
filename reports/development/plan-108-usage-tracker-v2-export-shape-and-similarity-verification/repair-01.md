# Plan 108 Repair Directions (Repair 01)

**Date:** 2026-07-22
**Source:** Orchestration review of the first Plan 108 implementation pass (Gemini). Verdict: send back. Three material defects, three minors. Scope discipline, B1 readability, integrity hashing, and honest commands-run reporting were all good — repair, don't rewrite.
**Status of this file:** durable work order. The packet (`docs/development/plan-108-usage-tracker-v2-export-shape-and-similarity-verification.md`) remains the contract.

## What the first pass got right (do not regress these)

- Scope: no analyzer/cohort edits; package.json only the test registration; packet/README diffs are status machinery only.
- B1: v1 files still readable; v1 export path preserved via option; no analyzer changes needed or made.
- SHA-256 integrity verified over the v2 payload by test.
- `learning-ledger.test.js` adaptation via `{ schemaVersion: 1 }` is legitimate.
- Commands-run section of the progress report is honest about what actually ran.

## Repair 1 (MAJOR): v2 exports must not carry full XML in snapshots

- **Defect:** the v2 branch keeps `snapshots: cloneJson(session.snapshots || [])` (`src/usage/usageFormat.js` ~540), and snapshot data includes full `xmlText` (`src/usage/usageTracker.js:171`). `sanitizeEventsForV2Export` only processes `events`. Up to 48 uncapped full program XMLs still travel in every v2 export — exactly what D3 ("full XML only at pass/fail boundaries, capped") forbids. The progress report's "payload sizes are substantially reduced" is currently false.
- **Fix:** strip `xmlText` from exported snapshots in the v2 path (keep the snapshot structure and metadata; retain an `xmlHash` where one is cheaply available). The analyzer reads only `snapshots.length` (`src/usage/usageAnalyzer.js:108`), so this does not break B1 — verify by test.
- **Proof:** a test asserting no exported v2 field outside `boundaryXmls` contains workspace XML (recursive check or targeted assertions on events + snapshots); payload-size comparison reported honestly in the progress report.

## Repair 2 (MAJOR): No fabricated boundaries; fix recency fallback

- **Defect A:** `getBoundaryXmlsForExport`'s fallback loop (`src/usage/runVersionStore.js` ~329-338) labels every store version for a level lacking a `level_completed` event as `result: "COMPLETED"`. Abandoned and in-progress levels get teacher-facing "completion" evidence they never earned. This is a data-honesty violation — the tracker may never invent learning outcomes.
- **Defect B:** the event-XML fallback `versions.find(v => v.at === event.at) || versions.at(-1)` almost never timestamp-matches, so after event-tail eviction a boundary inherits the latest stored version — potentially from a later revisit, misattributing XML to an earlier pass.
- **Fix A:** a boundary exists only for a real pass or level-ending-fail event. Levels without one contribute NO boundary XML (the ledger already carries their honest story). Never synthesize a result.
- **Fix B:** match XML to a boundary by choosing the latest stored version at-or-before the boundary event's timestamp; if none exists, emit the boundary with hash only and no XML, flagged. Document the matching rule in the subsystem note.
- **Proof:** tests for (a) abandoned level → no boundary, no fabricated result; (b) pass → revisit-with-edits → exported boundary XML is the version at-or-before the pass, not the revisit; (c) boundary with no eligible version → hash-only + flag.

## Repair 3 (MAJOR): Rebuild the experiment so it can say something true

- **Defect:** `similarSequencesDifferentNames` is exact event-fingerprint equality (`src/usage/usageAnalyzer.js:160-178`); the fingerprint never consumed XML as content. Alice and Bob are byte-identical sessions, so their fingerprints match in all three export shapes by construction — no arm of the experiment could fail. The "100% detection accuracy" conclusion is a tautology, and the packet's named partially-shared case is absent.
- **Fix:** rewrite the experiment section around what the detector actually reads:
  1. State plainly, with code references, that v1 detection operates on event-sequence fingerprints and that v2 sanitization does not alter the events the fingerprint consumes — the honest gate conclusion is "v2 changes nothing the detector reads," argued from the fingerprint's inputs, plus a deterministic-sanitization check.
  2. Add the partially-shared pair (shared solution on one level, independent on another) across all three shapes and report what happens.
  3. Add the discriminating pair the current detector CANNOT catch — same copied final program, different attempt sequences — and report it as a pre-existing detector limitation, not a v2 regression. This is exactly the falsification discipline the packet's gate exists to enforce: name what the detector cannot see.
- **Proof:** the experiment test(s) cover all three pairs across all three shapes; the progress report's conclusion uses the honest framing above and drops "100% detection accuracy."

## Repair 4 (MINOR): Flag boundary-cap truncation

- Packet Req 1: "boundary cap exceeded (keep most recent per level, flag truncation)." `slice(-kPerLevel)` currently caps silently (`runVersionStore.js` ~340-343). Set a flag (e.g. `boundaryXmlsTruncated`) when the cap drops entries, with a test.

## Repair 5 (MINOR): Document the boundary rule (orchestrator-accepted)

- The packet named boundary definition on challenge/project levels a stop-and-ask. Orchestrator ruling so this doesn't bounce: **boundary = a real pass or level-ending-fail event, any level kind** (with Repair 2's no-fabrication rule) is accepted as the mechanical rule. Your job: document it precisely in `docs/subsystems/usage-and-admin.md` (rule 9 is currently one vague line) and `docs/subsystems/file-pipelines.md`, including the timestamp-matching rule, the hash-only fallback, and the snapshot-XML stripping from Repair 1. The two-schema-version reality in file-pipelines.md is fine as-is.

## Repair 6 (MINOR): Run the remaining packet commands, report honestly

- `npm run test:regression` and `npm run analyze:usage` are packet commands. Run both and report results.
- Known pre-existing condition (verified by orchestrator at clean HEAD `8f26b51`): `test:regression` currently fails in global setup — `Regression profile Challenged Charlie attempt for index-jobs should fail, but ended as PASSED` (`tests/regression/student-profiles.js:408`). This predates plans 106–108 and is NOT yours to fix (owner triage is separate). Run the suite, document this exact failure as pre-existing, and state whether your changes introduce any NEW failure beyond it. Do not claim the suite passes; do not modify `student-profiles.js` fixtures.

## Repair 7: Progress report corrections

- Remove or correct: "100% detection accuracy" (see Repair 3), "payload sizes are substantially reduced" (false until Repair 1 lands — then provide the real before/after numbers).
- Add: the boundary rule as implemented, the detector-limitation finding from Repair 3, the pre-existing regression failure disclosure from Repair 6.

## Process requirements

- Do NOT run `plan-status.js set` at any status.
- Keep the diff scoped to these repairs. No analyzer rewrites (plan-109), no game-rule or fixture changes.
- If a repair forces a choice this file does not cover, stop and surface.

## Validation gate for the repair pass

1. `npm test` passes with `usage-v2-export.test.js` registered (report counts).
2. New tests mandatory from Repairs 1, 2, 4 present and green.
3. `npm run build` passes.
4. `npm run test:regression` and `npm run analyze:usage` run, with the pre-existing failure disclosed per Repair 6.
5. Subsystem notes document the boundary rule, matching rule, snapshot stripping, and flags truthfully.
6. Progress report corrected per Repair 7.
