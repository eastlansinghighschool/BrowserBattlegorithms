import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, HUMAN_TURN_BEHAVIORS, LEVEL_RESULT, LEVEL_STATUS } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { getLevelGoalCell, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { buildSolutionXml, GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";
import { runGuidedLevelWithHumanScript } from "./helpers/testHarness.js";

function getRelayHumanScriptAction({ runner }) {
  return runner.hasEnemyFlag
    ? { type: AI_ACTION_TYPES.STAY_STILL }
    : { type: AI_ACTION_TYPES.MOVE_FORWARD };
}

test("relay race uses manual human turns and starts with the enemy flag in its base", () => {
  const app = createApp();
  initializeLevelState(app);
  app.state.levelProgress["relay-race"] = LEVEL_STATUS.AVAILABLE;
  startLevel(app, "relay-race");

  const human = app.state.allRunners.find((runner) => runner.id === "runner_1_HumanP1");
  const ally = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  const enemyFlag = app.state.gameFlags[2];

  assert.equal(app.state.humanTurnBehavior, HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT);
  assert.equal(human.hasEnemyFlag, false);
  assert.equal(enemyFlag.isAtBase, true);
  assert.equal(enemyFlag.carriedByRunnerId, null);
  assert.equal(enemyFlag.gridX, enemyFlag.initialGridX);
  assert.equal(enemyFlag.gridY, enemyFlag.initialGridY);
  assert.equal(human.gridX, 1);
  assert.equal(human.gridY, 4);
  assert.equal(ally.gridX, 4);
  assert.equal(ally.gridY, 5);
  assert.deepEqual(getLevelGoalCell(app), { x: 4, y: 0 });
});

test("relay race intended branch solution passes with a scripted human route", () => {
  const { app } = runGuidedLevelWithHumanScript(
    "relay-race",
    GUIDED_LEVEL_REFERENCE_SOLUTIONS["relay-race"],
    { humanActionScript: getRelayHumanScriptAction }
  );

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED);
  assert.equal(app.state.levelProgress["relay-race"], LEVEL_STATUS.PASSED);
});

test("relay race rejects unconditional Move Toward human runner", () => {
  const xmlText = buildSolutionXml(`
    <block type="battlegorithms_move_toward">
      <field name="TARGET">HUMAN_RUNNER</field>
    </block>
  `);

  const { app } = runGuidedLevelWithHumanScript(
    "relay-race",
    xmlText,
    { humanActionScript: getRelayHumanScriptAction }
  );

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
});

test("relay race rejects unconditional Move Up", () => {
  const xmlText = buildSolutionXml(`<block type="battlegorithms_move_up_screen"></block>`);

  const { app } = runGuidedLevelWithHumanScript(
    "relay-race",
    xmlText,
    { humanActionScript: getRelayHumanScriptAction }
  );

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
});
