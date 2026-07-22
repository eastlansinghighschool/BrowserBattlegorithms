import { createHash } from "node:crypto";
import { getLevelDefinitions } from "../config/levels/index.js";
import {
  canonicalJsonStringify,
  createExportPayload,
  getUsageEventFingerprint
} from "./usageFormat.js";
import {
  buildGuidedLevelProgressCatalog,
  deriveGuidedProgress
} from "./guidedProgress.js";

const GUIDED_LEVEL_PROGRESS_CATALOG = buildGuidedLevelProgressCatalog(getLevelDefinitions());

export function computeUsageSha256Hex(payloadWithoutIntegrity) {
  const canonical = canonicalJsonStringify(payloadWithoutIntegrity);
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function buildUsageExportWithIntegrity(session, studentName, exportedAt = new Date().toISOString()) {
  const payload = createExportPayload(session, studentName, exportedAt);
  const hash = computeUsageSha256Hex(payload);
  return {
    ...payload,
    integrity: {
      algorithm: "SHA-256",
      sha256: hash
    }
  };
}

export function verifyUsageExport(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      reason: "payload_missing"
    };
  }

  const { integrity, ...payloadWithoutIntegrity } = payload;
  const computedSha256 = computeUsageSha256Hex(payloadWithoutIntegrity);
  const expectedSha256 = integrity?.sha256 || null;
  return {
    ok: computedSha256 === expectedSha256,
    computedSha256,
    expectedSha256,
    algorithm: integrity?.algorithm || null,
    reason: computedSha256 === expectedSha256 ? "verified" : "hash_mismatch"
  };
}

function toLowerTrim(value) {
  return `${value || ""}`.trim().toLowerCase();
}

function describeChallengeCounts(summary) {
  const challengeCompletions = Number(summary?.guided?.challengeCompletions || 0);
  const capstoneCompletions = Number(summary?.guided?.capstoneCompletions || 0);
  const parts = [];
  if (challengeCompletions > 0) {
    parts.push(`challenge=${challengeCompletions}`);
  }
  if (capstoneCompletions > 0) {
    parts.push(`capstone=${capstoneCompletions}`);
  }
  return parts.length ? parts.join(", ") : "none";
}

export function summarizeUsagePayload(payload) {
  const verification = verifyUsageExport(payload);
  const summary = payload?.summary || {};
  const schemaVersion = payload?.schemaVersion ?? 1;
  const learningLedger = payload?.learningLedger || null;
  const flags = payload?.flags || {};
  const eventFingerprint = getUsageEventFingerprint(payload?.events || []);
  const freePlayScores = summary.freePlay?.lastScores || { 1: 0, 2: 0 };
  const totalPlayTimeMs = Number(
    summary.totalPlayTimeMs ||
      Math.max(0, Date.parse(payload.exportedAt || Date.now()) - Date.parse(payload.sessionStartedAt || payload.exportedAt || Date.now()))
  );
  const suspiciousSignals = [];

  if (!verification.ok) {
    suspiciousSignals.push("integrity_mismatch");
  }
  if (Number(summary.guided?.completed || 0) > Number(summary.guided?.started || 0)) {
    suspiciousSignals.push("completed_more_levels_than_started");
  }
  if (Number(summary.guided?.passed || 0) > Number(summary.guided?.completed || 0)) {
    suspiciousSignals.push("passed_more_levels_than_completed");
  }
  const hasFreePlayEvidence = Number(summary.modeEntries?.freePlay || 0) > 0 || Number(summary.freePlay?.entered || 0) > 0;
  if (hasFreePlayEvidence && Number(summary.freePlay?.scoreEvents || 0) === 0 && (Number(freePlayScores?.[1] || 0) + Number(freePlayScores?.[2] || 0) > 0)) {
    suspiciousSignals.push("scores_without_score_events");
  }
  const guidedProgress = deriveGuidedProgress({
    events: payload?.events || [],
    summary,
    levelCatalog: GUIDED_LEVEL_PROGRESS_CATALOG,
    learningLedger,
    schemaVersion,
    flags
  });
  const sessionSpanMinutes = Math.max(0, Math.round(totalPlayTimeMs / 60000));
  const gpLevels = guidedProgress.guidedLevelProgress || [];
  const isV2 = schemaVersion >= 2 && Boolean(learningLedger);

  const guidedStarted = isV2
    ? Math.max(Number(summary.guided?.started || 0), gpLevels.reduce((sum, e) => sum + e.startedCount, 0))
    : Number(summary.guided?.started || 0);
  const guidedCompleted = isV2
    ? Math.max(Number(summary.guided?.completed || 0), gpLevels.reduce((sum, e) => sum + e.completedCount, 0))
    : Number(summary.guided?.completed || 0);
  const guidedPassed = isV2
    ? Math.max(Number(summary.guided?.passed || 0), gpLevels.reduce((sum, e) => sum + e.passedCount, 0))
    : Number(summary.guided?.passed || 0);
  const guidedFailed = isV2
    ? Math.max(Number(summary.guided?.failed || 0), gpLevels.reduce((sum, e) => sum + e.failedCount, 0))
    : Number(summary.guided?.failed || 0);
  const guidedAttempts = isV2
    ? Math.max(Number(summary.guided?.attempts || 0), gpLevels.reduce((sum, e) => sum + e.startedCount, 0))
    : Number(summary.guided?.attempts || 0);
  const guidedTurns = isV2
    ? Math.max(Number(summary.guided?.turns || 0), gpLevels.reduce((sum, e) => sum + e.turnsSpent, 0))
    : Number(summary.guided?.turns || 0);
  const challengeCompletions = isV2
    ? Math.max(Number(summary.guided?.challengeCompletions || 0), gpLevels.reduce((sum, e) => sum + (e.isChallenge ? e.passedCount : 0), 0))
    : Number(summary.guided?.challengeCompletions || 0);
  const capstoneCompletions = isV2
    ? Math.max(Number(summary.guided?.capstoneCompletions || 0), gpLevels.reduce((sum, e) => sum + (e.isCapstone ? e.passedCount : 0), 0))
    : Number(summary.guided?.capstoneCompletions || 0);

  return {
    studentName: payload?.studentName || "",
    sessionId: payload?.sessionId || "",
    exportedAt: payload?.exportedAt || "",
    appVersion: payload?.appVersion || "",
    schemaVersion,
    flags,
    hashStatus: verification.ok ? "verified hash" : "hash mismatch",
    hash: verification.computedSha256 || "",
    totalEvents: Array.isArray(payload?.events) ? payload.events.length : 0,
    totalSnapshots: Array.isArray(payload?.snapshots) ? payload.snapshots.length : 0,
    guided: {
      started: guidedStarted,
      completed: guidedCompleted,
      passed: guidedPassed,
      failed: guidedFailed,
      attempts: guidedAttempts,
      turns: guidedTurns,
      challengeCompletions,
      capstoneCompletions
    },
    freePlay: {
      entered: Number(summary.freePlay?.entered || 0),
      configChanges: Number(summary.freePlay?.configChanges || 0),
      scoreEvents: Number(summary.freePlay?.scoreEvents || 0),
      turns: Number(summary.freePlay?.turns || 0),
      wins: Number(summary.freePlay?.wins || 0),
      losses: Number(summary.freePlay?.losses || 0),
      lastScores: {
        1: Number(freePlayScores?.[1] || 0),
        2: Number(freePlayScores?.[2] || 0)
      }
    },
    playTimeMinutes: sessionSpanMinutes,
    sessionSpanMinutes,
    eventFingerprint,
    challengeSummary: describeChallengeCounts({ guided: { challengeCompletions, capstoneCompletions } }),
    suspiciousSignals,
    guidedProgress,
    needsReview: suspiciousSignals.length > 0 || guidedProgress.needsReview,
    reviewSignals: guidedProgress.reviewSignals
  };
}

export function compareUsageSummaries(summaries) {
  const bySessionId = new Map();
  const byHash = new Map();
  const byFingerprint = new Map();

  summaries.forEach((summary, index) => {
    if (summary.sessionId) {
      if (!bySessionId.has(summary.sessionId)) {
        bySessionId.set(summary.sessionId, []);
      }
      bySessionId.get(summary.sessionId).push(index);
    }
    if (summary.hash) {
      if (!byHash.has(summary.hash)) {
        byHash.set(summary.hash, []);
      }
      byHash.get(summary.hash).push(index);
    }
    if (summary.eventFingerprint) {
      if (!byFingerprint.has(summary.eventFingerprint)) {
        byFingerprint.set(summary.eventFingerprint, []);
      }
      byFingerprint.get(summary.eventFingerprint).push(index);
    }
  });

  const duplicateSessionIds = [...bySessionId.entries()]
    .filter(([, indices]) => indices.length > 1)
    .map(([sessionId, indices]) => ({ sessionId, indices }));
  const duplicateHashes = [...byHash.entries()]
    .filter(([, indices]) => indices.length > 1)
    .map(([hash, indices]) => ({ hash, indices }));
  const duplicateFingerprints = [...byFingerprint.entries()]
    .filter(([, indices]) => indices.length > 1)
    .map(([fingerprint, indices]) => ({ fingerprint, indices }));

  const similarSequencesDifferentNames = duplicateFingerprints
    .map((entry) => {
      const labels = entry.indices.map((index) => summaries[index].studentName || `submission-${index + 1}`);
      const uniqueNames = new Set(labels.map(toLowerTrim));
      return uniqueNames.size > 1 ? { ...entry, labels } : null;
    })
    .filter(Boolean);

  return {
    duplicateSessionIds,
    duplicateHashes,
    similarSequencesDifferentNames
  };
}
