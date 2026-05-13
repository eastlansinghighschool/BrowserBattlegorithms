import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "jump-the-gap",
  title: "Level 14: Jump the Gap",
  description: "Use Jump Forward as the one decisive action that clears a wall and lands on the goal side.",
  introText: "This lesson is about a single leap. One Jump Forward should carry the ally over the wall and into the winning lane.",
  tips: [
    "Jump Forward only goes forward.",
    "There is no backward jump in this game.",
    "The landing space still needs to be open.",
    "This level is about noticing what one jump can do, not writing a long program."
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
      body: "Jump Forward moves two cells ahead and ignores the space in between, but you only get one jump each round. For this lesson, a single jump block is enough.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-14-no-backward-jump",
      title: "No Backward Jump",
      body: "This game only supports jumping forward. The wall blocks the whole column, so the dramatic move here is to leap straight across it.",
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
