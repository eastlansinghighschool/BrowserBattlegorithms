import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "find-the-enemy-flag",
  title: "Level 9: Find the Enemy Flag",
  description: "The enemy flag waits ahead and above.",
  introText: "The sensor can watch the enemy flag, too. Guide the ally to the flag at the far side of the field.",
  tips: [
    "The enemy flag is the object to watch.",
    "The relation menu describes the flag's position from the ally.",
    "Runners and flags can both appear in the sensor menu."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_FLAG,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
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
      title: "Watch The Enemy Flag",
      body: "The sensor can watch the enemy flag. Its relation menu describes where the flag is from the ally.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-9-reuse",
      title: "Follow The Clues",
      body: "As the ally moves, the flag can shift from above to directly ahead. Keep checking where it is.",
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
