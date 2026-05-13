import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "closest-enemy-defender",
  title: "Level 33: Closest Enemy Defender",
  description: "One ally attacks while another uses closest-enemy targeting as a defender.",
  introText: "This is the first advanced level where one ally chases the goal and another reacts to live enemies that have already crossed onto your side. The shared script is starting to split attack and defense work.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 5),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.CLOSEST_ENEMY],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 18 },
  tutorialSteps: [
    { id: "level-31-split", title: "Split The Team Jobs", body: "Use runner index to make the first ally attack and the second react to the closest enemy. Each ally is still running the same code, just with a different role.", targetSelector: "#blockly-region" },
    { id: "level-31-pressure", title: "Defend Your Side First", body: "The defender’s job starts on your side of the field while the attacker keeps advancing.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 7 }, { slot: "ally", gridX: 1, gridY: 4 }, { slot: "ally2", gridX: 1, gridY: 2 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 8, gridY: 1 }, { slot: "npc2", gridX: 10, gridY: 1 }] }
    },
    flagOverrides: {
      2: { gridX: 8, gridY: 4 }
    }
  }
};
