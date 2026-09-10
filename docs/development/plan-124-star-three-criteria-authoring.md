---
id: plan-124
title: "Star-3 Criteria Expansion Authoring"
status: ready
depends_on: [plan-116]
gate: "before mutation: owner approves the exact counter-to-criterion mappings for no-collision and no-wasted-resource, and confirms that existing both-allies-active levels are out of scope"
superseded_by: null
resolution: null
summary: >-
  Author no-collision and no-wasted-resource mastery criteria on the guided levels where they genuinely discriminate, using the four per-attempt counters plan-116 delivered. Closes the plan-113 deferral that left star 3 existing only on Phase 6 multi-ally levels. Every assignment must carry a falsifiable discriminating-power pair; levels where no honest criterion exists stay 2-star max and are documented as such.
---
# Plan 124: Star-3 Criteria Expansion Authoring

## Packet Metadata

- Packet id: `plan-124`
- Packet title: Star-3 Criteria Expansion Authoring
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-10
- Packet type: implementation (authoring)
- Mutation level: source-code (criterion evaluators, level metadata), tests, docs
- Approval gate: before mutation — owner approves the two counter-to-criterion mappings and the scope boundary (see Gate below).
- Depends on: `plan-116` (complete) — the four counters this packet consumes
- Blocks: nothing. This closes the plan-113 star-3 deferral.
- Expected artifacts:
  - `no-collision` and `no-wasted-resource` evaluators registered in `src/core/starEvaluation.js`
  - `masteryCriterionId` authored on the levels where the criterion discriminates
  - a discriminating-power evidence table in the progress report, covering **every** candidate level including the rejections
  - unit tests: evaluator behaviour, plus a harness-driven discriminating pair per authored level
  - updated `docs/subsystems/usage-and-admin.md` and `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` as applicable
  - progress report
- Progress report folder: `reports/development/plan-124-star-three-criteria-authoring/`
- Progress report file: `reports/development/plan-124-star-three-criteria-authoring/progress.md`

## Packet Summary

Goal: Let star 3 exist somewhere other than Phase 6, on honest evidence.

Non-goals:
- Do not change the star model, tier cumulativity, or `turnPar` values. Plan 111's semantics stand: star 3 requires both `parBeaten` and `masteryAchieved`.
- Do not modify the counters, the event taxonomy, or anything `plan-116` built. This packet is a consumer.
- Do not touch the nine existing `both-allies-active` levels (see Gate item 3).
- Do not add a third new criterion id. `mapBlockageBounces` is available and deliberately unused — see "The fourth counter" below.
- Do not tune level difficulty, turn limits, boards, or enemy behaviour to make a criterion fit. If a level does not discriminate, it does not get a criterion.
- No UI work. Plan 112 already displays whatever the evaluator returns.

Depends on: `plan-116`, complete as of 2026-09-10.

Why this packet exists:
Plan 113's gate audit found that no collision or resource-waste data existed at level end, so every scrimmage and resource level went 2-star max and star 3 ended up existing **only** on Phase 6 multi-ally levels via `both-allies-active`. The owner ratified that shape at the time and deferred the enabling work. `plan-116` has now built it: four per-attempt counters, derived passively inside `emit()`, exposed additively on the end-of-level `details` path the star evaluator already consumes.

The data exists. This packet spends it — carefully, because the easy version of this packet is worthless.

## The standard this packet lives or dies by

The 2026-08-05 discriminating-power decision is the whole difficulty here:

> if the level's mechanic is mandatory to pass at all, `concept-used` awards star 3 to every pass and adds no information.

The same trap applies to the new criteria, in the opposite direction. **If a level has no live enemies, `no-collision` is free** — every passing run earns it, it discriminates nothing, and awarding star 3 for it is a lie told to a student. Likewise `no-wasted-resource` on a level with no resource actions.

So the test for each candidate is: **can this level be passed while failing the criterion?**

- If yes, the criterion discriminates and may be authored.
- If no, the level stays 2-star max and is recorded as such with its reason.

This is deliberately parallel to the S8 degenerate-solution standard, and the symmetry is worth seeing: **S8 proves a mechanic is required; this proves a criterion is avoidable-but-achievable.** Both are falsifiable pairs, and neither is satisfied by a single passing run.

**The evidence method already exists and was just validated.** `plan-116`'s test file drives deliberate collisions, deliberate resource exhaustion, and a deliberately engineered ineffective freeze through `runGuidedLevelWithSolution` — including computing Manhattan distance 5 against `AREA_FREEZE_RADIUS` 2 to guarantee zero affected runners. Use that file as the pattern; it is the reference for how to construct a degraded-but-passing variant.

## Gate (before mutation)

Present to the owner and stop.

### 1. What counts as `no-collision`?

Recommendation: **`runnerCollisionBounces === 0`, and only that.**

The owner's 2026-09-01 four-counter ruling split runner collisions from map blockage precisely so a criteria author could choose. Runner collision is the enemy-sensing concept the living-board levels teach; walking into a wall is a pathing slip from a different lesson, and on most boards it is trivially avoidable and therefore non-discriminating. Folding map blockage back in would undo the split the same week it was made.

### 2. What counts as `no-wasted-resource`?

Recommendation: **`resourceUnavailableAttempts === 0 && ineffectiveFreezeUses === 0`.**

Both are genuinely waste, and they are the two mistakes students actually make with resources: using what you do not have (the missing readiness guard, which already has a learning-moment analogue in `resource_no_readiness_guard`), and using what you do have on nothing. A student who avoids both has demonstrated the resource discipline the phase teaches.

The alternative — splitting these into two criteria — is available but not recommended: a level rarely offers both failure modes, so two ids would mostly be two ways to say the same thing on any given board.

### 3. Are the nine `both-allies-active` levels in scope?

Recommendation: **no.** `masteryCriterionId` is a single string in the level schema, so giving a Phase 6 level a new criterion means *removing* `both-allies-active` from it. That is a re-authoring decision about levels that already work, with no evidence it is wanted. Out of scope; revisit only if the Phase 6 criterion is later found weak.

### Note on the closed vocabulary

The 2026-08-05 decision says expanding the closed criterion vocabulary is a charter conversation, not a packet decision. Adding these two ids **is** an expansion — but it is a pre-authorized one: both were named by plan-113 as the intended additions, the charter's S6 anticipated them, and the owner ratified `plan-116`'s counters for exactly this purpose. Recorded explicitly so nobody concludes the rule was bypassed.

### The fourth counter

`mapBlockageBounces` will be populated and unused by this packet. That is intended. Giving it a criterion would be a genuine vocabulary expansion with no pre-authorization, and no level has yet been shown where it discriminates. Leave the data available and say so in the progress report; a future charter conversation can spend it.

## Authority And Contracts

Required reading:

- `docs/development/plan-116-collision-waste-event-tracking.md` and its progress report — the counter definitions, the `runnerRole === "ally"` scoping, and the attempt boundary.
- `tests/unit/attempt-counters.test.js` — **the pattern for constructing degraded-but-passing harness runs.** Read this before designing any evidence.
- `src/core/starEvaluation.js` — the registry, `registerCriterionEvaluator`, and the two existing evaluators.
- `docs/decision-log.md` — 2026-08-05 entries (star-2 par semantics, discriminating-power standard, pilot levels 2-star max, cumulative tiers) and the 2026-09-01 four-counter ruling.
- `docs/development/plan-113-campaign-par-mastery-authoring.md` and its progress report — the deferral this closes, and the precedent for honest "no criterion" outcomes.
- `docs/development/plan-85-campaign-rewrite-charter.md` S6 and S8.
- `tests/unit/fixtures/guided-naive-solutions/` — existing S8 fixtures, several on resource levels.

Contracts to preserve:

- Star tiers stay cumulative; `starsEarned` is 3 only when both `parBeaten` and `masteryAchieved` hold.
- Criteria must measure something real and must discriminate. "No honest criterion — 2-star max" is a **successful** outcome, not a failure.
- Code golf is not a mastery criterion (S6).
- Game rules, boards, turn limits, enemy behaviour, and level content are untouched.
- One-action-per-turn semantics untouched.

## Scope

In scope:
- Two new evaluators in `src/core/starEvaluation.js`.
- `masteryCriterionId` added to level files where the criterion discriminates.
- Evidence, tests, docs, progress report.

Out of scope:
- The nine `both-allies-active` levels.
- The seven non-runnable levels plan-113 settled as pass-star-only.
- `turnPar` values, board content, difficulty.
- Any change to `plan-116`'s counters or the event taxonomy.

**Candidate corpus.** 26 guided levels currently carry `turnPar` with no `masteryCriterionId`:

```
bughunt-15, bughunt-22, bughunt-28, bughunt-37,
level-02, 04, 06, 07, 08, 09, 12, 13, 14, 15, 16, 17, 18,
level-20, 21, 22, 23, 24, 25, 26, 27, level-38 (optional lab)
```

Do not assume all 26 are real candidates. Most will not be.

## Work Plan

1. **Cheap triage first, before any simulation.** For each of the 26, determine by inspection whether the counter is even *reachable*: does the board have live enemies that can be collided with, and does the level offer resource actions that can be wasted? A level where the counter can never be nonzero is disqualified immediately. Record the triage table with a one-line reason per level. This should eliminate most of the corpus in minutes and is the difference between a tractable packet and an intractable one.
2. **Simulate the survivors.** For each, construct the falsifiable pair with `runGuidedLevelWithSolution`:
   - the reference solution passes **and** earns the criterion;
   - a deliberately degraded variant still passes **and** fails the criterion.
   If the second cannot be constructed, the level does not discriminate.
3. **Author** `masteryCriterionId` only where both halves hold.
4. **Register the two evaluators**, reading the counters from `details`.
5. **Test** — see Implementation Requirements.
6. **Document** every candidate, including rejections and their reasons.
7. Run validation; write the progress report.

## Implementation Requirements

### R1 — The two evaluators

Register `no-collision` and `no-wasted-resource` in `src/core/starEvaluation.js` per the gate-approved mappings, reading from `context.details`.

Constraints:
- Follow the existing evaluator shape: pure, `(context) => boolean`, no side effects.
- **Absent counters must not award the criterion.** If `details` lacks the field — an old record, a path that did not populate it — the evaluator returns `false`. Never treat missing data as a clean run. Test this explicitly; it is the most likely silent-wrong-answer in the packet.
- Do not read game state directly; the evaluator's input is the context it is handed.

### R2 — Per-level discriminating-power evidence

Every authored level carries a falsifiable pair, per the standard above. Every rejected candidate carries a one-line reason.

The progress report must contain a table covering **all 26**, with columns: level, counter reachable (triage), discriminating pair constructed, criterion authored, and reason if not. A reader must be able to see why each rejection was a rejection without rerunning anything.

**Expected outcome: most candidates will be rejected.** If this packet authors criteria on a large majority of the 26, that is a signal the discriminating test was applied too loosely, not a triumph. Say plainly in the report how many were rejected and why.

### R3 — Tests

- Evaluator unit tests, including the absent-counter case from R1.
- For each **authored** level, a harness-driven pair: reference solution earns the criterion; degraded-but-passing variant does not. Model these on `tests/unit/attempt-counters.test.js`.
- A cumulativity check: a run that meets the criterion but misses par earns 1 star with `masteryAchieved: true` recorded, per the 2026-08-05 ruling.
- Register any new test file in `package.json` (explicit list, not a glob).

### R4 — Docs

- `docs/subsystems/usage-and-admin.md`: the two new criterion ids and what they read.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`: update where the matrix records star metadata.
- If any doc states that star 3 exists only on Phase 6 levels, correct it.

## Commands

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run lint:levels
```

## Validation Checklist

- [ ] Triage table covers all 26 candidates with reasons.
- [ ] Every authored level has a constructed, recorded discriminating pair.
- [ ] Every rejection has a stated reason.
- [ ] Absent-counter case returns `false` and is tested.
- [ ] Cumulative tier semantics unchanged and covered.
- [ ] `npm test` passes; new test files registered.
- [ ] `npm run build` passes.
- [ ] `npm run lint:levels` shows no new errors (the two optional-lab untiered warnings are expected and pre-existing).
- [ ] No `both-allies-active` level modified.
- [ ] No board, turn limit, `turnPar`, or enemy behaviour changed.
- [ ] Subsystem note and concept matrix read true post-change.

## Stop Conditions

Stop and ask for review if:

- **no candidate level discriminates** — that is a real possible outcome and it means the star-3 expansion should be reconsidered rather than forced;
- a level would only discriminate if its board, turn limit, or enemy behaviour changed (that is level redesign, not criteria authoring, and it is explicitly out of scope);
- the honest criterion for some level appears to be a `mapBlockageBounces` variant (record it and stop; that needs a charter conversation);
- a criterion appears to reward code golf or punish a legitimate alternative strategy;
- authoring would require modifying an existing `both-allies-active` level;
- the counters turn out to behave differently in a level context than `plan-116`'s tests suggest — report the discrepancy rather than working around it.
