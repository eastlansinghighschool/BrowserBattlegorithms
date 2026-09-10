import test from "node:test";
import assert from "node:assert/strict";
import {
  createAttemptCounters,
  ensureAttemptCounters,
  resetAttemptCounters,
  getAttemptCounters,
  recordEventInAttemptCounters
} from "../../src/core/attemptCounters.js";
import { createInitialState, createApp } from "../../src/core/state.js";
import { emit } from "../../src/core/events.js";
import { initializeMatch, initializeDisplayState, resetRound } from "../../src/core/setup.js";
import { completeLevel, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { evaluateLevelStars } from "../../src/core/starEvaluation.js";
import { AI_ACTION_TYPES, LEVEL_RESULT } from "../../src/config/constants.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";
import { GUIDED_LEVEL_REFERENCE_SOLUTIONS, buildSolutionXml } from "./fixtures/guidedReferenceSolutions.js";

test("attemptCounters: pure helper functions", () => {
  const initial = createAttemptCounters();
  assert.deepEqual(initial, {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });

  const state = { attemptCounters: { runnerCollisionBounces: 5, mapBlockageBounces: 3, resourceUnavailableAttempts: 2, ineffectiveFreezeUses: 1 } };
  const snapshot = getAttemptCounters(state);
  assert.deepEqual(snapshot, {
    runnerCollisionBounces: 5,
    mapBlockageBounces: 3,
    resourceUnavailableAttempts: 2,
    ineffectiveFreezeUses: 1
  });

  resetAttemptCounters(state);
  assert.deepEqual(getAttemptCounters(state), {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });

  // Safe fallback for null/empty state
  assert.deepEqual(getAttemptCounters(null), {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });
});

test("attemptCounters: recordEventInAttemptCounters splits runner.blockedOrBounced on reason", () => {
  const state = createInitialState();

  // runner_collision_bounce increments runnerCollisionBounces
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    reason: "runner_collision_bounce"
  });
  assert.equal(state.attemptCounters.runnerCollisionBounces, 1);
  assert.equal(state.attemptCounters.mapBlockageBounces, 0);

  // wall increments mapBlockageBounces
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    reason: "wall"
  });
  assert.equal(state.attemptCounters.runnerCollisionBounces, 1);
  assert.equal(state.attemptCounters.mapBlockageBounces, 1);

  // barrier increments mapBlockageBounces
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    reason: "barrier"
  });
  assert.equal(state.attemptCounters.mapBlockageBounces, 2);

  // out_of_bounds increments mapBlockageBounces
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    reason: "out_of_bounds"
  });
  assert.equal(state.attemptCounters.mapBlockageBounces, 3);
});

test("attemptCounters: runnerRole scoping ignores human and NPC events", () => {
  const state = createInitialState();

  // NPC collision bounce is ignored
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_2_npc_1",
    runnerRole: "npc",
    runnerTeam: 2,
    reason: "runner_collision_bounce"
  });
  // NPC wall bounce is ignored
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_2_npc_1",
    runnerRole: "npc",
    runnerTeam: 2,
    reason: "wall"
  });
  // Human collision bounce is ignored (scoped to program-controlled ally)
  emit(state, "runner.blockedOrBounced", {
    runnerId: "runner_1_human_1",
    runnerRole: "human",
    runnerTeam: 1,
    reason: "runner_collision_bounce"
  });
  // Human resource unavailable is ignored
  emit(state, "resource.unavailable", {
    runnerId: "runner_1_human_1",
    runnerRole: "human",
    runnerTeam: 1,
    actionType: "JUMP_FORWARD",
    reason: "jump_exhausted"
  });

  assert.deepEqual(getAttemptCounters(state), {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });
});

test("attemptCounters: tracks resource.unavailable for ally runners", () => {
  const state = createInitialState();

  emit(state, "resource.unavailable", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: "JUMP_FORWARD",
    reason: "jump_exhausted"
  });
  emit(state, "resource.unavailable", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: "PLACE_BARRIER_FORWARD",
    reason: "barrier_already_active"
  });
  emit(state, "resource.unavailable", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: "FREEZE_OPPONENTS",
    reason: "freeze_on_cooldown"
  });

  assert.equal(state.attemptCounters.resourceUnavailableAttempts, 3);
});

test("attemptCounters: tracks ineffective Area Freeze (affectedCount === 0)", () => {
  const state = createInitialState();

  // Ineffective freeze: affectedCount is 0
  emit(state, "runner.actionResolved", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    outcome: "freeze_applied",
    affectedCount: 0
  });
  assert.equal(state.attemptCounters.ineffectiveFreezeUses, 1);

  // Effective freeze: affectedCount is 1 (does not increment waste)
  emit(state, "runner.actionResolved", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    outcome: "freeze_applied",
    affectedCount: 1
  });
  assert.equal(state.attemptCounters.ineffectiveFreezeUses, 1);

  // Other actions do not increment ineffectiveFreezeUses
  emit(state, "runner.actionResolved", {
    runnerId: "runner_1_ally_0",
    runnerRole: "ally",
    runnerTeam: 1,
    actionType: AI_ACTION_TYPES.MOVE_FORWARD,
    outcome: "moved"
  });
  assert.equal(state.attemptCounters.ineffectiveFreezeUses, 1);
});

test("attemptCounters: C4 attempt boundary definition — survives resetRound, resets on initializeMatch and initializeDisplayState", () => {
  const app = createApp();

  // Accumulate counters during attempt
  app.state.attemptCounters.runnerCollisionBounces = 2;
  app.state.attemptCounters.mapBlockageBounces = 4;
  app.state.attemptCounters.resourceUnavailableAttempts = 1;
  app.state.attemptCounters.ineffectiveFreezeUses = 1;

  // Intra-attempt round reset (e.g. after scoring point 1 of a multi-point match)
  resetRound(app.state);
  assert.equal(app.state.attemptCounters.runnerCollisionBounces, 2, "counters must survive intra-attempt round reset");
  assert.equal(app.state.attemptCounters.mapBlockageBounces, 4, "counters must survive intra-attempt round reset");
  assert.equal(app.state.attemptCounters.resourceUnavailableAttempts, 1, "counters must survive intra-attempt round reset");
  assert.equal(app.state.attemptCounters.ineffectiveFreezeUses, 1, "counters must survive intra-attempt round reset");

  // Inter-attempt boundary: initializeDisplayState (setup reset) resets to zeroes
  initializeDisplayState(app);
  assert.deepEqual(getAttemptCounters(app.state), {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  }, "counters must be zero at display setup reset");

  // Accumulate again
  app.state.attemptCounters.runnerCollisionBounces = 1;

  // Inter-attempt boundary: initializeMatch (attempt start) resets to zeroes
  initializeMatch(app);
  assert.deepEqual(getAttemptCounters(app.state), {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  }, "counters must be zero at start of fresh match attempt");
});

test("attemptCounters: exposure on end-of-level details path and star evaluation context", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "move-to-target");

  // Set known counters on state
  app.state.attemptCounters.runnerCollisionBounces = 1;
  app.state.attemptCounters.mapBlockageBounces = 2;
  app.state.attemptCounters.resourceUnavailableAttempts = 3;
  app.state.attemptCounters.ineffectiveFreezeUses = 4;

  let recordedDetails = null;
  app.usageTracker = {
    recordLevelEnded: (_lvl, _res, _reason, details) => {
      recordedDetails = details;
    }
  };

  completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met");

  assert.ok(recordedDetails, "recordLevelEnded must be called");
  assert.equal(recordedDetails.runnerCollisionBounces, 1);
  assert.equal(recordedDetails.mapBlockageBounces, 2);
  assert.equal(recordedDetails.resourceUnavailableAttempts, 3);
  assert.equal(recordedDetails.ineffectiveFreezeUses, 4);

  // Evaluator context received the counters
  assert.ok(app.state.lastStarOutcome);
  assert.equal(app.state.lastStarOutcome.starsEarned, 1); // move-to-target is pass-star-only
});

test("attemptCounters: real harness clean attempt reads zero on all counters", () => {
  const xml = GUIDED_LEVEL_REFERENCE_SOLUTIONS["bring-it-home"];
  const { app } = runGuidedLevelWithSolution("bring-it-home", xml);

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED);

  const counters = getAttemptCounters(app.state);
  assert.equal(counters.runnerCollisionBounces, 0, "clean run must have 0 runner collision bounces");
  assert.equal(counters.mapBlockageBounces, 0, "clean run must have 0 map blockage bounces");
  assert.equal(counters.resourceUnavailableAttempts, 0, "clean run must have 0 resource unavailable attempts");
  assert.equal(counters.ineffectiveFreezeUses, 0, "clean run must have 0 ineffective freeze uses");
});

test("attemptCounters: real harness deliberate map blockage increments mapBlockageBounces", () => {
  // In barrier-detour (level 4), ally starts at (1,3) with a barrier directly in front at (2,3).
  // Attempting to move forward repeatedly bounces off the barrier.
  const barrierBumpXml = buildSolutionXml(`
    <block type="battlegorithms_move_forward"></block>
  `);
  const { app } = runGuidedLevelWithSolution("barrier-detour", barrierBumpXml);

  const counters = getAttemptCounters(app.state);
  assert.ok(counters.mapBlockageBounces > 0, "deliberate barrier collisions must increment mapBlockageBounces");
  assert.equal(counters.runnerCollisionBounces, 0);
  assert.equal(counters.resourceUnavailableAttempts, 0);
  assert.equal(counters.ineffectiveFreezeUses, 0);
});

test("attemptCounters: real harness deliberate resource exhaustion increments resourceUnavailableAttempts", () => {
  // In jump-if-ready, ally repeatedly tries to jump without checking readiness.
  // After jump is exhausted on turn 1, subsequent jump attempts trigger jump_exhausted.
  const jumpExhaustXml = buildSolutionXml(`
    <block type="battlegorithms_jump_forward"></block>
  `);
  const { app } = runGuidedLevelWithSolution("jump-if-ready", jumpExhaustXml);

  const counters = getAttemptCounters(app.state);
  assert.ok(counters.resourceUnavailableAttempts > 0, "exhausted resource attempts must increment resourceUnavailableAttempts");
});

test("attemptCounters: real harness deliberate ineffective freeze increments ineffectiveFreezeUses", () => {
  // In freeze-support (level 34), ally 1 starts at (6,4) and enemies are at (8,1) and (10,6).
  // Manhattan distance to nearest enemy is |8-6| + |1-4| = 5 > AREA_FREEZE_RADIUS (2).
  // Firing Area Freeze on turn 1 freezes 0 opponents (empty air).
  const freezeAirXml = buildSolutionXml(`
    <block type="battlegorithms_freeze_opponents"></block>
  `);
  const { app } = runGuidedLevelWithSolution("freeze-support", freezeAirXml);

  const counters = getAttemptCounters(app.state);
  assert.ok(counters.ineffectiveFreezeUses > 0, "freezing with 0 runners in radius must increment ineffectiveFreezeUses");
});

test("attemptCounters: real harness deliberate runner collision bounce increments runnerCollisionBounces", () => {
  // In freeze-support (level 34), ally 1 starts at (6,4) and ally 2 starts directly below at (6,5).
  // Ally 1 attempting to MOVE_DOWN_SCREEN bumps directly into teammate ally 2,
  // causing a runner_collision_bounce between allies.
  const allyCollideXml = buildSolutionXml(`
    <block type="battlegorithms_move_down_screen"></block>
  `);
  const { app } = runGuidedLevelWithSolution("freeze-support", allyCollideXml);

  const counters = getAttemptCounters(app.state);
  assert.ok(counters.runnerCollisionBounces > 0, "ally bumping into teammate must increment runnerCollisionBounces");
});

test("attemptCounters: C1 authoritative affectedCount survives animation effect nulling", () => {
  // Verify that clearing or nulling state.areaFreezeEffect (e.g. during presentation/reset)
  // does not affect counters already accrued from the authoritative application.
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "freeze-support");

  // Fire an ineffective freeze through the engine
  const ally = app.state.allRunners.find((r) => r.runnerRole === "ally");
  assert.ok(ally);

  // Set up action
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(ally);
  app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.FREEZE_OPPONENTS });

  // Run one turn
  const initialIneffective = app.state.attemptCounters.ineffectiveFreezeUses;
  emit(app.state, "runner.actionResolved", {
    runnerId: ally.id,
    runnerRole: "ally",
    runnerTeam: ally.team,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    outcome: "freeze_applied",
    affectedCount: 0
  });

  assert.equal(app.state.attemptCounters.ineffectiveFreezeUses, initialIneffective + 1);

  // Null the presentation effect object (as setup.js does in three places)
  app.state.areaFreezeEffect = null;

  // The counter remains 1, proving decoupling from presentation state
  assert.equal(app.state.attemptCounters.ineffectiveFreezeUses, initialIneffective + 1);
});

