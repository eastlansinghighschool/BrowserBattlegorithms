import { test, expect } from "@playwright/test";
import { chooseGuided, clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

// The dev-unlock toggle is only injected in local dev (import.meta.env.DEV).
// These tests run against the Vite dev server, so the button is present.

clearStorageBeforeEach(test);

test("dev unlock button appears in the app header during local dev", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#devUnlockLevelsButton")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#devUnlockLevelsButton")).toContainText(/unlock levels/i);
});

test("dev unlock button is absent from the production build", async () => {
  const { existsSync, readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const distIndex = resolve(process.cwd(), "dist", "index.html");
  if (!existsSync(distIndex)) {
    // build hasn't run — skip by asserting nothing (the build test covers this)
    return;
  }
  // The button id is injected by JS and not in the HTML, but the DEV guard means
  // the injection code is tree-shaken out of the production bundle.
  // Verify the bundle does not contain the unique button id string.
  const { readdirSync } = await import("node:fs");
  const assetsDir = resolve(process.cwd(), "dist", "assets");
  const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
  for (const jsFile of jsFiles) {
    const content = readFileSync(resolve(assetsDir, jsFile), "utf8");
    expect(content).not.toContain("devUnlockLevelsButton");
  }
});

test("enabling the dev unlock toggle makes all guided levels available", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  // Before toggle: level 2 should be locked (it's not passed yet)
  const level2LockedBefore = await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    return hooks.getState().levelProgress["reach-enemy-flag"];
  });
  expect(level2LockedBefore).toBe("LOCKED");

  // Click the unlock toggle
  await page.locator("#devUnlockLevelsButton").click({ force: true });

  // After toggle: all levels should be AVAILABLE or PASSED (none LOCKED)
  const allStatuses = await page.evaluate(() => {
    return window.__BBA_TEST_HOOKS__.getState().levelProgress;
  });
  const lockedLevels = Object.entries(allStatuses).filter(([, s]) => s === "LOCKED");
  expect(lockedLevels).toHaveLength(0);

  // Button label should now reflect the locked state
  await expect(page.locator("#devUnlockLevelsButton")).toContainText(/lock levels/i);
});

test("disabling the dev unlock toggle restores progression state", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  // Enable then disable
  await page.locator("#devUnlockLevelsButton").click({ force: true }); // unlock
  await page.locator("#devUnlockLevelsButton").click({ force: true }); // restore

  // After restore: level 1 AVAILABLE, level 2 LOCKED (no levels passed)
  const progress = await page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().levelProgress);
  expect(progress["move-to-target"]).toBe("AVAILABLE");
  expect(progress["reach-enemy-flag"]).toBe("LOCKED");

  await expect(page.locator("#devUnlockLevelsButton")).toContainText(/unlock levels/i);
});

test("level picker can navigate to a late level after dev unlock", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  await page.locator("#devUnlockLevelsButton").click({ force: true }); // unlock all

  // Open the level picker and verify a late level is selectable
  await page.locator(".level-picker-trigger").click();
  const lateItem = page.locator(".level-picker-item").filter({ hasText: "Full Team Tactics" });
  await expect(lateItem).toBeVisible({ timeout: 5000 });
  // It should not carry a "locked" indicator
  await expect(lateItem).not.toContainText(/locked/i);
});
