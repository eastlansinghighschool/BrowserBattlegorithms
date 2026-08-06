import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "freeze-support",
  title: "Level 34: Freeze Support",
  description: "A patrolling defender guards the flag lane, and the team has one freeze power.",
  introText: "Two allies wait near the flag lane as a defender patrols toward them. Area Freeze belongs to the whole team, so the approaching patrol creates an opening.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 6),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  starCriteria: {
    turnPar: 7,
    masteryCriterionId: "both-allies-active"
  },
  tutorialSteps: [
    { id: "level-32-role", title: "One Team Power", body: "Runner index can give one ally the freeze branch. Because the power belongs to the team, its timing changes the field for both allies.", targetSelector: "#blockly-region" },
    { id: "level-32-timing", title: "Watch The Opening", body: "The defender patrols beside the flag lane. Decide what should make the shared program spend its one opening.", targetSelector: "#canvas-container" }
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
