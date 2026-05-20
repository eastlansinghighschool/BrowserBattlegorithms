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
  await expect(page.locator("#promptOutput")).toHaveValue(/npm run level:readiness -- --level dodge-and-deliver --prompt/, { timeout: 60000 });
  await expect(page.getByRole("heading", { name: "Readiness Checks" })).toBeVisible();
});

test("workbench leaves guided progress and project workspace storage untouched", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("bba:guided-level-progress", JSON.stringify({ sentinel: true }));
    localStorage.setItem("bba:project-workspace:team-strategy-script", "sentinel");
  });

  await page.goto("/workbench.html");
  await expect(page.locator("#loadStatus")).toContainText("Workbench ready");
  await page.selectOption("#levelSelect", "dodge-and-deliver");

  await expect.poll(async () => page.evaluate(() => localStorage.getItem("bba:guided-level-progress"))).toBe(JSON.stringify({ sentinel: true }));
  await expect.poll(async () => page.evaluate(() => localStorage.getItem("bba:project-workspace:team-strategy-script"))).toBe("sentinel");
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
