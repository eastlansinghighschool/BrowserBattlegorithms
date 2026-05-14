# UI Overlays and Cross-Surface Feedback Documentation Report

## Summary

This surface is smaller than the core engine or mode-system docs, but it is still an important seam. The app has several “in-between” pieces that turn core state into visible or audible feedback:

- the goal burst overlay that appears on scoring
- the tutorial overlay that manages onboarding, step-by-step guidance, and mode choice
- the score / game-state readout
- the sound layer for semantic feedback

The docs cover the existence of these pieces, but not the division of responsibility between core state and UI state. That means a future agent can usually find the code, but still miss where the real contract lives.

## What is strong

| Surface | Docs coverage | What is strong | Notes |
|---|---|---|---|
| Tutorial overlays as a concept | Strong | `docs/GameSpecification.md`, `docs/TeacherGuide.md`, and the development-phase docs all acknowledge onboarding, spotlight help, and tutorial-style guidance. | The broad learning intent is clear. |
| Score / turn status readout | Medium | The docs recognize score display and game-state feedback as part of the runtime UI. | This is enough for a reader to know that a score/state bar exists. |
| Sound as a real feature | Medium | The docs mention a persisted sound toggle and event sounds. | The existence of sound feedback is not hidden. |

## What needs more documentation support

| Surface | Docs coverage | What is missing | Why it matters |
|---|---|---|---|
| Core state vs UI state boundary | Low-medium | The docs do not clearly separate state that comes from the engine from state that only exists to drive overlays or presentation. | Future agents may try to “fix” a UI artifact in the wrong layer. |
| Goal burst overlay lifecycle | Low | The docs do not explain that the scoring burst is a transient DOM overlay that follows `goalBurstEffect` and auto-clears after a timer. | This is a subtle interaction bug source and is easy to overlook. |
| Tutorial dismissal flow | Medium | The docs mention tutorials, but not the dismissal/replay model or the fact that seen-state is persisted separately. | Agents need to know how onboarding state is stored and when it is re-shown. |
| Mode-picker overlay interaction | Low-medium | The docs do not clearly describe that the initial mode chooser is a full overlay state that blocks other UI until dismissed. | That overlay affects nearly every first-run browser test. |
| Sound as semantic events | Low-medium | The docs mention sound effects, but not that sounds are keyed to semantic game events rather than arbitrary UI clicks. | That distinction matters for maintainability and accessibility. |
| Scoreboard as mode-sensitive UI | Low | The docs mention score display, but not that the scoreboard shows different status text and mode text depending on guided versus free play. | This is a small but real cross-surface contract. |

## What is messy or incorrect

1. **The docs blur presentation feedback and game logic a bit too much.**
   - `goalBurstOverlay.js` is pure presentation, but it is driven by a core state field (`goalBurstEffect`).
   - `sound.js` is also presentation, but it is triggered by semantic events from the engine.
   - The docs mention the features, but not the direction of ownership.

2. **Tutorial overlay state is only partly described.**
   - There is persisted “seen” state in local storage.
   - There is live overlay state for the active tutorial step.
   - There is a separate mode chooser overlay state for first-run entry.
   - Those are all related, but they are not spelled out together in the docs.

3. **The scoreboard is more than a static label.**
   - It changes by mode.
   - It changes by level result.
   - It is suppressed when the mode chooser is up.
   - That is runtime policy, not just formatting.

## Code-level behavior worth documenting

### Goal burst overlay

`src/ui/goalBurstOverlay.js` is a score-event visual effect, not a general animation system.

What it does:
- watches `app.state.goalBurstEffect`
- positions a burst near the canvas based on the score cell
- colors itself from team glow colors
- clears itself on a timer by setting `goalBurstEffect` back to `null`
- rerenders on scroll/resize because it is positioned relative to the canvas container

The docs do not currently explain that lifecycle.

### Tutorial overlay

`src/ui/tutorialOverlay.js` is the most complex of the overlay pieces.

It handles:
- first-run mode choice
- per-level tutorial step progress
- spotlight positioning
- demo Blockly workspaces for tutorial examples
- persisted “seen” state in local storage
- replaying tutorial help on demand

The docs acknowledge tutorials, but they do not make this state machine easy to see.

### Game-state UI / play-reset button

`src/ui/gameStateUI.js` turns state into the current button label and visibility.

The text is mode-sensitive:
- Guided Levels show `Start Level`, `Reset Level`, and `Next Level`
- Free Play shows `Play`, `Reset`, or `Reset Game`

That is a tiny UI layer, but it is part of the mode contract and should probably be documented somewhere.

### Sound

`src/ui/sound.js` is a clean semantic sound layer:
- it persists enable/disable state
- it plays different tones for freeze, flag pickup, score, level pass, and level fail
- it intentionally does not embed logic into rendering code

The docs do mention sound, but not that it is event-driven by semantic game outcomes.

### Scoreboard

`src/ui/scoreboard.js` combines:
- turn count
- team score
- win threshold
- guided level status
- current level title
- free play mode and map metadata

That makes it a small but important cross-surface display. The docs do not currently explain that the scoreboard is mode-aware rather than just a passive score counter.

## Interactions with other surfaces

### Core engine

These UI pieces all depend on core state:
- scoring events
- level pass/fail
- tutorial-trigger state
- game-over state
- sound events

The docs tend to describe those features individually, but they do not say clearly that the UI is mostly a renderer for engine state, not a second source of truth.

### Guided levels

The tutorial overlay and the scoreboard are heavily guided-mode aware.

This matters because:
- tutorial replay is level-specific
- the mode chooser is a first-run only surface
- guided levels suppress some free-play style controls

### Free Play

Free Play reuses some of the same UI primitives, but with different copy and state:
- the play/reset button text changes
- the scoreboard shows mode and map info
- sound still uses the same semantic event system

That overlap is easy to miss without a doc note.

## What is well documented versus what needs help

### Well documented

- there are tutorial overlays
- there is score feedback
- there is a sound toggle
- there are visual effects for success states

### Needs more documentation help

- the ownership boundary between core state and UI presentation
- goal burst overlay lifetime and positioning
- tutorial seen-state versus active tutorial versus first-run chooser
- semantic sound events
- mode-sensitive scoreboard/button text

## Practical recommendation

This surface would benefit from a short internal note that says:

1. overlays are presentation, but they follow core state
2. tutorial state is separate from level state
3. goal burst is a transient DOM effect, not engine state
4. sounds are semantic feedback events, not arbitrary UI noise
5. the scoreboard and play/reset button are mode-aware UI surfaces

That would give future agents a cleaner map for where to look when a feedback bug appears.

## Evidence used

- [src/ui/goalBurstOverlay.js](../../../src/ui/goalBurstOverlay.js)
- [src/ui/tutorialOverlay.js](../../../src/ui/tutorialOverlay.js)
- [src/ui/gameStateUI.js](../../../src/ui/gameStateUI.js)
- [src/ui/sound.js](../../../src/ui/sound.js)
- [src/ui/scoreboard.js](../../../src/ui/scoreboard.js)
- [docs/GameSpecification.md](../../../docs/GameSpecification.md)
- [docs/TeacherGuide.md](../../../docs/TeacherGuide.md)
- [docs/StudentGuide.md](../../../docs/StudentGuide.md)
- [docs/TESTING.md](../../../docs/TESTING.md)
- [docs/DevelopmentLog.md](../../../docs/DevelopmentLog.md)
