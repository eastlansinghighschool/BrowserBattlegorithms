# Plan 05: Undo Redo Blockly

## Packet Metadata

- Packet id: plan-05
- Packet title: Undo Redo Blockly
- Status: ready
- Owner/model: lower-cost implementation agent
- Date: 2026-05-12
- Packet type: frontend / Blockly / implementation
- Mutation level: source-code / tests
- Approval gate: none
- Expected artifacts:
  - undo and redo controls for Blockly workspace edits
  - keyboard shortcuts where appropriate
  - focused tests
  - progress report
- Progress report folder: `reports/development/plan-05-undo-redo-blockly/`
- Progress report file: `reports/development/plan-05-undo-redo-blockly/progress.md`

## Packet Summary

Goal: Give students confidence while experimenting by adding reliable undo/redo for Blockly program changes.

Non-goals:

- Do not build a full version history browser.
- Do not create replay/history features; that is a later packet.
- Do not change block semantics or generated actions.
- Do not add dependencies unless absolutely necessary.
- Do not redesign the whole Blockly panel.

Depends on:

- Current Blockly workspace integration in `src/ai/blockly/workspace.js`.

Blocks:

- Classroom use where students may be afraid to experiment because mistakes are hard to reverse.

Why this packet exists:

Students need to iterate. Undo/redo supports the debugging loop, makes experimentation safer, and reduces the frustration of accidentally deleting or rearranging blocks during guided levels.

## Authority And Contracts

Required product contracts:

- Blockly remains the source of truth for the program workspace.
- Undo/redo should operate on Blockly workspace edits, not game turns.
- Existing localStorage workspace persistence must keep working.
- Free Play team tabs must not corrupt each other's programs.
- Guided mode should preserve current restrictions and starter code behavior.

Do not redefine:

- One-action-per-turn execution.
- Workspace import/export semantics except as needed to keep history consistent.
- Guided toolboxes.

## Required Reading

Read these first:

- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/startup/loaders.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/browser/persistence.spec.js`
- `tests/browser/free-play.spec.js`

Use `rg "undo|redo|addChangeListener|workspaceToDom|clearUndo|setBlocklyEditable|switchActiveBlocklyTeamTab"` from the repository root.

## Scope

In scope:

- Investigate Blockly's native undo/redo APIs first.
- Add UI controls for undo/redo near the Blockly/program controls.
- Add keyboard shortcuts:
  - Ctrl+Z / Cmd+Z for undo
  - Ctrl+Y and Ctrl+Shift+Z / Cmd+Shift+Z for redo
- Ensure controls enable/disable or otherwise communicate availability.
- Keep history isolated per active workspace/team context.
- Clear or reset history appropriately after starter-code load, level switch, explicit XML import, and team-tab switch.
- Add focused tests and browser coverage.

Out of scope:

- Persistent cross-session undo history unless it comes almost for free and is reliable.
- IndexedDB unless native history is insufficient and the packet owner documents why.
- Game-turn undo.
- Admin replay/history export.

Files and areas likely touched:

- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/assets/styles/style.css`
- `tests/browser/persistence.spec.js`
- `tests/browser/free-play.spec.js`
- `tests/unit/`

## Implementation Requirements

### 1. Prefer Blockly Native History

Required behavior:

- First inspect current Blockly version APIs for workspace undo/redo support.
- Prefer `workspace.undo(false)` / `workspace.undo(true)` or current equivalent if available.
- Prefer Blockly events/change listeners to update UI state.
- Use custom history only if native APIs cannot satisfy the requirement.

Constraints:

- Do not maintain a parallel XML stack unless native Blockly history is unusable.
- If custom history is needed, cap history size and document storage choice.
- The original suggestion of `sessionStorage` vs IndexedDB should be treated as a fallback, not the default.

### 2. UI Controls

Required behavior:

- Add Undo and Redo controls with clear labels or icons plus accessible names.
- Controls should be visible when Blockly is available and editing is allowed.
- Controls should not appear as active in read-only/non-editable contexts.
- Add tooltips or `title` attributes if icon-only.

Constraints:

- Use existing UI style.
- Keep controls compact and usable on narrow screens.

### 3. Keyboard Shortcuts

Required behavior:

- Implement common undo/redo shortcuts while focus is in or near the Blockly workspace.
- Avoid intercepting browser-level shortcuts in text inputs or unrelated controls.
- Shortcuts should not trigger while tutorials or modals need the key event.

### 4. History Boundaries

Required behavior:

- Loading starter XML for a new level should not let students undo into a previous level's program.
- Importing XML should reset or clearly define history after import.
- Switching Free Play team tabs should preserve each team's program and not cross-contaminate history.
- Resetting a guided level should preserve existing workspace code as currently designed; history behavior should be documented and tested.

### 5. Tests

Required behavior:

- Browser test that creates/changes blocks, uses undo, and observes the workspace revert.
- Browser test for redo after undo.
- Test keyboard shortcuts if practical.
- Regression test that malformed XML import still keeps the current program intact.
- If unit-testable helpers are added, cover them directly.

## Work Plan

1. Inspect Blockly native undo/redo APIs in the installed package.
2. Map current workspace lifecycle points where history should reset.
3. Implement UI controls and command helpers.
4. Wire keyboard shortcuts carefully.
5. Add tests.
6. Run validation.
7. Write progress report.

## Validation Commands

```powershell
npm test
npm run build
npm run test:browser
```

## Validation Checklist

- [ ] Undo and redo controls exist for editable Blockly workspaces.
- [ ] Undo reverts the latest Blockly edit.
- [ ] Redo reapplies an undone edit.
- [ ] Keyboard shortcuts work without breaking text inputs or tutorial controls.
- [ ] Level switches do not expose previous-level history.
- [ ] Free Play team tabs do not corrupt programs/history.
- [ ] Existing workspace persistence still works.
- [ ] Browser tests cover the workflow.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:

- Blockly native history is unavailable and custom history would become a broad persistence project.
- Undo/redo would require changing Blockly execution or block definitions.
- Free Play team tab history cannot be made safe within the packet scope.
- Browser tests cannot interact with Blockly reliably enough to validate the feature.

