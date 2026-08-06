import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "human-runner-practice",
  title: "Level 10: Human Runner Practice",
  description: "Drive the human runner to the goal, but use Jump or Place Barrier first.",
  introText: "You are driving this runner. Use the keyboard, try Jump or Place Barrier, then head for the goal.",
  tips: [
    "Use W A S D to move the human runner.",
    "Press F to jump, B to place a barrier, and X to stay still.",
    "The goal counts only after Jump or Place Barrier.",
    "Leave the program alone for this run; your keys drive the human runner."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT,
  toolboxBlockTypes: [...BASIC_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell_after_action",
    runnerId: "runner_1_HumanP1",
    targetCell: { x: 4, y: 4 },
    actionTypes: [
      "JUMP_FORWARD",
      "PLACE_BARRIER_FORWARD",
    ]
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 200
  },
  // S12 fully protected human-runner level: pass-star-only.
  tutorialSteps: [
    {
      id: "level-10-human-focus",
      title: "You Drive This Runner",
      body: "The human runner is yours this round. The ally is frozen while you try the match controls.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-10-human-keys",
      title: "Keyboard Controls",
      body: "Use W A S D to move. Press F to jump, B to place a barrier, and X to stay still.",
      targetSelector: "#instructions"
    },
    {
      id: "level-10-human-special",
      title: "Try A Special Action First",
      body: "The goal counts only after you use Jump or Place Barrier. Reaching it first does not count yet.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 4 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 1, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 2, gridY: 4, ownerRunnerId: "level_human_barrier_1" }
    ]
  }
};
