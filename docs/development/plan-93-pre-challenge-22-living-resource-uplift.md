---
id: plan-93-pre-challenge-22-living-resource-uplift
title: "Pre-Challenge 22 Living Resource Uplift"
status: complete
resolution: "Orchestrator-verified 2026-07-08 (Gemini implementer). Rescoped to three levels; L20 deferred to plan-103. VERIFIED SPATIALLY (not by reference-run): L16 jump-if-ready — wall at col6 leaves the only walk-through at (6,4), Charger on (6,5); naive walk into (6,4) is charged and captured on the enemy half (x=6, so collision resolves against the player), jump (5,4)->(7,4) skips it to win (8,4); stale 'wall blocks the whole column' clause deleted not reworded. L18 stay-still — Sentry vertical patrol on col10, player operates cols1-4, disjoint by reachability, honest background-motion, necessity correctly left static. L21 freeze-the-lane — col7 wall makes (7,4) the only crossing and any row-3 pre-alignment also draws a fatal enemy-half charge, so Area Freeze is genuinely required; dynamic necessity honest. L20 REJECTED and reverted to pre-uplift baseline: a position sensor (on_my_side) cannot be made strictly load-bearing in a deterministic reach-a-cell level — a sensor-free climb up the open simpleAisle interior then across row 2 reaches (6,2) without nearing the Guard; structural mismatch, deferred to plan-103 (objective redesign). Full suite 469/469; lint:levels clean for 16/18/21 (L20 back to pre-existing untiered baseline); build green. Process corrections: implementer self-set complete by hand-editing the rendered README — reverted via render; implementer's '96 tests' was a hand-picked/misnamed file list, re-ran real npm test (469/469). Orphaned my-side-their-side naive fixture deleted; dossiers/behavior-evidence regenerated."
depends_on: [plan-85-campaign-rewrite-charter, plan-86-dynamic-board-evidence-upgrade, plan-92-pre-challenge-15-living-board-pilot, plan-99-board-dynamics-bestiary-core, plan-100-dynamic-mechanic-necessity-lint, plan-101-charger-archetype]
gate: "before mutation; do not run until Plan 92 pilot review is accepted or the owner explicitly skips the pilot dependency. Archetype/lint prerequisites (Plans 99, 100, 101) are complete."
summary: >-
  Living-board-aware replacement for Plan 77's pre-Challenge-22 resource/territory uplift. Uplifts three resources-and-territory levels (16 jump-if-ready → Charger, 18 stay-still-can-do-something → Sentry ambient, 21 freeze-the-lane → Charger), each previously leaning on frozen-decoy NPCs, wiring in the bestiary archetypes Plans 99/101 built and proving each tier/necessity claim spatially. Level 20 my-side-their-side was deferred to Plan 103 (a position sensor cannot be made strictly load-bearing in a reach-a-cell level); find-the-enemy-flag (sensing-phase) is out of scope.
---
# Plan 93: Pre-Challenge 22 Living Resource Uplift

- Packet id: Plan 93
- Packet title: Pre-Challenge 22 Living Resource Uplift
- Status: (see frontmatter)
- Owner/model: level-editing specialist after pilot review
- Date: 2026-07-06
- Packet type: implementation / curriculum / level-editing
- Mutation level: source-code, tests, generated evidence, docs
- Approval gate: before mutation; do not run until Plan 92 pilot review is accepted or the owner explicitly skips the pilot dependency
- Expected artifacts:
  - living-board-aware replacement for superseded Plan 77
  - revised source for Levels 16/18/20/21: archetype wiring (`cpuBehavior` + `chargeRange`/`guardRadius`/`guardPost`), `boardDynamicsTier`, and `mechanicNecessity` annotations
  - naive-solution fixtures at `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` proving the old trivial solution fails; updated reference fixtures
  - per-level spatial tier proof in the progress report
  - regenerated dossiers and behavior evidence
  - focused readiness/lint tests, including the tier-lint accept/reject check
  - progress report
- Progress report folder: `reports/development/plan-93-pre-challenge-22-living-resource-uplift/`
- Progress report file: `reports/development/plan-93-pre-challenge-22-living-resource-uplift/progress.md`

## Packet Summary

Goal: Replace superseded Plan 77 with a living-board-aware uplift that rehearses compound resource/territory reasoning before Challenge 22 without relying on frozen-board assumptions.

Non-goals:
- Do not implement superseded Plan 77 as written.
- Do not touch Challenge 22 itself unless the owner explicitly authorizes calibration after the uplift.
- Do not change Strategy Brain or project levels.
- Do not introduce Advanced boolean operators earlier than intended.
- Do not run before pilot findings are reviewed unless the owner explicitly accepts the risk.
- Do not uplift `find-the-enemy-flag` (Level 9). It is a sensing-phase level, not a resources-and-territory level, and does not belong to this pre-Challenge-22 ramp. It was a Plan 77 carry-over candidate; it is removed here. If a sensing-phase uplift is wanted, it is a separate packet.
- **Do not rewrite student-facing copy into new voice or mission prose.** The voice rewrite is Plans 94→95, sequenced *after* boards settle (charter S5). If a board change makes an existing tip or tutorial line factually false (e.g. a "the enemy is frozen" line once the enemy is a live Charger), **delete the false line with no replacement** — the same resolution taken for the Plan 92 Level 13 tip — rather than rewriting it. Factual test/fixture updates and deleting now-false lines are in scope; creative copy is not.
- Do not add a new NPC archetype. This packet consumes only Dummy, Sentry, Wanderer, Guard (Plans 99), and Charger (Plan 101). If a level appears to need Raider, Shadow, or any behavior none of those provide, stop and surface — do not improvise one here.

Depends on:
- Plan 85 accepted.
- Plan 86 complete.
- Plan 92 complete and reviewed, unless owner waives.
- **Plan 99 complete** — provides `boardDynamicsTier` metadata + tier lint, and the Guard/Sentry archetypes this packet assigns.
- **Plan 100 complete** — the dynamic-mechanic-necessity lint hook. Any level whose mechanic becomes load-bearing *because of the live board* must be annotated `mechanicNecessity: "dynamic"` with a discoverable naive-solution fixture, or `lint:levels` will warn. This packet is the first level-content packet run under that rule.
- **Plan 101 complete** — provides the Charger archetype (`GUIDED_CHARGER`, optional per-runner `chargeRange` wired through `setup.js`) that makes `jump-if-ready` load-bearing.
- Plan 91 complete if usage fields are touched.
- Plan 94 complete if copy lint/voice rules are required before copy changes.

Blocks:
- Any future `bughunt-22` recalibration (bug-hunt variety work from the Plan 75/76 audits, not yet a packet) if it depends on the new resource-readiness ramp. (Not Plan 78 — that packet is runtime bug repair and does not touch bug-hunt levels.)
- Any Challenge 22 follow-up calibration.

Why this packet exists:
All Plan 76 synthesis models agreed that the largest non-project cliff sits before Challenge 22. Plan 77 captured the right intuition, but it assumed frozen boards and single-level tweaks. Plan 85 keeps the compound-condition goal but requires the fix to fit living boards, protected-level rules, and evidence from the pre-Challenge-15 pilot.

## Authority And Contracts

Required project contracts:
- Plan 85, especially S1 (board-dynamics tiers), S2 (bestiary), S8 (degenerate-solution standard).
- Superseded Plan 77 as raw material, not as executable authority.
- Plan 92 progress report and pilot evidence — **including its two carry-forward lessons**: (1) prove tier claims spatially, not by simulating only the reference run (the Level 12 mis-tier root cause); (2) prefer physical/walled separation over path-argument separation for background-motion enemies.
- Plan 99 progress report — the `boardDynamicsTier` enum + lint, Guard/Sentry behavior.
- Plan 101 progress report — the Charger's config shape (`GUIDED_CHARGER`, `chargeRange`, commit-to-line semantics, stop-at-wall/barrier/edge).
- Plan 86 evidence.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/npc-and-cpu.md` — the bestiary mapping table and per-archetype behavior notes.
- `docs/subsystems/turn-engine.md`

Do not redefine:
- Guided mode still introduces one primary concept at a time.
- Compound practice combines a new idea with a prior skill; it must not become a hidden second new concept.
- Demo Blockly cannot reveal exact solutions.
- Runtime rules remain in their subsystem owners.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85.
- Plan 77.
- Plan 86 output.
- Plan 92 progress report and changed pilot evidence.
- Plan 75/76 recommendation rows for the four in-scope targets:
  - `jump-if-ready` (Level 16)
  - `stay-still-can-do-something` (Level 18)
  - `my-side-their-side` (Level 20)
  - `freeze-the-lane` (Level 21)
- Current level source and reference fixtures for the four target levels. Note the current "before" state: Levels 16, 18, and 20 park their opponents as `isFrozen: true, frozenTurnsRemaining: 999` decoys — the exact frozen-board crutch this uplift replaces. Level 21 already has one live opponent at (7,3) plus one frozen decoy.
- `src/ai/npc/freePlayCpu.js` — `getGuidedChargerAction`, `getGuidedGuardAction`, `getGuidedVerticalPatrolAction` to understand what each archetype actually does before assigning it.

Use `rg` for target level ids and:
- `boardDynamicsTier`
- `mechanicNecessity`
- `GUIDED_CHARGER`
- `GUIDED_GUARD`
- `chargeRange`
- `canJump`
- `FREEZE_OPPONENTS`
- `MY_SIDE`
- `hasEnemyFlag`

## Scope

### In Scope

- Uplift the three in-scope resources-and-territory target levels, each with a recommended archetype pairing (the implementer confirms or proposes an alternative in the target-confirmation note before mutation — the pairing is a starting design, not a mandate):
  - **Level 16 `jump-if-ready`** (`if can_jump`, a resource-state lesson) → **Charger**. A Charger charging down the ally's lane makes the jump load-bearing: the legible counterplay is to jump out of / over the charging lane at the right moment. Use `chargeRange` if an unbounded trigger proves chaotic on `simpleAisle`. This is the pairing Plan 101 was built for.
  - **Level 21 `freeze-the-lane`** (Area Freeze timing) → **Charger** down the lane (thematically exact — freeze the charging lane), or a **Guard** as the fallback if the Charger's commit-to-line makes the freeze window unreadable. Level 21 already has one live opponent, so this is the smallest board change.
  - **Level 18 `stay-still-can-do-something`** (Stay Still removes a barrier directly ahead) → **Sentry** ambient vertical patrol only. This level's lesson is that *not moving* is the smart move; the added threat must supply legible life **without** making movement mandatory or contradicting the Stay-Still lesson. If no archetype can add pressure here without breaking that lesson, leave Level 18 background-motion-only or defer it — do not force a threat that fights the concept.
- **Level 20 `my-side-their-side` is deferred out of this packet to [Plan 103](plan-103-territory-necessity-redesign.md).** At review time the reasoning was that a *position* sensor (`on_my_side`) cannot be made strictly load-bearing in a deterministic reach-a-cell level because the winning path is hardcodable.
  - **[Correction, 2026-07-08 — Plan 103 design-note round disproved that rationale.]** The engine has no cross-turn program counter (`resolveFirstRunnableAction` returns the first runnable action every turn), so a bare stack of move blocks repeats its first action forever and the cited "hardcoded climb-then-across" path is not an expressible program. `on_my_side` is in fact *already structurally necessary* on this one-way level (the territory conditional is the only way to switch movement axes). L20's real issue was frozen decoys plus a mis-tuned Guard, not a necessity hole. Plan 103 was accordingly re-scoped from an objective redesign to an honest **living-board pass** on the existing objective. The deferral itself still stands; only the rationale above was wrong.
- Assign an honest `boardDynamicsTier` (Plan 99) to each changed level and pass the tier lint clean.
- Where a level's mechanic becomes load-bearing because of the live board, annotate `mechanicNecessity: "dynamic"` and add the discoverable naive-solution fixture so the Plan 100 lint passes.
- Add living-board-aware compound conditions using existing blocks and deterministic board behavior.
- Add naive/old-solution failure evidence for each changed level, as a fixture at `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` (Plan 86/100 convention), proving the pre-uplift trivial solution now fails.
- Update fixtures and generated evidence for changed levels; delete any now-false copy lines (no rewrites — see non-goals).

### Out Of Scope

- `find-the-enemy-flag` (Level 9) — sensing-phase, not part of this ramp (see non-goals).
- **Level 20 `my-side-their-side`** — deferred to [Plan 103](plan-103-territory-necessity-redesign.md); see In Scope for why.
- Any level outside the three in-scope resources-and-territory targets.
- Whole-campaign rewrite.
- Advanced boolean operator introduction.
- New NPC archetypes or NPC-behavior/tier-lint infrastructure (Plans 99/101 own that; this packet only *consumes* it).
- Voice/mission copy rewrite (Plans 94/95).
- Strategy Brain/project-level redesign.
- New mandatory levels.
- Runtime rule changes.

## Implementation Requirements

### 1. Target Confirmation

Required behavior:
- Before editing, produce a short target-confirmation note listing the four target levels, the archetype each will receive (confirming or proposing an alternative to the recommended pairing above), the intended `boardDynamicsTier` for each, and the compound condition each reference solution will exercise.
- For each level, state in the note *why* the chosen archetype makes the named mechanic load-bearing, and whether Level 18 will receive a Sentry or be left background-motion-only.

Constraints:
- The four in-scope targets are fixed (16, 18, 20, 21). `find-the-enemy-flag` is out of scope, not a candidate.
- If a proposed archetype pairing differs from the recommendation or any win-condition/cell change is required, stop for owner approval before mutation.

### 2. Compound Reasoning

Required behavior:
- Each changed level's reference solution must materially combine the named concept with a previously taught idea.
- The old trivial solution must fail or be clearly worse in the generated evidence.

Constraints:
- Use nested `if`/`if-else` if Advanced boolean operators are not yet introduced.
- Do not rely on multiple actions per turn.

### 3. Living Board Fit

Required behavior:
- Board changes must use deterministic, student-legible pressure from the Plan 99/101 archetypes only (Dummy, Sentry, Wanderer, Guard, Charger).
- The condition should feel useful because of the board, not because copy says it is useful.
- Replace the frozen-decoy opponents on Levels 16/18/20 (`isFrozen: true, frozenTurnsRemaining: 999`) with the assigned live archetype where that archetype is the source of the level's new pressure. Do not leave a decoy frozen and then claim a live-board tier.

Constraints:
- Do not create random or unrecoverable enemy behavior.
- If a needed NPC behavior is missing, **stop and surface** — do not improvise a new archetype (that is a Plan 99-class packet, not this one).

### 4. Spatial Tier Proof (hard requirement — Plan 92 carry-forward)

Required behavior:
- Each `boardDynamicsTier` claim must be proven **spatially** — by reasoning about the reachable cells and the archetype's actual movement envelope — **not** by simulating only the reference solution and observing "no interference." This is the exact failure that produced the Level 12 mis-tier: a Sentry sat on the ally's flag column but the reference run never overshot, so a reference-only check called it `background-motion` when it was collision-capable.
- For any level tiered `background-motion` (enemy present but cannot capture along any winning-or-near-winning path), the proof must show the enemy's reachable cells are physically/wall-separated from the player's reachable cells — prefer walled separation over "the reference path happens not to go there."
- For any level tiered `collision-threat`/`timing-threat`, name the cells and turns where the threat is real, and confirm the intended counterplay (jump, freeze, route-around) actually resolves it.

Constraints:
- Record the spatial proof per level in the progress report. A tier claim without a spatial proof is a stop condition.

## Work Plan

1. Confirm Plan 92 pilot acceptance. Read `getGuidedChargerAction` / `getGuidedGuardAction` / `getGuidedVerticalPatrolAction` and the Plan 99/101 progress reports so the archetype assignments are grounded in real behavior.
2. Read each of the four target levels and current/generated evidence, noting the frozen-decoy "before" state.
3. Write the target-confirmation note (§1): archetype per level, intended tier, compound condition, and the Level 18 Sentry-or-defer call. Stop for owner approval if any pairing differs from the recommendation or any win-condition/cell change is needed.
4. Implement the approved edits: wire archetypes via `cpuBehavior` (+ `chargeRange`/`guardRadius`/`guardPost` as needed), set `boardDynamicsTier`, and annotate `mechanicNecessity: "dynamic"` where the live board is what makes the mechanic load-bearing.
5. Add the naive-solution fixture per changed level at `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` and confirm the pre-uplift trivial solution now fails; update reference fixtures.
6. Write the per-level spatial tier proof (§4) into the progress report.
7. Run the tier-lint accept/reject check (see Commands), regenerate dossiers/evidence, and run readiness/lint/tests.
8. Write progress report with target-by-target outcomes, spatial proofs, and the Level 18 decision.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
npm run level:dossiers
npm run level:behavior-evidence
npm test
npm run build
```

Run targeted readiness commands for each touched level:

```powershell
npm run level:readiness -- --level <level-id>
```

## Validation Checklist

- [ ] Plan 77 remains superseded; this packet is the executable replacement.
- [ ] Target-confirmation note (four levels, archetype, tier, compound condition, Level 18 decision) was produced and approved before edits.
- [ ] `find-the-enemy-flag` was not touched.
- [ ] Each changed level still centers its named concept; Level 18's Stay-Still lesson was not contradicted by its added threat.
- [ ] Only Plan 99/101 archetypes were used; no new NPC behavior was introduced.
- [ ] Each changed level carries an honest `boardDynamicsTier`; `npm run lint:levels` accepts the correct tier AND rejects a deliberately-wrong one (verify once with a temporary bad value, then revert).
- [ ] Every level whose mechanic is dynamically load-bearing is annotated `mechanicNecessity: "dynamic"` with a discoverable naive fixture, and `lint:levels` shows no `win-condition-requires-named-mechanic` warning for it (Plan 100).
- [ ] A naive-solution fixture exists at `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` for each changed level and provably fails; new reference solution passes.
- [ ] A per-level **spatial** tier proof (not a reference-run-only check) is recorded in the progress report.
- [ ] No student-facing copy was rewritten; any now-false line was deleted, not reworded.
- [ ] Reference fixtures pass; generated dossiers/evidence updated.
- [ ] No runtime subsystem contract drift; `npm test`, `npm run lint:levels`, `npm run build` pass.
- [ ] Progress report identifies any remaining Challenge 22 ramp risk.

## Stop Conditions

- Pilot evidence suggests living-board uplift worsened Challenge 15 outcomes.
- Owner has not approved the target-confirmation note.
- A target edit requires a new NPC behavior (beyond Dummy/Sentry/Wanderer/Guard/Charger) or a runtime rule change.
- A `boardDynamicsTier` claim cannot be proven spatially (only by simulating the reference run) — stop rather than tier by reference-run.
- Level 18 cannot receive live pressure without contradicting its Stay-Still lesson, and leaving it background-motion-only is not acceptable to the owner — surface for a decision.
- A change would introduce Advanced boolean blocks too early.
- A `docs/subsystems/*.md` note would become untrue.
