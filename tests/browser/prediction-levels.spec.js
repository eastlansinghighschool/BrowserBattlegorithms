import { test, expect } from "@playwright/test";
import { chooseGuided, clearStorageBeforeEach, dismissTutorial, unlockGuidedLevels, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

async function openPredictionLevel(page, levelName) {
  await unlockGuidedLevels(page);
  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: levelName }).click();
}

test("prediction levels gate Start Level until a choice is selected and preserve the choice through reset", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await chooseGuided(page);
  await dismissTutorial(page);
  await openPredictionLevel(page, "Prediction: First Move");
  await dismissTutorial(page);

  await expect(page.locator("#prediction-prompt-prediction-06")).toHaveText("Where will the ally move on its first turn?");
  await expect(page.locator("#prediction-start-affordance-prediction-06")).toBeVisible();
  await expect(page.locator("#playResetButton")).toBeDisabled();
  await expect(page.locator("#playResetButton")).toHaveAttribute("aria-disabled", "true");
  await expect(page.locator("#playResetButton")).toHaveAttribute("aria-describedby", "prediction-start-affordance-prediction-06");

  await page.getByLabel("Right").check();
  await expect(page.locator("#playResetButton")).toBeEnabled();
  await expect(page.locator("#playResetButton")).not.toHaveAttribute("aria-disabled", "true");
  await expect(page.locator("#prediction-start-affordance-prediction-06")).toHaveCount(0);

  await page.locator("#playResetButton").click();
  await expect(page.locator("#level-panel")).toContainText("Prediction Result");
  await expect(page.locator("#level-panel")).toContainText("You predicted Right.");
  await expect(page.locator("#level-panel")).toContainText("The program did move right one square to (2, 4).");
  await expect(page.locator("#level-panel")).toContainText("nice tracing");

  await page.locator("#playResetButton").click();
  await expect(page.locator("#playResetButton")).toHaveText("Start Level");
  await expect(page.locator("#playResetButton")).toBeEnabled();
  await expect(page.locator("#level-panel")).toContainText("You predicted Right.");
  const predictionSnapshot = await page.evaluate(() => window.__BBA_TEST_HOOKS__.getLevelState().predictionForCurrentLevel);
  expect(predictionSnapshot).toMatchObject({
    levelId: "prediction-06",
    choiceId: "right",
    lockedAt: "result_shown"
  });
});

test("prediction levels expose a native radiogroup for keyboard navigation and render a result comparison", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await chooseGuided(page);
  await dismissTutorial(page);
  await openPredictionLevel(page, "Prediction: Role Split");
  await dismissTutorial(page);

  await expect(page.locator("#prediction-prompt-prediction-31")).toHaveText("Which runner will move forward on the first turn?");
  await expect(page.locator("#level-panel")).toContainText("One branch faces two allies. Which runner enters it?");

  await page.getByLabel("Runner 0").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByLabel("Runner 1")).toBeChecked();
  await expect(page.locator("#playResetButton")).toBeEnabled();

  await page.getByLabel("Runner 0").check();
  await page.locator("#playResetButton").click();

  await expect(page.locator("#level-panel")).toContainText("You predicted Runner 0.");
  await expect(page.locator("#level-panel")).toContainText("Runner 0 moves forward while Runner 1 stays still");
  await expect(page.locator("#level-panel")).toContainText("prediction matched what happened");
});
