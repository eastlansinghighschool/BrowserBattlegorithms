import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "find-the-enemy-flag",
  title: "Level 9: Find the Enemy Flag",
  description: "Use directional sensing to guide the ally to the enemy flag.",
  introText: "The same sensing pattern can point at goals like the enemy flag, not just runners.",
  tips: [
    "This time the target is the enemy flag instead of the human runner.",
    "The relation dropdown still describes the flag's position relative to the ally.",
    "Notice how the same sensor idea can shift from runners to goals."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [SENSOR_OBJECT_TYPES.ENEMY_FLAG],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_enemy_flag",
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  tutorialSteps: [
    {
      id: "level-9-flag-sensor",
      title: "Sense The Flag's Position",
      body: "The sensor block can also look for the enemy flag. Use the same forward, behind, above, and below ideas to steer toward it.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-9-reuse",
      title: "Reusable Thinking",
      body: "You are reusing the same condition pattern on a different object. That is a big step toward more flexible programs.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 6 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 10, gridY: 3 }
    }
  }
};
