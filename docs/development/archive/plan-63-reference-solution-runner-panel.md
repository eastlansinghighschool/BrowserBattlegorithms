# Plan 63: Reference Solution Runner Panel

## Packet Metadata

- Packet id: plan-63
- Packet title: Reference Solution Runner Panel
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-20
- Packet type: implementation / frontend / testing / developer tooling
- Mutation level: source-code / tests / docs
- Approval gate: before changing simulation semantics, before adding filesystem writes, before changing guided level fixtures, before broad test harness refactors
- Expected artifacts:
  - workbench panel that runs the selected level's existing reference/project solution
  - displayed pass/fail result, turn count, reason, and trace/event tail
  - shared simulation path with Plan 60 where practical
  - focused tests
  - progress report
- Progress report folder: `reports/development/plan-63-reference-solution-runner-panel/`
- Progress report file: `reports/development/plan-63-reference-solution-runner-panel/progress.md`

## Packet Summary

Goal: Extend the local-dev level workbench so it can run the selected level's canonical reference solution or project checkpoint and display the same evidence an implementation agent needs to repair the level.

Why this packet exists:

Static readiness metadata is useful, but level repair usually turns on runtime evidence: did the solution pass, where did it fail, which runner acted, what result reason fired, and what happened in the final turns. This packet makes that evidence visible without asking agents to run and interpret tests by hand.

Non-goals:

- Do not add scratch Blockly editing; that is Plan 64.
- Do not save edited fixtures.
- Do not change reference solutions or project fixtures.
- Do not add new game rules or test policies.
- Do not build a visual replay debugger.

Depends on:

- Plan 60 complete.
- Plan 62 complete.

Blocks:

- Plan 64 Scratch Blockly Preview.

## Authority And Contracts

Authoritative sources:

- Plan 60 readiness engine and simulation behavior
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/p5-surface-map.md` if any render preview is added

Contracts this packet must preserve:

- Running a reference solution in the workbench must not mutate real guided progress or saved project workspaces.
- Workbench runtime results must agree with Node readiness/test results for the same fixture.
- Project documented exceptions must be visible, not hidden.

## Required Reading

- Plan 60 progress report and readiness engine files
- Plan 62 progress report and workbench files
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/TESTING.md`

## Scope

In scope:

- Add a "Run reference" or equivalent panel to the workbench.
- Run the canonical solution for:
  - ordinary one-off guided levels
  - project step fixtures
  - project final fixtures where existing policy applies
- Display:
  - pass/fail/not-applicable
  - turn count
  - level-result reason
  - active runner/result trace tail
  - relevant event-log tail if available
  - documented exception text if applicable
- Add deterministic seed controls only if already supported by the Plan 60 result shape; otherwise display the fixed seed policy used by the existing tests.

Out of scope:

- Arbitrary user XML.
- Editing level setup.
- Visual board replay.
- Saving result reports to disk.
- New project exception policies.

Files and areas likely touched:

- Plan 60 readiness/simulation modules if browser-safe reuse is needed
- workbench UI modules from Plan 62
- tests/unit or tests/browser
- `docs/TESTING.md` if a new validation command is useful
- progress report

## Work Plan

1. Inspect how Plan 60 runs simulations and whether it is browser-safe.
2. Reuse or lightly wrap the same simulation path for the workbench.
3. Add a reference-run panel to the workbench.
4. Display runtime evidence in a compact, copyable form.
5. Add tests comparing workbench-visible result to readiness/Node result.
6. Run validation and write progress report.

## Implementation Requirements

### Requirement 1: Runtime Agreement

Required behavior:

- Workbench result for a fixture must match the readiness engine result for the same level/fixture.
- If the workbench cannot run a level category, it must display `not_applicable` or `not_run` with a clear reason.

Constraints:

- Do not fork a second independent simulation harness unless unavoidable. If unavoidable, document the divergence and stop for owner review if behavior differs.

### Requirement 2: Evidence Display

Required behavior:

- Display concise evidence useful to agents:
  - final result
  - current turn number
  - active turn state at finish
  - last result reason
  - trace tail
  - event tail if available
- Provide copy-friendly text for evidence.

Constraints:

- Avoid large raw dumps by default. Offer expansion only if simple.

### Requirement 3: Isolation

Required behavior:

- Simulation must use isolated app state.
- Workbench run must not update saved guided progress, project workspace localStorage, usage tracking, or student-facing state.

### Requirement 4: Project Fixtures

Required behavior:

- For project levels, show matching step fixture status.
- If final fixture status is shown, include the current documented exception policy.
- Do not silently convert documented exceptions into failures or successes.

## Testing Requirements

Add tests for:

- ordinary level reference run display
- project step fixture display
- documented exception display
- no localStorage/guided progress mutation during run
- result agreement with readiness engine

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/<readiness-test>.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npx playwright test tests/browser/<workbench-spec>.spec.js --reporter=line
npm test
npm run build
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Workbench can run selected level's canonical reference/checkpoint where applicable.
- [ ] Runtime result agrees with existing readiness/test behavior.
- [ ] Evidence display includes trace/result reason.
- [ ] Project exceptions are explicit.
- [ ] No fixture or level content changed.
- [ ] No filesystem writes added.
- [ ] Simulation is isolated from saved student/dev state.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Relevant browser tests pass.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- Browser simulation cannot share enough code with Plan 60 to stay trustworthy.
- Running reference solutions requires mutating real app state.
- Project exception policy is unclear or contradictory.
- A level failure appears to require actual level repair rather than workbench implementation.
- The packet begins to require scratch editing or filesystem writes.

## Progress Report Requirements

Write `reports/development/plan-63-reference-solution-runner-panel/progress.md` with:

- simulation path used
- displayed evidence fields
- level categories supported and deferred
- tests added
- files changed
- commands run and results
- ready-for-integration yes/no
