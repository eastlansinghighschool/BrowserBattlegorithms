# Plan 04: Saveable Usage File

## Packet Metadata

- Packet id: plan-04
- Packet title: Saveable Usage File
- Status: ready
- Owner/model: lower-cost implementation agent
- Date: 2026-05-12
- Packet type: implementation / frontend / local tooling / classroom evidence
- Mutation level: source-code / tests / generated-local
- Approval gate: none
- Expected artifacts:
  - student-facing usage export flow in the static app
  - local usage/event tracking sufficient for learning and performance evidence
  - exported usage file with student name, summary, event data, code snapshots, and integrity hash
  - local admin analyzer script for one or more exported files
  - focused tests
  - progress report
- Progress report folder: `reports/development/plan-04-saveable-usage-file/`
- Progress report file: `reports/development/plan-04-saveable-usage-file/progress.md`

## Packet Summary

Goal: Let students save a local evidence file showing what they did in Browser Battlegorithms, and give the teacher a local analyzer that summarizes completion, performance, similarity, and basic tamper signals.

Implementation direction:

- Keep a live in-memory usage tracker while the app runs.
- Persist that tracker to `IndexedDB` so usage survives refreshes and tab closes.
- Hydrate the tracker from `IndexedDB` on startup and prune old records by age and/or bounded count.
- Use `localStorage` only for tiny preferences or convenience values if needed, not for the evidence store itself.

Non-goals:

- Do not add a server, login system, cloud sync, telemetry endpoint, or hosted admin dashboard.
- Do not claim cryptographic proof of identity or perfect anti-cheat protection.
- Do not collect hidden personal information.
- Do not change game rules, level order, or Blockly semantics.
- Do not require students to install anything beyond using the app in a browser.

Depends on:

- Plan 02 test repair.
- Preferably Plan 03 challenge metadata, but this packet can proceed if challenge metadata is not yet implemented.

Blocks:

- Graded classroom use where students need to submit evidence of both learning and performance.

Why this packet exists:

For AP CSA classroom use, the teacher needs more than a screenshot. The exported file should help distinguish "I completed the guided work and learned the strategy ideas" from "I edited a JSON file." This packet should provide reasonable assurance against unsophisticated tampering and duplicate reuse while staying honest about the limits of a local, serverless app.

## Authority And Contracts

Required product contracts:

- Browser Battlegorithms remains a static Vite app.
- Usage data is local until the student intentionally exports a file.
- The export asks for a student-entered display name at save time.
- The analyzer runs locally from the repository/dev environment, not inside the hosted GitHub Pages app.
- Integrity checks catch casual edits and accidental corruption; they are not a security guarantee against a determined student.

Do not redefine:

- Guided completion rules.
- Free-play win/loss rules.
- The one-action-per-turn model.
- XML import/export behavior except where usage tracking needs to observe it.

## Required Reading

Read these first:

- `docs/development/README.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `src/core/levels.js`
- `src/core/turnEngine.js`
- `src/core/scoring.js`
- `src/core/state.js`
- `src/ui/controls.js`
- `src/ui/levels.js`
- `src/ui/blocklyPanel.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/browser/persistence.spec.js`

Use `rg "levelAttemptCount|completeLevel|processTurnActions|teamScores|getWorkspaceXmlText|importWorkspaceXml|download|export"` if symbols have moved.

## Scope

In scope:

- Add lightweight usage tracking for guided levels and free play.
- Add `IndexedDB` persistence for the bounded usage tracker, with startup hydration and pruning.
- Add a student export button or menu item.
- Prompt for student name at export time.
- Export a JSON file with summary and event data.
- Include a SHA-256 integrity hash over the canonicalized payload.
- Add a local analyzer script that reads one or more usage files and prints teacher-friendly summaries.
- Add duplicate/similarity checks that flag likely file reuse or suspiciously similar usage.
- Add tests for payload construction, hash verification, and analyzer behavior.

Out of scope:

- Server validation.
- Account identity.
- Browser fingerprinting.
- Hidden surveillance.
- Network upload.
- Gradebook integration.
- Perfect anti-cheat.

Files and areas likely touched:

- `src/core/state.js`
- `src/core/levels.js`
- `src/core/turnEngine.js`
- `src/core/scoring.js`
- `src/ai/blockly/workspace.js`
- `src/ui/controls.js`
- `src/ui/levels.js` or another appropriate UI module
- `src/usage/` or similar new source folder
- `scripts/` or `tools/` for the local analyzer
- `tests/unit/`
- `tests/browser/`

## Implementation Requirements

### 1. Usage Data Model

Required behavior:

- Track a session id generated locally when usage tracking starts.
- Track app/version metadata where available.
- Track student-entered name only at export time.
- Track guided evidence:
  - levels started
  - levels completed
  - pass/fail results
  - attempt counts
  - turn counts or final turn numbers
  - time started/completed
  - hints/tutorial replay events if available
  - code snapshots for meaningful attempts
- Track free-play evidence:
  - mode
  - map
  - team size
  - opponent type
  - wins/losses or final score
  - turn count
  - relevant code snapshots
- Track Blockly evidence:
  - block counts by type
  - workspace XML snapshots at key moments
  - import/export events if already present

Constraints:

- Keep the event log bounded. Do not store a full XML snapshot every animation frame or every turn unless the workspace changed meaningfully.
- Prefer event summaries plus key snapshots.
- Avoid collecting raw keystrokes or unnecessary personal data.
- Persist the live tracker in `IndexedDB` so a refresh or browser restart does not discard recent evidence.

### 2. Export Format

Required behavior:

- Export a `.json` file.
- Include:
  - `schemaVersion`
  - `exportedAt`
  - `studentName`
  - `sessionId`
  - `appVersion` or build metadata if available
  - `summary`
  - `events`
  - `snapshots`
  - `integrity`
- The `integrity` section should include a SHA-256 hash computed over a canonical JSON string of the payload excluding the integrity field.
- Use the browser Web Crypto API for SHA-256 in the app.
- Use Node `crypto` in the analyzer.

Notes:

- This hash is intended to catch casual edits and corruption. It is not a secret signature.
- If canonical JSON support is implemented manually, keep it deterministic and tested: stable object key ordering, arrays in order, no volatile whitespace dependence.

### 3. Student Export UI

Required behavior:

- Provide a clear export action visible enough for classroom use.
- Ask for the student's name at export time.
- Explain briefly that the file is saved locally and should be submitted to the teacher.
- Do not interrupt gameplay unexpectedly.
- Show success/failure status.

Constraints:

- Keep the UI accessible and narrow-screen friendly.
- Do not add a large new dashboard unless needed.

### 4. Admin Analyzer

Required behavior:

- Add a local script that can analyze one or more exported usage files.
- It should verify the integrity hash.
- It should summarize:
  - student name
  - session id
  - export time
  - guided completion
  - challenge/capstone completions if identifiable
  - free-play performance
  - total play time estimate
  - notable code/block evidence
  - integrity status
  - duplicate or near-duplicate signals
- It should flag:
  - exact same session id across submissions
  - identical integrity hash across submissions
  - suspiciously identical event sequences under different names
  - impossible-looking summaries, such as many wins without corresponding match events
  - invalid or missing integrity hash

Constraints:

- Output can be console text, JSON, or both. Prefer console summary plus optional JSON output.
- Do not claim certainty. Use words such as `verified hash`, `possible duplicate`, `similarity flag`, and `review recommended`.

### 5. Tests

Required behavior:

- Unit-test canonical JSON / hash verification.
- Unit-test summary generation from sample events.
- Unit-test analyzer detection for:
  - valid file
  - edited summary with stale hash
  - duplicate session id
  - identical event sequence under different names
- Browser-test the export UI if practical.
- Usage survives refresh and browser restart through `IndexedDB`.

## Work Plan

1. Inspect existing state and UI hooks for level completion, scoring, workspace snapshots, and import/export.
2. Design the smallest stable usage schema and document it in code comments or a short docs file.
3. Implement usage event capture and summary generation.
4. Implement student export with SHA-256 integrity hash.
5. Implement local analyzer script.
6. Add focused unit and browser tests.
7. Run validation.
8. Write the progress report.

## Validation Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit
npm test
npm run build
npm run test:browser
```

Also run the analyzer manually on at least two sample files, including one intentionally edited file, and document the result in the progress report.

## Validation Checklist

- [ ] Student can export a usage file from the static app.
- [ ] Export prompts for student name.
- [ ] Export includes learning evidence and performance evidence.
- [ ] Export includes deterministic SHA-256 integrity hash.
- [ ] Analyzer verifies valid files and flags edited files with stale hashes.
- [ ] Analyzer flags exact duplicate or suspiciously similar submissions.
- [ ] Tests cover hash and analyzer behavior.
- [ ] Browser export flow works.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:

- The work would require a server, login, or cloud storage.
- The only feasible implementation stores excessive data or personal data.
- A proposed anti-tamper mechanism would be described misleadingly as secure identity proof.
- Usage tracking changes game outcomes or Blockly execution.
- Browser storage limits require a significant persistence redesign not covered here.
