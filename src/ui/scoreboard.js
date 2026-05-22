import { FREE_PLAY_MODES, GAME_VIEW_MODES } from "../config/constants.js";
import { getAreaFreezeTurnsRemaining, isAreaFreezeReady } from "../core/areaFreeze.js";

const FREEZE_TOOLBOX_BLOCK_TYPES = new Set([
  "battlegorithms_freeze_opponents",
  "battlegorithms_if_area_freeze_ready",
  "battlegorithms_if_area_freeze_ready_else",
  "battlegorithms_boolean_area_freeze_ready"
]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getVisibleAreaFreezeTeams(state) {
  if (!state || state.showModePicker) {
    return [];
  }

  if (state.currentModeView === GAME_VIEW_MODES.FREE_PLAY) {
    return state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER ? [1, 2] : [1];
  }

  const toolbox = state.currentToolboxBlockTypes || [];
  const currentLevelToolbox = state.levels?.find((level) => level.id === state.currentLevelId)?.toolboxBlockTypes || [];
  const combined = new Set([...toolbox, ...currentLevelToolbox]);
  const shouldShow = [...combined].some((blockType) => FREEZE_TOOLBOX_BLOCK_TYPES.has(blockType));
  return shouldShow ? [1] : [];
}

function buildAreaFreezeChipText(state, teamId, showTeamPrefix) {
  const ready = isAreaFreezeReady(state, teamId);
  const turnsRemaining = getAreaFreezeTurnsRemaining(state, teamId);
  const prefix = showTeamPrefix ? `T${teamId} ` : "";
  const visibleState = ready ? "Ready" : `${turnsRemaining} turn${turnsRemaining === 1 ? "" : "s"}`;
  const accessibleText = `Team ${teamId} Area Freeze ${ready ? "is ready" : `available in ${turnsRemaining} turn${turnsRemaining === 1 ? "" : "s"}`}`;
  const visibleText = `${prefix}❄ ${visibleState}`;
  return {
    html: `
      <span class="area-freeze-status-chip">
        <span class="area-freeze-status-a11y">${escapeHtml(accessibleText)}</span>
        <span aria-hidden="true">${escapeHtml(visibleText)}</span>
      </span>
    `.trim()
  };
}

export function updateAreaFreezeStatus(app) {
  const statusElement = document.getElementById("areaFreezeStatus");
  if (!statusElement) {
    return;
  }

  const visibleTeams = getVisibleAreaFreezeTeams(app.state);
  if (visibleTeams.length === 0) {
    statusElement.hidden = true;
    statusElement.innerHTML = "";
    return;
  }

  const showTeamPrefix = visibleTeams.length > 1;
  statusElement.hidden = false;
  statusElement.innerHTML = visibleTeams.map((teamId) => buildAreaFreezeChipText(app.state, teamId, showTeamPrefix).html).join("");
}

export function updateScoreDisplay(app) {
  const scoreElement = document.getElementById("scoreDisplay");
  if (!scoreElement) {
    updateAreaFreezeStatus(app);
    return;
  }
  if (app.state.showModePicker) {
    scoreElement.textContent = "";
    updateAreaFreezeStatus(app);
    return;
  }
  const { currentTurnNumber, teamScores, pointsToWin, currentModeView, activeLevelResult, currentLevelId, levels, freePlayPointTurnLimit, freePlayRoundStartTurn } = app.state;
  const isPvP = app.state.freePlayMode === "PVP";
  const label1 = isPvP ? "P1" : "Team 1";
  const label2 = isPvP ? "P2" : "Team 2";
  let prefix = `Turn: ${currentTurnNumber} | Scores: ${label1}: ${teamScores[1]} - ${label2}: ${teamScores[2]} (Win at ${pointsToWin})`;
  if (currentModeView === "GUIDED_LEVELS") {
    const statusText = activeLevelResult === "IN_PROGRESS" ? "Level in progress" : activeLevelResult === "PASSED" ? "Level passed" : activeLevelResult === "FAILED" ? "Level failed" : "Level ready";
    const currentLevel = (levels || []).find((level) => level.id === currentLevelId);
    prefix = `${statusText} | Turn: ${currentTurnNumber}${currentLevel ? ` | ${currentLevel.title}` : ""}`;
  } else {
    const modeText = app.state.freePlayMode === "PVP"
      ? "PvP"
      : app.state.freePlayMode === "PVCPU_EASY"
        ? "PvCPU Easy"
        : "PvCPU Tactical";
    prefix = `${prefix} | ${modeText} | Map: ${app.state.freePlayMapKey} | Team Size: ${app.state.freePlayTeamSize}`;
    if (typeof freePlayPointTurnLimit === "number" && freePlayPointTurnLimit > 0) {
      const turnsUsed = currentTurnNumber - (freePlayRoundStartTurn ?? 1);
      const turnsRemaining = freePlayPointTurnLimit - turnsUsed;
      if (turnsRemaining <= 10 && turnsRemaining > 0) {
        prefix = `${prefix} | Point resets in ${turnsRemaining} turn${turnsRemaining === 1 ? "" : "s"}`;
      }
    }
  }
  scoreElement.innerHTML = prefix;
  updateAreaFreezeStatus(app);
}
