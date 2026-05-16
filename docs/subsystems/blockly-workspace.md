# Blockly Workspace

## Scope

This note owns:
- Workspace lifecycle: how XML is loaded, reset, and preserved across level transitions and mode switches.
- Storage key map: the full list of `localStorage` keys used by Blockly-related persistence.
- Ignored-block vs disabled-block semantics and the execution-hint warning lifecycle.
- Project-shared workspace behavior and how it differs from ordinary guided-level persistence.
- Undo/redo wrapping and `hideChaff()` coordination.

This note does NOT own:
- Which controls (import, export, tabs) are visible in which mode — see [ui-mode-contract.md](./ui-mode-contract.md).
- The file pipelines for XML export, private encrypted program files, or usage evidence — see [file-pipelines.md](./file-pipelines.md).
- Usage tracker consumption of workspace events — see [usage-and-admin.md](./usage-and-admin.md).
- Project badge, persistent indicator, and project-start callout DOM — see [ui-mode-contract.md](./ui-mode-contract.md).

## Surface map

| File | Role |
|---|---|
| `src/ai/blockly/workspace.js` | Workspace lifecycle: `loadWorkspaceXml()`, `getWorkspaceXmlText()`, storage reads/writes, event-block rebuilding, undo-history clearing, ignored-block scanning. |
| `src/ai/blockly/blocks.js` | Custom block definitions and toolbox category config. |
| `src/ui/blocklyPanel.js` | Panel layout switching (guided summary / PvP tabs / PvCPU summary), project-start callout signal. |

## Storage key map

All Blockly-related `localStorage` keys use the `bba:` prefix. The full set:

| Key | What it stores |
|---|---|
| `bba:guided-workspace:<levelId>` | Serialized XML for one ordinary guided level. |
| `bba:guided-project-workspace:<projectId>` | Shared latest XML for all levels in a guided project arc. |
| `bba:free-play-workspace` | Player-team XML for PvCPU free play. |
| `bba:free-play-pvp-team:1` | Team 1 XML for PvP free play. |
| `bba:free-play-pvp-team:2` | Team 2 XML for PvP free play. |
| `bba:blockly-panel-size` | User's preferred Blockly panel width (UI layout). |
| `bba:project-start-callout-seen:<projectId>` | Whether the one-time project-start callout has been dismissed. |

Keys that are NOT Blockly workspace keys but live in the same storage:
- `bba:guided-level-progress` — guided level unlock progression (owned by `src/core/levels.js`).
- `bba:dev-unlock-all-levels` — dev-only toggle state (owned by `src/main.js`).

## Workspace lifecycle

Three distinct operations exist; they are not interchangeable:

**Load** (`loadWorkspaceXml()`): Clears the current editor, deserializes XML into the workspace, rebuilds the required `On Each Turn` event block if absent, and clears undo history. Undo history is cleared deliberately so students do not walk back into stale pre-load state.

**Reset**: Guided level reset re-enters the current level using the already-persisted level or project workspace XML. The round and runner state resets; the workspace XML is preserved. For project levels specifically, `Reset Level` preserves the shared project code — it does not wipe the workspace back to the level's default.

**Preserve**: Free Play tab switching saves the inactive team's XML to its storage key and loads the newly active team's XML. The editor remains one panel; only the loaded program changes.

**Project-shared workspaces**: Levels inside a project arc (`strategy-brain` L23-L28, `team-strategy-script` L29-L37) share one workspace key per project id. A save on any project level updates that shared key. Backward navigation within the arc loads the same shared latest XML.

**Local-dev guided assist**: When the dev-only `devGuidedLevel` shortcut is active, the startup path applies a dev-only viewport-fitting guided layout, scales the board visually so the canvas stays fully visible, opens the first toolbox category, and uses a one-shot clamped Blockly scroll to keep the starter `On Each Turn` block visible to the right of the open drawer. This assist is local-dev only, does not rewrite saved XML, and does not depend on a long delayed translation.

## Toolbox policy

Toolbox breadth is controlled per level kind:

- Ordinary guided levels: toolbox is scoped to the current lesson's blocks plus blocks from prior levels.
- Challenge/synthesis levels: same toolbox as the previous non-challenge level; no new blocks introduced.
- Project levels: toolbox is intentionally broad from project start. UI copy and the project callout focus attention without hiding carried-code blocks. The broad toolbox must survive backward navigation within the arc.
- Free Play: full sandbox block set, including blocks not available in any guided level.

## Ignored blocks vs disabled blocks

Ignored blocks and Blockly-disabled blocks are not the same thing.

- **Ignored blocks** are blocks that the runtime execution scan will not reach: unattached blocks, unreachable blocks, or blocks attached to the workspace but not connected to the `On Each Turn` event chain.
- The workspace scanner in `src/ai/blockly/workspace.js` applies an app-specific disabled reason and warning text to ignored blocks so students see a visual signal.
- The `On Each Turn` event block itself is always kept alive as the program anchor — it is never marked ignored.
- Reachable but logically skipped blocks (e.g., branches not taken) are not marked ignored; they are just not executed.

## Warning and execution-hint lifecycle

1. After each workspace edit, the scanner runs and identifies ignored/unreachable blocks.
2. Ignored blocks receive a `setWarningText(...)` call with the app's execution-hint copy.
3. When a block becomes reachable again, `setWarningText(null)` removes the warning.
4. `hideChaff()` is a separate call that closes open tooltip bubbles, context menus, and dropdown selections. It is called on reset/load paths and before undo/redo actions, but it does not automatically accompany `setWarningText`.
5. Warning icons and chaff cleanup are separate concerns: clearing a warning does not close an open warning bubble. Code that updates warning state should consider whether open UI should also be dismissed.

## Trace collection

Blockly trace collection is a passive, argument-threaded data path that records what the resolver actually evaluated during action selection. It does not mutate workspace XML, warning state, runner state, or any DOM surface in this packet.

The collector is only attached on the visible-workspace path. The inactive PvP team's hidden-workspace branch stays trace-free.

Plan 29 refines the trace playback contract while keeping the same `bba-trace-*` surface, so the following behaviors still hold: trace highlight uses `workspace.highlightBlock(...)` plus `bba-trace-*` CSS classes on the live workspace SVG; it never calls `setWarningText(...)` or `setDisabledReason(...)`; it cooperates with `hideChaff()` on trace start so open bubbles and menus do not co-render with the highlight; and the overflow badge and empty-program hint are part of the same trace UI surface and clear with the block highlights. Result outlines now fade away while their glyphs remain as the durable evaluated-path record, the active block gets a brighter orange live signal, and reduced-motion users see the glyph history plus the plain orange current-step stroke.

## Undo/redo wrapping

Undo/redo uses Blockly-native history (`Workspace.undo(redo)`). The app wraps each undo/redo call to:
1. Confirm the workspace is editable before executing the history action.
2. Call `hideChaff()` so open popups do not persist across the state change.

Reset and load paths call `clearUndo()` explicitly. Students cannot undo past a level load or reset.

## Common traps

- **Persistence is not one bucket.** Do not write code that assumes a single "the workspace" key. The key depends on whether the context is a guided level, a project level, a PvCPU session, or a PvP team tab.
- **Ignored is not disabled.** Blockly has a first-class disabled state; the app's ignored-block marking uses a separate disabled-reason mechanism. Treating them as the same will produce wrong warning counts.
- **Reset ≠ load ≠ wipe.** Level reset preserves the workspace; `loadWorkspaceXml()` replaces it; project `Reset Level` preserves project code. Pick the right operation for the context.
- **Warning text and chaff cleanup are independent.** `setWarningText(null)` removes the warning annotation; it does not close the warning bubble UI if it is open. Call `hideChaff()` separately when you need to dismiss visible UI.
- **Undo history should be cleared after any programmatic load.** Leaving stale history lets students undo into the pre-load state, which is almost never intended.

## Related

- [ui-mode-contract.md](./ui-mode-contract.md) — which panel layout and controls are shown per mode
- [file-pipelines.md](./file-pipelines.md) — export/import flows that read/write workspace XML
- [usage-and-admin.md](./usage-and-admin.md) — usage tracker's workspace-event consumption
