# Archive Packets Prompt

You are doing a docs-only Browser Battlegorithms hygiene pass.

Goal: move newly-complete packet files into `docs/development/archive/`, update `docs/development/README.md` links, and preserve the packet history cleanly.

Use `docs/development/README.md` as the source of truth for packet status. Only packets whose status is exactly `complete` are eligible to move.

Rules:

- Move only rows marked `complete`.
- Do not move packets marked `ready`, `draft`, `in-progress`, or `deprecated`.
- Leave the deprecated Plan 25 cluster in place unless the owner explicitly tells you otherwise. If all of its supersessors are archived, report that fact instead of acting on it.
- Use `git mv` for every move so history is preserved.
- Keep packet contents byte-identical. Do not edit packet bodies unless the owner explicitly asked for a one-line archive badge.
- Rework the README into two tables: `Active Packets` and `Completed Packets`.
- Preserve packet sequence order within each table.
- Do not change any `Status` or `Purpose` text.
- Completed packet links in the README must point to `archive/<filename>.md`.
- Active packet links must keep their current paths.

Validation:

- Every link in `docs/development/README.md` must resolve to an existing file.
- `npm test` must pass.
- `npm run build` must pass.
- `git status` must show only the expected packet moves, the README edit, this prompt file, and the progress report.

Stop conditions:

- A README status is something other than `ready`, `draft`, `in-progress`, `complete`, or `deprecated`.
- A `complete` row has no matching packet file, or a packet file is not listed in the README.
- A README link would break after the move.
- Validation fails.

Progress report:

- Write `reports/development/archive-hygiene-<YYYY-MM-DD>/progress.md`.
- Include:
  - moved files
  - README structure choice
  - whether an archive badge line was added
  - any owner questions or mismatches
  - validation results

If there are no newly-complete packets to move, write a one-line progress report saying no archival was needed and stop.
