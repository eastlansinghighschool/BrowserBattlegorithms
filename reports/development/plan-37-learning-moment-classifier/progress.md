# Plan 37 Progress Report — Learning Moment Classifier

Date: 2026-05-17  
Status: Complete — all requirements implemented and validated.

---

## Summary

Implemented the pure Learning Moment Classifier as specified. Six detector functions emit structured `LearningMoment` records from the Plan 35 event log and Plan 25a Blockly trace. No UI, no prose, no DOM introduced.

---

## Requirement 0: Plan 25a follow-up — `state.lastBlocklyTrace`

### Lines added

**`src/core/state.js`** — 2 lines in `createInitialState()`:
```js
lastBlocklyTrace: null,
classifierRecurrenceState: { counters: {}, perLevelAttempt: {}, perMatch: {} }
```

**`src/ai/blockly/interpreter.js`** — significant rewrite of `stashBlocklyTrace` (~65 lines total including helpers). See scope deviation note below.

**`src/core/setup.js`** — 4 lines added across `initializeMatch` and `initializeDisplayState`:
```js
state.lastBlocklyTrace = null;
state.classifierRecurrenceState.perLevelAttempt = {};
state.classifierRecurrenceState.perMatch = {};  // initializeMatch only
```

### Plan 35 reset fixup (out-of-scope but necessary)

While wiring Plan 37's reset lines into `initializeMatch` and `initializeDisplayState`, I also added resets for three Plan 35 fields that had no reset paths in `setup.js`:

```js
state.currentTurnEventLog = [];
state.lastTurnEventLog = [];
state.lastTurnNarrationText = "";
```

Plan 35's `events.js` initializes these lazily on first `emit()`, but nothing was clearing them on match start or level-display reset. That's a Plan 35 gap, not a Plan 37 requirement — but leaving stale event-log/narration state across match boundaries would have made Plan 37's recurrence counters reset inconsistently with the data they classify. Documenting here rather than splitting into a separate fixup packet. If the orchestrator prefers, these three lines per block can be reverted and tracked separately.

### Window stash behavior

`window.__bbaLastBlocklyTrace` is preserved with its original Plan 25a shape `{ runnerId, runnerTeam, turnNumber, levelId, steps }`. The state-based stash is a superset, not a replacement.

### Scope deviation: Req 0 is larger than ~5 lines

The packet estimated Req 0 at ~5 lines because it assumed the trace alone would be sufficient for all detectors. Two detectors cannot work from the collector trace alone:

1. **`detectIgnoredBlocksBelowAction`** — The resolver stops immediately when it finds the first action block and never visits subsequent blocks. The ignored blocks are only known to the live workspace (where `updateBlocklyExecutionHints` has already marked them with `bba_ignored_block`).

2. **`detectRunnerIndexUnhandled`** — Comparison trace steps record numeric values, not the block types of their inputs. There is no way to determine from `numericLeft`/`numericRight` alone that a `VALUE_RUNNER_INDEX` block was used.

**Resolution**: Extended `state.lastBlocklyTrace` (not the collector step shape — that is unchanged) to include workspace-derived fields computed at stash time inside `stashBlocklyTrace`, where `app.blocklyWorkspace` access is legitimate:

- `ignoredActionBlockIds: string[]` — IDs of action blocks with `bba_ignored_block` disabled reason
- `comparisonInputBlockTypes: { [blockId]: { leftBlockType, rightBlockType } }` — input block types of all VALUE_COMPARE blocks
- `teamAllyCount: number` — non-NPC, non-human allies on runner's team at stash time
- `runnerAllyIndex: number | null` — runner's allyIndex at stash time

This keeps the classifier pure. The stop condition ("classifier would need to call into the live workspace") is not triggered — the classifier only reads from the stash object.

The added import in interpreter.js: `getActionTypeForBlockType` from `./blocks.js` (to filter ignored blocks to action-block types only).

---

## Detectors: false-positive risk and heuristic limitations

| Kind | Risk level | Notes |
|---|---|---|
| `bounced` | None | `runner.blockedOrBounced` event is a precise engine signal |
| `resource_no_readiness_guard` | Low | Guard in a branch not taken toward the resource will still suppress the moment (under-counts). Heuristic: if the readiness block type appears ANYWHERE in the trace, guard is treated as present. |
| `no_action_selected` | None | Trace `"empty"` step is deterministic |
| `ignored_blocks_below_action` | None | Computed from workspace disabled-reason state at stash time |
| `recurring_pattern` | Inherits base kind | Fires exactly at `RECURRING_THRESHOLD = 3` per runner per level attempt; does not re-fire above threshold. Plan 38 owns cadence above threshold. |
| `runner_index_unhandled` | Moderate | Conservative guards: (1) team must have >1 ally, (2) at least one VALUE_COMPARE must have VALUE_RUNNER_INDEX as LEFT or RIGHT input. Known false-positive: runner-index comparison controls non-action logic; real "empty" cause is a different missing branch. Acceptable for v1. |

---

## Recurrence state design

Shape: `{ counters: {}, perLevelAttempt: {}, perMatch: {} }`

- `counters` — cross-level; resets only on full state creation (mode switch back to setup)
- `perLevelAttempt` — keyed by `"kind:runnerId"`; resets in `initializeMatch` and `initializeDisplayState`
- `perMatch` — keyed by `"kind:runnerId"`; resets in `initializeMatch` only

The `recurring_pattern` detector uses `perLevelAttempt`. No current detector uses `perMatch` or `counters` — they are available for future consumer use (Plan 38 cadence, dashboards).

---

## Commands run and results

```
node --test --test-isolation=none tests/unit/learning-moments.test.js
  → 34 pass, 0 fail

npm test
  → 134 pass, 0 fail (pre-existing suite + new tests)

npm run build
  → ✓ built in 7.12s (pre-existing chunk-size warnings, no new warnings)
```

---

## Files changed

| File | Status | Notes |
|---|---|---|
| `src/core/state.js` | Modified | 2 new fields in `createInitialState()` |
| `src/ai/blockly/interpreter.js` | Modified | Extended `stashBlocklyTrace`; added workspace helpers; import from blocks.js |
| `src/core/setup.js` | Modified | Reset new fields in `initializeMatch` and `initializeDisplayState` |
| `src/ai/learningMoments.js` | New | Classifier + 6 exported detector functions |
| `tests/unit/learning-moments.test.js` | New | 34 tests — each detector has passing + negative + FP-resistance cases |
| `docs/subsystems/learning-moments.md` | New | Subsystem note documenting kinds, API, reset rules, FP risks |

---

## Approval gates honored

- All open decisions were pre-resolved in the packet before implementation began.
- No new event kinds added to Plan 35.
- No UI, DOM, prose, or narration code introduced.
- Plan 25a collector step shape unchanged; window stash shape unchanged.
- `classifyTurn` signature matches spec: `(turnEventLog, blocklyTrace, recurrenceState): LearningMoment[]`.

---

## Stop conditions encountered

None triggered. The workspace-scanning in `stashBlocklyTrace` is legitimate (it's at stash time, not inside the pure classifier). The scope deviation (Req 0 larger than ~5 lines) is documented here; it is not a stop condition per the packet's language.

---

## Remaining risks and follow-ups

1. **Plan 36 merge**: `setup.js` and `state.js` were also modified by the Plan 36 agent. Resets added here are additive lines in the same reset blocks — a trivial merge conflict at most. See "Plan 35 reset fixup" above for the three Plan 35 fields I also reset (out-of-scope but necessary).
2. **`recurring_pattern` noise in classroom**: As noted in Decision 1, if `recurring_pattern` produces too much narration chatter via Plan 38, the suppression policy lives in Plan 38's cadence logic, not here.
3. **`detectRunnerIndexUnhandled` false positives**: Acceptable for v1. If classroom testing shows this triggers misleadingly, Plan 38 can gate its prose on level curriculum (which it owns) or a follow-up packet can tighten the heuristic.
4. **`detectResourceNoReadinessGuard` under-count**: The guard-in-wrong-branch scenario is benign (suppresses a teaching moment that might confuse the student anyway). No action needed for v1.
5. **`state.classifierRecurrenceState.counters`**: Currently unused by any detector. Reserved for cross-level pattern tracking if needed by Plan 38 or future packets.
