import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "mirror-forward",
  title: "Level 5: Forward Works Both Ways",
  description: "Forward follows the runner's facing.",
  introText: "The ally starts on the right and faces left. Here, forward points toward the ally's goal, not the screen's right edge.",
  tips: [
    "Watch the ally's facing.",
    "Forward follows that facing, not the screen direction.",
    "Same block, different orientation."
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
      title: "Forward Follows Facing",
      body: "This ally starts on the opposite side. Forward follows the runner's own goal direction, not the screen.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-5-forward",
      title: "Same Block, New Direction",
      body: "The same Move Forward block works when the ally faces left. Read the board orientation before choosing.",
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
