# Progress Report - Plan 103: Territory-Necessity Redesign (`my-side-their-side`)

## Status

**Stopped at the packet's own pre-mutation gate.** `node scripts/dev/plan-status.js check plan-103-territory-necessity-redesign` reports `status: draft` (BLOCKED), which is consistent with the packet's structure: it explicitly requires a design note plus owner sign-off before any mutation ("Approval gate: before mutation... produce the design note... and get owner sign-off on *that* before mutating"). I did the design-note phase (research and simulation only) and stopped there — no source, test, fixture, level, or doc file was mutated.

I did not just write the design note as scoped, though — the investigation surfaced that the packet's accepted direction (flag-carry round trip via the existing `on_my_side` toolbox) is not buildable at all, for reasons independent of board/threat design. That's Stop Condition #1 in the packet, so I'm handing this back for an owner decision rather than picking one of the alternatives myself.

## What I did

1. Read the packet, its dependencies (Plan 85, Plan 93's progress report and its Level 20 section, Plan 99), `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`'s Level 20 row, `docs/subsystems/turn-engine.md` (collision rule tree, scoring rules), and the current shipped `level-20-my-side-their-side.js` / its reference-solution fixture.
2. Confirmed the existing win-condition vocabulary needed for a flag-carry objective already exists (`team_scores_point`, used by `level-03-score-a-point.js`) — no new win-condition type would be needed, consistent with the packet's instruction to reuse existing vocabulary.
3. Built a throwaway simulation harness in `local/investigations/plan-103/` (gitignored, not a deliverable) that clones a real level definition from `getLevelDefinitions()`, patches it, and drives it through the actual turn engine (`processTurnActions`) — mirroring the `simulateLevelXml`/`runLevelSimulation` pattern in `src/dev/levelReadiness.js`, since that function only accepts a level `id` looked up from the live registry rather than an injectable level object.
4. Hit, and worked around, the same normalization gotcha noted in the Plan 92 repair: `getLevelDefinitions()` pre-normalizes `setupOverrides` into `level.setup` and pre-bakes `failureCondition` into `failureConditions` at build time, so a patch has to target the normalized fields directly or it's silently a no-op.
5. Used the harness to establish three findings, detailed in [design-note.md](design-note.md):
   - The engine has no program counter across turns — `resolveFirstRunnableAction` always starts from the top of the "on each turn" chain, so a plain stack of differing movement blocks with no conditional between them only ever executes the first block, forever. Verified against the current shipped Level 20.
   - Exhaustively enumerated and simulated all 25 programs expressible from Level 20's toolbox (`if_on_my_side_else` × 5 possible `DO` actions × 5 possible `ELSE` actions, which subsumes the 5 "constant action" programs as the `DO==ELSE` diagonal) against a `team_scores_point` win condition on the open, unmodified board with no threat and a 60-turn budget. **Zero passed.** This is a structural property (the sensor's truth value flips twice over a round trip but `DO` is one fixed action that would need to mean two opposite things), not a tuning problem — no board layout or threat placement can fix it.
   - Sanity-checked that adding `if_have_enemy_flag` alongside `on_my_side` doesn't rescue the design either — `if_have_enemy_flag` alone (monotonic, unlike `on_my_side`) already solves the round trip, which would make `on_my_side` incidental rather than necessary, violating the packet's own "not incidental" requirement.
6. Wrote up the full evidence and a reassessment of Plan 93's cited justification (the specific "hardcoded path" example in this packet's summary is not literally reproducible in the engine, though Plan 93's underlying decision to revert the Guard attempt still looks correct for a narrower, geometric reason — see design note §5) in `design-note.md`, along with four options for an owner decision on how to proceed.

## Files touched

- `reports/development/plan-103-territory-necessity-redesign/design-note.md` (new — the required pre-mutation artifact)
- `reports/development/plan-103-territory-necessity-redesign/progress.md` (this file)
- `local/investigations/plan-103/*.mjs` (new, gitignored scratch simulation scripts — not a tracked deliverable, kept for reproducibility per design note §7)

No files under `src/`, `tests/`, `docs/` (outside this report folder), or `reports/development/guided-level-complexity-audit/` were touched. No `npm test` / `lint:levels` / `level:readiness` / `build` runs were needed since nothing was mutated; existing suites are unaffected.

## Problems encountered

- The packet's cited degenerate-path example didn't hold up against the real engine semantics once I actually ran it (see design note §2) — worth flagging since it means the packet's own stated justification for deferring Level 20 needs a second look, even though I believe the underlying decision to revert Plan 93's Guard attempt was still right, just for a different, narrower reason.
- The core finding (round trip is unbuildable with the current toolbox, not just currently-not-yet-designed-correctly) is stronger than what Stop Condition #1 anticipated ("no proposed objective makes it load-bearing without changing the taught concept") — it's the same stop condition, but I want to flag that this isn't a "we haven't found the right board yet" situation; it's provably not buildable as scoped.

## Next step

Awaiting an owner decision among the four options in design-note.md §6 (my recommendation is option (a): revisit the one-way `runner_reaches_cell` shape with a correctly-placed threat, which requires the owner to lift this packet's own non-goal against re-attempting a board-only fix, since the evidence that non-goal was based on doesn't hold up). Per standing instructions, I have not set this packet's status to anything other than what orchestration controls, and have not implemented any of the four options.
