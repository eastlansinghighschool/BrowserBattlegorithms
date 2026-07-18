---
id: plan-101
title: "Charger Archetype (Bestiary Core II)"
status: complete
depends_on: [plan-99, plan-92]
gate: "before adding a bestiary archetype beyond the Charger, before renaming existing NPC_BEHAVIORS constants, before editing guided level content"
superseded_by: null
resolution: "Orchestrator-verified 2026-07-08. getGuidedChargerAction confirmed on disk: idle-until-aligned -> commit-at-trigger -> straight-line charge -> stop-and-clear at wall/barrier/edge, no throw. Verified the emitted { actionType: MOVE, dx, dy } is the canonical delta-move shape (matches calculateMoveTowardsTarget / npcType1 / turnEngine case MOVE), not a novel shape. Tie-break row-before-column, nearest-along-line, lowest-id (localeCompare) is deterministic. isCellBlockedForRunner returns true out-of-bounds (movement.js:44) so edge-stop is honest. chargeRange wired opt-in through setup.js:98-100 in the same Number.isFinite block as guardPost/guardRadius; unbounded default per packet scope note. chargeDirection reset in Runner constructor (53) AND resetToInitial (161) - prevents a stale committed charge surviving a round reset (implementer-found, correct). 10 new Charger tests + full suite 463/463, lint:levels (only pre-existing untiered warnings, none from this packet), build all pass. No guided level content touched - pure Plan 93 infrastructure, mirroring Plan 99->92. Implementer correctly left status for orchestration."
summary: >-
  Build the Charger archetype (charter S2 / Appendix A): a deterministic guided NPC that stands idle until a player runner shares its row or column, then charges straight down that line one cell per turn until a wall, barrier, or edge stops it. This is the archetype the pre-Challenge-22 uplift (Plan 93) needs to make `jump-if-ready` load-bearing (jump to dodge a charge) without contorting a Guard. No guided level content changes; those are Plan 93.
---
# Plan 101: Charger Archetype (Bestiary Core II)

- Packet id: Plan 101
- Packet title: Charger Archetype (Bestiary Core II)
- Status: (see frontmatter)
- Owner/model: implementation agent with engine-and-tooling care
- Date: 2026-07-07
- Packet type: implementation / engine / tests / docs
- Mutation level: source-code (NPC behavior + optional runner-spec wiring), tests, docs
- Approval gate: before adding any bestiary archetype beyond Charger, before renaming existing `NPC_BEHAVIORS` constants, before touching guided level content
- Expected artifacts:
  - `GUIDED_CHARGER` NPC behavior: constant, dispatch case, deterministic implementation
  - optional per-runner `chargeRange` wired through `src/core/setup.js` (reusing the Plan 92 `guardPost`/`guardRadius` wiring precedent)
  - bestiary mapping table in `docs/subsystems/npc-and-cpu.md` updated (Charger → implemented)
  - focused unit tests for the Charger behavior
  - progress report
- Progress report folder: `reports/development/plan-101-charger-archetype/`
- Progress report file: `reports/development/plan-101-charger-archetype/progress.md`

## Packet Summary

Goal: Build the Charger, the second bestiary archetype, so the pre-Challenge-22 living-resource uplift (Plan 93) has the enemy it actually needs. `jump-if-ready` teaches `if can_jump` — a *resource-state* lesson. The clean way to make that mechanic load-bearing on a living board is a threat you must **jump** to evade at the right moment, and a Guard (which you can usually walk around) does not create jump-necessity without contortion. The Charger does: it charges straight down a lane, and the legible counterplay is to jump out of — or over — the lane.

This packet is the infrastructure prerequisite for Plan 93, the same relationship Plan 99 had to Plan 92: build the archetype cleanly and separately, so the level-editing packet is not fused with engine work. It builds **only** the Charger. Raider and Shadow remain deferred per Appendix A rollout guidance.

The Charger's rule (charter Appendix A): *"Stands still until a runner enters its row/column, then charges straight down that line; stops at walls/barriers."* Fully deterministic and legible-by-observation, which is the S2 admission test.

Non-goals:
- Do not edit any guided level source, fixtures, reference solutions, or copy. That is Plan 93.
- Do not rename existing `NPC_BEHAVIORS` constants. Add `GUIDED_CHARGER` additively.
- Do not implement archetypes beyond Charger (Raider, Shadow, zone-bound Wanderer stay deferred).
- Do not add capture/collision logic. The Charger produces a move decision only; existing turn-engine collision resolution decides captures, exactly like the Guard.
- Do not touch the `boardDynamicsTier` field or the tier lint (Plan 99). A Charger is simply a live opponent, so it already satisfies the non-static tiers.
- Do not add a dependency, server behavior, or any change to one-action-per-turn, collision, scoring, or Blockly semantics.

Depends on:
- Plan 99 — the bestiary dispatch pattern, the `getGuidedGuardAction` / `getGuidedVerticalPatrolAction` reference implementations, the bestiary mapping doc, and the collision-owns-capture contract.
- Plan 92 — added the `guardPost`/`guardRadius` runner-spec wiring in `src/core/setup.js`; the Charger's optional `chargeRange` extends that same block.

Blocks:
- Plan 93 (Pre-Challenge-22 Living Resource Uplift) — its `jump-if-ready` design (and, optionally, a more thematic `freeze-the-lane`) needs the Charger. Recommend adding `plan-101` to Plan 93's `depends_on`.

## Authority And Contracts

Required project contracts:
- `docs/development/plan-85-campaign-rewrite-charter.md` — S2 (bestiary), Appendix A (Charger rule and roster).
- `docs/subsystems/npc-and-cpu.md` — the NPC behavior contract note; the Charger is added here and its bestiary-table row flips to implemented.
- `docs/subsystems/turn-engine.md` — collision/capture is owned here; the Charger only *moves*.
- `src/config/constants.js` — `NPC_BEHAVIORS`.
- `src/ai/npc/freePlayCpu.js` — guided dispatch chain and the Guard/Sentry reference behaviors.
- `src/core/setup.js` — `applyRunnerSetup`, where `guardPost`/`guardRadius` are wired (extend for `chargeRange`).
- `docs/packet-creation-guidance.md`.

Do not redefine:
- Guided NPC behavior must stay deterministic and legible-by-observation (S2). The Charger's rule must be reverse-engineerable by watching two turns.
- Collision, capture, freeze, and scoring rules stay in their subsystem owners.
- Static Vite deployment; no new dependencies.

## Required Reading

Read before editing:
- This packet end-to-end.
- `docs/development/plan-85-campaign-rewrite-charter.md` — S2, Appendix A.
- `src/ai/npc/freePlayCpu.js` — `getGuidedGuardAction`, `getGuidedVerticalPatrolAction`, and the `calculateFreePlayCpuAction` dispatch chain (the Charger case slots in before the terminal default).
- `src/config/constants.js` — `NPC_BEHAVIORS`, `GUIDED_GUARD_DEFAULT_RADIUS` (shape precedent for a `GUIDED_CHARGER` default constant if needed).
- `src/core/setup.js` — the `applyRunnerSetup` block that wires `guardPost`/`guardRadius`.
- `src/ai/npc/pathing.js` / `src/core/movement.js` — `isCellBlockedForRunner` (the Charger's stop-at-wall/barrier/edge check).
- `docs/subsystems/npc-and-cpu.md` — the bestiary mapping table.

Use `rg` for:
- `GUIDED_GUARD`
- `getGuidedGuardAction`
- `guidedVerticalPatrolDirection`
- `isCellBlockedForRunner`
- `guardRadius`
- `NPC_BEHAVIORS`

## Scope

### In Scope

- Add `GUIDED_CHARGER` to `NPC_BEHAVIORS` (additive).
- Add the dispatch case and a deterministic `getGuidedChargerAction` helper.
- Add per-runner charge state (direction / committed flag), stored on the runner instance the way `guidedVerticalPatrolDirection` is.
- Optional per-runner `chargeRange`, wired through `src/core/setup.js` alongside `guardPost`/`guardRadius`.
- Update the bestiary mapping table in `docs/subsystems/npc-and-cpu.md`: Charger → `GUIDED_CHARGER`, Implemented (Plan 101).
- Focused unit tests for the Charger.

### Out Of Scope

- Any guided level content, fixture, reference-solution, or copy edit (Plan 93).
- Renaming existing behavior constants.
- Archetypes beyond Charger.
- Board-dynamics tier or lint changes (Plan 99 already covers live-enemy tiers).
- Capture/collision logic.

### Files And Areas Likely Touched

- `src/config/constants.js` (`GUIDED_CHARGER`; optional default constant)
- `src/ai/npc/freePlayCpu.js` (dispatch + `getGuidedChargerAction`)
- `src/core/setup.js` (optional `chargeRange` wiring)
- `docs/subsystems/npc-and-cpu.md`
- `tests/unit/free-play-contracts.test.js`
- `reports/development/plan-101-charger-archetype/progress.md`

## Implementation Requirements

### 1. Charger Behavior

Required behavior — deterministic, legible, `commit-to-the-line`:
- **Idle:** while no player-team runner (any runner on a different team from the Charger) shares the Charger's row (`gridY`) or column (`gridX`), the Charger returns `STAY_STILL` and holds a null charge state.
- **Trigger:** when a player-team runner is on the same row or column (optionally within `chargeRange` — see below), the Charger commits to a charge. Charge axis and direction are fixed **at trigger time**, pointing along the shared line toward the triggering runner's cell. Tie-break when multiple runners qualify: check row before column, then nearest along the line, then lowest runner id — documented.
- **Charge:** each subsequent turn, step one cell in the committed direction, regardless of whether the triggering runner is still on the line. "Charges straight down that line" means it commits — this is what makes jump-to-dodge meaningful (the lane is fixed once triggered).
- **Stop:** when the next cell in the committed direction is blocked by a wall, barrier, or board edge (`isCellBlockedForRunner`), the Charger stops, clears its charge state, and returns `STAY_STILL`. It resumes idle from wherever it stopped and may re-trigger later. It does **not** return to a post (unlike the Guard).

Constraints:
- The Charger emits a move decision only; capture is decided by existing collision resolution (charging into a player's cell → collision → existing rules). Do not add capture logic.
- Straight-line step only — reuse `isCellBlockedForRunner`; do not add a new pathing routine and do not call `calculateMoveTowardsTarget` (the Charger does not path, it charges).
- No randomness. Determinism verifiable: identical state → identical decision, and identical trigger → identical committed lane.
- Boxed-in / immediately-blocked charge → `STAY_STILL`, never throw (consistent with Plan 78's no-new-halt-paths principle).

Edge cases:
- Runner on the row and a different runner on the column at trigger time: tie-break rule above (row first).
- Frozen Charger: obeys normal frozen-turn handling; its behavior function is not consulted while frozen. Charge state should not advance while frozen (confirm it resumes coherently on thaw, or clears — document the choice).
- Triggering runner steps off the line after commit: the Charger still charges to the block. Intended.

### 2. Optional `chargeRange`

Required behavior:
- Support an optional per-runner `chargeRange`: trigger only when the aligned player runner is within `chargeRange` Manhattan (or along-line) cells. Absent → unbounded (any same-row/column alignment triggers).
- Wire it through `src/core/setup.js` `applyRunnerSetup` in the same block that already copies `guardPost`/`guardRadius` from the runner spec.

Constraints:
- Default (absent) behavior must be sensible on the pilot maps; if unbounded triggering proves chaotic in the Charger's own unit tests, note it and let Plan 93 set `chargeRange` per level rather than changing the default here.
- Do not force `chargeRange` onto any runner; it is opt-in.

### 3. Bestiary Doc Update

Required behavior:
- In `docs/subsystems/npc-and-cpu.md`, add a `GUIDED_CHARGER` behavior description (idle → commit → charge → stop), and flip the bestiary mapping table row: Charger → `GUIDED_CHARGER`, Implemented (Plan 101). Update the "deferred, no constant yet" note so only Raider and Shadow remain deferred.

Constraints:
- Keep the note truthful: only Charger is new here; Raider and Shadow stay deferred with no constant.

### 4. Tests

Required (synthetic/fixture state only, in `tests/unit/free-play-contracts.test.js`):
- Idle: no player on row/column → `STAY_STILL`, no charge state.
- Trigger + charge: player enters the row → Charger steps toward it along that row; committed direction is fixed.
- Commit: after trigger, the player steps off the line → Charger still charges in the committed direction.
- Stop: charge reaches a wall/barrier/edge → `STAY_STILL`, charge state cleared, no throw.
- Tie-break: player on row and another on column → row-first, deterministic.
- `chargeRange` (if implemented): aligned player just outside range → no trigger; just inside → trigger.

## Work Plan

1. Read the Guard/Sentry behaviors, the dispatch chain, and the `setup.js` wiring block. Summarize the charge-state and `chargeRange` shape decisions before editing.
2. Add `GUIDED_CHARGER` and `getGuidedChargerAction` with charge state, reusing `isCellBlockedForRunner`.
3. Wire optional `chargeRange` through `applyRunnerSetup`.
4. Add unit tests for all behavior paths.
5. Update `docs/subsystems/npc-and-cpu.md`.
6. Run `npm test`, `npm run lint:levels`, `npm run build`.
7. Write the progress report: charge-state representation, tie-break rule, `chargeRange` default decision, and the frozen-mid-charge choice.

## Commands

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js
npm run lint:levels
npm test
npm run build
```

## Validation Checklist

- [ ] `GUIDED_CHARGER` added additively; no existing `NPC_BEHAVIORS` constant renamed.
- [ ] Charger idles until a player shares its row/column, then charges straight down the committed line, stops at wall/barrier/edge, and `STAY_STILL`s when blocked (no throw).
- [ ] Charge direction is fixed at trigger; commit-to-line verified (charges on even after the runner leaves the line).
- [ ] Deterministic with a documented tie-break; no randomness.
- [ ] Charger emits a move decision only; no capture logic added.
- [ ] Optional `chargeRange` wired through `setup.js`, opt-in, sensible default documented.
- [ ] `docs/subsystems/npc-and-cpu.md` marks Charger implemented; Raider/Shadow still deferred.
- [ ] No guided level content, fixture, or copy changed.
- [ ] `npm test`, `npm run lint:levels`, `npm run build` pass.
- [ ] Progress report records charge-state shape, tie-break, `chargeRange` default, and frozen-mid-charge behavior.

## Stop Conditions

- The Charger cannot be made deterministic and legible with a straight-line step + `isCellBlockedForRunner` without engine changes → stop, surface.
- Charge state cannot be held on the runner instance the way vertical-patrol direction is, and would need a turn-engine change → stop, surface.
- Unbounded triggering is unavoidably chaotic and a bounded default would change intended behavior for future levels → stop, surface the default choice for owner review rather than guessing.
- Any requirement here needs a guided level content edit → stop; that is Plan 93.
- A `docs/subsystems/*.md` note would become untrue → stop and surface per standing guidance.
