# Plan 68: Guided Level Scoring-Rule Repairs

- Packet id: Plan 68
- Packet title: Guided Level Scoring-Rule Repairs
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: before broad level redesign; see stop conditions
- Expected artifacts:
  - Guided level audit under the new scoring rule
  - Targeted level/source/fixture repairs
  - Updated concept matrix and docs where lesson intent changes
  - Progress report with before/after validation
- Progress report folder: `reports/development/plan-68-guided-level-scoring-rule-repairs/`
- Progress report file: `reports/development/plan-68-guided-level-scoring-rule-repairs/progress.md`

## Packet Summary

Goal: Repair guided-level and curriculum fallout from Plan 67's rule that a carrier can score only when its own flag is home.

Non-goals:
- Do not change core scoring rules.
- Do not change CPU strategy globally.
- Do not add new Blockly blocks.
- Do not reorder the guided campaign unless explicitly approved.
- Do not rewrite large parts of the campaign to teach a new full unit.
- Do not reference other product versions or external variants of the game in docs, comments, tests, reports, or UI copy.

Depends on:
- Plan 67 implemented, with progress report listing exact level/test fallout.

Blocks:
- Integration of the scoring-rule change if required guided levels fail.
- Plan 69 CPU scoring-rule adaptation may depend on the level repairs staying stable.

Why this packet exists:
The new scoring rule adds real strategic value, but it can change the difficulty and meaning of levels where live opponents can carry the player's flag. Guided levels must remain coherent: each level should teach its intended concept, turn limits should allow learning, and optional double-carrier content should make the new rule legible instead of feeling broken.

## Authority And Contracts

Required project contracts:
- Guided mode should generally teach one primary concept at a time unless marked as synthesis, challenge, project, or optional lab.
- Demo Blockly should show structure, not reveal the exact solution.
- Win conditions should require the mechanic the lesson claims to teach.
- Reference and project fixtures must match authored levels.
- Level count, order, concept matrix, manifest, and tests must agree.
- If behavior described in `docs/subsystems/*.md` changes, update the matching note or stop.

Do not redefine:
- Plan 67 scoring behavior.
- Plan 46 collision rules.
- Plan 55 game-over/level-result invariant.
- Project shared-workspace architecture.

## Required Reading

Read before editing:
- `reports/development/plan-67-own-flag-home-scoring-rule/progress.md`
- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `reports/development/plan-47-optional-double-carrier-showdown/progress.md`
- `src/config/levels/phases/advanced-teamplay/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`

Use `rg` to find:
- `team_scores_point`
- `failureCondition`
- `failureConditions`
- `turn_limit_exceeded`
- `startsWithFlag`
- `hasEnemyFlag`
- `optional-double-carrier-showdown`
- `full-team-tactics`
- `advanced-scrimmage`

## Scope

### In Scope

- Audit all guided levels under the Plan 67 scoring rule.
- Repair levels that fail validation or become pedagogically misleading because own-flag-home scoring is required.
- Update reference and project fixtures when level behavior changes.
- Update authored test scripts for affected levels.
- Update turn limits where the new rule legitimately requires more time.
- Update tutorial/copy/concept-matrix wording where a lesson now depends on defending or recovering the own flag.
- Preserve optional-lab status for optional content unless the integration owner approves removal or major relocation.

### Out Of Scope

- Core scoring logic.
- Global CPU behavior changes outside level-local authored behavior decisions.
- New UI systems.
- New Blockly blocks.
- New level-authoring tools.
- Broad campaign restructuring.
- GitHub workflow or deployment edits.

### Files And Areas Likely Touched

- `src/config/levels/phases/advanced-teamplay/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`
- Other level configs listed in the Plan 67 progress report
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/fixtures/guided-reference-solutions/`
- `tests/unit/fixtures/guided-project-solutions/`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md` or `docs/StudentGuide.md` only if their scoring explanations become incomplete
- `reports/development/plan-68-guided-level-scoring-rule-repairs/progress.md`

## Implementation Requirements

### 1. Level Audit

Required behavior:
- Start by reproducing Plan 67's guided-level failures.
- Classify each affected level:
  - unaffected
  - validation-only fixture update
  - copy/turn-limit adjustment
  - authored setup repair
  - redesign requiring owner review

Pay special attention to:
- Level 28 `full-team-tactics`
- Level 37 `advanced-scrimmage`
- Level 39 `optional-double-carrier-showdown`

### 2. Required-Level Repairs

Required behavior:
- Required guided/project levels must remain passable and aligned with their intended concept.
- If a live opponent can now steal the player's flag and block scoring, decide whether this is intended challenge or accidental difficulty.
- Prefer small authored repairs over broad simplification.

Constraints:
- Do not silently lower difficulty in synthesis/project levels.
- Do not change project membership or shared-workspace policy.
- Do not remove live opponents from a level unless the packet report justifies why the lesson would otherwise shift off target.

### 3. Optional Double-Carrier Level

Required behavior:
- Under the new scoring rule, `optional-double-carrier-showdown` should make clear that scoring requires recovering or protecting the team's own flag.
- If preserving the level, update setup, turn cap, instructions, pass/fail conditions, and scripted validation so the intended strategy is possible and legible.

Owner-review threshold:
- Stop for owner review if the level requires a complete redesign of map, runner count, NPC behavior, and lesson framing.
- Stop for owner review if the best fix is to remove, hide, or relocate the level.

### 4. Tests And Fixtures

Required behavior:
- Update reference/project fixtures only for levels whose correct solution changes.
- Keep fixture changes targeted and explain each one in the progress report.
- Add or adjust contract tests for any revised special case.

Constraints:
- Do not update snapshots or fixtures just to make tests green without checking the level's learning purpose.
- Do not let demo Blockly reveal exact solutions.

### 5. Documentation

Required behavior:
- Update the concept matrix if a level's concept, support concept, or prerequisite changes.
- Update teacher/student docs only where their scoring or level guidance becomes misleading.

Constraints:
- Phrase all docs as Browser Battlegorithms rules and teaching notes.
- Do not mention external or alternate product versions.

## Work Plan

1. Read Plan 67 progress report and reproduce the listed guided failures.
2. Audit Level 28, Level 37, Level 39, and any other failed levels.
3. Propose the smallest repair for each affected level.
4. Implement repairs that do not cross owner-review thresholds.
5. Update fixtures/tests/docs to match actual level behavior.
6. Run targeted guided validation.
7. Run broad validation.
8. Write a progress report listing each audited level and its outcome.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js tests/unit/scoring-and-level-state.test.js
npm test
npm run build
```

If level UI/copy/tutorial behavior changes materially:

```powershell
npx playwright test tests/browser/guided-play.spec.js tests/browser/guided-ui.spec.js --reporter=line
```

## Validation Checklist

- [ ] Plan 67 guided failures are reproduced or explained if they no longer reproduce.
- [ ] Each affected guided level is classified in the progress report.
- [ ] Required levels remain passable.
- [ ] Optional double-carrier level is either repaired or explicitly stopped for owner review.
- [ ] Reference/project fixtures match authored behavior.
- [ ] Concept matrix agrees with level source.
- [ ] `npm run lint:levels` has no new unapproved warnings/errors.
- [ ] Guided reference and project solution tests pass, or unresolved failures are explicitly owner-gated.
- [ ] `npm test` result is reported honestly.
- [ ] `npm run build` passes.
- [ ] No core scoring or CPU strategy changes were made.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and ask for owner review if:
- A required level needs broad redesign rather than a targeted repair.
- Level 39's best repair would remove its double-carrier premise.
- The fix requires changing core scoring behavior from Plan 67.
- The fix requires global CPU behavior changes.
- Updating a fixture would hide a real teaching regression.
- A doc/source mismatch changes lesson intent or campaign progression.

