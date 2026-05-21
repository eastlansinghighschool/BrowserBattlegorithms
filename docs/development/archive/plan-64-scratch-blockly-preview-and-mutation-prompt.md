# Plan 64: Scratch Blockly Preview And Mutation Prompt

## Packet Metadata

- Packet id: plan-64
- Packet title: Scratch Blockly Preview And Mutation Prompt
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-20
- Packet type: implementation / frontend / Blockly / developer tooling / testing
- Mutation level: source-code / tests / docs
- Approval gate: before adding filesystem writes, before changing Blockly block definitions, before changing guided workspace persistence, before changing level or fixture content
- Expected artifacts:
  - scratch Blockly workspace in the local-dev workbench
  - load-reference-solution affordance
  - run-scratch-solution result comparison
  - generated mutation prompt for fixture replacement
  - tests for isolation and prompt content
  - progress report
- Progress report folder: `reports/development/plan-64-scratch-blockly-preview-and-mutation-prompt/`
- Progress report file: `reports/development/plan-64-scratch-blockly-preview-and-mutation-prompt/progress.md`

## Packet Summary

Goal: Let an admin/developer experiment with a candidate Blockly solution for a selected level inside the local-dev workbench, run it against the readiness simulation, and generate a deterministic agent prompt to update the relevant fixture. This is a soft-edit workflow: no files are written.

Why this packet exists:

Many level repairs are really reference-solution or setup/fixture coordination problems. A scratch Blockly preview lets the integration owner test a candidate solution directly and hand an implementation agent exact XML plus validation steps, without granting the browser filesystem mutation powers.

Non-goals:

- Do not save XML files from the browser.
- Do not edit level setup, map geometry, runner positions, docs, or campaign order.
- Do not add new Blockly blocks.
- Do not change guided workspace persistence.
- Do not turn this into a student-facing feature.

Depends on:

- Plan 60 complete.
- Plan 61 complete.
- Plan 62 complete.
- Plan 63 complete.

Blocks:

- Future preview-edit packets for level setup, turn limits, and fixture save workflows.

## Authority And Contracts

Authoritative sources:

- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- Plan 60 readiness engine
- Plan 61 prompt renderer
- Plan 62 workbench shell
- Plan 63 reference runner
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/blocks.js`
- Existing guided workspace persistence rules

Contracts this packet must preserve:

- Scratch workspace is isolated from student guided workspaces and project shared workspaces.
- Workbench edits do not save to localStorage unless stored under a clearly dev-only scratch key and approved by this packet. Prefer no persistence for MVP.
- Running scratch XML uses the same one-action-per-turn semantics as normal gameplay tests.
- Generated mutation prompts do not claim files were changed.

## Required Reading

- Plan 60 progress report and implementation files
- Plan 61 progress report and implementation files
- Plan 62 progress report and implementation files
- Plan 63 progress report and implementation files
- `docs/subsystems/blockly-workspace.md`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/blocks.js`
- `tests/unit/blockly-workspace.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`

## Scope

In scope:

- Embed a scratch Blockly workspace in the local-dev workbench.
- Load the selected level's toolbox.
- Load canonical reference or project checkpoint XML into scratch on demand.
- Let the developer edit scratch XML.
- Run scratch XML against the selected level using the Plan 63 simulation path.
- Compare scratch result to canonical reference result.
- Show exported XML.
- Generate an agent mutation prompt that says which fixture should be updated and how to validate.

Out of scope:

- Direct filesystem save.
- Drag/drop board editing.
- Level setup preview edits.
- Updating starter XML version hashes.
- Student-facing guided UI changes.

Files and areas likely touched:

- workbench UI modules
- Blockly workspace helper usage
- readiness/prompt renderer modules if mutation-prompt mode needs a narrow extension
- browser tests
- `docs/TESTING.md`
- progress report

## Work Plan

1. Inspect current Blockly workspace APIs and persistence boundaries.
2. Add isolated scratch workspace creation/destruction to the workbench.
3. Load selected level toolbox and reference XML.
4. Run scratch XML through the same simulation path as Plan 63.
5. Add result comparison and exported XML panel.
6. Add mutation-prompt generation for fixture replacement.
7. Add tests for isolation, run result, and prompt content.
8. Run validation and write progress report.

## Implementation Requirements

### Requirement 1: Scratch Workspace Isolation

Required behavior:

- Scratch Blockly workspace must be separate from the main app workspace.
- It must not read from or write to guided level localStorage/project workspace keys.
- Switching selected levels should either clear scratch or explicitly ask/indicate replacement; for MVP, clearing scratch on level switch is acceptable.

Constraints:

- Do not change normal `On Each Turn` starter behavior for students.
- Do not alter guided workspace versioning.

### Requirement 2: Toolbox Accuracy

Required behavior:

- Scratch toolbox should match the selected level's allowed toolbox policy.
- Project levels must show the project toolbox policy, preserving broad project toolbox behavior.

Constraints:

- Do not add or remove block definitions.
- If a reference solution uses a block outside the level toolbox, show readiness failure rather than silently expanding the toolbox.

### Requirement 3: Scratch Run

Required behavior:

- Run the scratch XML against the selected level in isolated simulation state.
- Display pass/fail, turn count, result reason, and trace tail.
- Compare to canonical fixture status from Plan 63.

Constraints:

- Invalid XML should produce a clear validation error, not break the workbench.
- Empty workspace should run as no-action/stay-still according to existing interpreter behavior or report why it cannot run.

### Requirement 4: Mutation Prompt

Required behavior:

- Generate a Markdown prompt that instructs an implementation agent to update the appropriate fixture with the exported XML.
- Include:
  - fixture file path
  - selected level source path
  - scratch result evidence
  - XML payload or clear instruction where the XML is shown
  - validation commands
  - do-not-touch list
  - explicit statement that the workbench did not write files

Constraints:

- If scratch result does not pass, the prompt should say it is an experiment, not a ready repair.
- If the selected level is project-based, name whether the target is step fixture or final fixture. If ambiguous, stop and require user choice in the UI rather than guessing.

## Testing Requirements

Add browser tests for:

- scratch workspace loads for a selected ordinary level
- load reference XML and run produces the same result as canonical panel
- editing or replacing XML changes scratch result without changing canonical fixture result
- generated mutation prompt names the correct fixture
- localStorage guided/project keys are not mutated

Unit tests may cover prompt generation if the mutation prompt is a pure function.

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-workspace.test.js tests/unit/<readiness-or-prompt-test>.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npx playwright test tests/browser/<workbench-spec>.spec.js --reporter=line
npm test
npm run build
npm run test:browser:smoke
```

Run full browser tests if the workbench spec is added to extended browser coverage or if Blockly browser initialization changes broadly:

```powershell
npm run test:browser
```

## Validation Checklist

- [ ] Scratch Blockly workspace is isolated.
- [ ] Scratch toolbox matches selected level policy.
- [ ] Canonical fixture can be loaded into scratch.
- [ ] Scratch XML can be run and compared to canonical result.
- [ ] Invalid XML is handled gracefully.
- [ ] Mutation prompt names the right fixture and validation commands.
- [ ] No files are written.
- [ ] Normal guided workspace persistence is unchanged.
- [ ] No new Blockly blocks or semantics introduced.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Relevant browser tests pass.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- Scratch Blockly cannot be isolated from the student workspace.
- Fixture target selection is ambiguous for project levels.
- Running scratch XML requires changing interpreter or turn-engine semantics.
- The implementation needs browser filesystem writes.
- The UI becomes a general level editor rather than a candidate-solution workbench.

## Progress Report Requirements

Write `reports/development/plan-64-scratch-blockly-preview-and-mutation-prompt/progress.md` with:

- scratch workspace isolation approach
- supported level categories
- fixture target rules
- mutation prompt format
- tests added
- files changed
- commands run and results
- ready-for-integration yes/no
