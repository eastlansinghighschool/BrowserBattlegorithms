import { GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS, MECHANIC_NECESSITY } from "../../../constants.js";
import { STARTER_EVENT_XML, JUMP_IF_READY_DEMO_XML } from "../../shared/blocklyXml.js";
import { JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "jump-if-ready",
  title: "Level 16: Jump If Ready",
  description: "One jump is waiting in the lane. What should the ally notice before it spends it?",
  introText: "A Charger guards the lane. The ally's jump is ready now; after it is spent, watch where the Charger stands.",
  tips: [
    "The jump is ready at the start.",
    "What will the ally notice after it is spent?",
    "Trace the lane before you choose a branch."
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
      title: "A Resource With A Limit",
      body: "The jump check changes when the ally spends its jump. Watch the state change, then decide what the next turn needs.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: JUMP_IF_READY_DEMO_XML,
      demoTitle: "A Ready Check",
      demoCaption: "This example watches a resource that is not the jump. Look at the question it asks, not the actions it chooses."
    },
    {
      id: "level-15-resource",
      title: "When The Jump Is Gone",
      body: "After the jump is spent, the Charger may be in a new spot. Read the lane again before choosing.",
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
