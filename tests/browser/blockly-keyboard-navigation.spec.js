import { expect, test } from "@playwright/test";
import { chooseFreePlay, clearStorageBeforeEach, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

async function pressSequence(page, keys, delayMs = 180) {
  for (const key of keys) {
    await page.keyboard.press(key);
    await page.waitForTimeout(delayMs);
  }
}

test("slash opens the Blockly keyboard shortcuts dialog", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  await page.locator("#blocklyDiv").click();
  await page.keyboard.press("T");
  await page.waitForTimeout(150);
  await page.keyboard.press("/");

  const shortcuts = page.locator("#shortcuts");
  await expect(shortcuts).toContainText("Keyboard shortcuts");
  await expect(shortcuts).toContainText("List shortcuts");
  await expect(shortcuts.locator(".shortcut-modal")).toBeVisible();
});

test("keyboard users can insert a Move Toward block and edit its dropdown field", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  await page.locator("#blocklyDiv").click();
  await pressSequence(page, [
    "T",
    "ArrowDown",
    "ArrowDown",
    "ArrowRight",
    "Enter",
    "T",
    "W",
    "ArrowRight",
    "ArrowRight",
    "ArrowRight",
    "Enter",
    "Enter",
    "ArrowDown",
    "Enter"
  ]);

  const target = await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const moveToward = workspace.getAllBlocks(false).find((block) => block.type === "battlegorithms_move_toward");
    return moveToward?.getFieldValue("TARGET") || null;
  });

  expect(target).toBe("MY_BASE");
  await expect(page.locator("#blocklyDiv")).toContainText("my base ▾");
});

test("Blockly focus stays inside the workspace while the shortcuts dialog is available", async ({ page }) => {
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
