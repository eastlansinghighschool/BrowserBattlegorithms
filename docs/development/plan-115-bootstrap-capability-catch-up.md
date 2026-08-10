---
id: plan-115
title: "Bootstrap Capability Catch-Up Audit"
status: ready
depends_on: []
gate: "before mutation: owner approval of the triage list (which upstream capabilities to adopt, skip, or defer); the audit itself is scan-only"
superseded_by: null
resolution: null
summary: >-
  Re-run the Bootstrap capability audit against upstream changes since the last audit (2026-07-07), triage new or changed capabilities against the adoption manifest, and adopt approved items — including checking whether our pending reverse-flow proposal (canonical short packet IDs) landed upstream.
---
# Plan 115: Bootstrap Capability Catch-Up Audit

## Packet Metadata

- Packet id: `plan-115`
- Packet title: Bootstrap Capability Catch-Up Audit
- Status: (see frontmatter)
- Owner/model: scan-first implementation agent
- Date: 2026-08-08
- Packet type: scan-only first, then gated adoption
- Mutation level: none during audit; source-code/docs only for owner-approved adoptions
- Approval gate: before mutation — owner approves the triage list before any adoption work
- Depends on: none (plans 87–90 are the adoption history)
- Blocks: nothing
- Expected artifacts:
  - audit report (capabilities added/changed upstream since 2026-07-07, per-capability triage recommendation)
  - updated `.bootstrap-adoption.json` manifest (states and versions)
  - any owner-approved adoption changes, each small and separately validated
  - progress report
- Progress report folder: `reports/development/plan-115-bootstrap-capability-catch-up/`
- Progress report file: `reports/development/plan-115-bootstrap-capability-catch-up/progress.md`

## Packet Summary

Goal: Bring our Bootstrap adoption manifest current: find what upstream Bootstrap has added or changed since the last audit (2026-07-07, `bootstrapVersion 0.1.0`), triage each capability as adopt / skip / defer with reasons, and implement only owner-approved adoptions.

Non-goals:
- Do not adopt anything without owner approval of the triage list.
- Do not redesign local customizations to match upstream wholesale (e.g. our packet-status system is deliberately `ahead-of-bootstrap`; local wins stay unless upstream's version is strictly better AND the owner agrees).
- Do not touch packet content, game code, or deployment.
- No new dependencies without explicit owner approval.

Depends on:
- Nothing.

Blocks:
- Nothing.

Why this packet exists:
Plans 87–90 adopted Bootstrap's packet-status core, prompts, falsification check, and dev-console hub, leaving a manifest (`.bootstrap-adoption.json`) with `lastBootstrapAudit: 2026-07-07`. Since then this project has evolved the conventions significantly (repair-file pattern, delivered/in-progress review cycle, gate-first packets, decision-log practice), and one manifest entry (`packet-status-system`, state `ahead-of-bootstrap`) has a reverse-flow proposal pending upstream. Tooling ecosystems drift; a periodic catch-up prevents silent divergence in both directions — us missing useful upstream improvements, and upstream conventions we rely on changing under us.

## Authority And Contracts

Required reading:

- `.bootstrap-adoption.json` — the manifest (states, versions, local rationale).
- `docs/development/README.md` — plans 87–90 summaries (the adoption history).
- `docs/development/plan-90-bootstrap-audit-closure-and-path-hygiene-triage.md` (if present in archive) — the prior audit's method.
- `docs/decision-log.md` — 2026-07-07 Bootstrap adoption decisions.
- `docs/agent-starting-prompts/` — our current prompt set (upstream versions may have changed).

Contracts to preserve:

- Local deliberate divergences stay unless the owner explicitly reverses them (canonical short packet IDs; repair-file and review-cycle conventions).
- The manifest must remain truthful after the packet (plan-90's closure rule: the manifest is a source of truth, not marketing).
- Static Vite deployment; no server; no new dependencies without approval.

## Scope

### In Scope

1. **Locate upstream Bootstrap.** Find the upstream Bootstrap source (a sibling checkout, a remote repo, or an npm package — check `package.json`, `scripts/dev/`, and prior packet notes first). If it cannot be located, STOP and ask the owner for the source location — do not guess.
2. **Audit (scan-only):** diff upstream capabilities against the manifest: new capabilities, version changes to adopted ones, upstream changes to ones we diverged from. Check the status of the pending reverse-flow proposal (canonical short packet IDs) upstream.
3. **Triage list:** per capability, recommend adopt / skip / defer with a one-line rationale tied to our actual usage.
4. **Gated adoption:** implement owner-approved adoptions only, each small with its own validation.
5. **Manifest update:** set `lastBootstrapAudit` to the audit date; update states/versions; record skips/defers with reasons so the next audit starts from truth.

### Out of Scope

- Any game, level, tracker, or UI change.
- Adopting upstream conventions that conflict with our packet-creation guidance without owner sign-off.
- Migrating packet frontmatter or index conventions (plan-88 settled that unless upstream forces a revisit).

### Files And Areas Likely Touched

- `.bootstrap-adoption.json`.
- `scripts/dev/` (only if an approved adoption updates tooling).
- `docs/agent-starting-prompts/` (only if an approved adoption updates prompts).
- Progress report + audit report under `reports/development/plan-115-bootstrap-capability-catch-up/`.

## Work Plan

1. Locate upstream Bootstrap (stop and ask if not evident).
2. Run the audit; write the audit report.
3. Present the triage list and WAIT for owner approval.
4. Implement approved adoptions incrementally (one capability per commit-sized step; run targeted validation after each).
5. Update the manifest; write the progress report.

## Implementation Requirements

### 1. Audit honesty

- Every manifest capability gets a stated current state (still adopted and current / adopted but upstream moved / diverged intentionally / superseded upstream).
- New upstream capabilities get a one-line "what it is + do we have a need" assessment — not just a list.
- The reverse-flow proposal (short packet IDs) gets a definitive status: landed upstream / pending / rejected / unknown.

### 2. Adoption discipline

- Each approved adoption is minimal, tested, and validated with the repo's normal commands for the touched area.
- If an adoption would change behavior described in `docs/subsystems/*.md` or packet guidance, the doc update rides the same patch.

## Commands

```powershell
npm test
npm run build
```

(Plus targeted validation for any adopted tooling, e.g. `node scripts/dev/plan-status.js lint`.)

## Validation Checklist

- [ ] Audit report exists with per-capability triage and the reverse-flow status.
- [ ] Owner approved the triage list before any mutation.
- [ ] Adoptions are individually small and validated.
- [ ] Manifest updated and truthful (`lastBootstrapAudit`, states, versions, skip/defer reasons).
- [ ] `npm test` / `npm run build` pass after any tooling adoptions; `plan-status.js lint` OK.
- [ ] Progress report lists commands, decisions, remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- Upstream Bootstrap cannot be located.
- An upstream change conflicts with a locally settled convention (the conflict comes to the owner, not a silent merge).
- An adoption would require a dependency, deployment change, or repository settings change.
- The audit reveals our downstream conventions have drifted from what our own docs describe (that is a docs-truth problem to surface, not patch around).
