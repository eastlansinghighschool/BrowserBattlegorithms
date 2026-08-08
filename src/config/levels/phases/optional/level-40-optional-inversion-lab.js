import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";

const INVERSION_40_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_boolean_square_ahead_blocked"></block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_stay_still"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

// Lock = empty toolbox; existing blocks remain movable — reset-to-starter is the recovery.
// Non-runnable prediction-style choice level: pass-star-only.
export default {
  id: "optional-inversion-lab",
  title: "Optional Lab: Code Inversion",
  description: "Read the locked program and choose which board setup lets it succeed.",
  introText: "Read the locked program below. The ally must reach the target at (2, 4). Predict which board setup allows this program to reach the goal!",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [],
  initialBlocklyXml: INVERSION_40_STARTER_XML,
  levelKind: "prediction",
  prediction: {
    prompt: "The ally must reach the target at (2, 4). The locked program is: IF square ahead is blocked → Stay Still, ELSE → Move Forward. Which board setup will allow this program to succeed?",
    choices: [
      { id: "clear-aisle", label: "Clear aisle — square ahead is unblocked" },
      { id: "barrier-ahead", label: "Barrier ahead — square (2, 4) is blocked" },
      { id: "both-cases", label: "Either board — the ELSE branch moves when it's clear, and Stay Still also reaches the target when blocked." }
    ],
    correctChoiceId: "clear-aisle",
    observation: "the clear aisle board where the IF condition was false and the ally moved forward to (2, 4)",
    explanation: "When the square ahead is clear, the IF condition evaluates to false. The DO branch (Stay Still) is skipped and the ELSE branch (Move Forward) executes. If a barrier were placed ahead, the condition would evaluate to true, causing the ally to stay still every turn until time expired."
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
      id: "inversion-40-intro",
      title: "Read the Program First",
      body: "Trace the IF condition on candidate boards. Select which board setup lets the ally make progress, then start the level to compare.",
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
