# Plan 53 Progress Report: Above/Below Sensor Curriculum Audit

## Summary

This packet audited every guided level in `src/config/levels/phases/**/*.js` that declares `sensorRelationTypes` and closed the curriculum gap where the horizontal directional pair was already present but the vertical analogs were missing.

The implementation stayed within the packet contract:

- no sensor engine logic changed
- no new sensor relation enum values were added
- no reference solutions were edited
- Free Play already surfaced all eight directional relations by default; I pinned that behavior with a unit test rather than changing the toolbox
- the linter contract was extended so vertical directional pairs are checked the same way as the horizontal ones
- the concept matrix and packet index were lightly updated to reflect the new vertical availability

## Files Changed

- [`src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js) - added `DIRECTLY_ABOVE`/`DIRECTLY_BELOW` to pair with the existing front/behind relations.
- [`src/config/levels/phases/sensing/level-07-watch-the-wall.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/sensing/level-07-watch-the-wall.js) - added `DIRECTLY_ABOVE`/`DIRECTLY_BELOW` to pair with the existing front/behind relations.
- [`src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js) - added `DIRECTLY_ABOVE`/`DIRECTLY_BELOW` to pair with the existing front/behind relations.
- [`src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js) - added `DIRECTLY_ABOVE`/`DIRECTLY_BELOW` to pair with the existing front/behind relations.
- [`src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js) - added the missing vertical directional pair so the lesson offers the same cardinal-axis toolkit as the horizontal pair.
- [`src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js) - added the missing vertical directional pair to match the already-exposed horizontal pair.
- [`src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js) - added the missing vertical directional pair to match the already-exposed horizontal pair.
- [`scripts/lint-levels.js`](C:/AI/BrowserBattlegorithms/scripts/lint-levels.js) - extended `sensor-relation-policy` to check the vertical directed pair and the vertical anywhere pair symmetrically.
- [`tests/unit/level-lint.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/level-lint.test.js) - added passing and failing fixtures for the extended vertical-pair linter contract.
- [`tests/unit/guided-level-contracts.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/guided-level-contracts.test.js) - updated the guided-level assertions so the audited sensor lessons expect the vertical options where appropriate.
- [`tests/unit/display-and-controls.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/display-and-controls.test.js) - added a Free Play default-sensor-options check proving all eight directional relations are already surfaced.
- [`docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`](C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md) - added a light note that the vertical analogs exist alongside the directional lesson row.
- [`docs/development/README.md`](C:/AI/BrowserBattlegorithms/docs/development/README.md) - moved Plan 53 from active to completed packets.

## Audited Levels

### Touched

- `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/sensing/level-07-watch-the-wall.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js` - horizontal directional pair already existed, so the vertical pair was added.
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js` - horizontal directional pair already existed, so the vertical pair was added.

### Audited but not touched

- `src/config/levels/phases/sensing/level-08-find-the-human.js` - already exposed the vertical anywhere pair; no curriculum gap.
- `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js` - already exposed the vertical anywhere pair; no curriculum gap.
- `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js` - uses only `WITHIN_*` relations, so no directional pairing applied.
- `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js` - uses only `WITHIN_*` relations, so no directional pairing applied.
- `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js` - intentionally left unchanged; it exposes only `DIRECTLY_IN_FRONT` and still triggers the pre-existing lint warning about undeclared directional pairing.
- `src/config/levels/phases/advanced-logic/level-24-how-far-away.js` - not part of the sensor-relation audit set; it does not declare `sensorRelationTypes`.
- `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js` - not part of the sensor-relation audit set; it does not declare `sensorRelationTypes`.

## Pre-Existing Inconsistencies

- `prediction-25-two-truths` remains a baseline inconsistency because it exposes only `DIRECTLY_IN_FRONT`. The updated linter still reports that mismatch, but this packet intentionally does not repair it.
- No other sensor-relation inconsistencies were found in the audited guided levels.

## Validation

Ran the packet validation commands from the plan and confirmed the edited surfaces stayed green:

- `npm run lint:levels`
  - Passed with the existing baseline warnings only.
- `node --test --test-isolation=none tests/unit/level-lint.test.js tests/unit/guided-level-contracts.test.js tests/unit/display-and-controls.test.js`
  - Passed: 60/60.
- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js`
  - Passed: 8/8.
- `npm test`
  - Passed: 303/303.
- `npm run test:browser`
  - Passed: 113/113.
- `npm run build`
  - Passed.

## Notes

- Free Play already surfaced all eight directional relations, so I validated that behavior with a unit test instead of mutating the toolbox configuration.
- I did not change `src/core/conditions.js`, any sensor enum values, or any reference solutions.
- The packet intentionally stays focused on curriculum symmetry rather than adding any new directional lesson or engine capability.
