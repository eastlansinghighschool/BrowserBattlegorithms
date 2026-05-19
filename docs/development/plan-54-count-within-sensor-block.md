# Plan 54: Count-Within Sensor Block

## Packet Metadata

- Packet id: plan-54
- Packet title: Count-Within Sensor Block
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: implementation / blockly-authoring / curriculum / source-code / tests / docs
- Mutation level: source-code / tests / docs
- Approval gate: before adding new countable object types beyond the four locked in Decision 4, changing the distance metric from Manhattan, accepting block-input variants for the distance dropdown, authoring new guided levels around the new block, or extending Plan 38 coaching to recognize count-within patterns
- Expected artifacts:
  - new Blockly value block `battlegorithms_value_count_within` returning a number, with object and distance dropdowns
  - new `ALLY_RUNNER` entry in `SENSOR_OBJECT_TYPES`
  - sensing logic in `src/core/conditions.js` for counting objects within Manhattan distance
  - Strategy Brain and Team Strategy Script project toolboxes include the new block
  - Free Play default toolbox includes the new block
  - existing boolean sensor block (`battlegorithms_boolean_sensor_matches`) wired to accept `ALLY_RUNNER` for symmetry
  - unit tests for count evaluation at varied positions and object configurations
  - Plan 25a trace collection verified for the new value block
  - subsystem doc update in `docs/subsystems/blockly-workspace.md`
  - future-directions note documenting the deferred curriculum work (introduction level, bug hunt, prediction level)
  - progress report
- Progress report folder: `reports/development/plan-54-count-within-sensor-block/`
- Progress report file: `reports/development/plan-54-count-within-sensor-block/progress.md`

## Packet Summary

Goal: Add one new Blockly value block — `count of <object> within <distance> spaces` — that returns a number students can plug into the existing `battlegorithms_value_compare` block. The block introduces aggregate sensing: students move from "is there an enemy directly in front?" (boolean atom) to "are there 2 or more enemies within 3 spaces?" (counted threshold). That's a real AP CSA-flavored reasoning step.

The block lives in the Strategy Brain project toolbox, the Team Strategy Script project toolbox, and the Free Play default toolbox. It is **not** added to any individual L1-L22 guided level toolbox; project toolboxes are the first place students encounter it. New guided levels that explicitly teach or test count-within are **deferred** to a future-directions note so that students currently in pilot are not disturbed.

The block also requires extending `SENSOR_OBJECT_TYPES` with a new `ALLY_RUNNER` value. To avoid student-facing asymmetry (count enemies but not allies in boolean sensor), the new enum entry is also wired into the existing `battlegorithms_boolean_sensor_matches` block.

Non-goals:

- Do not author new guided levels in this packet. Introduction lessons, bug hunts, and prediction levels using count-within are deferred to `docs/development/future-directions-analysis/`.
- Do not change any game rule (action budget, collision priority, scoring, jump/freeze/barrier semantics).
- Do not change reference solutions for any existing level. Existing solutions keep working unchanged; count-within is purely additive.
- Do not change the distance metric. The new block uses Manhattan distance (`|deltaX| + |deltaY|`), matching the existing `WITHIN_N` convention at [conditions.js:122](src/core/conditions.js:122).
- Do not accept block inputs for the object or distance dropdowns. Both are fixed-enum `<field>` dropdowns, matching the existing sensor-relation pattern.
- Do not add countable objects beyond the four locked in Decision 4. `EDGE_OR_WALL` and `ENEMY_FLAG` are explicitly out.
- Do not extend the new block's availability to any L1-L22 individual level. Project toolboxes (Strategy Brain, Team Strategy Script) and Free Play default are the only entry points.
- Do not extend Plan 38 coaching prose to recognize count-within patterns in this packet (deferred to a future Plan 38 follow-up if classroom evidence warrants).
- Do not deploy.

Depends on:

- Existing value-block infrastructure (e.g., `battlegorithms_value_distance_to_target`, `battlegorithms_value_number`) as the structural pattern.
- Existing `battlegorithms_value_compare` block (the consumer of the new block's number output).
- Plan 25a trace collection (verifies the new value block's evaluation is traced correctly).
- Plan 51 (game spec restructure) **complete** — the Blockly catalog now lives in `docs/subsystems/blockly-workspace.md`; this packet updates that catalog directly.

Blocks:

- Future Plan 54-follow-up packets that author the deferred curriculum (introduction lesson, bug hunt, prediction level).
- Future Plan 38 coaching extensions that recognize count-related learning moments.
- Any future strategic level design that wants to invite count-and-threshold reasoning.

Why this packet exists:

The Strategy Brain project arc teaches students to compose boolean conditions, runner-index roles, and resource readiness checks into a single shared program that drives multiple allies. The natural next pedagogical step is aggregate sensing — counting things and deciding on a threshold. Today the only way for a student to express "if there are 2 or more enemies near me, retreat" is to chain individual directional sensors with AND/OR compositions, which both clutters the workspace and obscures the underlying counting concept. Count-within names the concept directly.

A pilot student or teacher hasn't surfaced this gap explicitly, but the orchestrator and integration owner identified it on 2026-05-18 as a natural extension. The new block is bounded (Manhattan distance ≤ 6, four object types) and composes cleanly with existing infrastructure (returns a number into existing compare). The work fits one focused packet.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-18):

### Decision 1: Block name and shape — `battlegorithms_value_count_within`

The new block:

- **Type**: `battlegorithms_value_count_within`.
- **Category**: same Blockly category as other value blocks (likely "Sensing" or "Values" — implementer matches the home of `battlegorithms_value_distance_to_target`).
- **Color**: matches existing value blocks for visual consistency.
- **Output**: Number.
- **Inputs**: two `<field>` dropdowns:
  - `OBJECT` — fixed enum drawn from the countable subset of `SENSOR_OBJECT_TYPES` (Decision 4).
  - `DISTANCE` — fixed enum, integer values `1` through `6` inclusive.
- **Display text** (suggested, implementer may polish): `count of <OBJECT> within <DISTANCE> spaces`.

### Decision 2: Distance metric — Manhattan, matching existing `WITHIN_N`

The count includes any object whose grid position satisfies `|deltaX| + |deltaY| <= distance`, where deltas are computed from the runner evaluating the block. This is the same metric used by [conditions.js:122](src/core/conditions.js:122) for the existing `WITHIN_N` relation family. Diamond shape, not box.

Rationale: consistency with established student mental model. Students who have learned "within 2 spaces" already think Manhattan; the new block reuses the same intuition.

### Decision 3: Distance dropdown range — 1 through 6

The `DISTANCE` dropdown offers integers `1`, `2`, `3`, `4`, `5`, `6`. Matches the existing `WITHIN_N` enum cap. `1` is meaningful (counts strictly adjacent cells); `6` is the maximum strategic range without revealing the whole board.

### Decision 4: Countable objects — four locked

The `OBJECT` dropdown offers exactly four options:

- `ENEMY_RUNNER` — defensive sensing (primary use case).
- `BARRIER` — terrain density / corridor detection.
- `HUMAN_RUNNER` — team support strategies.
- `ALLY_RUNNER` — **new enum entry**. Enables peer-coordination logic (e.g., "should I help my ally or branch off?").

Explicitly excluded:

- `EDGE_OR_WALL` — would enable corridor detection but creates a different mental model (static map vs. moving entities). Conceptual noise outweighs benefit.
- `ENEMY_FLAG` — there's only one flag. Count is 0 or 1. Use the existing boolean sensor instead.

### Decision 5: `ALLY_RUNNER` enum extension — symmetric across blocks

`SENSOR_OBJECT_TYPES` at [constants.js:69-75](src/config/constants.js:69) gains `ALLY_RUNNER: "ALLY_RUNNER"`. To avoid student-facing asymmetry (countable but not directly sensable), the new value is **also wired into**:

- The existing boolean sensor block `battlegorithms_boolean_sensor_matches` — students can now ask "is there an ally directly in front?" the same way they ask about enemies.
- Any other sensor block that uses `SENSOR_OBJECT_TYPES` as its dropdown source (implementer verifies the full list).

Rationale: students should not encounter a dropdown where ENEMY_RUNNER appears for boolean sensing AND counting, but ALLY_RUNNER only appears for counting. Symmetry preserves the mental model.

### Decision 6: Self-exclusion rule — the counting runner does not count itself

When a runner evaluates `count of ALLY_RUNNER within N spaces`, the result does **not** include the evaluating runner. The runner is not its own ally for counting purposes. Similarly:

- `count of HUMAN_RUNNER` excludes the evaluating runner if the evaluating runner is itself the human.
- `count of ENEMY_RUNNER` is unaffected (the evaluator is by definition not on the enemy team).
- `count of BARRIER` is unaffected (barriers are not runners).

Rationale: the program is asking "how many other X are near me?" That's the strategically useful question.

### Decision 7: Frozen/jailed inclusion rule

Frozen runners (any `isFrozen` runner) **are included** in the count. They occupy cells and matter strategically (a frozen ally near you is still a positional fact).

Jailed runners (any runner currently serving a jail sentence, if Browser Battlegorithms's engine has that concept active — the implementer should verify against current code) **are excluded**. Jail cells are out of play.

Implementer's note: the existing sensor logic in `conditions.js` already has the right "is this runner on the board and active" semantics for other sensor blocks; the count-within block should reuse the same filter rather than reinventing one. Match existing behavior; document the choice in the progress report.

### Decision 8: Toolbox availability — project arcs and Free Play default only

The new block appears in:

- `src/config/levels/shared/projectToolboxes.js` → Strategy Brain project toolbox.
- `src/config/levels/shared/projectToolboxes.js` → Team Strategy Script project toolbox.
- `src/config/levels/shared/toolboxes.js` (or wherever Free Play default lives) → Free Play default toolbox.

The block does **not** appear in any individual L1-L22 guided level toolbox. Students first encounter it when they enter the Strategy Brain project (L23+). The Team Strategy Script arc continues to expose it. Free Play exposes it for open experimentation.

This timing prevents pilot students currently working through L1-L22 from seeing a new block before they're conceptually ready.

### Decision 9: New levels deferred to future-directions

This packet does **not** author:

- An introduction level teaching count-within (anticipated as a small precursor in the L23-L27 arc).
- A bug hunt featuring a count-within bug (e.g., wrong comparison operator).
- A prediction level around count thresholds.
- Updated reference solutions that demonstrate count-within use in project levels.

These are deferred to a new file at `docs/development/future-directions-analysis/count-within-curriculum-introduction.md`, authored as part of this packet. The note enumerates the deferred items, their proposed shape, and the classroom-evidence triggers that would prompt picking them up.

Rationale: introducing new guided levels mid-pilot disturbs students who are already mid-arc. The block itself can land safely (it's additive); the lessons that frame it can wait for the next curriculum cycle.

### Decision 10: Reference solutions stay unchanged

Existing reference solution fixtures for L23-L37 (Strategy Brain and Team Strategy Script projects) continue to pass without modification. Count-within is permitted as a more elegant alternative but is not required. The implementer does not rewrite any reference solution to use count-within in this packet.

If the implementer notices a project reference solution that would be substantially cleaner with count-within, they may note it in the future-directions file as a deferred curriculum opportunity. No code change.

## Authority And Contracts

Sources of truth:

- `src/config/constants.js` — `SENSOR_OBJECT_TYPES` and `SENSOR_RELATION_TYPES` enums (extended with `ALLY_RUNNER`; new block type constant)
- `src/ai/blockly/blocks.js` — block definitions, including the new value block and the existing boolean sensor that gains `ALLY_RUNNER`
- `src/ai/blockly/interpreter.js` — block evaluation pipeline (new evaluator wired in)
- `src/core/conditions.js` — sensor evaluation logic (new count function)
- `src/config/levels/shared/projectToolboxes.js` — Strategy Brain and Team Strategy Script project toolboxes
- `src/config/levels/shared/toolboxes.js` — Free Play default toolbox
- `docs/subsystems/blockly-workspace.md` — Blockly catalog (post-Plan-51 home; updated)
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — light touch for project-arc rows mentioning block availability
- `docs/StudentGuide.md`, `docs/TeacherGuide.md` — vocabulary mention if those docs enumerate Blockly blocks
- `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` — new file (this packet creates it)
- `scripts/lint-levels.js` — `challenge-introduces-no-new-block` and `bug-hunt-introduces-no-new-block` contracts must remain satisfied; verify they correctly classify count-within as "introduced at Strategy Brain project entry"

Required product contracts:

- The new block returns a non-negative integer.
- Manhattan distance metric matches existing `WITHIN_N` semantics.
- Self-exclusion holds for `ALLY_RUNNER` and `HUMAN_RUNNER` (when the evaluator is the human).
- Frozen runners are counted; jailed runners (if any) are not.
- The block is available in Strategy Brain, Team Strategy Script, and Free Play default toolboxes.
- The block is NOT available in any L1-L22 individual guided level toolbox.
- `ALLY_RUNNER` is available as a dropdown option in the new count-within block AND the existing boolean sensor block.
- Existing reference solution tests for L1-L37 pass unchanged.
- Plan 25a trace collection records the new block's evaluation (a number) the same way it records `battlegorithms_value_distance_to_target`.
- `npm run lint:levels` passes with no new errors.
- The app remains a static Vite deployment.

Do not redefine:

- The Manhattan distance metric for any other sensor block.
- The semantic of `SENSOR_RELATION_TYPES`. Count-within does not use this enum.
- Reference solutions for any guided level.
- Lesson copy or tutorial steps for any project level.
- Game rules of any kind.
- Plan 36 narration text.
- Plan 37 learning moment classification (although future Plan 38 extension may recognize count-within patterns).
- Plan 38 coaching prose.
- Free Play game modes or rules.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md` — post-Plan-51 Blockly catalog and authoring conventions
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — for project-arc context
- `src/config/constants.js` — enum shapes
- `src/core/conditions.js` — sensor evaluation and the Manhattan distance pattern at line 122
- `src/ai/blockly/blocks.js` — block definition patterns; focus on `battlegorithms_value_distance_to_target` and `battlegorithms_boolean_sensor_matches` as structural models
- `src/ai/blockly/interpreter.js` — block evaluation wiring
- `src/config/levels/shared/projectToolboxes.js` — project toolbox shape
- `src/config/levels/shared/toolboxes.js` — Free Play default toolbox
- `tests/unit/blockly-interpreter.test.js` — pattern for new evaluator tests
- `tests/unit/conditions.test.js` (if it exists) — pattern for new sensor logic tests
- `tests/unit/guided-project-solutions.test.js` — confirm existing project reference solutions stay green
- A representative project level (e.g., `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`) — see how project toolboxes are wired into a level definition
- Plan 25a archived packet (`docs/development/archive/plan-25a-blockly-trace-collection.md`) — trace shape for value blocks

Use `rg "battlegorithms_value_distance_to_target|battlegorithms_boolean_sensor_matches|SENSOR_OBJECT_TYPES|projectToolboxes"` from the repository root to surface every touch point.

## Scope

### In scope

- New constant in `src/config/constants.js`: `ALLY_RUNNER: "ALLY_RUNNER"` added to `SENSOR_OBJECT_TYPES`.
- New block type constant (e.g., a `BLOCK_TYPES` entry if such a registry exists) for `battlegorithms_value_count_within`.
- New block definition in `src/ai/blockly/blocks.js`: visual shape, dropdowns, color, output type, registration.
- Wiring `ALLY_RUNNER` into the existing `battlegorithms_boolean_sensor_matches` block's `OBJECT` dropdown options.
- New evaluation function in `src/core/conditions.js`: `countObjectsWithin(runner, objectType, distance, state)` returning a non-negative integer. Self-exclusion and frozen/jailed rules per Decisions 6 and 7.
- New evaluator in `src/ai/blockly/interpreter.js` wiring the new block to the count function.
- Toolbox updates in `src/config/levels/shared/projectToolboxes.js` (Strategy Brain + Team Strategy Script) and `src/config/levels/shared/toolboxes.js` (Free Play default).
- Unit tests in `tests/unit/blockly-interpreter.test.js` (or new `tests/unit/count-within.test.js`): count returns expected number for varied positions, distances, object types, and edge cases (no objects within range; object at exact distance limit; counting `ALLY_RUNNER` excludes self; counting `HUMAN_RUNNER` excludes self if evaluator is the human).
- Unit test verifying Plan 25a trace collection records the new block's evaluation.
- Subsystem doc update in `docs/subsystems/blockly-workspace.md` describing the new block.
- Light touch on `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` to note count-within is introduced at the Strategy Brain project arc.
- Light touch on `docs/StudentGuide.md` and `docs/TeacherGuide.md` if they enumerate Blockly blocks.
- New file `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` enumerating deferred curriculum work.
- Progress report including: tuning choices, frozen/jailed semantics confirmed against existing code, list of toolboxes updated, sample workspace XML that exercises the new block, list of tests added.

### Files and areas likely touched

- `src/config/constants.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/interpreter.js`
- `src/core/conditions.js`
- `src/config/levels/shared/projectToolboxes.js`
- `src/config/levels/shared/toolboxes.js`
- `tests/unit/blockly-interpreter.test.js` (additions) or `tests/unit/count-within.test.js` (new)
- `tests/unit/guided-project-solutions.test.js` (verify, do not modify)
- `tests/unit/blockly-trace-collection.test.js` (additions if needed for trace verification)
- `docs/subsystems/blockly-workspace.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`, `docs/TeacherGuide.md` (light or none)
- `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` (new)
- `reports/development/plan-54-count-within-sensor-block/progress.md`
- `package.json` (add the new test file to `test:unit` allowlist if a new file is created)

### Out of scope

- Authoring any new guided level, bug hunt, or prediction level.
- Updating reference solutions for any existing project level.
- Adding count-within to any L1-L22 individual level toolbox.
- Countable objects beyond the four locked (no `EDGE_OR_WALL`, no `ENEMY_FLAG`, no others).
- Block input variants (no value-block inputs to the distance dropdown).
- Distance metrics other than Manhattan.
- Plan 38 coaching prose recognition of count-within patterns.
- Plan 37 learning moment kinds for count-related programs.
- Game rule changes.
- Plan 36 narration changes.
- Renaming or restructuring existing sensor blocks.
- Vertical-relation pairing (Plan 53 owns that).
- Deployment.

## Work Plan

1. Read every required-reading file. Verify the post-Plan-51 catalog shape in `docs/subsystems/blockly-workspace.md`. Confirm Plan 25a's value-block trace pattern.
2. Add `ALLY_RUNNER` to `SENSOR_OBJECT_TYPES` in `constants.js`. Run all tests; confirm green (the enum extension alone is inert until wired).
3. Wire `ALLY_RUNNER` into the existing `battlegorithms_boolean_sensor_matches` block's `OBJECT` dropdown. Add a small unit test confirming the boolean sensor correctly identifies an ally in front. Run tests; confirm green.
4. Add the `countObjectsWithin` function to `src/core/conditions.js`. Pure function: takes runner, objectType, distance, and the live state's runner+barrier list. Apply Decisions 6 (self-exclusion) and 7 (frozen-included, jailed-excluded). Add unit tests covering varied positions and object configurations BEFORE wiring the block.
5. Add the `battlegorithms_value_count_within` block definition in `blocks.js`. Wire its evaluator in `interpreter.js` to call `countObjectsWithin`.
6. Add the new block to the Strategy Brain project toolbox, the Team Strategy Script project toolbox, and the Free Play default toolbox.
7. Verify Plan 25a trace collection records the new block's evaluation. Add a focused trace test if the existing trace tests don't already cover this pattern.
8. Run existing project reference solution tests. Confirm they pass unchanged.
9. Update `docs/subsystems/blockly-workspace.md` catalog with the new block. Light edits to `GUIDED_LEVEL_CONCEPT_MATRIX.md`. Sweep `StudentGuide.md` and `TeacherGuide.md` for any block enumeration that would otherwise be incomplete.
10. Author `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` per Decision 9.
11. Run full validation. Write the progress report.

## Implementation Requirements

### Requirement 1: `ALLY_RUNNER` enum extension (Decision 5)

Required behavior:

- `SENSOR_OBJECT_TYPES` in `src/config/constants.js` gains `ALLY_RUNNER: "ALLY_RUNNER"`.
- The existing `battlegorithms_boolean_sensor_matches` block's `OBJECT` dropdown includes the new value with student-facing label `ally`.
- All sensor logic that branches on `SENSOR_OBJECT_TYPES` is updated to handle `ALLY_RUNNER` correctly. For boolean sensing, "is there an ally in relation R?" returns true if any same-team runner (excluding the evaluator) satisfies the relation.
- A unit test confirms the boolean sensor with `ALLY_RUNNER` returns true when an ally is in the expected position and false otherwise.

Constraints:

- Do not break any existing sensor evaluation. All existing object types continue to work identically.
- Self-exclusion: the evaluating runner is not its own ally for sensing purposes.
- Frozen allies count (consistent with Decision 7).

### Requirement 2: `countObjectsWithin` evaluation logic (Decisions 2, 4, 6, 7)

Required behavior:

- New function in `src/core/conditions.js` with signature roughly:
  ```js
  export function countObjectsWithin(runner, objectType, distance, state) { ... }
  ```
- Returns a non-negative integer.
- For `ENEMY_RUNNER`: counts active opposing-team runners within Manhattan distance `<= distance`.
- For `ALLY_RUNNER`: counts active same-team runners (excluding the evaluator) within Manhattan distance `<= distance`.
- For `HUMAN_RUNNER`: counts the human-controlled runner if within distance (excluding the evaluator if the evaluator is the human).
- For `BARRIER`: counts placed barriers within distance.
- Frozen runners are included. Jailed runners (if Browser Battlegorithms's engine has that state — verify) are excluded.
- Manhattan distance: `|runner.gridX - other.gridX| + |runner.gridY - other.gridY| <= distance`.

Constraints:

- Pure function. No state mutation.
- Reuse the existing "is this runner active / on the board" filter from current sensor evaluation rather than reinventing. Match existing behavior; document the choice.
- Distance must be a non-negative integer; values outside the 1-6 dropdown range are not expected at runtime, but the function should return a sensible result (likely 0 for distance < 1) without throwing.

### Requirement 3: New Blockly block definition (Decision 1)

Required behavior:

- New block type `battlegorithms_value_count_within` registered in `src/ai/blockly/blocks.js`.
- Block shape: value block with Number output, two `<field>` dropdowns (`OBJECT`, `DISTANCE`).
- `OBJECT` dropdown options: `ENEMY_RUNNER`, `BARRIER`, `HUMAN_RUNNER`, `ALLY_RUNNER` — labels match existing labels for each object type plus `ally` for the new one.
- `DISTANCE` dropdown options: integers 1 through 6, displayed as their numeric value.
- Visual category, color, and shape match the existing pattern of value blocks (e.g., `battlegorithms_value_distance_to_target` is the closest structural cousin).
- Display text follows the pattern: `count of <OBJECT> within <DISTANCE> spaces`.

Constraints:

- Do not accept block inputs in place of either dropdown. Both are fixed-enum fields.
- Do not introduce a new Blockly category for this block.
- The block must be selectable via Plan 40 keyboard navigation (no custom focus handling).

### Requirement 4: Interpreter wiring

Required behavior:

- New evaluator in `src/ai/blockly/interpreter.js` mapping `battlegorithms_value_count_within` to a call into `countObjectsWithin(runner, objectType, distance, state)`.
- The evaluator returns a Number that the existing `battlegorithms_value_compare` block can consume directly.
- Plan 25a trace collection records the block's evaluation result the same way it records `battlegorithms_value_distance_to_target`.

Constraints:

- Do not introduce a new trace step kind. The existing value-step kind is the right one.
- The evaluator must not mutate state.

### Requirement 5: Toolbox availability (Decision 8)

Required behavior:

- `STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS` in `src/config/levels/shared/projectToolboxes.js` includes `battlegorithms_value_count_within`.
- `TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS` likewise.
- Free Play default toolbox (in `src/config/levels/shared/toolboxes.js` or wherever it lives) includes the new block.
- No L1-L22 individual level toolbox includes the new block.

Constraints:

- The implementer verifies via `rg "battlegorithms_value_count_within" src/config/levels` that only the project and Free Play toolboxes reference the new block.
- The `challenge-introduces-no-new-block` and `bug-hunt-introduces-no-new-block` linter contracts must continue to pass. Verify that the linter correctly classifies the Strategy Brain project entry level as "introducing" the new block, so subsequent project levels (and any future challenge/bug hunt levels in the project arc) don't trigger false warnings.

### Requirement 6: Unit tests

Required behavior, in `tests/unit/blockly-interpreter.test.js` (additions) or `tests/unit/count-within.test.js` (new file added to `package.json`'s `test:unit` allowlist):

- `countObjectsWithin` returns 0 when no objects of the type are within distance.
- Returns the correct positive integer for known runner placements at varied positions and distances.
- For `ALLY_RUNNER`: excludes the evaluator from the count.
- For `HUMAN_RUNNER`: excludes the evaluator when the evaluator is the human.
- For `BARRIER`: counts placed barriers regardless of which team placed them.
- For `ENEMY_RUNNER`: counts only opposing-team active runners.
- Manhattan distance boundary: object at exactly `distance` cells counts; object at `distance + 1` does not.
- Frozen runners are counted (positive case + negative case).
- The Blockly interpreter test confirms the block's evaluator returns a Number that the existing `battlegorithms_value_compare` block consumes correctly (e.g., `count > 1` evaluates to true when count is 2).
- Plan 25a trace test confirms the new block produces a trace step with the expected result.

Constraints:

- Tests use synthetic state (no DOM, no real Blockly workspace except where existing patterns require).
- Add any new test file to `package.json`'s `test:unit` allowlist so the suite picks it up.

### Requirement 7: Subsystem doc update

Required behavior:

- `docs/subsystems/blockly-workspace.md` gains an entry for `battlegorithms_value_count_within` in its block catalog section. The entry describes:
  - Block type and category.
  - Inputs (OBJECT and DISTANCE dropdowns with enumerated options).
  - Output (Number).
  - Distance metric (Manhattan).
  - Self-exclusion rule.
  - Frozen-included, jailed-excluded.
  - Toolbox availability (Strategy Brain, Team Strategy Script, Free Play default — NOT individual L1-L22 levels).
- The `ALLY_RUNNER` enum extension is noted wherever the catalog enumerates `SENSOR_OBJECT_TYPES` values.

Constraints:

- Match the existing catalog entry style for other value blocks.
- Do not duplicate the entry elsewhere in the doc.

### Requirement 8: Concept matrix and guide touch-ups

Required behavior:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — add a brief note on the Strategy Brain project arc entry (or wherever the project's toolbox is first described) indicating count-within is available from that point forward.
- `docs/StudentGuide.md` — if the guide enumerates Blockly blocks, add count-within to the project-arc section. Otherwise no edit.
- `docs/TeacherGuide.md` — same as student guide.

Constraints:

- Do not write a full lesson plan for count-within in these docs. Conceptual teaching is deferred per Decision 9.
- Do not author tutorial steps for any level.

### Requirement 9: Future-directions note (Decision 9)

Required behavior:

- New file `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` is created with at least these sections:
  - **Why deferred** — pilot-cycle considerations, brief.
  - **Introduction level proposal** — placement (somewhere in L23-L27), lesson outline, anticipated student outcome, suggested win condition.
  - **Bug hunt proposal** — typical mistake (e.g., wrong comparison operator on count, or off-by-one threshold), bug-hunt level shape, placement.
  - **Prediction level proposal** — predict whether a count-threshold branch evaluates true given a labeled board state.
  - **Reference solution refresh** — list of project levels whose reference solutions could be made cleaner with count-within, with one-line justifications. No code attached; this is a list, not a draft.
  - **Triggers** — what classroom evidence would prompt picking up this work (e.g., teachers report students struggling to compose threshold logic without count-within).

Constraints:

- This is a planning note, not a packet. No implementation contract, no validation checklist, no stop conditions.
- Brevity is fine. Each section can be a paragraph or two.

## Commands

Run from the repository root:

```powershell
rg "battlegorithms_value_count_within|ALLY_RUNNER|countObjectsWithin" --no-heading
node --test --test-isolation=none tests/unit/blockly-interpreter.test.js
node --test --test-isolation=none tests/unit/count-within.test.js
node --test --test-isolation=none tests/unit/blockly-trace-collection.test.js
node --test --test-isolation=none tests/unit/guided-project-solutions.test.js
node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js
node --test --test-isolation=none tests/unit/level-lint.test.js
npm run lint:levels
npm test
npm run test:browser
npm run build
```

If a new test file is added at a path other than `tests/unit/count-within.test.js`, run that file directly first and ensure it's added to `package.json`'s `test:unit` allowlist.

## Validation Checklist

- [ ] `ALLY_RUNNER` added to `SENSOR_OBJECT_TYPES` in `constants.js`.
- [ ] `ALLY_RUNNER` wired into existing `battlegorithms_boolean_sensor_matches` dropdown.
- [ ] New block `battlegorithms_value_count_within` registered with the locked shape (Decision 1).
- [ ] `DISTANCE` dropdown offers integers 1-6.
- [ ] `OBJECT` dropdown offers exactly the four objects from Decision 4.
- [ ] `countObjectsWithin` uses Manhattan distance.
- [ ] Self-exclusion holds for `ALLY_RUNNER` and `HUMAN_RUNNER` (when evaluator is human).
- [ ] Frozen runners counted; jailed (if applicable) excluded.
- [ ] Strategy Brain project toolbox includes the block.
- [ ] Team Strategy Script project toolbox includes the block.
- [ ] Free Play default toolbox includes the block.
- [ ] No L1-L22 individual level toolbox includes the block (verified via `rg`).
- [ ] Plan 25a trace records the new block's evaluation.
- [ ] Unit tests cover the six required cases (Decisions 6, 7; boundary; per-object).
- [ ] Existing project reference solution tests pass unchanged.
- [ ] `npm run lint:levels` passes; `challenge-introduces-no-new-block` and `bug-hunt-introduces-no-new-block` do not fire false positives on the new block.
- [ ] `docs/subsystems/blockly-workspace.md` catalog entry added.
- [ ] `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` notes project-arc availability.
- [ ] `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` created with the five sections from Decision 9.
- [ ] New test file (if any) added to `package.json`'s `test:unit` allowlist.
- [ ] `npm test` passes with new tests in the count.
- [ ] `npm run test:browser` passes.
- [ ] `npm run build` passes.
- [ ] No game rule changed.
- [ ] No reference solution changed.
- [ ] No new guided level, bug hunt, or prediction level authored.
- [ ] Progress report lists tuning choices and frozen/jailed semantic verification against existing code.

## Stop Conditions

Stop and report for owner review if:

- The trace collector (Plan 25a) does not naturally record the new block's evaluation, and accommodating it would require new trace step kinds or collector logic changes. Surface; do not extend Plan 25a in this packet.
- Wiring `ALLY_RUNNER` into the existing boolean sensor block surfaces unexpected behavior in existing tests (e.g., reference solutions that implicitly relied on the absence of `ALLY_RUNNER` as a dropdown choice). Surface for owner judgment.
- The engine's "is this runner active / on the board" filter is unclear or inconsistent between existing sensor blocks, making the frozen/jailed semantic (Decision 7) ambiguous. Surface for explicit clarification.
- The Strategy Brain or Team Strategy Script project reference solution tests fail after the toolbox update. The new block should be additive — failure indicates an unexpected interaction.
- The `challenge-introduces-no-new-block` linter contract fires on a project level that uses count-within. Investigate the introduction-detection logic before adjusting the contract.
- A guided level's toolbox would need the new block to make the level passable. The new block is supposed to be additive; if it's required, the design needs review.
- Any change beyond the documented scope appears required.

## Notes For Future Self

- **The deferred curriculum work** in `docs/development/future-directions-analysis/count-within-curriculum-introduction.md` should be picked up after the next pilot cycle ends, when authoring new levels won't disrupt students currently mid-arc.
- **Plan 38 coaching extension** is a natural follow-up. The learning moment classifier could recognize patterns like "count-within block was used but never compared to a threshold" or "count returned 0 and the branch never ran." Not blocking; opportunistic.
- **Reference solution rewrites** for project levels are deferred. If a future cycle wants to demonstrate count-within in the canonical solutions, that's a small targeted packet of its own.
- **Plan 25a trace narration** could be enriched. Today the trace highlights value blocks during pre-action playback. Count-within evaluations might benefit from a custom narration ("counted 2 enemies within 3 spaces") — but that's a Plan 36 narration extension, not this packet's scope.
- **The four countable objects are not the final set.** If pilot evidence shows students want to count something else (e.g., `EDGE_OR_WALL` for corridor detection), a future packet can extend the dropdown. The decision to lock four was deliberate for cognitive load; revisit with evidence.
- **The 1-6 distance range** is intentional. If teachers report students wanting larger ranges, a future packet can extend. Don't pre-extend.
- **Free Play exposure** is deliberate. Students who finish guided campaign should have the full toolkit in their open-ended experimentation space. This is a consistent rule for all new blocks going forward.
- **Plan 53** (above/below curriculum audit) and Plan 54 are independent. They can land in either order or in parallel.
