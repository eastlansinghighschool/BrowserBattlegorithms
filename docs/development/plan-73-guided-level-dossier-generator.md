---
id: plan-73-guided-level-dossier-generator
title: "Guided Level Dossier Generator"
status: complete
depends_on: []
gate: "before source-of-truth curriculum decisions, before changing guided levels, before adding dependencies"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Generate factual per-level guided dossiers and a summary index so later curriculum analysis can consume packaged evidence instead of raw source spelunking.
---
# Plan 73: Guided Level Dossier Generator

- Packet id: Plan 73
- Packet title: Guided Level Dossier Generator
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent
- Date: 2026-05-21
- Packet type: developer tooling / reports / scan-prep
- Mutation level: source-code / tests / generated-local / docs
- Approval gate: before source-of-truth curriculum decisions, before changing guided levels, before adding dependencies
- Expected artifacts:
  - deterministic dossier-generation tooling for guided levels
  - one Markdown dossier per in-scope guided level
  - summary index of generated dossiers
  - focused tests for parser/metric helpers
  - progress report
- Progress report folder: `reports/development/plan-73-guided-level-dossier-generator/`
- Progress report file: `reports/development/plan-73-guided-level-dossier-generator/progress.md`

## Packet Summary

Goal: Build a low-cost evidence-packaging tool that compiles source-truth facts for each guided level into stable Markdown dossiers, so a later orchestration model can evaluate level complexity without repeatedly spelunking source files.

Non-goals:
- Do not judge whether a level is boring, too easy, too hard, or should be redesigned.
- Do not edit guided level source, fixtures, Blockly XML, tutorial copy, or concept matrix content.
- Do not generate curriculum recommendations.
- Do not run or simulate reference solutions yet; that is Plan 74.
- Do not add image generation or browser screenshot requirements in this packet.
- Do not add dependencies or server behavior.

Depends on:
- Existing guided level source split under `src/config/levels/`.
- Existing Plan 60-64 developer readiness/workbench tooling.
- Existing concept matrix and subsystem notes.

Blocks:
- Plan 74 can append runtime evidence to these dossiers.
- Plan 75 consumes these dossiers for the orchestration-grade complexity audit.

Why this packet exists:
The integration owner wants to raise guided-level engagement without spending orchestration tokens on repetitive source inspection. Lower-cost agents and deterministic tooling can prepare factual per-level packets first; orchestration tokens should be reserved for curriculum judgment, challenge-ramp analysis, and packet sequencing.

## Authority And Contracts

Required project contracts:
- Guided level order and metadata are authoritative in `src/config/levels/` and `src/config/levels/manifest.js`.
- Concept introductions are tracked in `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`.
- Blockly workspace/toolbox behavior is owned by `docs/subsystems/blockly-workspace.md`.
- Turn and scoring behavior is owned by `docs/subsystems/turn-engine.md`.
- Packets and generated report locations must follow `docs/packet-creation-guidance.md`.
- Generated report output must not become a source of truth over authored level files.

Do not redefine:
- The guided level concept sequence.
- Level tags, challenge status, project membership, prediction behavior, or bug-hunt semantics.
- Reference solution correctness.
- Demo Blockly spoiler policy.
- Static Vite deployment constraints.

## Required Reading

Read before editing:
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `src/dev/levelReadiness.js`
- `src/dev/levelReadinessPrompt.js`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/config/levels/phases/`
- `tests/unit/level-readiness.test.js`
- `tests/unit/level-readiness-prompt.test.js`
- `package.json`

Use `rg` for:
- `getLevelDefinitions`
- `GUIDED_LEVEL_MANIFEST`
- `initialBlocklyXml`
- `demoBlocklyXml`
- `toolbox`
- `projectId`
- `levelKind`
- `challenge`
- `prediction`
- `bughunt`

## Scope

### In Scope

- Create or extend developer tooling that emits per-level Markdown dossiers under `reports/development/guided-level-complexity-audit/level-dossiers/`.
- Emit a deterministic `reports/development/guided-level-complexity-audit/summary-index.md`.
- Include all authored guided levels, including prediction checkpoints, bug hunts, challenge levels, project levels, and optional labs, but mark each category clearly.
- Add structural Blockly XML metrics for starter, demo, and reference XML if available without running the game.
- Add board/setup facts in Markdown text form, including an ASCII board or compact coordinate table.
- Add a short "facts only" section for noteworthy mechanical facts discovered by the generator.
- Add focused unit tests for metric extraction, deterministic output helpers, and representative dossier sections.
- Update `docs/development/README.md` to list Plan 73.

### Out Of Scope

- Runtime simulation or reference-run transcripts.
- PNG screenshots or browser rendering.
- Curriculum judgment.
- Level redesign.
- Fixture updates.
- Linter rule changes unless a tiny exported helper is needed for data reuse.
- Any production UI change.

### Files And Areas Likely Touched

- `src/dev/`
- `scripts/`
- `package.json`
- `tests/unit/`
- `reports/development/guided-level-complexity-audit/`
- `reports/development/plan-73-guided-level-dossier-generator/progress.md`
- `docs/development/README.md`

## Implementation Requirements

### 1. Command Shape

Required behavior:
- Add a deterministic command for generating all dossiers.
- Prefer a command name similar to:

```powershell
npm run level:dossiers
```

- The command should write generated Markdown files under `reports/development/guided-level-complexity-audit/`.
- The command should be safe to rerun and should overwrite only its own generated output folder/files.

Constraints:
- No dependency installs.
- No server.
- No browser required.
- Use repository-relative paths in output.
- If generated timestamps are included, provide a deterministic/suppressible mode for tests. Prefer omitting timestamps from generated dossiers.

### 2. Per-Level Dossier Content

Each dossier should include factual sections:
- Level identity: id, title, order, phase, source file, level kind/category.
- Curriculum row: concept matrix focus, new vocabulary/board idea, new Blockly idea, assumptions.
- Tags/signals: challenge/synthesis, prediction, bug hunt, project id, optional lab, human-input level.
- Lesson copy: objective, tutorial/intro copy, tips/hints, any demo Blockly label text that exists in source.
- Board/setup facts: map dimensions, barriers/walls if available, goal cells, base/flag positions, runner starts.
- Runner facts: team, control type, runner index/ally index, NPC behavior, frozen state, resources, carried flag state.
- Toolbox facts: available toolbox block types/categories if discoverable.
- XML facts: starter XML, demo XML, and reference fixture presence, summarized rather than pasted wholesale.
- Static Blockly metrics for each XML source available:
  - total blocks
  - distinct block types
  - action block count
  - condition block count
  - boolean/comparison/value block count
  - max nesting depth
  - branch/decision count
  - runner-index usage
  - resource-readiness usage
  - first-action-only risk markers if structurally visible
- Existing validation pointers: readiness command, lint command, relevant fixture paths.

Constraints:
- Do not include huge raw XML blobs unless behind a collapsed short excerpt or line-limited snippet.
- Do not editorialize about quality.
- If a fact cannot be derived, write `not found` or `not applicable` rather than guessing.

### 3. Markdown Board Representation

Required behavior:
- Include a compact text representation of each level's starting state if feasible.
- A coordinate table is acceptable if ASCII grid rendering is too risky for maps with many entities.
- Include a legend for markers such as human, ally, enemy/NPC, flag, wall, barrier, goal, and base.

Constraints:
- Markdown is the primary model-consumable artifact.
- Do not require image files in this packet.
- Do not let board rendering become a source of truth over level source.

### 4. Summary Index

Required behavior:
- Generate `summary-index.md` with one row per level.
- Include columns for:
  - order
  - level id
  - title
  - category
  - project id
  - concept focus
  - starter block count
  - demo block count
  - reference block count if known
  - distinct reference block types if known
  - decision-point count if known
  - NPC/live enemy presence
  - dossier link

Constraints:
- Use relative links from the index to dossier files.
- Keep rows short enough that an orchestration model can scan the table.

### 5. Tests

Required tests:
- XML metric extraction counts blocks and distinct block types for a representative snippet.
- Decision-point and max-depth calculations are stable for nested conditionals.
- Dossier output for one ordinary level includes identity, concept matrix row, toolbox facts, and XML metrics.
- Dossier output for one project level includes project id/shared-workspace signals.
- Summary index contains links to generated dossier paths.

## Work Plan

1. Inspect existing Plan 60-64 readiness/workbench tooling and reuse it where practical.
2. Design a JSON-like intermediate data shape for one level dossier.
3. Implement pure helpers for XML metrics and level fact extraction.
4. Implement Markdown rendering for dossiers and summary index.
5. Add CLI command and safe output folder creation.
6. Add focused tests.
7. Generate dossiers and summary index.
8. Write the progress report with command results and known gaps.

## Commands

Run from the repository root:

```powershell
npm run level:dossiers
node --test --test-isolation=none tests/unit/level-dossiers.test.js
npm test
```

If the implementation reuses or changes readiness prompt code:

```powershell
node --test --test-isolation=none tests/unit/level-readiness.test.js tests/unit/level-readiness-prompt.test.js
```

## Validation Checklist

- [ ] `npm run level:dossiers` creates per-level Markdown dossiers.
- [ ] `summary-index.md` exists and links to each dossier.
- [ ] Generated output uses repository-relative paths.
- [ ] Dossiers distinguish facts from unavailable data.
- [ ] XML metrics are covered by tests.
- [ ] Ordinary, project, prediction/bughunt/challenge/optional categories are represented accurately.
- [ ] No guided level source, fixtures, or curriculum docs were changed except packet/index docs.
- [ ] `npm test` passes.
- [ ] Final report lists commands run and any extraction gaps.

## Stop Conditions

Stop and report if:
- Existing level metadata is inconsistent enough that category/order cannot be derived safely.
- The generator would need to change authored levels or fixtures.
- XML metric extraction requires a new dependency.
- Board rendering becomes ambiguous enough that the output might mislead a curriculum reviewer.
- The work starts making recommendations instead of compiling evidence.
