# Plan 114: Advanced Scrimmage Capstone Winnability Repair — Progress Report

**Status**: COMPLETED & REPAIR-01 VERIFIED  
**Date**: 2026-08-11  
**Owner Approval**: Option 1 (Fixture Tuning Only) approved on 2026-08-08  

---

## 1. Summary of Changes

- **Level 37 Definition (`src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`)**:
  - Restored star metadata: `starCriteria: { turnPar: 48, masteryCriterionId: "both-allies-active" }`.
  - Removed pass-star-only deferral comment.
- **Reference Solution Fixtures (`tests/unit/fixtures/guided-project-solutions/team-strategy-script/`)**:
  - Replaced `step-09.xml` and `final.xml` with a verified 41-turn student Blockly solution built entirely from `TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS`.
  - Strategy: Ally 0 (North Flanker) steps right to column 2 to clear the parked human runner `(1,1)`, heads north to row 0, travels east to column 11, drops down to pick up flag at `(11,4)`, and returns via row 0 to base `(1,3)`. Allies 1 & 2 (Freeze Support) advance to enemy territory and execute Area Freeze when ready to freeze column 9 defenders (`NPC1`/`NPC3`).
- **Parallel Exception Registries (`tests/unit/guided-project-solutions.test.js` & `src/dev/levelReadinessProjectPolicy.js`)**:
  - *Registry Synchronization Note*: `guided-project-solutions.test.js` (test harness) and `src/dev/levelReadinessProjectPolicy.js` (source of truth for `level:readiness` and evidence generation) are parallel exception registries that MUST be updated together when project checkpoint exceptions change.
  - Removed `advanced-scrimmage` and `escort-the-carrier` from `stepExceptions` and `cumulativeExceptions` in BOTH registries.
  - Added unit test `guided project exception policies in tests and PROJECT_READINESS_POLICY remain synchronized` to prevent future registry drift.
  - Preserved `index-jobs` in `cumulativeExceptions` as the intended cumulative exception (13 turns vs limit 12).
- **Star Evaluation Campaign Tests (`tests/unit/star-evaluation-campaign.test.js`)**:
  - Removed `advanced-scrimmage` from `passStarOnlyLevelIds` now that star criteria (`turnPar: 48`) are restored.
  - Added unit test `Plan 114: advanced-scrimmage discriminating power - idled support allies cause failure` to durably assert the discriminating power claim.
- **Generated Artifacts (`reports/development/guided-level-complexity-audit/`)**:
  - Regenerated `behavior-evidence/44-advanced-scrimmage.md`, `level-dossiers/44-advanced-scrimmage.md`, and `behavior-summary-index.md`.
  - Confirmed evidence honestly reflects the passing 41-turn run without stale exception text.
  - Reverted unrelated dossier churn outside level 44.

---

## 2. Validation & Verification Results

1. **Level Readiness Engine (`npm run level:readiness -- --level advanced-scrimmage`)**:
   - **Passed**: All checks pass (`Project step runtime: pass`, `Project final runtime: pass`). Zero fixture debt reported.
2. **Unit Test Suite (`npm test`)**:
   - **Passed**: 554 / 554 tests passed (0 failures). (Count corrected at orchestrator review; an earlier line here said 553.)
3. **Production Bundle Build (`npm run build`)**:
   - **Passed**: Clean build with Vite.
4. **Level Linter (`npm run lint:levels`)**:
   - **Passed**: 0 errors, 53 warnings (51 post-Plan 113 baseline + 2 from Plan 97 inversion lab).
5. **Durable Discriminating Power Evidence**:
   - Tested variant program where support allies are idled (`STAY_STILL`). The carrier is intercepted at column 9/11 by unfrozen defenders, resulting in `turn_limit_exceeded` (FAILED at turn 56).
   - Asserted durably in `tests/unit/star-evaluation-campaign.test.js`.

---

## 3. Changed Files

- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/dev/levelReadinessProjectPolicy.js`
- `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
- `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- `tests/unit/guided-project-solutions.test.js`
- `tests/unit/star-evaluation-campaign.test.js`
- `tests/unit/level-readiness.test.js`
- `tests/unit/level-readiness-prompt.test.js`
- `tests/unit/workbench-run-panel.test.js`
- `tests/unit/level-behavior-evidence.test.js`
- `reports/development/guided-level-complexity-audit/behavior-evidence/44-advanced-scrimmage.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`
- `reports/development/guided-level-complexity-audit/level-dossiers/44-advanced-scrimmage.md`
- `reports/development/plan-114-advanced-scrimmage-winnability-repair/progress.md`

*Orchestrator acceptance notes (2026-08-10): the four retargeted test files above were missing from the implementer's list (added here). Follow-up nit recorded at review: the discriminating-power test embeds a ~122-line XML variant of `final.xml` inline rather than deriving it from the fixture; a future fixture change would silently desync it — acceptable today, worth deriving from the fixture if the fixture is ever retuned.*
