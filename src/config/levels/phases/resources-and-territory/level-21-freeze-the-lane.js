import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML, FREEZE_THE_LANE_DEMO_XML } from "../../shared/blocklyXml.js";
import { AREA_FREEZE_BLOCKS, GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "freeze-the-lane",
  title: "Level 21: Freeze the Lane",
  description: "Spend Area Freeze once, then let the ally keep moving toward the flag while the lane is safe.",
  introText: "Area Freeze is a team power, not a normal move. This puzzle is about spending it at the right time and then returning to the main plan.",
  tips: [
    "Area Freeze affects nearby active enemies.",
    "Think about what the ally should do before the freeze is spent and what it should do afterward.",
    "After this level, free play is the best place to combine all the tools you have learned."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...AREA_FREEZE_BLOCKS, ...GENERIC_SENSOR_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  sensorObjectTypes: [SENSOR_OBJECT_TYPES.ENEMY_RUNNER],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.WITHIN_2, SENSOR_RELATION_TYPES.WITHIN_3],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_enemy_flag",
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 10
  },
  tutorialSteps: [
    {
      id: "level-20-freeze",
      title: "One Team Freeze Per Round",
      body: "Area Freeze can lock nearby enemies in place for a short time, but your team only gets one use each round. A simple if/else can spend it once, then switch back to movement.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: FREEZE_THE_LANE_DEMO_XML,
      demoTitle: "Example freeze-then-go program",
      demoCaption: "This example checks a one-time resource using a condition not available in this level. The pattern — spend the resource in the DO branch, then fall back to normal movement in the ELSE branch — is the same structure you need here."
    },
    {
      id: "level-20-timing",
      title: "Use It At The Right Moment",
      body: "This lane is dangerous because an enemy starts nearby. Freeze is strongest when you use it before that runner can block your path.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-20-free-play",
      title: "The Single-Runner Toolkit Is Complete",
      body: "You now have the full set of single-runner tools — movement, sensing, helper blocks, barriers, jumping, and freeze. These will also serve you in free play. The next levels go further, adding new ways to combine and express conditions.",
      targetSelector: "#level-panel"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 6, gridY: 4 },
      runner_2_Npc1: { gridX: 7, gridY: 3 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 10, gridY: 4 }
    }
  }
};
