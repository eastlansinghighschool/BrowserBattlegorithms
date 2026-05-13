import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, AREA_FREEZE_BLOCKS, TERRITORY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "show-what-you-know",
  levelKind: "challenge",
  title: "Challenge 22: Show What You Know",
  description: "Score a point against live defenders using any tool you have learned so far.",
  introText: "No new tools this time. Two enemies are active. Use what you know to score.",
  tips: [
    "You have movement, sensing, flag state, helper blocks, barriers, jumping, and freeze.",
    "There is more than one way to win — experiment with what you have.",
    "Freeze is a team power that can give you a window to act."
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
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 24 },
  tutorialSteps: [
    {
      id: "show-what-you-know-challenge",
      title: "No New Tools",
      body: "This level does not introduce anything new. Two enemies are active and you need to score a point — use any combination of what you have already learned.",
      targetSelector: "#canvas-container"
    },
    {
      id: "show-what-you-know-strategy",
      title: "Think Like A Programmer",
      body: "There is no single right program. Think about what conditions matter, what actions respond to them, and what your ally should do when the situation changes.",
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
