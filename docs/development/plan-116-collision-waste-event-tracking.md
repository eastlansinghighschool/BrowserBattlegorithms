---
id: plan-116
title: "Collision And Waste Event Tracking"
status: ready
depends_on: [plan-113]
gate: "before mutation: owner approval of the exact counter definitions (what counts as a collision and as a wasted resource use), presented with event-log evidence"
superseded_by: null
resolution: null
summary: >-
  Build per-level-attempt collision and wasted-resource counters derived from the Plan 35 event log, exposed on the end-of-level details path, so later packets can author honest no-collision and no-wasted-resource star-3 criteria. Tracking only — no criteria, no UI, no export changes.
---
# Plan 116: Collision And Waste Event Tracking

## Packet Metadata

- Packet id: `plan-116`
- Packet title: Collision And Waste Event Tracking
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-08-08
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: before mutation — owner approves the exact counter definitions (what counts as a collision; what counts as a wasted resource use), presented with event-log evidence in the preflight plan.
- Depends on: plan-113 (which dropped `no-collision`/`no-wasted-resource` for lack of this data)
- Blocks: the star-3 criteria expansion authoring packet (follow-on)
- Expected artifacts:
  - per-attempt collision counter and wasted-resource counter, mechanically defined from the Plan 35 event log
  - exposure on the end-of-level `details` path consumed by the star evaluator context
  - unit tests driving real attempts (collisions and waste produced deliberately)
  - updated `docs/subsystems/usage-and-admin.md` and `docs/subsystems/turn-engine.md` as applicable
  - progress report
- Progress report folder: `reports/development/plan-116-collision-waste-event-tracking/`
- Progress report file: `reports/development/plan-116-collision-waste-event-tracking/progress.md`

## Packet Summary

Goal: Make "did the student collide?" and "did the student waste a resource?" answerable from data at level end. After this packet, a follow-on authoring packet can assign `no-collision` and `no-wasted-resource` mastery criteria to scrimmage/resource levels using real counters instead of the speculative fields plan-113 correctly refused to invent.

Non-goals:
- Do not assign mastery criteria, change star metadata, or touch the star evaluator (the follow-on authoring packet does that; plan-116 only makes the data available).
- Do not add UI, export fields, or ledger fields (persistence decisions ride the authoring packet).
- Do not change collision, freeze, or resource game rules — this is instrumentation of existing outcomes.
- Do not build the film-review feature (S7); the counters may later feed it, but no recap logic here.

Depends on:
- plan-113 complete (the deferral this answers).

Blocks:
- The star-3 criteria expansion authoring packet.

Why this packet exists:
Plan-113's gate audit proved that no collision or resource-waste data exists at level end, so every scrimmage/resource level went 2-star max and star 3 currently exists only on Phase 6 multi-ally levels. The owner ratified that shape and deferred this tracking to the backlog (decision log 2026-07-22). This packet builds the missing instrumentation from the Plan 35 event log (`state.eventLog` already records `runner.actionResolved`, `runner.blockedOrBounced`, and collision/freeze outcomes), keeping the star layer's honesty standard: criteria must measure something real.

## Authority And Contracts

Required reading:

- `docs/development/plan-113-campaign-par-mastery-authoring.md` progress report + gate decisions (why the criteria were dropped).
- `docs/decision-log.md` — 2026-07-22 entries (star-3 shape, this deferral).
- Plan 35's event log: find the emission sites (`rg "emit\\(" src/core`) and `docs/subsystems/turn-engine.md` for the event taxonomy (9 v1 kinds including `runner.actionResolved`, `runner.blockedOrBounced`).
- `src/usage/learningLedger.js` Plan 37 note: `resource_no_readiness_guard` learning-moment (prior art for "wasted" semantics).
- `src/core/levels.js` end-of-level path and `src/usage/usageTracker.js` `recordLevelEnded` (plan-111's wiring — where counters must land).
- `src/core/starEvaluation.js` (how the evaluator receives context).

Contracts to preserve:

- No game-rule changes; counters describe outcomes, never alter them.
- One-action-per-turn semantics and engine invariants untouched.
- The counters must be derived from real recorded events/state, not parallel guesses.
- Subsystem notes updated in the same patch for any behavior they describe.

## Scope

### In Scope

- Define the counters precisely (gate item):
  - **Collision count (proposal):** per attempt, the number of collision outcomes involving a player-team runner (ally or human) — derived from the event log's collision/bounce/freeze events. Preflight must state exactly which event kinds/reasons count (e.g. does a wall bounce count? — no; does an ally-ally contact count? — propose with evidence from `runner.blockedOrBounced` reasons).
  - **Wasted resource count (proposal):** per attempt, resource actions spent with no effect — concretely: Area Freeze fired that froze zero runners (the freeze is spent even when it hits nothing, per the game spec). Jump and barrier "waste": propose definitions with evidence or exclude them this round — do not invent vague waste notions.
- Per-attempt accumulation with reset rules (level start/reset), consistent with the engine's reset semantics.
- Exposure of the counters on the end-of-level `details` passed to `recordLevelEnded` and into the star evaluator's context (additive; existing consumers unaffected).
- Unit tests: harness-driven attempts that deliberately collide and deliberately waste a freeze, asserting exact counts; a clean-run attempt asserting zero.
- Subsystem note updates.

### Out of Scope

- Star criteria assignment, evaluator changes, level metadata.
- UI, exports, ledger schema, cohort tooling.
- Any use of the counters by game rules.

### Files And Areas Likely Touched

- `src/core/` (counter accumulation — likely near the event log or turn engine; keep it a passive consumer like Plan 35's design).
- `src/core/levels.js` (details exposure — minimal diff).
- `src/usage/usageTracker.js` (only if the details pass-through needs a field add — additive).
- `tests/unit/` new test file (register in `test:unit`).
- `docs/subsystems/turn-engine.md` and/or `usage-and-admin.md`.

## Work Plan

1. Inspect the event log's actual event shapes for collisions, freezes, and resource readiness (emit sites in `src/core/`).
2. **Preflight plan (gate):** present the exact counter definitions with event-kind evidence, reset rules, and the exposure shape. WAIT for owner approval.
3. Implement counters + exposure.
4. Add tests (deliberate-collision, deliberate-waste, clean-run cases).
5. Run `npm test`, `npm run build`.
6. Update subsystem notes; write the progress report.

## Implementation Requirements

### 1. Counter definitions (gate)

- Each counter has a mechanical definition tied to named event kinds/reasons — no "we'll know it when we see it."
- Definitions must match how a teacher would describe the behavior to a student ("you froze the air" / "you ran into the defender"), per the CopyVoiceContract's plain-language spirit.

### 2. Accumulation and reset

- Counters reset at the same boundary the level-attempt state resets (round reset vs level reset distinction in `turn-engine.md` matters — an attempt's counters must not bleed across resets).

### 3. Exposure

- Additive fields on the end-of-level details (e.g. `collisionCount`, `wastedResourceCount` — final names at preflight) flowing into the star evaluator context. Absence of the counters (older paths) must not break the plan-111 evaluator (fail-closed = criteria not awarded, per plan-111's unknown-data rule).

### 4. Tests

- Real harness attempts, not hand-built state: a deliberate-collision attempt counts collisions exactly; a freeze-fired-into-empty-space attempt counts waste exactly; a clean reference attempt reads zero.

## Commands

```powershell
npm test
npm run build
```

## Validation Checklist

- [ ] Preflight gate: owner approved the counter definitions.
- [ ] Counters derive from real event-log data; reset semantics correct across round/level resets.
- [ ] Exposure is additive; plan-111 evaluator behavior unchanged when counters are absent.
- [ ] Tests prove counts on real attempts (collision, waste, clean).
- [ ] `npm test`, `npm run build` pass; new test file registered.
- [ ] Subsystem notes updated in the same patch.
- [ ] Progress report records the gate approval, definitions, commands, risks.

## Stop Conditions

Stop and ask for owner review if:

- The event log does not actually distinguish the needed outcomes (e.g. collision vs wall bounce is not recoverable from recorded events) — surface with the evidence; do not approximate silently.
- A counter definition requires game-rule changes (that is a rules packet, not this one).
- Reset semantics force a choice between round-reset and level-reset counting that changes what teachers would see — surface with options.
- You find yourself assigning criteria or touching the evaluator — that is the follow-on packet.
