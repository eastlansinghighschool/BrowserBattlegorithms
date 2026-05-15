import { GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { STARTER_EVENT_XML, RELAY_RACE_DEMO_XML } from "../../shared/blocklyXml.js";
import { TEAMMATE_FLAG_BLOCKS, MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "relay-race",
  title: "Level 19: Relay Race",
  description: "Use the teammate flag condition so the ally stages on defense first, then supports the human carrier after the enemy flag is picked up.",
  introText: "This relay uses both keyboard control and Blockly. Move the human runner to the enemy flag, and have the ally stage first before switching into carrier support.",
  tips: [
    "The human runner starts without the enemy flag and has to pick it up first.",
    "The ally should reach the staging square near the top before the human carries the flag.",
    "The teammate condition is true when another runner on your team has the flag.",
    "After the human becomes the carrier, the ally should switch from staging to carrier support.",
    "The highlighted goal marker changes with the relay phase, so watch it after the flag pickup."
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
      title: "Move The Human Runner First",
      body: "You control the human runner in this level. Get to the enemy flag first, then watch the ally switch from the top staging square to carrier support once a teammate has the flag.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-19-support",
      title: "Stage, Then Support",
      body: "Use the teammate flag condition to change the ally's job after the human becomes the carrier. The structure is a branch: one action before the flag, another after it.",
      targetSelector: "#blockly-region",
      demoBlocklyXml: RELAY_RACE_DEMO_XML,
      demoTitle: "Example branch pattern",
      demoCaption: "This example uses a different condition than the one available in this level. The branch shape is the same: check a condition, then choose different actions before and after."
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
