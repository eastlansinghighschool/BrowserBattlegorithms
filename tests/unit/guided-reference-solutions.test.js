import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { checkInvariants } from "../../src/core/invariants.js";
import { GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";

test("every non-project guided level has a reference code-block solution", () => {
  const nonProjectLevels = getLevelDefinitions().filter((level) => level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT && !level.project);
  const missing = nonProjectLevels
    .map((level) => level.id)
    .filter((levelId) => !GUIDED_LEVEL_REFERENCE_SOLUTIONS[levelId]);

  assert.deepEqual(missing, []);
});

test("reference code-block programs solve every non-project guided level", () => {
  const nonProjectLevels = getLevelDefinitions().filter((level) => level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT && !level.project);

  for (const level of nonProjectLevels) {
    const xmlText = GUIDED_LEVEL_REFERENCE_SOLUTIONS[level.id];
    const { app, trace } = runGuidedLevelWithSolution(level.id, xmlText);
    assert.equal(
      app.state.activeLevelResult,
      LEVEL_RESULT.PASSED,
      `Level ${level.id} did not pass. Final turn=${app.state.currentTurnNumber}, state=${app.state.currentTurnState}, lastReason=${app.state.lastLevelResultReason}, traceTail=${JSON.stringify(trace.slice(-8))}`
    );
  }
});

test("level 20 reference solution uses freeze, passes, and never overlaps runners", () => {
  const { app } = runGuidedLevelWithSolution(
    "freeze-the-lane",
    GUIDED_LEVEL_REFERENCE_SOLUTIONS["freeze-the-lane"]
  );

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED);
  assert.ok(app.state.runnerActionHistory.runner_1_AI_AllyP1.includes(AI_ACTION_TYPES.FREEZE_OPPONENTS));
  assert.equal(checkInvariants(app.state), true);
});

test("level 15 reference solution passes across representative wandering rolls", () => {
  const xmlText = GUIDED_LEVEL_REFERENCE_SOLUTIONS["dodge-and-deliver"];
  for (const randomFn of [() => 0, () => 0.5, () => 0.99]) {
    const { app, trace } = runGuidedLevelWithSolution("dodge-and-deliver", xmlText, { randomFn });
    assert.equal(
      app.state.activeLevelResult,
      LEVEL_RESULT.PASSED,
      `Level dodge-and-deliver did not pass under pinned randomFn. Final turn=${app.state.currentTurnNumber}, state=${app.state.currentTurnState}, lastReason=${app.state.lastLevelResultReason}, traceTail=${JSON.stringify(trace.slice(-8))}`
    );
  }
});
