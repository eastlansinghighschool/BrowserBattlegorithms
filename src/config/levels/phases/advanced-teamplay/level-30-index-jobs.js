import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "index-jobs",
  title: "Level 30: Index Jobs",
  description: "Use runner index comparisons so one ally attacks and the other patrols upward.",
  introText: "This level still has one real goal. Runner index decides which ally is the attacker and which ally should peel upward instead of stealing the job.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 2),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  tutorialSteps: [
    { id: "level-28-index-compare", title: "Compare The Index", body: "You can compare runner index to a number to choose different branches for different allies.", targetSelector: "#blockly-region" },
    { id: "level-28-jobs", title: "Attacker And Patrol", body: "Each index value can be assigned a different role. Think about which ally is better positioned for the scoring job, and what the other should do to stay out of the way.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 5 }, { slot: "ally2", gridX: 7, gridY: 5 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: { opponent: { gridX: 9, gridY: 5 } }
  }
};
