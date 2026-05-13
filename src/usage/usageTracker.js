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
  normalizePersistedSession
} from "./usageFormat.js";

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

function createTrackerSession() {
  const session = createUsageSession();
  appendUsageEvent(session, "session_started", { source: "fresh" });
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
          session = createTrackerSession();
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
      await persistSession(db, session);
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

  const tracker = {
    ready,
    recordModeEntered(modeView, details = {}) {
      return record("mode_entered", { modeView, ...details });
    },
    recordFreePlayConfigured(details = {}) {
      return record("free_play_configured", details);
    },
    recordLevelStarted(level, details = {}) {
      const payload = {
        levelId: level?.id || details.levelId || null,
        levelKind: level?.levelKind || details.levelKind || null,
        title: level?.title || details.title || null,
        modeView: details.modeView || app.state.currentModeView,
        mapKey: level?.mapKey || details.mapKey || app.state.currentMapKey,
        turnNumber: app.state.currentTurnNumber,
        attemptNumber: app.state.levelAttemptCount,
        humanTurnBehavior: app.state.humanTurnBehavior
      };
      activeLevelContext = {
        levelId: payload.levelId,
        startTurnNumber: payload.turnNumber,
        startedAt: new Date().toISOString()
      };
      return record("level_started", payload);
    },
    recordLevelEnded(level, result, reason, details = {}) {
      const startTurn = details.startTurnNumber ?? activeLevelContext?.startTurnNumber ?? details.turnNumber ?? app.state.currentTurnNumber;
      const turnsSpent = Math.max(1, (details.turnNumber ?? app.state.currentTurnNumber) - startTurn + 1);
      const payload = {
        levelId: level?.id || details.levelId || null,
        levelKind: level?.levelKind || details.levelKind || null,
        result,
        reason,
        modeView: details.modeView || app.state.currentModeView,
        mapKey: level?.mapKey || details.mapKey || app.state.currentMapKey,
        turnNumber: details.turnNumber ?? app.state.currentTurnNumber,
        turnsSpent
      };
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
  return tracker;
}
