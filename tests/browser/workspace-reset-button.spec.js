/**
 * Playwright regression spec for Plan 45: Reset Workspace to Starter button.
 *
 * Tests the "Reset Workspace to Starter" button in the Blockly toolbar
 * (Requirement 7 and 8).
 *
 * Level used: prediction-06 (Prediction 6: First Move) for confirm/cancel/free-play tests.
 * Project level: "closest-threat" (Level 23, part of a project arc) for project-hidden test.
 */

import { test, expect } from "@playwright/test";
import {
  waitForHeavyReady,
  dismissTutorial,
  chooseFreePlay,
  unlockGuidedLevels
} from "./helpers.js";

const LEVEL_ID = "prediction-06";
const RESET_BUTTON_LABEL = "Reset workspace to the starter program";
const CONFIRM_TEXT = "Reset your blocks to the starter program for this level? Your current blocks will be lost.";

async function waitForWorkspaceBlocks(page) {
  await page.waitForFunction(() => {
    const workspace = window.__BBA_TEST_HOOKS__?.getBlocklyWorkspace?.();
    return Boolean(workspace?.getAllBlocks(false)?.length);
  });
}

async function getWorkspaceBlockTypes(page) {
  return page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__?.getBlocklyWorkspace?.();
    return (workspace?.getAllBlocks(false) || []).map((block) => block.type);
  });
}

const MODIFIED_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_stay_still"></block>
    </next>
  </block>
</xml>`;

// ─── Case 1: Confirm → workspace resets to starter ───────────────────────────

test("reset button accept dialog restores the starter program", async ({ page }) => {
  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  // Modify workspace away from the starter.
  await page.evaluate((xml) => window.__BBA_TEST_HOOKS__.loadWorkspaceXml(xml), MODIFIED_XML);
  await waitForWorkspaceBlocks(page);
  const modifiedTypes = await getWorkspaceBlockTypes(page);
  expect(modifiedTypes).toContain("battlegorithms_stay_still");
  expect(modifiedTypes).not.toContain("battlegorithms_move_forward");

  // Set up dialog handler BEFORE clicking (Playwright best practice).
  let capturedDialogText = "";
  page.once("dialog", async (dialog) => {
    capturedDialogText = dialog.message();
    await dialog.accept();
  });

  await page.getByRole("button", { name: RESET_BUTTON_LABEL }).click();

  await waitForWorkspaceBlocks(page);
  const resetTypes = await getWorkspaceBlockTypes(page);
  expect(resetTypes).toContain("battlegorithms_move_forward");
  expect(resetTypes).not.toContain("battlegorithms_stay_still");

  // Confirm the dialog had the expected text.
  expect(capturedDialogText).toBe(CONFIRM_TEXT);
});

test("reset button stamps the current version key after confirm", async ({ page }) => {
  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  await page.evaluate((xml) => window.__BBA_TEST_HOOKS__.loadWorkspaceXml(xml), MODIFIED_XML);
  await waitForWorkspaceBlocks(page);

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole("button", { name: RESET_BUTTON_LABEL }).click();
  await page.waitForTimeout(200); // allow save callback to fire

  const version = await page.evaluate(
    (key) => window.localStorage.getItem(key),
    `bba:guided-workspace-version:${LEVEL_ID}`
  );
  expect(version).toMatch(/^[0-9a-f]{8}$/);
});

// ─── Case 2: Cancel → workspace unchanged ────────────────────────────────────

test("reset button cancel dialog leaves the workspace unchanged", async ({ page }) => {
  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  // Modify workspace away from the starter.
  await page.evaluate((xml) => window.__BBA_TEST_HOOKS__.loadWorkspaceXml(xml), MODIFIED_XML);
  await waitForWorkspaceBlocks(page);
  const beforeTypes = await getWorkspaceBlockTypes(page);
  expect(beforeTypes).toContain("battlegorithms_stay_still");
  expect(beforeTypes).not.toContain("battlegorithms_move_forward");

  page.once("dialog", async (dialog) => {
    await dialog.dismiss(); // Cancel
  });

  await page.getByRole("button", { name: RESET_BUTTON_LABEL }).click();

  // Workspace should be unchanged.
  const afterTypes = await getWorkspaceBlockTypes(page);
  expect(afterTypes).toEqual(beforeTypes);
});

// ─── Case 3: Free Play — reset button not visible ────────────────────────────

test("reset button is not visible in Free Play mode", async ({ page }) => {
  await page.goto("/");
  await chooseFreePlay(page);
  await dismissTutorial(page);

  await expect(page.getByRole("button", { name: RESET_BUTTON_LABEL })).toBeHidden();
});

// ─── Case 4: Project-shared-workspace level — reset button not visible ───────

test("reset button is not visible on a project-shared-workspace level", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);

  // Use the regular guided flow and navigate to a project-arc level.
  // "Closest Threat" is part of a project arc.
  await page.locator("#tutorial-overlay").getByRole("button", { name: "Guided Levels" }).click();
  await waitForHeavyReady(page);
  await unlockGuidedLevels(page);

  await page.locator(".level-picker-trigger").click();
  await page.locator(".level-picker-popover .level-picker-item")
    .filter({ hasText: "Closest Threat" })
    .click();
  await dismissTutorial(page);

  await expect(page.getByRole("button", { name: RESET_BUTTON_LABEL })).toBeHidden();
});

// ─── Case 5: Guided non-project level with starter — button is visible ────────

test("reset button is visible on a guided non-project level with initialBlocklyXml", async ({ page }) => {
  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  await expect(page.getByRole("button", { name: RESET_BUTTON_LABEL })).toBeVisible();
});
