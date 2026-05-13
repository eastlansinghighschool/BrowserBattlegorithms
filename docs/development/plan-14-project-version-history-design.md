# Plan 14: Project Version History Design

## Packet Metadata

- Packet id: plan-14
- Packet title: Project Version History Design
- Status: blocked by Plans 09-13
- Owner/model: orchestration model with optional implementation scout
- Date: 2026-05-12
- Packet type: design / possible future implementation planning
- Mutation level: docs-only
- Approval gate: before implementation packet
- Expected artifacts:
  - project version history design report
  - recommended UI and storage model
  - decision on whether to implement before classroom rollout
  - progress report
- Progress report folder: `reports/development/plan-14-project-version-history-design/`
- Progress report file: `reports/development/plan-14-project-version-history-design/progress.md`

## Packet Summary

Goal: Design a version history system for guided projects so students can recover earlier project states without requiring checkpoint restore in the initial project implementation.

Non-goals:

- Do not implement version history in this packet.
- Do not change shared latest code behavior.
- Do not build full game replay/history.
- Do not duplicate Plan 05 undo/redo.

Depends on:

- Plan 05 undo/redo.
- Plan 09 shared project workspace architecture.
- Plan 11/12 revised project sequences.
- Plan 13 test strategy.
- Plan 04 usage tracking may provide useful event/snapshot patterns.
- `docs/development/project-sequence-decisions.md`

## Design Questions

Answer:

- What creates a project version?
  - manual save
  - level start
  - level pass
  - before import/reset
  - periodic meaningful Blockly edit
- Where are versions stored?
  - localStorage
  - IndexedDB
  - usage tracking snapshot store
- How many versions are retained?
- What metadata appears in the UI?
  - timestamp
  - project step
  - block count
  - student note
  - preview text
- Does restoring create a new latest version or overwrite?
- How does version history interact with Plan 04 usage export?
- How does version history differ from undo/redo?
- Is this required before classroom rollout?

## Recommended Starting Position

- Keep initial project implementation simple: shared latest code only.
- Design version history as a later recovery interface.
- Restoring a version should create a new latest version, preserving the historical record.
- Prefer IndexedDB if snapshots become large or numerous.
- Include version-history events in usage export if Plan 04 is complete.
- Treat Plan 09's one-shared-key-per-project storage model as the current product contract; version history augments recovery, it does not replace shared latest behavior.
- Do not reinterpret ordinary `Reset Level` as project-code reset.

## Required Artifacts

- `reports/development/plan-14-project-version-history-design/version-history-design.md`
- `reports/development/plan-14-project-version-history-design/progress.md`

If implementation is recommended, propose a future packet with:

- exact UI scope
- storage schema
- retention policy
- tests
- migration behavior

## Stop Conditions

Stop and report if:

- project implementation has not landed yet
- undo/redo behavior is unresolved
- usage tracking storage conflicts with proposed version history storage
- the design becomes a broad replay system rather than project code recovery
