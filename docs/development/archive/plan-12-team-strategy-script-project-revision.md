# Plan 12: Team Strategy Script Project Revision

## Packet Metadata

- Packet id: plan-12
- Packet title: Team Strategy Script Project Revision
- Status: ready after Plan 09/10 architecture/UI baseline
- Owner/model: curriculum implementation agent with orchestration checkpoints
- Date: 2026-05-12
- Packet type: curriculum / implementation / tests
- Mutation level: source-code / tests / docs
- Approval gate: orchestration review before source mutation and after proposed level map
- Expected artifacts:
  - revised Team Strategy Script project levels
  - updated concept matrix/docs
  - preliminary project reference solutions or notes for Plan 13
  - progress report
- Progress report folder: `reports/development/plan-12-team-strategy-script-project-revision/`
- Progress report file: `reports/development/plan-12-team-strategy-script-project-revision/progress.md`

## Packet Summary

Goal: Revise the late multi-ally sequence before `advanced-scrimmage` into a coherent shared-code project about decentralized team strategy.

Non-goals:

- Do not implement workspace architecture.
- Do not invent project membership beyond Plan 08.
- Do not add brand-new AI opponents.
- Do not build version history.
- Do not finalize the whole project test harness; Plan 13 owns that.

Depends on:

- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`
- Plans 09-10, if source integration is expected in the same branch.

## Orchestration Checkpoints

Checkpoint 1: Proposed rewrite table.

Before source edits, produce a table for orchestration review:

- current level id
- proposed final title
- project step role
- role/index concept
- support/attack/defense behavior
- toolbox group
- keep/merge/condense/defer decision
- expected capstone contribution

Checkpoint 2: Specialist-level implementation check.

The current specialist levels should remain separate in the first implementation:

- `freeze-support`
- `barrier-specialist`
- `jump-team`

Before source edits, the implementing model should still surface any proposed turn-limit or setup adjustments for these levels, especially L35 and L36. It should not condense these levels without orchestration approval based on new evidence.

Checkpoint 3: Draft copy review.

Surface project copy before finalizing. The copy should emphasize local rules, roles, sensing, and shared code rather than central command.

## Initial Design Direction

Approved current levels:

- `one-program-two-allies`
- `index-jobs`
- `first-two-defend`
- `escort-the-carrier`
- `closest-enemy-defender`
- `freeze-support`
- `barrier-specialist`
- `jump-team`
- `advanced-scrimmage`

Likely project idea:

- student builds a shared ally program
- project start introduces the shared-code concept and runner index
- later steps add role assignment, grouping, teammate state, closest enemy response, and specialist resource behavior
- final capstone uses the accumulated script in a live scrimmage

Approved shape:

1. One program, multiple allies.
2. Assign roles.
3. Group allies.
4. React to team state.
5. Add defensive awareness.
6. Add a freeze specialist.
7. Add a barrier specialist.
8. Add jump/path role assignment.
9. Challenge: Advanced Scrimmage.

Do not condense levels in the first implementation.

## Implementation Requirements

- Add project metadata to all levels in this project.
- Revise level copy so each level asks students to improve the same script.
- Keep project toolbox broad enough that shared latest code remains editable when backtracking.
- Ensure each step has a clear reason to exist under shared-code semantics.
- Keep specialist levels separate, but reframe them so they feel like role layering rather than repeated branch-addition chores.
- Review L35 and L36 turn limits and consider raising them to 10-12 turns if implementation testing shows the current 8-turn limits punish reasonable evolving scripts.
- Revise L37 `advanced-scrimmage` as the Team Strategy Script capstone:
  - replace the current thin two-branch reference-solution expectation with role-based runner-index strategy notes for Plan 13
  - prefer allowing any ally to score for the team
  - if ally 0 remains required to score, explicitly frame index 0 as the attacker role in copy
- Preserve the central learning goal: students design ally agents that self-manage through local rules, role assignment, sensing, and state checks.

## Testing Requirements

- Update contract tests for revised level ids/order/toolboxes.
- Keep or document preliminary reference solutions.
- Coordinate with Plan 13 for final project solution fixtures.

## Stop Conditions

Stop and report if:

- Plan 08 artifacts are missing or unclear
- the late sequence becomes too long or too repetitive for classroom use
- the revised capstone cannot plausibly validate accumulated strategy
- L37 cannot be made fair without broad game-rule changes
- tests would require unbounded broad rewrites not covered by Plan 13
