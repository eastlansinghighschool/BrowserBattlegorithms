# Plan 08: Guided Project Sequence Design

## Packet Metadata

- Packet id: plan-08
- Packet title: Guided Project Sequence Design
- Status: complete
- Owner/model: orchestration model with optional lower-cost research assistant
- Date: 2026-05-12
- Packet type: scan-only / curriculum design / architecture planning
- Mutation level: docs-only
- Approval gate: before downstream implementation
- Expected artifacts:
  - detailed project feasibility/audit report
  - orchestration-reviewed project decision record
  - project level map consumed by Plans 09-14
  - open questions list, if any remain
  - progress report
- Progress report folder: `reports/development/plan-08-guided-project-sequence-design/`
- Progress report file: `reports/development/plan-08-guided-project-sequence-design/progress.md`

## Packet Summary

Goal: Decide how guided "project" sequences should reshape the advanced campaign before any implementation packet changes source code.

Non-goals:

- Do not implement project workspace behavior.
- Do not edit level source.
- Do not rewrite tests.
- Do not leave major project membership, toolbox, or testing decisions to a lower-cost implementation model.

Depends on:

- Plans 01-07 are assumed to be complete or accepted as the target baseline.

Blocks:

- Plan 09 project metadata/workspace architecture.
- Plan 10 project UI.
- Plan 11 Strategy Brain project revision.
- Plan 12 Team Strategy Script project revision.
- Plan 13 project solution/test harness repair.
- Plan 14 project version history design.

Why this packet exists:

Project sequences change the meaning of guided levels from one-off puzzles to evolving student programs. That is pedagogically promising but architectural: shared latest code, broad project toolboxes, backtracking behavior, challenge framing, canonical solutions, and usage evidence all have to agree.

## Required Decisions

This packet must produce a decision record that later packets can consume. It should decide:

- final project ids and student-facing names
- exact levels included in each project
- whether each current level is kept, condensed, merged, renamed, or deferred
- final project order and challenge/capstone placement
- which blocks unlock at each project start
- whether project toolboxes are broad from the beginning or grow within the project
- project workspace storage policy
- backtracking behavior
- reset behavior
- first-time project introduction UI requirements
- reference-solution and test-harness strategy
- whether project sequences are required for classroom rollout or can be staged later

Known accepted direction:

- Use two projects:
  - a Strategy Brain project before `full-team-tactics`
  - a Team Strategy Script project before `advanced-scrimmage`
- Going backward inside a project uses shared latest project code everywhere.
- Project starts should unlock several new capabilities at once to avoid old project levels being unable to edit carried code.
- Project starts need explicit UI/copy/signifier treatment.
- Project version history is desirable but separate from the first shared-code implementation.

## Required Artifacts

Create these files:

- `reports/development/plan-08-guided-project-sequence-design/project-audit.md`
- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`
- `reports/development/plan-08-guided-project-sequence-design/progress.md`

The `project-sequence-decisions.md` file is the authoritative contract for Plans 09-14.

The `project-level-map.md` file should be structured and easy for lower-cost agents to read. Include tables with:

- current level id/title
- proposed project id
- proposed project step
- final title
- final level kind
- focus
- toolbox unlock group
- keep/merge/condense/defer decision
- required follow-up packet

## Orchestration Workflow

Step 1: Lower-cost model research report.

Ask a lower-cost model to inspect:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `src/config/levels/phases/advanced-logic/`
- `src/config/levels/phases/advanced-teamplay/`
- `tests/unit/fixtures/guided-reference-solutions/`

It should produce `project-audit.md` with:

- current level-by-level teaching role
- current toolbox/win condition/setup summary
- which levels naturally become project steps
- which levels become awkward under shared latest code
- suggested condensing/merging opportunities
- risks for canonical tests
- recommended project arcs

Step 2: Orchestration review.

The orchestration model reviews the report with the integration owner. It should challenge weak assumptions, decide the final project shape, and write the authoritative decision record.

Step 3: Downstream handoff.

After decisions are made, update Plans 09-14 if needed so their requirements match the decision record. Do not let later packets invent incompatible shapes.

## Stop Conditions

Stop before downstream implementation if:

- the two-project shape would make the campaign too long for intended classroom use
- broad project toolboxes undermine the teaching sequence more than they help
- project testing would require unbounded harness rewrites
- the integration owner has not approved the project membership and toolbox policy
