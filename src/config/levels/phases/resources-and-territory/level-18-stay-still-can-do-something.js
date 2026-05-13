import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, STAY_STILL_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "stay-still-can-do-something",
  title: "Level 18: Stay Still Can Do Something",
  description: "Use Stay Still to remove a barrier that is directly in front of the ally.",
  introText: "Stay Still is not just a do-nothing block. When a barrier is in front, it can change the board by clearing that obstacle.",
  tips: [
    "If a barrier is directly in front, Stay Still removes it.",
    "After the barrier is gone, the ally can continue moving.",
    "This is a good level for combining sensing with a non-movement action."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [SENSOR_OBJECT_TYPES.BARRIER],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 4, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 8
  },
  tutorialSteps: [
    {
      id: "level-17-stay-still",
      title: "Stay Still Can Change The Board",
      body: "If a barrier is directly ahead, Stay Still removes it. This is one of the first times that not moving is the smart move.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: STAY_STILL_DEMO_XML,
      demoTitle: "Example removal program",
      demoCaption: "This sensor branch uses an object and relation that are not available in this level. The structure is the same one you need — fill in the correct object and relation, and choose what action makes sense in each branch."
    },
    {
      id: "level-17-after-removal",
      title: "Then Keep Going",
      body: "Once the barrier is gone, the ally can go back to its normal path.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 2, gridY: 4, ownerRunnerId: "level_remove_barrier_1" }
    ]
  }
};
