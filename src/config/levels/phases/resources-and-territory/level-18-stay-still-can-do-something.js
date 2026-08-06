import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS } from "../../../constants.js";
import { STARTER_EVENT_XML, STAY_STILL_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "stay-still-can-do-something",
  title: "Level 18: Stay Still Can Do Something",
  description: "Clear the barrier blocking the ally's path.",
  introText: "A barrier blocks the ally's lane. Stay Still can change the board when the barrier is directly ahead.",
  tips: [
    "Look directly ahead for the barrier.",
    "When it is gone, the route opens again.",
    "The pause can be the move that changes the lane."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.BARRIER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 4, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 8
  },
  // 2-star max: stay still action is concept-mandatory.
  starCriteria: {
    turnPar: 6
  },
  tutorialSteps: [
    {
      id: "level-17-stay-still",
      title: "Still Can Mean Action",
      body: "When the barrier is directly ahead, Stay Still clears it. Read the board before choosing the next action.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: STAY_STILL_DEMO_XML,
      demoTitle: "Example removal program",
      demoCaption: "The sample uses a different sensor and relation. Notice the barrier in front, then decide what each path should do."
    },
    {
      id: "level-17-after-removal",
      title: "Then Continue",
      body: "Once the barrier is clear, the ally can return to the route.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 2, gridY: 4, ownerRunnerId: "level_remove_barrier_1" }
    ]
  }
};
