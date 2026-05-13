import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, AREA_FREEZE_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "freeze-support",
  title: "Level 34: Freeze Support",
  description: "One ally spends the freeze while another keeps advancing.",
  introText: "The strongest team plays are role-based. In this level, one ally is the freezer and one is the runner, both driven by the same shared script.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 6),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...AREA_FREEZE_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  tutorialSteps: [
    { id: "level-32-role", title: "A Team Freeze Specialist", body: "Use runner index so only one ally spends the team freeze while the other keeps advancing. The freeze role should stay local and simple.", targetSelector: "#blockly-region" },
    { id: "level-32-timing", title: "Support The Run", body: "The freezer should act early enough to open the lane for the attacker.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 6, gridY: 4 }, { slot: "ally2", gridX: 6, gridY: 5 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 8, gridY: 1 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flagOverrides: {
      2: { gridX: 9, gridY: 4 }
    }
  }
};
