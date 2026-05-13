# Plan 11: Strategy Brain Project Revision

## Packet Metadata

- Packet id: plan-11
- Packet title: Strategy Brain Project Revision
- Status: ready after Plan 09/10 architecture/UI baseline
- Owner/model: curriculum implementation agent with orchestration checkpoints
- Date: 2026-05-12
- Packet type: curriculum / implementation / tests
- Mutation level: source-code / tests / docs
- Approval gate: orchestration review before source mutation and after proposed level map
- Expected artifacts:
  - revised Strategy Brain project levels
  - updated concept matrix/docs
  - preliminary project reference solutions or notes for Plan 13
  - progress report
- Progress report folder: `reports/development/plan-11-strategy-brain-project-revision/`
- Progress report file: `reports/development/plan-11-strategy-brain-project-revision/progress.md`

## Packet Summary

Goal: Revise the advanced-logic sequence before `full-team-tactics` into a coherent shared-code project.

Non-goals:

- Do not implement project workspace architecture.
- Do not invent project membership beyond Plan 08.
- Do not finalize the full project test harness; Plan 13 owns that.
- Do not broaden into Team Strategy Script levels.

Depends on:

- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`
- Plans 09-10, if source integration is expected in the same branch.

## Orchestration Checkpoints

Checkpoint 1: Proposed rewrite table.

Before source edits, the implementing model must produce a short table for orchestration review:

- current level id
- proposed final title
- project step role
- focus for student attention
- toolbox group
- win condition/setup change, if any
- keep/merge/condense/defer decision

The orchestration model and integration owner approve or revise this before mutation.

Checkpoint 2: Draft copy review.

Before finalizing, surface the new project intro/lesson copy for review. The copy should frame each step as an improvement to the same strategy program.

## Initial Design Direction

Approved current levels:

- `closest-threat`
- `how-far-away`
- `two-conditions-at-once`
- `this-or-that`
- `flip-the-answer`
- `full-team-tactics`

Likely project idea:

- student builds a reusable solo "strategy brain"
- project start unlocks advanced target/distance/boolean tools as decided in Plan 08
- each step focuses attention on one strategic improvement
- final challenge uses the accumulated strategy in `full-team-tactics`

Approved shape:

1. Track the threat.
2. Add distance rules.
3. Combine conditions.
4. Use either/or logic.
5. Flip the answer.
6. Challenge: Full Team Tactics.

Do not condense levels in the first implementation.

## Implementation Requirements

- Add project metadata to all levels in this project.
- Revise titles, descriptions, intro text, tips, and tutorial steps to emphasize evolving code.
- Keep project-level toolboxes consistent with Plan 08.
- Repair L24 `how-far-away` so distance comparison is load-bearing or strongly necessary.
- Revise L28 `full-team-tactics` into a true Strategy Brain capstone:
  - keep it single-ally
  - keep its bridge role before team programming
  - use the approved Strategy Brain toolbox or a compatible capstone superset
  - ensure copy and reference-solution notes reflect advanced logic, not only old statement-block tactics
- Adjust other maps, setups, and win conditions only when required by these Plan 08 decisions or approved by orchestration.
- Preserve AP CSA bridge language around comparisons and boolean reasoning.
- Avoid exact-solution demos.

## Testing Requirements

- Update contract tests for revised level ids/order/toolboxes.
- Keep a temporary or preliminary solution validation path if Plan 13 is not yet complete.
- Document any expected failing tests that Plan 13 will repair; do not leave silent failures.

## Stop Conditions

Stop and report if:

- Plan 08 artifacts are missing or unclear
- the sequence cannot be made coherent without deleting too much learning progression
- project toolbox breadth makes steps feel indistinct
- L24 cannot be repaired without changing the intended distance-comparison learning goal
- L28 cannot be made compatible with the Strategy Brain project toolbox and capstone role
- canonical solution testing cannot be preserved or explicitly deferred safely
