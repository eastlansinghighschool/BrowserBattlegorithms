import test from "node:test";
import assert from "node:assert/strict";
import {
  appendUsageEvent,
  createExportPayload,
  createUsageSession
} from "../../src/usage/usageFormat.js";
import {
  buildUsageExportWithIntegrity,
  summarizeUsagePayload,
  verifyUsageExport
} from "../../src/usage/usageAnalyzer.js";
import {
  summarizeUsagePayloadAsync,
  verifyUsageExportAsync
} from "../../src/usage/usageAnalyzerBrowser.js";
import {
  createGuidedLevelRollupEntry,
  createLearningLedger
} from "../../src/usage/learningLedger.js";

test("V1 export golden analysis behavior remains unchanged", () => {
  const session = createUsageSession({
    sessionId: "session-v1-golden",
    startedAt: "2026-05-13T10:00:00.000Z",
    updatedAt: "2026-05-13T10:10:00.000Z"
  });
  appendUsageEvent(session, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "move-to-target", mapKey: "wideAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(session, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");

  const v1Export = createExportPayload(session, "Ada Lovelace", "2026-05-13T10:10:00.000Z", { schemaVersion: 1 });
  const hash = verifyUsageExport(v1Export);
  const stampedV1 = { ...v1Export, integrity: { algorithm: "SHA-256", sha256: hash.computedSha256 } };

  const summary = summarizeUsagePayload(stampedV1);
  assert.equal(summary.schemaVersion, 1);
  assert.equal(summary.hashStatus, "verified hash");
  assert.equal(summary.guided.passed, 1);
  assert.equal(summary.guidedProgress.highestPassed.levelId, "move-to-target");
});

test("V2 export ledger-first analysis reads from durable learning ledger when event tail is empty/truncated", async () => {
  const session = createUsageSession({
    sessionId: "session-v2-ledger-first",
    startedAt: "2026-05-13T10:00:00.000Z",
    updatedAt: "2026-05-13T10:10:00.000Z"
  });

  // Manually populate durable ledger as if events were trimmed
  session.learningLedger.guided["move-to-target"] = createGuidedLevelRollupEntry("move-to-target", {
    reached: true,
    startedCount: 1,
    completedCount: 1,
    passedCount: 1,
    passed: true,
    turnsSpent: 3,
    durationMs: 5000,
    firstActivityAt: "2026-05-13T10:00:01.000Z",
    lastActivityAt: "2026-05-13T10:01:00.000Z",
    lastResult: "PASSED"
  });
  session.learningLedger.guided["enemy-nearby"] = createGuidedLevelRollupEntry("enemy-nearby", {
    reached: true,
    startedCount: 2,
    completedCount: 2,
    passedCount: 1,
    failedCount: 1,
    passed: true,
    turnsSpent: 7,
    durationMs: 12000,
    firstActivityAt: "2026-05-13T10:02:00.000Z",
    lastActivityAt: "2026-05-13T10:05:00.000Z",
    lastResult: "PASSED"
  });
  session.learningLedger.passLedger = ["move-to-target", "enemy-nearby"];
  session.flags.eventTailTruncated = true;
  session.flags.historyPartial = true;

  // Clear events array to simulate extreme event tail eviction
  session.events = [];

  const v2Export = buildUsageExportWithIntegrity(session, "Grace Hopper", "2026-05-13T10:10:00.000Z");

  const cliSummary = summarizeUsagePayload(v2Export);
  const browserSummary = await summarizeUsagePayloadAsync(v2Export);

  assert.equal(cliSummary.schemaVersion, 2);
  assert.equal(cliSummary.guided.passed, 2);
  assert.equal(cliSummary.guidedProgress.highestPassed.levelId, "enemy-nearby");
  assert.ok(cliSummary.reviewSignals.some((s) => s.type === "event_tail_truncated"));
  assert.ok(cliSummary.reviewSignals.some((s) => s.type === "history_partial"));

  // CLI and Browser parity check
  assert.deepEqual(browserSummary.guidedProgress, cliSummary.guidedProgress);
  assert.equal(browserSummary.schemaVersion, cliSummary.schemaVersion);
  assert.equal(browserSummary.hashStatus, cliSummary.hashStatus);
});

test("CLI and Browser analyzers maintain parity on V2 export payloads", async () => {
  const session = createUsageSession({
    sessionId: "session-v2-parity",
    startedAt: "2026-05-13T10:00:00.000Z",
    updatedAt: "2026-05-13T10:15:00.000Z"
  });
  appendUsageEvent(session, "level_started", { levelId: "move-to-target", levelKind: "guided" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", turnsSpent: 4 }, "2026-05-13T10:02:00.000Z");
  const payload = buildUsageExportWithIntegrity(session, "Katherine Johnson", "2026-05-13T10:15:00.000Z");

  const cliSummary = summarizeUsagePayload(payload);
  const browserSummary = await summarizeUsagePayloadAsync(payload);

  assert.deepEqual(browserSummary.guidedProgress, cliSummary.guidedProgress);
  assert.equal(browserSummary.guided.passed, cliSummary.guided.passed);
  assert.equal(browserSummary.schemaVersion, 2);
  assert.equal(cliSummary.schemaVersion, 2);
});

test("sub-second duration displays '—' instead of '<1s approx'", () => {
  const session = createUsageSession({ sessionId: "session-subsecond" });
  session.learningLedger.guided["move-to-target"] = createGuidedLevelRollupEntry("move-to-target", {
    reached: true,
    startedCount: 1,
    durationMs: 300 // sub-second duration (< 1000 ms)
  });
  const payload = createExportPayload(session, "SubSecond Student", new Date().toISOString());
  const summary = summarizeUsagePayload(payload);
  const entry = summary.guidedProgress.guidedLevelProgress.find((e) => e.levelId === "move-to-target");
  assert.ok(entry);
  assert.equal(entry.approximateDurationLabel, "—");
});

test("ledger_event_mismatch is suppressed for carried-over sessions but fires otherwise", () => {
  // Plan 107 rollover carries durable tiers across sessions while events stay
  // per-session, so ledger counts legitimately exceed event counts. The
  // mismatch signal must not false-positive on those sessions.
  const carriedSession = createUsageSession({ sessionId: "session-carried" });
  carriedSession.learningLedger.guided["move-to-target"] = createGuidedLevelRollupEntry("move-to-target", {
    reached: true,
    startedCount: 3,
    completedCount: 3,
    passedCount: 3,
    passed: true,
    lastResult: "PASSED"
  });
  carriedSession.flags.durableTiersCarriedFrom = "prior-session-id";
  carriedSession.events = [
    { id: "session-carried:1", type: "level_completed", at: new Date().toISOString(), data: { levelId: "move-to-target", result: "PASSED" } }
  ];
  const carriedSummary = summarizeUsagePayload(createExportPayload(carriedSession, "Carried Student", new Date().toISOString()));
  assert.ok(!carriedSummary.reviewSignals.some((s) => s.type === "ledger_event_mismatch"));

  const plainSession = createUsageSession({ sessionId: "session-plain" });
  plainSession.learningLedger.guided["move-to-target"] = createGuidedLevelRollupEntry("move-to-target", {
    reached: true,
    startedCount: 3,
    completedCount: 3,
    passedCount: 3,
    passed: true,
    lastResult: "PASSED"
  });
  plainSession.events = [
    { id: "session-plain:1", type: "level_completed", at: new Date().toISOString(), data: { levelId: "move-to-target", result: "PASSED" } }
  ];
  const plainSummary = summarizeUsagePayload(createExportPayload(plainSession, "Plain Student", new Date().toISOString()));
  assert.ok(plainSummary.reviewSignals.some((s) => s.type === "ledger_event_mismatch"));
});
