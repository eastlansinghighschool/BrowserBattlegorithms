import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { BUGHUNT_22_STARTER_XML } from "../../shared/bugHuntXml.js";
import { BARRIER_PLACEMENT_BLOCKS, BARRIER_READY_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "bughunt-22",
  levelKind: "bug_hunt",
  title: "Bug Hunt: First Action Matters",
  description: "A stray action steals the turn before the barrier check can run.",
  introText: "This program already knows how to place a barrier, but one move block sits in front of the real decision. Trace the order, fix the first action, and keep the barrier logic readable.",
  tips: [
    "Only the first action reached on a turn runs, so a move block can hide everything after it.",
    "The barrier check is already there; the bug is that it never gets the chance to run first.",
    "Fixing a bug hunt usually means repairing the smallest broken piece, not rebuilding the whole program."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...BARRIER_PLACEMENT_BLOCKS, ...BARRIER_READY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: BUGHUNT_22_STARTER_XML,
  winCondition: { type: "barrier_exists_at_cell", targetCell: { x: 4, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
  tutorialSteps: [
    {
      id: "bughunt-22-trace",
      title: "Trace The Top Of The Stack",
      body: "The first action is the important one here. Ask what the runner does before the barrier check ever starts.",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-22-order",
      title: "Put The Check First",
      body: "The fix should be small: move the readiness branch back to the front so the barrier action can run before any extra motion.",
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
