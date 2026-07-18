---
id: plan-78
title: "Frozen Input And Flag-Home Reconciliation"
status: complete
depends_on: []
gate: "before changing collision winner/loser priority, scoring prerequisites, flag reset location, guided level design, or broad turn-engine semantics"
superseded_by: null
resolution: "Orchestrator-verified 2026-07-07: confirmed the throw was removed and replaced with a stay-in-place + console.warn fallback; new movement-and-collisions test asserts no-throw, occupant unchanged, and diagnostic fired; ran that suite (19/19). All three original bugs fixed (frozen-input engine halt, animation-start guard across every call site incl. failed-jump, flag-home occupancy reconciliation). Zero new engine-halt paths remain."
summary: >-
  Repair student-reported runtime bugs: frozen human input halting the turn engine, collision outcomes leaving same-team runners on their own at-base flag, and reset flags failing to promote waiting opposing runners to carriers.
---
# Plan 78: Frozen Input And Flag-Home Reconciliation

- Packet id: Plan 78
- Packet title: Frozen Input And Flag-Home Reconciliation
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent
- Date: 2026-05-22
- Packet type: implementation / rules correctness / testing / docs
- Mutation level: source-code / tests / docs
- Approval gate: before changing collision winner/loser priority, scoring prerequisites, flag reset location, guided level design, or broad turn-engine semantics
- Expected artifacts:
  - frozen-human input halt repair
  - animation-start failure guard repair
  - flag-home occupancy reconciliation after collision flag reset
  - immediate pickup reconciliation when a reset flag lands under an opposing runner
  - focused unit tests for all three reported bugs
  - `docs/subsystems/turn-engine.md` update if runtime behavior wording changes
  - progress report
- Progress report folder: `reports/development/plan-78-frozen-input-and-flag-home-reconciliation/`
- Progress report file: `reports/development/plan-78-frozen-input-and-flag-home-reconciliation/progress.md`

## Packet Summary

Goal: Repair three student-reported runtime bugs around frozen human turns, collision placement on a home-flag cell, and flag reset/pickup reconciliation.

Non-goals:
- Do not change guided level layouts, reference fixtures, or challenge tuning.
- Do not change collision winner priority rules.
- Do not change the own-flag-home scoring rule.
- Do not make frozen runners absent from the board.
- Do not add new UI.
- Do not change Area Freeze behavior beyond preventing frozen-human input from halting the turn engine.
- Do not introduce randomness into collision or flag-home reconciliation.

Depends on:
- Plan 46 collision rule: flag carriers are always vulnerable.
- Plan 67 own-flag-home scoring rule.
- Plan 72/turn-engine docs: Free Play no-score round reset is unrelated and must remain unchanged.
- Current `docs/subsystems/turn-engine.md` contract.

Blocks:
- Any further guided/Free Play collision balance work.
- Classroom use where students can intentionally create flag-home blocker states.

Why this packet exists:
A pilot student surfaced a repeatable class of game-halt and unwinnable-board states. The app needs to preserve classroom reliability and rule legibility: frozen runners should skip turns cleanly, collision outcomes should not create illegal permanent blockers on home flags, and flags that reset onto a waiting opponent should be picked up immediately rather than requiring a confusing move-away-and-return workaround.

## Investigation Summary

### Bug 1: Frozen Human Input Halt

Observed symptom:
- A human runner gets frozen, the student presses a movement key while the frozen runner is active, and the game can halt.

Likely root cause:
- `src/core/turnEngine.js` `handlePlayerInput()` does not guard on `runner.isFrozen`.
- A frozen human can queue a movement action while `currentTurnState === AWAITING_INPUT`.
- `executeQueuedAction()` can set `currentTurnState = ANIMATING` after calling `startMoveAnimation()` or `startJumpAnimation()` even when those methods returned `false` because the runner is frozen.
- `processTurnActions()` only completes animation turns when `runner.isMoving || runner.isJumping || runner.isBouncing`; all are false, so `handleActionCompletion()` is never called.

### Bug 2: Collision Winner Can Occupy Own At-Base Flag Cell

Observed symptom:
- A human defender waits next to their own flag.
- An enemy runner picks up that flag.
- The human collides with the enemy carrier while the carrier is on or near the flag's reset cell.
- The carrier loses, the flag resets to its home cell, and the human winner can be snapped onto the same home-flag cell.
- Future enemies cannot enter that cell because normal no-carrier collisions on the defender's home side favor the home-side runner.

Likely root cause:
- `src/core/collisions.js` resets the lost carrier's flag to its initial position.
- `src/core/turnEngine.js` then snaps the collision winner to the collision cell.
- There is no post-collision reconciliation step that enforces the existing movement invariant: a team should not occupy its own loose at-base flag cell.

### Bug 3: Reset Flag Lands Under Opponent Without Pickup

Observed symptom:
- Runner B waits on the enemy flag's reset cell while Runner A carries that enemy flag.
- Runner A loses a collision; the flag resets onto Runner B.
- Runner B is not immediately promoted to flag carrier and may have to move away and back.

Likely root cause:
- `checkForFlagPickup()` is only called for the runner whose turn just completed.
- A flag reset is a flag-position change that can create a new pickup opportunity for a stationary, non-active runner.
- No reconciliation step scans the reset flag cell after `resetToInitialPosition()`.

## Authority And Contracts

Required project contracts:
- Core game rules belong in `src/core/`.
- Human input goes through the same turn-engine action pipeline as AI input.
- Frozen runners still occupy cells and consume turns; they are not absent.
- Flag carriers lose collisions before map-side defender advantage is considered.
- Normal movement may not enter a runner's own loose home-flag cell while that flag is at base.
- Scoring requires the carrier's own flag to be at home.
- Subsystem notes under `docs/subsystems/` must remain true after behavior changes.

Do not redefine:
- Collision winner priority.
- Flag carrier vulnerability.
- Own-flag-home scoring.
- Guided challenge win/fail conditions.
- Team home-side orientation logic.
- Static Vite deployment constraints.

## Required Reading

Read before editing:
- `docs/development/plan-78-frozen-input-and-flag-home-reconciliation.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md`
- `src/core/turnEngine.js`
- `src/core/collisions.js`
- `src/core/scoring.js`
- `src/core/movement.js`
- `src/core/invariants.js`
- `src/entities/Runner.js`
- `tests/unit/movement-and-collisions.test.js`
- `tests/unit/turn-engine-resilience.test.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/helpers/builders.js`
- `tests/unit/helpers/testHarness.js`

Optional/contextual reading:
- `src/core/events.js` if adding or preserving flag event behavior.
- `tests/unit/narration-event-log.test.js` if event payloads change.
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js` only to understand where the student saw the halt; do not edit the level.

## Scope

### In Scope

- Add `runner.isFrozen` guard to `handlePlayerInput()`.
- Harden `executeQueuedAction()` so a failed animation start cannot move the engine into `ANIMATING`.
- Add deterministic post-collision/flag-reset reconciliation for a flag's home cell.
- Immediately promote an opposing runner who is standing on a reset flag's home cell.
- Move a same-team runner off their own loose at-base flag cell when a collision/flag reset would otherwise leave them there.
- Add focused unit tests for the three reported bugs.
- Update `docs/subsystems/turn-engine.md` if the repaired reconciliation becomes part of the runtime contract.
- Write a progress report.

### Out Of Scope

- UI changes.
- Guided level source changes.
- Reference solution changes.
- Broad collision balance changes.
- New event/narration surfaces unless existing events must be preserved.
- Browser test suite rewrites.

### Files And Areas Likely Touched

- `src/core/turnEngine.js`
- `src/core/collisions.js`
- `src/core/scoring.js`
- possibly `src/core/movement.js` or a new small `src/core/flagReconciliation.js` helper if that keeps responsibilities cleaner
- `tests/unit/movement-and-collisions.test.js`
- `tests/unit/turn-engine-resilience.test.js`
- possibly `tests/unit/scoring-and-level-state.test.js`
- `docs/subsystems/turn-engine.md`
- `reports/development/plan-78-frozen-input-and-flag-home-reconciliation/progress.md`

## Implementation Requirements

### 1. Frozen Human Input Guard

Required behavior:
- A frozen human-controlled runner must not accept queued player input.
- Frozen turns should continue to be processed by `handleFrozenRunnerTurn()`.
- Pressing movement, jump, barrier, freeze, or stay-still keys while the active human is frozen must not halt the game.

Implementation guidance:
- Add `runner.isFrozen` to the `handlePlayerInput()` early-return guard.
- Keep this guard local to player input; do not make frozen runners absent or skip their normal thaw behavior.

Required tests:
- A frozen active human in `AWAITING_INPUT` ignores a movement key.
- The next `processTurnActions()` call processes the frozen skip and decrements `frozenTurnsRemaining`.
- The turn state does not become stuck in `ANIMATING`.

### 2. Animation Start Failure Guard

Required behavior:
- `executeQueuedAction()` must only set `currentTurnState = ANIMATING` when an animation actually started.
- If `startMoveAnimation()`, `startJumpAnimation()`, `startFailedJumpAnimation()`, or `startBounceAnimation()` returns `false`, the engine must complete the action immediately or otherwise recover to a clean turn boundary.

Implementation guidance:
- Prefer checking the boolean return values already provided by `Runner` animation methods.
- For ordinary moves/jumps where animation start fails, treat the action as an illegal/no-op or immediate completion rather than entering `ANIMATING`.
- Be careful with bounce paths: `startBounceAnimation()` currently may not be checked everywhere.

Required tests:
- Directly cover a movement animation-start failure and assert `processTurnActions()` cannot remain in `ANIMATING` with no active animation flags.
- Include jump failure coverage if practical.

### 3. Flag-Home Occupancy Reconciliation

Owner-approved policy for this packet:
- A runner may not remain on their own loose at-base flag cell after collision/flag reset reconciliation.
- If an opposing runner is on a loose at-base flag cell, that runner should immediately pick up the flag using the same state changes and event semantics as ordinary pickup.
- If a same-team runner is on their own loose at-base flag cell, move that runner to a deterministic nearest legal adjacent cell.
- Search adjacent cells in this order unless a stronger existing project convention is found: left, right, up, down, then expanding Manhattan radius if all adjacent cells are blocked.
- The displacement cell must be legal for that runner under normal movement blocking rules, excluding the starting illegal home-flag overlap itself.
- If no legal displacement exists, stop and report rather than inventing a broad fallback.

Required behavior:
- After a collision causes a carried flag to reset, reconcile the reset flag's home cell before the turn advances.
- Opposing runner on the reset flag cell becomes the carrier immediately.
- Same-team runner on the reset flag cell is displaced deterministically and does not become a permanent blocker.
- Reconciliation must not affect a flag that is currently carried.
- Reconciliation must not change normal scoring round reset behavior.

Implementation guidance:
- Prefer a single helper that can be called after a flag reset caused by collision.
- Avoid duplicating pickup state changes. If possible, reuse or factor `checkForFlagPickup()` so event payloads remain consistent.
- Keep the helper in `src/core/` near scoring/collision ownership. If introducing a new helper file, document it in `docs/subsystems/turn-engine.md`.
- Do not silently relocate the flag itself; the flag should still reset to its authored initial position.

Required tests:
- Collision where an enemy carrier loses on the defender's home-flag cell no longer leaves the defender standing on their own at-base flag cell.
- The displaced defender lands on a deterministic legal cell.
- A future enemy runner can legally enter/pick up the home flag cell after reconciliation.
- Collision where a reset flag lands under an opposing waiting runner immediately makes that runner the carrier.
- Existing collision priority tests still pass.

### 4. Documentation Tail

Required behavior:
- If implementation adds flag-home reconciliation or animation-start failure handling as a runtime contract, update `docs/subsystems/turn-engine.md`.
- The note should explain:
  - frozen human input is ignored; frozen turns are auto-skipped/thawed by the engine
  - the engine must not enter `ANIMATING` unless a runner is actually animating
  - after collision flag reset, flag-home occupancy is reconciled so same-team runners do not block their own loose home flag and opposing runners on the reset flag pick it up

Do not update unrelated docs unless the implementation changes their truth.

## Work Plan

1. Reproduce or codify each reported bug as a failing focused unit test.
2. Add the frozen input guard and animation-start guard.
3. Add flag-home reconciliation helper and wire it into the collision flag-reset path.
4. Run the focused unit tests.
5. Run broader validation.
6. Update `docs/subsystems/turn-engine.md` if behavior changed.
7. Write the progress report.

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/turn-engine-resilience.test.js
node --test --test-isolation=none tests/unit/movement-and-collisions.test.js
node --test --test-isolation=none tests/unit/scoring-and-level-state.test.js
npm test
npm run build
```

If event payloads change, also run:

```powershell
node --test --test-isolation=none tests/unit/narration-event-log.test.js
```

No browser test is required unless the fix touches UI or a unit test cannot adequately cover the frozen-human input path. If a browser/manual smoke is run, document it in the progress report.

## Validation Checklist

- [ ] Frozen human input cannot queue actions.
- [ ] Frozen human turns still thaw and advance.
- [ ] Engine cannot remain in `ANIMATING` with no active animation flags after failed animation start.
- [ ] Collision flag reset cannot leave a same-team runner on their own loose at-base flag.
- [ ] Reset flag landing under an opposing runner immediately promotes that runner to carrier.
- [ ] Existing collision priority rules remain unchanged.
- [ ] Existing own-flag-home scoring rule remains unchanged.
- [ ] Focused unit tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `docs/subsystems/turn-engine.md` still reads true.
- [ ] Progress report exists and lists commands run, files changed, and remaining risks.

## Stop Conditions

Stop and ask for owner/orchestrator review if:
- The deterministic same-team runner displacement rule cannot find a legal cell in a realistic board state.
- The cleanest fix appears to require changing collision winner priority.
- The cleanest fix appears to require changing the flag reset location.
- The cleanest fix appears to require changing own-flag-home scoring.
- Fixing the animation-start guard requires broad turn-state refactoring.
- Tests reveal similar illegal occupancy cases involving walls, barriers, or duplicate runner positions that are outside this packet's scope.
- The implementation invalidates a subsystem note in a way that requires product/rules judgment beyond the doc tail described here.
