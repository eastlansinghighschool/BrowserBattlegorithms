# Decision Log

Short, owner-facing record of repo-level decisions that affect packet sequencing or shared tooling.

Entry convention: new decisions should use a `**Date:** YYYY-MM-DD` field or an equivalent dated bullet so future agents can distinguish accepted decisions from stale notes.

## Accepted decisions

- 2026-07-07: Adopt Bootstrap packet-status tooling in phases, starting with the core status scripts and local consumer manifest.
- 2026-07-07: Keep existing packet docs in place for now; frontmatter migration and generated-index conversion are deferred to Plan 88.
- 2026-07-16: Reframe the internal `strategy-brain` project as the student-facing **Field Decisions** arc. Keep one Blockly-controlled ally and the persistent shared workspace; preserve the `strategy-brain` id; reserve runner-index role coordination for Team Strategy Script; handle Challenge 28 live-human evidence separately.
- 2026-07-21: Usage Tracker V2 run-version store values (executing Plan 84 B6 for plans 106–110): total byte budget **~2 MB** (owner-selected); per-level guided version cap **K = 5** (keep first + last + most-recent-5 unique runs; owner-selected from options K = 3 / 5 / 8).
- 2026-07-21: Usage Tracker V2 age-eviction posture: the durable learning ledger and run-version store are **exempt from age-based eviction** (bounded by count/budget windows only); the v1 7-day / 20-session age rules apply only to ephemeral churn and raw event tails. Recorded as the only posture consistent with Plan 84's settled D1/D2 cross-session promises; a 90-day backstop was offered and not selected. Owner may override by amending this entry and plans 106/107 before dispatch.

## Proposed but not yet accepted

- None currently recorded.
