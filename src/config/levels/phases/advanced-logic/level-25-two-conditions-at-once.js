import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "two-conditions-at-once",
  title: "Level 25: Two Conditions At Once",
  description: "A defender crowds the flag lane while Area Freeze is ready to spend.",
  introText: "The defender is close, and the team power may be ready. What has to be true before your ally spends that opening?",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 3),
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.CLOSEST_ENEMY, MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  // 2-star max: AND logic is concept-mandatory.
  starCriteria: {
    turnPar: 7
  },
  tutorialSteps: [
    { id: "level-23-and", title: "Both Must Be True", body: "AND is true only when both checks are true. Use it when the defender's distance and your team's readiness must agree.", targetSelector: "#blockly-region" },
    { id: "level-23-lane", title: "After The Opening", body: "Once the power is spent, the field changes. What should the same program do while it waits to recharge?", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 6, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 7, gridY: 3 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: { opponent: { gridX: 10, gridY: 4 } }
  }
};
