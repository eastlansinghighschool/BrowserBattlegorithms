import { GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS, MECHANIC_NECESSITY } from "../../../constants.js";
import { STARTER_EVENT_XML, JUMP_IF_READY_DEMO_XML } from "../../shared/blocklyXml.js";
import { JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "jump-if-ready",
  title: "Level 16: Jump If Ready",
  description: "Use a condition so the ally jumps once and then switches back to normal movement.",
  introText: "Conditions can check the runner's resources too. In this level, the ally should jump when it can and walk after the jump has been spent.",
  tips: [
    "Think about what should happen before the jump is spent and after it is gone.",
    "After the jump is used, the condition changes and the else move takes over.",
    "This is your first resource-aware lesson."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...JUMP_CONDITION_BLOCKS, ...JUMP_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT,
  mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 8, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 8
  },
  tutorialSteps: [
    {
      id: "level-15-ready",
      title: "Your Program Can Check What Is Ready",
      body: "The If I Can Jump condition changes based on whether the ally has already spent the jump resource this round. Think about how the ally should behave before the jump is gone, and how that should change after it has been used.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: JUMP_IF_READY_DEMO_XML,
      demoTitle: "Example ready-check program",
      demoCaption: "The condition and actions here are not the ones this level uses. The structure shows how an if/else block checks a resource state and runs a different branch once that resource is gone."
    },
    {
      id: "level-15-resource",
      title: "Resources Can Change During A Match",
      body: "Jump is not permanent. This level teaches how to leap once and then keep walking after the jump resource is gone.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 5, gridY: 4 },
      runner_2_Npc1: { gridX: 6, gridY: 5, cpuBehavior: NPC_BEHAVIORS.GUIDED_CHARGER, chargeRange: 2 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 6, gridY: 0, ownerRunnerId: "level_jump_ready_barrier_1" },
      { gridX: 6, gridY: 1, ownerRunnerId: "level_jump_ready_barrier_2" },
      { gridX: 6, gridY: 2, ownerRunnerId: "level_jump_ready_barrier_3" },
      { gridX: 6, gridY: 3, ownerRunnerId: "level_jump_ready_barrier_4" },
      { gridX: 6, gridY: 6, ownerRunnerId: "level_jump_ready_barrier_7" },
      { gridX: 6, gridY: 7, ownerRunnerId: "level_jump_ready_barrier_8" }
    ]
  }
};
