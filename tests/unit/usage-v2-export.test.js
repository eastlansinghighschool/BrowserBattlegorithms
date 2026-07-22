import test from "node:test";
import assert from "node:assert/strict";
import {
  appendUsageEvent,
  addUsageSnapshot,
  createExportPayload,
  createUsageSession,
  getUsageEventFingerprint,
  normalizePersistedSession,
  transformToPre106Baseline
} from "../../src/usage/usageFormat.js";
import { buildUsageExportWithIntegrity, compareUsageSummaries, summarizeUsagePayload, verifyUsageExport } from "../../src/usage/usageAnalyzer.js";
import { recordRunVersion } from "../../src/usage/runVersionStore.js";

function findXmlTextPropertiesOutsideBoundaryXmls(obj, path = "") {
  const found = [];
  if (!obj || typeof obj !== "object") {
    return found;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (path === "" && key === "boundaryXmls") {
      continue; // Skip boundaryXmls root object
    }
    const currentPath = path ? `${path}.${key}` : key;
    if (key === "xmlText" && value !== null && value !== undefined) {
      found.push({ path: currentPath, value });
    }
    if (value && typeof value === "object") {
      found.push(...findXmlTextPropertiesOutsideBoundaryXmls(value, currentPath));
    }
  }
  return found;
}

test("Repair 1: V2 export strips full xmlText from events and snapshots, keeping xmlText ONLY in boundaryXmls", () => {
  const session = createUsageSession({ sessionId: "session-v2-strip-test" });

  appendUsageEvent(session, "level_opened", { levelId: "level-1" }, "2026-07-22T10:00:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "level-1", xmlText: "<xml>start</xml>", blockCount: 3 }, "2026-07-22T10:00:05.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "PASSED", turnsSpent: 5, xmlText: "<xml>solution</xml>", blockCount: 5 }, "2026-07-22T10:00:15.000Z");

  addUsageSnapshot(session, "editor_snapshot", { levelId: "level-1", xmlText: "<xml>snapshot-code</xml>", blockCounts: { move_forward: 1 } }, "2026-07-22T10:00:10.000Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-1" }, "<xml>solution</xml>", "2026-07-22T10:00:15.000Z");

  const payload = createExportPayload(session, "Student Alpha", "2026-07-22T12:00:00.000Z");

  assert.equal(payload.schemaVersion, 2);
  assert.ok(payload.boundaryXmls["level-1"]);
  assert.equal(payload.boundaryXmls["level-1"][0].xmlText, "<xml>solution</xml>");

  // Assert NO xmlText property exists anywhere outside payload.boundaryXmls
  const leakedXmls = findXmlTextPropertiesOutsideBoundaryXmls(payload);
  assert.deepEqual(leakedXmls, [], `Found leaked xmlText outside boundaryXmls: ${JSON.stringify(leakedXmls)}`);

  // Assert events and snapshots retain xmlHash pointers
  const startEvent = payload.events.find((e) => e.type === "level_started");
  assert.ok(startEvent);
  assert.equal(startEvent.data.xmlText, undefined);
  assert.equal(typeof startEvent.data.xmlHash, "string");

  const snapshot = payload.snapshots[0];
  assert.ok(snapshot);
  assert.equal(snapshot.data.xmlText, undefined);
  assert.equal(typeof snapshot.data.xmlHash, "string");
});

test("Repair 2A: Abandoned and in-progress levels do NOT create boundary XMLs or fabricated results", () => {
  const session = createUsageSession({ sessionId: "session-abandoned" });

  // Open and start level-1, but never complete it (abandoned)
  appendUsageEvent(session, "level_opened", { levelId: "abandoned-level" }, "2026-07-22T10:00:00.000Z");
  appendUsageEvent(session, "level_started", { levelId: "abandoned-level", xmlText: "<xml>abandoned-draft</xml>" }, "2026-07-22T10:00:05.000Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "abandoned-level" }, "<xml>abandoned-draft</xml>", "2026-07-22T10:00:05.000Z");

  const payload = createExportPayload(session, "Abandoned Student");
  assert.equal(payload.boundaryXmls["abandoned-level"], undefined, "Abandoned level must produce NO boundary XML entry");
  assert.equal(payload.learningLedger.guided["abandoned-level"].reached, true);
  assert.equal(payload.learningLedger.guided["abandoned-level"].passed, false);
});

test("Repair 2B: Pass boundary XML selects latest version where v.at <= event.at, not subsequent revisits", () => {
  const session = createUsageSession({ sessionId: "session-revisit" });

  // Pass level-1 at 10:00:15
  appendUsageEvent(session, "level_started", { levelId: "level-1" }, "2026-07-22T10:00:00.000Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-1" }, "<xml>passed-code</xml>", "2026-07-22T10:00:10.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "PASSED" }, "2026-07-22T10:00:15.000Z");

  // Revisit level-1 later at 10:05:00 and edit code without passing
  appendUsageEvent(session, "level_opened", { levelId: "level-1" }, "2026-07-22T10:05:00.000Z");
  recordRunVersion(session.runVersionStore, { type: "guided", levelId: "level-1" }, "<xml>revisit-edited-code</xml>", "2026-07-22T10:05:10.000Z");

  const payload = createExportPayload(session, "Revisit Student");
  assert.ok(payload.boundaryXmls["level-1"]);
  assert.equal(payload.boundaryXmls["level-1"].length, 1);
  // Must match the version at 10:00:10 (at-or-before 10:00:15), NOT the revisit version at 10:05:10
  assert.equal(payload.boundaryXmls["level-1"][0].xmlText, "<xml>passed-code</xml>");
});

test("Repair 2C: Pass boundary event with no version in store or snapshots falls back to hash-only + xmlTextMissing", () => {
  const session = createUsageSession({ sessionId: "session-no-version" });

  appendUsageEvent(session, "level_completed", {
    levelId: "level-1",
    result: "PASSED",
    xmlHash: "a1b2c3d4"
  }, "2026-07-22T10:00:00.000Z");

  const payload = createExportPayload(session, "Missing Version Student");
  assert.ok(payload.boundaryXmls["level-1"]);
  assert.equal(payload.boundaryXmls["level-1"][0].result, "PASSED");
  assert.equal(payload.boundaryXmls["level-1"][0].hash, "a1b2c3d4");
  assert.equal(payload.boundaryXmls["level-1"][0].xmlText, null);
  assert.equal(payload.boundaryXmls["level-1"][0].xmlTextMissing, true);
});

test("Repair 4: boundaryXmlsTruncated flag is set when boundary entries exceed cap K=5", () => {
  const session = createUsageSession({ sessionId: "session-k-cap-flag" });

  for (let i = 1; i <= 8; i++) {
    appendUsageEvent(session, "level_completed", {
      levelId: "capped-level",
      result: i % 2 === 0 ? "PASSED" : "FAILED",
      xmlText: `<xml>run-${i}</xml>`,
      turnsSpent: i
    }, `2026-07-22T10:00:0${i}.000Z`);
  }

  const payload = createExportPayload(session, "Cap Student");
  assert.ok(payload.boundaryXmls["capped-level"]);
  assert.equal(payload.boundaryXmls["capped-level"].length, 5);
  assert.equal(payload.flags.boundaryXmlsTruncated, true);
});

test("SHA-256 integrity hash verifies cleanly for V2 exports", () => {
  const session = createUsageSession({ sessionId: "session-integrity-v2" });
  appendUsageEvent(session, "level_started", { levelId: "level-1" });

  const exportWithIntegrity = buildUsageExportWithIntegrity(session, "Integrity Student");
  assert.equal(exportWithIntegrity.schemaVersion, 2);

  const verification = verifyUsageExport(exportWithIntegrity);
  assert.equal(verification.ok, true);
  assert.equal(verification.reason, "verified");
});

test("transformToPre106Baseline produces pre-Plan 106 baseline shape", () => {
  const session = createUsageSession({ sessionId: "session-baseline" });
  appendUsageEvent(session, "level_started", { levelId: "level-1", xmlText: "<xml>test</xml>", xmlHash: "12345678" });

  const v1Export = createExportPayload(session, "Baseline Student", "2026-07-22T12:00:00.000Z", { schemaVersion: 1 });
  const baseline = transformToPre106Baseline(v1Export);

  assert.equal(baseline.schemaVersion, 1);
  assert.equal(baseline.events[0].data.xmlText, undefined);
  assert.equal(baseline.events[0].data.xmlHash, undefined);
  assert.equal(baseline.learningLedger, undefined);
  assert.equal(baseline.boundaryXmls, undefined);
});

test("Repair 3 FALSIFICATION EXPERIMENT: Fingerprint performance & detector behavior across 3 student pairs and 3 export shapes", () => {
  const codeL1Pass = "<xml><block type='event_on_turn'><next><block type='move_forward'></block></next></block></xml>";
  const codeL2Pass = "<xml><block type='event_on_turn'><next><block type='turn_left'></block></next></block></xml>";
  const codeUniquePass = "<xml><block type='event_on_turn'><next><block type='place_barrier'></block></next></block></xml>";

  // Pair 1: Copied pair (Alice & Bob) - Byte-identical attempt sequences and code
  const sessionAlice = createUsageSession({ sessionId: "alice-108" });
  appendUsageEvent(sessionAlice, "level_started", { levelId: "level-1", xmlText: codeL1Pass }, "2026-07-22T10:00:05.000Z");
  appendUsageEvent(sessionAlice, "level_completed", { levelId: "level-1", result: "PASSED", xmlText: codeL1Pass }, "2026-07-22T10:00:10.000Z");

  const sessionBobCopied = createUsageSession({ sessionId: "bob-108" });
  appendUsageEvent(sessionBobCopied, "level_started", { levelId: "level-1", xmlText: codeL1Pass }, "2026-07-22T10:00:05.000Z");
  appendUsageEvent(sessionBobCopied, "level_completed", { levelId: "level-1", result: "PASSED", xmlText: codeL1Pass }, "2026-07-22T10:00:10.000Z");

  // Pair 2: Partially-shared pair (Alice & Dan) - Identical level-1, distinct level-2
  const sessionDanPartial = createUsageSession({ sessionId: "dan-108" });
  appendUsageEvent(sessionDanPartial, "level_started", { levelId: "level-1", xmlText: codeL1Pass }, "2026-07-22T10:00:05.000Z");
  appendUsageEvent(sessionDanPartial, "level_completed", { levelId: "level-1", result: "PASSED", xmlText: codeL1Pass }, "2026-07-22T10:00:10.000Z");
  appendUsageEvent(sessionDanPartial, "level_started", { levelId: "level-2", xmlText: codeUniquePass }, "2026-07-22T10:01:05.000Z");
  appendUsageEvent(sessionDanPartial, "level_completed", { levelId: "level-2", result: "PASSED", xmlText: codeUniquePass }, "2026-07-22T10:01:10.000Z");

  // Pair 3: Discriminating pair (Alice & Eve) - Same final boundary program code, DIFFERENT attempt history
  // Eve fails twice before passing level-1 with the same code
  const sessionEveDiffAttempts = createUsageSession({ sessionId: "eve-108" });
  appendUsageEvent(sessionEveDiffAttempts, "level_started", { levelId: "level-1", xmlText: "<xml>draft-fail-1</xml>" }, "2026-07-22T10:00:01.000Z");
  appendUsageEvent(sessionEveDiffAttempts, "level_completed", { levelId: "level-1", result: "FAILED", xmlText: "<xml>draft-fail-1</xml>" }, "2026-07-22T10:00:05.000Z");
  appendUsageEvent(sessionEveDiffAttempts, "level_started", { levelId: "level-1", xmlText: "<xml>draft-fail-2</xml>" }, "2026-07-22T10:00:06.000Z");
  appendUsageEvent(sessionEveDiffAttempts, "level_completed", { levelId: "level-1", result: "FAILED", xmlText: "<xml>draft-fail-2</xml>" }, "2026-07-22T10:00:10.000Z");
  appendUsageEvent(sessionEveDiffAttempts, "level_started", { levelId: "level-1", xmlText: codeL1Pass }, "2026-07-22T10:00:11.000Z");
  appendUsageEvent(sessionEveDiffAttempts, "level_completed", { levelId: "level-1", result: "PASSED", xmlText: codeL1Pass }, "2026-07-22T10:00:15.000Z");

  // Export all sessions in V2, V1, and Pre-106 shapes
  const exportAliceV2 = buildUsageExportWithIntegrity(sessionAlice, "Alice");
  const exportBobV2 = buildUsageExportWithIntegrity(sessionBobCopied, "Bob");
  const exportDanV2 = buildUsageExportWithIntegrity(sessionDanPartial, "Dan");
  const exportEveV2 = buildUsageExportWithIntegrity(sessionEveDiffAttempts, "Eve");

  const exportAliceV1 = createExportPayload(sessionAlice, "Alice", undefined, { schemaVersion: 1 });
  const exportBobV1 = createExportPayload(sessionBobCopied, "Bob", undefined, { schemaVersion: 1 });
  const exportDanV1 = createExportPayload(sessionDanPartial, "Dan", undefined, { schemaVersion: 1 });
  const exportEveV1 = createExportPayload(sessionEveDiffAttempts, "Eve", undefined, { schemaVersion: 1 });

  const exportAliceBase = transformToPre106Baseline(exportAliceV1);
  const exportBobBase = transformToPre106Baseline(exportBobV1);

  // 1. Pair 1 (Alice & Bob): Identical attempt sequence
  const compV2Pair1 = compareUsageSummaries([summarizeUsagePayload(exportAliceV2), summarizeUsagePayload(exportBobV2)]);
  const compV1Pair1 = compareUsageSummaries([summarizeUsagePayload(exportAliceV1), summarizeUsagePayload(exportBobV1)]);
  const compBasePair1 = compareUsageSummaries([summarizeUsagePayload(exportAliceBase), summarizeUsagePayload(exportBobBase)]);

  assert.equal(compV2Pair1.similarSequencesDifferentNames.length, 1, "V2 flags copied attempt sequence");
  assert.equal(compV1Pair1.similarSequencesDifferentNames.length, 1, "V1 flags copied attempt sequence");
  assert.equal(compBasePair1.similarSequencesDifferentNames.length, 1, "Pre-106 flags copied attempt sequence");

  // 2. Pair 2 (Alice & Dan): Partially-shared sequence (differ on level-2)
  const compV2Pair2 = compareUsageSummaries([summarizeUsagePayload(exportAliceV2), summarizeUsagePayload(exportDanV2)]);
  assert.equal(compV2Pair2.similarSequencesDifferentNames.length, 0, "Partial sequence divergence is NOT flagged as identical full sequence");

  // 3. Pair 3 (Alice & Eve): Same final code, DIFFERENT attempt history
  // Demonstrates pre-existing detector limitation: current detector keys on event-sequence fingerprints,
  // NOT final boundary XML text. Eve's extra failed attempts change her event fingerprint, so the detector does not flag Alice & Eve.
  const compV2Pair3 = compareUsageSummaries([summarizeUsagePayload(exportAliceV2), summarizeUsagePayload(exportEveV2)]);
  assert.equal(compV2Pair3.similarSequencesDifferentNames.length, 0, "Pre-existing detector limitation confirmed: different attempt histories produce distinct fingerprints despite identical final code");
});
