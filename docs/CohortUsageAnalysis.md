# Cohort Usage Analysis & Privacy Guidelines

This document outlines the local workspace guidelines and safety procedures for conducting classroom cohort usage analysis in the Browser Battlegorithms repository.

## 1. Directory Structure and Privacy Contract

To prevent accidental leaks of raw student exports, anonymized trajectories, session logs, SQLite/DuckDB databases, or identity maps, all cohort-related files **must** reside strictly within the git-ignored `local/usage-cohorts/` directory.

### Canonical Folder Convention
When performing cohort analysis, organize files under a custom `<cohort-id>` directory under `local/usage-cohorts/`:

```text
local/usage-cohorts/<cohort-id>/raw-exports/
local/usage-cohorts/<cohort-id>/anonymized/
local/usage-cohorts/<cohort-id>/analysis/
local/usage-cohorts/<cohort-id>/identity-map/
```

- **`<cohort-id>`**: A generic, local label identifying the class section (e.g. `spring-2026-section-a`), **never** a student's name or personal identifier.
- **`raw-exports/`**: Place raw student `.json` usage exports here.
- **`anonymized/`**: Store intermediate anonymized tables, row-level trajectories, and pruned JSON/CSV records here.
- **`analysis/`**: Store local databases (SQLite, DuckDB), query scripts, spreadsheets, or graphs here.
- **`identity-map/`**: Store local lookup keys or mappings translating student names/hashes to anonymous IDs here.

### Privacy Invariants
- **No real student data or row-level anonymized logs** may be committed to Git.
- Never copy cohort files into tracked folders like `reports/`, `docs/`, `src/`, or `tests/fixtures/`.
- The analysis workflow must function completely offline without external telemetry or cloud-sync dependencies.

---

## 2. Operator Safety Checklist (Integration Owner)

As the operator (integration owner/teacher), you must verify that no student files are exposed to Git tracking before committing any changes.

### Step 1: Run Cohort Path Status Check
Verify that the `local/usage-cohorts/` path is correctly ignored by Git:

```powershell
git status --short local/usage-cohorts
```

* **Expected Result**: Empty output. If Git lists any files (indicated by `??`, `A`, or `M`), **STOP** immediately. Your files are not being ignored. Check your `.gitignore` configuration.

### Step 2: Run Whole-Repository Status Check
Check for typos or misplaced files anywhere else in the repository:

```powershell
git status --short
```

* **Expected Result**: Confirm that no student names, `.json` exports, local databases, or reports containing raw data are listed.
* **Why this matters**: A folder typo like `local/cohorts/` or placing a file directly in the repository root will bypass the `local/usage-cohorts/` ignore rules and show up here.

### Step 3: Handle Verification Failures
If you find raw or anonymized student files appearing in `git status`:
1. Move the files to the correct `local/usage-cohorts/` subdirectory.
2. Confirm `.gitignore` has the rule:
   ```gitignore
   local/usage-cohorts/
   ```
3. Run `git rm --cached <file>` if any file was accidentally staged or committed previously.

---

## 3. Cohort Analysis Pipeline Command (CLI)

Plan 81 introduces a local-only cohort analysis command line tool. It scans a raw exports directory, extracts metrics, anonymizes identifiers, and writes queryable CSV/JSON tables to the local directory.

### Running Cohort Analysis

To run the analysis pipeline for a specific cohort ID:
```powershell
npm run usage:cohort -- --cohort <cohort-id>
```
For example, if you have placed files under `local/usage-cohorts/fall-2026-sec-a/raw-exports/`:
```powershell
npm run usage:cohort -- --cohort fall-2026-sec-a
```

To run a dry-run check (verifies files and parses paths without writing outputs):
```powershell
npm run usage:cohort -- --cohort fall-2026-sec-a --dry-run
```

You can also run with explicit custom directories:
```powershell
npm run usage:cohort -- --input local/usage-cohorts/my-cohort/raw-exports --output local/usage-cohorts/my-cohort
```

### Anonymization and Mapping Design
- Original filenames and student names are mapped to stable anonymized IDs (e.g., `export-001`) based on their payload characteristics.
- This mapping is stored in `local/usage-cohorts/<cohort-id>/identity-map/map.json`.
- Row-level tables written to `anonymized/json/` and `anonymized/csv/` do not contain student names or raw session IDs, meaning subsequent analysis packets (like Plan 82) can consume them safely without exposing identity.

### Generated Artifacts (All Git-Ignored)
- **`anonymized/json/` and `anonymized/csv/`**: JSON and CSV databases for 6 tables (`exports`, `events`, `guided_attempts`, `guided_level_rollup`, `class_level_rollup`, `export_progress`).
- **`analysis/baseline-report.md`**: Factual description of student progression, sticking points, and metrics.
- **`analysis/queries/starter_queries.md`**: SQL-like logic and JSON query starter descriptions.

