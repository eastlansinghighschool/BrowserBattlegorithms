import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML, SENSOR_BARRIER_DEMO_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "sensor-barrier-branch",
  title: "Level 6: Enemy Sensor Branch",
  description: "Use the generic sensor block to detect an enemy directly in front and route around it.",
  introText: "The sensing system becomes more flexible here. One sensor block shape can ask about different board objects — not just barriers.",
  tips: [
    "The generic sensor block has two dropdowns: what to look for, and how to describe its position.",
    "An enemy is sitting in the lane ahead — you need to sense it and choose a different move.",
    "Later levels will use this same block to sense flags, walls, and more."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...GENERIC_SENSOR_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorObjectTypes: [SENSOR_OBJECT_TYPES.ENEMY_RUNNER],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT, SENSOR_RELATION_TYPES.DIRECTLY_BEHIND],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 6, y: 3 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 14
  },
  tutorialSteps: [
    {
      id: "level-6-generic-sensor",
      title: "One Block Shape, Many Sensor Ideas",
      body: "In an earlier level you used a block that checked for a barrier specifically. This new sensor block works the same way — but the dropdowns let you describe other objects and positions too. The demo below shows it checking for a barrier; your level needs you to check for something else.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: SENSOR_BARRIER_DEMO_XML,
      demoTitle: "Example sensor branch",
      demoCaption: "This example detects a barrier directly in front and steps up to detour around it. Your level uses the same relation but a different object — swap the object dropdown to match what is actually in the lane."
    },
    {
      id: "level-6-barrier",
      title: "Route Around The Enemy",
      body: "An enemy runner is frozen in the lane ahead. Sense it directly in front and step up to go around — then resume forward progress once you are past it.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 4, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
