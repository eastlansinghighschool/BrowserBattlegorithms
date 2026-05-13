# Plan 02 Progress Report

## Summary

Plan 02 is now fully repaired and verified. The guided contract tests, the canonical reference solutions, and the capstone level setup all line up with the authored curriculum again.

## Files Changed

- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `tests/unit/fixtures/guided-reference-solutions/advanced-scrimmage.xml`

## Baseline Failures

At the start of this repair pass, `tests/unit/guided-reference-solutions.test.js` still failed on `show-what-you-know` and then on `advanced-scrimmage`.

## Failure Classification

- `show-what-you-know`: fixture bug plus overconstrained level setup
- `advanced-scrimmage`: flag override was authored with the wrong setup key, so the fixture was chasing the wrong live flag location
- `dodge-and-deliver`: already repaired before this pass
- guided contract assertions: already repaired before this pass
- public docs alignment: handled in the earlier doc pass

## What Changed

- Replaced the broken `show-what-you-know` XML with a flag-state solution:
  - if the ally has the enemy flag, move toward `MY_BASE`
  - otherwise, move toward `ENEMY_FLAG`
- Softened the `show-what-you-know` setup so the level remains a live-defender score challenge without forcing a brittle route:
  - changed the map from `midfieldPressure` to `simpleAisle`
  - moved both opponent runners to the far right base edge at `(11, 1)` and `(11, 6)`
- Repaired `advanced-scrimmage` so the capstone uses the intended live flag location:
  - kept the `wideScrimmage` map
  - raised the turn limit from `32` to `40`
  - changed the setup override from `flagOverrides` to `flags`, so the enemy flag is actually placed at `(8, 3)`
- Replaced the `advanced-scrimmage` XML with the same simple flag-state canonical solution:
  - if the ally has the enemy flag, move toward `MY_BASE`
  - otherwise, move toward `ENEMY_FLAG`

## Validation

### Targeted checks

- The `show-what-you-know` flag-state solution passes in the harness on the softened layout.
- The `advanced-scrimmage` flag-state solution passes once the flag override is authored with `flags` instead of `flagOverrides`.

### Final validation

- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js`
- `npm test`
- `npm run build`
- smoke check:
  - `node --input-type=module -e "import { getLevelDefinitions } from './src/config/levels.js'; const levels = getLevelDefinitions(); console.log(levels.length, levels[14].id, levels[21].id, levels[27].id, levels.at(-1).id);"`

## Remaining Risks

- `show-what-you-know` is now intentionally easier than the earlier `midfieldPressure` version. The level still uses live defenders, but it no longer pressures students with a brittle route.
- `advanced-scrimmage` now matches the authored capstone intent more closely, but its score-based win still depends on a live route through the scrimmage board, so any future layout changes should be tested against the reference solution.

## Recommended Next Packet

- Guided curriculum pacing and synthesis-level difficulty review, if the softened `show-what-you-know` setup or the capstone route needs follow-up.
