import { test, expect } from "@playwright/test";
import { buildSolutionXml, chooseGuided, clearStorageBeforeEach, dismissTutorial, waitForHeavyReady } from "./helpers.js";

clearStorageBeforeEach(test);

const TRACE_THRESHOLD = 0.5;

function setTraceReadyState(page, xmlText, runnerId = "runner_1_AI_AllyP1") {
  return page.evaluate(({ xml, runnerId: targetRunnerId, speed }) => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("show-what-you-know");
    hooks.loadWorkspaceXml(xml);
    const runner = hooks.app.state.allRunners.find((entry) => entry.id === targetRunnerId);
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(runner);
    hooks.app.state.animationSpeedFactor = speed;
    if (runner) {
      runner.hasEnemyFlag = false;
    }
  }, { xml: xmlText, runnerId, speed: TRACE_THRESHOLD });
}

async function processUntil(page, predicate, maxAttempts = 24) {
  for (let index = 0; index < maxAttempts; index += 1) {
    await page.evaluate(() => window.__BBA_TEST_HOOKS__.processTurn());
    if (await predicate()) {
      return;
    }
  }
}

test("trace playback highlights condition, result, and selected action blocks at low speed", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  const xml = buildSolutionXml(`
    <block type="battlegorithms_if_have_enemy_flag_else">
      <statement name="DO">
        <block type="battlegorithms_move_forward"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_move_backward"></block>
      </statement>
    </block>
  `);
  await setTraceReadyState(page, xml);

  await page.evaluate(() => window.__BBA_TEST_HOOKS__.processTurn());
  await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().currentTurnState)).toBe("TRACING_PRE_ACTION");

  await processUntil(page, async () => page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const conditionBlock = workspace?.getBlocksByType("battlegorithms_if_have_enemy_flag_else", false)?.[0] || null;
    const actionBlock = workspace?.getBlocksByType("battlegorithms_move_backward", false)?.[0] || null;
    return Boolean(
      conditionBlock?.getSvgRoot?.()?.classList.contains("bba-trace-result-false") &&
      actionBlock?.getSvgRoot?.()?.classList.contains("bba-trace-selected-action")
    );
  }));

  const traceState = await page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const conditionBlock = workspace?.getBlocksByType("battlegorithms_if_have_enemy_flag_else", false)?.[0] || null;
    const actionBlock = workspace?.getBlocksByType("battlegorithms_move_backward", false)?.[0] || null;
    const conditionSvg = conditionBlock?.getSvgRoot?.() || null;
    const actionSvg = actionBlock?.getSvgRoot?.() || null;
    const currentCount = workspace?.getAllBlocks?.(false)?.filter((block) => block.getSvgRoot?.()?.classList.contains("bba-trace-current")).length || 0;
    return {
      traceCurrent: currentCount > 0,
      traceFalse: Boolean(conditionSvg?.classList.contains("bba-trace-result-false")),
      traceSelectedAction: Boolean(actionSvg?.classList.contains("bba-trace-selected-action")),
      traceHintVisible: Boolean(document.querySelector(".bba-trace-empty-hint") && !document.querySelector(".bba-trace-empty-hint").hidden)
    };
  });

  expect(traceState.traceCurrent).toBeTruthy();
  expect(traceState.traceFalse).toBeTruthy();
  expect(traceState.traceSelectedAction).toBeTruthy();
  expect(traceState.traceHintVisible).toBeFalsy();
});

test("trace playback skips above the threshold and the empty-program hint appears for empty traces", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  await setTraceReadyState(page, xml);
  await page.evaluate(() => {
    window.__BBA_TEST_HOOKS__.app.state.animationSpeedFactor = 0.55;
    window.__BBA_TEST_HOOKS__.processTurn();
  });

  await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().currentTurnState)).not.toBe("TRACING_PRE_ACTION");
  await expect(page.locator("#blocklyDiv .bba-trace-current")).toHaveCount(0);

  await page.evaluate(() => {
    const hooks = window.__BBA_TEST_HOOKS__;
    hooks.startLevel("move-to-target");
    hooks.loadWorkspaceXml(`
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="battlegorithms_on_each_turn" x="24" y="24"></block>
      </xml>
    `);
    const ally = hooks.app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
    hooks.app.state.activeRunnerIndex = hooks.app.state.allRunners.indexOf(ally);
    hooks.app.state.animationSpeedFactor = 0.5;
  });
  await page.evaluate(() => window.__BBA_TEST_HOOKS__.processTurn());
  await expect.poll(async () => page.evaluate(() => window.__BBA_TEST_HOOKS__.getState().currentTurnState)).toBe("TRACING_PRE_ACTION");
  await expect(page.locator(".bba-trace-empty-hint")).toBeVisible();

  await page.locator("#playResetButton").click();
  await expect(page.locator(".bba-trace-empty-hint")).toBeHidden();
  await expect(page.locator("#blocklyDiv .bba-trace-current")).toHaveCount(0);
});

test("trace overflow badge appears on the event block and clears on mode switch", async ({ page }) => {
  await page.goto("/");
  await chooseGuided(page);
  await dismissTutorial(page);
  await waitForHeavyReady(page);

  const xml = buildSolutionXml(`
    <block type="battlegorithms_if_have_enemy_flag_else">
      <statement name="DO">
        <block type="battlegorithms_move_forward"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_if_have_enemy_flag_else">
          <statement name="DO">
            <block type="battlegorithms_move_forward"></block>
          </statement>
          <statement name="ELSE">
            <block type="battlegorithms_if_have_enemy_flag_else">
              <statement name="DO">
                <block type="battlegorithms_move_forward"></block>
              </statement>
              <statement name="ELSE">
                <block type="battlegorithms_if_have_enemy_flag_else">
                  <statement name="DO">
                    <block type="battlegorithms_move_forward"></block>
                  </statement>
                  <statement name="ELSE">
                    <block type="battlegorithms_if_have_enemy_flag_else">
                      <statement name="DO">
                        <block type="battlegorithms_move_forward"></block>
                      </statement>
                      <statement name="ELSE">
                        <block type="battlegorithms_if_have_enemy_flag_else">
                          <statement name="DO">
                            <block type="battlegorithms_move_forward"></block>
                          </statement>
                          <statement name="ELSE">
                            <block type="battlegorithms_move_backward"></block>
                          </statement>
                        </block>
                      </statement>
                    </block>
                  </statement>
                </block>
              </statement>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  `);
  await setTraceReadyState(page, xml);
  await page.evaluate(() => window.__BBA_TEST_HOOKS__.processTurn());
  await processUntil(page, async () => page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const eventBlock = workspace?.getBlocksByType("battlegorithms_on_each_turn", false)?.[0] || null;
    return Boolean(eventBlock?.getSvgRoot?.()?.classList.contains("bba-trace-overflow-badge"));
  }));

  await expect.poll(async () => page.evaluate(() => {
    const workspace = window.__BBA_TEST_HOOKS__.getBlocklyWorkspace();
    const eventBlock = workspace?.getBlocksByType("battlegorithms_on_each_turn", false)?.[0] || null;
    return Boolean(eventBlock?.getSvgRoot?.()?.classList.contains("bba-trace-overflow-badge"));
  })).toBeTruthy();

  await page.evaluate(() => window.__BBA_TEST_HOOKS__.enterFreePlay());
  await expect(page.locator(".bba-trace-overflow-badge")).toHaveCount(0);
  await expect(page.locator(".bba-trace-current")).toHaveCount(0);
});
