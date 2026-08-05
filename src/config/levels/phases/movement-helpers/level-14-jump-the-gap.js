import { GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "jump-the-gap",
  title: "Level 14: Jump the Gap",
  // Complexity-protected level (charter S12, Plan 85): dynamics and copy may
  // change, but win condition and lesson shape stay fixed. NPC1 becomes a
  // Sentry (background motion) on the far side of the wall from the jump
  // lane (x=1-3); its vertical patrol column (x=10) never enters that lane.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION,
  // no honest criterion — 2-star max (concept mandatory per simulation evidence, decision log 2026-07-22).
  starCriteria: {
    turnPar: 3
  },
  description: "A wall splits the lane. The goal is on the far side.",
  introText: "Jump Forward can clear the wall, but it only goes ahead and needs open ground to land.",
  tips: [
    "Jump Forward only goes forward.",
    "There is no backward jump in this game.",
    "The landing space still needs to be open.",
    "The wall seals the whole column."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...JUMP_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 3, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 6
  },
  tutorialSteps: [
    {
      id: "level-14-jump",
      title: "Jump Is A One-Time Leap",
      body: "Jump Forward moves two cells ahead and ignores the space in between. You get one jump each round.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-14-no-backward-jump",
      title: "No Backward Jump",
      body: "This game only supports jumping forward. The wall blocks the whole column; check which way the ally faces.",
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
      { gridX: 2, gridY: 0, ownerRunnerId: "level_jump_barrier_1" },
      { gridX: 2, gridY: 1, ownerRunnerId: "level_jump_barrier_2" },
      { gridX: 2, gridY: 2, ownerRunnerId: "level_jump_barrier_3" },
      { gridX: 2, gridY: 3, ownerRunnerId: "level_jump_barrier_4" },
      { gridX: 2, gridY: 4, ownerRunnerId: "level_jump_barrier_5" },
      { gridX: 2, gridY: 5, ownerRunnerId: "level_jump_barrier_6" },
      { gridX: 2, gridY: 6, ownerRunnerId: "level_jump_barrier_7" },
      { gridX: 2, gridY: 7, ownerRunnerId: "level_jump_barrier_8" }
    ]
  }
};
