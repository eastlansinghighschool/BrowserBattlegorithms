---
id: plan-121
title: "Cloud Evidence Builder And Analyzer Identity Parity"
status: ready
depends_on: []
gate: "before mutation: owner confirms the cloud-evidence filename contract shape (the only place account attribution lives) and confirms that direct-mode download behavior, including the typed-name prompt and the name inside export events, is unchanged"
superseded_by: null
resolution: null
summary: >-
  Extract a pure, UI-free schema-v2 evidence builder with an identity-stripped cloud variant, pin the account-attributed filename contract that carries attribution instead of the payload, and fix the blank-name identity handling that currently degrades and false-positives in both analyzers. Local-only and testable with no GAS; it is the client half of GAS Stage 1 that does not depend on any probe outcome.
---
# Plan 121: Cloud Evidence Builder And Analyzer Identity Parity

## Packet Metadata

- Packet id: `plan-121`
- Packet title: Cloud Evidence Builder And Analyzer Identity Parity
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-01
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note + data dictionary)
- Approval gate: before mutation — owner confirms the filename contract and the no-change-to-direct-mode boundary (see Gate below).
- Depends on: nothing. (Disjoint write-scope from `plan-118`/`plan-119`, which touch `src/ai/blockly/` and `src/platform/`; this packet touches `src/usage/`, `src/admin/`, `scripts/`. Safe to run concurrently with those under commit-discipline mode B.)
- Blocks: the GAS Stage 1 client integration packet (which calls this builder) and the GAS Stage 1 teacher-extraction packet (which mirrors this filename contract server-side)
- Expected artifacts:
  - `src/usage/cloudEvidence.js` — pure builder plus the filename contract, no DOM and no networking
  - identity stripped from **all three** places `studentName` currently appears in a v2 payload
  - one shared payload-plus-integrity construction used by both the download path and the cloud path
  - blank-name handling repaired in both `src/usage/usageAnalyzer.js` and `src/usage/usageAnalyzerBrowser.js`
  - unit tests including a whole-payload identity-absence assertion
  - updated `docs/subsystems/usage-and-admin.md` and `docs/CohortUsageDataDictionary.md`
  - progress report
- Progress report folder: `reports/development/plan-121-cloud-evidence-builder/`
- Progress report file: `reports/development/plan-121-cloud-evidence-builder/progress.md`

## Packet Summary

Goal: Produce a sanitized schema-v2 evidence payload that contains no self-reported identity, preserves the existing integrity-hash contract exactly, and remains readable by the existing analyzers — and fix the analyzer behavior that blank names currently break.

Non-goals:
- No networking, no `postMessage`, no outbox, no Drive, no Sheet, no GAS. Nothing in this packet talks to anything.
- **Do not change direct/local mode.** The existing usage export keeps its typed-name prompt, its filename, its payload shape (including `studentName` at top level and inside the two export events), and its hash. A teacher opening a downloaded file after this packet must see exactly what they see before it.
- Do not change the v2 schema version, the integrity algorithm, the canonicalization, the boundary-XML rules, the completeness flags, or the run-version hash list.
- Do not change similarity-detection *semantics*. The 2026-07-22 decision-log ruling stands: the flag requires identical attempt sequences AND identical captured program states. This packet fixes how blank-named records are *labeled and grouped*, not what counts as similar.
- Do not add a UI. No new button, no cloud-mode submit control. The builder has no caller in the shipped app after this packet, by design.

Depends on: nothing.

Blocks: GAS Stage 1 client integration; GAS Stage 1 teacher extraction.

Why this packet exists:
Owner decision 8 of 2026-09-01 (`review-synthesis.md`, "Ratified Direction") settled the identity policy: account attribution goes in the teacher's downloaded filename, never inside the hashed v2 payload. That decision is only safe if the payload is actually clean, and today it is not — review finding F6 established that `studentName` is embedded in **three** places, not one: the top-level field (`src/usage/usageFormat.js:557`) and inside `events[].data.studentName` for both `export_requested` and `export_completed` (`src/usage/usageTracker.js:493-529`). `sanitizeEventsForV2Export` (`usageFormat.js:452-473`) strips `xmlText`, not names. A cloud builder that clears only the top-level field would upload self-reported student names to Drive while the project claimed it did not.

The second half is a defect that exists today, independent of GAS. `compareUsageSummaries` labels similarity groups as `studentName || submission-N` — and this logic is **duplicated** in `src/usage/usageAnalyzer.js:210-216` and `src/usage/usageAnalyzerBrowser.js:196-202`, which the usage-and-admin subsystem note says must not diverge. When names are blank, every label becomes a distinct `submission-N`, so `uniqueNames.size > 1` is trivially true and the "identical attempt sequence under **different names**" flag fires on records that have no names at all. That is a false positive pointed at a teacher making an academic-integrity judgment, and blank names are exactly what cloud mode produces. The CLI's top-level summary line and the browser table separately degrade to `(blank)` for every row.

This is the one piece of GAS Stage 1 whose design does not depend on any probe outcome: the identity policy is already ratified, and the work is pure, local, and unit-testable. It also improves the current product, because the analyzer repairs apply to any file with a blank name today.

## Authority And Contracts

Required reading:

- `docs/subsystems/usage-and-admin.md` — the v2 export contract, integrity semantics, and the rule that the CLI and browser analyzers must not diverge.
- `docs/subsystems/file-pipelines.md` — export/import surfaces.
- `docs/decision-log.md` — the 2026-07-22 similarity-semantics entry (import-forensic semantics; "not flagged" does not mean independent work).
- `reports/orchestration/gas-integration-commentary/review-claude.md` finding F6, and `review-synthesis.md` sections "Ratified Direction" (row: Analyzer identity) and 8.
- `src/usage/usageFormat.js:452-473` (`sanitizeEventsForV2Export`), `:520-586` (`createExportPayload`, `createExportFilename`).
- `src/usage/usageTracker.js:492-529` (`exportUsageFile`, and the two `record`/`appendUsageEvent` calls that embed the name).
- `src/usage/usageAnalyzer.js:32-49` (`verifyUsageExport` — the hash covers the whole payload minus `integrity`), `:177-222` (`compareUsageSummaries`).
- `src/usage/usageAnalyzerBrowser.js:112-120, 190-205` (the duplicated comparison logic).
- `src/admin/adminApp.js:105-120, 296-310` (existing `studentName || fileName` fallbacks and the `(blank)` table cell).
- `scripts/analyze-usage-files.js:23-35, 95-110` (the CLI already falls back to `basename(filePath)` for two of three flag families — confirm the exact current gap before changing anything).
- `src/usage/cohortAnalysis.js:32-37` (`getStableKey` keys on fileName + payloadHash + sessionId, so anonymization does not break on blank names).

Contracts to preserve:

- `verifyUsageExport` recomputes SHA-256 over the entire payload minus `integrity`. Nothing may be injected into a payload after hashing, and the cloud payload must verify under the unmodified existing verifier.
- Schema version stays `2`. Canonicalization (`canonicalJsonStringify`) is unchanged.
- CLI and browser analyzers must not diverge (subsystem note rule).
- Direct-mode download behavior is byte-identical after this packet.
- Raw student data never enters a tracked path; test fixtures use synthetic names.
- Static Vite build, no server dependency, no new runtime dependency.

## Gate (before mutation)

Present to the owner and stop:

1. **Filename contract.** Account attribution lives only here, so its shape is a product decision. Recommendation: a pure function `createCloudEvidenceFilename({ accountAttribution, sessionId, exportedAt })` producing a name that (a) begins with a filesystem-safe rendering of the account, so an alphabetically sorted download folder groups by student, (b) includes a short session discriminator so two files from one student do not collide, and (c) is stable and reproducible for the same inputs. Propose the exact template and two alternatives, and state the sanitization rule for characters that are illegal in filenames.
2. **Attribution source, stated explicitly.** Confirm: the value passed in is the server-derived authenticated account, supplied by the teacher-side extraction workflow, and this function never derives it from payload content. The client-side builder never sees it.
3. **Direct-mode boundary.** Confirm that the typed-name prompt, the existing filename, and the name inside export events are all unchanged in direct mode.
4. **Blank-name similarity labels.** Confirm the fix direction: when a record has no self-reported name, its label falls back to the file identity (filename), and a similarity group whose members are *all* unnamed must not be reported as "different names." Recommendation: report it as an unnamed-similarity group with wording that does not imply a name comparison happened.

## Scope

In scope:
- New `src/usage/cloudEvidence.js`.
- A shared payload-plus-integrity construction so the download path and the cloud path cannot drift.
- Event-level name stripping for the cloud path only.
- Blank-name labeling and grouping repair in both analyzer modules and their two consumers.
- Unit tests.
- Subsystem note and data dictionary updates.

Out of scope:
- Anything with a network, an origin, or a Google surface.
- UI changes of any kind.
- Changing what events or snapshots are captured.
- Reworking similarity detection, thresholds, or code-aware similarity (a separate design packet per the 2026-07-22 decision).
- De-duplicating the two `compareUsageSummaries` copies into one module. Tempting, and out of scope: it touches the browser bundle boundary and deserves its own packet. Fix both copies identically and add a test that pins them to the same behavior, then note the duplication as a follow-up.

Files and areas likely touched: `src/usage/cloudEvidence.js` (new), `src/usage/usageFormat.js`, `src/usage/usageTracker.js`, `src/usage/usageAnalyzer.js`, `src/usage/usageAnalyzerBrowser.js`, `src/admin/adminApp.js`, `scripts/analyze-usage-files.js`, `tests/unit/cloud-evidence.test.js` (new), `tests/unit/usage-v2-export.test.js`, `tests/unit/usage-v2-analyzer-integration.test.js`, `tests/unit/usage-analyzer-browser.test.js`, `package.json` (`test:unit` list), `docs/subsystems/usage-and-admin.md`, `docs/CohortUsageDataDictionary.md`.

## Work Plan

1. Inspect current state. Confirm by test, before changing anything, that a synthetic name seeded through a real export appears in all three locations. Record the observed count — if it is not three, the packet's premise needs review.
2. Present the gate items. **Stop for owner approval.**
3. Extract the shared payload-plus-integrity construction; prove direct-mode output is unchanged.
4. Add `src/usage/cloudEvidence.js` with the identity-stripped builder and the filename contract.
5. Repair blank-name labeling in both analyzers and both consumers.
6. Update docs.
7. Run validation; write the progress report.

## Implementation Requirements

### R1 — Shared payload construction

Required behavior: one function builds a v2 payload and attaches integrity, and both the existing download path and the new cloud path call it. Today the construction lives inline in `usageTracker.js:exportUsageFile`.

Constraints:
- Direct-mode output must be byte-identical before and after. Prove it: capture a payload from pre-packet code with a fixed session, fixed `exportedAt`, and fixed name; assert equality against post-packet output in a test.
- The hash is computed over the final payload minus `integrity`, exactly as now. No field is added after hashing.
- Keep the async SHA-256 seam (`computeBrowserSha256Hex`) injectable so tests do not need a browser crypto implementation, if it is not already.

### R2 — `src/usage/cloudEvidence.js`

Required behavior: `buildCloudEvidencePayload({ session, exportedAt, computeSha256 })` returns a schema-v2 payload plus integrity, containing **no** self-reported identity.

Constraints:
- Pure. No DOM, no `window`, no `localStorage`, no fetch, no imports from `src/ui/`.
- Strips `studentName` at the top level and inside `events[].data` for every event type that carries it — implemented as a general "remove this key wherever it appears in event data" pass, not a two-name allowlist, so a future event that adds the field is covered automatically.
- Preserves everything else the v2 contract promises: durable ledger, pass ledger, boundary XMLs, run-version hash list, completeness flags, sanitized snapshots.
- Verifies under the **unmodified** existing `verifyUsageExport`.
- Does not record an `export_requested` / `export_completed` event as a side effect the way `exportUsageFile` does, unless the owner decides cloud submissions should be logged in the ledger — if that question comes up, it is a stop condition, not an implementer call.

Also export `createCloudEvidenceFilename(...)` per the gate-approved contract, with its sanitization rule.

Edge cases: a session with no events; an event whose `data` is absent or not an object; a `studentName` value that is whitespace only; a deeply nested occurrence of the key (handle it, and test it).

### R3 — Identity-absence test

Required behavior: seed a distinctive synthetic name (for example `ZZQX-SENTINEL-NAME`) through a realistic session that includes an export event, build a cloud payload, `JSON.stringify` the whole thing, and assert the sentinel string does not appear anywhere.

Constraints: this whole-payload search is the assertion that matters — a field-by-field check would have missed the event-level occurrences that finding F6 found. Say so in a comment so a later agent does not "simplify" it into field checks. Add the mirrored negative test: the direct-mode download payload **does** still contain the name in all three places.

### R4 — Blank-name analyzer repair

Required behavior, applied identically in `src/usage/usageAnalyzer.js` and `src/usage/usageAnalyzerBrowser.js`:

- Similarity-group labels fall back to a caller-supplied file identity before falling back to `submission-N`. This requires threading a file identity into the comparison input; both consumers (`scripts/analyze-usage-files.js` and `src/admin/adminApp.js`) already have one available (`filePath` / `fileName`) — pass it rather than inventing a new field.
- A group whose members are all unnamed is **not** reported as "different names." Report it under the gate-approved wording that does not claim a name comparison occurred.
- The CLI top-level summary line and the browser class table use the file identity when the name is blank, matching the fallback `adminApp.js` already applies to its duplicate flags.

Constraints:
- Similarity *semantics* are unchanged: the fingerprint grouping rule and the 2026-07-22 import-forensic labeling caveat stay exactly as they are.
- Do not diverge the two copies. Add a test that runs the same input through both and asserts the same comparison result, so the duplication cannot rot silently.
- Do not break `getStableKey` in `src/usage/cohortAnalysis.js` (it keys on fileName + payloadHash + sessionId and is unaffected — verify, do not assume).

### R5 — Docs

- `docs/subsystems/usage-and-admin.md`: the cloud evidence variant, its identity guarantee, the fact that the integrity contract is untouched, the filename attribution contract, and the blank-name analyzer behavior.
- `docs/CohortUsageDataDictionary.md`: one line noting that for identity-stripped exports, `identityMap.details[].studentName` is empty and longitudinal linking relies on the filename.
- Note in the subsystem note that `createCloudEvidenceFilename` is the contract a future GAS teacher-extraction packet must mirror, and that the mirror must be mechanically checked, not hand-copied.

## Commands

```powershell
node --test tests/unit/cloud-evidence.test.js tests/unit/usage-v2-export.test.js tests/unit/usage-v2-analyzer-integration.test.js tests/unit/usage-analyzer-browser.test.js
```

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run test:browser:tooling
```

## Validation Checklist

- [ ] Pre-packet three-location finding reproduced and recorded before any change.
- [ ] Direct-mode payload proven byte-identical before and after.
- [ ] Cloud payload contains no sentinel identity string anywhere under whole-payload search.
- [ ] Cloud payload verifies under the unmodified `verifyUsageExport`.
- [ ] Schema version, canonicalization, and integrity algorithm unchanged.
- [ ] Both analyzer copies produce identical comparison output on the same input (pinned by test).
- [ ] All-blank-name similarity groups no longer report as "different names."
- [ ] CLI and browser both show the file identity where the name is blank.
- [ ] `npm test` passes; new test files registered in `package.json`.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:tooling` passes (covers `admin.html`).
- [ ] `docs/subsystems/usage-and-admin.md` and `docs/CohortUsageDataDictionary.md` read true post-change.
- [ ] No UI, level, Blockly, or game-rule change.
- [ ] Test fixtures use synthetic names only.

## Stop Conditions

Stop and ask for review if:

- the pre-packet check does not find the name in three locations (premise review);
- making direct-mode output byte-identical requires changing the existing payload shape;
- the cloud payload cannot verify under the existing verifier without altering the integrity contract;
- threading file identity into the comparison functions turns into a broader analyzer refactor;
- the question of whether a cloud submission should append an export event to the ledger comes up (owner decision, not an implementer call);
- the work starts pulling in transport, origin, or GAS concerns.
