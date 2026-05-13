# Plan 06: Guided Playtest Triage

## Packet Metadata

- Packet id: plan-06
- Packet title: Guided Playtest Triage
- Status: ready
- Owner/model: browser-capable lower-cost agent or human playtester
- Date: 2026-05-12
- Packet type: scan-only / browser QA / pedagogy
- Mutation level: none
- Approval gate: before mutation
- Expected artifacts:
  - level-by-level playtest notes
  - triage table
  - recommended follow-up packets or targeted fixes
  - progress report
- Progress report folder: `reports/development/plan-06-guided-playtest-triage/`
- Progress report file: `reports/development/plan-06-guided-playtest-triage/progress.md`

## Packet Summary

Goal: Playtest the guided campaign after tests are green and identify remaining student-facing confusion, pacing problems, UI friction, and level-balance issues before classroom rollout.

Non-goals:

- Do not edit source code in this packet.
- Do not redesign levels during the playtest.
- Do not use source-code inspection to solve levels unless a level is blocked and the report explicitly marks that pivot.
- Do not turn this into broad curriculum rewriting.

Depends on:

- Plan 02 complete.
- Preferably Plan 03, Plan 04, and Plan 05 complete before final classroom-readiness playtest, but this scan can begin earlier.

Blocks:

- Confidence that the app is ready for a group of students.
- Decisions about late multi-ally repairs, map variety, territory redesign, or copy tweaks.

Why this packet exists:

Passing unit tests prove authored reference solutions work. They do not prove that a student can understand the prompt, find the right controls, recover from mistakes, or connect the level to the intended AP CSA-style reasoning. This packet turns play experience into a prioritized fix list.

## Authority And Contracts

Required product contracts:

- Playtest like a student, not like an implementation agent.
- Record confusion and friction even when the level is technically solvable.
- Synthesis/challenge levels should feel like "use what you know," not surprise new-mechanic lessons.
- Multi-ally levels should support decentralized strategy thinking.

Do not redefine:

- The campaign order.
- Game rules.
- Blockly semantics.
- Which levels are required for classroom use.

## Required Reading

Read these first:

- `docs/development/README.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`

Optional:

- `docs/development/plan-03-challenge-badge-and-synthesis-framing.md`
- `tests/unit/guided-reference-solutions.test.js`

Do not inspect individual level source before attempting a level unless the playtest is blocked.

## Scope

In scope:

- Browser playtesting guided levels one at a time.
- Recording visible tutorial/copy/toolbox/UI issues.
- Recording whether level goals and pass/fail feedback are understandable.
- Recording whether the available tools feel sufficient.
- Recording whether challenge levels are correctly signaled.
- Recording whether turn limits feel reasonable.
- Producing triage recommendations.

Out of scope:

- Source edits.
- Test edits.
- Adding levels.
- Free Play AI redesign.
- Build optimization.

## Agent Playtest Method

This packet is especially suited to a browser-capable lower-cost agent in small batches.

Recommended orchestration:

- Run one guided level per prompt or a very small batch of adjacent levels.
- Give the agent only:
  - level number/id/title
  - learning goal if known
  - instruction to use only visible UI/tutorials
  - maximum attempts
  - report format
- Tell the agent not to inspect source files.
- Tell the agent to stop after repeated failure and report confusion.

Example per-level prompt:

```text
Play only Guided Level 15. Use the app like a student: read visible tutorial/copy, use the available blocks, and do not inspect source files. Try up to 4 attempts. Report whether you solved it, what was confusing, whether the goal and feedback were clear, which blocks you used, and whether this level felt like a challenge using previous tools.
```

Context between prompts:

- The agent does not need full repo context each time.
- Give level-specific context only when helpful.
- For challenge levels, explicitly say that no new block is expected.
- For late multi-ally levels, remind the agent to look for role/index logic.

## Report Requirements

Create a triage table with one row per level:

- level order
- level id/title
- pass/fail/not attempted
- number of attempts
- approximate time
- main strategy tried
- confusing copy or UI
- toolbox sufficiency
- win/loss feedback clarity
- turn-limit impression
- likely student blocker
- recommended action:
  - no change
  - copy tweak
  - UI tweak
  - level balance review
  - canonical/source review
  - human review required

Also include:

- top 10 classroom-readiness risks
- levels most likely to need teacher intervention
- levels most likely to be too easy
- levels most likely to be too brittle
- recommended follow-up packets

## Work Plan

1. Start the local app and confirm tests/build baseline if needed.
2. Playtest guided levels in small batches.
3. Record observations immediately after each level.
4. Avoid fixing during the scan.
5. Summarize patterns and prioritize follow-ups.
6. Write the progress report.

## Validation Commands

This is scan-only. If running locally:

```powershell
npm test
npm run build
npm run dev
```

Use browser automation or human browser play against the local dev server.

## Validation Checklist

- [ ] Each guided level has a triage row or is explicitly marked not tested.
- [ ] Challenge/synthesis levels are evaluated for signifier clarity.
- [ ] Late multi-ally levels are evaluated for role/index comprehension.
- [ ] Report distinguishes student confusion from implementation bugs.
- [ ] Report recommends bounded follow-up packets.
- [ ] No source files were edited.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:

- The app cannot launch.
- A level cannot be attempted because of a UI/runtime error.
- The browser agent repeatedly gets stuck due to automation limitations rather than app behavior.
- Playtesting reveals a broad rule or curriculum contradiction that needs integration-owner review.

