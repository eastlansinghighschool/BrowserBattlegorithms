# Plan 39 Progress Report — Browser TTS Delivery

**Date:** 2026-05-17  
**Status:** complete — pending manual smoke (see below)  
**Tests:** 22/22 voice-narration unit, 238/238 full suite  
**Build:** clean (no new errors)

---

## Artifacts delivered

| Artifact | Notes |
|---|---|
| `src/ui/voiceNarration.js` | New wrapper module — init, speak, cancelSpeech, state management |
| `src/ui/sound.js` | Added `setNarrationDucking` + `duckGain` module var applied in `tone()` |
| `src/ui/narration.js` | `speak("board-narration")` call in `announceLastTurn` after textContent update |
| `src/ui/coachingNarration.js` | `speak("board-coaching")` call in `announceCoachingMoments` when text non-empty |
| `src/core/setup.js` | `app.hooks.cancelSpeech?.()` at top of `initializeDisplayState` |
| `index.html` | Voice Narration toggle + hidden `#voice-controls` panel (rate slider + voice picker) |
| `src/ui/controls.js` | Voice toggle, rate slider, voice picker bindings; `populateVoicePicker` hook |
| `src/main.js` | `initVoiceNarration(app)` + `app.hooks.cancelSpeech = cancelSpeech` |
| `src/assets/styles/components/layout.css` | `.voice-controls` / `.voice-controls-label` CSS |
| `docs/subsystems/ui-mode-contract.md` | Voice narration surface paragraph |
| `tests/unit/voice-narration.test.js` | 22 unit tests |
| `package.json` | `voice-narration.test.js` added to `test:unit` allowlist |

---

## Web Speech API gotcha mitigations

| Gotcha | Mitigation applied |
|---|---|
| User-gesture first-speak | `hasGestured` flag; `speak` is no-op until set; `initVoiceNarration` installs capture-phase listeners for click/keydown/touchstart that set the flag and remove themselves |
| Async voice loading | `voiceschanged` listener populates `availableVoices` and calls `app.hooks.populateVoicePicker?.()` to rebuild the dropdown; synchronous `getVoices()` also attempted on init (works in Firefox) |
| Queue management | Every `speak()` call starts with `speechSynthesis.cancel()`. `cancelSpeech()` is called from `initializeDisplayState` (level reset / mode switch / game-over). `beforeunload` also cancels. |
| Long-utterance bug | N/A — Plan 36's templater targets ≤35 words; Plan 38 ≤25 words. Both well under the ~15s Chrome limit. |
| Page-unload speech persists | `window.addEventListener("beforeunload", cancelSpeech)` wired in `initVoiceNarration` |
| Voice availability varies | `pickVoice()` falls back to `voices.find(v => v.default)` then `voices[0]`; if no voices loaded, no voice is set and browser uses its default |
| `speaking` flag latency | Not used. Relies only on `onstart` / `onend` / `onerror` callbacks |

---

## Design notes

### Aria-live conflict suppression
The sequence in `announceLastTurn` is:
1. `liveRegion.textContent = text` — screen reader detects mutation
2. `speakVoiceNarration(text, "board-narration")` — inside: `aria-live="off"` set synchronously, then `speechSynthesis.speak()`
3. `utterance.onend`: `aria-live="polite"` restored

Steps 1–2 occur in the same JS event loop tick. Screen readers that debounce mutation processing will not have fired the announcement by the time aria-live is toggled. This is inherently best-effort and browser-dependent; the plan acknowledges this as the canonical approach.

### Coaching vs narration priority
When both narration and coaching fire in the same turn, coaching `speak()` cancels narration mid-utterance. This is deliberate: coaching text is the higher-value message in that turn. In practice, coaching fires infrequently (cadence-limited, opt-in mode) so interruption is rare.

### Cleanup path coverage
`initializeDisplayState` is the single canonical cleanup entry for all level transitions (level start, level reset, mode switch, game-over via `resetGameToSetup`). `app.hooks.cancelSpeech?.()` at its start covers all paths without duplicating cancel calls.

### SFX ducking
`setNarrationDucking(active)` adjusts a `duckGain` factor (1.0 or 0.3) applied multiplicatively in `tone()`. Existing oscillators already scheduled are not affected (they are very short, < 200ms), so the audible effect is on the next SFX after speech starts. Volume fully restored on utterance end/error or cancel.

---

## Manual smoke checklist

> **This checklist must be completed in a real browser before marking the packet fully closed. Run `npm run dev` and verify each item.**

- [ ] Voice Narration toggle appears in `#game-controls` below Coaching Mode
- [ ] Checking Voice Narration shows the Speed slider and Voice picker
- [ ] Unchecking Voice Narration hides the speed/voice controls
- [ ] TTS does NOT fire on page load before any user interaction
- [ ] Starting a level and letting a turn resolve causes TTS to speak the turn narration (voice must be enabled + game running)
- [ ] Voice does NOT fire when the toggle is unchecked
- [ ] Speed slider adjusts utterance rate audibly
- [ ] Voice picker populates with OS voices and selection changes the speaking voice
- [ ] SFX volume is noticeably reduced while TTS is speaking, then restored
- [ ] `#board-narration` aria-live attribute is "off" during speech, "polite" after (verify with browser DevTools → Elements)
- [ ] Resetting the level cancels any in-progress utterance
- [ ] Switching mode (Free Play / Guided Levels) cancels any in-progress utterance
- [ ] Navigating away while speaking stops the OS voice (beforeunload)
- [ ] Coaching text also speaks when coaching mode and voice narration are both enabled

---

## No scope deviations

Plan 39 shipped within its stated bounds. No new event kinds, no server-side TTS, no per-character voices, no visual speaking indicator.
