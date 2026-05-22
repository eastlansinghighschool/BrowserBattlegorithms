import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildGuidedLevelBehaviorEvidenceData,
  generateGuidedLevelBehaviorEvidence,
  renderGuidedLevelBehaviorEvidenceMarkdown,
  renderGuidedLevelBehaviorSummaryIndexMarkdown
} from "../../src/dev/levelBehaviorEvidence.js";

let evidenceDataPromise = null;

async function getEvidenceData() {
  if (!evidenceDataPromise) {
    evidenceDataPromise = buildGuidedLevelBehaviorEvidenceData();
  }
  return evidenceDataPromise;
}

test("behavior evidence identifies at least one ordinary passing level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "move-to-target");

  assert.ok(entry, "expected move-to-target behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.equal(entry.runs[0].status, "pass");
  assert.ok(entry.runs[0].turnsElapsed > 0);
  assert.ok(entry.runs[0].actionCount > 0);
  assert.equal(entry.runs[0].branchTraceEvidencePresent, true);
});

test("behavior evidence reports a not-run reason for a prediction level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "prediction-25");

  assert.ok(entry, "expected prediction-25 behavior evidence");
  assert.equal(entry.notApplicableReason, "prediction checkpoint requires a prediction choice before play");
  assert.equal(entry.runs.length, 0);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /not-applicable reason: prediction checkpoint requires a prediction choice before play/);
  assert.match(markdown, /no runtime evidence collected/);
});

test("behavior evidence reports project fixture policy status for a project level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "advanced-scrimmage");

  assert.ok(entry, "expected advanced-scrimmage behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.equal(entry.runs.some((run) => run.status === "documented exception"), true);
  assert.equal(entry.runs.length >= 2, true);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /documented exception/);
  assert.match(markdown, /project checkpoint/);
  assert.match(markdown, /project final/);
});

test("behavior evidence includes NPC behavior names and first enemy actions", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "dodge-and-deliver");

  assert.ok(entry, "expected dodge-and-deliver behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.ok(entry.runs[0].enemyBehaviorSummary.lines.some((line) => line.includes("behavior")));
  assert.ok(entry.runs[0].enemyActionRows.length > 0);
  assert.ok(entry.runs[0].enemyActionRows[0].actionType);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /Enemy \/ NPC Behavior/);
  assert.match(markdown, /first enemy actions/);
});

test("behavior summary index includes links to behavior evidence files", async () => {
  const { entries } = await getEvidenceData();
  const summary = renderGuidedLevelBehaviorSummaryIndexMarkdown(entries);

  assert.match(summary, /\[behavior\]\(behavior-evidence\/01-move-to-target\.md\)/);
  assert.match(summary, /\[behavior\]\(behavior-evidence\/46-optional-double-carrier-showdown\.md\)/);
});

test("behavior evidence classifies a project level with WAIT_FOR_INPUT as not applicable", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "full-team-tactics");

  assert.ok(entry, "expected full-team-tactics behavior evidence");
  assert.ok(entry.notApplicableReason, "expected a not-applicable reason for full-team-tactics");
  assert.match(entry.notApplicableReason, /project capstone/);
  assert.equal(entry.runs.length, 0, "expected no runs for a WAIT_FOR_INPUT project level");

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /not-applicable reason:.*project capstone/);
  assert.match(markdown, /no runtime evidence collected/);
});

test("behavior evidence generator writes the summary index and per-level files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bba-behavior-evidence-"));
  const summaryIndexPath = path.join(tempDir, "behavior-summary-index.md");
  const result = await generateGuidedLevelBehaviorEvidence({ outputDir: path.join(tempDir, "behavior-evidence"), summaryIndexPath });

  assert.equal(result.entries.length > 0, true);
  assert.equal(await fs.stat(summaryIndexPath).then(() => true), true);
  assert.equal(
    await fs.stat(path.join(tempDir, "behavior-evidence", "01-move-to-target.md")).then(() => true),
    true
  );
});
