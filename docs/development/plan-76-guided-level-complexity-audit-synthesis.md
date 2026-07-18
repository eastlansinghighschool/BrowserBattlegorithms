---
id: plan-76
title: "Guided Level Complexity Audit Synthesis"
status: complete
depends_on: []
gate: "before implementation packets, before resolving divergent recommendations, before level/source changes, before curriculum source-of-truth changes"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Repeatable orchestration-grade synthesis that compares Plan 75 model audits without smoothing disagreement, producing model-specific comparison artifacts for owner triage. Codex, Claude Opus, and Gemini syntheses landed under `reports/development/guided-level-complexity-audit/syntheses/`.
---
# Plan 76: Guided Level Complexity Audit Synthesis

- Packet id: Plan 76
- Packet title: Guided Level Complexity Audit Synthesis
- Status: (see frontmatter)
- Owner/model: orchestration-grade model that did not author a Plan 75 audit
- Date: 2026-05-21
- Packet type: scan-only / synthesis / curriculum / product / planning
- Mutation level: reports-only
- Approval gate: before implementation packets, before resolving divergent recommendations, before level/source changes, before curriculum source-of-truth changes
- Expected artifacts:
  - model-specific synthesis report comparing Plan 75 audits
  - recommendation comparison table
  - protected-level comparison table
  - challenge-ramp comparison
  - rehearsal-debt comparison
  - owner-decision item list
  - fast-track candidate list
  - candidate Plan 77+ packet map
- Progress report folder: `reports/development/guided-level-complexity-audit/syntheses/`
- Progress report file: `reports/development/guided-level-complexity-audit/syntheses/<model-or-thread-name>.md`

## Packet Summary

Goal: Compare the independent Plan 75 model audits and produce a comparison-first synthesis artifact that helps the integration owner decide which follow-up implementation packets to draft, which disagreements need owner judgment, and which unique recommendations deserve further review.

This packet is intentionally repeatable by multiple fresh orchestration-grade models. Each model should produce an independent synthesis under its own filename so the integration owner can compare synthesis styles and judgment calls before choosing Plan 77+ work.

Non-goals:
- Do not edit source code, guided levels, fixtures, docs, tests, generated evidence, or Plan 75 audit files.
- Do not implement level changes.
- Do not draft full Plan 77+ implementation packets.
- Do not rewrite either audit into a single unified narrative.
- Do not smooth disagreement into consensus.
- Do not invent new curriculum recommendations that do not appear in either source audit.
- Do not resolve owner decisions.

Depends on:
- Plan 73 complete: per-level dossiers and summary index exist.
- Plan 74 complete: reference behavior evidence and behavior summary index exist.
- Plan 75 Codex audit complete: `reports/development/guided-level-complexity-audit/model-audits/codex-audit.md`
- Plan 75 Claude audit complete: `reports/development/guided-level-complexity-audit/model-audits/claude-audit.md`

Blocks:
- Owner triage of complexity-audit recommendations.
- Plan 77+ implementation packet drafting.
- Possible future synthesis of multiple Plan 76 outputs if the owner runs Codex, Claude, and Gemini synthesis passes.

Why this packet exists:
Plan 75 deliberately preserved independent model judgment about guided-level difficulty, challenge ramps, protected levels, and implementation opportunities. The next step should make agreement, divergence, and one-model-only insights visible without collapsing them into a false consensus. The synthesis should let the owner act from a 15-20 minute comparison artifact while preserving links back to the source audits for drill-down.

## Authority And Contracts

Required project contracts:
- Guided mode generally teaches one primary concept at a time unless a level is clearly marked synthesis/challenge/project.
- Demo Blockly should show structure, not reveal the exact active solution.
- Student programs run from `On Each Turn`.
- Only the first reached action executes each turn.
- Project levels may carry shared latest code across their arcs.
- Multi-ally strategy should teach decentralized coordination through local sensing, roles, and state checks.
- Guided source, concept matrix, StudentGuide, TeacherGuide, subsystem notes, fixtures, and tests must agree after any later implementation.
- Plan 75 source audits are the recommendations being compared. They are not to be edited or overwritten.

Do not redefine:
- The core game rules.
- The guided level order or project membership.
- The concept matrix as source truth without owner approval.
- Challenge/synthesis labels.
- AP CSA bridge priorities.
- Static deployment constraints.
- The source audits' stated recommendations, confidence, or disagreement points.

## Required Reading

Read before synthesis:
- `docs/development/plan-76-guided-level-complexity-audit-synthesis.md`
- `docs/development/plan-75-guided-level-complexity-audit.md`
- `reports/development/guided-level-complexity-audit/model-audits/codex-audit.md`
- `reports/development/guided-level-complexity-audit/model-audits/claude-audit.md`
- `reports/development/guided-level-complexity-audit/summary-index.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`
- `reports/development/plan-73-guided-level-dossier-generator/progress.md`
- `reports/development/plan-74-guided-reference-behavior-evidence/progress.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`

Optional/contextual reading:
- `reports/development/guided-level-complexity-audit/level-dossiers/` only when needed to check a factual statement from the audits.
- `reports/development/guided-level-complexity-audit/behavior-evidence/` only when needed to check a factual statement from the audits.
- `docs/subsystems/blockly-workspace.md`, `docs/subsystems/turn-engine.md`, and `docs/subsystems/npc-and-cpu.md` only when a comparison item hinges on a runtime contract.

Do not read:
- Another Plan 76 synthesis file under `reports/development/guided-level-complexity-audit/syntheses/` before publishing your own. If another synthesis is already present, leave it unopened. Later comparison of synthesis reports belongs to the owner or a later packet.

## Multi-Model Execution Contract

This packet may be run multiple times by fresh orchestration models or separate orchestration threads.

Each run must:
- Be authored by a model/thread that did not write either Plan 75 audit being compared.
- Read both source audits: `codex-audit.md` and `claude-audit.md`.
- Write a separate synthesis file under `reports/development/guided-level-complexity-audit/syntheses/`.
- Use a distinct filename such as:
  - `codex-synthesis.md`
  - `claude-synthesis.md`
  - `gemini-synthesis.md`
- Not overwrite or revise another model's synthesis.
- Not read another model's existing synthesis file before publishing its own.
- Not edit either Plan 75 audit.
- Not add recommendations that are absent from the Plan 75 audits.
- Preserve source-audit disagreement visibly.
- Tag any synthesizer interpretation as `synthesizer judgment`, distinct from source-audit content.

Recommended per-model synthesis frontmatter:

```markdown
# Guided Level Complexity Audit Synthesis — <model/thread name>

- Packet: Plan 76
- Model/thread:
- Date:
- Source audits reviewed:
  - Codex audit: yes/no
  - Claude audit: yes/no
- Evidence consulted beyond source audits:
- Scope notes:
- Major assumptions:
```

## Scope

### In Scope

- Compare the Plan 75 Codex and Claude audits.
- Attribute each recommendation topic to its source audit(s).
- Classify comparison rows as `unanimous`, `divergent`, `unique-to-Codex`, or `unique-to-Claude`.
- Compare protected-level lists.
- Compare challenge-ramp concerns for Challenge 15, Challenge 22, Challenge 28, and Challenge 37.
- Compare rehearsal-debt concerns by skill.
- Identify owner-decision items.
- Identify fast-track candidates where both audits agree in the same direction.
- Build a candidate Plan 77+ packet map.
- Preserve source-audit reasoning with concise quotation or near-verbatim summary and source references.

### Out Of Scope

- New curriculum analysis beyond comparing the two audits.
- New recommendations absent from both source audits.
- Source edits.
- Test edits.
- Generated evidence edits.
- Plan 75 audit edits.
- Resolving divergent items.
- Drafting full downstream implementation packets.
- Reading source level files to compare recommendations.

### Files And Areas Likely Touched

- `reports/development/guided-level-complexity-audit/syntheses/<model-or-thread-name>.md`

## Synthesis Requirements

### 1. Recommendation Comparison Table

Required behavior:
- Build one row per recommendation topic, not one row per source-audit recommendation id.
- Merge recommendations into the same topic only when they address substantially the same area and direction.
- Preserve source recommendation ids.

Required columns in exact order:
- topic
- Codex position (id + summary)
- Claude position (id + summary)
- agreement bucket
- source references
- synthesizer note (factual only, no judgment)

Agreement bucket values:
- `unanimous`
- `divergent`
- `unique-to-Codex`
- `unique-to-Claude`

Constraints:
- If both audits discuss the same area but one says protect/defer and the other says uplift/fast-track, classify as `divergent`.
- If one audit is silent, classify as unique to the model that raised it. Do not treat silence as disagreement.
- The synthesizer note must be factual comparison only.

### 2. Protected-Level Comparison Table

Required behavior:
- Compare protected-level lists and reasons.
- Include both exact overlaps and near-overlaps.

Required columns:
- level or level group
- Codex protection rationale
- Claude protection rationale
- agreement bucket
- source references
- synthesizer note (factual only, no judgment)

### 3. Challenge-Ramp Comparison

Required behavior:
- Compare the two audits' verdicts for Challenge 15, Challenge 22, Challenge 28, and Challenge 37.
- Use only those four challenge inflection points. If an audit raises another ramp concern, place it in rehearsal-debt or owner-decision analysis, not as a fifth challenge-ramp row.

Required columns:
- challenge ramp
- Codex verdict
- Claude verdict
- agreement bucket
- factual disagreement, if any
- owner attention needed

### 4. Rehearsal-Debt Comparison

Required behavior:
- Build one row per skill or debt topic.
- Preserve skills raised by only one audit.

Required columns:
- skill or debt topic
- Codex concern
- Claude concern
- agreement bucket
- likely downstream packet area
- owner attention needed

### 5. Owner-Decision Items

Required behavior:
- List every divergent item and every unique-to-one-model item that could plausibly affect implementation priority.
- Include both source audits' reasoning when both are available.
- Use concise quotation or near-verbatim summaries, with source references.
- Recommend a resolution path, not a resolution.

Allowed resolution paths:
- owner chooses one direction
- owner asks for a focused level-design packet
- owner asks for a factual evidence refresh
- owner defers to cohort boundary
- owner marks optional/lab only

Constraints:
- Do not decide the item yourself unless the item is purely factual and settled by Plan 73/74 evidence.
- Any synthesizer interpretation must be marked `synthesizer judgment`.

### 6. Fast-Track Block

Required behavior:
- List unanimous recommendations that are candidates for packet drafting with minimal additional owner reading.
- Sort by combined learning benefit, low risk, pilot/cohort safety, and validation cost.

Constraints:
- Phrase as "fast-track to packet drafting," not "fast-track to implementation."
- Owner approval is still required before any downstream packet is dispatched.

### 7. Candidate Plan 77+ Packet Map

Required behavior:
- Map comparison rows to likely downstream packet candidates without drafting the packets.

Required columns:
- candidate packet
- source recommendation ids
- agreement bucket
- likely scope
- owner decision needed
- suggested implementation model tier
- validation risk

Suggested model tier values:
- lower-cost implementation model
- level-editing specialist
- orchestration-grade design first
- owner decision before model assignment

### 8. Open Questions Surfaced By Comparison

Required behavior:
- List gaps that become visible only after comparing the audits.
- Examples:
  - both audits assume a pilot/cohort state not explicitly confirmed
  - both audits rely on a not-applicable runtime evidence boundary
  - both audits agree on a topic but disagree on packet size or timing

### 9. Comparison Summary

Required behavior:
- Include a concise final section named `Comparison Summary`.
- Include:
  - top unanimous packet candidates
  - top divergent owner decisions
  - top unique-to-Codex item
  - top unique-to-Claude item
  - biggest shared challenge-ramp concern
  - biggest shared rehearsal-debt concern
  - one place the synthesizer is least confident

Constraints:
- Keep it short and scannable.
- Mark synthesizer interpretation as `synthesizer judgment`.

## Work Plan

1. Confirm both Plan 75 source audits exist.
2. Confirm no existing Plan 76 synthesis file will be opened.
3. Read both source audits.
4. Extract recommendation ids, protected levels, challenge-ramp concerns, rehearsal-debt concerns, project-arc concerns, and comparison summaries.
5. Build the required comparison tables.
6. Consult Plan 73/74 summary indexes only to settle factual comparison points.
7. Write the model-specific synthesis under `reports/development/guided-level-complexity-audit/syntheses/`.
8. Stop without drafting implementation packets.

## Commands

This is scan-only. No source validation commands are required.

Optional file-existence check from repository root:

```powershell
Get-ChildItem reports/development/guided-level-complexity-audit/model-audits
```

Do not run implementation tests. Do not regenerate Plan 73 or Plan 74 evidence unless the owner explicitly asks.

## Validation Checklist

- [ ] A model-specific synthesis exists under `reports/development/guided-level-complexity-audit/syntheses/`.
- [ ] The synthesis compares both source audits.
- [ ] No other Plan 76 synthesis was read before publishing.
- [ ] Recommendation comparison table is present.
- [ ] Protected-level comparison table is present.
- [ ] Challenge-ramp comparison covers Challenge 15, 22, 28, and 37 only.
- [ ] Rehearsal-debt comparison is present.
- [ ] Owner-decision items preserve divergent and unique recommendations.
- [ ] Fast-track block says packet drafting, not implementation.
- [ ] Candidate Plan 77+ packet map is present.
- [ ] Synthesizer judgments are labeled as such.
- [ ] No new recommendations absent from both audits were introduced.
- [ ] No source, level, fixture, generated-evidence, Plan 75 audit, or other Plan 76 synthesis file was edited.

## Stop Conditions

Stop and ask for owner review if:
- Either source audit is missing.
- The available audits are not comparable enough to build the required tables.
- A factual disagreement between audits cannot be settled from Plan 73/74 summary evidence.
- A recommendation requires reading guided-level source to compare.
- The comparison appears to require adding a new recommendation absent from both audits.
- You are tempted to resolve a curriculum disagreement instead of surfacing it.
- Another model's Plan 76 synthesis appears wrong or incomplete. Do not edit or critique it inside your own synthesis unless the owner explicitly asks for a later meta-synthesis.
