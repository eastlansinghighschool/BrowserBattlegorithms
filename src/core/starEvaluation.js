/**
 * starEvaluation.js
 *
 * Pure Star/Par Evaluation Core & Criterion Registry for Browser Battlegorithms (Plan 111).
 *
 * S6 Star Model:
 * - ⭐ Star 1: Pass (the baseline floor).
 * - ⭐⭐ Star 2: Beat authored generous turn par (turnsSpent <= turnPar).
 * - ⭐⭐⭐ Star 3: Meet authored mastery criterion from the closed vocabulary.
 *
 * Protected / absent-metadata levels are pass-star-only (max 1 star earned).
 * Evaluator returns unset fields as absent (no null noise).
 */

import { LEVEL_RESULT } from "../config/constants.js";

/**
 * Criterion evaluator registry mapping masteryCriterionId to evaluation function.
 * Evaluators receive context { level, result, turnsSpent, runnerActionHistory, details }.
 */
const CRITERION_EVALUATORS = new Map();

/**
 * Register a criterion evaluator function.
 * @param {string} id - Closed vocabulary masteryCriterionId
 * @param {Function} evaluatorFn - (context) => boolean
 */
export function registerCriterionEvaluator(id, evaluatorFn) {
  if (typeof id === "string" && typeof evaluatorFn === "function") {
    CRITERION_EVALUATORS.set(id.trim(), evaluatorFn);
  }
}

/**
 * Get a criterion evaluator function by ID.
 * @param {string} id
 * @returns {Function|null}
 */
export function getCriterionEvaluator(id) {
  if (typeof id !== "string") return null;
  return CRITERION_EVALUATORS.get(id.trim()) || null;
}

// ── Built-in Criterion Evaluators ───────────────────────────────────────────

/**
 * concept-used: Mechanically checks whether the targeted concept action types
 * were executed during the run, as recorded in details.runnerActionHistory.
 */
registerCriterionEvaluator("concept-used", (context) => {
  const { level, details } = context;
  const actionHistory = details?.runnerActionHistory || {};
  const targetConcepts = level?.starCriteria?.conceptActionTypes || [];

  if (!Array.isArray(targetConcepts) || targetConcepts.length === 0) {
    return false;
  }

  // Check if any runner executed at least one action matching targetConcepts
  for (const runnerHistory of Object.values(actionHistory)) {
    if (Array.isArray(runnerHistory)) {
      for (const actionType of runnerHistory) {
        if (targetConcepts.includes(actionType)) {
          return true;
        }
      }
    }
  }

  return false;
});

// ── Pure Star Evaluator ──────────────────────────────────────────────────────

/**
 * Evaluates stars earned for a guided level completion attempt.
 *
 * @param {Object} level - Level definition object (may carry starCriteria)
 * @param {string} result - Level completion result (LEVEL_RESULT.PASSED / FAILED)
 * @param {Object} details - Completion details: { turnsSpent, runnerActionHistory, ... }
 * @returns {Object} { starsEarned, [parBeaten], [turnPar], [masteryAchieved], [masteryCriterionId] }
 */
export function evaluateLevelStars(level, result, details = {}) {
  const isPass = (result === LEVEL_RESULT.PASSED || result === "PASSED");

  // On failure, 0 stars earned; do not populate star/par fields in ledger.
  if (!isPass) {
    return { starsEarned: 0 };
  }

  // Base Star 1: Pass
  let starsEarned = 1;
  const starCriteria = level?.starCriteria;
  const turnsSpent = typeof details.turnsSpent === "number" && Number.isFinite(details.turnsSpent)
    ? details.turnsSpent
    : (typeof details.turnNumber === "number" && Number.isFinite(details.turnNumber) ? details.turnNumber : null);

  const out = {
    starsEarned: 1
  };

  // Evaluate Star 2: Turn Par (if turnPar is authored)
  let parBeaten = false;
  if (typeof starCriteria?.turnPar === "number" && Number.isFinite(starCriteria.turnPar) && starCriteria.turnPar > 0) {
    const turnPar = Math.floor(starCriteria.turnPar);
    out.turnPar = turnPar;

    if (turnsSpent !== null && turnsSpent <= turnPar) {
      parBeaten = true;
      starsEarned = 2;
    }
    out.parBeaten = parBeaten;
  }

  // Evaluate Star 3: Mastery Criterion (if masteryCriterionId is authored)
  if (typeof starCriteria?.masteryCriterionId === "string" && starCriteria.masteryCriterionId.trim().length > 0) {
    const masteryCriterionId = starCriteria.masteryCriterionId.trim();
    out.masteryCriterionId = masteryCriterionId;

    const evaluator = getCriterionEvaluator(masteryCriterionId);
    let masteryAchieved = false;

    if (typeof evaluator === "function") {
      try {
        masteryAchieved = Boolean(evaluator({ level, result, turnsSpent, details }));
      } catch (_err) {
        // Honest fail-open: evaluation error => false, no crash
        masteryAchieved = false;
      }
    } else {
      // Unknown criterion ID: fail-open (false), flagged in code, no crash
      masteryAchieved = false;
    }

    out.masteryAchieved = masteryAchieved;
    if (parBeaten && masteryAchieved) {
      starsEarned = 3;
    }
  }

  out.starsEarned = starsEarned;
  return out;
}
