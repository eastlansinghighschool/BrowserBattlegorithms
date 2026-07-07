---
id: plan-92-pre-challenge-15-living-board-pilot
title: "Pre-Challenge 15 Living Board Pilot"
status: draft
depends_on: []
gate: "before mutation; do not run until Plan 85 owner gate is accepted and prerequisites below are complete"
superseded_by: null
resolution: null
summary: >-
  Pilot living-board rewrite on movement-helper levels 11–14 before Challenge 15, preserving fully protected levels and using `enemy-nearby` as the one complexity-uplift target after Plan 86 evidence.
---
# Plan 92: Pre-Challenge 15 Living Board Pilot

- Packet id: Plan 92
- Packet title: Pre-Challenge 15 Living Board Pilot
- Status: (see frontmatter)
- Owner/model: level-editing specialist after owner gate
- Date: 2026-07-06
- Packet type: implementation / curriculum / level-editing
- Mutation level: source-code, tests, generated evidence, docs
- Approval gate: before mutation; do not run until Plan 85 owner gate is accepted and prerequisites below are complete
- Expected artifacts:
  - movement-helper pilot level edits for levels 11-14, respecting protected-level rules
  - reference fixture updates where level behavior changes
  - naive-solution failure proof for the one uplifted pilot level
  - regenerated dossiers and behavior evidence
  - focused readiness/lint tests
  - progress report
- Progress report folder: `reports/development/plan-92-pre-challenge-15-living-board-pilot/`
- Progress report file: `reports/development/plan-92-pre-challenge-15-living-board-pilot/progress.md`

## Packet Summary

Goal: Pilot Plan 85's living-board rewrite on the movement-helper arc before Challenge 15, making the board feel alive while preserving protected lesson shapes and using `enemy-nearby` as the one complexity-uplift target.

Non-goals:
- Do not edit levels outside the movement-helper pre-Challenge-15 arc.
- Do not change Challenge 15 itself.
- Do not raise required complexity for fully protected levels.
- Do not implement campaign-wide stars, arcs, bestiary, or film review unless their prerequisite packets explicitly landed.
- Do not introduce Advanced boolean operators before their intended point.

Depends on:
- Plan 85 accepted by the owner.
- Plan 86 complete.
- Plan 91 complete if usage fields are touched.
- Plan 94 complete if copy lint/voice rules are required before level copy changes; otherwise owner must explicitly permit copy edits ahead of lint.
- Current level readiness tooling.

Blocks:
- Campaign-wide living-board extension.
- Plan 93 Pre-Challenge 22 Living Resource Uplift.

Why this packet exists:
The Plan 75/76 evidence showed a first major live-board cliff at Challenge 15. Plan 85's recommended pilot is a small enough arc to learn from before rewriting the whole campaign. It should make live enemies legible and useful without turning early guided levels into miniature challenges.

## Authority And Contracts

Required project contracts:
- Plan 85, especially S1, S2, S3, S5, S7, S8, S11, and S12.
- Plan 86 generated evidence.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `docs/packet-creation-guidance.md`

Do not redefine:
- One-action-per-turn Blockly semantics.
- Protected-level status.
- Demo Blockly structure/no-spoiler contract.
- Static Vite deployment.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85 and Plan 86 progress output.
- Current source for:
  - `move-toward-flag`
  - `bring-it-home`
  - `enemy-nearby`
  - `jump-the-gap`
  - `bughunt-15`
  - Challenge 15
- Matching reference fixtures and dossiers/behavior evidence.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/blockly-workspace.md`

Use `rg` for the level ids and for:
- `boardDynamicsTier`
- `cpuBehavior`
- `isFrozen`
- `GUIDED_VERTICAL_PATROL`
- `GUIDED_RANDOM_MOVE_ONLY`

## Scope

### In Scope

- Assign/update board-dynamics metadata for the pilot levels if the metadata system exists.
- Keep `move-toward-flag` fully protected: voice-only/pass-star-only unless the owner changes S12.
- Add living-board/background or timing behavior to eligible pilot levels where Plan 85 allows it.
- Make `enemy-nearby` require its named sensing concept in a more satisfying way, with old trivial solution failure evidence.
- Update fixtures, readiness expectations, and generated evidence for changed levels.
- Update concept matrix assumptions only if genuinely changed.

### Out Of Scope

- Whole-campaign rewrite.
- Stars/par implementation beyond preserving compatibility with existing fields.
- Usage Tracker V2 implementation.
- New server/deployment behavior.

## Implementation Requirements

### 1. Protected-Level Handling

Required behavior:
- `move-toward-flag` remains fully protected unless the owner explicitly overrides S12.
- If included in pilot artifacts, it functions as a baseline, not an uplift.

Constraints:
- No dynamics, arc, or star-criterion changes for fully protected levels.

### 2. Living Board Edits

Required behavior:
- Eligible pilot levels should use deterministic, legible NPC behavior.
- Any live enemy must be understandable by observation and must not create unrecoverable randomness.

Constraints:
- Prefer existing guided NPC behaviors before adding new behavior.
- If a new NPC behavior is necessary, stop and ask unless Plan 85 has been explicitly extended to allow it.

### 3. `enemy-nearby` Uplift

Required behavior:
- The level should materially require the enemy-nearby sensor.
- Add degenerate-solution evidence showing the old trivial solution no longer passes.

Constraints:
- Keep the primary concept centered.
- Do not introduce future blocks or advanced boolean operators.

### 4. Evidence And Tests

Required behavior:
- Run readiness/lint/reference checks for touched levels.
- Regenerate dossiers and behavior evidence for touched levels or the full bundle if generators require full regeneration.
- Include a clear before/after note in the progress report.

## Work Plan

1. Confirm Plan 85 acceptance and prerequisites.
2. Read current pilot levels and Plan 86 evidence.
3. Propose the exact per-level edit shape in the progress thread before mutation if any level needs a win-condition change.
4. Implement bounded level/copy/fixture edits.
5. Add degenerate-solution test/evidence for `enemy-nearby`.
6. Run targeted readiness/lint/reference validation, then required broader validation.
7. Regenerate evidence and write progress report.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
npm run level:readiness -- --level enemy-nearby
npm run level:dossiers
npm run level:behavior-evidence
npm test
npm run build
```

If only some generators need full regeneration, record the exact command used.

## Validation Checklist

- [ ] Plan 85 gate was accepted before mutation.
- [ ] `move-toward-flag` protected status was preserved.
- [ ] `enemy-nearby` old trivial solution fails and new reference solution passes.
- [ ] Touched levels still teach one primary concept each.
- [ ] Demo Blockly remains structural and non-spoiling.
- [ ] Dossiers/evidence reflect the new board behavior.
- [ ] Subsystem notes still read true.
- [ ] Progress report includes remaining pilot risks.

## Stop Conditions

- Plan 85 gate unresolved.
- A level edit would require changing one-action-per-turn, collision, scoring, or Blockly semantics.
- A live enemy behavior would be random/unrecoverable rather than deterministic and legible.
- The protected-level rules conflict with the desired pilot shape.
