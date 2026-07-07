---
id: plan-79-admin-guided-progress-story
title: "Admin Guided Progress Story"
status: complete
depends_on: []
gate: "before adding grade-specific targets, database storage, new dependencies, server behavior, or changing usage export format semantics"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Improve the local admin usage view so teachers can see each student's guided progress story: highest reached, highest passed, label-honest passed-challenge evidence, review signals, and an accessible per-level sequence map without semester-specific grading targets.
---
# Plan 79: Admin Guided Progress Story

- Packet id: Plan 79
- Packet title: Admin Guided Progress Story
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent with UI/testing care
- Date: 2026-05-30
- Packet type: implementation / admin UI / usage analysis / docs
- Mutation level: source-code / tests / docs
- Approval gate: before adding grade-specific targets, database storage, new dependencies, server behavior, or changing usage export format semantics
- Expected artifacts:
  - shared pure guided-progress derivation helper with canonical tests
  - sequence-derived guided progress fields in both CLI and browser usage analyzer summaries
  - admin summary table columns for `Highest reached`, `Highest passed`, `Highest/Last passed challenge` with label matched to semantics, and `Needs review`
  - student detail "guided progress story" card
  - accessible guided-level sequence map plus exact per-level table
  - clearer replacement or relabeling for the misleading current `Time (min)` column
  - focused analyzer and admin UI tests
  - `docs/subsystems/usage-and-admin.md` update
  - progress report
- Progress report folder: `reports/development/plan-79-admin-guided-progress-story/`
- Progress report file: `reports/development/plan-79-admin-guided-progress-story/progress.md`

## Packet Summary

Goal: Make the local admin usage view tell a teacher the guided-level progress story for each student, especially highest guided level reached and highest guided level passed, without hard-coding semester-specific grading checkpoints.

Non-goals:
- Do not add fixed columns for particular challenge numbers such as Challenge 22 or Challenge 37.
- Do not embed grading policy, points, full-credit language, AP-specific targets, or semester-specific rubrics.
- Do not build the future cohort-insights/database workflow in this packet.
- Do not change the student usage export schema unless the current exported events are insufficient and the issue is reported first.
- Do not add server storage, cloud sync, online analytics, or external telemetry.
- Do not change guided level ordering, unlock rules, or level source.
- Do not change anomaly detection thresholds beyond surfacing existing signals more clearly.

Depends on:
- Plan 04/04b usage export and local admin analyzer.
- `docs/subsystems/usage-and-admin.md` as the authoritative usage/admin contract.
- Current guided level source of truth in `src/config/levels/`.

Blocks:
- Practical classroom grading from local usage exports when grading is based on guided campaign progress.
- Future cohort-level guided-level insight work, which needs reliable per-student progress summaries first.

Why this packet exists:
Teachers currently see aggregate guided counts, not the actual campaign position a student reached or passed. That makes the admin page less useful for classroom review because `guided passed/of` and `challenge=2` do not say which levels those were. The page should let a teacher click a student and quickly understand the sequence story: how far they got, which level they last passed, whether they revisited earlier levels, and where attempts clustered.

## Authority And Contracts

Obey these sources of truth:
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/file-pipelines.md`
- `docs/TeacherGuide.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/admin/adminApp.js`
- `src/admin/adminStyle.css`
- `src/config/levels/`
- `tests/unit/usage-file.test.js`
- `tests/unit/usage-analyzer-browser.test.js`
- `tests/regression/usage-pipeline-admin.spec.js`

Required product contracts:
- `admin.html` remains local-only and is not added to the Vite production build inputs.
- The CLI analyzer and browser analyzer must produce matching summary semantics for the same usage payload.
- Guided progress derivation must live in one shared pure helper, not duplicated in the browser analyzer, CLI analyzer, and future cohort tooling.
- Usage files remain local JSON files; no server or network analytics.
- Integrity language remains cautious: hash verification detects casual/accidental modification but does not prove identity.
- Admin UI presents evidence, not grading decisions.
- Guided progress must be derived from guided level order, not from the chronological last event alone.

Do not redefine:
- Guided unlock rules.
- Guided level source/order.
- Usage event taxonomy unless a missing field is discovered and reported.
- Similarity/fingerprint philosophy.
- The distinction between usage export and program export.

## Required Reading

Read these before editing:
- `docs/subsystems/usage-and-admin.md`
- `docs/TESTING.md`
- `src/usage/usageFormat.js`
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/admin/adminApp.js`
- `src/admin/adminStyle.css`
- `src/config/levels/index.js`
- `tests/unit/usage-file.test.js`
- `tests/unit/usage-analyzer-browser.test.js`
- `tests/regression/usage-pipeline-admin.spec.js`

Use:

```powershell
rg "guided.levelIds|level_started|level_completed|challengeSummary|playTimeMinutes|classTableBody|detailContent|usage" src tests docs -S
```

## Scope

In scope:
- Add shared helper logic to derive guided progress from exported usage events and guided level order.
- Add durable summary fields:
  - `highestReached`: highest guided level started at least once by sequence order.
  - `highestPassed`: highest guided level completed with `PASSED` by sequence order.
  - `highestPassedChallenge` or `lastPassedChallenge`, with the UI label matching the implemented semantics exactly.
  - `guidedLevelProgress`: per-level attempt/pass/fail/turn/revisit data for the detail view.
- Update the admin summary table to show:
  - student identity
  - integrity
  - `Highest reached`
  - `Highest passed`
  - exact passed-challenge field labeled as `Highest passed challenge` or `Last passed challenge` according to implemented semantics
  - Free Play summary
  - a clearer replacement for misleading `Time (min)`
  - total events/snapshots if space allows
  - `Needs review`
- Add a student detail story card and sequence map.
- Preserve keyboard accessibility for selecting rows and reading details.
- Update tests and subsystem docs.

Out of scope:
- Folder-level cohort insight mining beyond what the admin view already does for loaded files.
- SQL/SQLite/DuckDB or other database integration.
- Agent-query exploration over usage data.
- New analytics export formats.
- Rubric-specific challenge targets.
- New charting dependencies.

Files and areas likely touched:
- `src/usage/usageAnalyzer.js`
- `src/usage/usageAnalyzerBrowser.js`
- `src/admin/adminApp.js`
- `src/admin/adminStyle.css`
- `docs/subsystems/usage-and-admin.md`
- `tests/unit/usage-file.test.js`
- `tests/unit/usage-analyzer-browser.test.js`
- `tests/regression/usage-pipeline-admin.spec.js`

## Implementation Requirements

### 1. Shared Guided Progress Helper Contract

Required behavior:
- Create a shared pure helper module for guided progress derivation. Suggested path:

```text
src/usage/guidedProgress.js
```

- The helper must be usable by:
  - `src/usage/usageAnalyzer.js`
  - `src/usage/usageAnalyzerBrowser.js`
  - future Plan 81 cohort tooling
- The helper must be pure and dependency-light:
  - no DOM access
  - no Node `fs` or filesystem reads
  - no localStorage/IndexedDB access
  - no admin UI imports
  - deterministic output for the same inputs
- The helper should accept level definitions/catalog data as input rather than reading files itself.

Required exported functions:

```js
buildGuidedLevelProgressCatalog(levelDefinitions)
deriveGuidedProgress({ events, summary, levelCatalog })
formatGuidedProgressLabel(progressEntry)
```

Required `buildGuidedLevelProgressCatalog(levelDefinitions)` output shape:
- ordered array of level entries with:
  - `levelId`
  - `title`
  - `orderIndex`
  - `levelKind`
  - `isChallenge`
  - `isOptionalAside`
  - `isRequiredProgression`
  - any display label needed by admin/cohort tooling

Required `deriveGuidedProgress(...)` output shape:
- `highestReached`
- `highestPassed`
- `highestPassedChallenge` and/or `lastPassedChallenge`, with semantics documented
- `latestGuidedActivity`
- `contiguousPassedThrough`
- `guidedLevelProgress`
- `unknownLevelIds`
- `reviewSignals`

Constraints:
- Optional labs must be visible in maps/details but must not inflate core `highestReached` or `highestPassed` progression milestones.
- Prediction checkpoints and bug hunts should be classified from authored level metadata/order/unlock behavior, not guessed. If they are required-progression levels, they may count; if they are optional/asides, they must not inflate core milestones.
- If the current level metadata cannot distinguish required progression from optional aside reliably, stop and report before implementing a guess.
- The helper must expose enough data for the UI to choose honest wording:
  - `highestPassed` means the highest required-progression level individually passed.
  - `contiguousPassedThrough` means every earlier required-progression level through that point was passed.
  - The UI may say "passed through" only when `contiguousPassedThrough` supports it.

Testing requirement:
- Add canonical unit tests for this helper. Browser and CLI analyzer tests should consume the helper output rather than re-testing duplicated logic.

### 2. Derive Guided Progress From Level Order

Required behavior:
- Use the authored guided level order from `src/config/levels/` or a stable manifest derived from it.
- Treat `reached` as at least one `level_started` event for that level.
- Treat `passed` as at least one `level_completed` event with `result: "PASSED"`.
- Compute `highestReached` as the maximum ordered guided level with a start event.
- Compute `highestPassed` as the maximum ordered guided level with a passed completion.
- Do not use the last element of `summary.guided.levelIds` as the sole "highest" signal because students may revisit earlier levels after progressing.
- If a usage file references an unknown level id, preserve it in detail data as unknown and add a cautious review signal rather than crashing.

Constraints:
- Existing usage files should remain analyzable.
- Do not require new events for files already exported by students.
- Keep browser and CLI analyzer semantics aligned.

### 3. Define Challenge Summary Semantics Clearly

Required behavior:
- Replace or supplement count-only `challenge=2` with an exact passed-challenge field.
- Prefer sequence-order meaning over chronological wording if that is clearer. For example, `highestPassedChallenge` may be less ambiguous than `lastPassedChallenge`.
- If the UI label says `Last passed challenge`, it must be based on chronological completion time.
- If the field is based on level order, label it `Highest passed challenge`.
- The packet goal is teacher legibility; choose the label that matches the implemented semantics exactly.

Constraints:
- Do not add hard-coded target chips for specific challenge numbers.
- Do not convert challenge progress into grades.

### 4. Replace Or Relabel Misleading Time

Required behavior:
- The current `Time (min)` table column must not imply active work time if it is really derived from session start/export span.
- Either remove it from the summary table or relabel it to something honest such as `File span`, `Export span`, or `Session span`.
- If per-level time appears in the detail view, mark it as approximate and derive it attempt-locally where possible:
  - completed attempt: `level_started.at` to matching `level_completed.at`
  - abandoned attempt: `level_started.at` to the next `level_started`, mode switch, export event, or session end, and mark approximate
- Prefer `attempts`, `turns`, `passes/fails`, and revisits as stronger learning signals than wall-clock duration.

Stop and report if:
- Existing timestamps are too sparse to support even approximate per-level duration honestly.

### 5. Admin Summary Table

Required behavior:
- Add summary columns:
  - `Highest reached`
  - `Highest passed`
  - `Highest passed challenge` or `Last passed challenge` depending on the chosen exact semantics
  - `Needs review`
- `Needs review` should compactly indicate whether suspicious signals exist, hash mismatch exists, unknown levels exist, or other analyzer warnings require teacher attention.
- Keep the table scannable on classroom laptops; avoid a wide wall of low-value columns.

Constraints:
- Preserve row click and keyboard activation.
- Preserve existing duplicate/similarity flag section.
- Do not hide integrity status.

### 6. Student Detail Story

Required behavior:
- Add a top detail-card summary in plain teacher-facing language, for example:
  - `Highest reached: Level 24: How Far Away; highest passed: Challenge 22: Show What You Know; latest guided activity: Level 18: Stay Still Can Do Something.`
- The story must distinguish:
  - highest reached
  - highest passed
  - whether "passed through" is true for required-progression levels, using `contiguousPassedThrough`
  - latest guided activity
  - revisits/backtracking if detected
- Do not make claims about why the student stopped or whether they understood a concept.
- Do not say "passed through" unless the helper reports contiguous required-progression passes through that level.

### 7. Guided-Level Sequence Map

Required behavior:
- In the student detail view, render a guided-level sequence map with one item per guided level in authored order.
- Each item should visibly distinguish at least:
  - not reached
  - started but not passed
  - failed at least once
  - passed
  - challenge/synthesis level
  - optional/asides such as optional labs, if present
  - revisited/repeated attempts
- Each item should include accessible text with level number/title/id, attempts, pass/fail counts, turns when available, and approximate duration only if implemented honestly.
- Provide a table or list equivalent below or alongside the map so the same data is available without relying on color or tiny cells.

Constraints:
- Do not add a charting dependency.
- Use CSS/HTML in `src/admin/` only.
- Preserve color-contrast basics and keyboard/screen-reader legibility.

### 8. Tests

Required behavior:
- Add unit tests covering:
  - shared helper has canonical behavior independent of browser/CLI analyzer wrappers
  - highest reached differs from chronological latest activity after a student revisits an earlier level
  - highest passed ignores failed-only later levels
  - optional labs do not inflate core highest reached/passed progression
  - contiguous passed-through wording is false when an earlier required-progression level is missing
  - passed challenge summary names the exact challenge rather than only a count
  - repeated attempts aggregate per level
  - unknown level ids do not crash and create a review signal
  - browser analyzer and CLI analyzer agree on new fields
- Update or add admin/browser regression coverage to verify:
  - summary table renders the new columns
  - clicking a student row shows the story card
  - guided sequence map or equivalent detail table is present
  - the former misleading `Time (min)` wording is removed or relabeled

## Work Plan

1. Inspect current analyzer output shape, admin table rendering, and regression tests.
2. Add guided progress derivation in the shared helper with CLI/browser parity.
3. Update analyzer summaries with exact progress fields and review signals.
4. Update the admin summary table and detail view.
5. Add CSS for the sequence map and accessible detail table.
6. Add focused unit tests.
7. Add or update admin regression tests.
8. Update `docs/subsystems/usage-and-admin.md`.
9. Run validation and write the progress report.

## Validation Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/usage-file.test.js
node --test --test-isolation=none tests/unit/usage-analyzer-browser.test.js
npm test
npm run test:browser:tooling
npm run build
```

If the implementation touches shared browser behavior outside `admin.html`, also run:

```powershell
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Summary table shows highest reached, highest passed, exact passed challenge, and needs-review evidence.
- [ ] Summary table no longer presents multi-day export/session span as plain `Time (min)`.
- [ ] Detail view tells a guided progress story without grade/rubric language.
- [ ] Detail view includes an accessible guided-level sequence map and exact per-level data.
- [ ] Backtracking/revisits do not lower highest reached or highest passed.
- [ ] Failed-only later levels count as reached but not passed.
- [ ] Unknown level ids are surfaced cautiously and do not crash analysis.
- [ ] CLI and browser analyzer semantics match.
- [ ] Existing duplicate/similarity/hash warnings still render.
- [ ] `admin.html` remains local-only and absent from Vite production build inputs.
- [ ] `docs/subsystems/usage-and-admin.md` reflects the new admin surface.
- [ ] Required tests and build pass.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:
- The exported event data cannot support highest reached/highest passed for existing files.
- The implementation would require a usage export schema migration that breaks old student files.
- The only clean approach requires adding a database, dependency, server, or build-pipeline change.
- Browser and CLI analyzer semantics would diverge.
- The UI would need hard-coded grading targets to satisfy the request.
- The sequence map cannot be made accessible without a broader admin UI redesign.
- Validation fails in a way that changes scope.

## Future Direction Note: Cohort Insights

This packet intentionally stops at per-student progress storytelling. A later packet should explore cohort-level guided insights from a folder of usage files. That future work may be stronger as an analysis database workflow: load usage exports into a local SQLite/DuckDB-style database, give an analysis agent safe query access plus look-for prompts, and crystallize useful recurring investigations into saved queries. Candidate future insights include friction hotspots, challenge cliffs, too-easy levels, revisit patterns, bug-hunt predictive value, navigation confusion, and UI/UX pain points.
