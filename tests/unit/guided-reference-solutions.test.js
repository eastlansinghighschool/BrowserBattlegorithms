import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { checkInvariants } from "../../src/core/invariants.js";
import { GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";

test("every non-project non-prediction guided level has a reference code-block solution", () => {
  const nonProjectLevels = getLevelDefinitions().filter((level) => level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT && !level.project && level.levelKind !== "prediction");
  const missing = nonProjectLevels
    .map((level) => level.id)
    .filter((levelId) => !GUIDED_LEVEL_REFERENCE_SOLUTIONS[levelId]);

  assert.deepEqual(missing, []);
});

test("reference code-block programs solve every non-project non-prediction guided level", () => {
  const nonProjectLevels = getLevelDefinitions().filter((level) => level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT && !level.project && level.levelKind !== "prediction");

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

// Charter S8 degenerate-solution standard (Plan 92, docs/packet-creation-guidance.md):
// enemy-nearby's opponent became a live Guard (charter S2/Appendix A, Plan 99) with a
// Manhattan aggro radius of 1 around its post. Before this uplift the opponent was a
// frozen statue, so a program that ignored the distance sensor entirely and just walked
// forward could never be punished for it (it simply timed out without ever reaching the
// off-row goal cell). Now, walking straight through the Guard's post gets the ally
// captured and frozen by live collision resolution -- a concrete consequence that did
// not exist before. The taught reference solution (react to WITHIN_2 and detour) never
// enters the Guard's radius and still passes comfortably inside the turn limit.
const ENEMY_NEARBY_BLIND_FORWARD_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>`;

test("enemy-nearby: degenerate solution that ignores the sensor gets captured by the live Guard and fails", () => {
  const { app } = runGuidedLevelWithSolution("enemy-nearby", ENEMY_NEARBY_BLIND_FORWARD_XML);

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(app.state.lastLevelResultReason, "turn_limit_exceeded");
  const ally = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  assert.equal(ally.isFrozen, true, "the naive straight-line ally should have been captured by the Guard");
});

test("enemy-nearby: taught reference solution still reaches the goal without ever being captured", () => {
  const xmlText = GUIDED_LEVEL_REFERENCE_SOLUTIONS["enemy-nearby"];
  const { app } = runGuidedLevelWithSolution("enemy-nearby", xmlText);

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED);
  const ally = app.state.allRunners.find((runner) => runner.id === "runner_1_AI_AllyP1");
  assert.equal(ally.isFrozen, false);
});
