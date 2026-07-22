import { getLevelDefinitions } from "../config/levels/index.js";
import { buildGuidedLevelProgressCatalog, deriveGuidedProgress, formatGuidedProgressLabel } from "./guidedProgress.js";
import { summarizeUsagePayload } from "./usageAnalyzer.js";

const GUIDED_LEVEL_PROGRESS_CATALOG = buildGuidedLevelProgressCatalog(getLevelDefinitions());

/**
 * Normalizes a duration to a formatted label.
 */
function formatDurationLabel(durationMs) {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return "—";
  }
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0 && seconds === 0) {
    return "—";
  }
  if (minutes === 0) {
    return `${seconds}s approx`;
  }
  if (seconds === 0) {
    return `${minutes}m approx`;
  }
  return `${minutes}m ${seconds}s approx`;
}

/**
 * Returns a stable key to match exports across runs.
 */
export function getStableKey(fileName, payload) {
  const payloadHash = payload?.integrity?.sha256 || "";
  const sessionId = payload?.sessionId || "";
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // strip extension
  return `${baseName}_${payloadHash.slice(0, 8)}_${sessionId.slice(0, 8)}`;
}

/**
 * Anonymizes exports and manages the local-only identity map.
 * Returns the updated identity map and the list of processed exports.
 */
export function anonymizeExports(rawExports, existingMap = {}) {
  const mappings = existingMap.mappings ? { ...existingMap.mappings } : {};
  const details = existingMap.details ? { ...existingMap.details } : {};

  // Find the highest existing export index
  let maxIndex = 0;
  for (const exportId of Object.values(mappings)) {
    const match = exportId.match(/^export-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (idx > maxIndex) {
        maxIndex = idx;
      }
    }
  }

  const processed = [];

  for (const raw of rawExports) {
    const { fileName, payload } = raw;
    const stableKey = getStableKey(fileName, payload);

    let exportId = mappings[stableKey];
    if (!exportId) {
      maxIndex += 1;
      exportId = `export-${String(maxIndex).padStart(3, "0")}`;
      mappings[stableKey] = exportId;
    }

    // Populate or update details in the identity map (local-only, not committed)
    details[exportId] = {
      fileName,
      studentName: payload?.studentName || "",
      sessionId: payload?.sessionId || "",
      payloadHash: payload?.integrity?.sha256 || "",
      exportedAt: payload?.exportedAt || ""
    };

    processed.push({
      exportId,
      fileLabel: `file_${exportId.split("-")[1]}.json`,
      payload
    });
  }

  return {
    identityMap: { mappings, details },
    processed
  };
}

/**
 * Helper to check if an event is a boundary event.
 */
function isGuidedBoundaryEvent(event) {
  if (!event || typeof event !== "object") {
    return false;
  }
  if (event.type === "export_requested" || event.type === "export_completed" || event.type === "workspace_exported") {
    return true;
  }
  if (event.type === "mode_entered" && event.data?.modeView !== "GUIDED_LEVELS") {
    return true;
  }
  return false;
}

/**
 * Reconstructs individual attempts for a given export.
 */
export function buildAttemptsForExport(exportId, events, levelCatalog) {
  const catalogMap = new Map(levelCatalog.map((e) => [e.levelId, e]));
  const attempts = [];
  const levelAttemptCount = {}; // levelId -> count

  let activeAttempt = null;

  for (const event of events || []) {
    const type = event.type;
    const at = event.at;
    const data = event.data || {};
    const levelId = data.levelId ? `${data.levelId}`.trim() : null;

    if (type === "level_started") {
      if (!levelId) continue;

      if (activeAttempt) {
        attempts.push(finalizeAttempt(exportId, activeAttempt, at, "interrupted", catalogMap));
      }

      levelAttemptCount[levelId] = (levelAttemptCount[levelId] || 0) + 1;
      activeAttempt = {
        levelId,
        attemptNumber: levelAttemptCount[levelId],
        startAt: at,
        startEventType: type
      };
    } else if (type === "level_completed") {
      if (!levelId) continue;

      const result = data.result || "unknown";
      const turns = typeof data.turnsSpent === "number" ? data.turnsSpent : (typeof data.turnNumber === "number" ? data.turnNumber : 0);

      if (activeAttempt && activeAttempt.levelId === levelId) {
        attempts.push(finalizeAttempt(exportId, activeAttempt, at, result, catalogMap, turns));
        activeAttempt = null;
      } else {
        if (activeAttempt) {
          attempts.push(finalizeAttempt(exportId, activeAttempt, at, "interrupted", catalogMap));
          activeAttempt = null;
        }
        levelAttemptCount[levelId] = (levelAttemptCount[levelId] || 0) + 1;
        attempts.push(finalizeAttempt(exportId, {
          levelId,
          attemptNumber: levelAttemptCount[levelId],
          startAt: at,
          startEventType: "unknown"
        }, at, result, catalogMap, turns));
      }
    } else if (isGuidedBoundaryEvent(event)) {
      if (activeAttempt) {
        attempts.push(finalizeAttempt(exportId, activeAttempt, at, "boundary", catalogMap));
        activeAttempt = null;
      }
    }
  }

  if (activeAttempt) {
    const endAt = events.length > 0 ? events[events.length - 1]?.at : activeAttempt.startAt;
    attempts.push(finalizeAttempt(exportId, activeAttempt, endAt, "session_end", catalogMap));
  }

  return attempts;
}

function finalizeAttempt(exportId, attempt, endAt, result, catalogMap, turns = 0) {
  const cat = catalogMap.get(attempt.levelId);
  const levelOrder = cat ? cat.orderIndex + 1 : null;
  const startMs = attempt.startAt ? Date.parse(attempt.startAt) : NaN;
  const endMs = endAt ? Date.parse(endAt) : NaN;
  const durationMs = (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) ? (endMs - startMs) : 0;

  return {
    exportId,
    levelId: attempt.levelId,
    levelOrder,
    attemptNumber: attempt.attemptNumber,
    startAt: attempt.startAt,
    endAt,
    result,
    turns,
    durationMs,
    durationLabel: formatDurationLabel(durationMs),
    durationReliable: (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) ? 1 : 0
  };
}

/**
 * Computes the median of an array of numbers.
 */
export function getMedian(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Generates the normalized tables for a cohort of exports.
 */
export function generateCohortTables(processedExports) {
  const exportsTable = [];
  const eventsTable = [];
  const guidedAttemptsTable = [];
  const guidedLevelRollupTable = [];
  const exportProgressTable = [];

  const catalogMap = new Map(GUIDED_LEVEL_PROGRESS_CATALOG.map((e) => [e.levelId, e]));

  // Track attempts and turns to compute class rollups
  // levelId -> list of attempts count to first PASS
  const levelAttemptsToFirstPass = {};
  // levelId -> list of turns spent on passed attempts
  const levelTurnsOnPassedAttempts = {};
  // levelId -> counts per export
  const levelReachedMap = {};
  const levelPassedMap = {};
  const levelFailedOnlyMap = {};
  const levelStartedOnlyMap = {};
  const levelRevisitsSum = {};

  for (const raw of processedExports) {
    const { exportId, fileLabel, payload } = raw;
    const summary = summarizeUsagePayload(payload);
    const gp = summary.guidedProgress;

    // 1. exports table
    const allFlags = [
      ...(summary.suspiciousSignals || []),
      ...(gp.reviewSignals || []).map((s) => s.type || s.message)
    ];
    const reviewFlagsStr = allFlags.length > 0 ? allFlags.join("; ") : null;
    exportsTable.push({
      exportId,
      fileLabel,
      hashStatus: summary.hashStatus,
      exportedAt: payload.exportedAt || null,
      totalEvents: summary.totalEvents,
      totalSnapshots: summary.totalSnapshots,
      sessionSpanMinutes: summary.sessionSpanMinutes,
      needsReview: summary.needsReview ? 1 : 0,
      reviewFlags: reviewFlagsStr
    });

    // 2. events table
    if (Array.isArray(payload.events)) {
      payload.events.forEach((event, index) => {
        const data = event.data || {};
        const levelId = data.levelId ? `${data.levelId}`.trim() : null;
        const cat = levelId ? catalogMap.get(levelId) : null;
        eventsTable.push({
          exportId,
          eventIndex: index,
          eventType: event.type || "unknown",
          timestamp: event.at || null,
          levelId,
          levelTitle: cat ? cat.title : null,
          levelOrder: cat ? cat.orderIndex + 1 : null,
          result: data.result || null,
          turnNumber: typeof data.turnNumber === "number" ? data.turnNumber : null,
          turnsSpent: typeof data.turnsSpent === "number" ? data.turnsSpent : null,
          attemptNumber: typeof data.attemptNumber === "number" ? data.attemptNumber : null,
          modeView: data.modeView || null
        });
      });
    }

    // 3. guided_attempts table
    const attempts = buildAttemptsForExport(exportId, payload.events, GUIDED_LEVEL_PROGRESS_CATALOG);
    guidedAttemptsTable.push(...attempts);

    // Track attempt statistics for class rollup
    const attemptsByLevel = {};
    attempts.forEach((att) => {
      if (!attemptsByLevel[att.levelId]) {
        attemptsByLevel[att.levelId] = [];
      }
      attemptsByLevel[att.levelId].push(att);
    });

    for (const [lvlId, attList] of Object.entries(attemptsByLevel)) {
      const firstPassIdx = attList.findIndex((a) => a.result === "PASSED");
      if (firstPassIdx !== -1) {
        if (!levelAttemptsToFirstPass[lvlId]) {
          levelAttemptsToFirstPass[lvlId] = [];
        }
        levelAttemptsToFirstPass[lvlId].push(firstPassIdx + 1); // 1-based attempt index
      }

      attList.forEach((a) => {
        if (a.result === "PASSED" && typeof a.turns === "number" && a.turns > 0) {
          if (!levelTurnsOnPassedAttempts[lvlId]) {
            levelTurnsOnPassedAttempts[lvlId] = [];
          }
          levelTurnsOnPassedAttempts[lvlId].push(a.turns);
        }
      });
    }

    // 4. guided_level_rollup table
    gp.guidedLevelProgress.forEach((entry) => {
      guidedLevelRollupTable.push({
        exportId,
        levelId: entry.levelId,
        levelTitle: entry.title,
        levelOrder: entry.sequenceNumber || (entry.orderIndex !== null ? entry.orderIndex + 1 : null),
        startedCount: entry.startedCount,
        completedCount: entry.completedCount,
        passedCount: entry.passedCount,
        failedCount: entry.failedCount,
        revisits: entry.revisits,
        turnsSpent: entry.turnsSpent,
        durationMs: entry.approximateDurationMs,
        durationLabel: entry.approximateDurationLabel,
        reached: entry.reached ? 1 : 0,
        passed: entry.passedCount > 0 ? 1 : 0
      });

      // Aggregate for class rollup
      const lvlId = entry.levelId;
      levelRevisitsSum[lvlId] = (levelRevisitsSum[lvlId] || 0) + entry.revisits;

      if (entry.reached) {
        levelReachedMap[lvlId] = (levelReachedMap[lvlId] || 0) + 1;
      }
      if (entry.passedCount > 0) {
        levelPassedMap[lvlId] = (levelPassedMap[lvlId] || 0) + 1;
      } else if (entry.failedCount > 0) {
        levelFailedOnlyMap[lvlId] = (levelFailedOnlyMap[lvlId] || 0) + 1;
      } else if (entry.startedCount > 0) {
        levelStartedOnlyMap[lvlId] = (levelStartedOnlyMap[lvlId] || 0) + 1;
      }
    });

    // 5. export_progress table
    const revisitCount = gp.guidedLevelProgress.reduce((sum, entry) => sum + entry.revisits, 0);
    exportProgressTable.push({
      exportId,
      highestReachedId: gp.highestReached?.levelId || null,
      highestReachedOrder: gp.highestReached ? (gp.highestReached.sequenceNumber || (gp.highestReached.orderIndex !== null ? gp.highestReached.orderIndex + 1 : null)) : null,
      highestPassedId: gp.highestPassed?.levelId || null,
      highestPassedOrder: gp.highestPassed ? (gp.highestPassed.sequenceNumber || (gp.highestPassed.orderIndex !== null ? gp.highestPassed.orderIndex + 1 : null)) : null,
      highestPassedChallengeLabel: gp.highestPassedChallenge ? formatGuidedProgressLabel(gp.highestPassedChallenge) : null,
      latestGuidedActivityType: gp.latestGuidedActivity?.eventType || null,
      latestGuidedActivityLevelId: gp.latestGuidedActivity?.levelId || null,
      revisitCount,
      needsReview: summary.needsReview ? 1 : 0,
      reviewFlags: reviewFlagsStr || null
    });
  }

  // 6. class_level_rollup table
  const classLevelRollupTable = [];

  // Use the GUIDED_LEVEL_PROGRESS_CATALOG to order class rollups, and append unknown level IDs if any
  const uniqueLvlIds = new Set(GUIDED_LEVEL_PROGRESS_CATALOG.map((e) => e.levelId));
  const orderedLevelIds = [...GUIDED_LEVEL_PROGRESS_CATALOG.map((e) => e.levelId)];

  // Gather any unknown level IDs
  for (const expRoll of guidedLevelRollupTable) {
    if (!uniqueLvlIds.has(expRoll.levelId)) {
      uniqueLvlIds.add(expRoll.levelId);
      orderedLevelIds.push(expRoll.levelId);
    }
  }

  orderedLevelIds.forEach((lvlId) => {
    const cat = catalogMap.get(lvlId);
    const title = cat ? cat.title : `Unknown level: ${lvlId}`;
    const order = cat ? cat.orderIndex + 1 : null;

    classLevelRollupTable.push({
      levelId: lvlId,
      levelTitle: title,
      levelOrder: order,
      reachedCount: levelReachedMap[lvlId] || 0,
      passCount: levelPassedMap[lvlId] || 0,
      failCount: levelFailedOnlyMap[lvlId] || 0,
      startedOnlyCount: levelStartedOnlyMap[lvlId] || 0,
      medianAttemptsToFirstPass: getMedian(levelAttemptsToFirstPass[lvlId] || []),
      medianTurnsOnPassedAttempts: getMedian(levelTurnsOnPassedAttempts[lvlId] || []),
      revisitCount: levelRevisitsSum[lvlId] || 0
    });
  });

  return {
    exports: exportsTable,
    events: eventsTable,
    guided_attempts: guidedAttemptsTable,
    guided_level_rollup: guidedLevelRollupTable,
    class_level_rollup: classLevelRollupTable,
    export_progress: exportProgressTable
  };
}

/**
 * Formats a flat JSON table of objects into a CSV string.
 */
export function formatCsv(table) {
  if (!Array.isArray(table) || table.length === 0) {
    return "";
  }
  const headers = Object.keys(table[0]);
  const lines = [headers.join(",")];

  for (const row of table) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) {
        return "";
      }
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replaceAll('"', '""')}"`;
      }
      return str;
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

export function buildBaselineReport(cohortLabel, fileStats, tables) {
  const exports = tables.exports || [];
  const classRollup = tables.class_level_rollup || [];

  const validCount = fileStats.validFiles;
  const totalCount = fileStats.totalFiles;
  const invalidCount = fileStats.invalidFiles;

  const invalidHashCount = exports.filter((e) => e.hashStatus === "hash mismatch").length;
  const needsReviewCount = exports.filter((e) => e.needsReview === 1).length;

  // Reached count distribution sorted by order
  const reachedLevels = [...classRollup]
    .filter((l) => l.reachedCount > 0)
    .sort((a, b) => (a.levelOrder || 999) - (b.levelOrder || 999));

  const reachedLines = reachedLevels.map(
    (l) => `| L${l.levelOrder || "—"} | ${l.levelId} | ${l.reachedCount} | ${l.passCount} | ${l.medianAttemptsToFirstPass ?? "—"} | ${l.medianTurnsOnPassedAttempts ?? "—"} | ${l.revisitCount} |`
  ).join("\n");

  // Identify dropout candidates: where reached drops by > 20% compared to previous level
  const dropoutLines = [];
  for (let i = 1; i < reachedLevels.length; i++) {
    const prev = reachedLevels[i - 1];
    const curr = reachedLevels[i];
    if (prev.reachedCount > 0 && curr.reachedCount < prev.reachedCount * 0.8) {
      const dropPct = Math.round(((prev.reachedCount - curr.reachedCount) / prev.reachedCount) * 100);
      dropoutLines.push(`- **From L${prev.levelOrder} (${prev.levelId}) to L${curr.levelOrder} (${curr.levelId})**: Reached count dropped from ${prev.reachedCount} to ${curr.reachedCount} (${dropPct}% drop).`);
    }
  }

  // Identify too-easy candidates: medianAttemptsToFirstPass = 1 and low turns (e.g. median turns < 10)
  const easyLevels = classRollup
    .filter((l) => l.medianAttemptsToFirstPass === 1 && l.medianTurnsOnPassedAttempts !== null && l.medianTurnsOnPassedAttempts < 10)
    .map((l) => `- **L${l.levelOrder} (${l.levelId})**: Median 1 attempt to pass, median passed turns: ${l.medianTurnsOnPassedAttempts}.`);

  // Identify high starts but low passes: reachedCount > 0 and pass rate < 50%
  const hardLevels = classRollup
    .filter((l) => l.reachedCount > 0 && l.passCount / l.reachedCount < 0.5)
    .map((l) => {
      const passRate = Math.round((l.passCount / l.reachedCount) * 100);
      return `- **L${l.levelOrder} (${l.levelId})**: Reached by ${l.reachedCount} student exports, but only ${l.passCount} passed (${passRate}% pass rate).`;
    });

  // Identify highly revisited levels: revisitCount > 1.5 * reachedCount
  const revisitedLevels = classRollup
    .filter((l) => l.reachedCount > 0 && l.revisitCount > l.reachedCount * 1.5)
    .map((l) => `- **L${l.levelOrder} (${l.levelId})**: Total revisits: ${l.revisitCount} across ${l.reachedCount} exports reaching the level.`);

  let dataIntegritySection = "";
  if (invalidCount > 0) {
    dataIntegritySection = `
> [!WARNING]
> **Data Integrity Warning**: ${invalidCount} file(s) failed JSON parsing and were omitted from row-level analysis tables.
`;
  }

  return `# Cohort Usage Baseline Report
**Cohort ID**: ${cohortLabel}
**Total JSON Files Discovered**: ${totalCount}
**Valid Student Exports Processed**: ${validCount}
**Invalid JSON Files (Omitted)**: ${invalidCount}

---

## 1. Data Integrity and Review Flags
${dataIntegritySection}
| Metric | Value |
|---|---|
| Verified Hash Exports | ${validCount - invalidHashCount} / ${validCount} |
| Hash Mismatch Exports | ${invalidHashCount} / ${validCount} |
| Exports Flagged for Manual Review | ${needsReviewCount} / ${validCount} |

---

## 2. Fact-Based Performance Summary

| Level | Level ID | Reached Count | Pass Count | Median Attempts to Pass | Median Turns on Pass | Revisit Count |
|---|---|---|---|---|---|---|
${reachedLines || "| — | — | — | — | — | — | — |"}

---

## 3. Heuristic Observations and Flags

### Dropout/Progression Cliff Candidates
*Heuristic flag: Significant drops in reached counts between successive levels.*
${dropoutLines.length > 0 ? dropoutLines.join("\n") : "*(None detected based on 20% drop threshold)*"}

### High-Difficulty Candidate Levels
*Heuristic flag: Levels with high reached counts but less than 50% pass rate.*
${hardLevels.length > 0 ? hardLevels.join("\n") : "*(None detected based on 50% pass rate threshold)*"}

### Potential Too-Easy Candidate Levels
*Heuristic flag: Levels passed in exactly 1 median attempt with low turns (<10).*
${easyLevels.length > 0 ? easyLevels.join("\n") : "*(None detected)*"}

### Highly Revisited Levels
*Heuristic flag: Levels with high revisit rates relative to their reached count.*
${revisitedLevels.length > 0 ? revisitedLevels.join("\n") : "*(None detected)*"}

---

## 4. Data Caveats

1. **Self-Selection**: Reached and pass counts represent student exports that progressed far enough to trigger events; it does not capture cases where a student did not run programs or export their progress.
2. **Backtracking**: Student exports may backtrack to earlier levels or play out-of-order, creating complex multi-attempt trajectories.
3. **Session Span**: Play time represents the duration between the session start and export timestamp; it is an approximation of active keyboard/block editor time.
4. **Single-Human Multi-Export Limitation**: Anonymized units identify student *exports*, not guaranteed unique human student identities. A single student who exports multiple times may appear under multiple anonymous export IDs in this data until a future usage format introduces stable per-student IDs.
`;
}
