import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";
import { chooseGuided, dismissTutorial, waitForHeavyReady } from "../browser/helpers.js";
import {
  buildRegressionProfiles,
  getExpectedRegressionProfileSummary,
  REGRESSION_OUTPUT_DIR,
  resolveAttemptXmlText
} from "./student-profiles.js";

const profiles = buildRegressionProfiles();

test("regression profiles append the correct passing attempt after each wrong attempt", () => {
  const sam = profiles.find((profile) => profile.name === "Struggling Sam");
  const charlie = profiles.find((profile) => profile.name === "Challenged Charlie");
  const gabi = profiles.find((profile) => profile.name === "Gave-Up Gabi");

  expect(sam).toBeTruthy();
  expect(charlie).toBeTruthy();
  expect(gabi).toBeTruthy();

  const samMoveTarget = sam.levels.find((level) => level.levelId === "move-to-target");
  expect(samMoveTarget?.attempts).toHaveLength(2);
  expect(samMoveTarget?.attempts.at(-1)?.expectPass).toBe(true);

  const samJumpTeam = sam.levels.find((level) => level.levelId === "jump-team");
  expect(samJumpTeam?.attempts).toHaveLength(2);
  expect(samJumpTeam?.attempts.at(-1)?.expectPass).toBe(true);

  const charlieScrimmage = charlie.levels.find((level) => level.levelId === "advanced-scrimmage");
  expect(charlieScrimmage?.attempts).toHaveLength(3);
  expect(charlieScrimmage?.attempts.at(-1)?.expectPass).toBe(true);

  const gabiJump = gabi.levels.find((level) => level.levelId === "jump-if-ready");
  expect(gabiJump?.attempts).toHaveLength(3);
  expect(gabiJump?.attempts.every((attempt) => attempt.expectPass === false)).toBe(true);
});

async function startLevel(page, levelId) {
  await page.evaluate((id) => {
    window.__BBA_TEST_HOOKS__.startLevel(id);
  }, levelId);
  await dismissTutorial(page);
}

async function prepareBrowserProfile(profile) {
  const levels = [];
  for (const level of profile.levels) {
    const attempts = [];
    for (const attempt of level.attempts) {
      const xmlText = attempt.xmlFile
        ? await resolveAttemptXmlText({ xmlFile: attempt.xmlFile })
        : attempt.xmlInline || null;
      attempts.push({
        expectPass: attempt.expectPass,
        xmlText,
        inputSequence: attempt.inputSequence || null
      });
    }
    levels.push({
      levelId: level.levelId,
      levelTitle: level.levelTitle,
      levelKind: level.levelKind,
      attempts
    });
  }
  return {
    name: profile.name,
    studentName: profile.studentName,
    behavior: profile.behavior,
    stopAfterLevel: profile.stopAfterLevel,
    levels
  };
}

async function synthesizeProfileUsage(page, profile) {
  const browserProfile = await prepareBrowserProfile(profile);
  await page.evaluate((profileData) => {
    const hooks = window.__BBA_TEST_HOOKS__;
    const levelById = new Map(hooks.app.state.levels.map((level) => [level.id, level]));

    for (const levelPlan of profileData.levels) {
      const level = levelById.get(levelPlan.levelId);
      if (!level) {
        continue;
      }

      for (const attempt of levelPlan.attempts) {
        hooks.app.state.currentModeView = "GUIDED_LEVELS";
        hooks.app.state.currentLevelId = level.id;
        hooks.app.state.currentMapKey = level.mapKey;
        hooks.app.state.humanTurnBehavior = level.humanTurnBehavior || "AUTO_SKIP";
        hooks.app.state.currentTurnNumber = 1;
        hooks.app.state.currentLevelStartTurnNumber = 1;
        hooks.app.state.levelAttemptCount += 1;
        hooks.app.usageTracker.recordLevelStarted(level, {
          modeView: hooks.app.state.currentModeView,
          mapKey: level.mapKey
        });
        if (attempt.xmlText) {
          hooks.app.usageTracker.recordWorkspaceImported?.({
            modeView: hooks.app.state.currentModeView,
            levelId: level.id,
            mapKey: level.mapKey,
            turnNumber: hooks.app.state.currentTurnNumber
          });
          hooks.app.usageTracker.recordWorkspaceSnapshot?.("workspace_imported", {
            xmlText: attempt.xmlText,
            blockCounts: {},
            modeView: hooks.app.state.currentModeView,
            levelId: level.id,
            mapKey: level.mapKey,
            turnNumber: hooks.app.state.currentTurnNumber
          });
        }
        hooks.app.usageTracker.recordLevelEnded(level, attempt.expectPass ? "PASSED" : "FAILED", attempt.expectPass ? "simulated_success" : "simulated_failure", {
          startTurnNumber: hooks.app.state.currentLevelStartTurnNumber,
          turnNumber: hooks.app.state.currentTurnNumber,
          modeView: hooks.app.state.currentModeView,
          mapKey: hooks.app.state.currentMapKey
        });
        if (attempt.expectPass) {
          break;
        }
      }

      if (profileData.stopAfterLevel && levelPlan.levelId === profileData.stopAfterLevel) {
        break;
      }
    }

    const lastLevel = profileData.levels.at(-1);
    if (lastLevel) {
      const finalLevel = levelById.get(lastLevel.levelId);
      if (finalLevel) {
        hooks.app.state.currentModeView = "GUIDED_LEVELS";
        hooks.app.state.currentLevelId = finalLevel.id;
        hooks.app.state.currentMapKey = finalLevel.mapKey;
      }
    }
  }, browserProfile);
}

async function assertExportedProfileSummary(outputPath, profile) {
  const payload = JSON.parse(await readFile(outputPath, "utf8"));
  const expected = getExpectedRegressionProfileSummary(profile);
  expect(payload.summary.guided.started).toBe(expected.guided.started);
  expect(payload.summary.guided.completed).toBe(expected.guided.completed);
  expect(payload.summary.guided.passed).toBe(expected.guided.passed);
  expect(payload.summary.guided.failed).toBe(expected.guided.failed);
  expect(payload.summary.guided.attempts).toBe(expected.guided.attempts);
  expect(payload.summary.guided.levelIds).toEqual(expected.levelIds);
  if (profile.name === "Perfect Pat" || profile.name === "Copy-Cat Casey") {
    expect(payload.summary.guided.passed).toBe(37);
    expect(payload.summary.guided.completed).toBe(37);
    expect(payload.summary.guided.failed).toBe(0);
  } else if (profile.name === "Struggling Sam") {
    expect(payload.summary.guided.passed).toBe(37);
    expect(payload.summary.guided.failed).toBe(6);
    expect(payload.summary.guided.completed).toBe(43);
  } else if (profile.name === "Challenged Charlie") {
    expect(payload.summary.guided.passed).toBe(37);
    expect(payload.summary.guided.failed).toBe(11);
    expect(payload.summary.guided.completed).toBe(48);
  } else if (profile.name === "Gave-Up Gabi") {
    expect(payload.summary.guided.passed).toBe(15);
    expect(payload.summary.guided.failed).toBe(3);
    expect(payload.summary.guided.completed).toBe(18);
    expect(payload.summary.guided.levelIds).toContain("jump-if-ready");
  }
}

test.describe.parallel("usage pipeline student profiles", () => {
  for (const profile of profiles) {
    test(profile.name, async ({ page }) => {
      await page.goto("/");
      await waitForHeavyReady(page);
      await chooseGuided(page);
      await dismissTutorial(page);

      await synthesizeProfileUsage(page, profile);

      page.once("dialog", async (dialog) => {
        await dialog.accept(profile.studentName);
      });
      const downloadPromise = page.waitForEvent("download");
      await page.locator(".app-header").getByRole("button", { name: /Export usage file/ }).click();
      const download = await downloadPromise;
      await mkdir(REGRESSION_OUTPUT_DIR, { recursive: true });
      const outputPath = resolve(REGRESSION_OUTPUT_DIR, `${profile.studentName}.json`);
      await download.saveAs(outputPath);
      await assertExportedProfileSummary(outputPath, profile);
      await expect(page.locator("#usage-export-status")).toContainText("Usage file saved locally");
    });
  }
});
