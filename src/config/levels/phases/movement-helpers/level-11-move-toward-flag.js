import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, BOARD_DYNAMICS_TIERS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "move-toward-flag",
  title: "Level 11: Shortcut Block - Move Toward the Flag",
  // Fully protected level (charter S12, Plan 85): no dynamics/arc/star changes.
  // Both opponents stay frozen; this tier reflects the unchanged setup, not a new edit.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.STATIC_PROP,
  description: "The enemy flag is across an open field. Try Move Toward.",
  introText: "Move Toward picks one step toward its target. The enemy flag is the only target on this open field.",
  tips: [
    "The helper chooses one move each turn, not a whole route.",
    "This open field leaves room for the helper to work.",
    "Regular movement blocks are still available."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_enemy_flag",
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  // S12 fully protected baseline: pass-star-only.
  tutorialSteps: [
    {
      id: "level-11-helper",
      title: "Meet Move Toward",
      body: "This block takes one step toward the target you choose. Here, that target is the enemy flag.",
      targetSelector: "#blockly-region"
    },
    {
      id: "level-11-not-pathfinding",
      title: "One Step At A Time",
      body: "On open ground, the helper has room to work. Watch each step; it chooses one at a time.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 6 },
      runner_2_Npc1: { gridX: 10, gridY: 1, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 11, gridY: 3 }
    }
  }
};
