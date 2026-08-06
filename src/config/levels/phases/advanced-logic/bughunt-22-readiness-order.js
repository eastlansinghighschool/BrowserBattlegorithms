import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { BUGHUNT_22_STARTER_XML } from "../../shared/bugHuntXml.js";
import { BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "bughunt-22",
  levelKind: "bug_hunt",
  title: "Bug Hunt: First Action Matters",
  description: "A stray move is crowding out the barrier order.",
  introText: "The marked square needs a barrier, but a move is getting in the way. Trace which action reaches the runner first.",
  tips: [
    "Only the first action reached on a turn runs, so a move block can hide everything after it.",
    "The barrier branch is already on the board. Find out what stops the runner from reaching it.",
    "Keep the repair small. Change only the part that blocks the barrier order."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...BARRIER_PLACEMENT_BLOCKS, ...BARRIER_READY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: BUGHUNT_22_STARTER_XML,
  winCondition: { type: "barrier_exists_at_cell", targetCell: { x: 4, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
  // 2-star max: first action order repair.
  starCriteria: {
    turnPar: 3
  },
  tutorialSteps: [
    {
      id: "bughunt-22-trace",
      title: "Trace The Top Of The Stack",
      body: "Ask which action the runner reaches before it can consider the barrier branch.",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-22-order",
      title: "Put The Check First",
      body: "The marked square is waiting. Repair the order so the barrier branch gets its turn.",
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
