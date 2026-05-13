import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "how-far-away",
  title: "Level 24: How Far Away?",
  description: "Use a number comparison with distance to closest enemy.",
  introText: "The Strategy Brain now measures distance as a number. Compare that value to a threshold and change lanes before the defender gets too close.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 2),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 2 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
  tutorialSteps: [
    { id: "level-22-distance", title: "Distance Is A Number Now", body: "Distance to closest enemy can be compared with <, <=, >, and the other operator choices. That makes range a real part of the strategy.", targetSelector: "#blockly-region" },
    { id: "level-22-compare", title: "Choose A Move By Range", body: "The barrier and defender make the direct lane unreliable. Use the distance value to decide when the ally should break off and turn upward.", targetSelector: "#canvas-container" }
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
