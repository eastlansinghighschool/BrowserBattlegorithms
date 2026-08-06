import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, FIND_HUMAN_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "find-the-human",
  title: "Level 8: Find the Human",
  description: "The marked support square waits beside the human runner.",
  introText: "The human runner is ahead and above the ally. Guide the ally to the highlighted square beside them.",
  tips: [
    "The human runner is the object to watch.",
    "The highlighted support square beside the human is the goal, not the occupied cell.",
    "Describe the human's position from the ally's point of view.",
    "More than one check may help the ally reach the support square."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
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
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 5, y: 2 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 10
  },
  // 2-star max: directional sensing is concept-mandatory.
  starCriteria: {
    turnPar: 9
  },
  tutorialSteps: [
    {
      id: "level-8-human",
      title: "Find The Human",
      body: "The sensor can watch the human runner and ask whether they are forward, behind, above, or below. The marked support square beside them is the goal.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: FIND_HUMAN_DEMO_XML,
      demoTitle: "A Direction Question",
      demoCaption: "This example uses a different object. Notice its two menus: what to watch and where to look."
    },
    {
      id: "level-8-axes",
      title: "Two Directions",
      body: "Forward and behind follow the ally's facing. Above and below follow the screen.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 6, gridY: 2 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 5 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 6, gridY: 1, ownerRunnerId: "level_find_human_barrier_1" },
      { gridX: 7, gridY: 2, ownerRunnerId: "level_find_human_barrier_2" },
      { gridX: 6, gridY: 3, ownerRunnerId: "level_find_human_barrier_3" }
    ]
  }
};
