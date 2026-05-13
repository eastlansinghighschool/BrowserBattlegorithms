import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, BARRIER_DETOUR_DEMO_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "barrier-detour",
  title: "Level 4: Barrier Detour",
  description: "Notice the obstacle ahead and choose a detour.",
  introText: "The direct lane is blocked. This is the first time the ally needs to look at the board and react instead of repeating the same move forever.",
  legendItems: [
    { emoji: "🚧", label: "Barrier", description: "This obstacle blocks the lane directly ahead." }
  ],
  tips: [
    "The obstacle in front of the ally is intentional.",
    "Think about what should happen when the path is blocked and when it is clear.",
    "You still only get one action each ally turn."
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
      body: "Straight ahead no longer works. The ally needs to notice the obstacle and choose another move.",
      targetSelector: "#canvas-container",
      visualItems: [
        { emoji: "🚧", label: "Barrier", description: "A barrier blocks movement through that square." }
      ]
    },
    {
      id: "level-4-condition",
      title: "Use A Board Check",
      body: "The new barrier condition lets your program ask whether the path ahead is blocked. That helps the ally decide when it should detour.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: BARRIER_DETOUR_DEMO_XML,
      demoTitle: "Pattern preview",
      demoCaption: "An if/else block runs the DO branch when its condition is true and the ELSE branch when it is false — the same two-path structure you will use here."
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
