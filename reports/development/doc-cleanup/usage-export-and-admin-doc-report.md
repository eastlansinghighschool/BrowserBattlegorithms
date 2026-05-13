## The short read

The docs are good at saying **there is a usage export** and **there is an analyzer**, but they are much less clear about:

- which events are canonical and which are just supporting noise
- what gets hashed
- which parts are student-facing vs teacher-facing
- how the admin review UI interprets the file
- why the regression harness creates generated artifacts instead of checked-in fixtures

That means a future agent can probably find the code paths, but it has to infer the pipeline logic rather than reading it cleanly from the docs.

## What the docs already explain well

The key docs are doing some real work here:

- `docs/development/plan-04-saveable-usage-file.md` is the strongest source of truth for the pipeline design.
- `docs/TESTING.md` correctly says the suite covers malformed XML feedback, local storage persistence, and browser validation.
- `docs/TeacherGuide.md` and `docs/StudentGuide.md` explain that student export exists and is local.
- `docs/development/README.md` gives the packet-level framing for Plan 04 and the later regression work.

So the broad purpose is documented: students export usage evidence, and teachers analyze it locally.

## What the code actually does, in a way the docs don’t fully spell out

### 1. Usage collection is event-driven and lives in memory first

The main capture layer is [src/usage/usageTracker.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageTracker.js).

The tracker:
- starts a local session with a generated session id
- hydrates from IndexedDB if a recent session exists
- appends structured events as the app runs
- keeps a bounded set of events and snapshots
- persists back to IndexedDB
- exports only when the student explicitly asks

That is a nice pipeline, but the docs do not clearly explain the state ladder:
- in-memory session
- persisted session in IndexedDB
- exported JSON file

The docs mention local storage/persistence at a high level, but the actual tracker model is more specific now.

### 2. The canonical event set is broader than the docs suggest

The canonical events are defined by the tracker and format logic. The most important ones are:

- `session_started`
- `session_resumed`
- `mode_entered`
- `free_play_configured`
- `level_started`
- `level_completed`
- `turn_action_completed`
- `score_point`
- `tutorial_replayed`
- `workspace_changed`
- `workspace_imported`
- `workspace_exported`
- `workspace_snapshot`
- `free_play_summary`
- `export_requested`
- `export_completed`

The docs don’t list these in one place.

That matters because a future agent looking only at the docs might think the export file is just “level completed plus final score,” when in reality it captures much more of the session story.

### 3. Some events are signal, some are noise

This is one of the biggest “docs need help here” areas.

In [src/usage/usageFormat.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageFormat.js):

- the summary tracks meaningful totals and last-known state
- workspace snapshots are bounded
- event fingerprints intentionally ignore `workspace_changed` and `workspace_snapshot` because they are too noisy to dominate similarity detection

That noise/signal distinction is important:
- the export file still stores snapshots
- the analyzer still summarizes them
- but similarity comparisons intentionally de-emphasize workspace churn

The docs say “similarity” and “duplicate checks,” but they do not clearly explain that the analyzer is trying to ignore superficial workspace churn while preserving meaningful attempt sequences.

### 4. The integrity model is well-defined in code, but not very visible in docs

The export file gets a SHA-256 hash over the canonical JSON payload excluding the integrity field.

That’s implemented in:
- [src/usage/usageAnalyzer.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzer.js) for the Node path
- [src/usage/usageTracker.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageTracker.js) for the browser export path
- [src/usage/usageAnalyzerBrowser.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzerBrowser.js) for browser-side verification

This part is technically strong, but the docs don’t clearly distinguish:
- the canonical JSON string
- the integrity hash
- the fact that the hash is not a secret signature
- the difference between Node crypto in the analyzer and Web Crypto in the browser export path

The packet docs mention integrity checks, but the ecosystem docs don’t yet make the hash model easy to discover.

## Interface points between capture and download

This is where the app-facing UX and the usage pipeline meet.

### In-app export button

The export control lives in [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js).

What it does:
- prompts for the student name
- calls `usageTracker.exportUsageFile(studentName)`
- receives a payload plus filename
- downloads the JSON locally as a browser Blob
- shows success/failure status in the UI

That’s a nice direct student interaction path, but the docs don’t clearly separate this from program export/import or private Free Play files.

A future agent could easily confuse:
- workspace export
- usage export
- private encrypted program export

Those are distinct flows now.

### UI feedback

The usage export status is surfaced in the Blockly panel / controls flow. It is student-visible, but still a small local status rather than a big dashboard.

That’s good UX, but the docs do not really tell a future agent where to look for those status messages or how they relate to the file download.

## Admin review surface

The admin app is the teacher-side review tool, and it is much more than “just a file uploader.”

Relevant file:
- [src/admin/adminApp.js](C:/Codex/BrowserBattlegorithms_CODEX/src/admin/adminApp.js)

What the admin UI does:
- accepts uploaded `.json` usage files via file picker or drag/drop
- rejects non-usage files
- summarizes each submission
- flags:
  - duplicate session ids
  - identical integrity hashes
  - similar event sequences under different names
- displays integrity status
- shows a detail view with:
  - student identity
  - guided level stats
  - free play stats
  - event list
  - snapshot list
  - suspicious signals

The docs mention an analyzer, but they do not tell the teacher-side story this concretely.

That’s a gap because the admin UI is the thing that makes the export file useful in a classroom setting.

## Analyzer behavior: the docs need more help here

The analyzer is actually quite carefully designed.

Relevant files:
- [src/usage/usageAnalyzer.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzer.js)
- [src/usage/usageAnalyzerBrowser.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzerBrowser.js)

What it checks:
- integrity hash
- guided completion counts
- free play evidence
- total play time estimate
- event fingerprint
- duplicate session ids
- duplicate hashes
- similar event fingerprints under different names

What it does **not** claim:
- perfect cheating detection
- identity proof
- certainty

The docs do use careful language in the packet, which is good. But the broader repo docs still don’t explain the analyzer’s philosophy very explicitly:
- verified hash
- possible duplicate
- similarity flag
- review recommended

That wording matters because it keeps the system honest.

## Regression harness and generated artifacts

The regression script is clever, but it is also the kind of thing that future agents will misunderstand if it isn’t documented well.

Relevant files:
- [tests/regression/usage-pipeline.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/usage-pipeline.spec.js)
- [tests/regression/usage-pipeline-admin.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/usage-pipeline-admin.spec.js)
- [tests/regression/student-profiles.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/student-profiles.js)
- [tests/regression/timestamp-spreader.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/timestamp-spreader.js)

What this harness does:
- simulates a handful of student profiles
- exports usage files
- post-processes timestamps so the files look like a real session timeline
- re-hashes the exports
- runs the CLI analyzer
- uploads results to admin.html
- captures screenshots as evidence artifacts

The key documentation gap is this:
- the generated files under `tests/regression/output/`
- and screenshots under `tests/regression/screenshots/`

are run artifacts, not source fixtures.

That distinction should probably be documented in the repo or packet notes, because otherwise agents might think they should be committed or treated as stable fixtures.

## What docs usually miss

Here’s the clearest breakdown.

| Surface | Docs coverage | What’s clear | What still needs help |
|---|---|---|---|
| Usage capture | Medium | There is local evidence tracking and session export. | The event taxonomy and the in-memory → IndexedDB → export chain. |
| Integrity hash | Medium | There is tamper checking. | Canonical JSON, exact hash scope, and Node-vs-browser hashing paths. |
| Export download UI | Low-medium | Students can export usage locally. | Where the button lives, what it prompts for, and how it differs from workspace export. |
| Analyzer logic | Medium | Teachers can analyze files locally. | Which anomalies are meaningful, and how similarity detection works. |
| Admin review UI | Low-medium | Files can be uploaded and reviewed. | What the table/detail/flags views show and why. |
| Regression harness | Low | It exists and is useful. | That it generates artifacts, spreads timestamps, and is not a committed fixture set. |

## Interactions with other surfaces

This pipeline touches a lot of the app, and that’s part of why it needs a better map.

### Blockly workspace events
The usage tracker listens to:
- workspace changes
- workspace imports
- workspace exports
- snapshots

That means Blockly is not just a UI feature here; it is one of the main inputs to evidence generation.

Relevant file:
- [src/ai/blockly/workspace.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/blockly/workspace.js)

### Guided and free-play mode changes
The tracker records mode entries and free-play configuration changes. That makes the export useful for classroom behavior analysis, but it also means mode transitions are part of the evidence model.

Relevant file:
- [src/ui/controls.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ui/controls.js)

### Level completion and scoring
The usage pipeline relies on level completion and score events to reconstruct guided progress and free-play outcomes.

Relevant files:
- [src/core/levels.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/levels.js)
- [src/core/scoring.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/scoring.js)
- [src/core/turnEngine.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/turnEngine.js)

### Browser vs Node analyzer paths
There are two analysis consumers:
- browser-side admin review
- Node-side CLI analysis

They share the same semantics, but the docs don’t really teach that as a paired design.

## What is well documented versus what needs help

### Well documented
- there is a usage export
- the export is local
- the analyzer is local
- integrity checking exists
- the admin UI exists
- regression files exist for the pipeline

### Needs more doc help
- the event model
- what counts as signal versus noise
- how hashes are computed and verified
- how the analyzer interprets similar usage
- what the admin UI is showing
- which regression artifacts are generated vs source

## My practical recommendation

If we want this area to be easy for future agents, the docs should probably include a small “Usage Pipeline” note that answers:

1. What gets recorded during a session
2. What gets stored locally before export
3. What gets included in the export file
4. What the integrity hash covers
5. How the analyzer reasons about duplicates and similarity
6. What the admin page is for
7. Which regression artifacts are just run outputs

That would go a long way toward making this subsystem legible.

## Evidence I used

- [src/usage/usageTracker.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageTracker.js)
- [src/usage/usageFormat.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageFormat.js)
- [src/usage/usageAnalyzer.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzer.js)
- [src/usage/usageAnalyzerBrowser.js](C:/Codex/BrowserBattlegorithms_CODEX/src/usage/usageAnalyzerBrowser.js)
- [src/admin/adminApp.js](C:/Codex/BrowserBattlegorithms_CODEX/src/admin/adminApp.js)
- [tests/regression/student-profiles.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/student-profiles.js)
- [tests/regression/usage-pipeline.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/usage-pipeline.spec.js)
- [tests/regression/usage-pipeline-admin.spec.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/usage-pipeline-admin.spec.js)
- [tests/regression/timestamp-spreader.js](C:/Codex/BrowserBattlegorithms_CODEX/tests/regression/timestamp-spreader.js)
- [docs/development/plan-04-saveable-usage-file.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/plan-04-saveable-usage-file.md)
- [docs/development/plan-16-usage-pipeline-regression.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/development/plan-16-usage-pipeline-regression.md)
- [docs/TESTING.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TESTING.md)
- [docs/TeacherGuide.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TeacherGuide.md)
- [docs/StudentGuide.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/StudentGuide.md)