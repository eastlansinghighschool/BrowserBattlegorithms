# Plan 20 Progress Report — Gitignore Hardening And Untracking

## Status

Reading pass complete. Command list and `.gitignore` diff drafted below. Stopped per approval gate. No commands have been run yet.

## Reading pass notes

### `.gitignore` (current)

```
node_modules/
dist/
.npm-cache/
test-results/
playwright-report/
tests/regression/output/
tests/regression/screenshots/
.env.local
*.log
*.err.log
.claude/
```

No groups or comment headers. `.env` is absent (the gap that allows it to be tracked). `.env.local` is already here. `.claude/` is already here — but `settings.local.json` pre-dates the rule so it remains tracked.

### `.env`

Contains exactly one line: `DEV_PORT=4173`. No secrets beyond what is already known. Safe to replace with `.env.example`.

### `.claude/settings.local.json`

Contains local permission allow-list entries, including `Bash(ls /c/Users/orion/...)` — author's local Windows username. No API keys or tokens. The username is the personal identifier the packet describes.

### `README.md` — Dev Server Port section

```
## Dev Server Port

Configured via `DEV_PORT` in `.env`. Override locally without affecting other contributors by creating a `.env.local` file (gitignored):

    DEV_PORT=3000
```

The `.env.example` sentence goes before or after this paragraph.

### `scratch/`

`git ls-files scratch/` returned nothing. Already untracked. No `git rm --cached` command needed for `scratch/`.

### `local/` (tracked files)

45 files, all under `local/level_changes/`:
- `CHANGE_LOG.md`, `PROMPT_TIER1.md` through `PROMPT_TIER7.md`
- Tier 1–7 level change planning notes

All names are consistent with planning scratch material. No file names suggest load-bearing artifacts. No stop condition triggered.

---

## Proposed command list (full, pre-approval)

```powershell
# Step 1a — untrack settings.local.json
git rm --cached .claude/settings.local.json

# Step 1b — verify still on disk
ls .claude/settings.local.json

# Step 2a — untrack .env
git rm --cached .env

# Step 2b — verify still on disk
ls .env

# Step 3a — untrack local/ recursively (45 files)
git rm --cached -r local/

# Step 3b — verify still on disk
ls local/

# scratch/ — already untracked, no command needed
```

No `git rm` without `--cached`. No history-rewriting commands.

---

## Proposed `.gitignore` replacement

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

**Diff vs current:**
- Added: `coverage/`, `.env`, `.env.*.local`, `local/`, `scratch/`, OS cruft section, editor cruft section
- Moved: `.env.local` from ungrouped to the "Env files" section (same rule, now grouped)
- Added: comment headers for all groups
- Preserved: all existing entries

---

## Proposed `.env.example`

```
DEV_PORT=4173
```

One line, no comments.

---

## Proposed README addition

In the "Dev Server Port" section, prepend before the existing paragraph:

```
On a fresh clone, copy `.env.example` to `.env` to set the default dev server port.
```

Full section after the change:

```markdown
## Dev Server Port

On a fresh clone, copy `.env.example` to `.env` to set the default dev server port.

Configured via `DEV_PORT` in `.env`. Override locally without affecting other contributors by creating a `.env.local` file (gitignored):

    DEV_PORT=3000
```

---

## Implementation — 2026-05-14

Owner approved. Commands run one at a time with disk-existence verification after each.

**Commands executed:**

```powershell
git rm --cached .claude/settings.local.json   # → rm '.claude/settings.local.json'
ls .claude/settings.local.json                 # → file present on disk ✓

git rm --cached .env                           # → rm '.env'
ls .env                                        # → file present on disk ✓

git rm --cached -r local/                      # → rm 44 files under local/level_changes/
ls local/                                      # → level_changes/ present on disk ✓

# scratch/ — already untracked, no command needed

git add .env.example                           # stage the new template file
```

**Files written:**
- `.env.example` — `DEV_PORT=4173`
- `.gitignore` — replaced with grouped structure per Requirement 3
- `README.md` — prepended `.env.example` sentence to Dev Server Port section

**Validation:**

| Check | Result |
|---|---|
| `git ls-files .claude/` | empty ✓ |
| `git ls-files .env` | empty ✓ |
| `git ls-files local/` | empty ✓ |
| `git ls-files scratch/` | empty ✓ |
| `git ls-files .env.example` | `.env.example` ✓ |
| `.env`, `local/`, `.claude/settings.local.json` on disk | present ✓ |
| `.gitignore` groups | all present ✓ |
| README mentions `.env.example` | ✓ |
| `npm test` | 99 pass, 0 fail ✓ |
| `npm run build` | clean (same pre-existing warnings) ✓ |
| `src/`, `tests/`, `docs/`, `reports/` untouched | ✓ |

## Final status: complete
