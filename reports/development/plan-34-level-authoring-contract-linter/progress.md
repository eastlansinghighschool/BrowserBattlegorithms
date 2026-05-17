# Plan 34 Progress Report

## Summary

Added a warning-severity guided flag/base game-spec lint check to `npm run lint:levels`. The new check walks the normalized level setup, inspects each authored flag entry, and warns when a guided level places an uncarried opponent flag off its home base area or declares a carried flag without a valid carrier/position relationship. The checker is intentionally warning-only so it can surface campaign outliers without blocking the existing authoring pipeline.

As part of the repair pass, three guided levels were brought back into spec by moving their opponent flags onto the opponent base stripe:

- `two-conditions-at-once`
- `one-program-two-allies`
- `index-jobs`

Two guided levels remain deliberate exceptions because moving their flags back to base would change the intended capstone behavior or break the authored project fixture shape:

- `full-team-tactics`
- `advanced-scrimmage`

## Linter Behavior

The new `checkFlagSetupGameSpecCompliance` rule now emits warnings for:

- uncarried flags placed off the owning team’s base area
- uncarried flags explicitly marked `isAtBase: false`
- carried flags with a missing carrier
- carried flags whose carrier is on the wrong team or does not have `hasEnemyFlag: true`
- carried flags whose explicit coordinates do not match the carrier’s current position

The check operates on the normalized level setup returned by `getLevelDefinitions()`, so legacy `flagOverrides` are folded into `setup.flags` and are covered by the new flag/base lint in normal campaign runs.

## Current Campaign Warnings

After the repair pass, `npm run lint:levels` still exits `0` but reports the following warnings:

- `show-what-you-know` first-sees `battlegorithms_if_on_enemy_side` and `battlegorithms_if_on_enemy_side_else`.
- `full-team-tactics` first-sees `battlegorithms_move_randomly`.
- `mirror-forward`, `jump-the-gap`, and `build-the-barrier` are below the warning-floor turn limit of `8`.
- `move-toward-flag`, `enemy-nearby`, and `closest-threat` only surface their named mechanics in prose, so the win-condition-mechanic heuristic still warns that the check is ambiguous.
- `full-team-tactics` warns for flag/base compliance because the capstone still uses an off-base opponent flag as part of the authored corridor.
- `advanced-scrimmage` warns for flag/base compliance because the final scrimmage still relies on its original off-base opponent flag placement.

No other guided levels in the normalized lint surface warn for the new flag/base rule.

## Outlier Assessment

### `two-conditions-at-once`

- What it teaches: boolean composition with `AND`, gated use of `freeze`, and then continuing toward the flag.
- Does it need the enemy flag off base? No. The off-base placement was just a visual target and not a load-bearing mechanic.
- Could the same goal be taught with a base flag? Yes. The repaired level now uses the opponent base stripe instead.
- What changed: moved the opponent flag to the opponent base stripe in the level source.
- Remaining note: the cumulative Strategy Brain final project fixture does not replay this exact third-lesson corridor and is documented as a project-suite exception.

### `full-team-tactics`

- What it teaches: coordinated team tactics in the capstone, including random movement and live defender pressure.
- Does it need the enemy flag off base? Yes, for the authored capstone corridor. Moving it to base broke the intended project behavior.
- Could the same goal be taught with a base flag? Not without a broader redesign of the capstone route and fixture shape.
- What changed: no source repair. The level remains a deliberate game-spec exception.
- Remaining note: the linter warns on this level by design so the exception stays visible.

### `one-program-two-allies`

- What it teaches: one shared program coordinating two allies through role-like branching.
- Does it need the enemy flag off base? No. The off-base placement was only acting as a visual target.
- Could the same goal be taught with a base flag? Yes. The opponent flag was moved back to the opponent base stripe.
- What changed: moved the opponent flag to the opponent base stripe in the level source.
- Remaining note: the cumulative Team Strategy Script final fixture still documents this early project step as an exception, because the later checkpoint is intentionally not a re-creation of the first-step timing.

### `index-jobs`

- What it teaches: runner indexing and coordinated role assignment across allies.
- Does it need the enemy flag off base? No. The off-base placement was not load-bearing.
- Could the same goal be taught with a base flag? Yes. The repaired level now uses the opponent base stripe.
- What changed: moved the opponent flag to the opponent base stripe in the level source.
- Remaining note: the matching reference solution still passes unchanged.

### `advanced-scrimmage`

- What it teaches: the final team-strategy capstone with coordinated roles under live-board pressure.
- Does it need the enemy flag off base? Yes, for the authored scrimmage setup. Moving it to base broke the cumulative project behavior.
- Could the same goal be taught with a base flag? Not without a broader redesign of the final scrimmage route and project fixture.
- What changed: no source repair. The level remains a deliberate game-spec exception.
- Remaining note: the cumulative Team Strategy Script final fixture intentionally does not treat this capstone as a base-flag-compliant step.

## Files Changed

- `scripts/lint-levels.js`
- `tests/unit/level-lint.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js`
- `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js`
- `src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js`

## Reference Fixtures

- No XML reference fixtures changed.
- The project-suite fixture map in `tests/unit/guided-project-solutions.test.js` was updated to document the cumulative exception for `two-conditions-at-once` and to keep the capstone exception set aligned with the observed behavior.

## Validation

- `node --test --test-isolation=none tests/unit/level-lint.test.js` passed.
- `npm run lint:levels` passed with warnings only.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-project-solutions.test.js tests/unit/guided-reference-solutions.test.js` passed.
- `npm test` passed.
- `npm run build` passed, with the existing Blockly chunking warnings still present.

## Remaining Owner Decisions

- Whether `full-team-tactics` and `advanced-scrimmage` should stay as deliberate guided exceptions or be redesigned later to use spec-compliant base flags.
- Whether the warning-only flag/base lint should be promoted to CI once the team is comfortable with the remaining exceptions.
