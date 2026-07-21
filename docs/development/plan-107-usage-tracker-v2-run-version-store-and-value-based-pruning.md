---
id: plan-107
title: "Usage Tracker V2 Run-Version Store And Value-Based Pruning"
status: ready
depends_on: [plan-106]
gate: "none; design contract settled by Plan 84 (D1-D4, B1-B7); B6 values recorded in packet"
superseded_by: null
resolution: null
summary: >-
  Build tier 2 of the Usage Tracker V2 model: the diff-deduped run-version store (last ~8 guided levels cross-session, last ~20 free-play runs, per-level cap K=5, ~2 MB byte budget) and value-based pruning replacing FIFO, including snapshot coalescing and age-eviction exemption for durable tiers.
---
# Plan 107: Usage Tracker V2 Run-Version Store And Value-Based Pruning

## Packet Metadata

- Packet id: `plan-107`
- Packet title: Usage Tracker V2 Run-Version Store And Value-Based Pruning
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-21
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: none; contract settled. Byte budget and cap values are recorded below; changing them requires owner sign-off — stop and surface instead.
- Depends on: plan-106 (durable ledger + schema v2 core)
- Blocks: plan-108 (export v2 carries the hash list + boundary XML from this store)
- Expected artifacts:
  - diff-deduped run-version store with D1/D2 retention windows
  - value-based pruning replacing FIFO (B2), snapshot coalescing (B7)
  - ~2 MB byte budget enforcement with graceful quota degradation (B6)
  - unit tests (synthetic data, simulated quota failure)
  - updated `docs/subsystems/usage-and-admin.md`
  - progress report
- Progress report folder: `reports/development/plan-107-usage-tracker-v2-run-version-store-and-value-based-pruning/`
- Progress report file: `reports/development/plan-107-usage-tracker-v2-run-version-store-and-value-based-pruning/progress.md`

## Packet Summary

Goal: Replace v1's blunt FIFO retention (7 days / 20 sessions / 400 events / 48 snapshots, splice-from-front) with Plan 84's value-based model, and build the run-version store: the diff-deduped record of "unique program states that were actually run." This is the packet that fixes the biased-truncation data loss Plan 84 diagnosed as v1's first failure mechanism.

Non-goals:
- Do not change the export payload shape or `schemaVersion` in exported files (plan-108). Run-versions stay local-only; only the later export packet exposes hashes/boundary XML.
- Do not build any student-facing restore UI (deferred indefinitely per Plan 84 downstream item 3; capture only).
- Do not change the durable ledger semantics from plan-106 (extend, don't redefine).
- Do not change analyzer or cohort tooling (plan-109).
- Do not add dependencies or server behavior.

Depends on:
- plan-106 complete: v2 session schema, durable ledger, flags.

Blocks:
- plan-108 (needs the run-version hash list and boundary-XML selection logic).

Why this packet exists:
Today `workspace_changed`/`workspace_snapshot` churn evicts exactly the struggle signal teachers want, and the 400-event cap drops old per-level detail even when it is the only record of a hard-won pass. Value-based pruning (B2) protects high-value data first: the durable ledger is never evicted, run-versions are windowed by pedagogically meaningful counts (D1/D2), and disposable churn is evicted first. The run-version store also seeds the future student-facing "restore a saved version" feature — capture lands now, UI only if/when wanted.

## Authority And Contracts

Required reading:

- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — B2, B3, B6, B7, D1, D2, stop conditions, open questions (byte budget vs quota; free-play keying; K tuning).
- `docs/development/plan-106-usage-tracker-v2-durable-ledger-and-schema-core.md` and its progress report — the schema this packet extends.
- `docs/subsystems/usage-and-admin.md` — post-plan-106 state; update again in this patch.
- `src/usage/usageTracker.js` — `pruneSessions` (lines ~95–137), `appendUsageEvent`, `addUsageSnapshot` (600 ms debounce, `reason` in dedupe signature), `schedulePersist`.
- `src/usage/usageFormat.js` — retention constants (lines ~4–7), snapshot shapes.
- `src/ai/blockly/workspace.js` — workspace event producers (lines ~820–1091), where "program executed" signals originate.
- `tests/unit/usage-file.test.js`, `tests/unit/usage-analyzer-browser.test.js` — must keep passing; pruning behavior changes will need test updates.

Settled values for this packet (do not silently change):

- **D1:** guided run-versions retained for the last ~8 guided levels encountered, cross-session (level-keyed LRU), surviving browser restart within the retention window.
- **D2:** free-play retains the last ~20 distinct (diff-deduped) run-versions by recency, regardless of age.
- **B6 byte budget:** **~2 MB** total for the run-version store (owner decision 2026-07-21), enforced with graceful degradation.
- **Per-level guided version cap K = 5:** keep first + last + most-recent-5 unique runs per level (owner decision, `docs/decision-log.md` 2026-07-21).
- **Age-eviction posture:** the durable ledger and run-version store are exempt from age-based eviction; the existing 7-day / 20-session age rules apply only to ephemeral churn and raw event tails (owner decision, `docs/decision-log.md` 2026-07-21).
- Run-versions are **local-only by default**; this packet adds no export of their contents.
- Static deployment, no new dependencies, no new PII (hashing reduces code exposure).

## Scope

### In Scope

- Run-version capture (B3): when a program is executed, store its XML as a run-version only if its content hash differs from the last stored version for that context (guided: levelId; free-play: the free-play context).
- Guided retention: level-keyed LRU over the last ~8 levels, per-level cap first + last + most-recent-5.
- Free-play retention: last ~20 distinct run-versions by recency.
- Byte budget enforcement (~2 MB) with a documented eviction cascade on pressure or quota failure.
- Value-based pruning (B2) replacing splice-from-front FIFO: eviction priority (most protected first): (1) durable ledger + pass ledger — never evicted; (2) run-versions per D1/D2 windows; (3) raw workspace churn, duplicate snapshots, export-audit noise — evicted first.
- Snapshot coalescing (B7): drop `reason` from the `addUsageSnapshot` dedupe signature so identical workspace state under different reasons collapses to one snapshot.
- Age-eviction split per the settled posture above.
- Unit tests including simulated quota failure and heavy-rerun synthetic sessions.
- Subsystem note update in the same patch.

### Out of Scope

- Export payload changes, boundary-XML selection for export, hash-list export (plan-108 — though this packet should expose the internal helpers plan-108 will consume).
- Analyzer/cohort changes (plan-109).
- Restore UI of any kind.
- Free-play per-program "slot" concepts (recorded open question in Plan 84; out of scope until restore UI exists).
- Similarity-detection verification (plan-108's experiment).

### Files And Areas Likely Touched

- `src/usage/usageTracker.js` — pruning rewrite; possibly extraction of a `runVersionStore.js` module (preferred over growing the file).
- `src/usage/usageFormat.js` — retention constants; old FIFO caps re-scoped to churn only.
- `src/ai/blockly/workspace.js` — hook the "program executed" signal for run-version capture (minimal diff; find the existing execution/Run call path, do not restructure).
- `tests/unit/` — new run-version store tests; updates to pruning-behavior tests.
- `docs/subsystems/usage-and-admin.md`.

## Work Plan

1. Inspect current state and confirm plan-106's landed schema and the producer call path for program execution.
2. Summarize the job back before editing.
3. Implement the run-version store module (capture, dedupe, D1/D2 windows, K cap, byte budget).
4. Replace FIFO pruning with the B2 priority cascade; re-scope age rules to churn only.
5. Implement snapshot coalescing (B7).
6. Add/Update tests; simulate quota failure and a heavy-rerun session (confirm K = 5 holds up, per Plan 84's open question — report what you observe).
7. Run targeted tests, then `npm test` and `npm run build`.
8. Update the subsystem note; write the progress report.

## Implementation Requirements

### 1. Run-version capture (B3)

- Required behavior: a run-version is stored only when a program is actually executed and its content hash differs from the last stored version for that context. "Unique diffs that were actually run."
- Constraint: capture must not fire on workspace edits, imports that are never run, or snapshot churn. Hash over normalized XML (define normalization once, document it; do not reuse the starter-versioning FNV-1a path unless it fits — that hash is a stable contract owned by `blockly-workspace.md`).
- Edge cases: run with an empty program; identical program re-run (no new version); program A → B → A (A's second run is a new version only if the dedupe is last-stored-based — follow B3 literally: differs from last stored).

### 2. Retention windows (D1, D2, K = 5)

- Guided: last ~8 levels by recency of encounter, each level keeping first + last + most-recent-5 unique versions. Cross-session persistence is required — this data must survive browser restart.
- Free-play: last ~20 distinct run-versions by recency, regardless of age.
- Edge cases: a level dropped from the 8-level window loses its versions (ledger in plan-106 keeps the learning record); free-play and guided budgets are independent but share the total byte budget.

### 3. Byte budget and graceful degradation (B6)

- Required behavior: total run-version store stays under ~2 MB. On pressure (or IndexedDB quota failure), degrade gracefully: evict churn and raw event tails first, then oldest free-play versions, then oldest guided-level windows. The durable ledger is never touched.
- Constraint: quota-failure handling must not throw into student-facing flows; set a completeness/truncation flag (plan-106 mechanism) when degradation discards data.
- Edge case: a single program version larger than the remaining budget — store nothing, flag it, keep running.

### 4. Value-based pruning (B2)

- Replace splice-from-front eviction in `appendUsageEvent`/snapshot handling with the priority cascade. Raw `workspace_changed` streams, duplicate snapshots, and export-audit events are the first to go.
- The 7-day / 20-session age rules continue to apply to ephemeral churn and event tails only; durable ledger and run-version store are exempt.
- Constraint: existing tests asserting old FIFO behavior must be updated deliberately, not deleted — each changed assertion gets a replacement assertion about the new priority behavior.

### 5. Snapshot coalescing (B7)

- Drop `reason` from the `addUsageSnapshot` dedupe signature so identical workspace state under different reasons collapses to one snapshot. Keep the 600 ms debounce semantics otherwise intact.

### 6. Subsystem note update

- `docs/subsystems/usage-and-admin.md` must describe the three-tier model, the eviction cascade, the retention windows, and the budget as implemented — in the same patch.

## Commands

```powershell
npm test
npm run build
```

Targeted usage tests first, then the full suite.

## Validation Checklist

- [ ] Run-versions capture only executed, content-differing programs.
- [ ] D1/D2/K=5 windows behave as specified, including cross-session persistence (unit-level simulated rehydration).
- [ ] ~2 MB budget enforced; quota failure degrades gracefully with flags, never touching the ledger.
- [ ] Eviction order matches B2; churn goes first.
- [ ] Snapshot coalescing collapses reason-only differences.
- [ ] Old FIFO assertions replaced, not deleted; `npm test` passes; `npm run build` passes.
- [ ] Exported files still v1-shaped (export is plan-108).
- [ ] Subsystem note updated in the same patch and reads true.
- [ ] Progress report records K=5 behavior observed under a synthetic heavy-rerun session (answers Plan 84's open tuning question), commands run, and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- The run-version store cannot be bounded within the byte budget without starving the durable ledger (Plan 84 stop condition).
- Cross-session persistence conflicts with browser quota behavior in a way the budget cannot absorb.
- Implementing B2 requires changing export contents or analyzer behavior (plans 108/109 — surface instead).
- A free-play keying decision starts to smell like the deferred "slot" concept (Plan 84 open question — surface, don't invent it).
- Any approach requires a new dependency or server behavior.
- The subsystem note correction would require contract judgment beyond this packet's scope.
