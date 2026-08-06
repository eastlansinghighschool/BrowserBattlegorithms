import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, SENSOR_BARRIER_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "sensor-barrier-branch",
  title: "Level 6: Enemy Sensor Branch",
  description: "A frozen enemy runner blocks the lane.",
  introText: "A frozen enemy runner stands ahead. The sensor's two menus can describe what the ally sees and where it sees it.",
  tips: [
    "Choose the object and its position in the sensor menus.",
    "The frozen enemy runner is directly in front of the ally.",
    "The sensor can watch runners as well as barriers."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
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
    targetCell: { x: 6, y: 3 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  // 2-star max: enemy sensor branch is concept-mandatory.
  starCriteria: {
    turnPar: 8
  },
  tutorialSteps: [
    {
      id: "level-6-generic-sensor",
      title: "Choose What To Watch",
      body: "The sensor has two menus: one names what to watch, the other names where it is. This demo watches a barrier; the lane holds something else.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: SENSOR_BARRIER_DEMO_XML,
      demoTitle: "Example sensor branch",
      demoCaption: "This demo watches a barrier directly ahead. What would you change so this branch watches the frozen runner?"
    },
    {
      id: "level-6-barrier",
      title: "The Frozen Runner",
      body: "A frozen enemy runner stands in the lane ahead. What should the ally notice before choosing a move?",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 4, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
