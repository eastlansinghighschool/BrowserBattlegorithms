---
id: plan-95-phase-copy-rewrites
title: "Phase Copy Rewrites"
status: draft
depends_on: [plan-85-campaign-rewrite-charter, plan-94-copy-voice-contract-lint-warnings]
gate: "before each phase rewrite lands"
superseded_by: null
resolution: null
summary: >-
  Rewrite student-facing guided copy one phase at a time after each phase's board behavior is settled, preserving teacher-facing pedagogy and avoiding solution reveals.
---
# Plan 95: Phase Copy Rewrites

- Packet id: Plan 95
- Packet title: Phase Copy Rewrites
- Status: (see frontmatter)
- Owner/model: curriculum-copy agent with owner approval gates
- Date: 2026-07-06
- Packet type: curriculum copy / docs / level data
- Mutation level: level copy/docs; no runtime source unless explicitly authorized
- Approval gate: before each phase rewrite lands
- Expected artifacts:
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
- Do not change level mechanics, toolboxes, win conditions, or fixtures unless a separate implementation packet authorizes it.
- Do not reveal exact solutions in copy.
- Do not remove teacher-facing pedagogy; move it to teacher docs if needed.

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
- Plan 85.
- Plan 94.
- All target phase level files.
- Matching dossiers and behavior evidence for the target phase.
- Relevant TeacherGuide section.

Use `rg` for target level ids and:
- `objective`
- `intro`
- `tip`
- `tutorial`
- `demo`

## Scope

### In Scope

- Rewrite only the owner-selected phase's student-facing copy.
- Update TeacherGuide if pedagogy text is removed from student copy and has no durable teacher-facing home.
- Run lint/voice checks.
- Note any copy that cannot be rewritten honestly because board behavior is unsettled.

### Out Of Scope

- Board changes.
- Fixture changes.
- New hint UI.
- Whole-campaign copy sweep.

## Implementation Requirements

### 1. Phase Selection Gate

Required behavior:
- The owner must name the phase before implementation begins.
- The progress report must record the selected phase.

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

## Work Plan

1. Confirm owner-selected phase and prerequisite board changes.
2. Read target levels and evidence.
3. Draft copy changes.
4. Run lint/voice checks.
5. Stop for owner review before landing if copy tone is uncertain.
6. Write progress report.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
npm test
```

If only docs/level-copy changed and the repo has a focused level lint command, run that first.

## Validation Checklist

- [ ] Owner-selected phase is recorded.
- [ ] Only selected phase copy changed.
- [ ] Student copy uses in-world voice and avoids banned/meta phrases.
- [ ] Teacher-facing pedagogy was preserved where needed.
- [ ] Lint/voice checks run.
- [ ] No mechanics changed.

## Stop Conditions

- Owner has not selected a phase.
- Board behavior for the selected phase is unsettled.
- Copy rewrite would require changing mechanics to be honest.
- Voice judgment is uncertain enough to need owner review.
