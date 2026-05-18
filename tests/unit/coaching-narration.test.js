import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCoachingMessage,
  shouldShowCoachingMoment,
  computeCoachingText
} from "../../src/ui/coachingNarration.js";

// ─── Builders ─────────────────────────────────────────────────────────────────

function makeMoment(kind, metadata = {}, runnerId = "ally-0", runnerTeam = 1, turn = 1) {
  return { kind, runnerId, runnerTeam, turn, metadata };
}

function makeRecurrenceState() {
  return { counters: {}, perLevelAttempt: {}, perMatch: {} };
}

// Minimal state stub for shouldShowCoachingMoment and computeCoachingText.
// animationSpeedFactor <= 0.5 means slow-trace mode.
function makeState(overrides = {}) {
  return {
    coachingModeEnabled: true,
    lastTurnEventLog: [],
    lastBlocklyTrace: null,
    currentToolboxBlockTypes: [],
    classifierRecurrenceState: makeRecurrenceState(),
    allRunners: [],
    animationSpeedFactor: 1.0,
    showModePicker: false,
    ...overrides
  };
}

// ─── formatCoachingMessage — bounced ─────────────────────────────────────────

test("formatCoachingMessage bounced: wall obstacle", () => {
  const text = formatCoachingMessage(makeMoment("bounced", { reason: "wall" }), "Ally 0", []);
  assert.ok(text.includes("wall"), `expected 'wall' in: ${text}`);
  assert.ok(text.includes("Ally 0"));
  assert.ok(text.split(" ").length <= 25, `too long: ${text}`);
});

test("formatCoachingMessage bounced: barrier obstacle", () => {
  const text = formatCoachingMessage(makeMoment("bounced", { reason: "barrier" }), "Ally 0", []);
  assert.ok(text.includes("barrier"));
});

test("formatCoachingMessage bounced: runner collision", () => {
  const text = formatCoachingMessage(makeMoment("bounced", { reason: "runner_collision_bounce" }), "Ally 0", []);
  assert.ok(text.includes("another runner"));
});

// ─── formatCoachingMessage — resource_no_readiness_guard ─────────────────────

test("formatCoachingMessage resource guard: specific phrasing when guard block is in toolbox", () => {
  const toolbox = ["battlegorithms_if_can_jump"];
  const moment = makeMoment("resource_no_readiness_guard", {
    actionType: "JUMP_FORWARD",
    reason: "jump_exhausted",
    missingGuardBlockType: "battlegorithms_if_can_jump"
  });
  const text = formatCoachingMessage(moment, "Ally 0", toolbox);
  assert.ok(text.includes('"Can Jump?"'), `expected block name in: ${text}`);
  assert.ok(text.split(" ").length <= 25);
});

test("formatCoachingMessage resource guard: generic phrasing when guard block not in toolbox", () => {
  const moment = makeMoment("resource_no_readiness_guard", {
    actionType: "JUMP_FORWARD",
    reason: "jump_exhausted",
    missingGuardBlockType: "battlegorithms_if_can_jump"
  });
  const text = formatCoachingMessage(moment, "Ally 0", []);
  assert.ok(!text.includes('"Can Jump?"'), `should not name block when not in toolbox: ${text}`);
  assert.ok(text.includes("readiness check"), `expected generic phrase in: ${text}`);
});

test("formatCoachingMessage resource guard: freeze action uses correct label", () => {
  const toolbox = ["battlegorithms_if_area_freeze_ready"];
  const moment = makeMoment("resource_no_readiness_guard", {
    actionType: "FREEZE_OPPONENTS",
    reason: "freeze_on_cooldown",
    missingGuardBlockType: "battlegorithms_if_area_freeze_ready"
  });
  const text = formatCoachingMessage(moment, "Ally 0", toolbox);
  assert.ok(text.includes("freeze"));
  assert.ok(text.includes('"Area Freeze Ready?"'));
});

test("formatCoachingMessage resource guard: barrier action uses correct label", () => {
  const toolbox = ["battlegorithms_if_can_place_barrier"];
  const moment = makeMoment("resource_no_readiness_guard", {
    actionType: "PLACE_BARRIER_FORWARD",
    reason: "barrier_exhausted",
    missingGuardBlockType: "battlegorithms_if_can_place_barrier"
  });
  const text = formatCoachingMessage(moment, "Ally 0", toolbox);
  assert.ok(text.includes("barrier"));
  assert.ok(text.includes('"Can Place Barrier?"'));
});

// ─── formatCoachingMessage — no_action_selected ───────────────────────────────

test("formatCoachingMessage no_action_selected mentions no action", () => {
  const text = formatCoachingMessage(makeMoment("no_action_selected", { traceLength: 3 }), "Ally 0", []);
  assert.ok(text.includes("no action") || text.includes("without picking"), `unexpected: ${text}`);
  assert.ok(text.split(" ").length <= 25);
});

// ─── formatCoachingMessage — ignored_blocks_below_action ─────────────────────

test("formatCoachingMessage ignored_blocks mentions stopped at first action", () => {
  const text = formatCoachingMessage(
    makeMoment("ignored_blocks_below_action", { firstActionBlockId: "b1", ignoredActionBlockIds: ["b2"] }),
    "Ally 0", []
  );
  assert.ok(text.includes("first action"));
  assert.ok(text.split(" ").length <= 25);
});

// ─── formatCoachingMessage — recurring_pattern ───────────────────────────────

test("formatCoachingMessage recurring_pattern for bounced includes occurrence count", () => {
  const text = formatCoachingMessage(
    makeMoment("recurring_pattern", { patternKind: "bounced", occurrenceCount: 3 }),
    "Ally 0", []
  );
  assert.ok(text.includes("3") || text.includes("three"), `expected count in: ${text}`);
  assert.ok(text.split(" ").length <= 25);
});

test("formatCoachingMessage recurring_pattern for resource_no_readiness_guard", () => {
  const text = formatCoachingMessage(
    makeMoment("recurring_pattern", { patternKind: "resource_no_readiness_guard", occurrenceCount: 3 }),
    "Ally 0", []
  );
  assert.ok(text.includes("readiness") || text.includes("resource"), `unexpected: ${text}`);
});

test("formatCoachingMessage recurring_pattern for no_action_selected", () => {
  const text = formatCoachingMessage(
    makeMoment("recurring_pattern", { patternKind: "no_action_selected", occurrenceCount: 3 }),
    "Ally 0", []
  );
  assert.ok(text.includes("no action") || text.includes("action"), `unexpected: ${text}`);
});

// ─── formatCoachingMessage — runner_index_unhandled ──────────────────────────

test("formatCoachingMessage runner_index_unhandled includes the runner index when known", () => {
  const text = formatCoachingMessage(
    makeMoment("runner_index_unhandled", { runnerIndex: 2, hasIndexComparisons: true }),
    "Ally 2", []
  );
  assert.ok(text.includes("2") || text.includes("branch"), `unexpected: ${text}`);
  assert.ok(text.split(" ").length <= 25);
});

test("formatCoachingMessage runner_index_unhandled handles null runnerIndex gracefully", () => {
  const text = formatCoachingMessage(
    makeMoment("runner_index_unhandled", { runnerIndex: null, hasIndexComparisons: true }),
    "Ally 0", []
  );
  assert.ok(typeof text === "string" && text.length > 0);
});

// ─── formatCoachingMessage — unknown kind ────────────────────────────────────

test("formatCoachingMessage returns empty string for unknown kind", () => {
  const text = formatCoachingMessage(makeMoment("unknown_kind_xyz"), "Ally 0", []);
  assert.equal(text, "");
});

// ─── shouldShowCoachingMoment — cadence rules ────────────────────────────────

test("shouldShowCoachingMoment bounced: shows first time, suppresses on second call", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const moment = makeMoment("bounced", { reason: "wall" });

  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true, "first time should show");
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), false, "second time suppressed");
});

test("shouldShowCoachingMoment resource_no_readiness_guard: shows every time", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const moment = makeMoment("resource_no_readiness_guard", { actionType: "JUMP_FORWARD" });

  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true, "first time");
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true, "second time — no suppression");
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true, "third time — still shows");
});

test("shouldShowCoachingMoment no_action_selected: suppressed when not in slow-trace mode", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState({ animationSpeedFactor: 1.0 }); // fast — not slow-trace
  const moment = makeMoment("no_action_selected", { traceLength: 2 });
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), false);
});

test("shouldShowCoachingMoment no_action_selected: shows in slow-trace mode", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState({ animationSpeedFactor: 0.3 }); // slow-trace threshold is 0.5
  const moment = makeMoment("no_action_selected", { traceLength: 2 });
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true);
});

test("shouldShowCoachingMoment ignored_blocks: shows first time, suppressed second time", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const moment = makeMoment("ignored_blocks_below_action", { firstActionBlockId: "b1", ignoredActionBlockIds: ["b2"] });
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true);
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), false);
});

test("shouldShowCoachingMoment recurring_pattern: always shows", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const moment = makeMoment("recurring_pattern", { patternKind: "bounced", occurrenceCount: 3 });
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true);
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true);
});

test("shouldShowCoachingMoment runner_index_unhandled: first time shows, second suppressed", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const moment = makeMoment("runner_index_unhandled", { runnerIndex: 1, hasIndexComparisons: true });
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), true);
  assert.equal(shouldShowCoachingMoment(moment, state, recurrence), false);
});

test("shouldShowCoachingMoment tracks different runners independently", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState();
  const momentA = makeMoment("bounced", { reason: "wall" }, "ally-0");
  const momentB = makeMoment("bounced", { reason: "wall" }, "ally-1");

  assert.equal(shouldShowCoachingMoment(momentA, state, recurrence), true);
  assert.equal(shouldShowCoachingMoment(momentB, state, recurrence), true, "ally-1 is independent");
  assert.equal(shouldShowCoachingMoment(momentA, state, recurrence), false, "ally-0 suppressed");
});

// ─── computeCoachingText — integration ───────────────────────────────────────

function makeBouncedApp(animationSpeedFactor = 1.0) {
  const recurrence = makeRecurrenceState();
  const state = makeState({
    animationSpeedFactor,
    classifierRecurrenceState: recurrence,
    lastTurnEventLog: [
      {
        kind: "runner.blockedOrBounced",
        turn: 1,
        payload: {
          runnerId: "ally-0",
          runnerTeam: 1,
          attemptedCell: { x: 3, y: 4 },
          reason: "wall"
        }
      }
    ],
    lastBlocklyTrace: null,
    allRunners: [{ id: "ally-0", team: 1, isHumanControlled: false, isNPC: false, allyIndex: 0 }]
  });
  return { state };
}

test("computeCoachingText returns empty string when coaching is disabled", () => {
  const app = makeBouncedApp();
  app.state.coachingModeEnabled = false;
  assert.equal(computeCoachingText(app), "");
});

test("computeCoachingText returns coaching text for bounced moment when coaching enabled", () => {
  const app = makeBouncedApp();
  const text = computeCoachingText(app);
  assert.ok(text.includes("wall") || text.includes("bounced"), `unexpected: ${text}`);
});

test("computeCoachingText suppresses bounced on second call (cadence)", () => {
  const app = makeBouncedApp();
  const first = computeCoachingText(app);
  const second = computeCoachingText(app);
  assert.ok(first.length > 0, "first call should produce text");
  assert.equal(second, "", "second call should be cadence-suppressed");
});

test("computeCoachingText returns empty string when event log is empty", () => {
  const app = makeBouncedApp();
  app.state.lastTurnEventLog = [];
  assert.equal(computeCoachingText(app), "");
});

test("computeCoachingText uses specific phrasing when guard block is in toolbox", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState({
    classifierRecurrenceState: recurrence,
    currentToolboxBlockTypes: ["battlegorithms_if_can_jump"],
    lastTurnEventLog: [
      {
        kind: "resource.unavailable",
        turn: 1,
        payload: {
          runnerId: "ally-0",
          runnerTeam: 1,
          actionType: "JUMP_FORWARD",
          reason: "jump_exhausted"
        }
      }
    ],
    lastBlocklyTrace: {
      runnerId: "ally-0",
      runnerTeam: 1,
      turnNumber: 1,
      levelId: "test-level",
      steps: [],
      ignoredActionBlockIds: [],
      comparisonInputBlockTypes: {},
      teamAllyCount: 1,
      runnerAllyIndex: 0
    },
    allRunners: [{ id: "ally-0", team: 1, isHumanControlled: false, isNPC: false, allyIndex: 0 }]
  });
  const text = computeCoachingText({ state });
  assert.ok(text.includes('"Can Jump?"'), `expected block label in: ${text}`);
});

test("computeCoachingText uses generic phrasing when guard block not in toolbox", () => {
  const recurrence = makeRecurrenceState();
  const state = makeState({
    classifierRecurrenceState: recurrence,
    currentToolboxBlockTypes: [],
    lastTurnEventLog: [
      {
        kind: "resource.unavailable",
        turn: 1,
        payload: {
          runnerId: "ally-0",
          runnerTeam: 1,
          actionType: "JUMP_FORWARD",
          reason: "jump_exhausted"
        }
      }
    ],
    lastBlocklyTrace: {
      runnerId: "ally-0",
      runnerTeam: 1,
      turnNumber: 1,
      levelId: "test-level",
      steps: [],
      ignoredActionBlockIds: [],
      comparisonInputBlockTypes: {},
      teamAllyCount: 1,
      runnerAllyIndex: 0
    },
    allRunners: [{ id: "ally-0", team: 1, isHumanControlled: false, isNPC: false, allyIndex: 0 }]
  });
  const text = computeCoachingText({ state });
  assert.ok(!text.includes('"Can Jump?"'), `should not name block: ${text}`);
  assert.ok(text.includes("readiness check"), `expected generic: ${text}`);
});
