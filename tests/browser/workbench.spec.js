import { test, expect } from "@playwright/test";

test.setTimeout(90000);

test("workbench loads in dev and renders a selected guided level", async ({ page }) => {
  await page.goto("/workbench.html");
  await expect(page).toHaveTitle(/Level Workbench/);
  await expect(page.getByRole("heading", { name: "Level Workbench" })).toBeVisible();
  await expect(page.locator("#levelSelect")).toBeVisible();
  await expect(page.locator("#loadStatus")).toContainText("Workbench ready");

  await page.selectOption("#levelSelect", "dodge-and-deliver");
  await expect(page.locator("#selectionMeta")).toContainText("Dodge and Deliver", { timeout: 60000 });
  await expect(page.locator("#contextPanel")).toContainText("src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js", { timeout: 60000 });
  await expect(page.locator("#runSummary")).toContainText("Pass", { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(/Reference solution run/, { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(/Event log tail:/, { timeout: 60000 });
  await expect(page.locator("#promptOutput")).toHaveValue(/npm run level:readiness -- --level dodge-and-deliver --prompt/, { timeout: 60000 });
  await expect(page.getByRole("heading", { name: "Readiness Checks" })).toBeVisible();
  await expect(page.locator("#scratchStatus")).toContainText("Starter XML loaded", { timeout: 60000 });
  await expect(page.locator("#scratchComparison")).toContainText("Reference fixture", { timeout: 60000 });
  await expect(page.locator("#scratchTargetWrap")).toBeHidden();
});

test("workbench surfaces the canonical lint contract for a baseline-warning level", async ({ page }) => {
  await page.goto("/workbench.html");
  await page.selectOption("#levelSelect", "show-what-you-know");

  await expect(page.locator("#checksPanel")).toContainText("challenge-introduces-no-new-block", { timeout: 60000 });
  await expect(page.locator("#checksPanel")).not.toContainText("reference-solution-toolbox-compatibility", { timeout: 60000 });
});

test("workbench renders project checkpoint evidence including documented exceptions", async ({ page }) => {
  await page.goto("/workbench.html");
  await page.selectOption("#levelSelect", "advanced-scrimmage");

  await expect(page.locator("#runSummary")).toContainText("Warning", { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(/Project step checkpoint/, { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(/Project final checkpoint/, { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(/Documented exception:/, { timeout: 60000 });
  await expect(page.locator("#scratchTargetWrap")).toBeVisible();
  await expect(page.locator("#scratchTargetSelect option")).toHaveCount(3, { timeout: 60000 });
  await page.selectOption("#scratchTargetSelect", "final");
  await page.click("#loadScratchCanonicalButton");
  await expect(page.locator("#scratchStatus")).toContainText("Canonical XML loaded", { timeout: 60000 });
  await page.click("#runScratchButton");
  await expect(page.locator("#scratchComparison")).toContainText("Target", { timeout: 60000 });
});

test("workbench leaves guided progress and project workspace storage untouched", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("bba:guided-level-progress", JSON.stringify({ sentinel: true }));
    localStorage.setItem("bba:project-workspace:team-strategy-script", "sentinel");
  });

  await page.goto("/workbench.html");
  await expect(page.locator("#loadStatus")).toContainText("Workbench ready");
  await page.selectOption("#levelSelect", "dodge-and-deliver");
  await expect(page.locator("#scratchStatus")).toContainText("Starter XML loaded", { timeout: 60000 });
  await page.click("#loadScratchCanonicalButton");
  await page.click("#runScratchButton");
  await page.click("#generateMutationPromptButton");

  await expect.poll(async () => page.evaluate(() => localStorage.getItem("bba:guided-level-progress"))).toBe(JSON.stringify({ sentinel: true }));
  await expect.poll(async () => page.evaluate(() => localStorage.getItem("bba:project-workspace:team-strategy-script"))).toBe("sentinel");
});

test("workbench scratch edits change only the scratch candidate and not the canonical run", async ({ page }) => {
  await page.goto("/workbench.html");
  await page.selectOption("#levelSelect", "dodge-and-deliver");
  await expect(page.locator("#scratchStatus")).toContainText("Starter XML loaded", { timeout: 60000 });
  await page.click("#loadScratchCanonicalButton");
  await expect(page.locator("#runOutput")).toHaveValue(/Reference solution run/, { timeout: 60000 });
  const canonicalRunBefore = await page.locator("#runOutput").inputValue();

  await page.locator("#scratchXmlOutput").fill('<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn"></block></xml>');
  await page.click("#applyScratchXmlButton");
  await page.click("#runScratchButton");

  await expect(page.locator("#scratchComparison")).toContainText("differs", { timeout: 60000 });
  await expect(page.locator("#runOutput")).toHaveValue(canonicalRunBefore, { timeout: 60000 });
});

test("workbench generates a mutation prompt for the selected fixture target", async ({ page }) => {
  await page.goto("/workbench.html");
  await page.selectOption("#levelSelect", "advanced-scrimmage");
  await expect(page.locator("#scratchTargetSelect option")).toHaveCount(3, { timeout: 60000 });
  await page.selectOption("#scratchTargetSelect", "final");
  await page.click("#loadScratchCanonicalButton");
  await page.click("#runScratchButton");
  await page.click("#generateMutationPromptButton");

  await expect(page.locator("#mutationPromptOutput")).toHaveValue(/Project final fixture/, { timeout: 60000 });
  await expect(page.locator("#mutationPromptOutput")).toHaveValue(/tests\/unit\/fixtures\/guided-project-solutions\/team-strategy-script\/final\.xml/, { timeout: 60000 });
  await expect(page.locator("#mutationPromptOutput")).toHaveValue(/The workbench did not write files\./, { timeout: 60000 });
});

test("workbench handles invalid scratch XML gracefully", async ({ page }) => {
  await page.goto("/workbench.html");
  await page.selectOption("#levelSelect", "dodge-and-deliver");
  await expect(page.locator("#scratchStatus")).toContainText("Starter XML loaded", { timeout: 60000 });
  await page.locator("#scratchXmlOutput").fill("<xml><block></xml");
  await page.click("#applyScratchXmlButton");

  await expect(page.locator("#scratchStatus")).toContainText("XML error", { timeout: 60000 });
});

test("dev header exposes the local workbench link and the build stays clean of workbench.html", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  const workbenchLink = page.locator(".app-header-actions a[href='./workbench.html']");
  await expect(workbenchLink).toBeVisible();
  await expect(workbenchLink).toHaveAttribute("aria-label", /level workbench/i);

  const { existsSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  const distWorkbench = resolve(process.cwd(), "dist", "workbench.html");
  expect(existsSync(distWorkbench)).toBe(false);
});
