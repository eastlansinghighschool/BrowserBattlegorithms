---
id: plan-106
title: "Usage Tracker V2 Durable Ledger And Schema Core"
status: complete
resolution: "Durable per-level learning ledger (Plan 81 rollup fields), level_opened capture, pass-ledger mirror, schema v2 core with v1 hydration/backfill, factual truncation flags. Accepted after Repair 01 re-review; follow-ups carried to plans 107/108."
depends_on: [plan-84, plan-91]
gate: "none; design contract settled by Plan 84 (D1-D4, B1-B7 accepted 2026-06-04)"
summary: >-
  Build the Usage Tracker V2 durable per-level learning ledger and schema v2 core: incremental per-level rollups, level_opened records, guided pass-ledger mirroring, v1 back-compat hydration, and truncation/completeness flags. No pruning, retention, run-version, or export-shape changes; those are plans 107 and 108.
---
# Plan 106: Usage Tracker V2 Durable Ledger And Schema Core

## Packet Metadata

- Packet id: `plan-106`
- Packet title: Usage Tracker V2 Durable Ledger And Schema Core
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-21
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: none; design contract settled by Plan 84 (D1–D4, B1–B7 accepted 2026-06-04). Any change to a settled decision requires owner sign-off — stop and surface instead.
- Depends on: Plan 84 (design contract), Plan 91 (rewrite-semantics amendment)
- Blocks: plans 107, 108, 110 (all key off this schema)
- Expected artifacts:
  - durable per-level learning ledger in the usage store
  - `level_opened` capture
  - schema v2 internal representation with v1 back-compat hydration
  - truncation/completeness flags
  - unit tests (synthetic data only)
  - updated `docs/subsystems/usage-and-admin.md`
  - progress report
- Progress report folder: `reports/development/plan-106-usage-tracker-v2-durable-ledger-and-schema-core/`
- Progress report file: `reports/development/plan-106-usage-tracker-v2-durable-ledger-and-schema-core/progress.md`

## Packet Summary

Goal: Implement tier 1 of the Plan 84 three-tier data model — the durable, never-evicted per-level learning ledger — plus the schema v2 skeleton every later tracker packet builds on. The ledger is maintained incrementally (like today's `summary`) so per-level learning evidence survives event trimming forever.

Non-goals:
- Do not change pruning, retention, or eviction behavior (that is plan-107).
- Do not build the run-version store (plan-107).
- Do not change the export payload shape or `schemaVersion` in exported files (plan-108). Exports remain byte-compatible v1 after this packet.
- Do not change the admin analyzer (plan-109).
- Do not populate Plan 91 rewrite-aware fields (plan-110); the schema may reserve space for them but nothing writes them.
- Do not add dependencies, server behavior, or new PII.

Depends on:
- Plan 84 accepted decisions D1–D4 and defaults B1–B7.
- Plan 91 field list (for schema reservation only).

Blocks:
- plan-107 (run-version store hangs off the v2 schema), plan-108 (export v2 serializes this ledger), plan-110 (rewrite-aware fields extend this ledger).

Why this packet exists:
The two v1 data-loss mechanisms Plan 84 diagnosed are both ledger-absence problems: biased FIFO truncation (`USAGE_MAX_EVENTS = 400`, splice-from-front in `appendUsageEvent`) evicts per-level struggle detail first, and "reached" is only seeded by `level_started`/`level_completed`, so a student who opens a level and never presses Run is invisible. A durable, incrementally maintained per-level rollup fixes both permanently and gives teachers the campaign-long learning story the current 7-day event window cannot. This is the foundation for next year's trustworthy cohort data (D4).

## Authority And Contracts

Required reading:

- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — the settled contract this packet executes (D1–D4, B1–B7, three-tier model, stop conditions).
- `docs/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment.md` — field reservation list only; no population here.
- `docs/subsystems/usage-and-admin.md` — authoritative v1 event taxonomy, storage ladder, analyzer contract. Must be updated in this same patch.
- `src/usage/usageTracker.js` — session lifecycle, `pruneSessions`, `schedulePersist`.
- `src/usage/usageFormat.js` — schema constants, export payload, canonical JSON + integrity.
- `src/usage/guidedProgress.js` — how progress is currently reconstructed from events (the v1 pattern the ledger replaces for v2 readers).
- `src/core/levels.js` — `bba:guided-level-progress` pass ledger (line ~24) and guided event producers (lines ~304–487).
- `tests/unit/usage-file.test.js`, `tests/unit/guided-progress.test.js`, `tests/unit/usage-analyzer-browser.test.js` — existing coverage that must keep passing.

Decisions this packet must not redefine:

- D1–D4 and B1–B7 (owner-settled 2026-06-04). B6 values for this packet series are owner decisions recorded in `docs/decision-log.md` (2026-07-21): run-version byte budget **~2 MB**; per-level guided version cap **K = 5** (first + last + most-recent-5); durable ledger and run-version store **exempt from age-based eviction**, with the 7-day / 20-session age rule applying only to ephemeral churn. Changing any of these requires owner sign-off and an amended decision-log entry — stop and surface instead.
- Static Vite deployment; no server; no new dependencies without explicit owner approval.
- The durable ledger is never evicted (B2 priority 1).
- The ledger's per-level rollup shape intentionally matches Plan 81's `guided_level_rollup` table so v2 exports feed the cohort pipeline directly.
- Similarity detection (Plan 04/16) must keep working; this packet changes no export content, so any similarity regression here means something went wrong — stop.

## Scope

### In Scope

- New durable ledger structure on the v2 session record, keyed by guided `levelId`, maintained incrementally by existing event producers.
- `level_opened` capture for guided levels (B4) so "reached" no longer requires pressing Run.
- Mirroring the cross-session guided pass ledger (`bba:guided-level-progress`) into the v2 durable store so plan-108 can export it (B5).
- Internal schema v2 representation: sessions carry a schema marker; v1 sessions hydrate with an empty ledger plus best-effort backfill from surviving events, honestly flagged.
- Truncation/completeness flags on the session record recording when the ledger was backfilled from a partial event tail or when source data was known-truncated.
- Unit tests with synthetic data only.
- Subsystem note update (`docs/subsystems/usage-and-admin.md`) in the same patch.

### Out of Scope

- Pruning/retention/eviction changes, run-version store, snapshot coalescing (plan-107).
- Export payload shape, `schemaVersion: 2` in exported files, boundary-XML export (plan-108).
- Admin analyzer or CLI analyzer changes (plan-109).
- Plan 91 rewrite-aware field population (plan-110).
- Cohort tooling (`src/usage/cohortAnalysis.js`) changes.
- Browser/Playwright changes; this is a data-layer packet.

### Files And Areas Likely Touched

- `src/usage/usageTracker.js`, `src/usage/usageFormat.js` (schema constants, hydration).
- Possibly a new `src/usage/learningLedger.js` module — preferred over growing `usageTracker.js` further (currently ~425 lines).
- `src/core/levels.js` — add the `level_opened` producer call beside existing guided event producers (lines ~304–487). Minimal diff; do not restructure.
- `tests/unit/` — new `learning-ledger.test.js` (or similar) plus small additions to existing usage tests if hydration paths live there.
- `docs/subsystems/usage-and-admin.md`.

## Work Plan

1. Inspect current state and confirm the assumptions above (file layout, producer call sites, pass-ledger shape in `src/core/levels.js`).
2. Summarize the job back before editing, per the implementer prompt.
3. Implement the ledger module and wire incremental updates from existing event types (`level_started`, `level_completed`, `level_opened`, plus turn/score data already flowing).
4. Implement v2 schema marker + v1 hydration/backfill + flags.
5. Add focused unit tests.
6. Run targeted tests, then `npm test` and `npm run build`.
7. Update the subsystem note.
8. Report results, risks, and follow-ups.

## Implementation Requirements

### 1. Durable per-level ledger

- Required behavior: every guided level the student interacts with gets a ledger entry maintained incrementally (like `summary` today), never reconstructed from the event array at read time.
- Minimum fields per entry: `reached`, `started`, `attempts`, `passes`, `fails`, total `turns`, first/last activity timestamps, `lastResult`, start/end block counts, and an XML hash of the final program state. Match Plan 81's `guided_level_rollup` shape; check `src/usage/cohortAnalysis.js` for the exact field names and reuse them.
- Constraint: ledger update must be O(1) per event, synchronous with the existing summary rollup, and must not change any existing event or summary content.
- Edge cases: level replayed after passing; level abandoned without completing; events arriving for unknown/retired level ids (record, don't crash); clock weirdness across sessions.

### 2. `level_opened` capture (B4)

- Required behavior: opening a guided level records a durable reached marker even if the student never runs a program.
- Constraint: fire once per level-open transition, not per render; do not spam the event log — a durable ledger flag is the point, though a `level_opened` event may also be appended if it stays inside existing caps.
- Edge case: returning to an already-passed level must not clobber pass data.

### 3. Guided pass-ledger mirroring (B5 prep)

- Required behavior: the v2 store carries a mirror of `bba:guided-level-progress` (the cross-session pass ledger in `src/core/levels.js`) so plan-108 can export it without touching localStorage at export time.
- Constraint: `src/core/levels.js` remains the writer of record; the usage layer mirrors/reads. Do not create two competing sources of truth — document the direction of flow in the subsystem note.

### 4. Schema v2 core + v1 back-compat (B1 foundation)

- Required behavior: session records gain a schema marker and the new ledger fields; sessions written by v1 code hydrate cleanly with an empty ledger, then best-effort backfill from whatever events survive, flagged as backfilled/partial.
- Constraint: v1 sessions must remain fully readable by v1 code paths still present (nothing is removed in this packet), and exported files remain v1-shaped until plan-108.
- Edge cases: backfill from a truncated 400-event tail must set the completeness flag rather than presenting partial history as complete; a session with zero surviving guided events gets `reached` only from real opens, not invented.

### 5. Truncation/completeness flags

- Required behavior: the session record carries explicit flags the analyzer (plan-109) can later surface: e.g. `ledgerBackfilled`, `eventTailTruncated`, `historyPartial`.
- Constraint: flags are factual, not interpretive; no UI in this packet.

### 6. Subsystem note update

- Update `docs/subsystems/usage-and-admin.md` in the same patch: the event taxonomy gains `level_opened`, the storage ladder gains the durable ledger tier, and the v1→v2 transition state is described honestly (v2 internal, v1 exports until plan-108).

## Commands

```powershell
npm test
npm run build
```

Targeted first, e.g. the usage unit test files, then the full suite.

## Validation Checklist

- [ ] Ledger updates incrementally and matches Plan 81 `guided_level_rollup` field shape.
- [ ] `level_opened` seeds `reached` without a run; pass data survives revisits.
- [ ] v1 sessions hydrate and backfill with honest flags; no v1 read path broken.
- [ ] Exported files are still v1-shaped and byte-consistent with pre-packet behavior (export shape is plan-108's job).
- [ ] New unit tests pass; `npm test` passes; `npm run build` passes.
- [ ] `docs/subsystems/usage-and-admin.md` updated in the same patch and reads true.
- [ ] No dependencies added; no producer call sites restructured beyond the `level_opened` addition.
- [ ] No unrelated files changed.
- [ ] Progress report lists commands run, decisions surfaced, and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- v1 analyzer reading cannot be preserved (contract stop condition from Plan 84).
- The ledger shape cannot match Plan 81's rollup without distorting either side.
- The only viable approach requires a new dependency, server behavior, or an export-schema change now (that belongs to plan-108).
- Backfill honesty cannot be maintained (e.g., flags would mislead teachers about completeness).
- You find yourself changing pruning, retention, export contents, or analyzer behavior — those are plans 107–109; narrowing this boundary needs owner sign-off.
