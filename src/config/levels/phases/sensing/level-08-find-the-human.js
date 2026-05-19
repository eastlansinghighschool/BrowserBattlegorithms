import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, FIND_HUMAN_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "find-the-human",
  title: "Level 8: Find the Human",
  description: "Use directional sensing to move the ally toward the human runner.",
  introText: "Now the sensor can describe where something is on the board, not just whether it is immediately in front.",
  tips: [
    "Use the human runner as the sensed object.",
    "The highlighted support square next to the human is the goal, not the occupied human cell.",
    "Think about how you would describe the human’s position from the ally’s point of view.",
    "You may need more than one check to guide the ally to the support square."
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
  tutorialSteps: [
    {
      id: "level-8-human",
      title: "Use A Sensor To Find The Human",
      body: "The sensor block can now look for the human runner and describe whether that runner is forward, behind, above, or below. Your goal is to guide the ally to the marked support square beside the human.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: FIND_HUMAN_DEMO_XML,
      demoTitle: "Example support-route program",
      demoCaption: "This example sensor branch uses a different object than the one available here. Notice how the block has two dropdowns — one for what to sense and one for where to look."
    },
    {
      id: "level-8-axes",
      title: "Forward And Above Are Different Ideas",
      body: "Forward and behind use the ally's play direction. Above and below still use the screen.",
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
