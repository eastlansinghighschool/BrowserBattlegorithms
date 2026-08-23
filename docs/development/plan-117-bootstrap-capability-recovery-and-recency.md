---
id: plan-117
title: "Bootstrap Capability Recovery And Recency"
status: complete
resolution: "Orchestrator verified Bootstrap alignment, canonical guidance migration, and all stated validation."
depends_on: [plan-115]
gate: "before mutation: owner approves the per-capability adoption decisions from a fresh Bootstrap audit"
summary: >-
  Build on Plan 115's completed Bootstrap baseline, then adopt the
  current core capability deltas: packet-status-system 1.4.0, agent-starting-prompts 1.7.0, and
  commit-discipline 2.1.0. Keep this a recovery-and-sync packet; it neither changes game behavior nor
  deploys the site.
---
# Plan 117: Bootstrap Capability Recovery And Recency

## Packet Metadata

- Packet id: `plan-117`
- Packet title: Bootstrap Capability Recovery And Recency
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-08-22
- Packet type: integration / tooling
- Mutation level: scripts, docs, configuration, tests
- Approval gate: before mutation — owner approves the capability triage after a fresh audit
- Depends on: `plan-115` (completed Bootstrap baseline)
- Blocks: no product packet; it restores a reliable shared tooling baseline
- Expected artifacts:
  - narrowly scoped current-capability upgrades, only after the approval gate
  - one canonical packet-guidance file at `docs/development/packet-creation-guidance.md`, plus a redirect-only legacy stub
  - truthful `.bootstrap-adoption.json` versions and audit date
  - focused packet-status tests and prompt/prose verification
  - `reports/development/plan-117-bootstrap-capability-recovery-and-recency/progress.md`

## Goal

Bring Browser Battlegorithms from Plan 115's completed, committed Bootstrap baseline to the current upstream ledger. The implementer first obtains a fresh audit and owner approval of its per-capability triage, then applies only the approved deltas.

## Non-goals

- Do not change game code, levels, classroom copy, deployment configuration, dependencies, or GitHub Actions.
- Do not create a session-handoff document merely because upstream prompts describe one; it is conditional operational guidance, not a required artifact.
- Do not copy an upstream configurable prompt wholesale; preserve Browser Battlegorithms pedagogy, static-deployment, and packet-contract prose.
- Do not retain two independently editable packet-guidance documents. The legacy path may contain only a concise redirect to the canonical file.
- Do not declare a capability current from version arithmetic alone when its behavioral probe failed or was inconclusive.

## Why this packet exists

Plan 115 brought this consumer substantially forward and is now complete. Meanwhile, the upstream ledger advanced again. The preflight audit reported `packet-status-system` 1.3.0 → 1.4.0, `agent-starting-prompts` 1.5.0 → 1.7.0, and `commit-discipline` 2.0.0 → 2.1.0 as behind; it also found the manifest's `advisor-consultation` adoption claim unsupported by a required managed-prose surface. This packet makes the next sync evidence-led and bounded.

## Fresh Evidence (preflight, 2026-08-22)

Run from the checked-out Bootstrap repository against this consumer:

```powershell
node scripts/bootstrap-audit.js <BrowserBattlegorithms> --report
```

The audit tool labelled its run date `2026-08-23` (likely its own UTC clock); this packet's durable date is the local environment date above. Re-run the command at implementation time and treat that new docket—not the table below—as authoritative.

| Capability | Upstream channel / adoption kind | Observed verdict | Evidence to preserve | Proposed treatment | Owner decision |
|---|---|---|---|---|---|
| `packet-status-system` | core / verbatim | behind: 1.3.0 < 1.4.0; `list` probe was inconclusive because child-process spawn returned `EPERM` | audit docket plus the exact local `plan-status` tests | adopt only after a permitted cross-process verification distinguishes sandbox failure from product failure | required |
| `agent-starting-prompts` | core / configurable | behind: 1.5.0 < 1.7.0; design-review launch/menu and orchestrator session-handoff probe failures | upstream 1.5.1–1.7.0 changelog entries and current local prompt deltas | hand-merge the bounded upstream additions; retain local project-specific contracts | required |
| `commit-discipline` | core / managed prose | behind: 2.0.0 < 2.1.0; required markers absent from the Bootstrap-probed guidance path and design-review prompt | upstream marker blocks and each local target-file diff | first migrate the canonical guidance path, then merge the 2.1 design-review block and marker-recheck | required |
| `advisor-consultation` | core / managed prose | diverged: the marker is present in the legacy guidance file but Bootstrap probes `docs/development/packet-creation-guidance.md` | manifest, legacy marker, and expected canonical path | migrate the canonical file without duplicating content, then rerun the probe before touching manifest state | required |

## Authority And Contracts

Required reading:

- `AGENTS.md`
- `docs/development/plan-115-bootstrap-capability-catch-up.md` and `reports/development/plan-115-bootstrap-capability-catch-up/progress.md`
- `git status --short` and `git diff --` before any mutation
- `.bootstrap-adoption.json`
- Upstream Bootstrap: `bootstrap-capabilities.json`, `CHANGELOG.md`, `docs/bootstrap-sync.md`, `docs/bootstrap-adoption-schema.md`, and the ledger-listed portable files for each approved capability
- `docs/agent-starting-prompts/`, `docs/packet-creation-guidance.md`, `docs/development/packet-creation-guidance.md`, `docs/development/packet-template.md`, `docs/workflows/packet-tracking-system.md`
- `scripts/dev/plan-status.js`, `scripts/dev/plan-status.test.js`, and `package.json`

Contracts to preserve:

- Unexpected working-tree changes remain another thread's work unless their ownership is unambiguous.
- Bootstrap audit output is evidence, not authority to overwrite consumer files.
- `docs/development/packet-creation-guidance.md` is the single canonical packet-guidance source after this packet. The legacy root-path file is a redirect-only compatibility stub, not a second authority.
- `configurable` capability upgrades are hand-merges; marker blocks go in only after any same-file configurable rewrite, followed by a marker re-check.
- The manifest is written only after customization and behavioral probes pass. `adopted` means the claimed behavior is present, not merely copied.
- Child-process `EPERM` is an environment/probe failure, not a negative product observation. Re-run the unchanged command through a permitted path; do not substitute an in-process test.
- The application remains a static Vite deployment. This packet does not modify its GitHub workflow or deploy.

## Scope

### In scope

1. Migrate the canonical packet-guidance location before the audit-dependent capability changes: move the full content to `docs/development/packet-creation-guidance.md`, leave a redirect-only compatibility stub at `docs/packet-creation-guidance.md`, and update live references. Do not rewrite historical packets or reports; their legacy links remain valid through the stub.
2. Run the fresh tracked-mode Bootstrap audit and reconcile differences from the preflight docket.
3. For owner-approved current deltas only:
   - resync packet-status tooling and its focused tests to 1.4.0;
   - hand-merge `agent-starting-prompts` 1.5.1–1.7.0, including the conditional session-handoff guidance and the new Bootstrap adoption-proposal prompt if it fits this repository's prompt set;
   - merge `commit-discipline` 2.1.0 into every ledger-required managed-prose location;
   - resolve the advisor-consultation manifest-honesty finding without inventing a repository-level opt-out.
4. Update the adoption manifest only for capabilities verified as current, record the environment-derived audit date, and write the progress report.

### Out of scope

- Any new capability outside the fresh audit docket.
- Game, level, user-interface, learning-model, data, or accessibility changes.
- Dependency installs, GitHub Actions changes, GitHub Pages deployment, pushes, and external service configuration.

### Files and areas likely touched after approval

- `.bootstrap-adoption.json`
- `scripts/dev/plan-status.js`, `scripts/dev/plan-status.test.js`
- `docs/workflows/packet-tracking-system.md`, `docs/development/packet-template.md`
- `docs/agent-starting-prompts/` (including `design-review-prompt.md`)
- `docs/development/packet-creation-guidance.md` (new canonical location) and `docs/packet-creation-guidance.md` (redirect-only stub)
- `AGENTS.md`, live `docs/agent-starting-prompts/*.md`, and active `docs/development/00-*.md` references only
- `advisor-capable-providers.json` only where the approved ledger requires it
- `reports/development/plan-117-bootstrap-capability-recovery-and-recency/progress.md`

## Work Plan

1. Run `node scripts/dev/plan-status.js check plan-117`; inspect the tree and Plan 115's completed handoff.
2. Migrate the single canonical packet-guidance file and update only live references; verify the legacy stub contains no copied guidance contract.
3. Run the live Bootstrap audit in tracked mode. If it differs materially from this packet's evidence, stop and amend the triage rather than applying stale recommendations.
4. Apply approved upgrades in dependency order: packet-status system; configurable prompts; marker-managed blocks; then truthful manifest changes.
5. Run focused tests/probes after each capability. Rerun any child-process command that hits sandbox `EPERM` unchanged through the permitted execution path.
6. Run final audit. It must show the intended capabilities `current`; do not retry it except after a specific corrective step.
7. Write the progress report with accepted/rejected audit findings, commands, actual versions, remaining risks, and one advisor-consultation disposition statement.

## Implementation Requirements

### 1. Fresh audit is an owner gate

- Name every pre-existing modified or untracked path before writing anything. Do not adopt another thread's work into this packet.
- Compare the fresh audit with this packet's preflight table and give the owner an updated, per-capability decision list.
- Do not mutate until the owner approves that list.

### 2. Canonical packet-guidance migration

- Before capability-specific edits, relocate the complete guidance file to `docs/development/packet-creation-guidance.md`, which is the Bootstrap ledger and audit location.
- Replace `docs/packet-creation-guidance.md` with a short compatibility stub that names and links to the new canonical path. It must not retain copied policy text or managed marker blocks.
- Update the live operational links in `AGENTS.md`, `docs/agent-starting-prompts/`, and active `docs/development/00-*.md` entry prompts. Do not edit completed/archived packets or historical reports merely to rewrite their recorded locator; the stub preserves those links.
- Run `rg` after the move to verify one canonical content file, no stale live references, and no duplicate managed markers.

### 3. Current audit and version deltas

- Obtain current upstream ledger versions and portable-file lists at implementation time. The preflight versions are a floor, not a ceiling.
- Preserve audit verdict distinctions: `behind`, `diverged`, `current`, and inconclusive probe failure are different states with different recovery paths.
- A future upstream capability added after this packet was written is an owner-triage item, not automatic scope.

### 4. Packet-status-system 1.4.0

- Adopt only the ledger’s verified 1.4 changes: tolerant command-boundary input normalization, canonical downstream identity, and clear ambiguity/not-found guidance.
- Test canonical ids, descriptive filename slugs, bare numbers, bare suffixes, case-insensitivity, suffixed-sibling refusal, no-hint errors, duplicate rejection, and canonical stored output, as applicable to the upstream test contract.
- Keep the user-facing commands and generated packet index semantics compatible with this repository’s existing packets.

### 5. Prompt and managed-prose updates

- `agent-starting-prompts` is configurable: merge, never replace. The design-review first-turn menu must retain its concrete-request bypass and bounded read-only delegation; the orchestrator prompt’s session-handoff guidance stays conditional.
- Install only exact upstream managed blocks for `commit-discipline` and `advisor-consultation`, at the required target locations. Do not change their semantics to force actual advisor availability.
- Confirm required marker begin/end pairs and versions after all same-file merges. If expected target paths differ between Bootstrap and this consumer, surface the path conflict to the owner.

### 6. Manifest honesty and reporting

- Do not update `lastBootstrapAudit` until the final audit completes successfully enough to support the stated entries.
- If a core capability cannot pass its probe, record the observed state honestly and stop for owner guidance; never use `deferred` to sidestep a non-declinable capability.
- The progress report explicitly says one of: consultation ran, consultation was not warranted, or degraded mode. This packet has behavioral tooling surfaces, so a “not warranted” declaration is not valid for its implementer.

## Commands

```powershell
node scripts/dev/plan-status.js check plan-117
node scripts/dev/plan-status.js lint
node scripts/dev/plan-status.js render
npm test
npm run build
```

Run the Bootstrap audit from the approved Bootstrap checkout, not a copied or remembered ledger:

```powershell
node scripts/bootstrap-audit.js <BrowserBattlegorithms> --report
```

## Validation Checklist

- [ ] Fresh tracked-mode audit captured; any meaningful difference from preflight was surfaced and re-triaged.
- [ ] Owner approved the current per-capability triage before mutation.
- [ ] Canonical guidance is at `docs/development/packet-creation-guidance.md`; the legacy root path is a redirect-only stub; live operational links use the canonical path.
- [ ] Each approved capability has its ledger verification items met, including marker locations and versions where applicable.
- [ ] Packet-status focused tests cover the 1.4 command-boundary cases.
- [ ] `node scripts/dev/plan-status.js lint` and `render` succeed.
- [ ] `npm test` passes when tooling tests change.
- [ ] `npm run build` succeeds through a permitted cross-process path when the restricted sandbox produces `EPERM`.
- [ ] Final audit shows intended adopted capabilities as `current`, with no manifest-honesty failure.
- [ ] Manifest date/version/state entries are evidence-backed.
- [ ] Progress report includes owner triage, advisor declaration/disposition, exact commands, and risks.
- [ ] No game, level, deployment, dependency, or unrelated files changed.

## Stop Conditions

Stop and ask the owner for review if:

- unexpected working-tree changes cannot be confidently attributed;
- the fresh audit differs from the preflight in a way that adds capability scope, changes a core requirement, or conflicts with a local contract;
- a configurable prompt merge would erase Browser Battlegorithms-specific pedagogy or operating rules;
- the guidance move would require rewriting historical records or leave two editable guidance authorities;
- a required managed-prose target is missing or conflicts with another in-flight change;
- an audit probe fails/inconclusive twice without a specific corrective action, or a final audit repeats an unintended verdict;
- adoption requires a dependency, GitHub workflow, deployment, or repository-settings choice;
- a change would alter game behavior, student experience, or static deployment behavior.

## Progress Report

`reports/development/plan-117-bootstrap-capability-recovery-and-recency/progress.md`

Minimum contents: owner-approved triage, files changed, capability verdicts before/after, manifest entries changed, commands and results (including any sandbox `EPERM` rerun), advisor-consultation declaration/disposition, remaining risks, and ready for orchestrator review yes/no.
