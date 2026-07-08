# Plan 101 Progress Report: Charger Archetype (Bestiary Core II)

- Packet: Plan 101
- Date: 2026-07-08
- Implementer: Claude Sonnet 5
- Status: implementation complete, awaiting orchestration review (status field left for orchestrator)

## Summary

Built the Charger, the second bestiary archetype (charter S2 / Appendix A): a deterministic guided NPC that stands idle until a player-team runner shares its row or column, then commits to a straight-line charge down that line until a wall, barrier, or board edge stops it. Added `GUIDED_CHARGER` to `NPC_BEHAVIORS` (additive), a `getGuidedChargerAction` implementation in `src/ai/npc/freePlayCpu.js`, optional per-runner `chargeRange` wiring through `src/core/setup.js` (extending the Plan 92 `guardPost`/`guardRadius` block), and `chargeDirection` runner-state reset in `src/entities/Runner.js`. No guided level content changed — this is pure infrastructure for Plan 93. `npm test` (463/463), `npm run lint:levels`, and `npm run build` all pass.

## Prerequisite Gate Check (before mutation)

- Plan 99 (bestiary dispatch pattern, Guard/Sentry reference implementations): status `complete`.
- Plan 92 (`guardPost`/`guardRadius` wiring precedent in `setup.js`): status `complete`.
- `node scripts/dev/plan-status.js check plan-101-charger-archetype` → `RUNNABLE`.

## Design Decisions (Work Plan step 1 — summarized before editing)

### Charge-state shape

Mirrored `guidedVerticalPatrolDirection` exactly: a single field on the runner instance, `runner.chargeDirection`, either `null` (idle/stopped) or a unit vector `{ dx, dy }` with exactly one axis nonzero. I considered separate `axis`/`direction` scalar fields (closer to how the packet phrases "direction/committed flag") but a `{dx, dy}` vector is simpler to consume — it's already the exact shape `calculateMoveTowardsTarget` returns as `{ actionType: "MOVE", dx, dy }`, so the Charger's charge step is just `{ actionType: "MOVE", dx: chargeDirection.dx, dy: chargeDirection.dy }` with no translation step, and "is committed" is just "is non-null," a natural single-field boolean-ish check matching the existing `guidedVerticalPatrolDirection === null` idiom.

**Action decision shape:** the Charger returns the generic `{ actionType: "MOVE", dx, dy }` form (verified via `translateActionDecision` in `src/core/movement.js`, which already special-cases `decision.dx`/`decision.dy` as an absolute delta regardless of `actionType` string) rather than symbolic `MOVE_FORWARD`/`MOVE_UP_SCREEN` constants. This is deliberate: the committed direction is an absolute board direction fixed at trigger time, not relative to `playDirection`, so reusing the same generic delta shape `calculateMoveTowardsTarget` already produces (without calling that function, per the non-goal) avoids a home-grown direction-to-symbolic-action mapping the codebase doesn't otherwise have.

### Tie-break rule

Per the packet's explicit spec: row alignment beats column alignment unconditionally (checked first, regardless of distance), then nearer-along-the-line wins within the same axis, then ascending runner id (`localeCompare`) as the final tiebreak — matching the `getClosestEnemyTarget`/Guard tie-break convention already established in this codebase. Implemented as a single `Array.prototype.sort` comparator in `findChargeTrigger` rather than nested conditionals, for auditability.

### `chargeRange` default

Left unbounded (any same-row/column alignment triggers, at any distance) when absent, per the packet's own instruction to prefer this over guessing at a bounded default: "if unbounded triggering proves chaotic in the Charger's own unit tests, note it... rather than changing the default here." It did not prove chaotic — the behavior function is a synchronous, single-call decision (no internal loop, no state beyond the one committed-direction field), so "unbounded" just means "the trigger scan doesn't filter by distance," which is neither slower nor less predictable than the bounded case. No `GUIDED_CHARGER_DEFAULT_RANGE` constant was added (unlike `GUIDED_GUARD_DEFAULT_RADIUS`), since there is no sensible default *number* for "unbounded" — the default is the absence of a bound, not a large numeric placeholder.

### Frozen-mid-charge

No special-case code. The general turn-engine rule already routes frozen runners through `handleFrozenRunnerTurn()` before any `cpuBehavior` function is called (confirmed this is the same mechanism that already made the Guard's frozen handling free in Plan 99). Since `chargeDirection` is state on the runner instance and nothing touches it during a frozen turn, a charge in progress simply pauses and resumes the identical committed direction on thaw. This is the "resumes coherently" choice, not "clears" — deliberately, because clearing would mean a frozen Charger effectively becomes harmless (any freeze cancels its lane), which would make Area Freeze an unconditional counter to a Charger regardless of position, undermining the archetype's own legibility (a student watching should be able to predict the charge continues once the freeze wears off, not wonder whether it silently reset).

## Implementation

### 1. `GUIDED_CHARGER` behavior

- `src/config/constants.js`: added `GUIDED_CHARGER: "GUIDED_CHARGER"` to `NPC_BEHAVIORS`, additive only (confirmed via reading the diff — no existing key touched).
- `src/ai/npc/freePlayCpu.js`: added `getChargeRange`, `findChargeTrigger`, `getChargeDirectionToward`, and `getGuidedChargerAction`, plus the dispatch case `if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_CHARGER) { return getGuidedChargerAction(runner, state); }` immediately after the `GUIDED_GUARD` case, before the `FREE_PLAY_TACTICAL_*` cases — same insertion point precedent Plan 99 used for the Guard.
- Idle → `STAY_STILL`, no state. Trigger → commit `chargeDirection`, step once. Committed → keep stepping in `chargeDirection` regardless of new state, ignoring re-triggers entirely (checked in code: trigger detection is skipped whenever `chargeDirection` is already non-null). Blocked (`isCellBlockedForRunner` on the next cell in the committed direction) → clear `chargeDirection`, `STAY_STILL` that same turn without attempting the blocked step (no bounce animation, no throw).
- Degenerate case handled defensively: if a triggering runner occupies the Charger's own cell (`dx === 0 && dy === 0` after direction resolution), the Charger stays idle rather than committing to a no-op direction — noted in code as an edge case that shouldn't occur in normal play but must not crash if it does.

### 2. Optional `chargeRange`

- `src/core/setup.js`: extended the existing `applyRunnerSetup` block that already copies `guardPost`/`guardRadius` with `if (Number.isFinite(runnerSpec.chargeRange)) { runner.chargeRange = runnerSpec.chargeRange; }` — three lines, same pattern, same block, no new function.
- Not authored on any level (no guided level content touched, per scope). Exercised only via unit tests setting `runner.chargeRange` directly on the runner instance, the same testing pattern already used for `guardRadius` in the Guard tests.

### 3. Runner-state reset (found during implementation, not pre-listed in "Files And Areas Likely Touched")

`src/entities/Runner.js`'s `guidedVerticalPatrolDirection` is explicitly reset to `null` in both the constructor and `resetToInitial()` (the latter is called on every round reset, not just initial construction). Charge state needs the identical treatment — without it, a mid-charge Charger would carry a stale `chargeDirection` across a round reset (after a score, when all runners snap back to their spawn positions), potentially charging in a direction that no longer means anything relative to the reset board. Added `this.chargeDirection = null;` at both of the same two call sites `guidedVerticalPatrolDirection` already uses. This file wasn't in the packet's own "Files And Areas Likely Touched" list, but the packet's Required Reading pointed at `guidedVerticalPatrolDirection` as the state-storage precedent, and that precedent includes this reset — omitting it would have been an inconsistency between the two "runner-local direction state" mechanisms the docs describe as parallel.

### 4. Bestiary doc update

`docs/subsystems/npc-and-cpu.md`:
- Added `GUIDED_CHARGER` to the `freePlayCpu.js` surface-map row.
- Added a full `GUIDED_CHARGER` behavior section (idle → trigger/commit → charge → stop → optional `chargeRange` → pathing-helper note → capture ownership → frozen handling → reset wiring), mirroring the existing Guard section's structure and level of detail.
- Flipped the bestiary mapping table row: Charger → `GUIDED_CHARGER`, Implemented (Plan 101). Raider and Shadow remain the only "—, deferred" rows.
- Corrected the now-stale "Only Dummy, Sentry, Wanderer, and Guard have behavior constants" trap line to include Charger.
- Added three new "Common traps" entries specific to the Charger: no mid-charge re-targeting, no return-to-post on stop, unbounded `chargeRange` default.

### 5. Tests

Added 10 tests to `tests/unit/free-play-contracts.test.js`, inserted directly after the existing Guard tests (same `buildMatch()`/`translateActionDecision` pattern):
- Idle: no aligned player → `STAY_STILL`, `chargeDirection` stays `null`.
- Trigger + charge: player enters the row → committed direction fixed correctly, first move matches.
- Commit: after triggering, the player steps off the line entirely → the Charger keeps charging in the same committed direction (verified across two sequential `calculateFreePlayCpuAction` calls with the runner position manually advanced between them, since the behavior function only returns a decision — it doesn't move the runner itself).
- Stop (barrier): a charge in progress hits a barrier placed in its path → `STAY_STILL`, `chargeDirection` cleared, no throw.
- Stop (edge): a charge pointed off the board's top edge → `STAY_STILL`, `chargeDirection` cleared — covers the "board edge" case distinctly from the "barrier" case, since `isCellBlockedForRunner` treats them as different code paths internally (bounds check vs. cell-type/barrier check) even though the Charger's own logic doesn't distinguish them.
- Tie-break (row vs. column): a nearer column-aligned runner loses to a farther row-aligned one.
- Tie-break (same axis): the nearer of two row-aligned runners wins regardless of id order (only falls back to id when distances tie, which the packet's own spec implies but a direct test wasn't explicitly required — added for completeness since the sort comparator has three tiers and only two were otherwise exercised).
- `chargeRange`: an aligned player one cell outside the configured range doesn't trigger; the same player one cell closer does.

## Files Changed

| File | Change |
| --- | --- |
| `src/config/constants.js` | Added `GUIDED_CHARGER` to `NPC_BEHAVIORS`. Purely additive. |
| `src/ai/npc/freePlayCpu.js` | Added `getChargeRange`, `findChargeTrigger`, `getChargeDirectionToward`, `getGuidedChargerAction`; added the `GUIDED_CHARGER` dispatch case. |
| `src/core/setup.js` | `applyRunnerSetup()` now also copies an authored `chargeRange` onto the runner, in the same block as `guardPost`/`guardRadius`. |
| `src/entities/Runner.js` | Added `chargeDirection = null` to the constructor and `resetToInitial()`, mirroring `guidedVerticalPatrolDirection`. |
| `docs/subsystems/npc-and-cpu.md` | Added the `GUIDED_CHARGER` behavior section, flipped its bestiary-table row to implemented, updated the surface-map row and three "Common traps" entries. |
| `tests/unit/free-play-contracts.test.js` | 10 new Charger tests. |
| `reports/development/plan-101-charger-archetype/progress.md` | This report. |

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node scripts/dev/plan-status.js check plan-101-charger-archetype` | `RUNNABLE` |
| `node --test --test-isolation=none tests/unit/free-play-contracts.test.js` | 37/37 pass (10 new). |
| `npm run lint:levels` | Exit 0. Same warning set as before this packet — no new diagnostics, since no level authors `cpuBehavior: GUIDED_CHARGER` or `chargeRange` yet, and this packet does not touch the tier lint (out of scope per the packet). |
| `npm test` | 463/463 pass. |
| `npm run build` | Clean; same pre-existing chunk-size warnings, no new ones. |

## Approval Gates Honored

- No existing `NPC_BEHAVIORS` constant renamed — `GUIDED_CHARGER` is additive only.
- No archetype beyond Charger implemented — Raider and Shadow have no constant, dispatch case, or file.
- No guided level content, fixture, reference-solution, or copy touched by this packet (the working tree also carries uncommitted `level-13-enemy-nearby.js`/`levelLintCore.js`/etc. changes, but those are Plan 100's, already reported in `reports/development/plan-100-dynamic-mechanic-necessity-lint/progress.md` — not part of this packet).
- No capture/collision logic added — the Charger returns a move decision only; `src/core/collisions.js` is untouched.
- `boardDynamicsTier` and the tier lint rule (`checkBoardDynamicsTierAgreement`) untouched, per the packet's explicit non-goal.
- No dependency, server behavior, or one-action-per-turn/collision/scoring/Blockly semantic change.

## Validation Checklist (from the packet)

- [x] `GUIDED_CHARGER` added additively; no existing `NPC_BEHAVIORS` constant renamed.
- [x] Charger idles until a player shares its row/column, then charges straight down the committed line, stops at wall/barrier/edge, and `STAY_STILL`s when blocked (no throw) — covered by 5 of the 10 new tests.
- [x] Charge direction is fixed at trigger; commit-to-line verified (charges on even after the runner leaves the line).
- [x] Deterministic with a documented tie-break (row-then-column-then-distance-then-id); no randomness.
- [x] Charger emits a move decision only; no capture logic added.
- [x] Optional `chargeRange` wired through `setup.js`, opt-in, sensible (unbounded) default documented and justified above.
- [x] `docs/subsystems/npc-and-cpu.md` marks Charger implemented; Raider/Shadow still deferred.
- [x] No guided level content, fixture, or copy changed by this packet.
- [x] `npm test`, `npm run lint:levels`, `npm run build` pass.
- [x] Progress report records charge-state shape, tie-break, `chargeRange` default, and frozen-mid-charge behavior (all above).

## Problems Encountered And How Resolved

None requiring a design deviation or a stop condition. The one thing worth flagging as a scope judgment call: extending `src/entities/Runner.js`'s reset logic (see "Runner-state reset" above) wasn't in the packet's pre-listed file set. I judged it necessary because leaving it out would have created exactly the kind of silent, hard-to-reproduce bug (a charge direction surviving a round reset) that the packet's own "no new halt paths / no throw" spirit is trying to avoid, and the fix is a two-line, precedent-following addition rather than new design.

## Remaining Risks Or Follow-Ups

- **No level authors `GUIDED_CHARGER` or `chargeRange` yet.** This packet is infrastructure only; Plan 93 is the real-data exercise. Recommend Plan 93 add `plan-101` to its own `depends_on`, as this packet's own text already suggests.
- **`chargeRange`'s "along-line" distance is currently just the Manhattan distance restricted to the shared axis** (i.e., `|Δx|` for a row match, `|Δy|` for a column match) — this is the natural reading of "Manhattan (or along-line) cells" from the packet, and the two are identical whenever the alignment is exact (which it always is, by definition of "on the same row/column"). Flagging only because the packet phrased it as an either/or ("Manhattan (or along-line)"), implying the two might have needed to differ; they don't, given the trigger condition already requires exact row/column alignment.
- **Unrelated uncommitted changes from the prior packet (Plan 100) remain in the working tree** (`level-13-enemy-nearby.js`, `levelLintCore.js`, `levelReadiness.js`, `guided-reference-solutions.test.js`, `level-lint.test.js`, plus fixture/doc files) — these are Plan 100's, not Plan 101's, and are already covered by that packet's own progress report. Not touched further by this session.

## Ready For Orchestrator Review: Yes
