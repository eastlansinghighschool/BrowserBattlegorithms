import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { ADVANCED_ALL_BLOCKS, JUMP_CONDITION_BLOCKS, JUMP_BLOCKS, EXTENDED_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "jump-team",
  title: "Level 36: Jump Team",
  description: "One ally uses the jump route while another takes a support path.",
  introText: "Resources can be assigned by role too. This level gives one ally the dramatic jump job, but that jumper still has to keep moving afterward, using the same shared script as the rest of the team.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 8),
  toolboxBlockTypes: [...ADVANCED_ALL_BLOCKS, ...JUMP_CONDITION_BLOCKS, ...JUMP_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
  tutorialSteps: [
    { id: "level-34-jump-role", title: "Give The Jump To One Ally", body: "Index can decide which ally gets the jump job and which ally avoids the obstacle.", targetSelector: "#blockly-region" },
    { id: "level-34-wall", title: "One Dramatic Leap", body: "Only one ally should take the jump route. The second ally needs a different role, so the script stays decentralized.", targetSelector: "#canvas-container" }
  ],
  setupOverrides: {
    pointsToWin: 1,
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    barriers: [
      { gridX: 2, gridY: 3, ownerRunnerId: "phase8_jump_wall_top" },
      { gridX: 2, gridY: 4, ownerRunnerId: "phase8_jump_wall_mid" },
      { gridX: 2, gridY: 5, ownerRunnerId: "phase8_jump_wall_low" }
    ],
    teams: {
      player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }, { slot: "ally2", gridX: 1, gridY: 6 }] },
      opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
    }
  }
};
