# Plan 44 Progress Report

## Current State

Plan 44 remains `in-progress`.

The core repair work is implemented and verified:
- the narration controls row is lifted above the tutorial scrim so the checkboxes remain clickable during guided tutorials,
- voice narration bootstraps after controls are bound and retries voice-picker population if the hook is not ready on the first pass,
- the coaching toggle now initializes its own checked state,
- and a browser regression test now proves the narration controls are clickable while the tutorial overlay is active.

## Diagnosis Notes

I also found and fixed a related browser-test timing issue while validating the packet:
- the `guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline` test was waiting for a queued action while the p5 loop was still free-running,
- the real `d` keypress was being accepted, but the queued action could be consumed before the test observed it,
- pausing the p5 loop with `noLoop()` made the queued action observable and kept the real browser keypress path intact.

That was a test stabilization issue, not a production regression.

## Validation

Passed:
- `node --test --test-isolation=none tests/unit/voice-narration.test.js`
- `npx playwright test tests/browser/narration-controls-during-tutorial.spec.js --reporter=line`
- `npx playwright test tests/browser/guided-play.spec.js -g "guided keyboard-practice level wires Team 1 movement through the shared handler" --reporter=line`
- `npx playwright test tests/browser/key-capture-passthrough.spec.js -g "guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline" --reporter=line`
- `npm run test:browser`

The full browser suite passed after the repair:
- `npm run test:browser` -> `95 passed`

## Manual Smoke Checklist

Still required in a real Chrome session with Web Speech available:

1. Open guided Level 5 in real Chrome. Tutorial overlay is active.
2. Click `Show Turn Log`. Visible strip appears below the controls.
3. Click `Coaching Mode`. Coaching strip and aria-live region appear.
4. Click `Voice Narration`. Voice rate slider and voice picker become visible.
5. Confirm the voice picker contains at least one system voice.
6. Dismiss the tutorial via `Got It`, then re-toggle each of the three controls and confirm they still work.
7. Start the level and confirm aria-live narration text appears after the first turn.
8. With voice narration enabled, confirm an audible utterance fires after the first turn and the aria-live region is suppressed during speech.
9. Reset the level and confirm in-flight speech is canceled.
10. Repeat the control-click checks on a level whose tutorial spotlights a right-side target, and confirm the narration controls remain visually separate from the spotlight.

## Open Follow-Up

Plan 44 is not ready to close until the real-Chrome manual smoke checklist is complete.
