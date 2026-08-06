import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";

export default {
  id: "optional-random-lab",
  title: "Optional Lab: Move Randomly",
  description: "A clear lane leaves the next move to chance.",
  introText: "Move Randomly chooses a direction each turn. Run the same program more than once and watch how the path changes.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [BLOCK_TYPES.MOVE_RANDOMLY, BLOCK_TYPES.STAY_STILL],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 2, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  // 2-star max: optional lab.
  starCriteria: {
    turnPar: 3
  },
  tutorialSteps: [
    { id: "level-36-random", title: "A Random Direction", body: "Move Randomly picks one of the four directions each turn. The runner does not know which direction comes next.", targetSelector: "#blockly-region" },
    { id: "level-36-lab", title: "Run It Again", body: "One run may reach the marker quickly; another may wander. Watch what stays the same and what chance changes.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
