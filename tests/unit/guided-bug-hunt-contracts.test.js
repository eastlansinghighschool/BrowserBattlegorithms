import test from "node:test";
import assert from "node:assert/strict";
import { LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";

test("bug hunt starters fail while the repaired reference solutions pass", () => {
  const bugHuntLevels = getLevelDefinitions().filter((level) => level.levelKind === "bug_hunt");

  assert.equal(bugHuntLevels.length, 4);

  for (const level of bugHuntLevels) {
    const starterRun = runGuidedLevelWithSolution(level.id, level.initialBlocklyXml);
    assert.equal(
      starterRun.app.state.activeLevelResult,
      LEVEL_RESULT.FAILED,
      `${level.id} starter should fail so students have something to repair`
    );

    const repairedRun = runGuidedLevelWithSolution(level.id, GUIDED_LEVEL_REFERENCE_SOLUTIONS[level.id]);
    assert.equal(
      repairedRun.app.state.activeLevelResult,
      LEVEL_RESULT.PASSED,
      `${level.id} reference solution should pass`
    );
  }
});
