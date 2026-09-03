import { test, expect } from "@playwright/test";
import { chooseGuided, dismissTutorial } from "./helpers.js";

test.describe("Blocked storage resilience (Plan 118)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          const err = new Error("SecurityError: access denied");
          err.name = "SecurityError";
          throw err;
        },
        configurable: true
      });
    });
  });

  test("storage notice banner appears when localStorage is blocked and can be dismissed", async ({ page }) => {
    await page.goto("/");
    await chooseGuided(page);
    await dismissTutorial(page);

    const storageStatus = page.locator("#storage-status");
    await expect(storageStatus).toBeVisible();
    await expect(storageStatus).toContainText(
      "This browser is blocking saving. You can keep playing, but your program will be lost if you reload or close this tab."
    );

    // Dismiss the banner
    const dismissButton = page.locator("#storageStatusDismiss");
    await dismissButton.click();

    await expect(storageStatus).toBeHidden();
  });
});
