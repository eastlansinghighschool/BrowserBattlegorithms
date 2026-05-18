import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { runGuidedLevelWithSolution } from "../unit/helpers/testHarness.js";

export const REGRESSION_OUTPUT_DIR = resolve(process.cwd(), "tests", "regression", "output");
export const REGRESSION_SCREENSHOT_DIR = resolve(process.cwd(), "tests", "regression", "screenshots");
export const REGRESSION_HUMAN_SEQUENCE = ["f", "d"];

const FIXTURE_ROOT = "tests/unit/fixtures";

function xmlPathFromFixture(relativePath) {
  return `${FIXTURE_ROOT}/${relativePath}`.replaceAll("\\", "/");
}

function guidedReferenceXmlPath(levelId) {
  return xmlPathFromFixture(`guided-reference-solutions/${levelId}.xml`);
}

function projectStepXmlPath(level) {
  const step = String(level.project.step).padStart(2, "0");
  return xmlPathFromFixture(`guided-project-solutions/${level.project.id}/step-${step}.xml`);
}

function correctXmlPathForLevel(level) {
  if (level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
    return null;
  }
  if (level.project?.id) {
    return projectStepXmlPath(level);
  }
  return guidedReferenceXmlPath(level.id);
}

function buildSingleActionXml(actionBlockXml) {
  return `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      ${actionBlockXml}
    </next>
  </block>
</xml>
`;
}

function buildIfBooleanElseXml(booleanXml, doXml, elseXml) {
  return `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          ${booleanXml}
        </value>
        <statement name="DO">
          ${doXml}
        </statement>
        <statement name="ELSE">
          ${elseXml}
        </statement>
      </block>
    </next>
  </block>
</xml>
`;
}

function buildMoveTargetComparisonXml(operator, threshold, doAction = "move_up_screen", elseAction = "move_forward") {
  return buildIfBooleanElseXml(
    `
            <block type="battlegorithms_value_compare">
              <value name="LEFT">
                <block type="battlegorithms_value_distance_to_target">
                  <field name="TARGET">CLOSEST_ENEMY</field>
                </block>
              </value>
              <field name="OPERATOR">${operator}</field>
              <value name="RIGHT">
                <block type="battlegorithms_value_number">
                  <field name="VALUE">${threshold}</field>
                </block>
              </value>
            </block>
    `,
    `<block type="battlegorithms_${doAction}"></block>`,
    `<block type="battlegorithms_${elseAction}"></block>`
  );
}

function buildRunnerIndexComparisonXml(indexValue, doXml, elseXml) {
  return buildIfBooleanElseXml(
    `
            <block type="battlegorithms_value_compare">
              <value name="LEFT">
                <block type="battlegorithms_value_runner_index"></block>
              </value>
              <field name="OPERATOR">EQ</field>
              <value name="RIGHT">
                <block type="battlegorithms_value_number">
                  <field name="VALUE">${indexValue}</field>
                </block>
              </value>
            </block>
    `,
    doXml,
    elseXml
  );
}

function buildLogicXml(operator, leftXml, rightXml, doXml, elseXml) {
  return buildIfBooleanElseXml(
    `
            <block type="battlegorithms_logic_${operator}">
              <value name="LEFT">
                ${leftXml}
              </value>
              <value name="RIGHT">
                ${rightXml}
              </value>
            </block>
    `,
    doXml,
    elseXml
  );
}

function buildFlipXml(doXml, elseXml) {
  return buildIfBooleanElseXml(
    `
            <block type="battlegorithms_boolean_on_my_side"></block>
    `,
    doXml,
    elseXml
  );
}

function buildJumpTeamWrongXml() {
  return buildRunnerIndexComparisonXml(
    0,
    "<block type=\"battlegorithms_jump_forward\"></block>",
    "<block type=\"battlegorithms_move_down_screen\"></block>"
  );
}

function buildOneProgramTwoAlliesWrongXml() {
  return buildRunnerIndexComparisonXml(
    0,
    `<block type="battlegorithms_move_toward">
      <field name="TARGET">ENEMY_FLAG</field>
    </block>`,
    `<block type="battlegorithms_move_toward">
      <field name="TARGET">ENEMY_FLAG</field>
    </block>`
  );
}

function buildIndexJobsWrongXml() {
  return buildRunnerIndexComparisonXml(
    1,
    `<block type="battlegorithms_move_toward">
      <field name="TARGET">ENEMY_FLAG</field>
    </block>`,
    "<block type=\"battlegorithms_move_up_screen\"></block>"
  );
}

function buildAdvancedScrimmageWrongXml() {
  return buildSingleActionXml(`<block type="battlegorithms_move_toward">
    <field name="TARGET">ENEMY_FLAG</field>
  </block>`);
}

function buildAdvancedScrimmageRoleWrongXml() {
  return buildRunnerIndexComparisonXml(
    1,
    `<block type="battlegorithms_move_toward">
      <field name="TARGET">ENEMY_FLAG</field>
    </block>`,
    "<block type=\"battlegorithms_move_up_screen\"></block>"
  );
}

function buildHumanPracticeSequenceXml() {
  return null;
}

const PROFILE_PLANS = [
  {
    name: "Perfect Pat",
    studentName: "Pat Chen",
    behavior: "happy-path",
    levelOverrides: {},
    stopAfterLevel: null
  },
  {
    name: "Struggling Sam",
    studentName: "Sam Rivera",
    behavior: "moderate-struggler",
    levelOverrides: {
      "move-to-target": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_move_up_screen\"></block>"), expectPass: false }
      ],
      "enemy-nearby": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_move_forward\"></block>"), expectPass: false }
      ],
      "jump-if-ready": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_jump_forward\"></block>"), expectPass: false }
      ],
      "how-far-away": [
        { xmlInline: buildMoveTargetComparisonXml("GT", 5), expectPass: false }
      ],
      "one-program-two-allies": [
        { xmlInline: buildOneProgramTwoAlliesWrongXml(), expectPass: false }
      ],
      "jump-team": [
        { xmlInline: buildJumpTeamWrongXml(), expectPass: false }
      ]
    },
    stopAfterLevel: null
  },
  {
    name: "Challenged Charlie",
    studentName: "Charlie Nguyen",
    behavior: "heavier-struggler",
    levelOverrides: {
      "move-to-target": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_move_up_screen\"></block>"), expectPass: false }
      ],
      "enemy-nearby": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_move_forward\"></block>"), expectPass: false }
      ],
      "jump-the-gap": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_move_forward\"></block>"), expectPass: false }
      ],
      "how-far-away": [
        { xmlInline: buildMoveTargetComparisonXml("LTE", 2), expectPass: false }
      ],
      "two-conditions-at-once": [
        { xmlInline: buildLogicXml("or",
          `
                <block type="battlegorithms_value_compare">
                  <value name="LEFT">
                    <block type="battlegorithms_value_distance_to_target">
                      <field name="TARGET">CLOSEST_ENEMY</field>
                    </block>
                  </value>
                  <field name="OPERATOR">LTE</field>
                  <value name="RIGHT">
                    <block type="battlegorithms_value_number">
                      <field name="VALUE">2</field>
                    </block>
                  </value>
                </block>
          `,
          `<block type="battlegorithms_boolean_area_freeze_ready"></block>`,
          "<block type=\"battlegorithms_freeze_opponents\"></block>",
          `<block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>`
        ), expectPass: false }
      ],
      "this-or-that": [
        { xmlInline: buildLogicXml("and",
          "<block type=\"battlegorithms_boolean_on_enemy_side\"></block>",
          `
                <block type="battlegorithms_boolean_sensor_matches">
                  <field name="OBJECT">ENEMY_RUNNER</field>
                  <field name="RELATION">WITHIN_2</field>
                </block>
          `,
          "<block type=\"battlegorithms_move_up_screen\"></block>",
          "<block type=\"battlegorithms_move_forward\"></block>"
        ), expectPass: false }
      ],
      "flip-the-answer": [
        { xmlInline: buildFlipXml("<block type=\"battlegorithms_move_up_screen\"></block>", "<block type=\"battlegorithms_move_forward\"></block>"), expectPass: false }
      ],
      "index-jobs": [
        { xmlInline: buildIndexJobsWrongXml(), expectPass: false }
      ],
      "one-program-two-allies": [
        { xmlInline: buildOneProgramTwoAlliesWrongXml(), expectPass: false }
      ],
      "advanced-scrimmage": [
        { xmlInline: buildAdvancedScrimmageWrongXml(), expectPass: false },
        { xmlInline: buildAdvancedScrimmageRoleWrongXml(), expectPass: false }
      ]
    },
    stopAfterLevel: null
  },
  {
    name: "Gave-Up Gabi",
    studentName: "Gabi Torres",
    behavior: "abandonment",
    levelOverrides: {
      "jump-if-ready": [
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_jump_forward\"></block>"), expectPass: false },
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_jump_forward\"></block>"), expectPass: false },
        { xmlInline: buildSingleActionXml("<block type=\"battlegorithms_jump_forward\"></block>"), expectPass: false }
      ]
    },
    stopAfterLevel: "jump-if-ready"
  },
  {
    name: "Copy-Cat Casey",
    studentName: "Casey Chen",
    behavior: "duplicate-similarity",
    levelOverrides: {},
    stopAfterLevel: null
  }
];

function isRequiredCampaignLevel(level) {
  return !level.id.startsWith("optional-");
}

function buildAttemptForLevel(level, profilePlan) {
  if (level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
    return [
      {
        inputSequence: [...REGRESSION_HUMAN_SEQUENCE],
        expectPass: true
      }
    ];
  }

  const defaultCorrect = {
    xmlFile: correctXmlPathForLevel(level),
    expectPass: true
  };
  const overrideAttempts = profilePlan.levelOverrides?.[level.id];
  if (overrideAttempts) {
    const normalizedOverrides = overrideAttempts.map((attempt) => ({ ...attempt }));
    if (profilePlan.stopAfterLevel === level.id) {
      return normalizedOverrides;
    }
    return [...normalizedOverrides, defaultCorrect];
  }
  return [defaultCorrect];
}

export function getExpectedRegressionProfileSummary(profile) {
  const attempts = profile.levels.flatMap((level) => level.attempts || []);
  const passed = attempts.filter((attempt) => attempt.expectPass !== false).length;
  const failed = attempts.length - passed;
  return {
    levelIds: profile.levels.map((level) => level.levelId),
    levelCount: profile.levels.length,
    guided: {
      started: attempts.length,
      completed: attempts.length,
      passed,
      failed,
      attempts: attempts.length
    }
  };
}

export function buildRegressionProfiles() {
  const levels = getLevelDefinitions().filter(isRequiredCampaignLevel);
  return PROFILE_PLANS.map((profilePlan) => {
    const profileLevels = [];
    for (const level of levels) {
      profileLevels.push({
        levelId: level.id,
        levelTitle: level.title,
        levelKind: level.levelKind,
        attempts: buildAttemptForLevel(level, profilePlan)
      });
      if (profilePlan.stopAfterLevel && level.id === profilePlan.stopAfterLevel) {
        break;
      }
    }

    return {
      name: profilePlan.name,
      studentName: profilePlan.studentName,
      behavior: profilePlan.behavior,
      stopAfterLevel: profilePlan.stopAfterLevel,
      levels: profileLevels
    };
  });
}

async function readAttemptXml(attempt) {
  if (attempt.xmlInline) {
    return attempt.xmlInline;
  }
  if (attempt.xmlFile) {
    return readFile(resolve(process.cwd(), attempt.xmlFile), "utf8");
  }
  return null;
}

export async function assertRegressionProfileFixturesAreSound() {
  const profiles = buildRegressionProfiles();
  for (const profile of profiles) {
    for (const level of profile.levels) {
      for (const attempt of level.attempts) {
        if (attempt.expectPass !== false || !attempt.xmlInline && !attempt.xmlFile) {
          continue;
        }
        const xmlText = await readAttemptXml(attempt);
        const { app } = runGuidedLevelWithSolution(level.levelId, xmlText);
        if (app.state.activeLevelResult !== LEVEL_RESULT.FAILED) {
          throw new Error(
            `Regression profile ${profile.name} attempt for ${level.levelId} should fail, but ended as ${app.state.activeLevelResult}`
          );
        }
      }
    }
  }
}

export async function resolveAttemptXmlText(attempt) {
  return readAttemptXml(attempt);
}
