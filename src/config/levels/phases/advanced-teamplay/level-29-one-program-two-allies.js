import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "one-program-two-allies",
  title: "Level 29: One Program, Two Allies",
  description: "Two allies now share one workspace. Use runner index so one ally attacks and the other supports.",
  introText: "This is the beginning of Team Strategy Script. The same program runs on both allies, so runner index has to decide which one takes the scoring job.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 1, { isStart: true }),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 16 },
  tutorialSteps: [
    { id: "level-27-shared-program", title: "One Workspace, Two Allies", body: "Both allies run the same blocks every turn. The first ally has index 0 and the second has index 1. A check like \"if runner index equals 0\" means only the first ally follows that branch — the second skips it and does something else instead.", targetSelector: "#blockly-region" },
    { id: "level-27-index", title: "Index 0 And Index 1", body: "Only one ally should take the scoring job here. The other ally needs to stay clear of the lane so the shared script stays readable.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 2 }, { slot: "ally2", gridX: 1, gridY: 5 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: { opponent: { gridX: 9, gridY: 5 } }
  }
};
