# Plan 04b: Local Usage Admin Report Page

## Packet Metadata

- Packet id: plan-04b
- Packet title: Local Usage Admin Report Page
- Status: ready
- Owner/model: frontend implementation agent
- Date: 2026-05-13
- Packet type: frontend / local tooling / classroom evidence
- Mutation level: source-code / tests
- Approval gate: none
- Expected artifacts:
  - local-only browser admin page for usage-file analysis
  - local-only header link visible in dev mode only
  - drag-and-drop and file-picker import for one or more usage files
  - summary table and per-student detail view
  - browser-compatible usage-file verification
  - focused unit/browser tests
  - progress report
- Progress report folder: `reports/development/plan-04b-local-usage-admin-report-page/`
- Progress report file: `reports/development/plan-04b-local-usage-admin-report-page/progress.md`

## Packet Summary

Goal: Replace the teacher-facing console-only workflow with a local browser admin page where the teacher can drop exported student usage files, review a class table, and inspect one student at a time.

Non-goals:

- Do not add a server, login system, cloud upload, telemetry, or hosted admin dashboard.
- Do not include the admin page in the GitHub Pages production build.
- Do not expose the admin link in the GitHub Pages app.
- Do not remove the existing Node analyzer script; it remains useful for command-line/batch checks.
- Do not claim strong anti-cheat proof. This still gives reasonable local evidence and tamper signals.

Depends on:

- Plan 04 usage export format and analyzer behavior.

Why this packet exists:

The current `scripts/analyze-usage-files.js` tool works, but a browser-based local report is much easier for classroom use. The teacher should be able to drag in several student files and quickly see completion, performance, integrity, duplicate/reuse flags, and code evidence without working at a terminal.

## Local-Only Deployment Contract

This page must be available in local development and absent from the production/GitHub Pages build.

Current Vite context:

- `vite.config.js` explicitly builds only:
  - `index.html`
  - `help.html`
- A root-level `admin.html` should be served by Vite dev, but should not be emitted by `npm run build` unless it is added to `rollupOptions.input`.

Required behavior:

- Add an admin page such as `admin.html` for local use.
- Do not add `admin.html` to `vite.config.js` production build inputs.
- Do not place the admin page under `public/`.
- Add the main-app header link only in dev mode, preferably by inserting it from JS when `import.meta.env.DEV` is true.
- After `npm run build`, verify:
  - `dist/admin.html` does not exist
  - no visible Admin/Usage Analyzer link appears in the built `dist/index.html`

Acceptable local URL:

```text
http://127.0.0.1:5173/admin.html
```

## Required Reading

Read these first:

- `docs/development/plan-04-saveable-usage-file.md`
- `reports/development/plan-04-saveable-usage-file/progress.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `scripts/analyze-usage-files.js`
- `index.html`
- `src/main.js`
- `vite.config.js`
- `tests/unit/usage-file.test.js`
- `tests/browser/persistence.spec.js`

Use `rg "usage|integrity|Export Usage|analyze:usage|VITE|rollupOptions|app-header-actions"` if symbols have moved.

## Scope

In scope:

- Add a local-only admin page.
- Add browser-side usage-file parsing and integrity verification.
- Reuse or mirror the Node analyzer's summary and duplicate/similarity logic.
- Add drag-and-drop and file-picker import.
- Render a class summary table.
- Render one-student detail view.
- Show integrity status, duplicate/reuse warnings, guided completion, challenge/capstone completion, free-play evidence, play time estimate, event/snapshot counts, and block/code evidence.
- Add tests that the page is available locally but absent from production build output.

Out of scope:

- Network upload.
- Cloud storage.
- Gradebook export beyond optional local CSV/JSON if easy.
- Editing student files.
- Re-signing or "fixing" invalid usage files.
- Full game replay or code playback.

Files and areas likely touched:

- `admin.html`
- `src/admin/` or similar new folder
- `src/usage/` analyzer helpers
- `src/main.js`
- `src/assets/styles/style.css` or a small admin-specific stylesheet
- `vite.config.js`, only if tests need explicit guardrails; do not add admin to build input
- `tests/unit/usage-file.test.js` or new admin analyzer unit tests
- `tests/browser/` for local admin page and production-build guard

## Implementation Requirements

### 1. Browser Analyzer Helpers

Required behavior:

- Browser code can verify usage-file integrity without Node `crypto`.
- Use Web Crypto SHA-256 in the browser.
- Keep canonical JSON behavior aligned with `src/usage/usageFormat.js`.
- Reuse shared summary/deduplication logic where practical, but do not import `src/usage/usageAnalyzer.js` directly into browser code if it pulls in `node:crypto`.

Suggested approach:

- Extract environment-neutral summary/comparison helpers from `usageAnalyzer.js`, or add a browser-specific analyzer module that uses the same `usageFormat.js` canonicalization.
- Keep the Node script working.
- Unit-test both Node and browser-compatible verification paths if helpers are refactored.

### 2. Admin Page UI

Required behavior:

- The page has a clear local-teacher purpose, such as "Usage File Analyzer."
- The first screen is the tool itself, not a landing page.
- Provide:
  - drag-and-drop zone
  - file picker button
  - loaded-file count
  - clear/reset button
  - class summary table
  - detail panel for selected student/file
- Accept multiple `.json` files at once.
- If a file is invalid JSON or not a usage file, show it in an errors list without blocking valid files.
- Re-analyzing a new batch should not require refreshing the page.

Class table should include at minimum:

- student name
- session id, shortened but inspectable
- export time
- integrity status
- guided passed/completed
- challenge/capstone count
- free-play scores/wins/losses/evidence available
- play time estimate
- event count
- snapshot count
- warning flags

Detail view should include at minimum:

- full metadata and integrity result
- guided summary
- free-play summary
- notable warnings
- recent/significant events
- code snapshot list with block counts and optional XML disclosure

XML snapshots may be visible because this is a teacher/admin local tool, but avoid overwhelming the default view. Prefer collapsible details.

### 3. Duplicate And Suspicion Reporting

Required behavior:

- Flag duplicate session ids.
- Flag identical integrity hashes.
- Flag suspiciously identical event sequences under different names.
- Flag invalid/missing integrity.
- Flag impossible-looking summaries already covered by Plan 04 logic.

Wording should stay probabilistic:

- `verified hash`
- `hash mismatch`
- `possible duplicate`
- `similarity flag`
- `review recommended`

### 4. Local-Only Header Link

Required behavior:

- In local dev, the main app header shows a link/button to the admin page.
- In production build, the link is not present.

Suggested implementation:

- In `src/main.js`, insert the link only when `import.meta.env.DEV` is true.
- Use normal anchor navigation to `./admin.html`.
- Do not statically import admin JS into the main app bundle.

### 5. Tests

Required behavior:

- Unit-test browser-compatible hash verification against a known valid usage payload.
- Unit-test duplicate/similarity reporting if analyzer helpers are refactored.
- Browser-test local admin page:
  - page loads at `/admin.html`
  - file picker or drop path accepts multiple sample usage files
  - table renders rows
  - selecting a row shows detail view
  - invalid/tampered file shows warning
- Browser-test local dev header link appears.
- Build guard test:
  - run or inspect `npm run build` output
  - assert `dist/admin.html` does not exist
  - assert built `dist/index.html` does not include the admin link text

If the existing Playwright default parallel run remains flaky for unrelated reasons, document that separately and still run the targeted admin tests.

## Work Plan

1. Inspect current usage export/analyzer code and Vite build inputs.
2. Design browser-compatible analyzer helpers without breaking the Node script.
3. Add `admin.html` and local admin UI module.
4. Add local-only header link under `import.meta.env.DEV`.
5. Add unit and browser tests.
6. Run targeted validation.
7. Run `npm test` and `npm run build`.
8. Write progress report with build-output guard results.

## Validation Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/usage-file.test.js
npm test
npm run build
npx playwright test tests/browser/<admin-test-file>.spec.js --reporter=line
```

Also manually or automatically verify:

```powershell
Test-Path dist\admin.html
Select-String -Path dist\index.html -Pattern "Usage File Analyzer|Admin"
```

Expected:

- `Test-Path dist\admin.html` returns `False`.
- Built `dist/index.html` does not contain the local admin link text.

## Validation Checklist

- [ ] Local admin page opens in Vite dev.
- [ ] Main app shows admin link in Vite dev.
- [ ] Production build does not emit `admin.html`.
- [ ] Production build does not show the admin link.
- [ ] Teacher can load one or more usage JSON files.
- [ ] Summary table renders useful class-level rows.
- [ ] Detail view renders one selected student/file.
- [ ] Valid files verify their integrity hash.
- [ ] Tampered/invalid files are flagged.
- [ ] Duplicate/similarity signals are shown.
- [ ] Existing Node analyzer still works.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:

- Keeping the admin page out of production build is not possible with the current Vite setup.
- Browser-side verification would require weakening or changing the usage-file hash contract.
- The admin page would require a server or hidden upload endpoint.
- The UI cannot clearly distinguish verified evidence from review-needed warning signals.
