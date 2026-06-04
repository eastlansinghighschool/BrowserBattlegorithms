import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test, expect } from "@playwright/test";
import {
  REGRESSION_OUTPUT_DIR,
  REGRESSION_SCREENSHOT_DIR,
  buildRegressionProfiles,
  getExpectedRegressionProfileSummary
} from "./student-profiles.js";
import { rewriteUsageExportFile } from "./timestamp-spreader.js";

const execFileAsync = promisify(execFile);
const profiles = buildRegressionProfiles();

async function waitForExpectedFiles() {
  await expect.poll(async () => {
    let freshCount = 0;
    for (const profile of profiles) {
      const filePath = resolve(REGRESSION_OUTPUT_DIR, `${profile.studentName}.json`);
      try {
        await (await import("node:fs/promises")).stat(filePath);
        freshCount += 1;
      } catch {
        // Ignore missing files while the profile workers are still running.
      }
    }
    return freshCount;
  }, { timeout: 120000 }).toBe(profiles.length);
}

async function runAnalyzer(filePaths) {
  const { stdout, stderr } = await execFileAsync("node", ["scripts/analyze-usage-files.js", ...filePaths], {
    maxBuffer: 10 * 1024 * 1024
  });
  return `${stdout}${stderr}`;
}

async function assertProfileFileSummary(filePath, profile) {
  const payload = JSON.parse(await readFile(filePath, "utf8"));
  const expected = getExpectedRegressionProfileSummary(profile);
  expect(payload.summary.guided.started).toBe(expected.guided.started);
  expect(payload.summary.guided.completed).toBe(expected.guided.completed);
  expect(payload.summary.guided.passed).toBe(expected.guided.passed);
  expect(payload.summary.guided.failed).toBe(expected.guided.failed);
  expect(payload.summary.guided.attempts).toBe(expected.guided.attempts);
  expect(payload.summary.guided.levelIds).toEqual(expected.levelIds);
}

async function createTamperedCopy(sourcePath, tamperedPath) {
  const payload = JSON.parse(await readFile(sourcePath, "utf8"));
  payload.studentName = "Taylor Reed";
  payload.sessionId = `${payload.sessionId || "session"}-tampered`;
  if (Array.isArray(payload.events) && payload.events[0] && typeof payload.events[0] === "object") {
    const firstEvent = payload.events[0];
    payload.events[0] = {
      ...firstEvent,
      data: {
        ...(firstEvent.data || {}),
        tamperNote: "manual edit for regression screenshot"
      }
    };
  }
  await writeFile(tamperedPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return tamperedPath;
}

function slugify(name) {
  return `${name}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

test.describe.serial("usage pipeline admin regression", () => {
  test("exports, timestamp spreading, analyzer, and admin page screenshots all work together", async ({ page }) => {
    await waitForExpectedFiles();

    const outputPaths = profiles.map((profile) => resolve(REGRESSION_OUTPUT_DIR, `${profile.studentName}.json`));
    for (const profile of profiles) {
      const filePath = resolve(REGRESSION_OUTPUT_DIR, `${profile.studentName}.json`);
      await rewriteUsageExportFile(filePath, profile);
      await assertProfileFileSummary(filePath, profile);
    }

    const tamperedSourcePath = resolve(REGRESSION_OUTPUT_DIR, "Pat Chen.json");
    const tamperedOutputPath = resolve(REGRESSION_OUTPUT_DIR, "Taylor Reed-tampered.json");
    await createTamperedCopy(tamperedSourcePath, tamperedOutputPath);

    const analyzerOutput = await runAnalyzer(outputPaths);
    for (const profile of profiles) {
      expect(analyzerOutput).toContain(profile.studentName);
      expect(analyzerOutput).toContain("verified hash");
    }
    expect(analyzerOutput).toContain("similar event sequence");
    expect(analyzerOutput).toContain("Pat Chen");
    expect(analyzerOutput).toContain("Casey Chen");
    expect(analyzerOutput).not.toContain("possible duplicate session id: Sam Rivera");
    expect(analyzerOutput).not.toContain("possible duplicate session id: Gabi Torres");

    await page.goto("/admin.html");
    for (const filePath of outputPaths) {
      await page.locator("#fileInput").setInputFiles(filePath);
    }
    await page.locator("#fileInput").setInputFiles(tamperedOutputPath);

    const rows = page.locator("#classTableBody tr");
    await expect(rows).toHaveCount(profiles.length + 1, { timeout: 30000 });
    await expect(page.locator("#classTable")).toContainText("Highest reached");
    await expect(page.locator("#classTable")).toContainText("Highest passed");
    await expect(page.locator("#classTable")).toContainText("Highest passed challenge");
    await expect(page.locator("#classTable")).toContainText("Session span (min)");
    await expect(page.locator("#classTable")).toContainText("Needs review");
    await expect(page.locator("#classTable")).not.toContainText("Time (min)");
    await expect(page.locator("#classTableBody")).toContainText("✓ verified");
    await expect(page.locator("#classTableBody")).toContainText("✗ mismatch");
    await expect(page.locator("#flagsSection")).toBeVisible();
    await expect(page.locator("#flagsList")).toContainText("Similarity flag");
    await expect(page.locator("#flagsList")).toContainText("Pat Chen");
    await expect(page.locator("#flagsList")).toContainText("Casey Chen");

    await page.locator("#classTable").screenshot({ path: resolve(REGRESSION_SCREENSHOT_DIR, "class-table.png") });

    for (const profile of profiles) {
      const row = page.locator("#classTableBody tr").filter({ hasText: profile.studentName }).first();
      await row.click();
      await expect(page.locator("#detailSection")).toBeVisible();
      await expect(page.locator("#detailContent")).toContainText("Guided Progress Story");
      await expect(page.locator("#detailContent")).toContainText("Guided Sequence Map");
      await expect(page.locator("#detailContent")).toContainText("Exact Guided Progress Table");
      await page.locator("#detailSection").screenshot({
        path: resolve(REGRESSION_SCREENSHOT_DIR, `detail-${slugify(profile.studentName)}.png`)
      });
    }

    const tamperedRow = page.locator("#classTableBody tr").filter({ hasText: "Taylor Reed" }).first();
    await tamperedRow.click();
    await expect(page.locator("#detailSection")).toBeVisible();
    await expect(page.locator("#detailContent")).toContainText("Hash mismatch");
    await expect(page.locator("#detailContent")).toContainText("integrity mismatch");
    await page.locator("#detailSection").screenshot({
      path: resolve(REGRESSION_SCREENSHOT_DIR, "detail-taylor-reed-tampered.png")
    });

    await page.locator("#flagsSection").screenshot({ path: resolve(REGRESSION_SCREENSHOT_DIR, "flags.png") });
  });
});
