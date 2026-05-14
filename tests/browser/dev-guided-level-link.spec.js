import { test, expect } from "@playwright/test";
import { clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test("dev guided deep link opens the requested level in Guided Levels mode", async ({ page }) => {
  await page.goto("/?devGuidedLevel=closest-threat");
  await waitForHeavyReady(page);
  await dismissTutorial(page);

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

  await expect(page.locator(".level-picker-trigger")).toContainText("Level 1: Move to Target");
  await expect(page.locator("#level-panel")).toContainText("Level 1: Move to Target");
});
