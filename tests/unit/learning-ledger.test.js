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
  normalizePersistedSession
} from "../../src/usage/usageFormat.js";
import { initializeUsageTracking } from "../../src/usage/usageTracker.js";
import { hashStarterXml, normalizeStarterXmlForHashing } from "../../src/ai/blockly/starterVersioning.js";

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
    historyPartial: false
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

  const session = dummyApp.usageTrackerSessionInternal || dummyApp.usageTrackerSession || null;
  assert.ok(dummyApp.usageTracker);

  // Verify the appended event payload carries the live workspace capture
  const lastCompletedEvent = dummyApp.usageTrackerSession?.events.find(e => e.type === "level_completed");
  assert.ok(lastCompletedEvent);
  assert.equal(lastCompletedEvent.data.blockCount, 2);
  assert.equal(lastCompletedEvent.data.xmlText, "<xml><block type='event_on_turn'></block></xml>");

  const entry = dummyApp.usageTrackerSession?.learningLedger.guided["test-level-live"];
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
    historyPartial: false
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
  // Exceed max cap to trigger FIFO trimming
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
