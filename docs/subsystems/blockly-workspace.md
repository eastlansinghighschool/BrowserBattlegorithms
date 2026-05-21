# Blockly Workspace

## Scope

This note owns:
- Workspace lifecycle: how XML is loaded, reset, and preserved across level transitions and mode switches.
- Storage key map: the full list of `localStorage` keys used by Blockly-related persistence.
- Ignored-block vs disabled-block semantics and the execution-hint warning lifecycle.
- Current block inventory and Blockly execution-model rules, including the first-action-only turn contract.
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
| `bba:guided-workspace-version:<levelId>` | Hash of the guided level's `initialBlocklyXml` at the time the workspace was last written. Used by the starter versioning system (see "Starter XML versioning" below). |
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

## Starter XML versioning

**Why this exists.** On 2026-05-17 the integration owner fixed a malformed `<next>` nesting in the bughunt-22 starter XML. The fix was deployed but returning students still saw the broken level — `localStorage` had cached the broken parse result and the load path preferred it over the newly-authored `initialBlocklyXml`. School-managed Chromebooks lock students out of DevTools, so the manual `localStorage.removeItem` escape hatch was unavailable. This versioning layer closes that hole.

**Hash function and normalization (Plan 45, stable by contract).** Each guided level's `initialBlocklyXml` is hashed once at module-load time using FNV-1a 32-bit, producing an 8-character lowercase hex digest (e.g. `"a3f7c218"`). The hash is computed on a normalized form of the XML:
- Inter-element whitespace-only text nodes are stripped (`> ... <` → `><`).
- Remaining runs of whitespace are collapsed to a single space.
- `x="…"` and `y="…"` block-position attributes are removed.

This means an author can reformat the XML file or change the saved block positions without triggering a stale-replace on students.  A change to any block type, field value, or structural nesting produces a different hash and will trigger stale-replace on the next student visit.

The hash function itself is the contract. Do not swap FNV-1a for a different algorithm without also versioning the key format (e.g. prefixing the digest with an algorithm tag like `fnv1a-32:`).

**Two-key storage shape.** For every ordinary guided level (keys with the `bba:guided-workspace:` prefix), a sibling key `bba:guided-workspace-version:<levelId>` stores the hash at the time of the last write. Both keys are always written together. If the main workspace key is absent, the version key is ignored.

**Replace-on-mismatch (silent by design).** On load, if the stored version hash does not match the current level's computed hash, the stored workspace is discarded and `initialBlocklyXml` is loaded as if the student were visiting fresh. No toast or modal is shown. The student simply sees the corrected starter. Rationale: in pilot, the orchestrator is the source of truth for authored content; students benefit from seeing the correct level, not from knowing it changed.

**Grace stamp for pre-packet stored workspaces (Decision 5).** Stored workspaces written before Plan 45 shipped have no version key. On first load after deploy, the loader detects the missing key and stamps the current hash, letting the student keep their in-flight work. From the second load onward, the hash is present and normal compare logic applies — any subsequent author edit reaches the student reliably.

**Scope — guided non-project levels only.** The versioning layer only applies to `bba:guided-workspace:*` keys. The following are intentionally exempt:
- **Free play workspaces** (`bba:free-play-workspace`, `bba:free-play-pvp-team:N`): student-authored programs, not authored content. Must persist unchanged across sessions.
- **Project shared workspaces** (`bba:guided-project-workspace:<projectId>`): one workspace shared across all levels in a project arc. Versioning here is more complex (the canonical "starter" is the first-level state, not per-level), and project-level authoring fixes are rare enough to communicate out-of-band for now.

**Manual reset affordance.** A "Reset Workspace to Starter" button (`#resetWorkspaceToStarterButton`) appears in `#blockly-toolbar` next to the undo/redo controls. It is visible only on guided non-project levels that have a non-empty `initialBlocklyXml`; hidden in Free Play and on project-shared-workspace levels. On click, a `window.confirm()` dialog prompts "Reset your blocks to the starter program for this level? Your current blocks will be lost." On confirm, the button uses the same internal code path as the stale-replace branch: `resetWorkspaceToCurrentStarter(app)` in `workspace.js`. This is distinct from the Play/Reset button, which preserves the workspace and only resets the game board state.

## Keyboard navigation

Plan 40 integrates Blockly's official `@blockly/keyboard-navigation` plugin for the live workspace. `initBlockly()` registers the plugin's keyboard-navigation styles before `Blockly.inject(...)`, installs a navigation-deferring toolbox wrapper, and creates a `KeyboardNavigation` instance for the live workspace after injection. The app shell also provides the plugin's required `#shortcuts` host so `/` can open the keyboard-help dialog.

The plugin owns workspace, toolbox, flyout, and field-edit keyboard behavior. The app's p5 layer stays out of the way whenever focus is inside Blockly-owned surfaces (`#blockly-region`, `#shortcuts`, `.blocklyWidgetDiv`, or `.blocklyDropDownDiv`) so Blockly keyboard navigation, undo/redo, and field editors can run without queuing runner actions.

## Toolbox policy

Toolbox breadth is controlled per level kind:

- Ordinary guided levels: toolbox is scoped to the current lesson's blocks plus blocks from prior levels.
- Challenge/synthesis levels: same toolbox as the previous non-challenge level; no new blocks introduced.
- Project levels: toolbox is intentionally broad from project start. UI copy and the project callout focus attention without hiding carried-code blocks. The broad toolbox must survive backward navigation within the arc.
- Free Play: full sandbox block set, including blocks not available in any guided level.

## Current block inventory

The current Blockly catalog is the canonical authored block set for this game. The rules note points here rather than duplicating the block list.

- Actions: `On Each Turn`, `Move Forward`, `Move Backward`, `Move Up`, `Move Down`, `Move Randomly`, `Stay Still`, `Jump Forward`, `Place Barrier`, `Move Toward [Enemy Flag / My Base / Human Runner / Closest Enemy]`, `Use Area Freeze`.
- Conditions: `If [Object] is [Relation]`, `If [Object] is [Relation] / Else`, `If I have enemy flag`, `If enemy is in front`, `If barrier is in front`, `If I can jump`, `If I can place barrier`, `If Area Freeze is ready`, `Is enemy within [1/2/3] steps?`, `Is [My Runner / Enemy Flag / My Base] on [My Side / Enemy Side] of map?`, `Die roll (1-6) > [1/2/3/4/5]`.
- Logic: `If [boolean]`, `If [boolean] / else`, `AND`, `OR`, `NOT`.
- Values and sensing: typed numbers, runner index, distance to target, `count of [enemy runner / barrier / human runner / ally runner] within [1-6] spaces`, random roll, playDirection, `My X`, `My Y`, `Enemy Flag X`, `Enemy Flag Y`, and `My Base X`, `My Base Y`. Free Play also exposes `my last move was blocked`, `I have not moved for [2/3/4/5] turns`, and `I have been stuck for [3/4/5] turns` as read-only Advanced boolean values. The count-within block appears in the Strategy Brain and Team Strategy Script project toolboxes and in Free Play default.
- Sensor object dropdowns include barrier, edge/wall, enemy runner, enemy flag, human runner, and ally runner wherever the current level allows the generic sensor block.
- Free Play exposes the broader sandbox, while guided levels scope the toolbox to the current lesson and prior mastered concepts. The recent-state boolean blocks are Free Play-only for now and do not appear in any guided-level toolbox.

## Execution model

Student programs start from a required `On Each Turn` block.
Only blocks attached beneath that event are part of the program chain, and only the first reachable action under that chain executes each turn.
Any additional sequential action blocks are intentionally ignored and should be visually marked as such so beginners are not misled.
Unattached blocks elsewhere in the workspace are also ignored and should be visually indicated as inactive.
`Move Toward [Target]` is a one-step helper, not full pathfinding.
The advanced campaign allows one Blockly workspace to control multiple allied runners, with `runner index` used to assign different jobs inside one shared program.
Readiness checks such as `If I can jump`, `If I can place barrier`, and `If Area Freeze is ready` are ordinary condition blocks, not special-cased execution paths.

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
