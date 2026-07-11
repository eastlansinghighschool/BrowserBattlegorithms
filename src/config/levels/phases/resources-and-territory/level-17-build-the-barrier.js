import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "build-the-barrier",
  title: "Level 17: Build the Barrier",
  description: "Place a barrier in the marked square ahead of the ally.",
  introText: "The ally can place one barrier. Watch the open square in front and whether the action is available.",
  tips: [
    "The barrier belongs in the highlighted square.",
    "Place Barrier acts on the square directly ahead.",
    "A runner can keep only one active barrier."
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
      title: "Place The Barrier",
      body: "This action creates a barrier in the square directly ahead of the runner if that space is open.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-16-barrier-ready",
      title: "Is The Space Open?",
      body: "The ready check tells the ally whether barrier placement is still available.",
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
