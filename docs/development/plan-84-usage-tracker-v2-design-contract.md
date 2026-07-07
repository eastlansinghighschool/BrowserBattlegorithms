---
id: plan-84-usage-tracker-v2-design-contract
title: "Usage Tracker V2 Design Contract"
status: ready
depends_on: []
gate: "this packet IS the gate — no V2 implementation packet may begin until the decisions here are accepted; any change to a settled decision requires owner sign-off"
superseded_by: null
resolution: null
summary: >-
  Settled design contract for a Usage Tracker V2: durable per-level learning ledger, local diff-deduped run-version store (last ~8 guided levels / ~20 free-play runs, cross-session), value-based pruning replacing FIFO, boundary-XML+hashes export keeping similarity detection alive, schema v2 with v1 back-compat. Records owner decisions D1–D4 and defines the downstream implementation packet sequence — note: its internal "Plans 85–87" references are renumbered by the Plan 91 amendment per the Plan 85 charter.
---
# Plan 84: Usage Tracker V2 Design Contract

- Packet id: Plan 84
- Packet title: Usage Tracker V2 Design Contract
- Status: (see frontmatter)
- Owner/model: orchestration design contract (decisions settled with integration owner)
- Date: 2026-06-04
- Packet type: design / contract / docs
- Mutation level: docs-only
- Approval gate: this packet IS the gate — no V2 implementation packet may begin until the decisions here are accepted; any change to a settled decision requires owner sign-off
- Expected artifacts:
  - this settled design contract
  - downstream implementation packet sequence defined below
  - `docs/development/README.md` index row
- Progress report folder: `reports/development/plan-84-usage-tracker-v2-design-contract/`
- Progress report file: `reports/development/plan-84-usage-tracker-v2-design-contract/progress.md`

## Why This Exists

The Plan 79 admin work surfaced that usage exports are unreliable for teacher reporting and cohort analysis. Investigation against `src/usage/usageFormat.js`, `src/usage/usageTracker.js`, and `src/usage/guidedProgress.js`, plus a real export, confirmed **two independent data-loss mechanisms**:

1. **Biased FIFO truncation.** `USAGE_MAX_EVENTS = 400` trims the *oldest* events during the session (`appendUsageEvent` splices from the front). `summary.guided` aggregate counts and the `levelIds` list are never trimmed, but per-level `level_started` / `level_completed` detail lives only in the trimmed events array. Workspace churn (`workspace_changed` / `workspace_snapshot`) dominates the event stream, so the *struggle signal* (attempts, fails, turns) is evicted first while bare pass-progression survives. Raising the export ceiling alone fixes nothing, because the trim happens at capture time.
2. **"Reached" requires a run, and the durable ledger is never exported.** `reached` is only ever seeded by `level_started` / `level_completed` (which also seed `levelIds`). Navigating to a level without pressing Run records nothing. The cross-session pass ledger (`bba:guided-level-progress` in `src/core/levels.js`) is not included in the export at all. (A real export confirmed this: the site knew the student reached Level 36, but the export's `summary.guided` was all zeros because no level was run that session.)

The system is behaving like a short debug transcript; the admin tool and future cohort analysis need a durable learning-progress record. These are different jobs. The philosophical move: **capture less raw noise, more durable meaning.**

## Settled Decisions

### Owner decisions (resolved 2026-06-04)

| # | Decision | Resolution |
|---|---|---|
| D1 | Guided run-version retention & persistence | **Last ~8 guided levels encountered, cross-session** (survives browser restart within the retention window). |
| D2 | Free-play run-version retention | **Last ~20 distinct (diff-deduped) run-versions**, by recency, regardless of age. |
| D3 | Teacher export code contents | **Per-level ledger + pass ledger + full XML only at pass/fail boundaries (capped) + a hash list of run-versions.** Keeps Plan 04/16 similarity detection alive while staying lean. |
| D4 | Plan 81/82 cohort analysis on this year's data | **Run coarse now, caveated** — progression-distribution only, with loud "per-level detail unreliable" warnings; validates pipeline plumbing for next year. |

### Baked-in defaults (orchestration recommendation, owner may override)

- **B1 — Schema v2 with mandatory v1 back-compat.** Plan 79's analyzer reads v1 exports today and must keep working. The analyzer must detect and handle both schema versions.
- **B2 — Value-based pruning replaces FIFO.** This is the core fix. Eviction priority, most-protected first:
  1. Durable per-level ledger + guided pass ledger — **never evicted**.
  2. Run-versions — evicted next; for guided, oldest *level* first (level-keyed LRU honoring D1); for free-play, oldest run first (honoring D2).
  3. Raw workspace churn / duplicate snapshots / export-audit noise — evicted first of all.
- **B3 — Run-version trigger = program executed, deduped by content hash.** Store a run-version only when its hash differs from the last stored version for that context. "Unique diffs that were actually run."
- **B4 — `level_opened` durable record** so "reached" no longer requires pressing Run.
- **B5 — Export the cross-session guided pass ledger** so "highest passed" does not depend on surviving events.
- **B6 — Per-level version cap** (keep first + last + most-recent-K unique runs) and a **conservative, tunable total byte budget** for the run-version store, with graceful degradation on quota failure (matches existing persistence behavior).
- **B7 — Snapshot coalescing:** drop `reason` from the `addUsageSnapshot` dedupe signature so the same workspace state under different reasons collapses to one snapshot.

### Hard constraints (not optional)

- Static Vite deployment, no server, no new dependencies without explicit owner approval.
- No PII beyond what already exists; run-version hashing *reduces* code exposure in exports.
- Run-versions are **local-only by default** (not in the teacher export beyond the D3 hash list); they serve the future student-facing "restore a saved version" feature.
- Similarity/plagiarism detection (Plan 04/16) runs on exports — the D3 boundary-XML decision is what keeps it working; any V2 implementation must verify it still functions.
- Do not break the Plan 79 admin analyzer reading existing v1 files.

## Three-Tier Data Model

| Tier | Lifetime | Contents | Exported? |
|---|---|---|---|
| **Durable learning ledger** | Whole campaign, never evicted | Per-level rollup (reached, started, attempts, passes, fails, turns, timestamps, last result, start/end block-counts + XML hash) maintained incrementally like `summary`; guided pass ledger; `level_opened` records; truncation/review flags | Yes — teacher-facing source of truth |
| **Run-version store** | Windowed (D1: last ~8 guided levels; D2: last ~20 free-play runs), cross-session | Full XML of diff-deduped states that were actually run | Local only; export carries hash list + pass/fail boundary XML (D3) |
| **Ephemeral churn** | Short rolling window / discarded | `workspace_changed` stream, intermediate snapshots, export-audit events | No |

The durable ledger's per-level rollup is intentionally shaped to match Plan 81's `guided_level_rollup` table, so next year's V2 exports feed the cohort pipeline directly.

## Downstream Implementation Packet Sequence

These are defined here but **not yet drafted**; dispatch when ready to move the repo forward.

1. **Plan 85 — Usage Tracker V2 Implementation.** Per-level durable ledger (incremental, survives trimming); `level_opened` records; guided pass-ledger export; run-version capture (B3) with D1/D2 retention and B6 budget; value-based pruning (B2); snapshot coalescing (B7); schema v2; truncation/completeness flags. Synthetic-data tests only. Must verify similarity detection still works with boundary-only export XML.
2. **Plan 86 — Admin Analyzer V2 Integration.** Make the analyzer prefer ledgers over event reconstruction; read both v1 and v2 (B1); label old/truncated files honestly; fold in the now-fixes (`—` instead of `<1s approx`; surface the truncation review-signals the analyzer already computes). CLI/browser parity preserved.
3. **Plan 87 (deferred) — Run-Version Restore UI.** Student-facing browse/restore of saved run-versions. Capture lands in Plan 85; only the UI is deferred. Build only if/when the feature is wanted.
4. **Plan 81/82 re-scope note (D4).** Any run on this year's data is progression-distribution only, caveated; per-level cohort insight targets next-year V2 data.

## Open Questions Preserved

- **Cross-session persistence vs browser quota.** The run-version store must survive sessions to be useful for restore, which puts it in tension with the existing 7-day / 20-session retention and the browser storage quota. Plan 84 must set the byte budget (B6) so the run-version store can never starve the durable ledger.
- **Free-play version keying.** D2 keys by recency-count. If a future restore UI wants per-program grouping, a free-play "slot" concept would be needed (does not exist yet) — out of scope until the restore UI is on the table.
- **Per-level version cap value (K in B6)** — implementer-safe tuning, but worth confirming against a real heavy-rerun session during Plan 84.

## Validation / Approval

- This packet is docs-only; no code, no tests.
- Acceptance = owner confirms the settled decisions above. They are recorded as accepted on 2026-06-04 (D1–D4 via decision tool; B1–B7 as orchestration defaults pending any override).
- No V2 implementation packet (84+) begins until this contract is accepted.

## Stop Conditions (for downstream packets, recorded here)

- Implementation cannot preserve v1 analyzer reading → stop, surface.
- Boundary-only export XML breaks similarity detection → stop, surface.
- Run-version store cannot be bounded within a safe byte budget without starving the durable ledger → stop, surface.
- Any approach requires a new dependency, server behavior, or a usage-export schema change that breaks old student files beyond the planned v1→v2 compatibility shim → stop, surface.
