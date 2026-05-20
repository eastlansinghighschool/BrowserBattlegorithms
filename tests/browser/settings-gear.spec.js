import { test, expect } from "@playwright/test";
import { chooseFreePlay, clearStorageBeforeEach, dismissTutorial } from "./helpers.js";

clearStorageBeforeEach(test);

test.describe("Settings Gear Modal Panel", () => {
  test("opens the modal, toggles sound, persists on reload, and closes on ESC or Cancel", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await dismissTutorial(page);

    // 1. Verify gear button exists and settings modal starts hidden
    const settingsBtn = page.locator("#settingsButton");
    await expect(settingsBtn).toBeVisible();

    const settingsModal = page.locator("#settingsModal");
    await expect(settingsModal).toBeHidden();

    // 2. Open settings modal
    await settingsBtn.click();
    await expect(settingsModal).toBeVisible();

    // Check focus returned to first input (soundToggleCheckbox)
    await expect(page.locator("#soundToggleCheckbox")).toBeFocused();

    // 3. Toggle Sound Off
    const soundCheckbox = page.locator("#soundToggleCheckbox");
    await expect(soundCheckbox).toBeChecked(); // default is true/checked
    await soundCheckbox.uncheck();
    await expect(soundCheckbox).not.toBeChecked();

    // 4. Reload page and check preference was persisted to localStorage
    await page.reload();
    await chooseFreePlay(page);
    await dismissTutorial(page);

    await page.locator("#settingsButton").click();
    await expect(page.locator("#soundToggleCheckbox")).not.toBeChecked();

    // 5. Close settings modal using ESC key
    await page.keyboard.press("Escape");
    await expect(settingsModal).toBeHidden();

    // Focus returns to the settings gear button
    await expect(page.locator("#settingsButton")).toBeFocused();

    // 6. Reopen and close settings modal using the Cancel button
    await page.locator("#settingsButton").click();
    await expect(settingsModal).toBeVisible();
    await page.locator('button[data-settings-action="cancel"]').click();
    await expect(settingsModal).toBeHidden();
  });

  test("implements a proper focus trap", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await dismissTutorial(page);

    await page.locator("#settingsButton").click();
    await expect(page.locator("#settingsModal")).toBeVisible();

    const focusable = page.locator("#settingsModal input, #settingsModal select, #settingsModal button").filter({ visible: true });
    const first = focusable.first();
    const last = focusable.last();

    // Focus first
    await first.focus();
    await expect(first).toBeFocused();

    // Shift+Tab should wrap to the last focusable element
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();

    // Tab from last should wrap to the first focusable element
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
  });

  test("toggles other settings (lowMotion, animation, badges) and updates state", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await dismissTutorial(page);

    await page.locator("#settingsButton").click();
    await expect(page.locator("#settingsModal")).toBeVisible();

    const lowMotionCheckbox = page.locator("#lowMotionToggleCheckbox");
    const movementCheckbox = page.locator("#runnerMovementToggleCheckbox");
    const jumpingCheckbox = page.locator("#runnerJumpingToggleCheckbox");
    const frozenCheckbox = page.locator("#frozenBadgesToggleCheckbox");
    const indexCheckbox = page.locator("#runnerIndexBadgesToggleCheckbox");

    // Verify default checkbox values
    await expect(lowMotionCheckbox).not.toBeChecked();
    await expect(movementCheckbox).toBeChecked();
    await expect(jumpingCheckbox).toBeChecked();
    await expect(frozenCheckbox).toBeChecked();
    await expect(indexCheckbox).not.toBeChecked();

    // Toggle them
    await lowMotionCheckbox.check();
    await movementCheckbox.uncheck();
    await jumpingCheckbox.uncheck();
    await frozenCheckbox.uncheck();
    await indexCheckbox.check();

    // Verify changed state on page.evaluate
    const state = await page.evaluate(() => window.__BBA_TEST_HOOKS__.app.state);
    expect(state.lowMotionOverride).toBe(true);
    expect(state.runnerMovementAnimations).toBe(false);
    expect(state.runnerJumpingAnimations).toBe(false);
    expect(state.showFrozenBadges).toBe(false);
    expect(state.showRunnerIndexBadges).toBe(true);

    // Reload page and verify they persist
    await page.reload();
    await chooseFreePlay(page);
    await dismissTutorial(page);

    await page.locator("#settingsButton").click();
    await expect(page.locator("#lowMotionToggleCheckbox")).toBeChecked();
    await expect(page.locator("#runnerMovementToggleCheckbox")).not.toBeChecked();
    await expect(page.locator("#runnerJumpingToggleCheckbox")).not.toBeChecked();
    await expect(page.locator("#frozenBadgesToggleCheckbox")).not.toBeChecked();
    await expect(page.locator("#runnerIndexBadgesToggleCheckbox")).toBeChecked();
  });
});
