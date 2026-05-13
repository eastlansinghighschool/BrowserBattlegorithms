import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { buildSolutionXml, chooseFreePlay, chooseGuided, clearStorageBeforeEach, dismissTutorial, loadWorkspaceXml } from "./helpers.js";

clearStorageBeforeEach(test);

test("guided programs restore across a page reload", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));

  await page.reload();
  await chooseGuided(page);
  await dismissTutorial(page);

  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});

test("free-play player program restores across a page reload", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));

  await page.reload();
  await chooseFreePlay(page);

  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});

test("PvP team programs restore separately across a page reload", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await page.locator('select[data-action="free-play-mode"]').selectOption("PVP");

  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));
  await page.getByRole("button", { name: "Team 2 Program" }).click();
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`));

  await page.reload();
  await chooseFreePlay(page);
  await page.locator('select[data-action="free-play-mode"]').selectOption("PVP");

  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
  await page.getByRole("button", { name: "Team 2 Program" }).click();
  await expect(page.locator("#blockly-region")).toContainText("Stay Still");
});

test("sound preference persists across a page reload", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);

  await page.getByRole("button", { name: "Sound: On" }).click();
  await expect(page.getByRole("button", { name: "Sound: Off" })).toBeVisible();

  await page.reload();
  await chooseFreePlay(page);
  await expect(page.getByRole("button", { name: "Sound: Off" })).toBeVisible();
});

test("usage tracker persists across a page reload", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  const before = await page.evaluate(() => window.__BBA_TEST_HOOKS__.getUsageTrackerState());
  expect(before?.sessionId).toBeTruthy();
  expect(before?.events?.length).toBeGreaterThan(0);

  await page.reload();
  await chooseGuided(page);
  await dismissTutorial(page);

  const after = await page.evaluate(() => window.__BBA_TEST_HOOKS__.getUsageTrackerState());
  expect(after?.sessionId).toBe(before.sessionId);
  expect(after?.events?.length).toBeGreaterThanOrEqual(before.events.length);
});

test("guided project workspaces share latest code, reset preserves it, and free play stays isolated", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Closest Threat" }).click();
  await dismissTutorial(page);
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "How Far Away?" }).click();
  await dismissTutorial(page);
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");

  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`));
  await page.locator("#playResetButton").click();
  await expect(page.locator("#playResetButton")).toContainText("Reset Level");
  await page.locator("#playResetButton").click();
  await expect(page.locator("#playResetButton")).toContainText("Start Level");
  await expect(page.locator("#blockly-region")).toContainText("Stay Still");

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "One Program, Two Allies" }).click();
  await dismissTutorial(page);
  await expect(page.locator("#blockly-region")).not.toContainText("Stay Still");

  await page.locator("#level-panel button[data-action=\"enter-free-play\"]").click();
  await expect(page.locator("#blockly-region")).toContainText("On Each Turn");
  await expect(page.locator("#blockly-region")).not.toContainText("Stay Still");
  await expect(page.locator("#blockly-region")).not.toContainText("Move Forward");
});

test("ordinary guided levels keep separate saved workspaces", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Move to Target" }).click();
  await dismissTutorial(page);
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Reach Enemy Flag" }).click();
  await dismissTutorial(page);
  await expect(page.locator("#blockly-region")).not.toContainText("Move Forward");

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item").filter({ hasText: "Move to Target" }).click();
  await dismissTutorial(page);
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});

test("usage export prompts for a student name and downloads a JSON file", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".app-header").getByRole("button", { name: /Export usage file/ })).toBeVisible();
  await chooseGuided(page);
  await dismissTutorial(page);

  page.once("dialog", async (dialog) => {
    await dialog.accept("Ada Lovelace");
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export Usage" }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);

  const filePath = await download.path();
  const downloaded = JSON.parse(await readFile(filePath, "utf8"));
  expect(downloaded.studentName).toBe("Ada Lovelace");
  expect(downloaded.integrity?.sha256).toBeTruthy();
  expect(downloaded.summary?.totalEvents).toBeGreaterThan(0);
  await expect(page.locator("#usage-export-status")).toContainText("saved locally");
});

test("Free Play exports normal XML files and imports them back through the file picker", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(
    page,
    buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)
  );

  await page.getByRole("button", { name: "Export program file" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export File" }).click();
  const download = await downloadPromise;
  const filePath = await download.path();
  const exported = await readFile(filePath, "utf8");

  expect(exported).toContain("type=\"battlegorithms_move_forward\"");
  expect(exported).not.toContain('"kind":"browser-battlegorithms-private-program"');

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_stay_still"></block>
          </next>
        </block>
      </xml>
    `);
  });

  await page.locator("#importWorkspaceInput").setInputFiles({
    name: "program.xml",
    mimeType: "text/xml",
    buffer: Buffer.from(exported)
  });

  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});

test("Free Play supports private program export and import with password protection", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(
    page,
    buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)
  );

  await page.getByRole("button", { name: "Export program file" }).click();
  await page.locator("#privateExportCheckbox").check();
  await page.locator("#privateExportPassword").fill("pass1234");
  await page.locator("#privateExportConfirm").fill("pass1234");

  const privateDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export File" }).click();
  const privateDownload = await privateDownloadPromise;
  const privatePath = await privateDownload.path();
  const privateFile = await readFile(privatePath, "utf8");

  expect(privateFile).toContain('"kind": "browser-battlegorithms-private-program"');
  expect(privateFile).not.toContain("<block type=\"battlegorithms_move_forward\">");

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_stay_still"></block>
          </next>
        </block>
      </xml>
    `);
  });

  await page.locator("#importWorkspaceInput").setInputFiles({
    name: "secret.private.json",
    mimeType: "application/json",
    buffer: Buffer.from(privateFile)
  });
  await expect(page.locator("#privateImportModal")).toBeVisible();
  await page.locator("#privateImportPassword").fill("pass1234");
  await page.locator("#allowEditingAfterImportCheckbox").check();

  await page.getByRole("button", { name: "Import File" }).click();
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
  await expect(page.locator("#workspace-import-status")).toContainText("Private program imported");
});

test("wrong private program password leaves the current workspace unchanged", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(
    page,
    buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)
  );

  await page.getByRole("button", { name: "Export program file" }).click();
  await page.locator("#privateExportCheckbox").check();
  await page.locator("#privateExportPassword").fill("pass1234");
  await page.locator("#privateExportConfirm").fill("pass1234");

  const privateDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export File" }).click();
  const privateDownload = await privateDownloadPromise;
  const privatePath = await privateDownload.path();
  const privateFile = await readFile(privatePath, "utf8");

  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24">
          <next>
            <block type="battlegorithms_stay_still"></block>
          </next>
        </block>
      </xml>
    `);
  });

  await page.locator("#importWorkspaceInput").setInputFiles({
    name: "secret.private.json",
    mimeType: "application/json",
    buffer: Buffer.from(privateFile)
  });
  await expect(page.locator("#privateImportModal")).toBeVisible();
  await page.locator("#privateImportPassword").fill("wrong-password");
  await page.getByRole("button", { name: "Import File" }).click();

  await expect(page.locator("#privateImportModalMessage")).toContainText("Import failed");
  await expect(page.locator("#blockly-region")).toContainText("Stay Still");
});

test("Blockly undo and redo buttons revert the current workspace edit", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(
    page,
    buildSolutionXml(`
      <block type="battlegorithms_move_toward">
        <field name="TARGET">ENEMY_FLAG</field>
      </block>
    `)
  );

  const readTarget = async () =>
    page.evaluate(() => {
      const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
      const block = workspace.getBlocksByType("battlegorithms_move_toward", false)[0];
      return block.getFieldValue("TARGET");
    });

  expect(await readTarget()).toBe("ENEMY_FLAG");

  await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const block = workspace.getBlocksByType("battlegorithms_move_toward", false)[0];
    block.setFieldValue("MY_BASE", "TARGET");
  });

  await expect(page.getByRole("button", { name: "Undo" })).toBeEnabled();
  await page.getByRole("button", { name: "Undo" }).click();
  expect(await readTarget()).toBe("ENEMY_FLAG");
  await expect(page.getByRole("button", { name: "Redo" })).toBeEnabled();
  await page.getByRole("button", { name: "Redo" }).click();
  expect(await readTarget()).toBe("MY_BASE");
});

test("Blockly undo and redo keyboard shortcuts work in the workspace", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);
  await loadWorkspaceXml(
    page,
    buildSolutionXml(`
      <block type="battlegorithms_move_toward">
        <field name="TARGET">ENEMY_FLAG</field>
      </block>
    `)
  );

  await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const block = workspace.getBlocksByType("battlegorithms_move_toward", false)[0];
    block.setFieldValue("MY_BASE", "TARGET");
  });

  await page.locator("#blocklyDiv").click({ position: { x: 20, y: 20 } });
  await page.keyboard.press("Control+z");

  const afterUndo = await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const block = workspace.getBlocksByType("battlegorithms_move_toward", false)[0];
    return block.getFieldValue("TARGET");
  });
  expect(afterUndo).toBe("ENEMY_FLAG");

  await page.keyboard.press("Control+Shift+z");

  const afterRedo = await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const block = workspace.getBlocksByType("battlegorithms_move_toward", false)[0];
    return block.getFieldValue("TARGET");
  });
  expect(afterRedo).toBe("MY_BASE");
});

test("malformed XML import shows an error and keeps the current program intact", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await loadWorkspaceXml(page, buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));

  await page.locator("#importWorkspaceInput").setInputFiles({
    name: "broken.xml",
    mimeType: "text/xml",
    buffer: Buffer.from("not xml at all")
  });

  await expect(page.locator("#workspace-import-status")).toContainText("Import failed");
  await expect(page.locator("#blockly-region")).toContainText("Move Forward");
});
