/**
 * Playwright regression spec for Plan 45: Guided Workspace Starter Versioning.
 *
 * Tests the stale-replace logic (Requirement 6) by pre-seeding localStorage
 * before page load and asserting the correct workspace content after load.
 *
 * Level used: prediction-06 (Prediction 6: First Move).
 *   - Has initialBlocklyXml with a move_forward block → workspace shows "Move Forward".
 *   - A seeded stale workspace has a stay_still block → workspace shows "Stay Still".
 *
 * The test is a real browser pipeline: no test hooks bypass the DOM or storage layer.
 */

import { test, expect } from "@playwright/test";
import { waitForHeavyReady, dismissTutorial } from "./helpers.js";

// Level used across all cases. Must have a non-empty initialBlocklyXml.
const LEVEL_ID = "prediction-06";
const WORKSPACE_KEY = `bba:guided-workspace:${LEVEL_ID}`;
const VERSION_KEY = `bba:guided-workspace-version:${LEVEL_ID}`;

async function waitForWorkspaceBlocks(page) {
  await page.waitForFunction(() => {
    const workspace = window.__BBA_TEST_HOOKS__?.getBlocklyWorkspace?.();
    return Boolean(workspace?.getAllBlocks(false)?.length);
  });
}

async function getWorkspaceBlockTypes(page) {
  return page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__?.getBlocklyWorkspace?.();
    return (workspace?.getAllBlocks(false) || []).map((block) => block.type);
  });
}

// A stale workspace XML that will not match the level's current initialBlocklyXml.
// Contains only a stay_still block — the current starter has move_forward.
const STALE_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_stay_still"></block>
    </next>
  </block>
</xml>`;

// ─── Case 1: Stale workspace (version key present but wrong) ─────────────────

test("stale version hash causes current starter to replace stored workspace on load", async ({ page }) => {
  // Seed: stored workspace has stay_still, version is intentionally wrong.
  await page.addInitScript(({ workspaceKey, versionKey, staleXml }) => {
    window.localStorage.setItem(workspaceKey, staleXml);
    window.localStorage.setItem(versionKey, "deadbeef"); // can't match any real hash
  }, { workspaceKey: WORKSPACE_KEY, versionKey: VERSION_KEY, staleXml: STALE_XML });

  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  const blockTypes = await getWorkspaceBlockTypes(page);
  expect(blockTypes).toContain("battlegorithms_move_forward");
  expect(blockTypes).not.toContain("battlegorithms_stay_still");
});

test("stale-replace stamps the current version key in localStorage", async ({ page }) => {
  await page.addInitScript(({ workspaceKey, versionKey, staleXml }) => {
    window.localStorage.setItem(workspaceKey, staleXml);
    window.localStorage.setItem(versionKey, "deadbeef");
  }, { workspaceKey: WORKSPACE_KEY, versionKey: VERSION_KEY, staleXml: STALE_XML });

  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  const stampedVersion = await page.evaluate(
    (versionKey) => window.localStorage.getItem(versionKey),
    VERSION_KEY
  );
  // After stale-replace, the version key must be updated to a real 8-char hex hash.
  expect(stampedVersion).toMatch(/^[0-9a-f]{8}$/);
  expect(stampedVersion).not.toBe("deadbeef");
});

// ─── Case 2: Absent version key (Decision 5 grace stamp) ─────────────────────

test("absent version key preserves stored workspace (Decision 5 grace stamp)", async ({ page }) => {
  // Seed: stored workspace has stay_still, but NO version key (pre-packet migration).
  await page.addInitScript(({ workspaceKey, staleXml }) => {
    window.localStorage.setItem(workspaceKey, staleXml);
    // Intentionally NOT setting the version key.
  }, { workspaceKey: WORKSPACE_KEY, staleXml: STALE_XML });

  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  const blockTypes = await getWorkspaceBlockTypes(page);
  expect(blockTypes).toContain("battlegorithms_stay_still");
  expect(blockTypes).not.toContain("battlegorithms_move_forward");
});

test("absent version key stamps the current hash into the version key (grace stamp side effect)", async ({ page }) => {
  await page.addInitScript(({ workspaceKey, staleXml }) => {
    window.localStorage.setItem(workspaceKey, staleXml);
  }, { workspaceKey: WORKSPACE_KEY, staleXml: STALE_XML });

  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  const graceStampedVersion = await page.evaluate(
    (versionKey) => window.localStorage.getItem(versionKey),
    VERSION_KEY
  );
  // Grace stamp writes the current version so the NEXT author edit triggers replace.
  expect(graceStampedVersion).toMatch(/^[0-9a-f]{8}$/);
});

// ─── Case 3: Matching version key (current, no change) ───────────────────────

test("matching version key preserves stored workspace unchanged", async ({ page }) => {
  // Navigate fresh first (no seeding) to let the app write both keys.
  await page.goto(`/?devGuidedLevel=${LEVEL_ID}`);
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  // Modify the workspace to something different from the starter.
  await page.evaluate((staleXml) => {
    window.__BBA_TEST_HOOKS__.loadWorkspaceXml(staleXml);
  }, STALE_XML);

  // The save listener writes both keys (workspace + version).
  // Capture the current version key value.
  const savedVersion = await page.evaluate(
    (versionKey) => window.localStorage.getItem(versionKey),
    VERSION_KEY
  );
  expect(savedVersion).toMatch(/^[0-9a-f]{8}$/, "version key must be stamped after edit");

  // Reload: workspace key has the modified XML, version key matches the current hash.
  await page.reload();
  await waitForHeavyReady(page);
  await dismissTutorial(page);
  await waitForWorkspaceBlocks(page);

  const blockTypes = await getWorkspaceBlockTypes(page);
  expect(blockTypes).toContain("battlegorithms_stay_still");
  expect(blockTypes).not.toContain("battlegorithms_move_forward");
});
