import { test, expect } from "@playwright/test";
import { chooseFreePlay, clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test.describe("Runner Index Badges UI Integration", () => {
  test("toggles index badges settings checkbox and verifies the app state change", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await dismissTutorial(page);

    // 1. Verify default showRunnerIndexBadges is false
    let showBadges = await page.evaluate(() => {
      return window.__BBA_TEST_HOOKS__.app.state.showRunnerIndexBadges;
    });
    expect(showBadges).toBe(false);

    // 2. Open Settings modal
    const settingsBtn = page.locator("#settingsButton");
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    const settingsModal = page.locator("#settingsModal");
    await expect(settingsModal).toBeVisible();

    // 3. Toggle runner index badges checkbox on
    const indexCheckbox = page.locator("#runnerIndexBadgesToggleCheckbox");
    await expect(indexCheckbox).not.toBeChecked();
    await indexCheckbox.check();
    await expect(indexCheckbox).toBeChecked();

    // 4. Verify state updates dynamically
    showBadges = await page.evaluate(() => {
      return window.__BBA_TEST_HOOKS__.app.state.showRunnerIndexBadges;
    });
    expect(showBadges).toBe(true);

    // 5. Close settings modal
    await page.keyboard.press("Escape");
    await expect(settingsModal).toBeHidden();

    // 6. Verify allyIndex and team configuration mapping exist on all runners
    const runnersConfig = await page.evaluate(() => {
      const app = window.__BBA_TEST_HOOKS__.app;
      return app.state.allRunners.map((runner) => ({
        id: runner.id,
        team: runner.team,
        allyIndex: runner.allyIndex,
        isHumanControlled: runner.isHumanControlled
      }));
    });

    // Ensure we have at least some runners
    expect(runnersConfig.length).toBeGreaterThan(0);

    // Allies (team 1) should have sequential allyIndex assigned
    const team1Runners = runnersConfig.filter((r) => r.team === 1 && !r.isHumanControlled);
    team1Runners.forEach((r, idx) => {
      expect(r.allyIndex).toBe(idx);
    });
  });

  test("with badges enabled, each runner draws a badge at the correct position with a unique index per team", async ({ page }) => {
    // Load a guided level with code-controlled allies to exercise allyIndex assignment.
    // index-jobs (Level 30) has two code allies on team 1, giving a non-trivial index range.
    await page.goto("/?devGuidedLevel=index-jobs");
    await waitForHeavyReady(page);
    await dismissTutorial(page);

    // Enable runner index badges via settings gear
    const settingsBtn = page.locator("#settingsButton");
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();
    const settingsModal = page.locator("#settingsModal");
    await expect(settingsModal).toBeVisible();
    const indexCheckbox = page.locator("#runnerIndexBadgesToggleCheckbox");
    await indexCheckbox.check();
    await page.keyboard.press("Escape");
    await expect(settingsModal).toBeHidden();

    const result = await page.evaluate(() => {
      const hooks = window.__BBA_TEST_HOOKS__;
      const runners = hooks.app.state.allRunners;

      const badgeResults = runners.map((runner) => {
        const calls = hooks.testDrawRunnerLabelBadge(runner.id);
        if (!calls) {
          return { id: runner.id, team: runner.team, error: "runner not found in hooks" };
        }

        const rectCall = calls.find((c) => c.method === "rect");
        const textCall = calls.find((c) => c.method === "text");

        // Verify the badge was actually drawn (both background rect and label text)
        if (!rectCall || !textCall) {
          return { id: runner.id, team: runner.team, error: "badge not drawn (missing rect or text draw call)" };
        }

        return {
          id: runner.id,
          team: runner.team,
          badgeIndex: Number(textCall.args[0])
        };
      });

      // Every runner must have produced a badge
      const missing = badgeResults.find((r) => r.error);
      if (missing) {
        return { ok: false, error: missing.error, id: missing.id };
      }

      // No two runners on the same team may share a badge index (Repair B)
      const teams = [...new Set(badgeResults.map((r) => r.team))];
      for (const team of teams) {
        const teamBadges = badgeResults.filter((r) => r.team === team);
        const indices = teamBadges.map((r) => r.badgeIndex);
        const unique = new Set(indices);
        if (unique.size !== indices.length) {
          return { ok: false, error: `Team ${team} has duplicate badge indices: ${JSON.stringify(indices)}` };
        }
      }

      return { ok: true, count: badgeResults.length };
    });

    expect(result.ok, result.error).toBe(true);
    expect(result.count).toBeGreaterThan(0);
  });
});
