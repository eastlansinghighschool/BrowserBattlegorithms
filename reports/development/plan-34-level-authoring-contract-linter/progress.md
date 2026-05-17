# Plan 34 Progress Report

## Summary

Implemented `npm run lint:levels` as a developer-side level-authoring contract linter with a direct Node entry point, per-check diagnostic functions, synthetic unit coverage, and packet-guidance updates. The script loads the campaign and reference fixtures, parses the concept matrix markdown, and reports findings as single-line diagnostics with severity, level id, contract name, message, and file path. The turn-limit floor is treated as a warning-policy heuristic in v1 so the tool is baseline-clean on the authored campaign instead of blocking on the current 6/4 turn-limit exceptions.

## Validation

- `node --test --test-isolation=none tests/unit/level-lint.test.js` passed.
- `npm test` passed.
- `npm run build` passed.
- `node scripts/lint-levels.js` and `npm run lint:levels` both ran successfully and exited `0` on the authored campaign.

## Current Campaign Findings

### Warnings

- `show-what-you-know` first-sees `battlegorithms_if_on_enemy_side` and `battlegorithms_if_on_enemy_side_else`.
- `full-team-tactics` first-sees `battlegorithms_move_randomly`.
- `mirror-forward`, `jump-the-gap`, and `build-the-barrier` are below the warning-floor turn limit of `8`.
- `move-toward-flag`, `enemy-nearby`, and `closest-threat` only surface their named mechanics in prose, so the win-condition-mechanic heuristic warns that the check is ambiguous.

## CI Recommendation

If the integration owner wants this in CI, the lightest-weight wiring is to add `npm run lint:levels` before the normal test/build steps in GitHub Actions or a pre-commit hook. Because the script already exits `1` on error-severity findings and `0` on warnings-only runs, CI can fail fast on authored contract regressions without any extra wrapper tooling such as husky or lint-staged.

## Notes

- No level config, reference solution fixture, demo XML, or toolbox was modified.
- The heuristic checks are intentionally conservative and may still need curriculum-owner review if their warning volume becomes noisy.
- The challenge-introduction check is cumulative across campaign order and ignores the `On Each Turn` infrastructure block.
