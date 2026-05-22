import * as Blockly from "blockly";
import {
  ACTIVE_TEAM2_NPC_BEHAVIOR,
  AI_ACTION_TYPES,
  BLOCKLY_TRACE_MAX_DURATION_FRAMES,
  BLOCKLY_TRACE_MAX_STEPS,
  BLOCKLY_TRACE_MIN_FRAMES_PER_STEP,
  BLOCKLY_TRACE_SPEED_THRESHOLD,
  AREA_FREEZE_DURATION_TURNS,
  AREA_FREEZE_RADIUS,
  CELL_SIZE,
  CELL_TYPE,
  GAME_VIEW_MODES,
  HUMAN_TURN_BEHAVIORS,
  MAIN_GAME_STATES,
  NPC_BEHAVIORS,
  isBlocklyTraceCollectionActive,
  TURN_STATES
} from "../config/constants.js";
import { createQueuedHumanAction } from "./actions.js";
import { buildAreaFreezeEffect, isAreaFreezeReady, markAreaFreezeUsed } from "./areaFreeze.js";
import { applyPendingGameplayPauseAtBoundary } from "./gameplayPause.js";
import { resolveCollision } from "./collisions.js";
import { beginRecentMovementTurn, finalizeRecentMovementTurn, queueRecentMovementOutcome } from "./recentMovement.js";
import {
  getBarrierAtCell,
  getForwardCell,
  getRunnerAtCell,
  isCellBlockedForBarrierPlacement,
  isCellBlockedForRunner,
  translateActionDecision
} from "./movement.js";
import { checkForFlagPickup, checkForScoring } from "./scoring.js";
import { resetRound } from "./setup.js";
import { emit, finalizeTurnEventLog } from "./events.js";
import { calculateNpcType1Action } from "../ai/npc/npcType1.js";
import { calculateNpcType2Action } from "../ai/npc/npcType2.js";
import { calculateFreePlayCpuAction } from "../ai/npc/freePlayCpu.js";
import { Barrier } from "../entities/Barrier.js";
import { evaluateLevelProgress } from "./levels.js";
import { triggerGoalBurst } from "./levels.js";
import { playSound } from "../ui/sound.js";
import { applyTraceStep, clearTraceStepCurrent, hideTraceEmptyHint, setTraceOverflowBadge, showTraceEmptyHint } from "../ai/blockly/traceRenderer.js";
import { clearBlocklyTracePlayback, getFirstRunnableActionWithTrace } from "../ai/blockly/workspace.js";
import { stashBlocklyTrace } from "../ai/blockly/interpreter.js";

function sync(app) {
  if (typeof app.syncUi === "function") {
    app.syncUi();
  }
}

function ensureTurnStarted(state, runner) {
  if (!state || !runner || state.currentTurnState !== TURN_STATES.AWAITING_INPUT) {
    return;
  }
  if (Array.isArray(state.currentTurnEventLog) && state.currentTurnEventLog.length > 0) {
    return;
  }

  beginRecentMovementTurn(runner);
  emit(state, "turn.started", {
    runnerId: runner.id,
    runnerTeam: runner.team,
    isHuman: Boolean(runner.isHumanControlled),
    isNPC: Boolean(runner.isNPC),
    isFrozen: Boolean(runner.isFrozen)
  });
}

function emitActionChosen(state, runner, actionType, source) {
  emit(state, "runner.actionChosen", {
    runnerId: runner.id,
    runnerTeam: runner.team,
    actionType,
    source
  });
}

function emitActionResolved(state, runner, actionType, outcome) {
  emit(state, "runner.actionResolved", {
    runnerId: runner.id,
    runnerTeam: runner.team,
    actionType,
    outcome
  });
}

function emitBlockedOrBounced(state, runner, attemptedCell, reason) {
  emit(state, "runner.blockedOrBounced", {
    runnerId: runner.id,
    runnerTeam: runner.team,
    attemptedCell,
    reason
  });
}

function emitResourceUnavailable(state, runner, actionType, reason) {
  emit(state, "resource.unavailable", {
    runnerId: runner.id,
    runnerTeam: runner.team,
    actionType,
    reason
  });
}

function getBlockedOrBouncedReason(state, targetGridX, targetGridY, runnerInTargetCell) {
  if (targetGridX < 0 || targetGridX >= state.gameMap[0].length || targetGridY < 0 || targetGridY >= state.gameMap.length) {
    return "out_of_bounds";
  }

  if (state.gameMap[targetGridY]?.[targetGridX] === CELL_TYPE.WALL) {
    return "wall";
  }

  if (runnerInTargetCell) {
    return "runner_collision_bounce";
  }

  return "barrier";
}

function finalizeCompletedTurn(app) {
  const { state } = app;
  finalizeTurnEventLog(state);
  app.hooks.announceLastTurn?.(app);
  app.hooks.announceCoachingMoments?.(app);
}

function recordRunnerAction(state, runner, actionType) {
  if (!runner || !actionType) {
    return;
  }
  if (!state.runnerActionHistory[runner.id]) {
    state.runnerActionHistory[runner.id] = [];
  }
  if (!state.runnerActionHistory[runner.id].includes(actionType)) {
    state.runnerActionHistory[runner.id].push(actionType);
  }
}

function snapRunnerToCell(runner, gridX, gridY) {
  runner.gridX = gridX;
  runner.gridY = gridY;
  runner.pixelX = gridX * CELL_SIZE;
  runner.pixelY = gridY * CELL_SIZE;
  runner.targetGridX = gridX;
  runner.targetGridY = gridY;
  runner.targetPixelX = runner.pixelX;
  runner.targetPixelY = runner.pixelY;
  runner.isMoving = false;
  runner.isJumping = false;
  runner.isBouncing = false;
  runner.jumpFailedReversal = false;
  runner.animationCompletionType = null;
}

function applyAreaFreeze(state, actionRunner) {
  if (!isAreaFreezeReady(state, actionRunner.team)) {
    return null;
  }

  const affectedRunners = [];
  for (const candidate of state.allRunners) {
    if (candidate.team === actionRunner.team || candidate.isFrozen) {
      continue;
    }
    const distance = Math.abs(candidate.gridX - actionRunner.gridX) + Math.abs(candidate.gridY - actionRunner.gridY);
    if (distance <= AREA_FREEZE_RADIUS) {
      candidate.setFrozen(AREA_FREEZE_DURATION_TURNS);
      affectedRunners.push(candidate);
    }
  }

  markAreaFreezeUsed(state, actionRunner.team);
  return buildAreaFreezeEffect(
    {
      currentTurnNumber: state.currentTurnNumber,
      startedAtMs: Date.now()
    },
    actionRunner,
    affectedRunners
  );
}

function createJumpLandingDustEffect(state, runner) {
  const startedAtMs = Date.now();
  return {
    effectKey: `${state.currentTurnNumber}-${runner.id}-${startedAtMs}`,
    startedAtMs,
    durationMs: 150,
    cellX: runner.gridX,
    cellY: runner.gridY
  };
}

export function handlePlayerInput(app, runner, actionData) {
  const { state } = app;
  if (
    runner !== state.allRunners[state.activeRunnerIndex] ||
    !runner.isHumanControlled ||
    state.currentTurnState !== TURN_STATES.AWAITING_INPUT ||
    runner.isMoving ||
    runner.isBouncing
  ) {
    return;
  }

  if (actionData.type === AI_ACTION_TYPES.JUMP_FORWARD && !runner.canJump) {
    return;
  }
  if (actionData.type === AI_ACTION_TYPES.PLACE_BARRIER_FORWARD && (!runner.canPlaceBarrier || runner.activeBarrierId)) {
    return;
  }

  state.queuedActionForCurrentRunner = createQueuedHumanAction(runner, actionData);
  emitActionChosen(state, runner, state.queuedActionForCurrentRunner.actionType, "human");
  state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
}

function getVisibleBlocklyTraceSteps(trace) {
  if (!Array.isArray(trace) || trace.length === 0) {
    return [];
  }

  if (trace.length <= BLOCKLY_TRACE_MAX_STEPS) {
    return trace.map((step) => ({ ...step }));
  }

  return [
    ...trace.slice(0, BLOCKLY_TRACE_MAX_STEPS - 1).map((step) => ({ ...step })),
    { ...trace.at(-1) }
  ];
}

export function getBlocklyTraceFrameBudgetPerStep(state) {
  const animationSpeedFactor = Number(state?.animationSpeedFactor);
  if (!Number.isFinite(animationSpeedFactor) || animationSpeedFactor <= 0) {
    return BLOCKLY_TRACE_MAX_DURATION_FRAMES;
  }

  const baseFrameBudget = BLOCKLY_TRACE_MAX_DURATION_FRAMES / BLOCKLY_TRACE_MAX_STEPS;
  const scaledBudget = baseFrameBudget * (BLOCKLY_TRACE_SPEED_THRESHOLD / animationSpeedFactor);
  return Math.max(BLOCKLY_TRACE_MIN_FRAMES_PER_STEP, Math.round(scaledBudget));
}

function startBlocklyTracePlayback(app, runner, rawTrace) {
  const { state } = app;
  const traceSteps = getVisibleBlocklyTraceSteps(rawTrace);
  clearBlocklyTracePlayback(app);

  if (!traceSteps.length) {
    state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
    return false;
  }

  state.activeBlocklyTrace = {
    runnerId: runner?.id ?? null,
    runnerTeam: runner?.team ?? null,
    turnNumber: state.currentTurnNumber,
    levelId: state.currentLevelId,
    steps: Array.isArray(rawTrace) ? rawTrace.map((step) => ({ ...step })) : []
  };
  state.tracePlaybackSteps = traceSteps;
  state.traceStepIndex = 0;
  state.traceStepFrameCount = 0;
  state.traceStepFrameBudget = getBlocklyTraceFrameBudgetPerStep(state);
  state.traceCurrentBlockId = traceSteps[0]?.blockId || null;
  state.traceOverflowBadgeVisible = Array.isArray(rawTrace) && rawTrace.length > BLOCKLY_TRACE_MAX_STEPS;

  if (state.traceOverflowBadgeVisible) {
    setTraceOverflowBadge(app.blocklyWorkspace, true);
  }

  app.blocklyWorkspace?.hideChaff?.();

  state.currentTurnState = TURN_STATES.TRACING_PRE_ACTION;
  applyTraceStep(app.blocklyWorkspace, traceSteps[0]);
  if (traceSteps[0]?.kind === "empty") {
    state.traceEmptyHintVisible = true;
    showTraceEmptyHint(app.blocklyWorkspace);
  }
  stashBlocklyTrace(app, runner, state.activeBlocklyTrace.steps);
  return true;
}

function planActionForActiveRunner(app, runner) {
  const { state } = app;
  if (runner.isNPC) {
    const source = runner.cpuBehavior ? "cpu" : "npc";
    const decision = runner.cpuBehavior
      ? calculateFreePlayCpuAction(runner, state)
      : (
        ACTIVE_TEAM2_NPC_BEHAVIOR === NPC_BEHAVIORS.SIMPLE_TARGET
          ? calculateNpcType1Action(runner, state)
          : calculateNpcType2Action(runner, state)
    );
    state.queuedActionForCurrentRunner = translateActionDecision(runner, decision, state);
    emitActionChosen(state, runner, state.queuedActionForCurrentRunner.actionType, source);
    state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
    return false;
  }

  const shouldTraceBlockly = isBlocklyTraceCollectionActive(state);
  let aiDecision = null;
  let traceSteps = null;
  if (shouldTraceBlockly) {
    const traceResult = getFirstRunnableActionWithTrace(app, runner);
    aiDecision = traceResult.action || { type: AI_ACTION_TYPES.STAY_STILL };
    traceSteps = traceResult.trace;
  } else {
    aiDecision = app.hooks.getAIAllyAction?.(runner) || { type: AI_ACTION_TYPES.STAY_STILL };
  }

  let queued = translateActionDecision(runner, aiDecision, state);
  emitActionChosen(state, runner, queued.actionType, "blockly");
  if (queued.actionType === AI_ACTION_TYPES.JUMP_FORWARD && !runner.canJump) {
    emitResourceUnavailable(state, runner, queued.actionType, "jump_exhausted");
    queued = translateActionDecision(runner, { type: AI_ACTION_TYPES.STAY_STILL }, state);
  }
  if (queued.actionType === AI_ACTION_TYPES.PLACE_BARRIER_FORWARD && (!runner.canPlaceBarrier || runner.activeBarrierId)) {
    emitResourceUnavailable(state, runner, queued.actionType, runner.activeBarrierId ? "barrier_already_active" : "barrier_exhausted");
    queued = translateActionDecision(runner, { type: AI_ACTION_TYPES.STAY_STILL }, state);
  }

  state.queuedActionForCurrentRunner = queued;
  if (shouldTraceBlockly && traceSteps && traceSteps.length > 0) {
    return startBlocklyTracePlayback(app, runner, traceSteps);
  }
  state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
  return false;
}

function advanceToNextRunner(app) {
  finalizeCompletedTurn(app);
  const { state } = app;
  const previousActiveRunnerIndex = state.activeRunnerIndex;
  state.activeRunnerIndex = (state.activeRunnerIndex + 1) % state.allRunners.length;
  state.currentTurnState = TURN_STATES.AWAITING_INPUT;

  if (state.activeRunnerIndex === 0 && previousActiveRunnerIndex === state.allRunners.length - 1) {
    state.currentTurnNumber += 1;
    // Free Play per-point turn limit: reset the round with no score when the limit is reached.
    if (
      state.currentModeView === GAME_VIEW_MODES.FREE_PLAY &&
      typeof state.freePlayPointTurnLimit === "number" &&
      state.freePlayPointTurnLimit > 0 &&
      state.currentTurnNumber - (state.freePlayRoundStartTurn ?? 1) >= state.freePlayPointTurnLimit
    ) {
      resetRound(state);
    }
  }
}

function handleFrozenRunnerTurn(app, runner) {
  queueRecentMovementOutcome(runner, AI_ACTION_TYPES.STAY_STILL, "skipped_frozen");
  runner.frozenTurnsRemaining -= 1;
  if (runner.frozenTurnsRemaining <= 0) {
    runner.isFrozen = false;
    runner.isGracePeriod = true;
  }
  emitActionResolved(app.state, runner, AI_ACTION_TYPES.STAY_STILL, "skipped_frozen");
  handleActionCompletion(app, runner);
}

function recordFreePlayGameOver(app) {
  const { state } = app;
  if (state.currentModeView !== GAME_VIEW_MODES.FREE_PLAY) return;
  const team1Won = (state.teamScores[1] ?? 0) >= state.pointsToWin;
  const team2Won = (state.teamScores[2] ?? 0) >= state.pointsToWin;
  app.usageTracker?.recordFreePlaySummary?.({
    turns: state.currentTurnNumber,
    teamScores: state.teamScores,
    wins: team1Won ? 1 : 0,
    losses: team2Won ? 1 : 0,
    modeView: state.currentModeView,
    mapKey: state.activeMapKey
  });
}

function handleActionCompletion(app, completedRunner) {
  const { state } = app;
  finalizeRecentMovementTurn(completedRunner);
  const carriedFlagBefore = completedRunner.hasEnemyFlag;
  const skipPostMoveConsequences = completedRunner.animationCompletionType === "jump_failed";
  const lastActionType = state.runnerActionHistory?.[completedRunner.id]?.at(-1) || null;
  app.usageTracker?.recordTurnActionCompleted?.({
    runnerId: completedRunner.id,
    teamId: completedRunner.team,
    actionType: lastActionType,
    turnNumber: state.currentTurnNumber,
    modeView: state.currentModeView,
    levelId: state.currentLevelId
  });
  if (completedRunner.isGracePeriod) {
    completedRunner.isGracePeriod = false;
  }

  if (!completedRunner.isBouncing && !skipPostMoveConsequences) {
    checkForFlagPickup(state, completedRunner);
    if (!carriedFlagBefore && completedRunner.hasEnemyFlag) {
      playSound(state, "flag-pickup");
    }
    const levelResult = evaluateLevelProgress(app);
    if (levelResult) {
      finalizeCompletedTurn(app);
      clearBlocklyTracePlayback(app);
      sync(app);
      return;
    }

    if (completedRunner.hasEnemyFlag && checkForScoring(state, completedRunner)) {
      playSound(state, "score");
      app.usageTracker?.recordScorePoint?.({
        runnerId: completedRunner.id,
        teamId: completedRunner.team,
        turnNumber: state.currentTurnNumber,
        modeView: state.currentModeView,
        teamScores: state.teamScores
      });
      if (state.currentModeView === GAME_VIEW_MODES.FREE_PLAY) {
        triggerGoalBurst(
          state,
          { x: completedRunner.gridX, y: completedRunner.gridY },
          completedRunner.team
        );
      }
      const postScoreLevelResult = evaluateLevelProgress(app);
      if (postScoreLevelResult) {
        finalizeCompletedTurn(app);
        clearBlocklyTracePlayback(app);
        sync(app);
        return;
      }
      if (state.currentTurnState === TURN_STATES.GAME_OVER) {
        state.mainGameState = MAIN_GAME_STATES.GAME_OVER;
        recordFreePlayGameOver(app);
        finalizeCompletedTurn(app);
        clearBlocklyTracePlayback(app);
        sync(app);
        return;
      }
      finalizeCompletedTurn(app);
      clearBlocklyTracePlayback(app);
      resetRound(state);
      applyPendingGameplayPauseAtBoundary(app);
      sync(app);
      return;
    }
  }

  if (state.currentTurnState === TURN_STATES.GAME_OVER) {
    state.mainGameState = MAIN_GAME_STATES.GAME_OVER;
    recordFreePlayGameOver(app);
    finalizeCompletedTurn(app);
    clearBlocklyTracePlayback(app);
    sync(app);
    return;
  }

  const endOfTurnLevelResult = evaluateLevelProgress(app);
  if (endOfTurnLevelResult) {
    finalizeCompletedTurn(app);
    clearBlocklyTracePlayback(app);
    sync(app);
    return;
  }

  clearBlocklyTracePlayback(app);
  advanceToNextRunner(app);
  const advancedLevelResult = evaluateLevelProgress(app);
  if (advancedLevelResult) {
    finalizeCompletedTurn(app);
    clearBlocklyTracePlayback(app);
    sync(app);
    return;
  }
  applyPendingGameplayPauseAtBoundary(app);
  sync(app);
}

function executeQueuedAction(app, actionRunner, queuedAction) {
  const { state } = app;
  const actionType = queuedAction.actionType;
  recordRunnerAction(state, actionRunner, actionType);
  let targetGridX = queuedAction.targetGridX;
  let targetGridY = queuedAction.targetGridY;
  let actionResolvedAndAnimating = false;
  let actionCompletedImmediately = false;
  let performRegularMoveOrJump = false;
  let actionOutcome = "illegal_noop";

  switch (actionType) {
    case "MOVE":
    case AI_ACTION_TYPES.MOVE_FORWARD:
    case AI_ACTION_TYPES.MOVE_BACKWARD:
    case AI_ACTION_TYPES.MOVE_UP_SCREEN:
    case AI_ACTION_TYPES.MOVE_DOWN_SCREEN:
    case AI_ACTION_TYPES.JUMP_FORWARD:
      performRegularMoveOrJump = true;
      break;
    case AI_ACTION_TYPES.STAY_STILL: {
      const forwardCell = getForwardCell(actionRunner, 1);
      const barrierInFront = getBarrierAtCell(forwardCell.x, forwardCell.y, state.barriers);
      if (barrierInFront) {
        state.barriers = state.barriers.filter((barrier) => barrier.id !== barrierInFront.id);
        const ownerRunner = state.allRunners.find((runner) => runner.id === barrierInFront.ownerRunnerId);
        if (ownerRunner) {
          ownerRunner.canPlaceBarrier = true;
          ownerRunner.activeBarrierId = null;
        }
      }
      actionCompletedImmediately = true;
      break;
    }
    case AI_ACTION_TYPES.PLACE_BARRIER_FORWARD: {
      const forwardCell = getForwardCell(actionRunner, 1);
      targetGridX = forwardCell.x;
      targetGridY = forwardCell.y;
      if (
        actionRunner.canPlaceBarrier &&
        !actionRunner.activeBarrierId &&
        !isCellBlockedForBarrierPlacement(targetGridX, targetGridY, state.barriers, state.gameMap, state) &&
        !getRunnerAtCell(targetGridX, targetGridY, state.allRunners)
      ) {
        const barrier = new Barrier(targetGridX, targetGridY, actionRunner.id);
        state.barriers.push(barrier);
        actionRunner.activeBarrierId = barrier.id;
        actionRunner.canPlaceBarrier = false;
        actionOutcome = "barrier_placed";
      }
      actionCompletedImmediately = true;
      break;
    }
    case AI_ACTION_TYPES.FREEZE_OPPONENTS: {
      if (!isAreaFreezeReady(state, actionRunner.team)) {
        emitResourceUnavailable(state, actionRunner, actionType, "freeze_on_cooldown");
        actionOutcome = "stayed";
        actionCompletedImmediately = true;
        break;
      }
      state.areaFreezeEffect = applyAreaFreeze(state, actionRunner);
      playSound(state, "freeze");
      actionOutcome = "freeze_applied";
      actionCompletedImmediately = true;
      break;
    }
    default:
      actionOutcome = actionType === AI_ACTION_TYPES.STAY_STILL ? "stayed" : "illegal_noop";
      actionCompletedImmediately = true;
      break;
  }

  if (performRegularMoveOrJump) {
    const isJump = actionType === AI_ACTION_TYPES.JUMP_FORWARD;
    if (isJump) {
      if (!actionRunner.canJump) {
        actionOutcome = "stayed";
        actionRunner.startBounceAnimation(actionRunner.gridX + actionRunner.playDirection, actionRunner.gridY);
        actionResolvedAndAnimating = true;
      } else {
        targetGridX = actionRunner.gridX + actionRunner.playDirection * 2;
        targetGridY = actionRunner.gridY;
      }
    }

    if (!actionResolvedAndAnimating) {
      if (isCellBlockedForRunner(targetGridX, targetGridY, state.barriers, state.gameMap, state, actionRunner)) {
        if (isJump) {
          actionRunner.canJump = false;
        }
        actionOutcome = "stayed";
        emitBlockedOrBounced(
          state,
          actionRunner,
          { x: targetGridX, y: targetGridY },
          getBlockedOrBouncedReason(state, targetGridX, targetGridY, null)
        );
        if (isJump && actionRunner.startFailedJumpAnimation(targetGridX, targetGridY)) {
          playSound(state, "jump-takeoff");
          actionResolvedAndAnimating = true;
        } else {
          actionRunner.startBounceAnimation(targetGridX, targetGridY);
          actionResolvedAndAnimating = true;
        }
      } else {
        const runnerInTargetCell = getRunnerAtCell(targetGridX, targetGridY, state.allRunners, actionRunner.id);
        if (runnerInTargetCell) {
          if (runnerInTargetCell.team === actionRunner.team || runnerInTargetCell.isFrozen) {
            if (isJump) {
              actionRunner.canJump = false;
            }
            actionOutcome = "stayed";
            emitBlockedOrBounced(
              state,
              actionRunner,
              { x: targetGridX, y: targetGridY },
              "runner_collision_bounce"
            );
            if (isJump && actionRunner.startFailedJumpAnimation(targetGridX, targetGridY)) {
              playSound(state, "jump-takeoff");
              actionResolvedAndAnimating = true;
            } else {
              actionRunner.startBounceAnimation(targetGridX, targetGridY);
              actionResolvedAndAnimating = true;
            }
          } else {
            const outcome = resolveCollision(
              state,
              actionRunner,
              runnerInTargetCell,
              targetGridX,
              targetGridY,
              { x: actionRunner.gridX, y: actionRunner.gridY }
            );
            snapRunnerToCell(outcome.winner, targetGridX, targetGridY);
            snapRunnerToCell(outcome.loser, outcome.loserCell.x, outcome.loserCell.y);
            if (isJump) {
              actionRunner.canJump = false;
            }
            actionOutcome = isJump ? "jumped" : "moved";
            actionCompletedImmediately = true;
          }
        } else {
          if (isJump) {
            if (actionRunner.startJumpAnimation(targetGridX, targetGridY)) {
              playSound(state, "jump-takeoff");
              actionOutcome = "jumped";
            }
          } else {
            actionRunner.startMoveAnimation(targetGridX, targetGridY);
          }
          actionResolvedAndAnimating = true;
        }
      }
    }
  }

  state.queuedActionForCurrentRunner = null;
  queueRecentMovementOutcome(actionRunner, actionType, actionOutcome);
  emitActionResolved(state, actionRunner, actionType, actionOutcome);
  if (actionCompletedImmediately) {
    handleActionCompletion(app, actionRunner);
  } else if (actionResolvedAndAnimating) {
    state.currentTurnState = TURN_STATES.ANIMATING;
  } else {
    handleActionCompletion(app, actionRunner);
  }
}

export function processTurnActions(app, p) {
  const { state } = app;
  if (state.mainGameState !== MAIN_GAME_STATES.RUNNING || state.currentTurnState === TURN_STATES.GAME_OVER) {
    return;
  }

  if (state.gameplayPaused) {
    return;
  }

  const runner = state.allRunners[state.activeRunnerIndex];
  if (!runner) {
    return;
  }

  if (applyPendingGameplayPauseAtBoundary(app)) {
    sync(app);
    return;
  }

  ensureTurnStarted(state, runner);

  if (state.currentTurnState === TURN_STATES.AWAITING_INPUT) {
    if (runner.isFrozen) {
      handleFrozenRunnerTurn(app, runner);
      return;
    }

    if (runner.isHumanControlled) {
      if (
        state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS &&
        state.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.AUTO_SKIP &&
        state.autoStayHumanRunnerIds.includes(runner.id)
      ) {
        handlePlayerInput(app, runner, { type: AI_ACTION_TYPES.STAY_STILL });
      }
      return;
    }

    const startedTracePlayback = planActionForActiveRunner(app, runner);
    if (startedTracePlayback) {
      return;
    }
  }

  if (state.currentTurnState === TURN_STATES.TRACING_PRE_ACTION) {
    if (!state.activeBlocklyTrace || !Array.isArray(state.tracePlaybackSteps) || state.tracePlaybackSteps.length === 0) {
      state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
      return;
    }

    if (!isBlocklyTraceCollectionActive(state)) {
      clearBlocklyTracePlayback(app);
      state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
      return;
    }

    const animationSpeedFactor = Number(state.animationSpeedFactor);
    if (!Number.isFinite(animationSpeedFactor) || animationSpeedFactor <= 0) {
      return;
    }

    state.traceStepFrameCount += 1;
    if (state.traceStepFrameCount < state.traceStepFrameBudget) {
      return;
    }

    const currentStep = state.tracePlaybackSteps[state.traceStepIndex] || null;
    const nextStepIndex = state.traceStepIndex + 1;
    const nextStep = state.tracePlaybackSteps[nextStepIndex] || null;
    const sameBlock = Boolean(currentStep?.blockId && nextStep?.blockId && currentStep.blockId === nextStep.blockId);
    const shouldKeepCurrentHighlight = sameBlock && nextStepIndex < state.tracePlaybackSteps.length;

    if (!shouldKeepCurrentHighlight) {
      clearTraceStepCurrent(app.blocklyWorkspace, currentStep);
    }
    if (currentStep?.kind === "empty") {
      hideTraceEmptyHint(app.blocklyWorkspace);
      state.traceEmptyHintVisible = false;
    }

    state.traceStepIndex = nextStepIndex;
    if (state.traceStepIndex >= state.tracePlaybackSteps.length) {
      state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
      return;
    }

    const renderedStep = state.tracePlaybackSteps[state.traceStepIndex];
    state.traceStepFrameCount = 0;
    state.traceStepFrameBudget = getBlocklyTraceFrameBudgetPerStep(state);
    if (sameBlock) {
      state.traceCurrentBlockId = renderedStep?.blockId || null;
      return;
    }
    state.traceCurrentBlockId = renderedStep?.blockId || null;
    state.traceEmptyHintVisible = renderedStep?.kind === "empty";
    applyTraceStep(app.blocklyWorkspace, renderedStep);
    if (renderedStep?.kind === "empty") {
      showTraceEmptyHint(app.blocklyWorkspace);
    }
    return;
  }

  if (state.currentTurnState === TURN_STATES.PROCESSING_ACTION && !state.queuedActionForCurrentRunner) {
    state.currentTurnState = TURN_STATES.AWAITING_INPUT;
    sync(app);
    return;
  }

  if (state.currentTurnState === TURN_STATES.PROCESSING_ACTION && state.queuedActionForCurrentRunner) {
    if (state.queuedActionForCurrentRunner.runner === runner) {
      executeQueuedAction(app, runner, state.queuedActionForCurrentRunner);
    } else {
      state.queuedActionForCurrentRunner = null;
      state.currentTurnState = TURN_STATES.AWAITING_INPUT;
    }
  }

  if (state.currentTurnState === TURN_STATES.ANIMATING && (runner.isMoving || runner.isJumping || runner.isBouncing)) {
    const animationComplete = runner.updateAnimation(state.animationSpeedFactor, p, state);
    if (animationComplete) {
      const completedAnimationType = runner.animationCompletionType;
      if (completedAnimationType === "jump_success") {
        state.activeJumpLandingDust = createJumpLandingDustEffect(state, runner);
        playSound(state, "jump-land");
      }
      handleActionCompletion(app, runner);
      runner.animationCompletionType = null;
    }
  }
}
