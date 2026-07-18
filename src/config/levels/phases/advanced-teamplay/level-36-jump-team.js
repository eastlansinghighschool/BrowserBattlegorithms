import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { STARTER_EVENT_XML } from "../../shared/blocklyXml.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";
import { TEAM_STRATEGY_SCRIPT_PROJECT, createProjectMetadata } from "../../shared/project.js";

export default {
  id: "jump-team",
  title: "Level 36: Jump Team",
  description: "A wall splits the two allies as they leave home.",
  introText: "One ally can jump the wall while the other faces a different lane. Runner index gives each runner a useful response.",
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  project: createProjectMetadata(TEAM_STRATEGY_SCRIPT_PROJECT, 8),
  toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: STARTER_EVENT_XML,
  winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 4 } },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 15 },
  tutorialSteps: [
    { id: "level-34-jump-role", title: "Give The Jump To One Ally", body: "Runner index can send one ally to a jump branch while the other follows a different rule around the wall.", targetSelector: "#blockly-region" },
    { id: "level-34-wall", title: "Two Sides Of The Wall", body: "The wall puts the allies in different situations. Decide what each runner should notice from its own lane.", targetSelector: "#canvas-container" }
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
