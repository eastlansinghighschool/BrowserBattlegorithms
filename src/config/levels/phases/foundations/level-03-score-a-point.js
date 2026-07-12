import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, SCORE_SWITCH_DEMO_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "score-a-point",
  title: "Level 3: Score a Point",
  description: "The enemy flag must come home.",
  introText: "The ally has two jobs: reach the enemy flag, then bring it home.",
  legendItems: [
    { emoji: "🏳️", label: "Enemy flag", description: "Pick up the enemy flag first." },
    { emoji: "🚩", label: "Home side", description: "Bring the enemy flag back here to score." }
  ],
  tips: [
    "The point comes when the ally returns with the enemy flag.",
    "Watch for the moment the flag changes hands.",
    "The enemy runners stay frozen, leaving the route clear."
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
      title: "The Flag Changes The Job",
      body: "Reaching the enemy flag starts the return trip. The ally must carry it home.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-3-condition",
      title: "Watch The Flag",
      body: "The flag check tells the program when the ally is carrying. Use that change to think about the next action.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: SCORE_SWITCH_DEMO_XML,
      demoTitle: "One Question, Two Paths",
      demoCaption: "An if/else asks a question, then chooses a path for each answer. The demo uses another condition."
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
