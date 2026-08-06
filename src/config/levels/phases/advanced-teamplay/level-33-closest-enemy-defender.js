import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "closest-enemy-defender",
  title: "Level 33: Closest Enemy Defender",
  description: "Two live defenders have crossed onto your side of the field.",
  introText: "One ally has a route to the far flag while two defenders press close to home. The same program must notice both jobs.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 5),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 18 },
  starCriteria: {
    turnPar: 12,
    masteryCriterionId: "both-allies-active"
  },
  tutorialSteps: [
    { id: "level-31-split", title: "Split The Team Jobs", body: "Runner index can give one ally a flag-focused branch and another a closest-enemy branch. Both still follow the same shared code.", targetSelector: "#blockly-region" },
    { id: "level-31-pressure", title: "Pressure At Home", body: "The two defenders are already on your side. Decide what the nearby ally should notice while its teammate works the far lane.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: {
        playDirection: 1, runners: [
          { slot: "human", gridX: 1, gridY: 7 },
          { slot: "ally", gridX: 1, gridY: 4 },
          { slot: "ally2", gridX: 6, gridY: 2 }
        ]
      },
      opponent: {
        playDirection: -1, runners: [
          { slot: "npc1", gridX: 4, gridY: 2 },
          { slot: "npc2", gridX: 3, gridY: 2 }
        ]
      }
    },
    flagOverrides: {
      2: { gridX: 8, gridY: 4 }
    }
  }
};
