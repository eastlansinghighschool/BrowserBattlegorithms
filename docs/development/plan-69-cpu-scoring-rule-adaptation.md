---
id: plan-69-cpu-scoring-rule-adaptation
title: "CPU Scoring-Rule Adaptation"
status: complete
depends_on: []
gate: "none for bounded CPU tuning; stop for broad AI redesign"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Adapt Free Play tactical CPU behavior so carriers respond sensibly when scoring is blocked because their own flag is away.
---
# Plan 69: CPU Scoring-Rule Adaptation

- Packet id: Plan 69
- Packet title: CPU Scoring-Rule Adaptation
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: none for bounded CPU tuning; stop for broad AI redesign
- Expected artifacts:
  - CPU behavior audit under the own-flag-home scoring rule
  - Bounded Free Play tactical CPU adaptations
  - Focused tests
  - NPC subsystem documentation update
  - Progress report
- Progress report folder: `reports/development/plan-69-cpu-scoring-rule-adaptation/`
- Progress report file: `reports/development/plan-69-cpu-scoring-rule-adaptation/progress.md`

## Packet Summary

Goal: Adapt CPU behavior so Free Play tactical opponents behave sensibly when a carrier cannot score because its own flag is away.

Non-goals:
- Do not change scoring rules.
- Do not change guided level source unless Plan 68 explicitly left a narrow CPU-behavior follow-up.
- Do not implement full pathfinding.
- Do not add new CPU difficulty modes.
- Do not add new Blockly blocks.
- Do not change Easy CPU's intentionally random personality.
- Do not reference other product versions or external variants of the game in docs, comments, tests, reports, or UI copy.

Depends on:
- Plan 67 own-flag-home scoring rule.
- Ideally Plan 68 guided-level repairs, if required levels were affected.
- Plan 65 recent movement state may be useful for later anti-rut behavior, but this packet is about scoring-rule adaptation.

Blocks:
- None required, but this should land before relying on Tactical PvCPU as polished classroom Free Play under the new scoring rule.

Why this packet exists:
After Plan 67, a CPU carrier can reach base with the enemy flag and still be unable to score because its own flag is away. If CPU attackers simply sit in base forever, Free Play can look broken even though the rules are correct. This packet gives tactical CPUs a small, understandable response without turning them into opaque perfect pathfinders.

## Authority And Contracts

Required project contracts:
- Guided teaching NPCs and Free Play CPU behaviors have different goals.
- Guided NPC behavior should remain deterministic and readable unless a level intentionally opts into a named exception.
- Free Play tactical CPU can use constrained randomness through `state.randomFn` where needed for testability.
- NPC action choice belongs in `src/ai/npc/`; action resolution belongs in `src/core/`.
- The one-action-per-turn model must remain intact.
- If `docs/subsystems/npc-and-cpu.md` becomes stale, update it in the same patch.

Do not redefine:
- Plan 67 scoring behavior.
- Plan 65 student-facing recent-state blocks.
- Easy CPU randomness.
- Guided campaign level design.

## Required Reading

Read before editing:
- `reports/development/plan-67-own-flag-home-scoring-rule/progress.md`
- `reports/development/plan-68-guided-level-scoring-rule-repairs/progress.md` if it exists
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/npc/pathing.js`
- `src/ai/npc/npcType1.js`
- `src/ai/npc/npcType2.js`
- `src/core/scoring.js`
- `src/core/movement.js`
- `src/core/teams.js`
- `src/core/recentMovement.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

Use `rg` for:
- `FREE_PLAY_TACTICAL_ATTACKER`
- `FREE_PLAY_TACTICAL_DEFENDER`
- `FREE_PLAY_EASY`
- `calculateFreePlayCpuAction`
- `hasEnemyFlag`
- `MOVE_TOWARD_TARGETS.MY_BASE`
- `isAreaFreezeReady`
- `PLACE_BARRIER_FORWARD`
- `state.randomFn`

## Scope

### In Scope

- Audit current Free Play CPU behavior when:
  - CPU carrier is in base with enemy flag but own flag is away.
  - CPU defender can pursue or freeze the enemy carrier.
  - CPU attacker is blocked from scoring and enemies are nearby.
- Add small tactical behavior so a blocked CPU carrier does something legible and useful.
- Add tests that pin behavior with `state.randomFn` where randomness is used.
- Update `docs/subsystems/npc-and-cpu.md`.

### Out Of Scope

- Full A* or other full-board pathfinding.
- Global anti-rut behavior unrelated to blocked scoring.
- Rewriting guided NPCs.
- New UI, narration, or scoring feedback.
- Level reauthoring.
- New dependencies.
- GitHub workflow or deployment edits.

### Files And Areas Likely Touched

- `src/ai/npc/freePlayCpu.js`
- `docs/subsystems/npc-and-cpu.md`
- `tests/unit/free-play-contracts.test.js`
- possibly `tests/browser/free-play.spec.js`
- possibly new focused unit test file for CPU decision behavior if no suitable test file exists

## Implementation Requirements

### 1. CPU Audit

Required behavior:
- Before editing, create a short audit note in the progress report describing current Tactical Attacker and Tactical Defender behavior under blocked scoring.
- Confirm whether Easy CPU needs no change.
- Confirm whether guided NPCs need no change for this packet.

### 2. Tactical Carrier Behavior

Required behavior:
- When a Tactical Attacker has the enemy flag and is in its own base but cannot score because its own flag is away, it should not simply choose `STAY_STILL` forever.
- Prefer a bounded, readable response such as:
  - evade nearby enemies with a legal movement choice
  - move toward an enemy carrier if that carrier has its team's flag and is reachable
  - use Area Freeze if an enemy carrier/threat is within freeze radius and freeze is ready
  - otherwise choose a legal movement fallback that avoids immediate stagnation

Constraints:
- Keep behavior understandable from local state.
- Keep randomness constrained and testable via `state.randomFn`.
- Do not make Tactical CPU perfect.
- Do not add planner/pathfinder state.
- Do not let a carrier voluntarily drop the enemy flag.

### 3. Defender Support

Required behavior:
- Confirm Tactical Defender already prioritizes enemy carriers and uses Area Freeze within range.
- Only make defender changes if a small local fix clearly improves blocked-scoring recovery.

Constraints:
- Do not weaken existing defensive role behavior.
- Do not change guided defender exceptions.

### 4. Tests

Required tests:
- Tactical Attacker carrying enemy flag still returns home when own flag is home or scoring is possible.
- Tactical Attacker in base with enemy flag and own flag away chooses a useful non-stall action when legal.
- Tactical Attacker uses or preserves Area Freeze behavior only when existing readiness/radius rules allow it.
- Easy CPU remains random legal-action selection.
- Any randomness is pinned with `state.randomFn`.

Browser coverage:
- Add or update a Free Play browser test only if the behavior is visible and not well covered by unit tests.

### 5. Documentation

Required updates:
- `docs/subsystems/npc-and-cpu.md` must explain the blocked-scoring carrier response.
- Keep the note clear that this is Free Play tactical behavior, not guided teaching NPC behavior.

## Work Plan

1. Reproduce or simulate the blocked-scoring CPU state.
2. Audit existing tactical attacker/defender behavior.
3. Implement the smallest Free Play tactical adaptation.
4. Add focused tests.
5. Update `docs/subsystems/npc-and-cpu.md`.
6. Run targeted and broad validation.
7. Write the progress report with behavior examples and any deferred risks.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/scoring-and-level-state.test.js
npm test
npm run build
```

If browser coverage changes:

```powershell
npx playwright test tests/browser/free-play.spec.js --reporter=line
```

## Validation Checklist

- [ ] Tactical carrier blocked-scoring state is tested.
- [ ] Tactical carrier no longer stalls indefinitely in the tested blocked-scoring case.
- [ ] Tactical attacker still behaves normally when scoring is possible.
- [ ] Tactical defender behavior is preserved or narrowly improved.
- [ ] Easy CPU behavior is unchanged.
- [ ] `state.randomFn` pins any randomness in tests.
- [ ] `docs/subsystems/npc-and-cpu.md` matches runtime behavior.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No guided level source was changed unless explicitly authorized by Plan 68 follow-up notes.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and ask for owner review if:
- The only reasonable fix is full pathfinding.
- Tactical CPU needs a new difficulty mode.
- Guided NPC behavior must change broadly.
- CPU behavior changes make required guided levels easier/harder in a way not covered by Plan 68.
- The implementation needs new persistent CPU strategy state beyond small runner-local flags.
- The packet starts turning into general anti-rut behavior instead of blocked-scoring adaptation.

