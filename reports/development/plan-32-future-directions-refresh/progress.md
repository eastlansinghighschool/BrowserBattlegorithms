# Plan 32 Progress Report: Future Directions Refresh

## Summary

- Rewrote `docs/development/future-directions-analysis/backlog.md` into a short queue view with an active queue and a smaller loose-ideas table.
- Added `docs/development/future-directions-analysis/analysis-index.md` as the consolidated catalog of the archived Claude/Codex/Gemini model notes.
- Moved the three model-perspective files into `docs/development/future-directions-analysis/archive/`.
- Archived this packet to `docs/development/archive/plan-32-future-directions-refresh.md` and updated the packet index in `docs/development/README.md`.

## Archive And Index Notes

- The archived model files remain byte-identical aside from the move.
- The consolidated index only records the three model files; backlog-only ideas stay in the backlog as loose future ideas.
- The seeded tier list mentioned a Plan 31 repair item, but `docs/development/README.md` already marks Plan 31 complete, so it is not repeated in the active queue.

## Validation

- README link sweep: passed after correcting the packet-link paths in `analysis-index.md`.
- `npm test`: passed, `115/115`.
- `npm run build`: passed, with the existing Blockly chunking warnings still present.

## Remaining Risks / Follow-ups

- `git status` still shows unrelated pre-existing worktree files for later plans; I left them untouched.
- The future-directions refresh intentionally did not invent new ideas or change any subsystem notes.
