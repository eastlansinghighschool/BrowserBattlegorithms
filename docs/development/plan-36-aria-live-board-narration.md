# Plan 36: ARIA-Live Board Narration

## Packet Metadata

- Packet id: plan-36
- Packet title: ARIA-Live Board Narration
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / accessibility / source-code / tests
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - `aria-live="polite"` region added to `index.html`
  - factual templater module that converts a turn's event log into a concise sentence
  - per-turn announcement wiring that updates the region after each turn's `finalizeTurnEventLog`
  - optional visible "Last turn" strip controlled by a settings toggle (default off)
  - Playwright assertions on announcement content
  - subsystem note touch
  - progress report
- Progress report folder: `reports/development/plan-36-aria-live-board-narration/`
- Progress report file: `reports/development/plan-36-aria-live-board-narration/progress.md`

## Packet Summary

Goal: Make the game's per-turn state changes available to screen-reader users as a concise factual announcement. Consume the Plan 35 event log, run it through a factual templater that summarizes coincident events into one sentence, push the sentence into an `aria-live="polite"` region. Optionally render the same sentence as a small visible "Last turn" strip behind a settings toggle for sighted students who want the text trail.

Non-goals:

- Do not change any engine behavior or the Plan 35 event log producers.
- Do not implement voice synthesis (Plan 39).
- Do not add coaching/intent interpretation (Plan 37/38).
- Do not narrate every event individually. Summarization is required when multiple events occur in one turn.
- Do not narrate decorative or non-state-changing events.
- Do not deploy.

Depends on:

- Plan 35 complete: `state.lastTurnEventLog` is populated at end of each active-runner turn with the 9 v1 event kinds.

Blocks:

- Plan 37 (Learning Moment Classifier) and Plan 39 (TTS delivery) — both can run independently of this packet but classroom rollout depends on at least one consumer existing.

Why this packet exists:

Plan 30 closed the keyboard accessibility gap; Plan 35 produces the data; this packet closes the screen-reader/cognitive-accessibility gap for board state. The current p5 canvas is opaque to assistive technology. A concise per-turn ARIA announcement (and optional visible echo) makes the game playable for visually impaired students and clarifies busy multi-runner turns for everyone.

## Authority And Contracts

Sources of truth:

- `src/core/events.js` (from Plan 35) — event log shape and lifecycle.
- `state.lastTurnEventLog` — per-turn input to the templater.
- `index.html` — DOM location for the aria-live region.
- `docs/subsystems/ui-mode-contract.md` — modes that should/shouldn't narrate (guided/free play yes; setup screens no).
- The Plan 35 event taxonomy: `turn.started`, `runner.actionChosen`, `runner.actionResolved`, `runner.blockedOrBounced`, `flag.pickedUp`, `flag.dropped`, `team.scored`, `resource.unavailable`, `level.result`.

Required product contracts:

- Announcements are factual descriptions of what just happened. No interpretation of student intent, no coaching tone, no exclamations.
- Each active-runner turn produces at most one announcement. Multiple events from the same turn are summarized into one sentence.
- The aria-live region uses `aria-live="polite"` (not `assertive`) so announcements don't preempt user interaction.
- The region is always present in the DOM when the game is running; settings only control the visible echo strip, never the aria-live region itself.
- Announcements are concise (target: ≤ 20 words for routine turns, ≤ 35 for eventful turns like a score). Verbosity is the enemy.
- The templater is a pure function: `(eventLog) => string`. No side effects, no DOM access, no state mutation.
- The wiring layer is the only DOM-touching code; it lives in a new module (`src/ui/narration.js` or similar) and is wired from a single call site at end-of-turn.

Do not redefine:

- The Plan 35 event log shape.
- Engine semantics.
- The mode contract.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/development/archive/plan-35-narration-event-log-foundation.md` (assuming 35 has shipped by the time this packet runs)
- `src/core/events.js` (Plan 35 output)
- `src/core/state.js` (event log fields)
- `src/core/turnEngine.js` (where `finalizeTurnEventLog` is called)
- `index.html` (DOM structure, existing aria-* attributes)
- `docs/subsystems/ui-mode-contract.md`

Use `rg "aria-live|aria-label|finalizeTurnEventLog|lastTurnEventLog"` to find existing ARIA patterns and the event-log surface.

## Scope

### In scope

- Add a single `<div id="board-narration" class="board-narration" aria-live="polite" aria-atomic="true"></div>` to `index.html` in a location that doesn't disturb visual layout. Hidden visually by default (off-screen positioning via CSS, not `display: none` which screen readers may ignore).
- Add `src/ui/narration.js`:
  - `formatTurnNarration(eventLog: Array): string` — pure factual templater.
  - `announceLastTurn(app): void` — DOM-touching wiring: reads `app.state.lastTurnEventLog`, calls the templater, writes the result to the aria-live region (and optionally to the visible strip).
- Wire `announceLastTurn(app)` to fire once per active-runner turn, immediately after `finalizeTurnEventLog` runs. (`finalizeTurnEventLog` itself stays inside `src/core/events.js` per Plan 35; the call to `announceLastTurn` is in a UI-layer hook the turn engine triggers.)
- Add an optional visible "Last turn" strip: a small text element near the board that mirrors the same sentence. Controlled by a settings toggle (`Show Turn Log`, default off). Settings live in `app.state.narrationVisibleStrip` or similar; persist preference to localStorage.
- Templater rules:
  - Combine events from a single turn into one sentence using natural-language summarization. Examples:
    - `turn.started + runner.actionResolved (moved)` → "Turn 5. Ally 0 moved to row 3, column 4."
    - `turn.started + runner.actionResolved (stayed) + runner.blockedOrBounced (barrier)` → "Turn 5. Ally 0 bounced off a barrier at row 4, column 5."
    - `turn.started + runner.actionResolved (freeze_applied)` → "Turn 5. Ally 0 froze opponents."
    - `flag.pickedUp` → append "and picked up the enemy flag."
    - `team.scored` → "Turn 5. Ally 0 returned the enemy flag to base. Team 1 scored. Score 1 to 0."
    - `level.result: passed` → append "Level passed."
  - Skip `runner.actionChosen` in narration — `runner.actionResolved` carries the user-visible outcome.
  - `resource.unavailable` → "Turn 5. Ally 0 tried to freeze opponents, but the freeze was already used. Ally 0 stayed still."
  - Frozen runner turns: "Turn 5. Ally 0 is frozen and skipped a turn."
- Vocabulary discipline:
  - Refer to runners as "Ally N" / "Enemy N" / "Team 1 runner N" — never by raw `runnerId` string.
  - Refer to cells as "row R, column C" using 1-indexed values for readability.
  - Refer to teams as "Team 1" / "Team 2" or, when game state distinguishes, "your team" / "the other team."
- Skip narration entirely in setup/mode-picker states. Only narrate during `MAIN_GAME_STATES.RUNNING` and during `GAME_OVER`.
- Playwright tests in `tests/browser/aria-narration.spec.js` (new) that:
  - assert the aria-live region exists and is populated after a turn;
  - assert the announcement content matches expected templater output for a handful of canonical event sequences;
  - assert the visible strip is hidden by default and shown when the toggle flips;
  - assert no announcement fires during setup screens.
- Unit tests for the templater in `tests/unit/narration-templater.test.js` covering each event combination listed above.
- Subsystem note touch in `docs/subsystems/ui-mode-contract.md` adding one paragraph describing the narration surface as a per-mode UI element.
- Plan 36 progress report.

### Files and areas likely touched

- `index.html` — add the aria-live region and (hidden by default) visible strip.
- `src/ui/narration.js` — new module.
- `src/core/turnEngine.js` — wire `announceLastTurn` after `finalizeTurnEventLog`.
- `src/ui/controls.js` — add the "Show Turn Log" toggle and persistence.
- `src/assets/styles/components/*.css` (or `style.css` if Plan 28 hasn't yet split) — narration region + visible strip styles.
- `tests/unit/narration-templater.test.js` — new.
- `tests/browser/aria-narration.spec.js` — new.
- `docs/subsystems/ui-mode-contract.md` — one-paragraph addition.
- `reports/development/plan-36-aria-live-board-narration/progress.md` — new.

### Out of scope

- Voice synthesis (Plan 39).
- Coaching prose (Plan 38).
- Additional event kinds.
- Settings UI overhaul.
- Multi-language narration.
- Tooltips on the visible strip.

## Implementation Requirements

### Requirement 1: ARIA region

- `<div id="board-narration" aria-live="polite" aria-atomic="true">` is present in `index.html`.
- Visually hidden by default via CSS that keeps the element accessible to assistive tech (off-screen positioning, not `display:none` or `visibility:hidden`).
- Always in the DOM. Settings don't toggle the region itself — only the optional visible echo.

### Requirement 2: Templater

- Pure function. No side effects.
- Handles all 9 event kinds with the summarization examples in Scope above.
- Returns a single sentence (≤ 35 words on the eventful path, target ≤ 20 for routine turns).
- Never returns null/undefined; empty event log returns an empty string and the caller skips the DOM write.
- Unit-tested for at least: empty log, routine move, bounce, freeze applied, flag pickup, flag dropped, scoring + level passed, frozen-skipped turn, resource unavailable.

### Requirement 3: Wiring

- `announceLastTurn(app)` is called from `turnEngine.js` immediately after `finalizeTurnEventLog`. Single call site.
- Reads `app.state.lastTurnEventLog`, runs the templater, updates the aria-live region's `textContent` (and the visible strip if enabled).
- Setting `textContent` is the correct way to trigger an aria-live announcement; do not use `innerHTML`.
- Mode gating: skip the call if `app.state.mainGameState !== RUNNING` and `app.state.mainGameState !== GAME_OVER`.

### Requirement 4: Visible strip toggle

- New settings field `app.state.narrationVisibleStrip: boolean`, default `false`, persisted to localStorage under `bba:narration-visible-strip`.
- New toggle control in `controls.js` ("Show Turn Log").
- When `true`, a small visible element near the board renders the same sentence.
- When `false`, the visible element is `hidden` (CSS-hidden or removed from DOM; the aria-live region is untouched).

### Requirement 5: Vocabulary

- Runner naming follows the table in Scope. Tests assert specific phrases.
- Cell coordinates 1-indexed in narration.
- No emoji in narration. Strip any incidental emoji before TTS-ready output (Plan 39 will rely on this contract).

### Requirement 6: Test coverage

- Unit tests for the templater (in-memory event logs → expected sentences).
- Playwright tests assert the aria-live region's `textContent` after a turn, using a deterministic game state (test hook or hard-coded level start).

### Requirement 7: Documentation

- `docs/subsystems/ui-mode-contract.md` gains one paragraph describing the narration surface, its always-on aria-live region, and the optional visible strip.

## Model-Specific Instructions

- Build the templater first as a pure function with no DOM. Unit-test it to near-completeness before wiring DOM.
- The wiring layer should have exactly one entry point (`announceLastTurn`) called from exactly one site in the turn engine. Resist the temptation to call from multiple consumers.
- When in doubt about phrasing, prefer "Turn N. Subject verb object." sentences. Don't get clever.
- Stop and report if:
  - The Plan 35 event log lacks data needed to compose any of the example sentences (suggests Plan 35 needs a follow-up).
  - The mode-gating check requires touching turn-engine state beyond `mainGameState`.
  - Playwright cannot deterministically assert aria-live content (some browsers may delay live-region updates; document any timing accommodation needed).

## Commands

```powershell
node --test --test-isolation=none tests/unit/narration-templater.test.js
npm test
npm run build
npm run test:browser
```

## Validation Checklist

- [ ] `index.html` has the aria-live region; visually hidden by default; always in DOM.
- [ ] `src/ui/narration.js` exports `formatTurnNarration` (pure) and `announceLastTurn` (wiring).
- [ ] `announceLastTurn` is called from exactly one site in the turn engine.
- [ ] Templater handles every event-combination case in Requirement 2 with passing unit tests.
- [ ] Visible strip toggle persists to localStorage and reflects across reloads.
- [ ] No narration fires in setup/mode-picker states.
- [ ] No emoji in narration output.
- [ ] Playwright assertions on aria-live content pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes.
- [ ] Subsystem note updated.
- [ ] No engine semantic change.

## Stop Conditions

Stop and report for integration-owner review if:

- The Plan 35 event log lacks data needed to template any required sentence.
- Aria-live timing in any major browser is non-deterministic enough to make tests fragile.
- Multi-turn announcements would be required (this packet assumes one announcement per turn).
- The visible-strip toggle conflicts with existing settings UI in a non-trivial way.
