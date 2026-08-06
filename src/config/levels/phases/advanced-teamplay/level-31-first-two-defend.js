import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "first-two-defend",
  title: "Level 31: First Two Defend",
  description: "Three allies crowd a barrier in the center lane.",
  introText: "Three allies share the field, but the first two face the same blocked row. An index range can group that pair and leave another job open.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 3),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1_3", targetCell: { x: 4, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  starCriteria: {
    turnPar: 5,
    masteryCriterionId: "both-allies-active"
  },
  tutorialSteps: [
    { id: "level-29-range", title: "Index Ranges Create Teams", body: "An index range such as < 2 can group the first two allies. The remaining index can follow a different branch in the same program.", targetSelector: "#blockly-region" },
    { id: "level-29-three-allies", title: "Three Allies, One Program", body: "The barrier makes the center row crowded. Decide which runners need the same response and which one needs a different route.", targetSelector: "#canvas-container" }
  ],
  tips: ["Stay Still can remove a barrier directly in front — remember that from an earlier level?"],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    barriers: [{ gridX: 5, gridY: 4, ownerRunnerId: "phase8_first_two_defend_wall" }],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 2, gridY: 4 }, { slot: "ally2", gridX: 3, gridY: 4 }, { slot: "ally3", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
