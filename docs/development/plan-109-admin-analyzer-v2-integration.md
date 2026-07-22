---
id: plan-109
title: "Admin Analyzer V2 Integration"
status: in-progress
depends_on: [plan-108]
gate: "none beyond standard; CLI/browser parity is a hard requirement"
summary: >-
  Make the admin analyzer and CLI prefer v2 ledgers over event reconstruction, read both v1 and v2 exports honestly (B1), label old/truncated files, fold in known display fixes, and record the D4 cohort re-scope note.
---
# Plan 109: Admin Analyzer V2 Integration

## Packet Metadata

- Packet id: `plan-109`
- Packet title: Admin Analyzer V2 Integration
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-21
- Packet type: implementation / frontend
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: none beyond standard validation; the v2 export shape is settled by plan-108's gate.
- Depends on: plan-108 (v2 export shape + similarity verification)
- Blocks: nothing downstream; completes the Usage Tracker V2 teacher-facing loop
- Expected artifacts:
  - ledger-first analyzer paths in CLI and browser admin page
  - dual-version (v1/v2) reading with honest labels
  - display fixes (`—` instead of `<1s approx`; truncation review-signals surfaced)
  - D4 cohort re-scope note in the progress report
  - unit + browser tests
  - updated `docs/subsystems/usage-and-admin.md`
  - progress report
- Progress report folder: `reports/development/plan-109-admin-analyzer-v2-integration/`
- Progress report file: `reports/development/plan-109-admin-analyzer-v2-integration/progress.md`

## Packet Summary

Goal: Complete the teacher-facing half of Usage Tracker V2. The analyzer (CLI `src/usage/usageAnalyzer.js` + browser `src/usage/usageAnalyzerBrowser.js` + `src/admin/adminApp.js`) currently reconstructs guided progress from raw events and `summary`; after this packet it prefers the durable ledger when present, reads v1 files exactly as before, and tells the teacher plainly which kind of file they are looking at and how complete it is.

Non-goals:
- Do not change the v2 export shape (plan-108 owns it; if the shape looks wrong, stop and surface).
- Do not change cohort tooling semantics; the D4 re-scope is a note, not new analysis.
- Do not redesign the admin page UI beyond the labels/fixes named here.
- Do not remove the event-reconstruction path — v1 files need it permanently.
- Do not add dependencies.

Depends on:
- plan-108 complete, including its similarity experiment.

Blocks:
- Nothing; this closes the V2 teacher loop. plan-96's star-field slice separately depends on plan-110.

Why this packet exists:
B1 is a hard contract: teachers will show up with a mix of v1 and v2 files for at least a full school year, and the analyzer must never silently misread either. Today both analyzers derive guided progress by replaying events (`guidedProgress.js` against `getLevelDefinitions()`), which is exactly the v1 fragility V2 fixes — truncated event tails produce confident-looking wrong stories. Ledger-first reading makes the v2 story both better and cheaper, and honest labeling keeps old-file interpretation truthful. The bundled display fixes (`—` for sub-second approximations, surfacing the truncation review-signals the analyzer already computes) are small now-fixes Plan 84 explicitly assigned here.

## Authority And Contracts

Required reading:

- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — B1, downstream item 2 wording (the spec for this packet), D4.
- `docs/development/plan-108-...md` progress report — the landed v2 shape and experiment results.
- `docs/subsystems/usage-and-admin.md` — analyzer signal-vs-noise philosophy; update in this patch.
- `src/usage/usageAnalyzer.js`, `src/usage/usageAnalyzerBrowser.js`, `src/usage/guidedProgress.js`, `src/admin/adminApp.js` (555 lines; consumed fields are enumerated in the plan-108 exploration: `summary.guided.*`, `guidedProgress.*`, raw `events`/`snapshots` in detail views).
- `scripts/analyze-usage-files.js` — CLI entry.
- `tests/unit/usage-analyzer-browser.test.js`, `tests/unit/usage-file.test.js`, `tests/unit/guided-progress.test.js`, `tests/browser/admin.spec.js`, `tests/regression/usage-pipeline-admin.spec.js`.

Contracts to preserve:

- CLI/browser analyzer parity (existing contract; covered by `usage-analyzer-browser.test.js`).
- v1 files produce identical analysis to before this packet (golden behavior — add a fixture test if none exists).
- The admin page stays local-only and out of the GitHub Pages build.
- Analyzer philosophy: signal over noise, honest uncertainty, no surveillance framing.
- Privacy: no new data surfaced beyond what v2 exports already carry.

## Carried Follow-Up From Plan 108 Review (2026-07-22)

Plan 108's similarity experiment documented a **pre-existing detector limitation**: `similarSequencesDifferentNames` keys on event-attempt-sequence fingerprints, so a student who copies a final solution but arrives through a different attempt history is NOT flagged (verified by the Alice/Eve pair across export shapes). This is not a v2 regression — but when this packet makes the analyzer ledger-first, consider whether an honest label or review signal near the similarity output is warranted so teachers do not read "not flagged" as "independent work." Do not redesign similarity detection in this packet; if more than a label seems warranted, stop and surface.

## Scope

### In Scope

- Ledger-first guided progress: when a v2 file is loaded, `guidedProgress` equivalents read the durable ledger + pass ledger instead of reconstructing from events.
- Dual-version dispatch: detect `schemaVersion` (absent/1 vs 2), route accordingly, and label the file's version and completeness (truncation flags surfaced as review signals) in both CLI and admin UI.
- Display fixes: `—` instead of `<1s approx`; surface truncation/completeness review-signals.
- Remove plan-108's temporary don't-crash guard in favor of real v2 support.
- D4 re-scope note: record in the progress report that any cohort run on this year's (v1) data is progression-distribution only, caveated, with per-level insight targeting next year's v2 data.
- Tests: v1/v2 fixture pairs, parity tests, admin browser test updates.
- Subsystem note update in the same patch.

### Out of Scope

- Export-side changes, tracker runtime changes.
- Cohort analysis features (`usage-cohort-analysis` tooling) beyond the note.
- New admin visualizations beyond labels/fixes named here.

### Files And Areas Likely Touched

- `src/usage/usageAnalyzer.js`, `src/usage/usageAnalyzerBrowser.js`, `src/usage/guidedProgress.js` (or a ledger-first sibling — prefer additive over rewriting the v1 path).
- `src/admin/adminApp.js` — version/completeness labels, `—` fix, review-signal surfacing.
- `scripts/analyze-usage-files.js` — if the CLI summary needs the same labels.
- Tests listed above; `docs/subsystems/usage-and-admin.md`.

## Work Plan

1. Inspect plan-108's landed export shape and guard.
2. Summarize the job back before editing.
3. Implement version dispatch + ledger-first read path.
4. Implement labels and display fixes in CLI and admin UI.
5. Add v1/v2 fixture tests; verify v1 golden behavior unchanged.
6. Run targeted tests, `npm test`, `npm run build`, `npm run test:browser:smoke` (admin coverage), and `npm run test:regression` if practical.
7. Update the subsystem note; write the progress report including the D4 re-scope note.

## Implementation Requirements

### 1. Ledger-first reading (v2)

- Required behavior: for v2 files, highest reached/passed, per-level stories, and challenge evidence come from the durable ledger and pass ledger, not event replay.
- Constraint: where the v2 file still carries `events`/`snapshots`, detail views may keep showing them, but the summary story must be ledger-derived. Where ledger and event reconstruction disagree on a v2 file, trust the ledger and say so in a review signal.
- Edge cases: v2 file with `historyPartial` flag (label it); v2 file with ledger entries for retired level ids (display without crashing).

### 2. Honest dual-version labels (B1)

- Required behavior: both CLI and admin UI state the file's schema version and, for v1 or flagged-partial v2, a plain-language completeness caveat near the guided progress story.
- Constraint: wording follows the analyzer's signal-vs-noise philosophy — factual, not alarming. Teacher-facing copy should be short and projector-readable.

### 3. Display fixes

- `—` instead of `<1s approx` for sub-second durations.
- Surface the truncation review-signals the analyzer already computes (Plan 84 named these as now-fixes for this packet).

### 4. Tests and parity

- v1 golden fixtures: analysis output identical pre/post packet.
- v2 fixtures: ledger-first results correct; parity between CLI and browser analyzers maintained.
- Browser: `tests/browser/admin.spec.js` and the regression admin upload flow still pass with v2 files added to the mix.

## Commands

```powershell
npm test
npm run build
npm run test:browser:smoke
npm run test:regression
```

## Validation Checklist

- [ ] v2 files read ledger-first; v1 files produce unchanged analysis.
- [ ] Version + completeness labels present in CLI and admin UI.
- [ ] `—` fix and truncation review-signals landed.
- [ ] plan-108's temporary guard replaced by real support.
- [ ] CLI/browser parity tests pass; `npm test`, `npm run build`, `npm run test:browser:smoke` pass.
- [ ] Admin page still excluded from the Pages build.
- [ ] Subsystem note updated in the same patch and reads true.
- [ ] Progress report includes the D4 re-scope note, commands run, and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- The v2 export shape proves wrong or insufficient for ledger-first reading (that is a plan-108 problem — surface, don't patch around it).
- v1 golden behavior cannot be preserved without contortions.
- Honest labeling would require UI redesign beyond this packet's scope — propose the minimal version and surface the rest.
- Cohort tooling pressure appears (requests to "just also fix" cohort analysis) — that is out of scope; surface as a future packet candidate.
