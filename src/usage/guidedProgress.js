function normalizeLevelId(levelId) {
  return `${levelId ?? ""}`.trim();
}

function toTimestamp(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : null;
}

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

function createCatalogEntry(level, index) {
  const levelId = normalizeLevelId(level?.id);
  const isOptionalAside = levelId.startsWith("optional-");
  const isChallenge = level?.levelKind === "challenge";
  return {
    levelId,
    title: level?.title || levelId || "Untitled level",
    label: level?.title || levelId || "Untitled level",
    orderIndex: index,
    sequenceNumber: index + 1,
    levelKind: level?.levelKind || null,
    isChallenge,
    isOptionalAside,
    isRequiredProgression: !isOptionalAside,
    isProject: Boolean(level?.project?.id),
    projectId: level?.project?.id || null,
    projectStep: typeof level?.project?.step === "number" ? level.project.step : null,
    isCapstone: Boolean(level?.project?.isCapstone)
  };
}

function createProgressEntry(catalogEntry) {
  return {
    ...catalogEntry,
    isUnknown: false,
    reached: false,
    passed: false,
    startedCount: 0,
    completedCount: 0,
    passedCount: 0,
    failedCount: 0,
    revisits: 0,
    turnsSpent: 0,
    firstStartedAt: null,
    lastStartedAt: null,
    firstCompletedAt: null,
    lastCompletedAt: null,
    firstPassedAt: null,
    lastPassedAt: null,
    firstFailedAt: null,
    lastFailedAt: null,
    latestEventAt: null,
    latestEventType: null,
    latestEventResult: null,
    latestTurnNumber: null,
    approximateDurationMs: 0,
    approximateDurationLabel: "—",
    status: "not_reached",
    statusLabel: "Not reached"
  };
}

function createUnknownProgressEntry(levelId, index) {
  return {
    levelId,
    title: `Unknown guided level: ${levelId}`,
    label: `Unknown guided level: ${levelId}`,
    orderIndex: null,
    sequenceNumber: null,
    levelKind: null,
    isChallenge: false,
    isOptionalAside: false,
    isRequiredProgression: false,
    isProject: false,
    projectId: null,
    projectStep: null,
    isCapstone: false,
    isUnknown: true,
    unknownIndex: index,
    reached: false,
    passed: false,
    startedCount: 0,
    completedCount: 0,
    passedCount: 0,
    failedCount: 0,
    revisits: 0,
    turnsSpent: 0,
    firstStartedAt: null,
    lastStartedAt: null,
    firstCompletedAt: null,
    lastCompletedAt: null,
    firstPassedAt: null,
    lastPassedAt: null,
    firstFailedAt: null,
    lastFailedAt: null,
    latestEventAt: null,
    latestEventType: null,
    latestEventResult: null,
    latestTurnNumber: null,
    approximateDurationMs: 0,
    approximateDurationLabel: "—",
    status: "unknown",
    statusLabel: "Unknown"
  };
}

function updateEventTimestamps(entry, eventAt, eventType, result, turnNumber) {
  if (!entry.firstStartedAt && eventType === "level_started") {
    entry.firstStartedAt = eventAt;
  }
  if (eventType === "level_started") {
    entry.lastStartedAt = eventAt;
  }
  if (!entry.firstCompletedAt && eventType === "level_completed") {
    entry.firstCompletedAt = eventAt;
  }
  if (eventType === "level_completed") {
    entry.lastCompletedAt = eventAt;
  }
  if (result === "PASSED") {
    if (!entry.firstPassedAt) {
      entry.firstPassedAt = eventAt;
    }
    entry.lastPassedAt = eventAt;
  }
  if (result === "FAILED") {
    if (!entry.firstFailedAt) {
      entry.firstFailedAt = eventAt;
    }
    entry.lastFailedAt = eventAt;
  }
  entry.latestEventAt = eventAt;
  entry.latestEventType = eventType;
  entry.latestEventResult = result || null;
  entry.latestTurnNumber = typeof turnNumber === "number" && Number.isFinite(turnNumber) ? turnNumber : entry.latestTurnNumber;
}

function closeAttempt(entry, attempt, endAt, endReason = "completed") {
  if (!attempt) {
    return;
  }
  const startMs = toTimestamp(attempt.startAt);
  const endMs = toTimestamp(endAt);
  if (startMs !== null && endMs !== null && endMs >= startMs) {
    entry.approximateDurationMs += endMs - startMs;
  }
  if (endReason !== "completed") {
    entry.latestEventType = attempt.startEventType || entry.latestEventType;
  }
}

function classifyStatus(entry) {
  if (entry.passedCount > 0) {
    entry.status = "passed";
    entry.statusLabel = "Passed";
    entry.passed = true;
    return;
  }
  if (entry.failedCount > 0) {
    entry.status = "failed";
    entry.statusLabel = "Failed";
    return;
  }
  if (entry.startedCount > 0) {
    entry.status = "started";
    entry.statusLabel = "Started";
    return;
  }
  if (entry.isUnknown && (entry.completedCount > 0 || entry.reached)) {
    entry.status = "seen";
    entry.statusLabel = "Seen";
    return;
  }
  entry.status = "not_reached";
  entry.statusLabel = "Not reached";
}

function finalizeProgressEntry(entry) {
  entry.revisits = Math.max(0, entry.startedCount - 1);
  entry.reached = entry.reached || entry.startedCount > 0 || entry.completedCount > 0 || entry.passedCount > 0 || entry.failedCount > 0;
  entry.turnsSpent = Number(entry.turnsSpent || 0);
  entry.approximateDurationLabel = formatDurationLabel(entry.approximateDurationMs);
  classifyStatus(entry);
  return entry;
}

function buildActivitySnapshot(entry, eventType, eventAt, result, turnNumber) {
  return {
    levelId: entry.levelId,
    title: entry.title,
    label: formatGuidedProgressLabel(entry),
    orderIndex: entry.orderIndex,
    levelKind: entry.levelKind,
    isChallenge: entry.isChallenge,
    isOptionalAside: entry.isOptionalAside,
    isRequiredProgression: entry.isRequiredProgression,
    eventType,
    result: result || null,
    at: eventAt || null,
    turnNumber: typeof turnNumber === "number" && Number.isFinite(turnNumber) ? turnNumber : null
  };
}

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

function trackSummaryMismatch(reviewSignals, metric, expected, observed) {
  if (expected > observed) {
    reviewSignals.push({
      type: `${metric}_truncation`,
      message: `Summary reports ${expected} ${metric.replaceAll("_", " ")}, but the exported events only show ${observed}.`
    });
  }
}

export function buildGuidedLevelProgressCatalog(levelDefinitions = []) {
  return Array.isArray(levelDefinitions)
    ? levelDefinitions.map((level, index) => createCatalogEntry(level, index))
    : [];
}

export function formatGuidedProgressLabel(progressEntry) {
  if (!progressEntry) {
    return "—";
  }
  if (progressEntry.isUnknown) {
    return progressEntry.label || `Unknown guided level: ${progressEntry.levelId || "unknown"}`;
  }
  return progressEntry.label || progressEntry.title || progressEntry.levelId || "—";
}

export function deriveGuidedProgress({ events = [], summary = {}, levelCatalog = [], learningLedger = null, schemaVersion = 1, flags = {} } = {}) {
  const catalogEntries = Array.isArray(levelCatalog) ? levelCatalog : [];
  const progressById = new Map();
  const requiredEntries = [];
  for (const catalogEntry of catalogEntries) {
    const entry = createProgressEntry(catalogEntry);
    progressById.set(entry.levelId, entry);
    if (entry.isRequiredProgression) {
      requiredEntries.push(entry);
    }
  }

  const unknownEntries = [];
  const unknownEntryById = new Map();
  const unknownLevelIds = [];
  const reviewSignals = [];

  function getOrCreateProgressEntry(levelId) {
    if (progressById.has(levelId)) {
      return progressById.get(levelId);
    }
    if (!unknownEntryById.has(levelId)) {
      const entry = createUnknownProgressEntry(levelId, unknownEntries.length + 1);
      unknownEntryById.set(levelId, entry);
      unknownEntries.push(entry);
      unknownLevelIds.push(levelId);
    }
    return unknownEntryById.get(levelId);
  }

  const isV2 = (schemaVersion >= 2 || (learningLedger && typeof learningLedger.guided === "object" && Object.keys(learningLedger.guided).length > 0)) && Boolean(learningLedger && typeof learningLedger.guided === "object");

  if (isV2) {
    // ── V2 Ledger-First Read Path ──────────────────────────────────────────
    const guidedLedger = learningLedger.guided || {};
    const passLedgerSet = new Set(Array.isArray(learningLedger.passLedger) ? learningLedger.passLedger.map(normalizeLevelId) : []);

    for (const [rawLevelId, ledgerEntry] of Object.entries(guidedLedger)) {
      if (!ledgerEntry) continue;
      const levelId = normalizeLevelId(rawLevelId);
      if (!levelId) continue;

      const entry = getOrCreateProgressEntry(levelId);
      entry.reached = Boolean(ledgerEntry.reached) || Number(ledgerEntry.startedCount || 0) > 0 || Number(ledgerEntry.completedCount || 0) > 0 || Boolean(ledgerEntry.passed);
      entry.startedCount = Number(ledgerEntry.startedCount || 0);
      entry.completedCount = Number(ledgerEntry.completedCount || 0);
      entry.passedCount = Number(ledgerEntry.passedCount || (ledgerEntry.passed ? 1 : 0));
      entry.failedCount = Number(ledgerEntry.failedCount || 0);
      entry.revisits = Number(ledgerEntry.revisits || 0);
      entry.turnsSpent = Number(ledgerEntry.turnsSpent || 0);
      entry.approximateDurationMs = Number(ledgerEntry.durationMs || 0);
      entry.firstStartedAt = ledgerEntry.firstActivityAt || null;
      entry.lastStartedAt = ledgerEntry.lastActivityAt || ledgerEntry.firstActivityAt || null;
      entry.firstCompletedAt = ledgerEntry.lastResult ? (ledgerEntry.lastActivityAt || ledgerEntry.firstActivityAt) : null;
      entry.lastCompletedAt = ledgerEntry.lastResult ? ledgerEntry.lastActivityAt : null;
      entry.latestEventResult = ledgerEntry.lastResult || (ledgerEntry.passed ? "PASSED" : null);

      if (ledgerEntry.passed || entry.passedCount > 0 || passLedgerSet.has(levelId)) {
        entry.passed = true;
        if (entry.passedCount === 0) {
          entry.passedCount = 1;
        }
      }
    }

    for (const rawLevelId of passLedgerSet) {
      const levelId = normalizeLevelId(rawLevelId);
      if (!levelId) continue;
      const entry = getOrCreateProgressEntry(levelId);
      entry.reached = true;
      entry.passed = true;
      if (entry.passedCount === 0) {
        entry.passedCount = 1;
      }
    }

    let latestGuidedActivity = null;
    for (const event of Array.isArray(events) ? events : []) {
      const eventType = event?.type || "unknown";
      const eventAt = event?.at || null;
      const payload = event?.data && typeof event.data === "object" ? event.data : {};
      const levelId = normalizeLevelId(payload.levelId);
      const turnNumber = typeof payload.turnNumber === "number" && Number.isFinite(payload.turnNumber) ? payload.turnNumber : null;

      if (levelId && (eventType === "level_started" || eventType === "level_completed")) {
        const entry = getOrCreateProgressEntry(levelId);
        updateEventTimestamps(entry, eventAt, eventType, payload.result || null, turnNumber);
        latestGuidedActivity = buildActivitySnapshot(entry, eventType, eventAt, payload.result || null, turnNumber);
      }
    }

    if (!latestGuidedActivity) {
      let latestTime = 0;
      let latestEntry = null;
      const allEntries = [...progressById.values(), ...unknownEntries];
      for (const entry of allEntries) {
        const ts = toTimestamp(entry.lastStartedAt || entry.firstStartedAt);
        if (ts !== null && ts >= latestTime) {
          latestTime = ts;
          latestEntry = entry;
        }
      }
      if (latestEntry && latestEntry.reached) {
        latestGuidedActivity = buildActivitySnapshot(
          latestEntry,
          latestEntry.completedCount > 0 ? "level_completed" : "level_started",
          latestEntry.lastStartedAt || latestEntry.firstStartedAt,
          latestEntry.latestEventResult,
          latestEntry.latestTurnNumber
        );
      }
    }

    if (Array.isArray(events) && events.length > 0) {
      let eventCompleted = 0;
      for (const event of events) {
        if (event?.type === "level_completed") eventCompleted++;
      }
      const ledgerCompleted = [...progressById.values(), ...unknownEntries].reduce((sum, e) => sum + e.completedCount, 0);
      if (eventCompleted !== ledgerCompleted && !flags.eventTailTruncated && !flags.historyPartial && !flags.durableTiersCarriedFrom) {
        reviewSignals.push({
          type: "ledger_event_mismatch",
          message: `Durable learning ledger reports ${ledgerCompleted} level completions, but event stream shows ${eventCompleted}. Using durable ledger as source of truth.`
        });
      }
    }

    if (flags.historyPartial) {
      reviewSignals.push({
        type: "history_partial",
        message: "Session history is partial — early events or sessions were truncated."
      });
    }
    if (flags.eventTailTruncated) {
      reviewSignals.push({
        type: "event_tail_truncated",
        message: "Event stream was truncated; durable ledger used for guided progress."
      });
    }
    if (flags.ledgerBackfilled) {
      reviewSignals.push({
        type: "ledger_backfilled",
        message: "Durable ledger was backfilled from legacy session events."
      });
    }
    if (flags.runVersionStoreTruncated) {
      reviewSignals.push({
        type: "run_version_store_truncated",
        message: "Run-version store was trimmed due to storage byte budget."
      });
    }
    if (flags.boundaryXmlsTruncated) {
      reviewSignals.push({
        type: "boundary_xmls_truncated",
        message: "Boundary XML code snapshots were capped at 5 per level."
      });
    }

    const progressEntries = [...requiredEntries, ...catalogEntries.filter((entry) => !entry.isRequiredProgression)];
    const orderedProgressEntries = progressEntries
      .map((catalogEntry) => {
        const entry = progressById.get(catalogEntry.levelId);
        if (!entry) return null;
        return finalizeProgressEntry(entry);
      })
      .filter(Boolean);
    for (const entry of unknownEntries) {
      finalizeProgressEntry(entry);
    }

    const allProgressEntries = [...orderedProgressEntries, ...unknownEntries];
    if (unknownLevelIds.length > 0) {
      reviewSignals.unshift({
        type: "unknown_level_ids",
        levelIds: [...unknownLevelIds],
        message: `Unknown guided level ids seen: ${unknownLevelIds.join(", ")}.`
      });
    }

    const requiredByOrder = orderedProgressEntries.filter((entry) => entry.isRequiredProgression);
    let contiguousPassedThrough = null;
    for (const entry of requiredByOrder) {
      if (entry.passedCount > 0) {
        contiguousPassedThrough = entry;
        continue;
      }
      break;
    }

    const highestReached = [...requiredByOrder].reverse().find((entry) => entry.reached) || null;
    const highestPassed = [...requiredByOrder].reverse().find((entry) => entry.passedCount > 0) || null;
    const highestPassedChallenge = [...allProgressEntries].reverse().find((entry) => entry.isChallenge && entry.passedCount > 0) || null;

    return {
      highestReached,
      highestPassed,
      highestPassedChallenge,
      latestGuidedActivity,
      contiguousPassedThrough,
      guidedLevelProgress: allProgressEntries,
      unknownLevelIds,
      reviewSignals,
      needsReview: reviewSignals.length > 0
    };
  }

  // ── V1 Event Reconstruction Path (Original) ──────────────────────────
  const levelIdsFromSummary = new Set(Array.isArray(summary?.guided?.levelIds) ? summary.guided.levelIds.filter(Boolean) : []);
  const activeAttempts = [];
  let latestGuidedActivity = null;

  function finishActiveAttempt(endAt, reason) {
    const attempt = activeAttempts.pop();
    if (!attempt) {
      return;
    }
    closeAttempt(attempt.entry, attempt, endAt, reason);
  }

  function noteActivity(entry, eventType, eventAt, result, turnNumber) {
    updateEventTimestamps(entry, eventAt, eventType, result, turnNumber);
    latestGuidedActivity = buildActivitySnapshot(entry, eventType, eventAt, result, turnNumber);
  }

  for (const event of Array.isArray(events) ? events : []) {
    const eventType = event?.type || "unknown";
    const eventAt = event?.at || null;
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    const levelId = normalizeLevelId(payload.levelId);
    const turnNumber = typeof payload.turnNumber === "number" && Number.isFinite(payload.turnNumber) ? payload.turnNumber : null;

    if (eventType === "level_started") {
      if (!levelId) {
        reviewSignals.push({
          type: "missing_level_id",
          message: "A guided level_started event was missing levelId."
        });
        continue;
      }
      const entry = getOrCreateProgressEntry(levelId);
      entry.startedCount += 1;
      entry.reached = true;
      noteActivity(entry, eventType, eventAt, null, turnNumber);
      if (activeAttempts.length > 0) {
        finishActiveAttempt(eventAt, "interrupted");
      }
      activeAttempts.push({
        entry,
        levelId,
        startAt: eventAt,
        startEventType: eventType
      });
      continue;
    }

    if (eventType === "level_completed") {
      if (!levelId) {
        reviewSignals.push({
          type: "missing_level_id",
          message: "A guided level_completed event was missing levelId."
        });
        continue;
      }
      const entry = getOrCreateProgressEntry(levelId);
      const result = payload.result || null;
      entry.completedCount += 1;
      entry.reached = true;
      if (result === "PASSED") {
        entry.passedCount += 1;
      } else if (result === "FAILED") {
        entry.failedCount += 1;
      } else {
        reviewSignals.push({
          type: "missing_completion_result",
          message: `Guided level ${formatGuidedProgressLabel(entry)} completed without a pass/fail result.`
        });
      }
      if (typeof payload.turnsSpent === "number" && Number.isFinite(payload.turnsSpent)) {
        entry.turnsSpent += payload.turnsSpent;
      }
      noteActivity(entry, eventType, eventAt, result, turnNumber);
      const activeAttempt = activeAttempts.at(-1);
      if (activeAttempt && activeAttempt.levelId === levelId) {
        finishActiveAttempt(eventAt, "completed");
      } else if (!activeAttempt || activeAttempt.levelId !== levelId) {
        reviewSignals.push({
          type: "orphan_level_completion",
          message: `Guided level ${formatGuidedProgressLabel(entry)} completed without a matching visible start event.`
        });
      }
      continue;
    }

    if (isGuidedBoundaryEvent(event)) {
      finishActiveAttempt(eventAt, "boundary");
    }
  }

  const sessionEndAt = summary?.lastKnown?.exportedAt || summary?.exportedAt || events.at(-1)?.at || null;
  while (activeAttempts.length > 0) {
    finishActiveAttempt(sessionEndAt, "session_end");
  }

  const progressEntries = [...requiredEntries, ...catalogEntries.filter((entry) => !entry.isRequiredProgression)];
  const orderedProgressEntries = progressEntries
    .map((catalogEntry) => {
      const entry = progressById.get(catalogEntry.levelId);
      if (!entry) {
        return null;
      }
      return finalizeProgressEntry(entry);
    })
    .filter(Boolean);
  for (const entry of unknownEntries) {
    finalizeProgressEntry(entry);
  }

  const allProgressEntries = [...orderedProgressEntries, ...unknownEntries];
  const summaryLevelIdSet = new Set(levelIdsFromSummary);
  for (const entry of orderedProgressEntries) {
    if (summaryLevelIdSet.has(entry.levelId)) {
      entry.reached = true;
      if (entry.status === "not_reached") {
        entry.status = "reached";
        entry.statusLabel = "Reached";
      }
    }
  }

  const observedStarted = orderedProgressEntries.reduce((total, entry) => total + entry.startedCount, 0) + unknownEntries.reduce((total, entry) => total + entry.startedCount, 0);
  const observedCompleted = orderedProgressEntries.reduce((total, entry) => total + entry.completedCount, 0) + unknownEntries.reduce((total, entry) => total + entry.completedCount, 0);
  const observedPassed = orderedProgressEntries.reduce((total, entry) => total + entry.passedCount, 0) + unknownEntries.reduce((total, entry) => total + entry.passedCount, 0);
  const observedFailed = orderedProgressEntries.reduce((total, entry) => total + entry.failedCount, 0) + unknownEntries.reduce((total, entry) => total + entry.failedCount, 0);
  const observedChallengeCompletions = orderedProgressEntries.reduce((total, entry) => total + (entry.isChallenge ? entry.passedCount : 0), 0) + unknownEntries.reduce((total, entry) => total + (entry.isChallenge ? entry.passedCount : 0), 0);
  const observedCapstoneCompletions = orderedProgressEntries.reduce((total, entry) => total + (entry.isCapstone ? entry.passedCount : 0), 0) + unknownEntries.reduce((total, entry) => total + (entry.isCapstone ? entry.passedCount : 0), 0);

  trackSummaryMismatch(reviewSignals, "guided_starts", Number(summary?.guided?.started || 0), observedStarted);
  trackSummaryMismatch(reviewSignals, "guided_completions", Number(summary?.guided?.completed || 0), observedCompleted);
  trackSummaryMismatch(reviewSignals, "guided_passes", Number(summary?.guided?.passed || 0), observedPassed);
  trackSummaryMismatch(reviewSignals, "guided_failures", Number(summary?.guided?.failed || 0), observedFailed);
  trackSummaryMismatch(reviewSignals, "challenge_passes", Number(summary?.guided?.challengeCompletions || 0), observedChallengeCompletions);
  trackSummaryMismatch(reviewSignals, "capstone_passes", Number(summary?.guided?.capstoneCompletions || 0), observedCapstoneCompletions);

  if (flags.historyPartial) {
    reviewSignals.push({
      type: "history_partial",
      message: "Session history is partial — early events or sessions were truncated."
    });
  }
  if (flags.eventTailTruncated) {
    reviewSignals.push({
      type: "event_tail_truncated",
      message: "Event stream was truncated."
    });
  }

  if (unknownLevelIds.length > 0) {
    reviewSignals.unshift({
      type: "unknown_level_ids",
      levelIds: [...unknownLevelIds],
      message: `Unknown guided level ids seen: ${unknownLevelIds.join(", ")}.`
    });
  }

  const requiredByOrder = orderedProgressEntries.filter((entry) => entry.isRequiredProgression);
  let contiguousPassedThrough = null;
  for (const entry of requiredByOrder) {
    if (entry.passedCount > 0) {
      contiguousPassedThrough = entry;
      continue;
    }
    break;
  }

  const highestReached = [...requiredByOrder].reverse().find((entry) => entry.reached) || null;
  const highestPassed = [...requiredByOrder].reverse().find((entry) => entry.passedCount > 0) || null;
  const highestPassedChallenge = [...allProgressEntries].reverse().find((entry) => entry.isChallenge && entry.passedCount > 0) || null;

  return {
    highestReached,
    highestPassed,
    highestPassedChallenge,
    latestGuidedActivity,
    contiguousPassedThrough,
    guidedLevelProgress: allProgressEntries,
    unknownLevelIds,
    reviewSignals,
    needsReview: reviewSignals.length > 0
  };
}
