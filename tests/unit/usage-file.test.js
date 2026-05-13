import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  appendUsageEvent,
  canonicalJsonStringify,
  createUsageSession
} from "../../src/usage/usageFormat.js";
import {
  buildUsageExportWithIntegrity,
  compareUsageSummaries,
  summarizeUsagePayload,
  verifyUsageExport
} from "../../src/usage/usageAnalyzer.js";

const execFileAsync = promisify(execFile);

function buildSampleExport(studentName = "Ada Lovelace", sessionId = "session-a") {
  const session = createUsageSession({ sessionId, startedAt: "2026-05-12T12:00:00.000Z", updatedAt: "2026-05-12T12:15:00.000Z" });
  appendUsageEvent(session, "mode_entered", { modeView: "GUIDED_LEVELS", levelId: "score-a-point", mapKey: "wideAisle" }, "2026-05-12T12:00:01.000Z");
  appendUsageEvent(session, "level_started", {
    levelId: "challenge-level",
    levelKind: "challenge",
    modeView: "GUIDED_LEVELS",
    mapKey: "wideAisle",
    turnNumber: 1,
    attemptNumber: 1
  }, "2026-05-12T12:00:05.000Z");
  appendUsageEvent(session, "turn_action_completed", {
    runnerId: "runner_1_AI_AllyP1",
    actionType: "MOVE_FORWARD",
    turnNumber: 2,
    modeView: "GUIDED_LEVELS",
    levelId: "challenge-level"
  }, "2026-05-12T12:00:06.000Z");
  appendUsageEvent(session, "score_point", {
    runnerId: "runner_1_AI_AllyP1",
    teamId: 1,
    teamScores: { 1: 1, 2: 0 },
    modeView: "GUIDED_LEVELS",
    turnNumber: 9
  }, "2026-05-12T12:10:00.000Z");
  appendUsageEvent(session, "level_completed", {
    levelId: "challenge-level",
    levelKind: "challenge",
    result: "PASSED",
    reason: "win_condition_met",
    modeView: "GUIDED_LEVELS",
    mapKey: "wideAisle",
    turnNumber: 9,
    turnsSpent: 9
  }, "2026-05-12T12:10:01.000Z");
  return buildUsageExportWithIntegrity(session, studentName, "2026-05-12T12:12:00.000Z");
}

test("canonical JSON sorts object keys deterministically", () => {
  const canonical = canonicalJsonStringify({ b: 1, a: { d: 2, c: 3 } });
  assert.equal(canonical, '{"a":{"c":3,"d":2},"b":1}');
});

test("summary generation captures guided completion and performance signals", () => {
  const payload = buildSampleExport();
  const summary = summarizeUsagePayload(payload);

  assert.equal(summary.studentName, "Ada Lovelace");
  assert.equal(summary.guided.completed, 1);
  assert.equal(summary.guided.passed, 1);
  assert.equal(summary.challengeSummary, "challenge=1");
  assert.equal(summary.hashStatus, "verified hash");
  assert.equal(summary.playTimeMinutes, 12);
  assert.ok(summary.eventFingerprint.length > 0);
});

test("analyzer flags edited summary with a stale hash", () => {
  const payload = buildSampleExport();
  const tampered = structuredClone(payload);
  tampered.summary.guided.passed = 99;

  const verification = verifyUsageExport(tampered);
  const summary = summarizeUsagePayload(tampered);

  assert.equal(verification.ok, false);
  assert.equal(summary.hashStatus, "hash mismatch");
  assert.ok(summary.suspiciousSignals.includes("integrity_mismatch"));
});

test("analyzer flags duplicate session ids and identical event sequences under different names", () => {
  const first = buildSampleExport("Ada Lovelace", "same-session");
  const second = buildSampleExport("Grace Hopper", "same-session");
  const third = buildSampleExport("Ada Lovelace", "same-session");
  const comparisons = compareUsageSummaries([
    summarizeUsagePayload(first),
    summarizeUsagePayload(second),
    summarizeUsagePayload(third)
  ]);

  assert.equal(comparisons.duplicateSessionIds.length, 1);
  assert.equal(comparisons.duplicateHashes.length, 1);
  assert.equal(comparisons.similarSequencesDifferentNames.length, 1);
});

test("usage analyzer script reads exported files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "bba-usage-"));
  const fileOne = join(dir, "usage-a.json");
  const fileTwo = join(dir, "usage-b.json");
  const first = buildSampleExport("Ada Lovelace", "same-session");
  const second = buildSampleExport("Grace Hopper", "same-session");
  const tampered = structuredClone(second);
  tampered.summary.guided.failed = 4;

  await writeFile(fileOne, JSON.stringify(first, null, 2), "utf8");
  await writeFile(fileTwo, JSON.stringify(tampered, null, 2), "utf8");

  const { stdout } = await execFileAsync("node", ["scripts/analyze-usage-files.js", fileOne, fileTwo], {
    cwd: process.cwd(),
    env: process.env
  });

  assert.match(stdout, /verified hash/);
  assert.match(stdout, /hash mismatch/);
  assert.match(stdout, /possible duplicate session id/);
});
