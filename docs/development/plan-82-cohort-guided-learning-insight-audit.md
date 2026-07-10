---
id: plan-82-cohort-guided-learning-insight-audit
title: "Cohort Guided Learning Insight Audit"
status: complete
depends_on: [plan-80-cohort-usage-privacy-workspace, plan-81-cohort-usage-dataset-and-baseline]
gate: "before any source, level, UI, docs, or generated-data mutation"
superseded_by: null
resolution: "Completed and reviewed 2026-07-09. Three local-only aggregate cohort audits meet the privacy boundary, required report structure, denominator/confidence requirements, and repaired model-ID and catalog-label conventions; retention limits are documented as a major caveat. Plan 83 remains owner-gated for any tracked distillation."
summary: >-
  Local-only orchestration-grade scan over Plan 81 anonymized outputs to identify guided-level, curriculum, and UI/UX insights without reading raw exports, identity maps, or writing tracked audit reports.
---
# Plan 82: Cohort Guided Learning Insight Audit

- Packet id: Plan 82
- Packet title: Cohort Guided Learning Insight Audit
- Status: (see frontmatter)
- Owner/model: orchestration-grade model, optionally repeated across multiple models
- Date: 2026-05-30
- Packet type: scan-only / curriculum analysis / UX analysis / local usage evidence
- Mutation level: none
- Approval gate: before any source, level, UI, docs, or generated-data mutation
- Expected artifacts:
  - local-only model-specific cohort insight audit report under `local/usage-cohorts/<cohort-id>/analysis/`
  - evidence-linked findings from Plan 81 anonymized outputs
  - level-specific and cross-level guided learning recommendations
  - data caveats and confidence labels
  - candidate follow-up packet map
  - no raw student data, no identity map, no tracked audit report, no source edits
- Progress report folder: `reports/development/plan-82-cohort-guided-learning-insight-audit/`
- Progress report file: `reports/development/plan-82-cohort-guided-learning-insight-audit/progress.md`

## Packet Summary

Goal: Use higher-reasoning orchestration to interpret the anonymized cohort usage dataset and baseline report from Plan 81, identifying guided-level, curriculum, and UI/UX opportunities that deterministic metrics alone may miss.

Non-goals:
- Do not read raw student exports.
- Do not read identity maps.
- Do not write the rich audit to `reports/`, `docs/`, or any tracked path.
- Do not reveal student names, session ids, hashes, or row-level trajectories in the report.
- Do not edit source, levels, docs, tests, or generated data.
- Do not produce grades or evaluate individual students.
- Do not treat heuristics as proof of learning or misunderstanding.
- Do not add new analysis tooling.

Depends on:
- Plan 80 privacy workspace.
- Plan 81 cohort dataset and baseline outputs.
- Plan 79 admin guided progress story is helpful but not required.

Blocks:
- Follow-up guided-level repair/uplift packets based on real classroom usage evidence.
- Plan 83 tracked cohort insight distillation if the owner wants durable project memory from the local audits.

Why this packet exists:
Plan 81 should produce facts, normalized tables, and obvious heuristic flags. The deeper value comes from asking what those patterns might mean for students: where the guided campaign is too easy, where it becomes brittle, where navigation/UI is confusing, where bug hunts or prediction levels are not preparing students, and which repairs are worth turning into small implementation packets.

## Authority And Contracts

Obey these sources of truth:
- `docs/subsystems/usage-and-admin.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`
- `docs/development/plan-81-cohort-usage-dataset-and-baseline.md`
- Plan 81 generated data dictionary
- Plan 81 generated baseline report
- Plan 81 anonymized aggregate/row-level tables under `local/usage-cohorts/<cohort-id>/anonymized/`
- Plan 81 saved starter queries under `local/usage-cohorts/<cohort-id>/analysis/queries/`
- Plan 73/74 guided-level dossiers and behavior evidence if available and needed for curriculum context
- Plan 75/76 complexity audits/syntheses if available and needed for comparison

Required privacy contracts:
- Read only anonymized Plan 81 outputs and aggregate reports.
- Do not open `raw-exports/`.
- Do not open `identity-map/`.
- Write the full audit only under the ignored local cohort workspace.
- Do not copy row-level data into tracked reports.
- Local audit reports may use exact aggregate counts and denominators, but they remain untracked.
- Any later tracked conclusion must be produced by a separate owner-gated distillation packet and should use directional/banded language rather than exact small-cohort counts.
- If a finding requires identifying a student, stop and ask the owner rather than including it.

Do not redefine:
- Guided level order.
- Current grading policy.
- Usage export format.
- Admin anomaly semantics.

## Required Reading

Read these first:
- Plan 81 data dictionary
- Plan 81 baseline report
- Plan 81 saved query descriptions or SQL
- `docs/subsystems/usage-and-admin.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`

Then, as needed:
- `reports/development/guided-level-complexity-audit/summary-index.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`
- `reports/development/guided-level-complexity-audit/model-audits/`
- `reports/development/guided-level-complexity-audit/syntheses/`

Do not read:
- `local/usage-cohorts/<cohort-id>/raw-exports/`
- `local/usage-cohorts/<cohort-id>/identity-map/`

## Scope

In scope:
- Analyze anonymized cohort patterns.
- Compare deterministic Plan 81 flags against curriculum intent.
- Use saved queries or request additional local aggregate queries if needed.
- Identify likely:
  - friction hotspots
  - progression cliffs
  - too-easy levels
  - high-revisit prerequisite anchors
  - abandoned levels
  - bug-hunt/prediction readiness gaps
  - navigation/UI confusion
  - pacing mismatches
  - places where usage evidence confirms or contradicts Plan 75/76 complexity audit claims
- Propose follow-up packet candidates.

Out of scope:
- Source edits.
- Level edits.
- Admin UI edits.
- Running analysis on raw exports.
- Producing grade recommendations.
- Making claims about individual student ability.

## Output Location

If one orchestration model runs:

```text
local/usage-cohorts/<cohort-id>/analysis/model-audits/<MODEL>-audit.md
```

If multiple orchestration models run, use:

```text
local/usage-cohorts/<cohort-id>/analysis/model-audits/<MODEL>-audit.md
```

`<MODEL>` should be uppercase, for example:
- `CODEX`
- `CLAUDE`
- `GEMINI`

Second-pass audits append a digit, for example:
- `CODEX2`
- `CLAUDE2`

## Required Report Structure

### 1. Executive Findings

Include a compact table:

| Finding id | Area | Claim | Evidence denominator | Evidence strength | Suggested action |
|---|---|---|---|---|---|

Evidence strength values:
- `strong`
- `moderate`
- `weak`
- `data-limited`

Evidence denominator requirements:
- Every major finding must state the relevant denominator, for example students/exports included, students who reached a level, attempts observed, or files with valid hashes.
- If the relevant N is small, cap confidence conservatively. Do not label a finding `strong` solely because a high percentage appears in a tiny denominator.
- Exact denominators are allowed in this local untracked audit. They must not automatically cross into tracked reports.

### 2. Data Caveats

Required caveats:
- Usage files are local classroom evidence, not controlled research data.
- Duration is approximate and less reliable than attempts/turns.
- Anonymization reduces exposure but does not make row-level data safe to publish.
- Event absence does not always mean student absence; students may have switched devices, failed to export, or used the UI in unexpected ways.

### 3. Progression And Cliff Analysis

Discuss:
- highest reached/highest passed distribution
- levels where many students stopped progressing
- levels with high starts but low passes
- whether cliff points align with known challenge/synthesis levels or surprising ordinary levels

### 4. Level Friction And Too-Easy Candidates

Discuss:
- high-attempt/high-fail/high-turn levels
- low-attempt/low-turn/high-pass levels
- which findings look like healthy challenge versus unproductive confusion
- which findings might deserve guided-level complexity uplift

### 5. Revisit And Backtracking Patterns

Discuss:
- levels frequently revisited after later failures
- possible prerequisite anchors
- whether revisits suggest useful review, navigation confusion, or hidden dependence on earlier concepts

### 6. Bug Hunt, Prediction, And Challenge Readiness

Discuss if data supports it:
- whether bug hunts appear to prepare students for subsequent challenges
- whether prediction levels correlate with later success
- whether challenge failures point to missing rehearsal in earlier levels

### 7. UI/UX Signals

Discuss:
- evidence of students not realizing later levels are available
- non-monotonic navigation patterns
- repeated starts without progress
- export/timing/workflow confusion

### 8. Comparison To Prior Audits

Compare cohort evidence to Plan 75/76 findings when useful:
- confirmed recommendations
- contradicted recommendations
- new usage-driven concerns
- findings that remain unresolved

If the audit author also authored one of the Plan 75 model audits:
- explicitly flag where you are comparing against your own earlier recommendation
- weigh cohort evidence on its own merits rather than treating earlier agreement as confirmation

### 9. Candidate Follow-Up Packets

Create a prioritized table:

| Candidate packet | Type | Evidence | Scope size | Pilot/classroom safety | Notes |
|---|---|---|---|---|---|

Types may include:
- guided-level uplift
- bug-hunt repair
- prediction-level repair
- admin/teacher tooling
- navigation/UI clarification
- usage instrumentation improvement
- further analysis query/tooling

### 10. Open Questions For Owner

Include only questions that would materially change packet sequencing.

## Model-Specific Instructions

If this packet is run by multiple orchestration models:
- Do not read another model's Plan 82 audit before writing your own.
- If another model's audit already exists under `model-audits/`, leave it unopened.
- Use your own finding ids in the form `<MODEL>-<LETTER>`, e.g. `CODEX-A`, `CLAUDE-A`, `GEMINI-A`.
- Do not try to resolve disagreement with other audits. A later synthesis packet can compare them.

## Work Plan

1. Confirm only anonymized Plan 81 outputs are being read.
2. Read the Plan 81 data dictionary and baseline report.
3. Inspect aggregate tables and, if safe, anonymized row-level tables.
4. Run or request saved aggregate queries if needed.
5. Compare patterns to curriculum/complexity context.
6. Write the audit in the required structure.
7. Stop before implementation recommendations become source edits.

## Validation Checklist

- [ ] Did not read raw exports.
- [ ] Did not read identity map.
- [ ] Wrote the rich audit only under `local/usage-cohorts/<cohort-id>/analysis/`.
- [ ] Did not include student names, session ids, hashes, or row-level trajectories.
- [ ] Distinguished facts, heuristics, and interpretation.
- [ ] Included data caveats.
- [ ] Included denominators for every major finding.
- [ ] Included evidence strength for each major finding.
- [ ] Connected recommendations to guided learning, UI/UX, or instrumentation decisions.
- [ ] Proposed follow-up packets rather than making source edits.
- [ ] If multi-model, did not read another model's audit first.

## Stop Conditions

Stop and report if:
- Required Plan 81 outputs are missing.
- The only available data includes raw exports or identity maps.
- You cannot write to the ignored local cohort workspace.
- A finding requires identifying a student.
- The report would need row-level examples that risk re-identification.
- The analysis reveals a probable instrumentation bug that invalidates core metrics.
- You are tempted to edit source, docs, tests, levels, or generated data.

## Future Synthesis

If multiple Plan 82 audits are produced, use Plan 83 or a similar owner-gated distillation packet rather than asking one audit author to merge them. The distillation should compare findings by topic, preserve disagreement, identify fast-track follow-up packets, and translate local exact evidence into tracked privacy-safe directional conclusions.
