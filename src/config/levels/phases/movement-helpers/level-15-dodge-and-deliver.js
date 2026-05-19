import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { GENERIC_SENSOR_BLOCKS, MOVE_TOWARD_BLOCKS, JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "dodge-and-deliver",
  levelKind: "challenge",
  title: "Challenge 15: Dodge and Deliver",
  description: "Pick up the enemy flag and bring it home while one defender guards the lane and another enemy keeps moving.",
  introText: "No new tools this time. One enemy holds the lane near the flag, and another keeps moving. Use what you know.",
  tips: [
    "One enemy guards the lane while another keeps moving. Watch both threats.",
    "Checking the enemy's distance before committing to a direction can help you plan a safer route.",
    "The enemy flag needs to come all the way back home to score a point."
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
    SENSOR_OBJECT_TYPES.BARRIER,
    SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
    SENSOR_OBJECT_TYPES.ENEMY_FLAG
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.WITHIN_2,
    SENSOR_RELATION_TYPES.WITHIN_3,
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 40 },
  tutorialSteps: [
    {
      id: "dodge-and-deliver-real-game",
      title: "A Real Game Situation",
      body: "This is a real game situation — one enemy guards the lane and another keeps moving. Your program needs to make progress while staying out of trouble.",
      targetSelector: "#canvas-container"
    },
    {
      id: "dodge-and-deliver-toolkit",
      title: "Your Full Toolkit",
      body: "All the tools from the previous levels are here. There is no single right answer — think about how your ally should balance chasing the flag and handling both threats.",
      targetSelector: "#blockly-region"
    }
  ],
  setup: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: {
        playDirection: -1,
        runners: [
          { slot: "npc1", gridX: 7, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_STAY_STILL },
          { slot: "npc2", gridX: 8, gridY: 6, cpuBehavior: NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY }
        ]
      }
    },
    flags: { opponent: { gridX: 10, gridY: 4 } }
  }
};
