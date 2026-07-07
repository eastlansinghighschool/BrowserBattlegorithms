---
id: plan-80-cohort-usage-privacy-workspace
title: "Cohort Usage Privacy Workspace"
status: ready
depends_on: []
gate: "before changing usage export format, adding dependencies, committing generated cohort data, or creating any tracked student-data artifact"
superseded_by: null
resolution: null
summary: >-
  Prepare an explicit git-ignored local workspace for raw student usage exports and anonymized cohort-analysis outputs, with operator instructions and path/privacy guardrails before any real cohort analysis runs.
---
# Plan 80: Cohort Usage Privacy Workspace

- Packet id: Plan 80
- Packet title: Cohort Usage Privacy Workspace
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent with privacy care
- Date: 2026-05-30
- Packet type: implementation / docs / privacy guardrails / local tooling
- Mutation level: docs / source-code / tests
- Approval gate: before changing usage export format, adding dependencies, committing generated cohort data, or creating any tracked student-data artifact
- Expected artifacts:
  - explicit local-only cohort usage workspace convention
  - `.gitignore` reinforcement for raw and anonymized cohort usage data
  - teacher/operator instructions for where to place student usage exports
  - safety checks or helper script that verifies cohort data paths are canonical, ignored, and inside the approved local workspace before analysis
  - tests for path/privacy guard helpers if helper code is added
  - `docs/subsystems/usage-and-admin.md` update or companion doc link
  - progress report with no student-identifying data
- Progress report folder: `reports/development/plan-80-cohort-usage-privacy-workspace/`
- Progress report file: `reports/development/plan-80-cohort-usage-privacy-workspace/progress.md`

## Packet Summary

Goal: Prepare the repository for local cohort usage analysis without risking accidental commits of raw student exports or anonymized-but-still-sensitive analysis tables.

Non-goals:
- Do not analyze real student data in this packet.
- Do not add the cohort insight generator yet.
- Do not create or commit raw usage exports, anonymized row-level tables, SQLite/DuckDB databases, screenshots containing student names, or local mapping files.
- Do not add server storage, network upload, cloud sync, telemetry, or external analytics.
- Do not change the student usage export format.
- Do not change admin UI behavior.

Depends on:
- Existing `.gitignore` already ignores `local/`.
- `docs/subsystems/usage-and-admin.md` as the usage/admin contract.
- Plan 79 for improved per-student admin progress story, though this packet may proceed independently.

Blocks:
- Any cohort-level analysis packet that asks the integration owner to place real student files in the workspace.

Why this packet exists:
The cohort analysis workflow will involve real classroom usage files. Even anonymized row-level data can remain sensitive because it may preserve learning trajectories, timestamps, session ids, or rare behavior patterns. Before building analysis tooling, the repo needs an explicit, boringly safe local workspace convention and guardrails that keep both raw and anonymized cohort data untracked.

## Authority And Contracts

Obey these sources of truth:
- `.gitignore`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/file-pipelines.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`

Required privacy contracts:
- Raw student usage exports must live only under a git-ignored local path.
- Anonymized row-level outputs must also live only under a git-ignored local path.
- Local identity mapping files must never be tracked.
- Progress reports must describe tooling behavior without including student names, raw event rows, session ids, hashes, or row-level anonymized trajectories.
- Generated aggregate summaries may become tracked artifacts only in a later owner-approved packet and only after explicit review for privacy/identifiability.
- The workflow must be usable without network access.
- Path guard checks must normalize/resolve paths before deciding whether they are safe.

Do not redefine:
- Usage export file structure.
- Hash/integrity semantics.
- Local-only admin page status.
- Similarity/fingerprint philosophy.

## Required Reading

Read these before editing:
- `.gitignore`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/file-pipelines.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`

Use:

```powershell
rg "usage export|usage file|local/|regression/output|studentName|sessionId|integrity" docs src tests -S
```

## Scope

In scope:
- Reinforce `.gitignore` with explicit cohort usage analysis paths, even if `local/` is already ignored.
- Define a canonical local folder convention, recommended:
  - `local/usage-cohorts/<cohort-id>/raw-exports/`
  - `local/usage-cohorts/<cohort-id>/anonymized/`
  - `local/usage-cohorts/<cohort-id>/analysis/`
  - `local/usage-cohorts/<cohort-id>/identity-map/`
- Add teacher/operator instructions explaining exactly where to put files and what not to commit.
- Add a helper script or lightweight utility only if it materially reduces risk. Example: a path guard that refuses to operate outside `local/usage-cohorts/`.
- Add tests for any helper logic.
- Update docs so future packets know cohort analysis data stays local and untracked.

Out of scope:
- Parsing or normalizing student usage files.
- Building a database.
- Producing cohort findings.
- Rendering dashboards.
- Running analysis on real student data.

Files and areas likely touched:
- `.gitignore`
- `docs/subsystems/usage-and-admin.md`
- possibly `docs/CohortUsageAnalysis.md` or another docs page chosen by the implementer
- possibly `src/usage/cohortPrivacyPaths.js` or `scripts/usage-cohort-*.js` if guard tooling is added
- tests for any helper module

## Implementation Requirements

### 1. Explicit Local Folder Convention

Required behavior:
- Document the canonical intake folder:

```text
local/usage-cohorts/<cohort-id>/raw-exports/
```

- Document generated local output folders:

```text
local/usage-cohorts/<cohort-id>/anonymized/
local/usage-cohorts/<cohort-id>/analysis/
local/usage-cohorts/<cohort-id>/identity-map/
```

- Explain that `<cohort-id>` should be a local label such as `spring-2026-section-a`, not a student name.
- Explain that the integration owner should copy student `.json` usage exports into `raw-exports/`.
- Explain that no raw or anonymized cohort data should be copied into `reports/`, `docs/`, `tests/fixtures/`, or committed source folders.

### 2. Git Ignore Reinforcement

Required behavior:
- Add explicit ignore patterns for cohort usage data even though `local/` is already ignored.
- Include raw exports, anonymized tables, analysis databases, and identity maps.
- Do not add negation rules that would allow student data below these folders to be tracked.

Recommended patterns:

```gitignore
# Local classroom cohort usage analysis data
local/usage-cohorts/
```

If additional explicit patterns improve clarity, add them, but keep the rule simple and hard to bypass.

### 3. Operator-Facing Safety Instructions

Required behavior:
- Add a short, plain-language doc section for the integration owner:
  - where to place raw exports
  - how to confirm files are ignored with `git status --short`
  - warning signs that something went wrong
  - what outputs are safe to share with implementers/orchestrators
  - what outputs must remain local
- Include the exact command:

```powershell
git status --short local/usage-cohorts
```

- Explain that an empty result is expected because the path is ignored.
- Also include the whole-repo check:

```powershell
git status --short
```

- Explain that the owner should confirm no raw student `.json`, anonymized row-level output, database, identity map, or local cohort report appears anywhere in the whole-repo status.
- Explain that `git status --short local/usage-cohorts` only checks the intended path; a typo such as `local/cohorts/` could still appear in whole-repo status.
- Explain that if raw or anonymized files appear in normal `git status`, stop before committing and repair `.gitignore` or file location.

### 4. Optional Path Guard Helper

Required behavior if helper code is added:
- Provide a reusable function or script that verifies an input/output path is under `local/usage-cohorts/`.
- Refuse paths under tracked locations such as `reports/`, `docs/`, `src/`, or `tests/fixtures/`.
- Make future Plan 81 tooling call this guard before reading raw exports or writing anonymized outputs.
- Resolve/normalize candidate paths before checking prefixes:
  - handle `..` traversal
  - handle absolute paths
  - handle Windows backslashes
  - handle case-insensitive path comparisons on Windows where practical
  - avoid trusting raw string `startsWith()` checks
- Include adversarial negative tests, not just happy-path tests:
  - `local/usage-cohorts/../../reports/leak.json`
  - absolute paths outside the repo
  - paths using backslash traversal
  - paths targeting `docs/`, `reports/`, `src/`, or `tests/fixtures/`
  - symlink-ish cases if the helper resolves real paths

Stop and report if:
- A robust path guard would require platform-specific complexity beyond a small helper.

### 5. Documentation Tail

Required behavior:
- Update `docs/subsystems/usage-and-admin.md` or a linked companion doc so it records:
  - raw student exports are local-only
  - cohort analysis row-level outputs are local-only
  - reports may summarize tooling but must not include identifying data unless the owner explicitly approves an aggregate-only artifact

## Work Plan

1. Inspect `.gitignore` and current usage/admin docs.
2. Add explicit cohort local-path ignore rule.
3. Add operator-facing documentation.
4. Add optional path guard helper only if it stays small and testable.
5. Add tests for helper logic if helper code is added.
6. Update subsystem docs.
7. Run validation.
8. Write a progress report that contains no student data.

## Validation Commands

Run from the repository root:

```powershell
npm test
npm run build
```

If helper tests are added, also run their focused command, for example:

```powershell
node --test --test-isolation=none tests/unit/usage-cohort-privacy-paths.test.js
```

Manual privacy check:

```powershell
New-Item -ItemType Directory -Force local/usage-cohorts/sample/raw-exports
Set-Content local/usage-cohorts/sample/raw-exports/example.json "{}"
git status --short local/usage-cohorts
git status --short
Remove-Item local/usage-cohorts/sample/raw-exports/example.json
```

Expected result: no tracked output for `local/usage-cohorts`.

Do not commit the sample file. Delete it after the check.

## Validation Checklist

- [ ] `.gitignore` explicitly protects `local/usage-cohorts/`.
- [ ] Operator docs tell the owner exactly where to place raw exports.
- [ ] Operator docs say anonymized row-level data also remains untracked.
- [ ] Operator docs include `git status --short local/usage-cohorts` check.
- [ ] Operator docs include whole-repo `git status --short` check.
- [ ] No raw, anonymized, or sample student data is committed.
- [ ] Optional helper code resolves/normalizes paths before checking allowed roots.
- [ ] Optional helper code refuses tracked source/report paths.
- [ ] Optional helper tests include traversal, absolute-path, backslash, and tracked-path bypass attempts.
- [ ] Usage/admin docs reflect the local-only privacy contract.
- [ ] Tests/build pass as applicable.
- [ ] Progress report contains no student-identifying or row-level cohort data.

## Stop Conditions

Stop and report if:
- Any raw or anonymized usage file appears as trackable in `git status`.
- The work would require committing a sample real usage export.
- The work would require adding a dependency.
- The path guard cannot be made reliable without broad filesystem or build changes.
- The documentation cannot make the local-only workflow clear enough for a non-implementer to follow safely.
