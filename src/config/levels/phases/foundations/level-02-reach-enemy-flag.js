import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "reach-enemy-flag",
  title: "Level 2: Reach Enemy Flag",
  description: "The enemy flag is the target this time.",
  introText: "The ally starts beyond the enemy flag. Reach that flag to clear the level.",
  tips: [
    "A flag marks each team's side of the field. The enemy flag is behind the ally.",
    "Move Backward sends the ally opposite Move Forward. Check the ally's position.",
    "One action runs on each ally turn."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_enemy_flag",
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  tutorialSteps: [
    {
      id: "level-2-goal",
      title: "The Enemy Flag Is The Goal",
      body: "The enemy flag on the right is the goal, not the practice square.",
      targetSelector: "#canvas-container",
      visualItems: [
        { emoji: "🚩", label: "Your team flag", description: "This flag marks your home side." },
        { emoji: "🏳️", label: "Enemy flag", description: "Reach this flag to clear the level." }
      ]
    },
    {
      id: "level-2-new-block",
      title: "Check The Ally's Facing",
      body: "Move Backward sends the ally opposite Move Forward. Look at where the ally starts and where the flag waits.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 11, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 10, gridY: 4 }
    }
  }
};
