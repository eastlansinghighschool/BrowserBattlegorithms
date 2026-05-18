# UI Mode Contract

## Scope

This note owns:
- The three mode state variables (`currentModeView`, `freePlayMode`, `activeBlocklyTeamTab`) and the rules that govern their transitions.
- Which controls, panel layouts, button labels, and scoreboard variants are active in each mode.
- Tutorial overlay gating, mode-chooser overlay, and tutorial seen-state persistence.
- Project badge, project-start callout, and persistent project indicator display logic.

This note does NOT own:
- Blockly workspace storage per mode — see [blockly-workspace.md](./blockly-workspace.md).
- The file import/export and private program pipelines — see [file-pipelines.md](./file-pipelines.md).
- Turn resolution order and scoring events — see [turn-engine.md](./turn-engine.md).
- Goal burst overlay lifetime (transient DOM effect driven by `state.goalBurstEffect`, not by mode state).

## Surface map

| File | Role |
|---|---|
| `src/config/gameModes.js` | Defines `GAME_VIEW_MODES` constants (`GUIDED_LEVELS`, `FREE_PLAY`) and free-play sub-mode constants. |
| `src/ui/controls.js` | Binds buttons to state; enforces which controls are hidden in Guided Levels vs shown in Free Play. |
| `src/ui/blocklyPanel.js` | Switches the Blockly panel between guided level summary, PvP team tabs, and PvCPU summary. |
| `src/ui/gameStateUI.js` | Produces mode-sensitive play/reset button labels, prediction run gating, and level-navigation button visibility. |
| `src/ui/levels.js` | Renders the guided lesson panel, including challenge/project badges and prediction prompts / feedback rows. |
| `src/ui/scoreboard.js` | Renders turn count, team scores, win threshold, level title, and mode metadata. Output varies by mode. |
| `src/ui/tutorialOverlay.js` | Manages first-run mode chooser, per-level tutorial step progress, spotlight positioning, and demo Blockly. |
| `src/ui/projectSignifiers.js` | Renders project badge, persistent project indicator, project-start callout, and L32 carrier note. |

## Mode variables

Three variables together describe the active UI context. They are independent; reading only one gives an incomplete picture.

| Variable | Values | Meaning |
|---|---|---|
| `currentModeView` | `GUIDED_LEVELS`, `FREE_PLAY` | Top-level view: the level-picker / lesson panel vs the free-play setup / sandbox. |
| `freePlayMode` | `PvP`, `PvCPU Easy`, `PvCPU Tactical` | Sub-mode within Free Play. Ignored when `currentModeView` is `GUIDED_LEVELS`. |
| `activeBlocklyTeamTab` | `1`, `2` | Which team's program is loaded in the Blockly editor during PvP. Ignored outside PvP. |

## Control visibility by mode

| Control / surface | Guided Levels | Free Play (PvCPU) | Free Play (PvP) |
|---|---|---|---|
| Level picker / lesson panel | Visible | Hidden | Hidden |
| Free-play setup panel | Hidden | Visible | Visible |
| XML import / export controls | Hidden | Visible | Visible |
| Private program file controls | Hidden | Visible | Visible |
| Blockly team tabs (Team 1 / Team 2) | Hidden | Hidden | Visible |
| Guided level navigation (Next Level) | Visible when level passed | Hidden | Hidden |
| Project badge + callout | Visible on project levels | Hidden | Hidden |

Guided Levels hide import/export; see [file-pipelines.md](./file-pipelines.md) for the rationale.

## Play/reset button labels

`src/ui/gameStateUI.js` sets button text based on mode and game state:

- **Guided Levels**: `Start Level` → `Reset Level` (after start) → `Next Level` (after pass).
- **Free Play (PvCPU / PvP)**: `Play` → `Reset` → `Reset Game` (after match ends).

The underlying DOM element is the same button; only its label and visibility change.

## Prediction run gating

Prediction levels use the same guided lesson shell but add one extra rule: the Start button is disabled with `aria-disabled="true"` until the student selects a prediction choice. `src/ui/levels.js` renders the inline prediction prompt, native radio buttons, and the visible "Pick a prediction to start" affordance. `src/ui/gameStateUI.js` mirrors that state onto the Start button so keyboard and screen-reader users get the same cue. Once a choice is selected, the button becomes enabled and the affordance disappears; after `level.result`, the prompt slot switches to a compact comparison row that stays visible until the level is reset or changed.

## Scoreboard mode behavior

`src/ui/scoreboard.js` combines turn count, team scores, win threshold, and the area-freeze status chip for all modes. Additional mode-sensitive fields:

- In Guided Levels: shows the current level title and guided level pass/fail status.
- In Free Play: shows the free-play mode label and map name.
- When Area Freeze is available in the current context, shows a compact snowflake chip with ready/cooldown text and an offscreen accessible Team / Area Freeze label instead of a live region. Free Play PvCPU shows the player team's chip; PvP shows both teams.
- Scoreboard rendering is suppressed while the mode-chooser overlay is active.

## Narration surface

`src/ui/narration.js` renders the board narration surface. The off-screen `aria-live="polite"` region is always present for running and game-over play so screen readers can hear the latest turn summary, while the visible "Show Turn Log" strip is an optional preference-backed echo for sighted students. Setup and mode-picker screens keep the strip hidden and leave the live region empty so no narration leaks into non-game UI.

## Voice narration surface (Plan 39)

`src/ui/voiceNarration.js` is an opt-in Web Speech API layer that speaks the same text produced by Plan 36 (narration) and Plan 38 (coaching). It is **off by default** and persisted in `localStorage` under `bba:voice-narration-enabled`. When voice is enabled, each `announceLastTurn` / `announceCoachingMoments` call feeds the formatted text through the voice wrapper immediately after updating the aria-live region's `textContent`. To prevent screen-reader users from hearing the same sentence twice, the wrapper temporarily sets the aria-live region's `aria-live` attribute to `"off"` before calling `speechSynthesis.speak()`, then restores it to `"polite"` on utterance end or error. SFX volume is reduced to 30% while speech is active and restored on completion. Speech is cancelled on level reset, level switch, mode switch, game-over, and `beforeunload`. Voice is also never spoken before the user's first qualifying gesture (click, keypress, or touch), in compliance with browser autoplay policy.

## Tutorial overlay and seen-state

`src/ui/tutorialOverlay.js` manages three distinct states:

1. **First-run mode chooser** — full-screen overlay blocking all other UI until the student picks Guided Levels or Free Play. Appears on first entry per browser profile; suppressed thereafter via persisted seen-state in `localStorage`.
2. **Per-level tutorial steps** — spotlight-style overlays for the active guided level. Steps advance on user action. May include demo Blockly workspaces.
3. **Tutorial replay** — students can re-trigger the per-level tutorial from the lesson panel. Replay does not reset seen-state.

Seen-state is persisted in `localStorage` separately from workspace XML and level progression. It controls whether a tutorial is shown automatically on next entry to a level.
The narration controls row in `#game-controls` is intentionally lifted above the tutorial scrim so `Show Turn Log`, `Coaching Mode`, and `Voice Narration` remain interactive during guided steps; the rest of the page still follows the tutorial spotlight contract.

## Project signals

On project levels (L23-L28 `strategy-brain`, L29-L37 `team-strategy-script`), additional UI appears:

- **Project badge** — rendered by `src/ui/projectSignifiers.js` on the level card. Identifies which project arc this level belongs to.
- **Project-start callout** — a one-time bubble near the Blockly panel explaining that code carries forward across levels. Persisted dismissal key: `bba:project-start-callout-seen:<projectId>`.
- **Persistent project indicator** — remains visible throughout the project arc as a reminder that the workspace is shared.

These signals are driven by project metadata and local storage. They are not Blockly state.

## Common traps

- **Reading only `currentModeView`** will miss PvP vs PvCPU distinctions. Always check `freePlayMode` when the behavior differs between free-play sub-modes.
- **Assuming import/export controls exist in Guided Levels.** They are hidden. Code that calls export helpers should guard on mode.
- **Confusing the mode-chooser overlay with tutorial-step overlays.** The chooser is first-run only and blocks all UI; tutorial steps are level-specific and skippable.
- **`goalBurstEffect` is not mode state.** The score-burst visual is driven by a transient core state field, not by `currentModeView`. Do not add mode-guarding around burst logic.
- **Tutorial seen-state is separate from level progress.** Clearing `bba:guided-level-progress` does not reset which tutorials the student has seen.

## Related

- [blockly-workspace.md](./blockly-workspace.md) — workspace storage per mode and panel lifecycle
- [file-pipelines.md](./file-pipelines.md) — which file operations are exposed in which mode
- [turn-engine.md](./turn-engine.md) — what the play/reset button actually triggers at runtime
- [usage-and-admin.md](./usage-and-admin.md) — how usage events relate to guided-vs-free-play context
