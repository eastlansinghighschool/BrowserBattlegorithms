# Plan 52 Progress Report

## Summary

Implemented the jump-forward animation flair packet with a parabolic jump arc, drop shadow, takeoff lines, failed-jump reversal, synthesized jump sounds, reduced-motion support, and browser coverage for both successful and blocked jump cases.

## Tuning Values

- Jump arc amplitude: `1.0` for the normal arc and `0.6` for the failed-jump reversal arc.
- Reduced-motion arc amplitude: `0.3` for normal jumps and `0.2` for failed reversals.
- Jump duration floor: `320ms`, independent of the animation speed slider.
- Takeoff lines: 3 line lengths per side, scaled from `0.18`, `0.24`, and `0.30` of a cell, with opacity driven by the early jump anticipation window and a single-frame reduced-motion cue at progress `0`.
- Landing dust: `150ms` transient ring on the landing cell.
- SFX: `jump-takeoff` uses `200Hz / 80ms / 0.03s` plus `380Hz / 60ms / 0.025s`; `jump-land` uses `100Hz / 60ms / 0.04s`.

## Validation

- `npm run lint:levels`
  - Passed with existing repository warnings only.
- `node --test --test-isolation=none tests/unit/jump-animation.test.js tests/unit/movement-and-collisions.test.js`
  - Passed: 21/21.
- `npx playwright test tests/browser/modal-stability.spec.js --reporter=line`
  - Passed: 4/4.
- `npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line`
  - Passed: 9/9.
- `npx playwright test tests/browser/jump-animation.spec.js --reporter=line`
  - Passed: 2/2.
- `npm run test:browser:smoke`
  - Passed: 66/66 in Chromium on the desktop test environment with `workers: 2`.
- `npm test`
  - Passed: 297/297.
- `npm run build`
  - Passed.
- `npm run test:browser`
  - Passed: 113/113.

## Browser Notes

- The jump spec runs in the smoke browser tier because it is a short, student-visible interaction and now has only two tests.
- The smoke run passed in Chromium on the desktop test environment with `workers: 2`.
- No squash-and-stretch, emoji swap, glow anticipation, or new audio asset was added.

## Notes

- The blocked-jump browser test now drives the failure animation deterministically and verifies that the runner returns to the origin cell.
- No game rules were changed.
- Reduced-motion handling is preserved across the new jump visuals.
