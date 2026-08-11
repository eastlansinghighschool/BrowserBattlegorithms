import test from "node:test";
import assert from "node:assert/strict";
import { HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import {
  STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS,
  TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS
} from "../../src/config/levels/shared/projectToolboxes.js";
import {
  GUIDED_PROJECT_REFERENCE_SOLUTIONS,
  getProjectFinalReferenceSolution,
  getProjectStepReferenceSolution
} from "./fixtures/guidedProjectSolutions.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";
import { PROJECT_READINESS_POLICY } from "../../src/dev/levelReadinessProjectPolicy.js";

const PROJECT_ORDER = [
  {
    projectId: "strategy-brain",
    capstoneLevelId: "full-team-tactics",
    finalFixture: "final",
    expectedToolboxes: STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS,
    cumulativeExceptions: {
      "closest-threat": "The cumulative Strategy Brain checkpoint keeps the later project shape instead of recreating the exact introductory intercept timing from the first project lesson.",
      "how-far-away": "The cumulative Strategy Brain checkpoint keeps the later project shape instead of recreating the load-bearing distance-check turn pattern from the middle lesson.",
      "two-conditions-at-once": "The cumulative Strategy Brain checkpoint keeps the later project shape instead of reproducing the exact third-lesson freeze corridor and timing.",
      "flip-the-answer": "The cumulative Strategy Brain checkpoint keeps the later project shape instead of backtracking into the NOT lesson's intermediate routing."
    }
  },
  {
    projectId: "team-strategy-script",
    capstoneLevelId: "advanced-scrimmage",
    finalFixture: "final",
    expectedToolboxes: TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS,
    cumulativeExceptions: {
      "one-program-two-allies": "The cumulative Team Strategy Script checkpoint keeps the later role-composition shape instead of recreating the exact first-step attack/support timing.",
      "index-jobs": "The cumulative Team Strategy Script checkpoint assigns index 0 as the primary attacker; level 30 places index 0 near the enemy flag, causing it to intercept before index 1 can score.",
      "closest-enemy-defender": "The cumulative Team Strategy Script checkpoint sends index 1 forward rather than toward the closest enemy; the repositioned NPCs on the player's side reach the player's flag and alter midfield state before index 0 can score within the turn limit.",
      "first-two-defend": "The cumulative Team Strategy Script checkpoint keeps the later role split rather than matching the earlier defender timing exactly.",
      "jump-team": "The cumulative Team Strategy Script checkpoint keeps the later role structure instead of re-specializing for the isolated jump lesson.",
      "barrier-specialist": "The cumulative Team Strategy Script checkpoint moves index 1 forward rather than placing a barrier; the patrolling NPC reaches the attacker's lane and freezes ally0 before it can score within the turn limit."
    }
  }
];

function normalizeToolboxBlockTypes(blockTypes) {
  return [...new Set(blockTypes)].sort();
}

function collectBlockTypesFromXml(xmlText) {
  const blockTypes = new Set();
  const regex = /<block\b[^>]*\btype="([^"]+)"/g;
  for (const match of xmlText.matchAll(regex)) {
    if (match[1] === "battlegorithms_on_each_turn") {
      continue;
    }
    blockTypes.add(match[1]);
  }
  return [...blockTypes].sort();
}

function createSeededRandom(seedText) {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function getProjectLevels(projectId) {
  return getLevelDefinitions().filter(
    (level) => level.project?.id === projectId && level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
  );
}

test("project checkpoint fixtures exist for every authored project step", () => {
  for (const { projectId } of PROJECT_ORDER) {
    const projectLevels = getProjectLevels(projectId);

    assert.equal(Boolean(GUIDED_PROJECT_REFERENCE_SOLUTIONS[projectId]), true, `${projectId} fixtures should load`);
    assert.equal(Boolean(getProjectFinalReferenceSolution(projectId)), true, `${projectId} should have a final checkpoint`);

    for (const level of projectLevels) {
      const xmlText = getProjectStepReferenceSolution(projectId, level.project.step);
      assert.ok(xmlText, `${projectId} step ${level.project.step} should have a checkpoint fixture`);
    }
  }
});

test("guided project exception policies in tests and PROJECT_READINESS_POLICY remain synchronized", () => {
  for (const { projectId, stepExceptions = {}, cumulativeExceptions = {} } of PROJECT_ORDER) {
    const policy = PROJECT_READINESS_POLICY[projectId];
    assert.ok(policy, `PROJECT_READINESS_POLICY must exist for ${projectId}`);
    assert.deepEqual(
      stepExceptions,
      policy.stepExceptions || {},
      `stepExceptions maps must agree for ${projectId}`
    );
    assert.deepEqual(
      cumulativeExceptions,
      policy.cumulativeExceptions || {},
      `cumulativeExceptions maps must agree for ${projectId}`
    );
  }
});

test("project checkpoint fixtures solve their matching guided project steps", () => {
  for (const { projectId, stepExceptions = {} } of PROJECT_ORDER) {
    const projectLevels = getProjectLevels(projectId);

    for (const level of projectLevels) {
      const xmlText = getProjectStepReferenceSolution(projectId, level.project.step);
      const randomFn = projectId === "strategy-brain" ? createSeededRandom("0") : undefined;
      const { app } = runGuidedLevelWithSolution(level.id, xmlText, randomFn ? { randomFn } : {});
      if (stepExceptions[level.id]) {
        assert.notEqual(
          app.state.activeLevelResult,
          LEVEL_RESULT.PASSED,
          `${projectId} step ${level.project.step} (${level.id}) unexpectedly passed despite being a documented step exception`
        );
      } else {
        assert.equal(
          app.state.activeLevelResult,
          LEVEL_RESULT.PASSED,
          `Project ${projectId} step ${level.project.step} (${level.id}) did not pass`
        );
      }
    }
  }
});

test("project level toolboxes keep every block used by the final cumulative fixture editable", () => {
  for (const { projectId, expectedToolboxes } of PROJECT_ORDER) {
    const finalXml = getProjectFinalReferenceSolution(projectId);
    const finalBlockTypes = collectBlockTypesFromXml(finalXml);
    const normalizedExpectedToolbox = normalizeToolboxBlockTypes(expectedToolboxes);

    const projectLevels = getProjectLevels(projectId);
    for (const level of projectLevels) {
      const levelToolbox = normalizeToolboxBlockTypes(level.toolboxBlockTypes || []);
      const missingPolicyBlocks = normalizedExpectedToolbox.filter((blockType) => !levelToolbox.includes(blockType));
      assert.deepEqual(
        missingPolicyBlocks,
        [],
        `${projectId} level ${level.id} should include the shared project toolbox policy blocks`
      );
      const missing = finalBlockTypes.filter((blockType) => !levelToolbox.includes(blockType));
      assert.deepEqual(
        missing,
        [],
        `${projectId} level ${level.id} is missing final-fixture block(s): ${missing.join(", ")}`
      );
    }
  }
});

test("project final fixtures solve the project arc except documented cumulative exceptions", () => {
  for (const { projectId, capstoneLevelId, cumulativeExceptions } of PROJECT_ORDER) {
    const finalXml = getProjectFinalReferenceSolution(projectId);
    const projectLevels = getProjectLevels(projectId);
    const actualResults = new Map();

    for (const level of projectLevels) {
      const randomFn = projectId === "strategy-brain" ? createSeededRandom("0") : undefined;
      const { app } = runGuidedLevelWithSolution(level.id, finalXml, randomFn ? { randomFn } : {});
      actualResults.set(level.id, app.state.activeLevelResult);
    }

    for (const [levelId, result] of actualResults.entries()) {
      if (cumulativeExceptions[levelId]) {
        assert.notEqual(
          result,
          LEVEL_RESULT.PASSED,
          `${projectId} final fixture unexpectedly passed documented exception level ${levelId}`
        );
      } else {
        assert.equal(
          result,
          LEVEL_RESULT.PASSED,
          `${projectId} final fixture should pass ${levelId} (${capstoneLevelId} project arc)`
        );
      }
    }
  }
});
