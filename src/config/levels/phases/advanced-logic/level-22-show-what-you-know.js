import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, AREA_FREEZE_BLOCKS, TERRITORY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "show-what-you-know",
  levelKind: "challenge",
  title: "Challenge 22: Show What You Know",
  description: "Score against live defenders holding the far side.",
  introText: "Two defenders patrol the outer lanes while a third holds the middle. Reach their flag and bring it home.",
  tips: [
    "The toolbox holds the tools you have earned: sensing, helpers, barriers, jumping, and freeze.",
    "Watch the lanes first. More than one route can work.",
    "Freeze can buy a short opening when a defender closes in."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
    BLOCK_TYPES.IF_BARRIER_IN_FRONT,
    BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE,
    ...GENERIC_SENSOR_BLOCKS,
    ...MOVE_TOWARD_BLOCKS,
    ...JUMP_CONDITION_BLOCKS,
    ...JUMP_BLOCKS,
    ...BARRIER_PLACEMENT_BLOCKS,
    ...BARRIER_READY_BLOCKS,
    ...AREA_FREEZE_BLOCKS,
    ...TERRITORY_BLOCKS,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.BARRIER,
    SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
    SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
    SENSOR_OBJECT_TYPES.ENEMY_FLAG,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [
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
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 56 },
  tutorialSteps: [
    {
      id: "show-what-you-know-challenge",
      title: "Read The Field",
      body: "The outer lanes have moving defenders, and one runner holds the middle. Your ally needs a route to the far flag and back.",
      targetSelector: "#canvas-container"
    },
    {
      id: "show-what-you-know-strategy",
      title: "Make A Field Plan",
      body: "Notice what changes near each defender, at the flag, and on the trip home. Build rules your ally can use when the field changes.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 7, gridY: 2, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL },
          { slot: "npc2", gridX: 8, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_STAY_STILL },
          { slot: "npc3", gridX: 9, gridY: 7, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL }
        ]
      }
    },
    flags: { opponent: { gridX: 11, gridY: 4 } }
  }
};
