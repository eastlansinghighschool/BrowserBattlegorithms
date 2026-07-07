---
id: plan-81-cohort-usage-dataset-and-baseline
title: "Cohort Usage Dataset And Baseline"
status: ready
depends_on: []
gate: "before adding dependencies, writing outside `local/usage-cohorts/`, committing generated cohort data, or making curriculum recommendations beyond deterministic baseline flags"
superseded_by: null
resolution: null
summary: >-
  Build local-only cohort usage analysis tooling that anonymizes student exports, generates normalized untracked tables, and produces deterministic baseline metrics plus starter queries for later interpretation.
---
# Plan 81: Cohort Usage Dataset And Baseline

- Packet id: Plan 81
- Packet title: Cohort Usage Dataset And Baseline
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent with data-tooling care
- Date: 2026-05-30
- Packet type: implementation / local tooling / usage analysis / tests / docs
- Mutation level: source-code / tests / docs / generated-local
- Approval gate: before adding dependencies, writing outside `local/usage-cohorts/`, committing generated cohort data, or making curriculum recommendations beyond deterministic baseline flags
- Expected artifacts:
  - local-only cohort analysis CLI
  - anonymization process for student usage exports
  - normalized local tables under `local/usage-cohorts/<cohort-id>/anonymized/`
  - deterministic baseline report under `local/usage-cohorts/<cohort-id>/analysis/`
  - saved starter queries or query descriptions for future analysis
  - tracked data dictionary for the cohort table schema
  - tests for normalization/anonymization/baseline metrics
  - docs update
  - progress report with no student data
- Progress report folder: `reports/development/plan-81-cohort-usage-dataset-and-baseline/`
- Progress report file: `reports/development/plan-81-cohort-usage-dataset-and-baseline/progress.md`

## Packet Summary

Goal: Build a local-only cohort usage analysis pipeline that turns a folder of student usage exports into anonymized, queryable tables and a deterministic first-pass baseline report for later orchestration review.

Non-goals:
- Do not interpret curriculum implications beyond cautious deterministic baseline flags.
- Do not commit raw student exports.
- Do not commit anonymized row-level data, databases, identity maps, or generated cohort reports.
- Do not add server behavior, telemetry, network upload, cloud sync, or external analytics.
- Do not change the student usage export format.
- Do not change the admin UI.
- Do not add SQL/DuckDB/SQLite dependencies without owner approval.

Depends on:
- Plan 80 local privacy workspace and path guard conventions.
- Plan 79 shared guided progress helper contract. If Plan 79 is not complete, this packet may create that helper, but it must implement the exact Plan 79 contract rather than a cohort-only derivation.
- `docs/subsystems/usage-and-admin.md`.

Blocks:
- Plan 82 orchestration-grade cohort insight audit.

Why this packet exists:
The usage exports contain rich evidence about guided level progression, attempts, revisits, failures, turns, snapshots, and navigation. Lower-cost tooling should do the mechanical work: load files, anonymize identities, normalize event streams, derive stable tables, and compute obvious metrics. Higher-reasoning orchestration models can then spend tokens on interpretation instead of parsing JSON and reconstructing level order.

## Authority And Contracts

Obey these sources of truth:
- `.gitignore`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/file-pipelines.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `docs/development/plan-80-cohort-usage-privacy-workspace.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/config/levels/`
- `package.json`

Required privacy contracts:
- Input raw exports must be read from `local/usage-cohorts/<cohort-id>/raw-exports/`.
- Generated anonymized outputs must be written under `local/usage-cohorts/<cohort-id>/anonymized/`.
- Generated baseline reports and query files must be written under `local/usage-cohorts/<cohort-id>/analysis/`.
- Identity maps must be written only under `local/usage-cohorts/<cohort-id>/identity-map/`.
- No generated cohort data should be written to `reports/` by default.
- Progress reports must list commands and artifact paths only, not student names, session ids, hashes, raw rows, or anonymized trajectories.
- Anonymized ids identify usage export files, not guaranteed unique human students.

Do not redefine:
- Usage event taxonomy.
- Integrity hash semantics.
- Guided level order.
- Admin page local-only status.
- Similarity/fingerprint philosophy.

## Required Reading

Read these before editing:
- `docs/development/plan-80-cohort-usage-privacy-workspace.md`
- `docs/subsystems/usage-and-admin.md`
- `.gitignore`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/config/levels/index.js`
- `tests/unit/usage-file.test.js`
- `tests/unit/usage-analyzer-browser.test.js`
- `tests/regression/student-profiles.js`
- `tests/regression/usage-pipeline.spec.js`

Use:

```powershell
rg "appendUsageEvent|level_started|level_completed|workspace_snapshot|studentName|sessionId|integrity|guided.levelIds" src tests docs -S
```

## Scope

In scope:
- Add a local CLI, recommended shape:

```powershell
npm run usage:cohort -- --cohort <cohort-id>
```

or:

```powershell
npm run usage:cohort -- --input local/usage-cohorts/<cohort-id>/raw-exports --output local/usage-cohorts/<cohort-id>
```

- Enforce Plan 80 path guard rules.
- Parse all valid usage exports in the raw folder.
- Verify hashes and preserve verification status.
- Assign stable anonymized export ids such as `export-001`.
- Produce an identity map locally and untracked.
- Produce normalized JSON and/or CSV tables.
- Produce deterministic baseline Markdown/JSON report.
- Produce saved starter queries or query descriptions.
- Add tests using synthetic usage data only.

Out of scope:
- Running the tool on real student files during implementation.
- Committing generated cohort outputs.
- Adding a database dependency without explicit approval.
- Doing orchestration-grade interpretation.
- Rendering a UI dashboard.

Files and areas likely touched:
- `package.json`
- `scripts/usage-cohort-analysis.js` or similar
- `src/usage/cohortAnalysis.js` or similar
- `src/usage/cohortPrivacyPaths.js` if Plan 80 created one
- `src/usage/guidedProgress.js` only if Plan 79 has not already created it
- `docs/subsystems/usage-and-admin.md`
- possible `docs/CohortUsageAnalysis.md`
- tracked data dictionary, recommended `docs/CohortUsageDataDictionary.md`
- unit tests under `tests/unit/`

## Implementation Requirements

### 1. Local-Only CLI And Path Guard

Required behavior:
- CLI refuses to read raw exports outside `local/usage-cohorts/`.
- CLI refuses to write anonymized outputs, identity maps, reports, or query files outside `local/usage-cohorts/`.
- CLI should print a clear message if the expected folder does not exist.
- CLI should never create tracked report artifacts by default.
- CLI should support a dry-run or summary mode if cheap to add.

Stop and report if:
- Plan 80 path guard does not exist and implementing one would exceed small-helper scope.

### 2. Anonymization

Required behavior:
- Treat the stable anonymized unit as a usage export file, not a guaranteed human student identity.
- Use labels such as `export-001` or make docs explicit that `student-001` means "export-001" in the absence of a durable student id in the usage format.
- Persist the local identity map across reruns and assign new ids only to newly seen exports.
- Do not reshuffle existing anonymized ids when new files are added later.
- Use a safe stable key such as file name plus hashed/truncated session id/hash metadata; do not key by student display name alone.
- Write a local identity map only under:

```text
local/usage-cohorts/<cohort-id>/identity-map/
```

- Row-level output tables should use anonymized ids, not `studentName`.
- Avoid exposing raw session ids and integrity hashes in row-level output unless hashed/truncated and necessary for review flags.
- Preserve enough review signals to identify data-quality issues without exposing identity in model-consumed outputs.

Constraints:
- Anonymization is privacy reduction, not a guarantee against re-identification.
- Docs must say row-level anonymized data still remains untracked/local.
- Cross-export identity resolution is out of scope unless a future usage format adds a stable per-student id. A student who exports twice may appear as two anonymized exports.

### 3. Normalized Tables

Required behavior:
- Produce tables as JSON and/or CSV. Prefer both if inexpensive.
- Minimum tables:
  - `exports`: anonymized export id, file label, hash status, export timestamp bucket or raw timestamp if local-only, review flags.
  - `events`: anonymized id, event index, event type, timestamp, guided level id/title/order when present, normalized result fields.
  - `guided_attempts`: anonymized id, level id, level order, attempt number, start timestamp, end timestamp if present, result, turns, approximate duration flag.
  - `guided_level_rollup`: anonymized id + level id, attempts, passes, failures, started, reached, turns, revisit flag.
  - `class_level_rollup`: level id/title/order, reached count, pass count, fail count, started-only count, median attempts to first pass where available, median turns on passed attempts, revisit count.
  - `export_progress`: anonymized export id, highest reached, highest passed, highest/last passed challenge as defined, latest guided activity, backtracking/revisit markers, needs-review flags.
- If workspace snapshots are included, summarize them rather than dumping full XML by default.

Data dictionary:
- Add a tracked schema/data dictionary because it describes table structure, not student data.
- Recommended path:

```text
docs/CohortUsageDataDictionary.md
```

- The data dictionary must not include rows from real or synthetic student files unless they are tiny illustrative fake examples that cannot be confused with real data.

Stop and report if:
- Full workspace XML appears necessary for useful analysis. Do not include it in outputs without owner approval.

### 4. Deterministic Baseline Report

Required behavior:
- Produce a baseline report under:

```text
local/usage-cohorts/<cohort-id>/analysis/baseline-report.md
```

- The report should contain facts and cautious heuristic flags, not curriculum conclusions.
- Include:
  - cohort file count and valid/invalid file count
  - hash/integrity summary
  - distribution of highest reached/highest passed
  - levels by reached count
  - levels by pass rate among reached students
  - levels by median attempts
  - levels by median turns on passed attempts
  - levels with high starts but low passes
  - levels most often revisited
  - likely dropout/progression cliff candidates
  - likely too-easy candidates based on high one-attempt pass and low turns
  - data caveats
- Wording must distinguish facts from heuristic flags.

Examples:
- Good: `Level 17 had the highest failed-after-start rate in this cohort.`
- Good: `Heuristic flag: many students revisited Level 16 after later failures.`
- Avoid: `Students do not understand resource checks.`

### 5. Starter Queries

Required behavior:
- Produce saved query files or query descriptions under:

```text
local/usage-cohorts/<cohort-id>/analysis/queries/
```

- If no SQL database is added, write query descriptions paired with JSON/CSV field names.
- If an approved database is used, write actual SQL.
- Include starters for:
  - fail rate among reached students
  - median attempts to first pass
  - median turns on passed attempts
  - high starts / low passes
  - revisits after later-level failures
  - abandoned attempts
  - challenge success by prior bug-hunt/prediction completion where data supports it
  - non-monotonic navigation patterns
- Keep reference-solution/Plan 74 behavior comparison out of the deterministic tool unless explicitly approved. That comparison belongs in Plan 82's interpretation pass.

### 6. Tests

Required behavior:
- Use synthetic usage payloads only.
- Tests should cover:
  - path guard rejects tracked paths
  - anonymized ids are stable and do not expose names
  - anonymized ids remain stable when a new export is added
  - invalid/tampered files produce review flags, not crashes
  - repeated attempts and revisits aggregate correctly
  - highest reached/highest passed do not regress after backtracking
  - approximate attempt durations are marked honestly
  - generated tables contain no `studentName` fields in anonymized row-level outputs

## Work Plan

1. Confirm Plan 80 privacy path conventions.
2. Design output table schemas.
3. Implement path guard and CLI.
4. Implement anonymization and identity map.
5. Implement normalization tables.
6. Implement deterministic baseline report and starter queries.
7. Add synthetic-data tests.
8. Update docs.
9. Run validation.
10. Write a progress report with no student data.

## Validation Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/usage-cohort-analysis.test.js
npm test
npm run build
```

Run a synthetic local generation smoke only if the test creates fake files under `local/usage-cohorts/synthetic-*`:

```powershell
npm run usage:cohort -- --cohort synthetic-demo
git status --short local/usage-cohorts
```

Expected: generated cohort files do not appear in git status because they are ignored.

## Validation Checklist

- [ ] CLI refuses raw input outside `local/usage-cohorts/`.
- [ ] CLI writes all generated cohort data only under `local/usage-cohorts/`.
- [ ] Raw exports, anonymized tables, databases, identity maps, and baseline reports remain untracked.
- [ ] Anonymized row-level tables do not include student names.
- [ ] Anonymized ids are stable across reruns and represent export files, not guaranteed unique humans.
- [ ] Identity map is local-only and untracked.
- [ ] Tracked data dictionary exists and contains schema only, not real cohort rows.
- [ ] Baseline report is factual/heuristic, not curriculum recommendation.
- [ ] Saved queries or query descriptions exist.
- [ ] Synthetic tests cover path safety, anonymization, and core metrics.
- [ ] Docs explain how Plan 82 should consume outputs without reading raw exports or identity maps.
- [ ] Required tests and build pass.
- [ ] Progress report contains no student-identifying or row-level data.

## Stop Conditions

Stop and report if:
- Useful analysis appears to require full workspace XML in model-consumed outputs.
- The tool cannot avoid writing row-level outputs under tracked folders.
- A database dependency seems necessary.
- Existing usage exports lack enough event data to derive attempts/progression.
- Plan 79's shared guided progress helper is absent and implementing its exact contract would exceed this packet.
- The implementation would need to alter student usage export semantics.
- Any real student file is accidentally created in a tracked path.
