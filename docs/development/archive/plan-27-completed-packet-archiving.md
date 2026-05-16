# Plan 27: Completed Packet Archiving + Reusable Hygiene Prompt

## Packet Metadata

- Packet id: plan-27
- Packet title: Completed Packet Archiving + Reusable Hygiene Prompt
- Status: complete
- Owner/model: implementation agent (small/cheap model is sufficient)
- Date: 2026-05-15
- Packet type: docs / repo hygiene
- Mutation level: docs-only (file moves, README edits, one new file)
- Approval gate: none
- Expected artifacts:
  - `docs/development/archive/` directory containing all currently-complete packet files
  - updated `docs/development/README.md` with a split between active and completed packets
  - new `docs/development/archive-packets-prompt.md` containing a reusable hygiene prompt for future maintenance passes
  - progress report
- Progress report folder: `reports/development/plan-27-completed-packet-archiving/`
- Progress report file: `reports/development/plan-27-completed-packet-archiving/progress.md`

## Packet Summary

Goal: Move every packet currently marked `complete` in `docs/development/README.md` into a new `docs/development/archive/` subdirectory, restructure the README so the active packet table is short and the completed packets live in a second compact table, and ship a reusable archival prompt so future hygiene passes can be delegated to a cheap model in one shot.

Non-goals:

- Do not edit packet content. The packets are historical artifacts and must remain bitwise identical after the move (except for an optional one-line "archived YYYY-MM-DD" badge at the very top — see Requirement 2).
- Do not archive packets with status `ready`, `draft`, `in-progress`, or `deprecated`. Leave them in `docs/development/`.
- Do not move starting prompts (`00-mini-packet-agent-starting-prompt.md`, `00-orchestrator-thread-starting-prompt.md`) or any non-packet file (`packet-creation-guidance.md` lives in `docs/`, not here; the future-directions analysis folder is separate).
- Do not change link targets in packets that reference one another. The README is the only document that should need link updates; cross-packet references inside archived packets are historical and may legitimately go stale.
- Do not deploy.

Depends on:

- Current state of `docs/development/README.md` and the packet files it indexes.

Blocks:

- Faster orchestration and implementation thread startup: less noise in the active packet folder, less context loaded when an agent skims `docs/development/`.
- Future hygiene cycles: the reusable prompt produced here is the mechanism for keeping the folder clean.

Why this packet exists:

`docs/development/` currently holds 34 markdown files and the README packet table has 29 packet rows, most of them complete. Both numbers grow on every cycle. Active implementer and orchestration threads load this folder routinely. Separating finished work from in-flight work makes the active surface smaller without losing history, and producing a reusable hygiene prompt means subsequent passes cost a single cheap model invocation rather than another orchestration thread.

## Authority And Contracts

Sources of truth:

- `docs/development/README.md` — packet index and status column. The status column is authoritative for what counts as `complete`.
- `docs/packet-creation-guidance.md` — packet location convention.
- The packet files themselves — bodies must not change semantically.

Required product contracts:

- Every currently-complete packet remains discoverable from `docs/development/README.md` with a working relative link to its new location.
- No active packet is moved.
- The deprecated entry for Plan 25 stays put (its supersessors 25a and 25b are referenced from it; moving the deprecated entry while supersessors are active fragments the cluster — leave the whole cluster in place until everything in it is complete and the owner approves archiving).
- The reusable prompt is self-contained: a future thread reading only that file and the README should be able to complete a hygiene pass without further context.

Do not redefine:

- Packet status vocabulary (`ready` / `draft` / `in-progress` / `complete` / `deprecated`).
- The packet-creation-guidance contract that packets live in `docs/development/`. Archived packets are still "in `docs/development/`," just one directory deeper.

## Required Reading

- `docs/development/README.md`
- `docs/packet-creation-guidance.md`
- Spot-check 2-3 packet files to confirm the move is a clean `git mv` with no embedded path assumptions.

Use `ls docs/development/*.md` and `grep -E "^\| \[Plan" docs/development/README.md` to enumerate the work.

## Scope

### In scope

- Create `docs/development/archive/` (empty `.gitkeep` not required if at least one file lives in it after the move).
- For every row in the README packet table with status exactly `complete`, move the corresponding packet file from `docs/development/` to `docs/development/archive/` using `git mv` so history is preserved.
- Update the README's packet table to either (a) split into two tables — "Active Packets" and "Completed Packets" — or (b) keep one table with the link path updated for archived rows. Recommended: two tables. Active table holds `ready`, `draft`, `in-progress`, and `deprecated` rows in current sequence order. Completed table holds `complete` rows in current sequence order with link paths pointing to `archive/<filename>`.
- Optionally append a single line to each archived packet's metadata block (top of file, immediately after the existing status line): `- Archived: 2026-05-15`. Skip this if it would require touching frontmatter or other structured metadata; for the project's current freeform metadata bullets, a single appended line is safe. The progress report should note whether the archived-date line was added.
- Create `docs/development/archive-packets-prompt.md` containing the reusable hygiene prompt (see Requirement 3).
- Write the Plan 27 progress report.

### Files and areas likely touched

- `docs/development/archive/plan-*.md` (new locations of archived packets — moves, not copies).
- `docs/development/README.md` (table restructure).
- `docs/development/archive-packets-prompt.md` (new).
- `reports/development/plan-27-completed-packet-archiving/progress.md` (new).

### Out of scope

- Editing packet body content.
- Archiving anything not marked `complete`.
- Moving non-packet files (starting prompts, guidance docs, future-directions folder).
- Changing the deprecated Plan 25 entry until its supersessors are complete.
- Any source code, test, or build change.

## Work Plan

1. Read `docs/development/README.md` and enumerate every row with status `complete`. Cross-check against `ls docs/development/plan-*.md` to confirm each row maps to a real file.
2. `mkdir docs/development/archive` (or platform equivalent).
3. For each completed packet, `git mv docs/development/<filename>.md docs/development/archive/<filename>.md`. Use `git mv` rather than a filesystem move so history follows.
4. Update README:
   - Split the packet table into "Active Packets" and "Completed Packets" sections, or update link paths in place. Two tables is preferred.
   - Update each archived row's link to `archive/<filename>.md`.
   - Leave active rows (ready, draft, in-progress, deprecated) and starting-prompt rows untouched in their section.
   - Preserve packet sequence order within each table.
5. Optionally append `- Archived: 2026-05-15` to each archived packet's metadata bullet block. Skip if structure varies; document the call in the progress report.
6. Create `docs/development/archive-packets-prompt.md` with the reusable prompt content from Requirement 3.
7. Run validation: every link in the new README resolves, no active packet was moved by mistake, `npm test` and `npm run build` still pass (not because docs broke them, but as a sanity check that nothing was edited unintentionally).
8. Write the progress report listing every moved file and the README structure chosen.

## Implementation Requirements

### Requirement 1: Archive directory and moves

Required behavior:

- `docs/development/archive/` exists after this packet lands.
- Every packet whose README row currently reads status `complete` has been moved to `docs/development/archive/` via `git mv`.
- No packet whose README row is `ready`, `draft`, `in-progress`, or `deprecated` is moved.
- File contents are byte-identical to pre-move except for the optional `- Archived: 2026-05-15` line if added (Requirement 2).

Constraints:

- Use `git mv`, not raw filesystem operations. This preserves rename detection in `git log` and `git blame`.
- Do not batch-move with shell glob expansion that could accidentally capture in-flight or starting-prompt files. Enumerate the list explicitly from the README's `complete` rows.

Edge cases:

- If the README lists a `complete` packet but the file does not exist (or vice versa): stop and surface the inconsistency in the progress report. Do not invent or delete files to fix it.
- If a packet status is something other than the five known values (`ready`, `draft`, `in-progress`, `complete`, `deprecated`): stop and ask.

Expected artifact:

- All completed packet files relocated; no other files moved.

### Requirement 2: README restructure

Required behavior:

- The README packet section is split (or otherwise reorganized) so active and completed packets are visually distinct.
- Recommended structure: keep the existing `## Packet Index` heading, place an "### Active Packets" table with `ready` / `draft` / `in-progress` / `deprecated` rows and the two `00-...` starting-prompt rows, then an "### Completed Packets" table with `complete` rows.
- All link paths point to the file's current location: active rows keep their existing relative paths; completed rows use `archive/<filename>.md`.
- Sequence order within each table is preserved.

Constraints:

- Do not change the columns of the tables (`Packet | Status | Purpose`).
- Do not change the Status text or Purpose text for any row.
- Do not introduce new sections, prose, or commentary in the README beyond what's needed to label the two tables.
- Keep the rest of the README (Future Directions, Cross-Packet Contracts, Current Validation Baseline) untouched.

Edge cases:

- The deprecated Plan 25 row remains in the active table. Its body still references `plan-25a-...` and `plan-25b-...`, which are themselves active or completed; if 25a is now `complete`, its archive link in the Completed Packets table is what users follow.
- If two tables produce awkward whitespace on rendering, fall back to one combined table with link paths updated. Note the decision in the progress report.

Expected artifact:

- Restructured `docs/development/README.md` with all link paths correct.

### Requirement 3: Reusable archival prompt

Required behavior:

- Create `docs/development/archive-packets-prompt.md`. The file is a single self-contained instruction block intended to be fed verbatim to a small/cheap model in a future hygiene pass. The owner copies the prompt body into the model's input; the prompt itself contains everything the model needs.
- The prompt must:
  - State the goal (move newly-completed packets to `archive/`, update README links).
  - Reference `docs/development/README.md` as the source of truth for status.
  - Specify the move-eligibility rule: status exactly `complete`. Do not move `ready`, `draft`, `in-progress`, or `deprecated`.
  - Specify the deprecated-cluster rule: if a deprecated packet's supersessors are all complete and have been archived, surface that fact in the report rather than acting; the owner decides whether to archive the deprecated entry too.
  - Specify the use of `git mv` for history preservation.
  - Specify the README table convention (two tables: Active and Completed; preserve sequence order; never edit Status or Purpose text).
  - Specify validation: `npm test` and `npm run build` must still pass; every README link must resolve.
  - Specify a stop condition for ambiguities (status the model doesn't recognize, file/README mismatch, link breakage).
  - Specify a short progress report format: list of moved files, README structure note, any flagged owner decisions.
  - Instruct the agent to write the progress report at `reports/development/archive-hygiene-<YYYY-MM-DD>/progress.md`.
- The prompt is one document; do not split across multiple files.
- Keep the prompt under ~150 lines. Brevity matters because this file gets pasted into a context-limited cheap model.

Constraints:

- The prompt must be runnable in isolation. A model with no prior context about Browser Battlegorithms should be able to follow it given only the prompt body, the README, and access to `docs/development/`.
- Do not assume the running model has access to the integration owner. Stop conditions resolve by writing the question into the progress report and halting.

Edge cases:

- If no newly-complete packets exist on a run, the prompt should produce a one-line "no archival needed" progress report and exit cleanly.
- If the model finds a status it doesn't recognize, it stops without modifying anything.

Expected artifact:

- `docs/development/archive-packets-prompt.md` — single self-contained reusable prompt document.

### Requirement 4: Validation

Required behavior:

- After all moves and edits: every link in `docs/development/README.md` resolves to an existing file.
- `npm test` passes.
- `npm run build` passes.
- `git status` shows only the expected moves, README edit, new prompt file, and progress report. No accidental source or test changes.

Constraints:

- If validation fails for any reason, stop and report. Do not "fix forward" by editing source.

Expected artifact:

- Clean validation pass logged in the progress report.

## Model-Specific Instructions

- Start by listing every README row with status `complete` and matching filename. Confirm the list with `ls docs/development/plan-*.md` before any move.
- Use `git mv` for every move. Do not copy-and-delete.
- Do not edit packet bodies beyond the optional one-line `- Archived: ...` addition, and only add that line if the existing metadata structure makes it safe.
- Treat any ambiguity as a stop condition; surface it in the progress report rather than guessing.
- The reusable prompt is a deliverable, not scaffolding. Treat it as production text: clean, scannable, self-contained.

## Commands

Run from the repository root:

```powershell
git status
ls docs/development/
git mv docs/development/<filename>.md docs/development/archive/<filename>.md
npm test
npm run build
git status
```

## Validation Checklist

- [ ] `docs/development/archive/` exists and contains every packet file marked `complete` in the previous README.
- [ ] No `ready` / `draft` / `in-progress` / `deprecated` packet was moved.
- [ ] No non-packet file was moved.
- [ ] `docs/development/README.md` lists active and completed packets in clear separate tables (or a single table with archive-path links — note the chosen structure).
- [ ] Every README link resolves to an existing file.
- [ ] `docs/development/archive-packets-prompt.md` exists, is self-contained, and is under ~150 lines.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `git status` shows only the expected changes.
- [ ] Progress report lists every moved file, the README structure chosen, the archived-date-line decision, and any flagged owner questions.

## Stop Conditions

Stop and report for integration-owner review if:

- A README row's status text is something other than the five known values.
- A `complete` row has no matching packet file (or vice versa).
- An archived packet body references another packet by relative path in a way that would clearly break (rare — most cross-references are by plan number, not by file path).
- `npm test` or `npm run build` fails after the moves.
- The reusable prompt cannot be kept under ~150 lines while remaining self-contained — surface that and accept a longer file rather than ship an incomplete prompt.
