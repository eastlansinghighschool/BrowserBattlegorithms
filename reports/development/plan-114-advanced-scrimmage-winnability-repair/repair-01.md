# Plan 114 Repair Directions (Repair 01)

**Date:** 2026-08-10
**Source:** Orchestration review of the Plan 114 implementation pass (committed as `7ae533c`). Verdict: send back — narrow mechanical repair. The capstone repair itself is excellent and independently verified; what remains is a missed second exception registry, a false lint count, and an unrecorded evidence claim.
**Status of this file:** durable work order for the repair pass. The packet and the gate decision (decision log 2026-08-10, Option 1) remain the contract.

## What the pass got right (do not regress these)

- Both fixtures verified passing at 41 turns within the 55-turn limit (orchestrator-reproduced, twice).
- Gate compliance exact: `maxTurns` unchanged, `starCriteria: { turnPar: 48, masteryCriterionId: "both-allies-active" }`, deferral comment removed, `passStarOnlyLevelIds` updated.
- Escort-the-carrier exception removal verified honest (final fixture passes it in 3 turns, disclosed).
- Index-jobs glance resolved correctly (kept as intended cumulative exception).
- Artifact churn limited to level-44 files.
- Scope clean: exactly the 9 expected files, no evaluator/UI/tracker changes.

## Repair 1 (MAJOR): Remove the stale entries from the SECOND exception registry

- **Defect:** `src/dev/levelReadinessProjectPolicy.js` is a parallel exception registry — the source for `levelBehaviorEvidence.js` and `levelReadiness.js` — and the first pass only edited the test-local maps in `guided-project-solutions.test.js`. It still lists:
  - `advanced-scrimmage` in `stepExceptions` (line 17, with the stale "A reliable capstone solution is pending." text) and in `cumulativeExceptions` (line 27).
  - `escort-the-carrier` in `cumulativeExceptions` (line 24).
- **Consequence already visible:** the regenerated `reports/development/guided-level-complexity-audit/behavior-evidence/44-advanced-scrimmage.md` says "status: documented exception" and quotes "not yet been tuned… pending" WHILE showing the passing 41-turn run; `behavior-summary-index.md` row 44's status column still reads "documented exception". `npm run level:readiness -- --level advanced-scrimmage` likewise reports a fixture debt that no longer exists. The evidence contradicts itself.
- **Fix:** remove the same three entries from `levelReadinessProjectPolicy.js` (mirroring what was correctly done in the test file), then **regenerate the level-44 artifacts again** (`npm run level:dossiers`, `npm run level:behavior-evidence`) so the evidence shows the passing run with an honest status. Zero churn beyond level-44 files — revert anything else the generators touch, as you did correctly in the first pass.
- **Also required:** state in the progress report that the test file and `levelReadinessProjectPolicy.js` are PARALLEL exception registries that must be updated together (so the next packet doesn't inherit this drift). Check whether a unit test should pin that they agree — if a cheap one exists to add (e.g. an assertion that both maps name the same exceptions), add it; if it requires infrastructure, say so instead of building it.

## Repair 2 (MINOR): Correct the lint count in the progress report

- The report says "0 errors, 47 pre-existing warnings." The true count is **0 errors, 53 warnings** (51 post-plan-113 baseline + 2 from plan-97's inversion lab). No new warnings from this packet — but report the real number. This is the third consecutive packet with a wrong lint figure; run the command and quote what it prints.

## Repair 3 (MINOR): Record the discriminating-power evidence durably

- The progress report asserts the `both-allies-active` discriminating check (idled support allies → carrier intercepted) as prose. Orchestrator verified it empirically (freeze actions swapped to stay-still → FAILED at turn 56), but nothing durable records it.
- **Fix:** either (a) add a small unit test to the campaign star suite asserting the discriminating-power claim for advanced-scrimmage (a variant program with support allies idled must FAIL), or (b) record the experiment with its command and output in the progress report. (a) is preferred if it fits the existing suite's harness patterns cheaply.

## Process requirements

- Do NOT run `plan-status.js set` at any status.
- Keep the diff scoped to these repairs.
- If a repair forces a choice this file does not cover, stop and surface.

## Validation gate for the repair pass

1. `levelReadinessProjectPolicy.js` has no `advanced-scrimmage` or `escort-the-carrier` entries (grep-verifiable); the test-file maps stay consistent with it.
2. `npm run level:readiness -- --level advanced-scrimmage` no longer reports the stale fixture debt.
3. Regenerated `behavior-evidence/44-advanced-scrimmage.md` and `behavior-summary-index.md` show the passing 41-turn run with an honest status; zero churn beyond level-44 files.
4. `npm test` passes (report counts); `npm run build` passes; `npm run lint:levels` reports 0 errors / 53 warnings.
5. Discriminating-power evidence is durable (test or recorded experiment).
6. Progress report corrected per Repairs 1–3.
