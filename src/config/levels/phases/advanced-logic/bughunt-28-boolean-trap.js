import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { BUGHUNT_28_STARTER_XML } from "../../shared/bugHuntXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";

export default {
  id: "bughunt-28",
  levelKind: "bug_hunt",
  title: "Bug Hunt: Boolean Trap",
  description: "A boolean operator is too eager, so the freeze fires before both facts are true.",
  introText: "This is a repair checkpoint for Field Decisions. The shape is almost right, but the boolean choice needs to wait for both truths at the same time.",
  tips: [
    "If a boolean uses OR where AND is needed, it can fire much too early.",
    "Think about what should be true together before the freeze happens.",
    "The bug is in the boolean choice, not in the rest of the pathing."
  ],
  mode: GAME_MODES.PLAYER_VS_NPC,
  mapKey: "simpleAisle",
  humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
  toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS],
  initialBlocklyXml: BUGHUNT_28_STARTER_XML,
  winCondition: { type: "runner_reaches_enemy_flag", runnerId: "runner_1_AI_AllyP1" },
  failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
  tutorialSteps: [
    {
      id: "bughunt-28-trace",
      title: "Trace The Boolean",
      body: "Read the condition piece by piece. The branch should wait until the ally is close enough and the freeze is still ready.",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-28-fix",
      title: "Repair The Gate",
      body: "The starter is intentionally using the wrong boolean shape. Swap the operator so both facts have to be true before the special action runs.",
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
          { slot: "npc1", gridX: 3, gridY: 4 },
          { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
        ]
      }
    },
    flags: { opponent: { gridX: 11, gridY: 4 } }
  }
};
