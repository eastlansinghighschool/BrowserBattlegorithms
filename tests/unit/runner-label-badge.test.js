import test from "node:test";
import assert from "node:assert/strict";
import { CELL_SIZE } from "../../src/config/constants.js";
import { drawIndexLabel, drawRunnerLabelBadge } from "../../src/render/effects.js";
import { Runner } from "../../src/entities/Runner.js";

function createMockP() {
  const calls = [];
  const p = {
    CENTER: "CENTER",
    LEFT: "LEFT",
    BOLD: "BOLD"
  };

  for (const method of [
    "push",
    "pop",
    "fill",
    "noFill",
    "stroke",
    "noStroke",
    "strokeWeight",
    "textAlign",
    "textSize",
    "textStyle",
    "rect",
    "text"
  ]) {
    p[method] = (...args) => {
      calls.push({ method, args });
      return p;
    };
  }

  p.textWidth = (value) => String(value).length * 6;
  return { p, calls };
}

test("drawRunnerLabelBadge - no-op when showRunnerIndexBadges is false or undefined", () => {
  const runner = new Runner(1, 1, 1, false, "r1");
  runner.allyIndex = 0;
  
  const { p, calls } = createMockP();
  
  // Case 1: state is undefined
  drawRunnerLabelBadge(p, runner, undefined);
  assert.equal(calls.length, 0);

  // Case 2: state.showRunnerIndexBadges is false
  drawRunnerLabelBadge(p, runner, { showRunnerIndexBadges: false });
  assert.equal(calls.length, 0);
});

test("drawRunnerLabelBadge - resolves correct index and team colors", () => {
  const runner = new Runner(2, 3, 1, false, "r1");
  runner.allyIndex = 3;
  runner.pixelX = 80;
  runner.pixelY = 120;

  const state = {
    showRunnerIndexBadges: true,
    teams: {
      1: {
        glowColorStroke: [0, 0, 255],
        glowColorFill: [0, 0, 255]
      }
    }
  };

  const { p, calls } = createMockP();
  drawRunnerLabelBadge(p, runner, state);

  // Should have drawn the text "3"
  const textCall = calls.find((c) => c.method === "text");
  assert.ok(textCall);
  assert.equal(textCall.args[0], "3");

  // Should fill with [0, 0, 255, 128] (tinted team stroke color)
  const fillCall = calls.find((c) => c.method === "fill" && c.args[3] === 128);
  assert.ok(fillCall);
  assert.deepEqual(fillCall.args.slice(0, 3), [0, 0, 255]);
});

test("drawRunnerLabelBadge - falls back to array index when allyIndex is null", () => {
  const r0 = new Runner(0, 0, 2, false, "npc0"); // NPC runner, allyIndex is null
  const r1 = new Runner(1, 1, 2, false, "npc1");
  r0.pixelX = 0;
  r0.pixelY = 0;
  r1.pixelX = 40;
  r1.pixelY = 40;

  const state = {
    showRunnerIndexBadges: true,
    allRunners: [r0, r1],
    teams: {
      2: {
        glowColorStroke: [255, 0, 0],
        glowColorFill: [255, 0, 0]
      }
    }
  };

  const { p, calls } = createMockP();
  drawRunnerLabelBadge(p, r1, state);

  // R1 is at index 1 of the team 2 runners list
  const textCall = calls.find((c) => c.method === "text");
  assert.ok(textCall);
  assert.equal(textCall.args[0], "1");
});

test("drawRunnerLabelBadge - calculates correct position for default, frozen-non-human, frozen-human, and non-frozen-human states", () => {
  const state = {
    showRunnerIndexBadges: true,
    teams: {
      1: {
        glowColorStroke: [0, 255, 0],
        glowColorFill: [0, 255, 0]
      }
    }
  };

  const badgeHeight = 14;

  // Case 1: Default position — non-frozen, non-human (upper-left).
  //   Index badge sits above the runner's feet; frozen countdown badge uses lower-left, no overlap.
  {
    const runner = new Runner(1, 1, 1, false, "r1");
    runner.allyIndex = 0;
    runner.pixelX = 40;
    runner.pixelY = 40;

    const { p, calls } = createMockP();
    drawRunnerLabelBadge(p, runner, state);

    const rectCall = calls.find((c) => c.method === "rect");
    assert.ok(rectCall);
    assert.equal(rectCall.args[0], 43); // pixelX + 3
    assert.equal(rectCall.args[1], 43); // upper-left: pixelY + 3
  }

  // Case 2: Frozen, non-human — still uses default upper-left (same as non-frozen).
  //   The frozen countdown badge is at lower-left (pixelY + CELL_SIZE - badgeHeight - 3),
  //   so upper-left avoids overlap.
  {
    const runner = new Runner(1, 1, 1, false, "r2");
    runner.allyIndex = 0;
    runner.pixelX = 40;
    runner.pixelY = 40;
    runner.isFrozen = true;

    const { p, calls } = createMockP();
    drawRunnerLabelBadge(p, runner, state);

    const rectCall = calls.find((c) => c.method === "rect");
    assert.ok(rectCall);
    assert.equal(rectCall.args[0], 43); // pixelX + 3
    assert.equal(rectCall.args[1], 43); // upper-left: pixelY + 3, same as default
  }

  // Case 3: Frozen, human — midline (avoids upper-left P1/P2 label in PvP)
  {
    const runner = new Runner(1, 1, 1, true, "human-frozen");
    runner.pixelX = 40;
    runner.pixelY = 40;
    runner.isFrozen = true;

    state.allRunners = [runner];

    const { p, calls } = createMockP();
    drawRunnerLabelBadge(p, runner, state);

    const rectCall = calls.find((c) => c.method === "rect");
    assert.ok(rectCall);
    assert.equal(rectCall.args[0], 43); // pixelX + 3
    assert.equal(rectCall.args[1], 40 + (CELL_SIZE - badgeHeight) / 2); // midline: 53
  }

  // Case 4: Non-frozen, human — midline (same displacement rule as frozen human)
  {
    const runner = new Runner(1, 1, 1, true, "human-active");
    runner.pixelX = 40;
    runner.pixelY = 40;

    state.allRunners = [runner];

    const { p, calls } = createMockP();
    drawRunnerLabelBadge(p, runner, state);

    const rectCall = calls.find((c) => c.method === "rect");
    assert.ok(rectCall);
    assert.equal(rectCall.args[0], 43); // pixelX + 3
    assert.equal(rectCall.args[1], 40 + (CELL_SIZE - badgeHeight) / 2); // midline: 53
  }
});

test("drawRunnerLabelBadge - single namespace: human + code ally on same team show unique indices", () => {
  // A team with one code-controlled ally (allyIndex 0) and one human-controlled runner
  // (no allyIndex). The human should be numbered AFTER the ally in a single namespace,
  // so ally shows "0" and human shows "1". No duplicate "0" badges.
  const ally = new Runner(1, 1, 1, false, "ally0");
  ally.allyIndex = 0;
  ally.pixelX = 40;
  ally.pixelY = 40;

  const human = new Runner(2, 1, 1, true, "human");
  // allyIndex intentionally left null (isHumanControlled runner has no allyIndex)
  human.pixelX = 80;
  human.pixelY = 40;

  const state = {
    showRunnerIndexBadges: true,
    allRunners: [ally, human],
    teams: {
      1: {
        glowColorStroke: [0, 0, 255],
        glowColorFill: [0, 0, 255]
      }
    }
  };

  // Ally uses allyIndex directly → "0"
  const { p: pAlly, calls: callsAlly } = createMockP();
  drawRunnerLabelBadge(pAlly, ally, state);
  const allyText = callsAlly.find((c) => c.method === "text");
  assert.ok(allyText, "ally badge should draw text");
  assert.equal(allyText.args[0], "0", "ally with allyIndex 0 should show badge 0");

  // Human uses fallback: allyCount=1, nonAllyIndex=0 → index=1
  const { p: pHuman, calls: callsHuman } = createMockP();
  drawRunnerLabelBadge(pHuman, human, state);
  const humanText = callsHuman.find((c) => c.method === "text");
  assert.ok(humanText, "human badge should draw text");
  assert.equal(humanText.args[0], "1", "human runner on a team with 1 ally should show badge 1 (single namespace)");
});
