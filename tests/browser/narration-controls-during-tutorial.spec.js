import { test, expect } from "@playwright/test";
import { clearStorageBeforeEach, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test("guided tutorial blocks narration controls while the scrim is active", async ({ page }) => {
  await page.goto("/");
  await waitForHeavyReady(page);
  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.app.state.showModePicker = false;
    hooks.startLevel("mirror-forward");
    hooks.startCurrentLevelTutorial(true);
  });

  const tutorialOverlay = page.locator("#tutorial-overlay");
  const turnLogToggle = page.locator("#turnLogToggle");
  const coachingToggle = page.locator("#coachingModeToggle");
  const voiceToggle = page.locator("#voiceNarrationToggle");
  const voiceControls = page.locator("#voice-controls");
  const voicePickerOptions = page.locator("#voicePicker option");

  await expect(tutorialOverlay).toHaveClass(/tutorial-overlay-active/, { timeout: 20000 });
  await expect(turnLogToggle).not.toBeChecked();
  await expect(coachingToggle).not.toBeChecked();
  await expect(voiceToggle).not.toBeChecked();
  await expect(voiceControls).toBeHidden();

  let turnLogBlocked = false;
  try {
    await turnLogToggle.click({ trial: true, timeout: 3000 });
  } catch {
    turnLogBlocked = true;
  }
  expect(turnLogBlocked).toBe(true);

  let voiceBlocked = false;
  try {
    await voiceToggle.click({ trial: true, timeout: 3000 });
  } catch {
    voiceBlocked = true;
  }
  expect(voiceBlocked).toBe(true);
  await expect(coachingToggle).not.toBeChecked();

  const supportsWebSpeech = await page.evaluate(() => (
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.speechSynthesis.getVoices === "function"
  ));
  if (supportsWebSpeech) {
    await expect.poll(async () => voicePickerOptions.count(), { timeout: 10000 }).toBeGreaterThan(0);
  }
});
