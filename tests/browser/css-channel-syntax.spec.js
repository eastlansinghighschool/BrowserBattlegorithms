import { test, expect } from "@playwright/test";

test("CSS channel-token slash alpha resolves like the original rgba syntax", async ({ page }) => {
  await page.setContent(`
    <style>
      :root { --c-slate: 36 64 74; }
      #rgba { color: rgba(36, 64, 74, 0.12); }
      #channel { color: rgb(var(--c-slate) / 0.12); }
    </style>
    <div id="rgba">rgba baseline</div>
    <div id="channel">channel token</div>
  `);

  const colors = await page.evaluate(() => ({
    userAgent: navigator.userAgent,
    rgba: getComputedStyle(document.querySelector("#rgba")).color,
    channel: getComputedStyle(document.querySelector("#channel")).color
  }));

  expect(colors.channel, `Target browser: ${colors.userAgent}`).toBe(colors.rgba);
});

test("Help entry point loads the shared channel layer", async ({ page }) => {
  await page.goto("/help.html");

  const styles = await page.evaluate(() => ({
    rootChannels: getComputedStyle(document.documentElement).getPropertyValue("--c-charcoal").trim(),
    bodyColor: getComputedStyle(document.body).color,
    sidebarBackground: getComputedStyle(document.querySelector(".help-sidebar")).backgroundColor
  }));

  expect(styles.rootChannels).toBe("30 43 51");
  expect(styles.bodyColor).toBe("rgb(30, 43, 51)");
  expect(styles.sidebarBackground).toBe("rgba(24, 55, 68, 0.96)");
});
