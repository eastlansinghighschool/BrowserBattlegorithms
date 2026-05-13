import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML, RELAY_RACE_DEMO_XML } from "../../shared/blocklyXml.js";
import { TEAMMATE_FLAG_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "relay-race",
  title: "Level 19: Relay Race",
  description: "Use the teammate flag condition so the ally reacts when another runner on the team has the enemy flag.",
  introText: "Programs can pay attention to teammates too. Here, the human runner already has the enemy flag, so the ally should switch into support mode and reach the marked support square next to the carrier.",
  tips: [
    "The human runner starts this level already carrying the enemy flag.",
    "The teammate condition is true when another runner on your team has the flag.",
    "Move Toward human runner is a helpful support action here.",
    "The highlighted support square next to the human is the goal, not the occupied human cell."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...TEAMMATE_FLAG_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.HUMAN_RUNNER],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 6, y: 3 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 10
  },
  tutorialSteps: [
    {
      id: "level-18-teammate",
      title: "A Teammate Already Has The Flag",
      body: "The human runner begins with the enemy flag, so this level is about how the ally should react when someone else becomes the carrier. Guide the ally into the marked support square next to the human.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-18-support",
      title: "Support Mode",
      body: "Use the teammate flag condition to switch into a support move. The Move Toward human runner helper is one clean way to do that.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: RELAY_RACE_DEMO_XML,
      demoTitle: "Example support program",
      demoCaption: "This example uses a different condition than the one available in this level. The structure — check a condition, then run different actions in each branch — is the same pattern you need here."
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 6, gridY: 2, hasEnemyFlag: true },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 5 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { carriedByRunnerId: "runner_1_HumanP1", isAtBase: false }
    }
  }
};
