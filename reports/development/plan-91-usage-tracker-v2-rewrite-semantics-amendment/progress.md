# Plan 91 Progress Report

## Overall Summary

Amended the Plan 84 Usage Tracker V2 design contract so it explicitly allows rewrite-aware optional fields for arcs, board dynamics, bestiary encounters, star outcomes, mastery criteria, and film-review summaries. I also repaired the stale downstream packet-slot wording so Plan 84 no longer points at the retired Plan 85/86/87 numbering, and I mirrored that wording in the development packet index.

## Files Changed

- `docs/development/plan-84-usage-tracker-v2-design-contract.md`
- `docs/development/README.md`
- `reports/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment/progress.md`

## Artifacts Produced

- Updated Plan 84 contract text with optional rewrite-aware extensions and v1 compatibility note
- Updated packet index row for Plan 84
- This Plan 91 progress report

## Commands Run and Results

- `node scripts/dev/plan-status.js check 91`
  - Result: `ERROR: packet not found: 91`
- `node scripts/dev/plan-status.js check plan-91-usage-tracker-v2-rewrite-semantics-amendment`
  - Result: `RUNNABLE: plan-91-usage-tracker-v2-rewrite-semantics-amendment is ready to implement`
- `Get-Content docs/development/plan-91-usage-tracker-v2-rewrite-semantics-amendment.md`
  - Result: confirmed the amendment scope, stop conditions, and docs-only mutation level
- `Get-Content docs/development/plan-84-usage-tracker-v2-design-contract.md`
  - Result: confirmed the old downstream Plan 85/86/87 slot wording that needed repair
- `Get-Content docs/development/README.md`
  - Result: confirmed the packet index row that mirrored the stale Plan 84 wording
- `Get-Content src/usage/usageFormat.js`
  - Result: confirmed the current v1 export shape still only has schemaVersion, summary, events, and snapshots; no rewrite-aware fields exist yet
- `Get-Content src/usage/guidedProgress.js`
  - Result: confirmed this packet should stay in contract text and not drift into implementation
- `rg "Plans 85|arcId|boardDynamicsTier|star|mastery" docs/development/plan-84-usage-tracker-v2-design-contract.md docs/development/README.md`
  - Result: confirmed the new rewrite-aware field names and the repaired Plan 84 wording; the broad `star` pattern also matched unrelated `starting` text in the index, which was expected
- `npm run plan:check`
  - Result: failed because the repo script expects a packet id argument
- `npm run plan:check -- plan-91-usage-tracker-v2-rewrite-semantics-amendment`
  - Result: `RUNNABLE: plan-91-usage-tracker-v2-rewrite-semantics-amendment is ready to implement`

## Validation Checks Performed

- Confirmed Plan 85 owner gate is resolved and Plan 91 is runnable.
- Confirmed Plan 84 now documents optional rewrite-aware extensions and v1 back-compat when those fields are absent.
- Confirmed the stale Plan 85/86/87 downstream slot references were replaced with neutral old-slot wording.
- Confirmed the packet index row now matches the amended Plan 84 wording.
- Confirmed no source, tests, level data, or generated usage artifacts were changed.

## Problems Encountered and How Resolved

- `node scripts/dev/plan-status.js check 91` did not recognize the short numeric id.
  - Resolved by checking the packet with its full slug id instead.
- `npm run plan:check` by itself prints usage text in this repo.
  - Resolved by passing the packet id through `--`.

## Remaining Risks or Follow-Ups

- The downstream implementation packets still need to be drafted later under the current slate; this amendment only repairs the contract text and numbering language.
- No runtime behavior has changed yet, so the new optional fields still need implementation work in a later packet.

## Ready for Orchestrator Review

yes
