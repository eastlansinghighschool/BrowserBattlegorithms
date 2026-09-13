import { GAME_VIEW_MODES } from "../config/constants.js";

export const WORKSHEET_CHECKPOINT_PARAM = "worksheetAt";

function escapeHtml(value) {
  return `${value || ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Parses the worksheetAt query parameter from a search string.
 * Consumes location.search ONLY. Never reads location.hash.
 *
 * @param {string} searchString - e.g. location.search or "?worksheetAt=lvl1,lvl2"
 * @returns {{ isPresent: boolean, rawIds: string[] }}
 */
export function parseWorksheetCheckpointsParam(searchString) {
  if (typeof searchString !== "string" || searchString.length === 0) {
    return { isPresent: false, rawIds: [] };
  }

  const queryText = searchString.startsWith("?") ? searchString.slice(1) : searchString;
  if (!queryText) {
    return { isPresent: false, rawIds: [] };
  }

  const params = new URLSearchParams(queryText);
  if (!params.has(WORKSHEET_CHECKPOINT_PARAM)) {
    return { isPresent: false, rawIds: [] };
  }

  const rawValue = params.get(WORKSHEET_CHECKPOINT_PARAM);
  if (rawValue === null) {
    return { isPresent: false, rawIds: [] };
  }

  const splitIds = rawValue
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  // Deduplicate while preserving order
  const rawIds = [...new Set(splitIds)];

  return {
    isPresent: true,
    rawIds
  };
}

/**
 * Resolves a list of raw level IDs against the level definitions in app.state.levels.
 * Nested step and challenge IDs (e.g. bughunt-22-trace) are not top-level level IDs
 * and therefore correctly land in unknownIds.
 *
 * Partial matches are supported: a bad ID never suppresses valid IDs.
 *
 * @param {string[]} rawIds
 * @param {Array<{ id: string }>} levels
 * @returns {{ resolvedLevelIds: Set<string>, unknownIds: string[] }}
 */
export function resolveWorksheetCheckpoints(rawIds, levels) {
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return {
      resolvedLevelIds: new Set(),
      unknownIds: []
    };
  }

  const validLevelIdSet = new Set(
    (Array.isArray(levels) ? levels : [])
      .map((level) => level?.id)
      .filter((id) => typeof id === "string" && id.length > 0)
  );

  const resolvedLevelIds = new Set();
  const unknownIds = [];

  for (const rawId of rawIds) {
    if (validLevelIdSet.has(rawId)) {
      resolvedLevelIds.add(rawId);
    } else {
      unknownIds.push(rawId);
    }
  }

  return {
    resolvedLevelIds,
    unknownIds
  };
}

/**
 * Reads location.search and resolves against levels.
 *
 * @param {object} [locationLike=globalThis?.location]
 * @param {Array<{ id: string }>} [levels=[]]
 * @returns {{ isPresent: boolean, resolvedLevelIds: Set<string>, unknownIds: string[] }}
 */
export function getWorksheetCheckpointsFromLocation(locationLike = globalThis?.location, levels = []) {
  const { isPresent, rawIds } = parseWorksheetCheckpointsParam(locationLike?.search);
  const { resolvedLevelIds, unknownIds } = resolveWorksheetCheckpoints(rawIds, levels);
  return {
    isPresent,
    resolvedLevelIds,
    unknownIds
  };
}

/**
 * Initializes worksheet checkpoints state on app.state.
 *
 * @param {object} app
 * @param {object} [options]
 * @param {object} [options.locationLike=globalThis?.location]
 */
export function initializeWorksheetCheckpoints(app, { locationLike = globalThis?.location } = {}) {
  const { isPresent, resolvedLevelIds, unknownIds } = getWorksheetCheckpointsFromLocation(
    locationLike,
    app?.state?.levels || []
  );

  if (app?.state) {
    app.state.worksheetCheckpoints = {
      isPresent,
      resolvedLevelIds,
      unknownIds
    };
    if (!app.state.worksheetCheckpointsReached) {
      app.state.worksheetCheckpointsReached = new Set();
    }
    if (!app.state.worksheetReminderDismissedLevels) {
      app.state.worksheetReminderDismissedLevels = new Set();
    }
    app.state.worksheetUnknownNoticeDismissed = false;
  }
}

/**
 * Checks if a given levelId is a registered worksheet checkpoint.
 *
 * @param {object} app
 * @param {string} levelId
 * @returns {boolean}
 */
export function isWorksheetCheckpointLevel(app, levelId) {
  if (!levelId || !app?.state?.worksheetCheckpoints?.resolvedLevelIds) {
    return false;
  }
  return app.state.worksheetCheckpoints.resolvedLevelIds.has(levelId);
}

/**
 * Renders the load-time warning banner for unknown worksheet IDs.
 * Reuses Plan 118's .workspace-import-status.workspace-import-status-warning and
 * .storage-status-dismiss affordance.
 *
 * Scoped to Guided Levels (D3): hidden in Free Play so Free Play remains unaltered.
 *
 * @param {object} app
 * @returns {string}
 */
export function renderWorksheetUnknownIdBanner(app) {
  const unknownIds = app?.state?.worksheetCheckpoints?.unknownIds;
  if (!Array.isArray(unknownIds) || unknownIds.length === 0) {
    return "";
  }
  if (app.state.worksheetUnknownNoticeDismissed) {
    return "";
  }
  if (app.state.currentModeView !== GAME_VIEW_MODES.GUIDED_LEVELS) {
    return "";
  }

  const badIdsText = unknownIds.join(", ");
  const hasResolved = app.state.worksheetCheckpoints.resolvedLevelIds?.size > 0;
  const copy = hasResolved
    ? `This link lists worksheet checkpoints that do not match any level: ${badIdsText}. The other checkpoints still work.`
    : `This link lists worksheet checkpoints that do not match any level: ${badIdsText}.`;

  return `
    <div id="worksheet-unknown-status" class="workspace-import-status workspace-import-status-warning" role="status">
      <span class="storage-status-text">${escapeHtml(copy)}</span>
      <button type="button" id="worksheetUnknownStatusDismiss" class="storage-status-dismiss" aria-label="Dismiss worksheet warning">Got it</button>
    </div>
  `.trim();
}

/**
 * Renders the non-blocking marker inside the .level-result.success banner.
 * Does not name the medium ("Check your worksheet!", not "paper").
 *
 * @param {object} app
 * @param {object} currentLevel
 * @returns {string}
 */
export function renderWorksheetResultMarker(app, currentLevel) {
  if (!isWorksheetCheckpointLevel(app, currentLevel?.id)) {
    return "";
  }
  return ' <span class="worksheet-checkpoint-marker">Check your worksheet!</span>';
}

/**
 * Renders the dismissible per-level reminder in the lesson card.
 *
 * Gated strictly on:
 * 1. Level is a registered checkpoint.
 * 2. Level has reached PASSED at least once in this tab session (worksheetCheckpointsReached).
 * 3. Level reminder has not been dismissed in this tab session (worksheetReminderDismissedLevels).
 *
 * Has its own CSS class (.lesson-worksheet-reminder), reusing .storage-status-dismiss for the button.
 *
 * @param {object} app
 * @param {object} currentLevel
 * @returns {string}
 */
export function renderWorksheetReminder(app, currentLevel) {
  const levelId = currentLevel?.id;
  if (!levelId) {
    return "";
  }
  if (!isWorksheetCheckpointLevel(app, levelId)) {
    return "";
  }
  if (!app.state.worksheetCheckpointsReached?.has(levelId)) {
    return "";
  }
  if (app.state.worksheetReminderDismissedLevels?.has(levelId)) {
    return "";
  }

  return `
    <div class="lesson-worksheet-reminder" role="note" aria-label="Worksheet checkpoint reminder">
      <div class="lesson-worksheet-reminder-copy">
        <p class="lesson-worksheet-reminder-label">Worksheet Checkpoint</p>
        <p class="lesson-worksheet-reminder-body">Remember to check your worksheet for this level.</p>
      </div>
      <button
        type="button"
        class="storage-status-dismiss lesson-worksheet-reminder-dismiss"
        data-worksheet-action="dismiss-reminder"
        aria-label="Dismiss worksheet reminder"
      >
        Got it
      </button>
    </div>
  `.trim();
}
