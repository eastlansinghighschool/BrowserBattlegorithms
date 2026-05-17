import { AI_ACTION_TYPES, BLOCK_TYPES, isBlocklyTraceCollectionActive } from "../../config/constants.js";
import { getActionTypeForBlockType } from "./blocks.js";
import { getFirstRunnableAction, getFirstRunnableActionWithTrace } from "./workspace.js";

// Scan workspace for action blocks that the execution-hints system has marked as ignored
// (i.e., blocks below the first reachable action in the program chain).
function collectIgnoredActionBlockIds(app) {
  if (!app.blocklyWorkspace) return [];
  const ignored = [];
  for (const block of app.blocklyWorkspace.getAllBlocks(false)) {
    if (block.getDisabledReasons?.()?.has?.("bba_ignored_block") && getActionTypeForBlockType(block.type)) {
      ignored.push(block.id);
    }
  }
  return ignored;
}

// Scan workspace for VALUE_COMPARE blocks and record their left/right input block types.
// Used by detectRunnerIndexUnhandled to identify comparisons involving VALUE_RUNNER_INDEX
// without needing live workspace access inside the pure classifier.
function collectComparisonInputTypes(app) {
  if (!app.blocklyWorkspace) return {};
  const result = {};
  for (const block of app.blocklyWorkspace.getAllBlocks(false)) {
    if (block.type === BLOCK_TYPES.VALUE_COMPARE) {
      const leftBlock = block.getInputTargetBlock?.("LEFT");
      const rightBlock = block.getInputTargetBlock?.("RIGHT");
      result[block.id] = {
        leftBlockType: leftBlock?.type ?? null,
        rightBlockType: rightBlock?.type ?? null
      };
    }
  }
  return result;
}

function countTeamAllies(state, teamId) {
  return (state.allRunners || []).filter(
    (r) => r.team === teamId && !r.isNPC && !r.isHumanControlled
  ).length;
}

export function stashBlocklyTrace(app, runner, trace) {
  if (!trace) {
    return;
  }

  const runnerId = runner?.id ?? null;
  const runnerTeam = runner?.team ?? null;
  const turnNumber = app.state.currentTurnNumber;
  const levelId = app.state.currentLevelId;

  // Dev-inspection mirror — browser only, shape unchanged from Plan 25a.
  if (typeof window !== "undefined") {
    window.__bbaLastBlocklyTrace = { runnerId, runnerTeam, turnNumber, levelId, steps: trace };
  }

  // State-based trace with workspace-enriched metadata for the Plan 37 classifier.
  // ignoredActionBlockIds and comparisonInputBlockTypes require live workspace access,
  // so they are computed here (legitimate) rather than inside the pure classifier.
  app.state.lastBlocklyTrace = {
    runnerId,
    runnerTeam,
    turnNumber,
    levelId,
    steps: trace,
    ignoredActionBlockIds: collectIgnoredActionBlockIds(app),
    comparisonInputBlockTypes: collectComparisonInputTypes(app),
    teamAllyCount: countTeamAllies(app.state, runnerTeam),
    runnerAllyIndex: runner?.allyIndex ?? null
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
