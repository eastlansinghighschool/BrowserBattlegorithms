import { test, expect } from "@playwright/test";
import { clearStorageBeforeEach, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

test("guided tutorial keeps narration controls clickable while the scrim is active", async ({ page }) => {
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

  await turnLogToggle.check({ timeoutMs: 10000 });
  await expect(turnLogToggle).toBeChecked();

  await coachingToggle.check({ timeoutMs: 10000 });
  await expect(coachingToggle).toBeChecked();

  await voiceToggle.check({ timeoutMs: 10000 });
  await expect(voiceToggle).toBeChecked();
  await expect(voiceControls).toBeVisible();

  const supportsWebSpeech = await page.evaluate(() => (
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.speechSynthesis.getVoices === "function"
  ));
  if (supportsWebSpeech) {
    await expect.poll(async () => voicePickerOptions.count(), { timeout: 10000 }).toBeGreaterThan(0);
  }
});
