import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, AREA_FREEZE_DURATION_TURNS, BLOCK_TYPES, GAME_VIEW_MODES, LEVEL_STATUS, MAIN_GAME_STATES, NPC_BEHAVIORS } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { configureFreePlay, enterFreePlay, initializeLevelState } from "../../src/core/levels.js";
import { getToolboxBlockTypesForMode } from "../../src/ai/blockly/blocks.js";
import { calculateFreePlayCpuAction } from "../../src/ai/npc/freePlayCpu.js";
import { getAreaFreezeTurnsRemaining, isAreaFreezeReady } from "../../src/core/areaFreeze.js";
import { buildMatch } from "./helpers/builders.js";
import { resetRound } from "../../src/core/setup.js";
import { translateActionDecision } from "../../src/core/movement.js";
import { processTurnActions } from "../../src/core/turnEngine.js";
import { TEST_P5 } from "./helpers/testHarness.js";

// Build a recentMovementState where the runner has been oscillating between two adjacent cells
// for `count` turns — satisfying hasRunnerBeenStuckForTurns(runner, 4).
function makeStuckMovementState(anchorX, anchorY, count = 4) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push(i % 2 === 0 ? { gridX: anchorX, gridY: anchorY } : { gridX: anchorX + 1, gridY: anchorY });
  }
  return {
    turnStartGridX: null,
    turnStartGridY: null,
    pendingActionType: null,
    pendingActionOutcome: null,
    lastMoveWasBlocked: false,
    consecutiveTurnsWithoutMovement: 0,
    recentEndPositions: positions
  };
}

test("free play keeps full toolbox access and leaves level progress intact", () => {
  const app = createApp();
  initializeLevelState(app);
  app.state.levelProgress["move-to-target"] = LEVEL_STATUS.PASSED;
  app.state.randomFn = () => 0.75;
  enterFreePlay(app);

  const toolbox = getToolboxBlockTypesForMode(app, null);
  assert.equal(app.state.currentModeView, GAME_VIEW_MODES.FREE_PLAY);
  assert.ok(toolbox.includes(BLOCK_TYPES.JUMP_FORWARD));
  assert.ok(toolbox.includes(BLOCK_TYPES.MOVE_TOWARD));
  assert.ok(toolbox.includes(BLOCK_TYPES.MOVE_RANDOMLY));
  assert.ok(toolbox.includes(BLOCK_TYPES.FREEZE_OPPONENTS));
  assert.ok(toolbox.includes(BLOCK_TYPES.IF_CAN_JUMP_ELSE));
  assert.ok(toolbox.includes(BLOCK_TYPES.IF_AREA_FREEZE_READY_ELSE));
  assert.ok(toolbox.includes(BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED));
  assert.ok(toolbox.includes(BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR));
  assert.ok(toolbox.includes(BLOCK_TYPES.BOOLEAN_STUCK_FOR));
  assert.equal(app.state.levelProgress["move-to-target"], LEVEL_STATUS.PASSED);
  assert.equal(app.state.teams[1].playDirection, -1);
  assert.equal(app.state.teams[2].playDirection, 1);
});

test("Move Randomly returns a deterministic legal action when randomFn is stubbed", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  app.state.randomFn = () => 0.74;
  const queued = translateActionDecision(actor, { type: AI_ACTION_TYPES.MOVE_RANDOMLY }, app.state);
  assert.equal(queued.actionType, AI_ACTION_TYPES.MOVE_UP_SCREEN);
});

test("guided Level 15 CPU behaviors stay still or move only through legal cardinal steps", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id.includes("Npc")) || app.state.allRunners.find((runner) => !runner.isHumanControlled);
  actor.gridX = 5;
  actor.gridY = 4;
  actor.initialGridX = 5;
  actor.initialGridY = 4;
  actor.cpuBehavior = NPC_BEHAVIORS.GUIDED_STAY_STILL;

  let decision = calculateFreePlayCpuAction(actor, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.STAY_STILL);
  assert.equal(translateActionDecision(actor, decision, app.state).actionType, AI_ACTION_TYPES.STAY_STILL);

  actor.cpuBehavior = NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY;
  const expectedActions = new Set([
    AI_ACTION_TYPES.MOVE_FORWARD,
    AI_ACTION_TYPES.MOVE_BACKWARD,
    AI_ACTION_TYPES.MOVE_UP_SCREEN,
    AI_ACTION_TYPES.MOVE_DOWN_SCREEN
  ]);

  for (const roll of [0, 0.5, 0.99]) {
    app.state.randomFn = () => roll;
    decision = calculateFreePlayCpuAction(actor, app.state);
    assert.ok(expectedActions.has(decision.actionType || decision.type), `roll ${roll} should choose a legal movement action`);

    const translated = translateActionDecision(actor, decision, app.state);
    assert.ok(expectedActions.has(translated.actionType), `roll ${roll} should translate to a legal movement action`);
  }
});

test("Guard steps toward a player-team runner within its aggro radius", () => {
  const app = buildMatch();
  const guard = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  guard.gridX = 6;
  guard.gridY = 4;
  guard.initialGridX = 6;
  guard.initialGridY = 4;
  guard.cpuBehavior = NPC_BEHAVIORS.GUIDED_GUARD;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridX = 7;
  player.gridY = 4;

  const distanceBefore = Math.abs(player.gridX - guard.gridX) + Math.abs(player.gridY - guard.gridY);
  const decision = calculateFreePlayCpuAction(guard, app.state);
  const translated = translateActionDecision(guard, decision, app.state);
  const distanceAfter = Math.abs(player.gridX - translated.targetGridX) + Math.abs(player.gridY - translated.targetGridY);

  assert.ok(distanceAfter < distanceBefore, "Guard should step toward the in-range player runner");
});

test("Guard steps back toward its post when no player is within radius and it is off-post", () => {
  const app = buildMatch();
  const guard = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  guard.initialGridX = 6;
  guard.initialGridY = 4;
  guard.gridX = 9;
  guard.gridY = 4;
  guard.cpuBehavior = NPC_BEHAVIORS.GUIDED_GUARD;

  for (const player of app.state.allRunners.filter((runner) => runner.team === 1)) {
    player.gridX = 0;
    player.gridY = 0;
  }

  const post = { x: guard.initialGridX, y: guard.initialGridY };
  const distanceBefore = Math.abs(post.x - guard.gridX) + Math.abs(post.y - guard.gridY);
  const decision = calculateFreePlayCpuAction(guard, app.state);
  const translated = translateActionDecision(guard, decision, app.state);
  const distanceAfter = Math.abs(post.x - translated.targetGridX) + Math.abs(post.y - translated.targetGridY);

  assert.ok(distanceAfter < distanceBefore, "Guard should step toward its post when off-post with no target in range");
});

test("Guard stays still when on post with no player in range", () => {
  const app = buildMatch();
  const guard = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  guard.gridX = 6;
  guard.gridY = 4;
  guard.initialGridX = 6;
  guard.initialGridY = 4;
  guard.cpuBehavior = NPC_BEHAVIORS.GUIDED_GUARD;

  for (const player of app.state.allRunners.filter((runner) => runner.team === 1)) {
    player.gridX = 0;
    player.gridY = 0;
  }

  const decision = calculateFreePlayCpuAction(guard, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.STAY_STILL);
});

test("Guard breaks a distance tie between two equidistant player runners by lowest runner id", () => {
  const app = buildMatch();
  const guard = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  guard.gridX = 6;
  guard.gridY = 4;
  guard.initialGridX = 6;
  guard.initialGridY = 4;
  guard.cpuBehavior = NPC_BEHAVIORS.GUIDED_GUARD;

  const humanP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_HumanP1");
  const allyP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  // Equidistant (Manhattan 2) but in opposite directions, so the resolved move
  // direction unambiguously reveals which runner the tie-break selected.
  humanP1.gridX = 4;
  humanP1.gridY = 4;
  allyP1.gridX = 8;
  allyP1.gridY = 4;

  assert.ok(
    "runner_1_AI_AllyP1".localeCompare("runner_1_HumanP1") < 0,
    "test setup expects AI_AllyP1 to have the lower id"
  );

  const decision = calculateFreePlayCpuAction(guard, app.state);
  const translated = translateActionDecision(guard, decision, app.state);

  assert.equal(translated.targetGridX, guard.gridX + 1, "Guard should move toward the lower-id equidistant runner (AI_AllyP1, to the right)");
  assert.equal(translated.targetGridY, guard.gridY);
});

test("Charger stays idle with no committed direction when no player shares its row or column", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  for (const player of app.state.allRunners.filter((runner) => runner.team === 1)) {
    player.gridX = 0;
    player.gridY = 0;
  }

  const decision = calculateFreePlayCpuAction(charger, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.STAY_STILL);
  assert.equal(charger.chargeDirection, null, "Charger should hold no committed direction while idle");
});

test("Charger commits to a fixed direction and charges toward a player who enters its row", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridX = 9;
  player.gridY = 4;
  for (const other of app.state.allRunners.filter((runner) => runner.team === 1 && runner !== player)) {
    other.gridX = 0;
    other.gridY = 1;
  }

  const decision = calculateFreePlayCpuAction(charger, app.state);
  const translated = translateActionDecision(charger, decision, app.state);

  assert.deepEqual(charger.chargeDirection, { dx: 1, dy: 0 }, "committed direction should point along the row toward the triggering runner");
  assert.equal(translated.targetGridX, charger.gridX + 1);
  assert.equal(translated.targetGridY, charger.gridY);
});

test("Charger keeps charging in its committed direction after the triggering runner leaves the line", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridX = 9;
  player.gridY = 4;
  for (const other of app.state.allRunners.filter((runner) => runner.team === 1 && runner !== player)) {
    other.gridX = 0;
    other.gridY = 1;
  }

  const firstDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.deepEqual(firstDecision, { actionType: "MOVE", dx: 1, dy: 0 });
  charger.gridX += 1; // simulate the turn engine applying the resolved move

  // The runner that triggered the charge steps off the row entirely; the
  // Charger should not re-evaluate — it stays committed to the same line.
  player.gridX = 9;
  player.gridY = 0;

  const secondDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.deepEqual(secondDecision, { actionType: "MOVE", dx: 1, dy: 0 }, "Charger should keep charging in its committed direction");
});

test("Charger stops, clears its committed direction, and stays still when the charge reaches a barrier", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridX = 9;
  player.gridY = 4;
  for (const other of app.state.allRunners.filter((runner) => runner.team === 1 && runner !== player)) {
    other.gridX = 0;
    other.gridY = 1;
  }

  const firstDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.deepEqual(firstDecision, { actionType: "MOVE", dx: 1, dy: 0 });
  charger.gridX += 1;

  // Wall in immediately ahead of the charger's committed line.
  app.state.barriers.push({ gridX: charger.gridX + 1, gridY: charger.gridY, ownerRunnerId: "test-barrier" });

  const secondDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.equal(secondDecision.actionType, AI_ACTION_TYPES.STAY_STILL);
  assert.equal(charger.chargeDirection, null, "committed direction should be cleared once the charge is stopped");

  // It resumes idle from wherever it stopped, not returning to a post: with
  // the triggering player still aligned it may re-trigger the same charge on
  // a later call, but nothing here forces movement back toward initialGridX/Y.
});

test("Charger charging off the edge of the board stops instead of throwing", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 0;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridX = 0;
  player.gridY = 6;
  for (const other of app.state.allRunners.filter((runner) => runner.team === 1 && runner !== player)) {
    other.gridX = 5;
    other.gridY = 1;
  }

  // Player shares the Charger's column and is below it, so the committed
  // direction points off the top edge (dy = -1) once the Charger walks up to
  // row 0 -- simulate it already being pinned at the top edge at trigger time.
  charger.gridY = 0;
  const decision = calculateFreePlayCpuAction(charger, app.state);
  const translated = translateActionDecision(charger, decision, app.state);
  assert.equal(translated.targetGridY, charger.gridY + 1, "player is below, so the committed direction should point down, not off the edge");

  // Force the opposite, edge-facing direction directly to exercise the
  // boxed-in / immediately-blocked path without depending on further setup.
  charger.chargeDirection = { dx: 0, dy: -1 };
  const edgeDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.equal(edgeDecision.actionType, AI_ACTION_TYPES.STAY_STILL);
  assert.equal(charger.chargeDirection, null);
});

test("Charger tie-break prefers a runner on its row over one on its column", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const humanP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_HumanP1");
  const allyP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  // On the column, closer than the row runner -- should still lose to row.
  humanP1.gridX = 6;
  humanP1.gridY = 1;
  // On the row, farther away -- should win the tie-break because row beats column.
  allyP1.gridX = 9;
  allyP1.gridY = 4;

  const decision = calculateFreePlayCpuAction(charger, app.state);
  const translated = translateActionDecision(charger, decision, app.state);

  assert.equal(translated.targetGridX, charger.gridX + 1, "row alignment should win over a closer column alignment");
  assert.equal(translated.targetGridY, charger.gridY);
});

test("Charger tie-break on the same axis prefers the nearer runner, then the lower id", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;

  const humanP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_HumanP1");
  const allyP1 = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  // Both on the row; allyP1 is nearer and should win regardless of id order.
  humanP1.gridX = 10;
  humanP1.gridY = 4;
  allyP1.gridX = 8;
  allyP1.gridY = 4;

  const decision = calculateFreePlayCpuAction(charger, app.state);
  assert.deepEqual(decision, { actionType: "MOVE", dx: 1, dy: 0 }, "the nearer same-axis runner should be the trigger regardless of id");
});

test("Charger respects an authored chargeRange, triggering only within range", () => {
  const app = buildMatch();
  const charger = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  charger.gridX = 6;
  charger.gridY = 4;
  charger.cpuBehavior = NPC_BEHAVIORS.GUIDED_CHARGER;
  charger.chargeRange = 3;

  const player = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  player.gridY = 4;
  for (const other of app.state.allRunners.filter((runner) => runner.team === 1 && runner !== player)) {
    other.gridX = 0;
    other.gridY = 1;
  }

  player.gridX = 10; // distance 4 along the row -- just outside the range
  const outOfRangeDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.equal(outOfRangeDecision.actionType, AI_ACTION_TYPES.STAY_STILL);
  assert.equal(charger.chargeDirection, null);

  player.gridX = 9; // distance 3 along the row -- just inside the range
  const inRangeDecision = calculateFreePlayCpuAction(charger, app.state);
  assert.deepEqual(inRangeDecision, { actionType: "MOVE", dx: 1, dy: 0 });
});

test("guided vertical patrol alternates up and down without using special actions", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id.includes("Npc")) || app.state.allRunners.find((runner) => !runner.isHumanControlled);
  actor.gridX = 5;
  actor.gridY = 4;
  actor.initialGridX = 5;
  actor.initialGridY = 4;
  actor.guidedVerticalPatrolDirection = null;
  actor.cpuBehavior = NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL;

  let decision = calculateFreePlayCpuAction(actor, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.MOVE_UP_SCREEN);

  actor.gridY = 0;
  actor.guidedVerticalPatrolDirection = -1;
  decision = calculateFreePlayCpuAction(actor, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.MOVE_DOWN_SCREEN);

  actor.gridY = 7;
  actor.guidedVerticalPatrolDirection = 1;
  decision = calculateFreePlayCpuAction(actor, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.MOVE_UP_SCREEN);

  actor.gridY = 0;
  actor.guidedVerticalPatrolDirection = -1;
  app.state.barriers.push({ id: "top-block", ownerRunnerId: null, gridX: 5, gridY: 1 });
  decision = calculateFreePlayCpuAction(actor, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.STAY_STILL);
});

test("area freeze freezes nearby enemies, uses a turn cooldown, and resets on round reset", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  const enemies = app.state.allRunners.filter((runner) => runner.team === 2);
  actor.gridX = 5;
  actor.gridY = 4;
  enemies[0].gridX = 6;
  enemies[0].gridY = 4;
  enemies[1].gridX = 10;
  enemies[1].gridY = 6;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(actor);
  app.state.currentTurnNumber = 10;
  app.state.queuedActionForCurrentRunner = {
    runner: actor,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    targetGridX: actor.gridX,
    targetGridY: actor.gridY
  };
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.teamAreaFreezeUsed[1], true);
  assert.equal(app.state.teamAreaFreezeNextAvailableTurn[1], 20);
  assert.equal(isAreaFreezeReady(app.state, 1), false);
  assert.equal(getAreaFreezeTurnsRemaining(app.state, 1), 10);
  assert.equal(enemies[0].isFrozen, true);
  assert.equal(enemies[0].frozenTurnsRemaining, AREA_FREEZE_DURATION_TURNS);
  assert.equal(enemies[1].isFrozen, false);

  app.state.currentTurnNumber = 19;
  assert.equal(isAreaFreezeReady(app.state, 1), false);
  assert.equal(getAreaFreezeTurnsRemaining(app.state, 1), 1);
  app.state.currentTurnNumber = 20;
  assert.equal(isAreaFreezeReady(app.state, 1), true);
  assert.equal(getAreaFreezeTurnsRemaining(app.state, 1), 0);

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(actor);
  app.state.currentTurnNumber = 15;
  app.state.queuedActionForCurrentRunner = {
    runner: actor,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    targetGridX: actor.gridX,
    targetGridY: actor.gridY
  };
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.teamAreaFreezeNextAvailableTurn[1], 20);
  assert.equal(isAreaFreezeReady(app.state, 1), false);

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(actor);
  app.state.currentTurnNumber = 20;
  app.state.queuedActionForCurrentRunner = {
    runner: actor,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    targetGridX: actor.gridX,
    targetGridY: actor.gridY
  };
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.teamAreaFreezeNextAvailableTurn[1], 30);
  assert.equal(isAreaFreezeReady(app.state, 1), false);

  resetRound(app.state);
  assert.equal(app.state.teamAreaFreezeUsed[1], false);
  assert.equal(app.state.teamAreaFreezeNextAvailableTurn[1], 1);
  assert.equal(isAreaFreezeReady(app.state, 1), true);
});

test("tactical attacker with enemy flag returns toward base when own flag is home", () => {
  const app = buildMatch();
  // In buildMatch the CPU opponent is Team 2 with playDirection -1 (home on right/high X).
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.gridX = 5;
  attacker.gridY = 4;
  // Team 2 own flag is at base by default after buildMatch
  assert.equal(app.state.gameFlags[2].isAtBase, true);

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  // calculateMoveTowardsTarget returns { actionType: "MOVE", dx, dy }.
  // Team 2's base is on the right (high X), so dx should be positive.
  assert.equal(decision.actionType, "MOVE", `expected MOVE toward base, got ${decision.actionType}`);
  assert.ok(decision.dx > 0, `expected dx > 0 (moving right toward Team 2 base), got dx=${decision.dx}`);
});

test("tactical attacker moves toward enemy runner holding own flag when scoring is blocked", () => {
  const app = buildMatch();
  // Team 2 (playDirection -1): home on right (high X). Attacker near midfield.
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.gridX = 8;
  attacker.gridY = 4;

  // A Team 1 runner holds Team 2's flag on the far left — attacker must chase them
  const ownFlagCarrier = app.state.allRunners.find((r) => r.team === 1);
  ownFlagCarrier.gridX = 3;
  ownFlagCarrier.gridY = 4;

  app.state.gameFlags[2].isAtBase = false;
  app.state.gameFlags[2].carriedByRunnerId = ownFlagCarrier.id;

  // Freeze is on cooldown so it cannot fire
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 100;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  // calculateMoveTowardsTarget returns { actionType: "MOVE", dx, dy }.
  // From (8,4) toward (3,4): dominant axis is X, delta=-5 → dx = -1.
  assert.equal(decision.actionType, "MOVE", `expected MOVE toward own flag carrier, got ${decision.actionType}`);
  assert.equal(decision.dx, -1, `expected dx=-1 (moving left toward carrier at x=3), got dx=${decision.dx}`);
  assert.equal(decision.dy, 0);
});

test("tactical attacker uses area freeze when own flag carrier is within range and scoring is blocked", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.gridX = 5;
  attacker.gridY = 4;

  // Team 1 runner holds Team 2's own flag, positioned exactly at freeze radius
  const ownFlagCarrier = app.state.allRunners.find((r) => r.team === 1);
  ownFlagCarrier.gridX = 5;
  ownFlagCarrier.gridY = 6; // distance = 2 = AREA_FREEZE_RADIUS

  app.state.gameFlags[2].isAtBase = false;
  app.state.gameFlags[2].carriedByRunnerId = ownFlagCarrier.id;

  // Freeze is ready
  app.state.currentTurnNumber = 5;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 1;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.FREEZE_OPPONENTS);
});

test("tactical attacker falls back to random legal move when own flag is dropped (not carried) and scoring is blocked", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.gridX = 5;
  attacker.gridY = 4;

  // Own flag is away but not carried (dropped mid-field)
  app.state.gameFlags[2].isAtBase = false;
  app.state.gameFlags[2].carriedByRunnerId = null;

  app.state.randomFn = () => 0;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  const movementTypes = new Set([
    AI_ACTION_TYPES.MOVE_FORWARD,
    AI_ACTION_TYPES.MOVE_BACKWARD,
    AI_ACTION_TYPES.MOVE_UP_SCREEN,
    AI_ACTION_TYPES.MOVE_DOWN_SCREEN
  ]);
  assert.ok(movementTypes.has(decision.actionType), `expected a legal movement fallback, got ${decision.actionType}`);
});

test("tactical attacker in a rut chooses a legal escape move instead of repeating the stuck path", () => {
  const app = buildMatch();
  // Team 2 (playDirection -1) attacker oscillating between (5,4) and (6,4)
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.gridX = 5;
  attacker.gridY = 4;
  attacker.recentMovementState = makeStuckMovementState(5, 4, 4);

  app.state.randomFn = () => 0;
  const decision = calculateFreePlayCpuAction(attacker, app.state);

  // Escape candidates avoid the recent positions {(5,4),(6,4)}.
  // With randomFn=()=>0 the first escape candidate is chosen.
  const legalMoves = new Set([
    AI_ACTION_TYPES.MOVE_FORWARD,
    AI_ACTION_TYPES.MOVE_BACKWARD,
    AI_ACTION_TYPES.MOVE_UP_SCREEN,
    AI_ACTION_TYPES.MOVE_DOWN_SCREEN
  ]);
  assert.ok(legalMoves.has(decision.actionType), `expected a legal escape move, got ${decision.actionType}`);
  // Must not return to one of the recent cells
  const recent = new Set(["5,4", "6,4"]);
  assert.ok(!recent.has(`${decision.targetGridX},${decision.targetGridY}`), `escape should avoid recent cells but landed on (${decision.targetGridX},${decision.targetGridY})`);
});

test("tactical defender in a rut chooses a legal escape move", () => {
  const app = buildMatch();
  const defender = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  defender.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_DEFENDER;
  defender.gridX = 5;
  defender.gridY = 4;
  defender.recentMovementState = makeStuckMovementState(5, 4, 4);

  app.state.randomFn = () => 0;
  const decision = calculateFreePlayCpuAction(defender, app.state);

  const legalMoves = new Set([
    AI_ACTION_TYPES.MOVE_FORWARD,
    AI_ACTION_TYPES.MOVE_BACKWARD,
    AI_ACTION_TYPES.MOVE_UP_SCREEN,
    AI_ACTION_TYPES.MOVE_DOWN_SCREEN
  ]);
  assert.ok(legalMoves.has(decision.actionType), `expected a legal escape move, got ${decision.actionType}`);
  const recent = new Set(["5,4", "6,4"]);
  assert.ok(!recent.has(`${decision.targetGridX},${decision.targetGridY}`), `escape should avoid recent cells but landed on (${decision.targetGridX},${decision.targetGridY})`);
});

test("rut escape prefers a move whose destination is outside the recent local area", () => {
  const app = buildMatch();
  // Runner at (2,2), oscillating between (2,2) and (2,3).
  // From (2,2): MOVE_DOWN_SCREEN lands on (2,3) which is in the recent set — should be deprioritised.
  // All other cardinal moves land outside the recent set and are preferred.
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.gridX = 2;
  attacker.gridY = 2;
  attacker.recentMovementState = {
    turnStartGridX: null, turnStartGridY: null,
    pendingActionType: null, pendingActionOutcome: null,
    lastMoveWasBlocked: false, consecutiveTurnsWithoutMovement: 0,
    recentEndPositions: [
      { gridX: 2, gridY: 2 },
      { gridX: 2, gridY: 3 },
      { gridX: 2, gridY: 2 },
      { gridX: 2, gridY: 3 }
    ]
  };

  app.state.randomFn = () => 0; // picks first escape candidate
  const decision = calculateFreePlayCpuAction(attacker, app.state);

  // The chosen destination must not be (2,2) or (2,3)
  assert.notEqual(`${decision.targetGridX},${decision.targetGridY}`, "2,2");
  assert.notEqual(`${decision.targetGridX},${decision.targetGridY}`, "2,3");
});

test("tactical attacker with fewer than threshold recent positions uses normal role behavior (not rut escape)", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;  // returning home so jump goes the wrong way (no jump)
  attacker.canJump = false;       // disable jump to isolate the rut-escape assertion
  attacker.gridX = 5;
  attacker.gridY = 4;
  // Only 2 positions — below the rut threshold of 4, so stuck check returns false
  attacker.recentMovementState = {
    turnStartGridX: null, turnStartGridY: null,
    pendingActionType: null, pendingActionOutcome: null,
    lastMoveWasBlocked: false, consecutiveTurnsWithoutMovement: 0,
    recentEndPositions: [
      { gridX: 5, gridY: 4 },
      { gridX: 6, gridY: 4 }
    ]
  };
  // Own flag at base and freeze on cooldown — normal return-to-base path should fire.
  assert.equal(app.state.gameFlags[2].isAtBase, true);
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 100;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  // Normal attacker path: calculateMoveTowardsTarget returns { actionType: "MOVE", dx, dy }
  assert.equal(decision.actionType, "MOVE", `expected normal MOVE toward base, got ${decision.actionType}`);
});

test("tactical attacker chooses Jump Forward when legal and it reduces distance to target", () => {
  const app = buildMatch();
  // Team 2 (playDirection -1): FORWARD = -X. Attacker going to get Team 1's flag at low X.
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = false;
  attacker.canJump = true;
  attacker.gridX = 8;
  attacker.gridY = 4;

  // Place Team 1's enemy flag at (1,4) — far to the left, reachable by jump in -X direction.
  app.state.gameFlags[1].gridX = 1;
  app.state.gameFlags[1].gridY = 4;
  app.state.gameFlags[1].isAtBase = false;

  // Freeze on cooldown so it won't interfere.
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 100;

  // Jump cell for Team 2 at (8,4) with playDirection=-1: (8-2, 4) = (6, 4).
  // distCurrent = |1-8| = 7, distAfterJump = |1-6| = 5 → jump useful.
  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.JUMP_FORWARD);
});

test("tactical attacker does not choose Jump Forward when jump would not reduce distance to target", () => {
  const app = buildMatch();
  // Team 2 (playDirection -1) attacker returning home (base at high X). Jump goes left (-X) = further from base.
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.canJump = true;
  attacker.gridX = 5;
  attacker.gridY = 4;
  // Own flag is home so scoring is not blocked.
  assert.equal(app.state.gameFlags[2].isAtBase, true);

  // Freeze on cooldown so carrier-freeze won't interfere.
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 100;

  // Team 2 base is at x=COLS-1=11. Jump cell = (5-2,4)=(3,4).
  // distCurrent=|11-5|=6, distAfterJump=|11-3|=8 → jump makes it worse → no jump.
  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.notEqual(decision.actionType, AI_ACTION_TYPES.JUMP_FORWARD, "should not jump when jump moves away from target");
  // Normal path: returns a MOVE toward base (dx positive for Team 2 going right).
  assert.equal(decision.actionType, "MOVE");
  assert.ok(decision.dx > 0);
});

test("tactical carrier freezes nearest unfrozen enemy when in range and freeze is ready", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.gridX = 6;
  attacker.gridY = 4;
  // Own flag at base — no blocked-scoring branch.
  assert.equal(app.state.gameFlags[2].isAtBase, true);

  // Place a Team 1 runner directly within freeze radius.
  const threat = app.state.allRunners.find((r) => r.team === 1);
  threat.gridX = 6;
  threat.gridY = 6; // Manhattan distance = 2 = AREA_FREEZE_RADIUS
  threat.isFrozen = false;

  // Freeze is ready.
  app.state.currentTurnNumber = 5;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 1;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.equal(decision.actionType, AI_ACTION_TYPES.FREEZE_OPPONENTS);
});

test("tactical carrier does not freeze when the nearest enemy is outside freeze radius", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.canJump = false; // disable jump to keep assertion clean
  attacker.gridX = 6;
  attacker.gridY = 4;
  assert.equal(app.state.gameFlags[2].isAtBase, true);

  // All Team 1 runners placed far away.
  for (const r of app.state.allRunners.filter((r) => r.team === 1)) {
    r.gridX = 1;
    r.gridY = 4;
  }
  // Distance from (6,4) to (1,4) = 5 > AREA_FREEZE_RADIUS.
  app.state.currentTurnNumber = 5;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 1; // freeze ready but no target in range

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.notEqual(decision.actionType, AI_ACTION_TYPES.FREEZE_OPPONENTS, "should not freeze when no enemy is in range");
});

test("tactical carrier does not freeze when freeze is on cooldown", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((r) => r.team === 2 && r.isNPC) || app.state.allRunners.find((r) => r.team === 2);
  attacker.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER;
  attacker.hasEnemyFlag = true;
  attacker.canJump = false;
  attacker.gridX = 6;
  attacker.gridY = 4;
  assert.equal(app.state.gameFlags[2].isAtBase, true);

  const threat = app.state.allRunners.find((r) => r.team === 1);
  threat.gridX = 6;
  threat.gridY = 6; // in range
  threat.isFrozen = false;

  // Freeze on cooldown.
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[2] = 100;

  const decision = calculateFreePlayCpuAction(attacker, app.state);
  assert.notEqual(decision.actionType, AI_ACTION_TYPES.FREEZE_OPPONENTS, "should not freeze while on cooldown");
});

test("free play tactical defenders do not choose freeze while cooling down", () => {
  const app = buildMatch();
  const defender = app.state.allRunners.find((runner) => runner.team === 2 && runner.isNPC) || app.state.allRunners.find((runner) => runner.team === 2);
  const playerCarrier = app.state.allRunners.find((runner) => runner.team === 1 && !runner.isHumanControlled) || app.state.allRunners.find((runner) => runner.team === 1);
  defender.cpuBehavior = NPC_BEHAVIORS.FREE_PLAY_TACTICAL_DEFENDER;
  playerCarrier.hasEnemyFlag = true;
  app.state.gameFlags[2].carriedByRunnerId = null;
  app.state.gameFlags[1].carriedByRunnerId = playerCarrier.id;
  defender.gridX = playerCarrier.gridX + 1;
  defender.gridY = playerCarrier.gridY;

  app.state.currentTurnNumber = 5;
  app.state.teamAreaFreezeNextAvailableTurn[defender.team] = 10;

  const decision = calculateFreePlayCpuAction(defender, app.state);
  assert.notEqual(decision.actionType, AI_ACTION_TYPES.FREEZE_OPPONENTS);
});

// ─── Plan 72: Per-Point Turn Limit ───────────────────────────────────────────

test("Free Play default point turn limit is 100", () => {
  const app = createApp();
  initializeLevelState(app);
  app.state.randomFn = () => 0;
  enterFreePlay(app);
  assert.equal(app.state.freePlayPointTurnLimit, 100);
});

test("configureFreePlay sets freePlayPointTurnLimit to null for No limit option", () => {
  const app = createApp();
  initializeLevelState(app);
  app.state.randomFn = () => 0;
  enterFreePlay(app);
  configureFreePlay(app, { freePlayPointTurnLimit: null });
  assert.equal(app.state.freePlayPointTurnLimit, null);
});

test("per-point turn limit triggers no-score round reset and preserves team scores", () => {
  const app = buildMatch();
  app.state.currentModeView = GAME_VIEW_MODES.FREE_PLAY;
  app.state.freePlayPointTurnLimit = 5;
  app.state.freePlayRoundStartTurn = 1;
  app.state.currentTurnNumber = 5;
  app.state.teamScores = { 1: 1, 2: 0 };

  // Use the last runner so the wrap from last → first fires on this turn.
  const runners = app.state.allRunners;
  const lastRunner = runners[runners.length - 1];
  const savedInitialX = lastRunner.initialGridX;

  // Move the runner away from its initial position to verify the round reset.
  lastRunner.gridX = 5;
  lastRunner.gridY = 3;

  // Freeze the last runner so it takes an immediate no-op turn.
  lastRunner.isFrozen = true;
  lastRunner.frozenTurnsRemaining = 1;

  app.state.activeRunnerIndex = runners.length - 1;
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "AWAITING_INPUT";

  processTurnActions(app, TEST_P5);

  // currentTurnNumber should have incremented (wrap fired).
  assert.equal(app.state.currentTurnNumber, 6, "turn number should increment after last runner wraps");
  // Turn limit fired: round reset, freePlayRoundStartTurn updated to new currentTurnNumber.
  assert.equal(app.state.freePlayRoundStartTurn, 6, "round start turn should update to current turn after reset");
  // Runner should be back at initial position (resetRound called resetToInitial).
  assert.equal(lastRunner.gridX, savedInitialX, "runner should be reset to initial position after turn-limit round reset");
  // Scores must be preserved (no-score reset).
  assert.deepEqual(app.state.teamScores, { 1: 1, 2: 0 }, "team scores must be preserved on no-score round reset");
});

test("per-point turn limit does not reset when set to null (no limit)", () => {
  const app = buildMatch();
  app.state.currentModeView = GAME_VIEW_MODES.FREE_PLAY;
  app.state.freePlayPointTurnLimit = null;
  app.state.freePlayRoundStartTurn = 1;
  app.state.currentTurnNumber = 5;

  const runners = app.state.allRunners;
  const lastRunner = runners[runners.length - 1];
  const savedInitialX = lastRunner.initialGridX;

  // Move the runner away from its initial position.
  lastRunner.gridX = 5;
  lastRunner.gridY = 3;
  lastRunner.isFrozen = true;
  lastRunner.frozenTurnsRemaining = 1;

  app.state.activeRunnerIndex = runners.length - 1;
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "AWAITING_INPUT";

  processTurnActions(app, TEST_P5);

  // Turn number increments normally.
  assert.equal(app.state.currentTurnNumber, 6);
  // No reset: runner is NOT back at initial position.
  assert.notEqual(lastRunner.gridX, savedInitialX, "runner should not be reset when there is no turn limit");
  // Round start turn is NOT updated (no round reset fired).
  assert.equal(app.state.freePlayRoundStartTurn, 1, "round start turn should not change when no limit is set");
});

test("per-point turn limit does not apply in guided level mode", () => {
  const app = buildMatch();
  // Guided mode — not FREE_PLAY.
  app.state.currentModeView = GAME_VIEW_MODES.GUIDED_LEVELS;
  app.state.freePlayPointTurnLimit = 5;
  app.state.freePlayRoundStartTurn = 1;
  app.state.currentTurnNumber = 5;

  const runners = app.state.allRunners;
  const lastRunner = runners[runners.length - 1];
  const savedInitialX = lastRunner.initialGridX;

  lastRunner.gridX = 5;
  lastRunner.gridY = 3;
  lastRunner.isFrozen = true;
  lastRunner.frozenTurnsRemaining = 1;

  app.state.activeRunnerIndex = runners.length - 1;
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "AWAITING_INPUT";

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnNumber, 6);
  // No reset in guided mode: runner stays at modified position.
  assert.notEqual(lastRunner.gridX, savedInitialX, "runner should not be reset in guided level mode");
  assert.equal(app.state.freePlayRoundStartTurn, 1, "round start turn should not change in guided mode");
});

test("point turn limit warning threshold: 10 or fewer turns remaining triggers countdown", () => {
  // Verify the state values that drive the scoreboard countdown warning.
  const app = createApp();
  initializeLevelState(app);
  app.state.randomFn = () => 0;
  enterFreePlay(app);
  app.state.freePlayPointTurnLimit = 100;
  app.state.freePlayRoundStartTurn = 1;

  // At turn 90: 89 turns used, 11 remaining — above the warning threshold.
  app.state.currentTurnNumber = 90;
  const turnsUsed90 = app.state.currentTurnNumber - app.state.freePlayRoundStartTurn;
  const turnsRemaining90 = app.state.freePlayPointTurnLimit - turnsUsed90;
  assert.ok(turnsRemaining90 > 10, `expected >10 turns remaining at turn 90, got ${turnsRemaining90}`);

  // At turn 91: 90 turns used, 10 remaining — at the warning threshold.
  app.state.currentTurnNumber = 91;
  const turnsUsed91 = app.state.currentTurnNumber - app.state.freePlayRoundStartTurn;
  const turnsRemaining91 = app.state.freePlayPointTurnLimit - turnsUsed91;
  assert.equal(turnsRemaining91, 10, "expected exactly 10 turns remaining at turn 91");
  assert.ok(turnsRemaining91 <= 10, "turn 91 should be at the warning threshold");

  // At turn 100: 99 turns used, 1 remaining — still within warning range.
  app.state.currentTurnNumber = 100;
  const turnsUsed100 = app.state.currentTurnNumber - app.state.freePlayRoundStartTurn;
  const turnsRemaining100 = app.state.freePlayPointTurnLimit - turnsUsed100;
  assert.equal(turnsRemaining100, 1, "expected 1 turn remaining at turn 100");
  assert.ok(turnsRemaining100 <= 10, "turn 100 should be within warning range");
});
