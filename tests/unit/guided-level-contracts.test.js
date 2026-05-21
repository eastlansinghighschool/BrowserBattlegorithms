import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_ACTION_TYPES,
  BLOCK_TYPES,
  GAME_MODES,
  GAME_VIEW_MODES,
  HUMAN_TURN_BEHAVIORS,
  LEVEL_RESULT,
  LEVEL_STATUS,
  CELL_TYPE,
  MAPS,
  MOVE_TOWARD_TARGETS,
  NPC_BEHAVIORS,
  SENSOR_OBJECT_TYPES,
  SENSOR_RELATION_TYPES
} from "../../src/config/constants.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { getToolboxBlockTypesForMode } from "../../src/ai/blockly/blocks.js";
import { createApp } from "../../src/core/state.js";
import { completeLevel, evaluateLevelProgress, getLevelStateSnapshot, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { buildSolutionXml, GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";
import { runGuidedLevelWithHumanScript, runGuidedLevelWithSolution } from "./helpers/testHarness.js";

test("level definitions load with the expected starter and advanced level order", () => {
  const levels = getLevelDefinitions();
  assert.equal(levels.length, 46);
  assert.deepEqual(
    levels.map((level) => level.id),
    [
      "move-to-target",
      "reach-enemy-flag",
      "score-a-point",
      "barrier-detour",
      "mirror-forward",
      "prediction-06",
      "sensor-barrier-branch",
      "watch-the-wall",
      "find-the-human",
      "find-the-enemy-flag",
      "human-runner-practice",
      "move-toward-flag",
      "bring-it-home",
      "enemy-nearby",
      "jump-the-gap",
      "bughunt-15",
      "dodge-and-deliver",
      "jump-if-ready",
      "build-the-barrier",
      "stay-still-can-do-something",
      "relay-race",
      "my-side-their-side",
      "freeze-the-lane",
      "bughunt-22",
      "show-what-you-know",
      "closest-threat",
      "how-far-away",
      "two-conditions-at-once",
      "this-or-that",
      "flip-the-answer",
      "prediction-25",
      "bughunt-28",
      "full-team-tactics",
      "one-program-two-allies",
      "index-jobs",
      "first-two-defend",
      "escort-the-carrier",
      "closest-enemy-defender",
      "freeze-support",
      "barrier-specialist",
      "jump-team",
      "prediction-31",
      "bughunt-37",
      "advanced-scrimmage",
      "optional-random-lab",
      "optional-double-carrier-showdown"
    ]
  );

  assert.equal(levels[5].id, "prediction-06");
  assert.ok(levels[5].title.startsWith("Prediction"));
  assert.equal(levels[15].id, "bughunt-15");
  assert.ok(levels[16].title.startsWith("Challenge 15"));
  assert.equal(levels[23].id, "bughunt-22");
  assert.ok(levels[24].title.startsWith("Challenge 22"));
  assert.equal(levels[30].id, "prediction-25");
  assert.ok(levels[30].title.startsWith("Prediction"));
  assert.equal(levels[31].id, "bughunt-28");
  assert.ok(levels[32].title.startsWith("Challenge 28"));
  assert.equal(levels[41].id, "prediction-31");
  assert.ok(levels[41].title.startsWith("Prediction"));
  assert.equal(levels[42].id, "bughunt-37");
  assert.ok(levels[43].title.startsWith("Challenge 37"));
  assert.equal(levels.at(-2).id, "optional-random-lab");
  assert.equal(levels.at(-1).id, "optional-double-carrier-showdown");
});

test("guided mode cold start: level 1 available, all others locked", () => {
  const app = createApp();
  initializeLevelState(app);
  const snapshot = getLevelStateSnapshot(app);
  assert.equal(snapshot.currentModeView, GAME_VIEW_MODES.GUIDED_LEVELS);
  assert.equal(snapshot.currentLevelId, "move-to-target");
  assert.equal(snapshot.levelProgress["move-to-target"], LEVEL_STATUS.AVAILABLE);
  const allLevels = getLevelDefinitions();
  for (const level of allLevels.slice(1)) {
    assert.equal(
      snapshot.levelProgress[level.id],
      LEVEL_STATUS.LOCKED,
      `${level.id} should start LOCKED on cold init`
    );
  }
  assert.equal(snapshot.humanTurnBehavior, HUMAN_TURN_BEHAVIORS.AUTO_SKIP);
});

test("advanced campaign authored levels enforce their intended mechanic family", () => {
  const trivialPrograms = [
    ["closest-threat", buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)],
    ["one-program-two-allies", buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)],
    ["first-two-defend", buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)],
    ["barrier-specialist", buildSolutionXml(`<block type="battlegorithms_place_barrier"></block>`)],
    ["jump-team", buildSolutionXml(`<block type="battlegorithms_jump_forward"></block>`)]
  ];

  for (const [levelId, xmlText] of trivialPrograms) {
    const { app } = runGuidedLevelWithSolution(levelId, xmlText);
    assert.equal(app.state.activeLevelResult, LEVEL_RESULT.FAILED, `${levelId} should reject the trivial program`);
  }
});

test("bug hunt metadata is preserved on the authored debugging levels and surfaced in the manifest", async () => {
  const levels = getLevelDefinitions();
  const { GUIDED_LEVEL_MANIFEST } = await import("../../src/config/levels/manifest.js");

  for (const levelId of ["bughunt-15", "bughunt-22", "bughunt-28", "bughunt-37"]) {
    const level = levels.find((entry) => entry.id === levelId);
    const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId);
    assert.equal(level.levelKind, "bug_hunt", `${levelId} should be marked as a bug hunt`);
    assert.equal(manifestEntry.levelKind, "bug_hunt", `${levelId} should expose bug hunt metadata in the manifest`);
  }
});

test("prediction metadata is preserved on the authored prediction levels and surfaced in the manifest", async () => {
  const levels = getLevelDefinitions();
  const { GUIDED_LEVEL_MANIFEST } = await import("../../src/config/levels/manifest.js");

  for (const levelId of ["prediction-06", "prediction-25", "prediction-31"]) {
    const level = levels.find((entry) => entry.id === levelId);
    const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId);
    assert.equal(level.levelKind, "prediction", `${levelId} should be marked as a prediction level`);
    assert.equal(manifestEntry.levelKind, "prediction", `${levelId} should expose prediction metadata in the manifest`);
    assert.ok(level.prediction?.prompt);
    assert.ok(level.prediction?.choices?.length >= 2);
  }
});

test("advanced campaign contract exposes capstone and optional lab tools as authored", () => {
  const fullTeamTactics = getLevelDefinitions().find((entry) => entry.id === "full-team-tactics");
  assert.ok(fullTeamTactics.toolboxBlockTypes.includes(BLOCK_TYPES.VALUE_DISTANCE_TO_TARGET));
  assert.ok(fullTeamTactics.toolboxBlockTypes.includes(BLOCK_TYPES.VALUE_COUNT_WITHIN));
  assert.ok(fullTeamTactics.toolboxBlockTypes.includes(BLOCK_TYPES.LOGIC_AND));
  assert.ok(fullTeamTactics.toolboxBlockTypes.includes(BLOCK_TYPES.IF_HAVE_ENEMY_FLAG));
  assert.ok(fullTeamTactics.toolboxBlockTypes.includes(BLOCK_TYPES.IF_BARRIER_IN_FRONT));
  assert.ok(fullTeamTactics.sensorObjectTypes.includes(SENSOR_OBJECT_TYPES.ALLY_RUNNER));

  const advancedScrimmage = getLevelDefinitions().find((entry) => entry.id === "advanced-scrimmage");
  assert.ok(advancedScrimmage.title.startsWith("Challenge 37"));
  assert.ok(advancedScrimmage.toolboxBlockTypes.includes(BLOCK_TYPES.MOVE_RANDOMLY));
  assert.ok(advancedScrimmage.toolboxBlockTypes.includes(BLOCK_TYPES.PLACE_BARRIER));
  assert.ok(advancedScrimmage.toolboxBlockTypes.includes(BLOCK_TYPES.JUMP_FORWARD));
  assert.ok(advancedScrimmage.toolboxBlockTypes.includes(BLOCK_TYPES.FREEZE_OPPONENTS));
  assert.deepEqual(advancedScrimmage.winCondition, { type: "team_scores_point", teamId: 1 });
  assert.equal(advancedScrimmage.setup.teams.opponent.runners.every((runner) => !runner.isFrozen), true);

  const optionalRandomLab = getLevelDefinitions().find((entry) => entry.id === "optional-random-lab");
  assert.ok(optionalRandomLab);
  assert.equal(optionalRandomLab.toolboxBlockTypes.includes(BLOCK_TYPES.MOVE_RANDOMLY), true);

  const optionalCarrierShowdown = getLevelDefinitions().find((entry) => entry.id === "optional-double-carrier-showdown");
  assert.ok(optionalCarrierShowdown);
  assert.equal(optionalCarrierShowdown.humanTurnBehavior, HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT);
  assert.equal(optionalCarrierShowdown.mode, GAME_MODES.PLAYER_VS_NPC);
  assert.equal(optionalCarrierShowdown.mapKey, "wideScrimmage");
  assert.equal(optionalCarrierShowdown.winCondition.type, "team_scores_point");
  assert.equal(optionalCarrierShowdown.winCondition.teamId, 1);
  assert.equal(optionalCarrierShowdown.winCondition.runnerId, "runner_1_HumanP1");
  assert.deepEqual(optionalCarrierShowdown.failureConditions, [
    { type: "team_scores_point", teamId: 2 },
    { type: "turn_limit_exceeded", maxTurns: 20 }
  ]);
  assert.equal(optionalCarrierShowdown.failureCondition.type, "team_scores_point");
  assert.equal(optionalCarrierShowdown.failureCondition.teamId, 2);
  assert.equal(optionalCarrierShowdown.failureCondition.maxTurns, undefined);
  assert.ok(optionalCarrierShowdown.toolboxBlockTypes.includes(BLOCK_TYPES.IF_TEAMMATE_HAS_FLAG));
  assert.ok(optionalCarrierShowdown.toolboxBlockTypes.includes(BLOCK_TYPES.VALUE_RUNNER_INDEX));
  assert.ok(optionalCarrierShowdown.toolboxBlockTypes.includes(BLOCK_TYPES.MOVE_TOWARD));
  assert.deepEqual(optionalCarrierShowdown.moveTowardTargetTypes, [
    MOVE_TOWARD_TARGETS.ENEMY_FLAG,
    MOVE_TOWARD_TARGETS.MY_BASE,
    MOVE_TOWARD_TARGETS.HUMAN_RUNNER,
    MOVE_TOWARD_TARGETS.CLOSEST_ENEMY
  ]);
  assert.equal(optionalCarrierShowdown.setup.teams.player.runners.length, 3);
  assert.equal(optionalCarrierShowdown.setup.teams.opponent.runners.length, 3);
  assert.equal(optionalCarrierShowdown.setup.teams.player.runners[0].hasEnemyFlag, true);
  assert.equal(optionalCarrierShowdown.setup.teams.opponent.runners[0].hasEnemyFlag, true);
  assert.equal(optionalCarrierShowdown.setup.flags.opponent.carriedByRunnerId, "runner_1_HumanP1");
  assert.equal(optionalCarrierShowdown.setup.flags.player.carriedByRunnerId, "runner_2_Npc1");
});

test("guided sensor lessons expose above and below relations alongside their existing front and behind pairs", () => {
  const levels = getLevelDefinitions();
  const relationMap = new Map(levels.map((level) => [level.id, level.sensorRelationTypes || []]));

  for (const levelId of ["sensor-barrier-branch", "watch-the-wall", "stay-still-can-do-something", "bughunt-15"]) {
    const relations = relationMap.get(levelId) || [];
    assert.equal(relations.includes(SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT), true, `${levelId} should keep directly in front`);
    assert.equal(relations.includes(SENSOR_RELATION_TYPES.DIRECTLY_BEHIND), true, `${levelId} should keep directly behind`);
    assert.equal(relations.includes(SENSOR_RELATION_TYPES.DIRECTLY_ABOVE), true, `${levelId} should expose directly above`);
    assert.equal(relations.includes(SENSOR_RELATION_TYPES.DIRECTLY_BELOW), true, `${levelId} should expose directly below`);
  }
});

test("optional double carrier showdown passes with a scripted human carrier and split ally roles", () => {
  const xmlText = buildSolutionXml(`
    <block type="battlegorithms_if_boolean_else">
      <value name="BOOL">
        <block type="battlegorithms_value_compare">
          <value name="LEFT">
            <block type="battlegorithms_value_runner_index"></block>
          </value>
          <field name="OPERATOR">EQ</field>
          <value name="RIGHT">
            <block type="battlegorithms_value_number">
              <field name="VALUE">0</field>
            </block>
          </value>
        </block>
      </value>
      <statement name="DO">
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_boolean_teammate_has_flag"></block>
          </value>
          <statement name="DO">
            <block type="battlegorithms_move_toward">
              <field name="TARGET">MY_BASE</field>
            </block>
          </statement>
          <statement name="ELSE">
            <block type="battlegorithms_move_toward">
              <field name="TARGET">ENEMY_FLAG</field>
            </block>
          </statement>
        </block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_boolean_teammate_has_flag"></block>
          </value>
          <statement name="DO">
            <block type="battlegorithms_move_toward">
              <field name="TARGET">CLOSEST_ENEMY</field>
            </block>
          </statement>
          <statement name="ELSE">
            <block type="battlegorithms_move_toward">
              <field name="TARGET">ENEMY_FLAG</field>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  `);

  const { app } = runGuidedLevelWithHumanScript(
    "optional-double-carrier-showdown",
    xmlText,
    {
      humanActionScript: ({ runner }) => (
        runner.hasEnemyFlag
          ? { type: AI_ACTION_TYPES.MOVE_BACKWARD }
          : { type: AI_ACTION_TYPES.STAY_STILL }
      )
    }
  );

  assert.equal(app.state.activeLevelResult, LEVEL_RESULT.PASSED);
  assert.equal(app.state.levelProgress["optional-double-carrier-showdown"], LEVEL_STATUS.PASSED);
});

test("starter levels include onboarding copy and tutorial steps", () => {
  const [firstLevel, secondLevel] = getLevelDefinitions();
  assert.ok(firstLevel.introText.includes("quiet practice board"));
  assert.ok(firstLevel.tutorialSteps.length >= 3);
  assert.ok(secondLevel.tutorialSteps.some((step) => step.body.includes("flag")));
  const thirdLevel = getLevelDefinitions().find((level) => level.id === "score-a-point");
  assert.ok(thirdLevel.toolboxBlockTypes.includes(BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE));
  assert.ok(thirdLevel.tutorialSteps.some((step) => step.body.includes("carry")));
});

test("dodge-and-deliver authors a stationary defender and a movement-only wanderer", () => {
  const level = getLevelDefinitions().find((entry) => entry.id === "dodge-and-deliver");
  const ally = level.setup.teams.player.runners.find((runner) => runner.slot === "ally");
  const enemies = level.setup.teams.opponent.runners;
  const stationaryDefender = enemies.find((runner) => runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_STAY_STILL);
  const wanderingEnemy = enemies.find((runner) => runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY);
  const enemyFlag = level.setup.flags.opponent;

  assert.equal(enemies.length, 2);
  assert.ok(stationaryDefender, "Level 15 should include an explicit stationary defender");
  assert.ok(wanderingEnemy, "Level 15 should include an explicit movement-only wanderer");
  assert.deepEqual(level.sensorRelationTypes, [
    SENSOR_RELATION_TYPES.WITHIN_2,
    SENSOR_RELATION_TYPES.WITHIN_3,
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW,
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ]);
  assert.equal(Boolean(stationaryDefender.isFrozen), false);
  assert.equal(Boolean(wanderingEnemy.isFrozen), false);
  assert.equal(stationaryDefender.gridX > ally.gridX, true);
  assert.equal(stationaryDefender.gridX < enemyFlag.gridX, true);
  assert.equal(stationaryDefender.gridY <= enemyFlag.gridY, true);
  assert.equal(Math.abs(stationaryDefender.gridY - enemyFlag.gridY) <= 1, true);
  assert.equal(wanderingEnemy.gridX, 8);
  assert.equal(wanderingEnemy.gridY, 6);
  assert.match(level.description, /defender.*moving/i);
  assert.match(level.introText, /holds the lane/i);
});

test("challenge 22 authors guided vertical patrol defenders near the center lane", () => {
  const level = getLevelDefinitions().find((entry) => entry.id === "show-what-you-know");
  const enemies = level.setup.teams.opponent.runners;

  assert.equal(enemies.length, 3);
  assert.deepEqual(
    enemies.map((runner) => ({ slot: runner.slot, gridX: runner.gridX, gridY: runner.gridY, cpuBehavior: runner.cpuBehavior })),
    [
      { slot: "npc1", gridX: 7, gridY: 2, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL },
      { slot: "npc2", gridX: 8, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_STAY_STILL },
      { slot: "npc3", gridX: 9, gridY: 7, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL }
    ]
  );
  assert.match(level.introText, /Two enemies are active/i);
  assert.match(level.description, /live defenders/i);
});

test("guided teamplay and scrimmage levels keep the opponent flag on the home stripe", () => {
  const levelIds = [
    "two-conditions-at-once",
    "one-program-two-allies",
    "index-jobs"
  ];

  for (const levelId of levelIds) {
    const level = getLevelDefinitions().find((entry) => entry.id === levelId);
    const opponentFlag = level.setup.flags.opponent;
    const map = MAPS[level.mapKey];

    assert.ok(opponentFlag, `${levelId} should author an opponent flag`);
    assert.equal(
      map[opponentFlag.gridY][opponentFlag.gridX],
      CELL_TYPE.TEAM2_BASE,
      `${levelId} should keep the opponent flag on the opponent base stripe`
    );
  }
});

test("guided toolbox restriction reflects the curriculum unlock path", () => {
  const app = createApp();
  initializeLevelState(app);

  const expectations = [
    ["move-to-target", [BLOCK_TYPES.MOVE_FORWARD, BLOCK_TYPES.MOVE_UP_SCREEN, BLOCK_TYPES.MOVE_DOWN_SCREEN, BLOCK_TYPES.STAY_STILL]],
    ["reach-enemy-flag", [BLOCK_TYPES.MOVE_BACKWARD]],
    ["score-a-point", [BLOCK_TYPES.IF_HAVE_ENEMY_FLAG]],
    ["barrier-detour", [BLOCK_TYPES.IF_BARRIER_IN_FRONT, BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE]],
    ["sensor-barrier-branch", [BLOCK_TYPES.IF_SENSOR_MATCHES, BLOCK_TYPES.IF_SENSOR_MATCHES_ELSE]],
    ["move-toward-flag", [BLOCK_TYPES.MOVE_TOWARD]]
  ];

  for (const [levelId, expectedBlocks] of expectations) {
    const level = app.state.levels.find((entry) => entry.id === levelId);
    const toolbox = getToolboxBlockTypesForMode(app, level);
    for (const blockType of expectedBlocks) {
      assert.ok(toolbox.includes(blockType), `${levelId} should include ${blockType}`);
    }
  }

  const sensingLevel = app.state.levels.find((level) => level.id === "sensor-barrier-branch");
  assert.deepEqual(sensingLevel.sensorObjectTypes, [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ]);
  assert.deepEqual(sensingLevel.sensorRelationTypes, [
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW
  ]);
});

test("guided sensing unlocks progress in authored stages", () => {
  const levels = getLevelDefinitions();
  const watchTheWall = levels.find((level) => level.id === "watch-the-wall");
  assert.deepEqual(watchTheWall.sensorObjectTypes, [
    SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ]);
  assert.deepEqual(watchTheWall.sensorRelationTypes, [
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW
  ]);

  const findTheHuman = levels.find((level) => level.id === "find-the-human");
  assert.deepEqual(findTheHuman.sensorObjectTypes, [
    SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ]);
  assert.deepEqual(findTheHuman.sensorRelationTypes, [
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ]);
});

test("guided levels that use directly in front also expose above and below", () => {
  const levels = getLevelDefinitions();
  const expectations = new Map([
    [
      "sensor-barrier-branch",
      [
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW
      ]
    ],
    [
      "watch-the-wall",
      [
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW
      ]
    ],
    [
      "dodge-and-deliver",
      [
        SENSOR_RELATION_TYPES.WITHIN_2,
        SENSOR_RELATION_TYPES.WITHIN_3,
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW,
        SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
        SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
        SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
        SENSOR_RELATION_TYPES.ANYWHERE_BELOW
      ]
    ],
    [
      "stay-still-can-do-something",
      [
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW
      ]
    ],
    [
      "show-what-you-know",
      [
        SENSOR_RELATION_TYPES.WITHIN_2,
        SENSOR_RELATION_TYPES.WITHIN_3,
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW,
        SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
        SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
        SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
        SENSOR_RELATION_TYPES.ANYWHERE_BELOW
      ]
    ],
    [
      "full-team-tactics",
      [
        SENSOR_RELATION_TYPES.WITHIN_2,
        SENSOR_RELATION_TYPES.WITHIN_3,
        SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
        SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
        SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
        SENSOR_RELATION_TYPES.DIRECTLY_BELOW,
        SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
        SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
        SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
        SENSOR_RELATION_TYPES.ANYWHERE_BELOW
      ]
    ]
  ]);

  for (const [levelId, expectedRelations] of expectations) {
    const level = levels.find((entry) => entry.id === levelId);
    assert.deepEqual(level.sensorRelationTypes, expectedRelations, `${levelId} should expose above/below alongside direct sensing`);
  }
});

test("guided Move Toward and human-input levels keep their authored restrictions and copy", () => {
  const levels = getLevelDefinitions();
  const moveTowardFlag = levels.find((level) => level.id === "move-toward-flag");
  assert.deepEqual(moveTowardFlag.moveTowardTargetTypes, [MOVE_TOWARD_TARGETS.ENEMY_FLAG]);
  assert.deepEqual(moveTowardFlag.setupOverrides.flagOverrides[2], { gridX: 11, gridY: 3 });

  const bringItHome = levels.find((level) => level.id === "bring-it-home");
  assert.deepEqual(bringItHome.moveTowardTargetTypes, [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE]);
  assert.ok(bringItHome.toolboxBlockTypes.includes(BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE));

  const humanPractice = levels.find((level) => level.id === "human-runner-practice");
  assert.equal(humanPractice.humanTurnBehavior, HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT);
  assert.equal(humanPractice.failureCondition.maxTurns, 200);
  assert.deepEqual(humanPractice.winCondition.actionTypes, [
    AI_ACTION_TYPES.JUMP_FORWARD,
    AI_ACTION_TYPES.PLACE_BARRIER_FORWARD
  ]);
  assert.match(humanPractice.description, /Jump or Place Barrier/i);
});

test("later guided resource levels expose the intended freeze tools and sensing options", () => {
  const freezeLane = getLevelDefinitions().find((level) => level.id === "freeze-the-lane");
  assert.ok(freezeLane.toolboxBlockTypes.includes(BLOCK_TYPES.FREEZE_OPPONENTS));
  assert.ok(freezeLane.toolboxBlockTypes.includes(BLOCK_TYPES.IF_AREA_FREEZE_READY_ELSE));
  assert.deepEqual(freezeLane.sensorObjectTypes, [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ]);
  assert.deepEqual(freezeLane.sensorRelationTypes, [SENSOR_RELATION_TYPES.WITHIN_2, SENSOR_RELATION_TYPES.WITHIN_3]);
});

test("guided tutorial and authored board contracts remain consistent", () => {
  const level6 = getLevelDefinitions().find((level) => level.id === "sensor-barrier-branch");
  const demoStep = level6.tutorialSteps.find((step) => step.id === "level-6-generic-sensor");
  assert.match(demoStep.demoBlocklyXml, /battlegorithms_if_sensor_matches_else/);
  assert.equal(demoStep.demoTitle, "Example sensor branch");

  const level4 = getLevelDefinitions().find((level) => level.id === "barrier-detour");
  assert.deepEqual(level4.winCondition.targetCell, { x: 6, y: 4 });
  assert.ok(level4.toolboxBlockTypes.includes(BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE));

  const moveTowardLevel = getLevelDefinitions().find((level) => level.id === "move-toward-flag");
  assert.deepEqual(moveTowardLevel.setupOverrides.flagOverrides[2], { gridX: 11, gridY: 3 });

  const howFarAway = getLevelDefinitions().find((level) => level.id === "how-far-away");
  assert.equal(howFarAway.mapKey, "simpleAisle");
  assert.equal(howFarAway.failureCondition.maxTurns, 17);
  assert.deepEqual(howFarAway.setupOverrides.barriers, [{ gridX: 4, gridY: 4, ownerRunnerId: "strategy_brain_distance_barrier" }]);
  assert.deepEqual(howFarAway.setupOverrides.teams.opponent.runners[0], { slot: "npc1", gridX: 6, gridY: 4 });
  const howFarAwayDemoStep = howFarAway.tutorialSteps.find((step) => step.demoBlocklyXml);
  assert.ok(howFarAwayDemoStep, "how-far-away should include a demo Blockly step");
  assert.match(howFarAwayDemoStep.demoBlocklyXml, /battlegorithms_if_boolean_else/);
  assert.match(howFarAwayDemoStep.demoBlocklyXml, /battlegorithms_boolean_sensor_matches/);
  assert.match(howFarAwayDemoStep.demoCaption || "", /pieces|sensor/i);
});

test("level 12 reference route requires both horizontal and vertical movement", () => {
  const { app } = runGuidedLevelWithSolution("bring-it-home", GUIDED_LEVEL_REFERENCE_SOLUTIONS["bring-it-home"]);
  const allyHistory = app.state.runnerActionHistory["runner_1_AI_AllyP1"] || [];
  assert.ok(allyHistory.includes(AI_ACTION_TYPES.MOVE_FORWARD));
  assert.ok(allyHistory.includes(AI_ACTION_TYPES.MOVE_UP_SCREEN));
});

test("level 20 authored setup keeps the midfield enemy as an NPC runner", () => {
  const app = createApp();
  initializeLevelState(app);
  Object.keys(app.state.levelProgress).forEach((levelId) => {
    app.state.levelProgress[levelId] = LEVEL_STATUS.PASSED;
  });
  app.state.levelProgress["freeze-the-lane"] = LEVEL_STATUS.AVAILABLE;
  startLevel(app, "freeze-the-lane");

  const laneEnemy = app.state.allRunners.find((runner) => runner.id === "runner_2_Npc1");
  assert.equal(laneEnemy.isNPC, true);
  assert.equal(laneEnemy.runnerRole, "npc");
});

test("generic sensing authored levels keep their support targets open", () => {
  const findTheHuman = getLevelDefinitions().find((entry) => entry.id === "find-the-human");
  assert.deepEqual(findTheHuman.winCondition.targetCell, { x: 5, y: 2 });
  const humanSetup = findTheHuman.setup.teams.player.runners.find((runner) => runner.slot === "human");
  assert.equal(humanSetup.gridX, 6);
  assert.equal(humanSetup.gridY, 2);
  assert.ok(findTheHuman.setup.barriers.some((barrier) => barrier.gridX === 7 && barrier.gridY === 2));

  // Anti-spoiler demo strategy: demo exists but doesn't solve the level
  assert.ok(findTheHuman.sensorRelationTypes.includes("ANYWHERE_FORWARD"), "Level should expose directional relations");
  const demoStep = findTheHuman.tutorialSteps.find((step) => step.demoBlocklyXml);
  assert.ok(demoStep, "find-the-human should have a demo step");
  assert.ok(!demoStep.demoBlocklyXml.includes("HUMAN_RUNNER"), "Demo should not reveal the target object");
  assert.match(demoStep.demoCaption || "", /example|different object/i);

  const relayRace = getLevelDefinitions().find((entry) => entry.id === "relay-race");
  assert.equal(relayRace.humanTurnBehavior, HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT);
  assert.equal(relayRace.winCondition.type, "relay_support_after_teammate_has_flag");
  assert.deepEqual(relayRace.winCondition.stagingCell, { x: 4, y: 0 });
  const relayHuman = relayRace.setup.teams.player.runners.find((runner) => runner.slot === "human");
  const relayAlly = relayRace.setup.teams.player.runners.find((runner) => runner.slot === "ally");
  assert.equal(relayHuman.gridX, 1);
  assert.equal(relayHuman.gridY, 4);
  assert.equal(Boolean(relayHuman.hasEnemyFlag), false);
  assert.equal(relayAlly.gridX, 4);
  assert.equal(relayAlly.gridY, 5);
});

test("guided levels unlock sequentially when completed", () => {
  const app = createApp();
  initializeLevelState(app);

  // Manually advance progress so sensor-barrier-branch is the next unlocked level
  app.state.levelProgress["move-to-target"] = LEVEL_STATUS.PASSED;
  app.state.levelProgress["reach-enemy-flag"] = LEVEL_STATUS.PASSED;
  app.state.levelProgress["score-a-point"] = LEVEL_STATUS.PASSED;
  app.state.levelProgress["barrier-detour"] = LEVEL_STATUS.PASSED;
  app.state.levelProgress["mirror-forward"] = LEVEL_STATUS.PASSED;
  app.state.levelProgress["sensor-barrier-branch"] = LEVEL_STATUS.AVAILABLE;

  startLevel(app, "sensor-barrier-branch");
  completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met");
  assert.equal(app.state.levelProgress["watch-the-wall"], LEVEL_STATUS.AVAILABLE, "completing sensor-barrier-branch should unlock watch-the-wall");

  startLevel(app, "watch-the-wall");
  completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met");
  assert.equal(app.state.levelProgress["find-the-human"], LEVEL_STATUS.AVAILABLE, "completing watch-the-wall should unlock find-the-human");
});

test("generic sensing authored levels place target cells with no runner blocking them at runtime", () => {
  const app = createApp();
  initializeLevelState(app);

  // Advance progress enough to reach find-the-human and relay-race
  Object.keys(app.state.levelProgress).forEach((id) => {
    app.state.levelProgress[id] = LEVEL_STATUS.PASSED;
  });
  app.state.levelProgress["find-the-human"] = LEVEL_STATUS.AVAILABLE;

  startLevel(app, "find-the-human");
  assert.equal(
    app.state.allRunners.find((runner) => runner.gridX === 5 && runner.gridY === 2),
    undefined,
    "find-the-human target cell (5,2) must not be occupied by a runner at level start"
  );

  startLevel(app, "relay-race");
  assert.equal(
    app.state.allRunners.find((runner) => runner.gridX === 4 && runner.gridY === 0),
    undefined,
    "relay-race staging cell (4,0) must not be occupied by a runner at level start"
  );
});

test("guided level manifest provides a lightweight sanity check of the campaign", async () => {
  const { GUIDED_LEVEL_MANIFEST } = await import("../../src/config/levels/manifest.js");
  const levels = getLevelDefinitions();

  assert.equal(GUIDED_LEVEL_MANIFEST.length, levels.length);
  assert.equal(GUIDED_LEVEL_MANIFEST[0].id, "move-to-target");
  assert.equal(GUIDED_LEVEL_MANIFEST.at(-2).id, "optional-random-lab");
  assert.equal(GUIDED_LEVEL_MANIFEST.at(-1).id, "optional-double-carrier-showdown");
  assert.equal(GUIDED_LEVEL_MANIFEST[15].id, "bughunt-15");
  assert.ok(GUIDED_LEVEL_MANIFEST[16].title.startsWith("Challenge 15"));
});

test("challenge metadata is preserved on the authored synthesis levels and surfaced in the manifest", async () => {
  const levels = getLevelDefinitions();
  const { GUIDED_LEVEL_MANIFEST } = await import("../../src/config/levels/manifest.js");

  for (const levelId of ["dodge-and-deliver", "show-what-you-know", "full-team-tactics", "advanced-scrimmage"]) {
    const level = levels.find((entry) => entry.id === levelId);
    const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId);
    assert.equal(level.levelKind, "challenge", `${levelId} should be marked as a challenge level`);
    assert.equal(manifestEntry.levelKind, "challenge", `${levelId} should expose challenge metadata in the manifest`);
  }

  const ordinaryLevel = levels.find((entry) => entry.id === "move-to-target");
  const ordinaryManifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === "move-to-target");
  assert.notEqual(ordinaryLevel.levelKind, "challenge");
  assert.notEqual(ordinaryManifestEntry.levelKind, "challenge");
});

test("project metadata is preserved on the authored project levels and surfaced in the manifest", async () => {
  const levels = getLevelDefinitions();
  const { GUIDED_LEVEL_MANIFEST } = await import("../../src/config/levels/manifest.js");

  const strategyBrainIds = ["closest-threat", "how-far-away", "two-conditions-at-once", "this-or-that", "flip-the-answer", "full-team-tactics"];
  strategyBrainIds.forEach((levelId, index) => {
    const level = levels.find((entry) => entry.id === levelId);
    const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId);
    assert.equal(level.project.id, "strategy-brain", `${levelId} should belong to Strategy Brain`);
    assert.equal(level.project.step, index + 1, `${levelId} should have the expected project step`);
    assert.equal(manifestEntry.project.id, "strategy-brain", `${levelId} should expose Strategy Brain metadata in the manifest`);
  });
  assert.equal(levels.find((entry) => entry.id === "closest-threat").project.isStart, true);
  assert.equal(levels.find((entry) => entry.id === "full-team-tactics").project.isCapstone, true);

  const teamStrategyIds = ["one-program-two-allies", "index-jobs", "first-two-defend", "escort-the-carrier", "closest-enemy-defender", "freeze-support", "barrier-specialist", "jump-team", "advanced-scrimmage"];
  teamStrategyIds.forEach((levelId, index) => {
    const level = levels.find((entry) => entry.id === levelId);
    const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId);
    assert.equal(level.project.id, "team-strategy-script", `${levelId} should belong to Team Strategy Script`);
    assert.equal(level.project.step, index + 1, `${levelId} should have the expected project step`);
    assert.equal(manifestEntry.project.id, "team-strategy-script", `${levelId} should expose Team Strategy Script metadata in the manifest`);
  });
  assert.equal(levels.find((entry) => entry.id === "one-program-two-allies").project.isStart, true);
  assert.equal(levels.find((entry) => entry.id === "advanced-scrimmage").project.isCapstone, true);
  assert.equal(levels.find((entry) => entry.id === "barrier-specialist").failureCondition.maxTurns, 13);
  assert.equal(levels.find((entry) => entry.id === "jump-team").failureCondition.maxTurns, 15);

  assert.equal(levels.find((entry) => entry.id === "show-what-you-know").project, null);
  assert.equal(GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === "show-what-you-know").project, null);
});

test("guided toolbox allowlists keep recent-state free-play booleans out of every guided level", () => {
  const app = { state: { currentModeView: GAME_VIEW_MODES.GUIDED_LEVELS } };
  const offendingLevels = getLevelDefinitions()
    .filter((level) => {
      const toolboxBlockTypes = getToolboxBlockTypesForMode(app, level);
      return (
        toolboxBlockTypes.includes(BLOCK_TYPES.BOOLEAN_LAST_MOVE_BLOCKED) ||
        toolboxBlockTypes.includes(BLOCK_TYPES.BOOLEAN_NOT_MOVED_FOR) ||
        toolboxBlockTypes.includes(BLOCK_TYPES.BOOLEAN_STUCK_FOR)
      );
    })
    .map((level) => level.id);

  assert.deepEqual(offendingLevels, []);
});
