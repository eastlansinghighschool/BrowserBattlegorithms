import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS } from "../../../constants.js";
import { BUGHUNT_37_STARTER_XML } from "../../shared/bugHuntXml.js";

export default {
  id: "bughunt-37",
  levelKind: "bug_hunt",
  title: "Bug Hunt: Role Split",
  description: "Two allies are crowding the same lane.",
  introText: "The shared starter sends both allies toward the same ground. Trace the runner-index branches and find where their jobs stop being different.",
  tips: [
    "Runner index is what lets one program mean different jobs for different allies.",
    "When two allies chase the same target, check whether one index lost its own branch.",
    "Repair the local jobs without adding a second program."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_BOOLEAN,
    BLOCK_TYPES.IF_BOOLEAN_ELSE,
    BLOCK_TYPES.VALUE_COMPARE,
    BLOCK_TYPES.VALUE_RUNNER_INDEX,
    BLOCK_TYPES.VALUE_NUMBER,
    BLOCK_TYPES.MOVE_TOWARD,
    BLOCK_TYPES.STAY_STILL
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG],
  initialBlocklyXml: BUGHUNT_37_STARTER_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 20 },
  // 2-star max: role split debugging repair.
  starCriteria: {
    turnPar: 14
  },
  tutorialSteps: [
    {
      id: "bughunt-37-trace",
      title: "Trace The Roles",
      body: "Trace each runner index through the shared program. Where do the two allies begin making the same choice?",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-37-fix",
      title: "Split The Jobs",
      body: "One branch is sending both runners to the same ground. Repair the split so each index has its own local job.",
      targetSelector: "#canvas-container"
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
          { slot: "ally", gridX: 1, gridY: 2 },
          { slot: "ally2", gridX: 1, gridY: 5 }
        ]
      },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    },
    flags: { opponent: { gridX: 10, gridY: 5 } }
  }
};
