import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, SCORE_SWITCH_DEMO_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "score-a-point",
  title: "Level 3: Score a Point",
  description: "Bring the enemy flag back home to score a point.",
  introText: "This puzzle has two phases: first go get the enemy flag, then bring it back to your own side.",
  legendItems: [
    { emoji: "🏳️", label: "Enemy flag", description: "Pick up the enemy flag first." },
    { emoji: "🚩", label: "Home side", description: "Bring the enemy flag back here to score." }
  ],
  tips: [
    "Scoring happens when your ally returns with the enemy flag.",
    "Think about how the ally should behave before pickup and after pickup.",
    "The enemy runners are still frozen so the challenge stays focused on scoring."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "team_scores_point",
    teamId: 1,
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 20
  },
  tutorialSteps: [
    {
      id: "level-3-flag",
      title: "Two Jobs In One Puzzle",
      body: "Reaching the enemy flag is only the first half of the job. Your ally then has to carry it all the way back home.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-3-condition",
      title: "A Condition Can Split The Two Phases",
      body: "The new flag check can help the ally change plans once it is carrying the enemy flag. Try to make the program notice when the job changes.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: SCORE_SWITCH_DEMO_XML,
      demoTitle: "Pattern preview",
      demoCaption: "An if/else block runs one branch when a condition is true and the other branch when it is false — the same structure you will use with a different condition here."
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
    }
  }
};
