# Plan 23: Level 15 Defender And Wanderer

## Packet Metadata

- Packet id: plan-23
- Packet title: Level 15 Defender And Wanderer
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: curriculum / implementation / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - revised Level 15 setup with one stationary enemy defender and one movement-only wandering enemy
  - NPC/CPU behavior support if needed for a guided-safe movement-only random enemy
  - updated Level 15 copy and reference solution if required
  - focused tests proving the Level 15 behavior and reference solution remain classroom-ready
  - subsystem note update if NPC behavior contracts change
  - progress report
- Progress report folder: `reports/development/plan-23-level-15-defender-and-wanderer/`
- Progress report file: `reports/development/plan-23-level-15-defender-and-wanderer/progress.md`

## Packet Summary

Goal: Revise Challenge 15, "Dodge and Deliver", so it feels more like a live game challenge: one enemy stands still as a defender between the ally and enemy flag, while a second enemy moves unpredictably enough to pressure brittle strategies without making good strategies fail by pure chance.

Non-goals:

- Do not redesign the Level 15 map, toolbox, win condition, or place in the guided campaign unless the existing setup cannot support the approved defender/wanderer shape.
- Do not introduce a new Blockly concept or new student-facing block.
- Do not expose random movement as the main learning goal for Level 15; randomness remains pressure in a synthesis challenge, not the lesson concept.
- Do not change the one-action-per-turn model, collision rules, guided unlock order, project levels, Free Play setup UI, or normal Free Play CPU tuning.
- Do not make Level 15 a coin-flip level where a strong strategy sometimes fails for reasons students cannot reasonably debug.
- Do not install dependencies.
- Do not deploy.

Depends on:

- Current guided campaign and reference-solution test harness.
- The existing Claude change in `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`, where one Level 15 opponent currently uses `NPC_BEHAVIORS.FREE_PLAY_EASY`.

Blocks:

- A more satisfying Plan 06 playtest pass over Level 15.
- Cleaner guided-campaign evidence that Challenge 15 is a synthesis of movement, sensing, flag state, and threat avoidance rather than a simple route-following level.

Why this packet exists:

Level 15 is the first "real game situation" after the movement-helper arc. The challenge should reward students who can combine local sensing, flag-state checks, and movement choices. A stationary defender gives the board a legible strategic obstacle. A constrained wandering enemy adds pressure and replay texture. The implementation must keep that pressure teachable: students should be able to predict, debug, and improve their program instead of feeling that the game randomly accepted or rejected their work.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `src/config/levels/`
  - `src/ai/npc/`
  - `src/core/`
  - `tests/unit/`
- Runtime contracts:
  - `docs/subsystems/npc-and-cpu.md`
  - `docs/subsystems/turn-engine.md`

Required product contracts:

- Guided levels generally teach one primary concept at a time; Level 15 is a challenge/synthesis level with no new tools.
- Level 15 should still be solvable through Blockly logic using the existing Level 15 toolbox.
- The intended student move is robust strategy design, not central control, exact copying, or random trial-and-error.
- Core turn/collision rules remain in `src/core/`; NPC/CPU decision logic remains in `src/ai/npc/`; authored level data remains in `src/config/levels/`.
- Static Vite deployment must remain functional.

Current-state finding to verify before mutation:

- As of packet creation, Level 15 has an opponent runner using `NPC_BEHAVIORS.FREE_PLAY_EASY`.
- `FREE_PLAY_EASY` currently picks from all legal actions at random, including movement, jump, barrier, freeze, and stay-still actions.
- That is broader than the intended "random enemy moves around" behavior for this packet. Do not silently treat `FREE_PLAY_EASY` as movement-only.

Do not redefine:

- Guided level order or count.
- The meaning of `FREE_PLAY_EASY` in Free Play.
- Collision outcomes or defender-side rules.
- The optional random lab's purpose.
- The Blockly toolbox policy for Level 15, except for a stop-and-report if the revised level cannot be solved without a broader toolbox decision.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/constants.js`
- `src/ai/npc/freePlayCpu.js`
- `src/core/turnEngine.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- `tests/unit/helpers/testHarness.js`

Use `rg "dodge-and-deliver|FREE_PLAY_EASY|NPC_BEHAVIORS|cpuBehavior|randomFn|calculateFreePlayCpuAction"` from the repository root if symbols or filenames have moved.

Optional/contextual:

- `src/config/maps.js`
- `src/ai/npc/npcType1.js`
- `src/ai/npc/npcType2.js`
- `src/core/movement.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`

## Scope

### In scope

- Change Level 15 to use two active/unfrozen opponent runners:
  - one stationary defender
  - one movement-only wandering enemy
- Place the stationary defender directly between the ally and the enemy flag on the enemy side of the field.
- Place the wandering enemy slightly behind or offset from the stationary defender so it creates pressure without immediately creating a coin flip.
- Add or reuse an explicit NPC/CPU behavior that means "stay still" for the stationary defender.
- Add or reuse an explicit NPC/CPU behavior that means "random legal movement only" for the wandering enemy.
- Update Level 15 copy where needed so it describes a defender and a moving enemy without overexplaining implementation details.
- Update the canonical Level 15 reference solution if the current one no longer passes.
- Add focused tests for the new Level 15 setup and behavior.
- Update `docs/subsystems/npc-and-cpu.md` if new behavior constants or guided exceptions are added.
- Write the Plan 23 progress report.

### Files and areas likely touched

- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/constants.js`
- `src/ai/npc/freePlayCpu.js` or a nearby NPC behavior module
- `src/core/turnEngine.js` only if needed to route a new behavior cleanly
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- Possibly a new focused unit test file under `tests/unit/`
- `docs/subsystems/npc-and-cpu.md`
- `reports/development/plan-23-level-15-defender-and-wanderer/progress.md`

### Out of scope

- Any broad guided campaign rewrite.
- Changes to Plan 06 reports or Gemini scaffolding.
- Changes to Plan 22 dev-guided Blockly assist.
- Free Play UI redesign or Free Play difficulty rebalance.
- New Blockly block definitions or toolbox categories.
- Generated regression output updates unless an existing committed fixture truly requires them and the reason is documented.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

## Work Plan

1. Inspect current Level 15, current NPC behavior constants, and Claude's `FREE_PLAY_EASY` change.
2. Decide the smallest clean behavior model that represents stationary defender plus movement-only wanderer without changing Free Play Easy semantics.
3. Implement only the bounded Level 15 and NPC behavior changes.
4. Update Level 15 copy and the reference solution only if required by the revised board.
5. Add focused tests for setup, behavior, and solvability across pinned random cases.
6. Update `docs/subsystems/npc-and-cpu.md` if runtime behavior contracts changed.
7. Run targeted and broader validation.
8. Write the progress report with commands run, exact behavior choices, and remaining risks.

## Implementation Requirements

### Requirement 1: Confirm and replace overly broad randomness

Required behavior:

- Verify whether Level 15 still uses `NPC_BEHAVIORS.FREE_PLAY_EASY`.
- If it does, replace that usage with behavior that matches the packet intent: random legal movement only.

Constraints:

- Do not change what `FREE_PLAY_EASY` means for Free Play unless the integration owner explicitly approves it.
- Do not let the Level 15 wandering enemy place barriers, use Area Freeze, jump, or choose non-movement special actions unless you stop and explain why that is necessary.
- A random movement behavior may choose `STAY_STILL` only if no legal cardinal movement exists, or if an explicit owner-approved design says occasional stillness is part of the behavior.

Edge cases:

- The random movement behavior must honor map boundaries, blocked cells, barriers, and occupied cells through existing movement legality checks.
- The behavior must use `state.randomFn` when available so tests can pin outcomes.

Expected artifact or code change:

- A clear behavior constant and implementation path such as `GUIDED_RANDOM_MOVE` / `RANDOM_MOVE_ONLY` / similarly explicit naming.

### Requirement 2: Add a stationary defender

Required behavior:

- Level 15 has one unfrozen opponent runner that always stays still.
- That defender starts directly between the ally and the enemy flag on the enemy side of the field.
- The defender should be placed so it is visually and strategically meaningful, not hidden in a corner or immediately irrelevant.

Constraints:

- Prefer an explicit stay-still behavior over relying on a missing `cpuBehavior` fallthrough unless the existing engine already has a documented guided stay-still contract.
- Do not mark the defender frozen; the design is "unmoving defender", not "frozen obstacle." This matters for visual meaning and future rule reasoning.

Edge cases:

- The defender must not start on the flag cell.
- The defender must not create an unavoidable collision that makes the level impossible without introducing a new tool.

Expected artifact or code change:

- Revised Level 15 opponent runner setup with an active stationary defender.

### Requirement 3: Add a movement-only wandering enemy

Required behavior:

- Level 15 has a second unfrozen opponent runner that moves unpredictably using only legal cardinal movement actions.
- The wandering enemy starts a little behind or offset from the stationary defender, creating pressure while leaving room for robust strategies.

Constraints:

- Avoid immediate unavoidable collisions.
- Avoid placing the wanderer directly on the same lane if that makes the first few turns hinge mostly on random choices.
- Keep the challenge readable for a student seeing the level for the first time.

Edge cases:

- Pinned random values should produce repeatable tests.
- Multiple pinned random paths should still leave a plausible robust strategy, even if some brittle strategies fail.

Expected artifact or code change:

- Revised Level 15 opponent runner setup and behavior wiring.

### Requirement 4: Preserve Level 15 pedagogy

Required behavior:

- Level 15 remains a no-new-tools challenge that synthesizes flag state, movement helpers, sensing, and threat avoidance.
- Copy should make it clear that one enemy holds a lane and another moves, without implying that random chance is the thing students are supposed to learn.

Constraints:

- Do not reveal an exact solution in tutorial copy or demo Blockly.
- Avoid wording such as "sometimes your solution will fail randomly" as the intended experience.
- Prefer language like "watch both threats", "plan a safer route", or "build a strategy that still works when the moving enemy takes a different step."

Edge cases:

- If the current reference solution becomes too brittle, adjust the solution or level setup so the canonical strategy demonstrates robust reasoning.

Expected artifact or code change:

- Small copy update in Level 15 source if needed.

### Requirement 5: Tests and validation

Required behavior:

- Add tests that prove Level 15 has:
  - exactly the intended two active opponent enemies
  - one stay-still defender
  - one movement-only random/wandering enemy
  - defender placement between ally and enemy flag on the enemy side
- Add or update tests that prove the wandering behavior only returns legal movement decisions under pinned `state.randomFn` values.
- Prove the Level 15 reference solution passes with more than one pinned random value.

Constraints:

- Do not rely only on `state.randomFn = () => 0`; test at least three representative pinned values, such as `0`, `0.5`, and `0.99`, or a deterministic sequence if that better matches the behavior.
- Keep tests focused and deterministic.
- If a robust reference solution cannot pass across representative random paths without a broad redesign, stop and report instead of weakening tests.

Expected artifact or code change:

- Unit coverage in the relevant guided-level and NPC behavior tests.
- Updated reference solution XML only if needed.

### Requirement 6: Keep subsystem notes true

Required behavior:

- If this packet adds a guided-level exception that uses randomness or new CPU behavior constants, update `docs/subsystems/npc-and-cpu.md`.
- The note should clearly distinguish:
  - Free Play Easy's broad random legal-action behavior
  - any Level 15 guided challenge exception
  - the `state.randomFn` testing requirement

Constraints:

- Do not rewrite the entire subsystem note.
- Do not hide the fact that guided randomness is normally discouraged; Level 15 should be framed as a named challenge exception.

Expected artifact or code change:

- A small doc-tail update that remains true after the code change.

## Model-Specific Instructions

- Start by summarizing the job and confirming the current `FREE_PLAY_EASY` Level 15 state before editing.
- Keep the patch small. Do not broaden into campaign redesign or Free Play rebalance.
- Prefer explicit behavior names over clever fallthroughs.
- Write tests before or alongside the behavior change so you do not tune by guess-and-check.
- Stop if the only way to pass Level 15 is to make the random enemy harmless, make the defender irrelevant, or add a new student-facing concept.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js
npm test
npm run build
```

Run browser tests only if the implementation changes visible layout, tutorial behavior, or UI flows:

```powershell
npm run test:browser
```

## Validation Checklist

- [ ] Level 15 source has one stationary active defender and one movement-only wandering enemy.
- [ ] Level 15 no longer relies on `FREE_PLAY_EASY` for the wandering enemy unless the behavior has been explicitly narrowed by owner-approved design.
- [ ] Defender placement is between the ally and enemy flag on the enemy side.
- [ ] Wanderer placement creates pressure without immediate unavoidable randomness.
- [ ] Level 15 copy still frames the level as a synthesis challenge with no new tools.
- [ ] Canonical Level 15 reference solution passes.
- [ ] Canonical Level 15 reference solution passes under multiple pinned random values or deterministic random sequences.
- [ ] Focused tests prove the new NPC behavior does not choose jump, barrier, freeze, or other non-movement special actions.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes if UI/browser-visible behavior changed.
- [ ] `docs/subsystems/npc-and-cpu.md` still reads true if NPC behavior contracts changed.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run, decisions made, and any remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- Level 15 cannot remain solvable without adding new Blockly concepts or broadening the toolbox.
- Representative pinned random paths make a robust strategy fail for opaque reasons.
- The stationary defender makes the flag unreachable or forces exact-solution pathing.
- The movement-only wandering behavior requires broad turn-engine or collision-rule changes.
- Implementing this cleanly would redefine Free Play Easy or change normal Free Play CPU behavior.
- Source and `docs/subsystems/npc-and-cpu.md` disagree in a way that requires product or architecture judgment.
- Validation failures suggest broader campaign/reference-solution instability outside Level 15.
- A dependency, workflow, deployment, or production action would be needed.
