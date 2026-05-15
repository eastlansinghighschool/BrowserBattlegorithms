import { test, expect } from "@playwright/test";
import { clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test("dev guided deep link opens the requested level in Guided Levels mode", async ({ page }) => {
  await page.goto("/?devGuidedLevel=closest-threat");
  await waitForHeavyReady(page);
  await dismissTutorial(page);

  await expect(page.locator("#game-container")).toHaveClass(/guided-dev-blockly-assist/);
  await expect(page.locator("#tutorial-overlay")).not.toContainText("Choose Guided Levels");
  await expect(page.locator(".level-picker-trigger")).toContainText("Level 23: Closest Threat");
  await expect(page.locator("#level-panel")).toContainText("Level 23: Closest Threat");

  await page.locator(".level-picker-trigger").click();
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Closest Threat" })).not.toBeDisabled();
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "How Far Away?" })).toBeDisabled();

  const persistedProgress = await page.evaluate(() => window.localStorage.getItem("bba:guided-level-progress"));
  expect(persistedProgress).toBeNull();
});

test("hash deep links behave the same as query deep links", async ({ page }) => {
  await page.goto("/#devGuidedLevel=one-program-two-allies");
  await waitForHeavyReady(page);
  await dismissTutorial(page);

  await expect(page.locator(".level-picker-trigger")).toContainText("Level 29: One Program, Two Allies");
  await expect(page.locator("#level-panel")).toContainText("Level 29: One Program, Two Allies");
});

test("invalid dev guided deep links fall back to normal guided startup", async ({ page }) => {
  await page.goto("/?devGuidedLevel=not-a-real-level");
  await waitForHeavyReady(page);

  await expect(page.locator("#tutorial-overlay")).toContainText("Guided Levels");

  await page.locator("#tutorial-overlay").getByRole("button", { name: "Guided Levels" }).click();
  await dismissTutorial(page);

  await expect(page.locator("#game-container")).not.toHaveClass(/guided-dev-blockly-assist/);
  await expect(page.locator(".level-picker-trigger")).toContainText("Level 1: Move to Target");
  await expect(page.locator("#level-panel")).toContainText("Level 1: Move to Target");
});

test("assisted dev guided startup opens the first toolbox category and keeps the starter block visible beside the drawer", async ({ page }) => {
  await page.goto("/?devGuidedLevel=score-a-point");
  await waitForHeavyReady(page);
  await page.waitForTimeout(3500);

  const assistState = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const workspace = hooks.getBlocklyWorkspace();
    const toolbox = workspace?.getToolbox?.();
    const toolboxItems = toolbox?.getToolboxItems?.() || [];
    const selectedLabel = toolbox?.getSelectedItem?.()?.getDiv?.()?.textContent?.trim() || "";
    const firstLabel = toolboxItems[0]?.getDiv?.()?.textContent?.trim() || "";
    const flyout = document.querySelector(".blocklyToolboxFlyout");
    const eventBlock = workspace?.getBlocksByType("battlegorithms_on_each_turn", false)?.[0] || null;
    const blocklyRect = document.querySelector("#blocklyDiv")?.getBoundingClientRect?.() || null;
    const canvas = document.querySelector("#canvas-container canvas");
    const canvasRect = canvas?.getBoundingClientRect?.() || null;
    const canvasContainerRect = document.querySelector("#canvas-container")?.getBoundingClientRect?.() || null;
    const flyoutRect = flyout?.getBoundingClientRect?.() || null;
    const blockRect = eventBlock?.getSvgRoot?.()?.getBoundingClientRect?.() || null;
    return {
      assistActive: hooks.getState().guidedLevelBlocklyAssistActive,
      assistApplied: hooks.getState().guidedLevelBlocklyAssistApplied,
      selectedLabel,
      firstLabel,
      flyoutVisible: Boolean(flyout && flyoutRect && flyoutRect.width > 0 && flyoutRect.height > 0),
      blockVisible: Boolean(blockRect && blockRect.width > 0 && blockRect.height > 0),
      blockLeft: blockRect?.left || 0,
      blockRight: blockRect?.right || 0,
      flyoutRight: flyoutRect?.right || 0,
      blocklyRight: blocklyRect?.right || 0,
      canvasLeft: canvasRect?.left || 0,
      canvasRight: canvasRect?.right || 0,
      canvasContainerLeft: canvasContainerRect?.left || 0,
      canvasContainerRight: canvasContainerRect?.right || 0
    };
  });

  expect(assistState).toMatchObject({
    assistActive: true,
    assistApplied: true,
    flyoutVisible: true,
    blockVisible: true
  });

  expect(assistState.selectedLabel).toBe(assistState.firstLabel);
  expect(assistState.blockLeft).toBeGreaterThan(assistState.flyoutRight + 8);
  expect(assistState.blockRight).toBeLessThanOrEqual(assistState.blocklyRight - 8);
  expect(assistState.canvasLeft).toBeGreaterThanOrEqual(assistState.canvasContainerLeft);
  expect(assistState.canvasRight).toBeLessThanOrEqual(assistState.canvasContainerRight);
});
