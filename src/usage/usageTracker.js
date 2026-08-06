import {
  USAGE_DB_NAME,
  USAGE_DB_VERSION,
  USAGE_MAX_SESSIONS,
  USAGE_RETENTION_DAYS,
  addUsageSnapshot,
  appendUsageEvent,
  canonicalJsonStringify,
  cloneJson,
  createExportFilename,
  createExportPayload,
  createUsageSession,
  evictLowestValueEvents,
  normalizePersistedSession
} from "./usageFormat.js";
import { syncPassLedger } from "./learningLedger.js";
import {
  inferRunVersionContext,
  normalizeRunVersionStore,
  recordRunVersion as recordRunVersionInStore
} from "./runVersionStore.js";
import { evaluateLevelStars } from "../core/starEvaluation.js";

function isBrowserIndexedDbAvailable() {
  return typeof indexedDB !== "undefined";
}

function openUsageDatabase() {
  if (!isBrowserIndexedDbAvailable()) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(USAGE_DB_NAME, USAGE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("sessions")) {
        const sessions = db.createObjectStore("sessions", { keyPath: "sessionId" });
        sessions.createIndex("updatedAt", "updatedAt", { unique: false });
        sessions.createIndex("startedAt", "startedAt", { unique: false });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Unable to open usage tracker storage."));
  });
}

function getDateMs(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

async function readPersistedCurrentSession(db) {
  if (!db) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["meta", "sessions"], "readonly");
    const metaStore = transaction.objectStore("meta");
    const sessionsStore = transaction.objectStore("sessions");
    const metaRequest = metaStore.get("activeSessionId");
    metaRequest.onerror = () => reject(metaRequest.error || new Error("Unable to read usage metadata."));
    metaRequest.onsuccess = () => {
      const activeSessionId = metaRequest.result?.value || null;
      if (activeSessionId) {
        const sessionRequest = sessionsStore.get(activeSessionId);
        sessionRequest.onerror = () => reject(sessionRequest.error || new Error("Unable to read usage session."));
        sessionRequest.onsuccess = () => resolve(sessionRequest.result || null);
        return;
      }

      const index = sessionsStore.index("updatedAt");
      const cursorRequest = index.openCursor(null, "prev");
      cursorRequest.onerror = () => reject(cursorRequest.error || new Error("Unable to inspect usage sessions."));
      cursorRequest.onsuccess = () => {
        resolve(cursorRequest.result?.value || null);
      };
    };
  });
}

async function persistSession(db, session) {
  if (!db) {
    return;
  }
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(["sessions", "meta"], "readwrite");
    const sessionsStore = transaction.objectStore("sessions");
    const metaStore = transaction.objectStore("meta");
    const putRequest = sessionsStore.put(cloneJson(session));
    putRequest.onerror = () => reject(putRequest.error || new Error("Unable to persist usage session."));
    putRequest.onsuccess = () => {
      metaStore.put({ key: "activeSessionId", value: session.sessionId });
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Unable to persist usage session."));
  });
}

async function pruneSessions(db) {
  if (!db) {
    return;
  }
  const cutoffMs = Date.now() - USAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  await new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    const index = store.index("updatedAt");
    const entries = [];
    const cursorRequest = index.openCursor();
    cursorRequest.onerror = () => reject(cursorRequest.error || new Error("Unable to prune usage sessions."));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (cursor) {
        entries.push(cursor.value);
        cursor.continue();
      }
    };
    transaction.oncomplete = async () => {
      const expired = entries.filter((entry) => getDateMs(entry.updatedAt || entry.startedAt) < cutoffMs);
      const survivors = entries.filter((entry) => !expired.includes(entry));
      const overflow = Math.max(0, survivors.length - USAGE_MAX_SESSIONS);
      const toDelete = new Set([...expired, ...survivors.slice(0, overflow)]);
      if (toDelete.size === 0) {
        resolve();
        return;
      }

      await new Promise((deleteResolve, deleteReject) => {
        const deleteTransaction = db.transaction("sessions", "readwrite");
        const deleteStore = deleteTransaction.objectStore("sessions");
        for (const entry of toDelete) {
          deleteStore.delete(entry.sessionId);
        }
        deleteTransaction.oncomplete = () => deleteResolve();
        deleteTransaction.onerror = () => deleteReject(deleteTransaction.error || new Error("Unable to prune usage sessions."));
      });
      resolve();
    };
    transaction.onerror = () => reject(transaction.error || new Error("Unable to prune usage sessions."));
  });
}

// Exported for unit testing rollover carry-over behavior.
export function createTrackerSession(carriedDurableTiers = null) {
  const session = createUsageSession({
    learningLedger: carriedDurableTiers?.learningLedger,
    runVersionStore: carriedDurableTiers?.runVersionStore
  });
  const source = carriedDurableTiers ? "carried_over" : "fresh";
  appendUsageEvent(session, "session_started", { source });
  if (carriedDurableTiers) {
    session.flags.durableTiersCarriedFrom = carriedDurableTiers.previousSessionId || null;
  }
  return session;
}

function maybeContinueExistingSession(session) {
  const updatedAtMs = getDateMs(session?.updatedAt || session?.startedAt);
  if (!updatedAtMs) {
    return false;
  }
  return Date.now() - updatedAtMs < USAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

function countBlocklyBlockTypes(workspace) {
  if (!workspace || typeof workspace.getAllBlocks !== "function") {
    return {};
  }
  return workspace.getAllBlocks(false).reduce((counts, block) => {
    counts[block.type] = (counts[block.type] || 0) + 1;
    return counts;
  }, {});
}

function buildWorkspaceSnapshotPayload(app, reason) {
  if (!app.blocklyWorkspace) {
    return null;
  }
  const xmlText = app.hooks.getWorkspaceXmlText?.() || "";
  return {
    reason,
    xmlText,
    blockCounts: countBlocklyBlockTypes(app.blocklyWorkspace),
    modeView: app.state.currentModeView,
    levelId: app.state.currentLevelId,
    mapKey: app.state.currentMapKey,
    freePlayMode: app.state.freePlayMode,
    freePlayTeamSize: app.state.freePlayTeamSize,
    activeBlocklyTeamTab: app.state.activeBlocklyTeamTab,
    turnNumber: app.state.currentTurnNumber
  };
}

async function computeBrowserSha256Hex(text) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Browser crypto is unavailable.");
  }
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function initializeUsageTracking(app) {
  if (app.usageTracker) {
    return app.usageTracker;
  }

  let db = null;
  let session = createTrackerSession();
  let pendingPersist = null;
  let pendingWorkspaceSnapshot = null;
  let workspaceSnapshotTimer = null;
  let activeLevelContext = null;

  const ready = (async () => {
    try {
      db = await openUsageDatabase();
      if (db) {
        const persisted = normalizePersistedSession(await readPersistedCurrentSession(db));
        if (persisted && maybeContinueExistingSession(persisted)) {
          session = persisted;
        } else if (persisted) {
          session = createTrackerSession({
            learningLedger: persisted.learningLedger,
            runVersionStore: persisted.runVersionStore,
            previousSessionId: persisted.sessionId
          });
          appendUsageEvent(session, "session_resumed", {
            source: "new_session_after_retention_window",
            previousSessionId: persisted.sessionId || null
          });
        }
        await persistSession(db, session);
        await pruneSessions(db);
      }
    } catch (error) {
      // Keep the in-memory tracker available even if browser persistence is unavailable.
    }
    return session;
  })();

  function schedulePersist() {
    if (pendingPersist) {
      return pendingPersist;
    }
    pendingPersist = Promise.resolve().then(async () => {
      pendingPersist = null;
      await ready;
      if (!db) {
        return;
      }
      await persistWithGracefulDegradation(db, session);
      await pruneSessions(db);
    });
    return pendingPersist;
  }

  function record(type, data = {}) {
    const event = appendUsageEvent(session, type, data);
    schedulePersist();
    return event;
  }

  function recordWorkspaceSnapshot(reason, data) {
    if (!data) {
      return null;
    }
    const snapshot = addUsageSnapshot(session, "workspace_snapshot", { ...data, reason });
    if (snapshot) {
      appendUsageEvent(session, "workspace_snapshot", {
        reason,
        blockCounts: data.blockCounts,
        modeView: data.modeView,
        levelId: data.levelId,
        mapKey: data.mapKey,
        turnNumber: data.turnNumber
      });
      schedulePersist();
    }
    return snapshot;
  }

  function queueWorkspaceSnapshot(app, reason) {
    pendingWorkspaceSnapshot = buildWorkspaceSnapshotPayload(app, reason);
    if (workspaceSnapshotTimer) {
      clearTimeout(workspaceSnapshotTimer);
    }
    workspaceSnapshotTimer = setTimeout(() => {
      workspaceSnapshotTimer = null;
      const payload = pendingWorkspaceSnapshot;
      pendingWorkspaceSnapshot = null;
      recordWorkspaceSnapshot(reason, payload);
    }, 600);
  }

  function getLiveWorkspaceCapture() {
    if (!app) {
      return { xmlText: null, blockCount: null };
    }
    let xmlText = app.hooks?.getWorkspaceXmlText?.() || null;
    let blockCounts = app.blocklyWorkspace ? countBlocklyBlockTypes(app.blocklyWorkspace) : null;

    if (!xmlText && Array.isArray(session.snapshots) && session.snapshots.length > 0) {
      xmlText = session.snapshots.at(-1)?.data?.xmlText || null;
    }
    if (!blockCounts && Array.isArray(session.snapshots) && session.snapshots.length > 0) {
      blockCounts = session.snapshots.at(-1)?.data?.blockCounts || null;
    }

    const blockCount = blockCounts
      ? Object.values(blockCounts).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)
      : null;

    return { xmlText, blockCount };
  }

  const tracker = {
    ready,
    recordModeEntered(modeView, details = {}) {
      return record("mode_entered", { modeView, ...details });
    },
    recordFreePlayConfigured(details = {}) {
      return record("free_play_configured", details);
    },
    recordLevelOpened(levelOrId, details = {}) {
      const levelId = typeof levelOrId === "object" ? levelOrId?.id : levelOrId;
      const live = getLiveWorkspaceCapture();
      const payload = {
        levelId: levelId || details.levelId || null,
        modeView: details.modeView || app.state?.currentModeView || "GUIDED_LEVELS",
        mapKey: details.mapKey || app.state?.currentMapKey || null,
        blockCount: details.blockCount ?? live.blockCount,
        xmlText: details.xmlText ?? live.xmlText,
        ...details
      };
      return record("level_opened", payload);
    },
    syncPassLedger(passedLevelIds = []) {
      syncPassLedger(session, passedLevelIds);
      schedulePersist();
    },
    recordLevelStarted(level, details = {}) {
      const live = getLiveWorkspaceCapture();
      const payload = {
        levelId: level?.id || details.levelId || null,
        levelKind: level?.levelKind || details.levelKind || null,
        title: level?.title || details.title || null,
        modeView: details.modeView || app.state?.currentModeView || null,
        mapKey: level?.mapKey || details.mapKey || app.state?.currentMapKey || null,
        turnNumber: app.state?.currentTurnNumber ?? null,
        attemptNumber: app.state?.levelAttemptCount ?? null,
        humanTurnBehavior: app.state?.humanTurnBehavior ?? null,
        blockCount: details.blockCount ?? live.blockCount,
        xmlText: details.xmlText ?? live.xmlText,
        ...details
      };
      activeLevelContext = {
        levelId: payload.levelId,
        startTurnNumber: payload.turnNumber,
        startedAt: new Date().toISOString()
      };
      return record("level_started", payload);
    },
    recordLevelEnded(level, result, reason, details = {}) {
      const startTurn = details.startTurnNumber ?? activeLevelContext?.startTurnNumber ?? details.turnNumber ?? app.state?.currentTurnNumber ?? 1;
      const turnsSpent = Math.max(1, (details.turnNumber ?? app.state?.currentTurnNumber ?? 1) - startTurn + 1);
      const live = getLiveWorkspaceCapture();
      const payload = {
        levelId: level?.id || details.levelId || null,
        levelKind: level?.levelKind || details.levelKind || null,
        result,
        reason,
        modeView: details.modeView || app.state?.currentModeView || null,
        mapKey: level?.mapKey || details.mapKey || app.state?.currentMapKey || null,
        turnNumber: details.turnNumber ?? app.state?.currentTurnNumber ?? null,
        turnsSpent,
        blockCount: details.blockCount ?? live.blockCount,
        xmlText: details.xmlText ?? live.xmlText,
        ...details
      };
      const starEval = evaluateLevelStars(level, result, {
        turnsSpent,
        runnerActionHistory: app.state?.runnerActionHistory || {},
        appState: app.state,
        ...details
      });
      Object.assign(payload, starEval);
      activeLevelContext = null;
      return record("level_completed", payload);
    },
    recordTurnActionCompleted(details = {}) {
      return record("turn_action_completed", {
        runnerId: details.runnerId || null,
        teamId: details.teamId || null,
        actionType: details.actionType || null,
        turnNumber: details.turnNumber ?? app.state.currentTurnNumber,
        modeView: details.modeView || app.state.currentModeView,
        levelId: details.levelId || app.state.currentLevelId
      });
    },
    recordRunVersion(runner, appRef, xmlText) {
      const state = appRef?.state || app?.state || {};
      const context = inferRunVersionContext(state, runner);
      if (!context) {
        return { stored: false, reason: "no_context" };
      }
      const xml = xmlText || appRef?.hooks?.getWorkspaceXmlText?.() || app?.hooks?.getWorkspaceXmlText?.() || "";
      if (!xml) {
        return { stored: false, reason: "no_xml" };
      }
      const at = new Date().toISOString();
      const result = recordRunVersionInStore(session.runVersionStore, context, xml, at);
      if (result.stored) {
        normalizeRunVersionStore(session.runVersionStore);
        if (session.runVersionStore.flags.runVersionStoreTruncated) {
          session.flags.runVersionStoreTruncated = true;
        }
      }
      schedulePersist();
      return result;
    },
    recordScorePoint(details = {}) {
      return record("score_point", {
        runnerId: details.runnerId || null,
        teamId: details.teamId || null,
        teamScores: details.teamScores || cloneJson(app.state.teamScores || {}),
        modeView: details.modeView || app.state.currentModeView,
        turnNumber: details.turnNumber ?? app.state.currentTurnNumber
      });
    },
    recordTutorialReplay(details = {}) {
      return record("tutorial_replayed", {
        levelId: details.levelId || app.state.currentLevelId || null,
        forced: Boolean(details.forced),
        modeView: details.modeView || app.state.currentModeView
      });
    },
    recordWorkspaceChange(details = {}) {
      return record("workspace_changed", details);
    },
    recordWorkspaceImported(details = {}) {
      return record("workspace_imported", details);
    },
    recordWorkspaceExported(details = {}) {
      return record("workspace_exported", details);
    },
    queueWorkspaceSnapshot,
    recordWorkspaceSnapshot(reason, data) {
      return recordWorkspaceSnapshot(reason, data);
    },
    recordFreePlaySummary(details = {}) {
      return record("free_play_summary", details);
    },
    async flush() {
      if (workspaceSnapshotTimer) {
        clearTimeout(workspaceSnapshotTimer);
        workspaceSnapshotTimer = null;
        const payload = pendingWorkspaceSnapshot;
        pendingWorkspaceSnapshot = null;
        if (payload) {
          recordWorkspaceSnapshot(payload.reason, payload);
        }
      }
      await ready;
      if (!db) {
        return;
      }
      await persistSession(db, session);
      await pruneSessions(db);
    },
    getDebugSnapshot() {
      return cloneJson(session);
    },
    getGuidedStarState(levelId) {
      if (!levelId) return null;
      const key = `${levelId}`.trim();
      const entry = session.learningLedger?.guided?.[key];
      if (!entry) return null;
      return {
        reached: Boolean(entry.reached),
        passed: Boolean(entry.passed),
        starsEarned: Number.isFinite(entry.starsEarned) ? entry.starsEarned : (entry.passed ? 1 : 0),
        parBeaten: Boolean(entry.parBeaten),
        turnPar: Number.isFinite(entry.turnPar) ? entry.turnPar : null,
        masteryAchieved: Boolean(entry.masteryAchieved),
        masteryCriterionId: entry.masteryCriterionId || null
      };
    },
    async exportUsageFile(studentName) {
      const cleanName = `${studentName || ""}`.trim();
      if (!cleanName) {
        return { ok: false, error: "A student name is required before exporting." };
      }
      record("export_requested", {
        studentName: cleanName,
        modeView: app.state.currentModeView,
        levelId: app.state.currentLevelId,
        mapKey: app.state.currentMapKey
      });
      await tracker.flush();
      const exportedAt = new Date().toISOString();
      const payload = createExportPayload(session, cleanName, exportedAt);
      const canonicalPayload = canonicalJsonStringify(payload);
      const payloadWithIntegrity = {
        ...payload,
        integrity: {
          algorithm: "SHA-256",
          sha256: await computeBrowserSha256Hex(canonicalPayload)
        }
      };
      const filename = createExportFilename(cleanName, session.sessionId);
      appendUsageEvent(session, "export_completed", {
        studentName: cleanName,
        filename,
        modeView: app.state.currentModeView,
        levelId: app.state.currentLevelId
      });
      schedulePersist();
      return {
        ok: true,
        filename,
        payload: payloadWithIntegrity,
        canonicalPayload: payload
      };
    }
  };

  app.usageTracker = tracker;
  // Test-scaffolding accessor only. Do not treat as a general mutable-session backdoor.
  app.usageTrackerSessionInternal = session;
  return tracker;
}
function isQuotaError(error) {
  if (!error) {
    return false;
  }
  return (
    error.name === "QuotaExceededError" ||
    error.name === "QuotaExceeded" ||
    error.code === 22 ||
    error.code === 1014 ||
    (typeof error.message === "string" && /quota/i.test(error.message))
  );
}

function degradeSessionOnQuotaError(session) {
  let discarded = false;

  // 1. Evict churn: lowest-value events first.
  if (Array.isArray(session.events) && session.events.length > 0) {
    const targetCount = Math.max(0, Math.floor(session.events.length / 2));
    const removed = evictLowestValueEvents(session.events, targetCount);
    if (removed > 0) {
      discarded = true;
      session.flags.eventTailTruncated = true;
      session.flags.historyPartial = true;
    }
  }

  // 2. Evict snapshots (also churn).
  if (Array.isArray(session.snapshots) && session.snapshots.length > 0) {
    const removeCount = Math.ceil(session.snapshots.length / 2);
    session.snapshots.splice(0, removeCount);
    discarded = true;
  }

  // 3. Evict oldest free-play run versions.
  if (session.runVersionStore?.freePlay) {
    for (const bucket of Object.values(session.runVersionStore.freePlay)) {
      if (bucket.versions?.length > 0) {
        bucket.versions.shift();
        discarded = true;
      }
    }
  }

  // 4. Evict oldest guided run-version window.
  const guidedEntries = Object.values(session.runVersionStore?.guided || {});
  if (guidedEntries.length > 0) {
    const sorted = guidedEntries
      .map((entry) => ({ entry, lastAt: entry.versions.at(-1)?.at || "" }))
      .sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    delete session.runVersionStore.guided[sorted[0].entry.levelId];
    discarded = true;
  }

  if (discarded) {
    session.flags.runVersionStoreTruncated = true;
  }
  return discarded;
}

// Exported for unit testing with an injected persist function.
export async function persistWithGracefulDegradation(db, session, persistFn = persistSession) {
  try {
    await persistFn(db, session);
  } catch (error) {
    if (!isQuotaError(error)) {
      // Never throw into student-facing flows; cascade only runs for quota.
      return;
    }
    const discarded = degradeSessionOnQuotaError(session);
    if (discarded) {
      session.flags.runVersionStoreTruncated = true;
    }
    try {
      await persistFn(db, session);
    } catch {
      // Second attempt failed; swallow so the app keeps running.
    }
  }
}
