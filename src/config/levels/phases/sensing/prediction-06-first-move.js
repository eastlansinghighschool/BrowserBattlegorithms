import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

const PREDICTION_06_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
`.trim();

export default {
  id: "prediction-06",
  title: "Prediction 6: First Move",
  description: "Predict the ally's first move before you run the program.",
  introText: "Read the starter code, choose your prediction, and then run the level to compare what happened.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: PREDICTION_06_STARTER_XML,
  levelKind: "prediction",
  prediction: {
    prompt: "Where will the ally move on its first turn?",
    choices: [
      { id: "right", label: "Right" },
      { id: "left", label: "Left" },
      { id: "stay", label: "Stay still" }
    ],
    correctChoiceId: "right",
    observation: "move right one square to (2, 4)",
    explanation: "Move Forward sends the ally one square in its play direction."
  },
  winCondition: {
    type: "runner_reaches_cell_after_action",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 2, y: 4 },
    actionTypes: ["MOVE_FORWARD"]
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 6
  },
  tutorialSteps: [
    {
      id: "prediction-06-intro",
      title: "Predict Before You Run",
      body: "Read the starter program, choose where the ally will move first, and then press Start Level to check your tracing.",
      targetSelector: "#level-panel"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: {
        playDirection: 1,
        runners: [
          { slot: "human", gridX: 1, gridY: 1 },
          { slot: "ally", gridX: 1, gridY: 4 }
        ]
      },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }
        ]
      }
    }
  }
};
