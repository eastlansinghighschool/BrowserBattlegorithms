import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "advanced-scrimmage",
  levelKind: "challenge",
  title: "Challenge 37: Advanced Scrimmage",
  description: "Three allies face three live defenders across a wide field.",
  introText: "Your team needs a point against three live defenders. One shared program must give each ally a useful local response as the field changes.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "wideScrimmage",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 9, { isCapstone: true }),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.CLOSEST_ENEMY, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1 },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 55 },
  starCriteria: { turnPar: 48, masteryCriterionId: "both-allies-active" },
  tutorialSteps: [
    { id: "level-35-capstone", title: "A Full Team Script", body: "Three allies run one shared program against three live defenders on the far side. Build local rules that give the team different work.", targetSelector: "#blockly-region" },
    { id: "level-35-real-score", title: "Bring A Point Home", body: "A point is the goal. Any ally can carry it home, so watch what each runner sees as the scrimmage shifts.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: {
        playDirection: 1,
        runners: [
          { slot: "human", gridX: 1, gridY: 1 },
          { slot: "ally", gridX: 1, gridY: 3 },
          { slot: "ally2", gridX: 1, gridY: 4 },
          { slot: "ally3", gridX: 1, gridY: 5 }
        ]
      },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 9, gridY: 1 },
          { slot: "npc2", gridX: 10, gridY: 4 },
          { slot: "npc3", gridX: 9, gridY: 6 }
        ]
      }
    },
    flags: { opponent: { gridX: 11, gridY: 4 } }
  }
};
