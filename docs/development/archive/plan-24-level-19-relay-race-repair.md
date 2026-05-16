# Plan 24: Level 19 Relay Race Repair

## Packet Metadata

- Packet id: plan-24
- Packet title: Level 19 Relay Race Repair
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: curriculum / implementation / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - revised Level 19 setup where the human runner retrieves the enemy flag and the ally switches from defense/patrol to carrier support
  - small dynamic guided-goal support if needed for the Level 19 staging/support marker
  - updated Level 19 copy, tutorial text, and reference/test solution artifacts
  - focused tests proving the teammate-has-flag condition is load-bearing
  - subsystem note update only if runtime contracts change
  - progress report
- Progress report folder: `reports/development/plan-24-level-19-relay-race-repair/`
- Progress report file: `reports/development/plan-24-level-19-relay-race-repair/progress.md`

## Packet Summary

Goal: Repair Level 19, "Relay Race", so the newly introduced `teammate has enemy flag` condition is genuinely required. The human runner should start without the flag, retrieve the enemy flag from the enemy base, and cause the ally's goal to switch from a defensive/staging patrol point to carrier support after the human becomes the flag carrier.

Non-goals:

- Do not add a new student-facing failure rule such as "fail if the ally crosses enemy territory."
- Do not introduce territory-condition blocks in Level 19; Level 20 remains the formal territory lesson.
- Do not introduce new Blockly blocks or broaden the Level 19 toolbox beyond the teammate-flag/support movement concept unless the existing toolbox cannot express the intended solution.
- Do not redesign the guided campaign order, Level 20, advanced teamplay levels, Free Play, NPC behavior, or Plan 06/Plan 22 scaffolding.
- Do not make the level passable by an unconditional support action such as always `Move Toward human runner`.
- Do not make the level passable by an unconditional patrol action such as always `Move Up`.
- Do not install dependencies.
- Do not deploy.

Depends on:

- Plan 23 complete.
- The current guided level and reference-solution test harness.
- Existing Level 10 human-control precedent.

Blocks:

- Plan 06 playtest triage for Level 19.
- A cleaner learning bridge into later teamplay levels where teammate-carrier state matters again.

Why this packet exists:

The current Level 19 starts with the human runner already carrying the enemy flag. That means `teammate has enemy flag` is true from the first turn and never changes, so students can pass by hard-coding the true-branch support action. The repaired level should make the condition behave like the Level 3 flag-possession pattern: the correct target changes only after flag pickup. This supports AP CSA-style conditional reasoning because students must write both the false branch and the true branch.

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
  - `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
  - `src/core/levels.js`
  - `src/render/p5App.js`
  - `tests/unit/`
- Runtime contracts:
  - `docs/subsystems/turn-engine.md`
  - `docs/subsystems/ui-mode-contract.md`

Required product contracts:

- Level 19 introduces teammate-carrier support with `teammate has enemy flag`.
- Guided levels should teach one primary idea at a time; Level 19's idea is teammate flag state, not territory rules.
- Student programs still run from `On Each Turn`.
- Only the first reached action executes on a runner turn.
- Demo Blockly should show structure, not reveal the exact solution to the active puzzle.
- The app remains static Vite output.

Current-state finding to verify before mutation:

- As of packet creation, Level 19 uses `HUMAN_TURN_BEHAVIORS.AUTO_SKIP`.
- The human starts at `(6, 2)` with `hasEnemyFlag: true`.
- The ally starts at `(1, 5)`.
- The win condition is a static `runner_reaches_cell` target at `(6, 3)`.
- This allows the screenshot-style solution, unconditional `Move Toward human runner`, to pass without using the new condition.

Do not redefine:

- Collision rules, flag pickup/scoring rules, or round reset behavior.
- The Level 20 territory-condition lesson.
- Later advanced teamplay project semantics.
- The global meaning of `Move Toward human runner`.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`
- `src/core/levels.js`
- `src/core/turnEngine.js`
- `src/core/movement.js`
- `src/render/p5App.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/relay-race.xml`
- `tests/unit/helpers/testHarness.js`

Use `rg "relay-race|runner_reaches_cell|runner_reaches_cell_after_action|getLevelGoalCell|Move Toward human runner|IF_TEAMMATE_HAS_FLAG|WAIT_FOR_INPUT"` from the repository root if names have moved.

Optional/contextual:

- `src/render/drawBoard.js`
- `src/render/drawEntities.js`
- `src/config/levels/shared/blocklyXml.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/browser/guided-ui.spec.js`

## Scope

### In scope

- Revise Level 19 into a human-plus-ally relay:
  - human starts without the enemy flag, around `(1, 4)`
  - ally starts around `(4, 5)`
  - enemy flag starts in its normal enemy base/home area rather than pre-carried by the human
  - human runner is active/manual for this level
  - ally first stages/patrols defensively toward a top staging goal around `(4, 0)`
  - after the human picks up the enemy flag, the ally's goal switches to carrier support near the human
- Add small dynamic guided-goal support if needed so the rendered marker and win condition can represent "stage first, then support the carrier."
- Update Level 19 copy to suggest "defensive patrol first, then support the carrier" without spelling out every block.
- Update the Level 19 Blockly solution fixture or focused test XML so the intended structure is:

```text
if teammate has enemy flag
  move toward human runner
else
  move up
```

- Add negative tests proving unconditional `Move Toward human runner` no longer passes.
- Add negative tests proving unconditional `Move Up` no longer passes.
- Add positive tests proving the intended branch solution passes when paired with a scripted human route to the enemy flag.
- Update documentation only where the runtime contract or concept matrix changes.
- Write the Plan 24 progress report.

### Files and areas likely touched

- `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- `src/core/levels.js`
- `src/render/p5App.js` only if goal marker behavior requires no source change beyond `getLevelGoalCell`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/relay-race.xml`
- `tests/unit/helpers/testHarness.js`
- Possibly a new focused unit test file under `tests/unit/`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` if wording needs to reflect active human relay
- `docs/subsystems/turn-engine.md` only if a new win-condition type changes the documented level-completion contract
- `reports/development/plan-24-level-19-relay-race-repair/progress.md`

### Out of scope

- A new early-failure condition for crossing enemy territory.
- Territory condition toolbox changes in Level 19.
- Any new human-control tutorial system beyond copy that reminds students they control the human runner.
- Broad goal-rendering redesign.
- Changes to Level 20 or later project levels.
- Plan 06 Gemini prompt edits unless the implementer discovers stale Level 19-specific instructions that would actively block validation.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

## Work Plan

1. Inspect current Level 19 and confirm that unconditional support can pass today.
2. Design the smallest dynamic-goal/win-condition mechanism needed for "stage first, support after teammate flag pickup."
3. Revise Level 19 setup, copy, toolbox constraints, and tutorial text.
4. Update or add focused tests, including positive and negative behavior tests.
5. Update the reference solution fixture or focused relay test XML as appropriate.
6. Update docs/subsystem notes only if contracts changed.
7. Run targeted validation and broader validation.
8. Write the progress report with commands run, behavior choices, and any residual risks.

## Implementation Requirements

### Requirement 1: Human-plus-ally relay setup

Required behavior:

- Level 19 uses an active/manual human runner, not auto-skip.
- The human starts without `hasEnemyFlag`.
- The enemy flag starts in its normal enemy base/home area.
- The ally starts around `(4, 5)`.
- The human starts around `(1, 4)`, close enough that unconditional `Move Toward human runner` pulls the ally away from the staging goal before flag pickup.
- Opponent runners may remain frozen/harmless unless a small visual adjustment helps classroom readability.

Constraints:

- Keep the level readable on `simpleAisle` unless a small map choice change is clearly justified and documented.
- Do not force the ally into enemy territory before the human has the flag.
- Keep the level solvable without precise keyboard speedrunning.

Edge cases:

- The human path to the enemy flag must be clear.
- The ally staging path to `(4, 0)` or the final approved staging cell must be clear.
- The final support target must not be occupied by the human.

Expected artifact or code change:

- Revised Level 19 setup and `humanTurnBehavior`.

### Requirement 2: Dynamic staged/support goal

Required behavior:

- Before any teammate has the enemy flag, the visible goal marker points to the ally's defensive staging/patrol cell around `(4, 0)`.
- After a teammate has the enemy flag, the visible goal marker switches to an open support square adjacent to or near the human carrier.
- The win condition should pass only after the teammate has the flag and the ally reaches the support goal.

Constraints:

- Prefer a small, named guided win-condition/goal helper over a broad level-engine rewrite.
- Keep the implementation generic enough to be understandable, but do not over-engineer for hypothetical future levels.
- Do not add a new failure UI or a forbidden-territory failure condition.
- Preserve existing static goal marker behavior for all other levels.

Edge cases:

- If the support square adjacent to the human is occupied or blocked, choose a deterministic open adjacent support square.
- If no support square is available, do not crash; the level should continue and tests should reveal the authored-board issue.
- The goal marker should not jump unpredictably among adjacent cells every frame.

Expected artifact or code change:

- Small `getLevelGoalCell` / `evaluateLevelProgress` support for Level 19's dynamic staged relay goal, or an equivalent narrow mechanism.

### Requirement 3: Make teammate condition load-bearing

Required behavior:

- The intended ally program uses `if teammate has enemy flag else`.
- The false branch should send the ally toward the staging/patrol goal, likely `Move Up`.
- The true branch should send the ally to support the human carrier, likely `Move Toward human runner`.

Constraints:

- The level must not be passable with unconditional `Move Toward human runner`.
- The level must not be passable with unconditional `Move Up`.
- The level must not require territory-condition blocks.
- Avoid a setup where the correct branch logic works only because of exact turn-order luck.

Edge cases:

- If the human reaches the flag before the ally reaches the staging goal, the level should still make sense and remain solvable.
- If the ally reaches the staging goal early, it should be able to wait or bounce harmlessly until the human has the flag.

Expected artifact or code change:

- Updated Level 19 level data and tests proving the condition matters.

### Requirement 4: Copy and pedagogy

Required behavior:

- Rewrite Level 19 description, intro, tips, and tutorial steps to frame the story:
  - the ally patrols or stages on defense first
  - the human retrieves the enemy flag
  - once a teammate has the flag, the ally switches to support
- The directions may be suggestive, but should not paste the exact full solution.

Constraints:

- Use student-facing language that distinguishes the human's job from the ally program's job.
- Avoid implying that `Move Toward human runner` is always correct.
- Preserve the "teammate condition is true when another runner on your team has the flag" explanation.
- Demo Blockly must show conditional structure without revealing the exact Level 19 solution.

Edge cases:

- If the level uses manual human control, the copy must say so plainly enough that students and browser-agent playtests do not miss it.

Expected artifact or code change:

- Updated Level 19 copy and tutorial text.

### Requirement 5: Focused tests

Required behavior:

- Add or update tests to prove:
  - Level 19 uses manual human input.
  - Human starts without the enemy flag.
  - Enemy flag starts at its normal enemy home/base position.
  - The initial goal marker is the staging/patrol cell.
  - After the human has the flag, the goal marker becomes a support cell near the human.
  - The intended `if teammate has enemy flag else` ally program passes with a scripted human route.
  - Unconditional `Move Toward human runner` fails.
  - Unconditional `Move Up` fails.

Constraints:

- Do not rely only on the global non-project guided reference solution test if Level 19 becomes `WAIT_FOR_INPUT`; that suite excludes manual-human levels.
- Add a focused helper or test path that can script human actions while running Blockly for the ally.
- Keep tests deterministic and fast.

Edge cases:

- The scripted human route should be clear and documented inside the test.
- If Level 19 is excluded from the generic reference-solution test because of `WAIT_FOR_INPUT`, make that explicit in the focused test name or comments.

Expected artifact or code change:

- Focused unit coverage for Level 19 relay behavior.

### Requirement 6: Documentation and contract tail

Required behavior:

- Update `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` only if the Level 19 row needs wording that better reflects active human relay/staged support.
- If a new guided win-condition type or dynamic goal-marker contract is added, update the relevant subsystem note. Most likely:
  - `docs/subsystems/turn-engine.md` if level completion semantics change
  - `docs/subsystems/ui-mode-contract.md` if guided UI state/marker behavior is materially described there

Constraints:

- Keep doc updates narrow.
- Do not silently invalidate subsystem notes.

Expected artifact or code change:

- Docs still read true after the source changes.

## Model-Specific Instructions

- Start by summarizing the current Level 19 issue in your own words before editing.
- Keep the write scope small and Level-19-centered.
- Do not add a forbidden-side failure condition; the owner chose the dynamic staged/support goal instead.
- Build the negative tests before tuning the board, so you do not accidentally preserve the screenshot solution.
- Stop if the only way to make the level work is a broad guided-engine rewrite, a new student-facing UI system, or a toolbox expansion that changes the intended Level 19 concept.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/scoring-and-level-state.test.js tests/unit/guided-reference-solutions.test.js
npm test
npm run build
```

Run browser tests only if visible guided UI, layout, tutorial overlay behavior, or marker rendering is changed beyond the existing `getLevelGoalCell` path:

```powershell
npm run test:browser
```

## Validation Checklist

- [ ] Level 19 starts with an active/manual human runner.
- [ ] Human starts without the enemy flag.
- [ ] Enemy flag starts in its normal enemy base/home area.
- [ ] Ally starts near `(4, 5)` and has a clear first staging/patrol goal near `(4, 0)`.
- [ ] The initial goal marker shows the staging/patrol goal.
- [ ] After the human has the enemy flag, the goal marker switches to carrier support near the human.
- [ ] The level passes only when the ally reaches support after the teammate has the flag.
- [ ] The intended branch solution passes with a scripted human route.
- [ ] Unconditional `Move Toward human runner` fails.
- [ ] Unconditional `Move Up` fails.
- [ ] Level 19 copy suggests defense/patrol first, then support, without giving away the exact program.
- [ ] Demo Blockly still illustrates structure without revealing the exact solution.
- [ ] Level 20 remains the territory-condition lesson.
- [ ] Targeted tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes if required by UI/render changes.
- [ ] Any touched subsystem note still reads true.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run and remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- The dynamic staged/support goal requires broad engine or renderer redesign.
- Manual human input makes the level too hard to test deterministically without large harness changes.
- The board cannot make both branches load-bearing without introducing a second Blockly concept.
- The only successful setup requires exact timing that students cannot reasonably infer.
- Existing docs/source disagree in a way that changes the packet scope.
- A subsystem note would become false and the needed correction requires product or architecture judgment beyond this packet.
- A dependency, workflow, deployment, or production action would be needed.
