import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "build-the-barrier",
  title: "Level 17: Build the Barrier",
  description: "Place a barrier in front of the ally to learn how barrier placement works.",
  introText: "Barrier placement is another one-time resource. This level focuses on what the action does and when it is ready.",
  tips: [
    "A runner can only keep one active barrier on the map.",
    "Place Barrier always targets the square directly in front.",
    "The highlighted square shows where the barrier should appear."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...BARRIER_PLACEMENT_BLOCKS, ...BARRIER_READY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "barrier_exists_at_cell",
    targetCell: { x: 4, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 4
  },
  tutorialSteps: [
    {
      id: "level-16-place-barrier",
      title: "Place A Barrier In Front",
      body: "This action creates a barrier in the square directly ahead of the runner if that space is open.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-16-barrier-ready",
      title: "Barrier Placement Has A Ready State",
      body: "The If I Can Place Barrier condition helps the ally know whether that one-time action is still available.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 3, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
