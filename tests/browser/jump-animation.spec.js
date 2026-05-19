import { test, expect } from "@playwright/test";
import { buildSolutionXml, chooseGuided, clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

function getJumpWorkspaceXml() {
  return buildSolutionXml(`<block type="battlegorithms_jump_forward"></block>`);
}

test("jump forward arcs above the lane before landing on the expected cell", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await waitForHeavyReady(page);
  await dismissTutorial(page);

  await page.evaluate((xml) => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("jump-the-gap");
    hooks.app.state.animationSpeedFactor = 0.6;
    hooks.loadWorkspaceXml(xml);
  }, getJumpWorkspaceXml());

  await page.waitForFunction(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const state = hooks?.getState?.();
    const runner = state?.allRunners?.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return Boolean(runner?.isJumping && runner.animationProgress > 0.25 && runner.animationProgress < 1);
  });

  const midFlight = await page.evaluate(() => {
    const state = window.__BBA_TEST_HOOKS__.getState();
    const runner = state.allRunners.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return {
      pixelY: runner.pixelY,
      originY: runner.gridY * 50
    };
  });

  expect(Math.abs(midFlight.pixelY - midFlight.originY)).toBeGreaterThan(2);

  await page.waitForFunction(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const state = hooks?.getState?.();
    const runner = state?.allRunners?.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return Boolean(runner && !runner.isJumping && runner.gridX === 3 && runner.gridY === 4);
  });

  const landing = await page.evaluate(() => {
    const state = window.__BBA_TEST_HOOKS__.getState();
    const runner = state.allRunners.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return {
      gridX: runner.gridX,
      gridY: runner.gridY,
      pixelX: runner.pixelX,
      pixelY: runner.pixelY
    };
  });

  expect(landing).toMatchObject({
    gridX: 3,
    gridY: 4,
    pixelX: 150,
    pixelY: 200
  });
});

test("blocked jump targets reverse back to the origin cell and keep jump availability spent", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await waitForHeavyReady(page);
  await dismissTutorial(page);

  await page.evaluate((xml) => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("jump-the-gap");
    hooks.loadWorkspaceXml(xml);
    hooks.app.state.barriers.push({
      gridX: 3,
      gridY: 4,
      ownerRunnerId: "test_jump_block"
    });
  }, getJumpWorkspaceXml());

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const state = hooks.app.state;
    const runner = state.allRunners.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    state.animationSpeedFactor = 0.6;
    state.mainGameState = "RUNNING";
    state.currentTurnState = "PROCESSING_ACTION";
    state.activeRunnerIndex = state.allRunners.indexOf(runner);
    state.queuedActionForCurrentRunner = {
      runner,
      actionType: "JUMP_FORWARD",
      targetGridX: runner.gridX + runner.playDirection * 2,
      targetGridY: runner.gridY
    };
    hooks.processTurn();
  });

  await page.waitForFunction(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const state = hooks?.getState?.();
    const runner = state?.allRunners?.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return Boolean(runner?.isJumping && runner.animationProgress > 0 && runner.animationProgress < 1);
  });

  await page.evaluate(async () => {
    const hooks = window.__BBA_TEST_HOOKS__;
    for (let step = 0; step < 240; step += 1) {
      hooks.processTurn();
      const state = hooks.getState();
      const runner = state.allRunners.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
      if (runner && !runner.isJumping && runner.gridX === 1 && runner.gridY === 4) {
        return;
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });

  const failure = await page.evaluate(() => {
    const state = window.__BBA_TEST_HOOKS__.getState();
    const runner = state.allRunners.find((candidate) => candidate.id === "runner_1_AI_AllyP1");
    return {
      gridX: runner.gridX,
      gridY: runner.gridY,
      pixelX: runner.pixelX,
      pixelY: runner.pixelY,
      canJump: runner.canJump,
      isJumping: runner.isJumping,
      turnState: state.currentTurnState
    };
  });

  expect(failure).toMatchObject({
    gridX: 1,
    gridY: 4,
    pixelX: 50,
    pixelY: 200,
    canJump: false,
    isJumping: false
  });
  expect(failure.turnState).not.toBe("ANIMATING");
});
