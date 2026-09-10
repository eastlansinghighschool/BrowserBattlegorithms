# Progress Report: Plan 116 — Collision And Wasted-Resource Event Tracking

## Overall Summary

Implemented Plan 116 (Collision and Wasted-Resource Event Tracking), creating a lightweight, passive attempt-scoped tracking system for collisions and wasted resource attempts derived directly from canonical game events.

- Created `src/core/attemptCounters.js` with pure helpers (`createAttemptCounters`, `ensureAttemptCounters`, `resetAttemptCounters`, `getAttemptCounters`, `recordEventInAttemptCounters`).
- Tracked four distinct counters strictly scoped to program-controlled ally runners (`runnerRole === "ally"`):
  - `runnerCollisionBounces`: Derived from `runner.blockedOrBounced` when `reason === "runner_collision_bounce"`.
  - `mapBlockageBounces`: Derived from `runner.blockedOrBounced` when `reason` is a map blockage (`"wall"`, `"barrier"`, `"out_of_bounds"`).
  - `resourceUnavailableAttempts`: Derived from `resource.unavailable` (jump exhausted, barrier exhausted/active, freeze on cooldown).
  - `ineffectiveFreezeUses`: Derived from `runner.actionResolved` for Area Freeze when `outcome === "freeze_applied"` and `affectedCount === 0`.
- Integrated counter initialization and reset boundaries into `src/core/state.js` and `src/core/setup.js`:
  - `attemptCounters` initializes on game state creation.
  - Counters reset on fresh attempt setup (`initializeMatch` and `initializeDisplayState`).
  - Counters survive intra-attempt round resets (`resetRound`).
- Wired passive event observation into `emit()` in `src/core/events.js`, ensuring zero undercounting from event-log window eviction and no duplicate counts during trace playback.
- Decoupled freeze effectiveness calculation in `src/core/turnEngine.js`: `applyAreaFreeze` returns `{ effect, affectedCount }` directly from `affectedRunners.length`, passing `affectedCount` into `emitActionResolved`, completely independent of the transient `state.areaFreezeEffect` animation object.
- Exposed attempt counters additively on the end-of-level `details` payload in `src/core/levels.js` (`completeLevel`), making them accessible to `evaluateLevelStars` and `app.usageTracker.recordLevelEnded`.
- Documented the attempt counters contract in `docs/subsystems/turn-engine.md` and `docs/subsystems/usage-and-admin.md`.
- Added 13 comprehensive unit tests in `tests/unit/attempt-counters.test.js` covering pure helpers, event splitting, ally-role scoping, attempt/reset boundaries, animation-effect decoupling, and harness-driven gameplay runs.

## Files Changed

- `src/core/attemptCounters.js` (NEW): Per-attempt collision and wasted-resource counter tracking module.
- `src/core/state.js`: Initialized `attemptCounters: createAttemptCounters()` on default state.
- `src/core/setup.js`: Wired `resetAttemptCounters(state)` into `initializeMatch` and `initializeDisplayState`; preserved counters in `resetRound`.
- `src/core/events.js`: Called `recordEventInAttemptCounters(state, kind, payload)` synchronously in `emit()`.
- `src/core/turnEngine.js`: Calculated authoritative `affectedCount: affectedRunners.length` in `applyAreaFreeze` and passed `affectedCount` in `details` to `emitActionResolved`. Preserved existing event payloads without extraneous fields.
- `src/core/levels.js`: Fetched `getAttemptCounters(app.state)` in `completeLevel` and merged them into `details` passed to `evaluateLevelStars` and `recordLevelEnded`.
- `docs/subsystems/turn-engine.md`: Documented attempt counters subsystem notes, surface map, and invariants.
- `docs/subsystems/usage-and-admin.md`: Documented additive attempt counters in end-of-level details for star evaluation context.
- `package.json`: Registered `tests/unit/attempt-counters.test.js` under `test:unit`.
- `tests/unit/attempt-counters.test.js` (NEW): 13 unit tests covering unit helpers, event parsing, role scoping, lifecycle boundaries, freeze decoupling, and harness simulations.

## Artifacts Produced

- `reports/development/plan-116-collision-waste-event-tracking/progress.md` (this report)

## Advisor Consultation

- **Posture**: Degraded mode — **orchestrator-gate-only** (Branch C).
- **Justification**: Per `advisor-capable-providers.json`, this execution environment (Antigravity) is not listed as advisor-capable. The thread operates under direct orchestrator preflight guidance and gate checks.

## Preflight Review Corrections Addressed

- **C1 (Authoritative Freeze Affected Count)**:
  `applyAreaFreeze` computes `affectedRunners` locally and returns `{ effect, affectedCount: affectedRunners.length }`. `executeQueuedAction` passes `{ affectedCount }` directly into `emitActionResolved`. This eliminates dependency on `state.areaFreezeEffect` (a transient visual animation object nulled by setup across resets), preventing false positives where cleared effects would read as 0.
- **C2 (Scoping to Program-Controlled Allies)**:
  Empirical audit of the level corpus confirmed that human-controlled runners never appear in scrimmage, resource, or multi-runner levels targeting star criteria (human-runner levels are pass-star-only per Plan 105 protocol). Therefore, all four counters are strictly scoped to `runnerRole === "ally"`. Human and NPC/CPU events are ignored.
- **C3 (Derivation in `emit()` vs Log Truncation & Trace Playback)**:
  By incrementing counters directly inside `emit()`, counters are immune to log eviction (bounded event window). Trace playback during Blockly stepping visualizes blocks without calling turn actions or `emit()`, guaranteeing no false increments.
- **C4 (Attempt Boundary Definition)**:
  An attempt spans across intra-attempt round resets (`resetRound`), which preserve counter values. Full resets or new attempts (`initializeMatch`, `initializeDisplayState`) explicitly invoke `resetAttemptCounters(state)`, resetting all counters to 0.

## Commands Run and Results

1. `node --test tests/unit/attempt-counters.test.js tests/unit/narration-event-log.test.js`
   - Exit code: 0 (24/24 tests passed).
2. `npm test`
   - Exit code: 0 (608/608 tests passed).
3. `npm run build`
   - Exit code: 0 (Vite static production build succeeded).
4. `npm run lint:levels`
   - Exit code: 0 (0 errors, 47 pre-existing warnings).

## Validation Checks Performed

- [x] Pure helpers (`createAttemptCounters`, `ensureAttemptCounters`, `resetAttemptCounters`, `getAttemptCounters`) behave deterministically.
- [x] `runner.blockedOrBounced` correctly splits `runner_collision_bounce` into `runnerCollisionBounces` vs map blockages into `mapBlockageBounces`.
- [x] Scoping ignores events from human and NPC runners (`runnerRole !== "ally"`).
- [x] Ineffective freeze counts only when Area Freeze resolves with `outcome === "freeze_applied"` and `affectedCount === 0`.
- [x] End-of-level `details` payload contains all four counters without mutating other fields.
- [x] Existing event payloads (`turn.started`, `runner.actionChosen`, `runner.actionResolved`, `runner.blockedOrBounced`, `resource.unavailable`) retain exact shape contracts, preserving 100% pass on `narration-event-log.test.js`.
- [x] All 608 tests pass in full test suite.
- [x] Production build passes cleanly.
- [x] Subsystem documentation updated in `turn-engine.md` and `usage-and-admin.md`.

## Remaining Risks or Follow-ups

- **Mastery Criteria Authoring (Follow-on Packet)**: `src/core/starEvaluation.js` criteria authoring (e.g. `no-collision`, `no-wasted-resource`) was intentionally out of scope for Plan 116 and will consume these new details fields in subsequent packets.
- **Plan Status**: As an implementer thread, `plan-status.js set` is left for orchestrator control.

## Ready for Orchestrator Review

**Yes.** All code changes, test suites, documentation updates, and validations are complete and verified.
