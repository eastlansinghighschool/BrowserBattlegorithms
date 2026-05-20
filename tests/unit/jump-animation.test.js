import test from "node:test";
import assert from "node:assert/strict";
import { CELL_SIZE } from "../../src/config/constants.js";
import { Runner } from "../../src/entities/Runner.js";
import { getJumpAnimationProgressIncrement, getJumpArcOffset, getJumpTakeoffLineOpacity } from "../../src/render/animation.js";
import { drawJumpDropShadow, drawJumpLandingDust, drawJumpTakeoffLines } from "../../src/render/effects.js";

function createMockP() {
  const calls = [];
  const p = {
    CENTER: "CENTER",
    LEFT: "LEFT",
    BOLD: "BOLD",
    CLOSE: "CLOSE",
    lerp(start, end, amount) {
      return start + (end - start) * amount;
    }
  };

  for (const method of [
    "push",
    "pop",
    "fill",
    "noFill",
    "stroke",
    "noStroke",
    "strokeWeight",
    "ellipse",
    "line",
    "circle",
    "rect",
    "translate",
    "textAlign",
    "textSize",
    "textStyle"
  ]) {
    p[method] = (...args) => {
      calls.push({ method, args });
      return p;
    };
  }

  return { p, calls };
}

function withReducedMotion(matches, callback) {
  const originalWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches })
  };
  try {
    callback();
  } finally {
    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  }
}

test("jump arc offset reaches the skipped-cell apex and returns to zero at landing", () => {
  assert.equal(getJumpArcOffset(0), 0);
  assert.equal(getJumpArcOffset(0.15), 0);
  assert.ok(getJumpArcOffset(0.25) < 0);
  assert.ok(Math.abs(getJumpArcOffset(0.575) + CELL_SIZE) < 1e-9);
  assert.ok(getJumpArcOffset(0.75) > getJumpArcOffset(0.575));
  assert.ok(Math.abs(getJumpArcOffset(1)) < 1e-9);
});

test("jump takeoff line opacity fades from full strength to invisible during the anticipation window", () => {
  assert.equal(getJumpTakeoffLineOpacity(0), 1);
  assert.equal(getJumpTakeoffLineOpacity(0.15), 1);
  assert.ok(Math.abs(getJumpTakeoffLineOpacity(0.2) - 0.5) < 1e-9);
  assert.equal(getJumpTakeoffLineOpacity(0.25), 0);
});

test("jump animation floor holds even at the fastest animation speed", () => {
  const runner = new Runner(2, 4, 1, false, "floor");
  runner.startJumpAnimation(4, 4);
  const increment = getJumpAnimationProgressIncrement(20);
  assert.ok(increment >= 0.104 && increment <= 0.105);
  let frames = 0;

  while (runner.isJumping && frames < 50) {
    runner.updateAnimation(20, {
      lerp(start, end, amount) {
        return start + (end - start) * amount;
      }
    });
    frames += 1;
  }

  assert.equal(runner.isJumping, false);
  assert.ok(frames >= 10);
});

test("failed jump reversal returns the runner to origin and still consumes jump availability", () => {
  const runner = new Runner(3, 4, 1, false, "failed");
  runner.startFailedJumpAnimation(5, 4);
  let completed = false;

  for (let frames = 0; frames < 50; frames += 1) {
    completed = runner.updateAnimation(20, {
      lerp(start, end, amount) {
        return start + (end - start) * amount;
      }
    });
    if (completed) {
      break;
    }
  }

  assert.equal(completed, true);
  assert.equal(runner.gridX, 3);
  assert.equal(runner.gridY, 4);
  assert.equal(runner.pixelX, 3 * CELL_SIZE);
  assert.equal(runner.pixelY, 4 * CELL_SIZE);
  assert.equal(runner.canJump, false);
  assert.equal(runner.isJumping, false);
  assert.equal(runner.animationCompletionType, "jump_failed");
});

test("reduced-motion jump visuals stay static for the shadow and one-frame cue for the takeoff lines and dust", () => {
  withReducedMotion(true, () => {
    const shadowRunner = new Runner(4, 3, 1, false, "shadow");
    shadowRunner.isJumping = true;
    shadowRunner.jumpGroundPixelX = 100;
    shadowRunner.jumpGroundPixelY = 150;
    shadowRunner.pixelX = 100;
    shadowRunner.pixelY = 126;

    const firstShadow = createMockP();
    drawJumpDropShadow(firstShadow.p, shadowRunner, 0);
    const secondShadow = createMockP();
    drawJumpDropShadow(secondShadow.p, shadowRunner, 0.8);

    const firstShadowEllipse = firstShadow.calls.find((call) => call.method === "ellipse");
    const secondShadowEllipse = secondShadow.calls.find((call) => call.method === "ellipse");
    assert.deepEqual(firstShadowEllipse?.args, secondShadowEllipse?.args);

    const takeoffRunner = new Runner(4, 3, 1, false, "takeoff");
    takeoffRunner.isJumping = true;
    takeoffRunner.jumpOriginPixelX = 100;
    takeoffRunner.jumpOriginPixelY = 150;

    const takeoffVisible = createMockP();
    drawJumpTakeoffLines(takeoffVisible.p, takeoffRunner, 0);
    assert.ok(takeoffVisible.calls.some((call) => call.method === "line"));

    const takeoffHidden = createMockP();
    drawJumpTakeoffLines(takeoffHidden.p, takeoffRunner, 0.05);
    assert.equal(takeoffHidden.calls.some((call) => call.method === "line"), false);

    const dustVisible = createMockP();
    drawJumpLandingDust(dustVisible.p, 3, 4, 0.05);
    assert.ok(dustVisible.calls.some((call) => call.method === "circle"));

    const dustHidden = createMockP();
    drawJumpLandingDust(dustHidden.p, 3, 4, 0.2);
    assert.equal(dustHidden.calls.some((call) => call.method === "circle"), false);
  });
});

test("movement animations toggle snap-to-target instantly when disabled", () => {
  const runner = new Runner(2, 4, 1, false, "move-snap");
  runner.startMoveAnimation(3, 4);

  const stateWithAnimationsDisabled = {
    runnerMovementAnimations: false
  };

  const completed = runner.updateAnimation(1, {
    lerp(start, end, amount) {
      return start + (end - start) * amount;
    }
  }, stateWithAnimationsDisabled);

  assert.equal(completed, true);
  assert.equal(runner.isMoving, false);
  assert.equal(runner.gridX, 3);
  assert.equal(runner.gridY, 4);
  assert.equal(runner.pixelX, 3 * CELL_SIZE);
  assert.equal(runner.pixelY, 4 * CELL_SIZE);
});

test("jumping animations toggle snap-to-target instantly when disabled", () => {
  const runner = new Runner(2, 4, 1, false, "jump-snap");
  runner.startJumpAnimation(4, 4);

  const stateWithJumpingDisabled = {
    runnerJumpingAnimations: false
  };

  const completed = runner.updateAnimation(1, {
    lerp(start, end, amount) {
      return start + (end - start) * amount;
    }
  }, stateWithJumpingDisabled);

  assert.equal(completed, true);
  assert.equal(runner.isJumping, false);
  assert.equal(runner.gridX, 4);
  assert.equal(runner.gridY, 4);
  assert.equal(runner.pixelX, 4 * CELL_SIZE);
  assert.equal(runner.pixelY, 4 * CELL_SIZE);
});
