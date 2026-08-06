import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";

export default {
  id: "optional-double-carrier-showdown",
  title: "Optional Lab: Double Carrier Showdown",
  description: "Both teams begin with a carrier, and neither can score while its own flag is away.",
  introText: "You carry the enemy flag, but Team 2 carries yours. Bring your flag home before your carrier can score. The field needs escort and interception.",
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
  // Non-runnable human-input lab: pass-star-only.
  tutorialSteps: [
    {
      id: "optional-double-carrier-intro",
      title: "Two Carriers, One Decision",
      body: "Your human runner starts with the enemy flag, and Team 2 already has yours. Your team cannot score until your own flag returns home.",
      targetSelector: "#canvas-container"
    },
    {
      id: "optional-double-carrier-roles",
      title: "Split Escort And Intercept",
      body: "Runner index and teammate-has-flag can give allies different views of the two carriers. Decide who should watch each side of the field.",
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
