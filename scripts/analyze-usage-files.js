#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { compareUsageSummaries, summarizeUsagePayload, verifyUsageExport } from "../src/usage/usageAnalyzer.js";
import { formatGuidedProgressLabel } from "../src/usage/guidedProgress.js";

function printUsage() {
  console.error("Usage: node scripts/analyze-usage-files.js [--json] <usage-file.json> [more-files.json...]");
}

function parseArgs(argv) {
  const json = argv.includes("--json");
  const files = argv.filter((value) => value !== "--json");
  return { json, files };
}

async function readUsageFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  const payload = JSON.parse(raw);
  return { filePath, payload };
}

function formatSummaryLine(record) {
  const hashLabel = record.hashStatus === "verified hash" ? "verified hash" : "hash mismatch";
  const guidedLabel = `${record.guided.passed}/${record.guided.completed} passed`;
  const freePlayLabel = `free play score ${record.freePlay.lastScores[1]}-${record.freePlay.lastScores[2]}`;
  const highestReached = formatGuidedProgressLabel(record.guidedProgress?.highestReached);
  const highestPassed = formatGuidedProgressLabel(record.guidedProgress?.highestPassed);
  const highestPassedChallenge = formatGuidedProgressLabel(record.guidedProgress?.highestPassedChallenge);
  const reviewLabel = record.needsReview ? "review" : "clear";
  return [
    basename(record.filePath),
    `student=${record.studentName || basename(record.filePath) || "(blank)"}`,
    `session=${record.sessionId || "(missing)"}`,
    `exported=${record.exportedAt || "(missing)"}`,
    `integrity=${hashLabel}`,
    `schema=v${record.schemaVersion || 1}`,
    `guided=${guidedLabel}`,
    `challengeCount=${record.challengeSummary}`,
    `highestReached=${highestReached}`,
    `highestPassed=${highestPassed}`,
    `highestPassedChallenge=${highestPassedChallenge}`,
    `needsReview=${reviewLabel}`,
    freePlayLabel
  ].join(" | ");
}

function formatFlagLine(label, values) {
  return `${label}: ${values.join(", ")}`;
}

async function main() {
  const { json, files } = parseArgs(process.argv.slice(2));
  if (files.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const records = [];
  for (const filePath of files) {
    try {
      const { payload } = await readUsageFile(filePath);
      const summary = summarizeUsagePayload(payload);
      const verification = verifyUsageExport(payload);
      records.push({
        filePath,
        payload,
        verification,
        ...summary
      });
    } catch (error) {
      console.error(`${basename(filePath)} | failed to read: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
  }

  const comparisons = compareUsageSummaries(records);

  if (json) {
    console.log(JSON.stringify({ records, comparisons }, null, 2));
    return;
  }

  for (const record of records) {
    console.log(formatSummaryLine(record));
    if (record.suspiciousSignals.length) {
      console.log(`  signals: ${record.suspiciousSignals.join(", ")}`);
    }
    if (record.reviewSignals?.length) {
      for (const sig of record.reviewSignals) {
        console.log(`  review: ${sig.message || sig.type}`);
      }
    }
  }

  if (comparisons.duplicateSessionIds.length) {
    for (const entry of comparisons.duplicateSessionIds) {
      const names = entry.indices.map((index) => records[index]?.studentName || basename(records[index]?.filePath || `submission-${index + 1}`));
      console.log(formatFlagLine("possible duplicate session id", names));
    }
  }
  if (comparisons.duplicateHashes.length) {
    for (const entry of comparisons.duplicateHashes) {
      const names = entry.indices.map((index) => records[index]?.studentName || basename(records[index]?.filePath || `submission-${index + 1}`));
      console.log(formatFlagLine("identical integrity hash", names));
    }
  }
  if (comparisons.similarSequencesDifferentNames.length) {
    for (const entry of comparisons.similarSequencesDifferentNames) {
      let label = "similar event sequence (identical attempts + program states; strong but rare — 'not flagged' does not mean independent work)";
      if (!entry.submittersDistinguishable) {
        label = "similar event sequence (identical attempt sequence, submitters not distinguishable from these files; strong but rare — 'not flagged' does not mean independent work)";
      } else if (!entry.hasDifferentNames) {
        label = "similar event sequence (identical attempt sequence and identical captured program states in separate submissions; strong but rare — 'not flagged' does not mean independent work)";
      }
      console.log(formatFlagLine(label, entry.labels || []));
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
