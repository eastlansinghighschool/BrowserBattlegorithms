import test from "node:test";
import assert from "node:assert/strict";
import { AI_ACTION_TYPES, BLOCKLY_TRACE_SPEED_THRESHOLD, FREE_PLAY_MODES, GAME_VIEW_MODES, isBlocklyTraceCollectionActive } from "../../src/config/constants.js";
import { getAIAllyAction } from "../../src/ai/blockly/interpreter.js";
import { getFirstRunnableAction, getFirstRunnableActionWithTrace } from "../../src/ai/blockly/workspace.js";
import { buildMatch } from "./helpers/builders.js";
import { buildBlocklyAppWithXml } from "./helpers/testHarness.js";
import { buildSolutionXml } from "./fixtures/guidedReferenceSolutions.js";

/*
Trace step shape used in this packet:
{
  blockId,
  blockType,
  kind,
  result?,
  numericLeft?,
  numericRight?,
  runnerId,
  runnerTeam
}
*/

function buildTraceApp(xmlText) {
  const app = buildBlocklyAppWithXml(xmlText);
  app.state = buildMatch().state;
  return app;
}

function getAlly(app, id = "runner_1_AI_AllyP1") {
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

function cloneBlocklyAction(action) {
  return action ? JSON.parse(JSON.stringify(action)) : action;
}

test("Blockly trace collection helper gates on speed threshold", () => {
  assert.equal(isBlocklyTraceCollectionActive({ animationSpeedFactor: BLOCKLY_TRACE_SPEED_THRESHOLD }), true);
  assert.equal(isBlocklyTraceCollectionActive({ animationSpeedFactor: BLOCKLY_TRACE_SPEED_THRESHOLD + 0.01 }), false);
  assert.equal(isBlocklyTraceCollectionActive({}), false);
});

test("getFirstRunnableActionWithTrace matches action selection across representative programs", () => {
  const cases = [
    {
      name: "empty event block",
      xml: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="battlegorithms_on_each_turn" x="24" y="24"></block>
        </xml>
      `
    },
    {
      name: "single action",
      xml: buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`)
    },
    {
      name: "nested if",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_have_enemy_flag">
          <statement name="DO">
            <block type="battlegorithms_move_forward"></block>
          </statement>
          <next>
            <block type="battlegorithms_move_backward"></block>
          </next>
        </block>
      `),
      setup(app) {
        getAlly(app).hasEnemyFlag = true;
      }
    },
    {
      name: "if/else",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_have_enemy_flag_else">
          <statement name="DO">
            <block type="battlegorithms_move_forward"></block>
          </statement>
          <statement name="ELSE">
            <block type="battlegorithms_move_backward"></block>
          </statement>
        </block>
      `),
      setup(app) {
        getAlly(app).hasEnemyFlag = false;
      }
    },
    {
      name: "AND short circuit",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_logic_and">
              <value name="LEFT">
                <block type="battlegorithms_boolean_have_enemy_flag"></block>
              </value>
              <value name="RIGHT">
                <block type="battlegorithms_boolean_can_jump"></block>
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
      `),
      setup(app) {
        const ally = getAlly(app);
        ally.hasEnemyFlag = false;
        ally.canJump = true;
      }
    },
    {
      name: "OR short circuit",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_logic_or">
              <value name="LEFT">
                <block type="battlegorithms_boolean_have_enemy_flag"></block>
              </value>
              <value name="RIGHT">
                <block type="battlegorithms_boolean_can_jump"></block>
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
      `),
      setup(app) {
        const ally = getAlly(app);
        ally.hasEnemyFlag = true;
        ally.canJump = false;
      }
    },
    {
      name: "NOT",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_logic_not">
              <value name="VALUE">
                <block type="battlegorithms_boolean_have_enemy_flag"></block>
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
      `),
      setup(app) {
        getAlly(app).hasEnemyFlag = false;
      }
    },
    {
      name: "VALUE_COMPARE",
      xml: buildSolutionXml(`
        <block type="battlegorithms_if_boolean_else">
          <value name="BOOL">
            <block type="battlegorithms_value_compare">
              <value name="LEFT">
                <block type="battlegorithms_value_runner_index"></block>
              </value>
              <field name="OPERATOR">EQ</field>
              <value name="RIGHT">
                <block type="battlegorithms_value_number">
                  <field name="VALUE">0</field>
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
    }
  ];

  for (const testCase of cases) {
    const plainApp = buildTraceApp(testCase.xml);
    const tracedApp = buildTraceApp(testCase.xml);
    testCase.setup?.(plainApp);
    testCase.setup?.(tracedApp);

    const actorPlain = getAlly(plainApp);
    const actorTraced = getAlly(tracedApp);
    const plainAction = cloneBlocklyAction(getFirstRunnableAction(plainApp, actorPlain));
    const traced = getFirstRunnableActionWithTrace(tracedApp, actorTraced);

    assert.deepEqual(traced.action, plainAction, `${testCase.name} should return the same action with tracing enabled`);
  }
});

test("Blockly trace collection records empty, action, branch, short-circuit, and comparison steps", () => {
  const emptyApp = buildTraceApp(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="battlegorithms_on_each_turn" x="24" y="24"></block>
    </xml>
  `);
  const empty = getFirstRunnableActionWithTrace(emptyApp, getAlly(emptyApp));
  assert.equal(empty.trace.length, 1);
  assert.deepEqual(traceFields(empty.trace), [
    {
      blockType: "battlegorithms_on_each_turn",
      kind: "empty",
      result: undefined,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    }
  ]);

  const actionApp = buildTraceApp(buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));
  const action = getFirstRunnableActionWithTrace(actionApp, getAlly(actionApp));
  assert.deepEqual(traceFields(action.trace), [
    {
      blockType: "battlegorithms_move_forward",
      kind: "action",
      result: undefined,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    }
  ]);

  const ifApp = buildTraceApp(buildSolutionXml(`
    <block type="battlegorithms_if_have_enemy_flag_else">
      <statement name="DO">
        <block type="battlegorithms_move_forward"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_move_backward"></block>
      </statement>
    </block>
  `));
  getAlly(ifApp).hasEnemyFlag = false;
  const ifTrace = getFirstRunnableActionWithTrace(ifApp, getAlly(ifApp));
  assert.deepEqual(traceFields(ifTrace.trace), [
    {
      blockType: "battlegorithms_if_have_enemy_flag_else",
      kind: "condition",
      result: false,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_move_backward",
      kind: "action",
      result: undefined,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    }
  ]);

  const andApp = buildTraceApp(buildSolutionXml(`
    <block type="battlegorithms_if_boolean_else">
      <value name="BOOL">
        <block type="battlegorithms_logic_and">
          <value name="LEFT">
            <block type="battlegorithms_boolean_have_enemy_flag"></block>
          </value>
          <value name="RIGHT">
            <block type="battlegorithms_boolean_can_jump"></block>
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
  `));
  const andAlly = getAlly(andApp);
  andAlly.hasEnemyFlag = false;
  andAlly.canJump = true;
  const andTrace = getFirstRunnableActionWithTrace(andApp, andAlly);
  assert.equal(andTrace.trace.some((step) => step.blockType === "battlegorithms_boolean_can_jump"), false);
  assert.equal(andTrace.trace.filter((step) => step.blockType === "battlegorithms_boolean_have_enemy_flag").length, 1);
  assert.deepEqual(traceFields(andTrace.trace).slice(0, 3), [
    {
      blockType: "battlegorithms_boolean_have_enemy_flag",
      kind: "condition",
      result: false,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_logic_and",
      kind: "boolean",
      result: false,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_if_boolean_else",
      kind: "condition",
      result: false,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    }
  ]);

  const orApp = buildTraceApp(buildSolutionXml(`
    <block type="battlegorithms_if_boolean_else">
      <value name="BOOL">
        <block type="battlegorithms_logic_or">
          <value name="LEFT">
            <block type="battlegorithms_boolean_have_enemy_flag"></block>
          </value>
          <value name="RIGHT">
            <block type="battlegorithms_boolean_can_jump"></block>
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
  `));
  const orAlly = getAlly(orApp);
  orAlly.hasEnemyFlag = true;
  orAlly.canJump = false;
  const orTrace = getFirstRunnableActionWithTrace(orApp, orAlly);
  assert.equal(orTrace.trace.some((step) => step.blockType === "battlegorithms_boolean_can_jump"), false);
  assert.deepEqual(traceFields(orTrace.trace).slice(0, 3), [
    {
      blockType: "battlegorithms_boolean_have_enemy_flag",
      kind: "condition",
      result: true,
      numericLeft: undefined,
      numericRight: undefined,
      runnerId: "runner_1_AI_AllyP1",
      runnerTeam: 1
    },
    {
      blockType: "battlegorithms_logic_or",
      kind: "boolean",
      result: true,
      numericLeft: undefined,
      numericRight: undefined,
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

  const compareApp = buildTraceApp(buildSolutionXml(`
    <block type="battlegorithms_if_boolean_else">
      <value name="BOOL">
        <block type="battlegorithms_value_compare">
          <value name="LEFT">
            <block type="battlegorithms_value_runner_index"></block>
          </value>
          <field name="OPERATOR">EQ</field>
          <value name="RIGHT">
            <block type="battlegorithms_value_number">
              <field name="VALUE">0</field>
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
  `));
  const compareTrace = getFirstRunnableActionWithTrace(compareApp, getAlly(compareApp));
  assert.deepEqual(traceFields(compareTrace.trace).slice(0, 2), [
    {
      blockType: "battlegorithms_value_compare",
      kind: "comparison",
      result: true,
      numericLeft: 0,
      numericRight: 0,
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

test("Blockly trace collection returns independent traces across successive calls", () => {
  const xml = buildSolutionXml(`
    <block type="battlegorithms_if_have_enemy_flag_else">
      <statement name="DO">
        <block type="battlegorithms_move_forward"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_move_backward"></block>
      </statement>
    </block>
  `);

  const appA = buildTraceApp(xml);
  const runnerA = getAlly(appA);
  runnerA.hasEnemyFlag = false;
  const traceA = getFirstRunnableActionWithTrace(appA, runnerA).trace;

  const appB = buildTraceApp(xml);
  const runnerB = getAlly(appB);
  runnerB.hasEnemyFlag = true;
  const traceB = getFirstRunnableActionWithTrace(appB, runnerB).trace;

  assert.notStrictEqual(traceA, traceB);
  assert.ok(traceA.length > 0);
  assert.ok(traceB.length > 0);
  assert.ok(traceA.every((step) => step.runnerId === runnerA.id));
  assert.ok(traceA.every((step) => step.runnerTeam === runnerA.team));
  assert.ok(traceB.every((step) => step.runnerId === runnerB.id));
  assert.ok(traceB.every((step) => step.runnerTeam === runnerB.team));

  const originalBLength = traceB.length;
  const originalBRunnerId = traceB[0].runnerId;
  traceA.push({ blockId: "mutated", blockType: "mutated", kind: "mutated", runnerId: "mutated", runnerTeam: -1 });
  traceA[0].runnerId = "mutated";

  assert.equal(traceB.length, originalBLength);
  assert.equal(traceB[0].runnerId, originalBRunnerId);
});

test("hidden PvP workspace path remains trace-free", () => {
  const app = buildTraceApp(buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));
  const match = buildMatch();
  app.state = match.state;
  app.state.currentModeView = GAME_VIEW_MODES.FREE_PLAY;
  app.state.freePlayMode = FREE_PLAY_MODES.PLAYER_VS_PLAYER;
  app.state.activeBlocklyTeamTab = 1;

  const hiddenRunner = app.state.allRunners.find((runner) => runner.team === 2 && !runner.isHumanControlled);
  const result = getFirstRunnableActionWithTrace(app, hiddenRunner);
  assert.equal(result.trace, null);
});

test("getAIAllyAction stashes the last visible trace only when trace collection is active", () => {
  const previousWindow = globalThis.window;
  globalThis.window = {};
  try {
    const app = buildTraceApp(buildSolutionXml(`<block type="battlegorithms_move_forward"></block>`));
    const ally = getAlly(app);
    app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD;
    app.state.currentTurnNumber = 12;
    app.state.currentLevelId = "trace-lab";

    const action = getAIAllyAction(app, ally);
    assert.equal(action.type, AI_ACTION_TYPES.MOVE_FORWARD);
    assert.ok(window.__bbaLastBlocklyTrace);
    assert.equal(window.__bbaLastBlocklyTrace.runnerId, ally.id);
    assert.equal(window.__bbaLastBlocklyTrace.runnerTeam, ally.team);
    assert.equal(window.__bbaLastBlocklyTrace.turnNumber, 12);
    assert.equal(window.__bbaLastBlocklyTrace.levelId, "trace-lab");
    assert.equal(window.__bbaLastBlocklyTrace.steps.length, 1);

    const before = window.__bbaLastBlocklyTrace;
    app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD + 0.25;
    getAIAllyAction(app, ally);
    assert.equal(window.__bbaLastBlocklyTrace, before);
  } finally {
    globalThis.window = previousWindow;
  }
});
