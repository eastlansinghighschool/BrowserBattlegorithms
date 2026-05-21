import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_ACTION_TYPES,
  BLOCK_TYPES,
  SENSOR_OBJECT_TYPES,
  SENSOR_RELATION_TYPES
} from "../../src/config/constants.js";
import { markAreaFreezeUsed } from "../../src/core/areaFreeze.js";
import { beginRecentMovementTurn, finalizeRecentMovementTurn, queueRecentMovementOutcome } from "../../src/core/recentMovement.js";
import { buildMatch } from "./helpers/builders.js";
import { evaluateCondition, evaluateSensorCondition } from "../../src/core/conditions.js";
import { resetRound } from "../../src/core/setup.js";

test("condition helpers detect barrier, enemy, and carried-flag state", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 1;
  actor.gridY = 3;

  app.state.barriers.push({ id: "barrier_test", gridX: 2, gridY: 3, ownerRunnerId: "test" });
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_BARRIER_IN_FRONT), true);

  app.state.barriers = [];
  const enemy = app.state.allRunners.find((runner) => runner.team === 2);
  enemy.gridX = 2;
  enemy.gridY = 3;
  enemy.isFrozen = false;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_ENEMY_IN_FRONT), true);

  actor.hasEnemyFlag = true;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_HAVE_ENEMY_FLAG), true);
});

test("resource, team, and territory conditions evaluate correctly", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  const human = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);

  actor.canJump = true;
  actor.canPlaceBarrier = true;
  actor.activeBarrierId = null;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_CAN_JUMP), true);
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_CAN_PLACE_BARRIER), true);
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_AREA_FREEZE_READY), true);
  markAreaFreezeUsed(app.state, actor.team);
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_AREA_FREEZE_READY), false);

  human.hasEnemyFlag = true;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_TEAMMATE_HAS_FLAG), true);

  actor.gridX = 1;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_ON_MY_SIDE), true);
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_ON_ENEMY_SIDE), false);
  actor.gridX = 8;
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_ON_MY_SIDE), false);
  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_ON_ENEMY_SIDE), true);
});

test("area freeze readiness follows next available turn even if the legacy used flag is stale", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");

  app.state.teamAreaFreezeUsed[actor.team] = true;
  app.state.teamAreaFreezeNextAvailableTurn[actor.team] = 1;
  app.state.currentTurnNumber = 12;

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.IF_AREA_FREEZE_READY), true);
});

test("recent movement booleans track blocked attempts, no-move streaks, and reset with round reset", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");

  actor.gridX = 4;
  actor.gridY = 3;

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "stayed");
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED), true);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR, turns: 2 }), false);
  assert.equal(actor.recentMovementState.recentEndPositions.length, 1);

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.STAY_STILL, "stayed");
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED), false);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR, turns: 2 }), true);
  assert.equal(actor.recentMovementState.recentEndPositions.length, 2);

  actor.setFrozen(2);
  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.STAY_STILL, "skipped_frozen");
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED), false);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR, turns: 3 }), true);
  assert.equal(actor.recentMovementState.recentEndPositions.length, 3);

  beginRecentMovementTurn(actor);
  actor.gridX = 5;
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "moved");
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED), false);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR, turns: 3 }), false);
  assert.equal(actor.recentMovementState.consecutiveTurnsWithoutMovement, 0);
  assert.equal(actor.recentMovementState.recentEndPositions.length, 4);

  actor.gridX = 6;
  beginRecentMovementTurn(actor);
  actor.gridX = 7;
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "moved");
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED), false);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR, turns: 2 }), false);
  assert.equal(actor.recentMovementState.consecutiveTurnsWithoutMovement, 0);
  assert.equal(actor.recentMovementState.recentEndPositions.length, 5);

  actor.recentMovementState.lastMoveWasBlocked = true;
  actor.recentMovementState.consecutiveTurnsWithoutMovement = 4;
  resetRound(app.state);

  assert.equal(actor.recentMovementState.lastMoveWasBlocked, false);
  assert.equal(actor.recentMovementState.consecutiveTurnsWithoutMovement, 0);
  assert.deepEqual(actor.recentMovementState.recentEndPositions, []);
});

test("recent movement stuck windows track local loops and clear when the runner leaves the area", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");

  actor.gridX = 4;
  actor.gridY = 3;

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "moved");
  actor.gridX = 5;
  finalizeRecentMovementTurn(actor);

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_BACKWARD, "moved");
  actor.gridX = 4;
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_STUCK_FOR, turns: 3 }), false);

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "moved");
  actor.gridX = 5;
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_STUCK_FOR, turns: 3 }), true);

  beginRecentMovementTurn(actor);
  queueRecentMovementOutcome(actor, AI_ACTION_TYPES.MOVE_FORWARD, "moved");
  actor.gridX = 8;
  finalizeRecentMovementTurn(actor);

  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_STUCK_FOR, turns: 3 }), false);
  assert.equal(evaluateCondition(app.state, actor, { type: BLOCK_TYPES.BOOLEAN_STUCK_FOR, turns: 4 }), false);
});

test("generic sensor evaluation supports barrier, edge or wall, enemy flag, and human runner relations", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 1;
  actor.gridY = 3;

  app.state.barriers.push({ id: "barrier_test", gridX: 2, gridY: 3, ownerRunnerId: "test" });
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.BARRIER, SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT),
    true
  );
  app.state.barriers.push({ id: "barrier_behind_test", gridX: 0, gridY: 3, ownerRunnerId: "test" });
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.BARRIER, SENSOR_RELATION_TYPES.DIRECTLY_BEHIND),
    true
  );

  actor.gridX = 11;
  actor.gridY = 3;
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.EDGE_OR_WALL, SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT),
    true
  );

  actor.gridX = 1;
  actor.gridY = 5;
  const human = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  human.gridX = 6;
  human.gridY = 2;
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.HUMAN_RUNNER, SENSOR_RELATION_TYPES.ANYWHERE_FORWARD),
    true
  );
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.HUMAN_RUNNER, SENSOR_RELATION_TYPES.ANYWHERE_ABOVE),
    true
  );

  app.state.gameFlags[2].gridX = 6;
  app.state.gameFlags[2].gridY = 4;
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.ENEMY_FLAG, SENSOR_RELATION_TYPES.WITHIN_6),
    true
  );
});
