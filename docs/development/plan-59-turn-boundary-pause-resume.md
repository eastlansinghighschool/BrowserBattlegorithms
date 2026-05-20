# Plan 59: Turn-Boundary Pause / Resume

## Packet Metadata

- Packet id: plan-59
- Packet title: Turn-Boundary Pause / Resume
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-19
- Packet type: implementation / UI / accessibility / turn-engine / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing the one-action-per-turn execution model, before adding a new `MAIN_GAME_STATES` value, before pausing mid-animation or mid-action, before introducing a dependency or broad state-machine refactor
- Expected artifacts:
  - icon-only pause/resume button placed immediately to the right of `#playResetButton`
  - guarded `P` keyboard shortcut for pause/resume
  - pending-pause state that waits for a clean runner boundary
  - unit tests for pause boundary behavior and Plan 55 / Plan 28 safety-net non-regression
  - Playwright coverage in Guided Levels and Free Play
  - subsystem note updates in `docs/subsystems/turn-engine.md` and `docs/subsystems/ui-mode-contract.md`
  - progress report
- Progress report folder: `reports/development/plan-59-turn-boundary-pause-resume/`
- Progress report file: `reports/development/plan-59-turn-boundary-pause-resume/progress.md`

## Packet Summary

Goal: Add a classroom-friendly pause/resume control for live matches. The control should pause at a clean turn boundary instead of freezing a runner halfway through an action. It appears beside the existing Start/Reset or Play/Reset button in both Guided Levels and Free Play, uses standard pause/play icon language visually, and supports `P` as a guarded shortcut.

Why this packet exists:

Teachers and students need a calm way to stop live gameplay for explanation, prediction, classroom management, or debugging without using Reset Level as a blunt recovery tool. Recent repair packets, especially Plan 55, closed engine dead-end states. This packet complements that work by giving users an intentional pacing control without changing scoring, level-result invariants, or recovery behavior.

Non-goals:

- Do not refactor the entire p5 or turn-engine state machine.
- Do not add `PAUSED` to `MAIN_GAME_STATES` or `TURN_STATES`.
- Do not pause in the middle of a runner action, jump, bounce, collision, Area Freeze, scoring, or Blockly trace playback.
- Do not make pause a code-editing mode. Preserve existing Blockly editability rules.
- Do not change game rules, scoring, collision behavior, level win/fail conditions, NPC logic, or Blockly semantics.
- Do not add new dependencies or server-side requirements.
- Do not deploy.

Depends on:

- Plan 55 is complete. Its `GAME_OVER` / `activeLevelResult` invariant is keeper behavior and must not be weakened.
- Existing Plan 28 `PROCESSING_ACTION` recovery in `src/core/turnEngine.js` remains keeper behavior and must not be removed or bypassed.
- Existing p5 draw loop in `src/render/p5App.js`, which already separates drawing from `processTurnActions(app, p)`.

Blocks:

- None directly.

## Recorded Decisions

Resolved by integration owner before dispatch:

1. **Pause takes effect only at clean runner boundaries.**
   - If the active state is waiting for human input (`AWAITING_INPUT` on a human-controlled runner), pause takes effect immediately.
   - If the active runner is tracing, processing, moving, jumping, bouncing, colliding, freezing, scoring, or resolving consequences, the pause request becomes pending and takes effect after that runner's turn fully completes.
   - The pause boundary is before the next runner begins choosing or resolving an action.

2. **Use two booleans, not a new state enum.**
   - Recommended fields:
     - `state.gameplayPaused: false`
     - `state.pauseRequested: false`
   - `gameplayPaused` means turn logic is currently halted.
   - `pauseRequested` means the user asked for pause during an active runner's in-progress turn and the engine should pause at the next clean boundary.

3. **Visual UI is icon-only.**
   - Use standard pause/play icon language beside the existing primary play/reset button.
   - Do not add a text button label to the visible control.
   - Use a familiar inline SVG or existing icon-button pattern; do not add an icon dependency.

4. **Accessible labels and tooltips.**
   - Normal running: accessible label `Pause game`; tooltip/title `Pause game (P)`.
   - Pending pause: accessible label `Pausing after this runner`; tooltip/title `Pausing after this runner (P)`.
   - Paused: accessible label `Resume game`; tooltip/title `Resume game (P)`.
   - Pending-pause button should be disabled to signal that the request has been accepted and will apply shortly.

5. **Keyboard shortcut.**
   - `P` toggles pause/resume during a live match.
   - If pressed during an active runner turn, it enters the same pending-pause state as clicking the button.
   - Ignore `P` while focus is inside Blockly, form fields, modals, tutorial overlays, or any other text/control surface where `P` might be user input.
   - Do not use Space as the shortcut.

6. **No mid-animation bookkeeping.**
   - Because pause waits for a clean boundary, the implementation does not need to preserve an exact animation frame or shift transient effect timestamps.
   - Existing movement, jump, bounce, trace, Area Freeze, dust, score, and narration consequences finish before pause takes effect.

## Authority And Contracts

Authoritative sources:

- `docs/GameSpecification.md` — foundational game rules.
- `docs/subsystems/turn-engine.md` — runner turn order, action resolution, recovery safety nets.
- `docs/subsystems/ui-mode-contract.md` — mode-specific controls and button labels.
- `docs/subsystems/p5-surface-map.md` — canvas vs DOM ownership.
- `src/core/turnEngine.js` — turn progression and clean boundary implementation.
- `src/render/p5App.js` — draw loop gate that calls `processTurnActions`.
- `src/ui/controls.js` and `src/ui/gameStateUI.js` — button binding, shortcut routing, and control state.
- `index.html` — button mount point.
- Existing tests:
  - `tests/unit/turn-engine-resilience.test.js`
  - `tests/unit/blockly-trace-playback.test.js`
  - `tests/browser/guided-play.spec.js`
  - `tests/browser/free-play.spec.js`
  - `tests/browser/key-capture-passthrough.spec.js`

Contracts this packet must preserve:

- Student programs still run from `On Each Turn`.
- Only the first reached action executes for a runner turn.
- Human and Blockly/NPC actions still go through the same turn pipeline.
- Plan 28's orphaned `PROCESSING_ACTION` recovery remains intact.
- Plan 55's `GAME_OVER` / level-result invariant remains intact.
- Reset Level / Reset Game remain recovery affordances and keep their current workspace semantics.
- The app remains a static Vite deployment.

## Required Reading

- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/development/archive/plan-55-level-result-invariant-at-game-over.md`
- `reports/development/plan-55-level-result-invariant-at-game-over/progress.md`
- `src/config/constants.js`
- `src/core/state.js`
- `src/core/turnEngine.js`
- `src/core/levels.js`
- `src/render/p5App.js`
- `src/ui/controls.js`
- `src/ui/gameStateUI.js`
- `index.html`
- Relevant tests listed above

Optional / contextual:

- `tests/browser/helpers.js`
- `tests/unit/helpers/testHarness.js`
- `docs/TESTING.md`

## Scope

In scope:

- Add `gameplayPaused` and `pauseRequested` to initial state.
- Add small, named helpers for pause/resume decisions. Acceptable locations include `src/core/turnEngine.js` or a tiny new `src/core/gameplayPause.js` if that makes tests cleaner.
- Add a DOM button next to `#playResetButton`.
- Keep the button icon-only visually, with tooltip/accessibility labels.
- Add guarded `P` shortcut routing.
- Add focused unit and browser tests.
- Update subsystem notes touched by the behavior.
- Write the required progress report.

Out of scope:

- Broad p5 state-machine rewrite.
- New state enum values.
- Pausing mid-animation or mid-trace.
- New settings/preferences persistence.
- New teacher/student guide prose unless a contradiction is discovered.
- Any deployment, package install, or GitHub workflow change.

Files and areas likely touched:

- `index.html`
- `src/core/state.js`
- `src/core/turnEngine.js`
- `src/render/p5App.js`
- `src/ui/controls.js`
- `src/ui/gameStateUI.js`
- `src/assets/styles/components/layout.css` or the existing relevant button CSS file
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `tests/unit/turn-engine-resilience.test.js`
- `tests/browser/guided-play.spec.js` or a new small browser spec
- `tests/browser/free-play.spec.js` or the same new small browser spec
- `tests/browser/key-capture-passthrough.spec.js` if shortcut guard coverage naturally belongs there

## Work Plan

1. Inspect the current play/reset flow, p5 draw loop, and turn-engine boundary points.
2. Add the pause state fields and helper functions.
3. Add the pause/resume button and sync its hidden/disabled/icon/accessibility state.
4. Wire click and guarded `P` shortcut behavior.
5. Gate `processTurnActions` so actual pause halts progression, and apply pending pause only at clean boundaries.
6. Add focused unit tests for immediate pause, pending pause, resume, and safety-net non-regression.
7. Add browser coverage for Guided Levels and Free Play.
8. Update subsystem docs.
9. Run validation and write the progress report.

## Implementation Requirements

### Requirement 1: State Model

Required behavior:

- New matches and reset matches start with `gameplayPaused === false` and `pauseRequested === false`.
- Leaving a mode, starting/resetting a level, entering/configuring Free Play, level result, and game over clear both flags unless the current behavior plainly should preserve them. Default to clearing.
- Resuming clears both flags.

Constraints:

- Do not represent pause by mutating `mainGameState` away from `RUNNING`.
- Do not represent pause by mutating `currentTurnState` to a new value.
- Do not clear queued actions, trace data, runner animation state, or event logs when pause is requested.

Expected artifact:

- Initial state and reset/start paths include the fields.
- Tests prove reset/start/game-over do not leave stale pause flags.

### Requirement 2: Clean Boundary Semantics

Required behavior:

- Clicking pause or pressing `P` while the active runner is a human in `AWAITING_INPUT` pauses immediately.
- Clicking pause or pressing `P` while the active runner is not in an immediate-pause boundary sets `pauseRequested = true` and leaves the current turn resolving.
- Pending pause takes effect after the current runner's turn completes and before the next runner begins action selection, frozen-runner auto-skip, Blockly trace playback, or NPC/CPU planning.
- When `gameplayPaused` is true, `processTurnActions` must return without advancing runner turns, trace frames, queued actions, animations, scores, cooldowns, or frozen counters.

Implementation guidance:

- A helper like `shouldPauseImmediately(state)` may inspect the active runner and `currentTurnState`.
- A helper like `applyPendingPauseAtBoundary(app)` can be called after `advanceToNextRunner(app)` and near the top of `processTurnActions` before new runner work begins.
- If the active runner is human-controlled and already in `AWAITING_INPUT`, pause can apply at the top of the loop.
- If the active runner is AI/Blockly/NPC and `AWAITING_INPUT`, this is also a clean boundary before that runner has planned; pending pause may apply there before planning.

Edge cases:

- A frozen runner auto-skip is still a runner turn. If pause is requested before the frozen runner begins, pause should apply before decrementing frozen turns.
- A Blockly trace in progress should finish before pause takes effect.
- A jump, bounce, failed jump reversal, or collision consequence should finish before pause takes effect.
- If scoring or level result happens while a pause is pending, game-over / level-result behavior wins and the pause flags should be cleared or ignored.

### Requirement 3: Pause Button UI

Required behavior:

- Add a new pause/resume button immediately to the right of `#playResetButton`.
- Button is hidden when:
  - the mode chooser is active
  - no match is running
  - guided level result / game over has ended active play
  - tutorial overlay is active
- Button is visible during running Guided Levels and running Free Play.
- Button displays:
  - pause icon while running and not paused
  - play icon while paused
  - pause icon or neutral disabled pending icon while `pauseRequested` is true; choose the clearer small implementation and document it
- Button has no visible text label.
- Button uses accessible labels and title tooltips from Recorded Decision 4.

Constraints:

- Do not visually crowd the primary Start/Reset button. Use the existing control row and a compact icon button.
- Do not use emoji as the icon.
- Do not add a dependency.
- Do not move narration/settings controls.

Expected artifact:

- DOM and CSS changes that keep the existing action row usable on narrow screens.

### Requirement 4: Keyboard Shortcut

Required behavior:

- `P` toggles pause/resume while a match is running.
- During an active runner turn, `P` requests pending pause.
- While paused, `P` resumes.
- The shortcut must not fire when:
  - focus is in Blockly, Blockly widgets, or Blockly dropdowns
  - focus is in an input, textarea, select, contenteditable, button, link, or slider
  - any modal/dialog is open
  - tutorial overlay or mode chooser overlay is active
  - the game is not in a live running match

Constraints:

- Preserve Plan 30 key-capture behavior. Do not call `preventDefault()` for ignored shortcuts.
- Existing gameplay controls must keep working.
- Do not add Space as a shortcut.

Expected artifact:

- Tests show `P` pauses/resumes in a live match and does not trigger while focus is in a protected surface.

### Requirement 5: Blockly Editability And Program State

Required behavior:

- Pause does not make Blockly editable if it is currently locked for running play.
- Pause does not save, reload, or mutate workspace XML.
- Pause does not switch PvP Blockly tabs or alter active program context.

Rationale:

Pause is a classroom pacing control, not a code-edit mode. Reset remains the existing way to return to editing.

### Requirement 6: Docs

Required behavior:

- Update `docs/subsystems/turn-engine.md` with:
  - pause/pending-pause fields
  - clean boundary rule
  - relationship to Plan 28 and Plan 55 safety nets
  - statement that pause does not change action resolution or one-action-per-turn semantics
- Update `docs/subsystems/ui-mode-contract.md` with:
  - button visibility
  - icon-only visual behavior
  - accessible labels / tooltip text
  - `P` shortcut and guardrails
- Update `docs/subsystems/p5-surface-map.md` only if the implementation adds a new canvas overlay or changes DOM/canvas ownership. A simple DOM button does not require it unless existing text would become stale.

Constraints:

- Do not add broad TeacherGuide / StudentGuide copy unless the current docs become misleading.

## Testing Requirements

Unit tests:

- Immediate pause at human `AWAITING_INPUT`:
  - `gameplayPaused` becomes true.
  - repeated `processTurnActions` calls do not advance turn number or runner index.
  - resume allows input/progression again.
- Pending pause during `ANIMATING`:
  - request sets `pauseRequested` but does not interrupt animation.
  - animation completes and runner lands/returns as expected.
  - pause applies before the next runner acts.
- Pending pause before an AI/NPC runner acts:
  - pause applies at the clean boundary before that runner chooses an action.
- Reset/start/game-over clear pause flags.
- Plan 28 and Plan 55 regression tests still pass; add a focused assertion if the implementation touches their surfaces.

Browser tests:

- Guided mode:
  - start a level
  - pause button appears next to Start/Reset button
  - click pause during a clean waiting state, button switches to resume, board/turn does not advance
  - click resume, play continues
- Free Play:
  - start a match
  - pause button appears next to Play/Reset button
  - `P` pauses/resumes
- Pending state:
  - request pause during a visible moving/jumping/bounce action or a trace playback
  - button shows disabled pending state
  - action finishes before pause applies
- Guardrail:
  - `P` does not pause while focus is inside Blockly or a form/control surface.

Testing placement:

- If the new browser tests are short and stable, include them in the smoke tier. If they are timing-sensitive, keep them extended-only and explain why in the progress report and `docs/TESTING.md`.

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/turn-engine-resilience.test.js tests/unit/blockly-trace-playback.test.js
npx playwright test tests/browser/guided-play.spec.js tests/browser/free-play.spec.js tests/browser/key-capture-passthrough.spec.js --reporter=line
npm test
npm run build
npm run test:browser:smoke
```

If the implementation adds a new browser spec and includes it in smoke, also run:

```powershell
npx playwright test tests/browser/<new-spec-name>.spec.js --reporter=line
```

Run `npm run test:browser` if any timing-sensitive behavior is added outside the smoke tier or if the smoke tier configuration changes.

## Validation Checklist

- [ ] Pause/resume button exists beside `#playResetButton`.
- [ ] Button is icon-only visually and has accessible label + title tooltip.
- [ ] Tooltip includes `(P)`.
- [ ] `P` shortcut pauses/resumes only in live gameplay and is ignored in protected focus/modal/tutorial surfaces.
- [ ] Pause at human `AWAITING_INPUT` is immediate.
- [ ] Pause requested mid-action becomes pending and applies only after the runner completes.
- [ ] Paused gameplay does not advance runner index, turn number, trace frames, frozen counters, animations, scoring, or cooldowns.
- [ ] Resume continues from the preserved turn boundary.
- [ ] Reset/start/mode switch/game-over clear pause flags.
- [ ] Blockly editability and workspace XML behavior are unchanged.
- [ ] Plan 28 `PROCESSING_ACTION` recovery still works.
- [ ] Plan 55 `GAME_OVER` / level-result invariant still works.
- [ ] Guided and Free Play browser workflows pass.
- [ ] Subsystem docs still read true after implementation.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Relevant browser tests pass.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- Implementing pause requires a new main game state or turn state.
- The only available approach pauses mid-animation or requires frame-perfect animation resume.
- Pause interacts with Plan 28 or Plan 55 safety nets in a way that changes their behavior.
- The `P` shortcut cannot be guarded without weakening Plan 30 key-capture protections.
- Button placement causes a broader control-layout redesign.
- The implementation needs a new dependency.
- Tests reveal a pre-existing stuck state outside this packet's scope.
- Any subsystem note would become false and the corrected wording requires a product/architecture decision not already recorded here.

## Progress Report Requirements

Write `reports/development/plan-59-turn-boundary-pause-resume/progress.md` with:

- summary of implemented behavior
- files changed
- exact clean-boundary logic used
- keyboard shortcut guardrails
- whether browser coverage was added to smoke or extended only, with rationale
- commands run and results
- confirmation that Plan 28 and Plan 55 behaviors were not changed
- remaining risks or follow-ups
- ready-for-integration yes/no
