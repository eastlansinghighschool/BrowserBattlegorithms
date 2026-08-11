---
id: plan-114
title: "Advanced Scrimmage Capstone Winnability Repair"
status: in-progress
depends_on: [plan-113]
gate: "before mutation: owner approval of the chosen repair approach (fixture tuning vs turn-limit change vs both), after the evidence phase reports"
summary: >-
  Diagnose and repair Challenge 37 (advanced-scrimmage) winnability: both canonical fixtures (step-9 checkpoint and final) fail the current level at turn 56 against a 55-turn limit per behavior evidence, so the capstone may currently have no passing reference solution. Evidence-first, then a gated repair, then the deferred star metadata.
---
# Plan 114: Advanced Scrimmage Capstone Winnability Repair

## Packet Metadata

- Packet id: `plan-114`
- Packet title: Advanced Scrimmage Capstone Winnability Repair
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-08-08
- Packet type: implementation / testing
- Mutation level: source-code (fixtures, possibly one level field), tests, generated evidence artifacts, docs
- Approval gate: before mutation — the evidence phase (Work Plan step 1) reports first; owner picks the repair approach. No level, fixture, or test edits before that approval.
- Depends on: plan-113 (which deferred advanced-scrimmage star metadata pending this repair)
- Blocks: nothing; closes the last known student-facing fixture debt
- Expected artifacts:
  - evidence report: is there ANY currently-passing canonical solution, and when/why did the checkpoint fixture stop passing
  - repaired fixture(s) and/or an owner-approved turn-limit change
  - updated/removed documented exceptions in `tests/unit/guided-project-solutions.test.js`
  - regenerated dossier/behavior-evidence artifacts for the level
  - star metadata for advanced-scrimmage (closing the plan-113 deferral) if the repair lands
  - progress report
- Progress report folder: `reports/development/plan-114-advanced-scrimmage-winnability-repair/`
- Progress report file: `reports/development/plan-114-advanced-scrimmage-winnability-repair/progress.md`

## Packet Summary

Goal: Make Challenge 37 (`advanced-scrimmage`) provably winnable by a canonical reference program within its turn limit, with the evidence trail to show it — then close the plan-113 star-metadata deferral.

Non-goals:
- Do not change the NPC layout or board design (the living-board state is settled; the fixture/limit must move, not the board).
- Do not weaken the capstone's intended difficulty — a repair that makes the level trivially passable is a failure even if tests go green.
- Do not broaden into tuning other documented cumulative-checkpoint exceptions (the `cumulativeExceptions` entries in `guided-project-solutions.test.js` are accepted by design); only the step-9/final fixtures for THIS level are in scope, plus the index-jobs glance noted below.
- Do not change the star evaluator or criteria registry (settled in plans 111/113).
- Do not touch student-facing copy.

Depends on:
- plan-113 complete (star deferral and standards).

Blocks:
- Nothing.

Why this packet exists:
The behavior-summary index records `advanced-scrimmage` as a "documented exception" with BOTH the step-9 checkpoint and final fixtures at 56 turns against a 55-turn `failureCondition.maxTurns` (`src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js:20`), and the unit suite documents the gap ("not yet been tuned to the current NPC layout… A reliable capstone solution is pending", `tests/unit/guided-project-solutions.test.js:35`). Orchestrator verification (2026-08) reproduced the step-9 failure live: `FAILED`, turn 56. Note what this means: the regression suite does NOT prove winnability — `synthesizeProfileUsage` records synthetic outcomes without executing levels — so there may currently be no known program that beats the campaign's final capstone. Students carrying their stepwise Team Strategy Script program into Challenge 37 inherit a program shape that provably cannot win. That is the campaign's most important level failing its core promise, and it also blocks the level's star metadata (plan-113 deferred it pending trustworthy par evidence).

## Authority And Contracts

Required reading:

- `tests/unit/guided-project-solutions.test.js:20-48` — the documented exception structure (stepExceptions vs cumulativeExceptions) and what each means.
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md` row 44 and `behavior-evidence/44-advanced-scrimmage.md` — the current evidence state.
- `reports/development/guided-level-complexity-audit/level-dossiers/44-advanced-scrimmage.md` — level structure dossier.
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js` — the level definition.
- `tests/unit/fixtures/guidedProjectSolutions.js` — step/final fixture resolution; `tests/unit/helpers/testHarness.js` — `runGuidedLevelWithSolution`.
- `docs/decision-log.md` — 2026-08-05 star entries (par formula, cumulative tiers, discriminating power, deferral decision).
- `docs/subsystems/turn-engine.md` — collision/freeze rules if the repair involves route timing.
- Plan 26 (guided vertical patrol) and Plan 23 (Challenge 15 defender/wanderer) in the archive — precedents for tuning levels to live NPC behavior.

Contracts to preserve:

- The NPC layout and board stay as-is unless the evidence phase proves they are the defect — and even then, changing them needs explicit owner approval (it invalidates living-board evidence).
- **Human-runner handling:** advanced-scrimmage has a human-slot runner (`level-37-advanced-scrimmage.js:33`) authored `humanTurnBehavior: AUTO_SKIP` — the human runner is parked, and canonical play is the shared program running the AI allies. The harness evaluates this level without human input (that is how the existing 56-turn failure evidence was produced). Do not script human-runner moves into the canonical fixture. If the evidence shows the level is only winnable by driving the human runner, that contradicts the level's shared-program capstone design — STOP and surface to the owner.
- The repaired checkpoint fixture must remain a program a student could plausibly have written by following the L29–36 arc — no superhuman tuning, no blocks outside the project toolbox.
- Reference-solution tests must assert the repaired fixture PASSES (the S8 discipline: the claim is falsifiable).
- Tests aligned with authored level count/order/toolbox restrictions stay aligned.
- Star metadata follows the settled plan-111/113 rules exactly (par formula, cumulative tiers, discriminating power).

## Scope

### In Scope

1. **Evidence phase (no mutation):**
   - Run step-9 and final fixtures against the live level via the harness; record results and turn counts.
   - Determine when the fixture last passed: `git log` on the level file and fixtures; identify the change that broke it (living-board/patrol/NPC-layout era candidates) and whether any known solution passes within 55 turns today.
   - Report: what exactly fails (route blocked? timing? collision?), and the candidate repair approaches with evidence.
2. **Repair phase (gated):** implement the owner-approved approach, expected to be one of:
   - (a) tune the step-9 (and if needed final) fixture to pass within the limit — minimal changes, still a believable student program;
   - (b) a modest turn-limit increase with justification (55 was authored against the pre-living-board layout);
   - (c) a combination.
3. **Test/artifact phase:**
   - Update or remove the `stepExceptions`/`cumulativeExceptions` entries for advanced-scrimmage in `guided-project-solutions.test.js` so the suite asserts the repaired fixture passes.
   - Regenerate the level's dossier and behavior-evidence artifacts (`npm run level:dossiers`, `npm run level:behavior-evidence`); stop if churn extends beyond this level's files.
   - The index-jobs glance (carried from plan-97 acceptance): confirm whether the "final 13 turns vs limit 12" documented-exception row is the intended cumulative-checkpoint exception or a newly exposed failure; report, fix only if trivially in family.
4. **Star metadata phase:** author advanced-scrimmage's `starCriteria` from the repaired passing run: `turnPar` via the approved generosity formula on the new reference turns; `masteryCriterionId: "both-allies-active"` if (and only if) the discriminating-power check passes for this level (can it be passed with one ally unaddressed? — evidence required), plus cumulative-tier sanity (3 stars must be reachable). If par evidence remains untrustworthy after repair, keep pass-star-only with a comment and say why.

### Out of Scope

- NPC layout / board changes (owner-only, and only if the evidence demands it).
- Other levels' fixtures or exceptions.
- UI, tracker, evaluator, copy changes.
- Turn-limit changes to any other level.

### Files And Areas Likely Touched

- `tests/unit/fixtures/guided-project-solutions/team-strategy-script/` (step-09 / final XML).
- Possibly `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js` (turn limit and/or starCriteria — gated).
- `tests/unit/guided-project-solutions.test.js` (exception removal/update).
- Regenerated artifacts under `reports/development/guided-level-complexity-audit/` for this level only.
- Progress report.

## Work Plan

1. **Evidence phase (read-only):** run the fixtures, gather git history, produce the diagnosis with concrete failure mode. Present repair options.
2. **Gate:** owner picks the repair approach.
3. Implement the repair; add/adjust tests so the repaired fixture's pass is asserted.
4. Regenerate this level's evidence artifacts.
5. Author star metadata per the rules above.
6. Run `npm test`, `npm run build`, `npm run lint:levels`; full validation.
7. Progress report: diagnosis, owner decision, evidence before/after, remaining risks.

## Implementation Requirements

### 1. Honest diagnosis first

- Required behavior: the failure mode is named precisely (which runner, which turn, which rule outcome — use the trace/event log), not just "times out."
- Constraint: if the evidence shows the level is winnable by some existing program (e.g. the final fixture passes under some configuration), the repair scope shrinks to fixture alignment — report that instead of inventing a bigger fix.

### 2. Repair quality bar

- The repaired fixture must pass REPEATEDLY (deterministic level — but run it enough to be sure), within the turn limit with a small margin, using only project-toolbox blocks, and remain pedagogically consistent with the L29–36 arc (roles, runner index, shared program — the arc's actual lessons).
- If a turn-limit change is part of the approved repair: update any level-lint expectations and evidence notes citing 55, and justify the new value against the repaired fixture's turns (limit should exceed reference turns by a real debugging margin).

### 3. Star metadata

- `turnPar` from the repaired reference turns via `refTurns + max(2, ceil(refTurns * 0.15))`, and `turnPar <= maxTurns - 1` with a comfortable margin.
- `both-allies-active` only with discriminating-power evidence; cumulative-tier check (par + mastery jointly reachable).

## Commands

```powershell
npm test
npm run build
npm run lint:levels
npm run level:dossiers
npm run level:behavior-evidence
```

## Validation Checklist

- [ ] Evidence phase completed and reported BEFORE any mutation.
- [ ] Owner gate decision recorded (approach chosen).
- [ ] Repaired fixture asserted passing within the turn limit by the unit suite (exception text removed/updated).
- [ ] Repaired fixture uses only project-toolbox blocks and reads like a student program.
- [ ] Regenerated artifacts scoped to this level (no unrelated churn).
- [ ] Star metadata follows settled rules, or the deferral comment is honestly maintained.
- [ ] `npm test`, `npm run build`, `npm run lint:levels` pass; lint shows no new errors/warnings beyond baseline.
- [ ] Progress report: diagnosis, gate decision, before/after evidence, commands, risks.

## Stop Conditions

Stop and ask for owner review if:

- The evidence shows the level cannot be won without an NPC layout or board change (that crosses into level redesign — owner decision).
- The only passing fixture requires blocks or structure a student couldn't reach from the arc (the level's difficulty, not the fixture, would be the defect — surface).
- Artifact regeneration churns beyond this level's files.
- The index-jobs glance reveals a newly broken fixture rather than a documented exception (broaden only with owner approval).
