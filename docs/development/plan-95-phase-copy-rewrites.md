---
id: plan-95-phase-copy-rewrites
title: "Phase Copy Rewrites"
status: ready
depends_on: [plan-85-campaign-rewrite-charter, plan-94-copy-voice-contract-lint-warnings]
gate: "before each phase rewrite lands"
summary: >-
  Rewrite student-facing guided copy one phase at a time after each phase's board behavior is settled, into the Plan 85 in-world scout/coach voice. First deliverable is a durable copy-digest generator (all level voice in one phase-grouped artifact, with lint hits and board context) that serves every phase dispatch, orchestration review, and future voice-aware plans. Each phase dispatch has a concrete floor — clear the Plan 94 copy-voice lint warnings for that phase (re-lint to zero or explicitly waive) — and a ceiling: a genuine voice pass over the phase's copy, not just silencing flagged lines. Voice-only rewrites are permitted in protected levels (S12 protects the lesson, not the prose); mechanics stay frozen. Recommended first phase: resources-and-territory, whose boards just settled (Plans 93/103).
---
# Plan 95: Phase Copy Rewrites

- Packet id: Plan 95
- Packet title: Phase Copy Rewrites
- Status: (see frontmatter)
- Owner/model: curriculum-copy agent with owner approval gates
- Date: 2026-07-06
- Packet type: curriculum copy / docs / level data
- Mutation level: level copy/docs; one new read-only reporting script + npm alias; no runtime/gameplay source unless explicitly authorized
- Approval gate: before each phase rewrite lands
- Expected artifacts:
  - a durable copy-digest generator (`scripts/level-copy-digest.js` + `level:copy-digest` npm alias) and its generated markdown output — built once, before the first phase rewrite (see §Copy Digest Generator)
  - rewritten student-facing copy for the owner-selected phase
  - teacher-facing pedagogy moved or preserved in teacher docs as needed
  - lint/voice validation
  - progress report
- Progress report folder: `reports/development/plan-95-phase-copy-rewrites/`
- Progress report file: `reports/development/plan-95-phase-copy-rewrites/progress.md`

## Packet Summary

Goal: Rewrite student-facing guided-level copy one phase at a time into the Plan 85 in-world scout/coach voice, after that phase's board behavior is settled.

Non-goals:
- Do not rewrite the whole campaign in one pass.
- Do not change level mechanics, toolboxes, win conditions, fixtures, board layout, or NPC/tier config unless a separate implementation packet authorizes it. This holds **especially for protected levels** — see the protected-level policy below. A copy edit that changes any of these bounces back as out of scope.
- Do not reveal exact solutions in copy.
- Do not remove teacher-facing pedagogy; move it to teacher docs if needed.
- **Do not invent new claims to fill space.** When re-voicing, say what is true about the level as it actually plays now; do not add tactical hints, backstory, or mechanic descriptions that were not there. Prefer deleting a pure-meta line ("this level teaches X", "this is a good level for Y") outright over inflating it into in-world prose — see the delete-vs-rewrite discipline below.
- Do not silence a copy-voice lint warning by any means other than an honest rewrite or deletion (no keyword-dodging paraphrases that keep the meta-narration in spirit).

Depends on:
- Plan 85 accepted.
- Plan 94 complete.
- The target phase's board/level changes complete, if any.
- Owner selection of the phase to rewrite.

Blocks:
- Cohesive student experience after living-board edits.

Why this packet exists:
Copy needs to describe the board students actually see. If copy is rewritten before board changes, it will either fossilize stale assumptions or overpromise future behavior. This packet is intentionally phase-scoped and owner-gated because voice and classroom fit are taste-sensitive.

## Authority And Contracts

Required project contracts:
- Plan 85 S4 and S5.
- Plan 94 voice/lint docs.
- Target phase level source.
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`

Do not redefine:
- Guided levels teach one primary concept unless marked synthesis/challenge.
- Demo Blockly shows structure, not exact solution.
- Teacher docs may speak explicitly about pedagogy; student mission copy should not.

## Required Reading

Before each phase rewrite, read:
- This packet end-to-end.
- Plan 85 (S4 prose economy, S5 voice contract).
- Plan 94 and **`docs/CopyVoiceContract.md`** — the authored voice rules, acceptable/unacceptable examples, and the phrase/length lint contracts you must satisfy.
- All target phase level files.
- Matching dossiers and behavior evidence for the target phase.
- Relevant TeacherGuide section.

Regenerate the live worklist before starting a phase (the hardcoded list below is a snapshot and may drift as boards/copy change):

```powershell
npm run lint:levels
```

Filter the output to `copy-voice-banned-phrase`, `copy-voice-spoiler-phrase`, and `copy-voice-prose-length` for the target phase's level ids — those are the floor targets.

Use `rg` for target level ids and:
- `objective`
- `intro`
- `tip`
- `tutorial`
- `demo`

## Scope

### In Scope

- Build the copy-digest generator (once, first — see §Copy Digest Generator) and wire its npm alias.
- Rewrite only the owner-selected phase's student-facing copy.
- Update TeacherGuide if pedagogy text is removed from student copy and has no durable teacher-facing home.
- Run lint/voice checks.
- Note any copy that cannot be rewritten honestly because board behavior is unsettled.

### Out Of Scope

- Board changes.
- Fixture changes.
- New hint UI.
- Whole-campaign copy sweep (the digest generator may read the whole campaign, but copy *rewrites* stay one phase at a time).
- Gameplay/runtime source changes (the digest generator is read-only reporting, not gameplay logic).

## Copy Digest Generator (first deliverable — build before any phase rewrite)

Build a small, read-only generator that consolidates every guided level's student-facing copy into one reviewable artifact. This is durable project tooling, not a throwaway reviewer aid: it serves this packet's every phase dispatch, orchestration review of each rewrite, and any future plan that needs to see level voice at a glance (e.g. stars/par copy, later voice audits).

Why it exists: for a voice pass, raw level source is the wrong granularity — copy is a handful of short prose fields buried in mechanics, setup, and win conditions. The dossiers already extract per-level copy, but reviewing voice *consistency* across a phase means reading one file, not forty. This tool is that one file.

Required shape:
- Script `scripts/level-copy-digest.js` with an npm alias `level:copy-digest`, matching the existing `level:dossiers` / `level:behavior-evidence` convention.
- Generated from `getLevelDefinitions()` — the single source of truth. **Reuse the dossier's copy-extraction logic where practical; never hand-maintain the output.** A hand-curated "all the copy" doc is explicitly *not* what this is: it would become a second source of truth that lies the moment a level changes.
- Emits one markdown file, grouped by phase, in the generated-reports area (alongside dossiers/behavior evidence). Per level, in phase order:
  - id, title, phase, source path;
  - the copy fields verbatim: `description`, `introText`, each `tips[]` entry, each `tutorialSteps[].body`;
  - the current copy-voice lint hits for that level inline (banned / spoiler / prose-length), so the reviewer sees debt in context;
  - a one-line board summary — win condition, live vs frozen opponent count, `boardDynamicsTier` — so a reader can catch copy that is now *factually* wrong about the board (e.g. a tip describing a frozen enemy that is now a live Sentry). This board line is the reason the digest supplements rather than replaces source review for factual accuracy.
- Idempotent and regenerable; add it to whatever level-report regeneration set the repo uses.

Use it: regenerate before starting a phase (read the phase's voice in one pass) and after (review the rewrite and confirm the phase's copy-voice hits cleared). It replaces reading raw level source *for voice review*; source stays authoritative for mechanics/board review.

## Known Copy-Voice Worklist (Plan 94 lint snapshot, 2026-07-08)

These are the current copy-voice lint hits, grouped by phase. This is the **floor** for each phase (every one of its hits must clear or be waived), not the ceiling (the phase's copy gets a genuine voice pass regardless). Re-run `npm run lint:levels` to confirm the live list before starting — it will shrink as phases are done and could shift if boards change.

| Phase | Level | Hit | Note |
|---|---|---|---|
| foundations | `mirror-forward` | banned: "this level teaches" (tips) | **Protected level** — voice-only, mechanics frozen |
| sensing | `watch-the-wall` | banned: "beginner-friendly" (tips) | |
| resources-and-territory | `jump-if-ready` | banned: "this level teaches" (tutorialStep) | the line Plan 93 kept when it deleted the wall clause |
| resources-and-territory | `stay-still-can-do-something` | banned: "this is a good level for" (tips) | |
| resources-and-territory | `my-side-their-side` | banned: "this level teaches" (introText) | Plan 103 left this as a voice issue for here |
| advanced-logic | `how-far-away` | prose-length: introText 39w | |
| advanced-logic | `flip-the-answer` | prose-length: introText 45w | |
| advanced-teamplay | `one-program-two-allies` | prose-length: introText 50w | |
| advanced-teamplay | `barrier-specialist` | prose-length: introText 47w | |
| advanced-teamplay | `jump-team` | prose-length: introText 36w | |
| optional | `optional-double-carrier-showdown` | prose-length: introText 55w | |

**Board-settledness gate (charter S5 sequencing).** Only rewrite a phase whose board behavior is settled — copy must describe the board students actually see. `resources-and-territory` (settled by Plans 93/103) and `movement-helpers` (settled by Plan 92) are settled and are the safe first candidates; **resources-and-territory is recommended first** (freshly settled, three hits including the two this campaign just touched). For phases with no pending living-board packet (e.g. static foundations/sensing levels that will not receive board changes), the board is settled by default and their copy is safe to rewrite. If a phase has a living-board uplift still pending, defer its copy until that lands.

## Implementation Requirements

### 1. Phase Selection Gate

Required behavior:
- The owner must name the phase before implementation begins (recommended default: `resources-and-territory`).
- The progress report must record the selected phase and confirm its board is settled (no pending living-board packet).

### 2. In-World Voice

Required behavior:
- Copy should sound like a scout/coach describing the mission, not a curriculum designer naming standards.
- Pre-play copy should be short and non-spoiling.

Constraints:
- Do not state exact solution logic before play.
- Do not use banned phrases from Plan 94.

### 3. Teacher-Facing Preservation

Required behavior:
- If useful pedagogy is removed from student-facing copy, preserve it in teacher docs if not already present.

Constraints:
- Avoid duplicating long level-by-level TeacherGuide prose unless necessary.

### 4. Protected-Level Policy (owner-decided 2026-07-08)

Required behavior:
- **Voice-only rewrites ARE permitted in protected levels** (charter S12). S12 protects the *lesson* — win condition, mechanics, toolbox, difficulty/turn budget, and demo-Blockly structure. It does **not** protect the surface prose. A banned meta phrase is a voice defect regardless of protection, and the early foundational levels (where the protected ones cluster, e.g. `mirror-forward`) are exactly where voice matters most to students.

Constraints:
- A voice edit in a protected level that touches any protected element (win condition, mechanics, toolbox, turn limit, demo structure) is out of scope and must bounce back. If re-voicing a line seems to require a mechanic change to stay honest, stop and surface — do not change the mechanic.
- Confirm in the progress report, per protected level touched, that only prose changed (diff the level file; the non-prose fields must be byte-identical).

### 5. Delete-vs-Rewrite Discipline

Required behavior:
- **Pure-meta lines** — text whose only content is naming the level as a lesson ("this level teaches X", "this is a good level for Y", "this is your first Z lesson") — should be **deleted**, not inflated into in-world prose, unless they carry real in-world guidance worth re-voicing.
- **Lines with real content in a bad voice** — a genuine hint or orientation wrapped in meta/AI phrasing — should be **re-voiced** to the scout/coach voice, preserving the true information.
- Over-length prose (`copy-voice-prose-length`) should be **tightened** to under the cap by cutting, not by splitting the same wordcount across more fields.

Constraints:
- Never invent tactical content, backstory, or mechanic description to replace deleted meta (repeat of the non-goal — stated here as the operative rule during rewriting).
- If deleting a line would leave a tutorial step or tip empty/pointless, delete the whole step/tip rather than backfilling filler.

### 6. Re-Lint-To-Zero Exit Criterion

Required behavior:
- After the phase rewrite, `npm run lint:levels` must show **zero** `copy-voice-banned-phrase`, `copy-voice-spoiler-phrase`, and `copy-voice-prose-length` warnings for the selected phase's levels.
- Any warning deliberately left standing (e.g. a phrase that is genuinely in-world despite matching the substring) must be explicitly listed and justified in the progress report as a waiver — not silently ignored.

Constraints:
- The three copy-voice rules are non-blocking warnings by design; "lint exit 0" is NOT the success signal (it is always 0). The signal is zero copy-voice warnings for the phase, or an itemized waiver.
- Do not edit the lint rules or the banned/spoiler lists to make warnings disappear — that is a Plan 94 change, not a copy rewrite.

## Work Plan

1. On the first phase dispatch, build the copy-digest generator (§Copy Digest Generator) and its npm alias. On every dispatch, regenerate the digest.
2. Confirm owner-selected phase and that its board is settled (no pending living-board packet).
3. Read the selected phase's section of the digest, plus `docs/CopyVoiceContract.md`; regenerate the live copy-voice worklist for the phase via `npm run lint:levels`.
4. Draft copy changes, applying the delete-vs-rewrite discipline (§5) and the protected-level policy (§4) where relevant.
5. Re-run `npm run lint:levels` and regenerate the digest; confirm zero copy-voice warnings for the phase (§6) or record itemized waivers.
6. Stop for owner review before landing if copy tone is uncertain.
7. Write progress report: selected phase, board-settledness confirmation, per-protected-level prose-only diff confirmation, and the before/after copy-voice warning counts.

## Commands

Run from the repository root:

```powershell
npm run level:copy-digest
npm run lint:levels
npm test
```

If only docs/level-copy changed and the repo has a focused level lint command, run that first.

## Validation Checklist

- [ ] Copy-digest generator built (first dispatch), generated from `getLevelDefinitions()`, idempotent/regenerable, with the required per-level content (copy fields + inline lint hits + one-line board summary).
- [ ] Owner-selected phase is recorded, and its board is confirmed settled.
- [ ] Only selected phase copy changed (no other phase, no non-copy fields); the digest generator is read-only (no gameplay source touched).
- [ ] Student copy uses in-world voice and avoids banned/meta phrases.
- [ ] `npm run lint:levels` shows zero copy-voice warnings for the phase, or every remaining one is an itemized, justified waiver (§6).
- [ ] Protected levels touched: prose-only diff confirmed (win condition / mechanics / toolbox / turn limit / demo structure byte-identical) (§4).
- [ ] Pure-meta lines deleted, not inflated; no invented claims (§5).
- [ ] Teacher-facing pedagogy was preserved where needed.
- [ ] No mechanics, board, fixtures, or tier config changed; `npm test` passes.

## Stop Conditions

- Owner has not selected a phase.
- Board behavior for the selected phase is unsettled.
- Copy rewrite would require changing mechanics to be honest.
- Voice judgment is uncertain enough to need owner review.
