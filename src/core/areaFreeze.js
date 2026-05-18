import { AREA_FREEZE_COOLDOWN_TURNS } from "../config/constants.js";

const TEAM_IDS = [1, 2];

function normalizeTeamId(teamId) {
  return Number(teamId) === 2 ? 2 : 1;
}

function ensureAreaFreezeState(state) {
  if (!state) {
    return;
  }

  if (!state.teamAreaFreezeNextAvailableTurn || typeof state.teamAreaFreezeNextAvailableTurn !== "object") {
    state.teamAreaFreezeNextAvailableTurn = { 1: 1, 2: 1 };
  }
  if (!state.teamAreaFreezeUsed || typeof state.teamAreaFreezeUsed !== "object") {
    // Legacy historical flag: useful for debugging/compatibility, but never used for readiness checks.
    state.teamAreaFreezeUsed = { 1: false, 2: false };
  }

  for (const teamId of TEAM_IDS) {
    if (!Number.isFinite(Number(state.teamAreaFreezeNextAvailableTurn[teamId]))) {
      state.teamAreaFreezeNextAvailableTurn[teamId] = 1;
    }
    if (typeof state.teamAreaFreezeUsed[teamId] !== "boolean") {
      state.teamAreaFreezeUsed[teamId] = false;
    }
  }
}

export function resetAreaFreezeState(state) {
  ensureAreaFreezeState(state);
  if (!state) {
    return;
  }

  for (const teamId of TEAM_IDS) {
    state.teamAreaFreezeNextAvailableTurn[teamId] = 1;
    state.teamAreaFreezeUsed[teamId] = false;
  }
}

export function isAreaFreezeReady(state, teamId) {
  ensureAreaFreezeState(state);
  const normalizedTeamId = normalizeTeamId(teamId);
  const nextAvailableTurn = Number(state?.teamAreaFreezeNextAvailableTurn?.[normalizedTeamId] ?? 1);
  const currentTurnNumber = Number(state?.currentTurnNumber ?? 1);
  return Number.isFinite(nextAvailableTurn) ? currentTurnNumber >= nextAvailableTurn : true;
}

export function getAreaFreezeTurnsRemaining(state, teamId) {
  ensureAreaFreezeState(state);
  const normalizedTeamId = normalizeTeamId(teamId);
  const nextAvailableTurn = Number(state?.teamAreaFreezeNextAvailableTurn?.[normalizedTeamId] ?? 1);
  const currentTurnNumber = Number(state?.currentTurnNumber ?? 1);
  if (!Number.isFinite(nextAvailableTurn) || !Number.isFinite(currentTurnNumber)) {
    return 0;
  }
  return Math.max(0, nextAvailableTurn - currentTurnNumber);
}

export function markAreaFreezeUsed(state, teamId) {
  ensureAreaFreezeState(state);
  const normalizedTeamId = normalizeTeamId(teamId);
  const currentTurnNumber = Number(state?.currentTurnNumber ?? 1);
  const nextAvailableTurn = Number.isFinite(currentTurnNumber)
    ? currentTurnNumber + AREA_FREEZE_COOLDOWN_TURNS
    : 1 + AREA_FREEZE_COOLDOWN_TURNS;

  state.teamAreaFreezeNextAvailableTurn[normalizedTeamId] = nextAvailableTurn;
  state.teamAreaFreezeUsed[normalizedTeamId] = true;
  return nextAvailableTurn;
}
