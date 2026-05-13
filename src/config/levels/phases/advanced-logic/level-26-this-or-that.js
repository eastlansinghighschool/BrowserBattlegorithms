import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "this-or-that",
  title: "Level 26: This Or That",
  description: "Use OR to react when either danger condition becomes true.",
  introText: "The Strategy Brain can now react to either warning sign. OR lets one branch cover more than one kind of danger.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "midfieldPressure",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 4),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 6, y: 2 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  tutorialSteps: [
    { id: "level-24-or", title: "Either Warning Works", body: "OR is true when either of its inputs is true. That makes one branch react to two different kinds of danger without rewriting the whole program.", targetSelector: "#blockly-region" },
    { id: "level-24-path", title: "Cross Then Turn", body: "Look at where the ally needs to go and what stands in the way. Think about when OR lets the Strategy Brain keep one rule for two situations.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 6, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
