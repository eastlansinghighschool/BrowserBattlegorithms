import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML, BRING_IT_HOME_DEMO_XML } from "../../shared/blocklyXml.js";
import { MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "bring-it-home",
  title: "Level 12: Bring It Home",
  description: "Use Move Toward for the trip out and the trip back.",
  introText: "The helper block now has two jobs: head toward the enemy flag first, then turn back toward home after pickup.",
  tips: [
    "Think about how the target should change after pickup.",
    "Move Toward enemy flag works on the way out, even when the route needs both horizontal and vertical steps.",
    "Move Toward my base works on the way home."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
    ...MOVE_TOWARD_BLOCKS,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "team_scores_point",
    teamId: 1,
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 28
  },
  tutorialSteps: [
    {
      id: "level-12-two-targets",
      title: "One Helper, Two Targets",
      body: "This helper block can point at different goals. Here the ally should chase the enemy flag first and then head for home.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: BRING_IT_HOME_DEMO_XML,
      demoTitle: "Example two-target program",
      demoCaption: "An if/else block checks a condition each turn and runs a different branch depending on the result. The condition and actions here are different from what this level needs — use this just to see the structure."
    },
    {
      id: "level-12-switch",
      title: "Switch Targets After Pickup",
      body: "The If I Have Enemy Flag condition is the bridge that tells the ally when to stop chasing the flag and start going home.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 6 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 7, gridY: 2 }
    }
  }
};
