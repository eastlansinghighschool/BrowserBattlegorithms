import { LEVEL_RESULT, MAIN_GAME_STATES } from "../config/constants.js";
import { speak as speakVoiceNarration } from "./voiceNarration.js";

import { loadPreference, savePreference, parseBoolean, PREF_KEYS } from "./preferences.js";

function toCellLabel(cell) {
  if (!cell || typeof cell.x !== "number" || typeof cell.y !== "number") {
    return "";
  }
  return `row ${cell.y + 1}, column ${cell.x + 1}`;
}

function getNpcIndexLabel(runnerId) {
  const match = `${runnerId || ""}`.match(/Npc(\d+)/i);
  if (!match) {
    return 0;
  }
  const numeric = Number.parseInt(match[1], 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 0;
  }
  return numeric - 1;
}

export function getRunnerLabel(state, runnerId, payload = {}) {
  if (typeof payload.runnerLabel === "string" && payload.runnerLabel) {
    return payload.runnerLabel;
  }

  const runner = state?.allRunners?.find((candidate) => candidate.id === runnerId) || null;
  if (!runner) {
    return "Runner";
  }

  if (runner.isHumanControlled) {
    return `Team ${runner.team} runner 0`;
  }

  if (runner.isNPC) {
    return `Enemy ${getNpcIndexLabel(runner.id)}`;
  }

  const allyIndex = Number.isFinite(runner.allyIndex) ? runner.allyIndex : 0;
  return `Ally ${allyIndex}`;
}

function getActionPhrase(actionType) {
  switch (actionType) {
    case "JUMP_FORWARD":
      return "tried to jump forward";
    case "PLACE_BARRIER_FORWARD":
      return "tried to place a barrier";
    case "FREEZE_OPPONENTS":
      return "tried to freeze opponents";
    case "STAY_STILL":
      return "stayed still";
    case "MOVE":
    case "MOVE_FORWARD":
    case "MOVE_BACKWARD":
    case "MOVE_UP_SCREEN":
    case "MOVE_DOWN_SCREEN":
      return "moved";
    default:
      return "acted";
  }
}

function describeResourceUnavailable(resourceEvent) {
  const actionType = resourceEvent?.payload?.actionType || "";
  const reason = resourceEvent?.payload?.reason || "";
  if (actionType === "FREEZE_OPPONENTS" && reason === "freeze_on_cooldown") {
    return "but Area Freeze was still cooling down";
  }
  if (actionType === "JUMP_FORWARD" && reason === "jump_exhausted") {
    return "but the jump was already used";
  }
  if (actionType === "PLACE_BARRIER_FORWARD" && reason === "barrier_exhausted") {
    return "but the barrier was already used";
  }
  if (actionType === "PLACE_BARRIER_FORWARD" && reason === "barrier_already_active") {
    return "but a barrier was already active";
  }
  return "but the resource was unavailable";
}

function buildNarrationContext(eventLog, state) {
  const runnerStartedEvent = eventLog.find((event) => event.kind === "turn.started");
  const runnerId = runnerStartedEvent?.payload?.runnerId || null;
  const runnerLabel = runnerStartedEvent ? getRunnerLabel(state, runnerId, runnerStartedEvent.payload) : "Runner";
  const runner = state?.allRunners?.find((candidate) => candidate.id === runnerId) || null;
  const actionResolved = eventLog.find((event) => event.kind === "runner.actionResolved") || null;
  const blockedOrBounced = eventLog.find((event) => event.kind === "runner.blockedOrBounced") || null;
  const pickupEvent = eventLog.find((event) => event.kind === "flag.pickedUp") || null;
  const dropEvent = eventLog.find((event) => event.kind === "flag.dropped") || null;
  const scoreEvent = eventLog.find((event) => event.kind === "team.scored") || null;
  const scoreBlockedEvent = eventLog.find((event) => event.kind === "score.blocked") || null;
  const resourceUnavailable = eventLog.find((event) => event.kind === "resource.unavailable") || null;
  const levelResult = eventLog.find((event) => event.kind === "level.result") || null;
  const turnNumber = runnerStartedEvent?.turn ?? eventLog[0]?.turn ?? 0;

  return {
    turnNumber,
    runnerLabel,
    runner,
    actionResolved,
    blockedOrBounced,
    pickupEvent,
    dropEvent,
    scoreEvent: scoreEvent ? {
      ...scoreEvent,
      payload: {
        ...scoreEvent.payload,
        otherScore: scoreEvent.payload.otherScore ?? (
          scoreEvent.payload.scoringTeam === 1
            ? Number(state?.teamScores?.[2] || 0)
            : Number(state?.teamScores?.[1] || 0)
        )
      }
    } : null,
    scoreBlockedEvent,
    resourceUnavailable,
    levelResult
  };
}

function formatMovementSentence(context) {
  const { actionResolved, runnerLabel, blockedOrBounced } = context;
  const outcome = actionResolved?.payload?.outcome || "";
  const actionType = actionResolved?.payload?.actionType || "";
  const finalCell = actionResolved?.payload?.finalCell
    || actionResolved?.payload?.targetCell
    || (context.runner ? { x: context.runner.gridX, y: context.runner.gridY } : null);
  const cellLabel = toCellLabel(finalCell);

  if (outcome === "skipped_frozen") {
    return `${runnerLabel} is frozen and skipped a turn.`;
  }
  if (outcome === "freeze_applied") {
    return `${runnerLabel} froze opponents.`;
  }
  if (outcome === "barrier_placed") {
    return `${runnerLabel} placed a barrier.`;
  }
  if (outcome === "illegal_noop") {
    return `${runnerLabel} could not act.`;
  }
  if (blockedOrBounced && outcome === "stayed") {
    const blockedCellLabel = toCellLabel(blockedOrBounced.payload?.attemptedCell);
    const reason = blockedOrBounced.payload?.reason || "";
    const blockerText = reason === "runner_collision_bounce"
      ? "another runner"
      : reason === "out_of_bounds"
        ? "the edge"
        : reason === "wall"
          ? "a wall"
          : "a barrier";
    return `${runnerLabel} bounced off ${blockerText}${blockedCellLabel ? ` at ${blockedCellLabel}` : ""}.`;
  }
  if (outcome === "moved" || outcome === "jumped") {
    const verb = actionType === "JUMP_FORWARD" || outcome === "jumped" ? "jumped" : "moved";
    return `${runnerLabel} ${verb}${cellLabel ? ` to ${cellLabel}` : ""}.`;
  }
  if (outcome === "stayed") {
    return `${runnerLabel} stayed still.`;
  }
  return `${runnerLabel} acted.`;
}

function formatResourceSentence(context) {
  const event = context.resourceUnavailable;
  if (!event) {
    return "";
  }

  const actionType = event.payload?.actionType || "";
  const actionPhrase = getActionPhrase(actionType);
  const reasonPhrase = describeResourceUnavailable(event);
  const runnerLabel = context.runnerLabel;
  return `${runnerLabel} ${actionPhrase}, ${reasonPhrase}. ${runnerLabel} stayed still.`;
}

function formatPickupSentence(context) {
  if (!context.pickupEvent) {
    return "";
  }
  return "and picked up the enemy flag.";
}

function formatDropSentence(context) {
  if (!context.dropEvent) {
    return "";
  }
  const dropCell = toCellLabel(context.dropEvent.payload?.cell);
  return dropCell ? `The enemy flag dropped at ${dropCell}.` : "The enemy flag dropped.";
}

function formatScoreSentence(context) {
  if (!context.scoreEvent) {
    return "";
  }
  const scoringTeam = context.scoreEvent.payload?.scoringTeam;
  const otherScore = context.scoreEvent.payload?.otherScore ?? 0;
  const newScore = context.scoreEvent.payload?.newScore ?? 0;
  const teamLabel = scoringTeam ? `Team ${scoringTeam}` : "A team";
  return `${context.runnerLabel} returned the enemy flag to base. ${teamLabel} scored. Score ${newScore} to ${otherScore}.`;
}

function formatScoreBlockedSentence(context) {
  if (!context.scoreBlockedEvent) {
    return "";
  }
  const blockedTeam = context.scoreBlockedEvent.payload?.blockedTeam;
  const teamLabel = blockedTeam ? `Team ${blockedTeam}` : "A team";
  return `${teamLabel} reached base with the enemy flag, but their own flag is away.`;
}

function formatLevelResultSentence(context) {
  if (!context.levelResult) {
    return "";
  }
  if (context.levelResult.payload?.result === LEVEL_RESULT.PASSED) {
    return "Level passed.";
  }
  if (context.levelResult.payload?.result === LEVEL_RESULT.FAILED) {
    return "Level failed.";
  }
  return "";
}

export function initializeNarrationState(state) {
  state.narrationVisibleStrip = loadPreference(PREF_KEYS.TURN_LOG_VISIBLE, false, parseBoolean);
  state.lastTurnNarrationText = "";
}

export function setNarrationVisibleStrip(state, enabled) {
  state.narrationVisibleStrip = Boolean(enabled);
  savePreference(PREF_KEYS.TURN_LOG_VISIBLE, state.narrationVisibleStrip);
}

/**
 * Format a finalized turn event log into one factual sentence.
 *
 * The caller is responsible for enriching raw Plan 35 events with
 * runnerLabel, finalCell, and otherScore before invoking this formatter.
 * announceLastTurn(app) performs that enrichment, while Playwright coverage
 * verifies the label fallback and live-region wiring end to end.
 */
export function formatTurnNarration(eventLog) {
  if (!Array.isArray(eventLog) || eventLog.length === 0) {
    return "";
  }

  const context = buildNarrationContext(eventLog, null);
  const firstEvent = eventLog[0];
  const turnNumber = context.turnNumber || firstEvent.turn || 0;
  const introSentence = `Turn ${turnNumber}.`;
  const movementSentence = formatMovementSentence(context);
  const resourceSentence = formatResourceSentence(context);
  const pickupSentence = formatPickupSentence(context);
  const dropSentence = formatDropSentence(context);
  const scoreSentence = formatScoreSentence(context);
  const scoreBlockedSentence = formatScoreBlockedSentence(context);
  const levelResultSentence = formatLevelResultSentence(context);

  if (resourceSentence) {
    return `${introSentence} ${resourceSentence}${levelResultSentence ? ` ${levelResultSentence}` : ""}`.trim();
  }

  let sentence = `${introSentence} ${movementSentence}`;
  if (pickupSentence) {
    sentence = sentence.replace(/\.$/, "");
    sentence += ` ${pickupSentence}`;
  }
  if (dropSentence) {
    sentence += ` ${dropSentence}`;
  }
  if (scoreSentence) {
    sentence += ` ${scoreSentence}`;
  }
  if (scoreBlockedSentence) {
    sentence += ` ${scoreBlockedSentence}`;
  }
  if (levelResultSentence) {
    sentence += ` ${levelResultSentence}`;
  }
  return sentence.trim();
}

export function syncTurnNarration(app) {
  const liveRegion = document.getElementById("board-narration");
  const visibleStrip = document.getElementById("board-narration-strip");
  if (!liveRegion && !visibleStrip) {
    return;
  }

  const shouldHideAllNarration =
    !app?.state ||
    app.state.showModePicker ||
    (
      app.state.mainGameState !== MAIN_GAME_STATES.RUNNING &&
      app.state.mainGameState !== MAIN_GAME_STATES.GAME_OVER
    );

  const text = shouldHideAllNarration ? "" : `${app.state.lastTurnNarrationText || ""}`;
  if (liveRegion && liveRegion.textContent !== text) {
    liveRegion.textContent = text;
  }
  if (visibleStrip) {
    visibleStrip.textContent = text;
    visibleStrip.hidden = shouldHideAllNarration || !app.state.narrationVisibleStrip || !text;
  }
}

export function announceLastTurn(app) {
  if (
    !app?.state ||
    (
      app.state.mainGameState !== MAIN_GAME_STATES.RUNNING &&
      app.state.mainGameState !== MAIN_GAME_STATES.GAME_OVER
    )
  ) {
    syncTurnNarration(app);
    return;
  }

  const enrichedLog = buildNarrationContext(app.state.lastTurnEventLog || [], app.state);
  const turnLog = (app.state.lastTurnEventLog || []).map((event) => ({
    ...event,
    payload: {
      ...event.payload,
      runnerLabel: enrichedLog.runnerLabel,
      finalCell: enrichedLog.runner ? { x: enrichedLog.runner.gridX, y: enrichedLog.runner.gridY } : null,
      otherScore: enrichedLog.scoreEvent?.payload?.otherScore
    }
  }));
  const text = formatTurnNarration(turnLog);
  app.state.lastTurnNarrationText = text;

  const liveRegion = document.getElementById("board-narration");
  if (liveRegion) {
    liveRegion.textContent = text;
  }
  speakVoiceNarration(text, "board-narration");
  syncTurnNarration(app);
}
