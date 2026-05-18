import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, LEVEL_RESULT, MAIN_GAME_STATES, TURN_STATES } from "../../src/config/constants.js";
import { buildMatch } from "./helpers/builders.js";
import { TEST_P5 } from "./helpers/testHarness.js";
import { handlePlayerInput, processTurnActions } from "../../src/core/turnEngine.js";
import { checkForFlagPickup, checkForScoring } from "../../src/core/scoring.js";
import { resolveCollision } from "../../src/core/collisions.js";
import { createApp } from "../../src/core/state.js";
import { completeLevel, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { getTeamBaseCellType } from "../../src/core/teams.js";

function getTurnEvents(app) {
  return app.state.currentTurnEventLog.length > 0 ? app.state.currentTurnEventLog : app.state.lastTurnEventLog;
}

function getEventKinds(app) {
  return getTurnEvents(app).map((event) => event.kind);
}

function snapshotState(state) {
  return {
    activeRunnerIndex: state.activeRunnerIndex,
    currentTurnNumber: state.currentTurnNumber,
    currentTurnState: state.currentTurnState,
    mainGameState: state.mainGameState,
    teamScores: { ...state.teamScores },
    teamAreaFreezeUsed: { ...state.teamAreaFreezeUsed },
    teamAreaFreezeNextAvailableTurn: { ...state.teamAreaFreezeNextAvailableTurn },
    runnerActionHistory: structuredClone(state.runnerActionHistory),
    runners: state.allRunners.map((runner) => ({
      id: runner.id,
      team: runner.team,
      gridX: runner.gridX,
      gridY: runner.gridY,
      isFrozen: runner.isFrozen,
      frozenTurnsRemaining: runner.frozenTurnsRemaining,
      hasEnemyFlag: runner.hasEnemyFlag,
      canJump: runner.canJump,
      canPlaceBarrier: runner.canPlaceBarrier,
      activeBarrierId: runner.activeBarrierId,
      isGracePeriod: runner.isGracePeriod
    })),
    flags: Object.fromEntries(
      Object.entries(state.gameFlags).map(([teamId, flag]) => [
        teamId,
        {
          gridX: flag.gridX,
          gridY: flag.gridY,
          carriedByRunnerId: flag.carriedByRunnerId,
          isAtBase: flag.isAtBase
        }
      ])
    ),
    barriers: state.barriers.map((barrier) => ({
      gridX: barrier.gridX,
      gridY: barrier.gridY,
      ownerRunnerId: barrier.ownerRunnerId
    }))
  };
}

function runRepeatableTurns(app, ticks, discardLogs = false) {
  for (let index = 0; index < ticks; index += 1) {
    processTurnActions(app, TEST_P5);
    if (discardLogs) {
      app.state.currentTurnEventLog = [];
      app.state.lastTurnEventLog = [];
    }
  }
}

test("turn.started logs the active runner and frozen state when the turn begins", () => {
  const app = buildMatch();
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  processTurnActions(app, TEST_P5);

  const [event] = getTurnEvents(app);
  assert.equal(event.kind, "turn.started");
  assert.deepEqual(event.payload, {
    runnerId: app.state.allRunners[0].id,
    runnerTeam: app.state.allRunners[0].team,
    isHuman: true,
    isNPC: false,
    isFrozen: false
  });
});

test("runner.actionChosen logs a human choice when the action is queued", () => {
  const app = buildMatch();
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  processTurnActions(app, TEST_P5);

  const human = app.state.allRunners[0];
  handlePlayerInput(app, human, { dx: human.playDirection, dy: 0 });

  assert.deepEqual(getEventKinds(app), ["turn.started", "runner.actionChosen"]);
  const actionChosen = getTurnEvents(app).at(-1);
  assert.deepEqual(actionChosen.payload, {
    runnerId: human.id,
    runnerTeam: human.team,
    actionType: "MOVE",
    source: "human"
  });
});

test("runner.actionResolved logs skipped frozen turns", () => {
  const app = buildMatch();
  const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && !candidate.isNPC);
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  runner.setFrozen(1);

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnEventLog.length, 0);
  const kinds = getEventKinds(app);
  assert.ok(kinds.includes("runner.actionResolved"));
  const resolved = getTurnEvents(app).find((event) => event.kind === "runner.actionResolved");
  assert.deepEqual(resolved.payload, {
    runnerId: runner.id,
    runnerTeam: runner.team,
    actionType: AI_ACTION_TYPES.STAY_STILL,
    outcome: "skipped_frozen"
  });
});

test("runner.blockedOrBounced logs the attempted cell and bounce reason", () => {
  const app = buildMatch();
  const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && !candidate.isNPC);
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.MOVE_FORWARD });

  const blockedX = runner.gridX + runner.playDirection;
  const blockedY = runner.gridY;
  app.state.barriers.push({
    id: "test-barrier",
    gridX: blockedX,
    gridY: blockedY,
    ownerRunnerId: runner.id
  });

  processTurnActions(app, TEST_P5);

  const blockedEvent = getTurnEvents(app).find((event) => event.kind === "runner.blockedOrBounced");
  assert.ok(blockedEvent);
  assert.deepEqual(blockedEvent.payload, {
    runnerId: runner.id,
    runnerTeam: runner.team,
    attemptedCell: {
      x: blockedX,
      y: blockedY
    },
    reason: "barrier"
  });
});

test("resource.unavailable logs a blocked jump before falling back to stay still", () => {
  const app = buildMatch();
  const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && !candidate.isNPC);
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  runner.canJump = false;
  app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.JUMP_FORWARD });

  processTurnActions(app, TEST_P5);

  const resourceEvent = getTurnEvents(app).find((event) => event.kind === "resource.unavailable");
  assert.ok(resourceEvent);
  assert.deepEqual(resourceEvent.payload, {
    runnerId: runner.id,
    runnerTeam: runner.team,
    actionType: AI_ACTION_TYPES.JUMP_FORWARD,
    reason: "jump_exhausted"
  });
});

test("flag.pickedUp logs the carrier and flag team", () => {
  const app = buildMatch();
  const runner = app.state.allRunners[0];
  const enemyFlag = app.state.gameFlags[2];
  runner.gridX = enemyFlag.gridX;
  runner.gridY = enemyFlag.gridY;

  checkForFlagPickup(app.state, runner);

  const pickupEvent = getTurnEvents(app).find((event) => event.kind === "flag.pickedUp");
  assert.ok(pickupEvent);
  assert.deepEqual(pickupEvent.payload, {
    flagTeam: 2,
    carrierRunnerId: runner.id,
    cell: {
      x: enemyFlag.gridX,
      y: enemyFlag.gridY
    }
  });
});

test("flag.dropped logs collision loss and the collision cell", () => {
  const app = buildMatch();
  const attacker = app.state.allRunners.find((runner) => runner.team === 1);
  const defender = app.state.allRunners.find((runner) => runner.team === 2);

  attacker.gridX = 2;
  attacker.gridY = 3;
  defender.gridX = 3;
  defender.gridY = 3;
  defender.hasEnemyFlag = true;
  const carriedFlag = app.state.gameFlags[1];
  carriedFlag.carriedByRunnerId = defender.id;
  carriedFlag.isAtBase = false;
  carriedFlag.gridX = defender.gridX;
  carriedFlag.gridY = defender.gridY;

  resolveCollision(app.state, attacker, defender, 2, 3, { x: 2, y: 3 });

  const droppedEvent = getTurnEvents(app).find((event) => event.kind === "flag.dropped");
  assert.ok(droppedEvent);
  assert.deepEqual(droppedEvent.payload, {
    flagTeam: 1,
    previousCarrierRunnerId: defender.id,
    cell: {
      x: 2,
      y: 3
    },
    reason: "collision_lost"
  });
});

test("team.scored logs the score increment and win threshold", () => {
  const app = buildMatch();
  const runner = app.state.allRunners[0];
  const teamBaseType = getTeamBaseCellType(app.state, runner.team);
  let scoringCell = null;
  for (let y = 0; y < app.state.gameMap.length && !scoringCell; y += 1) {
    for (let x = 0; x < app.state.gameMap[y].length; x += 1) {
      if (app.state.gameMap[y][x] === teamBaseType) {
        scoringCell = { x, y };
        break;
      }
    }
  }

  assert.ok(scoringCell);
  runner.gridX = scoringCell.x;
  runner.gridY = scoringCell.y;
  const enemyFlag = app.state.gameFlags[2];
  runner.hasEnemyFlag = true;
  enemyFlag.carriedByRunnerId = runner.id;
  enemyFlag.isAtBase = false;
  enemyFlag.gridX = runner.gridX;
  enemyFlag.gridY = runner.gridY;

  checkForScoring(app.state, runner);

  const scoredEvent = getTurnEvents(app).find((event) => event.kind === "team.scored");
  assert.ok(scoredEvent);
  assert.deepEqual(scoredEvent.payload, {
    scoringTeam: runner.team,
    newScore: 1,
    pointsToWin: app.state.pointsToWin
  });
});

test("level.result logs a transition when a level completes", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "move-to-target");

  completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met");

  const resultEvent = getTurnEvents(app).find((event) => event.kind === "level.result");
  assert.ok(resultEvent);
  assert.deepEqual(resultEvent.payload, {
    levelId: "move-to-target",
    result: LEVEL_RESULT.PASSED
  });
});

test("discarding the event log does not change the final game state", () => {
  const buildScenario = () => {
    const app = buildMatch();
    const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && !candidate.isNPC);
    app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
    app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
    app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
    app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.STAY_STILL });
    return app;
  };

  const observedApp = buildScenario();
  const discardedApp = buildScenario();

  runRepeatableTurns(observedApp, 6, false);
  runRepeatableTurns(discardedApp, 6, true);

  assert.deepEqual(snapshotState(observedApp.state), snapshotState(discardedApp.state));
});
