import { test, expect } from "@playwright/test";
import {
  buildSolutionXml,
  chooseFreePlay,
  chooseGuided,
  clearStorageBeforeEach,
  dismissTutorial,
  loadWorkspaceXml,
  waitForHeavyReady
} from "./helpers.js";

clearStorageBeforeEach(test);

async function getActiveDescriptor(page) {
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!active) {
      return null;
    }
    return {
      tagName: active.tagName,
      id: active.id || null,
      text: `${active.textContent || ""}`.trim().slice(0, 40),
      ariaLabel: active.getAttribute("aria-label") || null
    };
  });
}

test("Blockly number fields accept typed digits again", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  await loadWorkspaceXml(
    page,
    buildSolutionXml(`
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_distance_to_target">
                <field name="TARGET">CLOSEST_ENEMY</field>
              </block>
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
          <block type="battlegorithms_stay_still"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_stay_still"></block>
        </statement>
      </block>
    `)
  );

  await page.waitForFunction(() => {
    const workspace = window.__BBA_TEST_HOOKS__?.getBlocklyWorkspace?.();
    return Boolean(workspace?.getBlocksByType("battlegorithms_value_number", false)[0]?.getField("VALUE"));
  });

  await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const block = workspace.getBlocksByType("battlegorithms_value_number", false)[0];
    block.getField("VALUE").showEditor_();
  });

  await page.keyboard.press("Control+a");
  await page.keyboard.type("42");
  await page.keyboard.press("Tab");

  const value = await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    return workspace.getBlocksByType("battlegorithms_value_number", false)[0].getFieldValue("VALUE");
  });

  expect(value).toBe(42);
});

test("Tab navigation reaches focusable controls and keeps advancing", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  await page.evaluate(() => {
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
  });

  await page.keyboard.press("Tab");
  const first = await getActiveDescriptor(page);
  await page.keyboard.press("Tab");
  const second = await getActiveDescriptor(page);

  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(first).not.toEqual({ tagName: "BODY", id: null, text: "", ariaLabel: null });
  expect(second).not.toEqual(first);
  await page.evaluate(() => {
    document.body.removeAttribute("tabindex");
  });
});

test("welcome modal keeps focus on Guided Levels while the emoji frame animates", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('button[data-tutorial-action="choose-guided"]', { state: "visible" });

  const guidedButton = page.locator('button[data-tutorial-action="choose-guided"]');
  const strip = page.locator(".tutorial-mode-chooser-strip");
  await expect(strip).toBeVisible();
  const beforeText = await strip.textContent();
  expect(beforeText || "").toMatch(/🧎|🏃/);

  await guidedButton.focus();
  await expect(guidedButton).toBeFocused();
  await page.waitForTimeout(1500);

  await expect(guidedButton).toBeFocused();
  const afterText = await strip.textContent();
  expect(afterText || "").toMatch(/🧎|🏃/);
});

test("Enter activates the focused Play button", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  const playButton = page.locator("#playResetButton");
  await expect(playButton).toHaveText("Play");
  await playButton.focus();
  await page.keyboard.press("Enter");

  await expect(playButton).toHaveText("Reset");
  const mainGameState = await page.evaluate(() => window.__BBA_TEST_HOOKS__.app.state.mainGameState);
  expect(mainGameState).toBe("RUNNING");
});

test("Arrow keys adjust the focused speed slider", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  const slider = page.locator("#speedSlider");
  await slider.focus();
  const before = Number(await slider.inputValue());
  await page.keyboard.press("ArrowLeft");
  const afterLeft = Number(await slider.inputValue());
  await page.keyboard.press("ArrowRight");
  const afterRight = Number(await slider.inputValue());

  expect(afterLeft).toBe(before - 1);
  expect(afterRight).toBe(before);
});

test("non-binding keys do not trigger a human action during a running turn", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
    hooks.app.p5Instance?.noLoop?.();
  });

  const before = await page.evaluate(() => {
    const human = window.__BBA_TEST_HOOKS__.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return { x: human.gridX, y: human.gridY };
  });

  await page.keyboard.press("r");

  const after = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return {
      x: human.gridX,
      y: human.gridY,
      queued: hooks.app.state.queuedActionForCurrentRunner,
      turnState: hooks.app.state.currentTurnState
    };
  });

  expect(after).toMatchObject({
    x: before.x,
    y: before.y,
    queued: null,
    turnState: "AWAITING_INPUT"
  });
});

test("modifier-decorated binding keys do not trigger a human action during a running turn", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
  });

  const before = await page.evaluate(() => {
    const human = window.__BBA_TEST_HOOKS__.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return { x: human.gridX, y: human.gridY };
  });

  await page.keyboard.press("Control+w");

  const after = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return {
      x: human.gridX,
      y: human.gridY,
      queued: hooks.app.state.queuedActionForCurrentRunner,
      turnState: hooks.app.state.currentTurnState
    };
  });

  expect(after).toMatchObject({
    x: before.x,
    y: before.y,
    queued: null,
    turnState: "AWAITING_INPUT"
  });
});

test("Blockly focus does not queue a human action during a running turn", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
    hooks.app.p5Instance?.noLoop?.();
  });

  const before = await page.evaluate(() => {
    const human = window.__BBA_TEST_HOOKS__.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return { x: human.gridX, y: human.gridY };
  });

  await page.locator("#blocklyDiv").click();
  await page.keyboard.press("r");

  const after = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return {
      x: human.gridX,
      y: human.gridY,
      queued: hooks.app.state.queuedActionForCurrentRunner,
      turnState: hooks.app.state.currentTurnState
    };
  });

  expect(after).toMatchObject({
    x: before.x,
    y: before.y,
    queued: null,
    turnState: "AWAITING_INPUT"
  });
});

test("Blockly focus blocks the pause shortcut during a running turn", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("human-runner-practice");
    hooks.app.state.mainGameState = "RUNNING";
    hooks.app.state.currentTurnState = "AWAITING_INPUT";
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(human);
    hooks.app.p5Instance?.noLoop?.();
  });

  await page.locator("#blocklyDiv").click();
  await page.keyboard.press("p");

  const after = await page.evaluate(() => ({
    gameplayPaused: window.__BBA_TEST_HOOKS__.app.state.gameplayPaused,
    pauseRequested: window.__BBA_TEST_HOOKS__.app.state.pauseRequested
  }));

  expect(after.gameplayPaused).toBe(false);
  expect(after.pauseRequested).toBe(false);
});

test("guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline", async ({ page }) => {
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

  const before = await page.evaluate(() => {
    const human = window.__BBA_TEST_HOOKS__.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
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
      !state.activeTutorial &&
      !human.isMoving &&
      !human.isBouncing
    );
  });
  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.app.p5Instance?.noLoop?.();
  });
  await page.locator("#playResetButton").focus();
  await page.keyboard.press("d");
  const queuedActionHandle = await page.waitForFunction(() => {
    const queued = window.__BBA_TEST_HOOKS__?.app?.state?.queuedActionForCurrentRunner;
    if (!queued) {
      return null;
    }
    return {
      actionType: queued.actionType,
      targetGridX: queued.targetGridX,
      targetGridY: queued.targetGridY,
      currentTurnState: window.__BBA_TEST_HOOKS__?.app?.state?.currentTurnState
    };
  });
  const queuedAction = await queuedActionHandle.jsonValue();

  expect(queuedAction).toEqual({
    actionType: "MOVE",
    targetGridX: before.x + 1,
    targetGridY: before.y,
    currentTurnState: "PROCESSING_ACTION"
  });

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    for (let i = 0; i < 10; i += 1) {
      hooks.processTurn();
    }
  });

  const after = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const human = hooks.app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
    return {
      queued: hooks.app.state.queuedActionForCurrentRunner,
      actionHistory: hooks.app.state.runnerActionHistory[human.id] || []
    };
  });

  expect(after.actionHistory).toContain("MOVE");
  expect(after.queued).toBeNull();
});
