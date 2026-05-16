# Plan 26: Challenge 22 Guided Vertical Patrol

## Packet Metadata

- Packet id: plan-26
- Packet title: Challenge 22 Guided Vertical Patrol
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: curriculum / implementation / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - deterministic guided-only vertical patrol NPC behavior
  - revised Challenge 22 opponent setup using the patrol behavior
  - focused tests proving patrol behavior, Challenge 22 authoring, and reference-solution solvability
  - subsystem note update for NPC/CPU behavior contracts
  - progress report
- Progress report folder: `reports/development/plan-26-challenge-22-guided-vertical-patrol/`
- Progress report file: `reports/development/plan-26-challenge-22-guided-vertical-patrol/progress.md`

## Packet Summary

Goal: Improve Challenge 22, "Show What You Know", by replacing overly aggressive live defenders with deterministic guided vertical patrol defenders. The patrol should keep the board alive and readable while reducing brittle "enemy chases me everywhere" behavior.

Non-goals:

- Do not introduce a new Blockly block, toolbox category, variable system, or student-facing NPC-programming feature.
- Do not redesign the whole advanced-logic arc or move Challenge 22 in the campaign.
- Do not change one-action-per-turn semantics, collision rules, scoring rules, or guided unlock order.
- Do not redefine `FREE_PLAY_EASY`, `FREE_PLAY_TACTICAL_ATTACKER`, `FREE_PLAY_TACTICAL_DEFENDER`, or normal Free Play behavior.
- Do not add randomness to this patrol behavior.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Existing Challenge 22 guided setup in `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`.
- Existing CPU decision routing through `runner.cpuBehavior`.
- Existing Plan 23 guided behavior precedent: `GUIDED_STAY_STILL` and `GUIDED_RANDOM_MOVE_ONLY`.
- Mini-model change intent report at `reports/development/challenge-22-npc-patrol-intent.md`.

Blocks:

- A more stable Plan 06 playtest pass over Challenge 22.
- Cleaner classroom evidence that Challenge 22 is a synthesis of learned Blockly tools, not a route-brittleness or chase-AI puzzle.

Why this packet exists:

Challenge 22 is a synthesis gateway level. Students should combine movement, sensing, flag state, helper targets, jump, barrier, freeze, and territory reasoning against live-looking defenders. If defenders aggressively pursue the ally, the challenge can become opaque trial-and-error instead of readable boolean strategy. A deterministic vertical patrol keeps opponent pressure visible while making the level more teachable and testable.

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
  - `src/config/constants.js`
  - `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
  - `src/ai/npc/freePlayCpu.js`
  - `src/core/turnEngine.js`
  - `src/core/movement.js`
  - `tests/unit/`
- Runtime contracts:
  - `docs/subsystems/npc-and-cpu.md`
  - `docs/subsystems/turn-engine.md`

Required product contracts:

- Challenge 22 remains a no-new-tools synthesis challenge.
- The intended learning work is strategic use of known Blockly conditions/actions, not learning NPC internals.
- Guided challenge exceptions must be named and documented clearly.
- Core turn/collision rules remain in `src/core/`; NPC decision logic remains in `src/ai/npc/`; authored level data remains in `src/config/levels/`.
- Static Vite deployment must remain functional.

Packet decisions:

- Add a new explicit guided behavior constant rather than reusing `PATROL_INTERCEPT`.
- Make the behavior deterministic and vertical-only for this packet.
- Scope the behavior to authored guided challenges first. Do not expose it in Free Play UI.
- Update Challenge 22 to use the new patrol behavior for the relevant opponent runner or runners.
- Update the Challenge 22 reference solution only if the current canonical solution no longer passes or no longer represents the intended strategy.

Do not redefine:

- The meaning of existing Free Play CPU behavior constants.
- The older guided `npcType1.js` / `npcType2.js` behavior contracts.
- Blockly variable support. This packet does not add student-program state.
- Challenge 22 as a synthesis/challenge level with no new Blockly concept.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `reports/development/challenge-22-npc-patrol-intent.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `src/config/constants.js`
- `src/ai/npc/freePlayCpu.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/core/turnEngine.js`
- `src/core/movement.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
- `tests/unit/helpers/testHarness.js`

Use `rg "show-what-you-know|Challenge 22|NPC_BEHAVIORS|cpuBehavior|GUIDED_|PATROL_INTERCEPT|calculateFreePlayCpuAction"` from the repository root if symbols or filenames have moved.

Optional/contextual:

- `src/ai/npc/npcType1.js`
- `src/ai/npc/npcType2.js`
- `src/ai/npc/pathing.js`
- `src/core/setup.js`
- `src/core/teams.js`
- `docs/development/plan-23-level-15-defender-and-wanderer.md`

## Scope

### In scope

- Add a new explicit guided-only vertical patrol CPU behavior, with a name such as `GUIDED_VERTICAL_PATROL`.
- Implement patrol movement as:
  - move up until the next upward cell is blocked by board edge, wall, barrier, or occupied cell
  - then reverse and move down until blocked
  - repeat
- Store patrol direction as runner-local engine state, not student Blockly state.
- Initialize or default patrol direction safely when absent.
- Keep patrol deterministic and legal under existing movement/collision checks.
- Assign the new behavior to Challenge 22 opponent runner(s) that should patrol.
- Tune Challenge 22 opponent positions only as much as needed for the patrol lane to read clearly.
- Update Challenge 22 copy only if current text becomes misleading.
- Update the Challenge 22 reference solution if the authored patrol setup requires a different robust solution.
- Add focused tests for the new patrol behavior and Challenge 22 setup.
- Update `docs/subsystems/npc-and-cpu.md`.
- Write the Plan 26 progress report.

### Files and areas likely touched

- `src/config/constants.js`
- `src/ai/npc/freePlayCpu.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/core/setup.js` or runner state setup only if needed for patrol direction initialization
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
- Possibly a new focused unit test under `tests/unit/`
- `docs/subsystems/npc-and-cpu.md`
- `reports/development/plan-26-challenge-22-guided-vertical-patrol/progress.md`

### Out of scope

- Broad Challenge 22 redesign beyond patrol opponent behavior and minimal placement/copy adjustments.
- Changes to Level 15, Level 19, Plan 22 dev-guided Blockly assist, or Plan 25 tracing.
- Free Play UI changes.
- New Blockly blocks or variable/state blocks.
- Random patrol behavior.
- Generated regression output updates unless a committed source fixture truly requires it and the reason is documented.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

## Work Plan

1. Inspect the current Challenge 22 setup, current CPU behavior routing, and the mini-model report.
2. Add the smallest explicit guided vertical patrol behavior.
3. Wire Challenge 22 opponent runner(s) to the patrol behavior and minimally tune placement if needed.
4. Add or update focused tests for patrol movement, Challenge 22 authoring, and solvability.
5. Update the reference solution only if required by the new deterministic patrol setup.
6. Update `docs/subsystems/npc-and-cpu.md`.
7. Run targeted and broader validation.
8. Write the progress report with decisions, commands, and risks.

## Implementation Requirements

### Requirement 1: Add explicit deterministic guided patrol behavior

Required behavior:

- Add an explicit `NPC_BEHAVIORS` entry for guided vertical patrol.
- The behavior chooses exactly one legal cardinal movement action per NPC turn.
- The behavior patrols vertically by continuing in the current vertical direction until blocked, then reversing.
- The behavior is deterministic from runner state and board state.

Constraints:

- Do not reuse `PATROL_INTERCEPT`; that name already describes an older active Team 2 behavior and is not clear enough for this guided exception.
- Do not use `state.randomFn`.
- Do not choose jump, barrier placement, freeze, move randomly, or stay still unless both vertical directions are blocked.
- Use existing movement legality helpers so board edges, walls, barriers, and occupied runner cells are respected.

Edge cases:

- If upward movement is blocked on the first patrol turn, reverse and try downward movement.
- If downward movement is blocked, reverse and try upward movement.
- If both vertical directions are blocked, return `STAY_STILL`.
- If patrol direction state is missing, initialize or default to upward movement.
- If a runner is reset to its starting position, patrol direction should not carry stale behavior that makes the reset surprising.

Expected artifact or code change:

- A named constant and behavior branch in the CPU/NPC action path.
- Minimal runner-local state if needed, with no student-facing Blockly state.

### Requirement 2: Keep Challenge 22 readable and synthesis-focused

Required behavior:

- Challenge 22 uses the new patrol behavior for live opponent pressure.
- The patrol lane should be visually readable near the center/route area.
- The level should remain solvable by combining known tools rather than memorizing exact timing.

Constraints:

- Keep Challenge 22 marked as a challenge/synthesis level with no new Blockly tools.
- Do not make the patrol defender irrelevant by placing it in a corner.
- Do not create an unavoidable collision or exact-route coin flip.
- Do not require a new failure condition or custom UI.

Edge cases:

- If one patrol enemy is enough to achieve the design, do not force both enemies into identical patrols.
- If two patrol enemies are used, their starting rows should not create a confusing wall that makes the level feel impossible.
- Keep the human auto-skip behavior unless a clear owner-approved reason emerges.

Expected artifact or code change:

- Revised Challenge 22 opponent runner setup and behavior assignments.
- Small copy update only if needed.

### Requirement 3: Preserve reference solution confidence

Required behavior:

- The canonical Challenge 22 reference solution still passes.
- If the old solution passes but no longer demonstrates a good intended approach, update it to a more explicit center-lane strategy.

Constraints:

- Do not weaken the level solely to preserve a stale reference solution.
- Do not create a reference solution that relies on hidden timing or exact patrol phase luck.
- Do not reveal exact solution code in tutorial copy.

Edge cases:

- If the reference solution fails because the patrol change exposes a real strategy mismatch, update the fixture and document why.
- If multiple deterministic patrol phase starts are supported, test the intended one and consider one additional phase if easy to do without overbuilding.

Expected artifact or code change:

- Existing or updated `show-what-you-know.xml` fixture.
- Tests showing the solution passes.

### Requirement 4: Tests

Required behavior:

- Unit tests prove the new patrol behavior:
  - moves up while upward movement is legal
  - reverses and moves down when upward movement is blocked
  - reverses and moves up when downward movement is blocked
  - returns `STAY_STILL` only when both vertical directions are blocked
  - does not choose jump, barrier, freeze, or random actions
- Guided-level tests prove Challenge 22 assigns the intended patrol behavior and keeps challenge metadata/toolbox expectations.
- Reference-solution tests prove Challenge 22 remains solvable.

Constraints:

- Keep tests deterministic.
- Prefer small direct CPU-behavior tests over browser-level animation tests for NPC decisions.
- Do not rely on Playwright for pure engine behavior.

Expected artifact or code change:

- Focused unit coverage in existing or new test files.
- Existing broader unit suite remains green.

### Requirement 5: Documentation and contracts

Required behavior:

- Update `docs/subsystems/npc-and-cpu.md` to describe the new guided vertical patrol behavior.
- Clarify that it is deterministic, guided-authoring oriented, and distinct from Free Play Easy and tactical modes.
- Mention any runner-local patrol direction state if implemented.

Constraints:

- Keep docs narrow.
- Do not imply the behavior is exposed through the Free Play UI.
- Do not imply Blockly variables or student mutable state now exist.

Expected artifact or code change:

- `docs/subsystems/npc-and-cpu.md` remains true after the change.

## Model-Specific Instructions

- Start by summarizing the intended MVP: deterministic guided vertical patrol for Challenge 22, not a Free Play rebalance and not Blockly variables.
- Before editing, verify current Challenge 22 behavior and report whether one or both opponent runners currently need the new behavior.
- Prefer explicit naming and small helper functions over clever reuse of `PATROL_INTERCEPT`.
- Write tests around the behavior contract before heavy tuning. This should not become guess-and-check against the browser.
- Stop if the patrol requires broad turn-engine, collision, or level-campaign redesign.
- Stop if the only way to keep Challenge 22 solvable is to make the patrol harmless or to reveal exact solution timing.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js
npm test
npm run build
```

Run browser tests only if the implementation changes visible layout, tutorial behavior, or UI flows:

```powershell
npm run test:browser
```

## Validation Checklist

- [ ] New guided vertical patrol behavior constant exists with explicit naming.
- [ ] Patrol behavior is deterministic and does not use `state.randomFn`.
- [ ] Patrol movement respects board edges, walls, barriers, and occupied cells.
- [ ] Patrol reverses at blocked vertical movement.
- [ ] Patrol returns `STAY_STILL` only when both vertical directions are blocked.
- [ ] Patrol does not choose jump, barrier, freeze, random movement, or other special actions.
- [ ] Challenge 22 uses the patrol behavior for intended opponent runner(s).
- [ ] Challenge 22 remains a no-new-tools synthesis challenge.
- [ ] Challenge 22 copy remains accurate and non-spoiling.
- [ ] Challenge 22 reference solution passes.
- [ ] Targeted unit tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes if UI/browser-visible behavior changed.
- [ ] `docs/subsystems/npc-and-cpu.md` still reads true.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run, behavior decisions, reference-solution status, and remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- A clean patrol implementation requires broad turn-engine or collision-rule changes.
- Challenge 22 cannot remain solvable without changing the toolbox or adding a new Blockly concept.
- The patrol makes the challenge depend on exact hidden timing rather than readable strategy.
- Existing docs and code disagree in a way that changes product or architecture scope.
- The implementation would redefine existing Free Play CPU behavior.
- Validation failures point to broader campaign/reference-solution instability outside Challenge 22.
- A dependency, workflow, deployment, or production action would be needed.
