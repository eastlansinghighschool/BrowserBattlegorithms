---
id: plan-74
title: "Guided Reference Behavior Evidence"
status: complete
depends_on: []
gate: "before changing game rules, guided levels, fixtures, reference solutions, or runtime semantics"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Generate deterministic reference-run and NPC/enemy behavior evidence for guided levels, linked to the complexity-audit dossier set.
---
# Plan 74: Guided Reference Behavior Evidence

- Packet id: Plan 74
- Packet title: Guided Reference Behavior Evidence
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent
- Date: 2026-05-21
- Packet type: developer tooling / reports / testing / scan-prep
- Mutation level: source-code / tests / generated-local / docs
- Approval gate: before changing game rules, guided levels, fixtures, reference solutions, or runtime semantics
- Expected artifacts:
  - deterministic reference-run evidence appended to or generated alongside Plan 73 dossiers
  - per-level run transcripts where applicable
  - NPC/enemy behavior summaries for live or unfrozen enemies
  - summary table of reference result, turn count, and interaction evidence
  - focused tests for evidence extraction
  - progress report
- Progress report folder: `reports/development/plan-74-guided-reference-behavior-evidence/`
- Progress report file: `reports/development/plan-74-guided-reference-behavior-evidence/progress.md`

## Packet Summary

Goal: Generate factual runtime evidence for guided levels so the later complexity audit can see what reference solutions actually do, how many turns they take, which conditions/actions fire, and whether live enemies matter.

Non-goals:
- Do not redesign levels.
- Do not update reference solutions.
- Do not make curriculum judgments.
- Do not change NPC behavior, turn rules, Blockly semantics, scoring, collision, or fixture policy.
- Do not require browser screenshots.
- Do not add dependencies or server behavior.

Depends on:
- Plan 73 generated dossier output and output folder convention.
- Existing guided reference solution fixtures and project solution fixtures.
- Existing Plan 60 readiness/reference-run tooling.
- Existing event log and trace collection infrastructure where available.

Blocks:
- Plan 75 should consume the generated behavior evidence for orchestration-grade curriculum analysis.

Why this packet exists:
Static level facts show what a level exposes, but not what the level actually demands. The audit needs low-cost, deterministic evidence about reference-solution behavior, enemy relevance, turn pressure, and whether the new concept is genuinely used during play.

## Authority And Contracts

Required project contracts:
- Reference fixtures remain the authoritative runnable solutions for guided levels where they exist.
- Project checkpoint/final fixtures remain governed by existing project-solution policy.
- Turn resolution order belongs to `docs/subsystems/turn-engine.md`.
- Blockly first-action-only semantics belong to `docs/subsystems/blockly-workspace.md`.
- NPC behavior contracts belong to `docs/subsystems/npc-and-cpu.md`.
- Generated evidence must not silently change source-of-truth docs or level files.

Do not redefine:
- Which levels require human input or prediction choices.
- Known documented project-solution exceptions.
- Guided NPC behavior.
- Reference-solution acceptance criteria.
- Usage/export semantics.

## Required Reading

Read before editing:
- `docs/development/plan-73-guided-level-dossier-generator.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/npc-and-cpu.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `src/dev/levelReadiness.js`
- `src/dev/levelReadinessProjectPolicy.js`
- `src/core/events.js`
- `src/core/turnEngine.js`
- `src/ai/blockly/interpreter.js`
- `src/ai/npc/`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/`
- `tests/unit/fixtures/guided-project-solutions/`

Use `rg` for:
- `runGuidedLevelWithSolution`
- `GUIDED_LEVEL_REFERENCE_SOLUTIONS`
- `GUIDED_PROJECT_REFERENCE_SOLUTIONS`
- `lastTurnEventLog`
- `currentTurnEventLog`
- `lastBlocklyTrace`
- `cpuBehavior`
- `isFrozen`
- `reference`

## Scope

### In Scope

- Generate runtime evidence files under `reports/development/guided-level-complexity-audit/behavior-evidence/`.
- Append links from generated dossiers or summary index to behavior evidence files if Plan 73 structure makes that straightforward.
- For each runnable guided reference/project fixture, run the deterministic harness and report pass/fail, turn count, score events, level result reason, and trace/event summaries.
- For non-runnable or special levels, report why runtime evidence is not applicable or requires manual/human input.
- Summarize what each reference solution actually does over the first relevant turns.
- Summarize live/unfrozen enemy/NPC behavior for the first several own turns where feasible.
- Add focused tests for generated evidence shape and representative categories.
- Update `docs/development/README.md` to list Plan 74.

### Out Of Scope

- Changing fixtures to make levels pass.
- Creating new reference solutions.
- Browser playthroughs.
- Visual screenshots.
- Curriculum recommendations.
- Level edits.
- New runtime events unless an existing event is clearly missing and the packet stops for owner review.

### Files And Areas Likely Touched

- `src/dev/`
- `scripts/`
- `package.json`
- `tests/unit/`
- `reports/development/guided-level-complexity-audit/`
- `reports/development/plan-74-guided-reference-behavior-evidence/progress.md`
- `docs/development/README.md`

## Implementation Requirements

### 1. Command Shape

Required behavior:
- Add a deterministic command for generating runtime behavior evidence.
- Prefer a command name similar to:

```powershell
npm run level:behavior-evidence
```

- The command should write generated Markdown files under `reports/development/guided-level-complexity-audit/behavior-evidence/`.
- The command may also update a generated `behavior-summary-index.md`.

Constraints:
- Safe to rerun.
- Overwrite only this packet's generated output files.
- No browser required.
- No dependency installs.

### 2. Reference Run Evidence

For each applicable level, report:
- level id/title/order
- fixture path used
- fixture kind: one-off reference, project checkpoint, project final, not applicable
- result: pass/fail/not run/documented exception
- turns elapsed
- final `activeLevelResult`
- `lastLevelResultReason`
- team scores
- scoring and blocked-scoring events
- flag pickup/drop events if present
- resource unavailable events if present
- ignored/extra-action evidence if available
- short trace/event tail

Constraints:
- Do not treat a documented expected project exception as an unqualified failure.
- Do not hide failures. The point is evidence, not greenwashing.
- Keep transcripts concise. Prefer first N meaningful turns plus final tail over full long logs.

### 3. Reference Solution Action Summary

Required behavior:
- Summarize what controlled allies do under the reference solution.
- Include turn/runner/action rows when available.
- Include key branch outcomes or trace step summaries if existing trace data supports it.
- Call out if the reference solution does not use the level's named new block or mechanic, as a factual observation only.

Constraints:
- Phrase observations neutrally, for example: `Reference action summary did not include Jump Forward`.
- Do not infer whether that is good or bad.

### 4. Enemy/NPC Behavior Evidence

Required behavior:
- For each level with live or unfrozen enemies/NPCs, report:
  - NPC behavior constant/name
  - starting position and frozen state
  - first several chosen actions if the NPC gets turns during the run
  - whether an enemy interacts with player/allies through collision, flag pickup, blocked scoring, or proximity events if observable
- For frozen or stationary teaching props, report that fact clearly.

Constraints:
- Do not require full pathfinding analysis.
- Do not make subjective threat judgments. Use observable phrases such as `no collision events`, `enemy remained frozen`, or `enemy moved within 2 spaces of carrier`.

### 5. Summary Index

Required behavior:
- Generate `behavior-summary-index.md` with one row per level.
- Include columns for:
  - order
  - level id
  - fixture kind
  - run status
  - turns elapsed
  - reference action count
  - distinct action types observed
  - branch/trace evidence present
  - live enemy acted
  - enemy interaction events
  - behavior evidence link

### 6. Tests

Required tests:
- Evidence generation identifies at least one ordinary passing level.
- Evidence generation reports a not-applicable reason for a human-input or prediction level.
- Evidence generation reports project fixture policy status for a project level.
- NPC behavior summary includes behavior name and first action for a level with an acting NPC, if one exists.
- Summary index includes behavior links.

## Work Plan

1. Inspect Plan 73 output structure and existing readiness/reference harness.
2. Design a compact evidence data shape separate from curriculum recommendations.
3. Implement run/evidence collection for ordinary, project, and special-case levels.
4. Implement Markdown renderers for per-level evidence and summary index.
5. Add command and tests.
6. Generate evidence output.
7. Write progress report with command results, not-run counts, and known instrumentation gaps.

## Commands

Run from the repository root:

```powershell
npm run level:behavior-evidence
node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js
npm test
```

If readiness/workbench code is changed:

```powershell
node --test --test-isolation=none tests/unit/level-readiness.test.js tests/unit/workbench-run-panel.test.js
```

## Validation Checklist

- [ ] Behavior evidence files are generated for all in-scope guided levels or explain not-applicable status.
- [ ] `behavior-summary-index.md` exists.
- [ ] Reference run pass/fail/exception statuses are visible.
- [ ] Turn counts and event summaries are included.
- [ ] Enemy/NPC action evidence is included where observable.
- [ ] No guided source or fixture files were changed.
- [ ] Tests cover representative evidence cases.
- [ ] `npm test` passes.
- [ ] Final report lists commands run and any instrumentation limitations.

## Stop Conditions

Stop and report if:
- Reliable reference-run evidence requires changing the turn engine or Blockly interpreter.
- A fixture failure appears to require level/source changes.
- Enemy behavior cannot be observed without adding new runtime events.
- The packet starts making curriculum/design recommendations.
- Existing Plan 73 output format is missing or unstable enough that this packet cannot link to it safely.
