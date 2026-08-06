import { BLOCK_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES } from "../../../constants.js";
import { BUGHUNT_15_STARTER_XML } from "../../shared/bugHuntXml.js";
import { GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "bughunt-15",
  levelKind: "bug_hunt",
  title: "Bug Hunt: Flag Phase",
  description: "The starter takes the wrong flag-phase action. Trace its first branch.",
  introText: "The flag changes hands, but the starter sends the ally toward the wrong target. Find the reversal.",
  tips: [
    "Only the first reached action runs, so start at the top of the program.",
    "When the ally carries the enemy flag, a different target should matter.",
    "If the wrong branch runs first, the rest of the turn never gets a chance."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
    BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
    ...GENERIC_SENSOR_BLOCKS,
    ...MOVE_TOWARD_BLOCKS,
    ...JUMP_BLOCKS,
    ...EXTENDED_MOVEMENT_BLOCKS
  ],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.WITHIN_2,
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: BUGHUNT_15_STARTER_XML,
  winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 40 },
  // 2-star max: flag phase debugging repair.
  starCriteria: {
    turnPar: 21
  },
  tutorialSteps: [
    {
      id: "bughunt-15-trace",
      title: "Trace The First Branch",
      body: "The starter is intentionally wrong. Trace the first decision: does the ally head toward the flag or back home at the right time?",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-15-fix",
      title: "Repair The Flag Phase",
      body: "This is a debugging level, not a blank slate. Keep the shape, but repair the reversed target.",
      targetSelector: "#canvas-container"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 7, gridY: 3, cpuBehavior: NPC_BEHAVIORS.GUIDED_STAY_STILL },
          { slot: "npc2", gridX: 8, gridY: 6, cpuBehavior: NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY }
        ]
      }
    },
    flags: { opponent: { gridX: 10, gridY: 4 } }
  }
};
