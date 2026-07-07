import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, LEVEL_RESULT, MAIN_GAME_STATES, TURN_STATES } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { evaluateLevelProgress, initializeLevelState, resetCurrentLevel, startLevel } from "../../src/core/levels.js";
import {
  applyPendingGameplayPauseAtBoundary,
  requestGameplayPause,
  toggleGameplayPause
} from "../../src/core/gameplayPause.js";
import { checkForFlagPickup, checkForScoring } from "../../src/core/scoring.js";
import { handlePlayerInput, processTurnActions } from "../../src/core/turnEngine.js";

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

test("frozen runner turns count as not moved but not blocked", () => {
  const app = createApp();
  app.hooks.getAIAllyAction = () => ({ type: AI_ACTION_TYPES.STAY_STILL });
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const human = app.state.allRunners.find((runner) => runner.isHumanControlled);
  assert.ok(human, "expected a human runner");

  human.setFrozen(1);
  human.recentMovementState.lastMoveWasBlocked = true;
  human.recentMovementState.consecutiveTurnsWithoutMovement = 0;
  const humanRunnerIndex = app.state.allRunners.indexOf(human);
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.state.activeRunnerIndex = humanRunnerIndex;

  processTurnActions(app, TEST_P5);

  assert.equal(human.recentMovementState.lastMoveWasBlocked, false);
  assert.equal(human.recentMovementState.consecutiveTurnsWithoutMovement, 1);
  assert.equal(human.isFrozen, false);
});

test("a frozen active human ignores queued movement input and continues thawing normally", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const human = app.state.allRunners.find((runner) => runner.isHumanControlled);
  assert.ok(human, "expected a human runner");

  human.setFrozen(1);
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(human);

  handlePlayerInput(app, human, { type: AI_ACTION_TYPES.MOVE_FORWARD });

  assert.equal(app.state.currentTurnState, TURN_STATES.AWAITING_INPUT);
  assert.equal(app.state.queuedActionForCurrentRunner, null);

  processTurnActions(app, TEST_P5);

  assert.equal(human.isFrozen, false);
  assert.equal(app.state.currentTurnState, TURN_STATES.AWAITING_INPUT);
  assert.notEqual(app.state.currentTurnState, TURN_STATES.ANIMATING);
});

test("a movement animation-start failure cannot leave the engine stuck in ANIMATING", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && candidate.team === 1);
  assert.ok(runner, "expected a non-human team 1 runner");
  runner.setFrozen(2);

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  app.state.queuedActionForCurrentRunner = {
    runner,
    actionType: AI_ACTION_TYPES.MOVE_FORWARD,
    targetGridX: runner.gridX + runner.playDirection,
    targetGridY: runner.gridY
  };

  processTurnActions(app, TEST_P5);

  assert.notEqual(app.state.currentTurnState, TURN_STATES.ANIMATING);
  assert.equal(runner.isMoving, false);
  assert.equal(runner.isJumping, false);
  assert.equal(runner.isBouncing, false);
});

test("a jump animation-start failure cannot leave the engine stuck in ANIMATING", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const runner = app.state.allRunners.find((candidate) => !candidate.isHumanControlled && candidate.team === 1);
  assert.ok(runner, "expected a non-human team 1 runner");
  runner.canJump = true;
  runner.setFrozen(2);

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  app.state.queuedActionForCurrentRunner = {
    runner,
    actionType: AI_ACTION_TYPES.JUMP_FORWARD,
    targetGridX: runner.gridX + runner.playDirection * 2,
    targetGridY: runner.gridY
  };

  processTurnActions(app, TEST_P5);

  assert.notEqual(app.state.currentTurnState, TURN_STATES.ANIMATING);
  assert.equal(runner.isMoving, false);
  assert.equal(runner.isJumping, false);
  assert.equal(runner.isBouncing, false);
});

test("pause requests apply immediately at a human input boundary and resume clears them", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const human = app.state.allRunners.find((runner) => runner.isHumanControlled);
  assert.ok(human, "expected a human runner");

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(human);

  const pauseResult = requestGameplayPause(app);
  assert.equal(pauseResult, "paused");
  assert.equal(app.state.gameplayPaused, true);
  assert.equal(app.state.pauseRequested, false);

  const resumeResult = toggleGameplayPause(app);
  assert.equal(resumeResult, "resumed");
  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, false);
});

test("reset and start clear stale gameplay pause flags", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  app.state.gameplayPaused = true;
  app.state.pauseRequested = true;
  resetCurrentLevel(app);

  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, false);

  app.state.gameplayPaused = true;
  app.state.pauseRequested = true;
  startLevel(app, "human-runner-practice");

  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, false);
});

test("pending pause waits for a moving runner to finish and then applies at the next boundary", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "human-runner-practice");

  const human = app.state.allRunners.find((runner) => runner.isHumanControlled);
  assert.ok(human, "expected a human runner");

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.ANIMATING;
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(human);

  const pendingResult = requestGameplayPause(app);
  assert.equal(pendingResult, "pending");
  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, true);

  const appliedWhileMoving = applyPendingGameplayPauseAtBoundary(app);
  assert.equal(appliedWhileMoving, false);
  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, true);

  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  const appliedAtBoundary = applyPendingGameplayPauseAtBoundary(app);
  assert.equal(appliedAtBoundary, true);

  assert.equal(app.state.gameplayPaused, true);
  assert.equal(app.state.pauseRequested, false);

  const pausedTurnState = app.state.currentTurnState;
  const pausedTurnNumber = app.state.currentTurnNumber;

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, pausedTurnState);
  assert.equal(app.state.currentTurnNumber, pausedTurnNumber);
});

test("wrong-runner scoring at level 29 forces a failed level result at game over", () => {
  const app = createApp();
  initializeLevelState(app);
  app.state.gameplayPaused = true;
  app.state.pauseRequested = true;

  const { wrongRunner } = scoreWithWrongRunner(app, "one-program-two-allies");

  assert.equal(app.state.mainGameState, MAIN_GAME_STATES.GAME_OVER);
  assert.equal(app.state.currentTurnState, "SETUP_DISPLAY");
  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(app.state.lastLevelResultReason, GAME_OVER_SAFETY_NET_REASON);
  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, false);

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
  app.state.gameplayPaused = true;
  app.state.pauseRequested = true;

  const { wrongRunner } = scoreWithWrongRunner(app, "index-jobs");

  assert.equal(app.state.mainGameState, MAIN_GAME_STATES.GAME_OVER);
  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(app.state.lastLevelResultReason, GAME_OVER_SAFETY_NET_REASON);
  assert.equal(app.state.gameplayPaused, false);
  assert.equal(app.state.pauseRequested, false);

  const forcedEvent = app.state.lastTurnEventLog.find((event) => event.kind === "level.forcedFailedAtGameOver");
  assert.ok(forcedEvent, "expected a forced-fail event to be logged");
  assert.equal(forcedEvent.payload.levelId, "index-jobs");
  assert.equal(forcedEvent.payload.scoringTeam, wrongRunner.team);
  assert.equal(forcedEvent.payload.winConditionType, "runner_reaches_enemy_flag");
  assert.equal(forcedEvent.payload.winConditionRunnerId, "runner_1_AI_AllyP1_2");
});
