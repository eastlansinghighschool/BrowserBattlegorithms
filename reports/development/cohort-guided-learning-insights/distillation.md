# Cohort Guided Learning Insights

## 1. Privacy Note

This tracked distillation intentionally omits exact cohort counts, percentages, rates, student identifiers, anonymized row ids, export ids, session ids, hashes, and row-level examples. The richer evidence remains local under:

```text
local/usage-cohorts/<cohort-id>/analysis/model-audits/
```

The source material was the set of local Plan 82 aggregate-only CODEX audits. Raw exports, identity maps, and anonymized row-level tables were not used for this tracked conclusion.

## 2. Distilled Findings

| Finding id | Area | Directional claim | Evidence confidence | Source audit ids | Follow-up |
|---|---|---|---|---|---|
| COHORT-A | Instrumentation | A recurring cross-cohort signal is that the retained event stream reaches its ceiling, making early per-level pass/fail rows incomplete. | strong directional signal | Local audit A/CODEX-D; Local audit B/CODEX-C; Local audit C/CODEX-D | Prioritize retention-aware analysis or compact cumulative milestone support before relying on exact level rates. |
| COHORT-B | Progression | The first synthesis challenge, Challenge 22: Show What You Know, is a practical stopping boundary for several cohorts. This may reflect pacing or export timing as much as learning difficulty. | moderate directional signal | Local audit B/CODEX-A; Local audit C/CODEX-A | Test a short trace-and-predict bridge before changing the challenge or its prerequisites. |
| COHORT-C | Synthesis friction | Revisits around Challenge 22: Show What You Know are a possible signal of productive debugging, hidden prerequisite dependence, or a need for deliberate tracing. | moderate directional signal | Local audit C/CODEX-B | Pilot teacher prompts that ask students to name the first action, board condition, and next-turn consequence. |
| COHORT-D | Multi-ally strategy | One reviewed cohort reached the later shared-program and advanced-scrimmage arc more substantially than the others, while the other audits provide little exposure to that arc. | weak/data-limited signal | Local audit A/CODEX-A; Local audit A/CODEX-B; Local audit B/CODEX-A; Local audit C/CODEX-A | Gather more late-arc evidence before redesigning multi-ally levels. |
| COHORT-E | Navigation | No retained audit showed a strong navigation-confusion pattern, but the retention ceiling makes absence of backtracking weak evidence. | weak/data-limited signal | Local audit A/CODEX-E; Local audit B/CODEX-D; Local audit C/CODEX-E | Do not prioritize navigation changes from this dataset alone. |
| COHORT-F | Early campaign | The early-level zero-pass patterns should not be interpreted as widespread student failure because they conflict with later milestone evidence and retention warnings. | strong directional signal | Local audit A/CODEX-D; Local audit B/CODEX-C; Local audit C/CODEX-D | Keep early-level repair decisions separate from this cohort evidence until the analyzer is retention-aware. |

## 3. Agreement And Disagreement

The audits agree that the event-retention ceiling is the most important evidence limitation. They also agree that the available data do not justify exact early-level difficulty claims, broad navigation repairs, or a source-level redesign based only on the retained pass rows.

The cohort patterns differ in a meaningful way. Two reviewed cohorts largely end near Challenge 22: Show What You Know, while another has a visible tail into the shared-program, multi-ally, and advanced-scrimmage arc. The audits preserve both interpretations: this may reflect course pacing and exposure, while the later arc may still deserve a targeted role-tracing support pilot. The evidence does not establish that the later arc is inaccessible or defective.

The revisit interpretation remains intentionally unresolved. Repeated work around Challenge 22 may be healthy review, repeated debugging, hidden prerequisite dependence, or a mixture. The local audits recommend a teacher-facing trace intervention before a level rewrite.

## 4. Candidate Follow-Up Packets

| Packet candidate | Type | Rationale | Privacy-safe evidence summary | Scope size | Owner decision needed |
|---|---|---|---|---|---|
| Retention-aware usage analysis | usage instrumentation improvement | Exact per-level comparisons are currently weakened by capped event histories. | Every reviewed cohort audit identified the retention ceiling and truncation warnings as a major limitation. | medium, contract-guided | Choose whether to improve the analyzer, the retained event contract, or both before the next cohort. |
| Challenge 22 trace bridge | teacher/UI clarification | The first synthesis challenge is a recurring boundary and revisit point in the available evidence. | Several audits place the practical cohort boundary around Challenge 22 and recommend deliberate tracing. | small | Decide whether to pilot prompts or a lightweight checkpoint before changing level content. |
| Multi-ally role-trace support | guided-level or teacher-support review | The later shared-program arc needs more evidence and may benefit from explicit role decomposition. | One audit has meaningful late-arc exposure; the other audits have little or none. | small | Wait for more exposure or run a bounded role-tracing pilot without restructuring the arc. |
| Later-arc exposure check | further analysis/query | Current cohorts do not provide balanced evidence across the full campaign. | Late-arc exposure is uneven across the reviewed cohorts. | small | Decide whether future exports should be collected after major campaign arcs. |

## 5. Owner Decisions

1. Prioritize retention-aware usage analysis before treating future cohort pass rates as precise level evidence.
2. Pilot a Challenge 22 trace-and-predict support move before approving a source-level challenge rewrite.
3. Defer multi-ally level redesign until another cohort or a deliberate late-arc pilot provides broader exposure.
4. Decide whether to collect exports at major campaign boundaries so course pacing and learning friction can be distinguished more clearly.

## 6. Local Evidence Pointers

The local source audits remain under:

```text
local/usage-cohorts/<cohort-id>/analysis/model-audits/
```

The tracked report does not reproduce their exact denominators or local findings. Any future reviewer needing richer evidence must follow the privacy contracts in Plans 80 through 83 and keep that evidence local.
