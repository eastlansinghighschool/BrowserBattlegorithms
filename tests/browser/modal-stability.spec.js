import { test, expect } from "@playwright/test";
import {
  chooseFreePlay,
  clearStorageBeforeEach,
  waitForHeavyReady
} from "./helpers.js";

clearStorageBeforeEach(test);

async function isActiveInside(page, rootSelector) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    return Boolean(root && root.contains(document.activeElement));
  }, rootSelector);
}

async function focusAndAssertStability(page, locator) {
  await locator.focus();
  await expect(locator).toBeFocused();
  await page.waitForTimeout(1500);
  await expect(locator).toBeFocused();
}

test.describe("Welcome modal", () => {
  test("keeps focus stable, tabs predictably, and closes from the chosen mode buttons", async ({ page }) => {
    await page.goto("/");
    const guidedButton = page.locator('button[data-tutorial-action="choose-guided"]');
    const freePlayButton = page.locator('button[data-tutorial-action="choose-free-play"]');
    await expect(guidedButton).toBeVisible({ timeout: 20000 });
    await expect(freePlayButton).toBeVisible();

    await waitForHeavyReady(page);
    await focusAndAssertStability(page, guidedButton);

    await page.keyboard.press("Tab");
    await expect(freePlayButton).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(guidedButton).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(freePlayButton).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await isActiveInside(page, "#tutorial-overlay")).toBe(false);

    await guidedButton.focus();
    await page.keyboard.press("Enter");

    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().showModePicker)).toBe(false);
    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().currentModeView)).toBe("GUIDED_LEVELS");

    await page.goto("/");
    await expect(freePlayButton).toBeVisible({ timeout: 20000 });
    await freePlayButton.focus();
    await page.keyboard.press("Enter");

    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().showModePicker)).toBe(false);
    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().currentModeView)).toBe("FREE_PLAY");
  });
});

test.describe("Active tutorial overlay", () => {
  test("keeps focus stable, tabs through tutorial actions, and closes on Got It and Finish", async ({ page }) => {
    await page.goto("/");
    await waitForHeavyReady(page);
    await page.evaluate(() => {
      const hooks = window.__BBA_TEST_HOOKS__;
      hooks.app.state.showModePicker = false;
      hooks.startLevel("human-runner-practice");
      hooks.startCurrentLevelTutorial(true);
    });

    const gotItButton = page.locator('#tutorial-overlay button[data-tutorial-action="skip"]');
    const nextButton = page.locator('#tutorial-overlay button[data-tutorial-action="next"]');
    await expect(gotItButton).toBeVisible({ timeout: 20000 });
    await expect(nextButton).toBeVisible();

    await focusAndAssertStability(page, gotItButton);

    await page.keyboard.press("Tab");
    await expect(nextButton).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(gotItButton).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(nextButton).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await isActiveInside(page, "#tutorial-overlay")).toBe(false);

    await gotItButton.focus();
    await page.keyboard.press("Enter");

    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().activeTutorial)).toBe(null);
    await expect(page.locator("#tutorial-overlay")).toBeHidden();

    await page.evaluate(() => {
      const hooks = window.__BBA_TEST_HOOKS__;
      hooks.startCurrentLevelTutorial(true);
    });

    const nextButtonAgain = page.locator('#tutorial-overlay button[data-tutorial-action="next"]');
    await expect(nextButtonAgain).toBeVisible({ timeout: 20000 });

    await nextButtonAgain.click();
    await nextButtonAgain.click();
    await expect(nextButtonAgain).toHaveText("Finish");
    await nextButtonAgain.focus();
    await page.keyboard.press("Enter");

    await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().activeTutorial)).toBe(null);
    await expect(page.locator("#tutorial-overlay")).toBeHidden();
  });
});

test.describe("Program export modal", () => {
  test("keeps focus stable, accepts typing, and closes from cancel/backdrop", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await page.locator("#exportWorkspaceButton").click();

    const modal = page.locator("#programExportModal");
    const checkbox = page.locator("#privateExportCheckbox");
    const fields = page.locator("#privateExportFields");
    const password = page.locator("#privateExportPassword");
    const confirm = page.locator("#privateExportConfirm");
    const cancel = page.locator('#programExportModal button[data-program-modal-action="cancel"]');
    const confirmButton = page.locator('#programExportModal button[data-program-modal-action="confirm"]');
    const backdrop = page.locator("#programExportModal .program-modal-backdrop");

    await expect(modal).toBeVisible();
    await focusAndAssertStability(page, checkbox);

    await page.keyboard.press("Space");
    await expect(fields).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(password).toBeFocused();
    await page.keyboard.type("ABCD1234");
    await page.keyboard.press("Tab");
    await expect(confirm).toBeFocused();
    await page.keyboard.type("ABCD1234");
    await page.keyboard.press("Shift+Tab");
    await expect(password).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(confirm).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(confirmButton).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await isActiveInside(page, "#programExportModal")).toBe(false);

    await cancel.click();
    await expect(modal).toBeHidden();

    await page.locator("#exportWorkspaceButton").click();
    await expect(modal).toBeVisible();
    await expect(cancel).toBeVisible();
    await cancel.focus();
    await page.keyboard.press("Enter");
    await expect(modal).toBeHidden();

    await page.locator("#exportWorkspaceButton").click();
    await expect(modal).toBeVisible();
    await expect(backdrop).toBeVisible();
    await backdrop.click({ position: { x: 4, y: 4 } });
    await expect(modal).toBeHidden();
  });
});

test.describe("Private import modal", () => {
  test("keeps focus stable, accepts typed password, and closes from cancel/backdrop", async ({ page }) => {
    await page.goto("/");
    await chooseFreePlay(page);
    await page.locator("#importWorkspaceButton").click();
    await page.locator("#importWorkspaceInput").setInputFiles([{
      name: "modal-stability.private.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({
        schemaVersion: 1,
        kind: "browser-battlegorithms-private-program",
        createdAt: "2026-05-16T00:00:00.000Z",
        kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 150000 },
        salt: "AAAAAAAAAAAAAAAAAAAAAA==",
        iv: "AAAAAAAAAAAAAAAA",
        ciphertext: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        metadata: {
          programLabel: "Modal Stability",
          teamNumber: null
        }
      }))
    }]);

    const modal = page.locator("#privateImportModal");
    const password = page.locator("#privateImportPassword");
    const cancel = page.locator('#privateImportModal button[data-private-import-action="cancel"]');
    const confirmButton = page.locator('#privateImportModal button[data-private-import-action="confirm"]');
    const backdrop = page.locator("#privateImportModal .program-modal-backdrop");

    await expect(modal).toBeVisible();
    await focusAndAssertStability(page, password);

    await page.keyboard.type("OpenSesame123");
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(password).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(confirmButton).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await isActiveInside(page, "#privateImportModal")).toBe(false);

    await cancel.click();
    await expect(modal).toBeHidden();

    await page.locator("#importWorkspaceButton").click();
    await page.locator("#importWorkspaceInput").setInputFiles([{
      name: "modal-stability.private.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({
        schemaVersion: 1,
        kind: "browser-battlegorithms-private-program",
        createdAt: "2026-05-16T00:00:00.000Z",
        kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 150000 },
        salt: "AAAAAAAAAAAAAAAAAAAAAA==",
        iv: "AAAAAAAAAAAAAAAA",
        ciphertext: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        metadata: {
          programLabel: "Modal Stability",
          teamNumber: null
        }
      }))
    }]);
    await expect(modal).toBeVisible();
    await cancel.focus();
    await page.keyboard.press("Enter");
    await expect(modal).toBeHidden();

    await page.locator("#importWorkspaceButton").click();
    await page.locator("#importWorkspaceInput").setInputFiles([{
      name: "modal-stability.private.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({
        schemaVersion: 1,
        kind: "browser-battlegorithms-private-program",
        createdAt: "2026-05-16T00:00:00.000Z",
        kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 150000 },
        salt: "AAAAAAAAAAAAAAAAAAAAAA==",
        iv: "AAAAAAAAAAAAAAAA",
        ciphertext: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        metadata: {
          programLabel: "Modal Stability",
          teamNumber: null
        }
      }))
    }]);
    await expect(modal).toBeVisible();
    await expect(backdrop).toBeVisible();
    await backdrop.click({ position: { x: 4, y: 4 } });
    await expect(modal).toBeHidden();
  });
});
