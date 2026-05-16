# Plan 09: Project Metadata And Workspace Architecture

## Packet Metadata

- Packet id: plan-09
- Packet title: Project Metadata And Workspace Architecture
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-12
- Packet type: implementation / architecture / tests
- Mutation level: source-code / tests
- Approval gate: none; Plan 08 decision record exists
- Expected artifacts:
  - project metadata support in guided level definitions
  - shared latest workspace storage for project levels
  - ordinary guided workspace behavior preserved
  - focused unit/browser tests
  - progress report
- Progress report folder: `reports/development/plan-09-project-metadata-and-workspace-architecture/`
- Progress report file: `reports/development/plan-09-project-metadata-and-workspace-architecture/progress.md`

## Packet Summary

Goal: Add the project-aware guided workspace architecture that lets selected guided levels share the latest project code.

Non-goals:

- Do not revise level pedagogy or maps unless Plan 08 explicitly says this packet must do so.
- Do not add project UI beyond minimal internal/test-visible behavior.
- Do not implement version history.
- Do not repair canonical project solutions yet.

Depends on:

- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`
- Plans 03-07 baseline behavior.

Blocks:

- Plan 10 project UI.
- Plans 11-13 project curriculum and tests.

## Required Behavior

- Project levels use shared latest code for the same project id.
- Going forward and backward within a project loads the same latest project workspace.
- Ordinary non-project guided levels continue using per-level workspace persistence.
- Project workspaces do not leak between projects.
- Project workspaces do not leak into Free Play.
- First project level initializes from its starter XML when no project workspace exists.
- Later project levels initialize from the shared project workspace when it exists.
- Project toolbox configuration follows Plan 08's unlock policy.
- `Reset Level` resets board/runtime state but preserves shared project code.
- No project reset or version-history UI is required in this packet.

Required project ids:

- `strategy-brain`
- `team-strategy-script`

Suggested metadata shape:

```js
project: {
  id: "strategy-brain",
  label: "Strategy Brain",
  step: 1,
  isStart: true,
  isCapstone: false
}
```

Suggested storage key:

```text
bba:guided-project-workspace:<projectId>
```

Do not invent a different storage behavior unless the existing workspace lifecycle makes the suggested key impossible. If a different key is needed, document it in the progress report and keep the one-shared-key-per-project contract.

## Likely Touch Points

- `src/config/levels/index.js`
- relevant level source files named in Plan 08
- `src/config/levels/manifest.js`, if present
- `src/ai/blockly/workspace.js`
- `src/main.js`
- `src/core/levels.js`
- `tests/browser/persistence.spec.js`
- `tests/unit/guided-level-contracts.test.js`

## Testing Requirements

- test project metadata is preserved by `getLevelDefinitions()`
- browser test that project levels share latest code
- browser test that going backward in a project uses latest shared code
- browser test that ordinary guided levels remain isolated
- browser test that project A and project B do not share code
- browser test that `Reset Level` preserves project code
- regression test Free Play workspace persistence

## Stop Conditions

Stop and report if:

- Plan 08 outputs are missing or ambiguous
- current workspace lifecycle cannot support shared project code without broad rewrite
- shared latest code corrupts ordinary guided or Free Play persistence
- toolbox unlock policy conflicts with carried project code
