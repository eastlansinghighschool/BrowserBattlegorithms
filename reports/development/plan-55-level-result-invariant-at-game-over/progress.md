# Plan 55 Progress Report: Level Result Invariant At Game Over

## Summary

Implemented the engine safety net so guided levels cannot stay stuck in `GAME_OVER` with `activeLevelResult` still unresolved after scoring ends the match. The fix lives centrally in `src/core/levels.js` inside `evaluateLevelProgress()`.

The safety net now:
- Detects `mainGameState === GAME_OVER` with a non-terminal `activeLevelResult`
- Forces `activeLevelResult = FAILED`
- Records `lastLevelResultReason = "match_ended_without_level_win_condition_satisfied"`
- Emits the new Plan 35 event `level.forcedFailedAtGameOver`
- Preserves the `GAME_OVER` match state while still running the normal level-ended hooks so the editor re-enables and narration / usage tracking still fire

## Audit

I audited all guided levels whose `winCondition` names a specific `runnerId`, with `pointsToWin <= 1`, and with more than one Team 1 runner in the setup. The vulnerable class is broad: 42 guided levels match.

Audited vulnerable levels:
- `move-to-target`
- `reach-enemy-flag`
- `score-a-point`
- `barrier-detour`
- `mirror-forward`
- `prediction-06`
- `sensor-barrier-branch`
- `watch-the-wall`
- `find-the-human`
- `find-the-enemy-flag`
- `human-runner-practice`
- `move-toward-flag`
- `bring-it-home`
- `enemy-nearby`
- `jump-the-gap`
- `bughunt-15`
- `dodge-and-deliver`
- `jump-if-ready`
- `stay-still-can-do-something`
- `relay-race`
- `my-side-their-side`
- `freeze-the-lane`
- `show-what-you-know`
- `closest-threat`
- `how-far-away`
- `two-conditions-at-once`
- `this-or-that`
- `flip-the-answer`
- `prediction-25`
- `bughunt-28`
- `one-program-two-allies`
- `index-jobs`
- `first-two-defend`
- `escort-the-carrier`
- `closest-enemy-defender`
- `freeze-support`
- `barrier-specialist`
- `jump-team`
- `prediction-31`
- `bughunt-37`
- `optional-random-lab`
- `optional-double-carrier-showdown`

Representative regression coverage was added for:
- `one-program-two-allies` (`Level 29`)
- `index-jobs` (`Level 30`)

## Files Changed

- `src/core/levels.js`
- `src/core/scoring.js`
- `src/core/setup.js`
- `src/core/state.js`
- `src/core/events.js`
- `src/ui/levels.js` was not changed
- `src/core/turnEngine.js` was not changed
- `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js` was not changed
- `tests/unit/turn-engine-resilience.test.js`
- `docs/subsystems/turn-engine.md`
- `docs/development/README.md`
- `docs/development/future-directions-analysis/backlog.md`
- `docs/development/plan-55-level-result-invariant-at-game-over.md`

## Event / Reason Contract

- Reason string chosen: `match_ended_without_level_win_condition_satisfied`
- New event kind: `level.forcedFailedAtGameOver`
- Event payload fields:
  - `levelId`
  - `reason`
  - `winConditionType`
  - `winConditionRunnerId`
  - `scoringTeam`

## Validation

Ran:
- `node --test --test-isolation=none tests/unit/turn-engine-resilience.test.js`
  - Passed: 3/3
- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js tests/unit/guided-level-contracts.test.js tests/unit/guided-bug-hunt-contracts.test.js`
  - Passed: 35/35
- `npm run lint:levels`
  - Passed with the existing baseline warnings only
- `npm test`
  - Passed: 310/310
- `npm run build`
  - Passed
  - Existing Vite dynamic-import / large-chunk warnings remain
- `npm run test:browser`
  - First run hit the shell timeout limit, then a targeted rerun of `tests/browser/key-capture-passthrough.spec.js` passed
  - Final full rerun passed: 113/113

## Notes

- Tier 2 authoring lint for runner-specific win conditions was intentionally deferred for this packet. The runtime safety net is the required fix; the authoring warning can be revisited later if the curriculum owner wants an extra nudge.
- The existing Plan 28 `PROCESSING_ACTION` recovery remains untouched.
- No scoring rule, authored win condition, or `pointsToWin` value was changed.

## Ready for integration

Yes.
