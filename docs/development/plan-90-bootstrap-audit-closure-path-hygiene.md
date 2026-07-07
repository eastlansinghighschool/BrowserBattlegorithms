---
id: plan-90-bootstrap-audit-closure-path-hygiene
title: "Bootstrap Audit Closure And Path Hygiene Triage"
status: ready
depends_on: []
gate: "before changing source paths, before deleting files, before adopting deferred Bootstrap capabilities"
superseded_by: null
resolution: null
summary: >-
  After Plans 87–89, rerun the Bootstrap audit, make the adoption manifest truthful, and triage durable-doc path hygiene without broad historical cleanup.
---
# Plan 90: Bootstrap Audit Closure And Path Hygiene Triage

- Packet id: Plan 90
- Packet title: Bootstrap Audit Closure And Path Hygiene Triage
- Status: (see frontmatter)
- Owner/model: lower-cost scan/report agent with light docs-edit permission
- Date: 2026-07-06
- Packet type: scan-only / docs
- Mutation level: docs-only plus audit report; no source/runtime changes
- Approval gate: before changing source paths, before deleting files, before adopting deferred Bootstrap capabilities
- Expected artifacts:
  - post-adoption Bootstrap audit report
  - updated `.bootstrap-adoption.json` if prior packets left it stale
  - path-hygiene triage report for absolute/local paths in durable docs
  - progress report
- Progress report folder: `reports/development/plan-90-bootstrap-audit-closure-path-hygiene/`
- Progress report file: `reports/development/plan-90-bootstrap-audit-closure-path-hygiene/progress.md`

## Packet Summary

Goal: Close the Bootstrap adoption wave by verifying which capabilities are now genuinely adopted, which are intentionally deferred, and whether any newly added durable docs contain machine-specific path hygiene problems.

Non-goals:
- Do not implement deferred capabilities such as a dev console hub.
- Do not repair every absolute path found across old reports.
- Do not edit game source, tests, levels, usage tooling, or generated guided evidence.
- Do not archive or delete old packet files.

Depends on:
- Plan 87 complete.
- Plan 88 complete if packet frontmatter/index migration is part of the adopted capability set.
- Plan 89 complete if agent prompts/falsification are part of the adopted capability set.

Blocks:
- Confident use of Bootstrap conventions in future rewrite packets.
- Cleaner handoff to implementers after the adoption wave.

Why this packet exists:
Bootstrap adoption should not end with "files were copied." The repo needs a clear, current adoption state and a triage list for any path-hygiene issues introduced by the migration. This is especially important because Browser Battlegorithms uses local-only classroom data and many progress reports naturally mention machine-specific paths.

## Authority And Contracts

Required project contracts:
- `.bootstrap-adoption.json`
- Bootstrap `bootstrap-capabilities.json`
- Bootstrap `scripts/bootstrap-audit.js`
- `AGENTS.md`
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- Privacy/local-data rules in Plans 80-83 and root `AGENTS.md`

Do not redefine:
- Deferred capabilities are allowed if explicitly recorded.
- Progress reports may contain local command transcripts; durable reusable docs should prefer repo-relative paths.
- Raw student exports, identity maps, cohort databases, and anonymized local analysis outputs remain untracked under `local/`.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 87 progress report.
- Plan 88 progress report, if complete.
- Plan 89 progress report, if complete.
- `.bootstrap-adoption.json`
- Bootstrap `bootstrap-capabilities.json`
- Root `AGENTS.md`
- Plans 80-83 for local/private data path expectations.

Use `rg` for:
- `C:\\`
- `/Users/`
- `local/`
- `bootstrap`
- `student export`
- `identity`

## Scope

### In Scope

- Run Bootstrap audit after Plans 87-89.
- Update `.bootstrap-adoption.json` only to match reality.
- Write a path-hygiene triage report under this packet's report folder.
- Patch small, obvious docs-only path issues introduced by Plans 87-89 if the correct replacement is unambiguous.

### Out Of Scope

- Broad historical cleanup of old progress reports.
- Editing source code or tests.
- Moving private/local data.
- Implementing dev console hub or other deferred Bootstrap capabilities.

### Files And Areas Likely Touched

- `.bootstrap-adoption.json`
- `reports/development/plan-90-bootstrap-audit-closure-path-hygiene/`
- Small docs-only path fixes in files touched by Plans 87-89, if needed

## Implementation Requirements

### 1. Bootstrap Audit

Required behavior:
- Run the Bootstrap audit against the current repo.
- Record each capability as adopted, absent, partial, or intentionally deferred.
- If the audit disagrees with `.bootstrap-adoption.json`, update the manifest or explain why the audit signal is intentionally not adopted.

Constraints:
- Do not overclaim adoption to make the audit look clean.
- Do not implement missing capabilities inside this scan packet.

### 2. Path Hygiene Triage

Required behavior:
- Search durable docs for newly introduced machine-specific paths.
- Classify findings:
  - harmless progress-report command transcript
  - should become repo-relative
  - should become `<bootstrap-repo>` or another placeholder
  - privacy-sensitive local classroom path risk
- Patch only low-risk, obvious docs issues introduced by the Bootstrap adoption wave.

Constraints:
- Do not rewrite old historical reports just to remove local paths.
- Stop if a path appears to point at private classroom data outside ignored `local/`.

### 3. Final Adoption Note

Required behavior:
- Progress report must tell future agents exactly which Bootstrap capabilities are adopted now and which remain deferred.
- Include the next recommended Bootstrap follow-up, if any.

## Work Plan

1. Read the adoption manifest and prior adoption progress reports.
2. Run the Bootstrap audit.
3. Search for path-hygiene issues in durable docs touched by Plans 87-89.
4. Patch only obvious docs path issues.
5. Update `.bootstrap-adoption.json` if it is stale.
6. Write the progress report and path-hygiene triage.

## Commands

Run from the repository root:

```powershell
node <bootstrap-repo>\scripts\bootstrap-audit.js . --report
rg "C:\\\\|/Users/|local/" docs reports .bootstrap-adoption.json
npm run plan:check
```

If `npm run plan:check` is unavailable, stop and explain which dependency packet is missing or incomplete.

## Validation Checklist

- [ ] Bootstrap audit result is recorded.
- [ ] `.bootstrap-adoption.json` matches reality.
- [ ] Deferred capabilities are explicit, not accidental.
- [ ] Path-hygiene triage report exists.
- [ ] Only low-risk docs path fixes were made.
- [ ] No source/runtime/test/level/generated guided evidence files changed.

## Stop Conditions

- Audit output indicates a core adopted capability is broken.
- A path-hygiene issue may expose private classroom data.
- Fixing a path issue requires broad historical report rewrites.
- Implementing a deferred Bootstrap capability appears necessary.
