import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "first-two-defend",
  title: "Level 31: First Two Defend",
  description: "Teach range checks on runner index so two allies take one job and the third takes another.",
  introText: "Now the team has three program-controlled allies. Index < 2 is a clean way to group the first two together and move them out of the way, while the third ally runs forward.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 3),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1_3", targetCell: { x: 4, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  tutorialSteps: [
    { id: "level-29-range", title: "Index Ranges Create Teams", body: "Index < 2 can group the first two allies together while index 2 heads forward. That keeps the shared script simple and readable.", targetSelector: "#blockly-region" },
    { id: "level-29-three-allies", title: "Three Allies, One Program", body: "Two allies need to clear space so the third runner can finish the puzzle.", targetSelector: "#canvas-container" }
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
