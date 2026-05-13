# Plan 17 — Documentation Cleanup: Progress Report

## Phase 1 — Inventory and ToC Proposal (read-only)

Status: **complete — awaiting owner approval before any mutations**

---

## 1. Doc inventory: `docs/*.md` (top-level only, excluding `docs/development/`)

| File | Verdict | Rationale |
|---|---|---|
| `docs/ARCHITECTURE.md` | revise | Stale "one Local Storage key per guided level" persistence claim. Phase 8 / Phase 9 narrative sections should be replaced with a subsystem map pointing to `docs/subsystems/`. Otherwise the folder-roles table and team-first runtime sections are still accurate. |
| `docs/GameSpecification.md` | revise | §2.4 describes alternating/randomized runner execution; the engine is deterministic and active-runner-sequential. §5 states "the defender always wins" without the real collision exceptions (map side, flag-carrying state, grace period). The "Implementation Status Note" preamble still says "Phase 8." §8 implies a single XML file flow where three exist. Corrections only — not a rewrite. |
| `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` | keep | Content is current and matches `docs/development/project-level-map.md`. No contradictions found. This is curriculum-facing; leave alone unless Phase 1 surfaces a contradiction (none did). |
| `docs/TESTING.md` | revise lightly | Command names appear current. Missing: a pointer to `tests/regression/` as generated artifacts (not committed fixtures), and a pointer to the `tests/browser/dev-unlock.spec.js` coverage added in Plan 15. One-line additions only. |
| `docs/TeacherGuide.md` | keep with light fixes | Generally current. Confirms guided workspaces save per level, free-play program isolation, and usage export workflow. No structural changes needed; fix any control-name drift found in Phase 4. |
| `docs/StudentGuide.md` | revise lightly | Lists Team 1 jump shortcut as `J` or `F` — needs verification against current `src/` (the report notes this may have drifted). Does not mention private encrypted Free Play program files (Plan 07 artifact). Does not describe usage export. Factual fixes only in Phase 4. |
| `docs/packet-creation-guidance.md` | keep | Active operational doc for the packet workflow. Not in scope for this cleanup. |
| `docs/FRESH_SETUP.md` | keep | Short, accurate, and entirely practical. Node 24 / npm 11 prerequisites match the repo. The Codex-on-Windows note at the bottom is still relevant. No phase narrative. No retirement justification found. |
| `docs/DevelopmentPhases.md` | move-to-history | Phase narrative doc dating from the Phase 1–9 arc. Still accurately describes what was built and when, but is purely historical. `README.md` links to it; that link would be removed in Phase 2. No active packet depends on it. |
| `docs/DevelopmentLog.md` | move-to-history | Chronological change log through 2026-04-06 (Phase 9). No entries after that date; not maintained as a running log. Historical record only. The NPC-and-CPU doc report cites it as one evidence file, but the facts are encoded in the subsystem note, not here. |

---

## 2. Proposed `docs/subsystems/` notes

All seven notes from the plan's recommended set are well-supported by the doc-cleanup reports. No additions or removals proposed.

| File | Scope (one line) |
|---|---|
| `docs/subsystems/blockly-workspace.md` | Workspace lifecycle, per-level and free-play storage keys, ignored vs disabled blocks, warning and execution-hint lifecycle, project-shared workspaces, undo/redo wrapping. |
| `docs/subsystems/ui-mode-contract.md` | `currentModeView` vs `freePlayMode` vs `activeBlocklyTeamTab`, which controls are visible in which mode, mode-aware scoreboard and button text, tutorial-overlay gating. |
| `docs/subsystems/turn-engine.md` | Runtime order of a turn, bounce vs illegal vs skipped action, scoring vs level completion vs round reset, collision rule tree with real exceptions. |
| `docs/subsystems/file-pipelines.md` | The three file flows (workspace XML, private encrypted JSON, usage evidence JSON), which mode shows which control, integrity model contrast. |
| `docs/subsystems/usage-and-admin.md` | Event taxonomy, tracker → IndexedDB → export ladder, analyzer signal-vs-noise philosophy, admin app surface, regression artifacts are generated not committed. |
| `docs/subsystems/npc-and-cpu.md` | Teaching NPC vs free-play CPU split, what is deterministic, where randomness is allowed, shared pathing helper, `state.randomFn` test hook. |
| `docs/subsystems/p5-surface-map.md` | `draw()` is part tick part paint, canvas-adjacent DOM overlays are not p5 features, who owns the canvas surface vs DOM layout. |

---

## 3. Retirement proposal for optional/contextual docs

### `docs/DevelopmentPhases.md` — move to `docs/history/`

Recommendation: **move to `docs/history/`** (create the folder on first move).

Reasoning:
- Purely historical: describes what each numbered phase planned and built, up through Phase 9.
- No active packet or production doc depends on it for runtime contracts.
- `README.md` currently links to it in the "full development history" line; that link is removed when `README.md` is rewritten in Phase 2.
- Moving rather than deleting preserves the record if a future reader wants the arc.
- No active `docs/development/plan-*.md` packet references it as a dependency.

### `docs/DevelopmentLog.md` — move to `docs/history/`

Recommendation: **move to `docs/history/`**.

Reasoning:
- Chronological change log; last entry is 2026-04-06 (Phase 9 productization). Not maintained as a running log.
- The NPC-and-CPU doc report lists it as one evidence source, but the facts it provides will be encoded in `docs/subsystems/npc-and-cpu.md`; no ongoing dependency.
- `README.md` currently links to it; that link is removed in Phase 2.
- Moving preserves history; deleting loses it with no benefit.

### `docs/FRESH_SETUP.md` — keep in place

Recommendation: **keep**.

Reasoning:
- Short (122 lines), entirely practical, and still accurate for the current toolchain (Node 24, npm 11, Playwright).
- No phase narrative; does not need retirement even as the project moves past its original phase arc.
- The Codex-on-Windows note is still relevant for agent-based work.
- `README.md` should link to it in the revised dev-commands section.

---

## 4. Flagged contradictions and concerns

These are surfaced for owner decision before any mutation. None are silently fixed.

### C-1: `ARCHITECTURE.md` — stale persistence claim (HIGH)

`docs/ARCHITECTURE.md` contains the line: *"one Local Storage key per guided level."*

Current reality (from `blockly-doc-report.md` and `src/core/levels.js` as modified by Plan 15): the Blockly workspace subsystem uses multiple namespaced keys (e.g. `bba:guided-workspace:<levelId>`, `bba:free-play-workspace`, `bba:guided-level-progress`, etc.). The single-key claim will mislead any agent reading ARCHITECTURE for the storage contract.

Decision needed: confirm the real key namespace for the Phase 2 ARCHITECTURE revision. The subsystem note should be the single source.

### C-2: `GameSpecification.md §2.4` — runner execution order (HIGH)

The spec describes alternating or randomized runner execution. The turn-engine doc report confirms the engine advances through runners in a deterministic active-runner sequence. These are functionally different descriptions.

Decision needed: Phase 4 will soften or correct §2.4. The spec correction should not change game rules — it should correct the documentation of existing rules. Confirm this is understood as a documentation fix, not a rule change, before Phase 4 proceeds.

### C-3: `GameSpecification.md §5` — collision rule (MEDIUM)

The spec states "the defender always wins" a collision without mentioning the real exceptions: map-side assignment, flag-carrying state, and grace-period behavior documented in the turn-engine report.

Decision needed: Phase 4 will add the exceptions and a link to `docs/subsystems/turn-engine.md`. Owner should confirm the exception list is correct before the edit lands (to avoid silently encoding a wrong rule).

### C-4: `StudentGuide.md` — Team 1 jump shortcut (LOW)

The guide lists the Team 1 jump key as `J` or `F`. This may have drifted. The import-export doc report does not call out a specific key, and the agent has not verified against `src/` directly. This is a low-risk fix but should be verified before the Phase 4 edit.

Decision needed: none urgent. Mark as "verify before Phase 4 edits touch StudentGuide."

### C-5: `docs/FRESH_SETUP.md` — Codex-specific note at bottom (LOW)

The file ends with a "Known Notes For Codex On Windows" section that describes sandbox approval behavior specific to agent-assisted development. This is accurate but mildly unusual in a user-facing setup doc. It is not a contradiction; it is an audience question.

Decision needed: none unless the owner wants it moved or trimmed. Left as `keep` for now.

### C-6: `README.md` links to retirement candidates (INFORMATIONAL)

`README.md` currently links to `docs/DevelopmentPhases.md` and `docs/DevelopmentLog.md`. When those files move to `docs/history/` in Phase 2, the links in `README.md` should be removed (not updated), since the entire long-form history section of `README.md` is being replaced with a short paragraph.

No decision needed — just flagged so Phase 2 does not accidentally orphan the links.

---

## 5. Phase log

| Phase | Status | Notes |
|---|---|---|
| Phase 1 — Inventory and ToC proposal | Complete, approved 2026-05-13 | This document. No mutations made. |
| Phase 2 — README, ARCHITECTURE, retirements | Complete, awaiting owner review | See Phase 2 notes below. |
| Phase 3 — Author subsystem notes | Complete, awaiting owner review | All 7 notes written. First two (103 lines each) approved at checkpoint. Three fixes applied before remaining five. Final five: `turn-engine.md` (102), `file-pipelines.md` (96), `usage-and-admin.md` (117), `npc-and-cpu.md` (117), `p5-surface-map.md` (91). |
| Phase 4 — Targeted correctness fixes | Complete, awaiting owner review | See Phase 4 notes below. |
| Phase 5 — Cross-link audit and validation | Complete | See Phase 5 notes below. |

---

## Phase 5 — Cross-link Audit and Final Validation

### Dead-link grep results

Scoped to `README.md`, `docs/ARCHITECTURE.md`, `docs/development/README.md`, and `docs/subsystems/*.md`.

- `README.md` — no links to retired files. Clean.
- `docs/ARCHITECTURE.md` — no links to retired files. All 7 subsystem notes present in the Subsystem Map table.
- `docs/development/README.md` — no links to retired files. Plan 17 status updated to `complete`.
- `docs/subsystems/*.md` — all cross-links are relative (`./neighbor.md`) within the same folder. All 7 files exist. No broken targets.

One dead-link fixed in Phase 5 (deferred from Phase 2):
- `docs/packet-creation-guidance.md` lines 64-65: `docs/DevelopmentPhases.md` and `docs/DevelopmentLog.md` updated to `docs/history/DevelopmentPhases.md` and `docs/history/DevelopmentLog.md`.

Not touched (per "not touched" list): `docs/development/plan-*.md` packet bodies, including `plan-02` and `plan-17` mentions of the old paths. Those are historical instruction text, not navigable links.

### ARCHITECTURE subsystem coverage

All 7 notes are present in `docs/ARCHITECTURE.md`'s Subsystem Map table: `blockly-workspace`, `ui-mode-contract`, `turn-engine`, `file-pipelines`, `usage-and-admin`, `npc-and-cpu`, `p5-surface-map`. ✓

### Packet index

`docs/development/README.md` lists Plan 17 with status `complete`. ✓

### Validation commands

- `npm test` — 98 tests, 0 failures. ✓
- `npm run build` — build succeeds. Chunk-size warnings are pre-existing (known, not introduced by this packet). ✓
- `src/` and `tests/` — 0 files modified (confirmed via `git diff --name-only HEAD src/ tests/`). ✓

### Full file manifest for Plan 17

**New files:**
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/history/DevelopmentPhases.md` (moved from `docs/`)
- `docs/history/DevelopmentLog.md` (moved from `docs/`)
- `reports/development/plan-17-doc-cleanup/progress.md`

**Revised:**
- `README.md` — stripped phase-era framing; under 40 lines.
- `docs/ARCHITECTURE.md` — four new folder roles; Phase 8/9 sections replaced with Subsystem Map table.
- `docs/GameSpecification.md` — preamble replaced; §2.4 execution order corrected; §5 collision rule corrected; §8 file pipeline pointer added.
- `docs/TESTING.md` — two browser coverage items added; Regression Harness section added.
- `docs/StudentGuide.md` — jump key corrected; private export and usage export noted.
- `docs/subsystems/blockly-workspace.md` — three scope fixes applied at Phase 3 checkpoint.
- `docs/subsystems/ui-mode-contract.md` — two prose fixes applied at Phase 3 checkpoint.
- `docs/subsystems/turn-engine.md` — collision sentence corrected in Phase 4 to reflect hardcoded team-number mapping and surface Free Play discrepancy.
- `docs/packet-creation-guidance.md` — two stale paths updated to `docs/history/`.
- `docs/development/README.md` — Plan 17 status updated through phases.

**Not changed:** `docs/TeacherGuide.md`, `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`, `docs/FRESH_SETUP.md`, `docs/development/plan-*.md` bodies, `src/`, `tests/`.

### Contracts surfaced for owner follow-up

- **Collision resolver Free Play discrepancy** (surfaced in Phase 4): `src/core/collisions.js` uses a hardcoded team-number-to-map-side mapping that does not read runtime `homeSide` from team config. In Free Play, when Team 1 is randomized to the right side, the defender assignment is inverted. A separate task has been spawned for the source fix.

---

## Phase 4 — Changes Made

### Source verification: collision rule (C-3 / Phase 3 note)

`src/core/collisions.js` line 4: `const mapSideDefenderTeam = collisionX < COLS / 2 ? 1 : 2;`

This is a **hardcoded team-number assignment** — Team 1 = left half, Team 2 = right half — and does not read the runtime team config's `homeSide` field.

`src/core/teams.js` line 264: `const playerDirection = resolvedRandomFn() < 0.5 ? 1 : -1;`

In Free Play, the player (Team 1) is assigned a random `playDirection`, which means Team 1's `homeSide` can be "right." The runtime `homeSide` (derived via `deriveHomeSideFromPlayDirection`) and the `isOnHomeSide()` function (lines 357-364) correctly use the runtime config. But `collisions.js` ignores it.

**Assessment:** This is a genuine discrepancy between the collision resolution logic and the team-first runtime contract. For all guided levels (Team 1 always plays left-to-right), the collision rule is correct. In Free Play when Team 1 is randomized to the right side, the map-side defender assignment in `collisions.js` is inverted relative to Team 1's actual home side.

**Action taken (docs only — source fix is out of scope for this packet):**
- `docs/subsystems/turn-engine.md` sentence updated to accurately describe what the code does and note that it does not use runtime team config, with a reference to this report.
- `docs/GameSpecification.md §5` now correctly names the collision priority rules without overstating the Free Play guarantee.

**Owner decision needed:** Whether to fix `collisions.js` to use `isOnHomeSide(state, runner)` from `teams.js` rather than the hardcoded team-number comparison. This is a source change; deferred.

### Files changed in Phase 4

- `docs/subsystems/turn-engine.md` — Collision section sentence corrected to describe hardcoded team-number mapping and note the Free Play discrepancy.
- `docs/GameSpecification.md` — Four targeted edits:
  1. Preamble: "Implementation Status Note" replaced with a two-sentence pointer to `docs/subsystems/`.
  2. §2.4: Alternating/randomized turn order replaced with deterministic active-runner sequence, with link to `turn-engine.md`.
  3. §5: Full rewrite — "defender always wins" replaced with accurate priority table (flag-carrying override, map-side default, grace period), with link to `turn-engine.md`. Stale "frozen runner automatically loses" clause removed.
  4. §8 Saving/Loading: Single-flow XML description replaced with three-pipeline pointer to `file-pipelines.md`.
- `docs/TESTING.md` — Two additions:
  1. Browser tests list: added usage export/admin and dev-unlock coverage items.
  2. New "Regression Harness" section: one-paragraph pointer to `tests/regression/` as generated artifacts, link to `usage-and-admin.md`.
- `docs/StudentGuide.md` — Three fixes:
  1. Team 1 jump key: `J` or `F` → `F` only (verified against `src/config/keybindings.js`: `JUMP: "f"`).
  2. Saving and Sharing section: added private export note (Free Play only, password-protected).
  3. Saving and Sharing section: added usage export note (teacher review).
- `docs/TeacherGuide.md` — No changes. Reviewed; content is accurate and current.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — No changes per Phase 1 inventory (no contradictions found).

### Validation

`npm test` passed (0 failures) after all Phase 4 edits.

---

## Phase 2 — Changes Made

### Files mutated

- `README.md` — rewritten. Stripped "Phase 8 expansion" framing and long current-state bullet list. Kept: one-paragraph description, dev/build commands, dev-server port note, short links section (now includes FRESH_SETUP.md and Development Packet Index). Under 40 lines.
- `docs/ARCHITECTURE.md` — updated. Added four missing `src/` folder roles (`usage/`, `admin/`, `crypto/`, `startup/`). Replaced `## Phase 8 Additions` and `## Phase 9 Free Play Productization` sections with `## Subsystem Map` table. The stale "one Local Storage key per guided level" claim was in the Phase 8 section and is now gone. `## Team-First Runtime` and `## Setup Pipeline` are untouched.
- `docs/development/README.md` — Plan 17 status updated from `ready` to `in progress`.

### Files retired (git mv)

- `docs/DevelopmentPhases.md` → `docs/history/DevelopmentPhases.md`
- `docs/DevelopmentLog.md` → `docs/history/DevelopmentLog.md`

`docs/history/` created as a side-effect of the first move. No links from `README.md` or `ARCHITECTURE.md` point to the history folder.

### Stale reference deferred to Phase 5 cross-link audit

`docs/packet-creation-guidance.md` lines 64-65 list `docs/DevelopmentPhases.md` and `docs/DevelopmentLog.md` under a "Current phase tracking" bullet. Those paths are now stale. Plan 17's "not touched" list does not explicitly exclude `packet-creation-guidance.md`, but Phase 2's scope only covers `README.md`, `ARCHITECTURE.md`, retirements, and `docs/development/README.md`. This fix is deferred to Phase 5's grep-based cross-link audit rather than expanding Phase 2's scope.
