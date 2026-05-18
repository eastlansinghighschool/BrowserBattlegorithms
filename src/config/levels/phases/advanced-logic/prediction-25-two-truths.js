import { GAME_MODES, HUMAN_TURN_BEHAVIORS, SENSOR_RELATION_TYPES } from "../../../constants.js";
import { ADVANCED_ALL_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

const PREDICTION_25_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_logic_and">
            <value name="LEFT">
              <block type="battlegorithms_boolean_sensor_matches">
                <field name="OBJECT">ENEMY_RUNNER</field>
                <field name="RELATION">DIRECTLY_IN_FRONT</field>
              </block>
            </value>
            <value name="RIGHT">
              <block type="battlegorithms_boolean_sensor_matches">
                <field name="OBJECT">BARRIER</field>
                <field name="RELATION">DIRECTLY_IN_FRONT</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_forward"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_backward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export default {
  id: "prediction-25",
  title: "Prediction: Two Truths",
  description: "Predict whether the AND branch runs before you observe the result.",
  introText: "The starter program checks two truths at once. Pick whether the branch is true, then run it and compare the outcome.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  sensorRelationTypes: [SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT],
  initialBlocklyXml: PREDICTION_25_STARTER_XML,
  levelKind: "prediction",
  prediction: {
    prompt: "Will the AND condition be true?",
    choices: [
      { id: "true", label: "True" },
      { id: "false", label: "False" },
      { id: "unsure", label: "Not sure" }
    ],
    correctChoiceId: "false",
    observation: "take the ELSE branch and move backward to (1, 4)",
    explanation: "AND only becomes true when both checks are true. The lane has an enemy runner in front, but no barrier, so the second half is false."
  },
  winCondition: {
    type: "runner_reaches_cell_after_action",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 1, y: 4 },
    actionTypes: ["MOVE_BACKWARD"]
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 6
  },
  tutorialSteps: [
    {
      id: "prediction-25-intro",
      title: "Trace Both Halves",
      body: "The AND block only returns true when both inputs are true. Read the board, choose your answer, and then run to check the branch.",
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
          { slot: "ally", gridX: 2, gridY: 4 }
        ]
      },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 3, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 },
          { slot: "npc2", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }
        ]
      }
    }
  }
};
