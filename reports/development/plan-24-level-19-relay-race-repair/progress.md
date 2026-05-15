# Plan 24 Progress Report

## Summary

Repaired Level 19, `Relay Race`, so the `teammate has enemy flag` condition is load-bearing. The human runner now starts without the enemy flag and is controlled manually, the ally stages first on defense, and the ally then switches to carrier support after the human picks up the flag.

## What changed

- Re-authored Level 19 to use `HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT`.
- Moved the human runner to the authored relay start position without the enemy flag.
- Kept the enemy flag at its normal home position instead of pre-carrying it.
- Added a narrow Level-19 relay goal state in `src/core/levels.js` so the goal marker starts on the staging square and then switches to a support square near the human carrier.
- Kept the relay goal marker and win condition aligned through the same stateful helper.
- Updated the lesson copy and tutorial steps to explain the human/ally relay split without giving away the exact block sequence.
- Updated the relay reference fixture to the intended branch pattern:
  - `if teammate has enemy flag`
  - `move toward human runner`
  - `else`
  - `move up`
- Added focused relay tests proving:
  - the level starts with manual human input
  - the human starts without the enemy flag
  - the enemy flag starts at home
  - the staging marker appears first
  - the marker switches after the human becomes the carrier
  - the intended branch solution passes with a scripted human route
  - unconditional `Move Toward human runner` fails
  - unconditional `Move Up` fails
- Updated the turn-engine subsystem note to document the small stateful guided-goal pattern.
- Updated the guided level concept matrix row for Level 19.
- Fixed a stale Level 15 lane-guard placement so the existing Challenge 15 reference solution and contract assertions stay aligned with the authored board.

## Final authored Level 19 shape

- Human runner: starts at `1,4` without the flag
- Ally runner: starts at `4,5`
- Enemy flag: starts at its home base
- Guided goal: stages at `4,0`, then switches to a carrier-support square near the human carrier
- Human turns: manual keyboard input

## Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/scoring-and-level-state.test.js tests/unit/guided-reference-solutions.test.js tests/unit/relay-race.test.js`
- `npm test`
- `npm run build`

## Validation result

- Focused unit tests passed.
- `npm test` passed.
- `npm run build` passed.

## Files changed

- `src/core/state.js`
- `src/core/levels.js`
- `src/ui/levels.js`
- `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/relay-race.test.js`
- `tests/unit/fixtures/guided-reference-solutions/relay-race.xml`
- `docs/subsystems/turn-engine.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/development/README.md`

## Remaining risk

- The relay support square is intentionally stateful and tied to the authored Level 19 setup, so future map or start-position edits should keep the relay tests in sync.
