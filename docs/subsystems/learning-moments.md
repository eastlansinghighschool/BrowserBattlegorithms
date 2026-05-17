# Subsystem Note: Learning Moment Classifier

**Introduced:** Plan 37  
**Status:** v1 complete

## Role

The classifier is a **pure data layer** that sits between the Plan 35 event log / Plan 25a Blockly trace and any prose consumer. It turns per-turn engine facts and student-program execution traces into structured `LearningMoment` records that multiple consumers can read without duplicating detection logic.

Current consumer: **Plan 38 (Learning Coach Text)** — turns records into displayed prose.  
Future consumers: usage-tracker enrichment, teacher dashboard, formative assessment checkpoints.

## Inputs

| Field | Source | Notes |
|---|---|---|
| `state.lastTurnEventLog` | Plan 35 (`src/core/events.js`) | Finalized at turn end; cleared on `initializeMatch` / `initializeDisplayState` |
| `state.lastBlocklyTrace` | Plan 37 Req 0 stash (`src/ai/blockly/interpreter.js`) | Mirrors Plan 25a's `window.__bbaLastBlocklyTrace` plus workspace-enriched metadata; cleared on same reset paths |
| `state.classifierRecurrenceState` | Plan 37 (`src/core/state.js`) | Mutated in place by classifier; reset rules below |

## API

```js
import { classifyTurn } from "../../src/ai/learningMoments.js";

const moments = classifyTurn(
  app.state.lastTurnEventLog,
  app.state.lastBlocklyTrace,
  app.state.classifierRecurrenceState
);
// → LearningMoment[]
```

`classifyTurn` is **pure** except for mutating `recurrenceState.perLevelAttempt` counters. No DOM, no prose, no narration calls.

## `LearningMoment` shape

```js
{
  kind: string,          // one of the six kinds below
  runnerId: string,
  runnerTeam: number,
  turn: number,
  metadata: object       // kind-specific; documented per detector in learningMoments.js
}
```

## Six kinds

| Kind | Trigger | False-positive risk |
|---|---|---|
| `bounced` | `runner.blockedOrBounced` in event log | None — event is precise |
| `resource_no_readiness_guard` | `resource.unavailable` AND no readiness-check block anywhere in trace | Low: guard in wrong branch suppresses moment even though structurally unguarded |
| `no_action_selected` | Trace ends in `"empty"` step | None — trace step is precise |
| `ignored_blocks_below_action` | Action ran AND `ignoredActionBlockIds` non-empty | None — computed from workspace disabled-reason state at stash time |
| `recurring_pattern` | Any base kind crosses 3 occurrences per runner in the level attempt | Inherits risk of its `patternKind`; Plan 38 owns cadence suppression |
| `runner_index_unhandled` | Trace empty + runner-index comparison + multi-ally team | Moderate: index comparison may control non-action logic; team-size guard prevents single-ally false fires |

## `state.lastBlocklyTrace` extended shape

Plan 37's Req 0 extends the state stash (not the Plan 25a collector step shape) with workspace-derived metadata:

```js
{
  runnerId, runnerTeam, turnNumber, levelId,
  steps: TraceStep[],              // Plan 25a shape, unchanged
  ignoredActionBlockIds: string[], // action block IDs marked with bba_ignored_block
  comparisonInputBlockTypes: {     // { [blockId]: { leftBlockType, rightBlockType } }
    [blockId]: { leftBlockType: string|null, rightBlockType: string|null }
  },
  teamAllyCount: number,           // non-NPC, non-human allies on runner's team
  runnerAllyIndex: number|null     // runner.allyIndex at stash time
}
```

`window.__bbaLastBlocklyTrace` retains the original Plan 25a shape (no enriched fields) as a dev-inspection mirror.

## Recurrence state reset rules

| Field | Resets on |
|---|---|
| `perLevelAttempt` | `initializeMatch` (match start) and `initializeDisplayState` (level display reset) |
| `perMatch` | `initializeMatch` only |
| `counters` | Full state recreation only (e.g. mode switch back to setup) |

`resetRound` (post-scoring position reset) does **not** clear these fields — consistent with Plan 35's event-log reset policy.

## What this note covers / what it does not cover

- Covers: classifier API, moment kinds, state fields, reset rules, false-positive notes.
- Does not cover: prose authoring (Plan 38), ARIA narration (Plan 36), usage tracker integration (future), or level-curriculum gating (Plan 38).
