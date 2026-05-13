*the docs are decent on the classroom intent of Free Play, but they are much thinner on the runtime contracts that make Free Play actually work in the app**.

## What the docs already explain well

The docs do give a solid high-level story:

- `docs/TeacherGuide.md` explains that Free Play is the sandbox after Guided Levels, and that it is where students experiment and discuss strategy.
- `docs/GameSpecification.md` describes Free Play as the broader sandbox with PvP and PvCPU modes, team-size selection, map selection, and a wider Blockly toolbox.
- `docs/development/README.md` and the plan docs explain that Free Play is intentionally separate from guided curriculum work.
- `docs/ARCHITECTURE.md` at least names Free Play as a distinct product surface with its own mode state and CPU behaviors.

So if an agent is asking “what is Free Play for?”, the docs are serviceable.

## Where the docs are stale or incomplete

The main weakness is that the docs talk about Free Play as one thing, while the code actually has several Free Play sub-systems that behave differently.

### 1. Mode state is more layered than the docs describe

In code, Free Play is not just “the sandbox.” It has at least these distinctions:

- `currentModeView` = Free Play vs Guided Levels
- `freePlayMode` = PvP, PvCPU Easy, PvCPU Tactical
- `activeBlocklyTeamTab` = which team program is currently being edited in PvP
- `freePlayTeamSize`
- `mapKey`
- the underlying active team setup in `src/core/setup.js`

The docs mention some of those ideas, but they do not clearly define how they relate to each other.

### 2. Free Play persistence is mode-specific, but the docs do not map the storage model cleanly

From the code:

- guided levels use per-level workspace storage
- Free Play uses:
  - `bba:free-play-workspace`
  - `bba:free-play-pvp-team:1`
  - `bba:free-play-pvp-team:2`

That distinction lives mostly in code and tests, not in the docs.

The docs do mention local storage in general, but they do not clearly explain:

- why PvP has one saved workspace per team tab
- why PvCPU has one shared player-team workspace
- how Free Play persistence differs from guided progression persistence
- what is shared across modes and what is not

### 3. The UI contract for Free Play controls is mostly implicit, not documented

In code:

- [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js) hides guided program import/export controls from Guided Levels
- [src/ui/blocklyPanel.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/blocklyPanel.js) switches the panel between:
  - guided level summary
  - PvP team tabs
  - PvCPU free-play summary
- the file import/export path now handles:
  - normal XML
  - private encrypted program files
  - usage export separately

The docs say Free Play should have more flexibility, but they do not clearly spell out which controls are hidden in Guided Levels and which are visible only in Free Play.

### 4. Team tabs and saved workspaces are only partly documented

This is one of the biggest gaps for future agents.

The code clearly does this:

- in PvP, there are two editable Blockly tabs
- each tab maps to its own saved workspace
- switching tabs preserves the inactive team’s program
- the panel still behaves like a single editor, but the loaded XML changes by active tab

That behavior is real and important, but the docs do not explain it cleanly enough. An agent could easily assume there is one Free Play program per mode when there are actually separate PvP team programs.

### 5. Setup/runtime behavior is not obvious from the docs

`src/core/setup.js` does more than “start a match.” It also:

- randomizes free-play team orientation
- derives team flags from runtime team state
- applies free-play CPU behavior
- builds runners from team slots
- resolves flag overrides and barrier setup

The docs say Free Play supports multiple modes and teams, but they do not explain that runtime setup is parameterized and mode-aware in this way.

## Interactions with other surfaces that matter

Free Play is really a cross-cutting surface. The docs are weakest exactly where it intersects with other systems.

### A. Blockly workspace integration

The Blockly layer is where Free Play becomes tangible:

- the visible editor remains one panel
- the active XML changes by mode and team tab
- the undo/redo, import/export, and persistence layers all hang off the Blockly workspace

That boundary is not spelled out clearly enough in the docs.

Useful code references:
- [src/ui/blocklyPanel.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/blocklyPanel.js)
- [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js)
- [src/ai/blockly/workspace.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/blockly/workspace.js)

### B. Guided-vs-Free-Play switching

The docs mention the distinction, but the runtime behavior matters:

- Guided Levels hide the import/export controls
- Free Play shows them
- the mode chooser and tutorial overlay are part of the startup flow
- switching modes changes not only what the player sees, but also what persistence keys are active

That is important enough that it deserves a small internal “mode contract” note.

### C. Setup and scoring

Free Play is not just a UI shell, it drives the actual match setup:

- team composition
- play direction
- CPU behavior
- map selection
- team scores and match win rules

That means changes in setup can affect both gameplay and persistence. The docs currently hint at this, but do not fully map the responsibilities.

### D. Private program files and usage export

This is now another place where the docs and runtime can get tangled:

- Free Play supports normal XML export/import
- it also supports private encrypted program files
- usage export is separate again

The current docs mostly describe these as features, not as distinct file pipelines with different purposes.

## What is well documented versus what needs help

### Well documented
- Free Play exists as the sandbox after guided learning
- PvP and PvCPU modes exist
- team size and map selection exist
- Free Play has broader Blockly access than guided mode
- Free Play is separate from guided curriculum work

### Needs more doc help
- the exact meaning of `currentModeView` vs `freePlayMode` vs `activeBlocklyTeamTab`
- how PvP team programs are persisted separately
- which controls are hidden in Guided Levels
- how Free Play loads and restores the right workspace by mode
- how setup randomization and CPU behavior relate to the visible UI
- where normal XML export/import ends and private file handling begins

## One doc mismatch worth calling out

`docs/ARCHITECTURE.md` still says guided and free-play workspaces persist through local storage in a pretty simple way. That is now incomplete. The actual behavior is more nuanced because:

- guided progression itself is persisted separately
- guided workspaces and Free Play workspaces use different keys
- PvP has one key per team
- project levels add shared-workspace behavior on top of guided mode

So the architectural story needs one more pass if we want future agents to have a clean map.

## My practical recommendation

If we want this area to be easy for agents later, the repo would benefit from a short internal note that explains:

1. the difference between Guided Levels and Free Play
2. the difference between `currentModeView`, `freePlayMode`, and `activeBlocklyTeamTab`
3. how workspace persistence is keyed in each case
4. which UI controls exist in which mode
5. how setup and Blockly loading cooperate when the mode changes

That note would do for Free Play what the project-sequence docs did for the guided project arcs.

## Evidence I used

- [docs/ARCHITECTURE.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/ARCHITECTURE.md)
- [docs/GameSpecification.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/GameSpecification.md)
- [docs/TeacherGuide.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TeacherGuide.md)
- [docs/TESTING.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TESTING.md)
- [docs/development/README.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/README.md)
- [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js)
- [src/ui/blocklyPanel.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/blocklyPanel.js)
- [src/ui/programContext.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/programContext.js)
- [src/core/setup.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/setup.js)
- [src/config/gameModes.js](C:/Codex/BrowserBattlegorithms_CODEX/src/config/gameModes.js)
- [src/config/levels/shared/project.js](C:/Codex/BrowserBattlegorithms_CODEX/src/config/levels/shared/project.js)
- [src/ai/blockly/workspace.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/blockly/workspace.js)
- [tests/browser/free-play.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/browser/free-play.spec.js)
- [tests/browser/persistence.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/browser/persistence.spec.js)
- [tests/unit/free-play-contracts.test.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/unit/free-play-contracts.test.js)
