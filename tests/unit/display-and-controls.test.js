import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_ACTION_TYPES,
  LEVEL_STATUS,
  MIRROR_RUNNER_EMOJI_WITH_TRANSFORM,
  USE_DIRECTIONAL_RUNNER_GLYPHS
} from "../../src/config/constants.js";
import { Runner } from "../../src/entities/Runner.js";
import { createApp } from "../../src/core/state.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { initializeLevelState, startLevel } from "../../src/core/levels.js";
import { handleKeyInput } from "../../src/ui/controls.js";
import { getCurrentSensorRelationValues, setAllowedSensorOptions } from "../../src/ai/blockly/blocks.js";
import {
  getProjectDisplayName,
  getProjectStartCalloutStorageKey,
  isProjectLevel,
  isProjectStartLevel,
  renderProjectBadge
} from "../../src/ui/projectSignifiers.js";

test("human practice level accepts F as the Team 1 jump key", () => {
  const app = createApp();
  initializeLevelState(app);
  Object.keys(app.state.levelProgress).forEach((levelId, index) => {
    app.state.levelProgress[levelId] = index === 9 ? LEVEL_STATUS.AVAILABLE : LEVEL_STATUS.PASSED;
  });

  startLevel(app, "human-runner-practice");
  const human = app.state.allRunners.find((runner) => runner.id === "runner_1_HumanP1");
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(human);
  const rejectedJ = handleKeyInput(app, "j");
  assert.equal(rejectedJ, false);

  const acceptedF = handleKeyInput(app, "f");
  assert.equal(acceptedF, true);
  assert.equal(app.state.queuedActionForCurrentRunner.actionType, AI_ACTION_TYPES.JUMP_FORWARD);
});

test("runner display emoji follows current playDirection for active and frozen states", () => {
  const ally = new Runner(1, 1, 1, false, "ally_test", false);
  assert.equal(ally.getDisplayEmoji(), USE_DIRECTIONAL_RUNNER_GLYPHS ? "🏃🏿‍♂️‍➡️" : "🏃🏿‍♂️");
  assert.equal(ally.shouldMirrorEmojiDisplay(), MIRROR_RUNNER_EMOJI_WITH_TRANSFORM);
  ally.playDirection = -1;
  assert.equal(ally.getDisplayEmoji(), "🏃🏿‍♂️");
  assert.equal(ally.shouldMirrorEmojiDisplay(), false);
  ally.setFrozen(2);
  assert.equal(ally.getDisplayEmoji(), "🧎🏾‍♂️");

  const human = new Runner(1, 1, 1, true, "human_test", false);
  assert.equal(human.shouldMirrorEmojiDisplay(), MIRROR_RUNNER_EMOJI_WITH_TRANSFORM);
  human.playDirection = -1;
  assert.equal(human.getDisplayEmoji(), "🏃🏾‍♀️");
  assert.equal(human.shouldMirrorEmojiDisplay(), false);
});

test("project signifiers identify the project arc and render a distinct badge", () => {
  const levels = getLevelDefinitions();
  const strategyStart = levels.find((level) => level.id === "closest-threat");
  const strategyCapstone = levels.find((level) => level.id === "full-team-tactics");
  const ordinaryLevel = levels.find((level) => level.id === "move-to-target");

  assert.equal(isProjectLevel(strategyStart), true);
  assert.equal(isProjectStartLevel(strategyStart), true);
  assert.equal(getProjectDisplayName(strategyStart), "Strategy Brain");
  assert.equal(getProjectStartCalloutStorageKey(strategyStart), "bba:project-start-callout-seen:strategy-brain");
  assert.match(renderProjectBadge(strategyStart), /Project/);
  assert.equal(isProjectLevel(strategyCapstone), true);
  assert.equal(isProjectStartLevel(strategyCapstone), false);
  assert.equal(isProjectLevel(ordinaryLevel), false);
  assert.equal(renderProjectBadge(ordinaryLevel), "");
});

test("free play defaults expose all eight directional sensor relations", () => {
  setAllowedSensorOptions();
  assert.deepEqual(getCurrentSensorRelationValues(), [
    "DIRECTLY_IN_FRONT",
    "DIRECTLY_BEHIND",
    "DIRECTLY_ABOVE",
    "DIRECTLY_BELOW",
    "ANYWHERE_FORWARD",
    "ANYWHERE_BEHIND",
    "ANYWHERE_ABOVE",
    "ANYWHERE_BELOW",
    "WITHIN_2",
    "WITHIN_3",
    "WITHIN_4",
    "WITHIN_5",
    "WITHIN_6"
  ]);
});
