---
id: plan-71-tactical-cpu-special-ability-polish
title: "Tactical CPU Special Ability Polish"
status: complete
depends_on: []
gate: "none for bounded Free Play tactical CPU tuning; stop for broad AI redesign"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Improve Free Play Tactical CPU special-ability use, especially attacker jump choices and carrier Area Freeze.
---
# Plan 71: Tactical CPU Special Ability Polish

- Packet id: Plan 71
- Packet title: Tactical CPU Special Ability Polish
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: none for bounded Free Play tactical CPU tuning; stop for broad AI redesign
- Expected artifacts:
  - Tactical Attacker special-ability improvements
  - Focused tests
  - NPC subsystem documentation update
  - Progress report
- Progress report folder: `reports/development/plan-71-tactical-cpu-special-ability-polish/`
- Progress report file: `reports/development/plan-71-tactical-cpu-special-ability-polish/progress.md`

## Packet Summary

Goal: Make Free Play Tactical CPU opponents use available special abilities more strategically, especially Tactical Attacker jump opportunities and carrier Area Freeze.

Non-goals:
- Do not change special ability rules, cooldowns, durations, radius, or resource reset behavior.
- Do not implement full pathfinding.
- Do not add new CPU modes.
- Do not change Easy CPU.
- Do not change guided teaching NPCs.
- Do not add new UI, sounds, or visual effects.
- Do not change guided levels or fixtures.

Depends on:
- Existing tactical CPU behavior in `src/ai/npc/freePlayCpu.js`.
- Plan 48 Area Freeze cooldown.
- Plan 52 Jump Forward animation/rules.
- Plan 70 may land before this packet, but this packet should not depend on rut-escape internals unless they already exist.

Blocks:
- None.

Why this packet exists:
Free Play Tactical CPUs already have access to special actions, but attacker behavior is mostly greedy movement. Better local use of Jump Forward and Area Freeze makes CPU opponents more interesting without hiding the game behind opaque planning.

## Authority And Contracts

Required project contracts:
- NPC action choice belongs in `src/ai/npc/`; action resolution belongs in `src/core/`.
- Tactical CPU should be readable from local state and role intent.
- Ability legality remains owned by core movement/resource helpers.
- Randomness, if any, must use `state.randomFn`.
- If `docs/subsystems/npc-and-cpu.md` becomes stale, update it in the same patch.

Do not redefine:
- Area Freeze cooldown behavior.
- Jump Forward landing legality.
- Barrier placement legality.
- Carrier vulnerability/collision rules.
- Scoring rules.

## Required Reading

Read before editing:
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/npc/pathing.js`
- `src/core/areaFreeze.js`
- `src/core/movement.js`
- `src/core/turnEngine.js`
- `src/config/constants.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

Use `rg` for:
- `JUMP_FORWARD`
- `FREEZE_OPPONENTS`
- `isAreaFreezeReady`
- `AREA_FREEZE_RADIUS`
- `canJump`
- `canPlaceBarrier`
- `FREE_PLAY_TACTICAL_ATTACKER`
- `FREE_PLAY_TACTICAL_DEFENDER`

## Scope

### In Scope

- Tactical Attacker should use Jump Forward when:
  - jump is available
  - landing cell is legal
  - the jump meaningfully reduces distance to the current target compared with ordinary movement
- Tactical carrier should use Area Freeze when:
  - carrying the enemy flag
  - freeze is ready
  - a relevant opponent threat is within freeze radius
- Preserve Tactical Defender's existing Area Freeze and barrier behavior unless a narrow bug appears.
- Add focused tests for attacker jump and carrier freeze behavior.
- Update `docs/subsystems/npc-and-cpu.md`.

### Out Of Scope

- Full pathfinding.
- Barrier strategy redesign.
- Special ability use by Easy CPU beyond its existing random legal action selection.
- Guided NPC behavior.
- New animations, SFX, UI, or narration.
- Any rules in `src/core/`.

### Files And Areas Likely Touched

- `src/ai/npc/freePlayCpu.js`
- `docs/subsystems/npc-and-cpu.md`
- `tests/unit/free-play-contracts.test.js`
- possibly a new focused CPU unit test file
- possibly `tests/browser/free-play.spec.js`

## Implementation Requirements

### 1. Tactical Attacker Jump

Required behavior:
- If the attacker is pursuing the enemy flag or returning home with the enemy flag, it may choose `JUMP_FORWARD` when jump is available and useful.
- Use existing movement helpers to verify landing legality.
- Compare distance-to-target before and after the jump; choose jump only when it improves the tactical objective.

Constraints:
- Do not jump just because jump is available.
- Do not jump into blocked, off-board, occupied, or illegal cells.
- Do not change jump resource consumption; the turn engine handles that.

### 2. Carrier Area Freeze

Required behavior:
- A Tactical Attacker carrying the enemy flag should use Area Freeze when an active opponent threat is within the existing freeze radius and freeze is ready.
- Prefer threats that can plausibly intercept the carrier, such as nearby unfrozen enemy runners.

Constraints:
- Use `isAreaFreezeReady(state, runner.team)`.
- Do not change cooldown, radius, or frozen duration.
- Do not add predictive multi-turn threat modeling.

### 3. Defender Preservation

Required behavior:
- Tactical Defender's existing freeze-near-carrier and barrier-at-defense-cell behavior should continue to work.
- Only edit defender behavior if needed to avoid regressions caused by shared helpers.

### 4. Tests

Required tests:
- Tactical Attacker chooses jump when it is legal and improves distance to target.
- Tactical Attacker does not choose jump when illegal or not useful.
- Tactical carrier chooses Area Freeze when a threat is in range and freeze is ready.
- Tactical carrier does not choose Area Freeze when cooldown blocks it or no threat is in range.
- Tactical Defender existing freeze behavior is preserved.
- Easy CPU behavior is unchanged.

## Work Plan

1. Inspect Tactical Attacker and Defender decision order.
2. Add small helper functions for jump utility and carrier threat freeze if helpful.
3. Keep action selection order explicit and documented by tests.
4. Add focused unit tests.
5. Update `docs/subsystems/npc-and-cpu.md`.
6. Run validation.
7. Write the progress report.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js
npm test
npm run build
```

If browser coverage changes:

```powershell
npx playwright test tests/browser/free-play.spec.js --reporter=line
```

## Validation Checklist

- [ ] Tactical Attacker uses Jump Forward only when legal and useful.
- [ ] Tactical carrier uses Area Freeze only when ready and relevant.
- [ ] Tactical Defender behavior is preserved.
- [ ] Easy CPU behavior is unchanged.
- [ ] Core special ability rules are unchanged.
- [ ] `docs/subsystems/npc-and-cpu.md` matches runtime behavior.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and ask for owner review if:
- The desired behavior requires pathfinding or long-term planning.
- Barrier strategy becomes necessary to make the attacker feel competent.
- The change makes Tactical CPU too strong for classroom Free Play.
- Ability use needs new UI explanation or rule changes.
- Guided levels are affected unexpectedly.
