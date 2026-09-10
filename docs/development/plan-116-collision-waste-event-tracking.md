---
id: plan-116
title: "Collision And Waste Event Tracking"
status: in-progress
depends_on: [plan-113]
gate: "CLEARED 2026-09-01. Four counters, not two: runner-collision bounces and map-blockage bounces split on the existing runner.blockedOrBounced reason field; resource-unavailable attempts from resource.unavailable; and ineffective-freeze uses where affectedRunners is empty. Unused-barrier waste explicitly excluded. See the Gate section."
summary: >-
  Build per-level-attempt collision and wasted-resource counters derived from the Plan 35 event log, exposed on the end-of-level details path, so later packets can author honest no-collision and no-wasted-resource star-3 criteria. Tracking only — no criteria, no UI, no export changes.
---
# Plan 116: Collision And Waste Event Tracking

## Packet Metadata

- Packet id: `plan-116`
- Packet title: Collision And Waste Event Tracking
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-08-10
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: **cleared 2026-09-01** — counter definitions resolved with event-log evidence (see Gate section). The implementer restates them in the preflight plan and proceeds.
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
Plan-113's gate audit proved that no collision or resource-waste data exists at level end, so every scrimmage/resource level went 2-star max and star 3 currently exists only on Phase 6 multi-ally levels. The owner ratified that shape and deferred this tracking to the backlog (decision log 2026-08-05). This packet builds the missing instrumentation from the Plan 35 event log (`state.eventLog` already records `runner.actionResolved`, `runner.blockedOrBounced`, and collision/freeze outcomes), keeping the star layer's honesty standard: criteria must measure something real.

## Gate (before mutation) — CLEARED 2026-09-01

Resolved with the owner against the actual event taxonomy in `src/core/events.js`. **Four counters,
not two.** The governing principle: this packet is tracking-only, so it records distinguishable
things distinguishably and does not pre-aggregate. A later criteria packet chooses what to reward;
collapsing a dimension here would foreclose that choice and require another tracking packet.

### Collision counters — two, split on the existing `reason`

`runner.blockedOrBounced` already carries a `reason` that distinguishes its two emission sites:
map blockage (`turnEngine.js:530`) and runner collision (`turnEngine.js:546`). Split on it:

| Counter | Source | Why separate |
| --- | --- | --- |
| runner-collision bounces | `runner.blockedOrBounced`, runner-collision reason | The enemy-sensing curriculum's concept: avoiding a Guard or Charger requires using the sensors the level teaches |
| map-blockage bounces | `runner.blockedOrBounced`, map-blockage reason | A different lesson — movement helpers and pathing. Any working solution mostly avoids walls, so mixing it in adds noise, not signal |

A single combined counter was rejected: "no collisions" would then mean "never bumped anything,"
which on a living board with a Charger may be near-impossible, making any criterion built on it
non-discriminating and in violation of the plan-113 discriminating-power standard.

### Waste counters — two

| Counter | Source | Notes |
| --- | --- | --- |
| resource-unavailable attempts | `resource.unavailable` | Already emitted at three sites (`turnEngine.js:290` jump exhausted, `:294` barrier unavailable, `:494` freeze cooldown). Maps exactly to the existing `resource_no_readiness_guard` learning moment in `src/usage/learningLedger.js` — the "didn't check readiness" mistake |
| ineffective-freeze uses | Area Freeze resolving with an empty affected set | The engine **already computes** `affectedRunners` (`turnEngine.js:156`) but does not emit its size. Emitting that is the one new piece of instrumentation this packet needs. This is the "spent a ready ability on nothing" mistake |

**Unused-barrier waste is explicitly excluded.** A barrier that nothing ever passed did nothing
measurable, yet may have been good strategy — it may have deterred an enemy that consequently never
came. That definition is contestable, and a contested definition must not be baked into a counter
that a later criterion will treat as fact. If it is wanted, it needs its own design conversation.

### What this gate does not decide

Per the packet's non-goals, nothing here assigns mastery criteria, adds ledger or export fields,
changes star metadata, or touches the evaluator. Persistence decisions ride the follow-on
authoring packet. These counters are computed per level attempt and exposed on the end-of-level
`details` path only.

## Preflight review corrections (added 2026-09-09)

Three corrections to the implementer's preflight plan. The plan is otherwise approved, including
the `attemptCounters.js` module shape, derivation inside `emit()`, and the additive exposure on the
end-of-level `details` path.

### C1 — Do not read `affectedCount` from `state.areaFreezeEffect`

The plan proposes `state.areaFreezeEffect?.affectedRunners?.length ?? 0`. **Do not.**

`applyAreaFreeze` (`src/core/turnEngine.js:148-158`) computes `affectedRunners` locally as part of
*actually applying* the freeze — it calls `candidate.setFrozen(...)` on each. That local array is the
authoritative game-state fact. It is then packaged into an **effect object** by
`buildAreaFreezeEffect`, which carries `startedAtMs`, `durationMs`, and a projected copy of the
runners, and which `src/core/setup.js` nulls in three separate places.

Coupling a measurement to that object means a cleared or not-yet-assigned effect reads as
`0` — **indistinguishable from a genuinely ineffective freeze, which is precisely the thing being
measured.** A presentation/animation object's lifetime must never be able to manufacture the
measurement's positive case.

Instead, pass `affectedRunners.length` **directly** from `applyAreaFreeze` to the emit site. The
value is in scope at the moment of application; nothing needs to round-trip through state.

This is the same failure class as `plan-119`'s transient-assertion problem: do not measure a value
off an object whose lifetime is driven by presentation.

### C2 — `runnerTeam === 1` is the wrong guard, and the human/program distinction may matter

Two separate problems.

**The guard.** Team number is not a reliable proxy for "the student." The codebase already carries
`runnerRole` (human / ally / enemy), which is the semantically correct discriminator. Use it.

**The distinction.** A bounce by a human-driven runner is the student steering with the keyboard.
A bounce by an ally is the student's *program* being careless. Those are different skills, and the
criteria this packet exists to enable (`no-collision`, `no-wasted-resource`) are about **program
quality**. Merging them would let a criteria author reward or penalise the wrong thing with no way
to tell afterwards — exactly what the ratified principle behind this packet's four-counter shape
forbids: *record distinguishable things distinguishably; do not pre-aggregate on behalf of a
decision you are not making.*

**Required first step — a cheap empirical check.** Determine whether human-controlled runners
actually occur in the scrimmage and resource levels these criteria target. Then:

- If human-controlled runners **do** occur there: record the counters split by control
  (program-controlled vs. human-driven), keeping one flat additive object.
- If they **never** occur there: scope all four counters to program-controlled runners, state that
  finding and the evidence for it in the progress report, and do not add dead fields.
- If the answer is **ambiguous** — for example it varies by level or by free-play mode — **stop and
  report** rather than choosing.

Record the check and its result in the progress report either way. This extends the owner's
four-counter gate, so the reasoning must be visible and easy to reverse.

### C3 — Deriving inside `emit()` is approved; verify one reachability case

Calling `recordEventInAttemptCounters` from `emit()` is the right call, and it has a merit the plan
does not claim: **counters derived at emit time cannot be silently undercounted by the event log's
bounded-window eviction**, which a scan-the-log-at-level-end approach would be vulnerable to. State
that advantage in the progress report; it is the reason to prefer this shape.

One check before relying on it: `emit` now mutates game state, so confirm it is not reached in any
context where counters must not accrue. The unit harness (`tests/unit/helpers/testHarness.js`)
drives the real `processTurnActions`, which is correct and desirable — that is a real run.
**Verify trace playback** (`src/ai/blockly/traceRenderer.js`, `tests/browser/blockly-trace-playback.spec.js`)
does not re-drive the engine in a way that would accrue counters while a student merely *reviews* a
past run. If it does, counter accrual must be suppressed during playback.

### C4 — Define "attempt" precisely, and test the reset boundary

The plan resets in `initializeMatch` and `initializeDisplayState` and preserves across
`resetRound`. That is probably right, but "per level attempt" needs a crisp definition tied to what
the star evaluator actually consumes — particularly for a Free Play match that scores multiple
points, where `resetRound` fires per point. State the definition in the subsystem note and cover
the boundary with a test: counters must survive an intra-attempt round reset and must be zero at
the start of a fresh attempt.

## Authority And Contracts

Required reading:

- `docs/development/plan-113-campaign-par-mastery-authoring.md` progress report + gate decisions (why the criteria were dropped).
- `docs/decision-log.md` — 2026-08-05 entries (star-3 shape, this deferral).
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
