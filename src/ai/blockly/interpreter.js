import { AI_ACTION_TYPES, isBlocklyTraceCollectionActive } from "../../config/constants.js";
import { getFirstRunnableAction, getFirstRunnableActionWithTrace } from "./workspace.js";

export function stashBlocklyTrace(app, runner, trace) {
  if (typeof window === "undefined" || !trace) {
    return;
  }

  window.__bbaLastBlocklyTrace = {
    runnerId: runner?.id ?? null,
    runnerTeam: runner?.team ?? null,
    turnNumber: app.state.currentTurnNumber,
    levelId: app.state.currentLevelId,
    steps: trace
  };
}

export function getAIAllyAction(app, runnerOverride = null) {
  const runner = runnerOverride || app.state.allRunners.find((candidate) => candidate.team === 1 && !candidate.isHumanControlled && !candidate.isNPC);
  if (isBlocklyTraceCollectionActive(app.state)) {
    const { action, trace } = getFirstRunnableActionWithTrace(app, runner);
    stashBlocklyTrace(app, runner, trace);
    return action || { type: AI_ACTION_TYPES.STAY_STILL };
  }
  const action = getFirstRunnableAction(app, runner);
  return action || { type: AI_ACTION_TYPES.STAY_STILL };
}
