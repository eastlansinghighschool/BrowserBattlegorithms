---
id: plan-91-usage-tracker-v2-rewrite-semantics-amendment
title: "Usage Tracker V2 Rewrite Semantics Amendment"
status: complete
resolution: "Completed and verified 2026-07-07. Plan 84 now records optional rewrite-aware Usage Tracker V2 fields, v1-compatible absence behavior, compact teacher-useful signal guidance, and neutral downstream implementation packet wording replacing the retired Plan 85/86/87 slot labels."
depends_on: [plan-84-usage-tracker-v2-design-contract, plan-85-campaign-rewrite-charter]
gate: "before mutation; this packet should not run until Plan 85 owner gate is resolved"
summary: >-
  Amend Plan 84 before tracker implementation so Usage Tracker V2 can capture rewrite-aware semantics: arcs, board-dynamics tiers, bestiary encounters, stars/par/mastery outcomes, film-review summaries, and corrected downstream numbering.
---
# Plan 91: Usage Tracker V2 Rewrite Semantics Amendment

- Packet id: Plan 91
- Packet title: Usage Tracker V2 Rewrite Semantics Amendment
- Status: (see frontmatter)
- Owner/model: orchestration docs agent
- Date: 2026-07-06
- Packet type: design / docs
- Mutation level: docs-only
- Approval gate: before mutation; this packet should not run until Plan 85 owner gate is resolved
- Expected artifacts:
  - amended Plan 84 usage-tracker contract
  - updated packet index/status notes
  - explicit renumbering of Plan 84's old downstream "Plans 85-87" references
  - progress report
- Progress report folder: `reports/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment/`
- Progress report file: `reports/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment/progress.md`

## Packet Summary

Goal: Amend the settled Usage Tracker V2 contract so it can capture the campaign-rewrite semantics introduced by Plan 85: visible mini-arcs, board dynamics tiers, bestiary encounters, star/par/mastery outcomes, and post-level film-review evidence.

Non-goals:
- Do not implement Usage Tracker V2.
- Do not change usage capture code, admin UI, storage, exports, or local cohort tooling.
- Do not decide campaign rewrite content.
- Do not change Plan 84's already-settled privacy and pruning decisions except where new fields must be mentioned.

Depends on:
- Plan 84 design contract.
- Plan 85 owner acceptance or explicit owner instruction to draft against its current defaults.
- Preferably Plans 87-90 complete so packet status references are stable.

Blocks:
- Any Plan 84 downstream implementation packet.
- Star/par implementation that writes usage data.
- Cohort analysis that expects rewrite-aware usage fields.

Why this packet exists:
Plan 84 designed a stronger usage ledger before the campaign rewrite charter introduced arcs, stars, bestiary language, and film review. If the tracker implementation runs unchanged, it may preserve attempts and XML better but miss the pedagogical signals the rewrite is about to create.

## Authority And Contracts

Required project contracts:
- `docs/development/plan-84-usage-tracker-v2-design-contract.md`
- `docs/development/plan-85-campaign-rewrite-charter.md`
- `docs/packet-creation-guidance.md`
- `docs/subsystems/usage-tracking.md` if present; otherwise locate usage docs with `rg`
- `src/usage/`
- `src/admin/`

Do not redefine:
- Raw student exports and local cohort databases remain untracked.
- Usage Tracker V2 must remain browser-local/static-deploy compatible.
- Existing v1 exports need a back-compat path.
- The admin view should tell a progress story without semester-specific grading targets.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 84.
- Plan 85.
- Plans 79-83.
- Current usage/admin subsystem docs.
- Current usage format source under `src/usage/`.

Use `rg` for:
- `usage`
- `schemaVersion`
- `guided`
- `levelIds`
- `challengeSummary`
- `star`
- `arc`
- `bestiary`

## Scope

### In Scope

- Amend Plan 84's design text to add rewrite-aware fields and downstream numbering.
- Add a small compatibility note describing how v1 exports remain valid when these fields are absent.
- Update packet index text if needed.
- Write a progress report.

### Out Of Scope

- Any source-code implementation.
- Any local cohort database changes.
- Any raw/anonymized usage data processing.
- Any campaign level edits.

## Amendment Requirements

### 1. Rewrite-Aware Fields

Required behavior:
- Add design-contract language for optional/future fields:
  - `arcId`
  - `arcStageIndex` / `arcStageCount`
  - `boardDynamicsTier`
  - `bestiaryEncounterIds` or equivalent cheap encounter signal
  - pass/par/mastery star outcomes
  - mastery criterion id from Plan 85's closed vocabulary
  - film-review summary fields if the owner keeps S7

Constraints:
- Fields must degrade cleanly when old levels or old exports do not have them.
- Do not require server storage.

### 2. Numbering Repair

Required behavior:
- Replace Plan 84's old internal "Plans 85-87" downstream references with the current plan numbers or neutral "downstream implementation packets" phrasing.

Constraints:
- Do not alter Plan 84 decisions D1-D4 unless the owner explicitly asks.

### 3. Privacy And Teacher Value Check

Required behavior:
- Add a short note that new rewrite fields should help teachers understand learning progress without capturing unnecessary high-volume raw event tails.

Constraints:
- Preserve the storage-pruning direction from Plan 84.
- Do not turn cohort insight goals into student surveillance.

## Work Plan

1. Verify Plan 85 acceptance status; if still unaccepted, stop unless the owner explicitly directs this packet to proceed as a draft amendment.
2. Patch Plan 84 docs only.
3. Patch README/index status notes only if needed.
4. Write the progress report.

## Commands

Docs-only packet. Run:

```powershell
rg "Plans 85|arcId|boardDynamicsTier|star|mastery" docs/development/plan-84-usage-tracker-v2-design-contract.md docs/development/README.md
npm run plan:check
```

If Bootstrap plan-status commands are unavailable, record that Plan 87/88 has not landed and use a manual README/status check.

## Validation Checklist

- [ ] Plan 84 has rewrite-aware optional fields.
- [ ] Plan 84's stale downstream numbering is repaired.
- [ ] No code, usage data, level data, or generated reports changed.
- [ ] Privacy/storage-pruning constraints remain intact.
- [ ] Progress report lists exactly what changed.

## Stop Conditions

- Plan 85 owner gate is unresolved and the owner has not explicitly allowed draft amendment work.
- A requested tracker field would require server storage.
- The amendment would change Plan 84's core privacy/pruning decisions.
