# Plan 37: Learning Moment Classifier

## Packet Metadata

- Packet id: plan-37
- Packet title: Learning Moment Classifier
- Status: draft — blocked on Plan 35 landing and on two decisions about input shape (see Open Decisions)
- Owner/model: implementation agent, after Plan 35 lands and Open Decisions resolve
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

## Open Decisions

This packet cannot move to `ready` until the integration owner resolves:

### Decision 1: LearningMoment kind set for v1

Proposed initial kinds (subset chosen for v1 by owner):

- `bounced` — runner's queued movement was blocked or bounced.
- `resource_no_readiness_guard` — runner queued a resource action (freeze, jump, barrier) without the corresponding readiness condition in its program path; trace shows the resource block was reached but readiness condition wasn't.
- `no_action_selected` — trace ended in an `"empty"` step; program produced no action this turn.
- `ignored_blocks_below_action` — trace shows the action block was reached but additional action blocks below the first reached one exist (canonical "extra blocks ignored" misconception).
- `recurring_pattern` — a previously-emitted moment kind has fired N times within the current level attempt (cooldown helper kind).
- `runner_index_unhandled` — for multi-ally teams, a runner's trace ends in `"empty"` because no branch matched its `runnerIndex` (suggests the program only handles a subset of team indices).

Owner picks any subset. Defaults to all six.

### Decision 2: Trace input source

The Plan 25a trace currently lives at `window.__bbaLastBlocklyTrace` as a dev-only inspection stash. Options:

- **A (simplest):** Classifier reads from `window.__bbaLastBlocklyTrace`. Dev-only stash gets promoted to a documented input. Survives unchanged.
- **B (cleaner):** Plan 25a's window stash is supplemented by an exported `getLastBlocklyTrace(app)` API in `src/ai/blockly/workspace.js` or `interpreter.js`. Classifier consumes that. No dependency on `window`.
- **C (architecturally most consistent):** Plan 25a's trace gets persisted onto `state.lastBlocklyTrace` alongside the event log. Classifier reads from state, matches the Plan 35 pattern.

Recommendation: C. State-based input matches the Plan 35 idiom and is testable without window globals. Costs a small Plan 25a follow-up to wire state persistence, but that's a one-line change inside `getAIAllyAction`.

### Decision 3 (depends on 35's implementation): event payload reads

After Plan 35 lands, confirm:

- Does `resource.unavailable` fire before or after `runner.actionResolved`? Affects how the classifier distinguishes "tried freeze, freeze was unavailable, stayed" from "tried freeze, freeze worked." (Recommend: 35 emits `resource.unavailable` at planning, then `runner.actionResolved` with outcome `"stayed"`. Two events, clear sequence.)
- Does `runner.blockedOrBounced` always co-occur with `runner.actionResolved` outcome `"stayed"` or can a bounce result in some other outcome? Affects the `bounced` classifier.

These are not Plan 35 changes; they're observations of Plan 35's output. The classifier specifies its reads after Plan 35 has emitted real data.

## Authority And Contracts (preview)

- `state.lastTurnEventLog` from Plan 35.
- Plan 25a trace input source (per Decision 2).
- `LearningMoment` shape:

```js
{
  kind: "bounced" | "resource_no_readiness_guard" | "no_action_selected" |
        "ignored_blocks_below_action" | "recurring_pattern" | "runner_index_unhandled",
  runnerId: string | number,
  runnerTeam: number,
  turn: number,
  metadata: object  // kind-specific
}
```

## Required Reading (preview)

- Plan 35's `src/core/events.js` and event taxonomy.
- Plan 25a's trace step shape.
- Whichever solution is picked for Decision 2.

## Implementation Requirements (preview, refined when packet is promoted to ready)

### Requirement 1: Classifier function shape

- `classifyTurn(turnEventLog, blocklyTrace, recurrenceState): LearningMoment[]`
- Pure function. No state mutation outside its return value.
- `recurrenceState` is an opaque structure threaded across calls so the classifier can implement `recurring_pattern` cooldown counters. Plan 38 owns the storage; this packet defines the shape.

### Requirement 2: One detector per kind

Each kind has its own detection function with clear inputs and well-defined "should fire" semantics. Heuristic kinds (e.g. `runner_index_unhandled`) document false-positive risk.

### Requirement 3: Unit tests

Per-kind passing and failing case. Synthetic event logs and traces — no real Blockly workspace required.

### Requirement 4: No prose, no DOM

Classifier returns structured records only. No string templating, no UI calls.

## Stop Conditions

- Plan 35 hasn't shipped.
- Decisions 1 and 2 unresolved.
- A proposed moment kind requires reading data Plan 35 / Plan 25a doesn't expose.
- A heuristic kind has unacceptable false-positive rate after dry-running on the current campaign.

## Notes For Future Self

This packet is a stub. When promoting to `ready`:

1. Resolve Open Decisions inline (same pattern as Plan 25b's recorded-decisions section).
2. Lock the v1 LearningMoment kind set.
3. Fill in Requirement details with concrete payload reads from Plan 35's actual event payloads (which may differ slightly from the v1 taxonomy after implementation).
4. Confirm the Decision 2 path is implemented (likely a small Plan 25a follow-up if Option C is chosen).
