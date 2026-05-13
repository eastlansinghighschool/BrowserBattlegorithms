# Plan 16: End-to-End Usage Pipeline Regression Script

## Packet Metadata

- Packet id: plan-16
- Packet title: End-to-End Usage Pipeline Regression Script
- Status: ready
- Owner/model: implementation agent with orchestration gate
- Date: 2026-05-13
- Packet type: testing / implementation
- Mutation level: tests / source-code (test infrastructure only)
- Approval gate: before mutation — the implementing agent must propose incorrect solution XMLs for student struggle profiles and receive orchestration approval before writing tests
- Expected artifacts:
  - `tests/regression/usage-pipeline.spec.js` — Playwright test file
  - `tests/regression/playwright.config.js` — dedicated Playwright config for long-running regression
  - `tests/regression/student-profiles.js` — profile definitions (names, XMLs, failure points, stop points)
  - `tests/regression/timestamp-spreader.js` — post-processing utility to spread timestamps
  - `tests/regression/screenshots/` — auto-captured admin page screenshots
  - progress report
- Progress report folder: `reports/development/plan-16-usage-pipeline-regression/`
- Progress report file: `reports/development/plan-16-usage-pipeline-regression/progress.md`

## Packet Summary

Goal: Create a standalone Playwright regression script that simulates 4–5 student profiles playing through the guided campaign with varying success, exports usage files, runs the CLI analyzer, uploads results to the admin page, and captures screenshots — all in parallel.

Non-goals:

- Do not change the usage tracker, usage analyzer, admin page, or game engine.
- Do not add this to the fast `npm run test:browser` suite. This is a separate, slower regression command.
- Do not test Free Play mode in this packet. Guided campaign only.
- Do not test Blockly drag-and-drop interaction. All workspace loading uses `loadWorkspaceXml` via test hooks.
- Do not deploy.

Depends on: Plans 04, 04b (usage export and admin page must exist).

Blocks: nothing.

Why this packet exists: The integration owner needs confidence that the full usage pipeline works end-to-end before piloting with students. The pipeline spans: game play → usage tracking → usage export → CLI analyzer → admin page upload → admin table rendering → admin detail view. A regression that covers this chain with realistic student profiles (including struggle and abandonment) catches schema drift, export bugs, analyzer parsing issues, and admin rendering problems. Running it periodically also validates that reference solutions still solve all guided levels.

## Authority And Contracts

Sources of truth:

- `tests/browser/helpers.js` — existing browser test helper patterns
- `tests/browser/admin.spec.js` — existing admin page test patterns
- `tests/unit/fixtures/guided-reference-solutions/` — 37 reference solution XML files
- `src/usage/usageFormat.js` — usage session structure, `createExportPayload`, `appendUsageEvent`
- `src/usage/usageAnalyzer.js` — `buildUsageExportWithIntegrity`, `summarizeUsagePayload`, `verifyUsageExport`, `compareUsageSummaries`
- `scripts/analyze-usage-files.js` — CLI entry point for usage analysis

Do not redefine:

- Usage tracker event types or schema.
- Admin page layout or behavior.
- Reference solution correctness (use the fixtures as-is for the happy path).
- Game rules, turn engine, or Blockly semantics.

## Required Reading

- `tests/browser/helpers.js` — `waitForHeavyReady`, `loadWorkspaceXml`, `buildSolutionXml`, `clearStorageBeforeEach`
- `tests/browser/guided-play.spec.js` lines 138–187 — pattern for loading XML and fast-forwarding turns via `processTurn()`
- `tests/browser/admin.spec.js` lines 13–27 — `buildSampleExport`, `payloadToFile` helpers, `setInputFiles` pattern
- `src/usage/usageFormat.js` — `createUsageSession`, `appendUsageEvent`, `createExportPayload`, event timestamp format
- `src/usage/usageAnalyzer.js` — `buildUsageExportWithIntegrity` for re-hashing after timestamp adjustment
- `src/config/levels.js` — `getLevelDefinitions()` for the full level list and IDs
- `playwright.config.js` — existing Playwright setup

Optional/contextual reading:

- `src/ui/controls.js` lines 326–367 — usage export button handler (`window.prompt` + Blob download)
- `admin.html` — admin page structure (`#fileInput`, `#classTable`, `#detailSection`)
- `src/admin/adminApp.js` — admin app initialization

## Scope

### In scope

1. Create a dedicated Playwright config for regression tests with `workers: 5` for parallel execution.
2. Define 4–5 student profiles with names, level-by-level XML maps (correct and incorrect solutions), failure-before-success counts, and stop points.
3. Write a Playwright test that runs each profile in parallel: load each level's XML, fast-forward turns, handle pass/fail/retry, advance through the campaign.
4. Export usage from each profile by intercepting the `window.prompt` dialog and the file download.
5. Post-process exported files to spread timestamps realistically and re-hash for valid integrity.
6. Run the CLI analyzer on all exported files and assert clean output.
7. Navigate each profile's browser to the admin page, upload all files, assert table rendering, and capture screenshots.
8. Add a `package.json` script entry (e.g., `test:regression`) to run this suite independently.

### Out of scope

- Changes to the game engine, usage tracker, admin page, or any production code.
- Free Play mode testing.
- Visual pixel-diff assertions on screenshots (screenshots are evidence artifacts, not automated assertions).
- Blockly drag-and-drop interaction testing.
- Adding this to CI or the fast test suite.

### Files and areas likely touched

- `tests/regression/` — new directory for all regression test files
- `tests/regression/playwright.config.js` — dedicated config with `workers: 5`
- `tests/regression/usage-pipeline.spec.js` — main test file
- `tests/regression/student-profiles.js` — profile definitions
- `tests/regression/timestamp-spreader.js` — timestamp post-processing utility
- `package.json` — new `test:regression` script entry

## Orchestration Checkpoint

### Checkpoint 1: Proposed student profiles and incorrect solutions

Before writing test code, the implementing agent must produce a table for orchestration review:

| Profile name | Student name | Behavior description | Levels where incorrect XML is used before the correct one | Level where student stops (if applicable) | Expected attempt count pattern |
| --- | --- | --- | --- | --- | --- |

For each level where an incorrect XML is proposed, the agent must also provide:
- The incorrect XML
- A 1-sentence explanation of what the "mistake" is (e.g., "moves forward without checking for the barrier")
- How many times the student fails before loading the correct solution

Incorrect solutions should be plausible student mistakes, not random garbage:
- Using `Move Forward` without a condition when a barrier or enemy is present
- Targeting the wrong destination (enemy flag vs. home base)
- Missing a condition branch (no `else` when one is needed)
- Using the wrong boolean operator (`AND` vs `OR`)
- Forgetting to check a resource before using it (jump without `If can jump`)

The orchestrator approves or revises the profiles before the agent writes tests.

### Profiles to define

**Profile 1: "Perfect Pat"** — completes all 37 levels on the first try with reference solutions. No failures.

**Profile 2: "Struggling Sam"** — fails 5–8 levels 1–2 times each before passing. Completes the full campaign.

**Profile 3: "Challenged Charlie"** — fails 10–15 levels 2–3 times each. Takes longer. Completes most of the campaign but skips some optional levels if applicable.

**Profile 4: "Gave-Up Gabi"** — completes levels 1–15, fails level 16 three times, and stops. Does not export a complete campaign.

**Profile 5: "Copy-Cat Casey"** — uses the same solutions as "Perfect Pat" but with a different name and session ID. Tests the analyzer's duplicate/similarity detection.

## Work Plan

1. Read existing browser test patterns and the level list.
2. Propose the student profile table (Checkpoint 1). Stop for orchestration review.
3. After approval, create the `tests/regression/` directory and files.
4. Implement the profile definitions with level-by-level XML maps.
5. Implement the timestamp spreader utility.
6. Implement the main Playwright test:
   a. For each profile (in parallel workers): navigate to `/`, play through assigned levels, export usage.
   b. After all profiles complete: post-process timestamps, run CLI analyzer, upload to admin page.
7. Capture admin page screenshots (class table, detail panel for each student, flags section).
8. Add the `test:regression` script to `package.json`.
9. Run the regression suite and verify it passes.
10. Write progress report.

## Implementation Requirements

### Requirement 1: Dedicated Playwright config

Required behavior: Create `tests/regression/playwright.config.js` with:

```js
workers: 5,
testDir: "./",
timeout: 120000,
use: {
  baseURL: "http://127.0.0.1:4173",
  headless: true
},
webServer: {
  command: "npm run dev -- --host 127.0.0.1 --port 4173",
  url: "http://127.0.0.1:4173",
  reuseExistingServer: true,
  timeout: 120000
}
```

Constraints:
- Use `reuseExistingServer: true` so the dev server is shared across parallel workers.
- Use a generous `timeout` (120s) since profiles play through many levels.
- The config should be invocable via `npx playwright test --config=tests/regression/playwright.config.js`.

### Requirement 2: Student profile definitions

Required behavior: Define each profile as a data structure containing:

```js
{
  name: "Perfect Pat",
  studentName: "Pat Chen",
  behavior: "happy-path",
  levels: [
    {
      levelId: "move-to-target",
      attempts: [
        { xmlFile: "move-to-target.xml", expectPass: true }
      ]
    },
    // ...
  ],
  stopAfterLevel: null  // or a levelId to stop early
}
```

For struggling profiles, a level entry with multiple attempts looks like:

```js
{
  levelId: "sensor-barrier-branch",
  attempts: [
    { xmlInline: "<xml>...wrong solution...</xml>", expectPass: false },
    { xmlInline: "<xml>...still wrong...</xml>", expectPass: false },
    { xmlFile: "sensor-barrier-branch.xml", expectPass: true }
  ]
}
```

Constraints:
- Reference solution XMLs use `xmlFile` pointing to `tests/unit/fixtures/guided-reference-solutions/<id>.xml`.
- Incorrect solutions use `xmlInline` with the full XML string.
- Each profile must have a unique `studentName` and will get a unique `sessionId` at runtime.
- The "Copy-Cat Casey" profile uses the same `xmlFile` entries as "Perfect Pat" (identical solutions).

### Requirement 3: Game play loop

Required behavior: For each profile, the test should:

1. Navigate to `/` and wait for heavy-ready.
2. For each level in the profile's list:
   a. Start the level via `hooks.startLevel(levelId)`.
   b. For each attempt in the level's attempts list:
      - Load the XML via `hooks.loadWorkspaceXml(xml)`.
      - Fast-forward turns via a `processTurn()` loop (max 300 iterations, break on pass/fail).
      - If `expectPass: true`, assert `activeLevelResult === "PASSED"`.
      - If `expectPass: false`, assert `activeLevelResult === "FAILED"`, then reset the level via `hooks.resetCurrentLevel()`.
   c. After the passing attempt, advance to the next level via `hooks.goToNextLevel()`.
3. If `stopAfterLevel` is set, break after that level.

Constraints:
- Do not wait for animations. Use `processTurn()` in a tight loop.
- Clear localStorage before each profile to ensure a clean session.
- Each profile runs in its own Playwright worker with its own browser context.

### Requirement 4: Usage export interception

Required behavior: After completing the level sequence, export usage:

1. Register a `page.on('dialog')` handler to accept the prompt with the profile's `studentName`.
2. Register a download listener via `page.waitForEvent('download')`.
3. Click the `#exportUsageButton`.
4. Save the downloaded file to `tests/regression/output/<studentName>.json`.

Constraints:
- The dialog handler must be registered BEFORE clicking the button.
- If the download fails, fail the test with a clear error.
- The output directory should be created if it doesn't exist.

### Requirement 5: Timestamp spreader

Required behavior: Create a utility that reads an exported JSON file and:

1. Parses the session `startedAt` as the baseline.
2. Spreads event timestamps so each level attempt takes 2–5 minutes of simulated time (randomized per level).
3. Adds 10–30 seconds of simulated "think time" between level completion and next level start.
4. For "Struggling" profiles, adds extra time for failed attempts (1–3 minutes per failure).
5. Updates `sessionUpdatedAt` and `summary.lastKnown.exportedAt`.
6. Recalculates the integrity hash via `buildUsageExportWithIntegrity`.
7. Writes the adjusted file back to disk.

Constraints:
- The spreader must produce valid integrity hashes. The admin page must show "✓ verified" for all non-tampered profiles.
- Use realistic time ranges. A full campaign should look like 60–120 minutes for "Perfect Pat" and 90–180 minutes for struggling profiles.
- The "Gave-Up Gabi" profile should show 30–45 minutes before stopping.
- Import `buildUsageExportWithIntegrity` from `src/usage/usageAnalyzer.js` for re-hashing.

Edge case: The `createExportPayload` function computes `totalPlayTimeMs` from the difference between `exportedAt` and `startedAt`. The spreader must ensure this calculation produces the expected total after adjustment.

### Requirement 6: CLI analyzer verification

Required behavior: After all profiles export and timestamps are spread, run:

```
node scripts/analyze-usage-files.js tests/regression/output/*.json
```

Assert:
- Exit code 0.
- Output contains all student names.
- Output contains "verified hash" for all profiles.
- Output flags "Copy-Cat Casey" and "Perfect Pat" as having similar event sequences or identical hashes.
- Output does NOT flag "Struggling Sam" or "Gave-Up Gabi" as duplicates of anyone.

Constraints:
- Run the CLI as a child process from the Playwright test or as a separate test step.
- Capture stdout for assertions.

### Requirement 7: Admin page upload and screenshots

Required behavior: After all profiles complete and files are post-processed, run a final sequential test that:

1. Navigates to `/admin.html`.
2. Uploads all exported files via `#fileInput.setInputFiles(...)`.
3. Asserts the class table shows one row per student.
4. Asserts integrity column shows "✓ verified" for all students.
5. Captures a screenshot of the class table (`tests/regression/screenshots/class-table.png`).
6. Clicks each row and captures a screenshot of the detail panel (`tests/regression/screenshots/detail-<name>.png`).
7. Asserts the flags section is visible and contains a duplicate/similarity flag for "Copy-Cat Casey."
8. Captures a screenshot of the flags section (`tests/regression/screenshots/flags.png`).

Constraints:
- This test must run AFTER all profile tests complete (use Playwright's `test.describe.serial` or a separate test file that depends on output files existing).
- Screenshots are evidence artifacts, not pixel-diff assertions.
- Use stable filenames so screenshots overwrite on each run.

### Requirement 8: Package.json script

Required behavior: Add a `test:regression` script:

```json
"test:regression": "npx playwright test --config=tests/regression/playwright.config.js"
```

Constraints:
- This is NOT added to the `test` or `test:browser` scripts. It runs independently.
- Document in the progress report that this is a long-running regression intended for periodic use.

## Pedagogy Checks

- Not applicable. This packet does not change any student-facing behavior.
- The incorrect solution XMLs should represent plausible student mistakes (wrong direction, missing condition, wrong operator). This is checked at the orchestration gate.

## Commands

```powershell
npm test
npm run build
npm run test:regression
```

## Validation Checklist

- [ ] `tests/regression/` directory exists with all expected files.
- [ ] Student profiles are defined with correct and incorrect XMLs.
- [ ] Incorrect XMLs are approved by orchestration (Checkpoint 1).
- [ ] All 5 profiles run in parallel and complete without timeout.
- [ ] Each profile exports a valid usage JSON file.
- [ ] Timestamp spreader produces files with realistic time distribution.
- [ ] All post-processed files pass integrity verification ("✓ verified").
- [ ] CLI analyzer runs on all files and produces expected output.
- [ ] CLI analyzer flags "Copy-Cat Casey" similarity.
- [ ] Admin page loads all files and renders the class table correctly.
- [ ] Admin page screenshots are captured.
- [ ] Admin page flags section shows duplicate/similarity warnings.
- [ ] `npm test` still passes (no interference with existing tests).
- [ ] `npm run build` still passes.
- [ ] `test:regression` script works from the command line.
- [ ] No production code was changed.
- [ ] Progress report documents run time, profile results, and any remaining risks.

## Stop Conditions

Stop and report if:

- The test hooks (`__BBA_TEST_HOOKS__`) do not expose enough API to drive the game loop (missing `processTurn`, `startLevel`, `goToNextLevel`, `resetCurrentLevel`, or `loadWorkspaceXml`).
- The usage export button handler cannot be intercepted by Playwright (dialog or download issues).
- Reference solution XMLs fail to pass their levels (indicates a Plan 13 regression).
- The admin page file input cannot accept files via `setInputFiles`.
- The integrity hash recalculation after timestamp spreading does not produce valid results.
- Parallel workers interfere with each other (shared state leaks).
- Any change would require modifying production code.
