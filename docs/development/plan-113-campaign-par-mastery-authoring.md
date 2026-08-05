---
id: plan-113
title: "Campaign-Wide Par And Mastery Authoring"
status: ready
depends_on: [plan-111]
gate: "before mutation: owner approval of the full authored par/mastery metadata table (proposed with evidence in the preflight plan); owner may approve phase-by-phase"
superseded_by: null
resolution: null
summary: >-
  Author turnPar and masteryCriterionId for the remaining runnable guided levels using Plan 86 par-candidate evidence and behavior dossiers, extend the plan-111 criterion registry as needed, and settle the treatment of the 7 non-runnable levels. Supersedes the criteria-authoring slice of plan-96.
---
# Plan 113: Campaign-Wide Par And Mastery Authoring

## Packet Metadata

- Packet id: `plan-113`
- Packet title: Campaign-Wide Par And Mastery Authoring
- Status: (see frontmatter)
- Owner/model: implementation agent + owner curriculum review
- Date: 2026-07-22
- Packet type: implementation / docs (level metadata)
- Mutation level: source-code (level metadata), tests, docs
- Approval gate: before mutation — owner approval of the full authored metadata table (turnPar + masteryCriterionId per level, with the evidence for each), presented in the preflight plan. Owner may approve phase-by-phase; the packet then lands in matching phase commits.
- Depends on: plan-111 (metadata schema, evaluator, criterion registry)
- Blocks: nothing; plan-112 (UI) may land before or after
- Supersedes: the criteria-authoring slice of `plan-96`
- Expected artifacts:
  - authored star metadata for all remaining runnable guided levels
  - criterion registry extensions for any newly used criterion ids
  - explicit treatment decision for the 7 non-runnable levels
  - updated evidence-backed authoring table in the progress report
  - tests
  - progress report
- Progress report folder: `reports/development/plan-113-campaign-par-mastery-authoring/`
- Progress report file: `reports/development/plan-113-campaign-par-mastery-authoring/progress.md`

## Packet Summary

Goal: Complete the S6 star layer's content: every runnable guided level gets an authored generous `turnPar` and, where an honest mechanically-checkable one exists, a `masteryCriterionId` from the closed vocabulary. "Authored" means each value carries evidence and owner approval — not generated-and-forgotten.

Non-goals:
- Do not change the evaluator, schema, or UI (plans 111/112).
- Do not invent criteria outside the S6 closed vocabulary; block budget is never the default criterion.
- Do not author par/mastery for the five S12 protected levels (pass-star-only, confirmed, not changed).
- Do not force a mastery criterion onto a level where none is honest — some levels may stay 2-star max; say so explicitly rather than inventing a bad criterion.
- Do not modify level mechanics, boards, copy, or win conditions — metadata only.

Depends on:
- plan-111 complete (schema, evaluator, registry, generosity rule precedent from the pilot).

Blocks:
- Nothing.

Why this packet exists:
S6 says par is "seeded from Plan 74 reference-run turn data, then authored/reviewed — not purely generated forever." The pilot (plan-111) proves the machinery on 4 levels; the remaining ~35 runnable levels need the same treatment, and that treatment is curriculum judgment per level: what turn count is generous-but-meaningful here, and which closed-vocabulary criterion (if any) honestly rewards this level's concept. That's exactly the kind of per-level decision the packet system routes through owner gates. The 7 non-runnable levels (3 prediction checkpoints, 2 human-input levels, the optional double-carrier showdown, and the Challenge 28 capstone) need an explicit, honest treatment rather than silent omission.

## Authority And Contracts

Required reading:

- `docs/development/plan-85-campaign-rewrite-charter.md` — S6, S12.
- `docs/development/plan-111-star-par-evaluation-core.md` and its progress report — schema, registry, pilot generosity rule, gate precedent.
- `reports/development/guided-level-complexity-audit/par-candidates.json` — reference-run turns per level.
- `reports/development/guided-level-complexity-audit/level-dossiers/` and `behavior-evidence/` — per-level context for criterion choices.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — what each level teaches (criterion choices must reward the level's actual concept).
- `docs/development/plan-105-challenge-28-live-capstone-evidence-protocol.md` and its outcome (if delivered) — for the Challenge 28 treatment.

Contracts to preserve:

- Generous par, not speedrun par: a student debugging thoughtfully should still be able to earn star 2 on a reasonable attempt.
- Mastery criteria reward the level's concept (S6: "the AP CSA bridge is clear correct conditions, not code golf").
- Protected levels untouched. Mechanics untouched. Copy untouched (any copy temptation → stop; that's plan-95 territory).
- Criterion evaluators must be mechanically checkable (plan-111 rule); new criterion ids used here get registry implementations with tests in this packet.

## Scope

### In Scope

- A proposed authored metadata table: every remaining runnable guided level → `turnPar` (with the par-candidate evidence and the generosity rule applied) + `masteryCriterionId` or an explicit "no honest criterion — 2-star max" note.
- After owner approval: write the metadata into level definitions (phase-grouped commits if approved phase-by-phase).
- Criterion registry extensions for criterion ids used beyond the pilot set, with unit tests.
- The 7 non-runnable levels: propose and, after owner decision, record their treatment (options to present: par based on the fixed prediction/human path where one exists; pass-star-only; or explicitly excluded from stars with the reason documented in the level file comment).
- Acceptance note from plan-111 (2026-07-22): star tiers are **cumulative** — `starsEarned` is 3 only when both `parBeaten` and `masteryAchieved` hold (decision log 2026-07-22). Author criteria against this: a mastery-meeting but slow run earns 1 star, so criteria should be things a student could plausibly achieve while also beating par, or the level's 3-star is effectively unreachable.
- `npm run lint:levels` extension if the star-metadata lint from plan-111 should verify authored values (e.g. par < turn limit) — minimal and honest.

### Out of Scope

- Evaluator/schema/UI changes.
- Free Play, admin/cohort surfaces, film review.
- Any level content change beyond star metadata.

### Files And Areas Likely Touched

- `src/config/levels/phases/**` (metadata only).
- The plan-111 criterion registry module (extensions).
- `tests/unit/` (registry tests; possibly metadata-validation tests).
- Progress report with the full authoring table + evidence.

## Work Plan

1. Consume par-candidates.json, dossiers, behavior evidence, and the concept matrix.
2. **Preflight plan (gate):** present the complete authored table — per level: proposed `turnPar`, evidence turns, generosity computation, proposed criterion (or explicit none), and the 7 non-runnable treatments. WAIT for owner approval (possibly phase-by-phase).
3. Write approved metadata; extend registry as needed; add tests.
4. Run `npm test`, `npm run build`, `npm run lint:levels`.
5. Progress report records the approved table, evidence, and any owner adjustments.

## Implementation Requirements

### 1. Authored turnPar per level

- Required behavior: each runnable level's `turnPar` derives from its par-candidate reference turns via the plan-111 generosity rule, reviewed per level — adjust where level structure makes the naive rule wrong (e.g. levels where waiting is legitimate strategy).
- Edge cases: levels with multiple reference runs (use the documented evidence, don't cherry-pick); par must be comfortably below the level's turn limit (state the margin rule in the preflight).

### 2. Mastery criteria per level

- Required behavior: each level gets a closed-vocabulary criterion that rewards its actual concept, or an explicit documented "none." Reward the concept the level teaches (concept matrix), not incidental efficiency.
- Constraint: any criterion id newly used here needs a registry implementation + tests before the metadata lands.

### 3. Non-runnable levels treatment

- Present per-level options with a recommendation at the gate; implement only the owner-approved treatment; document the decision in the level file comment and the progress report.

## Commands

```powershell
npm test
npm run build
npm run lint:levels
```

## Validation Checklist

- [ ] Preflight gate: owner approved the authored table (fully or phase-by-phase).
- [ ] Every runnable level has approved metadata or an explicit documented exclusion.
- [ ] All criterion ids used have registry implementations + tests.
- [ ] Par < turn limit everywhere, with the margin rule stated.
- [ ] Protected levels confirmed untouched; no mechanics/copy changes.
- [ ] `npm test`, `npm run build` pass; `npm run lint:levels` shows no new errors.
- [ ] Progress report includes the full approved table with evidence and owner adjustments.

## Stop Conditions

Stop and ask for owner review if:

- The evidence for a level's par is missing or untrustworthy (single weird reference run) — surface rather than guess.
- A level seems to need a criterion outside the closed vocabulary — that is a charter conversation, not a packet decision.
- Applying the generosity rule mechanically produces pars that feel wrong for a whole phase — the rule needs owner revision, not silent per-level fudging.
- The 7 non-runnable treatments turn out to need UI or evaluator changes (that is plans 111/112 follow-up scope — surface).
