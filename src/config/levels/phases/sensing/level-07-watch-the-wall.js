import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "watch-the-wall",
  title: "Level 7: Watch the Wall",
  description: "Walls close off parts of this map.",
  introText: "A wall is directly ahead of the ally. This sensor can watch the map itself, not only runners or barriers.",
  tips: [
    "The Edge or Wall option watches map walls and edges.",
    "The wall ahead is part of the map, not a placed barrier.",
    "One action runs on each ally turn."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "complex",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 5, y: 5 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 10
  },
  // 2-star max: wall sensing is concept-mandatory.
  starCriteria: {
    turnPar: 7
  },
  tutorialSteps: [
    {
      id: "level-7-wall",
      title: "Walls Count Too",
      body: "The Edge or Wall option notices the map's walls and edges. This lane has a wall directly ahead.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-7-relation",
      title: "Describe Where It Is",
      body: "The relation menu says where to look. Here, look directly in front of the ally.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 2, gridY: 3 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
