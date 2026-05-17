import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyTurn,
  detectBounced,
  detectIgnoredBlocksBelowAction,
  detectNoActionSelected,
  detectRecurringPattern,
  detectResourceNoReadinessGuard,
  detectRunnerIndexUnhandled
} from "../../src/ai/learningMoments.js";

// ─── Synthetic builders ───────────────────────────────────────────────────────

function makeEvent(kind, payload, turn = 1) {
  return { kind, turn, payload };
}

function makeTrace(overrides = {}) {
  return {
    runnerId: "ally-0",
    runnerTeam: 1,
    turnNumber: 1,
    levelId: "test-level",
    steps: [],
    ignoredActionBlockIds: [],
    comparisonInputBlockTypes: {},
    teamAllyCount: 1,
    runnerAllyIndex: 0,
    ...overrides
  };
}

function makeRecurrenceState() {
  return { counters: {}, perLevelAttempt: {}, perMatch: {} };
}

// ─── detectBounced ────────────────────────────────────────────────────────────

test("detectBounced emits when runner.blockedOrBounced is in the log", () => {
  const log = [
    makeEvent("runner.blockedOrBounced", {
      runnerId: "ally-0",
      runnerTeam: 1,
      attemptedCell: { x: 3, y: 4 },
      reason: "wall"
    })
  ];
  const moments = detectBounced(log);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].kind, "bounced");
  assert.equal(moments[0].runnerId, "ally-0");
  assert.equal(moments[0].runnerTeam, 1);
  assert.deepEqual(moments[0].metadata, { attemptedCell: { x: 3, y: 4 }, reason: "wall" });
});

test("detectBounced emits one record per bounce event in the same turn", () => {
  const log = [
    makeEvent("runner.blockedOrBounced", { runnerId: "a", runnerTeam: 1, attemptedCell: { x: 1, y: 1 }, reason: "barrier" }),
    makeEvent("runner.blockedOrBounced", { runnerId: "b", runnerTeam: 1, attemptedCell: { x: 2, y: 2 }, reason: "wall" })
  ];
  assert.equal(detectBounced(log).length, 2);
});

test("detectBounced does not emit when no bounce event is present", () => {
  const log = [makeEvent("runner.actionResolved", { runnerId: "ally-0", runnerTeam: 1, actionType: "MOVE_FORWARD", outcome: "moved" })];
  assert.equal(detectBounced(log).length, 0);
});

test("detectBounced does not emit on an empty log", () => {
  assert.equal(detectBounced([]).length, 0);
});

// ─── detectResourceNoReadinessGuard ──────────────────────────────────────────

test("detectResourceNoReadinessGuard emits when resource.unavailable and no guard in trace", () => {
  const log = [
    makeEvent("resource.unavailable", {
      runnerId: "ally-0",
      runnerTeam: 1,
      actionType: "JUMP_FORWARD",
      reason: "jump_exhausted"
    })
  ];
  const trace = makeTrace({ steps: [{ kind: "action", blockType: "battlegorithms_jump_forward", blockId: "b1" }] });
  const moments = detectResourceNoReadinessGuard(log, trace);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].kind, "resource_no_readiness_guard");
  assert.equal(moments[0].metadata.actionType, "JUMP_FORWARD");
  assert.equal(moments[0].metadata.missingGuardBlockType, "battlegorithms_if_can_jump");
});

test("detectResourceNoReadinessGuard emits for FREEZE_OPPONENTS with no guard", () => {
  const log = [makeEvent("resource.unavailable", { runnerId: "ally-0", runnerTeam: 1, actionType: "FREEZE_OPPONENTS", reason: "freeze_already_used" })];
  const trace = makeTrace({ steps: [] });
  const moments = detectResourceNoReadinessGuard(log, trace);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].metadata.missingGuardBlockType, "battlegorithms_if_area_freeze_ready");
});

test("detectResourceNoReadinessGuard does NOT emit when if_can_jump guard appears in trace", () => {
  const log = [makeEvent("resource.unavailable", { runnerId: "ally-0", runnerTeam: 1, actionType: "JUMP_FORWARD", reason: "jump_exhausted" })];
  const trace = makeTrace({
    steps: [
      { kind: "condition", blockType: "battlegorithms_if_can_jump", blockId: "guard", result: false },
      { kind: "action", blockType: "battlegorithms_jump_forward", blockId: "act" }
    ]
  });
  assert.equal(detectResourceNoReadinessGuard(log, trace).length, 0);
});

test("detectResourceNoReadinessGuard does NOT emit when boolean_can_jump guard appears in trace", () => {
  const log = [makeEvent("resource.unavailable", { runnerId: "ally-0", runnerTeam: 1, actionType: "JUMP_FORWARD", reason: "jump_exhausted" })];
  const trace = makeTrace({
    steps: [{ kind: "boolean", blockType: "battlegorithms_boolean_can_jump", blockId: "b", result: false }]
  });
  assert.equal(detectResourceNoReadinessGuard(log, trace).length, 0);
});

test("detectResourceNoReadinessGuard false-positive resistance: wrong guard type does not suppress", () => {
  // Student guarded with freeze-ready check but still tried jump without a jump guard.
  const log = [makeEvent("resource.unavailable", { runnerId: "ally-0", runnerTeam: 1, actionType: "JUMP_FORWARD", reason: "jump_exhausted" })];
  const trace = makeTrace({
    steps: [{ kind: "condition", blockType: "battlegorithms_if_area_freeze_ready", blockId: "wrong-guard", result: true }]
  });
  const moments = detectResourceNoReadinessGuard(log, trace);
  assert.equal(moments.length, 1, "freeze guard should not suppress jump guard requirement");
});

test("detectResourceNoReadinessGuard does not emit when log has no resource.unavailable", () => {
  const log = [makeEvent("runner.actionResolved", { runnerId: "ally-0", runnerTeam: 1, actionType: "MOVE_FORWARD", outcome: "moved" })];
  assert.equal(detectResourceNoReadinessGuard(log, makeTrace()).length, 0);
});

test("detectResourceNoReadinessGuard handles null trace without throwing", () => {
  const log = [makeEvent("resource.unavailable", { runnerId: "ally-0", runnerTeam: 1, actionType: "JUMP_FORWARD", reason: "jump_exhausted" })];
  const moments = detectResourceNoReadinessGuard(log, null);
  assert.equal(moments.length, 1);
});

// ─── detectNoActionSelected ───────────────────────────────────────────────────

test("detectNoActionSelected emits when trace ends in empty step", () => {
  const trace = makeTrace({
    steps: [
      { kind: "condition", blockType: "battlegorithms_if_have_enemy_flag", blockId: "c1", result: false },
      { kind: "empty", blockType: "battlegorithms_on_each_turn", blockId: "evt" }
    ]
  });
  const moments = detectNoActionSelected([], trace);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].kind, "no_action_selected");
  assert.equal(moments[0].metadata.traceLength, 2);
});

test("detectNoActionSelected does not emit when trace ends in action step", () => {
  const trace = makeTrace({
    steps: [{ kind: "action", blockType: "battlegorithms_move_forward", blockId: "a1" }]
  });
  assert.equal(detectNoActionSelected([], trace).length, 0);
});

test("detectNoActionSelected does not emit on empty trace", () => {
  assert.equal(detectNoActionSelected([], makeTrace({ steps: [] })).length, 0);
});

test("detectNoActionSelected does not emit when trace is null", () => {
  assert.equal(detectNoActionSelected([], null).length, 0);
});

// ─── detectIgnoredBlocksBelowAction ──────────────────────────────────────────

test("detectIgnoredBlocksBelowAction emits when action ran and ignored action blocks exist", () => {
  const trace = makeTrace({
    steps: [{ kind: "action", blockType: "battlegorithms_move_forward", blockId: "first-action" }],
    ignoredActionBlockIds: ["ignored-freeze", "ignored-jump"]
  });
  const moments = detectIgnoredBlocksBelowAction(trace);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].kind, "ignored_blocks_below_action");
  assert.equal(moments[0].metadata.firstActionBlockId, "first-action");
  assert.deepEqual(moments[0].metadata.ignoredActionBlockIds, ["ignored-freeze", "ignored-jump"]);
});

test("detectIgnoredBlocksBelowAction does not emit when no action step in trace", () => {
  const trace = makeTrace({
    steps: [{ kind: "empty", blockType: "battlegorithms_on_each_turn", blockId: "evt" }],
    ignoredActionBlockIds: ["some-block"]
  });
  assert.equal(detectIgnoredBlocksBelowAction(trace).length, 0);
});

test("detectIgnoredBlocksBelowAction does not emit when ignoredActionBlockIds is empty", () => {
  const trace = makeTrace({
    steps: [{ kind: "action", blockType: "battlegorithms_move_forward", blockId: "a1" }],
    ignoredActionBlockIds: []
  });
  assert.equal(detectIgnoredBlocksBelowAction(trace).length, 0);
});

test("detectIgnoredBlocksBelowAction does not emit when trace is null", () => {
  assert.equal(detectIgnoredBlocksBelowAction(null).length, 0);
});

// ─── detectRecurringPattern ───────────────────────────────────────────────────

test("detectRecurringPattern emits recurring_pattern exactly at threshold (3rd occurrence)", () => {
  const recurrence = makeRecurrenceState();
  const moment = { kind: "bounced", runnerId: "ally-0", runnerTeam: 1, turn: 5, metadata: {} };

  // First two turns: no recurring_pattern
  assert.equal(detectRecurringPattern([moment], recurrence).length, 0);
  assert.equal(detectRecurringPattern([moment], recurrence).length, 0);

  // Third turn: threshold crossed, emit
  const third = detectRecurringPattern([moment], recurrence);
  assert.equal(third.length, 1);
  assert.equal(third[0].kind, "recurring_pattern");
  assert.equal(third[0].metadata.patternKind, "bounced");
  assert.equal(third[0].metadata.occurrenceCount, 3);
});

test("detectRecurringPattern does not re-emit after threshold (4th+ occurrence suppressed)", () => {
  const recurrence = makeRecurrenceState();
  const moment = { kind: "bounced", runnerId: "ally-0", runnerTeam: 1, turn: 1, metadata: {} };
  detectRecurringPattern([moment], recurrence); // 1
  detectRecurringPattern([moment], recurrence); // 2
  detectRecurringPattern([moment], recurrence); // 3 — emits
  const fourth = detectRecurringPattern([moment], recurrence); // 4
  assert.equal(fourth.length, 0, "should not re-emit above threshold");
});

test("detectRecurringPattern tracks different runners independently", () => {
  const recurrence = makeRecurrenceState();
  const momentA = { kind: "bounced", runnerId: "ally-0", runnerTeam: 1, turn: 1, metadata: {} };
  const momentB = { kind: "bounced", runnerId: "ally-1", runnerTeam: 1, turn: 1, metadata: {} };

  detectRecurringPattern([momentA, momentB], recurrence); // ally-0:1, ally-1:1
  detectRecurringPattern([momentA, momentB], recurrence); // ally-0:2, ally-1:2

  const third = detectRecurringPattern([momentA, momentB], recurrence); // ally-0:3, ally-1:3
  assert.equal(third.length, 2, "both runners should hit threshold on same turn");
});

test("detectRecurringPattern does not emit when moments list is empty", () => {
  const recurrence = makeRecurrenceState();
  assert.equal(detectRecurringPattern([], recurrence).length, 0);
});

// ─── detectRunnerIndexUnhandled ───────────────────────────────────────────────

function makeIndexCompareTrace(overrides = {}) {
  const compareBlockId = "compare-1";
  return makeTrace({
    steps: [
      {
        kind: "comparison",
        blockType: "battlegorithms_value_compare",
        blockId: compareBlockId,
        result: false,
        numericLeft: 1,
        numericRight: 0
      },
      { kind: "empty", blockType: "battlegorithms_on_each_turn", blockId: "evt" }
    ],
    comparisonInputBlockTypes: {
      [compareBlockId]: {
        leftBlockType: "battlegorithms_value_runner_index",
        rightBlockType: "battlegorithms_value_number"
      }
    },
    teamAllyCount: 2,
    runnerAllyIndex: 1,
    ...overrides
  });
}

test("detectRunnerIndexUnhandled emits when trace ends empty, index comparison present, multi-ally team", () => {
  const trace = makeIndexCompareTrace();
  const moments = detectRunnerIndexUnhandled([], trace);
  assert.equal(moments.length, 1);
  assert.equal(moments[0].kind, "runner_index_unhandled");
  assert.equal(moments[0].metadata.hasIndexComparisons, true);
  assert.equal(moments[0].metadata.runnerIndex, 1);
});

test("detectRunnerIndexUnhandled does NOT emit for single-ally team", () => {
  const trace = makeIndexCompareTrace({ teamAllyCount: 1 });
  assert.equal(detectRunnerIndexUnhandled([], trace).length, 0);
});

test("detectRunnerIndexUnhandled does NOT emit when trace ends with action (not empty)", () => {
  const compareBlockId = "compare-1";
  const trace = makeTrace({
    steps: [
      { kind: "comparison", blockType: "battlegorithms_value_compare", blockId: compareBlockId, result: true, numericLeft: 0, numericRight: 0 },
      { kind: "action", blockType: "battlegorithms_move_forward", blockId: "a1" }
    ],
    comparisonInputBlockTypes: { [compareBlockId]: { leftBlockType: "battlegorithms_value_runner_index", rightBlockType: "battlegorithms_value_number" } },
    teamAllyCount: 2,
    runnerAllyIndex: 0
  });
  assert.equal(detectRunnerIndexUnhandled([], trace).length, 0);
});

test("detectRunnerIndexUnhandled false-positive resistance: empty trace but no index comparison does not emit", () => {
  // Trace ends empty but the comparison is not involving runner index.
  const compareBlockId = "compare-1";
  const trace = makeTrace({
    steps: [
      { kind: "comparison", blockType: "battlegorithms_value_compare", blockId: compareBlockId, result: false, numericLeft: 2, numericRight: 3 },
      { kind: "empty", blockType: "battlegorithms_on_each_turn", blockId: "evt" }
    ],
    comparisonInputBlockTypes: {
      [compareBlockId]: { leftBlockType: "battlegorithms_value_distance_to_target", rightBlockType: "battlegorithms_value_number" }
    },
    teamAllyCount: 2,
    runnerAllyIndex: 1
  });
  assert.equal(detectRunnerIndexUnhandled([], trace).length, 0);
});

test("detectRunnerIndexUnhandled false-positive resistance: no comparisonInputBlockTypes data does not emit", () => {
  const trace = makeIndexCompareTrace({ comparisonInputBlockTypes: {} });
  assert.equal(detectRunnerIndexUnhandled([], trace).length, 0);
});

test("detectRunnerIndexUnhandled does not emit when trace is null", () => {
  assert.equal(detectRunnerIndexUnhandled([], null).length, 0);
});

// ─── classifyTurn integration ─────────────────────────────────────────────────

test("classifyTurn returns empty array for empty log and null trace", () => {
  const result = classifyTurn([], null, makeRecurrenceState());
  assert.deepEqual(result, []);
});

test("classifyTurn returns empty array when first arg is not an array", () => {
  assert.deepEqual(classifyTurn(null, null, makeRecurrenceState()), []);
});

test("classifyTurn includes recurring_pattern after BOUNCE fires 3 times", () => {
  const recurrence = makeRecurrenceState();
  const bouncedLog = [
    makeEvent("runner.blockedOrBounced", {
      runnerId: "ally-0",
      runnerTeam: 1,
      attemptedCell: { x: 1, y: 1 },
      reason: "wall"
    })
  ];

  classifyTurn(bouncedLog, null, recurrence); // turn 1
  classifyTurn(bouncedLog, null, recurrence); // turn 2
  const result = classifyTurn(bouncedLog, null, recurrence); // turn 3

  const kinds = result.map((m) => m.kind);
  assert.ok(kinds.includes("bounced"), "bounced should still be present");
  assert.ok(kinds.includes("recurring_pattern"), "recurring_pattern should appear on 3rd bounce");

  const recurring = result.find((m) => m.kind === "recurring_pattern");
  assert.equal(recurring.metadata.patternKind, "bounced");
});

test("classifyTurn does not emit recurring_pattern for one-off moments", () => {
  const recurrence = makeRecurrenceState();
  const log = [makeEvent("runner.blockedOrBounced", { runnerId: "ally-0", runnerTeam: 1, attemptedCell: { x: 1, y: 1 }, reason: "wall" })];
  const result = classifyTurn(log, null, recurrence);
  const kinds = result.map((m) => m.kind);
  assert.ok(!kinds.includes("recurring_pattern"));
});

test("classifyTurn recurrenceState is mutated in place across calls", () => {
  const recurrence = makeRecurrenceState();
  const log = [makeEvent("runner.blockedOrBounced", { runnerId: "ally-0", runnerTeam: 1, attemptedCell: { x: 1, y: 1 }, reason: "wall" })];
  classifyTurn(log, null, recurrence);
  classifyTurn(log, null, recurrence);
  assert.equal(recurrence.perLevelAttempt["bounced:ally-0"], 2);
});
