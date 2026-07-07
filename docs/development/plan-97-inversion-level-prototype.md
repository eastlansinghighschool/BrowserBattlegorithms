---
id: plan-97-inversion-level-prototype
title: "Inversion Level Prototype"
status: draft
depends_on: [plan-85-campaign-rewrite-charter]
gate: "before mutation; owner must select prototype placement and interaction shape"
superseded_by: null
resolution: null
summary: >-
  Prototype a small "read the program, choose/predict the board" inversion level if the owner selects placement and interaction shape.
---
# Plan 97: Inversion Level Prototype

- Packet id: Plan 97
- Packet title: Inversion Level Prototype
- Status: (see frontmatter)
- Owner/model: curriculum interaction prototype agent
- Date: 2026-07-06
- Packet type: prototype / curriculum / UI
- Mutation level: source-code/tests/docs only after owner gate
- Approval gate: before mutation; owner must select prototype placement and interaction shape
- Expected artifacts:
  - one bounded inversion-level prototype or a design report if implementation is not yet safe
  - tests for the interaction shape if implemented
  - progress report
- Progress report folder: `reports/development/plan-97-inversion-level-prototype/`
- Progress report file: `reports/development/plan-97-inversion-level-prototype/progress.md`

## Packet Summary

Goal: Explore a "read the program, choose the board/perturbation" inversion level where students reason from code to behavior instead of only writing code for a fixed board.

Non-goals:
- Do not add a full new level family.
- Do not renumber the campaign.
- Do not implement without owner-selected placement.
- Do not make this a required campaign gate unless separately approved.

Depends on:
- Plan 85 acceptance.
- Existing prediction/choice interaction code, if any.
- Owner decision on where the prototype belongs.

Blocks:
- A later decision about whether inversion levels become optional labs, challenge previews, or film-review follow-ups.

Why this packet exists:
The guided campaign mostly asks students to write a program for a board. AP CSA and debugging also require reading a program and predicting behavior. A small inversion prototype could strengthen transfer without bloating every guided level.

## Authority And Contracts

Required project contracts:
- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- Existing prediction/choice level code and subsystem docs.
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`

Do not redefine:
- Guided mode's primary concept sequencing.
- Blockly one-action-per-turn semantics.
- Static Vite deployment.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85 deferred future-directions note.
- Current prediction/choice level source, located via `rg "prediction|choice|locked" src/config/levels src/ui`.
- Relevant Blockly subsystem docs.

## Scope

### In Scope

- Produce either:
  - one prototype level/interaction in an optional or owner-approved location, or
  - a design report explaining why implementation should wait.
- Reuse existing choice/prediction mechanics where possible.
- Keep the prototype small and testable.

### Out Of Scope

- Campaign-wide inversion system.
- New server/storage behavior.
- Rewriting existing challenge structure.

## Implementation Requirements

### 1. Owner Placement Gate

Required behavior:
- Owner must choose where the prototype lives before implementation.

### 2. Locked Program

Required behavior:
- Student sees a fixed program and must choose/predict which board perturbation succeeds or fails.

Constraints:
- Do not let the student edit the locked program unless the interaction explicitly supports a later reflection step.

### 3. AP CSA Transfer

Required behavior:
- The prototype should make control-flow prediction legible: conditions, first action reached, or resource readiness.

## Work Plan

1. Confirm owner-selected placement and interaction shape.
2. Inspect existing prediction/choice code.
3. Decide whether to implement or produce a design report.
4. If implementing, add one prototype plus tests.
5. Run targeted validation and write progress report.

## Commands

Run from the repository root if implementation occurs:

```powershell
npm test
npm run build
npm run lint:levels
```

## Validation Checklist

- [ ] Owner placement decision recorded.
- [ ] Prototype is optional or explicitly approved as required.
- [ ] Locked-program behavior is clear.
- [ ] Tests cover the interaction.
- [ ] No campaign renumbering occurred.

## Stop Conditions

- Owner has not selected placement.
- Existing prediction/choice code cannot support the prototype without broad UI work.
- The prototype would confuse rather than clarify one-action-per-turn semantics.
