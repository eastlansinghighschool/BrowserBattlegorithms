# Decision Log

Short, owner-facing record of repo-level decisions that affect packet sequencing or shared tooling.

Entry convention: new decisions should use a `**Date:** YYYY-MM-DD` field or an equivalent dated bullet so future agents can distinguish accepted decisions from stale notes.

## Accepted decisions

- 2026-07-07: Adopt Bootstrap packet-status tooling in phases, starting with the core status scripts and local consumer manifest.
- 2026-07-07: Keep existing packet docs in place for now; frontmatter migration and generated-index conversion are deferred to Plan 88.

## Proposed but not yet accepted

- Plan 88: migrate packet docs to Bootstrap-compatible frontmatter and generated index conventions.
- Plan 89: adopt Bootstrap agent prompts and falsification-check prose.
- Plan 90: close out any remaining Bootstrap audit drift and path hygiene follow-ups.
