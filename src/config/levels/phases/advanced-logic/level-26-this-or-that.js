import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "this-or-that",
  title: "Level 26: This Or That",
  description: "Midfield and a frozen defender can both change the lane.",
  introText: "The territory line and frozen defender each give the ally a warning. Either warning can matter on the same turn.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "midfieldPressure",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 4),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 6, y: 2 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  // 2-star max: OR logic is concept-mandatory.
  starCriteria: {
    turnPar: 9
  },
  tutorialSteps: [
    { id: "level-24-or", title: "Either Warning Works", body: "OR is true when at least one input is true. One branch can notice both the midfield line and a nearby defender.", targetSelector: "#blockly-region" },
    { id: "level-24-path", title: "Two Warnings, One Lane", body: "The midfield line and frozen defender are different warnings. Decide when they should ask the same thing of your ally.", targetSelector: "#canvas-container" }
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
