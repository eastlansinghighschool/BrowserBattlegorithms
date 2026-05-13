import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "move-to-target",
  title: "Level 1: Move to Target",
  description: "Guide your ally runner to the highlighted target square.",
  introText: "This first level is a quiet practice board. Your block program controls the ally runner, and the other runners stay still so you can focus on one simple goal.",
  legendItems: [
    { emoji: "🏃🏿‍♂️", label: "Ally runner", description: "This is the runner your program controls." },
    { emoji: "🏃", label: "Enemy runner", description: "These runners belong to the other team." },
    { emoji: "⭕", label: "Target square", description: "Reach this highlighted square to clear the level." }
  ],
  tips: [
    "Only the ally runner needs to reach the target.",
    "Your program runs each time the ally gets a turn.",
    "If you ever want the lesson again, use Show Tutorial."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...BASIC_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 4, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 8
  },
  tutorialSteps: [
    {
      id: "level-1-board",
      title: "Meet The Board",
      body: "The board is a grid of spaces. Your ally runner starts on the left, the enemy runners are on the right, and the highlighted square is today’s goal.",
      targetSelector: "#canvas-container",
      visualItems: [
        { emoji: "🏃🏿‍♂️", label: "Ally runner", description: "Your code will decide what this runner does." },
        { emoji: "🏃", label: "Enemy runners", description: "They are here as board pieces, but they will not move in this first lesson." },
        { emoji: "⭕", label: "Target", description: "Reach this square to pass." }
      ]
    },
    {
      id: "level-1-frozen",
      title: "Frozen Means Staying Still",
      body: "In this lesson, the enemy runners are frozen. That simply means they will not move while you practice the basics.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-1-event",
      title: "Start With On Each Turn",
      body: "Every ally program begins with the On Each Turn block. Any blocks connected below it will run each time your ally takes a turn. The goal square is waiting — what would you tell the ally to do?",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 1, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
