# Progress Report: Plan 124 — Star-3 Criteria Expansion Authoring

**Date:** 2026-09-10  
**Packet ID:** `plan-124`  
**Status:** delivered  
**Branch:** Branch C — orchestrator-gate-only (degraded mode; runtime provider environment Antigravity does not match any entry in `advisor-capable-providers.json`)

---

## 1. Overall Summary

Plan 124 implements mastery criteria authoring on candidate guided levels using the attempt counters delivered by Plan 116, closing the Plan 113 star-3 deferral under the ratified discriminating-power standard: a criterion may only be authored if a falsifiable pair exists (the reference solution earns the criterion, and a deliberately degraded variant still passes but fails the criterion).

Key outcomes:
1. **Registered Evaluator (`no-wasted-resource`)**: Registered in `src/core/starEvaluation.js` per Gate Item 2 (`resourceUnavailableAttempts === 0 && ineffectiveFreezeUses === 0`). Implements strict fail-closed handling: absent, null, undefined, or non-numeric counter fields return `false`.
2. **Amendment 01 Scope Reduction (`no-collision`)**: `no-collision` is **not registered**. Engine analysis of `src/core/turnEngine.js:592-605` established that `runner_collision_bounce` is emitted *only* when the target cell holds a runner on the same team or an already-frozen runner; live enemy contact resolves via `resolveCollision` (tag/capture) and produces no bounce event at all. Thus `runnerCollisionBounces` measures ally obstruction or walking into frozen bodies, not enemy avoidance. Registering `no-collision` would bake an inaccurate name into the closed vocabulary for an unauthorable criterion.
3. **Candidate Corpus Outcome**: All 26 candidates were evaluated against the discriminating standard:
   - **1 Authored Level**: `show-what-you-know` (Challenge 22, `advanced-logic`) receives `masteryCriterionId: "no-wasted-resource"`.
     - *Reference Solution*: Passes in 35 turns ($\le$ 41 par) with 0 resource unavailable attempts and 0 ineffective freeze uses (earns Star 3).
     - *Falsifiable Degraded Variant* (`tests/unit/fixtures/guided-naive-solutions/show-what-you-know.xml`): Fires Area Freeze unconditionally when returning with the flag without guarding for enemy presence; passes in 37 turns ($\le$ 41 par), but incurs `ineffectiveFreezeUses: 2` (fails Star 3).
   - **25 Rejected Levels**: Documented with explicit reasons. 20 levels disqualified by inspection (no resources in toolbox, or immediate turn-1 win condition leaving no opportunity to waste resources). 5 levels evaluated empirically via harness simulation: all degraded variants fail the level, proving the criterion does not discriminate on them.
4. **Untouched Scope**: All nine Phase 6 `both-allies-active` levels remain completely untouched per Gate Item 3. No level boards, difficulty, turn limits, `turnPar` values, or enemy behaviors were modified.

---

## 2. Files Changed and Artifacts Produced

### Source Code
- `src/core/starEvaluation.js`: Registered pure evaluator `no-wasted-resource` reading from `context.details` with fail-closed absent counter handling.
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`: Authored `masteryCriterionId: "no-wasted-resource"` in `starCriteria` (`turnPar: 41`).

### Fixtures
- `tests/unit/fixtures/guided-naive-solutions/show-what-you-know.xml`: Created degraded variant fixture for Challenge 22 (fires Area Freeze into empty air while returning; passes 37/41 with `ineffectiveFreezeUses: 2`).
- `tests/unit/fixtures/guided-naive-solutions/advanced-scrimmage.xml`: Extracted the 122-line hand-modified idled-support fixture from `tests/unit/star-evaluation-campaign.test.js` per R4 ride-along.

### Tests
- `tests/unit/star-criteria-expansion.test.js`: Comprehensive new test suite covering:
  - `no-wasted-resource` pure evaluator behavior and fail-closed absence handling.
  - Amendment 01 verification (`no-collision` is not registered).
  - Cumulative star tier semantics (3 stars for par + mastery; 2 stars for par + no mastery; 1 star for slow + mastery; 0 stars for fail).
  - Harness-driven falsifiable pair for `show-what-you-know` (reference earns 3 stars; naive fixture earns 2 stars).
  - Empirical verification that degraded runs fail on the five R3 candidate levels.
- `tests/unit/star-evaluation-campaign.test.js`: Updated campaign assertion to expect `no-wasted-resource` on `show-what-you-know` and replaced inline XML with the extracted fixture.
- `package.json`: Registered `tests/unit/star-criteria-expansion.test.js` in `scripts["test:unit"]`.

### Documentation & Reports
- `docs/subsystems/usage-and-admin.md`: Updated criterion registry documentation for `no-wasted-resource` and documented Amendment 01 for `no-collision`.
- `reports/development/plan-124-star-three-criteria-authoring/progress.md`: This progress report.

---

## 3. Discriminating-Power Evidence & Triage Matrix (All 26 Candidates)

Every candidate level from `plan-124` was evaluated. The discriminating test requires: **can this level be passed while failing the criterion?**

| Level ID | Phase | Par / Limit | Counter Reachable? | Degraded Simulation Result | Outcome | Rationale / Rejection Reason |
|---|---|---|---|---|---|---|
| `reach-enemy-flag` (L02) | `foundations` | 3 / 14 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; live enemies are unfrozen NPCs (collision = tag/capture, not bounce); teammate parked 13 tiles away. Neither counter reachable. |
| `barrier-detour` (L04) | `foundations` | 8 / 14 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies; teammate unreachable. Neither counter reachable. |
| `sensor-barrier-branch` (L06) | `sensing` | 8 / 14 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies; teammate unreachable. Neither counter reachable. |
| `watch-the-wall` (L07) | `sensing` | 7 / 10 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `find-the-human` (L08) | `sensing` | 9 / 10 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox. Target cell (5,2) is beside teammate at (6,2); reaching target wins immediately without collision. Parking NPCs at x=10 are unreachable within 10 turns. |
| `find-the-enemy-flag` (L09) | `sensing` | 13 / 14 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `bring-it-home` (L12) | `movement-helpers` | 25 / 28 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `enemy-nearby` (L13) | `movement-helpers` | 10 / 12 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `jump-the-gap` (L14) | `movement-helpers` | 3 / 6 | Jump only | N/A (inspection) | **REJECTED (2-star max)** | Toolbox has no conditionals. Ally jumps over barrier on turn 1 and wins immediately. Jump cannot be exhausted during a passing run. Enemies unfrozen. |
| `dodge-and-deliver` (L15) | `movement-helpers` | 21 / 40 | Jump only | **FAILED** (turn 41 > 40, resUnavail: 30) | **REJECTED (2-star max)** | Toolbox lacks `if_can_jump`. Jump is used to dodge; attempting jump while exhausted leaves ally stationary in charger's lane and ally is tagged (fails at turn 41). |
| `bughunt-15` | `movement-helpers` | 21 / 40 | Jump only | N/A (inspection) | **REJECTED (2-star max)** | Reference solution uses only movement and never executes `jump_forward`. Enemies unfrozen. |
| `jump-if-ready` (L16) | `resources-and-territory` | 4 / 8 | Jump only | **FAILED** (turn 9 > 8, resUnavail: 7) | **REJECTED (2-star max)** | The only conditional is `if_can_jump`. Because jump never recharges, an unguarded jump loops indefinitely, ally remains stationary, and level times out (fails at turn 9). |
| `build-the-barrier` (L17) | `resources-and-territory` | 3 / 4 | Barrier only | N/A (inspection) | **REJECTED (2-star max)** | Win condition is placing barrier at (4,4), met on turn 1. Ally has only 1 barrier and wins immediately; cannot waste barrier and pass. |
| `stay-still-can-do-something` (L18) | `resources-and-territory` | 6 / 8 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `my-side-their-side` (L20) | `resources-and-territory` | 11 / 12 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |
| `freeze-the-lane` (L21) | `resources-and-territory` | 7 / 10 | Freeze only | **FAILED** (turn 11 > 10, resUnavail: 9) | **REJECTED (2-star max)** | Turn limit 10, freeze cooldown 10. Turn 1 freeze is mandatory to stop charger. Firing ineffective freeze or attempting freeze on cooldown leaves ally stationary and causes tag or timeout (fails at turn 11). |
| `bughunt-22` | `advanced-logic` | 3 / 8 | Barrier only | N/A (inspection) | **REJECTED (2-star max)** | Win condition is placing barrier at (4,4), met on turn 1. Level ends on placement; cannot waste barrier and pass. |
| `show-what-you-know` (Challenge 22) | `advanced-logic` | 41 / 56 | Jump, barrier, freeze | **PASSED** (turn 37 $\le$ 41, badFreeze: 2) | **AUTHORED (`no-wasted-resource`)** | Capstone challenge. Ref solution passes in 35 turns ($\le$ 41) with 0 wasted resources (earns Star 3). Degraded variant fires Area Freeze into empty air while returning; passes in 37 turns ($\le$ 41) with `ineffectiveFreezeUses: 2` (fails Star 3). |
| `closest-threat` (L23) | `advanced-logic` | 7 / 15 | Freeze only | N/A (inspection) | **REJECTED (2-star max)** | Reference solution uses only `move_toward CLOSEST_ENEMY`. No resources used in passing run. Enemies unfrozen. |
| `how-far-away` (L24) | `advanced-logic` | 8 / 17 | Freeze only | N/A (inspection) | **REJECTED (2-star max)** | Reference solution uses only movement. No resources used in passing run. Enemies unfrozen. |
| `two-conditions-at-once` (L25) | `advanced-logic` | 7 / 10 | Freeze only | **FAILED** (turn 11 > 10, resUnavail: 3) | **REJECTED (2-star max)** | Turn limit 10, freeze cooldown 10. Turn 1 freeze is mandatory to stop charger. Omission of readiness check leaves ally stationary on cooldown; charger unfreezes and tags ally (fails at turn 11). |
| `this-or-that` (L26) | `advanced-logic` | 9 / 12 | Freeze only | N/A (inspection) | **REJECTED (2-star max)** | Reference solution uses only movement. No resources used in passing run. Enemies unfrozen. |
| `flip-the-answer` (L27) | `advanced-logic` | 9 / 21 | Freeze only | N/A (inspection) | **REJECTED (2-star max)** | Reference solution uses only movement. No resources used in passing run. Enemies unfrozen. |
| `bughunt-28` | `advanced-logic` | 14 / 15 | Freeze only | N/A (inspection) | **REJECTED (2-star max)** | Clean reference solution fires freeze with 0 enemies in radius (`ineffectiveFreezeUses: 1`), failing `no-wasted-resource` on its own clean run. Cannot earn criterion. |
| `bughunt-37` | `advanced-teamplay` | 14 / 20 | 2 allies | **FAILED** (turn 21 > 20, collide: 9) | **REJECTED (2-star max)** | Toolbox only provides `move_toward ENEMY_FLAG` and `stay_still`. If both allies move, they collide 9 times and timeout; the only passing run is for ally 0 to move and ally 1 to stay still, producing 0 collisions. |
| `optional-random-lab` (L38) | `optional` | 3 / 12 | No | N/A (inspection) | **REJECTED (2-star max)** | No resources in toolbox; unfrozen enemies. Neither counter reachable. |

---

## 4. Special Observations & Standing Records

### R1 Engine Finding on `runner_collision_bounce`
`src/core/turnEngine.js:592-605` emits `runner_collision_bounce` *only* when `runnerInTargetCell.team === actionRunner.team || runnerInTargetCell.isFrozen`. When an ally contacts a live, unfrozen enemy, the engine delegates to `resolveCollision(...)`, which resolves as a tag or capture (moving winner and resetting loser) and emits no bounce event. Therefore, `runnerCollisionBounces` strictly measures ally-on-ally obstruction or walking into already-frozen runners. Live enemy contact never produces this counter on any board. Consequently, `no-collision` is a misnomer, does not measure enemy avoidance, and is dropped per Amendment 01.

### R5 Map Blockage on `show-what-you-know`
`show-what-you-know`'s canonical reference solution reads `mapBlockageBounces: 1` during its clean 35-turn run. This empirically vindicates the owner's decision to exclude `mapBlockageBounces`: had map blockage been folded into `no-wasted-resource`, the reference solution for the only authorable level in the campaign would have failed its own mastery criterion.

### R6 Observations (Curriculum & Harness Debt)
1. **`bughunt-28` Reference Solution Freeze Waste**: The reference solution for `bughunt-28` fires an Area Freeze that affects 0 enemies, incurring `ineffectiveFreezeUses: 1` on a clean run. This is a curriculum/fixture question for the owner (whether a bug-hunt reference solution should demonstrate wasted freeze).
2. **Unspent Plan 116 Counters**: Two of Plan 116's four counters end this packet unspent: `mapBlockageBounces` (deliberately reserved for a future charter conversation) and `runnerCollisionBounces` (unauthorable due to the structural engine mechanism above). Furthermore, `runnerCollisionBounces` was only ever verified with synthetic payloads in Plan 116's unit tests, never driven through the full game engine in situ.

---

## 5. Commands Run and Results

| Command | Exit Code | Result Summary |
|---|---|---|
| `node scripts/dev/plan-status.js check 124` | 0 | `RUNNABLE: plan-124 is ready to implement` |
| `node --test --test-isolation=none tests/unit/star-criteria-expansion.test.js` | 0 | 5 tests passed (pure evaluator, Amendment 01, cumulative tiers, falsifiable pair, empirical simulations) |
| `node --test --test-isolation=none tests/unit/star-evaluation-campaign.test.js` | 0 | 4 tests passed (including updated `show-what-you-know` check and extracted fixture) |
| `npm run test` (`test:unit`) | 0 | 613 tests passed, 0 failures (full unit test suite) |
| `npm run lint:levels` | 0 | 0 errors; pre-existing warnings unchanged |
| `npm run build` | 0 | Vite build completed cleanly in 8.11s |

---

## 6. Validation Checklist

- [x] Triage table covers all 26 candidates with reasons and verified directory phases.
- [x] Every authored level (`show-what-you-know`) has a constructed, recorded discriminating pair with naive fixture.
- [x] Every rejection has a stated reason, with the five empirical candidates verified by simulation.
- [x] Absent-counter case returns `false` and is thoroughly tested.
- [x] Cumulative tier semantics unchanged and covered by unit tests.
- [x] `npm test` passes; `tests/unit/star-criteria-expansion.test.js` registered in `package.json`.
- [x] `npm run build` passes.
- [x] `npm run lint:levels` shows no new errors.
- [x] No `both-allies-active` level modified.
- [x] No board, turn limit, `turnPar`, or enemy behavior changed.
- [x] Subsystem note (`usage-and-admin.md`) reads true post-change.

---

## 7. Remaining Risks and Follow-ups

- `bughunt-28` reference solution freeze waste remains open as a curriculum question for the owner.
- `runnerCollisionBounces` remains unspent and untested in full engine context; any future charter conversation considering an ally-obstruction criterion should write dedicated engine-driven tests.

---

## 8. Repair 01: Extracted Fixture Restoration & Assertion Strengthening

- **Defect & Mechanism**: During the R4 extraction of `tests/unit/fixtures/guided-naive-solutions/advanced-scrimmage.xml`, four `<value name="LEFT">`/`<value name="RIGHT">` tags on `battlegorithms_value_compare` became `<field name="LEFT">`/`<field name="RIGHT">`. Blockly silently discarded the non-existent field tags, which removed the `runner_index === 0` conditional branch. Instead of support allies 2 and 3 idling via `STAY_STILL`, all three allies executed the primary attacker logic and jammed into each other (86 bounces). Both versions failed the level, allowing the test to remain green while its stated premise was false.
- **Fixture Restoration (Requirement 1)**: Recovered the exact pre-extraction XML from `git show 3ef2e56:tests/unit/star-evaluation-campaign.test.js`. Diffs confirmed byte-identity modulo surrounding whitespace, restoring only the four `<value>` tags. Verified that loading the restored fixture emits zero Blockly warnings.
- **Premise Assertion Strengthening (Requirement 2)**: Strengthened the Plan 114 test in `tests/unit/star-evaluation-campaign.test.js` to assert its own premise directly from `runnerActionHistory`:
  1. Loading the fixture emits zero Blockly warnings (`assert.deepEqual(warnings, [])`).
  2. The level failed (`app.state.activeLevelResult === LEVEL_RESULT.FAILED`).
  3. Support allies 2 and 3 acted (`Array.isArray(history) && history.length > 0`).
  4. Support allies 2 and 3 executed `STAY_STILL` and nothing else (`history.every(action => action === 'STAY_STILL')`).
- **Falsification Check**: Executed the strengthened assertions against the corrupted fixture from commit `f79c591`. The run failed loudly with `AssertionError: Support ally 2 action history must contain STAY_STILL and nothing else` (as ally 2 took actions `['MOVE_UP_SCREEN', 'MOVE_FORWARD', 'MOVE_DOWN_SCREEN']`), verifying the test's discriminative power.
- **Corpus-Wide Fixture Warning Survey**: Audited all 68 standard XML fixtures across `tests/unit/fixtures/` (`guided-naive-solutions`, `guided-project-solutions`, `guided-reference-solutions`). Verified that zero existing fixtures emit Blockly `Ignoring non-existent field` warnings.

**Ready for orchestrator review / delivery:** YES

