## What the docs explain well

The high-level learning flow is pretty clear in the repo docs:

- `docs/ARCHITECTURE.md` explains the broad separation: `src/config/` for authored data, `src/core/` for rules and setup, `src/render/` for p5, `src/ui/` for DOM.
- `docs/GameSpecification.md` explains the intended guided campaign shape, the turn structure, and the idea of static authored maps and unlockable blocks.
- `docs/development/project-sequence-decisions.md` and `docs/development/project-level-map.md` are strong and authoritative for the two project arcs. They clearly describe:
  - `strategy-brain` for L23-L28
  - `team-strategy-script` for L29-L37
  - shared latest workspace behavior
  - broad project toolboxes
  - challenge/capstone framing
- `docs/TeacherGuide.md` gives the classroom-level story: guided first, free play later, reset preserves code, and guided workspaces save separately from free play.

So at the “what is the curriculum trying to do?” level, the docs are in decent shape.

## Where the docs are thin or stale

The biggest gap is that the app now has **multiple layered progression states**, but the docs mostly talk as if guided progression were one simple thing.

In code, the guided path splits into at least four separate concerns:

1. **Authored level order and metadata**
   - `src/config/levels/index.js`
   - `src/config/levels/manifest.js`
   - individual level files under `src/config/levels/phases/...`

2. **Unlock/progression state**
   - `src/config/levels/shared/levelProgress.js`
   - `src/core/levels.js`

3. **Workspace state**
   - `src/ai/blockly/workspace.js`
   - `src/ui/blocklyPanel.js`
   - `src/main.js`

4. **Tutorial seen state**
   - `src/ui/tutorialOverlay.js`

The docs do not clearly spell out that those are separate layers, and that matters for agents.

### Specific mismatches / gaps

- `docs/ARCHITECTURE.md` still says “one Local Storage key per guided level.” That is now incomplete. The current code also has:
  - a persisted guided progression record in `src/core/levels.js`
  - project-scoped shared workspaces
  - tutorial-seen state
  - lesson panel collapse state
  - dev-unlock session storage
- The main docs don’t clearly say that **ordinary guided levels persist per level**, while **project levels persist as one shared latest workspace per project id**.
- The docs don’t clearly explain that **`currentLevelId` is not persisted as the exact last-selected level**. After a reload, the unlocked state comes back, but the app still initializes to the first guided level unless the user navigates again.
- The docs say reset preserves code, which is good, but they don’t really explain the runtime sequence:
  - `resetCurrentLevel()` preserves workspace XML
  - re-enters guided mode
  - reloads the current level setup
  - restores the Blockly XML afterward
- The docs don’t distinguish between **“level is unlocked”** and **“workspace for that level/project is restored.”** Those are separate operations in the app, but they’re easy to conflate.

## Interactions with other surfaces that matter

### 1. Blockly workspace loading
Guided progression is tightly coupled to Blockly loading in practice.

- `src/main.js` calls `syncEditorForCurrentMode()`.
- In guided mode, that loads the workspace for the current level.
- For project levels, that workspace may be the shared project workspace rather than the authored starter XML.
- So changing progression doesn’t just change the visible level title; it also changes which XML gets loaded into Blockly.

That coupling is real, but the docs don’t describe it clearly.

### 2. Level picker and signifiers
`src/ui/levels.js` now renders:

- current level status
- challenge badges
- project badges
- project start callouts
- project state notes

The docs explain the concept of challenge/project framing, but they don’t map it to the actual UI surfaces very explicitly. A future agent reading only the general docs could easily miss that the level picker and lesson panel are both progression views, not just decorative UI.

### 3. Tutorial overlay gating
`src/ui/tutorialOverlay.js` can block the normal guided flow until the initial chooser/tutorial is dismissed.

That means the visible progression path is not just:
“pick level -> play level -> unlock next level.”

It is often:
“choose guided mode -> clear tutorial overlay -> load editor/canvas -> then navigate levels.”

The docs mention tutorials, but not this as a state-machine interaction. That makes browser test work more confusing than it needs to be.

### 4. Dev unlock vs real progression
`src/main.js` has a dev-only unlock toggle that uses session storage to bypass the normal scaffold.

That is useful for testing, but the docs don’t really describe it as a separate override path. If someone is scanning the code/docs for “why do all levels appear unlocked in tests?”, they won’t find that story in the main docs.

### 5. Browser persistence
The browser tests now verify that:

- guided unlock state survives reload
- guided project workspaces share latest code
- reset preserves project code
- free play stays isolated

Those behaviors are real and useful, but they’re not all described in the general docs. The best documentation for them currently lives in the project-sequence docs and the tests themselves.

## What is documented, but only in the more specialized docs

The strongest documentation for the current behavior is actually in the Plan 08 decision records:

- [docs/development/project-sequence-decisions.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-sequence-decisions.md)
- [docs/development/project-level-map.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-level-map.md)

Those documents are authoritative for the project arc, but they’re buried under the development folder. A fresh agent starting from the general docs could miss them unless explicitly pointed there.

## My practical assessment

### Well documented
- The general idea of guided progression
- The difference between guided and free play
- The existence of projects and challenge/capstone levels
- The classroom intent of reset preserving code
- The project membership for the two late-campaign arcs, if the agent finds the Plan 08 docs

### Needs more doc help
- The exact progression model:
  - authored order
  - unlock status
  - current selection
  - workspace XML
  - tutorial-seen state
- The distinction between per-level persistence and project-shared persistence
- The reload behavior:
  - what comes back
  - what does not
- The runtime order of operations when changing guided levels
- The interaction between level picker, Blockly reload, and tutorial overlay
- The dev-unlock/testing override path

## What I’d add to the docs next

A short “guided progression model” note would help a lot. It should say:

- what persists across reload
- what is per level
- what is per project
- what reset preserves
- what the level picker is showing
- where to look in code for each layer

A really useful cross-reference would be added to the top-level docs pointing to:

- [docs/development/project-sequence-decisions.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-sequence-decisions.md)
- [docs/development/project-level-map.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-level-map.md)

That would save future agents from having to rediscover the project/shared-workspace model from code and tests.

## Evidence I used

- [docs/ARCHITECTURE.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/ARCHITECTURE.md)
- [docs/GameSpecification.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/GameSpecification.md)
- [docs/TeacherGuide.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TeacherGuide.md)
- [docs/TESTING.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TESTING.md)
- [docs/development/project-sequence-decisions.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-sequence-decisions.md)
- [docs/development/project-level-map.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/project-level-map.md)
- [src/core/levels.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/levels.js)
- [src/core/setup.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/setup.js)
- [src/config/levels/index.js](C:/Codex/BrowserBattlegorithms_CODEX/src/config/levels/index.js)
- [src/config/levels/manifest.js](C:/Codex/BrowserBattlegorithms_CODEX/src/config/levels/manifest.js)
- [src/ui/levels.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/levels.js)
- [src/ui/blocklyPanel.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/blocklyPanel.js)
- [src/ui/tutorialOverlay.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/tutorialOverlay.js)
- [src/main.js](C:/Codex/BrowserBattlegorithms_CODEX/src/main.js)
- [tests/browser/persistence.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/browser/persistence.spec.js)
- [tests/unit/scoring-and-level-state.test.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/unit/scoring-and-level-state.test.js)
