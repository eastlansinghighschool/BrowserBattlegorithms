# Plan 06: Guided Campaign Pilot Playtest And Project Readiness Triage

## Packet Metadata

- Packet id: plan-06
- Packet title: Guided Campaign Pilot Playtest And Project Readiness Triage
- Status: complete
- Owner/model: browser-capable lower-cost agent, human playtester, or integration-owner-led student pilot
- Date: 2026-05-13
- Packet type: scan-only / browser QA / pedagogy / pilot-readiness
- Mutation level: none
- Approval gate: before mutation
- Expected artifacts:
  - one bounded report file per guided level attempted
  - guided project arc readiness notes
  - AP CSA transfer and tournament readiness notes
  - usage/export/admin smoke notes
  - updated Plan 06 `progress.md`
  - final triage table
  - pilot decision memo
  - recommended follow-up packets or targeted fixes
  - progress report
- Progress report folder: `reports/development/plan-06-guided-playtest-triage/`
- Progress report file: `reports/development/plan-06-guided-playtest-triage/progress.md`

## Packet Summary

Goal: Playtest the revised guided campaign as a student-facing learning sequence, with special attention to project carry-forward behavior, AP CSA transfer, classroom pilot readiness, and whether the campaign prepares students for a post-exam tournament.

Non-goals:

- Do not edit source code, tests, docs, fixtures, or generated artifacts in this packet.
- Do not redesign levels during the playtest.
- Do not inspect level source or reference solutions before attempting a level unless blocked, and clearly mark that pivot in the report.
- Do not turn this into an automated regression or replacement for Plan 16.
- Do not invent new mechanics, tournament rules, or curriculum direction without integration-owner review.
- Do not bypass the Plan 19 prompt/context/report workflow unless the harness is broken and the report marks the deviation.

Depends on:

- Plans 01-05 and 07-18 complete.
- Plan 19 complete.
- The guided campaign, project metadata, usage pipeline, help updates, subsystem docs, and project solution/test harness work reflect current repository truth.
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md` exists.
- `reports/development/plan-06-guided-playtest-triage/level-context/` contains compact context files.
- The Plan 19 dev-only guided-level deep link works locally.

Blocks:

- Confidence that the revised guided sequence is ready for a 35-student pilot.
- Confidence that the AP CSA post-exam activity can culminate in a tournament without major student confusion.
- Decisions about targeted pre-class fixes, teacher warnings, tournament constraints, or post-pilot feature packets.

Why this packet exists:

Passing tests and reference/project solution fixtures prove that authored solutions can work. They do not prove that students can understand prompts, build and revise code across project levels, diagnose one-action-per-turn behavior, use runner index roles, export usage evidence, or translate the guided experience into tournament strategy. This packet turns the revised campaign experience into a prioritized readiness decision.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
  - `docs/development/plan-19-guided-playtest-harness-and-gemini-scaffolding.md`
  - `docs/development/project-sequence-decisions.md`
  - `docs/development/project-level-map.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `vite.config.js`
  - `playwright.config.js`
  - `src/`
  - `tests/`
- Runtime contracts:
  - `docs/subsystems/` — subsystem notes are authoritative for behavior they cover. If observed behavior contradicts a subsystem note, report the conflict instead of deciding which source is wrong.
- Current packet tracking:
  - `docs/development/README.md`

Required product contracts:

- Playtest like a student, not like an implementation agent.
- Record confusion and friction even when the level is technically solvable.
- Guided levels should teach one primary concept at a time unless clearly marked as synthesis/challenge/project levels.
- Project levels should feel like improving one carried-forward strategy, not like mysterious persistence.
- Challenge/synthesis levels should feel like "use what you know," not surprise new-mechanic lessons.
- Multi-ally levels should support decentralized strategy thinking through local sensing, runner index roles, resource checks, and shared code.
- Student programs run from the required `On Each Turn` event block, and only the first reached action executes per runner turn.
- The app should remain classroom-reliable as a static Vite deployment.

Do not redefine:

- Campaign order, project membership, or project names.
- Game rules, Blockly semantics, or one-action-per-turn behavior.
- Usage export schema, analyzer semantics, or admin-page claims.
- Tournament format; recommend constraints, but leave final tournament decisions to the integration owner.

## Required Reading

Read these first:

- `docs/GameSpecification.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`

Subsystem notes to understand before judging behavior:

- `docs/subsystems/blockly-workspace.md` — project-shared workspaces, reset/load/preserve behavior, ignored-block warnings.
- `docs/subsystems/ui-mode-contract.md` — challenge/project badges, project-start callout, mode-specific controls.
- `docs/subsystems/turn-engine.md` — one-action-per-turn, bounce/illegal/skipped, scoring and reset.
- `docs/subsystems/file-pipelines.md` — Guided vs Free Play import/export and usage export distinction.
- `docs/subsystems/usage-and-admin.md` — usage export/admin interpretation and anomaly language.

Optional/contextual:

- `docs/development/plan-15-pilot-readiness.md`
- `docs/development/plan-16-usage-pipeline-regression.md`
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- `reports/development/plan-06-guided-playtest-triage/progress.md`
- `reports/development/plan-06-guided-playtest-triage/level-context/`
- `package.json`
- `playwright.config.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`

Do not inspect individual level source before attempting a level unless the playtest is blocked.

For routine Gemini runs, read only:

- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- `reports/development/plan-06-guided-playtest-triage/progress.md`
- the current level's context file under `reports/development/plan-06-guided-playtest-triage/level-context/`

Escalate to the broader required reading only when the reusable prompt or context file says to, or when the run hits a stop condition.

## Scope

### In scope

- Browser playtesting guided levels one at a time or in small adjacent batches.
- Using Plan 19 dev-only deep links for isolated level playtests.
- Using Plan 19 level-context files to keep Gemini context small.
- Writing one report file per level under the Plan 06 working folder.
- Updating Plan 06 `progress.md` after each attempted level.
- Recording visible tutorial, copy, toolbox, badge, project-callout, and UI issues.
- Recording whether level goals and pass/fail feedback are understandable.
- Recording whether the available tools feel sufficient and appropriately introduced.
- Recording whether challenge levels are correctly signaled as no-new-tool synthesis.
- Recording whether turn limits support learning and debugging.
- Evaluating project carry-forward behavior across L23-L28 and L29-L37.
- Evaluating runner index, shared-program, resource-readiness, and role-based strategy comprehension.
- Performing a lightweight usage/export/admin smoke check.
- Producing a pilot decision memo and bounded follow-up recommendations.

### Files and areas likely touched

- `reports/development/plan-06-guided-playtest-triage/progress.md` — create or update with findings.
- `reports/development/plan-06-guided-playtest-triage/levels/*.md` — per-level reports.
- `reports/development/plan-06-guided-playtest-triage/project-arcs/*.md` — project arc reports.
- Optional generated-local evidence, if useful:
  - screenshots captured during playtest
  - downloaded usage JSON files created during smoke checks
  - admin-page screenshots from smoke checks

Generated-local evidence should stay under the progress report folder unless the integration owner gives a different location.

### Out of scope

- Source edits.
- Test edits.
- Docs edits outside the progress report.
- Level redesign.
- New guided levels.
- Free Play AI redesign.
- Tournament implementation.
- Build optimization.
- Full accessibility overhaul.
- Full Plan 16 end-to-end usage regression.
- Editing the Plan 19-generated reusable Gemini prompt or level context files, unless the integration owner explicitly asks.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

This packet does not authorize source, test, documentation, dependency, GitHub configuration, deployment, or production mutations. If any of those are needed, stop and ask for integration-owner review.

## Playtest Lenses

### 1. Student Comprehension

For each level, ask:

- Can a student tell what they are supposed to do from visible UI and tutorial/help copy?
- Does the level introduce or reinforce the concept named in the concept matrix?
- Does the toolbox support the intended strategy without giving away the answer?
- Does the demo Blockly show structure without becoming the exact solution?
- Are failure and success states understandable?

### 2. Project Carry-Forward Readiness

For L23-L28 (`strategy-brain`) and L29-L37 (`team-strategy-script`), ask:

- Is it clear when a project begins?
- Is it clear that the same code carries forward?
- Is it clear that `Reset Level` resets the board but preserves project code?
- Does each level feel like improving one strategy rather than starting over?
- Does backward navigation within the project behave in a way a student can understand?
- Do capstone levels feel like honest synthesis of the project work?

### 3. AP CSA Transfer Signals

Record evidence of whether the sequence supports:

- boolean reasoning with `if`, `else`, `AND`, `OR`, and `NOT`
- comparison reasoning with distance, runner index, and numeric thresholds
- method-like thinking: one `On Each Turn` program returns one action per ally turn
- role decomposition through runner index
- local-state strategy: reacting to board conditions instead of central command
- debugging by prediction and tracing rather than random block swapping

### 4. Tournament Readiness

Evaluate whether students completing the campaign would plausibly be ready for a tournament:

- Do late levels prepare students to build a shared multi-ally strategy?
- Do students see why offense/defense/support roles matter?
- Do students understand resource checks before jump, barrier, or freeze actions?
- Does Free Play need teacher constraints such as fixed team size, fixed map, turn limit, or no-human-runner matches?
- What tournament setup would be fair and simple enough for a post-exam AP CSA class?

### 5. Usage And Admin Smoke Check

This is a smoke check, not Plan 16.

- Export usage after at least one partial guided run.
- Confirm the export prompt is findable and understandable.
- Upload one or two files to the admin page or run the CLI analyzer if practical.
- Record whether the teacher-facing output is understandable enough for pilot use.
- Record any wording that could make students confuse usage export with program export.

## Scan Requirements

### Requirement 1: Progress-based next-level selection

Required behavior: Before each Gemini playtest run, determine the next target by reading `reports/development/plan-06-guided-playtest-triage/progress.md` and finding the first level in order whose per-level report is missing, incomplete, or marked for retry.

Constraints:
- Do not rely on memory from prior Gemini runs.
- Do not skip ahead unless `progress.md` explicitly marks a level deferred or blocked.
- If `progress.md` and the report folder disagree, prefer the actual report files and note the mismatch.

Edge cases:
- If the progress file is missing or malformed, stop and report that Plan 19 scaffolding is incomplete.

Expected artifact: updated `progress.md` after each run.

### Requirement 2: Student-mode level playtest

Required behavior: Attempt guided levels using only visible UI, tutorial overlays, help text, and available Blockly blocks.

Constraints:
- Start isolated level runs through the Plan 19 dev-only deep link listed in the level context file.
- Do not inspect level source, test fixtures, or reference solutions before attempting the level.
- Do not use source knowledge to solve a level unless the level is blocked and the report marks the pivot.
- Use a consistent maximum-attempt policy for each level or batch.
- Write exactly one bounded report file for the level, using the report template from `gemini-prompt.md`.

Edge cases:
- If browser automation cannot drag Blockly reliably, switch to a human playtester or report the automation limitation separately from app behavior.
- If a level cannot be attempted because of UI/runtime failure, stop the affected batch and report the blocker.
- If the dev deep link fails, stop and report a Plan 19 harness blocker rather than falling back silently to manual level-picker navigation.

Expected artifact: per-level report under `reports/development/plan-06-guided-playtest-triage/levels/`.

### Requirement 3: Per-level bounded report

Required behavior: Each level report must be complete enough for a later orchestrator to summarize without re-running the browser session.

Constraints:
- Use the exact template from `gemini-prompt.md`.
- Include pass/fail/not attempted, attempts, approximate time, strategy tried, confusing UI/copy, toolbox sufficiency, feedback clarity, turn-limit impression, AP CSA signal, likely student blocker, screenshots/evidence if any, and recommended action.
- Keep the report focused. Do not paste source code or large XML.

Edge cases:
- If the level is blocked before a meaningful attempt, write a blocker report instead of leaving the level unreported.

Expected artifact: one per-level markdown report.

### Requirement 4: Project-arc continuity check

Required behavior: Evaluate L23-L28 and L29-L37 as continuous project arcs in addition to isolated deep-link checks.

Constraints:
- Preserve the project workspace while moving through each arc.
- Start each arc through normal guided flow or through the first project level deep link, then continue through the app's normal next-level/project behavior.
- Observe whether reset, backward navigation, project badges, project-start callouts, and persistent indicators match student expectations.
- Do not decide new project membership or toolbox policy.

Edge cases:
- If project carry-forward behavior appears broken or surprising, compare the observation to `docs/subsystems/blockly-workspace.md` and `docs/subsystems/ui-mode-contract.md`, then report the conflict.

Expected artifact: separate project-arc reports for `strategy-brain` and `team-strategy-script`.

### Requirement 5: Full-flow spot checks

Required behavior: Run a small number of normal-flow checks so deep linking does not hide classroom friction.

Constraints:
- Include at least one early onboarding run from the normal app entry point.
- Include at least one transition into a challenge level through normal navigation.
- Include at least one transition into each project arc through normal navigation.
- Record any difference between direct deep-link experience and normal classroom navigation.

Edge cases:
- If time is too short to run all normal-flow checks, mark deferred checks explicitly in `progress.md`.

Expected artifact: notes in `progress.md` or project-arc reports.

### Requirement 6: AP CSA and decentralized-strategy evidence

Required behavior: Record where the sequence supports or fails to support AP CSA transfer and local-rule team strategy.

Constraints:
- Look specifically for boolean reasoning, comparisons, runner index, resource readiness, and one-program-per-ally-turn thinking.
- Distinguish "student needs a teacher prompt" from "level/source behavior is wrong."

Edge cases:
- If a level can be solved while bypassing the concept it claims to teach, flag it as a level design risk.

Expected artifact: AP CSA transfer notes and recommended teacher discussion prompts.

### Requirement 7: Tournament readiness check

Required behavior: Judge whether the revised guided sequence prepares students to build tournament-worthy Free Play strategies.

Constraints:
- Recommend tournament constraints only as recommendations: fixed map, fixed team size, turn limit, human-runner policy, or tie-break rule.
- Do not design or implement tournament UI in this packet.

Edge cases:
- If the guided sequence does not prepare students for the intended tournament format, recommend either a teacher runbook adjustment or a follow-up packet.

Expected artifact: tournament readiness notes and follow-up recommendation.

### Requirement 8: Usage/export/admin smoke check

Required behavior: Perform a lightweight check that usage export can be found, completed, and reviewed.

Constraints:
- This is not Plan 16 and should not become a full regression.
- Keep generated usage files and screenshots in the progress report folder if retained.
- Do not change usage tracker, analyzer, admin page, or file formats.

Edge cases:
- If usage export or admin review fails, report whether it blocks pilot use or can be worked around by teacher instructions.

Expected artifact: usage/export/admin smoke notes, or a clear note that this check was not run.

## Model-Specific Instructions

When handing this packet to a lower-cost browser-capable model:

- Ask it to summarize the job before starting the playtest.
- Give it `gemini-prompt.md`, `progress.md`, and only the current level context file for routine per-level runs.
- Let it determine the next level from `progress.md` unless you are intentionally assigning a specific level.
- Give the maximum attempt count.
- Use the report format from `gemini-prompt.md`, not an open-ended "review the app" prompt.
- Tell it not to inspect source, tests, fixtures, or reference solutions before attempting assigned levels.
- Tell it not to edit files except the assigned per-level report and `progress.md`.
- Tell it to stop on low-confidence pedagogy, Blockly semantics, accessibility barriers, collision/game-rule behavior, project carry-forward contradictions, usage/export blockers, or deployment questions.
- Prefer multiple small playtest batches over one huge browser run when time allows.

## Agent Playtest Method

This packet is especially suited to browser-capable lower-cost agents in small batches. A human pilot observer can use the same report format.

Recommended orchestration:

- Run one guided level per Gemini invocation by default.
- Use small adjacent batches only when the levels are simple and the report files remain separate.
- Let Gemini select the next level by reading `progress.md`, unless the integration owner overrides.
- Have Gemini read only the current level context file, then open the dev deep-link URL listed there.
- Treat project arcs as arcs, not only independent levels. At minimum, run L23-L28 in order and L29-L37 in order during one continuous workspace session each.
- Give the playtester only:
  - level number/id/title
  - learning goal if known
  - whether the level is ordinary, challenge, project step, or project capstone
  - instruction to use only visible UI/tutorials/help
  - maximum attempts
  - report format
- Tell the playtester not to inspect source files.
- Tell the playtester to stop after repeated failure and report confusion.

Example per-level prompt:

```text
Use reports/development/plan-06-guided-playtest-triage/gemini-prompt.md. Read progress.md, choose the next unreported level, read only that level's context file, open its devGuidedLevel URL, and play it like a student for up to 4 attempts. Write the per-level report and update progress.md. Stop if you hit a Plan 06 stop condition.
```

Example project-arc prompt:

```text
Play Guided Levels 23-28 in order as one continuous project arc. Use only visible UI/tutorials/help and do not inspect source files. Treat the carried-forward workspace as part of the student experience. Report whether project start, code carry-forward, reset behavior, toolbox breadth, and capstone expectations were clear.
```

Context between prompts:

- The agent does not need full repo context each time.
- Give level-specific learning goals only when helpful.
- For challenge levels, explicitly say no new block is expected.
- For project levels, remind the agent to watch how carried code and project indicators feel.
- For late multi-ally levels, remind the agent to look for shared-program and runner-index role logic.

## Report Requirements

For each level, create the per-level report file named in that level's context file. Each report must include:

- level order
- level id/title
- level type: ordinary / challenge / project step / project capstone / optional
- pass/fail/not attempted
- number of attempts
- approximate time
- main strategy tried
- confusing copy or UI
- toolbox sufficiency
- badge/project/capstone signal clarity
- win/loss feedback clarity
- turn-limit impression
- AP CSA transfer signal observed
- likely student blocker
- recommended action:
  - no change
  - teacher warning
  - copy tweak
  - UI tweak
  - level balance review
  - project-arc review
  - canonical/source review
  - human review required

After all per-level reports are complete or explicitly deferred, create a final summary in `progress.md` or a dedicated summary section with:

### Project Arc Notes

- L23-L28 `strategy-brain`: strengths, confusion points, carry-forward clarity, capstone readiness.
- L29-L37 `team-strategy-script`: strengths, confusion points, runner-index role clarity, capstone readiness.

### AP CSA Transfer Notes

- strongest levels for boolean reasoning
- strongest levels for comparison/numeric reasoning
- strongest levels for runner-index role decomposition
- misconceptions likely to appear in AP CSA terms
- candidate teacher discussion prompts

### Tournament Readiness Notes

- whether the campaign prepares students for team-strategy competition
- recommended tournament constraints
- levels or concepts to review before tournament day
- risks for long defensive stalemates or confusing match outcomes
- whether a tournament MVP/runbook should be created before class

### Usage/Admin Smoke Notes

- usage export findability
- prompt and downloaded-file clarity
- admin/CLI output clarity if checked
- any student-facing confusion between program files and usage files

### Pilot Decision Memo

End the report with one of:

- `Ready for pilot`
- `Ready for pilot with teacher warnings`
- `Must fix before pilot`
- `Blocked`

Then list:

- top 10 classroom-readiness risks
- levels most likely to need teacher intervention
- levels most likely to be too easy
- levels most likely to be too brittle
- fixes that should happen before the 35-student pilot
- fixes that can wait until after pilot data
- recommended follow-up packets

## Work Plan

1. Inspect Plan 19 artifacts and confirm the dev deep-link harness, Gemini prompt, level contexts, and report scaffold exist.
2. Start the local app and confirm the current build/test baseline if needed.
3. For routine runs, read `gemini-prompt.md`, `progress.md`, and the next level context only.
4. Open the current level with the Plan 19 `?devGuidedLevel=<levelId>` URL.
5. Play the level like a student for the allowed number of attempts.
6. Write the per-level report file and update `progress.md`.
7. Repeat level-by-level until all guided levels are reported, blocked, or deferred.
8. Run normal-flow spot checks so direct links do not hide onboarding, challenge, or project-entry friction.
9. Playtest L23-L28 as the `strategy-brain` project arc and write the project-arc report.
10. Playtest L29-L37 as the `team-strategy-script` project arc and write the project-arc report.
11. Smoke check usage export and admin/CLI review with one or two files if practical.
12. Stop before any mutation beyond Plan 06 report files and generated-local evidence.
13. Summarize patterns, pilot readiness, tournament readiness, and prioritized follow-ups in the final progress summary.

## Validation Commands

This is scan-only. If running locally:

```powershell
npm test
npm run build
npm run dev
```

Use browser automation or human browser play against the local dev server.

Optional smoke commands:

```powershell
npm run test:browser
npm run test:regression
```

Only run `npm run test:regression` when time allows. Do not treat it as a substitute for student-mode playtesting.

## Validation Checklist

- [ ] Required progress report exists.
- [ ] Plan 19 is complete.
- [ ] `gemini-prompt.md` exists and was used for routine Gemini runs.
- [ ] Level-context files exist and were used for routine Gemini runs.
- [ ] Plan 19 dev deep links work for isolated level runs.
- [ ] Any retained generated-local evidence is under the progress report folder.
- [ ] Each guided level has a per-level report or is explicitly marked blocked/deferred.
- [ ] `progress.md` accurately reflects per-level report status.
- [ ] Challenge/synthesis levels are evaluated for signifier and no-new-tool clarity.
- [ ] L23-L28 are evaluated as a continuous project arc.
- [ ] L29-L37 are evaluated as a continuous project arc.
- [ ] Normal-flow spot checks cover onboarding, challenge entry, and both project entries.
- [ ] Project carry-forward, reset behavior, and project indicators are evaluated.
- [ ] Late multi-ally levels are evaluated for shared-program and runner-index comprehension.
- [ ] AP CSA transfer notes cover boolean logic, comparisons, and role decomposition.
- [ ] Tournament readiness notes recommend constraints or identify blockers.
- [ ] Usage/export/admin smoke notes are included or explicitly marked not checked.
- [ ] Guided level count, order, and documentation agreement are checked or explicitly deferred.
- [ ] Toolbox restrictions are evaluated against the intended curriculum path.
- [ ] Demo Blockly is evaluated for structure-without-solution risk where visible during play.
- [ ] Level win conditions are flagged if they do not require the mechanic the lesson claims to teach.
- [ ] Accessibility and classroom-display concerns are covered or explicitly deferred.
- [ ] Static Vite build behavior is checked with `npm run build` or explicitly deferred.
- [ ] If observed behavior contradicts a subsystem note, the conflict is surfaced rather than silently resolved.
- [ ] Report distinguishes student confusion from implementation bugs.
- [ ] Report recommends bounded follow-up packets.
- [ ] No source files were edited.
- [ ] No unrelated files were changed.
- [ ] Final report lists commands run and any remaining risks.

## Stop Conditions

Stop and report if:

- The app cannot launch.
- Plan 19 artifacts are missing, incomplete, or misleading.
- The dev deep link does not load the intended level.
- A level cannot be attempted because of a UI/runtime error.
- Required docs and source/test behavior disagree in a way that changes playtest scope.
- Project workspace carry-forward appears broken or contradicts subsystem docs.
- Usage export or admin smoke check reveals a schema/runtime issue that blocks pilot use.
- The browser agent repeatedly gets stuck due to automation limitations rather than app behavior.
- Playtesting reveals a broad rule, project-sequence, or curriculum contradiction that needs integration-owner review.
- Any fix would require changing gameplay behavior, Blockly semantics, source-of-truth docs, or tournament policy.
- Validation fails in a way that changes the packet scope.
- A dependency, workflow, deployment, or production choice appears necessary.
- A UI or Blockly behavior could mislead students about game rules or boolean semantics.
- The packet would require changing a statement in `docs/subsystems/*.md` and the correction needs pedagogy, architecture, or contract judgment.
