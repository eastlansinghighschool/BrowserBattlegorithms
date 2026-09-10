/**
 * attemptCounters.js
 *
 * Per-attempt collision and wasted-resource counter tracking for Browser Battlegorithms (Plan 116).
 * Mechanically derives four distinct counters from the Plan 35 event log:
 * - runnerCollisionBounces: runner.blockedOrBounced with reason "runner_collision_bounce"
 * - mapBlockageBounces: runner.blockedOrBounced with map blockage reasons ("wall", "barrier", "out_of_bounds")
 * - resourceUnavailableAttempts: resource.unavailable (jump exhausted, barrier exhausted/active, freeze on cooldown)
 * - ineffectiveFreezeUses: runner.actionResolved for Area Freeze with outcome "freeze_applied" and affectedCount === 0
 *
 * Counters are strictly scoped to program-controlled ally runners (runnerRole === "ally").
 * Counters survive intra-attempt round resets (resetRound) and reset at attempt start/reset boundaries
 * (initializeMatch and initializeDisplayState).
 */

import { AI_ACTION_TYPES } from "../config/constants.js";

/**
 * Creates a fresh set of attempt counter values.
 * @returns {{ runnerCollisionBounces: number, mapBlockageBounces: number, resourceUnavailableAttempts: number, ineffectiveFreezeUses: number }}
 */
export function createAttemptCounters() {
  return {
    runnerCollisionBounces: 0,
    mapBlockageBounces: 0,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  };
}

/**
 * Ensures attemptCounters exists on state.
 * @param {Object} state
 * @returns {Object|null}
 */
export function ensureAttemptCounters(state) {
  if (!state || typeof state !== "object") {
    return null;
  }
  if (!state.attemptCounters || typeof state.attemptCounters !== "object") {
    state.attemptCounters = createAttemptCounters();
  }
  return state.attemptCounters;
}

/**
 * Resets attemptCounters on state to all zeroes.
 * @param {Object} state
 * @returns {Object|null}
 */
export function resetAttemptCounters(state) {
  if (!state || typeof state !== "object") {
    return null;
  }
  state.attemptCounters = createAttemptCounters();
  return state.attemptCounters;
}

/**
 * Gets a clean snapshot copy of the current attempt counters.
 * @param {Object} state
 * @returns {{ runnerCollisionBounces: number, mapBlockageBounces: number, resourceUnavailableAttempts: number, ineffectiveFreezeUses: number }}
 */
export function getAttemptCounters(state) {
  const counters = ensureAttemptCounters(state);
  return {
    runnerCollisionBounces: counters ? counters.runnerCollisionBounces : 0,
    mapBlockageBounces: counters ? counters.mapBlockageBounces : 0,
    resourceUnavailableAttempts: counters ? counters.resourceUnavailableAttempts : 0,
    ineffectiveFreezeUses: counters ? counters.ineffectiveFreezeUses : 0
  };
}

/**
 * Passive event consumer called whenever an event is emitted.
 * Updates attempt counters based on the event kind and payload.
 *
 * @param {Object} state - Game state containing attemptCounters
 * @param {string} kind - Canonical event kind
 * @param {Object} payload - Event payload
 */
export function recordEventInAttemptCounters(state, kind, payload = {}) {
  const counters = ensureAttemptCounters(state);
  if (!counters || !payload || typeof payload !== "object") {
    return;
  }

  // Resolve runnerRole from payload or from state.allRunners by runnerId
  let role = payload.runnerRole;
  if (!role && payload.runnerId && Array.isArray(state.allRunners)) {
    const runner = state.allRunners.find((r) => r.id === payload.runnerId);
    role = runner?.runnerRole;
  }

  // Strictly scoped to program-controlled ally runners
  if (role !== "ally") {
    return;
  }

  if (kind === "runner.blockedOrBounced") {
    if (payload.reason === "runner_collision_bounce") {
      counters.runnerCollisionBounces += 1;
    } else {
      counters.mapBlockageBounces += 1;
    }
  } else if (kind === "resource.unavailable") {
    counters.resourceUnavailableAttempts += 1;
  } else if (kind === "runner.actionResolved") {
    if (
      payload.actionType === AI_ACTION_TYPES.FREEZE_OPPONENTS &&
      payload.outcome === "freeze_applied" &&
      payload.affectedCount === 0
    ) {
      counters.ineffectiveFreezeUses += 1;
    }
  }
}
