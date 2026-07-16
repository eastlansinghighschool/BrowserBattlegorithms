import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "closest-threat",
  title: "Level 23: Closest Threat",
  description: "Start Field Decisions by using Move Toward on the closest enemy.",
  introText: "This is the first Field Decisions step. One saved ally program carries forward as the field changes.",
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
      title: "A New Set Of Tools",
      body: "This first project level introduces Field Decisions. The toolbox is broader now because later steps will add numbers and boolean choices; for the moment, focus on how Move Toward can track the nearest threat.",
      targetSelector: "#blockly-region"
    },
    { id: "level-21-target", title: "A New Move Toward Target", body: "Closest enemy picks the nearest active opponent and steps toward them. Your shared program starts by deciding who matters most.", targetSelector: "#blockly-region" },
    { id: "level-21-board", title: "Intercept The Runner", body: "This step is about tracking a threat, not chasing a flag. Watch how the target sits off the main lane and ask where the strategy should bend.", targetSelector: "#canvas-container" }
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
