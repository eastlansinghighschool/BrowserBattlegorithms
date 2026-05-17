# Plan 35: Narration Event Log Foundation

## Packet Metadata

- Packet id: plan-35
- Packet title: Narration Event Log Foundation
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / source-code / tests
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - per-turn append-only event log on app state, plus an `emit()` helper that turn-resolution code uses to append structured events
  - emission calls at the right points in `turnEngine.js`, `scoring.js`, `collisions.js`, and `setup.js` for the 9 v1 event kinds
  - unit-test coverage proving each event emits with the expected payload and that the log resets correctly per turn
  - subsystem note touch only if the turn-engine note's surface description needs to mention the log
  - progress report
- Progress report folder: `reports/development/plan-35-narration-event-log-foundation/`
- Progress report file: `reports/development/plan-35-narration-event-log-foundation/progress.md`

## Packet Summary

Goal: Give the engine a structured memory of what just happened. Add a per-turn append-only event log on `state` and emit 9 v1 event kinds at the right points in turn resolution. No UI. No voice. No narration. Just the data layer that future packets (36 ARIA narration, 37 learning-moment classifier, 39 TTS) all consume.

Non-goals:

- Do not add narration prose, aria-live regions, voice synthesis, or any UI surface.
- Do not change action resolution, collision rules, scoring, or level-completion logic.
- Do not consume the event log from anywhere yet. Producers only.
- Do not export events via usage tracker. The log is ephemeral runtime state.
- Do not add or extend event kinds beyond the v1 set in this packet.
- Do not deploy.

Depends on:

- Current turn engine in `src/core/turnEngine.js`, collisions in `src/core/collisions.js`, scoring in `src/core/scoring.js`, setup/reset in `src/core/setup.js`.
- Current state shape in `src/core/state.js`.

Blocks:

- Plan 36 (ARIA narration) and Plan 37 (learning-moment classifier) consume the event log.
- Plan 39 (TTS) consumes whatever text the upstream produces — indirectly downstream of this.

Why this packet exists:

Today the engine emits no observable events. State changes happen as direct mutations and the renderer scrapes the result. Narration, classifier, replay, and usage enrichment all need structured event data, and no current consumer should have to scrape state retroactively. This is the foundation everything else in the narration sequence (Plans 36–39) sits on, and a precondition for several other future directions (deterministic replay, formative checkpoints). Splitting it out keeps the data-side work small, fully unit-testable, and free of UI judgment.

## Authority And Contracts

Sources of truth:

- `src/core/turnEngine.js` (`processTurnActions`, `executeQueuedAction`, `handleActionCompletion`, `planActionForActiveRunner`).
- `src/core/collisions.js`.
- `src/core/scoring.js`.
- `src/core/setup.js` (round reset).
- `src/core/state.js` (state shape).
- `src/core/levels.js` (level result evaluation — `level.result` event fires here).
- `docs/subsystems/turn-engine.md` for the "Turn resolution order" reference.

Required product contracts:

- The event log is a pure observer. Adding or removing emissions must not change action resolution, collision outcomes, scoring, level completion, or any visible behavior.
- The log is per-turn-of-active-runner. It is finalized at the moment `handleActionCompletion` runs (or its equivalent terminal call for frozen/illegal/no-op turns) and then frozen as `state.lastTurnEventLog` for consumers. The next turn starts with a fresh `state.currentTurnEventLog`.
- Events are plain structured objects. No class instances, no functions in payloads, no DOM references.
- Each event has a stable `kind` string, a `turn` number, and a `payload` object whose shape is fixed per kind.
- No event mentions narration or text; producers describe facts.

Do not redefine:

- Engine semantics. This packet is purely additive on the data side.
- The 25a trace collector or its window stash.
- Usage tracker export format.

## v1 Event Taxonomy

The packet adds exactly these 9 event kinds. Future packets propose additions (e.g. collision details, freeze details, barrier lifecycle) as needed.

| Kind | When | Payload |
|---|---|---|
| `turn.started` | First step of `processTurnActions` for a new active runner | `{ runnerId, runnerTeam, isHuman, isNPC, isFrozen }` |
| `runner.actionChosen` | The instant an action is queued (human input or AI/Blockly decision) | `{ runnerId, runnerTeam, actionType, source }` where `source` is one of `"human"`, `"blockly"`, `"npc"`, `"cpu"` |
| `runner.actionResolved` | After the action executes (or is recognized as a no-op) | `{ runnerId, runnerTeam, actionType, outcome }` where `outcome` is one of `"moved"`, `"jumped"`, `"barrier_placed"`, `"freeze_applied"`, `"stayed"`, `"skipped_frozen"`, `"illegal_noop"` |
| `runner.blockedOrBounced` | A movement-style action attempted a blocked or out-of-bounds cell | `{ runnerId, runnerTeam, attemptedCell, reason }` where `reason` is one of `"wall"`, `"barrier"`, `"out_of_bounds"`, `"runner_collision_bounce"` |
| `flag.pickedUp` | A runner picks up an enemy flag | `{ flagTeam, carrierRunnerId, cell }` |
| `flag.dropped` | A flag drops (collision loss, etc.) | `{ flagTeam, previousCarrierRunnerId, cell, reason }` where `reason` is one of `"collision_lost"`, `"runner_frozen"`, `"runner_displaced"` |
| `team.scored` | A flag is returned to base | `{ scoringTeam, newScore, pointsToWin }` |
| `resource.unavailable` | A queued action requires a resource the team can't use (e.g. `JUMP_FORWARD` when `canJump` is false, `PLACE_BARRIER_FORWARD` when not allowed, `AREA_FREEZE` when already used) | `{ runnerId, runnerTeam, actionType, reason }` where `reason` names the specific unavailable resource |
| `level.result` | Guided level passes or fails at end of a turn | `{ levelId, result }` where `result` is `"passed"`, `"failed"`, or `"in_progress"` (only emit on transition) |

Notes:
- `runner.actionResolved` is emitted exactly once per active-runner turn, including frozen/skipped turns (outcome `"skipped_frozen"`).
- `runner.blockedOrBounced` may co-occur with `runner.actionResolved` (outcome `"stayed"` is typical when a bounce sends the runner back to origin). The pair is intentional; consumers can correlate by runner id and turn.
- `resource.unavailable` is emitted at the planning step when the engine recognizes that a queued action will fall back to `STAY_STILL` because the resource is exhausted. The existing `turnEngine.js:209-214` fallback path is the obvious emission site.
- `flag.dropped` may fire multiple times in unusual game states; consumers should handle multiple drops in one turn.
- Game-over is implied by `team.scored` reaching `pointsToWin`; no separate event kind in v1.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/turn-engine.md` ("Turn resolution order" section)
- `src/core/turnEngine.js`
- `src/core/collisions.js`
- `src/core/scoring.js`
- `src/core/setup.js`
- `src/core/state.js`
- `src/core/levels.js` (`evaluateLevelProgress`)
- `tests/unit/turn-engine.test.js` (if it exists; otherwise the closest movement/collision test)

## Scope

### In scope

- Add `state.currentTurnEventLog: []` and `state.lastTurnEventLog: []` to `createInitialState()`.
- Add an `emit(state, kind, payload)` helper in `src/core/events.js` (new file) that appends `{ kind, turn: state.currentTurnNumber, payload }` to `state.currentTurnEventLog`. The helper is the only producer surface.
- Add `finalizeTurnEventLog(state)` in the same module that moves `currentTurnEventLog` to `lastTurnEventLog` and resets the current log to `[]`. Call this at the end of each active-runner turn — specifically at the start of `advanceToNextRunner` or wherever the active-runner pointer changes.
- Wire emissions at the 9 sites required by the taxonomy. Each emission is a single function call; no logic change to the engine.
- Unit tests in `tests/unit/narration-event-log.test.js` (new) that:
  - assert each event kind fires with the right payload on a representative game state;
  - assert the log resets between turns;
  - assert action invariance: running a turn with and without observing the log produces the same final state.
- Update `docs/subsystems/turn-engine.md` only to add one short sentence under "Surface map" pointing at `src/core/events.js` and noting "passive observer; does not change resolution order." Do not restructure the note.
- Plan 35 progress report.

### Files and areas likely touched

- `src/core/events.js` (new).
- `src/core/state.js` (two new state fields).
- `src/core/turnEngine.js` (emission calls).
- `src/core/collisions.js` (emission calls for blocked/bounced and flag-dropped where applicable).
- `src/core/scoring.js` (emission calls for flag.pickedUp, flag.dropped on collision losses, team.scored).
- `src/core/setup.js` (round-reset clearing of log if needed — log should be empty at round reset anyway, but verify).
- `src/core/levels.js` (emission for level.result on transition).
- `tests/unit/narration-event-log.test.js` (new).
- `docs/subsystems/turn-engine.md` (one-line surface-map addition).
- `reports/development/plan-35-narration-event-log-foundation/progress.md` (new).

### Out of scope

- Any consumer of the event log. No aria-live region, no narration, no voice.
- Additional event kinds beyond the v1 taxonomy.
- Persisting the log to localStorage or usage tracker.
- A debug overlay showing recent events.
- Changes to the existing Plan 25a trace stash.

## Work Plan

1. Read the four core files (turnEngine, collisions, scoring, levels) to map each event kind to its exact emission point.
2. Add `src/core/events.js` with `emit` and `finalizeTurnEventLog`.
3. Add the state fields.
4. Wire emissions one event kind at a time. After each, run the existing test suite to confirm no regression.
5. Wire `finalizeTurnEventLog` at the active-runner transition.
6. Write the unit test file.
7. Touch the subsystem note minimally.
8. Run validation. Write progress report.

## Implementation Requirements

### Requirement 1: Event log shape and lifecycle

- `state.currentTurnEventLog` is an empty array at app start and at every active-runner transition.
- `state.lastTurnEventLog` is an empty array at app start. After each active-runner turn completes, it holds the events from the just-completed turn.
- Both arrays contain plain objects: `{ kind: string, turn: number, payload: object }`.
- The `emit` helper performs no validation beyond a type check on `kind`. Producers are responsible for payload shape; tests enforce shapes per kind.
- `finalizeTurnEventLog` is idempotent: calling it twice in a row leaves `lastTurnEventLog` correctly populated and `currentTurnEventLog` empty.

### Requirement 2: Emission discipline

- All 9 event kinds emit at exactly one canonical site per kind. The mapping is documented inline in `src/core/events.js` as a comment listing kind → emission file:line.
- Emissions are single function calls. They must not introduce branching, side effects, or state changes beyond appending to the log.
- Emissions live next to the existing code that produces the event-worthy state change (no detour modules).

### Requirement 3: Action invariance

- The unit test file includes a test that runs a fixed game sequence twice: once with `currentTurnEventLog` observed, once with the log discarded (e.g. by overriding `emit` to a no-op). Final state (runner positions, scores, level status) must match exactly.

### Requirement 4: Unit-test coverage per event kind

- One test per event kind that constructs a state in which the event should fire and asserts both the kind and payload shape.
- Tests do not depend on Blockly, p5, or the DOM. Use the existing test harness helpers.

### Requirement 5: Documentation

- One short addition to `docs/subsystems/turn-engine.md` "Surface map" pointing at `src/core/events.js` with the line "Per-turn event log for narration consumers; passive observer, does not change resolution order."
- Do not edit any other subsystem note.
- Do not edit `docs/development/README.md` beyond the standard packet-status update at completion time.

## Model-Specific Instructions

- Treat each event kind as a one-line addition at its emission site. No refactoring of the surrounding logic.
- After wiring each event kind, run `npm test` before adding the next. Regression-free emission discipline is more important than batching.
- If an event kind has no obvious single emission site (e.g. `runner.blockedOrBounced` could fire from two paths), pick the one that's *closest to the structural state change* (bounce path in movement.js or collisions.js) rather than a UI-side detection.
- Stop and report if any event kind requires more than a single function call at its emission site.

## Commands

```powershell
node --test --test-isolation=none tests/unit/narration-event-log.test.js
npm test
npm run build
```

## Validation Checklist

- [ ] `src/core/events.js` exists with `emit` and `finalizeTurnEventLog`.
- [ ] `state.currentTurnEventLog` and `state.lastTurnEventLog` initialized in `createInitialState()`.
- [ ] All 9 event kinds emit at canonical sites, documented in `events.js` comments.
- [ ] `finalizeTurnEventLog` is called at the active-runner transition.
- [ ] Unit tests cover each event kind plus the action-invariance assertion.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `docs/subsystems/turn-engine.md` gains one short surface-map line.
- [ ] No other subsystem note edited.
- [ ] No DOM, voice, narration, or consumer logic added.
- [ ] Progress report lists each event kind's emission file:line.

## Stop Conditions

Stop and report for integration-owner review if:

- Any event kind has no clean single emission site.
- Wiring an emission would require changing resolution order or branching logic.
- Action invariance fails (running with and without observing produces different final state) — that means an emission has a side effect it shouldn't.
- Subsystem note changes beyond the one-line addition would be needed.
