import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS, MECHANIC_NECESSITY } from "../../../constants.js";
import { STARTER_EVENT_XML, FREEZE_THE_LANE_DEMO_XML } from "../../shared/blocklyXml.js";
import { AREA_FREEZE_BLOCKS, GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "freeze-the-lane",
  title: "Level 21: Freeze the Lane",
  description: "A Charger is closing on the lane. Decide when Area Freeze should matter.",
  introText: "The Charger starts near the ally, and the freeze window is brief. Watch the lane before you spend a team power.",
  tips: [
    "The Charger can reach nearby lanes.",
    "Area Freeze touches nearby active enemies.",
    "When would a short safe window help?",
    "Watch the cooldown after the power is spent."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...AREA_FREEZE_BLOCKS, ...GENERIC_SENSOR_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.WITHIN_2, SENSOR_RELATION_TYPES.WITHIN_3],
  initialBlocklyXml: STARTER_EVENT_XML,
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.COLLISION_THREAT,
  mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC,
  winCondition: {
    type: "runner_reaches_enemy_flag",
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 10
  },
  // 2-star max: freeze power is concept-mandatory.
  starCriteria: {
    turnPar: 7
  },
  tutorialSteps: [
    {
      id: "level-20-freeze",
      title: "Read The Freeze Window",
      body: "Area Freeze stops nearby enemies briefly. Watch the resource and the Charger together.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: FREEZE_THE_LANE_DEMO_XML,
      demoTitle: "A Resource Question",
      demoCaption: "This sample watches a different cooling resource. Notice how the board state decides whether the action is available."
    },
    {
      id: "level-20-timing",
      title: "Choose The Moment",
      body: "The Charger starts near the lane. What would make this the right turn to spend the power?",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-20-free-play",
      title: "Carry The Toolkit",
      body: "Movement, sensing, helper actions, barriers, jumping, and freeze are on the table. Free play opens the next board.",
      targetSelector: "#level-panel"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 6, gridY: 4 },
      runner_2_Npc1: { gridX: 7, gridY: 3, cpuBehavior: NPC_BEHAVIORS.GUIDED_CHARGER },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 10, gridY: 4 }
    },
    barriers: [
      { gridX: 7, gridY: 0, ownerRunnerId: "level_freeze_barrier_1" },
      { gridX: 7, gridY: 1, ownerRunnerId: "level_freeze_barrier_2" },
      { gridX: 7, gridY: 2, ownerRunnerId: "level_freeze_barrier_3" },
      { gridX: 7, gridY: 5, ownerRunnerId: "level_freeze_barrier_4" },
      { gridX: 7, gridY: 6, ownerRunnerId: "level_freeze_barrier_5" },
      { gridX: 7, gridY: 7, ownerRunnerId: "level_freeze_barrier_6" }
    ]
  }
};
