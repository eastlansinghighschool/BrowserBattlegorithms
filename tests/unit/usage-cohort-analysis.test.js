import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { isCohortPathSafe } from "../../src/usage/cohortPrivacyPaths.js";
import {
  anonymizeExports,
  buildAttemptsForExport,
  generateCohortTables,
  getMedian,
  getStableKey,
  buildBaselineReport
} from "../../src/usage/cohortAnalysis.js";

const fakeProjectRoot = resolve("/fake/root");

test("path guard rejects paths outside local/usage-cohorts/", () => {
  // Safe paths
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-a/raw-exports/file.json", fakeProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-a/anonymized/tables.json", fakeProjectRoot), true);

  // Unsafe paths
  assert.equal(isCohortPathSafe("reports/development/leak.json", fakeProjectRoot), false);
  assert.equal(isCohortPathSafe("local/usage-cohorts/../../reports/leak.json", fakeProjectRoot), false);
  assert.equal(isCohortPathSafe("src/usage/cohortAnalysis.js", fakeProjectRoot), false);
});

test("anonymized ids are stable when new exports are added", () => {
  const rawExports = [
    {
      fileName: "student_a_export.json",
      payload: {
        studentName: "Student A",
        sessionId: "session-111",
        exportedAt: "2026-05-13T10:00:00Z",
        integrity: { sha256: "hash11111111111111111" }
      }
    },
    {
      fileName: "student_b_export.json",
      payload: {
        studentName: "Student B",
        sessionId: "session-222",
        exportedAt: "2026-05-13T10:05:00Z",
        integrity: { sha256: "hash22222222222222222" }
      }
    }
  ];

  const firstRun = anonymizeExports(rawExports);
  assert.equal(firstRun.processed[0].exportId, "export-001");
  assert.equal(firstRun.processed[1].exportId, "export-002");

  // Rerun with an extra export at the front
  const rawExportsExtended = [
    {
      fileName: "student_c_export.json",
      payload: {
        studentName: "Student C",
        sessionId: "session-333",
        exportedAt: "2026-05-13T10:10:00Z",
        integrity: { sha256: "hash33333333333333333" }
      }
    },
    ...rawExports
  ];

  const secondRun = anonymizeExports(rawExportsExtended, firstRun.identityMap);

  // The newly added export (student_c) is assigned next available ID (export-003)
  assert.equal(secondRun.processed[0].exportId, "export-003");
  // Student A and B retain export-001 and export-002 stably!
  assert.equal(secondRun.processed[1].exportId, "export-001");
  assert.equal(secondRun.processed[2].exportId, "export-002");
});

test("anonymized outputs contain no studentName or raw sessionId", () => {
  const processed = [
    {
      exportId: "export-001",
      fileLabel: "file_001.json",
      payload: {
        studentName: "Student A",
        sessionId: "session-12345",
        exportedAt: "2026-05-13T10:00:00Z",
        integrity: { sha256: "1234567890abcdef" },
        events: [
          {
            type: "level_started",
            at: "2026-05-13T10:00:02Z",
            data: { levelId: "move-to-target", modeView: "GUIDED_LEVELS" }
          }
        ]
      }
    }
  ];

  const tables = generateCohortTables(processed);

  // Verify exports table has no studentName/sessionId
  assert.equal(tables.exports[0].studentName, undefined);
  assert.equal(tables.exports[0].sessionId, undefined);

  // Verify events table has no studentName/sessionId
  assert.equal(tables.events[0].studentName, undefined);
  assert.equal(tables.events[0].sessionId, undefined);

  // Verify guided_attempts table has no studentName/sessionId
  assert.equal(tables.guided_attempts[0].studentName, undefined);
  assert.equal(tables.guided_attempts[0].sessionId, undefined);

  // Verify export_progress table has no studentName/sessionId
  assert.equal(tables.export_progress[0].studentName, undefined);
  assert.equal(tables.export_progress[0].sessionId, undefined);
});

test("attempt parsing handles start, complete, interrupt, boundary, and session_end correctly", () => {
  const catalog = [
    { levelId: "level-1", orderIndex: 0, title: "L1" },
    { levelId: "level-2", orderIndex: 1, title: "L2" }
  ];

  const events = [
    // Attempt 1 for level-1 (completed PASSED)
    { type: "level_started", at: "2026-05-13T10:00:00Z", data: { levelId: "level-1" } },
    { type: "level_completed", at: "2026-05-13T10:01:00Z", data: { levelId: "level-1", result: "PASSED", turnsSpent: 4 } },

    // Attempt 2 for level-1 (interrupted by level-2 start)
    { type: "level_started", at: "2026-05-13T10:02:00Z", data: { levelId: "level-1" } },

    // Attempt 1 for level-2 (completed FAILED)
    { type: "level_started", at: "2026-05-13T10:03:00Z", data: { levelId: "level-2" } },
    { type: "level_completed", at: "2026-05-13T10:04:00Z", data: { levelId: "level-2", result: "FAILED", turnsSpent: 8 } },

    // Attempt 2 for level-2 (interrupted by boundary event)
    { type: "level_started", at: "2026-05-13T10:05:00Z", data: { levelId: "level-2" } },
    { type: "workspace_exported", at: "2026-05-13T10:06:00Z", data: {} },

    // Attempt 3 for level-2 (ends with session end)
    { type: "level_started", at: "2026-05-13T10:07:00Z", data: { levelId: "level-2" } }
  ];

  const attempts = buildAttemptsForExport("export-001", events, catalog);

  assert.equal(attempts.length, 5);

  // Attempt 1
  assert.equal(attempts[0].levelId, "level-1");
  assert.equal(attempts[0].attemptNumber, 1);
  assert.equal(attempts[0].result, "PASSED");
  assert.equal(attempts[0].turns, 4);
  assert.equal(attempts[0].durationMs, 60000);

  // Attempt 2
  assert.equal(attempts[1].levelId, "level-1");
  assert.equal(attempts[1].attemptNumber, 2);
  assert.equal(attempts[1].result, "interrupted");
  assert.equal(attempts[1].turns, 0);
  assert.equal(attempts[1].durationMs, 60000); // 10:02:00 to 10:03:00

  // Attempt 3
  assert.equal(attempts[2].levelId, "level-2");
  assert.equal(attempts[2].attemptNumber, 1);
  assert.equal(attempts[2].result, "FAILED");
  assert.equal(attempts[2].turns, 8);
  assert.equal(attempts[2].durationMs, 60000);

  // Attempt 4
  assert.equal(attempts[3].levelId, "level-2");
  assert.equal(attempts[3].attemptNumber, 2);
  assert.equal(attempts[3].result, "boundary");
  assert.equal(attempts[3].turns, 0);
  assert.equal(attempts[3].durationMs, 60000);

  // Attempt 5
  assert.equal(attempts[4].levelId, "level-2");
  assert.equal(attempts[4].attemptNumber, 3);
  assert.equal(attempts[4].result, "session_end");
  assert.equal(attempts[4].turns, 0);
  assert.equal(attempts[4].durationMs, 0); // last event is start itself
});

test("getMedian correctly computes median values", () => {
  assert.equal(getMedian([]), null);
  assert.equal(getMedian([5]), 5);
  assert.equal(getMedian([1, 10, 4]), 4); // sorted: [1, 4, 10], mid is 4
  assert.equal(getMedian([10, 20, 30, 40]), 25); // sorted: [10, 20, 30, 40], mid is (20 + 30) / 2
});

test("buildBaselineReport accurately formats and counts file stats and caveats", () => {
  const fileStats = {
    totalFiles: 5,
    validFiles: 4,
    invalidFiles: 1
  };
  const tables = {
    exports: [
      { hashStatus: "verified hash", needsReview: 0, reviewFlags: null },
      { hashStatus: "hash mismatch", needsReview: 1, reviewFlags: "integrity_mismatch" },
      { hashStatus: "verified hash", needsReview: 0, reviewFlags: null },
      { hashStatus: "verified hash", needsReview: 0, reviewFlags: null }
    ],
    class_level_rollup: [
      { levelId: "move-to-target", levelTitle: "Move to target", levelOrder: 1, reachedCount: 4, passCount: 4, medianAttemptsToFirstPass: 1, medianTurnsOnPassedAttempts: 3, revisitCount: 0 }
    ]
  };

  const report = buildBaselineReport("test-cohort", fileStats, tables);

  assert.ok(report.includes("Total JSON Files Discovered**: 5"));
  assert.ok(report.includes("Valid Student Exports Processed**: 4"));
  assert.ok(report.includes("Invalid JSON Files (Omitted)**: 1"));
  assert.ok(report.includes("Data Integrity Warning"));
  assert.ok(report.includes("Single-Human Multi-Export Limitation"));
});

test("suspicious signals are merged into exports and progress review flags", () => {
  const processed = [
    {
      exportId: "export-001",
      fileLabel: "file_001.json",
      payload: {
        studentName: "Student A",
        sessionId: "session-123",
        exportedAt: "2026-05-13T10:00:00Z",
        integrity: { sha256: "mismatched-hash" },
        events: []
      }
    }
  ];

  const tables = generateCohortTables(processed);

  assert.equal(tables.exports[0].needsReview, 1);
  assert.ok(tables.exports[0].reviewFlags.includes("integrity_mismatch"));

  assert.equal(tables.export_progress[0].needsReview, 1);
  assert.ok(tables.export_progress[0].reviewFlags.includes("integrity_mismatch"));
});

test("highestReached and highestPassed milestones do not regress on backtracking", () => {
  const processed = [
    {
      exportId: "export-001",
      fileLabel: "file_001.json",
      payload: {
        studentName: "Student A",
        sessionId: "session-123",
        exportedAt: "2026-05-13T10:10:00Z",
        integrity: { sha256: "12345" },
        events: [
          { type: "level_started", at: "2026-05-13T10:00:00Z", data: { levelId: "move-to-target" } },
          { type: "level_completed", at: "2026-05-13T10:01:00Z", data: { levelId: "move-to-target", result: "PASSED" } },
          { type: "level_started", at: "2026-05-13T10:02:00Z", data: { levelId: "reach-enemy-flag" } },
          { type: "level_completed", at: "2026-05-13T10:03:00Z", data: { levelId: "reach-enemy-flag", result: "PASSED" } },
          // backtrack
          { type: "level_started", at: "2026-05-13T10:04:00Z", data: { levelId: "move-to-target" } }
        ]
      }
    }
  ];

  const tables = generateCohortTables(processed);
  const prog = tables.export_progress[0];

  assert.equal(prog.highestReachedId, "reach-enemy-flag");
  assert.equal(prog.highestPassedId, "reach-enemy-flag");
});
