import { BLOCK_TYPES, SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES, GAME_MODES, HUMAN_TURN_BEHAVIORS, MOVE_TOWARD_TARGETS, NPC_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_CAPSTONE_BLOCKS } from "../../shared/toolboxes.js";
import { STRATEGY_BRAIN_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "full-team-tactics",
  levelKind: "challenge",
  title: "Challenge 28: Full Team Tactics",
  description: "Put your complete Strategy Brain to the test against live defenders.",
  introText: "This is the final solo test of the Strategy Brain project. Three defenders are live, and your shared program should now do the whole job before team programming begins.",
  tips: [
    "You have the full Strategy Brain toolkit — sensing, territory, NOT, freeze, barriers, and more.",
    "Think about which tools matter most when an enemy is nearby and the whole program has to carry the run.",
    "The next project changes everything — two allies will share one program."
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
      title: "One Last Solo Challenge",
      body: "This is the capstone for your Strategy Brain. Use any part of the single-ally toolkit to score against live defenders.",
      targetSelector: "#canvas-container"
    },
    {
      id: "full-team-tactics-next",
      title: "What Comes Next",
      body: "You have written programs that sense, decide, and use special actions. The next challenge asks you to do this for three enemies at once, but now with your ally as a teammate to your human runner.",
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
