# Usage and Admin

## Scope

This note owns:
- The usage event taxonomy: which events are canonical, which are noise, and how they are filtered for similarity detection.
- The tracker → IndexedDB → export ladder.
- How the SHA-256 integrity hash is computed and what it covers.
- The admin page surface: what a teacher sees, what anomaly flags mean, and how the browser analyzer relates to the CLI analyzer.
- The regression harness: that its output files are generated artifacts, not committed fixtures.

This note does NOT own:
- The file export UI and download flow — see [file-pipelines.md](./file-pipelines.md).
- The workspace XML snapshot that feeds into usage events — see [blockly-workspace.md](./blockly-workspace.md).
- Level completion and scoring events at the engine level — see [turn-engine.md](./turn-engine.md).

## Surface map

| File | Role |
|---|---|
| `src/usage/usageTracker.js` | Session management, event recording, IndexedDB persistence, export payload assembly, SHA-256 hash via Web Crypto. |
| `src/usage/usageFormat.js` | Canonical event structure, snapshot limits, fingerprint logic (noise filtering). |
| `src/usage/usageAnalyzer.js` | Node-side CLI analyzer: hash verification, guided progress derivation, free-play summary, duplicate and similarity detection. |
| `src/usage/usageAnalyzerBrowser.js` | Browser-side analyzer: same output semantics as the CLI, used by the admin page. |
| `src/usage/guidedProgress.js` | Shared pure guided-progress derivation helper used by both analyzers and future cohort tooling. |
| `src/admin/adminApp.js` | Teacher-facing admin UI: file upload, class table, guided progress story, sequence map, per-student detail view, anomaly flags. |
| `tests/regression/usage-pipeline.spec.js` | Simulates student profiles, exports usage files, post-processes timestamps, re-hashes. |
| `tests/regression/usage-pipeline-admin.spec.js` | Uploads generated files to admin.html, captures screenshots. |

## Session state ladder

Usage data moves through three stages before a teacher can analyze it:

1. **In-memory session**: `usageTracker.js` starts a session on app load with a generated session id. Events are appended in memory as the student plays.
2. **IndexedDB persistence**: the tracker persists the session to IndexedDB after each event so state survives page reload. On load, it hydrates from IndexedDB if a recent session exists.
3. **Exported JSON file**: when the student clicks the usage export button and enters their name, the tracker assembles the canonical payload, computes the SHA-256 hash, and triggers a local JSON download. The file is never sent to a server.

## Canonical event taxonomy

The following events are recorded by the tracker:

| Event | Signal / Noise | Notes |
|---|---|---|
| `session_started` | Signal | Marks session origin. |
| `session_resumed` | Signal | Marks that a prior session was hydrated from IndexedDB. |
| `mode_entered` | Signal | Records which top-level mode (guided / free play) the student entered. |
| `free_play_configured` | Signal | Records mode, team size, and map for a free-play session. |
| `level_started` | Signal | Records which guided level the student attempted. |
| `level_completed` | Signal | Records level id, result (pass/fail), and turn count. |
| `turn_action_completed` | Signal (bounded) | Records the action executed each turn; bounded to prevent log explosion. |
| `score_point` | Signal | Records which team scored. |
| `tutorial_replayed` | Signal | Records when a student re-triggered a tutorial. |
| `workspace_changed` | Noise (excluded from fingerprint) | Fires on every Blockly edit; too frequent to dominate similarity detection. |
| `workspace_imported` | Signal | Records that the student imported a program file. |
| `workspace_exported` | Signal | Records that the student exported a program file. |
| `workspace_snapshot` | Noise (excluded from fingerprint) | Periodic XML capture; stored in the file but excluded from similarity fingerprint. |
| `free_play_summary` | Signal | Records free-play match outcome (scores, rounds). |
| `export_requested` | Signal | Records that the student triggered the export flow. |
| `export_completed` | Signal | Records that the file was successfully downloaded. |

Fingerprints for similarity detection intentionally exclude `workspace_changed` and `workspace_snapshot`. The goal is to detect similar *attempt sequences*, not similar workspace churn.

## Integrity hash

The export file includes a SHA-256 hash computed over the canonical JSON string of the payload, excluding the integrity field itself. Two separate implementations compute the same hash:

- `usageTracker.js` — browser-side, uses Web Crypto API.
- `usageAnalyzer.js` — Node-side CLI, uses Node `crypto`.

The hash detects casual or accidental modification of the export file. It is not a cryptographic signature and does not prove student identity. The analyzer reports hash status as `verified` or `tampered` without claiming certainty.

## Admin page surface

`admin.html` is the teacher-facing review tool. It is excluded from the GitHub Pages build (local-only). Teachers open it in a browser and upload student usage files via file picker or drag and drop.

For each uploaded file, the admin page shows:

- **Identity**: student name, session id, export timestamp.
- **Integrity**: hash status (`verified` / `tampered`).
- **Guided progress**: highest reached, highest passed, highest passed challenge, contiguous pass-through evidence, revisits, and an accessible per-level sequence map.
- **Guided level stats**: levels attempted, levels passed, turn counts, and approximate session span.
- **Free play stats**: matches played, outcomes.
- **Review evidence**: a compact `needs review` indicator for hash mismatch, unknown guided levels, and analyzer warnings.
- **Anomaly flags**: duplicate session ids, identical integrity hashes, similar event fingerprints under different names.
- **Detail view**: event list, snapshot list, suspicious signal summary, guided progress story, accessible sequence map, and exact per-level table.

Anomaly flags use careful language: `possible duplicate`, `similarity flag`, `review recommended`. The system does not claim certainty.

## Browser analyzer vs CLI analyzer

Both analyzers (`usageAnalyzerBrowser.js` and `usageAnalyzer.js`) produce the same output semantics. The difference is runtime:

- **CLI analyzer**: runs in Node; uses Node `crypto`; accepts file paths as arguments; intended for local teacher use before the admin page existed.
- **Browser analyzer**: runs in a browser worker or inline; uses Web Crypto; feeds the admin page UI.

The two paths are designed to agree on hash verification and anomaly detection. If they diverge, that is a bug.
They should also agree on guided progress semantics: the same ordered catalog, the same highest reached / highest passed milestones, and the same exact passed-challenge label.

## Regression harness

The regression harness under `tests/regression/` simulates student profiles, exports usage files, and validates the full pipeline end-to-end:

- `student-profiles.js` — defines simulated student play sequences.
- `usage-pipeline.spec.js` — drives the app as each profile, exports files, spreads timestamps to simulate a real session timeline, re-hashes the exports.
- `usage-pipeline-admin.spec.js` — uploads the generated files to `admin.html`, runs the browser analyzer, captures screenshots.

**Output files under `tests/regression/output/` and `tests/regression/screenshots/` are generated artifacts.** They are run outputs, not committed source fixtures. Do not treat them as stable test fixtures or commit them as part of the source tree.

## Common traps

- **Confusing workspace export with usage export.** The workspace XML export is a program portability file; the usage export is classroom evidence. See [file-pipelines.md](./file-pipelines.md).
- **Assuming `workspace_changed` is a high-signal event.** It fires on every edit and is excluded from fingerprinting because it is too noisy.
- **Treating the regression output folder as committed fixtures.** Those files are regenerated each run.
- **Assuming the hash guarantees identity.** The SHA-256 hash verifies file integrity; it does not prove who the file belongs to.
- **Treating the CLI analyzer and browser analyzer as separate systems.** They should produce identical results on the same input.

## Related

- [file-pipelines.md](./file-pipelines.md) — export/import UI flow and the three file types
- [blockly-workspace.md](./blockly-workspace.md) — workspace events that feed into usage tracking
- [turn-engine.md](./turn-engine.md) — scoring and level-completion events that feed into usage tracking
