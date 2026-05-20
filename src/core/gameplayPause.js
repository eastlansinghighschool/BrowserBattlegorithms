import { MAIN_GAME_STATES, TURN_STATES } from "../config/constants.js";

export function clearGameplayPauseState(state) {
  if (!state) {
    return;
  }
  state.gameplayPaused = false;
  state.pauseRequested = false;
}

export function shouldPauseGameplayImmediately(state) {
  const runner = state?.allRunners?.[state.activeRunnerIndex] || null;
  return Boolean(
    state?.mainGameState === MAIN_GAME_STATES.RUNNING &&
    state?.currentTurnState === TURN_STATES.AWAITING_INPUT &&
    runner?.isHumanControlled
  );
}

export function requestGameplayPause(app) {
  const { state } = app;
  if (state.mainGameState !== MAIN_GAME_STATES.RUNNING || state.currentTurnState === TURN_STATES.GAME_OVER) {
    return "ignored";
  }

  if (state.gameplayPaused) {
    return "paused";
  }

  if (state.pauseRequested) {
    return "pending";
  }

  if (shouldPauseGameplayImmediately(state)) {
    clearGameplayPauseState(state);
    state.gameplayPaused = true;
    return "paused";
  }

  state.pauseRequested = true;
  return "pending";
}

export function resumeGameplay(app) {
  const { state } = app;
  if (!state.gameplayPaused && !state.pauseRequested) {
    return false;
  }

  clearGameplayPauseState(state);
  return true;
}

export function applyPendingGameplayPauseAtBoundary(app) {
  const { state } = app;
  if (
    !state.pauseRequested ||
    state.gameplayPaused ||
    state.mainGameState !== MAIN_GAME_STATES.RUNNING ||
    state.currentTurnState !== TURN_STATES.AWAITING_INPUT
  ) {
    return false;
  }

  clearGameplayPauseState(state);
  state.gameplayPaused = true;
  return true;
}

export function toggleGameplayPause(app) {
  const { state } = app;
  if (state.mainGameState !== MAIN_GAME_STATES.RUNNING || state.currentTurnState === TURN_STATES.GAME_OVER) {
    return "ignored";
  }

  if (state.gameplayPaused) {
    return resumeGameplay(app) ? "resumed" : "ignored";
  }

  if (state.pauseRequested) {
    return "ignored";
  }

  return requestGameplayPause(app);
}
