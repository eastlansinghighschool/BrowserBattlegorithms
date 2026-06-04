import { test, expect } from "@playwright/test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  appendUsageEvent,
  createUsageSession
} from "../../src/usage/usageFormat.js";
import { buildUsageExportWithIntegrity } from "../../src/usage/usageAnalyzer.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function buildSampleExport(studentName = "Ada Lovelace", sessionId = "session-admin-test") {
  const session = createUsageSession({ sessionId, startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:15:00.000Z" });
  appendUsageEvent(session, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "move-to-target", mapKey: "wideAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(session, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "enemy-nearby", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 4, attemptNumber: 2 }, "2026-05-13T10:01:30.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "enemy-nearby", levelKind: "guided", result: "FAILED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 8, turnsSpent: 4 }, "2026-05-13T10:03:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "show-what-you-know", levelKind: "challenge", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 9, attemptNumber: 3 }, "2026-05-13T10:04:00.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "show-what-you-know", levelKind: "challenge", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 18, turnsSpent: 9 }, "2026-05-13T10:10:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 19, attemptNumber: 4 }, "2026-05-13T10:10:30.000Z");
  appendUsageEvent(session, "level_started", { levelId: "optional-random-lab", levelKind: null, modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 20, attemptNumber: 5 }, "2026-05-13T10:11:00.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "optional-random-lab", levelKind: null, result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 24, turnsSpent: 4 }, "2026-05-13T10:12:00.000Z");
  return buildUsageExportWithIntegrity(session, studentName, "2026-05-13T10:15:00.000Z");
}

function payloadToFile(payload, fileName) {
  const dir = mkdtempSync(join(tmpdir(), "bb-usage-admin-"));
  const filePath = join(dir, fileName);
  const contents = typeof payload === "string" ? payload : JSON.stringify(payload);
  writeFileSync(filePath, contents, "utf8");
  return filePath;
}

// ── Tests ──────────────────────────────────────────────────────────────────

test("admin page loads at /admin.html", async ({ page }) => {
  await page.goto("/admin.html");
  await expect(page).toHaveTitle(/Usage File Analyzer/);
  await expect(page.getByRole("heading", { name: "Usage File Analyzer" })).toBeVisible();
  await expect(page.locator("#dropZone")).toBeVisible();
  await expect(page.locator("#filePickerButton")).toBeVisible();
});

test("admin page back link points to the game root", async ({ page }) => {
  await page.goto("/admin.html");
  const backLink = page.locator(".adm-back-link");
  await expect(backLink).toBeVisible();
  await expect(backLink).toHaveAttribute("href", "/");
});

test("loading a valid usage file renders a table row", async ({ page }) => {
  await page.goto("/admin.html");
  const payload = buildSampleExport("Grace Hopper", "session-grace");
  await page.locator("#fileInput").setInputFiles(payloadToFile(payload, "grace.json"));
  await expect(page.locator("#tableSection")).toBeVisible();
  await expect(page.locator("#classTableBody")).toContainText("Grace Hopper");
  await expect(page.locator("#classTableBody")).toContainText("✓ verified");
  await expect(page.locator("#classTable")).toContainText("Highest reached");
  await expect(page.locator("#classTable")).toContainText("Highest passed");
  await expect(page.locator("#classTable")).toContainText("Highest passed challenge");
  await expect(page.locator("#classTable")).toContainText("Needs review");
  await expect(page.locator("#classTable")).toContainText("Session span (min)");
  await expect(page.locator("#classTable")).not.toContainText("Time (min)");
});

test("loading multiple files renders one row per file", async ({ page }) => {
  await page.goto("/admin.html");
  const file1 = payloadToFile(buildSampleExport("Alice", "session-alice"), "alice.json");
  const file2 = payloadToFile(buildSampleExport("Bob", "session-bob"), "bob.json");
  await page.locator("#fileInput").setInputFiles(file1);
  await page.locator("#fileInput").setInputFiles(file2);
  const rows = page.locator("#classTableBody tr");
  await expect(rows).toHaveCount(2, { timeout: 15000 });
});

test("clicking a table row opens the detail panel", async ({ page }) => {
  await page.goto("/admin.html");
  const payload = buildSampleExport("Alan Turing", "session-turing");
  await page.locator("#fileInput").setInputFiles(payloadToFile(payload, "turing.json"));
  await page.locator("#classTableBody tr").first().click();
  await expect(page.locator("#detailSection")).toBeVisible();
  await expect(page.locator("#detailHeading")).toContainText("Alan Turing");
  await expect(page.locator("#detailContent")).toContainText("Verified hash");
  await expect(page.locator("#detailContent")).toContainText("Guided Progress Story");
  await expect(page.locator("#detailContent")).toContainText("Highest reached");
  await expect(page.locator("#detailContent")).toContainText("Highest passed");
  await expect(page.locator("#detailContent")).toContainText("Highest passed challenge");
  await expect(page.locator("#detailContent")).toContainText("Contiguous pass-through");
  await expect(page.locator("#detailContent")).toContainText("Guided Sequence Map");
  await expect(page.locator("#detailContent")).toContainText("Exact Guided Progress Table");
  await expect(page.locator("#detailContent")).toContainText("Challenge 22: Show What You Know");
  await expect(page.locator("#detailContent")).toContainText("Optional Lab: Move Randomly");
});

test("tampered file shows hash mismatch warning in detail panel", async ({ page }) => {
  await page.goto("/admin.html");
  const payload = buildSampleExport("Eve Tamper", "session-tamper");
  payload.studentName = "Eve Tamper (edited)";
  await page.locator("#fileInput").setInputFiles(payloadToFile(payload, "tampered.json"));
  await page.locator("#classTableBody tr").first().click();
  await expect(page.locator("#detailContent")).toContainText("mismatch");
  await expect(page.locator("#classTableBody")).toContainText("✗ mismatch");
});

test("invalid JSON file appears in errors list without blocking valid file", async ({ page }) => {
  await page.goto("/admin.html");
  const valid = payloadToFile(buildSampleExport("Valid Student", "session-valid"), "valid.json");
  const bad = payloadToFile("this is not json {{{", "bad.json");
  await page.locator("#fileInput").setInputFiles(valid);
  await page.locator("#fileInput").setInputFiles(bad);
  await expect(page.locator("#errorList")).toBeVisible({ timeout: 15000 });
  await expect(page.locator("#errorList")).toContainText("bad.json");
  await expect(page.locator("#classTableBody")).toContainText("Valid Student");
});

test("duplicate session id flag appears when two files share a session id", async ({ page }) => {
  await page.goto("/admin.html");
  const file1 = payloadToFile(buildSampleExport("Alice", "session-shared"), "alice.json");
  const file2 = payloadToFile(buildSampleExport("Bob", "session-shared"), "bob.json");
  await page.locator("#fileInput").setInputFiles(file1);
  await page.locator("#fileInput").setInputFiles(file2);
  await expect(page.locator("#flagsSection")).toBeVisible({ timeout: 15000 });
  await expect(page.locator("#flagsList")).toContainText("duplicate");
});

test("clear button resets the tool to empty state", async ({ page }) => {
  await page.goto("/admin.html");
  const payload = buildSampleExport();
  await page.locator("#fileInput").setInputFiles(payloadToFile(payload, "test.json"));
  await expect(page.locator("#tableSection")).toBeVisible();
  await page.locator("#clearButton").click();
  await expect(page.locator("#tableSection")).toBeHidden();
  await expect(page.locator("#clearButton")).toHaveAttribute("hidden", "");
});

test("close detail button hides the detail panel", async ({ page }) => {
  await page.goto("/admin.html");
  const payload = buildSampleExport();
  await page.locator("#fileInput").setInputFiles(payloadToFile(payload, "test.json"));
  await page.locator("#classTableBody tr").first().click();
  await expect(page.locator("#detailSection")).toBeVisible();
  await page.locator("#closeDetailButton").click();
  await expect(page.locator("#detailSection")).toBeHidden();
});

test("main app shows admin link in dev mode", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  const adminLink = page.locator(".app-header-actions a[href='./admin.html']");
  await expect(adminLink).toBeVisible();
  await expect(adminLink).toHaveAttribute("aria-label", /usage file analyzer/i);
});

test("production build does not emit admin.html", async () => {
  const { existsSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const distAdmin = resolve(process.cwd(), "dist", "admin.html");
  expect(existsSync(distAdmin)).toBe(false);
});
