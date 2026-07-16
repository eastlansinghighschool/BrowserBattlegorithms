import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_CAPSTONE_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "full-team-tactics",
  levelKind: "challenge",
  title: "Challenge 28: Full Team Tactics",
  description: "Work beside your Blockly ally against three defenders.",
  introText: "Drive the human runner with the keys while one Blockly ally follows its saved program. Three defenders guard the far side.",
  tips: [
    "Your ally carries the Field Decisions toolkit: sensing, territory, NOT, freeze, barriers, and more.",
    "Watch the defenders and choose the rules that give your ally room to work.",
    "Ahead: Team Strategy Script puts one shared program on several allies. Runner index gives them different jobs."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT,
  project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 6, { isCapstone: true }),
  toolboxBlockTypes: [...ADVANCED_CAPSTONE_BLOCKS],
  sensorObjectTypes: [
    SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
    SENSOR_OBJECT_TYPES.BARRIER,
    SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
    SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
    SENSOR_OBJECT_TYPES.ENEMY_FLAG,
    SENSOR_OBJECT_TYPES.ALLY_RUNNER
  ],
  sensorRelationTypes: [
    SENSOR_RELATION_TYPES.WITHIN_2,
    SENSOR_RELATION_TYPES.WITHIN_3,
    SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
    SENSOR_RELATION_TYPES.DIRECTLY_BEHIND,
    SENSOR_RELATION_TYPES.DIRECTLY_ABOVE,
    SENSOR_RELATION_TYPES.DIRECTLY_BELOW,
    SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
    SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
    SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
    SENSOR_RELATION_TYPES.ANYWHERE_BELOW
  ],
  moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "team_scores_point", teamId: 1 },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 60 },
  tutorialSteps: [
    {
      id: "full-team-tactics-last-solo",
      title: "Human Plus Ally Capstone",
      body: "Drive the human runner with the keys while one Blockly ally follows its saved program. Work the same field together.",
      targetSelector: "#canvas-container"
    },
    {
      id: "full-team-tactics-next",
      title: "What Comes Next",
      body: "Field Decisions gives one ally local rules. Next, Team Strategy Script uses runner index so one shared program can give several allies different jobs.",
      targetSelector: "#blockly-region"
    }
  ],
  setupOverrides: {
    pointsToWin: 1,
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
      opponent: {
        playDirection: -1, runners: [
          { slot: "npc1", gridX: 8, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY },
          { slot: "npc2", gridX: 6, gridY: 4, cpuBehavior: NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY },
          { slot: "npc3", gridX: 9, gridY: 2 }
        ]
      }
    },
    flags: { opponent: { gridX: 10, gridY: 4 } }
  }
};
