# Plan 37: Learning Moment Classifier

## Packet Metadata

- Packet id: plan-37
- Packet title: Learning Moment Classifier
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / source-code / tests
- Mutation level: source-code / tests
- Approval gate: before mutation — Open Decisions must be resolved
- Expected artifacts (preview):
  - new `src/ai/learningMoments.js` (or similar) exporting a pure classifier
  - `LearningMoment` type with kind + metadata
  - unit-test coverage per moment kind
  - no UI, no narration, no prose
  - progress report

## Packet Summary

Goal: Build a pure function that consumes the Plan 35 turn event log plus the Plan 25a per-turn Blockly trace and emits zero or more `LearningMoment` records identifying teachable patterns in the student's program behavior. The classifier is the structured-signal layer that multiple consumers can feed off: Plan 38 (Learning Coach Text), usage tracker enrichment, future formative assessment, teacher dashboards. This packet builds the classifier only — no consumers in this packet.

Non-goals:

- No prose authoring. The classifier emits structured records with kinds and metadata; phrasing belongs to Plan 38.
- No UI surface. No DOM, no narration, no aria-live updates.
- No usage-tracker integration.
- No level-curriculum gating (Plan 38 owns that).
- No new event kinds in the Plan 35 log (this packet is a consumer, not a producer).

Depends on:

- Plan 35 complete: `state.lastTurnEventLog` populated with the v1 event taxonomy.
- Plan 25a complete: per-turn Blockly trace available via either `window.__bbaLastBlocklyTrace` or a queryable API decided by Open Decision 2.

Blocks:

- Plan 38 (Learning Coach Text).
- Usage tracker enrichment (future, not in this packet).
- Formative assessment checkpoints (deferred Tier B suggestion from analysis-index).

Why this packet exists:

Plan 25b made the runtime trace visible; Plan 36 makes the engine state audible. Neither yet says "your ally tried to use freeze but had already used it" as a structured observation about *student programming choices*. The classifier turns the engine's factual events and the student's trace into a structured catalog of teaching moments. The catalog is reusable: same data feeds narration, usage evidence, dashboards, and future formative checkpoints. Codex (orchestrator) correctly elevated this as a load-bearing data layer, not just a narration prerequisite.

## Recorded Decisions

All four decisions resolved as of 2026-05-17. Plan 37 is ready for implementation.

### Decision 1 (resolved): LearningMoment kind set for v1 — **all six**

The v1 classifier emits all six proposed kinds. If classroom feedback shows specific kinds produce audible chatter through Plan 38's coach surface (especially `recurring_pattern` and `runner_index_unhandled`, which carry the highest noise risk), Plan 38's cadence policy will suppress them — or a follow-up packet will drop the emission entirely. v1 is "emit everything, suppress at the consumer."

- `bounced` — runner's queued movement was blocked or bounced.
- `resource_no_readiness_guard` — runner queued a resource action (freeze, jump, barrier) without the corresponding readiness condition in its program path; trace shows the resource block was reached but readiness condition wasn't.
- `no_action_selected` — trace ended in an `"empty"` step; program produced no action this turn.
- `ignored_blocks_below_action` — trace shows the action block was reached but additional action blocks below the first reached one exist (canonical "extra blocks ignored" misconception).
- `recurring_pattern` — a previously-emitted moment kind has fired N times within the current level attempt (cooldown helper kind).
- `runner_index_unhandled` — for multi-ally teams, a runner's trace ends in `"empty"` because no branch matched its `runnerIndex` (suggests the program only handles a subset of team indices).

Type name confirmed: `LearningMoment`.

### Decision 2 (resolved): Trace input source — **state-based via `state.lastBlocklyTrace`**

Plan 35 landed using `state.lastTurnEventLog` exactly as designed; the pattern is clean and testable. Plan 37 mirrors it: the Plan 25a trace is persisted onto `state.lastBlocklyTrace` as part of this packet's implementation work.

Concretely, this packet includes a small Plan 25a follow-up (~5 lines): inside `getAIAllyAction` in `src/ai/blockly/interpreter.js`, when `isBlocklyTraceCollectionActive(app.state)` is true, write the trace to `app.state.lastBlocklyTrace` in addition to (or instead of) the existing `window.__bbaLastBlocklyTrace` stash. The window stash may stay as a dev-inspection mirror or be removed entirely — implementer's call documented in the progress report.

The classifier reads `state.lastBlocklyTrace` synchronously alongside `state.lastTurnEventLog`. No `window` dependency. Unit tests construct synthetic state and assert classifier output without browser globals.

### Decision 3 (resolved): event payload reads — answered by Plan 35's actual emissions

Confirmed from Plan 35's landing:

- `resource.unavailable` fires AT PLANNING, before `runner.actionResolved`. The canonical sequence for a "tried freeze, freeze was unavailable, stayed" turn is `[resource.unavailable {reason: "freeze_already_used"}, runner.actionResolved {outcome: "stayed"}]` (other events may intersperse). The `resource_no_readiness_guard` classifier matches this pattern in the event log AND verifies via the Plan 25a trace that the resource block was reached without a readiness condition guarding it.
- `runner.blockedOrBounced` reliably co-occurs with `runner.actionResolved` outcome `"stayed"` in the same turn log. The `bounced` classifier can match on the `blockedOrBounced` event alone — the `actionResolved` cross-check is redundant but harmless. The bounce `reason` field (`"wall"`, `"barrier"`, `"out_of_bounds"`, `"runner_collision_bounce"`) is available for finer-grained classification if a future LearningMoment variant needs it; v1 treats all bounce reasons as the same kind.
- `runner.actionResolved` outcome enum is stable: `"moved"`, `"jumped"`, `"barrier_placed"`, `"freeze_applied"`, `"stayed"`, `"skipped_frozen"`, `"illegal_noop"`. The classifier reads `outcome` directly; no further normalization needed.
- `level.result` fires only on transition (`"passed"` or `"failed"`), not per-turn `"in_progress"`. The classifier anchors per-level-attempt recurrence on level-load (a separate event/hook) and on `level.result` transitions, not on synthetic per-turn signals.

### Decision 4 (resolved alongside Plan 35): recurrence-state storage

Plan 35's implementation clears both event-log fields in `src/core/setup.js` round/level reset paths. The classifier's recurrence counters **cannot live in the event log** or they'd be cleared at the wrong cadence.

Plan 37 introduces a separate state field — `state.classifierRecurrenceState: object` — that the classifier mutates as it runs. The field's reset rules are explicit and per-counter: per-level-attempt counters reset on level reset; per-match counters reset on full match restart; cross-level pattern counters (if any) persist across level transitions and reset only on full app reload. Plan 38 reads from this same field for cadence/cooldown enforcement.

## Authority And Contracts

- `state.lastTurnEventLog` from Plan 35.
- `state.lastBlocklyTrace` from the Plan 25a follow-up included in this packet (see Requirement 0).
- `state.classifierRecurrenceState` introduced by this packet.
- `LearningMoment` shape:

```js
{
  kind: "bounced" | "resource_no_readiness_guard" | "no_action_selected" |
        "ignored_blocks_below_action" | "recurring_pattern" | "runner_index_unhandled",
  runnerId: string | number,
  runnerTeam: number,
  turn: number,
  metadata: object  // kind-specific; documented per detector below
}
```

## Required Reading

- `docs/packet-creation-guidance.md`
- Plan 35's `src/core/events.js` and event taxonomy.
- Plan 25a's trace step shape (`{ blockId, blockType, kind, result, numericLeft, numericRight, runnerId, runnerTeam }`) — currently stashed at `window.__bbaLastBlocklyTrace`.
- `src/ai/blockly/interpreter.js` (`getAIAllyAction` is where the Plan 25a follow-up wires the state-based trace).
- `src/core/state.js` for the state-field addition pattern.
- `tests/unit/narration-event-log.test.js` as the fixture pattern for synthetic event/trace tests.

## Implementation Requirements

### Requirement 0: Plan 25a follow-up — `state.lastBlocklyTrace`

Required behavior:

- Add `state.lastBlocklyTrace: { runnerId, runnerTeam, turnNumber, levelId, steps }` (or `null`) to `createInitialState()`.
- In `src/ai/blockly/interpreter.js`'s `getAIAllyAction`, when `isBlocklyTraceCollectionActive(app.state)` is true and `getFirstRunnableActionWithTrace` returns a trace, write the trace to `app.state.lastBlocklyTrace` in addition to the existing `window.__bbaLastBlocklyTrace` stash. The window stash stays as a dev-inspection mirror; do not remove it.
- Reset `state.lastBlocklyTrace = null` at the same places Plan 35 clears the event log (round reset, level reset). Use the existing setup.js reset paths.
- This is a ~5-line change. Document the lines added in the progress report.

Constraints:

- Do not change Plan 25a's collector, trace step shape, or any other Plan 25a contract.
- Do not break the existing window-stash behavior.

Edge cases:

- If `getFirstRunnableActionWithTrace` returns `{ action, trace: null }` (PvP hidden-workspace path), do not overwrite `state.lastBlocklyTrace`. Leave whatever the visible-workspace path last wrote.

### Requirement 1: Classifier function shape

- `classifyTurn(turnEventLog, blocklyTrace, recurrenceState): LearningMoment[]` exported from `src/ai/learningMoments.js` (new file).
- Pure function. No state mutation outside the `recurrenceState` argument (which is mutated in place; see Requirement 4 for the contract).
- `recurrenceState` is `state.classifierRecurrenceState`; the classifier reads and writes it but does not control its lifetime.
- Returns an array of `LearningMoment` records, possibly empty.

### Requirement 2: One detector per kind

Implement six detector functions, each consuming the same `(turnEventLog, blocklyTrace, recurrenceState)` inputs and returning zero or more `LearningMoment` records:

- `detectBounced(turnEventLog)` — emits when `runner.blockedOrBounced` is present in the log. Metadata: `{ attemptedCell, reason }` from the event payload.
- `detectResourceNoReadinessGuard(turnEventLog, blocklyTrace)` — emits when `resource.unavailable` is in the log AND the trace shows the resource block was reached without a guarding readiness condition. Metadata: `{ actionType, reason, missingGuardBlockType }` where `missingGuardBlockType` names the readiness block that should have guarded it (e.g. `"battlegorithms_area_freeze_ready"`).
- `detectNoActionSelected(turnEventLog, blocklyTrace)` — emits when the trace ends in an `"empty"` step. Metadata: `{ traceLength }`.
- `detectIgnoredBlocksBelowAction(blocklyTrace)` — emits when the trace records an `"action"` step AND the workspace has sibling action blocks below the first reached one. Uses the existing ignored-block scanner pattern from `src/ai/blockly/workspace.js`. Metadata: `{ firstActionBlockId, ignoredActionBlockIds: [] }`.
- `detectRecurringPattern(currentMoments, recurrenceState)` — meta-detector. Looks at the moment kinds the current turn produced, increments per-kind counters in `recurrenceState`, and emits a `recurring_pattern` moment when any counter crosses a threshold (default 3). Metadata: `{ patternKind, occurrenceCount }`.
- `detectRunnerIndexUnhandled(turnEventLog, blocklyTrace, app)` — for multi-ally teams. Heuristic detector. Emits when the trace ends in `"empty"` AND the trace contains at least one `comparison` step against `runnerIndex` AND the team has more than one ally. The heuristic is intentionally conservative; document false-positive scenarios in the implementation comments. Metadata: `{ runnerIndex, hasIndexComparisons: true }`.

Each detector returns its findings; `classifyTurn` concatenates them. The recurring-pattern detector runs *last* with the other detectors' output as part of its input.

### Requirement 3: Unit tests

- `tests/unit/learning-moments.test.js` (new) covers each detector with at least one passing case and one negative case (input that should NOT emit).
- Heuristic detectors (`detectResourceNoReadinessGuard`, `detectRunnerIndexUnhandled`) get at least one explicit false-positive-resistance test — input that looks like it might trigger but shouldn't.
- The `detectRecurringPattern` test exercises the counter increment and threshold crossing.
- All tests use synthetic event logs and synthetic traces; no real Blockly workspace, no DOM.

### Requirement 4: Recurrence state lifecycle

- `state.classifierRecurrenceState` is an object initialized in `createInitialState()` as `{ counters: {}, perLevelAttempt: {}, perMatch: {} }` (or similar — the exact shape is the implementer's design call, documented in the file's comments).
- Reset rules:
  - `perLevelAttempt` resets on level reset and on level switch. Wire alongside Plan 35's existing reset paths in `src/core/setup.js` and `src/core/levels.js`.
  - `perMatch` resets on full match restart (round-reset triggered by scoring is NOT a match restart; only `initializeMatch` is).
  - Top-level `counters` (cross-level patterns) persists across level transitions and resets only on full state recreation (e.g. mode switch back to setup).
- The classifier mutates `recurrenceState` in place; the field belongs to state, not the classifier module.

### Requirement 5: No prose, no DOM

Classifier returns structured records only. No string templating, no UI calls, no narration. Plan 38 is the consumer that turns records into prose.

### Requirement 6: Documentation

- Add a short section to `docs/subsystems/ui-mode-contract.md` (or a new dedicated `docs/subsystems/learning-moments.md` if the file would be more than ~30 lines) describing the classifier as a passive data layer over Plan 35's event log and Plan 25a's trace, naming the six kinds, and pointing at Plan 38 as the first prose consumer.
- The progress report lists every kind detected, every detector's false-positive risk, and any heuristic limitations the implementer hit.

## Commands

```powershell
node --test --test-isolation=none tests/unit/learning-moments.test.js
npm test
npm run build
```

`npm run test:browser` is not required for this packet (no DOM/UI changes), but a green run is welcome if cheap.

## Validation Checklist

- [ ] `state.lastBlocklyTrace` field added to `createInitialState()` and populated by `getAIAllyAction` (Requirement 0).
- [ ] Window stash `window.__bbaLastBlocklyTrace` still works as dev-inspection mirror.
- [ ] `state.classifierRecurrenceState` field added with documented shape and reset rules.
- [ ] `src/ai/learningMoments.js` exports `classifyTurn(turnEventLog, blocklyTrace, recurrenceState): LearningMoment[]`.
- [ ] All six detector functions implemented.
- [ ] Each detector's metadata shape documented in code comments.
- [ ] `tests/unit/learning-moments.test.js` covers each detector with passing + negative cases plus the explicit false-positive-resistance tests for heuristic kinds.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Subsystem note updated.
- [ ] No DOM, prose, or UI code added.
- [ ] Plan 25a follow-up is ≤ 10 lines of source change in `interpreter.js` + state init.
- [ ] Progress report lists detected kinds, false-positive risks, and any heuristic limitations.

## Stop Conditions

Stop and report for integration-owner review if:

- A heuristic detector produces unacceptable false positives on synthetic test inputs that look classroom-realistic.
- The Plan 25a follow-up requires more than ~10 lines of source change (suggests the trace plumbing has shifted since 2026-05-17 and the assumption is stale).
- `state.classifierRecurrenceState` reset rules conflict with existing setup/levels reset paths in a non-trivial way.
- A detector needs data Plan 35 or Plan 25a doesn't expose.
- The classifier would need to call into Blockly's live workspace (it should not — all detection works from the per-turn trace snapshot Plan 25a captured).

