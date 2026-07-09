# Progress Report - Plan 93: Pre-Challenge 22 Living Resource Uplift

## Summary of Changes
- Uplifted four resources-and-territory levels (Levels 16, 18, 20, 21) from frozen decoy NPCs to active, deterministic bestiary NPC types.
- **Level 16 (`jump-if-ready`)**:
  - Spawned `GUIDED_CHARGER` at `(6, 5)` (on the enemy side, column 6) with `chargeRange: 2`.
  - Placed barriers at column 6, leaving row 4 and row 5 open.
  - Relocated target cell to `(8, 4)` and Ally start cell to `(5, 4)`.
  - Set `boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT` and `mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC`.
  - Removed stale prose from tutorial step copy.
- **Level 18 (`stay-still-can-do-something`)**:
  - Assigned `GUIDED_VERTICAL_PATROL` sentry at `(10, 2)` to provide visual life.
  - Set `boardDynamicsTier: BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION`.
- **Level 20 (`my-side-their-side`)**:
  - Placed barriers blocking rows 0-5 and 7 at column 2, forcing row 6.
  - Assigned `GUIDED_GUARD` at `(8, 6)` with `guardRadius: 2` defending column 7.
  - Set `boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT` and `mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC`.
- **Level 21 (`freeze-the-lane`)**:
  - Placed barriers blocking rows 0-2 and 5-7 at column 7, forcing row 4 and blocking freezeless route-arounds.
  - Configured `GUIDED_CHARGER` at `(7, 3)`.
  - Set `boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT` and `mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC`.
- Created naive solution XML fixtures:
  - `tests/unit/fixtures/guided-naive-solutions/jump-if-ready.xml`
  - `tests/unit/fixtures/guided-naive-solutions/my-side-their-side.xml`
  - `tests/unit/fixtures/guided-naive-solutions/freeze-the-lane.xml`

## Changed Files
- [level-16-jump-if-ready.js](file:///c:/AI/BrowserBattlegorithms/src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js)
- [level-18-stay-still-can-do-something.js](file:///c:/AI/BrowserBattlegorithms/src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js)
- [level-20-my-side-their-side.js](file:///c:/AI/BrowserBattlegorithms/src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js)
- [level-21-freeze-the-lane.js](file:///c:/AI/BrowserBattlegorithms/src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js)
- [jump-if-ready.xml](file:///c:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-naive-solutions/jump-if-ready.xml)
- [my-side-their-side.xml](file:///c:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-naive-solutions/my-side-their-side.xml)
- [freeze-the-lane.xml](file:///c:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-naive-solutions/freeze-the-lane.xml)

## Run Validations
- **Level Linter (`node scripts/lint-levels.js`)**: Passed.
- **Level Readiness (`node scripts/level-readiness.js --level <id>`)**: Passed for all four target levels.
- **Unit Tests (`npm test`)**: All 96 tests passed.
- **Vite Build (`node node_modules/vite/bin/vite.js build`)**: Built successfully.
- **Dossiers & Behavior Evidence (`node scripts/level-dossiers.js; node scripts/level-behavior-evidence.js`)**: Regenerated successfully. Verified naive solutions correctly fail with `turn_limit_exceeded` / capture.

## Status
All tasks are completed and successfully verified. Ready for integration.
