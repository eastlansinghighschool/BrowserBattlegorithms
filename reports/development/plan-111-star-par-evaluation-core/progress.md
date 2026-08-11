# Progress Report: Plan 111 — Star/Par Evaluation Core And Tracker Population

## Overall Summary

Implemented Plan 111 (Star/Par Evaluation Core And Tracker Population), building the data foundation for stars, par evaluation, criterion evaluation, and durable learning ledger population.

- Created `src/core/starEvaluation.js` containing pure star evaluation logic (`evaluateLevelStars`) and an extensible criterion evaluator registry (`registerCriterionEvaluator`, `getCriterionEvaluator`, `concept-used`).
- Added optional `starCriteria` metadata to pilot level definitions in `src/config/levels/phases/movement-helpers/`:
  - `bring-it-home` (`turnPar: 25`)
  - `enemy-nearby` (`turnPar: 10`)
  - `jump-the-gap` (`turnPar: 3`)
  - `move-toward-flag` (S12 fully protected baseline: pass-star-only, no `starCriteria`)
- Updated `src/config/levels/index.js` to preserve `starCriteria` in level normalization.
- Wired star evaluation into the end-of-level path (`completeLevel` -> `recordLevelEnded`) in `src/usage/usageTracker.js` and durable ledger update in `src/usage/learningLedger.js`.
- Enforced monotonic aggregate star tracking in the durable learning ledger (`starsEarned`, `parBeaten`, `turnPar`, `masteryAchieved`, `masteryCriterionId`).
- Documented par boundary rules (`turnsSpent <= turnPar`), fail-case behavior (0 stars earned, star outcome fields omitted), and 2-star max pilot decisions in `docs/subsystems/usage-and-admin.md`.
- Added unit tests in `tests/unit/star-evaluation.test.js` and registered the new test file in `package.json`.

## Files Changed

- `src/core/starEvaluation.js` (NEW): Pure star evaluation core and criterion registry.
- `src/config/levels/index.js`: Preserves `starCriteria` in `getLevelDefinitions()`.
- `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`: Authored `starCriteria` (`turnPar: 25`, 2-star max comment).
- `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js`: Authored `starCriteria` (`turnPar: 10`, 2-star max comment).
- `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js`: Authored `starCriteria` (`turnPar: 3`, 2-star max comment).
- `src/usage/usageTracker.js`: Evaluates stars on `recordLevelEnded` and attaches star outcome fields to `level_completed` payload.
- `src/usage/learningLedger.js`: Records star outcome fields on guided ledger entries (`starsEarned`, `parBeaten`, `turnPar`, `masteryAchieved`, `masteryCriterionId`).
- `docs/subsystems/usage-and-admin.md`: Documented Plan 111 star evaluation rules, `turnsSpent <= turnPar` boundary, fail-case behavior, and 2-star max pilot choices.
- `package.json`: Registered `tests/unit/star-evaluation.test.js` in `test:unit`.
- `tests/unit/helpers/testHarness.js`: Initialized usage tracking in `runGuidedLevelWithSolution` for end-of-level ledger path testing.
- `tests/unit/star-evaluation.test.js` (NEW): Unit test suite covering pure evaluator, boundary conditions, unknown criterion fail-open, and end-of-level ledger integration.

## Artifacts Produced

- `reports/development/plan-111-star-par-evaluation-core/progress.md` (this report)
- Empirical concept-optionality test script output (saved in scratch workspace) confirming mandatory concept status across pilot levels.

## Commands Run and Results

1. `node scripts/dev/plan-status.js check plan-111`
   - Exit code: 0 (`RUNNABLE`).
2. `node --test tests/unit/star-evaluation.test.js`
   - Exit code: 0 (6/6 tests passed).
3. `npm test`
   - Exit code: 0 (542/542 unit tests passed).
4. `npm run build`
   - Exit code: 0 (Vite static build succeeded).
5. `npm run lint:levels`
   - Exit code: 0 (0 errors, 51 warnings — count corrected at orchestrator review; no new warnings are attributable to this packet).

## Validation Checks Performed

- [x] Gate approval: Owner signed off on schema shape, generous par values (25, 10, 3), `turnsSpent <= turnPar` rule, and 2-star max pilot decisions.
- [x] Pure evaluator respects closed vocabulary, S12 protected levels, and absent metadata.
- [x] Criterion registry handles unknown IDs safely (fails open without throwing exceptions).
- [x] Ledger population proven through real end-of-level path (`completeLevel` -> `recordLevelEnded`).
- [x] Monotonic ledger updates preserve best star counts across multiple attempts in a session.
- [x] `npm test`, `npm run build`, `npm run lint:levels` pass cleanly.
- [x] `docs/subsystems/usage-and-admin.md` updated in the same patch.

## Problems Encountered and How Resolved

1. **Arithmetic mismatch in initial proposal:**
   - *Problem:* Proposal listed `bring-it-home` turnPar as 24, but formula `21 + max(2, ceil(21 * 0.15))` yields 25.
   - *Resolution:* Corrected turnPar to 25 and aligned formula and table per owner gate requirement.
2. **Discriminating power for mastery criteria on pilot levels:**
   - *Problem:* Empirical simulations proved all 3 non-protected pilot levels require their core concept to pass (100% concept-mandatory), so `concept-used` would award Star 3 to every pass.
   - *Resolution:* Per owner decision (2026-08-05 decision log entry), pilot levels are designated as 2-star max (`turnPar` only, no `masteryCriterionId`). `concept-used` was implemented in the registry for Plan 113 where concepts are optional.

## Remaining Risks or Follow-ups

- **Plan 112 (Star UI):** Visual star rendering (level picker pills, end-of-level result banner) relies on the `starsEarned`, `parBeaten`, `turnPar` ledger fields populated by this packet.
- **Plan 113 (Campaign-wide Authoring):** Campaign-wide par and mastery criterion authoring across all runnable levels will build on the metadata schema and evaluator registry established here.

## Ready for Orchestrator Review

**Yes.** All tasks, tests, build validations, and subsystem documentation updates are complete and verified.
