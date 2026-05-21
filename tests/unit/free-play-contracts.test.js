import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, AREA_FREEZE_DURATION_TURNS, BLOCK_TYPES, GAME_VIEW_MODES, LEVEL_STATUS, MAIN_GAME_STATES, NPC_BEHAVIORS } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { enterFreePlay, initializeLevelState } from "../../src/core/levels.js";
import { getToolboxBlockTypesForMode } from "../../src/ai/blockly/blocks.js";
import { calculateFreePlayCpuAction } from "../../src/ai/npc/freePlayCpu.js";
import { getAreaFreezeTurnsRemaining, isAreaFreezeReady } from "../../src/core/areaFreeze.js";
import { buildMatch } from "./helpers/builders.js";
import { resetRound } from "../../src/core/setup.js";
import { translateActionDecision } from "../../src/core/movement.js";
import { processTurnActions } from "../../src/core/turnEngine.js";
import { TEST_P5 } from "./helpers/testHarness.js";

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
