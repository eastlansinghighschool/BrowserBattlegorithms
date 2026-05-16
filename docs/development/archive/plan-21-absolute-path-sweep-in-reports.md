# Plan 21 — Absolute Path Sweep In Report Markdown

- Packet id: plan-21
- Packet title: Absolute Path Sweep In Report Markdown
- Status: ready
- Owner/model: integration owner + mini-model implementer
- Date: 2026-05-14
- Packet type: docs
- Mutation level: docs-only
- Approval gate: before mutation. The agent must show the exact substitution plan and the file list inline before applying any edit.
- Expected artifacts:
  - revised markdown files under `reports/` with absolute paths replaced by relative ones
  - progress report at `reports/development/plan-21-absolute-path-sweep-in-reports/progress.md`
- Progress report folder: `reports/development/plan-21-absolute-path-sweep-in-reports/`
- Progress report file: `progress.md`

## Goal

Remove hardcoded `C:/Codex/BrowserBattlegorithms_CODEX/` from markdown links in tracked report files so the links work for anyone cloning the repo, and so the author's local repo path stops appearing in public history.

## Non-goals

- No changes to other docs (`docs/`, `README.md`, anything outside `reports/`).
- No content rewriting beyond the path substitution. The reports are kept as-is otherwise; Plan 17 already established they do not need to follow a uniform structure.
- No rewriting of git history. The absolute paths in past commits stay where they are; this packet only changes the current tree.
- No changes to source files even if a report references a file that has since been moved or renamed. If a link target no longer exists, surface it — do not guess at a corrected path.

## Why this packet exists

Twelve markdown files under `reports/` contain links of the form `[label](C:/Codex/BrowserBattlegorithms_CODEX/src/...)`. Two problems:

- The links are broken for anyone whose checkout is not at exactly `C:/Codex/BrowserBattlegorithms_CODEX/`. That's everyone except the author.
- The author's local repo path is now in a public repo. Mildly identifying (confirms Windows, confirms folder layout) and easy to fix.

The substitution is mechanical: replace `C:/Codex/BrowserBattlegorithms_CODEX/` with empty string. The leading `(` and the rest of the link become a relative path that markdown viewers can resolve from the file's own location, assuming relative resolution. In a few cases the resulting relative path may need a `../` prefix because the report file is nested deeper than the link target; the agent must verify each file group rather than trusting the substitution blindly.

## Authority and contracts

- Only files under `reports/` are touched.
- The set of files to modify is pinned by `git grep -lE "C:/Codex|C:\\\\Codex" -- 'reports/**/*.md'` at packet start. The agent must produce that list as part of the inventory step.
- No changes to subsystem notes, the spec, or any active doc — those are out of scope.

## Required reading

- `reports/development/doc-cleanup/blockly-doc-report.md` — read one example end-to-end to understand how the absolute paths are embedded (the same pattern appears across all twelve files).
- `docs/subsystems/` index from `docs/ARCHITECTURE.md` — for context; not modified.

The agent does not need to read all twelve files cover to cover. After the inventory step, the work is mechanical.

## Scope

**In scope:**
- Replace `C:/Codex/BrowserBattlegorithms_CODEX/` with the correct relative prefix in markdown links inside the twelve identified files.
- Verify the resulting relative links resolve to existing files.
- Spot-check rendered output on three files (one doc-cleanup report, two plan progress reports) to confirm readability.

**Out of scope:**
- Editing any file outside `reports/`.
- Editing prose content of the reports.
- Updating links whose target file has since been moved or renamed (surface instead).

**Files likely touched:** the twelve markdown files identified by the initial grep. As of packet creation these are:
- `reports/development/doc-cleanup/blockly-doc-report.md`
- `reports/development/doc-cleanup/free-play-doc-report.md`
- `reports/development/doc-cleanup/guided-level-doc-report.md`
- `reports/development/doc-cleanup/import-export-doc-report.md`
- `reports/development/doc-cleanup/npc-and-free-play-cpu-doc-report.md`
- `reports/development/doc-cleanup/p5-doc-report.md`
- `reports/development/doc-cleanup/turn-engine-doc-report.md`
- `reports/development/doc-cleanup/ui-overlays-doc-report.md`
- `reports/development/doc-cleanup/usage-export-and-admin-doc-report.md`
- `reports/development/plan-07-private-free-play-program-files/progress.md`
- `reports/development/plan-09-project-metadata-and-workspace-architecture/progress.md`
- `reports/development/plan-14-project-version-history-design/progress.md`

The agent must re-run the grep at packet start and confirm the list matches before editing.

## Implementation requirements

### Requirement 1 — Inventory pass

Run:

```powershell
git grep -lE "C:/Codex|C:\\Codex" -- 'reports/**/*.md'
```

Confirm the result matches the twelve files listed above. If it differs, surface the difference in the progress report and stop before editing.

Then for one representative file (suggest `reports/development/doc-cleanup/blockly-doc-report.md`), compute what the correct relative prefix would be from that file's location. For a file at `reports/development/doc-cleanup/X.md` linking to `src/ai/blockly/workspace.js`, the relative path is `../../../src/ai/blockly/workspace.js`. Confirm this resolves and document the prefix for each containing folder in the progress report.

### Requirement 2 — Substitution plan

For each containing folder under `reports/`, compute the relative prefix that should replace `C:/Codex/BrowserBattlegorithms_CODEX/`. The expected mapping:

- Files in `reports/development/doc-cleanup/` → prefix `../../../`
- Files in `reports/development/plan-07-private-free-play-program-files/` → prefix `../../../`
- Files in `reports/development/plan-09-project-metadata-and-workspace-architecture/` → prefix `../../../`
- Files in `reports/development/plan-14-project-version-history-design/` → prefix `../../../`

All twelve files happen to live at the same depth (three levels under repo root), so the prefix is uniform. Confirm this in the inventory step — if any file is at a different depth, its prefix differs and must be handled separately.

### Requirement 3 — Apply substitutions

For each file, replace every occurrence of `C:/Codex/BrowserBattlegorithms_CODEX/` with the file's computed relative prefix (`../../../` for all twelve as of packet writing).

The agent may use any reliable mechanism (sed, an editor's find/replace, or per-file Edit calls). Whatever method is used, the agent must:

- Match `C:/Codex/BrowserBattlegorithms_CODEX/` and `C:\Codex\BrowserBattlegorithms_CODEX\` (forward and backslash variants). Both may appear.
- Not match other occurrences of `C:/Codex` that are not followed by `BrowserBattlegorithms_CODEX/` (none expected, but worth a sanity grep after).
- Not touch any file outside the twelve identified.

### Requirement 4 — Verify resulting links

After the substitution:

1. Re-run `git grep -E "C:/Codex|C:\\Codex" -- 'reports/**/*.md'` and confirm it returns nothing.
2. For three files (one doc-cleanup, two plan reports), pick two or three links each and verify the resolved relative path points to a file that exists. Use `Read` or `ls` on the resolved path.
3. If any link target does not exist (e.g. file moved since the report was written), record the broken link in the progress report and leave the relative link as-is. Do not try to repair it.

## Work plan

1. Run the inventory grep and confirm the file list.
2. Compute and document the relative-prefix mapping per folder.
3. Post the substitution plan in the progress report.
4. **Stop for owner approval of the file list, prefix mapping, and substitution method.**
5. Apply substitutions across all twelve files.
6. Re-run the grep to confirm no absolute paths remain.
7. Spot-check three files for link resolution.
8. Run validation commands.
9. Write the final progress report entry including the diff size per file and any broken-link findings.

## Commands

```powershell
git grep -lE "C:/Codex|C:\\Codex" -- 'reports/**/*.md'
git grep -E "C:/Codex|C:\\Codex" -- 'reports/**/*.md'   # post-fix sanity
npm test
npm run build
```

`npm test` and `npm run build` are sanity checks; this packet does not change any code path they exercise. They confirm no file outside `reports/` was accidentally modified.

## Validation checklist

- [ ] The post-fix grep `git grep -E "C:/Codex|C:\\Codex" -- 'reports/**/*.md'` returns nothing.
- [ ] All twelve files are still valid markdown (open one in a viewer; no broken syntax).
- [ ] Three spot-checked links resolve to existing files in the repo.
- [ ] Any broken links found are documented in the progress report, not silently "fixed."
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No files outside `reports/` were modified.
- [ ] Final progress report lists every file changed, the substitution count per file, and any broken-link findings.

## Stop conditions

- The inventory grep returns a file list different from the twelve listed in this packet — surface the difference and stop before editing.
- A file is found at a different folder depth (relative prefix not `../../../`) — surface, do not improvise.
- An absolute path is found that does not follow the `C:/Codex/BrowserBattlegorithms_CODEX/` pattern — surface, do not guess.
- A link target does not exist post-substitution — record in progress report, leave the link, continue with other files. If more than a handful are broken, surface and stop before continuing.
- A report file appears to have been substantively rewritten since Plan 17 closed and the absolute paths look like new content rather than legacy — surface before editing (this is unlikely but worth a check).

## Model-specific instructions

- This is mechanical work. Resist the urge to also "improve" the prose of the reports. Plan 17 established that reports do not need uniform structure.
- Bulk substitution is fine, but verify the result with the post-fix grep. Do not skip the verification.
- The relative prefix is `../../../` for every file as of packet writing because all twelve happen to live three levels under repo root. Confirm in the inventory step rather than assuming.
- If a substitution would introduce a `.../` (three or more consecutive dots) or otherwise malformed link, stop. That indicates a broken pattern match.
