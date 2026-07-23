---
id: plan-96
title: "Stars And Par V1 Implementation"
status: superseded
depends_on: [plan-85, plan-86, plan-91, plan-106, plan-110]
gate: "before mutation; likely split into smaller packets after prerequisite evidence is reviewed"
superseded_by: plan-111
resolution: "Split per its own mandated reassessment into plan-111 (evaluation core + tracker population), plan-112 (display UI), plan-113 (campaign-wide par/mastery authoring). Non-goals, closed vocabulary, protected-level rules, and stop conditions carried into the successors."
summary: >-
  Implement Plan 85's stars/par mastery layer after par evidence, tracker semantics, and owner gate settle; packet explicitly requires reassessing whether to split by subsystem.
---
# Plan 96: Stars And Par V1 Implementation

- Packet id: Plan 96
- Packet title: Stars And Par V1 Implementation
- Status: (see frontmatter)
- Owner/model: frontend/runtime implementation agent after design gate
- Date: 2026-07-06
- Packet type: implementation / UI / usage tracking
- Mutation level: source-code, tests, docs
- Approval gate: before mutation; likely split into smaller packets after prerequisite evidence is reviewed
- Expected artifacts:
  - v1 star/par data model
  - visible per-level completion star UI
  - usage-tracker fields for pass/par/mastery outcomes
  - tests
  - progress report
- Progress report folder: `reports/development/plan-96-stars-par-v1-implementation/`
- Progress report file: `reports/development/plan-96-stars-par-v1-implementation/progress.md`

## Packet Summary

Goal: Implement a first version of Plan 85's stars/par mastery layer after par-candidate evidence and Usage Tracker V2 semantics are settled.

Non-goals:
- Do not implement before Plan 86 par candidates and Plan 91 tracker amendment are complete.
- Do not invent star criteria outside Plan 85's closed vocabulary.
- Do not turn stars into grades or semester-specific targets.
- Do not use block-budget as the default mastery criterion.
- Do not add server storage.

Depends on:
- Plan 85 accepted, especially S6.
- Plan 86 complete with par-candidate artifact.
- Plan 91 complete.
- Usage Tracker V2 schema foundation complete: plan-106 (durable ledger + schema v2 core) and plan-110 (rewrite-aware fields receptacle, which owns the star-outcome field slots). The full V2 chain is plans 106-110; only 106 and 110 gate this packet's star-field slice.

Blocks:
- Durable mastery feedback and usage analysis for rewritten levels.

Why this packet exists:
A pass/fail floor is not enough once levels become richer. Stars can reward efficient, intentional, and concept-centered solutions without making first success inaccessible. But stars touch UI, usage tracking, level data, and pedagogy, so this packet is intentionally draft until the prerequisite contracts settle.

## Authority And Contracts

Required project contracts:
- Plan 85 S6.
- Plan 86 par-candidate artifact.
- Plan 91 tracker amendment.
- Usage Tracker V2 implementation state.
- `docs/GameSpecification.md`
- `docs/subsystems/usage-tracking.md` if present.
- `src/ui/`
- `src/usage/`

Do not redefine:
- Passing a level remains the accessible floor.
- Stars are feedback/mastery signals, not hidden grading targets.
- Static Vite deployment.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85.
- Plan 86 progress report and par-candidate artifact.
- Plan 91.
- Current Usage Tracker V2 implementation packets/reports.
- Relevant UI and usage subsystem docs.

Use `rg` for:
- `levelResult`
- `usage`
- `guided`
- `star`
- `par`
- `mastery`

## Scope

### In Scope

- Define a v1 level-data shape for par/mastery criteria.
- Implement display of earned stars in guided UI and admin/usage exports if appropriate.
- Record pass/par/mastery outcomes in usage data.
- Add tests for star evaluation and v1 back-compat.

### Out Of Scope

- Rebalancing every level's par values manually.
- Adding new grading dashboards.
- Server persistence.
- Changing pass/fail win conditions.

## Implementation Requirements

### 1. Split Check

Required behavior:
- Before implementation, reassess whether this packet should be split into smaller packets:
  - data model
  - UI display
  - usage export/admin
  - per-level criteria authoring

Constraints:
- If more than one subsystem must change substantially, stop and propose a split instead of bulldozing.

### 2. Star Evaluation

Required behavior:
- Star 1: pass.
- Star 2: beat authored generous par.
- Star 3: meet authored criterion from the closed vocabulary.

Constraints:
- Fully protected levels may remain pass-star-only.
- Old exports and levels without star metadata must still work.

### 3. Teacher/Student Meaning

Required behavior:
- UI language should present stars as mastery/iteration goals, not grades.

Constraints:
- Avoid shame-y copy or hidden requirements.

## Work Plan

1. Confirm prerequisites and decide whether to split.
2. If not split, implement data model and evaluator first.
3. Add focused tests.
4. Add UI display.
5. Wire usage fields/back-compat.
6. Run targeted and broad validation.
7. Write progress report.

## Commands

Run from the repository root:

```powershell
npm test
npm run build
npm run test:browser:smoke
```

Run any focused usage/UI tests added by prior tracker packets.

## Validation Checklist

- [ ] Packet was split if scope proved too broad.
- [ ] Star evaluator respects Plan 85 closed vocabulary.
- [ ] Fully protected levels can remain pass-star-only.
- [ ] Old levels/exports remain compatible.
- [ ] Student-facing copy treats stars as mastery feedback.
- [ ] Tests and build pass.

## Stop Conditions

- Usage Tracker V2 implementation is not ready to receive star fields.
- Par-candidate data is missing or unreliable.
- UI/usage/data model scope is too large for one packet.
- A proposed criterion would require subjective judgment at runtime.
