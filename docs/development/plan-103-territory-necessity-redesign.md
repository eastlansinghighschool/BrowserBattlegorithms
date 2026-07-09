---
id: plan-103-territory-necessity-redesign
title: "Level 20 Living-Board Pass (my-side-their-side)"
status: ready
depends_on: [plan-85-campaign-rewrite-charter, plan-93-pre-challenge-22-living-resource-uplift, plan-99-board-dynamics-bestiary-core]
gate: "direction accepted 2026-07-08 (owner): honest living-board pass on the existing one-way objective. The flag-carry direction is abandoned as unbuildable; the design-note gate is cleared. Implementation may proceed, subject to the in-flight reference-survives-threat simulation gate below."
superseded_by: null
resolution: null
summary: >-
  Give Level 20 `my-side-their-side` an honest living-board pass on its EXISTING one-way objective. Design-note phase (Plan 103 round 1) proved two things by simulation against the real engine: (1) the flag-carry round-trip direction is unbuildable — the engine has no cross-turn program counter, so `on_my_side` (which flips twice on a round trip) cannot drive both legs with one fixed action; and (2) on the shipped one-way reach-a-cell level `on_my_side` is ALREADY structurally necessary, because a bare stack of move blocks repeats its first action forever and the territory conditional is the only way to switch movement axes. So L20 never had a necessity hole — it had frozen decoys and a mis-tuned tier. Replace the frozen decoys with a live enemy for an honest `boardDynamicsTier`, prove by simulation the reference solution still wins, and do NOT claim `mechanicNecessity: "dynamic"` (necessity here is structural, not board-driven).
---
# Plan 103: Level 20 Living-Board Pass (my-side-their-side)

- Packet id: Plan 103
- Packet title: Level 20 Living-Board Pass (my-side-their-side)
- Status: (see frontmatter)
- Owner/model: level-editing specialist with engine-and-simulation care
- Date: 2026-07-08 (rev. after design-note round)
- Packet type: implementation / curriculum / level-editing / docs
- Mutation level: source-code (one level), generated evidence, focused tests, a subsystem doc note
- Approval gate: direction accepted; proceed. The only remaining gate is in-flight: the added threat must be proven (by simulation) not to break the reference solution before the change is finalized.
- Expected artifacts:
  - revised Level 20 source: frozen decoys replaced with a live archetype (Plan 99/101), honest `boardDynamicsTier`
  - a subsystem doc note recording the engine's stateless-per-turn execution model and its consequence for necessity reasoning (see §Engine Fact)
  - simulation-backed proof, in the progress report, that the reference solution still wins against the added threat, and that no sensor-free program wins (already established structurally — cite it)
  - regenerated dossiers and behavior evidence; focused readiness/lint/tests
  - progress report
- Progress report folder: `reports/development/plan-103-territory-necessity-redesign/`
- Progress report file: `reports/development/plan-103-territory-necessity-redesign/progress.md`
- Prior artifact (keep): `reports/development/plan-103-territory-necessity-redesign/design-note.md` — the round-1 finding that redirected this packet. Do not delete or contradict it.

## Packet Summary

Goal: Give Level 20 `my-side-their-side` an honest living-board pass on its existing one-way objective — make the board feel alive (no frozen decoys), tier it truthfully, and leave the already-load-bearing territory concept intact — without claiming a dynamic necessity it does not have.

### Why the direction changed (design-note round)

The original Plan 103 direction (and the Plan 93 rationale for deferring L20) was wrong, and the design-note round proved it by simulating the real engine. Two findings:

1. **The engine has no cross-turn program counter.** `resolveFirstRunnableAction` (`src/ai/blockly/workspace.js:711`) is called fresh every turn and returns the *first* block that resolves to an action. A plain stack of differing move blocks therefore executes only its first block — forever. The only way a program produces different actions on different turns is a **conditional** whose result varies with state.
2. **Consequences:**
   - The **flag-carry round-trip** direction is *unbuildable* with the territory toolbox: `on_my_side` is true at spawn and true again after the carrier returns home, so it flips twice, but the single `DO` action must fire on both crossings needing opposite directions. Exhaustive sweep: 0 of 25 expressible programs win. No board/threat/turn-limit fixes it.
   - On the **shipped one-way reach-a-cell** level, `on_my_side` is *already structurally necessary*: reaching `(6,2)` from `(1,6)` requires combining two movement axes, no constant action does that, and the territory conditional is the only branching primitive in the toolbox. Plan 93's claimed "hardcode a path" bypass is not expressible in this engine.

So Level 20 never had a *necessity* problem. It had (a) frozen-decoy NPCs (the Plan 85 living-board target) and (b) in Gemini's Plan 93 attempt, a Guard whose post/radius was mis-tuned relative to the one reachable winning path. This packet fixes (a) honestly and drops the false necessity framing.

Non-goals:
- **Do not change the objective.** Keep the existing `runner_reaches_cell` win at `(6,2)`. The flag-carry / round-trip idea is abandoned (proven unbuildable); do not revive it.
- **Do not claim `mechanicNecessity: "dynamic"`.** Necessity here is structural (toolbox + geometry), not board-driven. Annotate honestly; see §Linter Wrinkle.
- Do not change the taught concept or the toolbox. `if_on_my_side` / `if_on_my_side_else` + the four moves + stay-still stay exactly as they are. Do not add `if_have_enemy_flag` (that would make territory incidental — design-note §4).
- Do not build new NPC archetypes; consume only Dummy/Sentry/Wanderer/Guard (Plan 99) and Charger (Plan 101).
- Do not rewrite student-facing voice/mission copy (Plans 94/95); delete now-false lines only.
- Do not introduce Advanced boolean operators early.
- Do not change one-action-per-turn, collision, scoring, or Blockly semantics.

Depends on:
- Plan 85 (charter — S1 tiers, S2 bestiary, S12 protected levels).
- Plan 93 complete (Level 20 is at its pre-uplift baseline in the tree; this is its documented carve-out).
- Plan 99 (archetypes + `boardDynamicsTier` + tier lint); Plan 101 if a Charger is chosen.

## Authority And Contracts

Required project contracts:
- `docs/development/plan-103-territory-necessity-redesign/design-note.md` — the round-1 proof; this packet builds on it.
- Plan 85 — S1 (tiers), S2 (bestiary), S12 (protected-level rules).
- `docs/subsystems/blockly-workspace.md` and `docs/subsystems/turn-engine.md` — the execution model; this packet ADDS the stateless-per-turn note here (§Engine Fact), does not redefine anything.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — the `my-side-their-side` row.
- `src/ai/npc/freePlayCpu.js`, `src/core/setup.js` — archetype wiring.

Do not redefine:
- One-action-per-turn Blockly semantics; collision, capture, scoring.
- The territory concept or toolbox.
- Static Vite deployment.

## Engine Fact To Document (deliverable)

Add a short, durable note to `docs/subsystems/blockly-workspace.md` (or `turn-engine.md`, wherever the per-turn action-resolution is described), capturing the finding so no future packet re-derives it:

> Guided/CPU programs are evaluated **statelessly every turn**: `resolveFirstRunnableAction` walks the "on each turn" chain from the top and returns the first block that resolves to an action, with no program counter carried across turns. Consequence: a bare stack of differing movement blocks repeats its first action forever; the only way a program varies its action across turns is a conditional whose result depends on game state. Therefore a level's mechanic-necessity must be judged over the set of *expressible programs* (constant actions + the level's conditionals), NOT over the set of reachable board paths — a path can be reachable yet correspond to no buildable program.

This is the general lesson; it corrects the "any reachable path is hardcodable" instinct that misled Plan 93's L20 finding.

## Direction: Honest Living-Board Pass On The One-Way Objective

1. **Keep** the `runner_reaches_cell` win at `(6,2)`, spawn `(1,6)`, and the toolbox unchanged. `on_my_side` is already structurally necessary here (design-note §5) — do not try to "add" necessity.
2. **Replace the frozen decoys** (`runner_2_Npc1` / `runner_2_Npc2`, currently `isFrozen: true, frozenTurnsRemaining: 999`) with living-board behavior using a Plan 99/101 archetype, so the enemy side reads as alive rather than as parked cones.
3. **Prove, by simulation, the reference solution still wins.** The reference program is `if_on_my_side_else { DO: move_forward, ELSE: move_up_screen }`, whose one path is row 6 across to `(6,6)` then up column 6 to `(6,2)`. Because the toolbox cannot express "dodge *and* use territory," a threat that actually blocks that single path can make the level unsolvable. So place/tune the archetype (post, radius, patrol column, or `chargeRange`) so it adds visible life and pressure **without** capturing the reference carrier on its real path — verified by driving the reference solution through `processTurnActions`, not by eyeballing geometry. This is the packet's live gate.
4. **Tier honestly** (`boardDynamicsTier`): `background-motion` if the live enemy provably cannot reach the carrier's path cells; `collision-threat` only if it genuinely can on some plausible line — proven spatially per the Plan 92 carry-forward (reachable-cell reasoning, not reference-run-only). Prefer a Sentry/patrol that shares the enemy-side flavor without needing to intercept, since the reference path must survive anyway.
5. **Necessity annotation:** leave `mechanicNecessity` as the honest structural case — do **not** set `"dynamic"`. See §Linter Wrinkle for how the Plan 100 lint should treat it.
6. **Copy:** delete any now-false line only; no rewrites.

## Linter Wrinkle (decide and document)

The Plan 100 `win-condition-requires-named-mechanic` lint recognizes `static` (via a structured concept match) or `dynamic` (via an annotation + a discoverable naive fixture). L20's necessity is *structural-via-geometry* — the geometry forces the territory conditional — which the linter may not detect as a structured static match, so it may warn even though the level is honest.

Do exactly one of these, and record which and why in the progress report:
- If `mechanicNecessity: "static"` plus the existing concept-matrix row clears the lint, use that (preferred — it is the truthful annotation).
- If it still warns, treat it as a known limitation of the static-necessity detector for geometry-forced conditionals: annotate honestly and leave the warning, noting it here and (if warranted) filing a follow-up to teach the linter about geometry-forced necessity. **Do not** invent a `dynamic` claim or a throwaway naive fixture just to silence the lint — that would re-introduce exactly the dishonesty this packet exists to remove.

## Scope

### In Scope
- Level 20 source: swap frozen decoys → one live archetype; set honest `boardDynamicsTier`; honest necessity annotation.
- The §Engine Fact subsystem doc note.
- Simulation proof (reference survives; sensor-free programs cannot win — cite design-note §5) in the progress report.
- Regenerated dossiers/evidence; readiness/lint/tests; copy-line deletions if any.

### Out Of Scope
- Any level other than Level 20.
- Changing the objective, toolbox, or taught concept.
- New archetypes, voice rewrites, runtime-rule changes.
- A `mechanicNecessity: "dynamic"` claim or a naive-solution fixture for L20 (there is no dynamic degenerate to prove).

## Work Plan
1. Add the §Engine Fact note to the subsystem doc.
2. Choose the archetype and placement; drive the reference solution through the real turn engine to confirm it still wins. If no placement adds life without breaking the reference, stop and surface (see Stop Conditions).
3. Apply the Level 20 edits (archetype, tier, honest necessity annotation, copy deletions only).
4. Resolve the §Linter Wrinkle; record the decision.
5. Regenerate dossiers/evidence; run `npm run level:readiness -- --level my-side-their-side`, `npm run lint:levels`, `npm test`, `npm run build`.
6. Write the progress report: the archetype/tier choice, the reference-survives simulation, the reachable-cell tier proof, and the linter decision.

## Validation Checklist
- [ ] Objective, toolbox, and taught concept unchanged; no `dynamic` necessity claim; no L20 naive fixture invented.
- [ ] Frozen decoys replaced with a live archetype; board reads as alive.
- [ ] Reference solution proven to still win against the added threat **by simulation** (not eyeballed); result recorded.
- [ ] `boardDynamicsTier` is honest and proven spatially (reachable cells, not reference-run-only).
- [ ] §Engine Fact note added to the subsystem doc; reads true.
- [ ] Linter wrinkle resolved and documented; no dishonest annotation used to silence a warning.
- [ ] No voice rewrite (deletions only); no new archetype; no runtime-rule drift.
- [ ] Dossiers/evidence regenerated; `npm test`, `npm run lint:levels`, `npm run build` pass.

## Stop Conditions
- No archetype placement adds living-board pressure without capturing the reference carrier on its real path (toolbox can't express dodge-plus-territory) — stop and surface; the honest fallback is a low-pressure `background-motion` Sentry, or leaving L20 minimally changed, per owner call.
- Making the change would require altering the objective, toolbox, taught concept, one-action-per-turn, collision, or scoring — stop and surface.
- The honest necessity annotation cannot pass lint without a dishonest `dynamic`/fixture hack — stop at the annotation step and surface the linter limitation rather than faking necessity.
