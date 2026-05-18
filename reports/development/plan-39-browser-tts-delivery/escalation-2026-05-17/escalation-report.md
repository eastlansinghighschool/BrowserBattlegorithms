# Plan 36-39 Voice / Narration Escalation Report

Date: 2026-05-17

This report collects the current evidence for the narration / coaching / voice UI issue that showed up while testing the Plan 36-39 voice work on guided Level 5 (`mirror-forward` / `Level 5: Forward Works Both Ways`).

## What I tried

1. Opened the guided level directly with `?devGuidedLevel=mirror-forward`.
2. Verified the guided tutorial was active on first load.
3. Checked whether the left-panel narration controls were actually topmost hit targets while the tutorial was present.
4. Dismissed the tutorial with the `Got It` button and re-checked the controls.
5. Probed the checkbox controls and voice picker in the live browser.
6. Checked whether the browser exposed Web Speech / `speechSynthesis` in this session.
7. Inspected the relevant source paths to identify likely ordering and state bugs.

## What I expected

- `Show Turn Log` and `Coaching Mode` should be clickable once the guided UI is ready.
- The voice toggle should show the voice controls when enabled.
- The voice picker should at least contain `Default` and, on a browser with Web Speech support, any available voices.
- If a tutorial overlay is intentionally blocking controls, that blocking should only happen while the overlay is visible and should clear after dismissal.

## What I observed

### 1) Tutorial overlay blocks the left-panel narration controls while active

On first load of the guided level, the tutorial overlay was active and the hit test over the narration controls landed on the overlay scrim instead of the checkbox input.

Evidence from live DOM inspection:
- `elementFromPoint` at the `Show Turn Log` and `Coaching Mode` coordinates hit `DIV.tutorial-scrim`.
- The tutorial overlay had class `tutorial-overlay-active`.
- The screenshot artifact `tutorial-overlay-active.png` shows the overlay sitting on top of the page.

This explains why the controls felt unclickable when the tutorial was still present.

### 2) After dismissing the tutorial, the overlay was gone, but the checkbox behavior still looked suspect

After clicking `Got It`, the overlay disappeared and the page returned to the normal guided layout.

However:
- The narration checkboxes were still not easy to verify as working through the automation path.
- I was able to confirm the inputs were present, enabled, and topmost after dismissal.
- I did not fully prove the browser was toggling them correctly in the user-facing flow during this pass.

So there may be a second issue here beyond the overlay, but I have not tied it down yet.

### 3) Voice narration / voice picker is empty in this browser session because Web Speech is absent

In this browser session, `window.speechSynthesis` is unavailable, so the voice code cannot load any voices.

Observed state:
- `speechSynthesis` is `undefined` in the live browser session.
- `voice-narration.js` exits early when speech synthesis is missing.
- The voice picker cannot populate in this environment, so the dropdown remains empty / hidden.

That is a concrete environment limitation, not necessarily a repo bug.

### 4) There is also a likely startup-order race in the voice picker population path

Even when Web Speech exists, the current startup order can miss the first voice-population call:
- `initVoiceNarration(app)` runs before `bindControls(app)` in [src/main.js](C:/AI/BrowserBattlegorithms/src/main.js:211-218).
- `loadVoices()` calls `app.hooks.populateVoicePicker?.()` in [src/ui/voiceNarration.js](C:/AI/BrowserBattlegorithms/src/ui/voiceNarration.js:151-160).
- The `populateVoicePicker` hook is assigned later in [src/ui/controls.js](C:/AI/BrowserBattlegorithms/src/ui/controls.js:589-620).

If the browser delivers voices before `bindControls` has attached the hook, the first population pass can be lost. If `voiceschanged` does not fire again, the dropdown can stay empty.

## What I am sure is a problem

- The tutorial overlay definitely blocks the narration controls while it is active.
- The voice picker definitely cannot populate in this browser session because Web Speech is missing.
- The startup order creates a real race risk for voice population in browsers that do support Web Speech.

## What I suspect but have not fully proven

- There may be a separate checkbox interaction bug after the tutorial is dismissed.
- In a browser with Web Speech enabled, the voice picker may still remain empty because of the startup race, even though this session could not reproduce that exact case.
- The visible voice controls in your local Chrome may be showing a different combination of state than this session because the local browser has speech voices while the Codex in-app browser does not.

## Relevant source locations

- Tutorial overlay startup and rendering:
  - [src/main.js](C:/AI/BrowserBattlegorithms/src/main.js:118-130, 208-218)
  - [src/ui/tutorialOverlay.js](C:/AI/BrowserBattlegorithms/src/ui/tutorialOverlay.js:266-316)
- Narration and coaching control wiring:
  - [src/ui/controls.js](C:/AI/BrowserBattlegorithms/src/ui/controls.js:573-620)
- Voice narration bootstrap / voice loading:
  - [src/ui/voiceNarration.js](C:/AI/BrowserBattlegorithms/src/ui/voiceNarration.js:135-160)

## Screenshot artifacts

- [tutorial-overlay-active.png](C:/AI/BrowserBattlegorithms/reports/development/plan-39-browser-tts-delivery/escalation-2026-05-17/tutorial-overlay-active.png)
- [tutorial-dismissed-controls.png](C:/AI/BrowserBattlegorithms/reports/development/plan-39-browser-tts-delivery/escalation-2026-05-17/tutorial-dismissed-controls.png)

## Recommendation for orchestration review

1. Decide whether the guided tutorial is intended to block narration controls on first load. If not, the tutorial overlay needs to be narrowed or moved.
2. Fix the voice-picker bootstrap ordering so `populateVoicePicker` is registered before the first voice load, or rerun population after controls bind.
3. Re-test checkbox interaction after tutorial dismissal in a real Chrome session with Web Speech available, because the in-app browser lacks `speechSynthesis` and cannot answer that part cleanly.
