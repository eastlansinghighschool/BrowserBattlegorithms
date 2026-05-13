import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "mirror-forward",
  title: "Level 5: Forward Works Both Ways",
  description: "See that Move Forward follows the runner’s own direction, not the screen.",
  introText: "Forward does not always mean right on the screen. It means moving toward that runner’s goal direction.",
  tips: [
    "The ally starts on the right this time.",
    "Watch the runner, not the screen, to understand what forward means.",
    "This level teaches relative direction before the sensing lessons begin."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...BASIC_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 7, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 6
  },
  tutorialSteps: [
    {
      id: "level-5-mirror",
      title: "Forward Is Relative",
      body: "This ally starts on the opposite side. Forward still works because it follows the runner's own goal direction, not the screen.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-5-forward",
      title: "The Same Block, A Different Facing",
      body: "The same block that worked on the left side of the board applies here too. Think about what forward means for a runner facing the other direction — the board orientation has changed but the concept has not.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 10, gridY: 1, playDirection: -1 },
      runner_1_AI_AllyP1: { gridX: 10, gridY: 4, playDirection: -1 },
      runner_2_Npc1: { gridX: 1, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999, playDirection: 1 },
      runner_2_Npc2: { gridX: 1, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999, playDirection: 1 }
    }
  }
};
