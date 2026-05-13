import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, AREA_FREEZE_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "two-conditions-at-once",
  title: "Level 25: Two Conditions At Once",
  description: "Use AND so freeze only happens when the enemy is close and the team power is still ready.",
  introText: "Logic blocks can combine ideas. This level is about requiring two truths before the ally spends its one team freeze.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 3),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...AREA_FREEZE_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY, MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  tutorialSteps: [
    { id: "level-23-and", title: "Both Must Be True", body: "AND is useful for a one-time power: close enough to matter, and still ready to use.", targetSelector: "#blockly-region" },
    { id: "level-23-lane", title: "Freeze Then Continue", body: "After the freeze is spent, the ally should keep moving toward the flag.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 6, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 7, gridY: 3 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: { opponent: { gridX: 9, gridY: 4 } }
  }
};
