import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { initializeLevelState, startLevel } from "../../src/core/levels.js";
import { processTurnActions } from "../../src/core/turnEngine.js";

const TEST_P5 = {
  lerp(start, end, amount) {
    return start + (end - start) * amount;
  }
};

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
