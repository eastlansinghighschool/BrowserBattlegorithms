import test from "node:test";
import assert from "node:assert/strict";
import { SENSOR_OBJECT_TYPES, SENSOR_RELATION_TYPES } from "../../src/config/constants.js";
import { countObjectsWithin, evaluateSensorCondition } from "../../src/core/conditions.js";
import { buildMatch } from "./helpers/builders.js";
import { buildBlocklyAppWithXml } from "./helpers/testHarness.js";
import { buildSolutionXml } from "./fixtures/guidedReferenceSolutions.js";
import { getFirstRunnableActionWithTrace } from "../../src/ai/blockly/workspace.js";

function getRunner(app, id = "runner_1_AI_AllyP1") {
  return app.state.allRunners.find((runner) => runner.id === id);
}

function traceFields(trace) {
  return trace.map((step) => ({
    blockType: step.blockType,
    kind: step.kind,
    result: step.result,
    numericLeft: step.numericLeft,
    numericRight: step.numericRight,
    runnerId: step.runnerId,
    runnerTeam: step.runnerTeam
  }));
}

test("countObjectsWithin returns zero when nothing is within range and counts at the boundary", () => {
  const app = buildMatch();
  const actor = getRunner(app);
  actor.gridX = 3;
  actor.gridY = 3;

  assert.equal(countObjectsWithin(app.state, actor, SENSOR_OBJECT_TYPES.BARRIER, 1), 0);

  const frozenEnemy = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  frozenEnemy.gridX = 4;
  frozenEnemy.gridY = 3;
  frozenEnemy.isFrozen = true;

  const activeEnemy = { ...frozenEnemy, id: "runner_9_Npc9", gridX: 5, gridY: 3, isFrozen: false };
  app.state.allRunners.push(activeEnemy);

  app.state.barriers.push({ id: "barrier-count", gridX: 3, gridY: 6, ownerRunnerId: "barrier-count" });

  assert.equal(countObjectsWithin(app.state, actor, SENSOR_OBJECT_TYPES.ENEMY_RUNNER, 1), 1);
  assert.equal(countObjectsWithin(app.state, actor, SENSOR_OBJECT_TYPES.ENEMY_RUNNER, 2), 2);
  assert.equal(countObjectsWithin(app.state, actor, SENSOR_OBJECT_TYPES.BARRIER, 2), 0);
  assert.equal(countObjectsWithin(app.state, actor, SENSOR_OBJECT_TYPES.BARRIER, 3), 1);
});

test("countObjectsWithin excludes the evaluator for ally and human counts", () => {
  const app = buildMatch();
  const ally = getRunner(app);
  ally.gridX = 2;
  ally.gridY = 2;

  const farAlly = {
    id: "runner_9_AI_AllyP9",
    team: 1,
    gridX: 5,
    gridY: 5,
    isHumanControlled: false,
    isNPC: false,
    isFrozen: false,
    playDirection: ally.playDirection
  };
  app.state.allRunners.push(farAlly);

  assert.equal(countObjectsWithin(app.state, ally, SENSOR_OBJECT_TYPES.ALLY_RUNNER, 1), 0);

  const human = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  human.gridX = 4;
  human.gridY = 4;
  assert.equal(countObjectsWithin(app.state, human, SENSOR_OBJECT_TYPES.HUMAN_RUNNER, 1), 0);
});

test("boolean sensor exposes ally runners through the existing dropdown logic", () => {
  const app = buildMatch();
  const actor = getRunner(app);
  actor.gridX = 3;
  actor.gridY = 3;

  const teammate = {
    id: "runner_9_AI_AllyP9",
    team: 1,
    gridX: 4,
    gridY: 3,
    isHumanControlled: false,
    isNPC: false,
    isFrozen: false,
    playDirection: actor.playDirection
  };
  app.state.allRunners.push(teammate);

  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.ALLY_RUNNER, SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT),
    true
  );

  teammate.gridX = 3;
  teammate.gridY = 4;
  assert.equal(
    evaluateSensorCondition(app.state, actor, SENSOR_OBJECT_TYPES.ALLY_RUNNER, SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT),
    false
  );
});

test("count-within block feeds compare blocks and records a value trace step", () => {
  const app = buildBlocklyAppWithXml(
    buildSolutionXml(`
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_count_within">
                <field name="OBJECT">BARRIER</field>
                <field name="DISTANCE">2</field>
              </block>
            </value>
            <field name="OPERATOR">GT</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">1</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_forward"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_backward"></block>
        </statement>
      </block>
    `)
  );
  app.state = buildMatch().state;
  const actor = getRunner(app);
  actor.gridX = 3;
  actor.gridY = 3;

  app.state.barriers.push({ id: "barrier-a", gridX: 4, gridY: 3, ownerRunnerId: "barrier-a" });
  app.state.barriers.push({ id: "barrier-b", gridX: 3, gridY: 4, ownerRunnerId: "barrier-b" });

  const traced = getFirstRunnableActionWithTrace(app, actor);
  assert.equal(traced.action.type, "MOVE_FORWARD");
  assert.deepEqual(traceFields(traced.trace).slice(0, 3), [
    {
      blockType: "battlegorithms_value_count_within",
      kind: "value",
      result: 2,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_value_compare",
      kind: "comparison",
      result: true,
      numericLeft: 2,
      numericRight: 1,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_if_boolean_else",
      kind: "condition",
      result: true,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    }
  ]);
});
