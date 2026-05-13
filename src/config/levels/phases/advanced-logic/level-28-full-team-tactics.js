import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, AREA_FREEZE_BLOCKS, TERRITORY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "full-team-tactics",
  levelKind: "challenge",
  title: "Challenge 28: Full Team Tactics",
  description: "Score a point against live defenders using your complete single-ally toolkit.",
  introText: "One last single-ally challenge before team programming begins. Two defenders are active.",
  tips: [
    "You have the full single-ally toolkit — sensing, territory, NOT, freeze, barriers, and more.",
    "Think about which tools matter most when an enemy is nearby.",
    "The next level changes everything — two allies will share one program."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 6, { isCapstone: true }),
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
    SENSOR_OBJECT_TYPES.ENEMY_FLAG
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.WITHIN_2,
    SENSOR_RELATION_TYPES.WITHIN_3,
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 20 },
  tutorialSteps: [
    {
      id: "full-team-tactics-last-solo",
      title: "One Last Solo Challenge",
      body: "This is a real game situation with two active defenders. Use any part of your single-ally toolkit to score.",
      targetSelector: "#canvas-container"
    },
    {
      id: "full-team-tactics-next",
      title: "What Comes Next",
      body: "You have written programs that sense, decide, and use special actions. The next challenge asks you to do this for two allies at once — using the same program.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 11, gridY: 1 }, { slot: "npc2", gridX: 11, gridY: 6 }] }
    },
    flags: { opponent: { gridX: 9, gridY: 4 } }
  }
};
