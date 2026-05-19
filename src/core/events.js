// Canonical emission sites:
// - turn.started -> src/core/turnEngine.js:605
// - runner.actionChosen -> src/core/turnEngine.js:189 (human input path); 271 (AI/NPC path); 288 (Blockly path)
// - runner.actionResolved -> src/core/turnEngine.js:323 (frozen/skipped turn); 584 (resolved action path)
// - runner.blockedOrBounced -> src/core/turnEngine.js:530 (map blockage bounce); 546 (runner collision bounce)
// - flag.pickedUp -> src/core/scoring.js:5
// - flag.dropped -> src/core/collisions.js:15
// - team.scored -> src/core/scoring.js:26
// - level.forcedFailedAtGameOver -> src/core/levels.js (guided-mode safety net)
// - resource.unavailable -> src/core/turnEngine.js:290 (jump resource exhausted fallback); 294 (barrier resource unavailable fallback); 494 (freeze cooldown guard)
// - level.result -> src/core/levels.js:323

function ensureTurnEventLogState(state) {
  if (!state || typeof state !== "object") {
    return false;
  }
  if (!Array.isArray(state.currentTurnEventLog)) {
    state.currentTurnEventLog = [];
  }
  if (!Array.isArray(state.lastTurnEventLog)) {
    state.lastTurnEventLog = [];
  }
  return true;
}

export function emit(state, kind, payload = {}) {
  if (typeof kind !== "string" || !kind) {
    return null;
  }
  if (!ensureTurnEventLogState(state)) {
    return null;
  }

  const eventPayload = payload && typeof payload === "object" ? payload : {};
  const event = {
    kind,
    turn: state.currentTurnNumber,
    payload: eventPayload
  };
  state.currentTurnEventLog.push(event);
  return event;
}

export function finalizeTurnEventLog(state) {
  if (!ensureTurnEventLogState(state)) {
    return [];
  }

  if (state.currentTurnEventLog.length > 0) {
    state.lastTurnEventLog = state.currentTurnEventLog.map((event) => ({
      kind: event.kind,
      turn: event.turn,
      payload: event && typeof event.payload === "object" ? { ...event.payload } : {}
    }));
  }

  state.currentTurnEventLog = [];
  return state.lastTurnEventLog;
}
