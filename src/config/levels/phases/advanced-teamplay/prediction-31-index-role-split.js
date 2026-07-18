import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { ADVANCED_ALL_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

const PREDICTION_31_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_runner_index"></block>
            </value>
            <field name="OPERATOR">EQ</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_forward"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_stay_still"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export default {
  id: "prediction-31",
  title: "Prediction: Role Split",
  description: "One branch faces two allies. Which runner enters it?",
  introText: "The same starter runs on both allies, but their indexes differ. Make your call before the first turn reveals the branch.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: PREDICTION_31_STARTER_XML,
  levelKind: "prediction",
  prediction: {
    prompt: "Which runner will move forward on the first turn?",
    choices: [
      { id: "runner-0", label: "Runner 0" },
      { id: "runner-1", label: "Runner 1" },
      { id: "both", label: "Both runners" },
      { id: "neither", label: "Neither runner" }
    ],
    correctChoiceId: "runner-0",
    observation: "Runner 0 moves forward while Runner 1 stays still",
    explanation: "Runner index equals 0 only for the first ally, so the second ally skips the DO branch."
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
      id: "prediction-31-intro",
      title: "Trace the Runner Index",
      body: "The same program runs on both allies, but runner index can separate their branches. Read the check, then make your prediction before Start Level.",
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
          { slot: "ally", gridX: 1, gridY: 4 },
          { slot: "ally2", gridX: 1, gridY: 5 }
        ]
      },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
          { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
        ]
      }
    }
  }
};
