# Progress Report — Plan 72: Free Play Per-Point Turn Limit

- Packet id: Plan 72
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on the existing Free Play setup, round reset, and scoreboard/control surfaces

---

## Summary

Free Play now supports a per-point turn limit with a native setup dropdown, safe turn-boundary no-score round reset, and a visible countdown when the round is close to timing out. The limit defaults to 100 turns, can be disabled with No limit, and only applies in Free Play. Team scores are preserved when the round resets. Guided levels are unaffected. A follow-up repair pass also added browser assertions for the dropdown, summary text, and countdown. Validation passed: 386/386 unit tests and targeted Free Play browser tests.

## Changes Made

### `src/core/state.js`

- Added `freePlayPointTurnLimit: 100`.
- Added `freePlayRoundStartTurn: 1` so the engine can measure turns elapsed within the current Free Play round.

### `src/core/setup.js`

- Reset `freePlayRoundStartTurn` to `1` on match/display initialization.
- Reset `freePlayRoundStartTurn` to `state.currentTurnNumber` inside `resetRound(state)` so the next round starts counting from the post-reset turn boundary.

### `src/core/levels.js`

- Extended `configureFreePlay(app, updates)` to accept `freePlayPointTurnLimit`.
- Preserves the selected limit when the Free Play mode is rebuilt unless the user explicitly changes it.

### `src/core/turnEngine.js`

- Added a Free Play-only no-score round reset check at the same safe boundary where the turn number increments after the last runner in the round.
- When `currentTurnNumber - freePlayRoundStartTurn >= freePlayPointTurnLimit`, the engine calls `resetRound(state)` without changing scores.
- The check is disabled when the limit is `null` or non-positive.

### `src/ui/levels.js`

- Added a native `Point turn limit` dropdown to the Free Play setup panel.
- Options are `No limit`, `60 turns`, `100 turns`, `150 turns`, and `200 turns`.
- The setup summary now shows the selected limit in classroom-readable copy.
- Wired the new select change handler to `configureFreePlay`.

### `src/ui/scoreboard.js`

- Added an inline countdown warning in Free Play when 10 or fewer turns remain in the current round.
- The warning reads in the form `Point resets in N turns`.

### `tests/unit/free-play-contracts.test.js`

- Added coverage for:
  - default point turn limit
  - `No limit` behavior
  - no-score round reset preserving scores
  - guided-mode non-applicability
  - countdown threshold behavior

### `tests/browser/free-play.spec.js`

- Added browser coverage for the new Free Play point turn-limit dropdown.
- Asserted the default selected value and visible label.
- Asserted the full option list.
- Asserted that switching to `No limit` and `60 turns` updates the visible setup summary.
- Asserted the scoreboard shows `Point resets in 10 turns` at the warning threshold.

### Docs

- Updated `docs/GameSpecification.md` to describe the Free Play point turn limit.
- Updated `docs/subsystems/turn-engine.md` to document the no-score round reset at the Free Play turn boundary.
- Updated `docs/subsystems/ui-mode-contract.md` to document the setup control and scoreboard countdown.
- Updated `docs/development/README.md` and `docs/development/plan-72-free-play-per-point-turn-limit.md` status to complete.

## Validation Results

| Command | Result |
|---|---|
| `npm test` | Pass — 386/386 |
| `npx playwright test tests/browser/free-play.spec.js --reporter=line` | Pass — 13/13 |
| `npm run build` | Pass — pre-existing chunk-size warnings only |

## Validation Checklist

- [x] Free Play setup shows point turn-limit dropdown.
- [x] Default is `100 turns`.
- [x] Options include `No limit`, `60`, `100`, `150`, and `200`.
- [x] Limit applies per point/round.
- [x] Limit reset does not change scores.
- [x] Limit reset uses safe turn-boundary behavior.
- [x] Warning/countdown is visible and accessible.
- [x] Guided mode is unaffected.
- [x] Docs/subsystem notes match runtime behavior.
- [x] Unit tests pass.
- [x] Targeted Free Play browser tests pass.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] No unrelated files were changed by this packet work.

## Stop Conditions Assessment

No stop conditions were triggered. The implementation stayed within the approved Free Play-only limit/reset behavior and did not broaden into stalemate detection, scoring changes, or guided-level turn-limit edits.
