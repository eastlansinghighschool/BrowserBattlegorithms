# Plan 13: Project Reference Solutions And Test Harness Repair

## Packet Metadata

- Packet id: plan-13
- Packet title: Project Reference Solutions And Test Harness Repair
- Status: blocked by Plans 09-12
- Owner/model: testing implementation agent
- Date: 2026-05-12
- Packet type: testing / integration
- Mutation level: tests / source-code if necessary
- Approval gate: after project level revisions are complete
- Expected artifacts:
  - project-aware guided reference solution fixtures
  - updated tests for one-off and project levels
  - shared workspace behavior tests
  - all unit tests passing
  - progress report
- Progress report folder: `reports/development/plan-13-project-reference-solutions-and-test-harness-repair/`
- Progress report file: `reports/development/plan-13-project-reference-solutions-and-test-harness-repair/progress.md`

## Packet Summary

Goal: Restore strong automated confidence after project sequences change guided level semantics.

Non-goals:

- Do not redesign project levels.
- Do not weaken tests just to get green.
- Do not remove canonical solution coverage for non-human guided levels without orchestration approval.

Depends on:

- Plan 08 decision record.
- Plan 09 architecture.
- Plan 11 Strategy Brain revisions.
- Plan 12 Team Strategy Script revisions.

## Required Behavior

- One-off guided levels still have independent reference solution XML fixtures.
- Project levels have a clear reference solution strategy that matches shared-code semantics.
- Test harness distinguishes:
  - one-off level solution
  - project step solution/checkpoint
  - final project capstone solution
- Shared project workspace behavior is tested separately from solving behavior.
- Guided contract tests agree with current level count/order/toolboxes/project metadata.
- Use the hybrid strategy from Plan 08:
  - independent fixtures for one-off guided levels
  - project checkpoint fixtures for project steps
  - cumulative final-project fixtures that can pass the project arc
- L37 `advanced-scrimmage` must use a role-based runner-index reference strategy, not the old minimal flag/base two-branch program.

## Suggested Fixture Structure

Plan 08 may decide otherwise, but a likely shape is:

```text
tests/unit/fixtures/guided-reference-solutions/
tests/unit/fixtures/guided-project-solutions/
  strategy-brain/
    step-01.xml
    step-02.xml
    ...
  team-strategy-script/
    step-01.xml
    step-02.xml
    ...
```

Each project step fixture should represent the latest project code after that step, not necessarily a tiny isolated answer.

Add final cumulative fixtures or fixture aliases for:

- `strategy-brain` final project program
- `team-strategy-script` final project program

## Testing Requirements

- test every non-human one-off guided level still solves independently
- test every project step solves using its project checkpoint fixture
- test project capstones solve with final accumulated project code
- test the final Strategy Brain program against Strategy Brain project steps, unless a specific step is documented as intentionally incompatible
- test the final Team Strategy Script program against Team Strategy Script project steps, unless a specific step is documented as intentionally incompatible
- test project metadata and project-level map consistency
- test backtracking/shared latest project code at browser level if not already covered
- check live-enemy fixtures for deterministic behavior or use a seeded/repeated run strategy
- run full `npm test`
- run `npm run build`

## Stop Conditions

Stop and report if:

- project revisions leave unclear expected behavior for a level
- the only passing fixture is an unrealistic or misleading strategy
- a project step cannot be tested without changing the game rule model
- cumulative project tests are impossible without revisiting Plan 11/12 level design
- test failures imply curriculum/source issues that belong back in Plans 11 or 12
