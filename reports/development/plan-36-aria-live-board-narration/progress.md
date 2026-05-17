# Plan 36 Progress Report

## Outcome

Plan 36 is complete. The app now has an always-present `aria-live="polite"` narration region, an optional visible "Last turn" strip controlled by a persisted `Show Turn Log` toggle, and a pure templater that summarizes the finalized Plan 35 turn event log into a single factual sentence.

## Implementation Notes

- Added `src/ui/narration.js` with `formatTurnNarration(eventLog)` and `announceLastTurn(app)`.
- Wired narration announcement after `finalizeTurnEventLog` through the turn engine hook.
- Added narration state fields and UI synchronization for the visible strip toggle.
- Updated the UI mode contract doc to describe the narration surface.
- Added unit coverage for the templater and Playwright coverage for the live region, visible strip, and setup suppression.

## Validation

- `node --test --test-isolation=none tests/unit/narration-templater.test.js` passed.
- `npx playwright test tests/browser/aria-narration.spec.js` passed.
- `npm test` passed.
- `npm run build` passed.
- `npm run test:browser` passed.

## Follow-Up

No open follow-up is required for the narration packet itself.

## Follow-Up Cleanup

- Restored real P1 browser coverage in [tests/browser/key-capture-passthrough.spec.js](C:/AI/BrowserBattlegorithms/tests/browser/key-capture-passthrough.spec.js) with an actual `page.keyboard.press("d")` path and a stable post-key processing check.
- Reverted [tests/browser/guided-play.spec.js](C:/AI/BrowserBattlegorithms/tests/browser/guided-play.spec.js) to the shared-handler proof path and renamed the test so the title matches the behavior it verifies.
- Diagnosed the guided-play flake as a timing/state issue, not an aria-live regression: the keypress was arriving before the human turn was reliably active, so the guard in `handleKeyInput` sometimes rejected it.
- Chose Option A for the templater contract note in [src/ui/narration.js](C:/AI/BrowserBattlegorithms/src/ui/narration.js), documenting the enrichment assumption with JSDoc instead of adding a separate raw-event fallback test.
- Final validation rerun for this cleanup passed with the stable browser tests:
  - `npx playwright test tests/browser/key-capture-passthrough.spec.js -g "guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline"`
  - `npx playwright test tests/browser/guided-play.spec.js -g "guided keyboard-practice level wires Team 1 movement through the shared handler"`
- The D-key browser test now enters the normal guided-mode path before pressing the real browser `D` key, then proves the event reaches the game key pipeline and queues the rightward `MOVE` target before processing. It intentionally does not assert a final rightward position, because Level 10 starts the human at `(1,4)` with a barrier at `(2,4)`, so the authored board blocks that cell.
