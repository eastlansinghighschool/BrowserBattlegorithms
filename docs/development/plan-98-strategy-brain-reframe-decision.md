---
id: plan-98-strategy-brain-reframe-decision
title: "Strategy Brain Reframe Decision"
status: complete
resolution: "Owner approved Option 3: visible Field Decisions one-ally local-rules arc; preserve strategy-brain id, keep runner-index roles in Team Strategy Script, and separate Challenge 28 live-human evidence."
depends_on: [plan-85-campaign-rewrite-charter]
gate: "before mutation; no source edits"
summary: >-
  Orchestration-grade decision scan for Strategy Brain/project-arc reframing, preserving decentralized coordination goals and producing downstream options without source edits.
---
# Plan 98: Strategy Brain Reframe Decision

- Packet id: Plan 98
- Packet title: Strategy Brain Reframe Decision
- Status: (see frontmatter)
- Owner/model: orchestration-grade scan/design agent
- Date: 2026-07-06
- Packet type: scan-only / design decision
- Mutation level: docs-only
- Approval gate: before mutation; no source edits
- Expected artifacts:
  - Strategy Brain/project-arc reframe decision report
  - owner decision options
  - downstream packet slate if a reframe is approved
  - progress report
- Progress report folder: `reports/development/plan-98-strategy-brain-reframe-decision/`
- Progress report file: `reports/development/plan-98-strategy-brain-reframe-decision/progress.md`

## Packet Summary

Goal: Decide whether and how to reframe the Strategy Brain/project levels after the living-board rewrite direction is clearer, without prematurely editing project-level source.

Non-goals:
- Do not edit project levels.
- Do not rewrite Strategy Brain copy.
- Do not change shared-workspace mechanics.
- Do not resolve every project-level improvement in this packet.

Depends on:
- Plan 85 acceptance.
- Preferably Plan 92 pilot results.
- Plan 75/76 audit and synthesis evidence.
- Current project-level source and docs.

Blocks:
- Any future Strategy Brain/project-arc implementation packets.

Why this packet exists:
The long-term learning goal is ally programs that self-manage and coordinate through local rules rather than central command. Project levels are where that should blossom, but they have different constraints than standalone guided levels: shared workspaces, runner-index roles, accumulated code, and strategy language. They deserve a design decision before implementation.

## Authority And Contracts

Required project contracts:
- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- Plan 75/76 project-level findings.
- Project-level source and reference/project fixtures.
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`

Do not redefine:
- Project levels may accumulate shared code.
- Decentralized coordination is the intended model.
- Demo Blockly shows structure, not exact solutions.
- Static deployment remains required.

## Required Reading

Read before writing the report:
- This packet end-to-end.
- Plan 85.
- Plan 75 audits and Plan 76 syntheses.
- Project levels from Strategy Brain through the final challenge.
- Project fixtures/reference evidence from Plans 73/74/86.
- TeacherGuide/StudentGuide project sections.

Use `rg` for:
- `strategy`
- `project`
- `sharedWorkspace`
- `runnerIndex`
- `advanced-scrimmage`
- `full-team-tactics`

## Scope

### In Scope

- Compare current project arc against the learning goal.
- Identify whether the issue is copy, sequencing, mechanics, evidence, or all of the above.
- Produce 2-4 owner decision options with tradeoffs.
- If a direction is recommended, draft a downstream packet slate at a high level.

### Out Of Scope

- Source edits.
- Copy rewrites.
- Fixture changes.
- Usage tracker changes.

## Report Requirements

The decision report should include:
- Current project-arc story in 1-2 paragraphs.
- What students are currently asked to coordinate.
- Where runner-index roles and local sensing are rehearsed well or poorly.
- Whether Strategy Brain should stay as-is, become a named project arc, split into labs, or be reframed around scouting/roles.
- How the recommendation interacts with living boards, stars, and usage tracking.
- Owner decision items.

## Work Plan

1. Read current project arc source/docs/evidence.
2. Compare against Plan 85 and Plan 75/76 findings.
3. Write the decision report.
4. Do not edit source.
5. Write progress report and stop for owner review.

## Commands

Scan-only. Use searches as needed:

```powershell
rg "sharedWorkspace|runnerIndex|strategy|project" src docs reports
```

If Bootstrap packet-status tooling is available:

```powershell
npm run plan:check
```

## Validation Checklist

- [ ] No source files changed.
- [ ] Report cites current project evidence.
- [ ] Options preserve decentralized coordination as a learning goal.
- [ ] Owner decision items are explicit.
- [ ] Downstream packet slate, if any, is high-level only.

## Stop Conditions

- Required project evidence is missing or stale enough that Plan 86/74 must be rerun first.
- The report would require reading private/local cohort data.
- The model starts inventing new source behavior without evidence.
