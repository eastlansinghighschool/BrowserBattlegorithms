import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, BARRIER_DETOUR_DEMO_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "barrier-detour",
  title: "Level 4: Barrier Detour",
  description: "A barrier blocks the direct lane.",
  introText: "The direct lane ends at a barrier. Read the space ahead before the ally moves.",
  legendItems: [
    { emoji: "🚧", label: "Barrier", description: "This obstacle blocks the lane directly ahead." }
  ],
  tips: [
    "The barrier is directly in front of the ally.",
    "Watch what changes when the lane is blocked or clear.",
    "One action runs on each ally turn."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_BARRIER_IN_FRONT,
    BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 6, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  tutorialSteps: [
    {
      id: "level-4-barrier",
      title: "A Barrier Blocks The Lane",
      body: "The space directly ahead is blocked. The ally must notice that barrier before choosing a move.",
      targetSelector: "#canvas-container",
      visualItems: [
        { emoji: "🚧", label: "Barrier", description: "A barrier blocks movement through that square." }
      ]
    },
    {
      id: "level-4-condition",
      title: "Ask About The Space Ahead",
      body: "The barrier check asks whether the space ahead is blocked. Use its two paths to handle the blocked and open lane.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: BARRIER_DETOUR_DEMO_XML,
      demoTitle: "Two Paths",
      demoCaption: "The demo shows an if/else with a different condition. Notice how its two branches answer the same board question."
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 3 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    barriers: [
      { gridX: 2, gridY: 3, ownerRunnerId: "level_barrier_1" }
    ]
  }
};
