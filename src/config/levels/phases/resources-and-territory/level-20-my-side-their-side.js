import {
  BLOCK_TYPES,
  GAME_MODES,
  HUMAN_TURN_BEHAVIORS,
  NPC_BEHAVIORS,
  BOARD_DYNAMICS_TIERS,
  MECHANIC_NECESSITY
} from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "my-side-their-side",
  title: "Level 20: My Side, Their Side",
  // Complexity-protected level (charter S12, Plan 85): win condition, toolbox,
  // and taught concept stay fixed (Plan 103 design-note round proved the only
  // considered alternative, a flag-carry round trip, is unbuildable with this
  // toolbox). NPC1 becomes a Sentry (background motion) patrolling column 8 —
  // near the boundary the ally crosses so its motion is visible in play —
  // vertical-patrol behavior never changes gridX, so its reachable set is
  // {8} x all rows. The level's single winnable program (if_on_my_side_else:
  // DO=move_forward, ELSE=move_up_screen; an exhaustive sweep of all 25
  // programs this toolbox can express shows it is the only one that wins)
  // only ever visits x in [1,6]. The Sentry's column and the winning
  // program's reachable x-range are disjoint by construction, not just clear
  // on the reference run's specific timing.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION,
  // Necessity here is structural (toolbox + geometry force the territory
  // conditional; see design-note.md), not board-driven -- "static", not
  // "dynamic". No degenerate/naive fixture exists for this level because
  // there is no dynamic threat necessity to prove; see Plan 103 progress
  // report for the linter-wrinkle decision.
  mechanicNecessity: MECHANIC_NECESSITY.STATIC,
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
      runner_2_Npc1: { gridX: 8, gridY: 2, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  }
};
