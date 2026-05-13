import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "human-runner-practice",
  title: "Level 10: Human Runner Practice",
  description: "Use the human runner controls, then reach the goal only after you use Jump or Place Barrier first.",
  introText: "This level is about you, not the ally program. Move the human runner with the keyboard and use Jump or Place Barrier before reaching the goal.",
  tips: [
    "Use W A S D to move the human runner on screen.",
    "Press F to jump, B to place a barrier, and X to stay still.",
    "The goal only counts after you have used Jump or Place Barrier first.",
    "The program panel stays on screen, but this lesson is about direct player control."
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
  tutorialSteps: [
    {
      id: "level-10-human-focus",
      title: "Now You Control The Human Runner",
      body: "This lesson pauses the ally idea for a moment so you can practice what the human runner does in the match.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-10-human-keys",
      title: "Keyboard Controls",
      body: "Use W A S D to move. Press F to jump, B to place a barrier, and X to stay still. In free play, these human actions happen alongside your ally program.",
      targetSelector: "#instructions"
    },
    {
      id: "level-10-human-special",
      title: "Try One Special Action First",
      body: "This challenge only passes if you reach the goal after you use Jump or Place Barrier first. Reaching the goal without one of those actions does not count yet.",
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
