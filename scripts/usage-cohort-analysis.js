import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { isCohortPathSafe } from "../src/usage/cohortPrivacyPaths.js";
import { anonymizeExports, formatCsv, generateCohortTables, buildBaselineReport } from "../src/usage/cohortAnalysis.js";

function printUsage() {
  console.log(`
Usage:
  npm run usage:cohort -- --cohort <cohort-id> [--dry-run]
  npm run usage:cohort -- --input <input-path> --output <output-path> [--dry-run]

Options:
  --cohort <cohort-id>  Generic local cohort name (e.g. spring-2026-sec-a).
                        Sets input directory to: local/usage-cohorts/<cohort-id>/raw-exports/
                        Sets output directory to: local/usage-cohorts/<cohort-id>/
  --input <path>        Custom input directory containing raw student usage exports.
  --output <path>       Custom output directory for analysis tables and reports.
  --dry-run             Check paths and validate inputs, but do not write output.
  --help                Show this message.
`);
}

function ensureDirectoryExists(path) {
  if (!isCohortPathSafe(path)) {
    console.error(`Error: Path '${path}' is outside the allowed local workspace.`);
    process.exit(1);
  }
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function run() {
  const args = process.argv.slice(2);
  let cohortId = null;
  let inputPath = null;
  let outputPath = null;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--cohort") {
      cohortId = args[i + 1];
      i++;
    } else if (args[i] === "--input") {
      inputPath = args[i + 1];
      i++;
    } else if (args[i] === "--output") {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      printUsage();
      process.exit(0);
    }
  }

  // Determine actual input and output directories
  let finalInputDir = null;
  let finalOutputDir = null;

  if (cohortId) {
    const cleanCohortRegex = /^[a-zA-Z0-9_\-]+$/;
    if (!cleanCohortRegex.test(cohortId)) {
      console.error("Error: Cohort ID contains invalid characters. Use alphanumeric, dashes, and underscores only.");
      process.exit(1);
    }
    finalInputDir = join("local/usage-cohorts", cohortId, "raw-exports");
    finalOutputDir = join("local/usage-cohorts", cohortId);
  } else if (inputPath && outputPath) {
    finalInputDir = inputPath;
    finalOutputDir = outputPath;
  } else {
    console.error("Error: Must specify either --cohort OR both --input and --output.");
    printUsage();
    process.exit(1);
  }

  // Resolve absolute paths
  const absoluteInputDir = resolve(finalInputDir);
  const absoluteOutputDir = resolve(finalOutputDir);

  // 1. Path Safety Check
  if (!isCohortPathSafe(absoluteInputDir)) {
    console.error(`Error: Input directory '${absoluteInputDir}' resolves outside local/usage-cohorts/`);
    process.exit(1);
  }
  if (!isCohortPathSafe(absoluteOutputDir)) {
    console.error(`Error: Output directory '${absoluteOutputDir}' resolves outside local/usage-cohorts/`);
    process.exit(1);
  }

  console.log(`Processing Cohort Usage Analysis...`);
  console.log(`- Input Directory:  ${absoluteInputDir}`);
  console.log(`- Output Directory: ${absoluteOutputDir}`);
  if (dryRun) console.log(`- Mode:             DRY-RUN (No writes)`);

  // Verify input directory exists
  if (!existsSync(absoluteInputDir)) {
    console.error(`Error: Input directory '${absoluteInputDir}' does not exist.`);
    console.error(`Please place student usage exports (.json) there and try again.`);
    process.exit(1);
  }

  // Read raw export files
  const files = readdirSync(absoluteInputDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.warn(`Warning: No JSON usage export files found in '${absoluteInputDir}'.`);
    process.exit(0);
  }

  console.log(`Found ${files.length} JSON files in the raw exports directory.`);

  let invalidFilesCount = 0;
  const rawExports = [];
  for (const file of files) {
    const filePath = join(absoluteInputDir, file);
    try {
      const content = readFileSync(filePath, "utf8");
      const payload = JSON.parse(content);
      if (!payload || typeof payload !== "object") {
        throw new Error("Parsed JSON is not an object.");
      }
      rawExports.push({
        fileName: file,
        payload
      });
    } catch (e) {
      console.error(`Error parsing JSON from file: ${file}. Skipped. Details: ${e.message}`);
      invalidFilesCount++;
    }
  }

  const fileStats = {
    totalFiles: files.length,
    validFiles: rawExports.length,
    invalidFiles: invalidFilesCount
  };

  if (rawExports.length === 0) {
    console.error("Error: No valid JSON payloads could be loaded.");
    process.exit(1);
  }

  // Load existing identity map
  const identityMapDir = join(absoluteOutputDir, "identity-map");
  const identityMapPath = join(identityMapDir, "map.json");
  let existingMap = { mappings: {}, details: {} };

  if (existsSync(identityMapPath)) {
    try {
      existingMap = JSON.parse(readFileSync(identityMapPath, "utf8"));
    } catch (e) {
      console.warn(`Warning: Failed to parse existing identity map. Recreating. Detail: ${e.message}`);
    }
  }

  // 2. Anonymize Exports
  const { identityMap: updatedMap, processed } = anonymizeExports(rawExports, existingMap);

  // 3. Generate tables
  const tables = generateCohortTables(processed);

  if (dryRun) {
    console.log("\nDry-run complete. Validation succeeded.");
    console.log(`- Valid files processed: ${processed.length}`);
    process.exit(0);
  }

  // Create directories
  ensureDirectoryExists(identityMapDir);
  ensureDirectoryExists(join(absoluteOutputDir, "anonymized", "json"));
  ensureDirectoryExists(join(absoluteOutputDir, "anonymized", "csv"));
  ensureDirectoryExists(join(absoluteOutputDir, "analysis", "queries"));

  // Save updated identity map
  writeFileSync(identityMapPath, JSON.stringify(updatedMap, null, 2), "utf8");
  console.log(`Saved identity map: ${identityMapPath}`);

  // Write anonymized tables
  for (const [tableName, tableRows] of Object.entries(tables)) {
    const jsonPath = join(absoluteOutputDir, "anonymized", "json", `${tableName}.json`);
    const csvPath = join(absoluteOutputDir, "anonymized", "csv", `${tableName}.csv`);

    if (!isCohortPathSafe(jsonPath) || !isCohortPathSafe(csvPath)) {
      console.error(`Error: Refusing to write table outside cohort root.`);
      process.exit(1);
    }

    writeFileSync(jsonPath, JSON.stringify(tableRows, null, 2), "utf8");
    writeFileSync(csvPath, formatCsv(tableRows), "utf8");
  }
  console.log(`Saved anonymized tables to JSON & CSV.`);

  // 4. Generate Baseline Report
  const baselineReportPath = join(absoluteOutputDir, "analysis", "baseline-report.md");
  if (!isCohortPathSafe(baselineReportPath)) {
    console.error("Error: Refusing to write report outside cohort root.");
    process.exit(1);
  }

  const baselineReport = buildBaselineReport(cohortId || "custom", fileStats, tables);
  writeFileSync(baselineReportPath, baselineReport, "utf8");
  console.log(`Saved baseline report: ${baselineReportPath}`);

  // 5. Generate Starter Queries Description
  const queriesPath = join(absoluteOutputDir, "analysis", "queries", "starter_queries.md");
  if (!isCohortPathSafe(queriesPath)) {
    console.error("Error: Refusing to write queries outside cohort root.");
    process.exit(1);
  }

  const queriesContent = buildQueriesDescription();
  writeFileSync(queriesPath, queriesContent, "utf8");
  console.log(`Saved starter queries doc: ${queriesPath}`);

  console.log(`\nAnalysis completed successfully!`);
}

function buildQueriesDescription() {
  return `# Cohort Usage Analysis Starter Queries

This document contains starter query descriptions and logic guidelines to query the normalized JSON and CSV tables generated in the \`anonymized/\` folder.

---

## Query 1: Fail Rate Among Reached Student Exports
Determine the proportion of student exports that reached a level but failed or could not complete it.

* **Logic**:
  - From the \`class_level_rollup\` table:
  - For each level, compute: \`(reachedCount - passCount) / reachedCount\`
* **JSON Path**:
  - Read \`class_level_rollup.json\`
  - Select \`levelId\`, \`levelTitle\`, \`reachedCount\`, \`passCount\`
  - Compute \`failRate = 1.0 - (passCount / reachedCount)\`

---

## Query 2: Median Attempts to First Pass
Find the median number of starts required by student exports before obtaining their first PASSED result on a level.

* **Logic**:
  - Read \`class_level_rollup\` table.
  - Select \`levelId\`, \`levelTitle\`, \`medianAttemptsToFirstPass\`

---

## Query 3: Median Turns on Passed Attempts
Analyze standard execution efficiency (turns spent) on successful runs.

* **Logic**:
  - Read \`class_level_rollup\` table.
  - Select \`levelId\`, \`levelTitle\`, \`medianTurnsOnPassedAttempts\`

---

## Query 4: High Starts but Low Passes (Sticking Points)
Find levels where student exports started the level multiple times but did not successfully pass.

* **Logic**:
  - From \`guided_level_rollup\` table:
  - Filter rows where \`startedCount > 1\` and \`passed === 0\`
  - Group by \`levelId\` and count the distinct \`exportId\`s to see how many exports got stuck.

---

## Query 5: Revisits after Later-Level Failures
Identify student exports that backtrack to an earlier concept level (e.g. Level 16 jump) after experiencing failure on a later level (e.g. Challenge 22).

* **Logic**:
  - For each \`exportId\`:
    - Find the timestamp \`T\` of the first \`level_completed\` event with result \`FAILED\` on a later level.
    - Check if there are any subsequent \`level_started\` events on an earlier level (orderIndex < later level orderIndex) with timestamp > \`T\`.

---

## Query 6: Abandoned Attempts
Identify attempts that were started but never completed (result is \`session_end\`, \`boundary\`, or \`interrupted\`).

* **Logic**:
  - From the \`guided_attempts\` table:
  - Filter where \`result\` is in \`['interrupted', 'boundary', 'session_end']\`
  - Group by \`levelId\` and count to see which levels have the most unfinished runs.

---

## Query 7: Challenge Success by Prior Tutorial/Bug-Hunt Completion
Determine if student exports that pass prediction and bug-hunt checkpoint levels succeed on challenge levels in fewer attempts than those who skipped or struggled on checkpoints.

* **Logic**:
  - For each \`exportId\`, check if their \`guided_level_rollup\` for the bug-hunt/prediction level shows \`passed === 1\`.
  - Group exports into two categories: "Completed Checkpoint" vs "Did Not Complete Checkpoint".
  - Compare the \`medianAttemptsToFirstPass\` on the subsequent Challenge level for both groups.

---

## Query 8: Non-Monotonic Navigation Patterns (Backtracking)
Identify student exports showing high non-sequential backtracking.

* **Logic**:
  - From the \`events\` table, filter for \`level_started\` events.
  - Track the sequence of \`levelOrder\` values.
  - Count how many times \`levelOrder(t) < levelOrder(t-1)\` occurs.
  - Sort exports by this count descending.
`;
}

run();
