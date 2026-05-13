# Plan 03 Progress Report

## Summary

Plan 03 adds an explicit `levelKind: "challenge"` marker to the synthesis levels, surfaces it in the guided level picker, and shows a short challenge framing callout in the lesson panel when a challenge level is selected.

## Files Changed

- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/manifest.js`
- `src/ui/levels.js`
- `src/assets/styles/style.css`
- `tests/unit/guided-level-contracts.test.js`
- `tests/browser/guided-ui.spec.js`

## What Changed

- Marked the four synthesis levels with `levelKind: "challenge"`.
- Preserved the metadata through `GUIDED_LEVEL_MANIFEST` so tests and tooling can inspect it quickly.
- Rendered a compact `Challenge` badge in the guided level picker and current-level trigger.
- Added a short `Challenge Level` callout to the selected challenge level lesson panel.
- Kept the challenge signal out of ordinary guided levels and free play.

## Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/display-and-controls.test.js`
- `npx playwright test tests/browser/guided-ui.spec.js`
- `npm test`
- `npm run build`
- smoke check:
  - `node --input-type=module -e "import { getLevelDefinitions } from './src/config/levels.js'; const levels = getLevelDefinitions(); console.log(levels.length, levels[14].id, levels[21].id, levels[27].id, levels.at(-1).id);"`

## Result

- Unit tests: passing
- Browser UI test: passing
- Full test suite: passing
- Production build: passing

## Remaining Risks

- The badge is intentionally compact and text-based so it stays legible on narrow screens, but any future level-picker redesign should keep the challenge marker visible without relying on color alone.
- `advanced-scrimmage` uses the same challenge treatment as the other synthesis levels even though it is a capstone; if the curriculum taxonomy changes later, this may need a follow-up naming pass.
