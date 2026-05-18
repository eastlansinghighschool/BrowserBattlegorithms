# Plan 47 Progress Report: Optional Double-Carrier Showdown

## What Changed

- Added `optional-double-carrier-showdown` as a late optional guided level after `optional-random-lab`.
- Authored the level on `wideScrimmage` with:
  - one human Team 1 carrier
  - two Blockly allies
  - three live Team 2 NPC runners
  - Team 2 starting with a carrier as well
- Gave the level a pass condition of Team 1 scoring a point and authored two failure conditions:
  - Team 2 scoring a point
  - exceeding the 20-turn cap
- Updated the optional-lab ordering contract so the concept matrix can track multiple optional labs distinctly.
- Added plural `failureConditions` support while preserving the legacy singular `failureCondition` field for older levels.
- Humanized the `team_scores_point` failure reason in the lesson UI so the overlay explains why the level ended.
- Added tests for:
  - level order
  - carrier setup
  - optional-level toolbox / move-target scope
  - Team 2 scoring failure
  - turn-cap failure
  - a playable human-script pass path
- Updated the concept matrix, turn-engine note, and game specification language to acknowledge level-specific failure pressure.
- Updated regression profile filtering so optional labs are excluded from the required campaign regression set.

## Validation

- `npm run lint:levels`
  - Passed with the existing repo warnings only
- `node --test --test-isolation=none tests/unit/movement-and-collisions.test.js tests/unit/narration-event-log.test.js`
  - Passed
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/scoring-and-level-state.test.js tests/unit/level-lint.test.js`
  - Passed
- `node --test --test-isolation=none tests/unit/guided-project-solutions.test.js tests/unit/guided-reference-solutions.test.js`
  - Passed
- `npm test`
  - Passed
- `npm run build`
  - Passed
- `npm run test:browser`
  - Passed

## Notes

- The new level is intentionally optional and late in the campaign.
- The authored failure conditions now cover both score-based defeat and turn-cap defeat.
- The browser suite had one flaky modal-stability retry during validation, but a second run passed cleanly.
