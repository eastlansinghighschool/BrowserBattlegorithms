import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS } from "../../../constants.js";
import { STARTER_EVENT_XML, ENEMY_NEARBY_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "enemy-nearby",
  title: "Level 13: Enemy Nearby",
  description: "Use distance sensing to react when an enemy runner gets close.",
  introText: "Distance sensors use ideal move count, not line-of-sight. That means the game measures how many grid steps away something is.",
  // Pilot uplift target (charter S11, Plan 92): the enemy is now a live Guard
  // that steps toward any runner inside its aggro radius. The old "the enemy
  // is frozen" tip was removed since it became false; a Guard-aware
  // replacement tip is intentionally NOT authored here per charter S5 —
  // mission copy is owner-gated and lands with Plans 94/95, after boards
  // settle. This level ships with 3 tips (not 4) until then.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT,
  tips: [
    "Within 2 spaces and within 3 spaces use Manhattan distance.",
    "Try giving the ally one response for danger and another response for normal progress.",
    "This level is easier if you think about ideal grid moves, not straight-line distance."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.WITHIN_2, SENSOR_RELATION_TYPES.WITHIN_3],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 7, y: 2 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 12
  },
  tutorialSteps: [
    {
      id: "level-13-distance",
      title: "Distance Uses Grid Steps",
      body: "Within 2 spaces means the target is close in ideal grid moves. It does not mean the target is visible in a straight line.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: ENEMY_NEARBY_DEMO_XML,
      demoTitle: "Example nearby-enemy reaction",
      demoCaption: "This sensor branch uses an object and relation that are not available in this level. The structure is the same one you will use — pick the right object and relation from the dropdowns for this puzzle."
    },
    {
      id: "level-13-nearby-enemy",
      title: "Notice The Enemy Before It Is Too Close",
      body: "Use the distance check to change the ally's move when the enemy runner gets nearby, then fall back to forward progress when the lane feels safe.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 7, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_GUARD, guardRadius: 1 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
