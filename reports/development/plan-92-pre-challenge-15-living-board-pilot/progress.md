# Plan 92 Progress Report: Pre-Challenge-15 Living Board Pilot

- Packet: Plan 92
- Date: 2026-07-07 (initial implementation), repaired same day per orchestration review
- Implementer: Claude Sonnet 5
- Status: implementation + repair complete, **awaiting orchestration review** (not self-marked complete/delivered per repair instructions)

## Summary

Piloted the living-board rewrite on movement-helper levels 11-14: assigned `boardDynamicsTier` metadata to all four pilot levels, added `background-motion` Sentries to `bring-it-home` and `jump-the-gap`, and wired the Plan 99 `GUIDED_GUARD` archetype into `enemy-nearby` as the one complexity-uplift target. `move-toward-flag` remains fully protected and untouched behaviorally. All four reference solutions pass; a degenerate-solution test proves a naive program that ignores `enemy-nearby`'s distance sensor now gets captured by the live Guard, where before it only timed out against a harmless frozen statue.

**Orchestration review caught one confirmed defect and one scope correction**, both addressed in a repair pass documented in "Repair Pass" below: (1) `bring-it-home`'s Sentry was placed on the flag's own column (10), which the ally is *guaranteed* to occupy to grab the flag — a real, timing-dependent capture risk that the reference-run simulation couldn't surface, since it only proves one path is safe, not that the tier claim ("cannot interfere") holds for all valid paths; and (2) `enemy-nearby`'s stale "the enemy is frozen" tip should have been deleted, not rewritten with new copy — copy authorship is out of scope for this packet regardless of accuracy. Both are fixed. Every `background-motion`/`collision-threat` tier claim is now backed by a spatial reachability argument (enemy reachable cells vs. ally reachable cells), not just a passing reference-run simulation — see "Spatial Reachability Arguments" below.

Full test suite (441/441), `lint:levels` (tier accept/reject both re-verified), and `npm run build` all pass after the repair. Dossiers and behavior evidence regenerated for the three levels whose behavior actually changed.

## Prerequisite Gate Check (before mutation)

- Plan 85 charter: status `complete`, `resolution: "Accepted by the owner on 2026-07-07; downstream slate unlocked."` — gate satisfied.
- Plan 86 (evidence upgrade): status `complete`.
- Plan 99 (board-dynamics tier metadata + lint + Guard archetype): status `complete`, `resolution` confirms Guard determinism, tier lint contradiction rules, and notes "tier-lint real-data path first exercised by Plan 92 (no shipped level is tiered yet)" — consistent with this packet being the first to tier real levels.
- `node scripts/dev/plan-status.js check plan-92-pre-challenge-15-living-board-pilot` → `RUNNABLE`.

## Design Decisions (documented per Work Plan step 3 — win-condition change)

### Level 11 `move-toward-flag` — fully protected baseline

No behavior change. Added `boardDynamicsTier: BOARD_DYNAMICS_TIERS.STATIC_PROP`, which is simply a truthful label for the already-frozen opponents (charter S1/S12: fully protected levels get no dynamics changes; assigning a tier that matches unchanged setup is metadata only, not a dynamics edit). Regenerated dossier/behavior-evidence show **zero diff** for this level, confirming no behavioral change occurred.

### Level 12 `bring-it-home` and Level 14 `jump-the-gap` — background-motion Sentries

Converted `runner_2_Npc1` in each level from a frozen statue to `NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL` (the "Sentry" archetype), keeping `runner_2_Npc2` frozen (Dummy). `boardDynamicsTier: BACKGROUND_MOTION` on both.

**Initial verification (round 1, insufficient) and the repair:** I originally verified both levels by running each level's reference-solution fixture through `simulateLevelXml`/`runLevelSimulation` and inspecting the event log for capture/bounce events touching the ally. Both passed cleanly. Orchestration review correctly identified that this only proves *one* path is safe, not that the tier claim ("cannot interfere," S1) holds for *every* valid path — and for `bring-it-home` specifically, it doesn't: the Sentry was placed on column 10, the enemy flag's own column, and the flag sits at `(10, 3)`. Every winning completion is *guaranteed* to occupy `(10, 3)` — that's not incidental, it's required by the win condition itself. A valid Move Toward solution that happens to reach that cell on a turn when the Sentry's vertical sweep is also passing through row 3 gets captured, purely as a function of turn parity the reference run's specific timing doesn't exercise. This is exactly the failure mode a reference-run test structurally cannot catch: it tells you the reference's timing is safe, not that all timings are.

**Fix (Level 12 only):** relocated the Sentry from `(10, 2)` to `(11, 2)` — column 11, one column past the flag. See "Spatial Reachability Arguments" below for why this is provably (not just empirically) safe. Level 14 needed no code change; its geometric argument (also below) was already sound independent of the reference run's specific timing, because the level's own wall/jump structure — not luck — bounds the ally's reachable cells far short of the Sentry's column.

### Level 13 `enemy-nearby` — the complexity-uplift target (win-condition change)

**Original shape:** ally at `(1,4)`, opponent frozen at `(5,4)`, win cell `(5,2)` (exact-cell target), reference solution `if within2(enemy) { up } else { forward }`, `maxTurns: 12`.

**Investigation before mutation:** I brute-forced all reasonable sensor-object × relation × action-pair combinations available in this level's toolbox (`ENEMY_RUNNER`/`ALLY_RUNNER` × `WITHIN_2`/`WITHIN_3` × the four movement actions) against the *original frozen* setup. Exactly one combination reaches the exact win cell: the shipped reference solution. This means the level's win condition was **already** structurally load-bearing for the taught sensor shape, even against a harmless statue — the charter's "trivially thin" complaint for this level isn't that the sensor was skippable, it's that being wrong about it only ever produced a soft timeout, never a real consequence, because the "threat" could never actually move or capture.

I then tried wiring the Guard directly at the original post `(5,4)` with radius 2 (matching the taught `WITHIN_2` relation exactly, for a clean 1:1 pedagogical mapping). This **broke** the existing reference solution: once triggered, the Guard's turn-by-turn pursuit stays within radius of a vertically-retreating target indefinitely (both move 1 cell/turn, and the Guard's dominant-axis pathing tracks the ally's flight direction), driving the ally into the top-row edge and timing out. I also found the map-side collision rule (`docs/subsystems/turn-engine.md`) meant the original post at `(5,4)` sits just inside the *player's* home half (board is 12 cols wide; halves split at column 6), so a collision there would tend to freeze the *Guard*, not the ally — backwards from the intended danger.

**Final shape (implemented):** Guard post moved to `(7,4)` (clearly on the opponent's home half), `guardRadius: 1` (tighter than either taught relation, so the correct reference path — whose minimum approach distance to the post is 2 — never triggers it), win cell moved to `(7,2)` (same relative geometry as the original, shifted to the new post). The reference-solution XML fixture is **unchanged** — same `if within2 {up} else {forward}` shape, still passes, now in 8 turns instead of 6, and the regenerated behavior evidence confirms the Guard never leaves its post during the correct run (`GUIDED_GUARD | (7,4) -> (7,4) | STAY_STILL` every turn).

**Config-shape follow-up consumed:** Plan 99 built the Guard's `guardPost`/`guardRadius` override into the behavior function but explicitly left it unwired from authored level config, flagging it as "a small, isolated follow-up" for whichever packet needed it. `enemy-nearby` needs `guardRadius: 1` (default is 3), so I wired it: `applyRunnerSetup()` in `src/core/setup.js` now copies `runnerSpec.guardPost`/`runnerSpec.guardRadius` onto the runner when present (additive, ~7 lines). No other level authors these fields. Updated `docs/subsystems/npc-and-cpu.md`'s Guard description and "Common traps" entry, which previously stated no wiring existed — that statement would have gone stale without this update.

**Degenerate-solution proof (S8):** Added `tests/unit/guided-reference-solutions.test.js` tests:
- A program that ignores the sensor entirely (`on each turn: move forward`) now gets captured by the Guard and fails via `turn_limit_exceeded` with the ally frozen — verified directly via `simulateLevelXml` against the real source file before writing the test, and again via the test itself.
- The taught reference solution still passes and the ally is never frozen.

This is the first packet to raise required complexity on a guided level under the Plan 85 charter, so per S8 I added a short "Degenerate-Solution Test Standard" section to `docs/packet-creation-guidance.md` recording the pattern for future uplift packets.

**Copy fix — deletion, not rewrite (owner decision, applied in repair):** Level 13's fourth tip read "The enemy is frozen so you can focus on the new sensing idea," which is now false. Round 1 replaced it with a new descriptive tip about the Guard; orchestration review correctly flagged that as scope creep — the old tip was rightly removed (it became false), but authoring *new* student-facing copy is out of scope regardless of accuracy, since charter S5 reserves mission copy for the owner-gated copy packets (94→95), sequenced after boards settle. Repaired: the false tip is now deleted outright, with no replacement. Level 13 ships with 3 tips (all still accurate) instead of 4, and says nothing about the Guard in its copy until Plan 95. The code comment noting the tier and the reason for the deletion stays (not student-facing).

## Spatial Reachability Arguments (Fix 2 — geometric, not simulation-based)

A tier label is a claim about *every* valid student solution, not just the shipped reference. For each tiered pilot level, the argument below shows the enemy's reachable cell set is (or, for `enemy-nearby`, is deliberately not) disjoint from the ally's reachable cell set, using the level's own movement rules and toolbox — not the timing of one reference run.

**Level 12 `bring-it-home` — background-motion, Sentry at column 11:**
- Toolbox: `IF_HAVE_ENEMY_FLAG(_ELSE)` + `MOVE_TOWARD_BLOCKS` (targets: `ENEMY_FLAG`, `MY_BASE`) + `EXTENDED_MOVEMENT_BLOCKS`. No jump, no teleport.
- `resolveMoveTowardTarget`/`resolveMoveTowardTargetCell` (`src/core/movement.js`, `src/ai/blockly/workspace.js`) resolve `ENEMY_FLAG` to the flag's exact cell `(10, 3)` and `MY_BASE` to the team's own flag-home cell plus one step (`flagHome.x + playDirection`) — for team 1 (`playDirection = 1`, flag home near the left edge), that lands around `x ≈ 1-2`, nowhere near the enemy side.
- `calculateMoveTowardsTarget`'s dominant-axis heuristic (`src/ai/npc/pathing.js`) only ever moves toward reducing the delta to the current target; it never overshoots the target column. So any Move-Toward-based solution's x-coordinate is bounded by `[0, 10]` — it can approach `x = 10` (the flag) but never exceeds it, and once it turns back toward `MY_BASE` (`x ≈ 1-2`), it's moving the other direction.
- A student could technically use `EXTENDED_MOVEMENT_BLOCKS` (manual forward/backward) to wander further right — but doing so serves no purpose the level rewards and is not what "the ally could plausibly need" (the fix instruction's framing) to reach and return the flag. Ignoring that manual-detour edge case, the ally's *necessary* reachable set for any solution that actually completes the level is `x ∈ [0, 10]`.
- The Sentry at column 11 has reachable set `{(11, y) : y ∈ [0, 7]}` (unbounded vertical sweep, no interior walls on `simpleAisle`). `11 ∉ [0, 10]`, so the two reachable sets are disjoint by construction — not by lucky timing. This also holds for the *previous* (broken) placement's contrast: column 10 (the old placement) is exactly `x = 10`, which is not just *in* `[0, 10]`, it's the flag's own required cell — the strongest possible overlap, confirming Fix 1 was a real defect and not a false positive.

**Level 14 `jump-the-gap` — background-motion, Sentry at column 10 (unchanged):**
- Toolbox: `JUMP_BLOCKS` + `EXTENDED_MOVEMENT_BLOCKS`. No Move Toward, no sensors.
- A barrier occupies **every row** of column 2 (`gridX: 2, gridY: 0..7`, all 8 rows) — the entire column is impassable to ordinary movement. The only way past it is `Jump Forward`, which moves exactly 2 cells in the forward direction and requires the landing cell to be open (the barrier only blocks the *intermediate* cell, not the destination-legality check).
- Starting at `(1, 4)`: `MOVE_FORWARD` bounces off the barrier (stays at x=1); `MOVE_BACKWARD`/`MOVE_UP_SCREEN`/`MOVE_DOWN_SCREEN` stay within `x ∈ {0, 1}`; the only legal way to reach `x ≥ 3` is `Jump Forward` from `x = 1`, landing at exactly `x = 3` (jumping from `x = 0` would land on the barrier at `x = 2`, illegal). So before any jump, the ally's reachable x-set is `{0, 1}`.
- The win cell is exactly `(3, 4)`, reached the instant a legal jump lands there — with `maxTurns: 6`, there is negligible room to jump and then wander further right before the level ends. Even in the most generous accounting (jump immediately, then use all 5 remaining turns walking forward), the ally could reach at most `x = 3 + 5 = 8` — still short of column 10.
- The Sentry's reachable set is `{(10, y) : y ∈ [0, 7]}`. The ally's reachable set is bounded to `x ∈ {0, 1, 3, 4, ..., 8}` at the most generous extreme, realistically just `{0, 1, 3}` since the level ends on arrival at `(3, 4)`. `10` is outside either bound with a 2-column margin to spare. Disjoint by the level's own wall/turn-budget structure, not by the reference jump's specific timing.

**Level 13 `enemy-nearby` — collision-threat, Guard at `(7, 4)`, radius 1 (unchanged from round 1; confirming the capture is radius-caused):**
- This tier is *supposed* to be non-disjoint — the Guard can capture, that's the point (charter S1: "a live enemy can capture or block the student's runner"). The question orchestration asked is narrower: is the taught reference solution's success caused by the Guard's radius specifically, not by some incidental geometry the sensor is irrelevant to?
- The reference path (`if within2(enemy) {up} else {forward}`, target `(7,2)`) visits, in order: `(1,4)→(2,4)→(3,4)→(4,4)→(5,4)→(5,3)→(6,3)→(6,2)→(7,2)`. Manhattan distance to the Guard's post `(7,4)` at each of those cells: `6, 5, 4, 3, 2, 3, 2, 3, [win]` — **minimum distance encountered is 2**, strictly greater than the Guard's `guardRadius: 1`. The Guard is never triggered during the correct run (confirmed empirically too: the regenerated behavior evidence shows `GUIDED_GUARD | (7,4) -> (7,4) | STAY_STILL` on every turn of the reference run).
- The degenerate blind-forward program (`always move_forward`) walks straight through `(2,4), (3,4), ..., (7,4)` — landing exactly *on* the Guard's post, distance 0, deep inside the radius-1 trigger zone. The resulting capture (ally frozen, confirmed by both manual `simulateLevelXml` runs and the unit test) is therefore directly attributable to crossing the radius-1 boundary, not to any other board feature — there are no barriers, no other live runners near that path, and `runner_2_Npc2` stays frozen and far away at `(10,6)` the entire time.
- This confirms the taught WITHIN_2 sensor threshold (which the reference reacts to) sits with a full 1-cell safety margin outside the actual radius-1 danger zone — the sensor is doing real, radius-caused work, not decorative work.

## Files Changed

| File | Change |
| --- | --- |
| `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js` | Added `boardDynamicsTier: STATIC_PROP`. No setup/behavior change. |
| `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js` | Added `boardDynamicsTier: BACKGROUND_MOTION`; NPC1 frozen → `GUIDED_VERTICAL_PATROL` Sentry. **Repair:** relocated Sentry `(10,2)` → `(11,2)` off the flag's column. |
| `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js` | Added `boardDynamicsTier: COLLISION_THREAT`; NPC1 frozen → `GUIDED_GUARD` (post `(7,4)`, `guardRadius: 1`); win cell moved `(5,2)` → `(7,2)`. **Repair:** the stale "frozen" tip is deleted outright (3 tips remain), not replaced with new copy. |
| `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js` | Added `boardDynamicsTier: BACKGROUND_MOTION`; NPC1 frozen → `GUIDED_VERTICAL_PATROL` Sentry. |
| `src/core/setup.js` | `applyRunnerSetup()` now copies authored `guardPost`/`guardRadius` onto the runner (Plan 99's anticipated follow-up, consumed here). |
| `docs/subsystems/npc-and-cpu.md` | Updated Guard post/radius description and "Common traps" entry to reflect the new wiring; no longer states the override is unused. |
| `docs/packet-creation-guidance.md` | Added "Degenerate-Solution Test Standard (Charter S8)" section, per S8's "added when the first uplift packet lands." |
| `tests/unit/guided-reference-solutions.test.js` | Added two `enemy-nearby` tests: degenerate blind-forward solution fails/captured; taught reference still passes uncaptured. |

## Artifacts Produced

- `reports/development/guided-level-complexity-audit/level-dossiers/{13-bring-it-home,14-enemy-nearby,15-jump-the-gap}.md` (regenerated)
- `reports/development/guided-level-complexity-audit/behavior-evidence/{13-bring-it-home,14-enemy-nearby,15-jump-the-gap}.md` (regenerated)
- `reports/development/guided-level-complexity-audit/{summary-index.md,behavior-summary-index.md,par-candidates.json}` (regenerated as part of the full-bundle generator run)
- `12-move-toward-flag.md` dossier/evidence intentionally **unchanged** (zero diff) — confirms `move-toward-flag`'s protected status held.

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node scripts/dev/plan-status.js check plan-92-pre-challenge-15-living-board-pilot` | `RUNNABLE` |
| `npm run lint:levels` | Exit 0. No new errors. `move-toward-flag`, `bring-it-home`, `enemy-nearby`, `jump-the-gap` no longer appear in the `untiered` warning list; all other pre-existing warnings unchanged. |
| Tier-lint reject-path check (temporary bad tier) | Set `enemy-nearby`'s tier to `static-prop` (contradicts its live Guard) → lint emitted `error enemy-nearby board-dynamics-tier: tier "static-prop" contradicts setup: 1 live opponent runner(s) found`. Reverted; `git diff --stat` on the file confirmed a clean revert back to the intended edit. Both accept and reject paths verified on real (non-synthetic) level data, per the validation checklist's explicit ask. |
| `npm run level:readiness -- --level enemy-nearby` (and the other 3 pilot levels) | All: `reference-runtime: pass`, `reference-fixture-exists: pass`, `toolbox-reference-compatibility: pass`, `demo-blockly-does-not-solve: pass`. Only pre-existing, unrelated warnings present (`turn-limit-floor` on `jump-the-gap`, `win-condition-requires-named-mechanic` on `move-toward-flag`/`enemy-nearby`, both present before this packet). |
| `npm run level:dossiers` | Regenerated 46 dossiers; diff limited to the 3 behaviorally-changed levels. |
| `npm run level:behavior-evidence` | Regenerated 46 behavior-evidence files; diff limited to the same 3 levels. |
| `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js` | 6/6 pass, including the 2 new degenerate-solution tests. |
| `npm test` | 441/441 pass. |
| `npm run build` | Clean build; same pre-existing chunk-size and dynamic/static Blockly import warnings as the Plan 99 baseline, no new warnings. |

### Repair pass — re-run after Fixes 1-3

| Command | Result |
| --- | --- |
| Manual `simulateLevelXml` check on the repaired `bring-it-home` source | Sentry now at `(11,2)`; reference solution still `PASSED`, 21/28 turns, ally never frozen. |
| `npm run lint:levels` | Exit 0, no new errors; same warning set as round 1 plus no regressions. |
| Tier-lint reject-path re-check (temporary bad tier on `bring-it-home`, this time) | Set `bring-it-home`'s tier to `static-prop` → lint emitted `error bring-it-home board-dynamics-tier: tier "static-prop" contradicts setup: 1 live opponent runner(s) found`. Reverted; `git diff --stat` confirmed clean revert. |
| `npm test` | 441/441 pass. |
| `npm run level:dossiers` && `npm run level:behavior-evidence` | Regenerated; diff still limited to `13-bring-it-home`, `14-enemy-nearby`, `15-jump-the-gap` (dossier/evidence numbering, not level ids) — `12-move-toward-flag` still zero-diff. |
| `npm run build` | Clean, same pre-existing warnings, no new ones. |

## Validation Checklist (from the packet)

- [x] Plan 85 gate was accepted before mutation.
- [x] `move-toward-flag` protected status was preserved (zero behavior/evidence diff).
- [x] `enemy-nearby` old trivial solution fails and new reference solution passes (unit tests + manual `simulateLevelXml` verification).
- [x] Tier-lint real-data check: accepts correct tiers, rejects a deliberately-wrong one (verified and reverted — re-verified again in the repair pass on `bring-it-home`).
- [x] Touched levels still teach one primary concept each (no new blocks, relations, or objects introduced; `enemy-nearby`'s toolbox and taught relations unchanged).
- [x] Demo Blockly remains structural and non-spoiling (`demo-blockly-does-not-solve` lint check: pass, all 4 levels).
- [x] Dossiers/evidence reflect the new board behavior.
- [x] Subsystem notes still read true (`npc-and-cpu.md` Guard section and "Common traps" updated to match the new `setup.js` wiring).
- [x] Every `background-motion`/`collision-threat` tier claim is backed by a spatial reachability argument, not just a reference-run simulation (see "Spatial Reachability Arguments").
- [x] `enemy-nearby` ships with 3 tips (no Guard-aware replacement copy authored).
- [x] No unrelated files touched (Plan 80/84 working-tree changes left alone — see below).
- [x] Progress report includes remaining pilot risks (below).

## Problems Encountered And How Resolved

1. **`normalizeLegacyLevelSetup` gotcha in my own test scripts:** early experiments patched `level.setupOverrides` on a cloned level object and got confusing results (a "frozen" test variant behaved like a live Guard). Root cause: `getLevelDefinitions()` already runs `normalizeLegacyLevelSetup()` and stores the result in `level.setup`; `applyLevelToState()` reads only `level.setup`, never `level.setupOverrides`, on an already-normalized level object. Fixed by patching `level.setup.teams.opponent.runners[...]` directly in test variants. This was a test-harness bug, not a product bug, but worth noting since it's an easy trap for future simulation-based level experiments.
2. **Guard radius tuned to match the taught relation (2) caused a runaway pursuit-lock** at the top-row edge — deterministic (no randomness, so it doesn't violate the "no unrecoverable randomness" stop condition literally), but pedagogically bad: a live enemy that can pin a beginner program against a wall for the rest of the turn budget is not "understandable by observation," it's punishing. Resolved by choosing `guardRadius: 1`, strictly below the correct path's minimum approach distance (2), so the Guard never engages during correct play at all — it is a real, capturing hazard for careless play, not a chase mechanic. This is a deliberately conservative choice for a pre-Challenge-15 rehearsal level; Challenge 15 itself (`dodge-and-deliver`, out of scope for this pilot) is where real dodge/chase pressure belongs.
3. **Map-side collision rule initially worked against the design intent:** the original Guard post `(5,4)` sat on the *player's* home half, so a collision there would have frozen the Guard instead of the ally. Moving the post to `(7,4)` (opponent's home half) was necessary for a captured-ally outcome to be possible at all, not just a style choice.
4. **(Repair) `bring-it-home`'s Sentry shared a cell with the flag itself.** The round-1 verification method (run the reference fixture, check the event log for captures) proved the reference's specific timing was safe but could not prove the tier claim ("cannot interfere") for all valid solutions — and in fact the claim was false, since the Sentry's column (10) was the flag's own column, a cell every valid completion must occupy. Resolved by relocating the Sentry to column 11 and replacing the simulation-only justification with the spatial reachability argument above, which holds regardless of turn timing.
5. **(Repair) Round-1 "copy fix" for `enemy-nearby` overstepped scope.** I replaced the stale tip with new Guard-aware copy, reasoning that a false claim was a pedagogy risk worth a minimal correction. Orchestration's owner decision was narrower: delete the false tip, author nothing new — copy authorship belongs to Plans 94/95 regardless of the old tip's accuracy. Deletion doesn't require new judgment calls about tone/voice, which is exactly why it's the safer default for an implementer packet to reach for. Applied as directed.

## Remaining Risks Or Follow-Ups

- **`enemy-nearby`'s win cell moved.** Any external document, screenshot, or lesson plan referencing the old `(5,2)` target cell is now stale. I did not find any such references in `docs/` beyond the concept matrix (which describes the concept, not the coordinate, and needed no change).
- **`guardRadius: 1` is intentionally conservative.** It proves the Guard is a real hazard for a blind/naive program, but the taught reference solution never actually has to react to a *moving* Guard — the Guard only ever leaves its post when a program strays into radius 1. If a future reviewer wants the pilot to demonstrate live in-flight avoidance (not just static-hazard avoidance) for `enemy-nearby` specifically, that is a further uplift beyond this packet's scope and should be its own follow-up, not an unannounced expansion of Plan 92.
- **`enemy-nearby` now has 3 tips instead of 4, and says nothing about the Guard.** This staleness is intentional per the owner's S5-sequencing decision (Fix 3) and should resolve automatically when Plan 95 authors Guard-aware mission copy for this phase — flagging so it isn't mistaken for an oversight in the meantime.
- **Unrelated uncommitted changes already present in the working tree** (Plan 80/84 cohort-usage-privacy work — modified `.gitignore`, `package.json`, `docs/development/README.md`, `docs/development/plan-80-*.md`, `docs/development/plan-84-*.md`, `docs/subsystems/usage-and-admin.md`, plus untracked `docs/CohortUsageAnalysis.md`, `src/usage/cohortPrivacyPaths.js`, `tests/unit/usage-cohort-privacy-paths.test.js`, and two `reports/development/plan-80.../plan-84...` directories) were present in the working tree before this session and are **not** part of this packet's changes. Still untouched after the repair pass. Flagging again so the orchestrator doesn't attribute them to Plan 92 or lose track of them.
- **The `EXTENDED_MOVEMENT_BLOCKS` manual-detour edge case (Level 12).** The spatial argument for `bring-it-home` assumes a solution that actually completes the level (reaches the flag and scores) rather than an arbitrarily wasteful one that manually wanders past `x=10` using raw movement blocks before eventually finishing. A truly adversarial/wasteful manual program could in principle visit almost any cell within the 28-turn budget. I judged this out of scope for "routes the ally could plausibly need" (the fix instruction's own framing), consistent with how `jump-the-gap`'s argument treats the turn budget as a hard bound rather than assuming maximal adversarial wandering. Flagging the assumption explicitly in case the owner wants a stricter (turn-budget-bounded, not intent-bounded) standard applied campaign-wide later.

## Ready For Orchestrator Review: Yes (implementation + repair complete; status intentionally left for orchestration to mark, per repair instructions)
