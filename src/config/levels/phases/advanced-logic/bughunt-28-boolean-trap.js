import { GAME_MODES, HUMAN_TURN_BEHAVIORS } from "../../../constants.js";
import { BUGHUNT_28_STARTER_XML } from "../../shared/bugHuntXml.js";
import { STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS } from "../../shared/projectToolboxes.js";

export default {
  id: "bughunt-28",
  levelKind: "bug_hunt",
  title: "Bug Hunt: Boolean Trap",
  description: "The freeze gate opens before the field is ready.",
  introText: "A live defender starts in the lane, but the freeze branch opens too soon. Trace the two checks and repair the gate.",
  tips: [
    "A gate using OR can open when only one check is true.",
    "Ask which two facts must be true together before the freeze fires.",
    "The pathing is already there. Focus on the boolean gate."
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
      body: "Read the two checks piece by piece. Which facts should the freeze gate require together?",
      targetSelector: "#blockly-region"
    },
    {
      id: "bughunt-28-fix",
      title: "Repair The Gate",
      body: "The boolean gate has the wrong shape. Repair it so the freeze waits for the field you identified.",
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
