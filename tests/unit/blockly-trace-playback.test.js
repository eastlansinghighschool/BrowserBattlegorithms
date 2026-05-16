import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_ACTION_TYPES,
  BLOCKLY_TRACE_MAX_DURATION_FRAMES,
  BLOCKLY_TRACE_MIN_FRAMES_PER_STEP,
  BLOCKLY_TRACE_SPEED_THRESHOLD,
  GAME_VIEW_MODES,
  MAIN_GAME_STATES,
  TURN_STATES
} from "../../src/config/constants.js";
import { buildMatch } from "./helpers/builders.js";
import { buildSolutionXml } from "./fixtures/guidedReferenceSolutions.js";
import { buildBlocklyAppWithXml, getTeamProgramRunner, TEST_P5 } from "./helpers/testHarness.js";
import { clearBlocklyTracePlayback, getFirstRunnableAction } from "../../src/ai/blockly/workspace.js";
import { getBlocklyTraceFrameBudgetPerStep, processTurnActions } from "../../src/core/turnEngine.js";

function buildTracePlaybackApp(xmlText) {
  const app = buildBlocklyAppWithXml(xmlText);
  app.state = buildMatch().state;
  app.state.currentModeView = GAME_VIEW_MODES.GUIDED_LEVELS;
  app.state.mainGameState = MAIN_GAME_STATES.RUNNING;
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD;

  const runner = getTeamProgramRunner(app.state, 1);
  app.state.activeRunnerIndex = app.state.allRunners.indexOf(runner);
  return { app, runner };
}

function advanceFrames(app, count) {
  for (let index = 0; index < count; index += 1) {
    processTurnActions(app, TEST_P5);
  }
}

test("Blockly trace playback enters trace state at low speed and resolves the same action as the control run", () => {
  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  const lowSpeed = buildTracePlaybackApp(xml);
  const control = buildTracePlaybackApp(xml);
  control.app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD + 0.2;

  const expectedAction = getFirstRunnableAction(control.app, control.runner);
  processTurnActions(lowSpeed.app, TEST_P5);

  assert.equal(lowSpeed.app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  assert.equal(lowSpeed.app.state.traceStepIndex, 0);
  assert.deepEqual(lowSpeed.app.state.queuedActionForCurrentRunner.actionType, expectedAction.type);

  const budget = getBlocklyTraceFrameBudgetPerStep(lowSpeed.app.state);
  advanceFrames(lowSpeed.app, budget);
  assert.equal(lowSpeed.app.state.currentTurnState, TURN_STATES.PROCESSING_ACTION);
  processTurnActions(lowSpeed.app, TEST_P5);
  assert.equal(lowSpeed.app.state.currentTurnState, TURN_STATES.AWAITING_INPUT);
  assert.equal(lowSpeed.app.state.activeBlocklyTrace, null);
});

test("Blockly trace playback skips the trace state above the threshold", () => {
  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  const { app } = buildTracePlaybackApp(xml);
  app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD + 0.1;

  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, TURN_STATES.AWAITING_INPUT);
  assert.equal(app.state.activeBlocklyTrace, null);
});

test("threshold crossing flushes the active trace and keeps the queued action intact", () => {
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
  const { app } = buildTracePlaybackApp(xml);
  processTurnActions(app, TEST_P5);
  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  const queuedAction = { ...app.state.queuedActionForCurrentRunner };

  app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD + 0.2;
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, TURN_STATES.PROCESSING_ACTION);
  assert.equal(app.state.activeBlocklyTrace, null);
  assert.deepEqual(app.state.queuedActionForCurrentRunner, queuedAction);
});

test("back-to-back ally turns each restart trace playback at step index zero", () => {
  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  const { app } = buildTracePlaybackApp(xml);
  const secondAlly = app.state.allRunners.find((runner) => runner.team === 1 && runner.isHumanControlled);
  secondAlly.isHumanControlled = false;
  secondAlly.isNPC = false;
  secondAlly.allyIndex = 1;

  processTurnActions(app, TEST_P5);
  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  assert.equal(app.state.traceStepIndex, 0);

  const budget = getBlocklyTraceFrameBudgetPerStep(app.state);
  advanceFrames(app, budget + 1);
  assert.equal(app.state.currentTurnState, TURN_STATES.AWAITING_INPUT);

  app.state.activeRunnerIndex = app.state.allRunners.indexOf(secondAlly);
  app.state.currentTurnState = TURN_STATES.AWAITING_INPUT;
  processTurnActions(app, TEST_P5);

  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  assert.equal(app.state.traceStepIndex, 0);
});

test("clearBlocklyTracePlayback is idempotent and clears the playback bookkeeping fields", () => {
  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  const { app } = buildTracePlaybackApp(xml);
  processTurnActions(app, TEST_P5);
  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);

  clearBlocklyTracePlayback(app);
  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  assert.equal(app.state.activeBlocklyTrace, null);
  assert.deepEqual(app.state.tracePlaybackSteps, []);
  assert.equal(app.state.traceStepIndex, 0);
  assert.equal(app.state.traceStepFrameCount, 0);
  assert.equal(app.state.traceStepFrameBudget, 0);
  assert.equal(app.state.traceCurrentBlockId, null);
  assert.equal(app.state.traceOverflowBadgeVisible, false);
  assert.equal(app.state.traceEmptyHintVisible, false);

  clearBlocklyTracePlayback(app);
  assert.equal(app.state.currentTurnState, TURN_STATES.TRACING_PRE_ACTION);
  assert.equal(app.state.activeBlocklyTrace, null);
  assert.deepEqual(app.state.tracePlaybackSteps, []);
});

test("trace frame budget honors the threshold floor and paused-state cap", () => {
  const xml = buildSolutionXml(`<block type="battlegorithms_stay_still"></block>`);
  const { app } = buildTracePlaybackApp(xml);

  assert.equal(getBlocklyTraceFrameBudgetPerStep(app.state), BLOCKLY_TRACE_MIN_FRAMES_PER_STEP);

  app.state.animationSpeedFactor = 0;
  assert.equal(getBlocklyTraceFrameBudgetPerStep(app.state), BLOCKLY_TRACE_MAX_DURATION_FRAMES);
});
