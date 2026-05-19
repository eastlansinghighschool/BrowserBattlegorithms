import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { BOOLEAN_SENSOR_SELECTION_DEMO_XML, STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "how-far-away",
  title: "Level 24: How Far Away?",
  description: "Use a number comparison with distance to closest enemy.",
  introText: "The Strategy Brain now measures distance to the closest enemy as a number. Compare that value to a threshold and move up when the defender is at or more than a certain distance to move in a diagonal pattern.",
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
      title: "Distance Is A Number Now",
      body: "The new compare piece turns distance into a number you can check with <, <=, >, and the other operator choices. This level is where range becomes part of the strategy.",
      targetSelector: "#blockly-region",
      demoTitle: "Example piece-by-piece selection",
      demoCaption: "The demo shows how the new if/else block (found in the Advanced block drawer) can be built from smaller pieces. The sensor is familiar; the shape is the new idea.",
      demoBlocklyXml: BOOLEAN_SENSOR_SELECTION_DEMO_XML
    },
    { id: "level-24-compare", title: "Choose A Move By Range", body: "The barrier and defender make the direct lane unreliable. Use the distance value to decide when the ally should break off and turn upward.", targetSelector: "#canvas-container" }
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
