import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, CELL_TYPE, MOVE_TOWARD_TARGETS, MAIN_GAME_STATES } from "../../src/config/constants.js";
import { buildMatch } from "./helpers/builders.js";
import { checkInvariants } from "../../src/core/invariants.js";
import {
  isCellBlockedByImpassables,
  isCellBlockedForRunner,
  translateActionDecision,
  translateMoveTowardDecision
} from "../../src/core/movement.js";
import { resolveCollision } from "../../src/core/collisions.js";
import { reconcileFlagHomeOccupancy } from "../../src/core/flagReconciliation.js";
import { processTurnActions } from "../../src/core/turnEngine.js";
import { TEST_P5, getTeamHuman } from "./helpers/testHarness.js";

test("movement helper blocks wall cells", () => {
  const app = buildMatch();
  const blocked = isCellBlockedByImpassables(-1, 0, app.state.barriers, app.state.gameMap);
  assert.equal(blocked, true);
});

test("own team cannot enter its home flag cell while the flag is at base", () => {
  const app = buildMatch();
  const playerRunner = app.state.allRunners.find((runner) => runner.team === 1);
  const enemyRunner = app.state.allRunners.find((runner) => runner.team === 2);
  const playerFlag = app.state.gameFlags[1];

  assert.equal(
    isCellBlockedForRunner(playerFlag.gridX, playerFlag.gridY, app.state.barriers, app.state.gameMap, app.state, playerRunner),
    true
  );
  assert.equal(
    isCellBlockedForRunner(playerFlag.gridX, playerFlag.gridY, app.state.barriers, app.state.gameMap, app.state, enemyRunner),
    false
  );

  playerFlag.isAtBase = false;
  playerFlag.carriedByRunnerId = "runner_2_Npc1";

  assert.equal(
    isCellBlockedForRunner(playerFlag.gridX, playerFlag.gridY, app.state.barriers, app.state.gameMap, app.state, playerRunner),
    false
  );
});

test("translateActionDecision converts move-forward into a target cell", () => {
  const app = buildMatch();
  const runner = app.state.allRunners[1];
  const queued = translateActionDecision(runner, { type: "MOVE_FORWARD" });
  assert.equal(queued.targetGridX, runner.gridX + runner.playDirection);
  assert.equal(queued.targetGridY, runner.gridY);
});

test("collision resolves in favor of defender side when neither runner carries a flag", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners[0];
  const defender = app.state.allRunners[2];
  attacker.gridX = 8;
  attacker.gridY = 3;
  defender.gridX = 9;
  defender.gridY = 3;
  const outcome = resolveCollision(app.state, attacker, defender, 9, 3, { x: 8, y: 3 });
  assert.equal(outcome.winner.id, defender.id);
  assert.equal(outcome.loser.id, attacker.id);
  assert.deepEqual(outcome.loserCell, { x: 8, y: 3 });
});

test("moving attacker carrying a flag loses on the enemy side", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);
  attacker.gridX = 8;
  attacker.gridY = 3;
  attacker.hasEnemyFlag = true;
  const carriedFlag = app.state.gameFlags[2];
  carriedFlag.carriedByRunnerId = attacker.id;
  carriedFlag.isAtBase = false;
  carriedFlag.gridX = attacker.gridX;
  carriedFlag.gridY = attacker.gridY;
  defender.gridX = 9;
  defender.gridY = 3;

  const outcome = resolveCollision(app.state, attacker, defender, 9, 3, { x: 8, y: 3 });

  assert.equal(outcome.winner.id, defender.id);
  assert.equal(outcome.loser.id, attacker.id);
});

test("moving attacker carrying a flag loses on their own side too", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);
  attacker.gridX = 4;
  attacker.gridY = 3;
  attacker.hasEnemyFlag = true;
  const carriedFlag = app.state.gameFlags[2];
  carriedFlag.carriedByRunnerId = attacker.id;
  carriedFlag.isAtBase = false;
  carriedFlag.gridX = attacker.gridX;
  carriedFlag.gridY = attacker.gridY;
  defender.gridX = 5;
  defender.gridY = 3;

  const outcome = resolveCollision(app.state, attacker, defender, 5, 3, { x: 4, y: 3 });

  assert.equal(outcome.winner.id, defender.id);
  assert.equal(outcome.loser.id, attacker.id);
});

test("in-cell defender carrying a flag loses even on their own side", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);
  attacker.gridX = 9;
  attacker.gridY = 3;
  defender.gridX = 10;
  defender.gridY = 3;
  defender.hasEnemyFlag = true;
  const carriedFlag = app.state.gameFlags[1];
  carriedFlag.carriedByRunnerId = defender.id;
  carriedFlag.isAtBase = false;
  carriedFlag.gridX = defender.gridX;
  carriedFlag.gridY = defender.gridY;

  const outcome = resolveCollision(app.state, attacker, defender, 10, 3, { x: 9, y: 3 });

  assert.equal(outcome.winner.id, attacker.id);
  assert.equal(outcome.loser.id, defender.id);
});

test("if both runners carry flags, the moving attacker loses", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);
  attacker.gridX = 2;
  attacker.gridY = 3;
  attacker.hasEnemyFlag = true;
  const attackerFlag = app.state.gameFlags[2];
  attackerFlag.carriedByRunnerId = attacker.id;
  attackerFlag.isAtBase = false;
  attackerFlag.gridX = attacker.gridX;
  attackerFlag.gridY = attacker.gridY;
  defender.gridX = 3;
  defender.gridY = 3;
  defender.hasEnemyFlag = true;
  const defenderFlag = app.state.gameFlags[1];
  defenderFlag.carriedByRunnerId = defender.id;
  defenderFlag.isAtBase = false;
  defenderFlag.gridX = defender.gridX;
  defenderFlag.gridY = defender.gridY;

  const outcome = resolveCollision(app.state, attacker, defender, 3, 3, { x: 2, y: 3 });

  assert.equal(outcome.winner.id, defender.id);
  assert.equal(outcome.loser.id, attacker.id);
});

test("a losing flag carrier drops and resets the carried flag through the existing consequence path", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);
  attacker.gridX = 2;
  attacker.gridY = 3;
  attacker.hasEnemyFlag = true;
  const carriedFlag = app.state.gameFlags[2];
  carriedFlag.carriedByRunnerId = attacker.id;
  carriedFlag.isAtBase = false;
  carriedFlag.gridX = attacker.gridX;
  carriedFlag.gridY = attacker.gridY;
  defender.gridX = 3;
  defender.gridY = 3;

  const outcome = resolveCollision(app.state, attacker, defender, 3, 3, { x: 2, y: 3 });

  assert.equal(outcome.loser.id, attacker.id);
  assert.equal(attacker.hasEnemyFlag, false);
  assert.equal(carriedFlag.carriedByRunnerId, null);
  assert.equal(carriedFlag.isAtBase, true);
  assert.deepEqual({ x: carriedFlag.gridX, y: carriedFlag.gridY }, { x: carriedFlag.initialGridX, y: carriedFlag.initialGridY });
});

test("collision defender is determined by team home side, not literal team number", () => {
  // Randomized Free Play orientation: Team 1 (player) plays right-to-left,
  // so Team 1.homeSide = "right" and Team 2.homeSide = "left".
  const app = buildMatch({ randomFn: () => 0.9 });
  assert.equal(app.state.teams[1].homeSide, "right");
  assert.equal(app.state.teams[2].homeSide, "left");

  const team1Runner = app.state.allRunners.find((runner) => runner.team === 1);
  const team2Runner = app.state.allRunners.find((runner) => runner.team === 2);

  // Collision on the right half: Team 1 owns this side, so Team 1 should win
  // even when Team 2 is the in-cell defender being attacked.
  const rightHalfOutcome = resolveCollision(
    app.state,
    team1Runner,
    team2Runner,
    10,
    3,
    { x: 9, y: 3 }
  );
  assert.equal(rightHalfOutcome.winner.team, 1);
  assert.equal(rightHalfOutcome.loser.team, 2);

  // Collision on the left half: Team 2 owns this side under this orientation.
  const leftHalfOutcome = resolveCollision(
    app.state,
    team1Runner,
    team2Runner,
    2,
    3,
    { x: 3, y: 3 }
  );
  assert.equal(leftHalfOutcome.winner.team, 2);
  assert.equal(leftHalfOutcome.loser.team, 1);
});

test("collision processing leaves one runner on the collision cell and freezes the loser on the origin cell", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners[0];
  const defender = app.state.allRunners[2];

  attacker.gridX = 8;
  attacker.gridY = 3;
  attacker.pixelX = attacker.gridX * 50;
  attacker.pixelY = attacker.gridY * 50;
  defender.gridX = 9;
  defender.gridY = 3;
  defender.pixelX = defender.gridX * 50;
  defender.pixelY = defender.gridY * 50;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(attacker);
  app.state.queuedActionForCurrentRunner = {
    runner: attacker,
    actionType: AI_ACTION_TYPES.MOVE_FORWARD,
    targetGridX: 9,
    targetGridY: 3
  };

  processTurnActions(app, TEST_P5);

  assert.deepEqual({ x: defender.gridX, y: defender.gridY }, { x: 9, y: 3 });
  assert.deepEqual({ x: attacker.gridX, y: attacker.gridY }, { x: 8, y: 3 });
  assert.equal(attacker.isFrozen, true);
  assert.equal(defender.isFrozen, false);
  assert.equal(checkInvariants(app.state), true);
});

test("collision winner cannot remain on their own team's loose home flag cell", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  const defender = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  const untouchedAlly = app.state.allRunners.find((runner) => runner.team === 1 && !runner.isHumanControlled);
  const team1Flag = app.state.gameFlags[1];

  // Move the untouched team 1 ally out of the way so it cannot overlap with
  // the scripted attacker/defender positions below.
  untouchedAlly.gridX = 6;
  untouchedAlly.gridY = 7;

  // Attacker starts one step away from team 1's flag home cell and moves onto
  // it, where the enemy carrier (defender) happens to be standing.
  attacker.gridX = team1Flag.initialGridX + 1;
  attacker.gridY = team1Flag.initialGridY;
  attacker.playDirection = 1;

  defender.gridX = team1Flag.initialGridX;
  defender.gridY = team1Flag.initialGridY;
  defender.hasEnemyFlag = true;
  team1Flag.carriedByRunnerId = defender.id;
  team1Flag.isAtBase = false;
  team1Flag.gridX = defender.gridX;
  team1Flag.gridY = defender.gridY;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(attacker);
  app.state.queuedActionForCurrentRunner = {
    runner: attacker,
    actionType: AI_ACTION_TYPES.MOVE_BACKWARD,
    targetGridX: team1Flag.initialGridX,
    targetGridY: team1Flag.initialGridY
  };

  processTurnActions(app, TEST_P5);

  // The flag carrier (defender) loses and drops the flag; it resets home.
  assert.equal(team1Flag.isAtBase, true);
  assert.deepEqual(
    { x: team1Flag.gridX, y: team1Flag.gridY },
    { x: team1Flag.initialGridX, y: team1Flag.initialGridY }
  );

  // The attacker (team 1, same team as the flag) must not remain on the loose
  // home-flag cell, even though it won the collision.
  assert.notDeepEqual(
    { x: attacker.gridX, y: attacker.gridY },
    { x: team1Flag.initialGridX, y: team1Flag.initialGridY }
  );
  assert.equal(checkInvariants(app.state), true);

  // A future enemy runner can legally re-enter the home flag cell.
  const anotherEnemy = app.state.allRunners.find((runner) => runner.team === 2 && runner !== defender);
  assert.equal(
    isCellBlockedForRunner(
      team1Flag.initialGridX,
      team1Flag.initialGridY,
      app.state.barriers,
      app.state.gameMap,
      app.state,
      anotherEnemy
    ),
    false
  );
});

test("a reset flag landing under a waiting opposing runner is immediately picked up", () => {
  const app = buildMatch();
  const carrier = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  const attacker = app.state.allRunners.find((runner) => runner.team === 2 && runner.isHumanControlled);
  // The waiting teammate must be on the carrier's own team (team 1): both
  // runners treat team 2's flag as "the enemy flag" from the same side.
  const waitingRunner = app.state.allRunners.find((runner) => runner.team === 1 && runner.id !== carrier.id);
  const untouchedAlly = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  const team2Flag = app.state.gameFlags[2];

  // Move the untouched team 2 ally out of the way so it cannot overlap with
  // the scripted attacker position below.
  untouchedAlly.gridX = 6;
  untouchedAlly.gridY = 7;

  carrier.gridX = 5;
  carrier.gridY = 4;
  carrier.hasEnemyFlag = true;
  team2Flag.carriedByRunnerId = carrier.id;
  team2Flag.isAtBase = false;
  team2Flag.gridX = carrier.gridX;
  team2Flag.gridY = carrier.gridY;

  attacker.gridX = 6;
  attacker.gridY = 4;
  attacker.playDirection = -1;

  // Waiting teammate is already staged exactly on team 2's flag home cell.
  waitingRunner.gridX = team2Flag.initialGridX;
  waitingRunner.gridY = team2Flag.initialGridY;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(attacker);
  app.state.queuedActionForCurrentRunner = {
    runner: attacker,
    actionType: AI_ACTION_TYPES.MOVE_FORWARD,
    targetGridX: 5,
    targetGridY: 4
  };

  processTurnActions(app, TEST_P5);

  assert.equal(team2Flag.carriedByRunnerId, waitingRunner.id);
  assert.equal(waitingRunner.hasEnemyFlag, true);
  assert.equal(team2Flag.isAtBase, false);
  assert.equal(checkInvariants(app.state), true);
});

test("reconciliation leaves an occupant in place and logs a diagnostic when no legal displacement cell exists", () => {
  const flag = { gridX: 4, gridY: 4, teamId: 1, isAtBase: true, carriedByRunnerId: null };
  const occupant = { id: "runner_1_test", team: 1, gridX: flag.gridX, gridY: flag.gridY };

  // Every cell on the board is a wall except the occupant's own cell (never a
  // displacement candidate), so no legal displacement cell can be found.
  const gameMap = Array.from({ length: 8 }, () => new Array(12).fill(CELL_TYPE.WALL));

  const state = {
    gameMap,
    barriers: [],
    allRunners: [occupant],
    gameFlags: { 1: flag }
  };

  const originalWarn = console.warn;
  let warned = false;
  console.warn = () => {
    warned = true;
  };

  try {
    assert.doesNotThrow(() => reconcileFlagHomeOccupancy(state, flag));
  } finally {
    console.warn = originalWarn;
  }

  assert.equal(occupant.gridX, flag.gridX);
  assert.equal(occupant.gridY, flag.gridY);
  assert.equal(warned, true);
});

test("Move Toward enemy flag chooses a forward step in the open lane", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  const decision = translateMoveTowardDecision(app.state, actor, MOVE_TOWARD_TARGETS.ENEMY_FLAG);
  assert.equal(decision.type, AI_ACTION_TYPES.MOVE_FORWARD);
});

test("Move Toward my base chooses a backward step when carrying the flag home", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 8;
  actor.gridY = 4;
  const decision = translateMoveTowardDecision(app.state, actor, MOVE_TOWARD_TARGETS.MY_BASE);
  assert.equal(decision.type, AI_ACTION_TYPES.MOVE_BACKWARD);
});

test("Move Toward human runner targets the allied human", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 5;
  actor.gridY = 4;
  const human = getTeamHuman(app.state, 1);
  human.gridX = 5;
  human.gridY = 2;
  const decision = translateMoveTowardDecision(app.state, actor, MOVE_TOWARD_TARGETS.HUMAN_RUNNER);
  assert.equal(decision.type, AI_ACTION_TYPES.MOVE_UP_SCREEN);
});

test("Move Toward closest enemy selects the nearest active enemy deterministically", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 5;
  actor.gridY = 4;
  const enemies = app.state.allRunners.filter((runner) => runner.team === 2);
  enemies[0].gridX = 7;
  enemies[0].gridY = 4;
  enemies[1].gridX = 5;
  enemies[1].gridY = 1;
  const decision = translateMoveTowardDecision(app.state, actor, MOVE_TOWARD_TARGETS.CLOSEST_ENEMY);
  assert.equal(decision.type, AI_ACTION_TYPES.MOVE_FORWARD);
});

test("Move Toward breaks equal-axis ties by preferring forward or behind before vertical movement", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  actor.gridX = 4;
  actor.gridY = 4;
  const human = getTeamHuman(app.state, 1);
  human.gridX = 6;
  human.gridY = 2;
  const decision = translateMoveTowardDecision(app.state, actor, MOVE_TOWARD_TARGETS.HUMAN_RUNNER);
  assert.equal(decision.type, AI_ACTION_TYPES.MOVE_FORWARD);
});
