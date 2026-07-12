import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "move-to-target",
  title: "Level 1: Move to Target",
  description: "The highlighted square is waiting. Can your ally reach it?",
  introText: "The ally waits on the left. Enemy runners stand frozen on this quiet practice board. Guide your runner to the highlighted target square.",
  legendItems: [
    { emoji: "🏃🏿‍♂️", label: "Ally runner", description: "This is the runner your program controls." },
    { emoji: "🏃", label: "Enemy runner", description: "These runners belong to the other team." },
    { emoji: "⭕", label: "Target square", description: "Reach this highlighted square to clear the level." }
  ],
  tips: [
    "Only the ally runner needs to reach the target.",
    "Your program runs each time the ally gets a turn.",
    "Need another look? Show Tutorial is still here."
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
      body: "A grid, two teams, one highlighted square. Your ally starts on the left; the frozen enemy runners stand on the right.",
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
      body: "The enemy runners are frozen. They will not move while you practice the first route.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-1-event",
      title: "Start With On Each Turn",
      body: "Start with On Each Turn. Blocks connected below it run when the ally takes a turn. The target is waiting.",
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
