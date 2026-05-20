# Implementation Plan - Plan 57: Settings Gear Panel

Consolidate all UI-level preferences and accessibility overrides into a single modal accessed via a settings gear icon button in the header. Relocate existing inline toggles and add new toggles for low-motion override, runner animations (movement and jumping), and frozen-badge/runner-index-badge visibility. All preferences will be persisted globally under a shared `bba:settings:` prefix.

## User Review Required

> [!IMPORTANT]
> - **Sound key migration**: Existing `bba:sound-enabled` value is migrated to the new `bba:settings:sound-enabled` key. Legacy keys are left in place but not updated after first migration.
> - **Snapping animation logic**: When movement animations are off, runners snap to target grid cells in 0 frames. When jumping animations are off, jumps snap in 0 frames (no arc, takeoff lines, dust, or shadow). Snapping is handled directly inside the frame-updating loop (`updateAnimation`) for correctness and turn-engine timing safety.
> - **Reduced-motion composition**: Low-motion override or system prefers-reduced-motion configures visual effects to use their reduced-motion alternatives but does not disable animations unless their respective toggles are explicitly turned off.

## Open Questions

None. The specifications and requirements are fully detailed.

## Proposed Changes

---

### UI Components

#### [NEW] [preferences.js](file:///c:/AI/BrowserBattlegorithms/src/ui/preferences.js)
- Implement `loadPreference(key, defaultValue, parser)` and `savePreference(key, value)` wrapper functions.
- Centralize all keys under `bba:settings:` namespace.
- Export key constants:
  - `SOUND_ENABLED`: `bba:settings:sound-enabled`
  - `TURN_LOG_VISIBLE`: `bba:settings:narration-visible-strip`
  - `COACHING_MODE_ENABLED`: `bba:settings:coaching-mode-enabled`
  - `VOICE_NARRATION_ENABLED`: `bba:settings:voice-narration-enabled`
  - `VOICE_NARRATION_RATE`: `bba:settings:voice-narration-rate`
  - `VOICE_NARRATION_VOICE`: `bba:settings:voice-narration-voice`
  - `LOW_MOTION_OVERRIDE`: `bba:settings:low-motion-override`
  - `RUNNER_MOVEMENT_ANIMATIONS`: `bba:settings:runner-movement-animations`
  - `RUNNER_JUMPING_ANIMATIONS`: `bba:settings:runner-jumping-animations`
  - `SHOW_FROZEN_BADGES`: `bba:settings:show-frozen-badges`
  - `SHOW_RUNNER_INDEX_BADGES`: `bba:settings:show-runner-index-badges`
- Add legacy migration support for sound, coaching, and narration strip keys.

#### [MODIFY] [controls.js](file:///c:/AI/BrowserBattlegorithms/src/ui/controls.js)
- Set up event handlers for opening/closing the `#settingsModal` dialog via `#settingsButton`, card backdrop, and Close button.
- Bind all checkboxes inside `#settingsModal` to update both `app.state` and `localStorage` on change.
- Implement the keyboard focus trap inside `#settingsModal` and Escape key listener routing to close the modal.
- Restore focus to `#settingsButton` upon modal close.
- Remove old inline `#soundToggleButton` click/sync logic.
- Relocate and bind the voice speed slider and voice picker inside the modal.

#### [MODIFY] [sound.js](file:///c:/AI/BrowserBattlegorithms/src/ui/sound.js)
- Import `preferences.js` helpers and migrate the sound configuration keys.
- Update `initializeSoundState` and `setSoundEnabled` to use the helper.

#### [MODIFY] [narration.js](file:///c:/AI/BrowserBattlegorithms/src/ui/narration.js)
- Update `initializeNarrationState` and `setNarrationVisibleStrip` to use the helper.

#### [MODIFY] [coachingNarration.js](file:///c:/AI/BrowserBattlegorithms/src/ui/coachingNarration.js)
- Update `initializeCoachingState` and `setCoachingModeEnabled` to use the helper.

#### [MODIFY] [voiceNarration.js](file:///c:/AI/BrowserBattlegorithms/src/ui/voiceNarration.js)
- Update `initVoiceNarration` and set-methods to use the helper.

---

### Core State & Engine

#### [MODIFY] [state.js](file:///c:/AI/BrowserBattlegorithms/src/core/state.js)
- Import `preferences.js` helpers.
- In `createInitialState`, initialize all ten settings properties with `loadPreference` using correct defaults:
  - `soundEnabled`: true
  - `narrationVisibleStrip`: false
  - `coachingModeEnabled`: false
  - `lowMotionOverride`: false
  - `runnerMovementAnimations`: true
  - `runnerJumpingAnimations`: true
  - `showFrozenBadges`: true
  - `showRunnerIndexBadges`: false

#### [MODIFY] [turnEngine.js](file:///c:/AI/BrowserBattlegorithms/src/core/turnEngine.js)
- Pass `state` as the third parameter when executing `runner.updateAnimation(state.animationSpeedFactor, p, state)`.

---

### Rendering & Entities

#### [MODIFY] [effects.js](file:///c:/AI/BrowserBattlegorithms/src/render/effects.js)
- Modify `prefersReducedMotion(state)` to accept `state` and check `state?.lowMotionOverride || OS prefers-reduced-motion`. Keep it safe to call with no parameters.
- Pass `state` to `prefersReducedMotion` across all visual effect sites:
  - `drawAreaFreezePulse(p, app)`
  - `drawAreaFreezeRunnerFlash(p, runner, effect, state = null)`
  - `drawJumpDropShadow(p, runner, jumpProgress, state = null)`
  - `drawJumpTakeoffLines(p, runner, jumpProgress, state = null)`
  - `drawJumpLandingDust(p, cellX, cellY, ringProgress, state = null)`
- Update `drawFrozenCountdownBadge(p, runner, state = null)` to be a no-op if `state?.showFrozenBadges === false`.

#### [MODIFY] [Runner.js](file:///c:/AI/BrowserBattlegorithms/src/entities/Runner.js)
- Update `display(p, state)` to pass `state` to all visual sub-effects (`drawJumpDropShadow`, `drawJumpTakeoffLines`, `drawAreaFreezeRunnerFlash`, `drawFrozenCountdownBadge`).
- Update `updateAnimation(animationSpeedFactor, p, state = null)`:
  - If `state?.runnerJumpingAnimations === false` and `this.isJumping` is true, immediately snap progress to `1`.
  - If `state?.runnerMovementAnimations === false` and `this.isMoving` is true, immediately snap progress to `1`.
  - If `state?.runnerMovementAnimations === false` and `this.isBouncing` is true, immediately snap progress to `1`.
  - Pass `state` to `prefersReducedMotion(state)` in the jumping logic.

#### [MODIFY] [p5App.js](file:///c:/AI/BrowserBattlegorithms/src/render/p5App.js)
- Plumb `app.state` to `drawJumpLandingDust(p, dust.cellX, dust.cellY, ringProgress, app.state)`.

---

### Views & Styles

#### [MODIFY] [index.html](file:///c:/AI/BrowserBattlegorithms/index.html)
- Add the Settings gear button to the headeractions container.
- Add the `#settingsModal` markup.
- Delete inline preferences toggles and the sound button from `#game-controls` and the blockly toolbar.

#### [MODIFY] [style.css](file:///c:/AI/BrowserBattlegorithms/src/assets/styles/style.css)
- Add style definitions for `#settingsButton` (gear button), `.settings-modal-scrollable`, and `.settings-separator`. Reuse existing `.program-modal` classes.

#### [MODIFY] [ui-mode-contract.md](file:///c:/AI/BrowserBattlegorithms/docs/subsystems/ui-mode-contract.md)
- Update documentation to reflect settings consolidation and low-motion/badge controls.

---

## Verification Plan

### Automated Tests
- **Unit Tests (`tests/unit/preferences.test.js`)**:
  - Test preferences helper with mocked `localStorage` (empty, normal string, boolean parser, custom parser).
  - Test legacy key migration on initialization.
  - Test malformed key fallback recovery.
  - Command: `node --test tests/unit/preferences.test.js`
- **Unit Tests (`tests/unit/runner-snapping.test.js`)**:
  - Test runner animation snapping behavior under `runnerMovementAnimations` and `runnerJumpingAnimations` set to `false`.
  - Command: `node --test tests/unit/runner-snapping.test.js`
- **Browser Smoke Spec (`tests/browser/settings-gear.spec.js`)**:
  - Verify settings button is in header.
  - Verify settings modal opens on click, closes on Close/backdrop/ESC, traps focus, and restores focus to gear button on close.
  - Verify toggles persist state across page reloads.
  - Command: `npx.cmd playwright test tests/browser/settings-gear.spec.js --config=playwright.smoke.config.js`
- **Full Test Suite Run**:
  - Run all tests to verify no regressions: `npm.cmd test` and `npm.cmd run test:browser:smoke`

### Manual Verification
- Deploy locally and verify visual transitions when toggling settings in real time.
- Verify focus styling and keyboard navigation loops correctly in the settings dialog.
