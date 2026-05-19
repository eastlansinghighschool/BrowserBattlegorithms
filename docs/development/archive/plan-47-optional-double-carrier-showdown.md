# Plan 47: Optional Double-Carrier Showdown Guided Level

## Packet Metadata

- Packet id: plan-47
- Packet title: Optional Double-Carrier Showdown Guided Level
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: implementation / guided-level / curriculum / tests
- Mutation level: source-code / tests / docs
- Approval gate: before adding new Blockly blocks, new NPC behavior families, new visual UI systems, probabilistic collision behavior, or broad level-order/project-architecture changes
- Expected artifacts:
  - one late optional guided level after the existing optional lab or final project sequence
  - level setup with one human runner, two Blockly ally runners, and at least three live NPC runners
  - both teams begin with a flag carrier
  - pass condition requires Team 1 to score a point under double-carrier pressure
  - failure pressure from enemy scoring or a bounded turn limit
  - updated guided manifest/order, concept matrix, student/teacher docs if applicable, tests, linter expectations, and progress report
- Progress report folder: `reports/development/plan-47-optional-double-carrier-showdown/`
- Progress report file: `reports/development/plan-47-optional-double-carrier-showdown/progress.md`

## Packet Summary

Goal: Add a late optional guided level that teaches the new Plan 46 carrier-vulnerability rule in a dramatic, strategic setting. The human runner starts as Team 1's flag carrier, an NPC starts as Team 2's flag carrier, and the player must score while both sides are under carrier pressure. The level should make defender/support allies matter: two Blockly allies must help screen, intercept, block, freeze, or otherwise manage the live NPC threat while the human carrier tries to bring the enemy flag home.

Non-goals:

- Do not implement Plan 46 here; this packet depends on Plan 46.
- Do not add a new Blockly concept. This is an optional synthesis/application level.
- Do not make the outcome trivially guaranteed by frozen NPCs, stationary-only NPCs, or a solved starter program.
- Do not add random collision outcomes.
- Do not expand or alter the project shared-workspace architecture.
- Do not deploy.

Depends on:

- Plan 46 complete: flag carriers always lose one-carrier collisions; moving attacker loses both-carrier collisions.
- Existing optional level phase under `src/config/levels/phases/optional/`.
- Current advanced/teamplay toolboxes and reference-solution harnesses.

Blocks:

- A later teacher-facing discussion prompt about carrier vulnerability and support roles.
- Any future Gemini playthrough that wants a late stress-test level.

Why this packet exists:

The new carrier vulnerability rule is strategically important but subtle. Students should eventually see that a flag carrier is not invincible on their home side, and that allies can win games by defending, screening, and intercepting instead of only racing toward the flag. A late optional level can make that idea vivid without disrupting the main guided sequence or overloading earlier learners.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `src/config/levels/index.js`
- `src/config/levels/phases/optional/`
- `src/config/levels/phases/advanced-teamplay/`
- `src/config/levels/shared/`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `scripts/lint-levels.js`

Do not redefine:

- Guided levels generally teach one primary concept at a time; optional synthesis levels may combine ideas if clearly labeled.
- The level must not reveal the exact solution in starter/demo Blockly.
- One Blockly workspace controls allied runners according to the current guided/project conventions.
- Core rules belong in `src/core/`; authored level setup belongs in `src/config/levels/`.
- Static Vite deployment must be preserved.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/GameSpecification.md` section 5 after Plan 46
- `docs/subsystems/turn-engine.md` after Plan 46
- `docs/subsystems/npc-and-cpu.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `src/config/levels/phases/optional/level-38-optional-random-lab.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js`
- `src/config/levels/shared/projectToolboxes.js`
- `tests/unit/guided-level-contracts.test.js`

Use `rg "optional-random-lab|advanced-scrimmage|escort-the-carrier|hasEnemyFlag|team_scores_point|failureCondition"` from the repository root before editing.

## Scope

### In Scope

- Add one optional late guided level, tentatively titled **Optional Lab: Double Carrier Showdown**.
- Place it after the final project sequence and current optional random lab unless inspection reveals a better optional ordering.
- Give Team 1:
  - one human-controlled runner that starts with the enemy flag
  - two Blockly ally runners
- Give Team 2:
  - at least three active NPC runners
  - at least one NPC runner that starts with Team 1's flag
- Use a live setup where Team 1 can score, Team 2 can threaten to score, and collision outcomes matter.
- Provide concise lesson copy that frames the challenge as carrier vulnerability and support/interception.
- Add or update reference solution(s) if the level is expected to be automatically solvable by Blockly.
- Add unit tests for level order, setup shape, carrier state, toolbox scope, pass/fail contract, and optional status.
- Run level lint and update docs/tests that track level count/order.
- Write the progress report.

### Out Of Scope

- New block types.
- New general-purpose NPC behavior families unless existing NPC options cannot support a viable level. If that happens, stop and report.
- New custom modal/tutorial UI.
- Randomized collision outcomes.
- Changes to Plan 46 core rule.
- Broad rebalance of existing levels.
- Deployment.

### Files And Areas Likely Touched

- `src/config/levels/phases/optional/`
- `src/config/levels/phases/optional/index.js`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js` if a reference solution is added
- `tests/unit/guided-project-solutions.test.js` only if optional order/test assumptions require it
- `scripts/lint-levels.js` only if the linter has hard-coded optional-level assumptions
- `reports/development/plan-47-optional-double-carrier-showdown/progress.md`

## Work Plan

1. Confirm Plan 46 is landed and docs describe the new collision rule.
2. Inspect optional-level and advanced-teamplay conventions.
3. Draft the level setup and run quick simulations/manual checks to ensure it is dramatic but not impossible.
4. Add the level source and index it in the optional phase.
5. Update concept matrix and any student/teacher docs that list optional levels.
6. Add focused tests for setup, order, toolbox, and pass/fail behavior.
7. Run validation and tune only within the packet's bounded level-design scope.
8. Write the progress report, including why the final setup is not trivially guaranteed.

## Implementation Requirements

### Requirement 1: Level Placement And Framing

Required behavior:

- Add a late optional guided level after the final project arc.
- It may come after `optional-random-lab`; if so, update tests that currently expect `optional-random-lab` to be the final level.
- Title should clearly mark it optional, such as `Optional Lab: Double Carrier Showdown`.
- Copy should explain:
  - both teams already have a flag carrier
  - flag carriers are vulnerable in collisions
  - if both carriers collide, the moving runner loses
  - allies are useful as defenders, screens, interceptors, or resource specialists

Constraints:

- Do not label it as a required main-sequence level.
- Do not introduce a new primary Blockly concept.
- Do not provide exact solution code in tutorial copy or starter Blockly.

### Requirement 2: Board Setup

Required behavior:

- Team 1 has exactly or at least:
  - one human runner, starting with `hasEnemyFlag: true`
  - two Blockly ally runners
- Team 2 has at least three active NPC runners.
- At least one Team 2 NPC starts with `hasEnemyFlag: true`.
- Both carried flags must be internally spec-compliant:
  - the carried flag has `carriedByRunnerId`
  - the carrier has `hasEnemyFlag: true`
  - setup/invariants pass
- Use a map that gives meaningful lanes and interception choices, likely `wideScrimmage` unless another existing map is clearly better.
- Keep home flags/base semantics spec-compliant.

Recommended shape, adjust after testing:

- Human carrier starts near but not inside Team 1 scoring base, with a risky path home.
- Enemy carrier starts on a plausible return path toward Team 2's base, not already guaranteed to score.
- Two allies start where they can either support the human carrier or intercept the enemy carrier.
- Three NPCs include:
  - one enemy carrier
  - one chaser/screening threat near the human carrier's route
  - one defender/interceptor near midfield

Constraints:

- Do not freeze most NPCs. The level should feel live.
- Do not place the human one step from scoring with no threat.
- Do not place the enemy carrier one step from scoring unless the allies have an immediate, readable way to intervene.
- Preserve one occupied cell per runner and valid flag setup.

### Requirement 3: Win And Failure Pressure

Required behavior:

- Primary pass condition: Team 1 scores a point.
- The level should be designed so the point is scored by the human carrier or by a Team 1 carrier under live double-carrier pressure.
- Team 2 must have a real scoring threat.
- Add a bounded turn limit.

Preferred failure behavior:

- If the current failure-condition system can support it with a small, clean extension, add a guided failure condition where Team 2 scoring a point fails the level.
- If that requires broader UI/state-machine changes than expected, stop and report. Do not fake the threat with misleading copy.

Constraints:

- Do not accept a level where Team 1 can ignore the enemy carrier and score reliably with no ally support.
- Do not accept a level where Team 2 always scores before the player can reasonably react.
- Do not make success depend on random collision outcomes.

### Requirement 4: Blockly And Strategy

Required behavior:

- Use an advanced/late toolbox appropriate for optional synthesis.
- The starter Blockly should be structural only, likely `STARTER_EVENT_XML` or a minimal branch skeleton.
- The intended strategy should involve at least two of:
  - teammate flag condition
  - runner index roles
  - move toward human runner
  - move toward closest enemy
  - area freeze readiness
  - barrier placement/readiness
  - territory checks

Constraints:

- Do not reveal the exact solution in starter XML.
- Keep the level compatible with keyboard Blockly navigation.
- If a reference solution is added, it must be canonical but not shown to students.

### Requirement 5: Tests And Docs

Required behavior:

- Update level-order tests that assume `optional-random-lab` is last.
- Add a guided contract test asserting:
  - the level exists and is optional
  - Team 1 has one human plus at least two allies
  - Team 2 has at least three active NPCs
  - both teams start with a valid carrier
  - pass condition is Team 1 scoring
  - failure pressure exists through a turn limit and, preferably, Team 2 scoring failure
- Update `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`.
- Update `TeacherGuide.md` and/or `StudentGuide.md` if they list optional labs or final level count.
- Run `npm run lint:levels` and resolve or document any new warning.

Constraints:

- Do not silence linter warnings broadly.
- If the linter needs a narrow optional-level exception, document why.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npm test
npm run build
npm run test:browser
```

If a reference solution is added, also run the focused reference solution test for the new level.

## Validation Checklist

- [ ] Plan 46 collision rule is present before this level is authored.
- [ ] New optional level appears in guided order after the final project sequence.
- [ ] Team 1 has human carrier plus at least two Blockly allies.
- [ ] Team 2 has at least three active NPC runners.
- [ ] Both teams start with valid carried-flag state.
- [ ] Team 1 scoring passes the level.
- [ ] Team 2 scoring creates a real failure pressure or the implementer stopped for owner review.
- [ ] Level is not trivially guaranteed by starting position, frozen NPCs, or solved starter code.
- [ ] Tutorial/copy explains carrier vulnerability and the both-carrier moving-attacker-loses rule.
- [ ] Starter Blockly does not reveal the exact solution.
- [ ] Level order, concept matrix, and tests agree.
- [ ] `npm run lint:levels` passes or only reports documented pre-existing warnings.
- [ ] Targeted guided tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes or any unrelated flake is documented with focused reruns.
- [ ] Progress report explains the final board setup and why it is dramatic but fair.

## Stop Conditions

Stop and report for owner review if:

- Plan 46 is not complete or collision docs/code disagree.
- The only way to make Team 2 scoring fail the level requires a broad level-state/UI rewrite.
- Existing NPC behaviors cannot create a readable double-carrier threat without a new NPC behavior family.
- The level is either trivial or consistently impossible after reasonable tuning.
- The setup requires non-spec flag placement or invalid carried-flag state.
- Reference solutions or project tests fail in a way that requires broad campaign redesign.
- Any accessibility or keyboard-navigation behavior regresses.
