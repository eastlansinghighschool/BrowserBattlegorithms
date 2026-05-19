import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, AREA_FREEZE_DURATION_TURNS, AREA_FREEZE_RADIUS, MAIN_GAME_STATES } from "../../src/config/constants.js";
import { buildAreaFreezeEffect } from "../../src/core/areaFreeze.js";
import { resetRound } from "../../src/core/setup.js";
import { processTurnActions } from "../../src/core/turnEngine.js";
import { Runner } from "../../src/entities/Runner.js";
import { buildMatch } from "./helpers/builders.js";
import { TEST_P5 } from "./helpers/testHarness.js";

function createMockP() {
  const calls = [];
  const p = {
    CENTER: "CENTER",
    LEFT: "LEFT",
    BOLD: "BOLD",
    CLOSE: "CLOSE"
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
    "translate",
    "scale",
    "rect",
    "line",
    "beginShape",
    "vertex",
    "endShape",
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

test("buildAreaFreezeEffect captures the caster, affected runners, and snapshot metadata", () => {
  const caster = new Runner(4, 3, 1, false, "caster");
  const frozenRunner = new Runner(5, 3, 2, false, "target");
  frozenRunner.setFrozen(AREA_FREEZE_DURATION_TURNS);

  const effect = buildAreaFreezeEffect(
    { currentTurnNumber: 12, startedAtMs: 1234 },
    caster,
    [frozenRunner]
  );

  assert.ok(effect);
  assert.equal(effect.effectKey, `12-${caster.id}-1234`);
  assert.equal(effect.casterRunnerId, caster.id);
  assert.equal(effect.casterTeamId, 1);
  assert.deepEqual(effect.casterCell, { x: 4, y: 3 });
  assert.equal(effect.radius, AREA_FREEZE_RADIUS);
  assert.equal(effect.durationMs, 600);
  assert.equal(effect.affectedRunners.length, 1);
  assert.deepEqual(effect.affectedRunners[0], {
    runnerId: frozenRunner.id,
    teamId: 2,
    cellX: 5,
    cellY: 3,
    frozenTurnsRemaining: AREA_FREEZE_DURATION_TURNS
  });
});

test("Runner.display renders a frozen countdown badge with or without a numeric countdown", () => {
  const runner = new Runner(2, 2, 1, false, "badge");
  const { p, calls } = createMockP();

  runner.setFrozen(AREA_FREEZE_DURATION_TURNS);
  runner.display(p, {
    areaFreezeEffect: {
      startedAtMs: Date.now(),
      durationMs: 600,
      affectedRunners: [{ runnerId: runner.id }]
    }
  });

  assert.ok(calls.some((call) => call.method === "text" && call.args[0] === `❄ ${AREA_FREEZE_DURATION_TURNS}`));
  assert.ok(calls.some((call) => call.method === "rect"), "frozen runner should draw a badge background");

  const infinityRunner = new Runner(2, 2, 1, false, "infinite");
  const infiniteRender = createMockP();
  infinityRunner.setFrozen(Number.POSITIVE_INFINITY);
  infinityRunner.display(infiniteRender.p, null);

  assert.ok(infiniteRender.calls.some((call) => call.method === "text" && call.args[0] === "❄"));
  assert.ok(!infiniteRender.calls.some((call) => call.method === "text" && call.args[0] === `❄ ${AREA_FREEZE_DURATION_TURNS}`));
});

test("successful freeze via processTurnActions creates areaFreezeEffect on state", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((r) => r.team === 1 && !r.isHumanControlled && !r.isNPC);
  const enemy = app.state.allRunners.find((r) => r.team === 2);
  actor.gridX = 5;
  actor.gridY = 4;
  enemy.gridX = 6;
  enemy.gridY = 4;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(actor);
  app.state.currentTurnNumber = 1;
  app.state.queuedActionForCurrentRunner = {
    runner: actor,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    targetGridX: actor.gridX,
    targetGridY: actor.gridY
  };
  processTurnActions(app, TEST_P5);

  assert.ok(app.state.areaFreezeEffect, "successful freeze should set areaFreezeEffect on state");
  assert.ok(app.state.areaFreezeEffect.effectKey, "areaFreezeEffect should have an effectKey");
  assert.deepEqual(app.state.areaFreezeEffect.casterCell, { x: 5, y: 4 });
  assert.equal(app.state.areaFreezeEffect.durationMs, 600);
  assert.equal(app.state.areaFreezeEffect.affectedRunners.length, 1);
});

test("unavailable freeze attempt does not create or replace areaFreezeEffect", () => {
  const app = buildMatch();
  const actor = app.state.allRunners.find((r) => r.team === 1 && !r.isHumanControlled && !r.isNPC);

  const sentinelEffect = { effectKey: "sentinel-effect" };
  app.state.areaFreezeEffect = sentinelEffect;
  app.state.currentTurnNumber = 1;
  app.state.teamAreaFreezeNextAvailableTurn[1] = 99;

  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = "PROCESSING_ACTION";
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(actor);
  app.state.queuedActionForCurrentRunner = {
    runner: actor,
    actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS,
    targetGridX: actor.gridX,
    targetGridY: actor.gridY
  };
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.areaFreezeEffect, sentinelEffect, "existing areaFreezeEffect must not be replaced when freeze is on cooldown");
});

test("resetRound clears areaFreezeEffect", () => {
  const app = buildMatch();
  app.state.areaFreezeEffect = { effectKey: "effect-to-clear" };
  resetRound(app.state);
  assert.equal(app.state.areaFreezeEffect, null, "resetRound should clear areaFreezeEffect");
});
