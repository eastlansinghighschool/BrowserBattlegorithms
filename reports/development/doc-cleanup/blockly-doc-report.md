
| Surface in our app | Blockly docs coverage | What’s well documented | Where agents still need help |
|---|---|---|---|
| Block definitions, fields, tooltips, help URLs | Strong | The docs clearly cover custom blocks, fields, block anatomy, and block help/tooltips. | Our curriculum-specific wording and when to prefer fields vs icons still benefit from repo guidance. |
| Icons, especially warning icons | Strong for API, weaker for lifecycle | Blockly documents `Icon`, `WarningIcon`, `getIcons()`, and `setWarningText()`. | The docs don’t really spell out the full warning lifecycle: warning text, warning bubble, hover behavior, and when to close open UI once the issue is fixed. |
| Toolbox structure and categories | Strong | Blockly docs cover flyout vs category toolboxes, category appearance, and dynamic toolbox updates. | They don’t explain our curriculum rule that toolboxes change by lesson/project phase, or why some projects must stay broadly editable across backward navigation. |
| Workspace events and change listeners | Strong | `addChangeListener`, `removeChangeListener`, and the general event model are documented. | The docs don’t show our specific pattern of scanning for statically reachable blocks and applying execution hints to attach/detach warnings. |
| Undo/redo | Strong | `Workspace.undo(redo)` and `clearUndo()` are well documented. | The docs don’t explain how undo interacts with our reset/load flows and workspace persistence. |
| Serialization / import-export | Strong | Blockly clearly documents `Xml.domToWorkspace`, `Xml.workspaceToDom`, and the newer JSON serialization system. | Blockly recommends JSON, but our app intentionally uses XML for student program files and fixtures, so that choice needs a repo-level note. |
| `hideChaff` / popup cleanup | Good API doc, weak interaction doc | Blockly documents `WorkspaceSvg.hideChaff()` and `Blockly.hideChaff()` as “close tooltips, context menus, dropdown selections, etc.” | It does not clearly explain that `setWarningText(null)` and `hideChaff()` are separate concerns in practice, or when a runtime warning change should also dismiss open UI. |
| Keyboard navigation | Good, but plugin-based | Blockly documents keyboard navigation through the accessibility plugin. | Our “keyboard practice” mode and its level-specific behavior are app-specific, so future agents need our repo docs to connect the plugin to the game flow. |
| Rendered DOM and test selectors | Weak | Blockly docs don’t really target test automation selectors. | Agents have to inspect live DOM to find things like warning icon classes, tooltip bubbles, and rendered SVG nodes. This is where the docs are thinnest. |

### The big takeaways

1. **Blockly docs are good when you know the right noun.**  
   If an agent searches for “warning icon,” “fields vs icons,” “toolbox,” “serialization,” “events,” or “undo,” the docs are there and reasonably clear.

2. **Blockly docs get thinner at the seams between features.**  
   The hard part is not “what is a warning icon?” It’s “how do warning icons, warning text, hover bubbles, and chaff cleanup behave together when a block becomes valid again?” That interaction is not described as a single cohesive workflow.

3. **Our app adds a curriculum layer Blockly doesn’t know about.**  
   The docs can tell you how to build blocks and workspaces, but they do not tell you:
   - how our guided-level toolboxes are supposed to stay broad within a project
   - how project-shared workspaces should survive backward navigation
   - how our execution-hint warnings map to lesson pedagogy
   - which persistence path is XML for student files versus JSON for browser state

4. **Tests need a little Blockly-specific internal map.**  
   The docs don’t give you stable DOM selectors or a testing recipe. Future agents need a short internal note for:
   - the warning icon class names in rendered Blockly
   - the tooltip bubble surface versus the block’s own tooltip
   - the `window.__BBA_TEST_HOOKS__` entry points we expose in this app
   - when to inspect block state directly instead of trying to assert hover text

### What I’d document internally next

If we want future agents to move faster, I’d add a short Blockly map to the repo docs covering:

- **Warning lifecycle**
  - `setWarningText(...)`
  - warning icon bubble behavior
  - when `hideChaff()` should be called
  - how to tell a warning bubble from a plain tooltip

- **Our Blockly surface entry points**
  - `src/ai/blockly/blocks.js`
  - `src/ai/blockly/workspace.js`
  - `src/main.js` test hooks
  - `tests/browser/helpers.js`

- **Serialization policy**
  - XML is the classroom file format here
  - JSON is for Blockly’s internal recommendation, but not our public file flow

- **Toolbox policy**
  - how guided, challenge, and project levels decide their toolbox breadth
  - why project toolboxes must stay editable across backward navigation

- **Testing tips**
  - which state to assert directly
  - which bits are visual-only
  - which DOM selectors are reliable enough to use in browser tests

### Additional orchestration gaps from the workspace scan

The earlier report was right about the warning lifecycle and toolbox policy, but the orchestration layer now has a few more app-specific rules that are easy to miss if an agent only reads Blockly docs:

1. **Ignored blocks are not the same thing as disabled blocks.**
   - In [src/ai/blockly/workspace.js](../../../src/ai/blockly/workspace.js), ignored blocks are marked with an app-specific disabled reason and warning text.
   - The event block itself is always kept alive as the program anchor.
   - A block can be reachable, unreachable, or attached-but-unreachable, and those states get different warning copy.
   - This is app policy layered on top of Blockly, not a Blockly concept the docs explain for us.

2. **Workspace reset and workspace preserve are different operations.**
   - `loadWorkspaceXml()` clears and reloads the editor, then rebuilds the event block and clears undo history.
   - Guided level reset preserves project or level workspace XML and re-enters the current level.
   - Free Play tab switching preserves each team’s saved XML and reloads the newly active tab.
   - Project-level `Reset Level` preserves the shared project code, while resetting the round/state.
   - That distinction is important because the same Blockly workspace can be reset, reloaded, or preserved depending on the mode.

3. **Shared workspaces are now scoped by level kind, not just by “the workspace.”**
   - Ordinary guided levels use one persisted XML blob per level id.
   - Guided projects use one shared latest workspace per project id.
   - Free Play uses separate storage for player-team and PvP team tabs.
   - The docs should not describe Blockly persistence as a single bucket anymore.

4. **The storage keys themselves are part of the runtime contract.**
   - `bba:guided-workspace:<levelId>` for ordinary guided levels.
   - `bba:guided-project-workspace:<projectId>` for shared project workspaces.
   - `bba:free-play-workspace` for PvCPU-style free play.
   - `bba:free-play-pvp-team:1` and `bba:free-play-pvp-team:2` for PvP tabs.
   - `bba:blockly-panel-size` for UI layout preference.
   - `bba:project-start-callout-seen:<projectId>` for the one-time project-start note.
   - `bba:dev-unlock-all-levels` and `bba:guided-level-progress` live in the broader app, but they are not Blockly workspace keys.

5. **Project chrome is a Blockly-adjacent surface, not just level-panel copy.**
   - [src/ui/projectSignifiers.js](../../../src/ui/projectSignifiers.js) owns the project badge, persistent indicator, project-start callout, and L32 carrier note.
   - [src/ui/blocklyPanel.js](../../../src/ui/blocklyPanel.js) decides when the project-start workspace callout appears near the editor.
   - These signals are part of the Blockly user experience, but they are driven by project metadata and local storage, not by Blockly itself.

6. **Undo/redo fits the same orchestration map.**
   - Undo/redo is native Blockly, but our app wraps it so chaff is hidden and the workspace is editable before history actions run.
   - Reset/load paths clear undo history explicitly so students do not walk back into stale pre-reset states.

### Reported doc-help priorities after this scan

If we were to patch the repo docs now, the highest-value additions would be:

- a compact “Blockly workspace lifecycle” note with load/reset/preserve behavior
- a storage-key map for guided, project, and free-play Blockly persistence
- a short explanation that ignored blocks are deliberate curriculum warnings, not broken blocks
- a note that project signifiers and project-start callouts are Blockly-adjacent app policy
- a reminder that undo/redo and `hideChaff()` are part of our workspace orchestration, not just Blockly UI trivia

### Sources I used

- [Blockly block help](https://developers.google.com/blockly/guides/create-custom-blocks/define/block-help)
- [Blockly fields overview](https://developers.google.com/blockly/guides/create-custom-blocks/fields/overview)
- [Blockly fields vs icons](https://developers.google.com/blockly/guides/create-custom-blocks/icons/overview)
- [Blockly icons overview](https://developers.google.com/blockly/guides/create-custom-blocks/icons/overview)
- [Blockly `WarningIcon`](https://developers.google.com/blockly/reference/js/blockly.icons_namespace.warningicon_class)
- [Blockly `setWarningText`](https://developers.google.com/blockly/reference/js/blockly.block_class.setwarningtext_1_method)
- [Blockly `hideChaff`](https://developers.google.com/blockly/reference/js/blockly.workspacesvg_class.hidechaff_1_method)
- [Blockly events](https://developers.google.com/blockly/guides/configure/web/events)
- [Blockly toolboxes](https://developers.google.com/blockly/guides/configure/web/toolboxes)
- [Blockly serialization](https://developers.google.com/blockly/guides/configure/web/serialization)
- [Blockly workspace undo](https://developers.google.com/blockly/reference/js/blockly.workspace_class.undo_1_method)
- [Blockly keyboard navigation](https://developers.google.com/blockly/guides/configure/web/keyboard-nav)
