# Plan 20 — Gitignore Hardening And Untracking

- Packet id: plan-20
- Packet title: Gitignore Hardening And Untracking
- Status: ready
- Owner/model: integration owner + mini-model implementer
- Date: 2026-05-14
- Packet type: other (repo config and history hygiene)
- Mutation level: GitHub config (`.gitignore`, git index) + docs-only (`.env.example`, README note)
- Approval gate: before mutation. The implementing agent must show the exact `git rm --cached` command list and the proposed `.gitignore` diff inline before running anything.
- Expected artifacts:
  - revised `.gitignore`
  - new `.env.example`
  - small note in `README.md` documenting the `.env.example` → `.env` pattern
  - removal of `.claude/settings.local.json`, `.env`, `local/`, and any tracked files under `scratch/` from the git index
  - progress report at `reports/development/plan-20-gitignore-and-untracking/progress.md`
- Progress report folder: `reports/development/plan-20-gitignore-and-untracking/`
- Progress report file: `progress.md`

## Goal

Stop tracking files that were tracked by accident or that pre-date `.gitignore` rules added later. Replace the tracked `.env` with a committed `.env.example` template. Add standard OS/editor cruft to `.gitignore` so a fresh contributor on macOS or Linux does not accidentally commit `.DS_Store` or IDE state.

## Non-goals

- No deletion of files from disk. Every operation is `git rm --cached`, never plain `git rm`. The implementing agent must never use `git rm` without `--cached`.
- No rewriting of git history (no `git filter-repo`, no force-push). Once a file has been committed, it stays in history. The point is to stop tracking it going forward, not to scrub history.
- No content edits to the files being untracked (no edits to `.env`, no edits to `local/`).
- No fix for absolute paths in report markdown — that is Plan 21.

## Why this packet exists

- `.claude/settings.local.json` is tracked despite `.claude/` being in `.gitignore`. It contains the author's local Windows username in an absolute path (`/c/Users/orion/...`). The repo is public; that username is visible on GitHub right now.
- `.env` is tracked. It contains `DEV_PORT=4173`. The standard pattern is to commit `.env.example` and ignore `.env` so each developer can have a local override without affecting others.
- `local/` was intended as a local-only scratch folder per the integration owner but was committed as ~30 planning files. Historical change notes do not need to be public.
- `scratch/` is untracked today but not in `.gitignore`; any future file dropped there will show up in `git status`.
- The current `.gitignore` does not cover standard OS or editor cruft (`.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`, etc.), which will eventually leak in from another contributor or another machine.

## Authority and contracts

- `.gitignore` and `package.json` are the only existing tracked files modified.
- `README.md` gets a small addition documenting the `.env.example` pattern.
- A new `.env.example` is added.
- The implementing agent must not modify any file under `src/`, `tests/`, `docs/`, or `reports/` as part of this packet.

## Required reading

- `.gitignore`
- `.env`
- `README.md` (the "Dev Server Port" section in particular)
- `.claude/settings.local.json`
- `local/` directory listing (no need to read every file; know the shape)

## Scope

**In scope:**
- `git rm --cached` for the files and folders listed below.
- Replacing `.env` with `.env.example` (template) plus `.env` in `.gitignore`.
- Adding standard OS/editor cruft entries to `.gitignore`.
- Adding a one-line README note about copying `.env.example` to `.env` on fresh clone.

**Out of scope:**
- Touching content of untracked files.
- Rewriting any git history.
- Fixing absolute paths in `reports/*.md` (Plan 21).
- Any source or test changes.

**Files touched:**
- `.gitignore`
- `.env.example` (new)
- `README.md`
- git index (via `git rm --cached`)
- `reports/development/plan-20-gitignore-and-untracking/progress.md`

## Implementation requirements

### Requirement 1 — Untrack the four problem entries

Run, in this order, with the agent showing the integration owner the full command list first:

```powershell
git rm --cached .claude/settings.local.json
git rm --cached .env
git rm --cached -r local/
```

For `scratch/`, first check whether any files are tracked under it:

```powershell
git ls-files scratch/
```

If the command returns any output, untrack with `git rm --cached -r scratch/`. If it returns nothing, the directory is already untracked and no `git rm` is needed.

**Constraint:** all commands use `--cached`. None of these files should be removed from disk. Verify after each command that the file still exists at its path (`ls .env`, etc.).

### Requirement 2 — Create `.env.example`

Create `.env.example` at the repo root with exactly:

```
DEV_PORT=4173
```

No comments, no extra lines. The README explains the pattern; the file itself should be minimal.

### Requirement 3 — Update `.gitignore`

Replace the current `.gitignore` with the structure below. Group entries with comment headers so future contributors can see the intent at a glance.

```
# Build output
node_modules/
dist/
.npm-cache/

# Test output
test-results/
playwright-report/
tests/regression/output/
tests/regression/screenshots/
coverage/

# Env files (commit .env.example instead)
.env
.env.local
.env.*.local

# Logs
*.log
*.err.log

# Tool / agent state
.claude/
scratch/
local/

# OS cruft
.DS_Store
Thumbs.db
ehthumbs.db
desktop.ini

# Editor cruft
.vscode/
.idea/
*.swp
*.swo
*~
```

Notes on the diff vs the current file:
- `coverage/` is new (defensive for future test tooling).
- `.env` is new (paired with the `.env.example` commit).
- `.env.*.local` is new (covers Vite-style env layering).
- `local/` and `scratch/` are new.
- OS cruft and editor cruft sections are new.
- The existing entries are preserved.

### Requirement 4 — README note about `.env.example`

In `README.md`, in the "Dev Server Port" section, add one sentence before or after the existing `.env.local` paragraph:

```
On a fresh clone, copy `.env.example` to `.env` to set the default dev server port.
```

Place it where it reads naturally with the existing copy. Do not restructure the README.

## Work plan

1. Read the four required files.
2. Run `git ls-files scratch/` to determine whether `scratch/` needs untracking.
3. Draft the full command list and the new `.gitignore` in the progress report.
4. **Stop for owner approval of the command list before running any `git rm` commands.**
5. After approval, run the `git rm --cached` commands one at a time, verifying the file still exists on disk after each.
6. Write `.env.example`.
7. Replace `.gitignore`.
8. Add the README note.
9. Run validation.
10. Write the final progress report entry including the exact commands run.

## Commands

```powershell
git status
git ls-files .claude/ scratch/ local/
git rm --cached <path>          # only with --cached
npm test
npm run build
```

The `npm` commands are sanity checks; this packet should not affect them. They are listed so the agent runs them once at the end.

## Validation checklist

- [ ] `git ls-files .claude/` returns nothing (or, if `.claude/` is empty, no rows).
- [ ] `git ls-files local/` returns nothing.
- [ ] `git ls-files scratch/` returns nothing.
- [ ] `git ls-files .env` returns nothing.
- [ ] `git ls-files .env.example` shows the new file.
- [ ] `.env`, `local/`, `scratch/`, `.claude/settings.local.json` still exist on disk (only their tracking changed).
- [ ] `.gitignore` contains all groups listed in Requirement 3.
- [ ] `README.md` mentions copying `.env.example` to `.env`.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No files under `src/`, `tests/`, `docs/`, or `reports/` were modified by this packet.
- [ ] Final progress report records every command executed.

## Stop conditions

- A `git rm --cached` would touch a file the agent has not explicitly been told to untrack — stop and ask.
- `git ls-files scratch/` returns files whose names suggest they may be load-bearing rather than scratch — surface before untracking.
- A file is found to contain secrets (API keys, tokens, personal identifiers beyond what is already known) — surface immediately; the broader response may need to include history rewriting, which is out of scope for this packet.
- The `.env.example` template would need to include a value other than `DEV_PORT=4173` — surface; the integration owner decides what belongs in the template.

## Model-specific instructions

- Never run `git rm` without `--cached`. Treat it as a typo to be caught before execution.
- Never run `git filter-repo`, `git push --force`, or any history-rewriting command.
- Run commands one at a time. Verify after each that the local file still exists.
- Do not edit the contents of files being untracked — those edits are out of scope.
- Show the full command list to the integration owner before running anything destructive to the index.
