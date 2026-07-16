import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { BOOLEAN_SENSOR_SELECTION_DEMO_XML, STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "how-far-away",
  title: "Level 24: How Far Away?",
  description: "A barrier closes the center lane while a defender patrols ahead.",
  introText: "The barrier and patrolling defender make distance matter. How far away is it when your ally should change course?",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 2),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 2 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 17 },
  tutorialSteps: [
    {
      id: "level-24-distance",
      title: "Distance Is A Number",
      body: "The compare block checks a distance value with <, <=, >, and the other operators. Use it to ask how far the defender is from your ally.",
      targetSelector: "#blockly-region",
      demoTitle: "Example piece-by-piece selection",
      demoCaption: "The familiar sensor feeds a distance value into a compare block with two paths. The board decides which path matters.",
      demoBlocklyXml: BOOLEAN_SENSOR_SELECTION_DEMO_XML
    },
    { id: "level-24-compare", title: "Read The Range", body: "The barrier blocks the center lane, and the defender patrols beyond it. Decide what distance should change your ally's plan.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    barriers: [
      { gridX: 4, gridY: 4, ownerRunnerId: "strategy_brain_distance_barrier" }
    ],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 6, gridY: 4 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
