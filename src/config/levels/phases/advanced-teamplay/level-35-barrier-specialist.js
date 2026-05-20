import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "barrier-specialist",
  title: "Level 35: Barrier Specialist",
  description: "One ally places the team barrier to stop a patrolling NPC, opening the lane for the attacker.",
  introText: "An enemy is patrolling up and down the column your attacker needs to cross. Without a barrier, it will be in the attacker's lane at exactly the wrong moment. Have one ally place the barrier to cap the patrol, then keep the attacker moving toward the flag.",
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
    { id: "level-35-index-barrier", title: "Only One Ally Should Place", body: "Use runner index so the support ally places the barrier early, then retreats. The attacker should keep advancing toward the flag every turn.", targetSelector: "#blockly-region" },
    { id: "level-35-patrol", title: "Cap The Patrol Lane", body: "Watch where the patrolling NPC turns around. A barrier placed in its path limits how far it can travel, keeping the attacker's row clear.", targetSelector: "#canvas-container" }
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
