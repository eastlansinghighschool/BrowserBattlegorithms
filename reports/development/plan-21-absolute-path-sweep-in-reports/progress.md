# Plan 21 Progress Report — Absolute Path Sweep In Report Markdown

## Status

Inventory complete. Substitution plan drafted. Stopped at approval gate — no files edited yet.

---

## Inventory pass

Command run:
```powershell
git grep -lE "C:/Codex|C:\\Codex" -- 'reports/**/*.md'
```

Result — 12 files, exact match with the packet list:

| File | Occurrences |
|---|---|
| `reports/development/doc-cleanup/blockly-doc-report.md` | 3 |
| `reports/development/doc-cleanup/free-play-doc-report.md` | 20 |
| `reports/development/doc-cleanup/guided-level-doc-report.md` | 20 |
| `reports/development/doc-cleanup/import-export-doc-report.md` | 25 |
| `reports/development/doc-cleanup/npc-and-free-play-cpu-doc-report.md` | 11 |
| `reports/development/doc-cleanup/p5-doc-report.md` | 8 |
| `reports/development/doc-cleanup/turn-engine-doc-report.md` | 16 |
| `reports/development/doc-cleanup/ui-overlays-doc-report.md` | 10 |
| `reports/development/doc-cleanup/usage-export-and-admin-doc-report.md` | 32 |
| `reports/development/plan-07-private-free-play-program-files/progress.md` | 9 |
| `reports/development/plan-09-project-metadata-and-workspace-architecture/progress.md` | 21 |
| `reports/development/plan-14-project-version-history-design/progress.md` | 1 |
| **Total** | **176** |

No backslash variants found (`C:\Codex\...` — none). All 176 occurrences are forward-slash `C:/Codex/BrowserBattlegorithms_CODEX/`.

---

## Prefix mapping

All 12 files sit at exactly 3 levels under repo root:

```
reports/
  development/
    <folder>/
      <file>.md        ← depth 3
```

Relative prefix to repo root: `../../../`

This is uniform — no file requires a different prefix.

**Verification:** `reports/development/doc-cleanup/blockly-doc-report.md` links to `src/ai/blockly/workspace.js`. After substitution: `../../../src/ai/blockly/workspace.js`. From the file's location, `../../..` resolves to repo root, then `src/ai/blockly/workspace.js` exists. ✓

**Special case — plan-14 self-referential link:**

`progress.md` (in `plan-14-project-version-history-design/`) links to `version-history-design.md` in the same folder. After substitution the link becomes `../../../reports/development/plan-14-project-version-history-design/version-history-design.md` — verbose but resolves correctly. Target confirmed to exist. No special handling needed; uniform substitution is correct.

---

## Substitution plan

**Method:** PowerShell bulk replacement — one command across all 12 files:

```powershell
$files = @(
  'reports/development/doc-cleanup/blockly-doc-report.md',
  'reports/development/doc-cleanup/free-play-doc-report.md',
  'reports/development/doc-cleanup/guided-level-doc-report.md',
  'reports/development/doc-cleanup/import-export-doc-report.md',
  'reports/development/doc-cleanup/npc-and-free-play-cpu-doc-report.md',
  'reports/development/doc-cleanup/p5-doc-report.md',
  'reports/development/doc-cleanup/turn-engine-doc-report.md',
  'reports/development/doc-cleanup/ui-overlays-doc-report.md',
  'reports/development/doc-cleanup/usage-export-and-admin-doc-report.md',
  'reports/development/plan-07-private-free-play-program-files/progress.md',
  'reports/development/plan-09-project-metadata-and-workspace-architecture/progress.md',
  'reports/development/plan-14-project-version-history-design/progress.md'
)
foreach ($f in $files) {
  $content = Get-Content $f -Raw -Encoding UTF8
  $updated = $content -replace 'C:/Codex/BrowserBattlegorithms_CODEX/', '../../../'
  [System.IO.File]::WriteAllText((Resolve-Path $f), $updated)
}
```

**Pattern:** literal `C:/Codex/BrowserBattlegorithms_CODEX/` → `../../../`

No backslash variant exists, so no second pass is needed. Post-fix grep confirms.

**Sanity guard:** after substitution, `git grep -E "C:/Codex|C:\\Codex" -- 'reports/**/*.md'` must return nothing.

---

## Pre-substitution link spot-check

Five representative link targets verified to exist:

| Link target | Status |
|---|---|
| `src/ai/blockly/workspace.js` | ✓ exists |
| `src/ui/controls.js` | ✓ exists |
| `docs/ARCHITECTURE.md` | ✓ exists |
| `docs/development/project-sequence-decisions.md` | ✓ exists |
| `docs/development/project-level-map.md` | ✓ exists |
| `reports/development/plan-14-.../version-history-design.md` | ✓ exists |
| `src/assets/styles/style.css` | ✓ exists |
| `tests/browser/guided-play.spec.js` | ✓ exists |
| `tests/browser/persistence.spec.js` | ✓ exists |
| `src/config/levels/phases/advanced-logic/level-23-closest-threat.js` | ✓ exists |
| `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js` | ✓ exists |

No broken link targets found in the pre-substitution spot-check.

---

## Implementation — 2026-05-14

Owner approved file list, prefix mapping, and substitution method. Two pre-flight questions answered:

1. **All variants confirmed:** broader grep on `BrowserBattlegorithms_CODEX` returned identical counts to the forward-slash pattern. No backslash, double-escaped, or URL-encoded variants exist in these files.
2. **Path format:** `../../../` (Option A) approved as correct for markdown relative link resolution. Bare repo-relative paths would be broken as clickable links from nested directories.

**Substitution method used:** Node.js `String.replace` via `node -e`, reading and writing each file with UTF-8 encoding. PowerShell `WriteAllText` was attempted first but failed in the sandbox environment.

**Replacements per file (matches inventory exactly — 176 total):**

| File | Replacements |
|---|---|
| `reports/development/doc-cleanup/blockly-doc-report.md` | 3 |
| `reports/development/doc-cleanup/free-play-doc-report.md` | 20 |
| `reports/development/doc-cleanup/guided-level-doc-report.md` | 20 |
| `reports/development/doc-cleanup/import-export-doc-report.md` | 25 |
| `reports/development/doc-cleanup/npc-and-free-play-cpu-doc-report.md` | 11 |
| `reports/development/doc-cleanup/p5-doc-report.md` | 8 |
| `reports/development/doc-cleanup/turn-engine-doc-report.md` | 16 |
| `reports/development/doc-cleanup/ui-overlays-doc-report.md` | 10 |
| `reports/development/doc-cleanup/usage-export-and-admin-doc-report.md` | 32 |
| `reports/development/plan-07-private-free-play-program-files/progress.md` | 9 |
| `reports/development/plan-09-project-metadata-and-workspace-architecture/progress.md` | 21 |
| `reports/development/plan-14-project-version-history-design/progress.md` | 1 |
| **Total** | **176** |

**Validation:**

| Check | Result |
|---|---|
| Post-fix `git grep -E "BrowserBattlegorithms_CODEX" -- 'reports/**/*.md'` | Exit 1 — zero occurrences ✓ |
| `../../../src/ai/blockly/workspace.js` resolves from doc-cleanup/ | ✓ |
| `../../../src/ui/projectSignifiers.js` resolves from doc-cleanup/ | ✓ |
| `../../../docs/development/plan-07-private-free-play-program-files.md` resolves from plan-07/ | ✓ |
| `../../../index.html` resolves from plan-07/ | ✓ |
| `../../../src/crypto/privateProgramFile.js` resolves from plan-07/ | ✓ |
| `../../../src/config/levels/shared/project.js` resolves from plan-09/ | ✓ |
| `../../../tests/browser/persistence.spec.js` resolves from plan-09/ | ✓ |
| No files outside `reports/` modified by this packet | ✓ |
| `npm test` | 102 pass, 0 fail ✓ (count up from 99 baseline; unrelated to this docs-only packet) |
| `npm run build` | Clean ✓ |

**Broken links found:** None. All spot-checked targets exist.

## Final status: complete
