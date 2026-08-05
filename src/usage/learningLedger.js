/**
 * learningLedger.js
 *
 * Usage Tracker V2 Durable Per-Level Learning Ledger & Schema V2 Core
 *
 * Tier 1 of Plan 84 data model: durable, never-evicted per-level learning ledger
 * maintained incrementally synchronously with events.
 */

import { hashStarterXml } from "../ai/blockly/starterVersioning.js";

export function hashXml(xmlText) {
  if (!xmlText || typeof xmlText !== "string") {
    return null;
  }
  return hashStarterXml(xmlText);
}

export function createGuidedLevelRollupEntry(levelId, overrides = {}) {
  const startedCount = Number.isFinite(overrides.startedCount)
    ? overrides.startedCount
    : (Number.isFinite(overrides.started) ? (overrides.started ? 1 : 0) : (Number.isFinite(overrides.attempts) ? overrides.attempts : 0));
  const completedCount = Number.isFinite(overrides.completedCount) ? overrides.completedCount : 0;
  const passedCount = Number.isFinite(overrides.passedCount)
    ? overrides.passedCount
    : (Number.isFinite(overrides.passes) ? overrides.passes : 0);
  const failedCount = Number.isFinite(overrides.failedCount)
    ? overrides.failedCount
    : (Number.isFinite(overrides.fails) ? overrides.fails : 0);
  const revisits = Number.isFinite(overrides.revisits) ? overrides.revisits : 0;
  const turnsSpent = Number.isFinite(overrides.turnsSpent)
    ? overrides.turnsSpent
    : (Number.isFinite(overrides.turns) ? overrides.turns : 0);
  const durationMs = Number.isFinite(overrides.durationMs) ? overrides.durationMs : 0;
  const passed = Boolean(overrides.passed) || passedCount > 0;

  const entry = {
    levelId: `${levelId}`.trim(),
    reached: Boolean(overrides.reached),
    startedCount,
    completedCount,
    passedCount,
    failedCount,
    revisits,
    turnsSpent,
    durationMs,
    firstActivityAt: overrides.firstActivityAt || null,
    lastActivityAt: overrides.lastActivityAt || null,
    lastResult: overrides.lastResult || (passed ? "PASSED" : null),
    passed,
    startBlockCount: Number.isFinite(overrides.startBlockCount) ? overrides.startBlockCount : null,
    endBlockCount: Number.isFinite(overrides.endBlockCount) ? overrides.endBlockCount : null,
    finalXmlHash: overrides.finalXmlHash || null
  };

  // ── Plan 91 / Plan 110 Rewrite-Aware Optional Fields Receptacle ────────
  // All rewrite-aware fields below are optional and additive per Plan 91.
  // Unset fields remain absent from the entry object (not null noise in exports).

  // Mini-Arc metadata (unpopulated until campaign mini-arcs packet)
  if (typeof overrides.arcId === "string" && overrides.arcId.length > 0) {
    entry.arcId = overrides.arcId.trim();
  }
  if (Number.isFinite(overrides.arcStageIndex)) {
    entry.arcStageIndex = overrides.arcStageIndex;
  }
  if (Number.isFinite(overrides.arcStageCount)) {
    entry.arcStageCount = overrides.arcStageCount;
  }

  // Board Dynamics Tier (unpopulated until board dynamics tiering packet)
  // Expected closed values per Plan 85 S1: static-prop, background-motion, timing-threat, collision-threat, scrimmage-threat
  if (typeof overrides.boardDynamicsTier === "string" && overrides.boardDynamicsTier.length > 0) {
    entry.boardDynamicsTier = overrides.boardDynamicsTier.trim();
  }

  // Bestiary Encounter Summaries (unpopulated until bestiary encounters packet)
  if (Array.isArray(overrides.bestiaryEncounterIds)) {
    entry.bestiaryEncounterIds = Array.from(new Set(overrides.bestiaryEncounterIds.filter(Boolean)));
  } else if (overrides.bestiaryEncounterIds && typeof overrides.bestiaryEncounterIds === "object") {
    entry.bestiaryEncounterIds = { ...overrides.bestiaryEncounterIds };
  }

  // Stars / Par / Mastery Outcome Fields (unpopulated until plan-96 stars/par v1)
  if (Number.isFinite(overrides.starsEarned)) {
    entry.starsEarned = Math.max(0, Math.min(3, Math.floor(overrides.starsEarned)));
  }
  if (typeof overrides.parBeaten === "boolean") {
    entry.parBeaten = overrides.parBeaten;
  }
  if (Number.isFinite(overrides.turnPar)) {
    entry.turnPar = overrides.turnPar;
  }
  if (typeof overrides.masteryAchieved === "boolean") {
    entry.masteryAchieved = overrides.masteryAchieved;
  }
  // Closed mastery criterion vocabulary from Plan 85 S6:
  // concept-used, no-wasted-resource, both-allies-active, no-collision, under-block-budget
  if (typeof overrides.masteryCriterionId === "string" && overrides.masteryCriterionId.length > 0) {
    entry.masteryCriterionId = overrides.masteryCriterionId.trim();
  }

  // Film Review Summary (unpopulated until post-level film review packet per Plan 85 S7)
  if (overrides.filmReviewSummary && typeof overrides.filmReviewSummary === "object") {
    entry.filmReviewSummary = { ...overrides.filmReviewSummary };
  }

  return entry;
}

export function createLearningLedger(overrides = {}) {
  const guided = {};
  if (overrides.guided && typeof overrides.guided === "object") {
    for (const [lvlId, entry] of Object.entries(overrides.guided)) {
      guided[lvlId] = createGuidedLevelRollupEntry(lvlId, entry);
    }
  }
  const passLedger = Array.isArray(overrides.passLedger)
    ? Array.from(new Set(overrides.passLedger.filter((id) => typeof id === "string" && id.length > 0)))
    : [];

  return {
    guided,
    passLedger
  };
}

export function createSessionFlags(overrides = {}) {
  return {
    ledgerBackfilled: Boolean(overrides.ledgerBackfilled),
    eventTailTruncated: Boolean(overrides.eventTailTruncated),
    historyPartial: Boolean(overrides.historyPartial),
    runVersionStoreTruncated: Boolean(overrides.runVersionStoreTruncated),
    durableTiersCarriedFrom: overrides.durableTiersCarriedFrom || null
  };
}

function ensureGuidedEntry(session, levelId) {
  if (!levelId) {
    return null;
  }
  const key = `${levelId}`.trim();
  if (!key) {
    return null;
  }
  if (!session.learningLedger) {
    session.learningLedger = createLearningLedger();
  }
  if (!session.learningLedger.guided[key]) {
    session.learningLedger.guided[key] = createGuidedLevelRollupEntry(key);
  }
  return session.learningLedger.guided[key];
}

function updateTimestamps(entry, at) {
  if (!at) {
    return;
  }
  if (!entry.firstActivityAt) {
    entry.firstActivityAt = at;
  }
  if (entry.lastActivityAt && at) {
    const delta = Date.parse(at) - Date.parse(entry.lastActivityAt);
    if (Number.isFinite(delta) && delta > 0 && delta < 30 * 60 * 1000) {
      entry.durationMs += delta;
    }
  }
  entry.lastActivityAt = at;
}

export function updateLearningLedgerFromEvent(session, type, data = {}, at = new Date().toISOString()) {
  if (!session.learningLedger) {
    session.learningLedger = createLearningLedger();
  }

  const levelId = data?.levelId ? `${data.levelId}`.trim() : null;

  switch (type) {
    case "level_opened": {
      if (!levelId) break;
      const entry = ensureGuidedEntry(session, levelId);
      if (entry) {
        if (entry.passed) {
          entry.revisits += 1;
        }
        entry.reached = true;
        updateTimestamps(entry, at);
        if (typeof data.blockCount === "number" && Number.isFinite(data.blockCount)) {
          if (entry.startBlockCount === null) {
            entry.startBlockCount = data.blockCount;
          }
          entry.endBlockCount = data.blockCount;
        }
        if (data.xmlText) {
          entry.finalXmlHash = hashXml(data.xmlText);
        }
      }
      break;
    }
    case "level_started": {
      if (!levelId) break;
      const entry = ensureGuidedEntry(session, levelId);
      if (entry) {
        if (entry.passed) {
          entry.revisits += 1;
        }
        entry.reached = true;
        entry.startedCount += 1;
        entry.lastResult = "IN_PROGRESS";
        updateTimestamps(entry, at);
        if (typeof data.blockCount === "number" && Number.isFinite(data.blockCount)) {
          if (entry.startBlockCount === null) {
            entry.startBlockCount = data.blockCount;
          }
          entry.endBlockCount = data.blockCount;
        }
        if (data.xmlText) {
          entry.finalXmlHash = hashXml(data.xmlText);
        }
      }
      break;
    }
    case "level_completed": {
      if (!levelId) break;
      const entry = ensureGuidedEntry(session, levelId);
      if (entry) {
        entry.reached = true;
        entry.completedCount += 1;
        updateTimestamps(entry, at);

        const result = data.result;
        if (result === "PASSED") {
          entry.passedCount += 1;
          entry.passed = true;
          entry.lastResult = "PASSED";

          if (Number.isFinite(data.starsEarned)) {
            const newStars = Math.max(0, Math.min(3, Math.floor(data.starsEarned)));
            entry.starsEarned = Number.isFinite(entry.starsEarned)
              ? Math.max(entry.starsEarned, newStars)
              : newStars;
          }
          if (typeof data.parBeaten === "boolean") {
            entry.parBeaten = entry.parBeaten || data.parBeaten;
          }
          if (Number.isFinite(data.turnPar)) {
            entry.turnPar = data.turnPar;
          }
          if (typeof data.masteryAchieved === "boolean") {
            entry.masteryAchieved = entry.masteryAchieved || data.masteryAchieved;
          }
          if (typeof data.masteryCriterionId === "string" && data.masteryCriterionId.length > 0) {
            entry.masteryCriterionId = data.masteryCriterionId.trim();
          }
        } else if (result === "FAILED") {
          entry.failedCount += 1;
          entry.lastResult = "FAILED";
        }

        const turnsSpent = typeof data.turnsSpent === "number" ? data.turnsSpent : (typeof data.turnNumber === "number" ? data.turnNumber : 0);
        if (Number.isFinite(turnsSpent) && turnsSpent > 0) {
          entry.turnsSpent += turnsSpent;
        }

        if (typeof data.blockCount === "number" && Number.isFinite(data.blockCount)) {
          if (entry.startBlockCount === null) {
            entry.startBlockCount = data.blockCount;
          }
          entry.endBlockCount = data.blockCount;
        }
        if (data.xmlText) {
          entry.finalXmlHash = hashXml(data.xmlText);
        }
      }
      break;
    }
    case "workspace_snapshot": {
      if (!levelId) break;
      const entry = ensureGuidedEntry(session, levelId);
      if (entry) {
        updateTimestamps(entry, at);
        if (data.blockCounts && typeof data.blockCounts === "object") {
          const totalBlocks = Object.values(data.blockCounts).reduce((sum, count) => sum + (Number.isFinite(count) ? count : 0), 0);
          if (entry.startBlockCount === null) {
            entry.startBlockCount = totalBlocks;
          }
          entry.endBlockCount = totalBlocks;
        }
        if (data.xmlText) {
          entry.finalXmlHash = hashXml(data.xmlText);
        }
      }
      break;
    }
    case "turn_action_completed": {
      if (!levelId) break;
      const entry = ensureGuidedEntry(session, levelId);
      if (entry) {
        updateTimestamps(entry, at);
      }
      break;
    }
    default:
      break;
  }
}

export function syncPassLedger(session, passedLevelIds = []) {
  if (!session.learningLedger) {
    session.learningLedger = createLearningLedger();
  }
  const cleanIds = Array.isArray(passedLevelIds)
    ? passedLevelIds.filter((id) => typeof id === "string" && id.length > 0)
    : [];

  session.learningLedger.passLedger = Array.from(new Set(cleanIds));

  // Mirror into ledger entries
  for (const lvlId of cleanIds) {
    const entry = ensureGuidedEntry(session, lvlId);
    if (entry) {
      entry.reached = true;
      entry.passed = true;
      if (entry.passedCount === 0) {
        entry.passedCount = 1;
      }
      if (!entry.lastResult) {
        entry.lastResult = "PASSED";
      }
    }
  }
}

export function hydrateAndBackfillSession(session, maxEventsCap = 400) {
  if (!session || typeof session !== "object") {
    return session;
  }

  if (!session.learningLedger) {
    session.learningLedger = createLearningLedger();
  }

  if (!session.flags) {
    session.flags = createSessionFlags();
  }

  const totalEvents = session.summary?.totalEvents ?? session.events?.length ?? 0;
  const eventCount = session.events?.length ?? 0;
  const isTruncated = totalEvents > eventCount;

  if (isTruncated) {
    session.flags.eventTailTruncated = true;
  }

  // Repair 5: Backfill occurs only when hydrating a legacy session (schemaVersion < 2 or missing schemaVersion)
  const isLegacySession = !session.schemaVersion || session.schemaVersion < 2;
  const hasExistingEntries = Object.keys(session.learningLedger.guided).length > 0;

  if (isLegacySession && !session.flags.ledgerBackfilled && !hasExistingEntries) {
    session.flags.ledgerBackfilled = true;

    if (Array.isArray(session.events)) {
      for (const event of session.events) {
        if (event && event.type) {
          updateLearningLedgerFromEvent(session, event.type, event.data || {}, event.at);
        }
      }
    }

    // Best-effort check from summary.guided.levelIds for levels that had events trimmed
    if (Array.isArray(session.summary?.guided?.levelIds)) {
      for (const lvlId of session.summary.guided.levelIds) {
        const entry = ensureGuidedEntry(session, lvlId);
        if (entry) {
          entry.reached = true;
          if (entry.startedCount === 0) {
            entry.startedCount = 1;
          }
        }
      }
    }

    if (session.flags.eventTailTruncated) {
      session.flags.historyPartial = true;
    }
  }

  session.schemaVersion = 2;
  return session;
}
