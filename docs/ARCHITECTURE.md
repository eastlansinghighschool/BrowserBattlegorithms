# Browser Battlegorithms Architecture

## Goals

This refactor separates game rules from rendering, DOM wiring, and AI integration so the project is easier to extend, test, and navigate in an agentic IDE.

## Folder Roles

- `src/config/`: constants, maps, game modes, keybindings
- `src/core/`: game state, setup, turn engine, rules, invariants
- `src/entities/`: `Runner`, `Flag`, `Barrier`
- `src/ai/`: Blockly setup/interpreter and NPC behavior
- `src/render/`: p5 bootstrapping, board/entity drawing, effects, animation helpers
- `src/ui/`: score display, DOM controls, setup/run UI state, overlays, sound
- `src/usage/`: usage event tracking and export pipeline
- `src/admin/`: local-only admin page for teacher usage-file review (excluded from GitHub Pages build)
- `src/crypto/`: Web Crypto helpers for private Free Play program file encryption
- `src/startup/`: async loading coordination for the Blockly editor and board renderer
- `tests/unit/helpers/`: small builders and fixtures for Node/browser tests
- `tests/`: command-line and Playwright tests

## Data Flow

1. `src/main.js` creates the app container and shared state.
2. `src/ui/controls.js` binds buttons and sliders to state-changing functions.
3. `src/ai/blockly/` and `src/ai/npc/` produce intended actions.
4. `src/core/turnEngine.js` resolves actions and updates logical state.
5. `src/render/p5App.js` draws the current state via p5.

## Team-First Runtime

- Active matches now build an explicit `state.teams` object before creating runners or flags.
- Team identity is the authoritative source for:
  - `playDirection`
  - home side / base area
  - flag home location
  - flag emoji
  - team glow colors
- Runners still carry a runtime `playDirection`, but it is derived from their team's active configuration during setup and reset, not authored independently per runner.
- Free play now generates fresh active teams on entry, randomizing which team attacks left-to-right versus right-to-left while enforcing one `1` direction and one `-1` direction.

## Setup Pipeline

1. `src/core/levels.js` or free-play entry selects an active semantic team setup.
2. `src/core/teams.js` validates that the two teams use opposing `playDirection` values and derives side-dependent base/flag metadata.
3. `src/core/setup.js` builds runtime teams first, then flags, then runners from team-owned runner slots.
4. Guided level extras such as carried-flag starts, frozen teaching props, and barriers are applied from the active setup data.
5. Downstream systems such as scoring, sensing, NPC logic, and visual effects read active team state instead of global static team defaults.

## Subsystem Map

Each subsystem note is the single authoritative doc for its runtime contract. ARCHITECTURE links to them; it does not restate them.

| Note | Scope |
|---|---|
| [blockly-workspace](./subsystems/blockly-workspace.md) | Workspace lifecycle, storage key map, ignored vs disabled blocks, warning and execution-hint lifecycle, project-shared workspaces, undo/redo wrapping. |
| [ui-mode-contract](./subsystems/ui-mode-contract.md) | `currentModeView` vs `freePlayMode` vs `activeBlocklyTeamTab`, which controls are visible in which mode, mode-aware scoreboard and button text, tutorial-overlay gating. |
| [turn-engine](./subsystems/turn-engine.md) | Runtime order of a turn, bounce vs illegal vs skipped action, scoring vs level completion vs round reset, collision rule tree with real exceptions. |
| [file-pipelines](./subsystems/file-pipelines.md) | The three file flows (workspace XML, private encrypted JSON, usage evidence JSON), which mode shows which control, integrity model contrast. |
| [usage-and-admin](./subsystems/usage-and-admin.md) | Event taxonomy, tracker → IndexedDB → export ladder, analyzer signal-vs-noise philosophy, admin app surface, regression artifacts are generated not committed. |
| [npc-and-cpu](./subsystems/npc-and-cpu.md) | Teaching NPC vs free-play CPU split, what is deterministic, where randomness is allowed, shared pathing helper, `state.randomFn` test hook. |
| [p5-surface-map](./subsystems/p5-surface-map.md) | `draw()` is part tick part paint, canvas-adjacent DOM overlays are not p5 features, who owns the canvas surface vs DOM layout. |

## Boundaries

- Rule outcomes belong in `src/core/`.
- p5 drawing and animation belong in `src/render/`.
- DOM/button state belongs in `src/ui/`.
- Blockly block definitions and workspace management belong in `src/ai/blockly/`.
- Future level systems, save/load, and expanded Blockly blocks should layer on top of this structure rather than being added back into a monolithic runtime file.
