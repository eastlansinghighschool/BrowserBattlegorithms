---
id: plan-83-cohort-insight-distillation
title: "Cohort Insight Distillation"
status: ready
depends_on: []
gate: "before writing any tracked cohort-derived conclusion, before citing exact cohort counts, before drafting implementation packets from cohort evidence"
superseded_by: null
resolution: null
summary: >-
  Owner-gated privacy-safe distillation that converts local Plan 82 cohort audits into tracked directional conclusions and follow-up packet candidates without exact small-cohort counts or row-level data.
---
# Plan 83: Cohort Insight Distillation

- Packet id: Plan 83
- Packet title: Cohort Insight Distillation
- Status: (see frontmatter)
- Owner/model: orchestration-grade model under integration-owner review
- Date: 2026-05-30
- Packet type: scan-only / synthesis / privacy review / packet planning
- Mutation level: docs-only
- Approval gate: before writing any tracked cohort-derived conclusion, before citing exact cohort counts, before drafting implementation packets from cohort evidence
- Expected artifacts:
  - tracked privacy-safe distillation report
  - comparison of one or more local Plan 82 audits
  - directional/banded cohort conclusions without exact small-cohort counts
  - owner-decision list
  - candidate follow-up packet map
  - no raw exports, no identity map, no anonymized row-level data
- Progress report folder: `reports/development/plan-83-cohort-insight-distillation/`
- Progress report file: `reports/development/plan-83-cohort-insight-distillation/progress.md`

## Packet Summary

Goal: Convert local-only Plan 82 cohort insight audits into durable, tracked project memory without committing raw student data, anonymized row-level data, exact small-cohort counts, or re-identifiable classroom details.

Non-goals:
- Do not read raw student exports.
- Do not read identity maps.
- Do not copy Plan 81 anonymized row-level tables into tracked files.
- Do not copy local Plan 82 audits wholesale into tracked files.
- Do not include exact small-cohort counts or per-level rates in tracked artifacts.
- Do not produce grades or evaluate individual students.
- Do not edit guided levels, source, tests, admin UI, or usage tooling.

Depends on:
- Plan 80 privacy workspace.
- Plan 81 cohort dataset and baseline outputs.
- One or more Plan 82 local cohort insight audits.

Blocks:
- Tracked follow-up guided-level, UI/UX, admin, or instrumentation repair packets based on real classroom usage evidence.

Why this packet exists:
The rich Plan 82 audits should stay local because even anonymized small-cohort evidence can become identifiable or misleading when committed. The project still needs durable memory from the classroom signal. This packet is the single owner-gated privacy boundary: it translates local evidence into tracked directional conclusions and follow-up packet plans without preserving sensitive counts or trajectories in git history.

## Authority And Contracts

Obey these sources of truth:
- `docs/subsystems/usage-and-admin.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`
- `docs/development/plan-80-cohort-usage-privacy-workspace.md`
- `docs/development/plan-81-cohort-usage-dataset-and-baseline.md`
- `docs/development/plan-82-cohort-guided-learning-insight-audit.md`
- local Plan 82 audit files under `local/usage-cohorts/<cohort-id>/analysis/model-audits/`

Required privacy contracts:
- The tracked distillation may cite directional/banded evidence only.
- Do not include exact counts, exact percentages, exact rates, session ids, hashes, student names, anonymized student/export ids, or row-level examples.
- Do not include claims that would identify a student by implication in a small class.
- Use language such as:
  - `many`
  - `several`
  - `few`
  - `very few`
  - `a recurring pattern`
  - `a possible signal`
- Avoid language such as:
  - `1 of 12`
  - `8/14`
  - `57%`
  - `student-003`
  - exact per-level rates from the local dataset
- Preserve uncertainty and sample-size caveats.

Do not redefine:
- The local-only status of raw/anonymized data.
- Guided level order.
- Current grading policy.
- Usage export semantics.

## Required Reading

Read:
- local Plan 82 audit(s) under `local/usage-cohorts/<cohort-id>/analysis/model-audits/`
- Plan 82 data caveats sections
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`
- Plan 75/76 audit/synthesis artifacts only as needed to compare cohort signal with prior complexity analysis

Do not read:
- `local/usage-cohorts/<cohort-id>/raw-exports/`
- `local/usage-cohorts/<cohort-id>/identity-map/`
- row-level anonymized tables unless necessary to understand a Plan 82 claim and explicitly approved by the owner

## Scope

In scope:
- Compare Plan 82 audits by topic.
- Preserve disagreement across model audits.
- Translate local exact findings into tracked directional conclusions.
- Identify fast-track follow-up packet candidates.
- Identify owner decisions and data limitations.
- Draft no-source-change packet recommendations if useful.

Out of scope:
- Re-running cohort queries.
- Creating new cohort findings not present in Plan 82 audits.
- Adding exact evidence from local analysis.
- Making source/code/level/UI changes.

## Output Location

Tracked report:

```text
reports/development/cohort-guided-learning-insights/distillation.md
```

If multiple cohort sections are analyzed separately, use owner-approved labels that do not reveal class identity:

```text
reports/development/cohort-guided-learning-insights/<cohort-label>-distillation.md
```

## Required Report Structure

### 1. Privacy Note

State that the tracked report intentionally omits exact counts, percentages, student identifiers, anonymized row ids, and row-level examples. Explain that richer evidence remains local under `local/usage-cohorts/`.

### 2. Distilled Findings

Use a table:

| Finding id | Area | Directional claim | Evidence confidence | Source audit ids | Follow-up |
|---|---|---|---|---|---|

Evidence confidence values:
- `strong directional signal`
- `moderate directional signal`
- `weak/data-limited signal`
- `conflicting signal`

### 3. Agreement And Disagreement

If multiple Plan 82 audits exist:
- identify where models agreed
- identify where models disagreed
- preserve minority findings if they are well reasoned
- do not smooth toward consensus

### 4. Candidate Follow-Up Packets

Use a table:

| Packet candidate | Type | Rationale | Privacy-safe evidence summary | Scope size | Owner decision needed |
|---|---|---|---|---|---|

### 5. Owner Decisions

List decisions that materially affect packet sequencing, such as:
- whether to prioritize UI/navigation support or level redesign
- whether to revise a level mid-cohort or wait for a future cohort
- whether to gather another cohort before acting on weak signals

### 6. Local Evidence Pointers

Point to local file paths only generically, for example:

```text
local/usage-cohorts/<cohort-id>/analysis/model-audits/
```

Do not include local file contents or row-level snippets.

## Work Plan

1. Confirm the owner approves crossing from local cohort evidence into a tracked distillation.
2. Read local Plan 82 audit(s), not raw exports or identity maps.
3. Compare findings by topic.
4. Translate exact evidence into directional privacy-safe language.
5. Draft the tracked distillation.
6. Stop before drafting implementation packets unless the owner explicitly requests them.

## Validation Checklist

- [ ] Did not read raw exports.
- [ ] Did not read identity map.
- [ ] Did not copy anonymized row-level data into tracked files.
- [ ] Did not include exact counts, percentages, rates, or row ids.
- [ ] Preserved uncertainty and sample-size caveats.
- [ ] Preserved model disagreement where present.
- [ ] Produced candidate follow-up packets rather than source edits.
- [ ] Owner approval gate was honored before writing tracked cohort-derived conclusions.

## Stop Conditions

Stop and ask the owner if:
- A useful finding cannot be stated without exact small-cohort counts.
- A finding risks identifying a student by implication.
- Plan 82 audits are missing or inconsistent enough that distillation would invent new analysis.
- The owner has not approved creating a tracked cohort-derived conclusion.
- You are tempted to inspect raw exports or identity maps.
