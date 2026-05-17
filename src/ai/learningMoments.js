// Pure classifier: consumes state.lastTurnEventLog + state.lastBlocklyTrace and emits
// zero or more LearningMoment records for the current turn. No DOM, no prose, no UI.
// Plan 38 (Learning Coach Text) is the first prose consumer of this output.
//
// LearningMoment shape:
//   { kind, runnerId, runnerTeam, turn, metadata }
//
// Six kinds:
//   "bounced"                    — move attempt was blocked or bounced
//   "resource_no_readiness_guard"— resource action tried without a readiness guard in program
//   "no_action_selected"         — program produced no action (trace ends in "empty")
//   "ignored_blocks_below_action"— action blocks below the first executed one are silently skipped
//   "recurring_pattern"          — a prior kind has fired N times in this level attempt
//   "runner_index_unhandled"     — multi-ally trace ends empty and runner-index branch was unmatched
//
// Recurrence state lives in state.classifierRecurrenceState (not here). The classifier
// mutates recurrenceState.perLevelAttempt in place; lifetime is managed by setup.js.

// Maps resource actionType strings to their readiness block types (If and Boolean variants).
// missingGuardBlockType is the canonical check block named in metadata for student guidance.
const RESOURCE_READINESS_MAP = {
  JUMP_FORWARD: {
    readinessBlockTypes: new Set([
      "battlegorithms_if_can_jump",
      "battlegorithms_if_can_jump_else",
      "battlegorithms_boolean_can_jump"
    ]),
    missingGuardBlockType: "battlegorithms_if_can_jump"
  },
  PLACE_BARRIER_FORWARD: {
    readinessBlockTypes: new Set([
      "battlegorithms_if_can_place_barrier",
      "battlegorithms_if_can_place_barrier_else",
      "battlegorithms_boolean_can_place_barrier"
    ]),
    missingGuardBlockType: "battlegorithms_if_can_place_barrier"
  },
  FREEZE_OPPONENTS: {
    readinessBlockTypes: new Set([
      "battlegorithms_if_area_freeze_ready",
      "battlegorithms_if_area_freeze_ready_else",
      "battlegorithms_boolean_area_freeze_ready"
    ]),
    missingGuardBlockType: "battlegorithms_if_area_freeze_ready"
  }
};

// After the same kind fires this many times per runner in one level attempt, emit recurring_pattern.
const RECURRING_THRESHOLD = 3;

// ─── Detectors ───────────────────────────────────────────────────────────────

// Emits when the event log contains runner.blockedOrBounced.
// All bounce reasons (wall, barrier, out_of_bounds, runner_collision_bounce) map to the
// same kind; the reason is preserved in metadata for any future variant that needs it.
// Metadata: { attemptedCell: {x, y}, reason: string }
export function detectBounced(turnEventLog) {
  return turnEventLog
    .filter((e) => e.kind === "runner.blockedOrBounced")
    .map((e) => ({
      kind: "bounced",
      runnerId: e.payload.runnerId,
      runnerTeam: e.payload.runnerTeam,
      turn: e.turn,
      metadata: {
        attemptedCell: e.payload.attemptedCell,
        reason: e.payload.reason
      }
    }));
}

// Emits when a resource action (jump/barrier/freeze) was attempted while unavailable AND
// the trace shows no readiness guard on any evaluated path this turn.
//
// Heuristic conservatism: if the readiness block type appears ANYWHERE in the trace
// (even in a branch not taken toward the resource), we treat the guard as present and
// do NOT emit. This avoids false positives for programs that correctly guard in one
// branch but reach the unguarded path via a different condition. Under-counts cases where
// the guard is present but structurally unreachable — acceptable for v1.
//
// False-positive scenario: student wrote a guard in an if-else but only the else
// branch leads to the resource action. The guard block still appears in the trace
// (condition step), so we suppress the moment even though the guard is structurally
// disconnected from the resource path. Plan 38 cadence policy can handle residual noise.
//
// Metadata: { actionType, reason, missingGuardBlockType }
export function detectResourceNoReadinessGuard(turnEventLog, blocklyTrace) {
  const moments = [];
  const steps = blocklyTrace?.steps || [];

  for (const event of turnEventLog) {
    if (event.kind !== "resource.unavailable") continue;
    const { actionType, reason, runnerId, runnerTeam } = event.payload;
    const readinessInfo = RESOURCE_READINESS_MAP[actionType];
    if (!readinessInfo) continue;

    const hasReadinessGuard = steps.some(
      (step) =>
        (step.kind === "condition" || step.kind === "boolean") &&
        readinessInfo.readinessBlockTypes.has(step.blockType)
    );

    if (!hasReadinessGuard) {
      moments.push({
        kind: "resource_no_readiness_guard",
        runnerId,
        runnerTeam,
        turn: event.turn,
        metadata: { actionType, reason, missingGuardBlockType: readinessInfo.missingGuardBlockType }
      });
    }
  }

  return moments;
}

// Emits when the trace ends in an "empty" step, meaning the program walked every branch
// and produced no action for this runner this turn.
// Metadata: { traceLength }
export function detectNoActionSelected(turnEventLog, blocklyTrace) {
  const steps = blocklyTrace?.steps || [];
  if (steps.length === 0) return [];
  if (steps[steps.length - 1]?.kind !== "empty") return [];
  return [
    {
      kind: "no_action_selected",
      runnerId: blocklyTrace.runnerId,
      runnerTeam: blocklyTrace.runnerTeam,
      turn: blocklyTrace.turnNumber,
      metadata: { traceLength: steps.length }
    }
  ];
}

// Emits when an action ran AND ignoredActionBlockIds (populated at stash time from the
// live workspace) shows action blocks below the first executed one that students may
// think are running but are not.
// Metadata: { firstActionBlockId, ignoredActionBlockIds: string[] }
export function detectIgnoredBlocksBelowAction(blocklyTrace) {
  if (!blocklyTrace) return [];
  const steps = blocklyTrace.steps || [];
  const actionStep = steps.find((s) => s.kind === "action");
  if (!actionStep) return [];

  const ignoredIds = blocklyTrace.ignoredActionBlockIds || [];
  if (ignoredIds.length === 0) return [];

  return [
    {
      kind: "ignored_blocks_below_action",
      runnerId: blocklyTrace.runnerId,
      runnerTeam: blocklyTrace.runnerTeam,
      turn: blocklyTrace.turnNumber,
      metadata: {
        firstActionBlockId: actionStep.blockId,
        ignoredActionBlockIds: ignoredIds
      }
    }
  ];
}

// Meta-detector. Runs after all base detectors with their combined output as input.
// Increments per-runner per-kind counters in recurrenceState.perLevelAttempt and emits
// recurring_pattern exactly when a counter hits RECURRING_THRESHOLD (not on every
// subsequent turn). Plan 38 owns cadence/cooldown beyond the threshold event.
// Metadata: { patternKind, occurrenceCount }
export function detectRecurringPattern(currentMoments, recurrenceState) {
  const moments = [];
  const perLevel = recurrenceState.perLevelAttempt;

  for (const moment of currentMoments) {
    const key = `${moment.kind}:${moment.runnerId}`;
    perLevel[key] = (perLevel[key] || 0) + 1;

    if (perLevel[key] === RECURRING_THRESHOLD) {
      moments.push({
        kind: "recurring_pattern",
        runnerId: moment.runnerId,
        runnerTeam: moment.runnerTeam,
        turn: moment.turn,
        metadata: { patternKind: moment.kind, occurrenceCount: perLevel[key] }
      });
    }
  }

  return moments;
}

// Conservative heuristic: emits when all of these hold:
//   1. The trace ends in "empty" (no action selected).
//   2. The trace contains at least one VALUE_COMPARE step whose LEFT or RIGHT input is
//      a VALUE_RUNNER_INDEX block (via comparisonInputBlockTypes from the stash).
//   3. The runner's team has more than one ally (teams with one ally never need index logic).
//
// False-positive scenarios (documented):
//   - The runner-index comparison exists but controls something unrelated to actions;
//     the real reason for "empty" is a different missing branch. Low risk: programs
//     in multi-ally levels typically use index routing for action selection.
//   - Teams with exactly one Blockly-driven ally never trigger (condition 3 prevents it).
//
// teamAllyCount and comparisonInputBlockTypes come from state.lastBlocklyTrace (stashed at
// turn time from the live workspace), keeping this function pure with no app dependency.
// Metadata: { runnerIndex: number | null, hasIndexComparisons: true }
export function detectRunnerIndexUnhandled(turnEventLog, blocklyTrace) {
  if (!blocklyTrace) return [];
  const steps = blocklyTrace.steps || [];
  if (steps.length === 0) return [];
  if (steps[steps.length - 1]?.kind !== "empty") return [];

  if ((blocklyTrace.teamAllyCount || 0) <= 1) return [];

  const comparisonInputTypes = blocklyTrace.comparisonInputBlockTypes || {};
  const hasIndexComparison = steps.some((s) => {
    if (s.kind !== "comparison") return false;
    const inputs = comparisonInputTypes[s.blockId];
    return (
      inputs?.leftBlockType === "battlegorithms_value_runner_index" ||
      inputs?.rightBlockType === "battlegorithms_value_runner_index"
    );
  });

  if (!hasIndexComparison) return [];

  return [
    {
      kind: "runner_index_unhandled",
      runnerId: blocklyTrace.runnerId,
      runnerTeam: blocklyTrace.runnerTeam,
      turn: blocklyTrace.turnNumber,
      metadata: {
        runnerIndex: blocklyTrace.runnerAllyIndex ?? null,
        hasIndexComparisons: true
      }
    }
  ];
}

// ─── Public API ──────────────────────────────────────────────────────────────

// Classify one turn's worth of events and trace into zero or more LearningMoment records.
// Pure: the only mutation is incrementing counters inside recurrenceState.perLevelAttempt.
// recurrenceState is state.classifierRecurrenceState; its lifetime is managed by setup.js.
export function classifyTurn(turnEventLog, blocklyTrace, recurrenceState) {
  if (!Array.isArray(turnEventLog) || !recurrenceState) return [];

  const bounced = detectBounced(turnEventLog);
  const noReadiness = detectResourceNoReadinessGuard(turnEventLog, blocklyTrace);
  const noAction = detectNoActionSelected(turnEventLog, blocklyTrace);
  const ignoredBlocks = detectIgnoredBlocksBelowAction(blocklyTrace);
  const runnerIndexUnhandled = detectRunnerIndexUnhandled(turnEventLog, blocklyTrace);

  const baseMoments = [...bounced, ...noReadiness, ...noAction, ...ignoredBlocks, ...runnerIndexUnhandled];

  // Recurring-pattern meta-detector runs last with the full base output as its input.
  const recurring = detectRecurringPattern(baseMoments, recurrenceState);

  return [...baseMoments, ...recurring];
}
