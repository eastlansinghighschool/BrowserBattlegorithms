import test from "node:test";
import assert from "node:assert/strict";
import {
  createGuidedLevelRollupEntry,
  createLearningLedger,
  createSessionFlags,
  hashXml,
  hydrateAndBackfillSession,
  syncPassLedger,
  updateLearningLedgerFromEvent
} from "../../src/usage/learningLedger.js";
import {
  appendUsageEvent,
  createExportPayload,
  createUsageSession,
  evictLowestValueEvents,
  normalizePersistedSession
} from "../../src/usage/usageFormat.js";
import { createTrackerSession, initializeUsageTracking, persistWithGracefulDegradation } from "../../src/usage/usageTracker.js";
import { normalizeRunVersionStore, recordRunVersion } from "../../src/usage/runVersionStore.js";
import { hashStarterXml, normalizeStarterXmlForHashing } from "../../src/ai/blockly/starterVersioning.js";

function makeXml(seed) {
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="${seed}"></block></xml>`;
}

test("hashXml produces deterministic FNV-1a hex string hash matching starterVersioning contract", () => {
  const xml = '<xml><block type="event_on_turn" x="10" y="20"></block></xml>';
  const hash1 = hashXml(xml);
  const hash2 = hashXml(xml);
  const directHash = hashStarterXml(xml);

  assert.equal(typeof hash1, "string");
  assert.equal(hash1.length, 8);
  assert.equal(hash1, hash2);
  assert.equal(hash1, directHash);

  // Insensitive to position attributes and formatting
  const reformattedXml = '<xml>\n  <block type="event_on_turn" x="99" y="100"></block>\n</xml>';
  assert.equal(hashXml(reformattedXml), directHash);

  assert.equal(hashXml(null), null);
  assert.equal(hashXml(""), null);
});

test("createUsageSession creates schema v2 session with learningLedger and flags", () => {
  const session = createUsageSession({ sessionId: "test-v2-session" });
  assert.equal(session.schemaVersion, 2);
  assert.ok(session.learningLedger);
  assert.deepEqual(session.learningLedger.guided, {});
  assert.deepEqual(session.learningLedger.passLedger, []);
  assert.deepEqual(session.flags, {
    ledgerBackfilled: false,
    eventTailTruncated: false,
    historyPartial: false,
    runVersionStoreTruncated: false,
    durableTiersCarriedFrom: null
  });
});

test("level_opened records reached marker without starting a run", () => {
  const session = createUsageSession({ sessionId: "opened-session" });
  appendUsageEvent(session, "level_opened", {
    levelId: "score-a-point",
    modeView: "GUIDED_LEVELS",
    mapKey: "wideAisle",
    blockCount: 4,
    xmlText: "<xml>test</xml>"
  }, "2026-07-21T12:00:00.000Z");

  const ledgerEntry = session.learningLedger.guided["score-a-point"];
  assert.ok(ledgerEntry);
  assert.equal(ledgerEntry.levelId, "score-a-point");
  assert.equal(ledgerEntry.reached, true);
  assert.equal(ledgerEntry.startedCount, 0);
  assert.equal(ledgerEntry.completedCount, 0);
  assert.equal(ledgerEntry.passedCount, 0);
  assert.equal(ledgerEntry.failedCount, 0);
  assert.equal(ledgerEntry.revisits, 0);
  assert.equal(ledgerEntry.firstActivityAt, "2026-07-21T12:00:00.000Z");
  assert.equal(ledgerEntry.lastActivityAt, "2026-07-21T12:00:00.000Z");
  assert.equal(ledgerEntry.startBlockCount, 4);
  assert.equal(ledgerEntry.endBlockCount, 4);
  assert.equal(ledgerEntry.finalXmlHash, hashXml("<xml>test</xml>"));
});

test("ledger entry field names match Plan 81 guided_level_rollup field set", () => {
  const entry = createGuidedLevelRollupEntry("sample-level");
  const expectedKeys = [
    "levelId",
    "reached",
    "startedCount",
    "completedCount",
    "passedCount",
    "failedCount",
    "revisits",
    "turnsSpent",
    "durationMs",
    "firstActivityAt",
    "lastActivityAt",
    "lastResult",
    "passed",
    "startBlockCount",
    "endBlockCount",
    "finalXmlHash"
  ];
  for (const key of expectedKeys) {
    assert.ok(Object.prototype.hasOwnProperty.call(entry, key), `Missing field ${key} in rollup entry`);
  }
});

test("incremental rollups update startedCount, completedCount, passedCount, failedCount, revisits, and durationMs accurately", () => {
  const session = createUsageSession({ sessionId: "rollup-session" });

  appendUsageEvent(session, "level_opened", { levelId: "level-1" }, "2026-07-21T12:00:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "level-1", blockCount: 5 }, "2026-07-21T12:00:05.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "FAILED", turnsSpent: 10, blockCount: 5 }, "2026-07-21T12:00:15.000Z");

  appendUsageEvent(session, "level_started", { levelId: "level-1", blockCount: 6 }, "2026-07-21T12:01:00.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "PASSED", turnsSpent: 8, blockCount: 6 }, "2026-07-21T12:01:10.000Z");

  // Re-open level after passing to test revisits
  appendUsageEvent(session, "level_opened", { levelId: "level-1" }, "2026-07-21T12:05:00.000Z");

  const entry = session.learningLedger.guided["level-1"];
  assert.equal(entry.reached, true);
  assert.equal(entry.startedCount, 2);
  assert.equal(entry.completedCount, 2);
  assert.equal(entry.failedCount, 1);
  assert.equal(entry.passedCount, 1);
  assert.equal(entry.passed, true);
  assert.equal(entry.revisits, 1);
  assert.equal(entry.turnsSpent, 18);
  assert.equal(entry.lastResult, "PASSED");
  assert.equal(entry.firstActivityAt, "2026-07-21T12:00:00.000Z");
  assert.equal(entry.lastActivityAt, "2026-07-21T12:05:00.000Z");
  assert.equal(entry.startBlockCount, 5);
  assert.equal(entry.endBlockCount, 6);
  assert.ok(entry.durationMs > 0);
});

test("live producer call path (recordLevelStarted/Ended) captures non-null xmlHash and block counts", () => {
  const dummyApp = {
    state: { currentModeView: "GUIDED_LEVELS", currentMapKey: "wideAisle", currentLevelId: "test-level-live", currentTurnNumber: 1 },
    hooks: {
      getWorkspaceXmlText: () => "<xml><block type='event_on_turn'></block></xml>"
    },
    blocklyWorkspace: {
      getAllBlocks: () => [{ type: "event_on_turn" }, { type: "move_forward" }]
    }
  };

  const tracker = initializeUsageTracking(dummyApp);
  tracker.recordLevelStarted({ id: "test-level-live", levelKind: "tutorial", title: "Test Level" });
  tracker.recordLevelEnded({ id: "test-level-live" }, "PASSED", "win_condition_met", { turnNumber: 5 });

  assert.ok(dummyApp.usageTracker);

  // Verify the appended event payload carries the live workspace capture
  const lastCompletedEvent = dummyApp.usageTrackerSessionInternal?.events.find(e => e.type === "level_completed");
  assert.ok(lastCompletedEvent);
  assert.equal(lastCompletedEvent.data.blockCount, 2);
  assert.equal(lastCompletedEvent.data.xmlText, "<xml><block type='event_on_turn'></block></xml>");

  const entry = dummyApp.usageTrackerSessionInternal?.learningLedger.guided["test-level-live"];
  assert.ok(entry);
  assert.equal(entry.reached, true);
  assert.equal(entry.startBlockCount, 2);
  assert.equal(entry.endBlockCount, 2);
  assert.equal(entry.finalXmlHash, hashXml("<xml><block type='event_on_turn'></block></xml>"));
});

test("syncPassLedger mirrors cross-session guided pass ledger into session store", () => {
  const session = createUsageSession({ sessionId: "mirror-session" });
  syncPassLedger(session, ["level-1", "level-2", "level-3"]);

  assert.deepEqual(session.learningLedger.passLedger, ["level-1", "level-2", "level-3"]);
  assert.ok(session.learningLedger.guided["level-1"]);
  assert.equal(session.learningLedger.guided["level-1"].reached, true);
  assert.equal(session.learningLedger.guided["level-1"].passedCount, 1);
  assert.equal(session.learningLedger.guided["level-1"].passed, true);
});

test("legacy v1 sessions hydrate cleanly with v2 schema marker, backfill, and honest flags", () => {
  const v1Session = {
    schemaVersion: 1,
    sessionId: "legacy-v1-session",
    startedAt: "2026-07-21T10:00:00.000Z",
    updatedAt: "2026-07-21T10:10:00.000Z",
    summary: {
      totalEvents: 3,
      guided: { attempts: 1, started: 1, completed: 1, passed: 1, failed: 0, turns: 5, levelIds: ["guided-a"] },
      modeEntries: { guided: 1, freePlay: 0 },
      freePlay: {}, workspace: {}, lastKnown: {}
    },
    events: [
      { type: "level_opened", data: { levelId: "guided-a" }, at: "2026-07-21T10:00:01.000Z" },
      { type: "level_started", data: { levelId: "guided-a" }, at: "2026-07-21T10:00:05.000Z" },
      { type: "level_completed", data: { levelId: "guided-a", result: "PASSED", turnsSpent: 5 }, at: "2026-07-21T10:00:10.000Z" }
    ]
  };

  const normalized = normalizePersistedSession(v1Session);
  assert.equal(normalized.schemaVersion, 2);
  assert.ok(normalized.learningLedger);
  assert.ok(normalized.learningLedger.guided["guided-a"]);
  assert.equal(normalized.learningLedger.guided["guided-a"].reached, true);
  assert.equal(normalized.learningLedger.guided["guided-a"].passedCount, 1);
  assert.deepEqual(normalized.flags, {
    ledgerBackfilled: true,
    eventTailTruncated: false,
    historyPartial: false,
    runVersionStoreTruncated: false,
    durableTiersCarriedFrom: null
  });

  // Newly initialized v2 sessions must NOT set ledgerBackfilled: true
  const freshV2 = createUsageSession();
  const normalizedV2 = normalizePersistedSession(freshV2);
  assert.equal(normalizedV2.flags.ledgerBackfilled, false);
});

test("truncated event log sets eventTailTruncated and historyPartial flags honestly only on eviction", () => {
  const truncatedSession = createUsageSession({ sessionId: "truncated-session" });
  truncatedSession.summary.totalEvents = 500;
  for (let i = 0; i < 400; i++) {
    appendUsageEvent(truncatedSession, "workspace_changed", { levelId: "busy-level" });
  }
  // Exceed max cap to trigger value-based trimming
  appendUsageEvent(truncatedSession, "workspace_changed", { levelId: "busy-level" });

  assert.equal(truncatedSession.flags.eventTailTruncated, true);
  assert.equal(truncatedSession.flags.historyPartial, true);

  const hydrated = hydrateAndBackfillSession(truncatedSession, 400);
  assert.equal(hydrated.flags.eventTailTruncated, true);
  assert.equal(hydrated.flags.historyPartial, true);
});

test("createExportPayload preserves v1 export shape, schemaVersion: 1, and excludes v2 ledger fields", () => {
  const session = createUsageSession({ sessionId: "export-test-session" });
  appendUsageEvent(session, "level_opened", { levelId: "level-1" });

  const payload = createExportPayload(session, "Test Student", "2026-07-21T12:00:00.000Z");
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.studentName, "Test Student");
  assert.equal(payload.sessionId, "export-test-session");
  assert.ok(Array.isArray(payload.events));
  assert.ok(Array.isArray(payload.snapshots));

  // Durable ledger and flags MUST NOT appear in the v1 export payload
  assert.equal(payload.learningLedger, undefined);
  assert.equal(payload.flags, undefined);
});

test("session flags include runVersionStoreTruncated", () => {
  const flags = createSessionFlags();
  assert.equal(flags.runVersionStoreTruncated, false);
  const setFlags = createSessionFlags({ runVersionStoreTruncated: true });
  assert.equal(setFlags.runVersionStoreTruncated, true);
});

test("session flags include durableTiersCarriedFrom", () => {
  const flags = createSessionFlags();
  assert.equal(flags.durableTiersCarriedFrom, null);
  const carriedFlags = createSessionFlags({ durableTiersCarriedFrom: "prior-session-id" });
  assert.equal(carriedFlags.durableTiersCarriedFrom, "prior-session-id");
});

test("rollover session carries durable tiers from prior session", () => {
  const priorSession = createUsageSession({ sessionId: "prior-session" });
  updateLearningLedgerFromEvent(priorSession, "level_opened", { levelId: "level-a" }, "2026-07-01T10:00:00Z");
  updateLearningLedgerFromEvent(priorSession, "level_started", { levelId: "level-a", blockCount: 4 }, "2026-07-01T10:00:05Z");
  updateLearningLedgerFromEvent(priorSession, "level_completed", { levelId: "level-a", result: "PASSED", turnsSpent: 3, blockCount: 4 }, "2026-07-01T10:00:10Z");
  syncPassLedger(priorSession, ["level-a"]);
  recordRunVersion(
    priorSession.runVersionStore,
    { type: "guided", levelId: "level-a" },
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="rollover_version"></block></xml>',
    "2026-07-01T10:00:10Z"
  );

  const rolled = createTrackerSession({
    learningLedger: priorSession.learningLedger,
    runVersionStore: priorSession.runVersionStore,
    previousSessionId: priorSession.sessionId
  });

  assert.equal(rolled.flags.durableTiersCarriedFrom, "prior-session");
  assert.equal(rolled.learningLedger.guided["level-a"].passed, true);
  assert.deepEqual(rolled.learningLedger.passLedger, ["level-a"]);
  assert.equal(rolled.runVersionStore.guided["level-a"].versions.length, 1);
  assert.equal(rolled.events.find((e) => e.type === "session_started")?.data?.source, "carried_over");
});

test("rollover session does not carry over churn or event tails", () => {
  const priorSession = createUsageSession({ sessionId: "prior-session" });
  updateLearningLedgerFromEvent(priorSession, "level_opened", { levelId: "level-b" }, "2026-07-01T10:00:00Z");
  appendUsageEvent(priorSession, "workspace_changed", { levelId: "level-b" }, "2026-07-01T10:00:01Z");
  appendUsageEvent(priorSession, "workspace_snapshot", { levelId: "level-b", xmlText: "<xml>snap</xml>" }, "2026-07-01T10:00:02Z");
  appendUsageEvent(priorSession, "tutorial_replayed", { levelId: "level-b" }, "2026-07-01T10:00:03Z");
  priorSession.summary.totalEvents = 999;
  priorSession.flags.eventTailTruncated = true;
  priorSession.flags.historyPartial = true;

  const rolled = createTrackerSession({
    learningLedger: priorSession.learningLedger,
    runVersionStore: priorSession.runVersionStore,
    previousSessionId: priorSession.sessionId
  });

  assert.equal(rolled.events.length, 1);
  assert.equal(rolled.events[0].type, "session_started");
  assert.equal(rolled.summary.totalEvents, 1);
  assert.equal(rolled.flags.eventTailTruncated, false);
  assert.equal(rolled.flags.historyPartial, false);
  assert.equal(rolled.snapshots.length, 0);
});

test("reached and pass data are readable in rolled-over session without the old session", () => {
  const priorSession = createUsageSession({ sessionId: "prior-session" });
  updateLearningLedgerFromEvent(priorSession, "level_opened", { levelId: "level-c" }, "2026-07-01T10:00:00Z");
  syncPassLedger(priorSession, ["level-c"]);

  const rolled = createTrackerSession({
    learningLedger: priorSession.learningLedger,
    runVersionStore: priorSession.runVersionStore,
    previousSessionId: priorSession.sessionId
  });

  // Destroy reference to prior session (conceptually); rolled session still has data.
  assert.ok(rolled.learningLedger.guided["level-c"]);
  assert.equal(rolled.learningLedger.guided["level-c"].reached, true);
  assert.equal(rolled.learningLedger.guided["level-c"].passed, true);
  assert.deepEqual(rolled.learningLedger.passLedger, ["level-c"]);
});

test("exactly 400 events without eviction does not flag eventTailTruncated", () => {
  const session = createUsageSession({ sessionId: "boundary-session" });
  for (let i = 0; i < 400; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "boundary-level" });
  }
  assert.equal(session.events.length, 400);
  assert.equal(session.flags.eventTailTruncated, false);
  assert.equal(session.flags.historyPartial, false);
});

test("persistWithGracefulDegradation retries once after a quota error and sets flags", async () => {
  const session = createUsageSession({ sessionId: "quota-session" });
  for (let i = 0; i < 10; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-q" }, `2026-07-01T10:00:${String(i).padStart(2, "0")}Z`);
  }
  for (let i = 0; i < 4; i++) {
    session.snapshots.push({ id: `snapshot-${i}`, type: "workspace_snapshot", at: `2026-07-01T10:00:${String(i).padStart(2, "0")}Z`, data: {} });
  }
  recordRunVersion(session.runVersionStore, { type: "freePlay", contextKey: "freeplay:team1" }, "<xml>fp1</xml>", "2026-07-01T10:00:00Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-q" }, "<xml>guided1</xml>", "2026-07-01T10:00:00Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-q" }, "<xml>guided2</xml>", "2026-07-01T10:00:01Z");

  let callCount = 0;
  const fakePersist = async () => {
    callCount += 1;
    if (callCount === 1) {
      const err = new Error("The quota has been exceeded.");
      err.name = "QuotaExceededError";
      throw err;
    }
  };

  await persistWithGracefulDegradation(null, session, fakePersist);

  assert.equal(callCount, 2, "should retry exactly once after quota error");
  assert.equal(session.flags.runVersionStoreTruncated, true);
  assert.equal(session.flags.eventTailTruncated, true);
  assert.equal(session.flags.historyPartial, true);
  assert.ok(session.events.length < 10, "events should have been evicted");
  assert.ok(session.snapshots.length < 4, "snapshots should have been evicted");
  assert.ok(!session.runVersionStore.freePlay["freeplay:team1"] || session.runVersionStore.freePlay["freeplay:team1"].versions.length === 0, "free-play versions should have been evicted");
  assert.equal(session.runVersionStore.guided["level-q"], undefined, "guided window should have been evicted");
});

test("persistWithGracefulDegradation swallows non-quota errors without cascading", async () => {
  const session = createUsageSession({ sessionId: "non-quota-session" });
  for (let i = 0; i < 5; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-nq" });
  }
  let callCount = 0;
  const fakePersist = async () => {
    callCount += 1;
    const err = new Error("Random database failure");
    err.name = "UnknownError";
    throw err;
  };

  await persistWithGracefulDegradation(null, session, fakePersist);

  assert.equal(callCount, 1, "should not retry on non-quota errors");
  assert.equal(session.events.length, 5, "events should not be evicted on non-quota errors");
  assert.equal(session.flags.eventTailTruncated, false);
});

test("persistWithGracefulDegradation evicts churn before free-play and guided on quota error", async () => {
  const session = createUsageSession({ sessionId: "order-session" });
  for (let i = 0; i < 6; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-o" }, `2026-07-01T10:00:${String(i).padStart(2, "0")}Z`);
  }
  appendUsageEvent(session, "level_completed", { levelId: "level-o", result: "PASSED" }, "2026-07-01T10:00:10Z");
  recordRunVersion(session.runVersionStore, { type: "freePlay", contextKey: "freeplay:team1" }, "<xml>fp</xml>", "2026-07-01T10:00:00Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-o" }, "<xml>g</xml>", "2026-07-01T10:00:00Z");

  let callCount = 0;
  const fakePersist = async () => {
    callCount += 1;
    if (callCount === 1) {
      const err = new Error("QuotaExceeded");
      err.name = "QuotaExceededError";
      throw err;
    }
  };

  await persistWithGracefulDegradation(null, session, fakePersist);

  // Churn removed first, so the high-value level_completed event survives.
  assert.ok(session.events.some((e) => e.type === "level_completed"), "high-value events should survive churn eviction");
  assert.ok(!session.runVersionStore.freePlay["freeplay:team1"] || session.runVersionStore.freePlay["freeplay:team1"].versions.length === 0, "free-play versions should be evicted");
  assert.equal(session.runVersionStore.guided["level-o"], undefined, "guided window should be evicted after free-play");
});

// This fixture is intentionally constructed so a plain front-splice FIFO eviction would keep workspace_changed
// events and drop the high-value level_completed event. The B2 cascade must keep the high-value event.
test("B2 cascade keeps high-value events when FIFO would drop them", async () => {
  const session = createUsageSession({ sessionId: "fifo-contrast" });
  appendUsageEvent(session, "level_completed", { levelId: "level-fifo", result: "PASSED" }, "2026-07-01T10:00:00Z");
  for (let i = 0; i < 10; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-fifo" }, `2026-07-01T10:00:${String(i + 1).padStart(2, "0")}Z`);
  }

  const initialEvents = session.events.length;
  let callCount = 0;
  const fakePersist = async () => {
    callCount += 1;
    if (callCount === 1) {
      const err = new Error("QuotaExceeded");
      err.name = "QuotaExceededError";
      throw err;
    }
  };

  await persistWithGracefulDegradation(null, session, fakePersist);

  assert.ok(session.events.some((e) => e.type === "level_completed"), "level_completed must survive churn eviction");
  assert.ok(session.events.length < initialEvents, "workspace_changed churn should have been removed");
});

// Repair 4: direct B2 cascade tests using evictLowestValueEvents.
test("evictLowestValueEvents removes workspace_changed before higher-tier events", () => {
  const session = createUsageSession({ sessionId: "b2-workspace-changed" });
  appendUsageEvent(session, "level_completed", { levelId: "level-b2", result: "PASSED" }, "2026-07-01T10:00:00Z");
  for (let i = 0; i < 5; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-b2" }, `2026-07-01T10:00:${String(i + 1).padStart(2, "0")}Z`);
  }
  appendUsageEvent(session, "tutorial_replayed", { levelId: "level-b2" }, "2026-07-01T10:00:10Z");

  const removed = evictLowestValueEvents(session.events, 2);
  assert.ok(removed > 0);
  assert.ok(session.events.some((e) => e.type === "level_completed"), "level_completed must survive");
  assert.ok(!session.events.some((e) => e.type === "workspace_changed"), "workspace_changed should be evicted first");
});

test("evictLowestValueEvents removes workspace_snapshot/export before tutorial_replayed", () => {
  const session = createUsageSession({ sessionId: "b2-snapshot-export" });
  for (let i = 0; i < 3; i++) {
    appendUsageEvent(session, "workspace_snapshot", { levelId: "level-b2" }, `2026-07-01T10:00:${String(i).padStart(2, "0")}Z`);
  }
  appendUsageEvent(session, "export_requested", { levelId: "level-b2" }, "2026-07-01T10:00:05Z");
  appendUsageEvent(session, "export_completed", { levelId: "level-b2" }, "2026-07-01T10:00:06Z");
  for (let i = 0; i < 3; i++) {
    appendUsageEvent(session, "tutorial_replayed", { levelId: "level-b2" }, `2026-07-01T10:00:${String(i + 7).padStart(2, "0")}Z`);
  }
  appendUsageEvent(session, "level_started", { levelId: "level-b2" }, "2026-07-01T10:00:15Z");

  const removed = evictLowestValueEvents(session.events, 3);
  assert.ok(removed > 0);
  assert.ok(session.events.some((e) => e.type === "level_started"), "level_started must survive");
  assert.ok(session.events.some((e) => e.type === "tutorial_replayed"), "tutorial_replayed should survive before snapshot/export are gone");
  assert.equal(session.events.filter((e) => e.type === "workspace_snapshot" || e.type === "export_requested" || e.type === "export_completed").length, 0, "snapshot/export tier should be evicted before tutorial_replayed");
});

test("evictLowestValueEvents evicts oldest remaining events only when tiers are exhausted", () => {
  const session = createUsageSession({ sessionId: "b2-fallback" });
  for (let i = 0; i < 3; i++) {
    appendUsageEvent(session, "level_started", { levelId: `level-${i}` }, `2026-07-01T10:00:${String(i).padStart(2, "0")}Z`);
  }

  const removed = evictLowestValueEvents(session.events, 1);
  assert.equal(removed, 2);
  assert.equal(session.events.length, 1);
  assert.equal(session.events[0].type, "level_started");
  assert.equal(session.events[0].data.levelId, "level-2");
});

test("normalizePersistedSession propagates runVersionStoreTruncated from store flags to session flags", () => {
  const session = createUsageSession({ sessionId: "hydrate-flag-session" });
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "huge" }, "x".repeat(100), "2026-07-01T10:00:00Z");
  normalizeRunVersionStore(session.runVersionStore, 50);
  assert.equal(session.runVersionStore.flags.runVersionStoreTruncated, true);

  const normalized = normalizePersistedSession(session);
  assert.equal(normalized.flags.runVersionStoreTruncated, true);
});

// Fixture where FIFO and B2 observably differ.
test("B2 cascade differs from plain FIFO eviction", () => {
  const session = createUsageSession({ sessionId: "b2-vs-fifo" });
  appendUsageEvent(session, "level_completed", { levelId: "level-diff", result: "PASSED" }, "2026-07-01T10:00:00Z");
  for (let i = 0; i < 8; i++) {
    appendUsageEvent(session, "workspace_changed", { levelId: "level-diff" }, `2026-07-01T10:00:${String(i + 1).padStart(2, "0")}Z`);
  }
  appendUsageEvent(session, "tutorial_replayed", { levelId: "level-diff" }, "2026-07-01T10:00:10Z");

  const initialEvents = session.events.length;
  const removed = evictLowestValueEvents(session.events, 2);
  assert.ok(removed > 0);
  assert.ok(session.events.some((e) => e.type === "level_completed"), "oldest high-value event survives B2");
  // Plain FIFO from the front would have removed level_completed first because it is oldest.
  assert.ok(session.events.length < initialEvents, "some events were removed");
});
