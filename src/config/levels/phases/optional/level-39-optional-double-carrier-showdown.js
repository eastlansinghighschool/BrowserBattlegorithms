import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";

export default {
  id: "optional-double-carrier-showdown",
  title: "Optional Lab: Double Carrier Showdown",
  description: "Protect your carrier while another carrier is already racing on the other side of the map.",
  introText: "Both teams start with a flag carrier. This optional lab is about carrier vulnerability, screening, and interception now that collisions can decide a carrier's fate.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "wideScrimmage",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT,
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [
    MOVE_TOWARD_TARGETS.ENEMY_FLAG,
    MOVE_TOWARD_TARGETS.MY_BASE,
    MOVE_TOWARD_TARGETS.HUMAN_RUNNER,
    MOVE_TOWARD_TARGETS.CLOSEST_ENEMY
  ],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_HumanP1" },
  failureConditions: [
    { type: "team_scores_point", teamId: 2 },
    { type: "turn_limit_exceeded", maxTurns: 20 }
  ],
  tutorialSteps: [
    {
      id: "optional-double-carrier-intro",
      title: "Two Carriers, One Decision",
      body: "Your runner starts with the enemy flag, and Team 2 already has your flag. Because carriers can now lose collisions even on home turf, the lane is only safe if your allies help screen and intercept.",
      targetSelector: "#canvas-container"
    },
    {
      id: "optional-double-carrier-roles",
      title: "Split Escort And Intercept",
      body: "Use runner index and teammate-has-flag to give one ally escort duty and another ally interception duty. The goal is coordination, not a single rush.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    teams: {
      player: {
        playDirection: 1,
        runners: [
          { slot: "human", gridX: 6, gridY: 4, hasEnemyFlag: true },
          { slot: "ally", gridX: 5, gridY: 3 },
          { slot: "ally2", gridX: 5, gridY: 5 }
        ]
      },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 3, gridY: 3, hasEnemyFlag: true },
          { slot: "npc2", gridX: 7, gridY: 4 },
          { slot: "npc3", gridX: 7, gridY: 5 }
        ]
      }
    },
    flags: {
      player: { carriedByRunnerId: "runner_2_Npc1", isAtBase: false },
      opponent: { carriedByRunnerId: "runner_1_HumanP1", isAtBase: false }
    }
  }
};
