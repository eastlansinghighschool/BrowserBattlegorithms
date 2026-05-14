import { test, expect } from "@playwright/test";
import { chooseGuided, clearStorageBeforeEach, dismissTutorial, unlockGuidedLevels, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test("guided instructions are visible after dismissing the first tutorial", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await expect(page.locator("#level-panel")).toContainText("Level 1: Move to Target");
  await expect(page.locator("#level-panel")).toContainText("What you are looking at");
  await expect(page.locator("#level-panel")).toContainText("Ally runner");
  await expect(page.locator("#showTutorialButton")).toBeVisible();
  await expect(page.locator("#program-file-controls")).toBeHidden();
  await expect(page.locator("#exportWorkspaceButton")).toBeHidden();
  await expect(page.locator("#importWorkspaceButton")).toBeHidden();
});

test("Blockly execution hints dismiss once a block becomes valid", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.startLevel("sensor-barrier-branch");
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_if_sensor_matches">
              <field name="OBJECT">ENEMY_RUNNER</field>
              <field name="RELATION">DIRECTLY_IN_FRONT</field>
            </block>
          </next>
        </block>
      </xml>
    `);
  });

  const warningIcon = page.locator(".blocklyWarningIcon");
  await expect(warningIcon).toBeVisible();
  await expect.poll(async () => page.evaluate(() => {
    const block = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace().getBlocksByType("battlegorithms_if_sensor_matches", false)[0];
    return block.getIcons().some((icon) => icon.getType()?.toString?.() === "warning");
  })).toBeTruthy();

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_if_sensor_matches">
              <field name="OBJECT">ENEMY_RUNNER</field>
              <field name="RELATION">DIRECTLY_IN_FRONT</field>
              <statement name="DO">
                <block type="battlegorithms_move_down_screen"></block>
              </statement>
            </block>
          </next>
        </block>
      </xml>
    `);
  });

  await expect(page.locator(".blocklyWarningIcon")).toHaveCount(0);
  await expect.poll(async () => page.evaluate(() => {
    const block = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace().getBlocksByType("battlegorithms_if_sensor_matches", false)[0];
    return block.getIcons().some((icon) => icon.getType()?.toString?.() === "warning");
  })).toBeFalsy();
});

test("Blockly warning bubbles stay open while the user opens a toolbox category", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("score-a-point");
    hooks.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_if_have_enemy_flag_else"></block>
          </next>
        </block>
      </xml>
    `);
  });

  const warningIcon = page.locator(".blocklyWarningIcon");
  await expect(warningIcon).toBeVisible();
  await warningIcon.click();

  await expect.poll(async () => page.evaluate(() => {
    const block = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace().getBlocksByType("battlegorithms_if_have_enemy_flag_else", false)[0];
    const warning = block.getIcons().find((icon) => icon.getType?.().toString?.() === "warning");
    return warning?.bubbleIsVisible?.() ?? false;
  })).toBeTruthy();

  await page.getByRole("treeitem", { name: "Conditions" }).first().click();
  await expect.poll(async () => page.evaluate(() => {
    const block = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace().getBlocksByType("battlegorithms_if_have_enemy_flag_else", false)[0];
    const warning = block.getIcons().find((icon) => icon.getType?.().toString?.() === "warning");
    return warning?.bubbleIsVisible?.() ?? false;
  })).toBeTruthy();
  await expect(page.locator(".blocklyToolboxFlyout")).toBeVisible();
});

test("guided level picker shows the current level and lets the learner browse ahead", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await expect(page.locator(".level-picker-trigger")).toContainText("Level 1: Move to Target");
  await page.locator(".level-picker-trigger").click();
  await expect(page.locator(".level-picker-popover")).toBeVisible();
  await expect(page.locator(".level-picker-popover")).toContainText("Level 2: Reach Enemy Flag");
  await expect(page.locator(".level-picker-popover")).toContainText("Level 3: Score a Point");
});

test("challenge levels show a badge in the picker and a challenge callout in the lesson panel", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("show-what-you-know");
  });

  await expect(page.locator(".level-picker-trigger")).toContainText("Challenge");
  await page.locator(".level-picker-trigger").click();
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Show What You Know" })).toContainText("Challenge");
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Move to Target" })).not.toContainText("Challenge");
  await expect(page.locator("#level-panel")).toContainText("Challenge Level");
  await expect(page.locator("#level-panel")).toContainText("No new blocks here. Use tools you already know to build a complete strategy.");

  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Move to Target" }).click();
  await expect(page.locator(".level-picker-trigger")).not.toContainText("Challenge");
  await expect(page.locator("#level-panel")).not.toContainText("Challenge Level");
});

test("project levels show a project badge, project start callout, and persistent project indicator", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await unlockGuidedLevels(page);

  await page.locator(".level-picker-trigger").click();
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Closest Threat" })).toContainText("Project");
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Move to Target" })).not.toContainText("Project");

  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Closest Threat" }).click();
  await dismissTutorial(page);

  await expect(page.locator("#level-panel")).toContainText("Project: Strategy Brain");
  await expect(page.locator("#level-panel")).toContainText("Shared code across this project.");
  await expect(page.locator("#blockly-region")).toContainText("This icon means this level is part of a larger project. Changes will be saved across these levels.");

  await page.locator('#blockly-region [data-project-callout-action="dismiss"]').click();
  await expect(page.locator("#blockly-region")).not.toContainText("This icon means this level is part of a larger project. Changes will be saved across these levels.");

  await page.reload();
  await chooseGuided(page);
  await dismissTutorial(page);
  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Closest Threat" }).click();
  await dismissTutorial(page);
  await expect(page.locator("#blockly-region")).not.toContainText("This icon means this level is part of a larger project. Changes will be saved across these levels.");
});

test("project capstones show both project and challenge framing, and escort the carrier notes the starting flag state", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.startLevel("full-team-tactics");
  });

  await page.locator(".level-picker-trigger").click();
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Full Team Tactics" })).toContainText("Project");
  await expect(page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Full Team Tactics" })).toContainText("Challenge");
  await expect(page.locator("#level-panel")).toContainText("Project: Strategy Brain");
  await expect(page.locator("#level-panel")).toContainText("Challenge Level");

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.startLevel("escort-the-carrier");
  });
  await expect(page.locator("#level-panel")).toContainText("The lead ally starts with the flag already");
});

test("the guided workspace starts with a visible starter program and becomes read-only during play", async ({
  page
}) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await expect(page.locator("#blockly-region")).toContainText("On Each Turn");
  await page.locator("#playResetButton").click();

  await expect(page.locator("#playResetButton")).toContainText("Reset Level");
  await expect(page.locator("#blocklyDiv")).toHaveClass(/blockly-area-read-only/);
});

test("guided panel can switch a level into keyboard practice mode", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await page.locator("#level-panel summary").filter({ hasText: "Human Turn Options" }).click();
  await page.getByRole("button", { name: "Wait For Input" }).click();

  await expect(page.locator("#blockly-region")).toContainText("Keyboard practice");
  await expect(page.locator("#blockly-region")).toContainText("W");
  await expect(page.locator("#blockly-region")).toContainText("F");
});

test("wide layouts can collapse the lesson panel and resize the actual editor workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  const before = await page.evaluate(() => ({
    regionWidth: document.querySelector("#blockly-region").getBoundingClientRect().width,
    svgWidth: document.querySelector(".blocklySvg")?.getBoundingClientRect().width || 0
  }));

  await page.locator('#level-panel button[data-action="toggle-panel-collapse"]').click();
  await page.waitForTimeout(100);

  const after = await page.evaluate(() => ({
    collapsed: document.querySelector("#game-container").classList.contains("lesson-panel-collapsed"),
    regionWidth: document.querySelector("#blockly-region").getBoundingClientRect().width,
    svgWidth: document.querySelector(".blocklySvg")?.getBoundingClientRect().width || 0
  }));

  expect(after.collapsed).toBeTruthy();
  expect(after.regionWidth).toBeGreaterThan(before.regionWidth);
  expect(after.svgWidth).toBeGreaterThan(before.svgWidth);
});

test("desktop workspace size controls resize the editor and persist across reload", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  const before = await page.locator("#blockly-region").boundingBox();
  await page.getByRole("button", { name: "Tall" }).click();
  const tall = await page.locator("#blockly-region").boundingBox();
  expect(tall?.height || 0).toBeGreaterThan(before?.height || 0);

  await page.reload();
  await chooseGuided(page);
  await dismissTutorial(page);
  const afterReload = await page.locator("#blockly-region").boundingBox();
  expect(Math.abs((afterReload?.height || 0) - (tall?.height || 0))).toBeLessThan(2);
});

test("guided HUD shows level state, turn, and title instead of scores", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await expect(page.locator("#scoreDisplay")).toContainText("Level ready");
  await expect(page.locator("#scoreDisplay")).toContainText("Turn: 1");
  await expect(page.locator("#scoreDisplay")).toContainText("Level 1: Move to Target");
  await expect(page.locator("#scoreDisplay")).not.toContainText("Scores:");
});

test("guided reset keeps the learner program and returns the level to Start Level", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_move_forward"></block>
          </next>
        </block>
      </xml>
    `);
  });

  await page.locator("#playResetButton").click();
  await expect(page.locator("#playResetButton")).toContainText("Reset Level");
  await page.locator("#playResetButton").click();

  await expect(page.locator("#playResetButton")).toContainText("Start Level");
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
  await expect(page.locator("#blocklyDiv")).not.toHaveClass(/blockly-area-read-only/);
});
