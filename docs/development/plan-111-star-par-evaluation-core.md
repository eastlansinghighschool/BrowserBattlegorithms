---
id: plan-111
title: "Star/Par Evaluation Core And Tracker Population"
status: complete
resolution: "Star/par evaluation core: pure evaluator + criterion registry (concept-used, fail-open), <= par semantics, monotonic ledger population through the real endLevel path, pilot pars 25/10/3 with 2-star-max per owner gate. Two gate rounds settled par semantics, arithmetic, and the anti-code-golf 2-star-max standard (decision log 2026-08-05). Cumulative-tier semantics ratified at acceptance; subsystem note bullets restored."
depends_on: [plan-110]
gate: "before mutation: owner sign-off on the pilot levels' proposed turnPar values and masteryCriterionId choices (presented in the preflight plan, before edits)"
summary: >-
  Implement Plan 85 S6's star evaluation core: per-level star metadata schema, a pure star evaluator wired into the end-of-level path, and producer population of the ratified plan-110 ledger fields — piloted on movement-helpers levels 11-14 only. Supersedes the evaluation slice of plan-96.
---
# Plan 111: Star/Par Evaluation Core And Tracker Population

## Packet Metadata

- Packet id: `plan-111`
- Packet title: Star/Par Evaluation Core And Tracker Population
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-23
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: before mutation — owner sign-off on the pilot levels' proposed `turnPar` values and `masteryCriterionId` choices, presented with evidence in the preflight plan summary before any edits.
- Depends on: plan-110 (ratified ledger field slots)
- Blocks: plan-112 (star UI needs the evaluator output), plan-113 (campaign-wide authoring needs this metadata schema)
- Supersedes: the evaluation/tracker slice of `plan-96` (plan-96 is superseded by plans 111–113 as a whole)
- Expected artifacts:
  - per-level star metadata schema in level definitions
  - pure star evaluator + wiring into the end-of-level path
  - ledger population of `starsEarned`, `parBeaten`, `turnPar`, `masteryAchieved`, `masteryCriterionId`
  - pilot star metadata for movement-helpers levels 11–14
  - unit tests (including real end-of-level path, not hand-fed)
  - updated `docs/subsystems/usage-and-admin.md`
  - progress report
- Progress report folder: `reports/development/plan-111-star-par-evaluation-core/`
- Progress report file: `reports/development/plan-111-star-par-evaluation-core/progress.md`

## Packet Summary

Goal: Make stars computable and recorded. After this packet, completing a guided level with star metadata writes the ratified plan-110 ledger fields through the real end-of-level path. This is the data foundation plan-112 (display) and plan-113 (campaign-wide authoring) build on.

Non-goals:
- No star UI of any kind (plan-112).
- No campaign-wide par/mastery authoring beyond the 4-level pilot (plan-113).
- No film review (S7 is a separate future packet; the `filmReviewSummary` slot stays unpopulated).
- Do not invent star criteria outside Plan 85 S6's closed vocabulary: `concept-used`, `no-wasted-resource`, `both-allies-active`, `no-collision`, `under-block-budget`. Block budget is one option, never the default.
- Do not make stars grades or semester targets (copy/presentation is plan-112, but nothing here should presume grading).
- Do not touch the five S12 fully protected levels (`move-to-target`, `score-a-point`, `mirror-forward`, `human-runner-practice`, `move-toward-flag`) beyond confirming they remain pass-star-only.
- Do not change the plan-110 field names (rename window is closed).

Depends on:
- plan-110 complete (ratified receptacle fields, decision log 2026-07-22).

Blocks:
- plan-112, plan-113.

Why this packet exists:
Plan 85's S6 star model (⭐ pass; ⭐⭐ beat a generous turn par; ⭐⭐⭐ meet an authored mastery criterion) rewards efficient, intentional, concept-centered solutions without making first success inaccessible. Plan 96 drafted the whole layer as one packet with a mandated split reassessment; this is the evaluation slice. Par evidence exists (`reports/development/guided-level-complexity-audit/par-candidates.json`, 39 runnable levels with reference-run turns) and the ledger receptacle is ratified — what does not exist anywhere in `src/` is the evaluator itself. Piloting metadata on levels 11–14 matches the charter's S11 living-board pilot phase, whose boards and copy are settled.

## Authority And Contracts

Required reading:

- `docs/development/plan-85-campaign-rewrite-charter.md` — S6 star model and closed vocabulary (lines ~90–100), S12 protected levels, S11 pilot phase.
- `docs/development/plan-96-stars-par-v1-implementation.md` — the superseded parent; its non-goals and stop conditions apply here.
- `docs/decision-log.md` — 2026-07-22 ratified field names.
- `reports/development/guided-level-complexity-audit/par-candidates.json` — par evidence for the pilot levels.
- `src/core/levels.js` — end-of-level path (`endLevel`, `recordLevelEnded` call ~lines 389/467).
- `src/usage/learningLedger.js` — the receptacle slots (`createGuidedLevelRollupEntry`).
- `src/config/levels/` — level definition conventions, including `failureCondition` turn limits and `manifest.js`'s derived `turnLimit`.
- `docs/subsystems/usage-and-admin.md` — update in the same patch.

Contracts to preserve:

- Star 1 = pass (the unchanged current floor). Star 2 = beat authored generous turn par. Star 3 = meet the level's authored mastery criterion.
- S12 protected levels expose only the pass star; do not force par/mastery onto them for uniformity.
- Old levels without star metadata and old exports keep working unchanged (additive only).
- Mastery criteria must be **mechanically checkable** from data available at level end. If a pilot level's only honest criterion would need subjective runtime judgment, STOP and surface (plan-96 stop condition).
- Ledger population must flow through the real end-of-level path (`endLevel` → `recordLevelEnded`), not a parallel writer.

## Scope

### In Scope

- Star metadata schema on level definitions (follow existing level-def conventions; e.g. a `starCriteria` block with `turnPar` and `masteryCriterionId`, both optional; absent = pass-star-only).
- A pure star evaluator (level metadata + turns elapsed + end-of-level context → 0–3 stars plus per-star outcomes), with a **criterion evaluator registry** keyed by `masteryCriterionId` so plan-113 can add criteria without redesign.
- Registry implementations for whichever criterion ids the pilot levels use (likely 1–2; keep them mechanically checkable from trace/ledger/end-of-level data).
- Wiring: on guided level completion, evaluate and write the five ratified ledger fields via the existing `recordLevelEnded` flow.
- Pilot metadata: levels 11–14 (`enemy-nearby`, `jump-the-gap`... — confirm the four movement-helpers level ids), with `turnPar` seeded from `par-candidates.json` reference turns made *generous* per S6 (propose the generosity rule, e.g. a stated multiplier/floor, in the preflight plan) and `masteryCriterionId` chosen per level with evidence.
- Unit tests, including at least one driving the real `endLevel` path via the existing test harness.
- Subsystem note update.

### Out of Scope

- Any UI (picker, banner, pills) — plan-112.
- Star metadata for any level outside the pilot — plan-113.
- Criterion evaluators beyond the pilot's needs.
- Film review, admin/analyzer changes, cohort tooling.
- The 7 non-runnable levels in par-candidates.json (prediction/human/capstone) — plan-113 surfaces their treatment; do not decide here.

### Files And Areas Likely Touched

- `src/config/levels/` (pilot level definitions + possibly a shared star-metadata helper/schema location — follow existing conventions).
- New `src/core/starEvaluation.js` (or similar; pure logic belongs in core).
- `src/core/levels.js` (end-of-level wiring — minimal diff).
- `tests/unit/` — new test file (register in `package.json` `test:unit`).
- `docs/subsystems/usage-and-admin.md`.

## Work Plan

1. Inspect the end-of-level path, par-candidates evidence for the pilot levels, and level-def conventions.
2. **Preflight plan summary (gate):** present the metadata schema shape, the generosity rule for `turnPar`, the proposed pilot `turnPar` values and `masteryCriterionId` choices (with evidence), and which criterion evaluators the registry needs. WAIT for owner go-ahead before editing.
3. Implement schema, evaluator, registry, wiring.
4. Add pilot metadata; add tests.
5. Run targeted tests, then `npm test` and `npm run build`.
6. Update the subsystem note; write the progress report.

## Implementation Requirements

### 1. Star metadata schema

- Required behavior: level definitions optionally carry star metadata; absence means pass-star-only with no errors anywhere (evaluator, ledger, future UI).
- Constraint: follow existing level-def field conventions and any manifest derivation patterns; do not break level linting (`npm run lint:levels` — add no new errors; if the lint should validate the new field, extend it minimally and honestly).

### 2. Star evaluator (pure)

- Required behavior: given level metadata, turns elapsed, and end-of-level context, return `{ starsEarned, parBeaten, turnPar, masteryAchieved, masteryCriterionId }` matching the ratified ledger shapes (unset fields absent when not applicable — e.g. no `turnPar` authored → no `parBeaten`).
- Edge cases: failed level (0 stars; do not write star fields from a failure — but say so explicitly in the note); level with par but no criterion (max 2 stars); protected/pass-only level (max 1); turns exactly equal to par (beat = strictly under? propose in preflight — "beat a generous par" reads as strictly under, confirm with owner at the gate).

### 3. Criterion evaluator registry

- Required behavior: a lookup from `masteryCriterionId` to an evaluator function; unknown criterion id → honest no-evaluation (star 3 not awarded, nothing crashes, flagged in code comment + test).
- Constraint: evaluators must be mechanically checkable from data available at level end (turn data, trace, ledger state). Document what each implemented criterion consumes.

### 4. Wiring and ledger population

- Required behavior: on guided level pass, the five ratified fields are written to the durable ledger through the real end-of-level path. On fail, no star fields written.
- Proof: a test driving the real `endLevel` path (use `tests/unit/helpers/testHarness.js` or the runGuidedLevelWithSolution pattern) showing the ledger populated — not a hand-fed synthetic session.

### 5. Pilot metadata (levels 11–14)

- `turnPar` seeded from `par-candidates.json` reference turns with a stated generosity rule (S6: "generous … authored/reviewed — not purely generated forever"; your proposal is reviewed at the gate, not deferred forever).
- `masteryCriterionId` per pilot level from the closed vocabulary, justified by what the level teaches (e.g. a movement-helper level's criterion should reward using the helper concept, not code golf).

## Commands

```powershell
npm test
npm run build
npm run lint:levels
```

## Validation Checklist

- [ ] Preflight gate: owner signed off on schema shape, generosity rule, pilot par values, and criterion choices.
- [ ] Evaluator honors closed vocabulary, protected levels, and absent-metadata levels.
- [ ] Criterion registry handles unknown ids honestly.
- [ ] Ledger population proven through the real end-of-level path.
- [ ] Old exports/levels unaffected; v1 files still analyzable.
- [ ] `npm test`, `npm run build` pass; new test file registered in `test:unit`.
- [ ] `npm run lint:levels` shows no new errors.
- [ ] Subsystem note updated in the same patch (star evaluation semantics, fail-case behavior, documentary vs enforced vocabularies now owned here).
- [ ] Progress report records the gate approval, evidence used for pilot metadata, commands, and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- A pilot level's only honest mastery criterion needs subjective runtime judgment.
- The generosity rule for par starts to feel like a curriculum decision disguised as math — surface it (it is one; the gate exists for this).
- Wiring star evaluation into `endLevel` would require touching turn-engine semantics or level result logic.
- The metadata schema forces changes to level linting beyond a minimal honest extension.
- You find yourself writing UI, film-review logic, or non-pilot metadata — those are plans 112/113.
