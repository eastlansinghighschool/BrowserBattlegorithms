**What p5 docs cover well**

| Surface | p5 docs quality | What an agent can rely on |
|---|---|---|
| Instance mode and canvas setup | Strong | `p5(sketch, node)` and `createCanvas()` are well documented, including attaching to an existing DOM node. |
| Draw loop basics | Strong | `draw()`/`loop()`/`noLoop()` and the general animation model are documented. |
| Primitives and styling | Strong | `rect()`, `circle()`, `line()`, `background()`, `fill()`, `stroke()`, `text()`, `textAlign()`, `textSize()`, `push()`, `pop()`, `translate()`, `scale()` are all documented clearly. |
| Keyboard events | Strong | `keyPressed()` is documented, including its event argument and key variables. |
| Images / image drawing | Strong | `image()` and `p5.Image` are documented, even though we don’t currently lean on them much. |

**What our repo already documents reasonably well**

- `docs/ARCHITECTURE.md` does a decent job of saying rendering lives in `src/render/` and rules live in `src/core/`.
- `docs/GameSpecification.md` gives the intended p5/game loop direction at a high level.
- `docs/DevelopmentLog.md` notes the stack choice and that p5 is pinned to the 1.x line.

So the high-level “what belongs where” is present. The missing part is the **actual operational boundary** of the p5 runtime in this app.

**Where the docs get fuzzy for this app**

| Surface | p5 docs quality | Repo docs quality | What needs more help |
|---|---|---|---|
| `draw()` as a simulation tick | Medium | Weak | In `src/render/p5App.js`, `draw()` is not just paint. It also advances game state via `processTurnActions(app, p)` and then syncs carried flags before rendering. That’s app-specific and easy to misread. |
| Canvas vs. game state ownership | Medium | Medium | The docs say how to draw; they don’t explain that our board/game state is owned by `src/core/` and only rendered by `src/render/`. |
| DOM container + p5 canvas interaction | Medium | Weak | `createCanvas(...).parent("canvas-container")` is simple, but the docs don’t explain how the canvas is coordinated with the surrounding UI, overlays, and layout. |
| Keyboard input routing | Strong for p5 | Weak for app | `keyPressed()` exists, but `handleKeyInput(app, p.key)` is our own bridge. Future agents need to know when keyboard events belong to p5 versus the DOM UI. |
| Entity rendering conventions | Strong for primitives | Weak for app | `Runner`, `Flag`, and `Barrier` render with `text()` and emoji/glyph conventions. `Runner` also mirrors glyphs with `translate()` + `scale(-1, 1)`. That’s not a p5 docs gap so much as a repo convention gap. |
| Overlay and end-state rendering | Medium | Weak | `drawGameOverOverlay()` is a p5 overlay, but whether it appears depends on game mode and turn state. That interaction is not obvious from p5 docs alone. |
| Goal highlight / lesson state coupling | Medium | Weak | The blue target square in `drawLevelGoal()` comes from level metadata via `getLevelGoalCell(app)`. That’s a render/lesson-data handshake, not a p5 concept. |
| Canvas-anchored DOM overlays | Weak | Weak | Things like `goalBurstOverlay` use the canvas bounding box and DOM positioning. This is outside p5’s docs and only lightly represented in our repo docs. |
| Testing selectors and runtime inspection | Weak | Weak | p5 docs don’t tell you how to test rendered canvas output or find stable selectors. Future agents need repo guidance here. |

**The main thing to document better**

If we want future agents to move quickly, the highest-value missing note is a short **“p5 surface map”** that says:

1. `src/main.js` boots the app.
2. `src/render/p5App.js` owns the p5 instance and the frame loop.
3. `draw()` both updates and renders, so it is part game tick, part paint pass.
4. `src/core/` owns all rule/state logic.
5. `src/entities/` owns object-level drawing.
6. `src/ui/` owns DOM overlays, buttons, and keyboard/ui orchestration.
7. Canvas-adjacent DOM overlays are not p5 features; they are app features built around the canvas container.

That would save people from treating `draw()` like a pure renderer when it absolutely isn’t in this codebase.

**My read on the documentation boundary**

- **Well documented by p5:** drawing primitives, text, transforms, canvas creation, instance mode, keyboard callback basics.
- **Well documented by our repo:** the broad separation of core/render/UI.
- **Not well documented enough:** the actual runtime coupling between p5, the turn engine, lesson metadata, DOM overlays, and keyboard handling.

If we add one small internal doc, I’d make it about **“how the p5 canvas participates in the game loop and where not to put logic.”** That’s the seam future agents are most likely to infer incorrectly.

**Sources used**
- Official p5 docs:
  - [p5 constructor](https://p5js.org/reference/p5/p5/)
  - [createCanvas](https://p5js.org/reference/p5/createCanvas/)
  - [background](https://p5js.org/reference/p5/background/)
  - [rect](https://p5js.org/reference/p5/rect/)
  - [circle](https://p5js.org/reference/p5/circle/)
  - [fill](https://p5js.org/reference/p5/fill/)
  - [text](https://p5js.org/reference/p5/text/)
  - [textAlign](https://p5js.org/reference/p5/textAlign/)
  - [textSize](https://beta.p5js.org/reference/p5/textSize)
  - [push](https://beta.p5js.org/reference/p5/push/)
  - [image](https://beta.p5js.org/reference/p5/image/)
  - [keyPressed](https://beta.p5js.org/reference/p5/keypressed/)
  - [loop](https://beta.p5js.org/reference/p5/loop/)
- Repo docs:
  - [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md)
  - [docs/GameSpecification.md](../../../docs/GameSpecification.md)
- Repo code surfaces I inspected:
  - [src/render/p5App.js](../../../src/render/p5App.js)
  - [src/render/drawBoard.js](../../../src/render/drawBoard.js)
  - [src/render/drawEntities.js](../../../src/render/drawEntities.js)
  - [src/entities/Runner.js](../../../src/entities/Runner.js)
  - [src/entities/Flag.js](../../../src/entities/Flag.js)
  - [src/entities/Barrier.js](../../../src/entities/Barrier.js)
