import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "closest-threat",
  title: "Level 23: Closest Threat",
  description: "Use Move Toward closest enemy to intercept a nearby defender.",
  introText: "Closest enemy is a different kind of target. This board is arranged so the ally has to bend upward before the intercept works.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 1, { isStart: true }),
  toolboxBlockTypes: [...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 3 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
  tutorialSteps: [
    {
      id: "level-21-advanced-layer",
      title: "A New Set Of Tools",
      body: "This level introduces an expanded toolbox. The new blocks let your program work with numbers, compare values, and combine conditions. You will learn each of these in the coming levels — for now, focus on the Move Toward block.",
      targetSelector: "#blockly-region"
    },
    { id: "level-21-target", title: "A New Move Toward Target", body: "Closest enemy picks the nearest active opponent and steps toward them.", targetSelector: "#blockly-region" },
    { id: "level-21-board", title: "Intercept The Runner", body: "This challenge is about chasing a threat, not chasing a flag. Watch how the target sits off the main lane.", targetSelector: "#canvas-container" }
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
