# Plan 114: Advanced Scrimmage Capstone Winnability Repair — Progress Report

**Status**: COMPLETED & INTEGRATED  
**Date**: 2026-08-10  
**Owner Approval**: Option 1 (Fixture Tuning Only) approved on 2026-08-10  

---

## 1. Summary of Changes

- **Level 37 Definition (`src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`)**:
  - Restored star metadata: `starCriteria: { turnPar: 48, masteryCriterionId: "both-allies-active" }`.
  - Removed pass-star-only deferral comment.
- **Reference Solution Fixtures (`tests/unit/fixtures/guided-project-solutions/team-strategy-script/`)**:
  - Replaced `step-09.xml` and `final.xml` with a verified 41-turn student Blockly solution built entirely from `TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS`.
  - Strategy: Ally 0 (North Flanker) steps right to column 2 to clear the parked human runner `(1,1)`, heads north to row 0, travels east to column 11, drops down to pick up flag at `(11,4)`, and returns via row 0 to base `(1,3)`. Allies 1 & 2 (Freeze Support) advance to enemy territory and execute Area Freeze when ready to freeze column 9 defenders (`NPC1`/`NPC3`).
- **Guided Project Solutions Tests (`tests/unit/guided-project-solutions.test.js`)**:
  - Removed `advanced-scrimmage` from `stepExceptions` and `cumulativeExceptions`.
  - Removed `escort-the-carrier` from `cumulativeExceptions` (now passes under the new cumulative final program).
  - Preserved `index-jobs` in `cumulativeExceptions` as the intended cumulative exception (13 turns vs limit 12).
- **Star Evaluation Campaign Tests (`tests/unit/star-evaluation-campaign.test.js`)**:
  - Removed `advanced-scrimmage` from `passStarOnlyLevelIds` now that star criteria (`turnPar: 48`) are restored.
- **Generated Artifacts (`reports/development/guided-level-complexity-audit/`)**:
  - Regenerated `behavior-evidence/44-advanced-scrimmage.md`, `level-dossiers/44-advanced-scrimmage.md`, and `behavior-summary-index.md`.
  - Reverted unrelated dossier churn outside level 44.

---

## 2. Validation & Verification Results

1. **Unit Test Suite (`npm test`)**:
   - **Passed**: 552 / 552 tests passed (0 failures).
2. **Production Bundle Build (`npm run build`)**:
   - **Passed**: Clean build with Vite.
3. **Level Linter (`npm run lint:levels`)**:
   - **Passed**: 0 errors, 47 pre-existing warnings.
4. **Discriminating Power Evidence**:
   - Verified that if support allies stay still, `NPC1`/`NPC3` intercept Ally 0 at column 9/11 before Ally 0 can return with the flag. Multi-ally participation is required for the 41-turn win, fulfilling the `both-allies-active` mastery criterion.

---

## 3. Changed Files

- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
- `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- `tests/unit/guided-project-solutions.test.js`
- `tests/unit/star-evaluation-campaign.test.js`
- `reports/development/guided-level-complexity-audit/behavior-evidence/44-advanced-scrimmage.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`
- `reports/development/guided-level-complexity-audit/level-dossiers/44-advanced-scrimmage.md`
- `reports/development/plan-114-advanced-scrimmage-winnability-repair/progress.md`
