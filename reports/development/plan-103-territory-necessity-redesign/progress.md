# Progress Report - Plan 103: Level 20 Living-Board Pass (`my-side-their-side`)

## Status

**Implemented.** The owner accepted the round-1 design-note finding (flag-carry round trip is unbuildable; the shipped one-way objective already makes `on_my_side` structurally necessary) and revised the packet to an honest living-board pass on the existing objective. This report covers round 2 (implementation). Round 1's findings are preserved unchanged in [design-note.md](design-note.md) and are not contradicted by anything below — round 2 builds directly on them (§5 there is the basis for keeping the one-way objective; the 25-combo sweep methodology is reused here against the live archetype).

Per standing instructions, packet status is left for orchestration to set; I have not marked this `complete` and have not edited `docs/development/README.md` or any plan index.

## Round 1 summary (unchanged, see design-note.md for full detail)

- The engine has no cross-turn program counter (`resolveFirstRunnableAction` re-walks the block chain from the top every turn).
- A flag-carry round trip is unbuildable with the `on_my_side` toolbox: exhaustive sweep of all 25 expressible programs, 0 passed, on an open board with no threat.
- The shipped one-way `runner_reaches_cell` objective already makes `on_my_side` structurally necessary (reaching `(6,2)` from `(1,6)` needs two movement axes; the territory conditional is the toolbox's only branching primitive).
- Adding `if_have_enemy_flag` doesn't help — it's monotonic and would solve the trip alone, making territory incidental.

## Round 2: implementation

### Archetype and placement

Converted `runner_2_Npc1` from a frozen decoy (`isFrozen: true, frozenTurnsRemaining: 999` at `(10, 2)`) to a live **Sentry** (`NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL`) at the same spawn cell. `runner_2_Npc2` is left frozen at `(10, 6)`, matching Plan 93's own precedent of converting one decoy per level rather than both.

Sentry, not Guard or Charger, per the packet's own steer ("prefer a Sentry/patrol that adds enemy-side life without needing to intercept"): vertical-patrol behavior never changes `gridX` (`getGuidedVerticalPatrolAction`, `src/ai/npc/freePlayCpu.js:147`), so its reachable set is fixed to one column for the life of the level — the simplest archetype to prove disjoint from a path, and the lowest-risk choice given the toolbox cannot express dodge-plus-territory (a Guard or Charger able to actually threaten the path would risk breaking the one winnable program; a patrol that can't leave its column can't intersect a path that never visits that column, by construction).

### Reference-survives-threat simulation (the live gate)

Reused the round-1 harness (`local/investigations/plan-103/try5-sentry-reference.mjs`, gitignored) to drive the reference fixture (`if_on_my_side_else { DO: move_forward, ELSE: move_up_screen }`) through `processTurnActions` against the live Sentry:

```
result: PASSED   turns: 9   reason: win_condition_met
```

The Sentry patrols column 10 the entire run (confirmed from the event trace: `(10,2)→(10,1)→(10,0)→(10,1)→(10,2)→...`); the ally's path is `(1,6)→(2,6)→...→(6,6)→(6,5)→...→(6,2)`. No shared cell, no interaction.

This is also now covered by a durable, automated regression test, not just the throwaway harness: `tests/unit/guided-reference-solutions.test.js`'s `"reference code-block programs solve every non-project non-prediction guided level"` test runs every level's reference fixture (including `my-side-their-side`) through the real engine and asserts `LEVEL_RESULT.PASSED`. It passed as part of the full `npm test` run below, so this proof re-runs on every future change to the level or the Sentry behavior, not just today.

### Reachable-cell tier proof (not reference-run-only)

Per the Plan 92 carry-forward, a reference-run-only check isn't sufficient — the previous packet round already showed a reference-only check can miss a real intersection. So I reused the round-1 25-combo exhaustive sweep (`local/investigations/plan-103/try6-sentry-exhaustive.mjs`), this time against the *live Sentry* and the *original* `runner_reaches_cell` win condition (not the abandoned round-trip), covering every program the toolbox can express:

```
Total combos: 25, PASSED: 1
  DO=move_forward ELSE=move_up_screen -> turns=9
--- union of ally cells across all PASSING programs ---
[ '1,6','2,6','3,6','4,6','5,6','6,2','6,3','6,4','6,5','6,6' ]
max ally x-coordinate across all winning programs: 6
```

Exactly one of the 25 expressible programs wins (matching design-note §5), and its entire cell footprint has `x ≤ 6`. The Sentry's reachable set is `x = 10` for all rows, invariant under `GUIDED_VERTICAL_PATROL`. These sets are disjoint by construction — not because the one reference run happened to avoid the Sentry, but because *no expressible winning program* can ever reach column 10, and the Sentry can never leave it. This is the full space of winnable programs, not a sample, since the toolbox only expresses 25 candidate programs total (round-1 finding).

**Tier: `BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION`** — the live enemy provably cannot reach the carrier's path cells under any winnable program, so `collision-threat` would be dishonest.

One incidental, harmless observation from the regenerated behavior evidence: the Sentry occasionally bounces off its own frozen teammate (`runner_2_Npc2` at `(10,6)`) when its patrol reaches row 6 (`runner.blockedOrBounced`, `reason=runner_collision_bounce`) — an ordinary same-cell-occupancy block, not a capture or an enemy-collision-rule interaction. It doesn't change the Sentry's column, so it doesn't affect the disjointness proof above.

### Necessity annotation and the linter wrinkle

Set `mechanicNecessity: MECHANIC_NECESSITY.STATIC` (no level in the codebase used this value before now — background-motion levels like `bring-it-home` simply omit the field). Checked `checkWinConditionRequiresNamedMechanic` (`src/dev/levelLintCore.js:730`) directly: it only evaluates a level's concept-matrix row if that row's text contains one of a fixed keyword list (`and`, `or`, `not`, `barrier`, `freeze`, `jump`, `distance`, `runner index`, `teammate`, `compare`, `move toward`). Level 20's concept-matrix row text ("field halves (my side introduced)" / "territory conditions (my-side variants only)" / "board orientation") contains none of them, so the rule short-circuits before ever examining this level (`if (!interestingKeywords.length) continue;`) — territory/side-based necessity isn't in this lint rule's vocabulary at all yet.

**Resolution: first bullet of the packet's §Linter Wrinkle applies.** `mechanicNecessity: "static"` is set, and it clears — `npm run lint:levels` produces zero diagnostics for `my-side-their-side` (confirmed below), and `npm run level:readiness -- --level my-side-their-side` reports `Lint diagnostics: pass`. No dishonest `dynamic` annotation or invented naive fixture was needed or used. I did not file a follow-up ticket to teach the linter about `and`/territory-style geometry-forced necessity, since this specific level already clears cleanly and the packet's own scope excludes touching the lint rule; flagging it here in case the next packet touching this rule wants to add territory-style keywords to the `interestingKeywords` list for stronger structural coverage.

### Copy

Reviewed the three tips for now-false lines per the packet's "delete, don't rewrite" instruction. Two are unambiguously still true. The third — `"This level is about territory awareness, not flag carrying yet."` — is a borderline case: the "yet" implies a future flag-carry evolution that round 1 proved will never happen via this toolbox. I decided **not** to touch it: the sentence is not factually wrong about the level a student is currently playing (it genuinely isn't flag-carrying), only its forward-looking implication is stale, and the packet's instruction is to delete lines that are *false*, not ones with dated framing, plus editing a single clause would be a rewrite, not a deletion. Recording the reasoning here rather than acting unilaterally, since this is exactly the kind of copy judgment call that got corrected during the Plan 92 repair.

### Engine Fact doc note

Added the stateless-per-turn / no-program-counter note to `docs/subsystems/blockly-workspace.md`'s "Execution model" section (the section already partially covered "only the first reachable action... executes each turn"; the new paragraph makes the cross-turn consequence and the necessity-reasoning implication explicit, per the packet's exact requested wording, and cites Plan 103 and the corrected Plan 93 finding).

## Files touched

- `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js` — Sentry archetype, `boardDynamicsTier: BACKGROUND_MOTION`, `mechanicNecessity: STATIC`, explanatory comment with the disjointness proof; win condition, toolbox, taught concept, and tips unchanged.
- `docs/subsystems/blockly-workspace.md` — added the §Engine Fact note to "Execution model".
- `reports/development/guided-level-complexity-audit/{level-dossiers,behavior-evidence}/22-my-side-their-side.md`, `summary-index.md`, `behavior-summary-index.md` — regenerated (`npm run level:dossiers`, `npm run level:behavior-evidence`).
- `reports/development/plan-103-territory-necessity-redesign/progress.md` — this file.
- `local/investigations/plan-103/try5-sentry-reference.mjs`, `try6-sentry-exhaustive.mjs` (new, gitignored scratch scripts, reused the round-1 harness).

No changes to `design-note.md` (preserved as the round-1 record, per the packet's instruction not to delete or contradict it). No new NPC archetype, no toolbox change, no win-condition change, no naive-solution fixture, no `docs/development/README.md` or plan-index edit.

## Validation

```
node scripts/dev/plan-status.js check plan-103-territory-necessity-redesign  → RUNNABLE
npm run level:dossiers                                                       → 46 dossiers generated
npm run level:behavior-evidence                                              → 46 evidence files + summary index generated
npm run level:readiness -- --level my-side-their-side                        → all checks pass, including
                                                                                 "Reference runtime: pass — Reference solution passes this level"
                                                                                 and "Lint diagnostics: pass — No lint diagnostics apply to this level"
npm run lint:levels                                                          → exit 0; zero diagnostics mention my-side-their-side
                                                                                 (51 pre-existing warnings for other, unrelated levels' untiered status)
npm test                                                                     → 469/469 passing (includes the reference-solves-every-level test)
npm run build                                                                → succeeds (pre-existing chunk-size warnings only, unrelated)
```

## Problems encountered

None that blocked implementation. The only judgment call (the "not flag carrying yet" tip) is documented above rather than acted on unilaterally.

## Next step

None from my side — implementation, proof, and validation are complete per the packet's checklist. Awaiting orchestration review and status update.
