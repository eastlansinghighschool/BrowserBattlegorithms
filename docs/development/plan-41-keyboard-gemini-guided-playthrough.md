---
id: plan-41-keyboard-gemini-guided-playthrough
title: "Keyboard-First Gemini Guided Playthrough Campaign"
status: complete
depends_on: []
gate: "before any source, test, fixture, level, dependency, deployment, or packet-index mutation"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Revive the archived Plan 06 guided playtest as a new keyboard-first Gemini campaign. Consumes Plan 40 keyboard workflows plus Plan 06/19/22 scaffolding, writes new reports under a Plan 41 folder, and leaves existing Plan 06 artifacts untouched.
---
# Plan 41: Keyboard-First Gemini Guided Playthrough Campaign

## Packet Metadata

- Packet id: plan-41
- Packet title: Keyboard-First Gemini Guided Playthrough Campaign
- Status: (see frontmatter)
- Owner/model: browser-capable Gemini/playtest agent with orchestration review
- Date: 2026-05-17
- Packet type: scan-only / browser QA / pedagogy / accessibility-informed playtest
- Mutation level: generated-local / docs-only reports
- Approval gate: before any source, test, fixture, level, dependency, deployment, or packet-index mutation
- Expected artifacts:
  - one bounded report file per guided level attempted
  - updated Plan 41 progress report
  - keyboard-workflow friction log
  - pilot-readiness and Plan 06 comparison memo
  - recommended follow-up packets or repairs
- Progress report folder: `reports/development/plan-41-keyboard-gemini-guided-playthrough/`
- Progress report file: `reports/development/plan-41-keyboard-gemini-guided-playthrough/progress.md`

## Packet Summary

Goal: Revive the aborted Plan 06 guided playtest campaign using keyboard-first Blockly navigation from Plan 40, so Gemini can evaluate guided levels as a student-facing experience without wasting most of its effort on pixel-accurate drag-and-drop.

Non-goals:

- Do not edit source code, tests, docs outside the Plan 41 report folder, fixtures, level files, or old Plan 06 artifacts.
- Do not rewrite or delete `reports/development/plan-06-guided-playtest-triage/`.
- Do not inspect level source or reference solutions before attempting a level unless blocked.
- Do not bypass the student-facing app by loading XML through test hooks.
- Do not make gameplay, curriculum, accessibility, layout, or Blockly implementation decisions.
- Do not declare Plan 40 complete; consume it only after it has passed integration review.
- Do not deploy.

Depends on:

- Plan 40 complete and reviewed as ready for use.
- Plan 19 complete, especially the local-dev `devGuidedLevel` deep link.
- Plan 22 complete or otherwise stable enough that `devGuidedLevel` remains usable.
- Archived Plan 06 packet and existing Plan 06 scaffolding available for bootstrapping.

Blocks:

- Renewed confidence that Gemini can perform guided campaign triage with less browser-control flailing.
- A decision about whether Plan 06 should remain archived as a mouse/drag attempt, while Plan 41 becomes the new browser-agent playtest record.
- Follow-up repair packets for levels, prompts, keyboard navigation, layout, accessibility, or Gemini instructions.

Why this packet exists:

Plan 06 was valuable as a pedagogical playtest design, but browser-agent interaction with Blockly drag-and-drop proved too brittle. Plan 40 creates a possible deterministic keyboard path through Blockly. This packet reuses Plan 06's playtest structure, level context, and reporting discipline while creating a clean new campaign record focused on what Gemini can learn, build, and report when it uses keyboard-first Blockly authoring.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/StudentGuide.md`
  - `docs/TeacherGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
  - `docs/development/archive/plan-06-guided-playtest-triage.md`
  - `docs/development/archive/plan-19-guided-playtest-harness-and-gemini-scaffolding.md`
  - `docs/development/archive/plan-22-dev-guided-blockly-assist.md`
  - `docs/development/plan-40-blockly-keyboard-navigation.md`
- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/p5-surface-map.md`
  - `docs/subsystems/ui-mode-contract.md`
  - `docs/subsystems/turn-engine.md`
  - `docs/subsystems/file-pipelines.md`
  - `docs/subsystems/usage-and-admin.md`
- Bootstrap artifacts:
  - `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
  - `reports/development/plan-06-guided-playtest-triage/progress.md`
  - `reports/development/plan-06-guided-playtest-triage/level-context/`
  - `reports/development/plan-06-guided-playtest-triage/levels/` if existing reports are useful comparison material
  - `reports/development/plan-40-blockly-keyboard-navigation/progress.md`

Required product contracts:

- Playtest like a student, not like an implementation agent.
- Use the live app UI.
- Student programs run from the required `On Each Turn` event block.
- Only the first reached action executes per runner turn.
- Guided mode should teach one primary concept at a time unless clearly marked as synthesis/challenge/project.
- Challenge/synthesis levels should feel like "use what you know," not surprise new-tool lessons.
- Project levels should feel like improving one carried-forward strategy.
- Multi-ally levels should teach local rules, role assignment, sensing, resource checks, and decentralized coordination.
- Keyboard navigation is a means to author Blockly programs, not a shortcut around understanding the level.

Do not redefine:

- Guided campaign order, project membership, level ids, or project names.
- Game rules, Blockly semantics, keyboard-navigation implementation, or Plan 40's keyboard contract.
- Existing Plan 06 artifacts.
- Usage export schema or admin analyzer behavior.
- Tournament format.

## Required Reading

Before starting the campaign:

- `docs/development/plan-40-blockly-keyboard-navigation.md`
- `reports/development/plan-40-blockly-keyboard-navigation/progress.md`
- `docs/development/archive/plan-06-guided-playtest-triage.md`
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- `reports/development/plan-06-guided-playtest-triage/progress.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/p5-surface-map.md`

For each level attempt, read only:

- this packet
- Plan 41 progress report
- the matching Plan 06 context file under `reports/development/plan-06-guided-playtest-triage/level-context/` **if one exists** — the seven post-Plan-06 levels (see "Post-Plan-06 levels with no context file" below) have none and that is expected
- any previous Plan 41 reports needed to understand carried-forward project code

Do not bulk-read all level source files or reference solutions. Use `rg` only to find report/context file names, not to inspect solutions.

## Scope

### In scope

- Use the local-dev `?devGuidedLevel=<levelId>` URL from the Plan 06 level context file.
- Use Plan 40 keyboard navigation as the default Blockly authoring method.
- Use mouse clicks only for broad page navigation or as a fallback when keyboard navigation is blocked.
- Attempt guided levels one at a time or in small owner-approved batches.
- Record whether the level is pedagogically understandable.
- Record whether keyboard Blockly authoring was workable for Gemini.
- Record places where Gemini had to abandon keyboard flow and why.
- Record if Plan 22 dev-guided assist helps or hinders the keyboard flow.
- Write new Plan 41 reports only under `reports/development/plan-41-keyboard-gemini-guided-playthrough/`.
- Produce a final comparison memo against Plan 06 friction and readiness goals.

### Files and areas likely touched

- `reports/development/plan-41-keyboard-gemini-guided-playthrough/progress.md`
- `reports/development/plan-41-keyboard-gemini-guided-playthrough/levels/*.md`
- `reports/development/plan-41-keyboard-gemini-guided-playthrough/project-arcs/*.md`
- `reports/development/plan-41-keyboard-gemini-guided-playthrough/keyboard-friction.md`
- `reports/development/plan-41-keyboard-gemini-guided-playthrough/final-memo.md`
- optional screenshots or downloaded usage evidence under the Plan 41 report folder

### Out of scope

- Any edits to `src/`, `tests/`, `docs/development/README.md`, archived packets, Plan 06 report files, or level context files.
- Fixing bugs discovered during the playthrough.
- Updating reference solutions.
- Running automated regression suites as a substitute for student-like playtesting.
- Changing keyboard-navigation implementation.

## Bootstrap From Plan 06

Plan 41 should reuse Plan 06's structure without mutating it:

1. Use the Plan 06 level-context files for canonical `devGuidedLevel` URLs and "what to watch for" notes.
2. Use the Plan 06 Gemini prompt as a style reference, but prefer the keyboard-first workflow below.
3. Use existing Plan 06 reports only as comparison material after attempting the same level, not as a solution guide.
4. Create all new campaign reports in the Plan 41 folder.
5. If a Plan 06 context file is stale because the level has changed, record that as a Plan 41 finding rather than editing the Plan 06 file.

## Post-Plan-06 levels with no context file

Plans 42 and 43 added seven new guided levels after Plan 06 wrote its level-context files. These levels have **no Plan 06 context file** and that is expected — record their status under "new level, no Plan 06 context" rather than treating the absence as a finding.

Bug hunt levels (Plan 42 — `levelKind: "bug_hunt"`):

- `bughunt-15` — debugging the flag-phase / first-action concept; placed immediately before challenge `level-15`.
- `bughunt-22` — debugging readiness checks / branch ordering; placed immediately before challenge `level-22`.
- `bughunt-28` — debugging `AND`/`OR` boolean composition; placed immediately before Strategy Brain capstone `level-28`.
- `bughunt-37` — debugging runner-index role split; placed immediately before Team Strategy Script capstone `level-37`.

Bug hunts load with an intentionally broken starter program. The student's job is to read the program, identify the bug, and apply a small repair — not to author from scratch. Record whether the bug was discoverable from the visible directions and starter, and how many keystroke-edits it took to repair.

Prediction levels (Plan 43 — `levelKind: "prediction"`):

- `prediction-06` — predict the ally's first move given a short starter program. Placed in the sensing-arc opener slot.
- `prediction-25` — predict whether an `AND`/`OR` branch evaluates true given a labeled board state. Placed late in the Strategy Brain arc, before `bughunt-28`.
- `prediction-31` — predict which runner takes which action given a runner-index branching program. Placed late in the Team Strategy Script arc, before `bughunt-37`.

**Prediction levels behave differently from every other guided level.** Before reading directions, expect this:

- The lesson panel shows a multiple-choice prompt with 2–4 radio choices.
- The Start Level button is rendered with the `disabled` and `aria-disabled="true"` attributes and an affordance label "Pick a prediction to start" until a choice is selected.
- Keyboard reach: Tab to the radio group, Arrow keys to navigate choices, Space or Enter to select, Tab again to reach Start.
- After Start, the choice is **locked for the entire attempt** — including across the Reset button. This is intentional (the level's pedagogy depends on commitment). Record this as expected behavior, not a bug.
- Prediction feedback appears at `level.result` (level pass or fail), not at Start, comparing the selected choice to the observed outcome.

For these seven levels, write a fresh `levels/<id>.md` Plan 41 report without expecting prior Plan 06 material. Note in the report that the level is a Plan 42 bug hunt or Plan 43 prediction so the final memo can group findings by level kind.

## Keyboard-First Workflow

Default workflow:

1. Open the level with the canonical local-dev URL from the Plan 06 context file.
2. Read the visible level directions, hints if needed, and available tools.
3. Use keyboard navigation to enter the Blockly workspace/toolbox.
4. Use the Plan 40-supported keystroke workflow to select, insert, connect, edit fields, and build the intended program.
5. Run the level through the visible UI.
6. Revise with keyboard navigation if the first attempt fails.
7. Record both level-learning friction and keyboard-authoring friction.

Allowed fallback:

- Use mouse clicks for non-Blockly page controls if keyboard focus is inefficient.
- Use mouse clicks in Blockly only after recording why keyboard navigation failed or became unreasonable.
- If drag/drop is required, keep the attempt bounded and record that Plan 40 is not sufficient for this level workflow.

Not allowed:

- Loading Blockly XML through test hooks.
- Inspecting reference solution XML before attempting the level.
- Using source code to infer hidden win conditions before attempting the level.

## Report Template

Create one report per level under `reports/development/plan-41-keyboard-gemini-guided-playthrough/levels/`.

```md
# L00 Level Title

- Result: pass / fail / blocked / deferred
- Attempts: 0
- Approximate time: 0 minutes
- Main strategy tried: ...
- Keyboard Blockly workflow: smooth / usable with friction / blocked / mouse fallback used
- Keyboard friction details: ...
- Mouse fallback used: no / yes, reason ...
- Confusing copy or UI: ...
- Toolbox sufficiency: ...
- Badge/project/capstone signal clarity: ...
- Win/loss feedback clarity: ...
- Turn-limit impression: ...
- AP CSA transfer signal observed: ...
- Likely student blocker: ...
- Browser-agent-specific blocker: ...
- Recommended action: no change / teacher warning / copy tweak / UI tweak / level balance review / keyboard-nav repair / dev-guided layout repair / project-arc review / canonical-source review / human review required
- Notes: ...
```

Update `keyboard-friction.md` whenever a level reveals a reusable keyboard-navigation problem.

## Work Plan

1. Confirm Plan 40 is complete and review its "Plan 41 readiness" notes.
2. Create the Plan 41 report folder and initial progress report.
3. Select the first unchecked level from Plan 41 progress.
4. Read only the matching Plan 06 level context file.
5. Attempt the level using keyboard-first Blockly authoring.
6. Write the level report and update progress.
7. Stop after each report unless the integration owner assigned a batch.
8. After enough levels, write project-arc notes and final memo.

## Commands

Run from the repository root only if needed to launch the app:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

Do not run broad test suites unless the integration owner explicitly redirects this from playtesting to implementation review.

## Validation Checklist

- [ ] Plan 40 is complete and its progress report says Plan 41 is unblocked.
- [ ] Existing Plan 06 artifacts were not modified.
- [ ] Plan 41 progress report exists.
- [ ] Each attempted level has a bounded Plan 41 report.
- [ ] Each report distinguishes student-facing confusion from browser-agent/keyboard friction.
- [ ] Mouse fallback, if used, is explicitly recorded.
- [ ] Source/reference solutions were not inspected before attempts.
- [ ] Keyboard-friction log captures recurring Plan 40 issues.
- [ ] Final memo compares Plan 41 feasibility against the aborted Plan 06 drag/drop problem.

## Stop Conditions

Stop and write a blocker note if:

- Plan 40 is not complete or does not identify a reliable keyboard workflow.
- The app fails to launch.
- `devGuidedLevel` no longer works.
- Keyboard navigation cannot insert/connect/edit enough blocks to attempt the level fairly.
- The browser cannot interact with the level fairly even with bounded mouse fallback.
- A level cannot be attempted without source inspection.
- Observed behavior contradicts a subsystem note in a way that affects playtest interpretation.
- A fix would require changing source, tests, docs outside Plan 41 reports, deployment, or gameplay policy.

## Final Memo Expectations

At campaign end, write `reports/development/plan-41-keyboard-gemini-guided-playthrough/final-memo.md` with:

- Which levels Gemini completed successfully with keyboard-first Blockly.
- Which levels still required mouse fallback or became blocked.
- Whether keyboard navigation meaningfully revived the Plan 06 playtest idea.
- Which student-facing level/copy/curriculum issues were found.
- Which browser-agent-only friction should not be mistaken for student friction.
- Recommended follow-up packets, ordered by leverage.
