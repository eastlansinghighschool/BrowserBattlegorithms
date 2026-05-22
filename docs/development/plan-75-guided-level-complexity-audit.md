# Plan 75: Guided Level Complexity Audit

- Packet id: Plan 75
- Packet title: Guided Level Complexity Audit
- Status: ready
- Owner/model: orchestration-grade model
- Date: 2026-05-21
- Packet type: scan-only / curriculum / product / planning
- Mutation level: none / reports-only
- Approval gate: before implementation packets, before level/source changes, before curriculum source-of-truth changes
- Expected artifacts:
  - model-specific guided level complexity audit report
  - challenge-ramp analysis
  - rehearsal-debt analysis
  - protected-level list
  - prioritized implementation packet recommendations
  - progress/report summary
- Progress report folder: `reports/development/guided-level-complexity-audit/`
- Progress report file: `reports/development/guided-level-complexity-audit/model-audits/<model-or-thread-name>.md`

## Packet Summary

Goal: Use the Plan 73 and Plan 74 generated evidence to identify guided levels whose non-challenge difficulty is too thin, whose challenge ramp is too abrupt, or whose prior-skill rehearsal is insufficient, then recommend owner-reviewable implementation packets.

This packet is intentionally repeatable by multiple orchestration-grade models. Each model should produce an independent audit under its own filename so the integration owner can compare interpretations before choosing follow-up implementation packets.

Non-goals:
- Do not edit source code, levels, fixtures, docs, or generated evidence.
- Do not implement level changes.
- Do not rewrite tutorial copy.
- Do not change the guided concept sequence.
- Do not turn every small level into a harder level.
- Do not use block count alone as a proxy for learning value.

Depends on:
- Plan 73 complete: per-level dossiers and summary index exist.
- Plan 74 complete: reference behavior evidence and behavior summary index exist.

Blocks:
- Follow-up implementation packets for level uplift clusters.
- Possible future linter/readiness enhancements if the audit finds measurable recurring gaps.

Why this packet exists:
Pilot feedback suggests many guided non-challenge levels are too easy, causing boredom and then a jarring spike at challenge levels. The project needs curriculum judgment about where to add integration practice without breaking the one-primary-concept learning model or damaging satisfying small puzzles.

## Authority And Contracts

Required project contracts:
- Guided mode generally teaches one primary concept at a time unless a level is clearly marked synthesis/challenge/project.
- Demo Blockly should show structure, not reveal the exact active solution.
- Student programs run from `On Each Turn`.
- Only the first reached action executes each turn.
- Project levels may carry shared latest code across their arcs.
- Multi-ally strategy should teach decentralized coordination through local sensing, roles, and state checks.
- Guided source, concept matrix, StudentGuide, TeacherGuide, subsystem notes, fixtures, and tests must agree after any later implementation.

Do not redefine:
- The core game rules.
- The guided level order or project membership.
- The concept matrix as source truth without owner approval.
- Challenge/synthesis labels.
- AP CSA bridge priorities.
- Static deployment constraints.

## Required Reading

Read before analysis:
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/TeacherFacilitationKit.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `reports/development/guided-level-complexity-audit/summary-index.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`
- `reports/development/guided-level-complexity-audit/level-dossiers/`
- `reports/development/guided-level-complexity-audit/behavior-evidence/`
- Plan 73 progress report
- Plan 74 progress report

Optional/contextual reading:
- `src/config/levels/` only when generated evidence is ambiguous.
- `tests/unit/fixtures/guided-reference-solutions/` only when the dossier/evidence report flags an unclear XML fact.
- Existing readiness/workbench reports only if a level-specific gap needs clarification.

## Multi-Model Execution Contract

This packet may be run multiple times by different orchestration models or separate orchestration threads.

Each run must:
- Use the same Plan 73 and Plan 74 generated evidence as input unless the owner explicitly asks for a refreshed evidence pass.
- Write a separate audit file under `reports/development/guided-level-complexity-audit/model-audits/`.
- Use a distinct filename such as:
  - `codex-audit.md`
  - `claude-audit.md`
  - `gemini-audit.md`
- `codex-second-pass-audit.md`
- Not overwrite or revise another model's audit.
- Not read another model's existing audit file under `model-audits/` before publishing its own. If another model's audit is already present, leave it unopened; synthesis belongs to the owner or a later synthesis packet.
- Not try to reconcile or synthesize other model outputs unless the owner explicitly assigns a later synthesis packet.
- State its own assumptions and uncertainty clearly.
- Preserve dissenting recommendations rather than smoothing them into consensus.

Recommended per-model report frontmatter:

```markdown
# Guided Level Complexity Audit — <model/thread name>

- Packet: Plan 75
- Model/thread:
- Date:
- Evidence baseline:
  - Plan 73 output reviewed: yes/no
  - Plan 74 output reviewed: yes/no
  - Evidence generation date or commit, if known:
- Scope notes:
- Major assumptions:
```

The integration owner may later create a separate synthesis packet to compare all `model-audits/*.md` files and choose a final implementation sequence.

## Scope

### In Scope

- Analyze all guided levels, including challenge/synthesis levels, bug hunts, prediction checkpoints, project levels, and optional labs, but separate recommendations by category.
- Identify non-challenge levels that are likely too thin.
- Identify levels that should be protected from uplift because they serve onboarding, vocabulary, confidence, pacing, or a satisfying small puzzle.
- Identify prior skills that are under-rehearsed before they become load-bearing.
- Identify challenge-ramp cliffs before Challenge 15, Challenge 22, Challenge 28, and Challenge 37.
- Identify project-arc complexity opportunities using shared-code/coordination criteria rather than isolated block count.
- Produce a prioritized list of follow-up implementation packet candidates.
- Tag recommendations for cohort safety: `ship now`, `cohort boundary`, `optional/lab only`, or `needs owner decision`.

### Out Of Scope

- Source edits.
- Test edits.
- Generated evidence edits.
- Implementing or drafting every follow-up packet in full.
- Final curriculum decisions without owner review.
- Adding new levels unless listed as an owner-decision option.

### Files And Areas Likely Touched

- `reports/development/guided-level-complexity-audit/model-audits/<model-or-thread-name>.md`
- optionally `reports/development/guided-level-complexity-audit/model-audits/<model-or-thread-name>-recommendation-index.md`
- progress notes in the same report folder

## Analysis Requirements

### 1. Per-Level Worksheet

For each guided level, classify:
- primary concept
- category: ordinary, prediction, bug hunt, challenge/synthesis, project step, project capstone, optional lab
- static program complexity from Plan 73
- runtime/reference behavior complexity from Plan 74
- cognitive engagement level:
  - onboarding/simple by design
  - satisfying small puzzle
  - thin/repetitive
  - appropriate integration
  - overloaded/confusing
- prior-skill integration currently present
- prior-skill integration opportunity, if any
- risk if uplifted
- cohort-safety tag

Constraints:
- Render the worksheet as a single Markdown table with one row per level.
- Use the columns above in the exact listed order. Models may add a short narrative section below the table, but the table itself is the comparable artifact.
- Do not rely on block count alone.
- Treat early onboarding levels with special care.
- Mark `fine as-is` when appropriate.
- State explicitly that `ship now` / `cohort boundary` cohort-safety tags are inferred from documented pilot state (`docs/TeacherGuide.md`, prior packet history, and integration-owner notes), not from direct classroom observation.

### 2. Challenge-Ramp Analysis

Required behavior:
- Build a ramp table leading into Challenge 15, Challenge 22, Challenge 28, and Challenge 37.
- For each ramp, identify:
  - skills expected by the challenge
  - where each skill was introduced
  - where each skill was rehearsed in combination
  - any sudden jump in program complexity, branch count, enemy pressure, or coordination demand

Expected output:
- A short narrative per challenge explaining whether the ramp feels smooth, abrupt, or uneven.

### 3. Rehearsal-Debt Analysis

Required behavior:
- Identify skills introduced once but not practiced enough before becoming load-bearing.
- Pay special attention to:
  - readiness checks
  - directional sensing
  - flag/teammate state
  - resource checks
  - territory/side checks
  - boolean `AND`/`OR`/`NOT`
  - comparisons
  - runner index
  - shared project code
  - own-flag-home scoring pressure if relevant to optional/project play

Expected output:
- A table of skill, introduced at, next load-bearing use, rehearsal gap, recommended repair type.

### 4. Project Arc Analysis

Required behavior:
- Analyze `strategy-brain` and `team-strategy-script` separately.
- Account for shared workspace accumulation.
- Ask whether each project level requires students to preserve, adapt, or decompose prior code.
- Identify opportunities for richer decentralized coordination rather than just more blocks.

Constraints:
- Do not recommend hiding broad project toolboxes unless owner explicitly reopens Plan 08 decisions.
- Prefer role/local-rule improvements over central-command patterns.

### 5. Protected-Level List

Required behavior:
- List levels that should probably remain simple.
- For each, name the reason:
  - onboarding
  - vocabulary introduction
  - UI/controls practice
  - satisfying small surprise
  - breather/pacing
  - fragile pilot/cohort safety

### 6. Recommendation Clusters

Required behavior:
- Group possible implementation work into reviewable clusters, not a giant campaign rewrite.
- For each cluster, include:
  - affected levels
  - learning goal
  - proposed uplift pattern
  - likely touched files
  - validation needs
  - subsystem notes likely affected
  - cohort-safety tag
  - owner decisions needed

Suggested cluster types:
- early standalone cross-skill integration
- pre-Challenge 22 sensing/resource rehearsal
- Strategy Brain project complexity
- Team Strategy Script coordination complexity
- bug-hunt/prediction rebalancing
- optional-lab or cohort-boundary additions

### 7. Prioritized Implementation Candidates

Required behavior:
- Recommend the top 8-12 opportunities ranked by:
  - learning benefit
  - challenge-ramp smoothing
  - AP CSA transfer value
  - implementation blast radius
  - pilot/cohort safety
  - validation cost

Constraints:
- Preserve open questions.
- Do not imply implementation approval.
- Name which opportunities should wait for owner review.
- Use stable recommendation ids in the form `<MODEL>-<LETTER>`, where `<MODEL>` is the uppercase model name exactly (`CODEX`, `CLAUDE`, `GEMINI`) and `<LETTER>` is sequential from A. Second-pass audits append a digit to the model token, such as `CODEX2-A` or `CLAUDE2-A`.

### 8. Comparison-Friendly Summary

Required behavior:
- Include a concise final section named `Comparison Summary`.
- List:
  - top 5 recommendations
  - top 5 protected levels
  - biggest challenge-ramp concern
  - biggest rehearsal-debt concern
  - one recommendation the model is least confident about
  - one place where another model might reasonably disagree

Constraints:
- This section is for later cross-model comparison, not consensus.
- Keep it short and scannable.
- The "another model might reasonably disagree" item must be answered without reading other models' audits and should be marked as a guess in the report itself.

## Work Plan

1. Read Plan 73 and 74 summary indexes.
2. Skim per-level dossiers only as needed, starting with low-complexity or suspicious rows.
3. Build per-level worksheet.
4. Build challenge-ramp and rehearsal-debt analyses.
5. Identify protected levels.
6. Cluster recommendations into packet-sized follow-ups.
7. Write the model-specific audit under `model-audits/`.
8. Add a concise model-specific recommendation index if useful.

## Commands

This is scan-only. No source validation commands are required unless generated reports appear stale.

Optional verification from repository root:

```powershell
npm run level:dossiers
npm run level:behavior-evidence
```

Do not run implementation tests unless you discover generated evidence is stale and need to confirm the baseline.

## Validation Checklist

- [ ] A model-specific audit exists under `model-audits/`.
- [ ] Audit distinguishes factual evidence from curriculum judgment.
- [ ] Every guided level category is represented.
- [ ] Protected levels are listed with reasons.
- [ ] Challenge-ramp analysis covers Challenge 15, 22, 28, and 37.
- [ ] Rehearsal-debt table is included.
- [ ] Project arcs are analyzed with shared-code context.
- [ ] Recommendations are clustered into packet-sized follow-ups.
- [ ] Each recommendation has a cohort-safety tag.
- [ ] Recommendation ids are stable enough for later cross-model comparison.
- [ ] `Comparison Summary` section is included.
- [ ] Open owner decisions are preserved.
- [ ] No source files, generated evidence files, or other models' audit files were edited.

## Stop Conditions

Stop and ask for owner review if:
- Plan 73 or Plan 74 outputs are missing or too incomplete for fair analysis.
- Generated evidence contradicts current source files in a way that changes conclusions.
- The audit requires changing the guided concept sequence.
- A recommendation would require broad source-of-truth decisions before it can be scoped.
- The only credible repair is adding new mandatory levels or renumbering the campaign.
- Another model's audit appears wrong or incomplete. Note disagreement in your own report; do not edit their file.
