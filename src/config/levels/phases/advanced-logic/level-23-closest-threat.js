import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "closest-threat",
  title: "Level 23: Closest Threat",
  description: "A frozen runner waits above the main lane.",
  introText: "Field Decisions begins here. Your saved ally program carries forward as the field changes. Decide whether the runner above the lane belongs in its path.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 1, { isStart: true }),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 3 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 15 },
  tutorialSteps: [
    {
      id: "level-21-advanced-layer",
      title: "One Program, Changing Field",
      body: "Field Decisions keeps one ally program as the field changes. The toolbox is broad; begin by deciding what the runner above the lane should mean to your ally.",
      targetSelector: "#blockly-region"
    },
    { id: "level-21-target", title: "A New Move Toward Target", body: "Closest enemy finds the nearest opponent and takes one step toward it. Which runner should your ally notice first?", targetSelector: "#blockly-region" },
    { id: "level-21-board", title: "Runner Off The Lane", body: "The frozen runner is above the main lane, not on it. Watch how that position changes the ground ahead.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 2, gridY: 5 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 5, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
