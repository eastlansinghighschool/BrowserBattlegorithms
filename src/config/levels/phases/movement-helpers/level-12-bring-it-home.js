import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS, BOARD_DYNAMICS_TIERS } from "../../../constants.js";
import { STARTER_EVENT_XML, BRING_IT_HOME_DEMO_XML } from "../../shared/blocklyXml.js";
import { MOVE_TOWARD_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "bring-it-home",
  title: "Level 12: Bring It Home",
  // Complexity-protected level (charter S12, Plan 85): dynamics and copy may
  // change, but win condition and lesson shape stay fixed. NPC1 becomes a
  // Sentry (background motion) patrolling column 11, one column past the
  // enemy flag at (10, 3) — Move Toward's dominant-axis heuristic never
  // overshoots its target column, so no valid Move Toward solution ever
  // reaches x=11. The Sentry's reachable set (column 11, all rows) is
  // therefore geometrically disjoint from the ally's reachable set (x<=10),
  // not just clear on the reference run's specific timing.
  boardDynamicsTier: BOARD_DYNAMICS_TIERS.BACKGROUND_MOTION,
  description: "Once the ally picks up the flag, its next target must change.",
  introText: "The enemy flag is across the field. Once the ally carries it, the next target is home.",
  tips: [
    "Watch what changes after the flag pickup.",
    "Move Toward can aim at a different target each turn.",
    "The ally needs a target for the trip home, too."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
    ...MOVE_TOWARD_BLOCKS,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: {
    type: "team_scores_point",
    teamId: 1,
    runnerId: "runner_1_AI_AllyP1"
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 28
  },
  tutorialSteps: [
    {
      id: "level-12-two-targets",
      title: "One Helper, Two Targets",
      body: "This helper can point at different targets. The flag changes what the ally carries; what target should matter next?",
      targetSelector: "#blockly-region",
      demoBlocklyXml: BRING_IT_HOME_DEMO_XML,
      demoTitle: "Example two-target program",
      demoCaption: "This demo asks a different question. Notice how each branch can choose a target."
    },
    {
      id: "level-12-switch",
      title: "After The Pickup",
      body: "Pickup changes the board. What target should matter once the ally is carrying the flag?",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 6 },
      runner_2_Npc1: { gridX: 11, gridY: 2, cpuBehavior: NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL },
      runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
    },
    flagOverrides: {
      2: { gridX: 10, gridY: 3 }
    }
  }
};
