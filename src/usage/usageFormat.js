import { APP_VERSION } from "../config/appInfo.js";
import {
  createLearningLedger,
  createSessionFlags,
  hashXml,
  hydrateAndBackfillSession,
  updateLearningLedgerFromEvent
} from "./learningLedger.js";
import {
  RUN_VERSION_GUIDED_PER_LEVEL_CAP,
  createRunVersionStore,
  getBoundaryXmlsForExport,
  getRunVersionHashesForExport,
  normalizeRunVersionStore
} from "./runVersionStore.js";

export const USAGE_SCHEMA_VERSION = 2;
export const USAGE_RETENTION_DAYS = 7;
export const USAGE_MAX_SESSIONS = 20;
export const USAGE_MAX_EVENTS = 400;
export const USAGE_MAX_SNAPSHOTS = 48;
export const USAGE_DB_NAME = "bba-usage-tracker";
export const USAGE_DB_VERSION = 1;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getAppVersion() {
  return APP_VERSION;
}

export function generateUsageSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `usage-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function cloneJson(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

export function canonicalizeJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalizeJsonValue(entry));
  }
  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        const entry = value[key];
        if (typeof entry !== "undefined") {
          accumulator[key] = canonicalizeJsonValue(entry);
        }
        return accumulator;
      }, {});
  }
  return value;
}

export function canonicalJsonStringify(value) {
  return JSON.stringify(canonicalizeJsonValue(value));
}

function createLastKnownState() {
  return {
    modeView: null,
    levelId: null,
    levelKind: null,
    mapKey: null,
    freePlayMode: null,
    freePlayTeamSize: null,
    activeBlocklyTeamTab: null,
    turnNumber: null,
    exportedAt: null
  };
}

export function createUsageSummary() {
  return {
    totalEvents: 0,
    totalSnapshots: 0,
    turnActions: 0,
    modeEntries: {
      guided: 0,
      freePlay: 0
    },
    guided: {
      attempts: 0,
      started: 0,
      completed: 0,
      passed: 0,
      failed: 0,
      turns: 0,
      challengeCompletions: 0,
      capstoneCompletions: 0,
      levelIds: []
    },
    freePlay: {
      entered: 0,
      configChanges: 0,
      scoreEvents: 0,
      turns: 0,
      wins: 0,
      losses: 0,
      lastScores: { 1: 0, 2: 0 }
    },
    workspace: {
      changes: 0,
      snapshots: 0,
      imports: 0,
      exports: 0,
      lastBlockCounts: {}
    },
    tutorialReplays: 0,
    scoreEvents: 0,
    lastKnown: createLastKnownState()
  };
}

export function createUsageSession(overrides = {}) {
  const startedAt = overrides.startedAt || new Date().toISOString();
  return {
    schemaVersion: overrides.schemaVersion || 2,
    sessionId: overrides.sessionId || generateUsageSessionId(),
    startedAt,
    updatedAt: overrides.updatedAt || startedAt,
    endedAt: overrides.endedAt || null,
    appVersion: overrides.appVersion || getAppVersion(),
    summary: overrides.summary ? cloneJson(overrides.summary) : createUsageSummary(),
    events: Array.isArray(overrides.events) ? cloneJson(overrides.events) : [],
    snapshots: Array.isArray(overrides.snapshots) ? cloneJson(overrides.snapshots) : [],
    learningLedger: createLearningLedger(overrides.learningLedger),
    runVersionStore: createRunVersionStore(overrides.runVersionStore),
    flags: createSessionFlags(overrides.flags)
  };
}

function normalizeScores(scores) {
  return {
    1: Number(scores?.[1] ?? 0),
    2: Number(scores?.[2] ?? 0)
  };
}

function normalizeBlockCounts(blockCounts) {
  if (!blockCounts || typeof blockCounts !== "object") {
    return {};
  }
  return Object.keys(blockCounts)
    .sort()
    .reduce((accumulator, key) => {
      const value = blockCounts[key];
      if (typeof value === "number" && Number.isFinite(value)) {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});
}

function ensureLevelIdList(summary, levelId) {
  if (!levelId) {
    return;
  }
  if (!summary.guided.levelIds.includes(levelId)) {
    summary.guided.levelIds.push(levelId);
  }
}

function getEventPayload(event) {
  if (!event || typeof event !== "object") {
    return {};
  }
  const payload = isPlainObject(event.data) ? { ...event.data } : { ...event };
  delete payload.id;
  delete payload.type;
  delete payload.at;
  if (event.type === "export_requested" || event.type === "export_completed") {
    delete payload.studentName;
    delete payload.filename;
  }
  return payload;
}

const FINGERPRINT_IGNORED_EVENT_TYPES = new Set([
  // Workspace churn is noisy and should not dominate similarity checks.
  "workspace_changed",
  "workspace_snapshot"
]);

export function getUsageEventFingerprint(events = []) {
  return canonicalJsonStringify(
    events
      .filter((event) => !FINGERPRINT_IGNORED_EVENT_TYPES.has(event?.type))
      .map((event) => ({
        type: event.type || "unknown",
        payload: getEventPayload(event)
      }))
  );
}

// Eviction priority: lowest tier is evicted first.
const EVENT_TIERS = [
  ["workspace_changed"],
  ["workspace_snapshot", "export_requested", "export_completed"],
  ["tutorial_replayed"]
];

export function evictLowestValueEvents(events, targetCount) {
  let removed = 0;
  let remaining = events;
  for (const tier of EVENT_TIERS) {
    if (remaining.length <= targetCount) {
      break;
    }
    const tierSet = new Set(tier);
    const kept = [];
    const evictable = [];
    for (const event of remaining) {
      if (tierSet.has(event?.type)) {
        evictable.push(event);
      } else {
        kept.push(event);
      }
    }
    const need = remaining.length - targetCount;
    const evictCount = Math.min(need, evictable.length);
    evictable.splice(0, evictCount);
    removed += evictCount;
    remaining = kept.concat(evictable);
  }
  // Fallback: evict oldest events if still over target.
  if (remaining.length > targetCount) {
    const over = remaining.length - targetCount;
    removed += over;
    remaining = remaining.slice(over);
  }
  events.length = 0;
  events.push(...remaining);
  return removed;
}

export function appendUsageEvent(session, type, data = {}, at = new Date().toISOString()) {
  if (!session.summary) {
    session.summary = createUsageSummary();
  }
  if (!Array.isArray(session.events)) {
    session.events = [];
  }
  if (!Array.isArray(session.snapshots)) {
    session.snapshots = [];
  }

  const event = {
    id: `${session.sessionId}:${session.events.length + 1}`,
    type,
    at,
    data: cloneJson(data)
  };

  session.events.push(event);
  if (session.events.length > USAGE_MAX_EVENTS) {
    const removed = evictLowestValueEvents(session.events, USAGE_MAX_EVENTS);
    if (removed > 0) {
      if (!session.flags) {
        session.flags = createSessionFlags();
      }
      session.flags.eventTailTruncated = true;
      session.flags.historyPartial = true;
    }
  }

  const summary = session.summary;
  summary.totalEvents += 1;

  switch (type) {
    case "level_opened":
      ensureLevelIdList(summary, data.levelId);
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      break;
    case "mode_entered":
      summary.modeEntries[data.modeView === "FREE_PLAY" ? "freePlay" : "guided"] += 1;
      if (data.modeView === "FREE_PLAY") {
        summary.freePlay.entered += 1;
      }
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.freePlayMode = data.freePlayMode ?? summary.lastKnown.freePlayMode;
      summary.lastKnown.freePlayTeamSize = data.freePlayTeamSize ?? summary.lastKnown.freePlayTeamSize;
      summary.lastKnown.activeBlocklyTeamTab = data.activeBlocklyTeamTab ?? summary.lastKnown.activeBlocklyTeamTab;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      break;
    case "free_play_configured":
      summary.freePlay.configChanges += 1;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.freePlayMode = data.freePlayMode ?? summary.lastKnown.freePlayMode;
      summary.lastKnown.freePlayTeamSize = data.freePlayTeamSize ?? summary.lastKnown.freePlayTeamSize;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      summary.lastKnown.activeBlocklyTeamTab = data.activeBlocklyTeamTab ?? summary.lastKnown.activeBlocklyTeamTab;
      break;
    case "level_started":
      summary.guided.started += 1;
      summary.guided.attempts += 1;
      ensureLevelIdList(summary, data.levelId);
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.levelKind = data.levelKind ?? summary.lastKnown.levelKind;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      summary.lastKnown.turnNumber = data.turnNumber ?? summary.lastKnown.turnNumber;
      break;
    case "level_completed":
      summary.guided.completed += 1;
      if (data.result === "PASSED") {
        summary.guided.passed += 1;
      }
      if (data.result === "FAILED") {
        summary.guided.failed += 1;
      }
      if (typeof data.turnsSpent === "number" && Number.isFinite(data.turnsSpent)) {
        summary.guided.turns += data.turnsSpent;
      }
      ensureLevelIdList(summary, data.levelId);
      if (data.levelKind === "challenge" && data.result === "PASSED") {
        summary.guided.challengeCompletions += 1;
      }
      if (data.levelKind === "capstone" && data.result === "PASSED") {
        summary.guided.capstoneCompletions += 1;
      }
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.levelKind = data.levelKind ?? summary.lastKnown.levelKind;
      summary.lastKnown.turnNumber = data.turnNumber ?? summary.lastKnown.turnNumber;
      break;
    case "turn_action_completed":
      summary.turnActions += 1;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.turnNumber = data.turnNumber ?? summary.lastKnown.turnNumber;
      break;
    case "score_point":
      summary.scoreEvents += 1;
      if (data.modeView === "FREE_PLAY") {
        summary.freePlay.scoreEvents += 1;
      }
      summary.freePlay.lastScores = normalizeScores(data.teamScores || summary.freePlay.lastScores);
      summary.lastKnown.turnNumber = data.turnNumber ?? summary.lastKnown.turnNumber;
      break;
    case "tutorial_replayed":
      summary.tutorialReplays += 1;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      break;
    case "workspace_changed":
      summary.workspace.changes += 1;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      break;
    case "workspace_snapshot":
      summary.workspace.snapshots += 1;
      summary.workspace.lastBlockCounts = normalizeBlockCounts(data.blockCounts);
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      summary.lastKnown.turnNumber = data.turnNumber ?? summary.lastKnown.turnNumber;
      break;
    case "workspace_imported":
      summary.workspace.imports += 1;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      break;
    case "workspace_exported":
      summary.workspace.exports += 1;
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.levelId = data.levelId ?? summary.lastKnown.levelId;
      break;
    case "free_play_summary":
      summary.freePlay.turns += Number(data.turns ?? 0);
      if (typeof data.wins === "number") {
        summary.freePlay.wins += data.wins;
      }
      if (typeof data.losses === "number") {
        summary.freePlay.losses += data.losses;
      }
      summary.freePlay.lastScores = normalizeScores(data.teamScores || summary.freePlay.lastScores);
      summary.lastKnown.modeView = data.modeView || summary.lastKnown.modeView;
      summary.lastKnown.mapKey = data.mapKey ?? summary.lastKnown.mapKey;
      break;
    default:
      break;
  }

  updateLearningLedgerFromEvent(session, type, data, at);
  session.updatedAt = at;
  return event;
}

export function addUsageSnapshot(session, type, data = {}, at = new Date().toISOString()) {
  if (!Array.isArray(session.snapshots)) {
    session.snapshots = [];
  }

  const snapshot = {
    id: `${session.sessionId}:snapshot:${session.snapshots.length + 1}`,
    type,
    at,
    data: cloneJson(data)
  };

  const previous = session.snapshots.at(-1);
  // B7: snapshot coalescing drops `reason` from the dedupe signature so
  // identical workspace state under different reasons collapses to one snapshot.
  const currentSignature = canonicalJsonStringify({
    type: snapshot.type,
    blockCounts: snapshot.data?.blockCounts || null,
    xmlText: snapshot.data?.xmlText || null,
    modeView: snapshot.data?.modeView || null,
    levelId: snapshot.data?.levelId || null,
    turnNumber: snapshot.data?.turnNumber ?? null
  });
  const previousSignature = previous
    ? canonicalJsonStringify({
        type: previous.type,
        blockCounts: previous.data?.blockCounts || null,
        xmlText: previous.data?.xmlText || null,
        modeView: previous.data?.modeView || null,
        levelId: previous.data?.levelId || null,
        turnNumber: previous.data?.turnNumber ?? null
      })
    : null;

  if (currentSignature === previousSignature) {
    return null;
  }

  session.snapshots.push(snapshot);
  if (session.snapshots.length > USAGE_MAX_SNAPSHOTS) {
    session.snapshots.splice(0, session.snapshots.length - USAGE_MAX_SNAPSHOTS);
  }
  session.summary.totalSnapshots += 1;
  session.summary.lastKnown.modeView = snapshot.data?.modeView || session.summary.lastKnown.modeView;
  session.summary.lastKnown.levelId = snapshot.data?.levelId ?? session.summary.lastKnown.levelId;
  session.summary.lastKnown.mapKey = snapshot.data?.mapKey ?? session.summary.lastKnown.mapKey;
  session.summary.lastKnown.turnNumber = snapshot.data?.turnNumber ?? session.summary.lastKnown.turnNumber;
  session.updatedAt = at;
  return snapshot;
}

export function sanitizeEventsForV2Export(events = []) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map((event) => {
    if (!event || typeof event !== "object") {
      return event;
    }
    const cloned = cloneJson(event);
    if (cloned.data && typeof cloned.data === "object") {
      if (cloned.data.xmlText) {
        // In V2 export (D3), full XML travels ONLY inside boundaryXmls.
        // Level events retain xmlHash for hash reference, dropping xmlText.
        if (!cloned.data.xmlHash) {
          cloned.data.xmlHash = hashXml(cloned.data.xmlText);
        }
        delete cloned.data.xmlText;
      }
    }
    return cloned;
  });
}

export function sanitizeSnapshotsForV2Export(snapshots = []) {
  if (!Array.isArray(snapshots)) {
    return [];
  }
  return snapshots.map((snapshot) => {
    if (!snapshot || typeof snapshot !== "object") {
      return snapshot;
    }
    const cloned = cloneJson(snapshot);
    if (cloned.data && typeof cloned.data === "object") {
      if (cloned.data.xmlText) {
        // In V2 export (D3), full XML travels ONLY inside boundaryXmls.
        // Snapshots retain metadata and xmlHash for hash reference, dropping xmlText.
        if (!cloned.data.xmlHash) {
          cloned.data.xmlHash = hashXml(cloned.data.xmlText);
        }
        delete cloned.data.xmlText;
      }
    }
    return cloned;
  });
}

export function transformToPre106Baseline(v1Export) {
  if (!v1Export || typeof v1Export !== "object") {
    return v1Export;
  }
  const baseline = cloneJson(v1Export);
  baseline.schemaVersion = 1;
  if (Array.isArray(baseline.events)) {
    baseline.events = baseline.events.map((event) => {
      if (event && event.data) {
        delete event.data.xmlText;
        delete event.data.xmlHash;
      }
      return event;
    });
  }
  delete baseline.learningLedger;
  delete baseline.boundaryXmls;
  delete baseline.runVersionHashes;
  delete baseline.flags;
  return baseline;
}

export function createExportPayload(session, studentName, exportedAt = new Date().toISOString(), options = {}) {
  const cleanStudentName = `${studentName || ""}`.trim();
  const targetSchema = options.schemaVersion || 2;

  if (targetSchema === 1) {
    const v1Payload = {
      schemaVersion: 1,
      exportedAt,
      studentName: cleanStudentName,
      sessionId: session.sessionId,
      appVersion: session.appVersion || getAppVersion(),
      sessionStartedAt: session.startedAt,
      sessionUpdatedAt: session.updatedAt,
      summary: cloneJson({
        ...session.summary,
        totalPlayTimeMs: Math.max(0, Date.parse(exportedAt) - Date.parse(session.startedAt || exportedAt))
      }),
      events: cloneJson(session.events || []),
      snapshots: cloneJson(session.snapshots || [])
    };
    v1Payload.summary.lastKnown = {
      ...(v1Payload.summary.lastKnown || createLastKnownState()),
      exportedAt
    };
    return v1Payload;
  }

  const boundaryResult = getBoundaryXmlsForExport(session, RUN_VERSION_GUIDED_PER_LEVEL_CAP);
  const boundaryXmls = boundaryResult.boundaryXmls || {};
  const flags = cloneJson(session.flags || createSessionFlags());
  if (boundaryResult.truncated) {
    flags.boundaryXmlsTruncated = true;
  }

  const payload = {
    schemaVersion: 2,
    exportedAt,
    studentName: cleanStudentName,
    sessionId: session.sessionId,
    appVersion: session.appVersion || getAppVersion(),
    sessionStartedAt: session.startedAt,
    sessionUpdatedAt: session.updatedAt,
    summary: cloneJson({
      ...session.summary,
      totalPlayTimeMs: Math.max(0, Date.parse(exportedAt) - Date.parse(session.startedAt || exportedAt))
    }),
    learningLedger: cloneJson(session.learningLedger || createLearningLedger()),
    boundaryXmls,
    runVersionHashes: getRunVersionHashesForExport(session),
    flags,
    events: sanitizeEventsForV2Export(session.events || []),
    snapshots: sanitizeSnapshotsForV2Export(session.snapshots || [])
  };

  payload.summary.lastKnown = {
    ...(payload.summary.lastKnown || createLastKnownState()),
    exportedAt
  };
  return payload;
}

export function createExportFilename(studentName, sessionId) {
  const namePart = `${studentName || "usage"}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "usage";
  const sessionPart = `${sessionId || "session"}`.slice(0, 8);
  return `bba-usage-${namePart}-${sessionPart}.json`;
}

export function normalizePersistedSession(session) {
  if (!session || typeof session !== "object") {
    return null;
  }
  const normalized = createUsageSession({
    schemaVersion: session.schemaVersion || 2,
    sessionId: session.sessionId || generateUsageSessionId(),
    startedAt: session.startedAt || new Date().toISOString(),
    updatedAt: session.updatedAt || session.startedAt || new Date().toISOString(),
    endedAt: session.endedAt || null,
    appVersion: session.appVersion || getAppVersion(),
    summary: session.summary || createUsageSummary(),
    events: session.events || [],
    snapshots: session.snapshots || [],
    learningLedger: session.learningLedger || createLearningLedger(),
    runVersionStore: session.runVersionStore || createRunVersionStore(),
    flags: session.flags || createSessionFlags()
  });
  normalized.summary.lastKnown = {
    ...createLastKnownState(),
    ...(session.summary?.lastKnown || {})
  };
  normalized.summary.freePlay.lastScores = normalizeScores(session.summary?.freePlay?.lastScores || {});
  normalized.summary.workspace.lastBlockCounts = normalizeBlockCounts(session.summary?.workspace?.lastBlockCounts || {});
  normalized.summary.guided.levelIds = Array.isArray(session.summary?.guided?.levelIds)
    ? [...session.summary.guided.levelIds]
    : [];
  normalizeRunVersionStore(normalized.runVersionStore);
  if (normalized.runVersionStore?.flags?.runVersionStoreTruncated) {
    normalized.flags.runVersionStoreTruncated = true;
  }
  return hydrateAndBackfillSession(normalized, USAGE_MAX_EVENTS);
}
