import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "my-side-their-side",
  title: "Level 20: My Side, Their Side",
  description: "Use territory conditions so the ally changes behavior after crossing into the enemy half.",
  introText: "Some smart programs care about which side of the field they are on. This level teaches that field position can change what move makes sense.",
  tips: [
    "For Team 1, the left half is your side and the right half is the enemy side.",
    "Try a plan that moves forward on your side and then changes behavior after crossing the middle.",
    "This level is about territory awareness, not flag carrying yet."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [BLOCK_TYPES.IF_ON_MY_SIDE, BLOCK_TYPES.IF_ON_MY_SIDE_ELSE, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 6, y: 2 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 12
  },
  tutorialSteps: [
    {
      id: "level-19-territory",
      title: "The Field Has Sides",
      body: "Your side and the enemy side are different spaces. Your program can check which half of the field the ally is in.",
      targetSelector: "#canvas-container"
    },
    {
      id: "level-19-switch-sides",
      title: "Change Your Plan After Crossing",
      body: "The territory blocks let a program make different decisions depending on which half of the field the ally is in. Think about what move makes sense on your side, and what might make more sense once the ally crosses over.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 6 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
