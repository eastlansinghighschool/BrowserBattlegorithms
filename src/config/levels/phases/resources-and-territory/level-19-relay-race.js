import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML, RELAY_RACE_DEMO_XML } from "../../shared/blocklyXml.js";
import { TEAMMATE_FLAG_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "relay-race",
  title: "Level 19: Relay Race",
  description: "The flag changes hands in this relay. Watch both runners and decide how their jobs should change.",
  introText: "Drive the human runner with the arrow keys. The ally heads for a staging spot; the flag handoff will change the field.",
  tips: [
    "Watch where the ally starts.",
    "The staging spot waits above the shared lane.",
    "Notice what changes when a teammate reaches the enemy flag.",
    "The goal marker moves after the flag pickup.",
    "Which runner should move, wait, or support?",
    "Read the next turn before you change the plan."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT,
  toolboxBlockTypes: [...TEAMMATE_FLAG_BLOCKS, ...MOVE_TOWARD_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.HUMAN_RUNNER],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "relay_support_after_teammate_has_flag",
    runnerId: "runner_1_AI_AllyP1",
    stagingCell: { x: 4, y: 0 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 20
  },
  tutorialSteps: [
    {
      id: "level-19-human-route",
      title: "Watch The Handoff",
      body: "Drive the human runner with the arrow keys. Watch the ally, the staging spot, and the flag as the round unfolds.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-19-support",
      title: "Name The New Job",
      body: "A teammate carrying the flag changes the situation. What should the ally do now?",
      targetSelector: "#blockly-region",
      demoBlocklyXml: RELAY_RACE_DEMO_XML,
      demoTitle: "A Board Question",
      demoCaption: "This sample asks a different board question. Notice how the answer can change what happens next."
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 4 },
      runner_1_AI_AllyP1: { gridX: 4, gridY: 5 },
      runner_2_Npc1: { gridX: 10, gridY: 1, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
