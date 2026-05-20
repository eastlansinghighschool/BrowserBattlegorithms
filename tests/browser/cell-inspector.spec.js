import { test, expect } from "@playwright/test";
import { chooseGuided, clearStorageBeforeEach, dismissTutorial } from "./helpers.js";

clearStorageBeforeEach(test);

test.describe("Cell Inspector Tooltip DOM Overlay", () => {
  test("mouse hover shows coordinates and cell info, touch tap pins, escape hides", async ({ page }) => {
    await page.goto("/");
    await chooseGuided(page);
    await dismissTutorial(page);

    const container = page.locator("#canvas-container");
    await expect(container).toBeVisible();

    const tooltip = page.locator("#cell-inspector-tooltip");
    // Initially, tooltip should be hidden
    await expect(tooltip).toBeHidden();

    const box = await container.boundingBox();
    expect(box).not.toBeNull();

    // 1. Hover mouse over cell (0, 4) - which contains Team 1 flag base & flag in initial state
    const cell0_4_X = box.x + 0 * 50 + 25;
    const cell0_4_Y = box.y + 4 * 50 + 25;
    await page.mouse.move(cell0_4_X, cell0_4_Y);

    // Assert tooltip becomes visible and contains correct text
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Cell: (0, 4)");
    await expect(tooltip).toContainText("Team 1 flag");
    await expect(tooltip).toContainText("flag base");

    // 2. Move mouse to empty cell (2, 2)
    const cell2_2_X = box.x + 2 * 50 + 25;
    const cell2_2_Y = box.y + 2 * 50 + 25;
    await page.mouse.move(cell2_2_X, cell2_2_Y);

    // Tooltip should update to empty cell coordinates
    await expect(tooltip).toContainText("Cell: (2, 2)");
    await expect(tooltip).not.toContainText("flag");

    // 3. Move mouse off the canvas container to hide tooltip
    await page.mouse.move(box.x - 20, box.y - 20);
    await expect(tooltip).toBeHidden();

    // 4. Simulate a Touch Tap at cell (0, 4) to PIN the tooltip
    await page.evaluate(({ offsetX, offsetY }) => {
      const el = document.getElementById("canvas-container");
      const rect = el.getBoundingClientRect();
      const clientX = rect.left + offsetX;
      const clientY = rect.top + offsetY;
      const pointerDownEvent = new PointerEvent("pointerdown", {
        clientX,
        clientY,
        pointerType: "touch",
        bubbles: true
      });
      el.dispatchEvent(pointerDownEvent);
    }, { offsetX: 0 * 50 + 25, offsetY: 4 * 50 + 25 });

    // Pinned tooltip should display (0, 4) contents and persist
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Cell: (0, 4)");

    // 5. Move mouse to another cell (e.g., 2, 2) while pinned
    await page.mouse.move(cell2_2_X, cell2_2_Y);

    // The tooltip should STILL display (0, 4) contents because it is pinned
    await expect(tooltip).toContainText("Cell: (0, 4)");

    // 6. Press ESC to unpin and hide the tooltip
    await page.keyboard.press("Escape");
    await expect(tooltip).toBeHidden();
  });
});
