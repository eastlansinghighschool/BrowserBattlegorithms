import test from "node:test";
import assert from "node:assert/strict";
import { COLS, ROWS } from "../../src/config/constants.js";
import { buildInspectorLines, getSideLabel } from "../../src/ui/cellInspectorOverlay.js";
import { FREE_PLAY_MODES } from "../../src/config/gameModes.js";

// Helper to create a mock minimal state/app context
function createMockContext() {
  const state = {
    freePlayMode: null,
    currentLevelId: "test-level",
    levels: [
      {
        id: "test-level",
        winCondition: {
          type: "runner_reaches_cell",
          targetCell: { x: 5, y: 5 }
        }
      }
    ],
    teams: {
      1: { flagHome: { x: 0, y: 4 }, flagEmoji: "🚩" },
      2: { flagHome: { x: 11, y: 4 }, flagEmoji: "🏁" }
    },
    gameFlags: {
      1: { gridX: 0, gridY: 4, teamId: 1, carriedByRunnerId: null },
      2: { gridX: 11, gridY: 4, teamId: 2, carriedByRunnerId: null }
    },
    barriers: [],
    allRunners: []
  };

  const app = {
    state
  };

  // Add getters to state/app to match real structure
  state.currentModeView = "GUIDED_LEVELS";

  return { state, app };
}

test("buildInspectorLines - returns null for out of bounds cell", () => {
  const { state, app } = createMockContext();
  assert.equal(buildInspectorLines(state, app, -1, 0), null);
  assert.equal(buildInspectorLines(state, app, COLS, 0), null);
  assert.equal(buildInspectorLines(state, app, 0, -1), null);
  assert.equal(buildInspectorLines(state, app, 0, ROWS), null);
});

test("buildInspectorLines - returns basic coordinate for empty cell", () => {
  const { state, app } = createMockContext();
  const lines = buildInspectorLines(state, app, 2, 2);
  assert.deepEqual(lines, ["Cell: (2, 2)"]);
});

test("buildInspectorLines - handles level goal", () => {
  const { state, app } = createMockContext();
  // Level goal is set at (5, 5)
  const lines = buildInspectorLines(state, app, 5, 5);
  assert.deepEqual(lines, ["Cell: (5, 5)", "Level goal"]);
});

test("buildInspectorLines - handles flag base", () => {
  const { state, app } = createMockContext();
  // Flag base of Team 1 is at (0, 4)
  const lines = buildInspectorLines(state, app, 0, 4);
  assert.equal(lines.includes("Team 1 flag base"), true);
});

test("buildInspectorLines - handles flags and carriers", () => {
  const { state, app } = createMockContext();
  // Set flag 2 at (3, 3)
  state.gameFlags[2].gridX = 3;
  state.gameFlags[2].gridY = 3;

  const lines1 = buildInspectorLines(state, app, 3, 3);
  assert.deepEqual(lines1, ["Cell: (3, 3)", "Team 2 flag"]);

  // Set flag 2 carried by runner
  const runner = {
    id: "runner_1_AI_AllyP1",
    gridX: 3,
    gridY: 3,
    team: 1,
    isHumanControlled: false,
    isNPC: false,
    allyIndex: 0
  };
  state.allRunners.push(runner);
  state.gameFlags[2].carriedByRunnerId = runner.id;

  const lines2 = buildInspectorLines(state, app, 3, 3);
  assert.equal(lines2.includes("Team 2 flag"), true);
  assert.equal(lines2.includes("  carried by ally runner"), true);
});

test("buildInspectorLines - handles barriers", () => {
  const { state, app } = createMockContext();
  
  // Placed barrier with no owner or unregistered owner
  state.barriers.push({ gridX: 4, gridY: 4, ownerRunnerId: "unknown" });
  let lines = buildInspectorLines(state, app, 4, 4);
  assert.equal(lines.includes("Barrier"), true);

  // Placed barrier with valid owner
  const owner = { id: "runner_1_HumanP1", gridX: 1, gridY: 1, team: 1 };
  state.allRunners.push(owner);
  state.barriers = [{ gridX: 4, gridY: 4, ownerRunnerId: owner.id }];
  lines = buildInspectorLines(state, app, 4, 4);
  assert.equal(lines.includes("Barrier (placed by Team 1)"), true);
});

test("buildInspectorLines - handles runner categories", () => {
  const { state, app } = createMockContext();

  const human = {
    id: "h1",
    gridX: 2,
    gridY: 2,
    team: 1,
    isHumanControlled: true,
    isNPC: false
  };
  const npc = {
    id: "n1",
    gridX: 2,
    gridY: 2,
    team: 2,
    isHumanControlled: false,
    isNPC: true
  };
  const allyIndex0 = {
    id: "a0",
    gridX: 2,
    gridY: 2,
    team: 1,
    isHumanControlled: false,
    isNPC: false,
    allyIndex: 0
  };
  const allyNoIndex = {
    id: "aX",
    gridX: 2,
    gridY: 2,
    team: 1,
    isHumanControlled: false,
    isNPC: false,
    allyIndex: null
  };

  state.allRunners.push(human, npc, allyIndex0, allyNoIndex);

  const lines = buildInspectorLines(state, app, 2, 2);
  assert.equal(lines.includes("Ally human player"), true);
  assert.equal(lines.includes("Enemy NPC runner"), true);
  assert.equal(lines.includes("Ally runner #0"), true);
  assert.equal(lines.includes("Ally runner"), true);
});

test("buildInspectorLines - handles runner resource and status lines", () => {
  const { state, app } = createMockContext();

  const runner = {
    id: "r1",
    gridX: 2,
    gridY: 2,
    team: 1,
    isHumanControlled: false,
    isNPC: false,
    allyIndex: 0,
    isFrozen: true,
    frozenTurnsRemaining: 2,
    hasEnemyFlag: true,
    canJump: false,
    canPlaceBarrier: true,
    activeBarrierId: "b1" // barrier placed, so barrier resource is spent
  };
  state.allRunners.push(runner);

  const lines = buildInspectorLines(state, app, 2, 2);
  assert.equal(lines.includes("  Frozen (2 turns remaining)"), true);
  assert.equal(lines.includes("  Carrying flag"), true);
  assert.equal(lines.includes("  Jump: used this round"), true);
  assert.equal(lines.includes("  Barrier: used this round"), true);

  // Recharge jump and reclaim barrier
  runner.canJump = true;
  runner.activeBarrierId = null;
  const lines2 = buildInspectorLines(state, app, 2, 2);
  assert.equal(lines2.includes("  Jump: available"), true);
  assert.equal(lines2.includes("  Barrier: available"), true);
});

test("getSideLabel - matches PvP vs standard mode rules", () => {
  const state = { freePlayMode: null };
  assert.equal(getSideLabel(state, 1), "Ally");
  assert.equal(getSideLabel(state, 2), "Enemy");

  state.freePlayMode = FREE_PLAY_MODES.PLAYER_VS_PLAYER;
  assert.equal(getSideLabel(state, 1), "Team 1");
  assert.equal(getSideLabel(state, 2), "Team 2");
});
