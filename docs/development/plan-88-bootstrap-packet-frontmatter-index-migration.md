---
id: plan-88
title: "Bootstrap Packet Frontmatter And Generated Index Migration"
status: complete
resolution: "Completed and verified 2026-07-07 after dependency-frontmatter repair. Confirmed generated index is current, packet dependency brakes block Plans 81 and 90 appropriately, Plan 92 remains draft-gated, and Plan 80/89 readiness was restored after review correction."
depends_on: [plan-87]
gate: "before archiving, deleting, or renaming packet files; before changing packet semantics beyond status metadata"
summary: >-
  After Plan 87, migrate packet docs to Bootstrap-compatible frontmatter and convert this README to the generated packet-index convention, preserving existing packet semantics and Plan 77's superseded state.
---
# Plan 88: Bootstrap Packet Frontmatter And Generated Index Migration

- Packet id: Plan 88
- Packet title: Bootstrap Packet Frontmatter And Generated Index Migration
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent with docs-migration care
- Date: 2026-07-06
- Packet type: docs / tooling migration
- Mutation level: docs-only plus generated packet index
- Approval gate: before archiving, deleting, or renaming packet files; before changing packet semantics beyond status metadata
- Expected artifacts:
  - Bootstrap-compatible frontmatter on active and completed packet docs
  - `docs/development/README.md` converted to the Bootstrap generated-index convention
  - Plan 77 marked superseded in machine-readable status
  - packet-status render/lint/check commands passing
  - progress report
- Progress report folder: `reports/development/plan-88-bootstrap-packet-frontmatter-index-migration/`
- Progress report file: `reports/development/plan-88-bootstrap-packet-frontmatter-index-migration/progress.md`

## Packet Summary

Goal: Convert Browser Battlegorithms packet tracking from a hand-maintained Markdown table to the Bootstrap frontmatter plus generated-index model, without changing the content or scope of any packet.

Non-goals:
- Do not implement any packet's work.
- Do not complete, reopen, or archive packets based on judgment calls.
- Do not rewrite packet bodies beyond status/frontmatter synchronization.
- Do not move completed packets into an archive.
- Do not adopt agent prompts or falsification-check prose; that is Plan 89.
- Do not alter reports under `reports/development/` except this packet's progress report.

Depends on:
- Plan 87 complete and packet-status scripts available.

Blocks:
- Reliable Bootstrap-driven packet status operations for Plans 89+.
- Cleaner sequencing for the guided rewrite wave.

Why this packet exists:
The rewrite slate now spans runtime repairs, admin tooling, usage tracker redesign, Bootstrap adoption, and a campaign rewrite. Manual table edits are easy to drift. Bootstrap's generated-index convention should become the durable source of packet status before more packets are dispatched.

## Authority And Contracts

Required project contracts:
- `docs/development/README.md`
- `docs/packet-creation-guidance.md`
- Bootstrap packet-status template/guidance copied or referenced by Plan 87.
- `scripts/dev/plan-status.js` behavior after Plan 87.
- Existing packet body text.

Do not redefine:
- Packet purpose, scope, dependencies, or owner gates.
- Status history in progress reports.
- The Plan 85 charter's owner gate.
- The Plan 77 supersession decision.

## Required Reading

Read before editing:
- This packet end-to-end.
- `docs/development/README.md`
- `docs/development/plan-77-pre-challenge-22-compound-condition-uplift.md`
- `docs/development/plan-85-campaign-rewrite-charter.md`
- `docs/development/plan-86-dynamic-board-evidence-upgrade.md`
- `docs/development/plan-87-bootstrap-consumer-core-setup.md`
- Plan 87 progress report.
- Bootstrap packet-status docs/templates copied or referenced by Plan 87.

Use `rg` for:
- `Status:`
- `Packet id:`
- `Progress report folder`
- `plan-status`

## Scope

### In Scope

- Add Bootstrap-compatible frontmatter to current top-level packet files in `docs/development/`.
- Preserve the existing human-readable metadata block unless the Bootstrap convention says to remove or replace it.
- Convert `docs/development/README.md` to the generated-index convention.
- Run render/check/lint in the order Bootstrap expects.
- Update packet creation guidance only if needed to point future packets at the frontmatter convention.

### Out Of Scope

- Editing source code, tests, levels, usage tooling, generated guided audit evidence, or private local data.
- Moving packet files.
- Reclassifying uncertain statuses beyond what current packet files and reports already prove.
- Completing Plan 85's owner gate.

### Files And Areas Likely Touched

- `docs/development/README.md`
- `docs/development/plan-*.md`
- `docs/packet-creation-guidance.md` if needed for frontmatter convention
- `reports/development/plan-88-bootstrap-packet-frontmatter-index-migration/progress.md`

## Implementation Requirements

### 1. Status Mapping

Required behavior:
- Map existing manual statuses into Bootstrap-compatible frontmatter.
- Preserve these known statuses:
  - Plans 41, 66-76, and 79: `complete`
  - Plan 77: `superseded`
  - Plan 78 and Plans 80-84: current non-complete statuses from the README/body
  - Plan 85: `draft`
  - Plan 86 and Plan 87: current statuses from their packet files
- For newly drafted Plans 88+ present at migration time, use their packet-body status.

Constraints:
- If a status is ambiguous, stop and list the ambiguity rather than guessing.
- Do not mark a packet complete unless its packet file, README row, and progress report evidence already agree.

Archive handling:
- `docs/development/archive/` holds ~55 completed packets that the current README's completed table links to. Decide explicitly whether the generated index scans the archive folder (frontmatter added there too) or whether archive rows are preserved in a manually maintained section outside the generated markers. Either is acceptable; silently dropping archive rows from the README is not. If the plan-status script cannot cleanly support whichever option fits, stop and report rather than improvising a third convention.

### 2. Generated Index

Required behavior:
- Add whatever managed markers or generated sections Bootstrap expects in `docs/development/README.md`.
- Run the render command and review the generated table for sane links, status grouping, and Plan 77 supersession visibility.

Constraints:
- Keep any manually valuable introductory text outside generated markers.
- Do not delete explanatory notes unless the generated convention requires moving them.

### 3. Body Synchronization

Required behavior:
- If packet bodies retain their old metadata blocks, make sure body status and frontmatter status do not contradict.
- If Bootstrap convention prefers frontmatter as source of truth, change body status lines to a neutral phrase such as "Status: see frontmatter" only if that is the established convention.

Constraints:
- Avoid broad prose rewrites.
- Preserve per-packet approval gates and expected artifacts.

## Work Plan

1. Run `npm run plan:list` or equivalent to understand current script behavior.
2. Add frontmatter to a small representative packet and verify parsing.
3. Migrate the remaining packet files mechanically.
4. Add/generated README index markers and run render.
5. Run check/lint.
6. Write the progress report with any unresolved ambiguous statuses.

## Commands

Run from the repository root:

```powershell
npm run plan:render
npm run plan:lint
npm run plan:check
```

If packet-status tests or scripts changed:

```powershell
node scripts/dev/plan-status.test.js
```

## Validation Checklist

- [ ] Every active top-level packet has Bootstrap-compatible frontmatter.
- [ ] Completed top-level packets needed by the current index have Bootstrap-compatible frontmatter.
- [ ] `docs/development/README.md` is generated by the packet-status script and remains readable.
- [ ] Plan 77 is visibly superseded, not ready.
- [ ] Plan 85 remains draft and owner-gated.
- [ ] Packet-status render, lint, and check pass.
- [ ] No packet body scope was materially changed.
- [ ] Progress report lists any packet status ambiguity encountered.

## Stop Conditions

- Any packet status cannot be mapped from current repo evidence.
- The generated index would drop important packet context without a clear place to preserve it.
- Plan-status tooling needs source-code changes beyond minor Bootstrap compatibility.
- The migration would require renaming or archiving packet files.
