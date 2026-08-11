# Future Directions Backlog

This is the short queue view. Read [analysis-index.md](analysis-index.md) for the full model-file catalog and [../README.md](../README.md) for shipped packet tracking.
Plan 31's repair note is already complete in the packet index, so it is not repeated here.

## Active Queue

| Direction | Packet | Status | Notes |
| --- | --- | --- | --- |
| Teacher timing and facilitation kit | Plan 33 | draft | Teacher-facing pacing, intervention prompts, Hour-of-Code subset, and AP CSA discussion themes. |
| Accessibility board narration | — | upcoming | First accessibility slice: narrate board state clearly after turns, then layer keyboard-only and contrast work later. |
| Level authoring contract linter | Plan 34 | ready | Developer-side linter for curriculum contracts across guided levels. |

## Loose Future Ideas

| Direction | Status | Notes |
| --- | --- | --- |
| Prediction-first checkpoints / AP CSA preview cards / bug-hunt levels | queued — B | Ask students to predict before running, then bridge to Java or reverse-engineering later. |
| Deterministic replay / tournament-in-a-box | queued — C | Make the seedable replay descriptor first; the tournament depends on that decision. |
| Progressive free-play challenge cards | deferred | Keep the daily-puzzles idea as scenario cards only if classroom feedback wants it. |
| Embedded formative assessment checkpoints | deferred | Same family as prediction; revisit after prediction lands. |
| Strategy reflection export | deferred | Hold until usage evidence shows whether export would help teachers. |
| Guided misconception detectors | deferred | Wait for concrete classroom stuck points before adding inline lint-style warnings. |
| Wrong-runner scoring coach | deferred | Plan 55's event breadcrumb can later drive a Plan 38-style hint when a non-target ally scores in a runner-specific win-condition level. |
| Sensor sandbox / API explorer | deferred | Trace playback already covers much of the intuition gap. |
| Replay viewer UI / game history and replays | deferred | Separate from the RNG decision; build only if teachers ask for step-through replay. |
| Advanced multi-ally coordination levels | deferred | Keep for post-project-saturation exploration. |
| Code-aware / threshold-based similarity detection | deferred | Plan 109 review (decision log 2026-07-22): the exact-equality fingerprint + xmlHash makes the current flag import-forensic and rare. A future design packet should weigh threshold-based sequence similarity and/or id-normalized program hashing, with false-positive analysis (on-rails guided sequences, near-reference solutions) and classroom-evidence requirements. |
| Collision/waste event tracking for star criteria | deferred | Plan-113 gate (decision log 2026-08-05): no-collision and no-wasted-resource were dropped because no level-run counters exist at level end. Building per-run collision and wasted-resource tracking (likely from the Plan 35 event log) unlocks honest star-3 criteria on scrimmage and resource levels beyond Phase 6's both-allies-active. |
| Capstone step-9 fixture tuning (advanced-scrimmage) | superseded by plan-114 | Documented debt (tests/unit/guided-project-solutions.test.js:31-45): the team-strategy-script step-9 checkpoint fixture fails the current NPC layout (turn 56 vs limit 55). plan-114 owns the winnability repair; behavior evidence suggests NO canonical fixture currently passes the capstone within the limit. |
| Automated barrier path counting | deferred | Useful only if level path-space audits prove necessary. |
