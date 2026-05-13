import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";

export default {
  id: "optional-random-lab",
  title: "Optional Lab: Move Randomly",
  description: "Try the Move Randomly block in a small sandbox challenge.",
  introText: "This optional lab is here to show the random movement block directly. It is not part of the main advanced unlock path.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [BLOCK_TYPES.MOVE_RANDOMLY, BLOCK_TYPES.STAY_STILL],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 2, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  tutorialSteps: [
    { id: "level-36-random", title: "Optional Randomness Lab", body: "Move Randomly picks one of the four cardinal directions each turn. This lab is optional because randomness is harder to predict.", targetSelector: "#blockly-region" },
    { id: "level-36-lab", title: "Try A Few Runs", body: "Some attempts will finish faster than others. That is the point of the lab: to see how a random action feels in the game.", targetSelector: "#canvas-container" }
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
