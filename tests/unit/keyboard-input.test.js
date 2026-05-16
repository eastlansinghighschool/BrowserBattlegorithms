import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_ACTION_TYPES,
  MAIN_GAME_STATES,
  P1_KEY_BINDINGS,
  P2_KEY_BINDINGS,
  TURN_STATES
} from "../../src/config/constants.js";
import { Runner } from "../../src/entities/Runner.js";
import { createApp } from "../../src/core/state.js";
import { handleKeyInput } from "../../src/ui/controls.js";

function buildHumanTurnApp(team = 1) {
  const app = createApp();
  const runner = new Runner(5, 5, team, true, `human_${team}`, false);
  app.state.allRunners = [runner];
  app.state.activeRunnerIndex = 0;
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.state.queuedActionForCurrentRunner = null;
  app.state.activeTutorial = null;
  return { app, runner };
}

function assertMoved(app, runner, key, expectedDx, expectedDy) {
  const handled = handleKeyInput(app, key);
  assert.equal(handled, true);
  assert.equal(app.state.queuedActionForCurrentRunner.runner, runner);
  assert.equal(app.state.queuedActionForCurrentRunner.actionType, "MOVE");
  assert.equal(app.state.queuedActionForCurrentRunner.targetGridX, runner.gridX + expectedDx);
  assert.equal(app.state.queuedActionForCurrentRunner.targetGridY, runner.gridY + expectedDy);
}

function assertSpecialAction(app, runner, key, expectedActionType) {
  const handled = handleKeyInput(app, key);
  assert.equal(handled, true);
  assert.equal(app.state.queuedActionForCurrentRunner.runner, runner);
  assert.equal(app.state.queuedActionForCurrentRunner.actionType, expectedActionType);
}

test("handleKeyInput rejects every guard branch before queueing an action", () => {
  const blockedScenarios = [
    {
      name: "active tutorial",
      mutate(app) {
        app.state.activeTutorial = { key: "demo" };
      }
    },
    {
      name: "main game not running",
      mutate(app) {
        app.state.mainGameState = MAIN_GAME_STATES.SETUP;
      }
    },
    {
      name: "game over turn state",
      mutate(app) {
        app.state.currentTurnState = TURN_STATES.GAME_OVER;
      }
    },
    {
      name: "missing active runner",
      mutate(app) {
        app.state.allRunners = [];
      }
    },
    {
      name: "non-human runner",
      mutate(app, runner) {
        runner.isHumanControlled = false;
      }
    },
    {
      name: "runner moving",
      mutate(app, runner) {
        runner.isMoving = true;
      }
    },
    {
      name: "runner bouncing",
      mutate(app, runner) {
        runner.isBouncing = true;
      }
    },
    {
      name: "wrong turn state",
      mutate(app) {
        app.state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
      }
    }
  ];

  for (const scenario of blockedScenarios) {
    const { app, runner } = buildHumanTurnApp(1);
    scenario.mutate(app, runner);
    assert.equal(handleKeyInput(app, "w"), false, scenario.name);
    assert.equal(app.state.queuedActionForCurrentRunner, null, scenario.name);
  }
});

test("handleKeyInput rejects unmatched keys during a valid human turn", () => {
  const invalidKeys = ["5", "q", ""];
  for (const key of invalidKeys) {
    const { app } = buildHumanTurnApp(1);
    assert.equal(handleKeyInput(app, key), false, `key ${JSON.stringify(key)}`);
    assert.equal(app.state.queuedActionForCurrentRunner, null, `key ${JSON.stringify(key)}`);
  }
});

test("handleKeyInput queues every Team 1 binding during a Team 1 human turn", () => {
  const moveCases = [
    { key: P1_KEY_BINDINGS.UP, dx: 0, dy: -1 },
    { key: P1_KEY_BINDINGS.DOWN, dx: 0, dy: 1 },
    { key: P1_KEY_BINDINGS.LEFT, dx: -1, dy: 0 },
    { key: P1_KEY_BINDINGS.RIGHT, dx: 1, dy: 0 }
  ];
  const specialCases = [
    { key: P1_KEY_BINDINGS.JUMP, actionType: AI_ACTION_TYPES.JUMP_FORWARD },
    { key: P1_KEY_BINDINGS.PLACE_BARRIER, actionType: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD },
    { key: P1_KEY_BINDINGS.STAY_STILL, actionType: AI_ACTION_TYPES.STAY_STILL }
  ];

  for (const scenario of moveCases) {
    const { app, runner } = buildHumanTurnApp(1);
    assertMoved(app, runner, scenario.key, scenario.dx, scenario.dy);
  }

  for (const scenario of specialCases) {
    const { app, runner } = buildHumanTurnApp(1);
    assertSpecialAction(app, runner, scenario.key, scenario.actionType);
  }
});

test("handleKeyInput queues every Team 2 binding during a Team 2 human turn", () => {
  const moveCases = [
    { key: P2_KEY_BINDINGS.UP, dx: 0, dy: -1 },
    { key: P2_KEY_BINDINGS.DOWN, dx: 0, dy: 1 },
    { key: P2_KEY_BINDINGS.LEFT, dx: -1, dy: 0 },
    { key: P2_KEY_BINDINGS.RIGHT, dx: 1, dy: 0 }
  ];
  const specialCases = [
    { key: P2_KEY_BINDINGS.JUMP, actionType: AI_ACTION_TYPES.JUMP_FORWARD },
    { key: P2_KEY_BINDINGS.PLACE_BARRIER, actionType: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD },
    { key: P2_KEY_BINDINGS.STAY_STILL, actionType: AI_ACTION_TYPES.STAY_STILL }
  ];

  for (const scenario of moveCases) {
    const { app, runner } = buildHumanTurnApp(2);
    assertMoved(app, runner, scenario.key, scenario.dx, scenario.dy);
  }

  for (const scenario of specialCases) {
    const { app, runner } = buildHumanTurnApp(2);
    assertSpecialAction(app, runner, scenario.key, scenario.actionType);
  }
});

test("handleKeyInput rejects Team 1 keys during Team 2 turns and Team 2 keys during Team 1 turns", () => {
  const team1Turn = buildHumanTurnApp(1);
  assert.equal(handleKeyInput(team1Turn.app, P2_KEY_BINDINGS.UP), false);
  assert.equal(team1Turn.app.state.queuedActionForCurrentRunner, null);

  const team2Turn = buildHumanTurnApp(2);
  assert.equal(handleKeyInput(team2Turn.app, P1_KEY_BINDINGS.UP), false);
  assert.equal(team2Turn.app.state.queuedActionForCurrentRunner, null);
});
