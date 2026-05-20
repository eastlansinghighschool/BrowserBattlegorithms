import { test, expect } from "@playwright/test";
import {
  buildSolutionXml,
  chooseGuided,
  clearStorageBeforeEach,
  dismissTutorial,
  loadWorkspaceXml,
  waitForHeavyReady
} from "./helpers.js";
import { AREA_FREEZE_DURATION_TURNS } from "../../src/config/constants.js";

clearStorageBeforeEach(test);

test("passing an early guided level unlocks the next one and Next Level advances into it", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("move-to-target");
    const actor = hooks.app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
    actor.gridX = 4;
    actor.gridY = 4;
    hooks.evaluateLevelProgress();
  });

  await expect(page.locator("#level-panel")).toContainText("Level passed");
  await expect(page.locator("#nextLevelButton")).toBeVisible();
  await page.locator("#nextLevelButton").click();
  await expect(page.locator("#level-panel")).toContainText("Level 2: Reach Enemy Flag");
});

test("level 6 tutorial can open a read-only demo without replacing the learner workspace", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    Object.assign(hooks.app.state.levelProgress, {
      "move-to-target": "PASSED",
      "reach-enemy-flag": "PASSED",
      "score-a-point": "PASSED",
      "barrier-detour": "PASSED",
      "mirror-forward": "PASSED",
      "sensor-barrier-branch": "AVAILABLE"
    });
    hooks.startLevel("sensor-barrier-branch");
    hooks.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_move_forward"></block>
          </next>
        </block>
      </xml>
    `);
    hooks.startCurrentLevelTutorial(true);
  });

  await expect(page.locator("#tutorial-overlay")).toContainText("One Block Shape, Many Sensor Ideas");
  await expect(page.locator(".tutorial-demo-blockly")).toBeVisible();
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});

test("level 24 tutorial shows the piece-by-piece sensor selection demo", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    Object.assign(hooks.app.state.levelProgress, {
      "move-to-target": "PASSED",
      "reach-enemy-flag": "PASSED",
      "score-a-point": "PASSED",
      "barrier-detour": "PASSED",
      "mirror-forward": "PASSED",
      "sensor-barrier-branch": "PASSED",
      "find-the-human": "PASSED",
      "build-the-barrier": "PASSED",
      "bring-it-home": "PASSED",
      "jump-the-gap": "PASSED",
      "jump-if-ready": "PASSED",
      "stay-still-can-do-something": "PASSED",
      "relay-race": "PASSED",
      "freeze-the-lane": "PASSED",
      "how-far-away": "AVAILABLE"
    });
    hooks.startLevel("how-far-away");
    hooks.startCurrentLevelTutorial(true);
  });

  await expect(page.locator("#tutorial-overlay")).toContainText("Example piece-by-piece selection");
  await expect(page.locator(".tutorial-demo-blockly")).toBeVisible();

  await page.waitForFunction(() => {
    const tutorialWorkspace = window.__BBA_TEST_HOOKS__?.app?.tutorialDemoWorkspace;
    if (!tutorialWorkspace) {
      return false;
    }
    const allTypes = tutorialWorkspace.getAllBlocks(false).map((block) => block.type);
    return allTypes.includes("battlegorithms_on_each_turn") && allTypes.includes("battlegorithms_if_boolean_else");
  });

  const demoShape = await page.evaluate(() => {
    const tutorialWorkspace = window.__BBA_TEST_HOOKS__?.app?.tutorialDemoWorkspace;
    const allBlocks = tutorialWorkspace?.getAllBlocks(false) || [];
    const ifBlock = allBlocks.find((block) => block.type === "battlegorithms_if_boolean_else");
    const sensorBlock = ifBlock?.getInput("BOOL")?.connection?.targetBlock?.();
    return {
      allTypes: allBlocks.map((block) => block.type),
      hasSensorBlock: Boolean(sensorBlock && sensorBlock.type === "battlegorithms_boolean_sensor_matches"),
      sensorObject: sensorBlock?.getFieldValue("OBJECT") || null,
      sensorRelation: sensorBlock?.getFieldValue("RELATION") || null
    };
  });

  expect(demoShape.allTypes).toContain("battlegorithms_on_each_turn");
  expect(demoShape.allTypes).toContain("battlegorithms_if_boolean_else");
  expect(demoShape.hasSensorBlock).toBe(true);
  expect(demoShape.sensorObject).toBe("BARRIER");
  expect(demoShape.sensorRelation).toBe("DIRECTLY_IN_FRONT");
});

test("level 10 explains the special-action requirement and does not pass before it is used", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
  });

  await expect(page.locator("#level-panel")).toContainText("Jump or Place Barrier");

  const progressWithoutSpecialAction = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    human.gridX = 10;
    human.gridY = 4;
    return hooks.evaluateLevelProgress();
  });

  expect(progressWithoutSpecialAction?.result || null).toBe(null);
  await expect(page.locator("#level-panel")).not.toContainText("Level passed");
});

test("guided keyboard-practice level wires Team 1 movement through the shared handler", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
  });

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
  });

  const before = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return { x: human.gridX, y: human.gridY };
  });

  await page.waitForFunction(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const state = hooks.app.state;
    const human = state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return (
      state.mainGameState === "RUNNING" &&
      state.currentTurnState === "AWAITING_INPUT" &&
      human &&
      state.allRunners[state.activeRunnerIndex] === human &&
      !human.isMoving &&
      !human.isBouncing
    );
  });

  const keyResult = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const handled = hooks.sendKey("d");
    const queued = hooks.app.state.queuedActionForCurrentRunner;
    return {
      handled,
      actionType: queued?.actionType || null,
      targetGridX: queued?.targetGridX ?? null,
      targetGridY: queued?.targetGridY ?? null,
      currentTurnState: hooks.app.state.currentTurnState
    };
  });

  expect(keyResult.handled).toBe(true);
  expect(keyResult.actionType).toBe("MOVE");
  expect(keyResult.currentTurnState).toBe("PROCESSING_ACTION");
  expect(keyResult.targetGridX).toBeGreaterThan(before.x);
  expect(keyResult.targetGridY).toBe(before.y);
});

test("guided play shows the pause control and resumes from a clean waiting boundary", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
  });

  const pauseButton = page.locator("#pauseResumeButton");
  await expect(pauseButton).toBeVisible();
  await expect(pauseButton).toHaveAccessibleName("Pause game (P)");

  await pauseButton.click();
  await expect(pauseButton).toHaveAccessibleName("Resume game (P)");

  const pausedState = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const beforeTurn = hooks.app.state.currentTurnNumber;
    hooks.processTurn();
    hooks.processTurn();
    return {
      gameplayPaused: hooks.app.state.gameplayPaused,
      pauseRequested: hooks.app.state.pauseRequested,
      currentTurnNumber: hooks.app.state.currentTurnNumber,
      currentTurnState: hooks.app.state.currentTurnState,
      beforeTurn
    };
  });

  expect(pausedState.gameplayPaused).toBe(true);
  expect(pausedState.pauseRequested).toBe(false);
  expect(pausedState.currentTurnNumber).toBe(pausedState.beforeTurn);
  expect(pausedState.currentTurnState).toBe("AWAITING_INPUT");

  await pauseButton.click();
  await expect(pauseButton).toHaveAccessibleName("Pause game (P)");

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "ANIMATING";
    hooks.app.state.gameplayPaused = false;
    hooks.app.state.pauseRequested = true;
    hooks.app.syncUi();
  });
  await expect(pauseButton).toBeDisabled();
  await expect(pauseButton).toHaveAccessibleName("Pausing after this runner (P)");
});

test("a successful freeze records render-ready effect state for the board pulse and badge", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  const effectState = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("freeze-the-lane");

    const state = hooks.app.state;
    const actor = state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
    const enemy = state.allRunners.find((runner) => runner.team === 2 && !runner.isFrozen);
    actor.gridX = 5;
    actor.gridY = 4;
    enemy.gridX = 6;
    enemy.gridY = 4;
    state.mainGameState = "RUNNING";
    state.currentTurnState = "PROCESSING_ACTION";
    state.activeRunnerIndex = state.allRunners.indexOf(actor);
    state.currentTurnNumber = 12;
    state.queuedActionForCurrentRunner = {
      runner: actor,
      actionType: "FREEZE_OPPONENTS",
      targetGridX: actor.gridX,
      targetGridY: actor.gridY
    };
    hooks.processTurn();

    return {
      effect: state.areaFreezeEffect ? {
        casterRunnerId: state.areaFreezeEffect.casterRunnerId,
        casterCell: state.areaFreezeEffect.casterCell,
        radius: state.areaFreezeEffect.radius,
        affectedRunners: state.areaFreezeEffect.affectedRunners,
        durationMs: state.areaFreezeEffect.durationMs
      } : null,
      enemyFrozen: enemy.isFrozen,
      frozenTurnsRemaining: enemy.frozenTurnsRemaining,
      cooldownTurn: state.teamAreaFreezeNextAvailableTurn[1]
    };
  });

  expect(effectState.effect).not.toBeNull();
  expect(effectState.effect.casterRunnerId).toBe("runner_1_AI_AllyP1");
  expect(effectState.effect.casterCell).toEqual({ x: 5, y: 4 });
  expect(effectState.effect.radius).toBe(2);
  expect(effectState.effect.affectedRunners.length).toBeGreaterThan(0);
  expect(effectState.effect.affectedRunners[0].frozenTurnsRemaining).toBe(AREA_FREEZE_DURATION_TURNS);
  expect(effectState.enemyFrozen).toBe(true);
  expect(effectState.frozenTurnsRemaining).toBe(AREA_FREEZE_DURATION_TURNS);
  expect(effectState.cooldownTurn).toBe(22);
});

test("a representative advanced teamwork level can pass through the visible guided flow", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("one-program-two-allies");
  });

  await loadWorkspaceXml(
    page,
    buildSolutionXml(`
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_runner_index"></block>
            </value>
            <field name="OPERATOR">EQ</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_stay_still"></block>
        </statement>
      </block>
    `)
  );

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    for (let tick = 0; tick < 300; tick += 1) {
      hooks.processTurn();
      if (hooks.app.state.activeLevelResult === "PASSED" || hooks.app.state.activeLevelResult === "FAILED") {
        break;
      }
    }
  });

  await expect(page.locator("#level-panel")).toContainText("Level passed");
});
