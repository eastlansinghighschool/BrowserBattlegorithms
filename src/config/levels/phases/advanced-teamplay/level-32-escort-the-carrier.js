import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "escort-the-carrier",
  title: "Level 32: Escort The Carrier",
  description: "One ally begins with the enemy flag while another waits near home.",
  introText: "Your lead ally already carries the flag. The second ally sees a different part of the field. The shared program needs local jobs for both runners.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 4),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.MY_BASE, MOVE_TOWARD_TARGETS.HUMAN_RUNNER],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1_2", targetCell: { x: 5, y: 5 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 20 },
  starCriteria: {
    turnPar: 5,
    masteryCriterionId: "both-allies-active"
  },
  tutorialSteps: [
    { id: "level-30-teammate", title: "One Ally Has The Flag", body: "The lead ally begins as the carrier. Teammate-has-flag and runner index can give the other ally a different response.", targetSelector: "#blockly-region" },
    { id: "level-30-support", title: "Watch The Return", body: "The carrier and the nearby ally are not in the same situation. Build local rules that notice the flag and the lane around it.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 7, gridY: 2, hasEnemyFlag: true }, { slot: "ally2", gridX: 2, gridY: 5 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flagOverrides: {
      2: { carriedByRunnerId: "runner_1_AI_AllyP1", isAtBase: false }
    }
  }
};
