# Plan 60: Level Readiness Engine

## Packet Metadata

- Packet id: plan-60
- Packet title: Level Readiness Engine
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-20
- Packet type: implementation / testing / developer tooling
- Mutation level: source-code / tests / docs
- Approval gate: before changing guided level contracts, before moving fixture files, before adding filesystem writes, before adding a server dependency
- Expected artifacts:
  - reusable level-readiness engine that produces structured per-level readiness results
  - CLI entry point for one selected guided level
  - JSON output mode
  - focused unit coverage for readiness result shape and selected checks
  - progress report
- Progress report folder: `reports/development/plan-60-level-readiness-engine/`
- Progress report file: `reports/development/plan-60-level-readiness-engine/progress.md`

## Packet Summary

Goal: Extract the current guided-level validation knowledge into a reusable readiness engine that can report what contracts apply to one level without relying on a human or agent to manually inspect scattered tests, fixtures, and linter functions.

Why this packet exists:

Guided level edits currently cause agent churn because the required context is distributed across level source files, reference XML fixtures, project checkpoint fixtures, linter checks, concept matrix rows, and unit tests. This packet creates the structured data layer needed for a future local workbench and for deterministic agent repair prompts.

Non-goals:

- Do not build a browser UI.
- Do not generate agent prompts yet; that is Plan 61.
- Do not edit guided level content, reference solutions, or project fixtures except for tests explicitly added by this packet.
- Do not add filesystem write behavior.
- Do not change runtime game rules, Blockly semantics, level ordering, or project workspace behavior.
- Do not add a dependency or server.

Depends on:

- Existing `npm run lint:levels` and the exported linter helpers in `scripts/lint-levels.js`.
- Existing guided test harness in `tests/unit/helpers/testHarness.js`.
- Current guided level source split under `src/config/levels/`.

Blocks:

- Plan 61, Agent Prompt Renderer.
- Plan 62, Local Dev Workbench Shell.

## Authority And Contracts

Authoritative sources:

- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/TESTING.md`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `scripts/lint-levels.js`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/`
- `tests/unit/fixtures/guided-project-solutions/`

Contracts this packet must preserve:

- Guided levels remain authored in source modules.
- Reference fixtures remain the authoritative runnable Blockly solutions for non-human non-prediction one-off levels.
- Project checkpoint fixtures remain the authoritative runnable Blockly solutions for project steps and final project programs.
- Linter warnings/errors remain visible; this packet may consume them but must not downgrade or hide them.
- The app remains a static Vite deployment.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/TESTING.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `scripts/lint-levels.js`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`

Use `rg "runGuidedLevelWithSolution|GUIDED_LEVEL_REFERENCE_SOLUTIONS|GUIDED_PROJECT_REFERENCE_SOLUTIONS|runLevelLint|GUIDED_LEVEL_MANIFEST"` to confirm current names before editing.

## Scope

In scope:

- Create a reusable readiness result builder for a single guided level id.
- Include file path discovery for the level source and relevant fixtures.
- Include the concept matrix row for the selected level.
- Include linter diagnostics scoped to the selected level plus campaign-level diagnostics that may affect it.
- Include reference solution runtime status for applicable one-off levels.
- Include project checkpoint/final fixture runtime status for applicable project levels.
- Include validation command recommendations.
- Add a CLI command such as `npm run level:readiness -- --level <levelId>` with `--json` support.
- Add tests for result shape and representative level categories.

Out of scope:

- Browser UI.
- Prompt rendering.
- Scratch Blockly editing.
- File writes or fixture saves.
- New level checks whose product meaning has not already been approved.

Files and areas likely touched:

- new `src/dev/levelReadiness/` or `scripts/level-readiness/` modules
- `package.json`
- `scripts/`
- `tests/unit/`
- `docs/TESTING.md` if commands are added
- progress report

## Work Plan

1. Inspect current linter exports, guided fixtures, project fixtures, and harness APIs.
2. Choose a small module boundary that keeps pure readiness logic reusable and Node filesystem discovery isolated.
3. Implement `buildLevelReadinessResult(levelId, options)` or equivalent.
4. Add CLI parsing for `--level` and `--json`.
5. Add unit coverage for one ordinary level, one project level, one prediction or human-input level, and one missing/unknown level id.
6. Update `docs/TESTING.md` only if a new command should be documented for developers.
7. Run validation and write the progress report.

## Implementation Requirements

### Requirement 1: Structured Result Shape

Required behavior:

- The readiness engine returns a plain JSON-serializable object.
- The object must include at least:
  - `levelId`
  - `found`
  - `sourcePath`
  - `title`
  - `order`
  - `levelKind`
  - `project`
  - `conceptMatrixRow`
  - `fixtures`
  - `checks`
  - `validationCommands`
  - `generatedAt` or equivalent timestamp only if stable output mode can suppress it

Constraints:

- JSON output must be deterministic by default. If a timestamp is included, provide a way for tests to omit or normalize it.
- Paths should be repository-relative in JSON so reports are portable across machines.

Expected artifact:

- Tests assert the result shape for representative levels.

### Requirement 2: Check Records

Required behavior:

- Each check record should include:
  - `id`
  - `label`
  - `status`: `pass`, `fail`, `warning`, `not_applicable`, or `not_run`
  - `severity`
  - `message`
  - `evidence`
  - `relatedFiles`

At minimum, represent these existing contracts where applicable:

- concept matrix agreement
- linter diagnostics
- reference fixture exists
- reference solution passes
- project step fixture exists
- project step fixture passes, including known documented exceptions
- final project fixture relationship, including known documented exceptions
- toolbox/reference compatibility if available from the linter
- demo Blockly does not equal reference solution if available from the linter

Constraints:

- Do not invent pass/fail semantics that disagree with existing tests.
- If an existing project exception says a fixture is expected not to pass, report it explicitly as a documented exception instead of a hidden pass.

### Requirement 3: Runtime Simulation

Required behavior:

- For ordinary non-project non-prediction guided levels, run the reference XML through the existing deterministic harness and report result, turn count, last level-result reason, and a short trace tail.
- For project levels, report the matching step fixture and final fixture relationship using the current project test policy.
- For prediction and human-input levels, report why a reference-run check is not applicable or requires special handling.

Constraints:

- Do not move the existing test harness if doing so would create broad import churn. A thin wrapper is acceptable.
- Do not change the semantics of the existing unit tests.

### Requirement 4: CLI

Required behavior:

- Add a developer command to run readiness for a selected level.
- Human-readable output should summarize checks and point to JSON mode.
- JSON output should be suitable for Plan 61 prompt rendering.

Example:

```powershell
npm run level:readiness -- --level dodge-and-deliver
npm run level:readiness -- --level dodge-and-deliver --json
```

Constraints:

- Unknown level ids should exit nonzero and print available nearby ids or a clear error.
- The command must not write files.

## Testing Requirements

Add focused tests for:

- ordinary one-off level result shape and passing reference run
- project level fixture metadata and documented exception representation
- prediction or human-input level not-applicable checks
- unknown level id failure
- JSON determinism

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/<new-readiness-test>.test.js tests/unit/level-lint.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npm run level:readiness -- --level dodge-and-deliver
npm run level:readiness -- --level dodge-and-deliver --json
npm test
npm run build
```

## Validation Checklist

- [ ] Readiness result exists for selected known levels.
- [ ] Unknown level ids fail clearly.
- [ ] JSON output is deterministic enough for tests and prompt rendering.
- [ ] Existing linter behavior is preserved.
- [ ] Existing guided reference/project solution tests still pass.
- [ ] No guided level source, fixture XML, or project fixture content changed.
- [ ] No filesystem write behavior was added.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- Existing tests and linter checks disagree on whether a level is valid.
- Project fixture exception policy cannot be represented without changing the tests.
- A useful readiness result requires broad refactoring of the test harness.
- The implementation appears to need file writes, a server, a dependency, or a browser UI.
- Any level contract needs product judgment rather than mechanical representation.

## Progress Report Requirements

Write `reports/development/plan-60-level-readiness-engine/progress.md` with:

- result object shape
- CLI command examples and sample output summary
- checks represented
- checks intentionally deferred
- files changed
- commands run and results
- ready-for-integration yes/no
