# Plan 99 Progress Report: Board Dynamics And Bestiary Core

- Packet: Plan 99
- Date: 2026-07-07
- Implementer: Claude Sonnet 5

## Summary

Built both infrastructure pieces the Plan 92 living-board pilot needs: the `boardDynamicsTier` level-metadata field with an enum + a `lint:levels` cross-check rule (charter S1), and the `GUIDED_GUARD` NPC archetype (charter S2 / Appendix A). No guided level content was changed — confirmed via `git diff src/config/levels/` returning zero lines.

## Findings Before Editing

- `boardDynamicsTier` needs no special normalization: `getLevelDefinitions()` in `src/config/levels/index.js` spreads `...level` into every level object, so a plain top-level field on a level's exported object flows through automatically to lint, readiness, and runtime code.
- `level.setup.teams.<role>.runners[]` (post-`normalizeLegacyLevelSetup`, role `"opponent"` = team 2) is where `cpuBehavior`, `isFrozen`, and `frozenTurnsRemaining` live per authored opponent runner — this is what the tier lint reads to prove or contradict an authored tier.
- Lint rule functions live in `src/dev/levelLintCore.js`, not `scripts/lint-levels.js` (which only re-exports); `runLevelLint()` there is the aggregator array every rule must be added to.
- The Guard's default "post" needs no new runner field: `applyRunnerSetup()` in `src/core/setup.js` already captures `runner.initialGridX`/`initialGridY` at spawn for every runner, unconditionally.
- `calculateMoveTowardsTarget` (`src/ai/npc/pathing.js`) already returns `STAY_STILL` when both the preferred and fallback single-step moves are blocked — the "boxed-in Guard" edge case required no extra guard code, just reuse.
- `checkForFlagPickup`-style reuse pattern and `a.id.localeCompare(b.id)` tie-break convention already appear elsewhere in the codebase (`getClosestEnemyTarget` in `src/core/movement.js`, `getNearestUnfrozenEnemy` in `freePlayCpu.js`), so the Guard's tie-break follows an established local convention rather than inventing a new one.

## Implementation

### 1. `boardDynamicsTier` metadata (charter S1)

- `src/config/constants.js`: added `BOARD_DYNAMICS_TIERS` enum with the five charter values (`static-prop`, `background-motion`, `timing-threat`, `collision-threat`, `scrimmage-threat`).
- No level file was edited to set the field — per the packet's non-goal, tiering the 46 levels is Plan 92's job. The field is purely optional infrastructure in this packet.

### 2. Tier lint cross-check (charter S1)

- `src/dev/levelLintCore.js`: added `checkBoardDynamicsTierAgreement(levels)`, wired into `runLevelLint()`.
- Single contract id `board-dynamics-tier` for all diagnostics from this rule (matching the existing repo convention of one contract name per check-family, e.g. `flag-setup-game-spec-compliance` covers several distinct message variants).
- Rules implemented exactly as specified:
  - Absent tier → **warning**, message prefixed `untiered:`.
  - Tier present but not one of the five enum values → **error**.
  - `static-prop` with ≥1 live opponent → **error**.
  - Any non-`static-prop` tier with 0 live opponents → **error** (this single check also covers the "no opponent runners at all" edge case for free, since `.filter().length === 0` is vacuously true for an empty opponent array).
  - `scrimmage-threat` with fewer than 2 live opponents → **error**.
- A runner spec counts as "static" only when `isFrozen` is truthy or `cpuBehavior === GUIDED_STAY_STILL`. Everything else (including a runner with no `cpuBehavior` at all, which falls back to a moving guided teaching NPC) counts as live. This proves contradictions purely from setup facts — it does not attempt reachability/interference analysis, per the packet's explicit "do not over-reach" constraint. Verified this accepts a harmless-lane Sentry (`GUIDED_VERTICAL_PATROL`) as `background-motion` cleanly (test: "board dynamics tier accepts a harmless-lane Sentry...").
- Ran `npm run lint:levels` against the real 46-level campaign: all 46 levels now emit the new `untiered` warning (none are tiered yet, as intended), exit code remains 0 (warnings only, zero new errors).

### 3. `GUIDED_GUARD` archetype (charter S2 / Appendix A)

- `src/config/constants.js`: added `GUIDED_GUARD` to `NPC_BEHAVIORS` (additive only — confirmed via `git diff` that no existing key was renamed or removed) and `GUIDED_GUARD_DEFAULT_RADIUS = 3`.
- `src/ai/npc/freePlayCpu.js`: added `getGuidedGuardAction(runner, state)` plus small helpers (`getGuardPost`, `getGuardRadius`, `getNearestPlayerRunnerWithinRadius`), and a dispatch case in `calculateFreePlayCpuAction()` immediately after `GUIDED_VERTICAL_PATROL`, before the `FREE_PLAY_TACTICAL_*` cases.
- Behavior: each turn, find the nearest runner on a different team within Manhattan radius K (default 3). If found, step toward it via `calculateMoveTowardsTarget`. If none found and the Guard isn't on its post, step toward the post the same way. If on post with nothing in range, `STAY_STILL`.
- **Tie-break rule (chosen, per packet request to record it):** when multiple targets are equidistant, the lowest runner id wins (`localeCompare` ascending), matching the existing convention in `getClosestEnemyTarget`/`getNearestUnfrozenEnemy`.
- **Default K (chosen, per packet request to record it):** Manhattan 3, matching the charter's Appendix A default exactly.
- Capture/collision is untouched — the Guard function only ever returns a move decision; the existing turn-engine collision resolution (`src/core/collisions.js`) decides what happens if the Guard's move lands it on another runner.
- Frozen-Guard handling required no code: `processTurnActions()` already intercepts frozen runners via `handleFrozenRunnerTurn()` before any `cpuBehavior` function is ever called, for every behavior, not just the Guard.
- Manually verified all four required behaviors with an ad hoc script before writing formal tests (in-range chase, off-post return, on-post idle, unambiguous-direction tie-break) — see "Commands Run" below for the same coverage as formal tests.

**Config-shape decision — `guardPost`/`guardRadius` override, not wired to `setup.js`:** the packet's required behavior says "optionally allow a per-runner `guardPost: {x, y}` override" and "optionally overridable per runner (e.g. `guardRadius`)." The Guard's decision function reads `runner.guardPost`/`runner.guardRadius` directly off the runner object if present, falling back to the spawn cell and K=3. However, `src/core/setup.js`'s `applyRunnerSetup()` was **not** extended to copy an authored `runnerSpec.guardPost`/`guardRadius` onto the runner — no level in this packet's scope (there are none; Plan 92 hasn't landed yet) needs a non-default post or radius, and `setup.js` was not in the packet's "Files And Areas Likely Touched" list. The override mechanism exists and is exercised only by directly setting `runner.guardPost`/`guardRadius` on a runner object (the same pattern already used throughout `free-play-contracts.test.js` for other CPU-behavior fields), not through authored level config. Documented explicitly in `docs/subsystems/npc-and-cpu.md` (both in the Guard's own description and as a new "Common traps" entry) so this isn't mistaken for a working authored field later. If Plan 92 or a later packet needs the override, wiring `runnerSpec.guardPost`/`guardRadius` through `setup.js` is a small, isolated follow-up.

### 4. Bestiary mapping doc (charter S2)

- `docs/subsystems/npc-and-cpu.md`: added a full `GUIDED_GUARD` behavior description (post, radius, determinism, pathing reuse, capture ownership, frozen handling, Free-Play-UI exclusion) plus the required bestiary-name → behavior-constant → status table (Dummy/Sentry/Wanderer/Guard implemented; Charger/Raider/Shadow deferred, explicitly marked as having no constant yet). Added two new "Common traps" entries covering the deferred-archetype and unwired-override gotchas. Updated the surface-map row for `freePlayCpu.js` to list `GUIDED_GUARD`.

### 5. Tests

- `tests/unit/free-play-contracts.test.js`: 4 new tests — in-range chase (distance strictly decreases), off-post return-to-post (distance to post strictly decreases), on-post idle (`STAY_STILL`), and deterministic tie-break (two equidistant, opposite-direction targets; asserts the resolved move goes toward the lower-id runner specifically, not just "some" move).
- `tests/unit/level-lint.test.js`: 6 new tests — `static-prop` + live opponent → error; three all-static variants (frozen / `GUIDED_STAY_STILL` / zero opponents) → error each; `scrimmage-threat` with one live opponent → error; three clean pairings (harmless-lane Sentry as `background-motion`, all-frozen `static-prop`, two-live `scrimmage-threat`) → no diagnostics; absent tier → warning; invalid tier string → error.

## Files Changed

| File | Change |
| --- | --- |
| `src/config/constants.js` | Added `GUIDED_GUARD` to `NPC_BEHAVIORS`, `GUIDED_GUARD_DEFAULT_RADIUS`, `BOARD_DYNAMICS_TIERS` enum. Purely additive. |
| `src/dev/levelLintCore.js` | Added `checkBoardDynamicsTierAgreement()` and `isOpponentRunnerSpecStatic()`; wired into `runLevelLint()`. |
| `src/ai/npc/freePlayCpu.js` | Added `getGuardPost`, `getGuardRadius`, `getNearestPlayerRunnerWithinRadius`, `getGuidedGuardAction`; added `GUIDED_GUARD` dispatch case. |
| `docs/subsystems/npc-and-cpu.md` | Added Guard behavior description, bestiary mapping table, surface-map row, two "Common traps" entries. |
| `tests/unit/free-play-contracts.test.js` | 4 new Guard tests. |
| `tests/unit/level-lint.test.js` | 6 new tier lint tests + `createLevelWithOpponents` helper. |
| `reports/development/plan-99-board-dynamics-bestiary-core/progress.md` | This report. |

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/level-lint.test.js` | 65/65 pass |
| `npm run lint:levels` | Exit code 0; 46 new `untiered` warnings (one per campaign level, expected), zero new errors |
| `npm test` | 432/432 pass |
| `npm run build` | Pass; same pre-existing chunk-size and dynamic/static Blockly import warnings as prior baseline, no new warnings |

## Approval Gates Honored

- No `NPC_BEHAVIORS` constant was renamed — confirmed via `git diff src/config/constants.js` showing a purely additive diff.
- No archetype beyond Guard was implemented — Charger, Raider, Shadow have no constant, dispatch case, or file in `src/ai/npc/`.
- No guided level content, fixture, reference-solution, or copy was touched — confirmed via `git diff --stat src/config/levels/` returning zero changed lines.
- No `boardDynamicsTier` was forced onto any level; all 46 remain untiered (warning, not error).
- No capture/collision logic was added to the Guard — it returns a move decision only; `src/core/collisions.js` is untouched.
- No dependency, server behavior, or one-action-per-turn/collision/scoring/Blockly semantic change.

## Remaining Risks Or Follow-Ups

- The Guard's `guardPost`/`guardRadius` per-runner override is implemented in the decision function but not wired through `src/core/setup.js` from authored level config (see the config-shape decision above). Plan 92 or a later packet will need this small follow-up only if a level actually requires a non-default post or radius.
- The tier lint's `static-prop` classification for a runner treats an *absent* `cpuBehavior` as live (since it falls back to a moving guided teaching NPC by default). If a future level intends a genuinely stationary but non-`isFrozen`, non-`GUIDED_STAY_STILL` opponent, the lint will correctly flag it as contradicting `static-prop` — this is intended behavior per the packet, not a bug, but worth remembering when Plan 92 starts tiering real levels.
- As noted in the packet itself, the tier lint proves contradictions from setup facts only; it does not and cannot verify whether a live enemy can actually reach or interfere with the student (a Sentry patrolling a harmless lane legitimately passes `background-motion`). This is by design per the packet's explicit "do not over-reach" constraint, not a gap to close later.

## Ready For Integration

Yes.
