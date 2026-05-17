# Plan 39: Browser TTS Delivery

## Packet Metadata

- Packet id: plan-39
- Packet title: Browser TTS Delivery
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / accessibility / source-code / tests
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - Web Speech API wrapper handling voice loading, user-gesture-first-speak, queue cancellation, and sound-effect interaction
  - settings toggle for voice on/off, default off
  - aria-live / TTS conflict suppression so screen-reader users don't hear double narration
  - manual-smoke checklist (TTS is hard to assert from automation)
  - subsystem note touch
  - progress report
- Progress report folder: `reports/development/plan-39-browser-tts-delivery/`
- Progress report file: `reports/development/plan-39-browser-tts-delivery/progress.md`

## Packet Summary

Goal: Add an optional Web Speech API voice layer that speaks the narration produced by Plan 36 (and, if 38 has landed, the coaching messages from Plan 38). Off by default. Handles the cross-browser gotchas in a single small wrapper module. When voice is enabled and a screen reader is also active, suppresses the aria-live announcement so the user doesn't hear the same text twice.

Non-goals:

- Do not change the narration text content. This packet consumes whatever Plan 36 / Plan 38 produced.
- Do not add a custom TTS engine, third-party voice service, or audio file synthesis.
- Do not change the event log (Plan 35) or any consumer logic (Plan 36, 37, 38).
- Do not introduce per-runner or character-themed voices in this packet. One system voice, settings-selectable from the OS-provided list.
- Do not change SFX volume globally; only duck during active TTS playback.
- Do not deploy.

Depends on:

- Plan 36 complete: narration text is produced and reaches the aria-live region.
- Plan 38 optional: if landed, coach messages also flow through TTS when voice is enabled.

Blocks:

- Real audio accessibility for students who can't or don't use a separate screen reader.

Why this packet exists:

Web Speech API (`window.speechSynthesis`) is now well-supported across modern browsers and is the right zero-dependency, zero-server answer for a static educational app. The text-side narration from Plan 36 is the input; this packet is the delivery infrastructure that makes the same content reach students through audio. Real-world classroom audiences include students with reading difficulties (not just visual difficulties), and TTS serves them in a way screen readers do not. The implementation is bounded — Web Speech has documented gotchas but no rabbit hole.

## Authority And Contracts

Sources of truth:

- Web Speech API (`SpeechSynthesis`, `SpeechSynthesisUtterance`) — browser-native, no library.
- Plan 36's narration text output (the aria-live region's content) — primary input.
- Plan 38's coach text output (optional input) — if 38 has landed.
- Plan 36's mode-gating rule: TTS inherits the same "only narrate during RUNNING / GAME_OVER" gate.

Required product contracts:

- Voice is off by default.
- First TTS call only fires after a user gesture (browser autoplay policy). Wire the first call to land after a click/keypress.
- Voice can be toggled on/off via a settings control. Persisted to localStorage.
- When voice is on and a turn produces a narration sentence, the wrapper speaks that sentence. When voice is off, no `speechSynthesis` calls are made.
- TTS queue is cancelled on level reset, level switch, mode switch, game-over transition, and on the next turn's narration to avoid backlog buildup.
- Existing sound effects are ducked (lowered volume or paused) while a TTS utterance is speaking.
- When voice is on, the aria-live region is *temporarily set to `aria-live="off"` for the duration of the speak()*, then restored to `polite`. This is the cleanest cross-browser way to prevent screen-readers from announcing the same text TTS just spoke. Alternative: a setting-level "screen reader user" toggle that suppresses TTS entirely. Pick one approach in the implementation and document; the recommendation is the former because it's the default-safer behavior.
- Voice does not narrate empty or whitespace-only strings.
- Voice quality varies by OS — the wrapper does not attempt to normalize beyond `rate`, `pitch`, and optional voice selection.

Do not redefine:

- Narration text content (Plan 36 owns).
- Coach text content (Plan 38 owns).
- The Plan 35 event log.

## Required Reading

- `docs/packet-creation-guidance.md`
- Plan 36's `src/ui/narration.js` and the aria-live region in `index.html`.
- Plan 38's coach delivery surface, if Plan 38 has landed.
- Web Speech API MDN page (for the gotchas listed below).

## Web Speech API Gotchas (reference)

The wrapper must handle:

1. **User-gesture first-speak.** Most browsers refuse `speechSynthesis.speak()` until the user has interacted with the page. Wire the first call to land after Play, after mode pick, or after any other user-initiated event.
2. **Async voice loading.** `speechSynthesis.getVoices()` returns `[]` synchronously on Chrome first-call. Listen for `voiceschanged` to populate the voice list.
3. **Queue management.** Calling `speak()` multiple times queues them. Use `speechSynthesis.cancel()` to clear pending utterances when context changes (level reset, turn advance, etc.).
4. **Long-utterance bug.** Chrome historically stops mid-utterance after ~15 seconds. Keep utterances short (Plan 36's templater targets ≤ 35 words, well under any limit).
5. **Page-unload speech persists.** On some browsers, navigating away while TTS is speaking leaves the OS still talking. Cancel on `beforeunload`.
6. **Voice availability varies.** Always have a fallback if no voice matches the user's preference: use the default system voice.
7. **`speaking` flag latency.** `speechSynthesis.speaking` may not reflect reality immediately after `speak()` or `cancel()`. Don't rely on it for tight synchronization; use `onstart` / `onend` events.

## Scope

### In scope

- New module `src/ui/voiceNarration.js`:
  - `initVoiceNarration(app)`: sets up the wrapper, loads voices, wires the `voiceschanged` event, sets the user-gesture-first-speak flag.
  - `speak(text)`: cancels current queue, creates a new `SpeechSynthesisUtterance`, applies rate/pitch settings, hooks `onstart`/`onend` for SFX ducking + aria-live suppression, calls `speechSynthesis.speak(utterance)`.
  - `cancelSpeech()`: clears the queue.
  - Default settings: `rate: 1.0`, `pitch: 1.0`, voice: OS default. All adjustable from controls in v1; voice selection is enough.
- Hook the wrapper into Plan 36's `announceLastTurn`:
  - After updating the aria-live region's `textContent`, if voice is enabled, call `speak(textContent)`.
  - During the speak(), set the aria-live region's `aria-live` attribute to `"off"`; restore to `"polite"` on `utterance.onend` or `onerror`.
- Hook into Plan 38's `announceCoachingMoments` if 38 has landed. (If 38 hasn't, leave the hook as a documented one-liner that 38's implementer wires up.)
- Cancel speech on: level reset, level switch, mode switch, game-over transition, `beforeunload`. The same cleanup paths Plan 36 / Plan 38 use are the canonical hook sites.
- SFX ducking: while TTS is speaking, the existing sound module reduces volume to 30% (or pauses, implementer's call). Restore on TTS end.
- New settings controls in `controls.js`:
  - "Voice Narration" on/off toggle (default off).
  - Voice rate slider (range 0.75–1.5, step 0.05).
  - Voice picker dropdown populated from `speechSynthesis.getVoices()` filtered to current document language. Selection persisted.
- Persistence: localStorage under `bba:voice-narration-enabled`, `bba:voice-narration-rate`, `bba:voice-narration-voice`.
- Manual-smoke checklist (since automated TTS verification is unreliable):
  - Speak fires after first user gesture but not before.
  - Speak fires per turn when voice is on.
  - Speak does not fire when voice is off.
  - SFX duck/restore audible during speech.
  - Aria-live region `aria-live` attribute toggles off → polite around speak.
  - Voice cancels on level reset.
  - Voice cancels on mode switch.
- Subsystem note touch in `docs/subsystems/ui-mode-contract.md`: one paragraph describing the voice surface as an opt-in delivery layer on top of Plan 36.
- Plan 39 progress report.

### Files and areas likely touched

- `src/ui/voiceNarration.js` — new.
- `src/ui/narration.js` (Plan 36) — small additions to call the voice wrapper after aria-live update.
- `src/ui/controls.js` — three new settings controls.
- `src/ui/sound.js` — duck/restore hooks during TTS playback.
- `src/core/turnEngine.js` — only if cancellation hooks need a new trigger site; otherwise Plan 36's existing call site is reused.
- `src/main.js` — call `initVoiceNarration(app)` during startup.
- `src/assets/styles/components/*.css` — minor styling for the new controls.
- `docs/subsystems/ui-mode-contract.md` — one-paragraph addition.
- `reports/development/plan-39-browser-tts-delivery/progress.md` — new.

### Out of scope

- Per-runner or per-character voices.
- TTS for the welcome modal / tutorial prose. Only board narration and (optionally) coach text.
- Voice languages other than the document's `lang` attribute.
- TTS audio recording / export.
- Service-worker offline voice caching.
- Visual indicator that TTS is active (e.g. animated speaker icon). Could be added later; not in scope.

## Implementation Requirements

### Requirement 1: Wrapper module

- `src/ui/voiceNarration.js` exports `initVoiceNarration`, `speak`, `cancelSpeech`, and `isVoiceEnabled`.
- All four are pure-ish: `init` and `speak` touch `speechSynthesis`, but no module-level mutable state beyond a flag for "has the user gestured yet."
- `speak` is a no-op when voice is disabled, when the text is empty/whitespace, or before the user has gestured.

### Requirement 2: User-gesture handling

- The wrapper tracks whether any qualifying user gesture has occurred. Click anywhere, key press, touch — all qualify.
- Before first gesture, `speak` calls are silently dropped.
- After first gesture, `speak` proceeds normally for the rest of the session.

### Requirement 3: Queue management

- Every `speak` call begins with `speechSynthesis.cancel()` to clear the pending queue.
- Per-turn narration replaces any in-flight utterance from the previous turn. (Rationale: stale narration about a turn that already happened is confusing; current-state narration is the priority.)
- `cancelSpeech` provides an external API for cleanup paths.

### Requirement 4: Aria-live conflict suppression

- During an active speak(), the Plan 36 aria-live region's `aria-live` attribute is set to `"off"`.
- On `utterance.onend` or `onerror`, restored to `"polite"`.
- Implementation note: this requires that the aria-live attribute change happens AFTER the textContent update in `announceLastTurn`. Sequence: update text → set aria-live=off → call speak → onend restores aria-live=polite.

### Requirement 5: SFX ducking

- A new function in `src/ui/sound.js` (e.g. `setNarrationDucking(active: boolean)`) reduces SFX volume during active narration.
- The voice wrapper calls `setNarrationDucking(true)` on `onstart` and `setNarrationDucking(false)` on `onend` / `onerror`.

### Requirement 6: Cleanup wiring

- Every cleanup path that Plan 36's `announceLastTurn` consumer respects must also call `cancelSpeech()`:
  - Level reset
  - Level switch
  - Mode switch
  - Game-over transition
  - `beforeunload` (page navigation)

### Requirement 7: Settings UI

- Three new controls in `controls.js`:
  - "Voice Narration" toggle (checkbox).
  - "Voice Rate" slider.
  - "Voice" dropdown.
- All three persist to localStorage and restore on reload.
- The voice dropdown is populated after `voiceschanged` fires.

### Requirement 8: Manual smoke

- The packet's progress report must include a checklist of manual-smoke items completed in a real browser (the seven listed in Scope).
- Automated tests are not required for TTS audibility; they are required for the toggle wiring (Playwright can assert that settings persist and that `speak` is a no-op when voice is off).

### Requirement 9: Documentation

- `docs/subsystems/ui-mode-contract.md` gets one paragraph describing voice as an opt-in layer on top of Plan 36 narration, with the aria-live conflict suppression noted.

## Model-Specific Instructions

- Read the Web Speech API gotchas section before writing the wrapper. Each gotcha has a known mitigation; the implementer's job is to apply them consistently in one module.
- Voice availability varies wildly. Don't assume any specific voice exists. Always fall back to default.
- The aria-live suppression toggle is subtle. Test in at least Chrome and Firefox with a screen reader active to confirm the user doesn't hear double narration.
- The manual-smoke list is real validation, not a formality. Run it in a real browser.
- Stop and report if:
  - Web Speech API behavior on a target browser differs materially from the documented gotchas.
  - SFX ducking interferes with the existing sound module's volume management in unexpected ways.
  - The aria-live attribute toggle causes screen-reader users to lose announcements (i.e., the off → on round-trip doesn't reliably re-trigger the announcement).
  - The user-gesture-first-speak detection misses some classroom-realistic interaction patterns.

## Commands

```powershell
node --test --test-isolation=none tests/unit/voice-narration.test.js
npm test
npm run build
npm run test:browser
npm run dev
```

`npm run dev` is required for the manual-smoke pass. Stop the dev server before marking complete.

## Validation Checklist

- [ ] `src/ui/voiceNarration.js` exists with the four exports listed in Requirement 1.
- [ ] User-gesture detection is implemented; `speak` is a no-op before first gesture.
- [ ] Queue is cancelled on every new `speak` and on every cleanup path.
- [ ] Aria-live region attribute toggles off/on around active speech.
- [ ] SFX duck during speech; restore on end/error.
- [ ] Voice on/off toggle persists to localStorage and is honored across reloads.
- [ ] Voice rate slider works and persists.
- [ ] Voice picker populates from `getVoices()` filtered by document language and persists selection.
- [ ] `cancelSpeech` is called on level reset, level switch, mode switch, game-over, beforeunload.
- [ ] Unit tests cover the toggle wiring and the speak-is-no-op-when-disabled case.
- [ ] Manual-smoke checklist completed in a real browser, results recorded in the progress report.
- [ ] Subsystem note updated.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes.

## Stop Conditions

Stop and report for integration-owner review if:

- Cross-browser TTS behavior differs from documented gotchas in a way this packet's mitigations don't cover.
- SFX ducking conflicts with the existing sound module unrecoverably.
- Aria-live suppression fails to prevent double narration on real screen readers.
- The voice dropdown can't be populated reliably across browsers.
- Implementation would require a third-party TTS service or library.
