# Archive Hygiene Report - 2026-05-16

## Scope

Sanity-check the development packet archive against `docs/development/archive-packets-prompt.md`, then correct the README and archive layout so they match the archive policy.

## What I Checked

- `docs/development/archive-packets-prompt.md`
- `docs/development/README.md`
- `docs/development/archive/`
- `docs/development/` packet placement

## Policy Findings

- The archive prompt was already the right source of truth for this pass.
- The README had drifted:
  - some completed packets were still listed in the active table
  - Plan 25, which is marked deprecated, had been archived even though the archive prompt says to leave the deprecated Plan 25 cluster in place unless the owner explicitly says otherwise
- The archive directory was otherwise in good shape for plans through 31 once the Plan 25 exception was restored.

## Fixes Applied

- Restored `Plan 25` to `docs/development/README.md` under the active/deprecated table.
- Kept `Plan 06`, `Plan 27`, `Plan 28`, `Plan 30`, and `Plan 31` in the completed table.
- Moved `docs/development/archive/plan-25-slow-speed-blockly-trace.md` back to `docs/development/plan-25-slow-speed-blockly-trace.md` so the deprecated cluster remains in place.
- Restored the Plan 25 exception line in `docs/development/archive-packets-prompt.md`.
- Left packet bodies byte-identical aside from the README/index organization and the policy prompt restoration.

## Validation

- README link sweep: passed
- `npm test`: passed, `115/115`
- `npm run build`: passed, with the existing Blockly chunking warnings still present

## Result

- The README now has the intended `Active Packets` and `Completed Packets` split.
- Plans through 31 are archived when complete, except deprecated Plan 25, which remains in the active/deprecated section per policy.
- No archive badge was added to packet bodies.
