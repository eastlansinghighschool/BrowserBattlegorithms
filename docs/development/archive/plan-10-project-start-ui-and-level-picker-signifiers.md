# Plan 10: Project Start UI And Level Picker Signifiers

## Packet Metadata

- Packet id: plan-10
- Packet title: Project Start UI And Level Picker Signifiers
- Status: blocked by Plan 09
- Owner/model: frontend implementation agent
- Date: 2026-05-12
- Packet type: frontend / pedagogy / tests
- Mutation level: source-code / tests
- Approval gate: after Plan 09 project metadata behavior exists
- Expected artifacts:
  - project badges in guided level picker
  - project start callout/bubble near Blockly workspace
  - persistent project indicator on project levels
  - focused UI tests
  - progress report
- Progress report folder: `reports/development/plan-10-project-start-ui-and-level-picker-signifiers/`
- Progress report file: `reports/development/plan-10-project-start-ui-and-level-picker-signifiers/progress.md`

## Packet Summary

Goal: Make project levels visibly understandable to students, especially the fact that their code is shared across project levels.

Non-goals:

- Do not change project storage behavior.
- Do not revise level content.
- Do not add version history.
- Do not add large modal flows that interrupt every project level.

Depends on:

- Plan 03 challenge signifier patterns.
- Plan 08 project UI decisions.
- Plan 09 project metadata/workspace architecture.

## Required Behavior

- Level picker shows a project signifier for project levels.
- Project signifier distinguishes project membership from challenge status.
- Challenge/capstone levels inside a project show both project and challenge/capstone framing, including:
  - L28 `full-team-tactics`
  - L37 `advanced-scrimmage`
- First project level shows a one-time project-start bubble/callout near the workspace, inspired by the Code.org pattern:
  - `This icon means this level is part of a larger project. Changes will be saved across these levels.`
- Project levels show a quiet persistent indicator such as:
  - `Project: Strategy Brain`
  - `Shared code across this project`
- The lesson panel explains shared-code behavior clearly at project start.
- L32 `escort-the-carrier` shows persistent state framing that the lead ally starts with the flag.
- Backtracking should be framed as testing the latest project script on an earlier scenario, not restoring older code.
- Copy must be short, student-facing, and accurate.

## Approved Project Names

- `strategy-brain`: Strategy Brain
- `team-strategy-script`: Team Strategy Script

## Likely Touch Points

- `src/ui/levels.js`
- `src/ui/blocklyPanel.js`
- `src/ui/tutorialOverlay.js`
- `src/assets/styles/style.css`
- `tests/unit/display-and-controls.test.js`
- `tests/browser/guided-ui.spec.js`

## Testing Requirements

- project badge appears in level picker for project levels
- ordinary levels do not show project badge
- project start callout appears on first project level
- callout is not repeatedly disruptive after dismissal
- persistent project indicator appears on project levels
- challenge project capstone shows both signals if Plan 08 requires it
- L32 special carried-flag state note appears on that level
- project callout and persistent indicator are keyboard-accessible and narrow-screen friendly

## Stop Conditions

Stop and report if:

- Plan 08 has not approved the student-facing project names/copy
- UI requires broad level picker redesign
- project signifiers conflict visually with challenge signifiers
- callout cannot be made accessible and narrow-screen friendly
