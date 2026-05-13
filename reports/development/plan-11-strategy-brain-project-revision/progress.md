# Plan 11 Progress Report

## Summary

Implemented the Strategy Brain revision for levels 23-28.

- Added project-framed copy across the project arc so each level reads like one evolving solo strategy program.
- Repaired `how-far-away` so the distance comparison is load-bearing on `simpleAisle`.
- Broadened `full-team-tactics` into a true Strategy Brain capstone with the advanced logic blocks preserved alongside the older bridge blocks.
- Updated the concept matrix to reflect the revised Strategy Brain arc.
- Added contract coverage for the repaired `how-far-away` board and the broader `full-team-tactics` toolbox.
- Kept the existing project metadata and challenge metadata behavior intact.

## Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js`
- `npm test`
- `npm run build`
- `npx playwright test tests/browser/guided-ui.spec.js --reporter=line`

## Results

- Unit tests: pass
- Reference solutions: pass
- Browser guided UI tests: pass
- Production build: pass, with the repo's existing Blockly chunk-size warnings

## Notes

- `how-far-away` now uses a barrier at `(4, 4)`, an active defender at `(6, 4)`, and a `<= 5` distance cutoff so the reference path turns upward before the lane dead-ends.
- `full-team-tactics` now includes `ADVANCED_CAPSTONE_BLOCKS` plus the older enemy-flag and barrier condition blocks so students can keep editing a shared project program through the capstone.
