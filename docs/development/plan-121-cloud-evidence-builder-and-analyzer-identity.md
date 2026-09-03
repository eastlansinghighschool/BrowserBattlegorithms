---
id: plan-121
title: "Cloud Evidence Builder And Analyzer Identity Parity"
status: in-progress
depends_on: []
gate: "CLEARED 2026-09-01. Direct-mode boundary confirmed unchanged; blank-name handling resolved as Option 1 — the similarity discriminator becomes submitter identity (file identity, which later carries account attribution), not the typed name, and a group whose submitters cannot be distinguished says so explicitly. See the Gate section; nothing remains to stop for."
summary: >-
  Extract a pure, UI-free schema-v2 evidence builder with an identity-stripped cloud variant and fix the blank-name identity handling that currently degrades and false-positives in both analyzers. Preserve the policy that account attribution belongs in the later teacher-download filename, while deferring that server-side filename grammar to the canonical Stage 1 protocol/extraction surface. Local-only and testable with no GAS.
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
- Approval gate: **cleared 2026-09-01** — direct-mode boundary confirmed and the blank-name
  discriminator resolved as Option 1 (see Gate below). The implementer restates both in the
  preflight plan and proceeds.
- Depends on: nothing. (Write-scope is disjoint from `plan-118`/`plan-119` — those touch `src/platform/`, `src/ai/blockly/`, `src/core/levels.js`, `src/ui/*`, and `docs/subsystems/blockly-workspace.md` + `ui-mode-contract.md`; this packet touches `src/usage/`, `src/admin/`, `scripts/`, and `docs/subsystems/usage-and-admin.md` + `docs/CohortUsageDataDictionary.md`. **One exception, handled below: `package.json`.**)
- Blocks: the GAS Stage 1 client integration packet (which calls this builder). The later Stage 1
  canonical protocol/teacher-extraction packet owns the exact account-attributed download
  filename grammar; it must not be implemented in student client code.
- Expected artifacts:
  - `src/usage/cloudEvidence.js` — pure identity-stripped builder, no DOM and no networking
  - identity stripped from the top-level field and every retained event-data occurrence of
    `studentName`
  - one shared payload-plus-integrity construction used by both the download path and the cloud path
  - blank-name handling repaired in both `src/usage/usageAnalyzer.js` and `src/usage/usageAnalyzerBrowser.js`
  - unit tests including a whole-payload identity-absence assertion
  - updated `docs/subsystems/usage-and-admin.md` and `docs/CohortUsageDataDictionary.md`
  - progress report
- Progress report folder: `reports/development/plan-121-cloud-evidence-builder-and-analyzer-identity/`
- Progress report file: `reports/development/plan-121-cloud-evidence-builder-and-analyzer-identity/progress.md`

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
Owner decision 8 of 2026-09-01 (`review-synthesis.md`, "Ratified Direction") settled the identity policy: account attribution goes in the teacher's downloaded filename, never inside the hashed v2 payload. That decision is only safe if the payload is actually clean, and today it is not — review finding F6 established that `studentName` is embedded at the top level (`src/usage/usageFormat.js:557`) and inside `events[].data.studentName` for the `export_requested` and `export_completed` event families (`src/usage/usageTracker.js:493-529`). A first returned export contains the current request but appends its completion event afterward; a later export can contain that prior completion as well. `sanitizeEventsForV2Export` (`usageFormat.js:452-473`) strips `xmlText`, not names. A cloud builder that clears only the top-level field would upload self-reported student names to Drive while the project claimed it did not.

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

## Gate (before mutation) — CLEARED 2026-09-01

Both items resolved. Restate them in the preflight plan; there is nothing to stop for.

1. **Direct-mode boundary — CONFIRMED unchanged.** The typed-name prompt, the existing filename,
   the payload shape (including `studentName` at top level and inside the two export events), and
   the hash all stay exactly as they are in direct mode.

2. **Blank-name handling — RESOLVED as Option 1: the discriminator changes, not just the wording.**

   Background the implementer needs, because the current code is easy to misread. A *similarity
   group* is a set of two or more submitted files whose entire canonical event sequence matches
   (`getUsageEventFingerprint`, `src/usage/usageFormat.js:195`). The typed name is deliberately
   **excluded** from the fingerprint, so it never affects which files group together. It is used
   only in the second step, which decides whether a group is worth showing: a group is reported
   only when its labels are not all identical, on the theory that same-sequence-different-people
   is the interesting case and one person resubmitting is not.

   That second step is what breaks. With blank names the labels become `submission-1`,
   `submission-2`, which are trivially distinct, so every group passes the filter and is announced
   as "identical attempt sequence under **different names**" — a claim about a name comparison
   that never happened, shown to a teacher weighing academic integrity.

   The resolution is to make **submitter identity** the discriminator rather than the typed name:

   - Labels and the filter both use the best available submitter identity: the typed name when
     present, otherwise the caller-supplied file identity. Under owner decision 8 that file
     identity is where authenticated account attribution will live, so this is the version that
     keeps working when cloud evidence arrives instead of needing a second pass.
   - `submission-N` is a positional index, never a submitter identity. It may appear in display
     output but must **never** satisfy the "distinct submitters" test.
   - When a group's submitters cannot be distinguished from the files at hand, the group is still
     reported — the underlying signal is rare and real — but it says so plainly rather than
     implying a comparison. Wording: **"identical attempt sequence, submitters not distinguishable
     from these files."**
   - Suppressing such groups was considered and rejected: it would discard evidence a teacher may
     want.

The owner decision that authenticated attribution belongs in the teacher's downloaded filename
remains binding. This packet does not choose or implement that filename's exact grammar: the
student client never receives authenticated account attribution, and the grammar belongs in the
later canonical Stage 1 protocol/teacher-extraction surface where it can have one mechanically
checked source of truth.

## Additional review requirements (added 2026-09-01 at preflight review)

### The third similarity wording — RESOLVED by the owner

Option 1 makes three outcomes possible for a similarity group, not two. The first two were already
approved; the third was not, and the preflight plan invented it. Owner decision 2026-09-01:

| Case | Message |
| --- | --- |
| Distinct typed names | Existing wording — "identical attempt sequence AND identical captured program states under different names." Unchanged. |
| All names blank, file identities indistinguishable | Approved wording — "identical attempt sequence, submitters not distinguishable from these files." |
| All names blank, file identities differ | **"identical attempt sequence and identical captured program states in separate submissions."** |

The third message deliberately does **not** say "across distinct submitters," which the preflight
plan proposed. Two differing filenames prove two separate files were submitted; they do not prove
two different people submitted them. A teacher may have renamed files, or one student may have
submitted twice under different names — and in both cases an "across distinct submitters" sentence
is false while reading as authoritative. Overclaiming in an academic-integrity signal is the exact
defect class this packet exists to remove; do not reintroduce it in the fix.

### Do not implement a second SHA-256 helper

The preflight plan proposes implementing and exporting `computeBrowserSha256Hex` in
`usageFormat.js`. It already exists as a private function at `src/usage/usageTracker.js:198`.
Adding a second implementation would give the integrity contract two definitions of its own hash —
the one kind of duplication this packet must not create. Instead, let
`buildExportPayloadWithIntegrity` take `computeSha256` as an injected parameter (which the plan
already does) and have the tracker pass its existing function. If a single shared definition is
genuinely wanted, **move** it and leave no copy behind; do not duplicate it.

### Prove byte-identity with a captured fixture, not an assertion

"Direct-mode payload is byte-identical before and after" cannot be demonstrated by a post-packet
test comparing post-packet code to itself. **Before making any source change**, run the existing
`exportUsageFile` path with a fixed session id, fixed `exportedAt`, and fixed student name; capture
the exact payload; and commit it as a test fixture. The post-packet test asserts deep equality
against that captured fixture. Record in the progress report that the fixture was captured from
pre-packet code, and at which commit. Without this the byte-identity claim is unfalsifiable.

### Trim the returned-entry API

The plan adds `distinctSubmitters`, `submittersDistinguishable`, `hasDifferentNames`, `wording`,
and `description` to each returned entry. `wording` and `description` are two string fields for
one message and will drift. Keep one. Both analyzer copies must expose exactly the same field set,
and the parity test must compare the whole returned structure, not a subset.

### `package.json` is now yours

The concurrency exception in this packet's Depends-on line is **lifted**: `plan-118` and
`plan-119` both completed on 2026-09-01, and this is now the only live packet. Register
`tests/unit/cloud-evidence.test.js` in the `test:unit` list yourself; the orchestrator no longer
needs to do it at review. Run the full `npm test` after registering it.

## Scope

In scope:
- New `src/usage/cloudEvidence.js`.
- A shared payload-plus-integrity construction so the download path and the cloud path cannot drift.
- Event-level name stripping for the cloud path only.
- Blank-name labeling and grouping repair in both analyzer modules and their two consumers.
- Unit tests.
- Subsystem note and data dictionary updates.

**Concurrency exception — do not edit `package.json`.** `plan-118` is running concurrently and also
adds new test files, so the single `test:unit` line is shared state between two live packets. That
is the one thing commit discipline says cannot be handled concurrently no matter how careful either
agent is. Resolution: `plan-118` started first and owns `package.json`. **This packet must not touch
it.** Name your new test file(s) explicitly in the progress report; the orchestrator registers them
in `test:unit` at review and runs the full suite then. Validate your own work by running the test
files directly (`node --test tests/unit/<file>`), which the Commands section already specifies. A
`npm test` run from this packet will not include the new file, and that is expected — say so in the
report rather than treating it as a failure.

Out of scope:
- Anything with a network, an origin, or a Google surface.
- **`package.json`** — see the concurrency exception above.
- UI changes of any kind.
- Changing what events or snapshots are captured.
- Reworking similarity detection, thresholds, or code-aware similarity (a separate design packet per the 2026-07-22 decision).
- De-duplicating the two `compareUsageSummaries` copies into one module. Tempting, and out of scope: it touches the browser bundle boundary and deserves its own packet. Fix both copies identically and add a test that pins them to the same behavior, then note the duplication as a follow-up.

Files and areas likely touched: `src/usage/cloudEvidence.js` (new), `src/usage/usageFormat.js`, `src/usage/usageTracker.js`, `src/usage/usageAnalyzer.js`, `src/usage/usageAnalyzerBrowser.js`, `src/admin/adminApp.js`, `scripts/analyze-usage-files.js`, `tests/unit/cloud-evidence.test.js` (new), `tests/unit/usage-v2-export.test.js`, `tests/unit/usage-v2-analyzer-integration.test.js`, `tests/unit/usage-analyzer-browser.test.js`, `package.json` (`test:unit` list), `docs/subsystems/usage-and-admin.md`, `docs/CohortUsageDataDictionary.md`.

## Work Plan

1. Inspect current state. Confirm by test, before changing anything, that a synthetic name appears
   at the top level and in retained request/completion event data when those event families are
   present. Record the observed JSON paths rather than assuming an exact count: the current export
   appends its completion event after constructing the returned payload, so first and later exports
   legitimately differ. If no event-level occurrence can be reproduced, the packet's premise needs
   review.
2. Present the gate items. **Stop for owner approval.**
3. Extract the shared payload-plus-integrity construction; prove direct-mode output is unchanged.
4. Add `src/usage/cloudEvidence.js` with the identity-stripped builder.
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

Edge cases: a session with no events; an event whose `data` is absent or not an object; a `studentName` value that is whitespace only; a deeply nested occurrence of the key (handle it, and test it).

### R3 — Identity-absence test

Required behavior: seed a distinctive synthetic name (for example `ZZQX-SENTINEL-NAME`) through a realistic session that includes an export event, build a cloud payload, `JSON.stringify` the whole thing, and assert the sentinel string does not appear anywhere.

Constraints: this whole-payload search is the assertion that matters — a field-by-field check would have missed the event-level occurrences that finding F6 found. Say so in a comment so a later agent does not "simplify" it into field checks. Add the mirrored negative test: the direct-mode download payload still contains the top-level name and any request/completion event occurrences present in the seeded session.

### R4 — Blank-name analyzer repair

Required behavior, applied identically in `src/usage/usageAnalyzer.js` and `src/usage/usageAnalyzerBrowser.js`:

- **Submitter identity replaces the typed name as the discriminator.** Resolve each record's submitter identity as: typed `studentName` when non-blank, else the caller-supplied file identity. Thread that file identity into the comparison input; both consumers already have one (`filePath` in `scripts/analyze-usage-files.js`, `fileName` in `src/admin/adminApp.js`) — pass it rather than inventing a new field.
- **`submission-N` is positional, never an identity.** It may still appear in display output, but a group must never qualify as "distinct submitters" on the strength of positional indices. This is the actual defect; a fix that only changes wording while leaving `submission-N` in the distinctness test has not fixed it.
- **Groups with indistinguishable submitters are still reported**, using the gate-approved wording: *"identical attempt sequence, submitters not distinguishable from these files."* Do not suppress them.
- The CLI top-level summary line and the browser class table use the file identity when the name is blank, matching the fallback `adminApp.js` already applies to its duplicate flags.

Constraints:
- Similarity *semantics* are unchanged: the fingerprint grouping rule and the 2026-07-22 import-forensic labeling caveat stay exactly as they are.
- Do not diverge the two copies. Add a test that runs the same input through both and asserts the same comparison result, so the duplication cannot rot silently.
- Do not break `getStableKey` in `src/usage/cohortAnalysis.js` (it keys on fileName + payloadHash + sessionId and is unaffected — verify, do not assume).

Required tests for this requirement, beyond the same-input parity test:
- All-blank names, identical fingerprints, **distinct** filenames: assert the group is reported and is **not** described as a name comparison.
- All-blank names, identical fingerprints, **identical** filenames: assert the group is reported with the indistinguishable-submitters wording.
- Mixed: one named record and one blank, identical fingerprints: assert the named record's name is used and the group reports distinct submitters.
- Regression proof: construct the all-blank case and confirm it reports "different names" against pre-packet code and does not after. Record both results in the progress report.

### R5 — Docs

- `docs/subsystems/usage-and-admin.md`: the cloud evidence variant, its identity guarantee, the
  fact that the integrity contract is untouched, the binding policy that authenticated attribution
  will live in the teacher-download filename, and the blank-name analyzer behavior. State that
  the exact filename grammar is deferred to the canonical Stage 1 protocol/teacher-extraction
  packet and must not be re-created in student client code.
- `docs/CohortUsageDataDictionary.md`: one line noting that for identity-stripped exports, `identityMap.details[].studentName` is empty and longitudinal linking relies on the filename.

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

- [ ] Pre-packet top-level and retained event-data identity paths reproduced and recorded before
  any change, without assuming one exact occurrence count.
- [ ] Direct-mode payload proven byte-identical before and after.
- [ ] Cloud payload contains no sentinel identity string anywhere under whole-payload search.
- [ ] Cloud payload verifies under the unmodified `verifyUsageExport`.
- [ ] Schema version, canonicalization, and integrity algorithm unchanged.
- [ ] Both analyzer copies produce identical comparison output on the same input (pinned by test).
- [ ] All-blank-name similarity groups no longer report as "different names."
- [ ] CLI and browser both show the file identity where the name is blank.
- [ ] `npm test` passes (new test files are NOT registered by this packet — the orchestrator does that at review; see the concurrency exception).
- [ ] New test file names are stated explicitly in the progress report so the orchestrator can register them.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:tooling` passes (covers `admin.html`).
- [ ] `docs/subsystems/usage-and-admin.md` and `docs/CohortUsageDataDictionary.md` read true post-change.
- [ ] No UI, level, Blockly, or game-rule change.
- [ ] Test fixtures use synthetic names only.

## Stop Conditions

Stop and ask for review if:

- the pre-packet check cannot reproduce the top-level and retained event-data identity paths
  described above (premise review);
- making direct-mode output byte-identical requires changing the existing payload shape;
- the cloud payload cannot verify under the existing verifier without altering the integrity contract;
- threading file identity into the comparison functions turns into a broader analyzer refactor;
- the question of whether a cloud submission should append an export event to the ledger comes up (owner decision, not an implementer call);
- the work starts pulling in transport, origin, or GAS concerns;
- a change appears to require editing `package.json` or any file listed in `plan-118`'s scope (stop and report; do not coordinate around it in-flight).
