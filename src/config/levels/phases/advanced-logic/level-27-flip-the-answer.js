import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "flip-the-answer",
  title: "Level 27: Flip The Answer",
  description: "Use NOT to reverse a boolean check.",
  introText: "The Strategy Brain now knows how to flip a check around. NOT turns a true test into a false one and vice versa, which is often the cleanest way to say what you mean.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 5),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 6, y: 2 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 21 },
  tutorialSteps: [
    { id: "level-25-not", title: "Reverse The Boolean", body: "NOT is useful when the easier idea to say is the opposite of what you want to test. Your shared program can express the idea either way.", targetSelector: "#blockly-region" },
    { id: "level-25-side", title: "Change After Crossing", body: "NOT reverses whatever boolean it wraps — a true becomes false and a false becomes true. Think about which condition is easier to express, and whether flipping it gets the Strategy Brain what it needs.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
