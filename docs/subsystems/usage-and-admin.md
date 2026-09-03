# Usage and Admin

## Scope

This note owns:
- The usage event taxonomy: which events are canonical, which are noise, and how they are filtered for similarity detection.
- The tracker → IndexedDB → export ladder.
- How the SHA-256 integrity hash is computed and what it covers.
- The V2 durable per-level learning ledger, schema V2 core, hydration, backfill, and guided pass-ledger mirroring.
- The admin page surface: what a teacher sees, what anomaly flags mean, and how the browser analyzer relates to the CLI analyzer.
- The regression harness: that its output files are generated artifacts, not committed fixtures.

This note does NOT own:
- The file export UI and download flow — see [file-pipelines.md](./file-pipelines.md).
- The workspace XML snapshot that feeds into usage events — see [blockly-workspace.md](./blockly-workspace.md).
- Level completion and scoring events at the engine level — see [turn-engine.md](./turn-engine.md).

## Surface map

| File | Role |
|---|---|
| `src/usage/learningLedger.js` | Usage Tracker V2 durable per-level learning ledger (Plan 84 Tier 1), schema V2 hydration, backfill, and pass ledger mirroring. |
| `src/usage/runVersionStore.js` | Usage Tracker V2 diff-deduped run-version store (Plan 84 Tier 2), D1/D2 retention windows, per-level K cap, byte budget. |
| `src/usage/cloudEvidence.js` | Pure schema V2 cloud evidence builder with deep identity stripping, no DOM, and no networking (Plan 121). |
| `src/usage/usageTracker.js` | Session management, event recording, IndexedDB persistence, export payload assembly, SHA-256 hash via Web Crypto. |
| `src/usage/usageFormat.js` | Canonical event structure, schema V2 session normalization, snapshot limits, value-based event pruning, fingerprint logic. |
| `src/usage/usageAnalyzer.js` | Node-side CLI analyzer: hash verification, guided progress derivation, free-play summary, duplicate and similarity detection. |
| `src/usage/usageAnalyzerBrowser.js` | Browser-side analyzer: same output semantics as the CLI, used by the admin page. |
| `src/usage/guidedProgress.js` | Shared pure guided-progress derivation helper used by both analyzers and future cohort tooling. |
| `src/admin/adminApp.js` | Teacher-facing admin UI: file upload, class table, guided progress story, sequence map, per-student detail view, anomaly flags. |
| `tests/regression/usage-pipeline.spec.js` | Simulates student profiles, exports usage files, post-processes timestamps, re-hashes. |
| `tests/regression/usage-pipeline-admin.spec.js` | Uploads generated files to admin.html, captures screenshots. |

## Session state ladder

Usage data moves through three stages before a teacher can analyze it:

1. **In-memory session**: `usageTracker.js` starts a session on app load with a generated session id. Events are appended in memory as the student plays.
2. **IndexedDB persistence**: the tracker persists the session to IndexedDB after each event so state survives page reload. On load, it hydrates from IndexedDB if a recent session exists.
3. **Exported JSON file**: when the student clicks the usage export button and enters their name, the tracker assembles the canonical payload, computes the SHA-256 hash, and triggers a local JSON download. The file is never sent to a server.

## Durable Learning Ledger & Schema V2 Core

In Usage Tracker V2 (Plan 84 / Plan 106), sessions maintain an incremental per-level learning ledger (`session.learningLedger.guided`) and a mirror of cross-session pass progression (`session.learningLedger.passLedger`).

### Core Invariants & Rules

1. **Incremental & O(1)**: Every guided level the student interacts with maintains a ledger entry updated synchronously as events occur. It is never reconstructed from the event tail at read time.
2. **Three-tier model**: V2 separates durable learning ledger (Tier 1), run-version store (Tier 2), and ephemeral churn (Tier 3). The ledger is never evicted; run-versions are windowed by D1/D2; churn is evicted first.
3. **Field Alignment**: Each entry uses Plan 81's `guided_level_rollup` field names: `reached`, `startedCount`, `completedCount`, `passedCount`, `failedCount`, `revisits`, `turnsSpent`, `durationMs`, `firstActivityAt`, `lastActivityAt`, `lastResult`, `passed`, `startBlockCount`, `endBlockCount`, and `finalXmlHash` (via FNV-1a starter-versioning digest).
4. **Exempt from Eviction**: The durable ledger and the run-version store are retained across session lifecycles and are exempt from age-based event trimming. Age-based rules (7 days / 20 sessions) apply only to ephemeral churn and raw event tails.
5. **Level Open Capture (`level_opened`)**: Opening a guided level records a durable `reached = true` marker even if the student never runs a program. `resetCurrentLevel` re-enters guided mode and fires `level_opened`, which is idempotent in the ledger.
6. **Pass Ledger Mirroring**: `src/core/levels.js` remains the writer of record for `bba:guided-level-progress` in `localStorage`. The usage layer mirrors passed level IDs into `session.learningLedger.passLedger` and ensures matching ledger entries carry `reached = true` and `passed = true`.
7. **Schema V2 Internal Hydration & Backfill**: Sessions stored internally use `schemaVersion: 2`. Legacy V1 sessions loaded from IndexedDB hydrate cleanly and perform a best-effort backfill from surviving events.
8. **Strict Factual Flags**: Completeness and backfill status are surfaced via `session.flags` (`ledgerBackfilled`, `eventTailTruncated`, `historyPartial`). `ledgerBackfilled` is `true` only when backfill actually executed on a hydrated legacy session; `eventTailTruncated` is set only when event eviction occurs; `runVersionStoreTruncated` is set when the run-version store drops data due to budget pressure.
9. **V2 Export Payload Shape & Boundary Rules (Plan 108)**:
   - Exported payload files use `schemaVersion: 2`, carrying the durable learning ledger (`learningLedger`), pass/fail boundary XMLs (`boundaryXmls`), run-version hash list (`runVersionHashes`), completeness flags (`flags`), sanitized level events, and sanitized snapshots.
   - **Boundary Definition**: A boundary XML entry exists ONLY for real pass (`result === "PASSED"`) or level-ending fail (`result === "FAILED"`) completion events in `session.events`. Abandoned or in-progress levels produce no boundary XML entries and never synthesize manufactured results.
   - **Timestamp Matching Rule**: Boundary XML text is matched to a completion event by selecting the latest version in `session.runVersionStore` (or fallback `session.snapshots`) whose timestamp satisfies $v.at \le event.at$.
   - **Hash Fallback**: If no eligible version exists at-or-before `event.at`, the boundary entry emits `hash` (from `event.data.xmlHash`), `result`, `at`, `xmlText: null`, and `xmlTextMissing: true`.
   - **Snapshot & Event Sanitization**: Full `xmlText` is stripped from all level events and snapshots in V2 exports (retaining `xmlHash`), ensuring full XML text travels strictly inside `boundaryXmls`.
   - **Integrity Hash**: SHA-256 integrity hash verification applies over the canonical V2 JSON payload without altering the hash mechanism.
   - **Boundary Truncation Flag (Plan 108)**: When a level's boundary entries exceed the K=5 cap, the export keeps the 5 most recent and sets `flags.boundaryXmlsTruncated = true`.
   - **Plan 91 / Plan 110 / Plan 111 Star Evaluation & Durable Receptacle**:
     - **Ratified Fields**: Per-level guided ledger entries (`createGuidedLevelRollupEntry`) carry optional, additive rewrite-aware slots: arc fields (`arcId`, `arcStageIndex`, `arcStageCount`), `boardDynamicsTier`, `bestiaryEncounterIds` (array of archetype ids or a compact object summary), and the star/film fields `starsEarned` (0–3), `parBeaten`, `turnPar`, `masteryAchieved`, `masteryCriterionId`, `filmReviewSummary`. Unset fields remain absent from serialized output (no `null` noise); unknown entry fields are ignored on hydration (dropped, not rejected — pinned by test). Star fields are populated by the plan-111 evaluator (below); arc/tier/bestiary/film slots remain unpopulated until later packets. Closed vocabularies (`masteryCriterionId` per Plan 85 S6; board tiers per S1) are **documentary only at this layer** — producing packets own validation.
     - **Pure Evaluator & Wiring (`src/core/starEvaluation.js`)**: Evaluated synchronously on level completion through the real `endLevel` -> `recordLevelEnded` path via `evaluateLevelStars`.
     - **Par Boundary Rule**: `parBeaten` is true if and only if `turnsSpent <= turnPar` (reaching generous turn par earns Star 2).
     - **Fail-Case Behavior**: On level failure (`result !== "PASSED"`), 0 stars are earned and star outcome fields (`parBeaten`, `turnPar`, `masteryAchieved`, `masteryCriterionId`) are omitted from the ledger entry to avoid null noise.
     - **Absence & Monotonic Storage**: Unset or un-evaluated star fields remain absent from serialized output objects. Multi-attempt sessions accumulate `starsEarned`, `parBeaten`, and `masteryAchieved` monotonically (keeping the highest stars earned across attempts).
     - **Criterion Registry & Closed Vocabulary**: Mastery criteria evaluation maps `masteryCriterionId` through a criterion registry (`registerCriterionEvaluator`). Closed vocabulary follows Plan 85 S6 (`concept-used`, `no-wasted-resource`, `both-allies-active`, `no-collision`, `under-block-budget`). Unknown or un-registered criteria fail open safely (`masteryAchieved = false`, no errors thrown). Evaluators are checkable from data available at level end (`runnerActionHistory`, turn details).
     - **2-Star Max & Concept-Mandatory Levels**: Levels where the core concept is mandatory to pass (such as movement-helpers pilot levels 12–14) do not author a `masteryCriterionId` (documented as "no honest criterion — 2-star max" per decision log 2026-08-05), capping stars at 2 without code-golf block-budget enforcement. S12 fully protected levels (e.g. `move-toward-flag`) carry no star metadata and remain pass-star-only (max 1 star).
     - **Cumulative Tiers**: Stars are cumulative — `starsEarned` is 3 only when both `parBeaten` and `masteryAchieved` hold, and 2 only when `parBeaten` holds. A mastery-meeting but slower-than-par run earns 1 star with `masteryAchieved: true` recorded (decision log 2026-08-05).
     - **Plan 112 Production UI Read Accessor**: The UI layer reads star outcomes cleanly via `app.usageTracker.getGuidedStarState(levelId)`, which returns `{ reached, passed, starsEarned, parBeaten, turnPar, masteryAchieved, masteryCriterionId }` strictly read-only from the durable ledger. `usageTrackerSessionInternal` remains test scaffolding only.
   - **Cloud Evidence Builder & Identity Contract (Plan 121)**:
     - **Pure Builder (`src/usage/cloudEvidence.js`)**: `buildCloudEvidencePayload({ session, exportedAt, computeSha256 })` returns a sanitized schema-v2 payload plus integrity block, pure and free of DOM, window, or network dependencies.
     - **Identity Guarantee**: Self-reported identity is stripped at top level (`studentName: ""`) and removed recursively wherever `"studentName"` appears in `events[].data` across all event types.
     - **Integrity Parity**: Uses the shared `buildExportPayloadWithIntegrity` construction. The SHA-256 integrity hash is computed over the canonical payload minus `integrity` and verifies cleanly under the unmodified `verifyUsageExport`.
     - **Side-Effect Free**: Does not record `export_requested` or `export_completed` events into the session ledger.
     - **Attribution Policy**: Authenticated account attribution belongs strictly in the teacher-download filename, never inside hashed v2 evidence payloads. The exact filename grammar is deferred to the canonical Stage 1 protocol/teacher-extraction surface and must not be re-created in student client code.

## Run-Version Store (Tier 2)

The run-version store records the full XML of programs that were actually executed, diff-deduped against the last stored version for the same context. It is local-only by default; Plan 108 will expose a hash list and boundary XML for exports.

### Retention windows

| Window | Scope | Value | Behavior |
|---|---|---|---|
| D1 | Guided levels | last ~8 levels encountered | Level-keyed LRU by recency of last run-version; survives browser restart within the session retention window. |
| D2 | Free play | last ~20 distinct run-versions per team | Per-team slot keying (`freeplay:team1` / `freeplay:team2`), mirroring per-team stored workspaces. Each team bucket has its own dedupe chain and ~20-version window. |
| K | Guided per-level | first + last + most-recent-5 | Up to 7 unique versions per level (K + 2) so the first attempt and the most recent attempts are preserved. |

### Byte budget

The total run-version store is bounded to approximately **2 MB** (owner decision 2026-07-21). The per-team D2 windows are enforced independently; the 2 MB budget bounds the total across all team buckets. If adding a new version would exceed the budget, the store degrades gracefully:

1. Evict oldest free-play versions first.
2. Evict oldest guided-level windows next.
3. If a single remaining version is larger than the budget, store nothing and set `runVersionStoreTruncated`.

The durable ledger is never touched by this degradation.

### Session rollover and durable-tier carry-over

When a session expires under the v1 7-day / 20-session age/count rules, the new session inherits the prior session's durable learning ledger, pass-ledger mirror, and run-version store. The new session carries a `durableTiersCarriedFrom` flag pointing to the prior session id. Expired sessions' ephemeral churn and event tails do **not** carry over; only the durable tiers survive.

### IndexedDB quota-failure graceful degradation

If an IndexedDB `put` fails with a quota error, the tracker catches the rejection and runs an eviction cascade before retrying once:

1. Evict lowest-value events (`workspace_changed`, then `workspace_snapshot` / `export_*`, then `tutorial_replayed`).
2. Evict snapshots.
3. Evict oldest free-play run versions.
4. Evict oldest guided run-version windows.

The durable ledger is never touched. If any data was discarded, `runVersionStoreTruncated`, `eventTailTruncated`, and `historyPartial` are set. The retry is attempted once; if it still fails the error is swallowed so student-facing flows continue. Non-quota persistence errors are swallowed without cascading.

### Capture trigger

A run-version is captured only when `getFirstRunnableAction` or `getFirstRunnableActionWithTrace` executes a program. It does **not** fire on workspace edits, imports, or snapshot churn. The hash is computed with the same FNV-1a normalization used by starter versioning, so formatting-only edits do not create spurious new versions.

## Canonical event taxonomy

The following events are recorded by the tracker:

| Event | Signal / Noise | Notes |
|---|---|---|
| `session_started` | Signal | Marks session origin. |
| `session_resumed` | Signal | Marks that a prior session was hydrated from IndexedDB. |
| `mode_entered` | Signal | Records which top-level mode (guided / free play) the student entered. |
| `free_play_configured` | Signal | Records mode, team size, and map for a free-play session. |
| `level_opened` | Signal | Records guided level open transition and reached marker. |
| `level_started` | Signal | Records which guided level the student attempted. |
| `level_completed` | Signal | Records level id, result (pass/fail), and turn count. |
| `turn_action_completed` | Signal (bounded) | Records the action executed each turn; bounded to prevent log explosion. |
| `score_point` | Signal | Records which team scored. |
| `tutorial_replayed` | Signal | Records when a student re-triggered a tutorial. |
| `workspace_changed` | Noise (excluded from fingerprint) | Fires on every Blockly edit; too frequent to dominate similarity detection. |
| `workspace_imported` | Signal | Records that the student imported a program file. |
| `workspace_exported` | Signal | Records that the student exported a program file. |
| `workspace_snapshot` | Noise (excluded from fingerprint) | Periodic XML capture; stored in the file but excluded from similarity fingerprint. |
| `free_play_summary` | Signal | Records free-play match outcome (scores, rounds). |
| `export_requested` | Signal | Records that the student triggered the export flow. |
| `export_completed` | Signal | Records that the file was successfully downloaded. |

Fingerprints for similarity detection intentionally exclude `workspace_changed` and `workspace_snapshot`. The goal is to detect similar *attempt sequences*, not similar workspace churn.

`workspace_snapshot` coalescing (Plan 84 B7): the snapshot dedupe signature ignores `reason`, so identical workspace state captured under different reasons collapses to one snapshot. The 600 ms debounce is otherwise unchanged.

**Snapshot cap disclosure:** the snapshot limit (`USAGE_MAX_SNAPSHOTS`) is enforced with `splice-from-front`. This is intentional: snapshots are churn-like periodic captures and the oldest snapshots are the least valuable. Value-based event eviction applies to the event tail, not snapshots.

**XML-heavy event cap sizing:** `level_*` events can carry full `xmlText` payloads. The 400-event cap plus the B2 value cascade provide the primary bound: churn events are evicted first, and `level_opened` / `level_started` / `level_completed` are protected as signal events. As a backstop, the quota-failure cascade above discards snapshots and churn before any protected data. Rough worst-case math: 400 protected events × ~5 KB XML ≈ 2 MB, which is the same order as the run-version store budget; in practice the mix is dominated by small `workspace_changed` events, so the real payload stays well under typical browser quotas. A byte-cap safety valve is intentionally not implemented so that the count-based cap remains deterministic and testable.

## Integrity hash

The export file includes a SHA-256 hash computed over the canonical JSON string of the payload, excluding the integrity field itself. Two separate implementations compute the same hash:

- `usageTracker.js` — browser-side, uses Web Crypto API.
- `usageAnalyzer.js` — Node-side CLI, uses Node `crypto`.

The hash detects casual or accidental modification of the export file. It is not a cryptographic signature and does not prove student identity. The analyzer reports hash status as `verified` or `tampered` without claiming certainty.

## Admin page surface

`admin.html` is the teacher-facing review tool. It is excluded from the GitHub Pages build (local-only). Teachers open it in a browser and upload student usage files via file picker or drag and drop.

For each uploaded file, the admin page shows:

- **Identity**: student name, session id, export timestamp, schema version (`v1` / `v2`), and completeness status.
- **Integrity**: hash status (`verified` / `tampered`).
- **Guided progress**: highest reached, highest passed, highest passed challenge, contiguous pass-through evidence, revisits, and an accessible per-level sequence map.
- **Guided level stats**: levels attempted, levels passed, turn counts, and approximate session span.
- **Free play stats**: matches played, outcomes.
- **Review evidence**: a compact `needs review` indicator for hash mismatch, unknown guided levels, truncation signals, and analyzer warnings.
- **Anomaly flags**: duplicate session ids, identical integrity hashes, similar event fingerprints under different names (clarified: matches attempt event sequences, not final code text).
- **Detail view**: event list, snapshot list, suspicious signal summary, guided progress story with schema version caveat banner, accessible sequence map, and exact per-level table.

Anomaly flags use careful language: `possible duplicate`, `similarity flag`, `review recommended`. The system does not claim certainty.

## Browser analyzer vs CLI analyzer

Both analyzers (`usageAnalyzerBrowser.js` and `usageAnalyzer.js`) produce the same output semantics. The difference is runtime:

- **CLI analyzer**: runs in Node; uses Node `crypto`; accepts file paths as arguments; intended for local teacher use before the admin page existed.
- **Browser analyzer**: runs in a browser worker or inline; uses Web Crypto; feeds the admin page UI.

### V2 Analyzer Integration Contracts (Plan 109)

1. **Ledger-First Reading**: When analyzing `schemaVersion: 2` exports, guided progress totals and per-level milestone stories read directly from the durable learning ledger (`learningLedger`) rather than replaying events.
2. **V1 Back-Compatibility (B1)**: `schemaVersion: 1` or un-versioned files continue using event reconstruction, ensuring golden analysis parity for older exports.
3. **Dual-Version & Completeness Labels**: Both analyzers surface `schemaVersion` (`v1` or `v2`) and plain-language completeness caveats (`historyPartial`, `eventTailTruncated`, `ledgerBackfilled`, `runVersionStoreTruncated`, `boundaryXmlsTruncated`) in both CLI output and Admin UI.
4. **Display Fixes**: Sub-second level durations display `—` instead of `<1s approx`.
5. **Similarity Framing**: Similarity flag output includes plain-language context clarifying that matching compares attempt event sequences, not final boundary code text.

The two paths are designed to agree on hash verification, schema detection, guided progress derivation, and anomaly detection. If they diverge, that is a bug.

### Submitter Identity & Similarity Parity (Plan 121)

1. **Submitter Identity Discriminator**: In `compareUsageSummaries`, submitter identity replaces the typed name as the similarity discriminator. Submitter identity is resolved as: typed `studentName` when non-blank, else the caller-supplied file identity (`fileName` in Admin UI, `filePath` in CLI).
2. **Positional Indices Never Qualify**: `submission-N` is a positional index for display only and never satisfies the "distinct submitters" test.
3. **Three Similarity Outcomes**:
   - **Distinct typed names**: `"identical attempt sequence AND identical captured program states under different names."` (Unchanged)
   - **All names blank, file identities indistinguishable**: `"identical attempt sequence, submitters not distinguishable from these files."`
   - **All names blank, file identities differ (or mixed)**: `"identical attempt sequence and identical captured program states in separate submissions."`
4. **Resubmission Suppression**: When all records in a similarity group share the exact same non-blank typed name (e.g. all "Alice"), the group represents one student resubmitting and is suppressed.
5. **Blank Name Display Fallback**: The CLI summary line (`analyze-usage-files.js`) and the browser class table (`adminApp.js`) fall back to the file identity when `studentName` is blank.

## Regression harness

The regression harness under `tests/regression/` simulates student profiles, exports usage files, and validates the full pipeline end-to-end:

- `student-profiles.js` — defines simulated student play sequences.
- `usage-pipeline.spec.js` — drives the app as each profile, exports files, spreads timestamps to simulate a real session timeline, re-hashes the exports.
- `usage-pipeline-admin.spec.js` — uploads the generated files to `admin.html`, runs the browser analyzer, captures screenshots.

**Output files under `tests/regression/output/` and `tests/regression/screenshots/` are generated artifacts.** They are run outputs, not committed source fixtures. Do not treat them as stable test fixtures or commit them as part of the source tree.

## Cohort Privacy Contract

When performing local classroom cohort analysis:
- All raw student exports, anonymized row-level data, identity mappings, and local databases (SQLite/DuckDB) **must** reside strictly within `local/usage-cohorts/`.
- No row-level student files or anonymized learning trajectories may be committed to the repository.
- Reports and progress logs may summarize analytical conclusions, but they must contain absolutely no student-identifying data or row-level logs unless approved in an aggregate-only owner-facing schema.
- For complete setup instructions and operator safety checks, see [CohortUsageAnalysis.md](../CohortUsageAnalysis.md).

## Common traps

- **Confusing workspace export with usage export.** The workspace XML export is a program portability file; the usage export is classroom evidence. See [file-pipelines.md](./file-pipelines.md).
- **Treating `durationMs` as wall-clock session time.** The ledger's `durationMs` is accumulated from the delta between consecutive activity timestamps for a level, capped at a 30-minute gap. Long breaks do not inflate the value; it measures active engagement, not elapsed calendar time.
- **Assuming `workspace_changed` is a high-signal event.** It fires on every edit and is excluded from fingerprinting because it is too noisy.
- **Treating the regression output folder as committed fixtures.** Those files are regenerated each run.
- **Assuming the hash guarantees identity.** The SHA-256 hash verifies file integrity; it does not prove who the file belongs to.
- **Treating the CLI analyzer and browser analyzer as separate systems.** They should produce identical results on the same input.

## Related

- [file-pipelines.md](./file-pipelines.md) — export/import UI flow and the three file types
- [blockly-workspace.md](./blockly-workspace.md) — workspace events that feed into usage tracking
- [turn-engine.md](./turn-engine.md) — scoring and level-completion events that feed into usage tracking
- [CohortUsageAnalysis.md](../CohortUsageAnalysis.md) — Local cohort usage analysis workspace layout and privacy checklist
