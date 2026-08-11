# Plan 113 Progress Report: Campaign-Wide Par And Mastery Authoring

## Overview
- **Plan ID:** `plan-113-campaign-par-mastery-authoring`
- **Status:** Complete (Implementation validated and integrated)
- **Scope:** Authoring campaign-wide generous turn pars (`turnPar`) and mastery criteria (`masteryCriterionId`) across all 46 guided levels, registering the `both-allies-active` evaluator, adjusting turn limits for `bughunt-28` and `index-jobs`, deferring star metadata on `advanced-scrimmage`, and adding comprehensive unit test verification.

---

## What Changed

1. **Pure Star Evaluator & Wiring (`src/core/starEvaluation.js`, `src/core/levels.js`, `src/usage/usageTracker.js`):**
   - Registered `both-allies-active` in `CRITERION_EVALUATORS` registry.
   - Evaluator reads `appState.allRunners` team metadata (`runner.team === 1 && !runner.isHumanControlled && !runner.isNPC`) and verifies that every player-team ally has executed at least one action (`runnerActionHistory[runner.id].length > 0`), counting `STAY_STILL` as active.
   - Explicitly wired `appState: state` in `src/core/levels.js` (`endLevel`) and `appState: app.state` in `src/usage/usageTracker.js` (`recordLevelEnded`).

2. **Turn Limit Bumps & Authored Metadata (`src/config/levels/phases/`):**
   - **`bughunt-28`:** `maxTurns` bumped 12 -> **15**, `turnPar: 14` (2-star max).
   - **`index-jobs`:** `maxTurns` bumped 10 -> **12**, `turnPar: 11`, `masteryCriterionId: "both-allies-active"`.
   - **Phase 6 Levels 29, 31–36 (`one-program-two-allies`, `first-two-defend`, `escort-the-carrier`, `closest-enemy-defender`, `freeze-support`, `barrier-specialist`, `jump-team`):** `turnPar` authored with `masteryCriterionId: "both-allies-active"`.
   - **All 26 other runnable guided levels:** Authored `turnPar` matching the approved generous formula (`refTurns + max(2, ceil(refTurns * 0.15))`, decision log 2026-08-05; corrected at orchestrator review — an earlier line here misstated the formula) with explicit 2-star max level comments.
   - **`advanced-scrimmage`:** Deferred star metadata with level comment citing step-9 fixture debt (`guided-project-solutions.test.js:31-45`).
   - **5 S12 fully protected levels & 7 non-runnable/human-input levels:** Preserved as pass-star-only with explicit level comments.

3. **Unit Tests & Test Suite (`tests/unit/star-evaluation-campaign.test.js`, `package.json`):**
   - Created `tests/unit/star-evaluation-campaign.test.js` validating all 34 authored level turn pars (count corrected at orchestrator review), turnPar < turnLimit contract, pass-star-only level treatments, and `both-allies-active` evaluator team metadata behavior (STAY_STILL active counting, single ally failure, non-standard runner ID handling).
   - Registered `tests/unit/star-evaluation-campaign.test.js` in `package.json` under `test:unit`.

---

## Verification Results

1. **Unit Tests (`npm test`):**
   - Result: **549 / 549 tests passing** (0 failures).

2. **Level Linter (`npm run lint:levels`):**
   - Result: **Exit code 0** (0 errors, 51 pre-existing warnings, 0 new warnings).

3. **Production Build (`npm run build`):**
   - Result: **Exit code 0** (successful Vite build).

---

## Changed Files

- `src/core/starEvaluation.js`
- `src/core/levels.js`
- `src/usage/usageTracker.js`
- `src/config/levels/phases/foundations/level-01-move-to-target.js`
- `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js`
- `src/config/levels/phases/foundations/level-03-score-a-point.js`
- `src/config/levels/phases/foundations/level-04-barrier-detour.js`
- `src/config/levels/phases/foundations/level-05-mirror-forward.js`
- `src/config/levels/phases/sensing/prediction-06-first-move.js`
- `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`
- `src/config/levels/phases/sensing/level-07-watch-the-wall.js`
- `src/config/levels/phases/sensing/level-08-find-the-human.js`
- `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js`
- `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`
- `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`
- `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
- `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js`
- `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
- `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
- `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- `src/config/levels/phases/advanced-logic/bughunt-22-readiness-order.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`
- `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
- `src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js`
- `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`
- `src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js`
- `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js`
- `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js`
- `src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js`
- `src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js`
- `src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js`
- `src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js`
- `src/config/levels/phases/advanced-teamplay/level-34-freeze-support.js`
- `src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js`
- `src/config/levels/phases/advanced-teamplay/level-36-jump-team.js`
- `src/config/levels/phases/advanced-teamplay/prediction-31-index-role-split.js`
- `src/config/levels/phases/advanced-teamplay/bughunt-37-role-split.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/phases/optional/level-38-optional-random-lab.js`
- `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`
- `tests/unit/star-evaluation-campaign.test.js`
- `package.json`

---

## Remaining Risks & Follow-ups

- **`advanced-scrimmage` Step 9 Debt:** Level 37 remains pass-star-only with deferred star metadata until step-9 checkpoint fixture debt (`guided-project-solutions.test.js:31-45`) is addressed in a dedicated plan.
- **Future Mastery Criteria (Collision/Waste):** Star 3 criteria beyond `both-allies-active` (such as `no-collision` or `no-wasted-resource`) were explicitly backlog'd by the gate decisions.
