import test from "node:test";
import assert from "node:assert/strict";
import { HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import {
  GUIDED_PROJECT_REFERENCE_SOLUTIONS,
  getProjectFinalReferenceSolution,
  getProjectStepReferenceSolution
} from "./fixtures/guidedProjectSolutions.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";

const PROJECT_ORDER = [
  {
    projectId: "strategy-brain",
    capstoneLevelId: "full-team-tactics"
  },
  {
    projectId: "team-strategy-script",
    capstoneLevelId: "advanced-scrimmage"
  }
];

test("project checkpoint fixtures exist for every authored project step", () => {
  for (const { projectId } of PROJECT_ORDER) {
    const projectLevels = getLevelDefinitions().filter(
      (level) => level.project?.id === projectId && level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
    );

    assert.equal(Boolean(GUIDED_PROJECT_REFERENCE_SOLUTIONS[projectId]), true, `${projectId} fixtures should load`);
    assert.equal(Boolean(getProjectFinalReferenceSolution(projectId)), true, `${projectId} should have a final checkpoint`);

    for (const level of projectLevels) {
      const xmlText = getProjectStepReferenceSolution(projectId, level.project.step);
      assert.ok(xmlText, `${projectId} step ${level.project.step} should have a checkpoint fixture`);
    }
  }
});

test("project checkpoint fixtures solve their matching guided project steps", () => {
  for (const { projectId } of PROJECT_ORDER) {
    const projectLevels = getLevelDefinitions().filter(
      (level) => level.project?.id === projectId && level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
    );

    for (const level of projectLevels) {
      const xmlText = getProjectStepReferenceSolution(projectId, level.project.step);
      const { app } = runGuidedLevelWithSolution(level.id, xmlText);
      assert.equal(
        app.state.activeLevelResult,
        LEVEL_RESULT.PASSED,
        `Project ${projectId} step ${level.project.step} (${level.id}) did not pass`
      );
    }
  }
});

test("project capstones solve with the final checkpoint fixture", () => {
  for (const { projectId, capstoneLevelId } of PROJECT_ORDER) {
    const finalXml = getProjectFinalReferenceSolution(projectId);
    const { app } = runGuidedLevelWithSolution(capstoneLevelId, finalXml);
    assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED, `${projectId} capstone should pass with final code`);
  }
});
