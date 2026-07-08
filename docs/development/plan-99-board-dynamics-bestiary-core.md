---
id: plan-99-board-dynamics-bestiary-core
title: "Board Dynamics And Bestiary Core"
status: complete
depends_on: [plan-85-campaign-rewrite-charter]
gate: "before adding a new NPC behavior beyond the Guard archetype, before renaming existing NPC_BEHAVIORS constants, before editing guided level content"
superseded_by: null
resolution: "Orchestrator-verified 2026-07-07: Guard is deterministic (lowest-id tie-break), reuses calculateMoveTowardsTarget, degrades to STAY_STILL when boxed in (no new halt path); tier lint correctly flags static-vs-live contradictions and warns on untiered, proven-contradictions-only as scoped; constants additive (no rename), zero guided-level content changed, guardPost/guardRadius wiring caveat documented in npc-and-cpu.md + Common Traps. 10 new tests, full suite 432/432, lint:levels and build pass. Note: tier-lint real-data path first exercised by Plan 92 (no shipped level is tiered yet)."
summary: >-
  Build the infrastructure the living-board pilot depends on but no packet yet provides: the `boardDynamicsTier` level-metadata field with a lint cross-check (charter S1), and the one genuinely-new bestiary archetype the pilot needs — the Guard (charter S2 / Appendix A). No guided level content changes; that is Plan 92.
---
# Plan 99: Board Dynamics And Bestiary Core

- Packet id: Plan 99
- Packet title: Board Dynamics And Bestiary Core
- Status: (see frontmatter)
- Owner/model: implementation agent with engine-and-tooling care
- Date: 2026-07-07
- Packet type: implementation / engine / tooling / tests
- Mutation level: source-code (NPC behavior + level metadata + lint), tests, docs
- Approval gate: before adding any NPC behavior beyond Guard, before renaming existing `NPC_BEHAVIORS` constants, before touching guided level content
- Expected artifacts:
  - `boardDynamicsTier` level-metadata field + validation + a `lint:levels` cross-check rule (charter S1)
  - `GUIDED_GUARD` NPC behavior: constant, dispatch case, and deterministic implementation (charter S2 / Appendix A)
  - a bestiary-name → behavior-constant mapping table in `docs/subsystems/npc-and-cpu.md`, marking implemented vs deferred archetypes
  - focused unit tests for the Guard behavior and the tier lint rule
  - progress report
- Progress report folder: `reports/development/plan-99-board-dynamics-bestiary-core/`
- Progress report file: `reports/development/plan-99-board-dynamics-bestiary-core/progress.md`

## Packet Summary

Goal: Build the two pieces of shared infrastructure the pre-Challenge-15 living-board pilot (Plan 92) requires but that no completed or drafted packet provides — the board-dynamics tier metadata + lint from charter S1, and the Guard archetype from charter S2 / Appendix A — without editing any guided level content.

This packet exists because the dependency graph lied. Plan 92's machine dependencies (`plan-85`, `plan-86`) are both complete, so `check` would pass — but Plan 92's own scope hedges with "assign board-dynamics metadata *if the metadata system exists*" and "prefer existing guided NPC behaviors," and neither the metadata system nor the Guard archetype it needs for the `enemy-nearby` uplift actually exists yet. Building them inside Plan 92 would fuse engine infrastructure with level content in one un-reviewable packet. This packet is the clean prerequisite.

Non-goals:
- Do not edit any guided level source, fixtures, reference solutions, or copy. That is Plan 92.
- Do not rename existing `NPC_BEHAVIORS` constants. Bestiary names are owner-taste per Appendix A and are mapped in docs, not baked into constant names.
- Do not implement archetypes beyond Guard (Charger, Raider, Shadow, and the zone-bound Wanderer are deferred to their own waves per Appendix A rollout guidance).
- Do not force a `boardDynamicsTier` onto all 46 levels; the field is optional and the lint warns (not errors) when it is absent. Plan 92 tiers the pilot levels; a later sweep tiers the rest.
- Do not add a dependency, server behavior, or any change to one-action-per-turn, collision, scoring, or Blockly semantics.

Depends on:
- Plan 85 (charter) accepted — S1, S2, and Appendix A are the source of truth for the tier taxonomy and the Guard rule.

Blocks:
- Plan 92 (Pre-Challenge-15 Living Board Pilot) — this packet is its true infrastructure prerequisite.
- Any later living-board packet (Plan 93 and campaign-wide extension) that assigns tiers or uses archetypes.

## Authority And Contracts

Required project contracts:
- `docs/development/plan-85-campaign-rewrite-charter.md` — S1 (tier taxonomy), S2 (bestiary), Appendix A (Guard rule and roster).
- `docs/subsystems/npc-and-cpu.md` — the NPC behavior contract note; the Guard is added here.
- `docs/subsystems/turn-engine.md` — collision/capture is owned here; the Guard only *moves*, and existing collision resolution decides captures.
- `src/config/constants.js` — `NPC_BEHAVIORS`.
- `src/ai/npc/freePlayCpu.js` — guided behavior dispatch chain.
- `src/ai/npc/pathing.js` — `calculateMoveTowardsTarget`, reused by the Guard.
- `scripts/lint-levels.js` — where the tier cross-check rule is added.
- `docs/packet-creation-guidance.md`.

Do not redefine:
- Guided NPC behavior must stay deterministic and legible-by-observation (S2). The Guard's rule must be reverse-engineerable by watching two turns.
- Collision, capture, freeze, and scoring rules stay in their subsystem owners. The Guard produces a move decision only.
- Static Vite deployment; no new dependencies.

## Required Reading

Read before editing:
- This packet end-to-end.
- `docs/development/plan-85-campaign-rewrite-charter.md` — S1, S2, Appendix A.
- `src/config/constants.js` (`NPC_BEHAVIORS`).
- `src/ai/npc/freePlayCpu.js` (the `GUIDED_*` dispatch chain and the existing `getGuidedVerticalPatrolAction`).
- `src/ai/npc/pathing.js` (`calculateMoveTowardsTarget` signature).
- `scripts/lint-levels.js` (rule structure, `formatDiagnostic`, `main`).
- `docs/subsystems/npc-and-cpu.md`.
- One level that assigns a guided behavior, e.g. `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`, to see the `setupOverrides` → `cpuBehavior` shape.

Use `rg` for:
- `NPC_BEHAVIORS`
- `cpuBehavior`
- `GUIDED_VERTICAL_PATROL`
- `getGuidedVerticalPatrolAction`
- `calculateMoveTowardsTarget`
- `boardDynamicsTier`
- `frozenTurnsRemaining`

## Scope

### In Scope

- Add the `boardDynamicsTier` metadata field to the guided-level config surface, with an enum validator.
- Add a `lint:levels` cross-check rule comparing the authored tier against provable setup facts (frozen flags, `cpuBehavior` constants).
- Add the `GUIDED_GUARD` behavior: constant, dispatch case, deterministic implementation reusing `calculateMoveTowardsTarget`.
- Document the bestiary-name → behavior-constant mapping and implemented/deferred status in `docs/subsystems/npc-and-cpu.md`.
- Focused unit tests for the Guard and the tier lint rule.

### Out Of Scope

- Any guided level content, fixture, reference-solution, or copy edit (Plan 92).
- Renaming existing behavior constants.
- Archetypes beyond Guard.
- Sentry authored-route generalization beyond the existing vertical patrol (defer until a level needs a non-vertical route).
- Zone-bounding the Wanderer (`GUIDED_RANDOM_MOVE_ONLY` stays as-is).
- Film review, hints, stars, arcs — separate packets.

### Files And Areas Likely Touched

- `src/config/constants.js` (new `GUIDED_GUARD` constant; possibly a `BOARD_DYNAMICS_TIERS` enum)
- `src/ai/npc/freePlayCpu.js` (Guard dispatch + implementation, or a sibling module it imports)
- `scripts/lint-levels.js` (tier cross-check rule)
- level config validation (wherever guided-level shape is validated today — locate via `rg`)
- `docs/subsystems/npc-and-cpu.md`
- `tests/unit/` (new focused tests; likely `free-play-contracts.test.js` for the Guard and `level-lint.test.js` for the tier rule)
- `reports/development/plan-99-board-dynamics-bestiary-core/progress.md`

## Implementation Requirements

### 1. Board Dynamics Tier Metadata (charter S1)

Required behavior:
- Add an optional `boardDynamicsTier` field to guided level configs, valued from the S1 enum: `static-prop`, `background-motion`, `timing-threat`, `collision-threat`, `scrimmage-threat`.
- Add an enum constant (e.g. `BOARD_DYNAMICS_TIERS`) so levels and lint share one source.
- Validation: if present, the value must be one of the five. An invalid string is a lint error.

Constraints:
- The field is optional in this packet. Do not tier all levels. An absent tier is a lint *warning* (`untiered`), not an error, so the campaign is not forced into a full tiering pass here.
- Do not change any level's runtime behavior. This is metadata plus lint only.

### 2. Tier Lint Cross-Check (charter S1)

Required behavior — add a `lint:levels` rule that flags authored tiers contradicting provable setup facts:
- `static-prop`: **error** if any opponent runner is live (i.e., not `isFrozen`/`frozenTurnsRemaining` and not `GUIDED_STAY_STILL`).
- `background-motion` / `timing-threat` / `collision-threat` / `scrimmage-threat`: **error** if *every* opponent is static (all frozen or `GUIDED_STAY_STILL`) — a motion/threat tier with nothing that moves is a contradiction.
- `scrimmage-threat`: **error** if fewer than two live opponents (Appendix A: "multiple live enemies").
- Absent tier: **warning** (`untiered`), informational.

Constraints:
- The lint proves contradictions from frozen flags and behavior constants **only**. It does NOT attempt to verify whether a live enemy can actually *reach or interfere with* the player (that is a semantic claim beyond a static linter). Do not over-reach; a Sentry that patrols a harmless lane is legitimately `background-motion` and the lint must accept it.
- Follow the existing `lint-levels.js` diagnostic shape and `formatDiagnostic` output.
- Emit rule ids/messages specific enough that Plan 92 can act on them without guessing.

Edge cases:
- Levels with no opponent runners: a motion/threat tier is an error (nothing to move); `static-prop` or absent is fine.
- Human-input-only levels: treat like any other — tier reflects opponents, not the human.

### 3. Guard Archetype (charter S2 / Appendix A)

Required behavior — add `GUIDED_GUARD`, a deterministic, legible archetype:
- **Post:** the Guard's post is its spawn cell, captured at setup. Optionally allow a per-runner `guardPost: {x, y}` override, defaulting to the spawn cell.
- **Aggro radius K:** default Manhattan 3; optionally overridable per runner (e.g. `guardRadius`).
- **Each turn:** find the nearest player-team runner within K Manhattan cells. If one exists, step toward it via `calculateMoveTowardsTarget`. If none, and the Guard is not on its post, step back toward the post. If on the post with no target in range, `STAY_STILL`.
- **Determinism:** identical state → identical decision. Break "nearest" ties by a fixed rule (e.g. lowest runner id) so replays and tests are stable.

Constraints:
- Reuse `calculateMoveTowardsTarget` from `pathing.js`; do not write a second pathing routine.
- The Guard emits a move decision only. Capture/collision is decided by existing turn-engine collision resolution — do not add capture logic here.
- Add the dispatch case in the same `if (runner.cpuBehavior === NPC_BEHAVIORS.X)` chain in `freePlayCpu.js`, before the terminal default. Keep the implementation in a small named helper like the existing `getGuidedVerticalPatrolAction`.
- No randomness. (This is why the Guard, not the Wanderer, is the pilot's `enemy-nearby` archetype.)

Edge cases:
- Multiple players tie for nearest: fixed tie-break, documented.
- Guard boxed in (no legal step toward target/post): `STAY_STILL` rather than throwing — consistent with Plan 78's no-new-halt-paths principle.
- Frozen Guard: obeys the same frozen-turn handling as any runner; the behavior function is not consulted while frozen.

### 4. Bestiary Mapping Doc (charter S2)

Required behavior:
- In `docs/subsystems/npc-and-cpu.md`, add a table mapping Appendix A bestiary names to behavior constants and implementation status:
  - Dummy → `GUIDED_STAY_STILL` (existing)
  - Sentry → `GUIDED_VERTICAL_PATROL` (existing; authored-route generalization deferred)
  - Wanderer → `GUIDED_RANDOM_MOVE_ONLY` (existing; zone-bounding deferred)
  - Guard → `GUIDED_GUARD` (new, this packet)
  - Charger / Raider / Shadow → deferred, no constant yet
- State that bestiary *names* are owner-taste (finalized in the copy packets) and *rules* are the contract, per Appendix A.

Constraints:
- Keep the note truthful: only Guard is new here; do not describe deferred archetypes as implemented.

### 5. Tests

Required (synthetic/fixture state only):
- Guard: player within K → decision reduces Manhattan distance to that player.
- Guard: player beyond K and Guard off-post → decision reduces distance to post.
- Guard: on post, no player in range → `STAY_STILL`.
- Guard: deterministic tie-break with two equidistant players.
- Tier lint: `static-prop` with a live opponent → error; motion/threat tier with all-frozen opponents → error; `scrimmage-threat` with one live opponent → error; valid pairings → clean; absent tier → warning.

## Work Plan

1. Read the charter S1/S2/Appendix A, the dispatch chain, and the lint structure; confirm where guided-level config is validated. Summarize findings before editing.
2. Add the tier enum + optional field + validation.
3. Add the tier lint cross-check rule with tests.
4. Add `GUIDED_GUARD` (constant, helper, dispatch) with tests, reusing `calculateMoveTowardsTarget`.
5. Update `docs/subsystems/npc-and-cpu.md` with the Guard behavior and the bestiary mapping table.
6. Run focused tests, then `npm test`, `npm run lint:levels`, `npm run build`.
7. Write the progress report, noting the tie-break rule chosen, the default K, and any config-shape decision.

## Commands

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/level-lint.test.js
npm run lint:levels
npm test
npm run build
```

## Validation Checklist

- [ ] `boardDynamicsTier` accepts the five enum values, rejects others, and is optional (absent → lint warning).
- [ ] Tier lint flags static-vs-live contradictions from frozen flags / behavior constants only, and accepts a harmless-lane Sentry as `background-motion`.
- [ ] `GUIDED_GUARD` steps toward an in-range player, returns to post when none, stays on post when idle, and is deterministic with a documented tie-break.
- [ ] Guard reuses `calculateMoveTowardsTarget`; no second pathing routine; no capture logic added.
- [ ] No guided level content, fixture, or copy changed.
- [ ] No existing `NPC_BEHAVIORS` constant renamed.
- [ ] `docs/subsystems/npc-and-cpu.md` maps the bestiary names to constants and marks implemented vs deferred truthfully.
- [ ] `npm test`, `npm run lint:levels`, and `npm run build` pass.
- [ ] Progress report records the tie-break rule, default K, and config-shape decisions.

## Stop Conditions

- Adding `boardDynamicsTier` requires changing runtime behavior rather than metadata + lint → stop, surface.
- The Guard cannot be made deterministic and legible with `calculateMoveTowardsTarget` without engine changes → stop, surface.
- The tier lint would need semantic reachability analysis to be useful → stop; ship only the provable-contradiction checks and note the limit.
- Any requirement here turns out to need a guided level content edit → stop; that belongs to Plan 92.
- A `docs/subsystems/*.md` note would become untrue → stop and surface per standing guidance.
