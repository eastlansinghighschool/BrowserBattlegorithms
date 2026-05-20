import { test, expect } from "@playwright/test";
import { clearStorageBeforeEach, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

async function seedNarration(page, eventLog, stateUpdates = {}) {
  await page.evaluate(({ eventLog: nextEventLog, stateUpdates: updates }) => {
    const hooks = window.__BBA_TEST_HOOKS__;
    Object.assign(hooks.app.state, {
      showModePicker: false,
      mainGameState: "RUNNING",
      lastTurnEventLog: nextEventLog,
      lastTurnNarrationText: "",
      narrationVisibleStrip: false,
      ...updates
    });
    hooks.app.syncUi();
    hooks.app.hooks.announceLastTurn(hooks.app);
  }, { eventLog, stateUpdates });
}

test("the aria-live region exists and announces a move with pickup text", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);

  await seedNarration(page, [
    {
      kind: "turn.started",
      turn: 5,
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      turn: 5,
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "moved",
        targetCell: { x: 3, y: 2 }
      }
    },
    {
      kind: "flag.pickedUp",
      turn: 5,
      payload: {}
    }
  ]);

  await expect(page.locator("#board-narration")).toHaveAttribute("aria-live", "polite");
  await expect(page.locator("#board-narration")).toHaveText("Turn 5. Ally 0 moved to row 3, column 4 and picked up the enemy flag.");
  await expect(page.locator("#board-narration-strip")).toBeHidden();
});

test("the aria-live region announces scoring and level completion", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);

  await seedNarration(page, [
    {
      kind: "turn.started",
      turn: 9,
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      turn: 9,
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "moved",
        targetCell: { x: 7, y: 4 }
      }
    },
    {
      kind: "team.scored",
      turn: 9,
      payload: {
        scoringTeam: 1,
        newScore: 1,
        otherScore: 0
      }
    },
    {
      kind: "level.result",
      turn: 9,
      payload: {
        result: "PASSED"
      }
    }
  ]);

  await expect(page.locator("#board-narration")).toHaveText("Turn 9. Ally 0 moved to row 5, column 8. Ally 0 returned the enemy flag to base. Team 1 scored. Score 1 to 0. Level passed.");
});

test("the visible turn log strip is hidden by default and appears when enabled", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);

  await seedNarration(page, [
    {
      kind: "turn.started",
      turn: 3,
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      turn: 3,
      payload: {
        actionType: "FREEZE_OPPONENTS",
        outcome: "freeze_applied"
      }
    }
  ]);

  const strip = page.locator("#board-narration-strip");
  const toggle = page.locator("#turnLogToggle");

  await expect(strip).toBeHidden();
  await page.locator("#settingsButton").click();
  await expect(toggle).toBeVisible();
  await toggle.evaluate((element) => {
    element.checked = true;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(toggle).toBeChecked();
  await expect(strip).toBeVisible();
  await expect(strip).toHaveText("Turn 3. Ally 0 froze opponents.");

  await page.reload();
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.app.syncUi();
  });

  await page.locator("#settingsButton").click();
  await expect(page.locator("#turnLogToggle")).toBeChecked();
});

test("setup screens suppress narration updates", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    Object.assign(hooks.app.state, {
      showModePicker: true,
      mainGameState: "SETUP",
      lastTurnEventLog: [
        {
          kind: "turn.started",
          turn: 1,
          payload: {
            runnerId: "runner_ally_0",
            runnerLabel: "Ally 0"
          }
        },
        {
          kind: "runner.actionResolved",
          turn: 1,
          payload: {
            actionType: "MOVE_FORWARD",
            outcome: "moved",
            targetCell: { x: 2, y: 2 }
          }
        }
      ],
      lastTurnNarrationText: "stale"
    });
    hooks.app.hooks.announceLastTurn(hooks.app);
  });

  await expect(page.locator("#board-narration")).toHaveText("");
  await expect(page.locator("#board-narration-strip")).toBeHidden();
});
