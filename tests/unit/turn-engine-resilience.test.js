import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, LEVEL_RESULT, MAIN_GAME_STATES } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { evaluateLevelProgress, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { checkForFlagPickup, checkForScoring } from "../../src/core/scoring.js";
import { processTurnActions } from "../../src/core/turnEngine.js";

const TEST_P5 = {
  lerp(start, end, amount) {
    return start + (end - start) * amount;
  }
};

const GAME_OVER_SAFETY_NET_REASON = "match_ended_without_level_win_condition_satisfied";

function scoreWithWrongRunner(app, levelId) {
  startLevel(app, levelId);
  const level = app.state.levels.find((entry) => entry.id === levelId);
  const wrongRunner = app.state.allRunners.find(
    (runner) =>
      runner.team === 1 &&
      runner.id !== level.winCondition.runnerId &&
      !runner.isHumanControlled
  );
  assert.ok(wrongRunner, `expected a wrong runner for ${levelId}`);

  const enemyFlag = app.state.gameFlags[2];
  wrongRunner.gridX = enemyFlag.gridX;
  wrongRunner.gridY = enemyFlag.gridY;
  checkForFlagPickup(app.state, wrongRunner);

  const homeCell = app.state.teams[1].flagHome;
  wrongRunner.gridX = homeCell.x;
  wrongRunner.gridY = homeCell.y;
  const scored = checkForScoring(app.state, wrongRunner);
  assert.equal(scored, true, `expected ${levelId} wrong runner to score`);

  const result = evaluateLevelProgress(app);
  assert.deepEqual(result, { result: LEVEL_RESULT.FAILED, reason: GAME_OVER_SAFETY_NET_REASON });
  return { level, wrongRunner };
}

test("PROCESSING_ACTION without a queued action recovers to the next readable turn state", () => {
  const app = createApp();
  app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.STAY_STILL });
  app.state.randomFn = () => 0;

  initializeLevelState(app);
  startLevel(app, "full-team-tactics");

  const human = app.state.allRunners.find((runner) => runner.isHumanControlled);
  assert.ok(human, "expected a human runner");

  human.setFrozen(2);
  const humanRunnerIndex = app.state.allRunners.indexOf(human);
  app.state.activeRunnerIndex = humanRunnerIndex;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.queuedActionForCurrentRunner = null;

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, "AWAITING_INPUT");
  assert.equal(app.state.activeRunnerIndex, humanRunnerIndex);

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, "AWAITING_INPUT");
  assert.equal(human.frozenTurnsRemaining, 1);
  assert.equal(human.isFrozen, true);
});

test("wrong-runner scoring at level 29 forces a failed level result at game over", () => {
  const app = createApp();
  initializeLevelState(app);

  const { wrongRunner } = scoreWithWrongRunner(app, "one-program-two-allies");

  assert.equal(app.state.mainGameState, MAIN_GAME_STATES.GAME_OVER);
  assert.equal(app.state.currentTurnState, "SETUP_DISPLAY");
  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(app.state.lastLevelResultReason, GAME_OVER_SAFETY_NET_REASON);

  const forcedEvent = app.state.lastTurnEventLog.find((event) => event.kind === "level.forcedFailedAtGameOver");
  assert.ok(forcedEvent, "expected a forced-fail event to be logged");
  assert.deepEqual(forcedEvent.payload, {
    levelId: "one-program-two-allies",
    reason: GAME_OVER_SAFETY_NET_REASON,
    winConditionType: "runner_reaches_enemy_flag",
    winConditionRunnerId: "runner_1_AI_AllyP1",
    scoringTeam: wrongRunner.team
  });
});

test("wrong-runner scoring at index jobs also forces a failed level result at game over", () => {
  const app = createApp();
  initializeLevelState(app);

  const { wrongRunner } = scoreWithWrongRunner(app, "index-jobs");

  assert.equal(app.state.mainGameState, MAIN_GAME_STATES.GAME_OVER);
  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(app.state.lastLevelResultReason, GAME_OVER_SAFETY_NET_REASON);

  const forcedEvent = app.state.lastTurnEventLog.find((event) => event.kind === "level.forcedFailedAtGameOver");
  assert.ok(forcedEvent, "expected a forced-fail event to be logged");
  assert.equal(forcedEvent.payload.levelId, "index-jobs");
  assert.equal(forcedEvent.payload.scoringTeam, wrongRunner.team);
  assert.equal(forcedEvent.payload.winConditionType, "runner_reaches_enemy_flag");
  assert.equal(forcedEvent.payload.winConditionRunnerId, "runner_1_AI_AllyP1");
});
