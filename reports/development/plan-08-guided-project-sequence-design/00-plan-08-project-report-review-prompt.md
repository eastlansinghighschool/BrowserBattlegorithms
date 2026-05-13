# Plan 08 Independent Project Report Review Prompt

You are an independent orchestration reviewer for Browser Battlegorithms Plan 08.

Your job is to review the first-stage Plan 08 project audit report and produce your own recommendations for the guided project sequence design. Think like an orchestrator, not an implementation agent: you are helping decide the project arcs, curriculum meaning, architecture contracts, and downstream handoff shape before source code changes begin.

## Critical Independence Rule

Do not read or use other independent review subfolders.

Specifically, if this repository already contains folders under:

- `reports/development/plan-08-guided-project-sequence-design/orchestration-reviews/`

ignore all sibling review folders except the output folder assigned to you by the integration owner. This is to avoid contaminating your recommendations with another model's conclusions.

If you need to list the directory to create your own output folder, do not open files inside other review folders.

## Output Location

Ask the integration owner for your reviewer id if it has not been provided. Use a short id such as:

- `codex`
- `claude-opus`
- `gemini-pro`

Write your recommendations only inside:

`reports/development/plan-08-guided-project-sequence-design/orchestration-reviews/<reviewer-id>/`

Create at least:

- `recommendations.md`

You may also create supporting notes in that same folder if helpful, but keep the main recommendation readable on its own.

## Required Reading

Read these files before recommending decisions:

- `docs/development/plan-08-guided-project-sequence-design.md`
- `reports/development/plan-08-guided-project-sequence-design/project-audit.md`
- `docs/development/README.md`
- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/GameSpecification.md`
- `docs/ARCHITECTURE.md`

Inspect these source areas enough to verify the report's claims:

- `src/config/levels/phases/advanced-logic/`
- `src/config/levels/phases/advanced-teamplay/`
- `tests/unit/fixtures/guided-reference-solutions/`

Use `rg` to find related symbols, level ids, toolbox references, win conditions, and storage behavior when needed.

## Context To Preserve

The integration owner has already accepted these broad directions:

- Use two shared-code guided projects.
- One project should lead into `full-team-tactics`.
- One project should lead into `advanced-scrimmage`.
- Going backward inside a project should use the shared latest project code everywhere.
- Project starts should unlock several capabilities at once so carried code remains editable on earlier project levels.
- Project starts need explicit UI/copy/signifier treatment.
- A future visual project version history is desirable, but it is its own later packet.

Do not spend the review arguing against shared-code projects in general. You may still recommend staging, trimming, or delaying a project feature if the evidence says it is too risky for classroom rollout.

## Review Questions

Answer these directly in `recommendations.md`:

1. Does the audit report accurately describe the current advanced-logic and advanced-teamplay levels?
2. Which levels should belong to the Strategy Brain project before `full-team-tactics`?
3. Which levels should belong to the Team Strategy Script project before `advanced-scrimmage`?
4. Which current levels should be kept, condensed, merged, renamed, deferred, or removed from the project path?
5. What should unlock at each project start, and why?
6. Should project toolboxes remain broad for the whole project, or should the UI focus student attention while keeping all project blocks technically available?
7. What should reset, backtracking, and ordinary guided persistence mean under shared latest code?
8. What should later packets treat as fixed contracts?
9. What are the biggest testing risks for Plan 13?
10. What decisions still require the integration owner?

## Recommendation Format

Use this structure:

```markdown
# Plan 08 Independent Recommendations: <reviewer-id>

## Executive Recommendation

## Audit Check

## Proposed Project A: Strategy Brain

## Proposed Project B: Team Strategy Script

## Toolbox And Persistence Contracts

## UI And Student-Facing Framing

## Testing Implications

## Downstream Packet Contracts

## Open Questions For The Integration Owner

## Confidence And Risks
```

Include tables when they clarify level membership. A useful table format is:

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |

## Decision Boundaries

Do not edit source code.

Do not edit `docs/development/project-sequence-decisions.md` or `docs/development/project-level-map.md`; those are final orchestration artifacts that should be created after comparing the independent reviews.

Do not update Plans 09-14. The integration owner or primary orchestrator will do that after decisions are made.

Do not redefine the core game rules, one-action-per-turn model, or static deployment target.

If the audit report is missing important evidence, say what is missing and inspect the repository directly enough to make a reasoned recommendation.
