---
id: plan-93-pre-challenge-22-living-resource-uplift
title: "Pre-Challenge 22 Living Resource Uplift"
status: draft
depends_on: [plan-85-campaign-rewrite-charter, plan-86-dynamic-board-evidence-upgrade, plan-92-pre-challenge-15-living-board-pilot]
gate: "before mutation; do not run until Plan 92 pilot review is accepted or the owner explicitly skips the pilot dependency"
superseded_by: null
resolution: null
summary: >-
  Living-board-aware replacement for Plan 77's pre-Challenge-22 resource/territory uplift, preserving compound-condition intent while waiting for pilot evidence and owner target confirmation.
---
# Plan 93: Pre-Challenge 22 Living Resource Uplift

- Packet id: Plan 93
- Packet title: Pre-Challenge 22 Living Resource Uplift
- Status: (see frontmatter)
- Owner/model: level-editing specialist after pilot review
- Date: 2026-07-06
- Packet type: implementation / curriculum / level-editing
- Mutation level: source-code, tests, generated evidence, docs
- Approval gate: before mutation; do not run until Plan 92 pilot review is accepted or the owner explicitly skips the pilot dependency
- Expected artifacts:
  - living-board-aware replacement for superseded Plan 77
  - revised level source and fixtures for approved target levels
  - old-trivial-solution failure evidence
  - regenerated dossiers and behavior evidence
  - focused readiness/lint tests
  - progress report
- Progress report folder: `reports/development/plan-93-pre-challenge-22-living-resource-uplift/`
- Progress report file: `reports/development/plan-93-pre-challenge-22-living-resource-uplift/progress.md`

## Packet Summary

Goal: Replace superseded Plan 77 with a living-board-aware uplift that rehearses compound resource/territory reasoning before Challenge 22 without relying on frozen-board assumptions.

Non-goals:
- Do not implement superseded Plan 77 as written.
- Do not touch Challenge 22 itself unless the owner explicitly authorizes calibration after the uplift.
- Do not change Strategy Brain or project levels.
- Do not introduce Advanced boolean operators earlier than intended.
- Do not run before pilot findings are reviewed unless the owner explicitly accepts the risk.

Depends on:
- Plan 85 accepted.
- Plan 86 complete.
- Plan 92 complete and reviewed, unless owner waives.
- Plan 91 complete if usage fields are touched.
- Plan 94 complete if copy lint/voice rules are required before copy changes.

Blocks:
- Any future `bughunt-22` recalibration (bug-hunt variety work from the Plan 75/76 audits, not yet a packet) if it depends on the new resource-readiness ramp. (Not Plan 78 — that packet is runtime bug repair and does not touch bug-hunt levels.)
- Any Challenge 22 follow-up calibration.

Why this packet exists:
All Plan 76 synthesis models agreed that the largest non-project cliff sits before Challenge 22. Plan 77 captured the right intuition, but it assumed frozen boards and single-level tweaks. Plan 85 keeps the compound-condition goal but requires the fix to fit living boards, protected-level rules, and evidence from the pre-Challenge-15 pilot.

## Authority And Contracts

Required project contracts:
- Plan 85.
- Superseded Plan 77 as raw material, not as executable authority.
- Plan 92 progress report and pilot evidence.
- Plan 86 evidence.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`

Do not redefine:
- Guided mode still introduces one primary concept at a time.
- Compound practice combines a new idea with a prior skill; it must not become a hidden second new concept.
- Demo Blockly cannot reveal exact solutions.
- Runtime rules remain in their subsystem owners.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85.
- Plan 77.
- Plan 86 output.
- Plan 92 progress report and changed pilot evidence.
- Plan 75/76 recommendation rows for:
  - `jump-if-ready`
  - `stay-still-can-do-something`
  - `my-side-their-side`
  - `freeze-the-lane`
  - `find-the-enemy-flag`
- Current level source and reference fixtures for the approved target list.

Use `rg` for target level ids and:
- `boardDynamicsTier`
- `canJump`
- `FREEZE_OPPONENTS`
- `MY_SIDE`
- `enemyNearby`
- `hasEnemyFlag`

## Scope

### In Scope

- Re-evaluate the Plan 77 target list against Plan 85 and pilot evidence.
- Default carried-over target levels:
  - `jump-if-ready`
  - `stay-still-can-do-something`
  - `my-side-their-side`
  - `freeze-the-lane`
- Candidate addition requiring explicit owner approval:
  - `find-the-enemy-flag`
- Add living-board-aware compound conditions using existing blocks and deterministic board behavior.
- Add naive/old-solution failure evidence for each changed level.
- Update fixtures, copy, and generated evidence for changed levels.

### Out Of Scope

- Whole-campaign rewrite.
- Advanced boolean operator introduction.
- Strategy Brain/project-level redesign.
- New mandatory levels.
- Runtime rule changes.

## Implementation Requirements

### 1. Target Confirmation

Required behavior:
- Before editing, produce a short target confirmation note listing which levels will be changed and why.
- Include whether `find-the-enemy-flag` is included or deferred.

Constraints:
- If owner approval is not already explicit for a target, stop before mutation.

### 2. Compound Reasoning

Required behavior:
- Each changed level's reference solution must materially combine the named concept with a previously taught idea.
- The old trivial solution must fail or be clearly worse in the generated evidence.

Constraints:
- Use nested `if`/`if-else` if Advanced boolean operators are not yet introduced.
- Do not rely on multiple actions per turn.

### 3. Living Board Fit

Required behavior:
- Board changes must use deterministic, student-legible pressure.
- The condition should feel useful because of the board, not because copy says it is useful.

Constraints:
- Do not create random or unrecoverable enemy behavior.
- If a needed NPC behavior is missing, stop and propose a separate NPC packet.

## Work Plan

1. Confirm Plan 92 pilot acceptance and target list.
2. Read each target level and current/generated evidence.
3. Write a concise per-level edit proposal; stop for owner approval if any target or win-condition change is not already authorized.
4. Implement the approved edits.
5. Update fixtures and naive-solution evidence.
6. Regenerate dossiers/evidence and run readiness/lint/tests.
7. Write progress report with target-by-target outcomes.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
npm run level:dossiers
npm run level:behavior-evidence
npm test
npm run build
```

Run targeted readiness commands for each touched level:

```powershell
npm run level:readiness -- --level <level-id>
```

## Validation Checklist

- [ ] Plan 77 remains superseded; this packet is the executable replacement.
- [ ] Target list was confirmed before edits.
- [ ] Each changed level still centers its named concept.
- [ ] Old trivial/naive solution evidence exists for each changed level.
- [ ] Reference fixtures pass.
- [ ] Generated dossiers/evidence updated.
- [ ] No runtime subsystem contract drift.
- [ ] Progress report identifies any remaining Challenge 22 ramp risk.

## Stop Conditions

- Pilot evidence suggests living-board uplift worsened Challenge 15 outcomes.
- Owner has not approved the target list.
- A target edit requires a new NPC behavior or runtime rule change.
- A change would introduce Advanced boolean blocks too early.
