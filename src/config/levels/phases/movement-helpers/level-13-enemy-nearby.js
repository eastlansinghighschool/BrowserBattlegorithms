import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS, MECHANIC_NECESSITY } from "../../../constants.js";
import { STARTER_EVENT_XML, ENEMY_NEARBY_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "enemy-nearby",
  title: "Level 13: Enemy Nearby",
  description: "A Guard watches the lane. The ally needs to notice when it closes in.",
  introText: "The Guard moves when a runner gets close. Within 2 and Within 3 count grid steps, not a straight line.",
  // Pilot uplift target (charter S11, Plan 92): the enemy is now a live Guard
  // that steps toward any runner inside its aggro radius. The old "the enemy
  // is frozen" tip was removed since it became false; a Guard-aware
  // replacement tip is intentionally NOT authored here per charter S5 —
  // mission copy is owner-gated and lands with Plans 94/95, after boards
  // settle. This level ships with 3 tips (not 4) until then.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT,
  // Charter S8 / Plan 100: the distance sensor is required dynamically, not
  // structurally -- runner_reaches_cell can't encode "or the Guard captures
  // you." Proof is the degenerate fixture at
  // tests/unit/fixtures/guided-naive-solutions/enemy-nearby.xml (a naive
  // "always move forward" program), which the win-condition-requires-named-
  // mechanic lint rule checks is discoverable before accepting this claim.
  mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC,
  tips: [
    "Within 2 and Within 3 count grid steps.",
    "Choose how early the ally should react.",
    "Grid steps matter, not straight-line distance."
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
      body: "Within 2 spaces means two ideal grid moves away. A clear straight line is not required.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: ENEMY_NEARBY_DEMO_XML,
      demoTitle: "Example nearby-enemy reaction",
      demoCaption: "This demo asks a different sensor question. Notice how a distance check selects one of two actions."
    },
    {
      id: "level-13-nearby-enemy",
      title: "Choose Your Warning Distance",
      body: "The Guard moves when a runner gets close. How early should the ally react?",
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
