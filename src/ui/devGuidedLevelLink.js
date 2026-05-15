import { enterGuidedMode } from "../core/levels.js";

const DEV_GUIDED_LEVEL_PARAM = "devGuidedLevel";

function readGuidedLevelId(rawValue) {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    return null;
  }

  const queryText = rawValue.startsWith("?") || rawValue.startsWith("#") ? rawValue.slice(1) : rawValue;
  if (!queryText) {
    return null;
  }

  const params = new URLSearchParams(queryText);
  const levelId = params.get(DEV_GUIDED_LEVEL_PARAM);
  return typeof levelId === "string" && levelId.trim().length > 0 ? levelId.trim() : null;
}

export function getDevGuidedLevelIdFromLocation(locationLike = globalThis.location) {
  const queryLevelId = readGuidedLevelId(locationLike?.search);
  if (queryLevelId) {
    return queryLevelId;
  }

  return readGuidedLevelId(locationLike?.hash);
}

export function applyDevGuidedLevelShortcut(app, { locationLike = globalThis.location, isDev = false } = {}) {
  if (!isDev) {
    return null;
  }

  const requestedLevelId = getDevGuidedLevelIdFromLocation(locationLike);
  if (!requestedLevelId) {
    return null;
  }

  const level = app.state.levels.find((entry) => entry.id === requestedLevelId);
  if (!level) {
    console.warn(`[BBA] Ignoring unknown dev guided level id: ${requestedLevelId}`);
    return null;
  }

  app.state.showModePicker = false;
  app.state.guidedLevelDevAccessActive = true;
  app.state.guidedLevelDevAccessLevelId = level.id;
  app.state.guidedLevelBlocklyAssistActive = true;
  app.state.guidedLevelBlocklyAssistApplied = false;
  app.state.guidedLevelBlocklyAssistLevelId = level.id;
  app.state.currentLevelId = level.id;
  enterGuidedMode(app);
  if (app.state.levelProgress[level.id] === "LOCKED") {
    app.state.currentLevelStatus = "AVAILABLE";
  }
  return level;
}
