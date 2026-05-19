# p5 Surface Map

## Scope

This note owns:
- The role of `draw()` as both a simulation tick and a paint pass, and why that matters.
- Which parts of the visual surface belong to p5 vs which are DOM overlays.
- Keyboard event routing between p5 and the rest of the app.
- Entity rendering conventions (emoji glyphs, mirror transforms).

This note does NOT own:
- Game state and rule logic — owned by `src/core/`.
- DOM controls, buttons, and scoreboard — owned by `src/ui/`.
- The goal burst overlay lifetime — owned by `src/ui/goalBurstOverlay.js` (canvas-adjacent DOM, not p5).
- Turn resolution order — see [turn-engine.md](./turn-engine.md).

## Surface map

| File | Role |
|---|---|
| `src/render/p5App.js` | Boots the p5 instance, owns the frame loop, routes keyboard input, calls render functions. |
| `src/render/drawBoard.js` | Draws the grid, territory zones, barriers, target cells, and the game-over overlay. |
| `src/render/effects.js` | Draws active-runner glow plus transient Area Freeze pulse and affected-runner flash. |
| `src/render/drawEntities.js` | Draws runners, flags, and frozen/active state visuals using p5 text/glyph calls. |
| `src/entities/Runner.js` | Owns the runner glyph, mirror logic, frozen countdown badge, and animation state. |
| `src/entities/Flag.js` | Owns the flag glyph and position. |
| `src/entities/Barrier.js` | Owns the barrier glyph and ownership state. |

## `draw()` is part tick, part paint

In standard p5 usage, `draw()` is a pure rendering function called each frame. In this app it is not.

`src/render/p5App.js` `draw()` does two things on each frame:

1. **Simulation tick** — calls `processTurnActions(app, p)` to advance the turn engine, apply queued actions, and update game state.
2. **Paint pass** — calls the draw functions in `src/render/` to render the current state.

This means `draw()` is stateful. Removing the tick call from `draw()` would freeze the game. Adding game logic outside of the tick path (e.g., directly in a draw function) will run on every frame rather than once per turn. Both are common mistakes.

The p5 instance is created in instance mode via `p5(sketch, node)`, attached to the `canvas-container` DOM node. The canvas is sized to fit the grid.

## Canvas vs DOM boundary

The p5 canvas owns the game grid, entities, and in-canvas overlays. Everything else is DOM:

| Surface | Owner |
|---|---|
| Grid cells, territory zones, barriers | p5 canvas (`drawBoard.js`) |
| Runner, flag, and barrier glyphs | p5 canvas (`drawEntities.js`) via entity classes |
| Game-over overlay (end-of-match) | p5 canvas (`drawBoard.js` `drawGameOverOverlay()`) |
| Level goal highlight (blue target cell) | p5 canvas (driven by `getLevelGoalCell(app)` from level metadata) |
| Area Freeze pulse, affected-runner flash, frozen countdown badge | p5 canvas (`effects.js`, `Runner.js`) driven by `state.areaFreezeEffect` and frozen runner state |
| Score display, mode label | DOM (`src/ui/scoreboard.js`) |
| Play/reset button, controls | DOM (`src/ui/controls.js`, `src/ui/gameStateUI.js`) |
| Tutorial spotlight and overlays | DOM (`src/ui/tutorialOverlay.js`), positioned relative to canvas |
| Goal burst visual effect | DOM (`src/ui/goalBurstOverlay.js`), positioned using canvas bounding box |

Canvas-adjacent DOM overlays like `goalBurstOverlay.js` use `getBoundingClientRect()` on the canvas container to position themselves. They reposition on scroll and resize events. They are not p5 features.

## Keyboard input routing

p5's `keyPressed()` callback is the entry point for keyboard events in gameplay. `src/render/p5App.js` implements `keyPressed()` and routes to `handleKeyInput(app, p.key)`.

`handleKeyInput` in `src/ui/` translates the key into a queued action for the human runner. Key bindings are defined in `src/config/`. The p5 keyboard callback is only for in-game runner control; UI buttons and overlays use standard DOM event listeners, not p5.

Do not add UI interaction to `keyPressed()` unless it is an in-game runner action. Blockly keyboard shortcuts, tutorial navigation, and panel controls all use DOM listeners. When Blockly keyboard navigation owns focus, `src/render/p5App.js` deliberately treats `#blockly-region`, `#shortcuts`, `.blocklyWidgetDiv`, and `.blocklyDropDownDiv` as Blockly-owned surfaces and returns without queuing a runner action.

## Entity rendering conventions

Runners, flags, and barriers are rendered as emoji glyphs using p5's `text()` function at grid coordinates.

Runner-specific conventions:
- Runners facing right-to-left (team 2, `playDirection === -1`) are mirrored using `translate()` + `scale(-1, 1)` so their emoji appears to face left.
- Frozen runners render with a distinct glyph or visual state set by the entity class.
- Frozen runners also render a small countdown badge near the runner, while successful Area Freeze actions briefly add a board pulse and affected-runner flash on the canvas.
- Animation state (position interpolation between cells) is owned by the entity class and read by the render layer.

The render layer does not own game state. It reads from `app.state` and entity objects; it does not write to them. Rule-level changes (position updates, flag pickup, freeze) happen in `src/core/`, not in `src/render/`.

## Game-over overlay

`drawGameOverOverlay()` in `drawBoard.js` is an in-canvas overlay (drawn on top of the board). Its appearance is gated by game mode and turn state, not by a p5 condition. Changing game-over display behavior requires understanding the conditions under which it is triggered in the turn engine (see [turn-engine.md](./turn-engine.md)), not just the drawing code.

## Common traps

- **Putting game logic in a draw function.** Draw functions run every frame. Logic that should run once per turn belongs in the tick path.
- **Assuming canvas-adjacent DOM overlays are p5 features.** `goalBurstOverlay.js` and `tutorialOverlay.js` are DOM nodes positioned relative to the canvas; they are not part of the p5 sketch.
- **Adding UI controls to `keyPressed()`.** That callback is for in-game runner actions. DOM controls use DOM listeners.
- **Mirroring entity rendering logic in the turn engine.** The render layer reads entity state; it does not update it. Visual-only changes (glyph selection, color) stay in `src/render/` or entity classes.

## Related

- [turn-engine.md](./turn-engine.md) — the simulation tick that `draw()` calls each frame
- [ui-mode-contract.md](./ui-mode-contract.md) — which overlays appear in which mode
