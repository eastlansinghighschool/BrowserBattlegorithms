# Plan 88 Repair Instructions

Date: 2026-07-07

Reviewer: Codex orchestration review

Status after review: **not accepted yet**. The packet was set back from `complete` to `delivered` using:

```powershell
npm run plan:set -- plan-88-bootstrap-packet-frontmatter-index-migration delivered
```

## Summary

The frontmatter/index migration mostly works mechanically: `plan:list`, `plan:render`, and `plan:lint` can operate on the migrated corpus. However, the migration missed the load-bearing dependency graph. Many packets now have `depends_on: []` even though their packet bodies explicitly list dependencies. That means `plan:check` can green-light packets that should be blocked, which defeats one of the primary reasons Plan 88 exists.

Repair before acceptance.

## Blocking Finding: `depends_on` Was Not Migrated From Packet Bodies

Examples observed during review:

- `plan-88-bootstrap-packet-frontmatter-index-migration` frontmatter says `depends_on: []`, but its body says it depends on Plan 87.
- `plan-89-bootstrap-agent-prompts-falsification-adoption` frontmatter says `depends_on: []`, but its body says it depends on Plan 87 and preferably Plan 88.
- `plan-90-bootstrap-audit-closure-path-hygiene` frontmatter says `depends_on: []`, but its body says it depends on Plans 87, 88, and 89.
- `plan-92-pre-challenge-15-living-board-pilot` frontmatter says `depends_on: []`, but its body says it depends on Plan 85 acceptance and Plan 86 completion.
- `plan-93-pre-challenge-22-living-resource-uplift` frontmatter says `depends_on: []`, but its body says it depends on Plans 85, 86, and 92.

Concrete failed brake:

```powershell
npm run plan:check -- plan-90-bootstrap-audit-closure-path-hygiene
```

At review time this returned:

```text
RUNNABLE: plan-90-bootstrap-audit-closure-path-hygiene is ready to implement
```

That is wrong while Plan 89 is still not complete.

## Required Repair 1: Migrate Dependencies Faithfully

Required:

- Re-read every top-level `docs/development/plan-*.md` packet that received frontmatter.
- Compare each packet's `Depends on:` / `Depends on` prose to frontmatter `depends_on`.
- Populate `depends_on` with blocking packet ids.
- Do not encode purely optional/preferable dependencies unless the packet says the dependency must be complete before work starts.
- If a prose dependency is ambiguous, do not guess silently. Add it to a short triage section in the progress report.

Minimum obvious fixes:

- Plan 88 depends on Plan 87.
- Plan 89 depends on Plan 87. Treat Plan 88 as blocking only if the packet text is revised to make it required rather than "preferably."
- Plan 90 depends on Plans 87, 88, and 89.
- Plan 92 depends on Plan 85 and Plan 86.
- Plan 93 depends on Plans 85, 86, and 92 unless the owner explicitly waives pilot dependency.
- Plan 94 depends on Plan 85.
- Plan 95 depends on Plan 94 and the selected phase's board-change packet if known; if not known, keep it `draft` and record the unresolved dependency in the progress report.
- Plan 96 depends on Plans 85, 86, and 91.
- Plan 97 depends on Plan 85.
- Plan 98 depends on Plan 85; Plan 92 may be a preferred context dependency but should be encoded only if blocking.

Also check Plans 80-83: they are intended as a chain and should not all remain independently runnable if their bodies define a dependency sequence.

## Required Repair 2: Reconcile Plan 85 Status Semantics

Current inconsistency:

- Plan 85 frontmatter says `status: draft`.
- Plan 85 body says `Owner Decisions — Resolved 2026-07-07`, says all five gate items were resolved, and the generated summary says the downstream slate is unlocked.

Required:

- Do not adjudicate this silently.
- Either:
  - leave Plan 85 as `draft` and change the summary/body wording so it does not claim the gate is resolved/unlocked, or
  - if there is owner/orchestrator authority already recorded for acceptance, set the correct terminal/nonterminal status with an appropriate `resolution`.
- If uncertain, stop and report this as an owner/orchestrator decision item rather than guessing.

This matters because Plans 91-98 use Plan 85 acceptance as a blocker.

## Required Repair 3: Keep Implementer/Orchestrator Status Handshake Intact

Required:

- When the repair is done, report back with Plan 88 as `delivered`, not `complete`.
- The orchestrator will set `complete` after verification.
- Do not set other packets to terminal states unless explicitly authorized.

## Required Repair 4: Clean Up Progress Report Claims

Required:

- Update `reports/development/plan-88-bootstrap-packet-frontmatter-index-migration/progress.md`.
- Record this repair pass.
- Remove stale claims that Plan 86 or Plan 88 lack report folders if they now exist.
- Include the before/after `plan:check` proof for at least one dependency-brake case, preferably Plan 90.

## Required Validation

Run from repo root:

```powershell
npm run plan:render
npm run plan:lint
npm run plan:list
npm run plan:check -- plan-90-bootstrap-audit-closure-path-hygiene
npm run plan:check -- plan-92-pre-challenge-15-living-board-pilot
```

Expected after repair:

- `plan:lint` exits 0, with only intentionally accepted warnings.
- `plan:check -- plan-90-bootstrap-audit-closure-path-hygiene` must be blocked until Plan 89 is complete.
- `plan:check -- plan-92-pre-challenge-15-living-board-pilot` must remain blocked while Plan 85 and/or Plan 86 are not complete/accepted.
- `docs/development/README.md` must be regenerated, not hand-edited inside the generated block.

## Notes

- This is a docs/tooling repair only. Do not touch runtime source, generated level evidence, usage data, or packet implementation scope.
- Archived packets can remain manually indexed outside the generated plan block unless the owner separately asks to migrate them.
