import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "barrier-specialist",
  title: "Level 35: Barrier Specialist",
  description: "A patroller crosses the row leading to the enemy flag.",
  introText: "The patroller keeps cutting across the flag lane. Your team has one barrier and two allies. What role could change that crossing?",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 7),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 13 },
  tutorialSteps: [
    { id: "level-35-index-barrier", title: "One Barrier Role", body: "Runner index can reserve the barrier branch for one ally while the other follows a different field rule.", targetSelector: "#blockly-region" },
    { id: "level-35-patrol", title: "Watch The Patrol", body: "Watch where the patroller turns. A barrier in its path changes how far it can travel across the flag lane.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 5 }, { slot: "ally2", gridX: 6, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 7, gridY: 1, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL }, { slot: "npc2", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: {
      opponent: { gridX: 11, gridY: 4 }
    }
  }
};
