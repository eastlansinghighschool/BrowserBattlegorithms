# Repair Instructions — Plan 72 UI Test Coverage

- Packet: Plan 72 — Free Play Per-Point Turn Limit
- Date: 2026-05-21
- Review status: source behavior appears aligned; add missing browser/UI assertions before final integration

## Why This Repair Exists

The Plan 72 implementation added the Free Play point-turn-limit state, dropdown, runtime no-score reset, and scoreboard countdown. Focused unit tests cover the default, `No limit`, Free Play-only enforcement, score preservation, and countdown math.

However, the existing browser Free Play spec was not updated to assert the new visible UI contract. The packet explicitly required:

- Free Play setup exposes the point turn-limit dropdown.
- Default is `100 turns`.
- Options include `No limit`, `60`, `100`, `150`, and `200`.
- Warning/countdown appears at the expected threshold.

The current `tests/browser/free-play.spec.js` still only checks mode, team-size, and map selectors. This leaves a small but important classroom-facing regression hole.

## Required Reading

- `docs/development/plan-72-free-play-per-point-turn-limit.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/ui/levels.js`
- `src/ui/scoreboard.js`
- `tests/browser/free-play.spec.js`
- `tests/browser/helpers.js`

## Required Repair Scope

Update `tests/browser/free-play.spec.js` only, unless the browser test reveals an actual product bug.

Add browser assertions that:

1. The Free Play setup panel shows `select[data-action="free-play-turn-limit"]`.
2. Its default selected value is `"100"` and visible label is `100 turns`.
3. Its available options are exactly `No limit`, `60 turns`, `100 turns`, `150 turns`, and `200 turns`.
4. Changing the dropdown to `none` updates the visible setup summary to include `No limit per point`.
5. Changing the dropdown to `60` updates the summary to include `60 turns per point`.
6. The Free Play scoreboard shows `Point resets in 10 turns` when the app state is set to a running Free Play match with `freePlayPointTurnLimit = 100`, `freePlayRoundStartTurn = 1`, and `currentTurnNumber = 91`, followed by `app.syncUi()`.

Keep the test deterministic and fast. Prefer extending the existing test named `free play setup panel exposes mode, team size, and map selectors` or `free play selectors update the visible setup summary and rebuild the match` rather than creating a slow new scenario.

## Validation Commands

Run from the repository root:

```powershell
npx playwright test tests/browser/free-play.spec.js --reporter=line
npm test
```

Run `npm run build` only if the repair reveals a source/UI change is needed.

## Stop Conditions

Stop and report instead of broadening the repair if:

- The dropdown is not visible or does not update state in the browser.
- The countdown cannot be tested without changing production hooks.
- The scoreboard warning fails because of a source behavior bug.
- Fixing the issue would require redesigning Free Play setup layout or scoreboard copy.
