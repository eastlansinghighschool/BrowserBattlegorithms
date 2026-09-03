import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  appendUsageEvent,
  addUsageSnapshot,
  createUsageSession
} from "../../src/usage/usageFormat.js";
import { initializeUsageTracking } from "../../src/usage/usageTracker.js";
import { buildCloudEvidencePayload } from "../../src/usage/cloudEvidence.js";
import {
  compareUsageSummaries as compareCli,
  verifyUsageExport
} from "../../src/usage/usageAnalyzer.js";
import {
  compareUsageSummaries as compareBrowser
} from "../../src/usage/usageAnalyzerBrowser.js";
import { getStableKey } from "../../src/usage/cohortAnalysis.js";

// ── R1: Direct-mode byte-identity against committed pre-packet fixture ───────

test("R1: Direct-mode payload is byte-identical to pre-packet captured fixture", async () => {
  const fixturePath = path.resolve("tests/unit/fixtures/usage-v2-export-direct-fixture.json");
  const fixtureJson = fs.readFileSync(fixturePath, "utf8");
  const expectedFixture = JSON.parse(fixtureJson);

  const RealDate = globalThis.Date;
  const realRandomUUID = globalThis.crypto.randomUUID;

  let currentTime = "2026-09-01T11:00:00.000Z";

  class DeterministicDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(currentTime);
      } else {
        super(...args);
      }
    }
    static now() {
      return RealDate.parse(currentTime);
    }
  }

  globalThis.Date = DeterministicDate;
  globalThis.crypto.randomUUID = () => "test-session-r1-byte-identity";

  try {
    const dummyApp = {
      state: {
        currentModeView: "GUIDED_LEVELS",
        currentLevelId: "level-1",
        currentMapKey: "default"
      },
      hooks: {
        getWorkspaceXmlText: () => '<xml><block type="event_on_turn"></block></xml>'
      },
      blocklyWorkspace: {
        getAllBlocks: () => [{ type: "event_on_turn" }, { type: "move_forward" }]
      }
    };

    currentTime = "2026-09-01T11:00:00.000Z";
    const tracker = initializeUsageTracking(dummyApp);
    const session = dummyApp.usageTrackerSessionInternal;
    session.appVersion = "1.0.0-test";

    currentTime = "2026-09-01T11:05:00.000Z";
    tracker.recordLevelStarted({ id: "level-1", levelKind: "tutorial", title: "Level 1" });

    currentTime = "2026-09-01T11:10:00.000Z";
    tracker.recordLevelEnded({ id: "level-1" }, "PASSED", "win_condition_met", { turnNumber: 4 });

    currentTime = "2026-09-01T12:00:00.000Z";
    const result = await tracker.exportUsageFile("Student Gamma");

    assert.ok(result.ok, "exportUsageFile should succeed");
    assert.deepEqual(result.payload, expectedFixture, "Post-packet payload must be byte-identical to pre-packet fixture");
    assert.equal(result.payload.integrity.sha256, expectedFixture.integrity.sha256);
  } finally {
    globalThis.Date = RealDate;
    globalThis.crypto.randomUUID = realRandomUUID;
  }
});

// ── R2: Cloud evidence builder & edge cases ─────────────────────────────────

test("R2: buildCloudEvidencePayload produces schema-v2 payload verified by unmodified verifier", async () => {
  const session = createUsageSession({ sessionId: "cloud-session-1" });
  appendUsageEvent(session, "level_started", { levelId: "level-1" }, "2026-09-01T10:00:00.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "PASSED", turnsSpent: 3 }, "2026-09-01T10:01:00.000Z");

  const eventCountBefore = session.events.length;
  const payload = await buildCloudEvidencePayload({
    session,
    exportedAt: "2026-09-01T10:05:00.000Z"
  });

  assert.equal(payload.schemaVersion, 2);
  assert.equal(payload.studentName, "");
  assert.equal(payload.sessionId, "cloud-session-1");
  assert.ok(payload.integrity);
  assert.equal(payload.integrity.algorithm, "SHA-256");
  assert.equal(typeof payload.integrity.sha256, "string");

  // Verify unmodified verifyUsageExport validates cleanly
  const verification = verifyUsageExport(payload);
  assert.equal(verification.ok, true);
  assert.equal(verification.reason, "verified");
  assert.equal(verification.computedSha256, payload.integrity.sha256);

  // Assert no side-effect events were appended to the session
  assert.equal(session.events.length, eventCountBefore, "Builder must not append export events to the session");
});

test("R2 edge cases: empty session, absent data, whitespace-only names, deeply nested studentName", async () => {
  // Empty session
  const emptySession = createUsageSession({ sessionId: "empty-session" });
  emptySession.events = [];
  const emptyPayload = await buildCloudEvidencePayload({
    session: emptySession,
    exportedAt: "2026-09-01T10:00:00.000Z"
  });
  assert.equal(emptyPayload.events.length, 0);
  assert.equal(verifyUsageExport(emptyPayload).ok, true);

  // Session with absent/non-object data, whitespace name, and deeply nested studentName
  const complexSession = createUsageSession({ sessionId: "complex-edge-session" });
  complexSession.events = [
    { type: "event_no_data", at: "2026-09-01T10:00:00.000Z" },
    { type: "event_null_data", at: "2026-09-01T10:00:01.000Z", data: null },
    { type: "event_primitive_data", at: "2026-09-01T10:00:02.000Z", data: "string-data" },
    { type: "event_whitespace_name", at: "2026-09-01T10:00:03.000Z", data: { studentName: "   ", mode: "guided" } },
    {
      type: "event_deeply_nested",
      at: "2026-09-01T10:00:04.000Z",
      data: {
        layer1: {
          layer2: {
            studentName: "Nested Student",
            legitimateKey: "keep-me"
          }
        },
        arrayData: [
          { studentName: "Array Student", id: 101 }
        ]
      }
    }
  ];

  const payload = await buildCloudEvidencePayload({
    session: complexSession,
    exportedAt: "2026-09-01T10:05:00.000Z"
  });

  assert.equal(payload.studentName, "");
  assert.equal(verifyUsageExport(payload).ok, true);

  // Check event 0: no data
  assert.equal(payload.events[0].data, undefined);
  // Check event 1: null data
  assert.equal(payload.events[1].data, null);
  // Check event 2: string data
  assert.equal(payload.events[2].data, "string-data");
  // Check event 3: whitespace studentName stripped, legitimateKey preserved
  assert.equal(payload.events[3].data.studentName, undefined);
  assert.equal(payload.events[3].data.mode, "guided");
  // Check event 4: deeply nested studentName stripped
  assert.equal(payload.events[4].data.layer1.layer2.studentName, undefined);
  assert.equal(payload.events[4].data.layer1.layer2.legitimateKey, "keep-me");
  assert.equal(payload.events[4].data.arrayData[0].studentName, undefined);
  assert.equal(payload.events[4].data.arrayData[0].id, 101);
});

// ── R3: Whole-payload identity absence ──────────────────────────────────────

test("R3: Sentinel synthetic studentName does not appear anywhere in stringified cloud payload", async () => {
  const SENTINEL = "ZZQX-SENTINEL-NAME";
  const session = createUsageSession({ sessionId: "sentinel-session" });

  // Realistic session with levels and prior export request/completion events
  appendUsageEvent(session, "level_started", { levelId: "level-1" }, "2026-09-01T10:00:00.000Z");
  appendUsageEvent(session, "export_requested", { studentName: SENTINEL, modeView: "GUIDED_LEVELS" }, "2026-09-01T10:01:00.000Z");
  appendUsageEvent(session, "export_completed", { studentName: SENTINEL, filename: "test.json" }, "2026-09-01T10:01:01.000Z");
  appendUsageEvent(session, "level_completed", { levelId: "level-1", result: "PASSED", turnsSpent: 5 }, "2026-09-01T10:02:00.000Z");

  const cloudPayload = await buildCloudEvidencePayload({
    session,
    exportedAt: "2026-09-01T10:05:00.000Z"
  });

  // IMPORTANT: This whole-payload string search is the essential assertion.
  // A field-by-field check would easily miss names embedded in unexpected event data locations
  // (such as finding F6 where studentName was retained in export_requested and export_completed event data).
  // Do NOT simplify or replace this full-payload string search with shallow field checks.
  const serializedCloud = JSON.stringify(cloudPayload);
  assert.ok(
    !serializedCloud.includes(SENTINEL),
    `Sentinel ${SENTINEL} must not appear anywhere in serialized cloud evidence payload`
  );

  // Mirrored negative test: Direct-mode export of the same session DOES contain the sentinel
  const dummyApp = {
    state: { currentModeView: "GUIDED_LEVELS", currentLevelId: "level-1", currentMapKey: "default" },
    hooks: {},
    blocklyWorkspace: {}
  };
  const tracker = initializeUsageTracking(dummyApp);
  dummyApp.usageTrackerSessionInternal = session;
  const directResult = await tracker.exportUsageFile(SENTINEL);
  const serializedDirect = JSON.stringify(directResult.payload);
  assert.ok(
    serializedDirect.includes(SENTINEL),
    `Direct-mode export payload must contain sentinel ${SENTINEL} at top-level and in export events`
  );
});

// ── R4: Analyzer identity parity & blank-name repairs ───────────────────────

test("R4 parity: CLI and Browser compareUsageSummaries produce identical output across diverse inputs", () => {
  const testSets = [
    // Two distinct typed names
    [
      { sessionId: "s1", studentName: "Student Alpha", eventFingerprint: "FP-1" },
      { sessionId: "s2", studentName: "Student Beta", eventFingerprint: "FP-1" }
    ],
    // All blank, distinct filenames
    [
      { sessionId: "s1", studentName: "", fileName: "file-a.json", eventFingerprint: "FP-2" },
      { sessionId: "s2", studentName: "", fileName: "file-b.json", eventFingerprint: "FP-2" }
    ],
    // All blank, identical filenames
    [
      { sessionId: "s1", studentName: "", fileName: "same.json", eventFingerprint: "FP-3" },
      { sessionId: "s2", studentName: "", fileName: "same.json", eventFingerprint: "FP-3" }
    ],
    // All blank, missing filenames (positional index fallback)
    [
      { sessionId: "s1", studentName: "", eventFingerprint: "FP-4" },
      { sessionId: "s2", studentName: "", eventFingerprint: "FP-4" }
    ],
    // Mixed named and blank with filename
    [
      { sessionId: "s1", studentName: "Student Gamma", fileName: "gamma.json", eventFingerprint: "FP-5" },
      { sessionId: "s2", studentName: "", fileName: "anonymous.json", eventFingerprint: "FP-5" }
    ],
    // Same typed name on both (resubmission)
    [
      { sessionId: "s1", studentName: "Student Same", eventFingerprint: "FP-6" },
      { sessionId: "s2", studentName: "Student Same", eventFingerprint: "FP-6" }
    ]
  ];

  for (const set of testSets) {
    const cliOutput = compareCli(set);
    const browserOutput = compareBrowser(set);
    assert.deepEqual(
      cliOutput,
      browserOutput,
      `CLI and Browser compareUsageSummaries must return deep-equal structures for input: ${JSON.stringify(set)}`
    );
  }
});

test("R4: All-blank names, identical fingerprints, distinct filenames: reports separate submissions without name comparison", () => {
  const summaries = [
    { sessionId: "s1", studentName: "", fileName: "submission-alice.json", eventFingerprint: "COMMON-FP" },
    { sessionId: "s2", studentName: "", fileName: "submission-bob.json", eventFingerprint: "COMMON-FP" }
  ];

  const result = compareCli(summaries);
  assert.equal(result.similarSequencesDifferentNames.length, 1);

  const group = result.similarSequencesDifferentNames[0];
  assert.equal(group.distinctSubmitters, true);
  assert.equal(group.submittersDistinguishable, true);
  assert.equal(group.hasDifferentNames, false);
  assert.deepEqual(group.labels, ["submission-alice.json", "submission-bob.json"]);
  assert.equal(
    group.wording,
    "identical attempt sequence and identical captured program states in separate submissions."
  );
  // Ensure "different names" is NOT present
  assert.ok(!group.wording.includes("different names"));
  // Ensure "across distinct submitters" is NOT present (overclaiming rejected by owner)
  assert.ok(!group.wording.includes("across distinct submitters"));
});

test("R4: All-blank names, identical fingerprints, identical filenames: reports indistinguishable submitters wording", () => {
  const summaries = [
    { sessionId: "s1", studentName: "", fileName: "evidence.json", eventFingerprint: "COMMON-FP" },
    { sessionId: "s2", studentName: "", fileName: "evidence.json", eventFingerprint: "COMMON-FP" }
  ];

  const result = compareCli(summaries);
  assert.equal(result.similarSequencesDifferentNames.length, 1);

  const group = result.similarSequencesDifferentNames[0];
  assert.equal(group.distinctSubmitters, false);
  assert.equal(group.submittersDistinguishable, false);
  assert.equal(group.hasDifferentNames, false);
  assert.equal(
    group.wording,
    "identical attempt sequence, submitters not distinguishable from these files."
  );
});

test("R4: Mixed: one named record and one blank with filename: reports named record's name and separate submissions", () => {
  const summaries = [
    { sessionId: "s1", studentName: "Student Alpha", fileName: "alpha.json", eventFingerprint: "COMMON-FP" },
    { sessionId: "s2", studentName: "", fileName: "cloud-record.json", eventFingerprint: "COMMON-FP" }
  ];

  const result = compareCli(summaries);
  assert.equal(result.similarSequencesDifferentNames.length, 1);

  const group = result.similarSequencesDifferentNames[0];
  assert.equal(group.distinctSubmitters, true);
  assert.equal(group.submittersDistinguishable, true);
  assert.equal(group.hasDifferentNames, false);
  assert.deepEqual(group.labels, ["Student Alpha", "cloud-record.json"]);
  assert.equal(
    group.wording,
    "identical attempt sequence and identical captured program states in separate submissions."
  );
});

test("R4: Same typed name on both records is suppressed as resubmission", () => {
  const summaries = [
    { sessionId: "s1", studentName: "Student Alpha", fileName: "attempt-1.json", eventFingerprint: "COMMON-FP" },
    { sessionId: "s2", studentName: "Student Alpha", fileName: "attempt-2.json", eventFingerprint: "COMMON-FP" }
  ];

  const result = compareCli(summaries);
  assert.equal(result.similarSequencesDifferentNames.length, 0, "Same-typed-name pair must be suppressed as resubmission");
});

test("R4: Positional index (submission-N) does NOT qualify as distinct submitters", () => {
  const summaries = [
    { sessionId: "s1", studentName: "", eventFingerprint: "COMMON-FP" },
    { sessionId: "s2", studentName: "", eventFingerprint: "COMMON-FP" }
  ];

  const result = compareCli(summaries);
  assert.equal(result.similarSequencesDifferentNames.length, 1);

  const group = result.similarSequencesDifferentNames[0];
  assert.deepEqual(group.labels, ["submission-1", "submission-2"]);
  assert.equal(group.distinctSubmitters, false, "submission-N must never qualify as distinct submitters");
  assert.equal(group.submittersDistinguishable, false);
  assert.equal(
    group.wording,
    "identical attempt sequence, submitters not distinguishable from these files."
  );
});

test("R4 cohort analysis: getStableKey functions cleanly with blank names", () => {
  const payload = {
    studentName: "",
    sessionId: "sess-abc-123",
    integrity: { sha256: "0123456789abcdef" }
  };
  const key = getStableKey("cloud-export.json", payload);
  assert.equal(key, "cloud-export_01234567_sess-abc");
});
