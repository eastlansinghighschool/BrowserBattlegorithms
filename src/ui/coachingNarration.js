// Plan 38: Learning Coach Text
// Turns Plan 37 LearningMoment records into short opt-in coaching messages.
// Coaching is separable from Plan 36 factual narration: different DOM elements,
// different toggle, different aria-live region.
//
// Ethics rules enforced here:
//   - Never names a specific block unless it is already in the current toolbox.
//   - Messages are ≤ 25 words, phrased as questions or observations (not commands).
//   - Cadence limits prevent the same message from becoming wallpaper.
//   - Default off; student/teacher must opt in.

import { isBlocklyTraceCollectionActive, MAIN_GAME_STATES } from "../config/constants.js";
import { classifyTurn } from "../ai/learningMoments.js";
import { getRunnerLabel } from "./narration.js";
import { speak as speakVoiceCoaching } from "./voiceNarration.js";

const COACHING_STORAGE_KEY = "bba:coaching-mode-enabled";

// Kinds that only show during slow-trace mode (trace playback active).
const SLOW_TRACE_ONLY = new Set(["no_action_selected"]);

// Kinds that only show on the first occurrence per level attempt.
// "ignored_blocks_below_action" is ideally per workspace-edit, but tracking
// workspace edits requires Blockly listeners outside this module's scope;
// per-level-attempt is the conservative fallback (documented in progress report).
const FIRST_TIME_ONLY = new Set(["bounced", "ignored_blocks_below_action", "runner_index_unhandled"]);

// ─── Template helpers ─────────────────────────────────────────────────────────

function bounceObstacle(reason) {
  if (reason === "wall") return "a wall";
  if (reason === "barrier") return "a barrier";
  if (reason === "out_of_bounds") return "the edge";
  if (reason === "runner_collision_bounce") return "another runner";
  return "an obstacle";
}

function resourceActionLabel(actionType) {
  if (actionType === "JUMP_FORWARD") return "jump";
  if (actionType === "PLACE_BARRIER_FORWARD") return "barrier";
  if (actionType === "FREEZE_OPPONENTS") return "freeze";
  return "resource action";
}

// Maps guard block types to the display labels shown in coaching messages.
const GUARD_BLOCK_LABELS = {
  "battlegorithms_if_can_jump": "Can Jump?",
  "battlegorithms_if_can_place_barrier": "Can Place Barrier?",
  "battlegorithms_if_area_freeze_ready": "Freeze Ready?"
};

function templateRecurring(moment, runnerLabel) {
  const { patternKind, occurrenceCount: n } = moment.metadata;
  if (patternKind === "bounced") {
    return `${runnerLabel} has bounced ${n} times this level. Consider adding conditions to find a path.`;
  }
  if (patternKind === "resource_no_readiness_guard") {
    return `${runnerLabel} tried an unavailable resource ${n} times. Consider adding a readiness check first.`;
  }
  if (patternKind === "no_action_selected") {
    return `${runnerLabel}'s program selected no action ${n} times. Do all branches lead to an action?`;
  }
  if (patternKind === "runner_index_unhandled") {
    return `${runnerLabel}'s index went unmatched ${n} times. Does the program cover every ally index?`;
  }
  return `${runnerLabel} repeated the same pattern ${n} times. Is the program structure what you intended?`;
}

// ─── Public: formatCoachingMessage ───────────────────────────────────────────

// Format a single LearningMoment into a short coaching string (≤ 25 words).
// Uses specific phrasing (block name) when the guard block is in toolboxBlockTypes;
// falls back to generic phrasing otherwise (Decision 3 — tiered phrasing).
// Returns an empty string for unknown kinds.
export function formatCoachingMessage(moment, runnerLabel, toolboxBlockTypes) {
  const blocks = toolboxBlockTypes || [];

  switch (moment.kind) {
    case "bounced": {
      const obstacle = bounceObstacle(moment.metadata?.reason);
      return `${runnerLabel} bounced off ${obstacle}. Did you plan a way to go around it?`;
    }
    case "resource_no_readiness_guard": {
      const action = resourceActionLabel(moment.metadata?.actionType);
      const guardType = moment.metadata?.missingGuardBlockType;
      const guardLabel = GUARD_BLOCK_LABELS[guardType];
      if (guardLabel && blocks.includes(guardType)) {
        return `${runnerLabel}'s ${action} was unavailable. Did you forget to check "${guardLabel}" first?`;
      }
      return `${runnerLabel}'s ${action} was unavailable. Did you add a readiness check before using it?`;
    }
    case "no_action_selected":
      return `${runnerLabel}'s program reached the end without picking an action this turn.`;
    case "ignored_blocks_below_action":
      return `${runnerLabel}'s program stopped at the first action. Are the blocks below it meant to run?`;
    case "recurring_pattern":
      return templateRecurring(moment, runnerLabel);
    case "runner_index_unhandled": {
      const idx = moment.metadata?.runnerIndex;
      const idxText = Number.isFinite(idx) ? ` index ${idx}` : "";
      return `${runnerLabel}'s program ended with no action. Does the${idxText} branch exist in the program?`;
    }
    default:
      return "";
  }
}

// ─── Public: shouldShowCoachingMoment ────────────────────────────────────────

// Cadence check — should the coach surface this moment this turn?
// Mutates recurrenceState.perLevelAttempt to mark first-shown moments.
// Cadence rules (Decision 1):
//   bounced                    — first time per level attempt
//   resource_no_readiness_guard— every occurrence
//   no_action_selected         — every occurrence during slow-trace mode only
//   ignored_blocks_below_action— first time per level attempt
//   recurring_pattern          — always (classifier already fires it only once)
//   runner_index_unhandled     — first time per level attempt
export function shouldShowCoachingMoment(moment, state, recurrenceState) {
  const perLevel = recurrenceState?.perLevelAttempt;
  if (!perLevel) return false;

  if (SLOW_TRACE_ONLY.has(moment.kind) && !isBlocklyTraceCollectionActive(state)) {
    return false;
  }

  if (FIRST_TIME_ONLY.has(moment.kind)) {
    const shownKey = `shown:${moment.kind}:${moment.runnerId}`;
    if (perLevel[shownKey]) return false;
    perLevel[shownKey] = true;
  }

  return true;
}

// ─── Public: computeCoachingText ─────────────────────────────────────────────

// Pure function. Classifies the current turn and returns the first eligible
// coaching message (empty string if coaching is off, nothing to say, or all
// moments are cadence-suppressed). Calls classifyTurn once — this is the only
// call site for the Plan 37 classifier per turn.
export function computeCoachingText(app) {
  const { state } = app;
  if (!state?.coachingModeEnabled) return "";

  const moments = classifyTurn(
    state.lastTurnEventLog || [],
    state.lastBlocklyTrace,
    state.classifierRecurrenceState
  );
  if (moments.length === 0) return "";

  const toolbox = state.currentToolboxBlockTypes || [];
  const recurrence = state.classifierRecurrenceState;

  for (const moment of moments) {
    if (!shouldShowCoachingMoment(moment, state, recurrence)) continue;
    const label = getRunnerLabel(state, moment.runnerId);
    const text = formatCoachingMessage(moment, label, toolbox);
    if (text) return text;
  }
  return "";
}

// ─── Persistence ─────────────────────────────────────────────────────────────

function hasWindowStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredCoachingPreference() {
  if (!hasWindowStorage()) return false;
  return window.localStorage.getItem(COACHING_STORAGE_KEY) === "true";
}

function writeStoredCoachingPreference(enabled) {
  if (!hasWindowStorage()) return;
  window.localStorage.setItem(COACHING_STORAGE_KEY, `${Boolean(enabled)}`);
}

// ─── Public: init / set ──────────────────────────────────────────────────────

export function initializeCoachingState(state) {
  state.coachingModeEnabled = readStoredCoachingPreference();
  state.lastCoachingText = "";
}

export function setCoachingModeEnabled(state, enabled) {
  state.coachingModeEnabled = Boolean(enabled);
  writeStoredCoachingPreference(state.coachingModeEnabled);
}

// ─── Public: DOM sync / announce ─────────────────────────────────────────────

export function syncCoachingNarration(app) {
  const liveRegion = document.getElementById("board-coaching");
  const visibleStrip = document.getElementById("board-coaching-strip");
  if (!liveRegion && !visibleStrip) return;

  const { state } = app;
  const shouldHide =
    !state ||
    state.showModePicker ||
    (
      state.mainGameState !== MAIN_GAME_STATES.RUNNING &&
      state.mainGameState !== MAIN_GAME_STATES.GAME_OVER
    );

  const text = shouldHide ? "" : (state.lastCoachingText || "");
  if (liveRegion && liveRegion.textContent !== text) {
    liveRegion.textContent = text;
  }
  if (visibleStrip) {
    visibleStrip.textContent = text;
    visibleStrip.hidden = shouldHide || !state.coachingModeEnabled || !text;
  }
}

// Main entry point — called from turnEngine via app.hooks.announceCoachingMoments.
// Classifies the just-finalized turn, applies cadence, writes to state and DOM.
export function announceCoachingMoments(app) {
  const { state } = app;
  if (
    !state ||
    (
      state.mainGameState !== MAIN_GAME_STATES.RUNNING &&
      state.mainGameState !== MAIN_GAME_STATES.GAME_OVER
    )
  ) {
    syncCoachingNarration(app);
    return;
  }

  const text = computeCoachingText(app);
  state.lastCoachingText = text;

  const liveRegion = document.getElementById("board-coaching");
  if (liveRegion && text) {
    liveRegion.textContent = text;
  }
  if (text) speakVoiceCoaching(text, "board-coaching");
  syncCoachingNarration(app);
}
