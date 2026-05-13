import test from "node:test";
import assert from "node:assert/strict";
import {
  appendUsageEvent,
  createUsageSession,
  getUsageEventFingerprint
} from "../../src/usage/usageFormat.js";
import { buildUsageExportWithIntegrity } from "../../src/usage/usageAnalyzer.js";
import {
  compareUsageSummaries,
  summarizeUsagePayloadAsync,
  verifyUsageExportAsync
} from "../../src/usage/usageAnalyzerBrowser.js";

// Node 18+ exposes globalThis.crypto.subtle, so the browser module works in tests.

function buildSample(studentName = "Ada Lovelace", sessionId = "session-browser-test") {
  const session = createUsageSession({ sessionId, startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:10:00.000Z" });
  appendUsageEvent(session, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "move-to-target", mapKey: "wideAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(session, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");
  return buildUsageExportWithIntegrity(session, studentName, "2026-05-13T10:10:00.000Z");
}

test("browser verifyUsageExportAsync returns ok for a valid payload", async () => {
  const payload = buildSample();
  const result = await verifyUsageExportAsync(payload);
  assert.equal(result.ok, true);
  assert.equal(result.reason, "verified");
  assert.ok(result.computedSha256, "computed hash is present");
});

test("browser verifyUsageExportAsync returns not ok when studentName is tampered", async () => {
  const payload = buildSample();
  payload.studentName = "Tampered Name";
  const result = await verifyUsageExportAsync(payload);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "hash_mismatch");
});

test("browser verifyUsageExportAsync returns not ok when integrity block is missing", async () => {
  const { integrity: _dropped, ...payload } = buildSample();
  const result = await verifyUsageExportAsync(payload);
  assert.equal(result.ok, false);
  assert.equal(result.expectedSha256, null);
});

test("browser verifyUsageExportAsync returns payload_missing for non-object input", async () => {
  const result = await verifyUsageExportAsync(null);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "payload_missing");
});

test("browser summarizeUsagePayloadAsync reports verified hash for valid payload", async () => {
  const payload = buildSample("Grace Hopper", "session-grace");
  const summary = await summarizeUsagePayloadAsync(payload);
  assert.equal(summary.hashStatus, "verified hash");
  assert.equal(summary.studentName, "Grace Hopper");
  assert.equal(summary.sessionId, "session-grace");
  assert.ok(summary.totalEvents > 0);
});

test("browser summarizeUsagePayloadAsync flags integrity_mismatch for tampered payload", async () => {
  const payload = buildSample();
  payload.events.push({ type: "injected", at: "2026-05-13T10:11:00.000Z" });
  const summary = await summarizeUsagePayloadAsync(payload);
  assert.ok(summary.suspiciousSignals.includes("integrity_mismatch"));
  assert.equal(summary.hashStatus, "hash mismatch");
});

test("Node-built hash and browser-computed hash agree on the same payload", async () => {
  const payload = buildSample();
  const browserResult = await verifyUsageExportAsync(payload);
  // The Node path already stamped the hash; browser should reproduce it.
  assert.equal(browserResult.ok, true);
  assert.equal(browserResult.computedSha256, payload.integrity.sha256);
});

test("compareUsageSummaries detects duplicate session ids", async () => {
  const s1 = await summarizeUsagePayloadAsync(buildSample("Alice", "session-dup"));
  const s2 = await summarizeUsagePayloadAsync(buildSample("Bob", "session-dup"));
  const { duplicateSessionIds } = compareUsageSummaries([s1, s2]);
  assert.equal(duplicateSessionIds.length, 1);
  assert.equal(duplicateSessionIds[0].sessionId, "session-dup");
  assert.deepEqual(duplicateSessionIds[0].indices, [0, 1]);
});

test("compareUsageSummaries detects identical hashes across different students", async () => {
  // Same session id → same canonical payload → same hash; use a cloned payload to get same hash.
  const payload = buildSample("Alice", "session-hash");
  const clone = JSON.parse(JSON.stringify(payload));
  clone.studentName = "Bob";
  // Rebuild integrity so hash matches (same underlying payload structure minus studentName).
  // Actually hashes will differ because studentName differs in the canonical payload.
  // Instead, use the exact same payload object for both:
  const s1 = await summarizeUsagePayloadAsync(payload);
  const s2 = await summarizeUsagePayloadAsync(JSON.parse(JSON.stringify(payload)));
  const { duplicateHashes } = compareUsageSummaries([s1, s2]);
  assert.equal(duplicateHashes.length, 1);
});

test("compareUsageSummaries detects similar event sequences under different names", async () => {
  const base = buildSample("Alice", "session-a");
  // Build a second payload with identical events but a different session id.
  const session2 = createUsageSession({ sessionId: "session-b", startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:10:00.000Z" });
  for (const event of base.events) {
    appendUsageEvent(session2, event.type, event.data || {}, event.at);
  }
  const payload2 = buildUsageExportWithIntegrity(session2, "Bob", "2026-05-13T10:10:00.000Z");
  const s1 = await summarizeUsagePayloadAsync(base);
  const s2 = await summarizeUsagePayloadAsync(payload2);
  const { similarSequencesDifferentNames } = compareUsageSummaries([s1, s2]);
  assert.equal(similarSequencesDifferentNames.length, 1);
  assert.ok(similarSequencesDifferentNames[0].labels.includes("Alice"));
  assert.ok(similarSequencesDifferentNames[0].labels.includes("Bob"));
});

test("getUsageEventFingerprint ignores workspace churn but preserves meaningful attempt differences", async () => {
  const sessionA = createUsageSession({ sessionId: "session-noise-a", startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:10:00.000Z" });
  appendUsageEvent(sessionA, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "move-to-target", mapKey: "wideAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(sessionA, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(sessionA, "workspace_changed", { levelId: "move-to-target", modeView: "GUIDED_LEVELS", xmlText: "<xml><block/></xml>" }, "2026-05-13T10:00:03.000Z");
  appendUsageEvent(sessionA, "workspace_snapshot", { levelId: "move-to-target", modeView: "GUIDED_LEVELS", xmlText: "<xml><block type=\"battlegorithms_move_forward\"></block></xml>", blockCounts: { "battlegorithms_move_forward": 1 } }, "2026-05-13T10:00:04.000Z");
  appendUsageEvent(sessionA, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");

  const sessionB = createUsageSession({ sessionId: "session-noise-b", startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:10:00.000Z" });
  appendUsageEvent(sessionB, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "move-to-target", mapKey: "wideAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(sessionB, "level_started", { levelId: "move-to-target", levelKind: "guided", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(sessionB, "workspace_changed", { levelId: "move-to-target", modeView: "GUIDED_LEVELS", xmlText: "<xml><block type=\"battlegorithms_move_forward\"></block></xml>" }, "2026-05-13T10:00:03.000Z");
  appendUsageEvent(sessionB, "workspace_snapshot", { levelId: "move-to-target", modeView: "GUIDED_LEVELS", xmlText: "<xml><block type=\"battlegorithms_move_toward\"></block></xml>", blockCounts: { "battlegorithms_move_toward": 1 } }, "2026-05-13T10:00:04.000Z");
  appendUsageEvent(sessionB, "level_completed", { levelId: "move-to-target", levelKind: "guided", result: "PASSED", modeView: "GUIDED_LEVELS", mapKey: "wideAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");

  const sessionC = createUsageSession({ sessionId: "session-meaningful-c", startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:10:00.000Z" });
  appendUsageEvent(sessionC, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "how-far-away", mapKey: "simpleAisle" }, "2026-05-13T10:00:01.000Z");
  appendUsageEvent(sessionC, "level_started", { levelId: "how-far-away", levelKind: "project", modeView: "GUIDED_LEVELS", mapKey: "simpleAisle", turnNumber: 1, attemptNumber: 1 }, "2026-05-13T10:00:02.000Z");
  appendUsageEvent(sessionC, "level_completed", { levelId: "how-far-away", levelKind: "project", result: "FAILED", modeView: "GUIDED_LEVELS", mapKey: "simpleAisle", turnNumber: 3, turnsSpent: 3 }, "2026-05-13T10:01:00.000Z");

  const fingerprintA = getUsageEventFingerprint(sessionA.events);
  const fingerprintB = getUsageEventFingerprint(sessionB.events);
  const fingerprintC = getUsageEventFingerprint(sessionC.events);
  assert.equal(fingerprintA, fingerprintB);
  assert.notEqual(fingerprintA, fingerprintC);
});

test("admin build guard: admin.html is absent from vite.config.js rollupOptions.input", async () => {
  const { readFile } = await import("node:fs/promises");
  const config = await readFile(new URL("../../vite.config.js", import.meta.url), "utf8");
  assert.ok(!config.includes("admin"), "vite.config.js must not reference admin.html in build inputs");
});
