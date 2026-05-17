# Plan 43: Multiple-Choice Prediction Levels

## Packet Metadata

- Packet id: plan-43
- Packet title: Multiple-Choice Prediction Levels
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / curriculum / frontend / guided-level-authoring / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing core turn semantics, adding dependencies, changing usage export schema, or requiring prediction answers for every guided level
- Expected artifacts:
  - guided-level prediction schema
  - multiple-choice prediction UI for selected prediction levels
  - two or three pilot prediction levels at major reasoning cliffs
  - tests for locked-in predictions, run gating, feedback, persistence/reset behavior, and accessibility basics
  - docs and subsystem note updates
  - progress report
- Progress report folder: `reports/development/plan-43-multiple-choice-prediction-levels/`
- Progress report file: `reports/development/plan-43-multiple-choice-prediction-levels/progress.md`

## Packet Summary

Goal: Add a small multiple-choice prediction interaction for selected guided levels so students must commit to what a shown program will do before running it, then compare their prediction with the observed result.

Non-goals:

- Do not add prediction questions to every guided level.
- Do not replace bug hunt levels from Plan 42.
- Do not build free-response grading, teacher dashboards, usage analytics schema changes, or export enrichment.
- Do not add voice, narration coaching, or learning-moment classifier dependencies.
- Do not change Blockly execution semantics.
- Do not deploy.

Depends on:

- Current guided campaign and guided UI.
- Plan 42 is helpful but not required; if Plan 42 is already complete, align prediction vocabulary with bug hunt/debugging copy.
- Existing modal/focus/key-capture tests from Plans 30 and 31.

Blocks:

- Richer code-tracing practice before advanced boolean and runner-index levels.
- Future usage/export enrichment that might record prediction evidence.
- Future teacher facilitation prompts that use prediction before execution.

Why this packet exists:

Prediction is one of the most valuable bridges from Blockly to AP CSA-style reasoning. Students need practice reading code before running it: Which branch will execute? Which action is first? Which runner role applies? Multiple-choice prediction levels make that reasoning explicit without requiring new game rules. The important design point is commitment: the student should choose an answer before running, then the app should help them compare prediction and observed behavior.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-17):

### Decision 1: Feedback timing — at `level.result`, not at run-start

Prediction feedback appears **when the level finishes** (the existing `level.result` event, `passed` or `failed`), not when the student clicks Start Level. Feedback uses the same UI surface as level-complete messaging and includes a comparison line: "You predicted X. The program did Y." If the prediction matched the observed outcome, the line acknowledges that explicitly ("Your prediction matched what happened — nice tracing.").

Rationale: showing feedback at run-start subverts the "predict, then observe" loop. Tying it to level result ensures the student watches the run before reading the comparison. Acceptable cost: if the level runs long, feedback is delayed; but prediction levels are deliberately short by Decision 5 placement.

### Decision 2: Run-gating mechanism — disabled Start button with aria-disabled

The Start Level run control (or the equivalent run trigger on a prediction level) is rendered with the native `disabled` attribute plus `aria-disabled="true"` until the student has selected a prediction choice. A short visible affordance label reads "Pick a prediction to start" near the Start control. Once a choice is selected, the disabled attribute is removed and the affordance label disappears. Tests assert the disabled state pre-selection and the enabled state post-selection.

### Decision 3: Prediction state shape and reset semantics

New state field:

```js
state.predictionForCurrentLevel = {
  levelId: string | null,
  choiceId: string | null,
  lockedAt: "unselected" | "selected" | "running" | "result_shown"
} | null
```

Lifecycle:

- **Level load on a prediction level:** field initialized with `{ levelId, choiceId: null, lockedAt: "unselected" }`.
- **Student picks a choice:** `choiceId` set, `lockedAt: "selected"`. Field is mutable until run starts.
- **Run starts (Start clicked):** `lockedAt: "running"`. Choice can no longer be changed for the rest of this attempt. The radio inputs render as disabled+checked on the selected choice.
- **`level.result` fires:** `lockedAt: "result_shown"`, feedback rendered.
- **Reset within the same level attempt:** `choiceId` and `lockedAt` are **preserved**. This is the ethics-load-bearing rule — students cannot peek at the result, reset, and re-pick. The radio group stays disabled with the original choice shown.
- **Level switch (to a different level):** field cleared to `null` or re-initialized for the new level.
- **Match restart / full reset:** field cleared.

Reset rules live alongside Plan 35's reset paths in `src/core/setup.js`.

### Decision 4: Accessibility contract for the choice group

The choice group is implemented as a real radio group with the following semantics:

- Wrapping element with `role="radiogroup"` and `aria-labelledby` pointing at the prompt text element.
- Each choice is a `<label>` containing an `<input type="radio">` plus the choice's student-facing text. Standard form semantics; no `role="radio"` overrides.
- Arrow Up / Down / Left / Right cycles focus through choices in the group (native browser behavior for radio inputs).
- Space or Enter selects the focused choice.
- Tab moves to the next focusable control (the Start button, which remains disabled until selection per Decision 2).
- Focus ring is visible via existing focus-visible styling.
- The run-gating affordance ("Pick a prediction to start") is announced via `aria-live="polite"` on the affordance element, so screen-reader users learn why Start is disabled.

### Decision 5: Pilot placements — post-Plan-42 campaign order, three levels

Plan 42 lands first and inserts `bughunt-15`, `bughunt-22`, `bughunt-28`, `bughunt-37` into the campaign. Plan 43's pilot prediction placements reference the post-Plan-42 order:

- **`prediction-06`** (or nearest tutorial-arc level after movement/sensing foundation): predict which direction the runner moves on turn 1 given a small starter program. Targets first-action and direction sensing.
- **`prediction-25`** (Strategy Brain arc, before `bughunt-28`): predict whether an `AND`/`OR` branch evaluates true given a labeled board state. Targets boolean composition.
- **`prediction-31`** (Team Strategy Script arc, before `bughunt-37`): predict which runner takes which action given a runner-index branching program. Targets role decomposition.

Exact placements may shift one slot in either direction during authoring; final placements are recorded in the progress report. These prediction levels are **new levels**, not retrofits — they live alongside existing levels with their own ids (namespace `prediction-NN`), same as the bug hunt namespace. No existing levels are renamed.

### Decision 6: DOM location for the prediction prompt

The prediction prompt renders **inline within the existing guided lesson panel**, below the lesson copy and above (or beside) the Blockly workspace controls. No new modal, no overlay. Concretely:

- Recommended seam: `src/ui/levels.js` (the module that renders the lesson panel) gains a `renderPredictionPrompt(level, state)` helper invoked when `level.prediction` is defined and `state.predictionForCurrentLevel.lockedAt !== "result_shown"`.
- After `lockedAt === "result_shown"`, the prediction block transitions to a compact feedback row ("You predicted X. The program did Y.") in the same DOM slot.
- The lesson-panel container already participates in keyboard focus order and existing modal-stability tests; adding a radio group inside it inherits that contract.

This keeps the interaction lightweight and avoids a new full-screen surface that would conflict with tutorial overlays or Plan 36 narration.

### Decision 7: Coordination with Plan 42

Plan 42 (bug hunt levels) lands first. Plan 43:

- Reads Plan 42's authored bug hunt copy for vocabulary consistency. Prediction prompts use the same words for tracing concepts ("first action," "branch," "readiness check," "runner role") as the corresponding bug hunts.
- Does **not** add prediction prompts to bug hunt levels. Predictions and bug hunts are distinct interactions in this packet. A future packet may compose them.
- Uses the `levelKind` field introduced as a typed value by Plan 42. Prediction levels set `levelKind: "prediction"` (third recognized value alongside `"challenge"` and `"bug_hunt"`). The linter contracts on `levelKind === "prediction"` are minimal in v1: the level must have a `prediction` object with a non-empty `choices` array and a valid `correctChoiceId`.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `docs/development/archive/plan-30-global-key-capture-bugfix.md`
- `docs/development/archive/plan-31-modal-stability-regression-suite.md`
- `docs/development/plan-42-bug-hunt-guided-levels.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/turn-engine.md`
- `src/config/levels/`
- `src/ui/`
- `tests/browser/`
- `tests/unit/`

Required product contracts:

- Prediction levels teach code tracing and program behavior, not hidden game rules.
- Student programs still execute through the normal turn engine and required `On Each Turn` event block.
- Only the first reached action executes for a runner turn.
- Prediction UI must not interfere with screen-reader narration, keyboard focus, modal stability, or p5 key handling.
- Prediction answers should be student-facing feedback only in this packet; do not add analytics/export schema unless explicitly approved later.
- The app remains a static Vite deployment.

Do not redefine:

- Core game rules.
- Guided challenge goals.
- Plan 36 narration behavior or Plan 38 coaching behavior.
- Usage export/admin analyzer schema.
- Project membership and project toolbox policy.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/development/archive/plan-30-global-key-capture-bugfix.md`
- `docs/development/archive/plan-31-modal-stability-regression-suite.md`
- `src/config/levels/`
- `src/ui/levels.js`
- `src/ui/controls.js`
- `src/core/levels.js`
- `src/core/state.js`
- `tests/browser/modal-stability.spec.js`
- `tests/browser/key-capture-passthrough.spec.js`
- `tests/browser/guided-ui.spec.js`
- `tests/unit/guided-level-contracts.test.js`

Use `rg "levelPanel|level-panel|startLevel|evaluateLevelProgress|playResetButton|mainGameState|showModePicker|tutorial-overlay"` from the repository root to find current UI seams.

## Scope

### In scope

- Add a guided-level prediction schema, likely on level definitions, with fields such as:
  - prompt text;
  - answer choices;
  - correct answer id;
  - explanation shown after prediction and/or after first run;
  - optional expected observation text.
- Add UI in the guided lesson panel for prediction levels.
- Require the student to choose a prediction before starting the level when prediction data is present.
- Lock the chosen answer for the first run attempt so the student cannot revise after seeing the result.
- Show concise feedback after the first run begins or after the observed event/result, whichever is simpler and more reliable.
- Add two or three pilot prediction levels, not a full campaign sweep.
- Recommended pilot placements:
  - after Level 5 or before Level 6: predict how forward/team direction or branch order behaves;
  - around Level 25/26: predict an `AND`/`OR` branch;
  - around Level 30/31: predict which runner index role applies.
- Add tests for schema, UI behavior, focus/keyboard operation, and run gating.
- Update docs and subsystem notes for the new guided prediction surface.
- Write a progress report with final placement decisions and any deferred prediction candidates.

### Files and areas likely touched

- `src/config/levels/**`
- `src/core/state.js`
- `src/core/levels.js`
- `src/ui/levels.js`
- `src/ui/controls.js`
- `src/assets/styles/components/*.css`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/subsystems/ui-mode-contract.md`
- `tests/unit/guided-level-contracts.test.js`
- new or existing browser spec such as `tests/browser/prediction-levels.spec.js`
- `reports/development/plan-43-multiple-choice-prediction-levels/progress.md`

### Out of scope

- Adding prediction UI to Free Play.
- Recording prediction answers in usage exports.
- Teacher dashboard or admin analyzer changes.
- New Blockly blocks.
- New engine event kinds.
- Voice or narration integration.
- Broad level renumbering beyond the selected pilot prediction levels.
- Deployment.

## Work Plan

1. Summarize the packet and inspect current guided UI/level schema.
2. Propose the final two or three pilot prediction placements in the progress report before editing many level files.
3. Add the smallest schema and UI path that supports multiple-choice prediction.
4. Add one pilot level first and write tests for the core prediction workflow.
5. Add the remaining pilot levels only after the first workflow is stable.
6. Update docs, concept matrix, and subsystem notes.
7. Run targeted and broad validation.
8. Write the progress report with placement rationale, validation, and deferred follow-ups.

## Implementation Requirements

### Requirement 1: Prediction schema is level-owned and simple

Required behavior:

- Prediction data lives on guided level definitions.
- A level without prediction data behaves exactly as before.
- Prediction choices have stable ids and student-facing labels.
- Correct answer/explanation is available for feedback.

Constraints:

- Do not encode prediction state in Blockly XML.
- Do not make prediction answers part of level pass/fail unless explicitly approved later.
- Do not add persistence beyond what is needed to manage the current level attempt.

### Requirement 2: Students must commit before running (Decisions 2 and 3)

Required behavior:

- Run-gating mechanism is the disabled+aria-disabled Start button with affordance label, per Decision 2.
- Prediction state is stored at `state.predictionForCurrentLevel` with the lifecycle in Decision 3.
- Choice locks at `lockedAt === "running"` and stays locked through `level.result` and through any Reset within the same level attempt (the ethics-load-bearing rule).

Constraints:

- Do not trap keyboard focus.
- Do not use a modal or overlay; the prompt lives inline in the lesson panel per Decision 6.
- Do not make this feel like a graded quiz; tone should be exploratory.
- Do not clear the locked choice on Reset within an attempt.

### Requirement 3: Feedback supports code tracing (Decision 1)

Required behavior:

- Feedback renders at `level.result` (passed or failed), not at run-start, per Decision 1.
- Feedback compares prediction to observation in plain language: "You predicted X. The program did Y."
- Feedback names the code-tracing reason in one short sentence: first action, true branch, false branch, boolean operator, or runner index.
- Feedback is concise enough for classroom flow (≤ 2 short sentences total).

Constraints:

- Do not show feedback before `level.result` fires.
- Do not add coaching that depends on Plan 37/38 learning moments.
- Do not reveal future concepts.
- Do not add noisy per-turn feedback.

### Requirement 4: Accessibility and keyboard behavior are preserved (Decision 4)

Required behavior:

- Choice group uses `role="radiogroup"` with `aria-labelledby` to the prompt, real `<input type="radio">` inputs, native arrow-key navigation, Space/Enter to select, visible focus ring, and `aria-live="polite"` on the run-gating affordance label. Full contract in Decision 4.
- Existing modal stability and key-capture behavior remain intact.

Constraints:

- Do not broaden global key handling.
- Do not intercept p5/human runner keys while a prediction choice has focus beyond normal form behavior.
- Do not implement choices as `<div role="radio">` overrides; use native radio inputs.

### Requirement 5: Pilot levels are carefully placed (Decision 5)

Required behavior:

- Add exactly three prediction levels with ids `prediction-06`, `prediction-25`, `prediction-31` (or one-slot-shifted equivalents documented in the progress report), each with `levelKind: "prediction"`.
- Each targets the misconception described in Decision 5 (first-action/direction, AND/OR composition, runner-index roles).
- Each prediction asks about code/board behavior, not trivia.
- Placements reference post-Plan-42 campaign order — Plan 42 lands first.

Stop if:

- A good prediction candidate would require large board redesign or a new engine observation hook.
- The implementation starts to become a general quiz framework.
- Plan 42 has not landed; do not author placements against pre-Plan-42 numbering.

### Requirement 6: Lint contract on `levelKind === "prediction"` (Decision 7)

Required behavior:

- `scripts/lint-levels.js` gains one contract that fires on `levelKind === "prediction"`:
  - **`prediction-has-valid-schema`** (warning): the level must have a `prediction` object with `prompt: string`, `choices: Array<{ id: string, label: string }>` of length ≥ 2, and `correctChoiceId` matching one of the choice ids.
- `tests/unit/level-lint.test.js` exercises the new contract with at least one passing and one failing fixture.

Constraints:

- Do not weaken existing linter contracts.
- Do not duplicate Plan 42's bug-hunt linter contracts onto prediction levels.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js
npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npx playwright test tests/browser/guided-ui.spec.js --reporter=line
npm test
npm run test:browser
npm run build
```

If you add `tests/browser/prediction-levels.spec.js`, run it directly before the broader browser suite.

## Validation Checklist

- [ ] Prediction schema exists and is ignored by non-prediction levels.
- [ ] Three pilot prediction levels (`prediction-06`, `prediction-25`, `prediction-31` or documented-shifted equivalents) exist with `levelKind: "prediction"`.
- [ ] No existing `level-NN-*.js` file or id was renamed; placements reference post-Plan-42 campaign order.
- [ ] `state.predictionForCurrentLevel` lifecycle follows Decision 3, including locked-on-reset semantics.
- [ ] Start control is disabled+aria-disabled with affordance label until a choice is selected.
- [ ] Feedback renders at `level.result`, not at run-start, in the same inline lesson-panel slot.
- [ ] Choice group uses native radio inputs with `role="radiogroup"` and `aria-labelledby`.
- [ ] Lint contract `prediction-has-valid-schema` is implemented with passing+failing fixtures.
- [ ] Existing key-capture tests pass.
- [ ] Existing modal stability tests pass.
- [ ] Guided UI tests pass.
- [ ] `npm run lint:levels` passes or only reports approved warnings.
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] `npm run build` passes.
- [ ] Docs and subsystem note updates match the new behavior.
- [ ] No usage export schema change was made.
- [ ] Final report lists placement rationale, commands run, and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- Prediction state needs persistence, analytics, or usage export changes to feel coherent.
- Run gating conflicts with existing guided/play controls in a way that requires UI redesign.
- A prediction level would require new game rules, new Blockly blocks, or broad board redesign.
- Accessibility or keyboard focus behavior regresses.
- The only viable implementation is a modal/quiz framework broader than this packet.
- A subsystem note becomes untrue and the correct contract wording requires owner judgment.
- Any dependency install, deployment, or GitHub workflow change appears necessary.

