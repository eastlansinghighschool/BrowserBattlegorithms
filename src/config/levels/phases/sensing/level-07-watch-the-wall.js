import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "watch-the-wall",
  title: "Level 7: Watch the Wall",
  description: "Use the generic sensor to detect an edge or wall and steer around it.",
  introText: "The same sensor family can notice map walls too, not just placed barriers.",
  tips: [
    "Edge or wall is a beginner-friendly sensing target in this phase.",
    "This map uses real wall cells instead of a temporary barrier.",
    "You still only get one move each ally turn."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "complex",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [SENSOR_OBJECT_TYPES.EDGE_OR_WALL],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT],
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
  tutorialSteps: [
    {
      id: "level-7-wall",
      title: "Walls Count Too",
      body: "The Edge or Wall option can notice map geometry. Here, the ally needs to react to wall cells in the way.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-7-relation",
      title: "Relation Means How The Object Is Positioned",
      body: "The relation dropdown tells the sensor what kind of position to check. This level uses directly in front.",
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
