# Plan 44: Narration Controls and Voice Bootstrap Repair

## Packet Metadata

- Packet id: plan-44
- Packet title: Narration Controls and Voice Bootstrap Repair
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / accessibility / bugfix / source-code / tests
- Mutation level: source-code / tests / docs-only
- Approval gate: before changing the broader tutorial overlay contract, redesigning the controls panel layout, adding new dependencies, or weakening any existing tutorial Playwright assertion
- Expected artifacts:
  - tutorial scrim no longer blocks the narration / coaching / voice controls
  - voice picker populates on first load in browsers that support Web Speech
  - coaching toggle initializes its checked state on its own (no longer dependent on the turn-log toggle's initial sync)
  - unit test for the voice-picker bootstrap retry
  - browser test asserting the narration controls receive clicks while a tutorial overlay is active
  - manual smoke checklist for real-Chrome verification (Web Speech is only available outside the in-app browser)
  - progress report
- Progress report folder: `reports/development/plan-44-narration-controls-and-voice-bootstrap-repair/`
- Progress report file: `reports/development/plan-44-narration-controls-and-voice-bootstrap-repair/progress.md`

## Packet Summary

Goal: Fix three concrete defects discovered during Plan 39 manual smoke that combine to make the narration / coaching / voice UI feel broken on the first guided level a student opens. None of the three is a Plan 39 design flaw — they are cross-system integration gaps that only became visible once Web Speech and the tutorial overlay collided with the new narration controls in the same DOM region.

Non-goals:

- Do not redesign the tutorial overlay's focus discipline or step authoring contract.
- Do not change Plan 35 event log, Plan 36 narration text content, Plan 37 classifier, Plan 38 coaching text, or Plan 39 voice wrapper behavior. This packet only fixes the surfaces around them.
- Do not change controls panel layout beyond what is needed to make the three toggles reachable during tutorials.
- Do not add new voice-related features (per-runner voices, voice preview button, etc.).
- Do not change usage export schema.
- Do not deploy.

Depends on:

- Plan 36 (aria-live narration) complete.
- Plan 37 (learning moment classifier) complete.
- Plan 38 (coaching text) complete.
- Plan 39 (browser TTS) complete — pending manual smoke; this packet unblocks that smoke.

Blocks:

- Plan 39 manual smoke sign-off.
- Pilot classroom rollout of narration / coaching / voice features.

Why this packet exists:

The Plan 39 escalation report at `reports/development/plan-39-browser-tts-delivery/escalation-2026-05-17/escalation-report.md` documented three observations against guided Level 5 (`mirror-forward`): narration controls were unclickable during the tutorial, the voice picker was empty, and a possible second checkbox bug after tutorial dismissal. Orchestrator code review confirmed:

- The tutorial scrim definitely blocks the narration controls (it covers `inset: 0` at z-index 1000 with no `pointer-events: none` exception).
- The voice picker has a real startup ordering race: `initVoiceNarration` runs before `bindControls`, so the synchronous initial `populateVoicePicker` call fires against an unassigned hook.
- The "second checkbox bug" is most likely the next tutorial step's scrim still blocking, not a separate code defect. Verification is part of this packet's manual smoke.

A fourth defect surfaced during code review: the coaching-toggle handler block in `controls.js` is missing its initial `syncTurnLogToggle()` call. It works in practice only because the turn-log toggle block (immediately above) syncs both checkboxes from state. Trivial to fix and bundled here.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-17):

### Decision 1: Tutorial scrim policy — raise controls panel z-index above the scrim

The narration / coaching / voice toggles are **always-interactive affordances**, semantically distinct from the per-step tutorial flow. They live in the left controls panel alongside Sound, Speed, and Show Turn Log — none of which are tutorial targets. Approach: raise the controls panel (or just the narration-controls subsection) above the tutorial scrim's z-index.

Concretely: `.tutorial-scrim` is z-index 1000 and `.tutorial-spotlight` is z-index 1001. The narration controls row (or the entire `#game-controls` container if the implementer prefers fewer rules) gets `position: relative; z-index: 1002;` so it sits above the scrim. Clicks land. Tutorial focus on the spotlit target is preserved everywhere else.

If this approach breaks any existing tutorial Playwright assertion, stop and report — the fallback would be approach (b), punching a second spotlight-cutout for the controls row, which is more invasive and lives in a follow-up packet.

### Decision 2: Voice picker bootstrap — bind controls first, then init voice; plus defensive retry

Primary fix: in `src/main.js`, swap the order so `bindControls(app)` runs before `initVoiceNarration(app)`. This guarantees `app.hooks.populateVoicePicker` exists when `initVoiceNarration` synchronously calls `loadVoices()`.

Defensive belt-and-suspenders: inside `loadVoices()` in `src/ui/voiceNarration.js`, if `app.hooks.populateVoicePicker` is missing at call time, queue a `queueMicrotask` (or `setTimeout(..., 0)`) retry. This handles future re-ordering and the rare case where a browser fires `voiceschanged` before either of those binds.

The `voiceschanged` event listener stays — it correctly handles voices that load asynchronously.

### Decision 3: Coaching toggle initial sync

Add a `syncTurnLogToggle()` call inside the `if (coachingModeToggle) { ... }` block in `src/ui/controls.js`, immediately after `addEventListener("change", ...)`. This mirrors the pattern used for `turnLogToggle` and the existing voice-controls block. The function name remains misleading (it syncs both checkboxes) — renaming to `syncNarrationToggles` is a tempting cleanup but **out of scope**; the existing `app.hooks.syncNarrationControls = syncTurnLogToggle` assignment has reach into `syncUi` and renaming creates merge risk with Plan 38/39's recent landings. Save the rename for a future cleanup pass.

### Decision 4: Manual smoke is required for sign-off

Plan 39 originally shipped with a manual smoke checklist that could not be completed in the in-app browser because Web Speech is unavailable there. This packet's progress report incorporates the Plan 39 smoke checklist and adds the new items needed to verify Decisions 1–3 in real Chrome. The packet does not close until a human runs the checklist in a Chromium browser with `speechSynthesis` available.

## Authority And Contracts

Sources of truth:

- `reports/development/plan-39-browser-tts-delivery/escalation-2026-05-17/escalation-report.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/development/archive/plan-31-modal-stability-regression-suite.md`
- `docs/development/plan-36-aria-live-board-narration.md` (status: complete)
- `docs/development/plan-39-browser-tts-delivery.md` (status: complete pending manual smoke)
- `src/main.js`
- `src/ui/controls.js`
- `src/ui/voiceNarration.js`
- `src/ui/tutorialOverlay.js`
- `src/assets/styles/components/overlays.css`

Required product contracts:

- Tutorial overlay focus on the spotlit target is preserved for every other UI region (Blockly workspace, board canvas, level picker, Start button, etc.).
- The narration / coaching / voice toggles are reachable by mouse and keyboard during any tutorial step.
- Voice-narration features remain off by default. This packet does not change defaults.
- Existing modal-stability and key-capture Playwright tests continue to pass.
- The app remains a static Vite deployment.

Do not redefine:

- Tutorial step authoring contract (`tutorialSteps` on level definitions).
- The Plan 36 / 38 / 39 toggle defaults or localStorage keys.
- The Plan 35 event log or Plan 37 classifier.
- Sound, Speed, Show Turn Log behavior beyond their existing contracts.

## Required Reading

- `docs/packet-creation-guidance.md`
- `reports/development/plan-39-browser-tts-delivery/escalation-2026-05-17/escalation-report.md` and its two screenshot artifacts
- `docs/development/plan-39-browser-tts-delivery.md` for the original manual smoke checklist
- `src/main.js` — focus on lines around the `initVoiceNarration` / `bindControls` ordering (currently 211–218)
- `src/ui/controls.js` — focus on `syncTurnLogToggle` definition and the three toggle handler blocks (currently 334–343, 572–622)
- `src/ui/voiceNarration.js` — focus on `initVoiceNarration` and `loadVoices` (currently 135–160)
- `src/ui/tutorialOverlay.js` — focus on `renderTutorialOverlay` (currently 266–316), enough to confirm the scrim/spotlight structure
- `src/assets/styles/components/overlays.css` — focus on `.tutorial-scrim`, `.tutorial-spotlight`, and the `tutorial-overlay-active` class
- `tests/browser/modal-stability.spec.js` and `tests/browser/key-capture-passthrough.spec.js` as the closest existing test patterns

Use `rg "tutorial-scrim|tutorial-overlay-active|populateVoicePicker|coachingModeToggle"` from the repository root if any of the line numbers above have shifted by the time this packet runs.

## Scope

### In scope

- CSS change raising the controls panel (or narration-controls row) above the tutorial scrim z-index.
- Main bootstrap re-order: `bindControls` before `initVoiceNarration`.
- Defensive `populateVoicePicker` retry inside `loadVoices` for the case where the hook is unset at first call.
- One-line addition of `syncTurnLogToggle()` inside the coaching toggle block.
- A new unit test for the voice-picker bootstrap retry behavior.
- A new Playwright spec (or extension of an existing one) asserting the narration controls receive clicks while a tutorial overlay is active.
- Progress report including a manual smoke checklist that supersedes Plan 39's pending one.

### Files and areas likely touched

- `src/main.js`
- `src/ui/voiceNarration.js`
- `src/ui/controls.js`
- `src/assets/styles/components/overlays.css` and/or `src/assets/styles/components/controls.css` (whichever scope the z-index lift belongs in)
- `tests/unit/voice-narration.test.js` (new file or extension)
- `tests/browser/narration-controls-during-tutorial.spec.js` (new) or extension of `tests/browser/aria-narration.spec.js` / `tests/browser/modal-stability.spec.js`
- `reports/development/plan-44-narration-controls-and-voice-bootstrap-repair/progress.md`

### Out of scope

- Renaming `syncTurnLogToggle` to a less misleading name (deferred to a future cleanup packet).
- Per-runner voices or any other Plan 39 feature expansion.
- Redesigning tutorial step structure.
- Adding `pointer-events: none` to the scrim itself or any other broad change to tutorial focus discipline.
- Changing default-off behavior of any narration/coaching/voice toggle.
- New Blockly blocks, new event kinds, new level changes.
- Deployment.

## Work Plan

1. Summarize the packet, read the escalation report and the four referenced source modules.
2. Make the z-index fix first; confirm visually (or via Playwright with the tutorial active) that the three toggles become clickable.
3. Reorder the bootstrap in `main.js` and add the defensive `populateVoicePicker` retry.
4. Add the missing `syncTurnLogToggle()` call to the coaching toggle block.
5. Add the unit test for the voice-picker bootstrap retry.
6. Add the Playwright test that proves the controls are clickable during a tutorial.
7. Run full validation. Record any tutorial Playwright assertion that fails due to the z-index lift and stop before working around it.
8. Author the manual smoke checklist into the progress report (covering Plan 39's outstanding items plus the new fixes).
9. Update `docs/subsystems/ui-mode-contract.md` only if the runtime contract has materially changed (it has not, but a one-line note on the controls panel z-index policy may be appropriate).

## Implementation Requirements

### Requirement 1: Tutorial scrim must not block the narration controls (Decision 1)

Required behavior:

- The narration controls row (Show Turn Log, Coaching Mode, Voice Narration toggle, voice rate slider, voice picker, plus the affordance labels and visible strips) receives mouse and keyboard input while `#tutorial-overlay.tutorial-overlay-active` is in the DOM.
- The tutorial's focus discipline on its spotlit target is preserved for every other interactive region (Blockly workspace, board, Start button, level picker, etc.).

Constraints:

- Implement via z-index raising, not by removing the scrim or adding `pointer-events: none` to it.
- Do not modify the scrim's appearance (color, opacity).
- Do not modify the tutorial card's appearance or positioning.
- Do not add a second spotlight cutout (that is the rejected fallback approach for this packet).

Stop if:

- The z-index lift causes any existing tutorial Playwright assertion to fail and the fix would require weakening the assertion.

### Requirement 2: Voice picker populates on first load (Decision 2)

Required behavior:

- In a browser with `speechSynthesis` available, opening any guided level (after Plan 40's keyboard nav is in place or not — either way) results in the voice picker being populated with available system voices once the toggle is enabled.
- `bindControls(app)` runs before `initVoiceNarration(app)` in `src/main.js`.
- `loadVoices()` in `src/ui/voiceNarration.js` defensively schedules a microtask retry of `populateVoicePicker` if the hook is missing at first invocation.

Constraints:

- Do not remove the existing `voiceschanged` event listener.
- Do not block bootstrap on voice loading.
- Do not change the default state of `voiceEnabled` or the localStorage keys.

Edge cases:

- If `speechSynthesis` is absent entirely (Node tests, in-app browser without Web Speech), `initVoiceNarration` continues to short-circuit as it does today.
- If voices load truly asynchronously and `voiceschanged` fires after both initial passes have been retried, the listener still triggers a final populate.

### Requirement 3: Coaching toggle initializes its own checked state (Decision 3)

Required behavior:

- Inside the `if (coachingModeToggle) { ... }` block in `src/ui/controls.js`, call `syncTurnLogToggle()` once after `addEventListener("change", ...)`, matching the pattern used for `turnLogToggle`.

Constraints:

- Do not rename `syncTurnLogToggle` (deferred).
- Do not introduce a second sync function for just the coaching toggle.

### Requirement 4: Unit test for voice-picker bootstrap retry

Required behavior:

- A new or extended test in `tests/unit/voice-narration.test.js` covers: `populateVoicePicker` hook initially unset → `loadVoices()` schedules retry → after the microtask drains and the hook is set, the picker is called.
- The test runs entirely in Node and does not require `speechSynthesis`; mock or shim as needed.

Constraints:

- Do not require a real `SpeechSynthesis` implementation.
- Do not rely on flaky time-based delays beyond `queueMicrotask` / `setTimeout(..., 0)`.

### Requirement 5: Playwright test for narration controls during a tutorial

Required behavior:

- A new spec, e.g. `tests/browser/narration-controls-during-tutorial.spec.js` (or an addition to an existing narration spec), opens a guided level whose first-step tutorial does not spotlight any of the three toggles, asserts the tutorial overlay is active, then clicks the Coaching Mode checkbox and confirms the checkbox is now checked.
- A second assertion confirms the same for the Show Turn Log checkbox.
- A third assertion (gated on `speechSynthesis` availability) confirms the Voice Narration toggle accepts a click.

Constraints:

- The test must run against the actual built page, not via test hooks that bypass the DOM.
- The test must not dismiss the tutorial before performing the clicks.
- The test must not weaken or change any existing tutorial Playwright assertion.

### Requirement 6: Manual smoke checklist supersedes Plan 39's

Required behavior:

- Progress report includes a numbered manual smoke checklist with at minimum these items, each with a clear pass/fail criterion:
  1. Open guided Level 5 in real Chrome. Tutorial overlay is active.
  2. Click Show Turn Log toggle. Visible strip appears below the controls.
  3. Click Coaching Mode toggle. Coaching visible strip and aria-live region appear (may be empty until first turn).
  4. Click Voice Narration toggle. Voice rate slider and voice picker become visible.
  5. Voice picker dropdown is populated with at least one system voice.
  6. Dismiss the tutorial via Got It. Re-toggle each of the three controls and confirm they still work.
  7. Start the level. Confirm aria-live narration text appears after the first turn.
  8. With Voice Narration enabled, confirm an audible utterance fires after the first turn (and that the aria-live region is suppressed during the utterance per the existing Plan 39 conflict-suppression rule).
  9. Reset the level. Confirm in-flight speech is canceled (per Plan 39's `cancelSpeech` hook).
  10. Repeat steps 2–4 on a level whose tutorial spotlights a control on the right side (so the spotlight is visibly distinct from the narration controls row); confirm no visual collision.

Constraints:

- Do not mark the packet complete without all ten items checked.
- If any item fails, file a stop and report; do not silently relax the checklist.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/voice-narration.test.js
npx playwright test tests/browser/narration-controls-during-tutorial.spec.js --reporter=line
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npx playwright test tests/browser/aria-narration.spec.js --reporter=line
npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line
npm test
npm run test:browser
npm run build
```

If the new browser spec is added as an extension of an existing file, run that file directly first.

## Validation Checklist

- [ ] `.tutorial-scrim` is unchanged; the controls panel (or narration-controls row) is raised above it via z-index 1002 (or equivalent).
- [ ] `bindControls(app)` runs before `initVoiceNarration(app)` in `src/main.js`.
- [ ] `loadVoices()` in `src/ui/voiceNarration.js` retries `populateVoicePicker` via microtask if the hook is unset at first call.
- [ ] `voiceschanged` event listener remains in place.
- [ ] Coaching toggle block calls `syncTurnLogToggle()` once after attaching its change listener.
- [ ] New unit test covers the voice-picker bootstrap retry.
- [ ] New Playwright spec asserts narration controls receive clicks while a tutorial overlay is active.
- [ ] All ten manual smoke checklist items pass in real Chrome.
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes (existing modal-stability and key-capture specs unchanged and green).
- [ ] `npm run build` passes.
- [ ] Plan 39 manual smoke is now closeable; the progress report explicitly says so.
- [ ] No subsystem note becomes untrue; if `docs/subsystems/ui-mode-contract.md` got a one-line z-index note, it accurately reflects the new state.

## Stop Conditions

Stop and report for owner review if:

- The z-index lift causes any existing tutorial Playwright assertion to fail.
- `speechSynthesis` integration reveals a different startup race not covered by the microtask retry.
- The Plan 36 / 38 narration text or aria-live conflict-suppression behavior changes as a side effect.
- A new dependency or `package.json` change appears necessary.
- The manual smoke checklist surfaces a defect that requires changing the Plan 39 voice wrapper API.
- A subsystem note would become untrue and the correct contract wording requires owner judgment.
- Any deployment, GitHub workflow, or admin analyzer change appears necessary.

## Notes For Future Self

- The `syncTurnLogToggle` rename is the obvious next cleanup. It owns three checkboxes' initial state, which the name doesn't admit. A future packet should rename it to `syncNarrationToggles` (or similar) and update the `app.hooks.syncNarrationControls` assignment and the `syncUi` call site. Two-file change, no behavioral impact.
- If a future tutorial step ever wants to spotlight one of the narration controls intentionally, the z-index lift in this packet means the spotlight cutout will still work — the spotlight is z-index 1001 but `pointer-events: none`, and the raised control at z-index 1002 takes the click directly. Worth verifying when authoring such a step.
- The escalation report's screenshot artifacts (`tutorial-overlay-active.png`, `tutorial-dismissed-controls.png`) should stay where they are. Do not move or delete them as part of this packet.
