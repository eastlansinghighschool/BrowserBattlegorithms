import {
  AI_ACTION_TYPES
} from "../config/constants.js";

const MOVEMENT_ACTION_TYPES = new Set([
  AI_ACTION_TYPES.MOVE_FORWARD,
  AI_ACTION_TYPES.MOVE_BACKWARD,
  AI_ACTION_TYPES.MOVE_UP_SCREEN,
  AI_ACTION_TYPES.MOVE_DOWN_SCREEN,
  AI_ACTION_TYPES.MOVE_RANDOMLY,
  AI_ACTION_TYPES.MOVE_TOWARD,
  AI_ACTION_TYPES.JUMP_FORWARD
]);

function ensureRecentMovementState(runner) {
  if (!runner) {
    return null;
  }

  if (!runner.recentMovementState || typeof runner.recentMovementState !== "object") {
    runner.recentMovementState = createRecentMovementState();
  }

  return runner.recentMovementState;
}

export function createRecentMovementState() {
  return {
    turnStartGridX: null,
    turnStartGridY: null,
    pendingActionType: null,
    pendingActionOutcome: null,
    lastMoveWasBlocked: false,
    consecutiveTurnsWithoutMovement: 0
  };
}

export function resetRecentMovementState(runner) {
  if (!runner) {
    return null;
  }

  runner.recentMovementState = createRecentMovementState();
  return runner.recentMovementState;
}

export function beginRecentMovementTurn(runner) {
  const state = ensureRecentMovementState(runner);
  if (!state || !runner) {
    return null;
  }

  state.turnStartGridX = Number(runner.gridX);
  state.turnStartGridY = Number(runner.gridY);
  state.pendingActionType = null;
  state.pendingActionOutcome = null;
  return state;
}

export function queueRecentMovementOutcome(runner, actionType, outcome) {
  const state = ensureRecentMovementState(runner);
  if (!state) {
    return null;
  }

  state.pendingActionType = actionType || null;
  state.pendingActionOutcome = outcome || null;
  return state;
}

export function finalizeRecentMovementTurn(runner) {
  const state = ensureRecentMovementState(runner);
  if (!state) {
    return null;
  }

  const startGridX = Number(state.turnStartGridX);
  const startGridY = Number(state.turnStartGridY);
  const endGridX = Number(runner?.gridX);
  const endGridY = Number(runner?.gridY);
  const changedCell = Number.isFinite(startGridX) && Number.isFinite(startGridY) && (
    startGridX !== endGridX ||
    startGridY !== endGridY
  );
  const attemptedMovement = MOVEMENT_ACTION_TYPES.has(state.pendingActionType);
  const blockedOutcome = state.pendingActionOutcome === "stayed" || state.pendingActionOutcome === "illegal_noop";

  state.lastMoveWasBlocked = attemptedMovement && !changedCell && blockedOutcome;
  state.consecutiveTurnsWithoutMovement = changedCell
    ? 0
    : Number.isFinite(state.consecutiveTurnsWithoutMovement)
      ? state.consecutiveTurnsWithoutMovement + 1
      : 1;
  state.turnStartGridX = null;
  state.turnStartGridY = null;
  state.pendingActionType = null;
  state.pendingActionOutcome = null;
  return state;
}

export function didRunnerLastMoveGetBlocked(runner) {
  return Boolean(runner?.recentMovementState?.lastMoveWasBlocked);
}

export function hasRunnerNotMovedForTurns(runner, turns) {
  const threshold = Math.floor(Number(turns));
  if (!runner || !Number.isFinite(threshold) || threshold < 1) {
    return false;
  }

  return Number(runner?.recentMovementState?.consecutiveTurnsWithoutMovement ?? 0) >= threshold;
}
