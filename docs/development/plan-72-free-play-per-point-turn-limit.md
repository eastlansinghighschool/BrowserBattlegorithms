---
id: plan-72
title: "Free Play Per-Point Turn Limit"
status: complete
depends_on: []
gate: "none for the approved dropdown/default behavior; stop for broader stalemate detection"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Add a Free Play per-point turn-limit dropdown, defaulting to 100 turns, that resets stalemated rounds with no score.
---
# Plan 72: Free Play Per-Point Turn Limit

- Packet id: Plan 72
- Packet title: Free Play Per-Point Turn Limit
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: none for the approved dropdown/default behavior; stop for broader stalemate detection
- Expected artifacts:
  - Free Play setup dropdown for per-point turn limit
  - Runtime no-score round reset when limit is exceeded
  - Warning/countdown feedback
  - Unit/browser tests
  - Docs updates
  - Progress report
- Progress report folder: `reports/development/plan-72-free-play-per-point-turn-limit/`
- Progress report file: `reports/development/plan-72-free-play-per-point-turn-limit/progress.md`

## Packet Summary

Goal: Add a Free Play per-point turn limit so stalemated rounds reset with no score instead of continuing indefinitely.

Non-goals:
- Do not add fuzzy stalemate detection.
- Do not inspect whether "interesting" actions happened.
- Do not change guided level turn limits or failure conditions.
- Do not change scoring rules.
- Do not change CPU behavior.
- Do not add new game-over conditions.
- Do not add server-side persistence or deployment changes.

Depends on:
- Existing Free Play setup/options UI.
- Existing `resetRound(state)` behavior.
- Existing scoreboard/controls/narration surfaces.

Blocks:
- Future stalemate-detection work can build on this clearer per-point reset behavior.

Why this packet exists:
Free Play can enter long stalemates when programs cannot navigate around obstacles or retrieve carried flags. A visible per-point turn limit gives teachers and students a predictable classroom-safe escape hatch while preserving the chance to debug and iterate.

## Approved Product Defaults

- Add a dropdown in the Free Play setup options panel.
- Label should be concise and classroom-readable, such as `Point turn limit`.
- Default: `100 turns`.
- Options:
  - `No limit`
  - `60 turns`
  - `100 turns`
  - `150 turns`
  - `200 turns`
- The limit applies per point/round, not to the whole match.
- When the limit is exceeded, reset the round with no score.
- Scores remain unchanged.
- Give a warning/countdown near the end of the limit.

## Authority And Contracts

Required project contracts:
- Free Play mode state and controls belong in `src/ui/` and existing Free Play setup state.
- Round reset belongs in `src/core/setup.js`.
- Core turn/round behavior belongs in `src/core/turnEngine.js`.
- Guided level turn limits and failure conditions belong to guided level contracts and must not be changed here.
- UI must remain usable on classroom projectors, student laptops, and narrow screens.
- Static Vite deployment must remain intact.

Do not redefine:
- Existing scoring threshold / points-to-win behavior.
- Guided mode turn-limit failure conditions.
- Plan 59 pause/resume behavior.
- Usage export semantics except for recording the new no-score reset if an existing event path supports it.

## Required Reading

Read before editing:
- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/core/state.js`
- `src/core/setup.js`
- `src/core/turnEngine.js`
- `src/ui/controls.js`
- `src/ui/scoreboard.js`
- `src/ui/gameStateUI.js`
- `src/ui/narration.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/browser/free-play.spec.js`

Use `rg` for:
- `pointsToWin`
- `currentTurnNumber`
- `resetRound`
- `free play`
- `freePlay`
- `setup summary`
- `teamScores`
- `scoreboard`
- `recordFreePlay`

## Scope

### In Scope

- Add Free Play setup state for per-point turn limit.
- Add dropdown to Free Play options panel.
- Reflect the selected value in setup summary if summaries currently list selected options.
- Enforce the limit only in Free Play running matches.
- Reset the round with no score when the limit is exceeded.
- Preserve team scores.
- Reset turn number and per-round runner/flag state through existing round reset behavior.
- Add warning/countdown feedback before reset.
- Add tests for option exposure, default, no-limit behavior, and no-score reset.
- Update docs/subsystem notes.

### Out Of Scope

- Guided level turn limits.
- Stalemate heuristics based on meaningful events.
- CPU rut detection or pathing.
- Scoring-rule changes.
- New settings persistence beyond existing Free Play setup persistence patterns.
- New animations or sounds unless existing narration/event paths require minimal feedback.

### Files And Areas Likely Touched

- `src/core/state.js`
- `src/core/setup.js`
- `src/core/turnEngine.js`
- `src/ui/controls.js`
- `src/ui/scoreboard.js`
- `src/ui/narration.js`
- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

## Implementation Requirements

### 1. Setup Dropdown

Required behavior:
- Free Play setup options include a point turn-limit dropdown.
- Default is `100`.
- Options exactly match the approved defaults unless a current UI helper requires internal values such as `none`, `60`, `100`, `150`, `200`.
- The control appears in Free Play setup, not Guided Levels.

Constraints:
- Keep visible UI compact.
- Use a native/select-style control consistent with existing Free Play setup controls.
- Do not add another settings-modal preference.

### 2. Runtime Enforcement

Required behavior:
- Track the selected limit per Free Play round.
- When a round exceeds the selected limit, call existing round reset behavior without incrementing either score.
- The match continues unless a separate game-over condition already exists.
- `No limit` disables this behavior.

Important detail:
- Use the existing turn boundary flow. Do not reset mid-animation or in the middle of a runner action.

Constraints:
- Do not apply to guided mode.
- Do not trigger guided level failure conditions.
- Do not change `pointsToWin`.
- Do not increment `lastScoringTeam`.

### 3. Warning / Countdown

Required behavior:
- Provide clear feedback shortly before reset, such as when 10 turns remain.
- The countdown should be visible in the scoreboard/control area or factual narration/turn log using existing surfaces.

Constraints:
- Keep copy concise, for example: `Point resets in 10 turns`.
- Do not create a modal or interrupt gameplay.
- Preserve accessibility basics; if visible feedback is dynamic, ensure screen-reader users can access equivalent information through existing status/narration patterns.

### 4. Tests

Required tests:
- Free Play setup exposes point turn-limit dropdown.
- Default is `100 turns`.
- Selecting `No limit` prevents no-score reset.
- Limit reset preserves team scores.
- Limit reset resets runner/flag/barrier per-round state through existing round reset behavior.
- Warning/countdown appears at the expected threshold.
- Guided levels are unaffected.

### 5. Documentation

Required updates:
- `docs/GameSpecification.md` should describe Free Play point turn limits.
- `docs/subsystems/turn-engine.md` should document no-score reset at a Free Play turn boundary.
- `docs/subsystems/ui-mode-contract.md` should document the setup control and any scoreboard/status display.

## Work Plan

1. Inspect Free Play setup controls and round reset flow.
2. Add state/config for point turn limit with default `100`.
3. Add the setup dropdown and summary/status sync.
4. Enforce no-score reset at a safe turn boundary.
5. Add warning/countdown feedback.
6. Add unit and browser tests.
7. Update docs.
8. Run validation and write the progress report.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/scoring-and-level-state.test.js tests/unit/turn-engine-resilience.test.js
npm test
npm run build
npx playwright test tests/browser/free-play.spec.js --reporter=line
```

If layout/controls changes could affect broader browser coverage:

```powershell
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Free Play setup shows point turn-limit dropdown.
- [ ] Default is `100 turns`.
- [ ] Options include `No limit`, `60`, `100`, `150`, and `200`.
- [ ] Limit applies per point/round.
- [ ] Limit reset does not change scores.
- [ ] Limit reset uses safe turn-boundary behavior.
- [ ] Warning/countdown is visible and accessible.
- [ ] Guided mode is unaffected.
- [ ] Docs/subsystem notes match runtime behavior.
- [ ] Unit tests pass.
- [ ] Targeted Free Play browser tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and ask for owner review if:
- Implementing the limit requires broad turn-engine restructuring.
- The only clean warning UI would require a new modal or large scoreboard redesign.
- Guided mode behavior is affected.
- Usage analytics or export semantics need a product decision.
- Stalemate detection starts creeping into this packet.
