# Plan 12 Progress Report

## Summary

Implemented the Team Strategy Script revision for levels 29-37.

- Updated the team arc copy so each level reads like one shared program gaining roles, not a set of unrelated branch exercises.
- Kept the specialist levels separate and raised the L35 and L36 turn limits to 10, per orchestration approval.
- Removed the explicit scorer restriction from `advanced-scrimmage` so the capstone win condition now correctly allows any ally to score for the team.
- Reframed L37 as `Challenge 37: Advanced Scrimmage` and aligned the concept matrix with that challenge framing.

## Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js`
- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js`
- `npm test`
- `npx playwright test tests/browser/guided-ui.spec.js --reporter=line`

## Results

- Unit tests: pass
- Reference solutions: pass
- Browser guided UI tests: pass
- Production build: not rerun in this checkpoint slice, but prior build state remained unchanged

## Notes

- `freeze-support`, `barrier-specialist`, and `jump-team` remain separate specialist steps.
- `advanced-scrimmage` now relies on the existing `team_scores_point` evaluation path without a hard-coded scorer id.
- The existing Blockly deprecation warning about `getAllVariables()` still appears in tests and is unrelated to this packet.
