---
id: plan-110
title: "Usage Tracker V2 Rewrite-Aware Fields Receptacle"
status: complete
resolution: "Plan 91 rewrite-aware receptacle: 11 optional additive ledger slots with exact name/vocabulary fidelity, S7 film-review guard resolved (charter in force), no producers, absence semantics tested. Star-group field names ratified at acceptance (decision log 2026-07-22, rename window before plan-96); forward-compat drop semantics pinned by test; vocabularies documented as documentary-only."
depends_on: [plan-106]
gate: "none; Plan 91 settled the field list and its optional/additive semantics"
summary: >-
  Extend the v2 ledger schema to accept Plan 91's rewrite-aware fields (arcs, board-dynamics tiers, bestiary encounters, stars/par/mastery, film-review summaries) as optional, additive, unpopulated fields, so plan-96 and later packets have a settled place to write them.
---
# Plan 110: Usage Tracker V2 Rewrite-Aware Fields Receptacle

## Packet Metadata

- Packet id: `plan-110`
- Packet title: Usage Tracker V2 Rewrite-Aware Fields Receptacle
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-21
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: none; Plan 91 settled the field list and its optional/additive semantics. Adding or renaming fields beyond Plan 91's list requires owner sign-off — stop and surface instead.
- Depends on: plan-106 (v2 ledger schema). Independent of plans 107–109; may run in parallel with them if the owner chooses, but plan-96 must wait for both this packet and the chain it reads.
- Blocks: plan-96's usage-export/star-field slice
- Expected artifacts:
  - v2 ledger schema accepting Plan 91's rewrite-aware fields (nullable/additive, unpopulated)
  - schema validation tolerating absence on both read and write
  - unit tests
  - updated `docs/subsystems/usage-and-admin.md`
  - progress report
- Progress report folder: `reports/development/plan-110-usage-tracker-v2-rewrite-aware-fields-receptacle/`
- Progress report file: `reports/development/plan-110-usage-tracker-v2-rewrite-aware-fields-receptacle/progress.md`

## Packet Summary

Goal: Give the v2 learning ledger a settled, validated place to receive Plan 91's rewrite-aware fields — before any producer writes them. After this packet, plan-96 (stars/par) and future campaign-rewrite packets can populate fields without re-opening schema design.

Non-goals:
- Do not populate any rewrite-aware field from producers. This packet is a receptacle; plan-96 and later packets wire the writes.
- Do not change the export payload (plan-108 owns export shape; nullable fields simply serialize as absent when unset).
- Do not implement stars/par evaluation, film review, or any campaign-rewrite behavior.
- Do not add high-volume raw event tails — Plan 91's privacy check applies to the schema itself.
- Do not add dependencies.

Depends on:
- plan-106 complete (the ledger this extends).

Blocks:
- plan-96's usage-export/star-field slice.

Why this packet exists:
Plan 91 amended Plan 84 so the tracker can capture rewrite-aware semantics — arcs, board-dynamics tiers, bestiary encounters, stars/par/mastery outcomes, film-review summaries — as optional additive fields that older exports and older levels may omit. Without a receptacle packet, plan-96's star slice would be forced to design schema inside a pedagogy packet, which is exactly the kind of silent contract decision the packet system exists to prevent. Keeping this small and separate also keeps plan-106 minimal and lets plan-96 declare a clean dependency.

## Authority And Contracts

Required reading:

- `docs/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment.md` — the field list and its semantics (the spec for this packet).
- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — privacy/pruning decisions the fields must respect.
- `docs/development/plan-85-campaign-rewrite-charter.md` — S6 closed star vocabulary (`masteryCriterionId` values come from here, not invented), S7 film-review direction.
- `docs/development/plan-106-...md` progress report — the landed ledger schema.
- `docs/subsystems/usage-and-admin.md` — update in this patch.

Contracts to preserve (from Plan 91, verbatim intent):

- All rewrite-aware fields are **optional and additive**: old exports and older levels may omit them without breaking analysis.
- v1 files remain valid and analyzable when the fields are absent.
- The signal stays compact and teacher-useful — no high-volume raw event tails, no student surveillance, no server storage.
- `masteryCriterionId` values come from Plan 85's closed vocabulary; this packet defines the slot, not new criteria.

## Scope

### In Scope

- Schema slots on the v2 per-level ledger entry (and session record where appropriate) for:
  - `arcId`, `arcStageIndex`, `arcStageCount`
  - `boardDynamicsTier`
  - `bestiaryEncounterIds` (or an equivalent cheap encounter summary, per Plan 91's wording)
  - star outcome fields for pass / par / mastery
  - `masteryCriterionId` (from Plan 85's closed vocabulary)
  - film-review summary fields, guarded: include only if S7 remains in the final contract at implementation time; if the charter's film-review direction has changed, stop and surface rather than guessing.
- Read/write validation that treats every one of these as optional; absence never warns or fails.
- Serialization behavior: unset fields are absent from exports, not `null` noise.
- Unit tests: presence/absence round-trips, v1-file tolerance, unknown-field tolerance (forward compat).
- Subsystem note update in the same patch.

### Out of Scope

- Producers writing any of these fields.
- Star/par/mastery evaluation logic (plan-96).
- Export-shape changes beyond "unset fields serialize as absent."
- Cohort tooling awareness of the new fields.

### Files And Areas Likely Touched

- The ledger module created in plan-106 (e.g. `src/usage/learningLedger.js`) and/or `src/usage/usageFormat.js` schema definitions.
- `tests/unit/` — ledger schema tests.
- `docs/subsystems/usage-and-admin.md`.

## Work Plan

1. Inspect plan-106's landed schema and Plan 91's exact field wording.
2. Summarize the job back before editing.
3. Add the schema slots and validation.
4. Add unit tests.
5. Run targeted tests, `npm test`, `npm run build`.
6. Update the subsystem note; write the progress report.

## Implementation Requirements

### 1. Field slots

- Required behavior: every Plan 91 field has a typed, documented slot with an explicit "unpopulated until plan-96/later" note in code comments.
- Constraint: field names match Plan 91 exactly (`arcId`, `arcStageIndex`, `arcStageCount`, `boardDynamicsTier`, `bestiaryEncounterIds`, `masteryCriterionId`); deviations need owner sign-off. Star outcome fields should use Plan 85's closed-vocabulary naming — check the charter before naming.
- Edge case: `bestiaryEncounterIds` may be a compact summary rather than a full list (Plan 91 allows "equivalent cheap encounter summary") — pick the cheapest honest form and document it.

### 2. Optional/additive semantics

- Required behavior: reads and writes tolerate absence everywhere; v1 files and pre-rewrite v2 files remain analyzable; unknown fields on read are ignored, not rejected (forward compat for later packets).
- Constraint: no analyzer or export path warns on missing rewrite-aware fields.

### 3. Privacy check

- Confirm against Plan 91: the schema carries no raw event tails, no per-turn data, nothing enabling surveillance-style reconstruction. State the check explicitly in the progress report.

## Commands

```powershell
npm test
npm run build
```

## Validation Checklist

- [ ] All Plan 91 fields have slots; names match the amendment.
- [ ] Absence tolerated on read and write; unset fields absent from serialized output.
- [ ] v1 files still analyzable; unknown-field forward compat tested.
- [ ] No producer writes the new fields (grep-verifiable).
- [ ] `npm test` and `npm run build` pass.
- [ ] Subsystem note updated in the same patch and reads true.
- [ ] Progress report states the Plan 91 privacy check explicitly, plus commands run and remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- Plan 85's film-review direction (S7) has drifted and the film-review fields no longer match the charter — do not guess.
- A field cannot be added without changing Plan 84's privacy or pruning decisions.
- The closed star vocabulary in Plan 85 S6 does not cover a name you need — that is a charter question, not a schema one.
- You find yourself writing producer logic — that belongs to plan-96 or later packets.
