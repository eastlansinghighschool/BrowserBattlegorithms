---
id: plan-115
title: "Bootstrap Capability Catch-Up Adoption"
status: complete
resolution: "All six capabilities adopted (packet-status-system 1.3.0, agent-starting-prompts 1.5.0, review-response-tiers 1.0.0, commit-discipline 2.0.0, subagent-delegation 2.0.0, advisor-consultation 1.0.2); repair-01 verified 2026-08-23: validation honesty, .gitignore roster exception, Branch C advisor declaration"
depends_on: []
gate: "before mutation: owner approval of the triage list below (per-capability adopt/skip/defer); audit findings are already recorded in this packet"
summary: >-
  Adopt the Bootstrap capabilities we are behind on or missing, per the completed 2026-08-10 upstream audit: resync packet-status-system to 1.3.0 (our ahead-of-bootstrap claim is stale), agent-starting-prompts to 1.5.0, and evaluate the four new upstream capabilities (subagent-delegation, review-response-tiers, advisor-consultation, commit-discipline) for adoption.
---
# Plan 115: Bootstrap Capability Catch-Up Adoption

## Packet Metadata

- Packet id: `plan-115`
- Packet title: Bootstrap Capability Catch-Up Adoption
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-08-10 (audit performed 2026-08-10 by orchestration)
- Packet type: integration / tooling
- Mutation level: source-code (tooling/prompts/docs) only for owner-approved adoptions
- Approval gate: before mutation — owner approves the triage list in this packet
- Depends on: none (plans 87–90 are the adoption history)
- Blocks: nothing
- Expected artifacts:
  - per-capability adoption changes (approved subset only), each small and separately validated
  - updated `.bootstrap-adoption.json` (truthful states/versions, `lastBootstrapAudit: 2026-08-10`)
  - progress report
- Progress report folder: `reports/development/plan-115-bootstrap-capability-catch-up/`
- Progress report file: `reports/development/plan-115-bootstrap-capability-catch-up/progress.md`

## Packet Summary

Goal: Bring our Bootstrap adoption current per the completed audit (below). The scan is done; this packet is triage + approved adoption.

Non-goals:
- Do not adopt anything not approved by the owner.
- Do not redesign local conventions to match upstream where we intentionally diverge; local wins stay unless upstream is strictly better AND the owner agrees.
- Do not touch packet content, game code, levels, or deployment.
- No new dependencies without explicit owner approval.

Depends on:
- Nothing.

Blocks:
- Nothing.

Why this packet exists:
Our last Bootstrap audit was 2026-07-07. The upstream moved substantially since: our convention (canonical short packet IDs) landed upstream as packet-status-system 1.2.0 and 1.3.0 added the orchestrator-owned review-cycle semantics we now practice; upstream's 2026-07-25 fleet scan explicitly flagged this repo as a consumer-resync candidate; and four new upstream capabilities exist that match (or formalize) conventions we evolved locally. Catching up keeps the shared contract truthful in both directions.

## Audit Findings (2026-08-10, upstream `C:\AI\Bootstrap` @ `ea24665`)

Upstream: `bootstrap-capabilities.json` ledger (12 capabilities), catalog `docs/bootstrap-capabilities.md`, per-capability `CHANGELOG.md`.

**Behind (2):**

- `packet-status-system` — ours 1.1.0 marked "ahead-of-bootstrap"; upstream is **1.3.0**. 1.2.0 = our short-ID convention (landed upstream as their plan-18). 1.3.0 = orchestrator/owner-owned transitions, `ready→in-progress` assignment, `delivered`-before-verification, standard closeout sequence. The upstream fleet scan (2026-07-25) classifies us as **consumer-resync, not a reverse-flow** — our "ahead" claim is stale and must be corrected.
- `agent-starting-prompts` — ours 1.3.0; upstream **1.5.0**. 1.4.0: orchestrator "Final Response Style" section + handoff-skeleton schema line + dedup'd falsification block. 1.5.0: design-review first-turn menu (focused review / grilling / report-only discovery) + authorized read-only explorer/researcher/reviewer delegation.

**Current (5):** packet-status-set-verb 1.0.0, reports-archive 1.0.0, root-agent-guide 1.0.0, decision-log 1.1.0, dev-console-hub 1.1.0.

**New upstream capabilities (4):**

- `subagent-delegation` 2.0.0 (recommended) — delegation discipline prose + committed agent rosters (`.claude/agents/*.md`, `.codex/agents/*.toml`) and a managed-prose block for AGENTS.md.
- `review-response-tiers` 1.0.0 (recommended) — the three-tier review-repair convention (inline edit / implementer repair prompt / durable `repair-NN.md` note) as managed prose in the orchestrator prompt + packet-creation-guidance. This is OUR repair-file pattern, formalized upstream.
- `advisor-consultation` 1.0.2 (**upstream marks core / non-declinable**) — pre-delivery consultation with a higher-tier read-only advisor + mandatory three-way declaration (ran / not warranted / degraded), plus `advisor-capable-providers.json` (kimi-code is listed `advisorCapable: false` with an owner-mediated path).
- `commit-discipline` 2.0.0 (core) — who commits, what may be staged, push-only-with-owner-authorization, three concurrency modes (sequential / disjoint-scope concurrent / turn-taking), and `index.lock` wait-and-retry guidance. v2 inverts the default on foreign working-tree changes to stop-and-ask.

**Reverse-flow answer:** our short-ID proposal landed upstream (their plan-18, complete). Nothing new in our local conventions is a pending reverse-flow candidate. Our newer local conventions (repair files, `delivered` status, gate-first packets, dated decision log) all have upstream equivalents — adoption is low-friction.

**Reverse-flow candidate to carry upstream (added 2026-08-10, owner request):** a date-stamping rule for orchestrator/implementer prompts — "take dates from the environment (`date`, commit timestamps), never from conversation recency; async sessions span days and session-start timestamps go stale." The owner reports seeing this orchestrator mistake in multiple repos; it happened here (a batch of decision-log entries drifted two weeks stale and had to be corrected from commit evidence). Recommend proposing it upstream for the shared prompt conventions (agent-starting-prompts capability) during this packet.

## Triage Recommendations (owner gate)

| Capability | Recommendation | Why |
|---|---|---|
| packet-status-system 1.3.0 | **Adopt (resync)** | We pioneered the IDs; 1.3.0 codifies the review cycle the owner already enforces here. Mostly a manifest correction + verify our tool matches (id lint, duplicate-prefix rejection, transition semantics). |
| agent-starting-prompts 1.5.0 | **Adopt** | Orchestrator final-response + design-review menu + delegation lines improve the prompts we dispatch from. Preserve our project-specific prompt content. |
| review-response-tiers 1.0.0 | **Adopt** | Formalizes what we already do (inline tidy / repair prompt / repair-NN.md). Managed prose into orchestrator prompt + packet-creation-guidance. |
| commit-discipline 2.0.0 | **Adopt** | Matches our owner-mediated commit practice; the concurrency modes and foreign-tree stop-and-ask rule directly address the in-flight-implementer overlap we hit during plan-109. |
| subagent-delegation 2.0.0 | **Adopt the discipline prose; evaluate rosters** | We delegate heavily (reviewer/explorer subagents). The committed roster files target `.claude`/`.codex` environments — adopt if useful inert-or-not, but do not invent roster entries for tools we don't run. |
| advisor-consultation 1.0.2 | **Owner decision required** | Upstream marks it core/non-declinable, but for THIS repo the owner decides. Note: kimi-code is `advisorCapable: false` upstream (owner-mediated path), so adopting means either owner-mediated consultation or honest "not warranted/degraded" declarations. |

## Authority And Contracts

Required reading:

- `.bootstrap-adoption.json` (current manifest).
- Upstream: `C:\AI\Bootstrap\bootstrap-capabilities.json`, `docs/bootstrap-capabilities.md`, `CHANGELOG.md`, and each adopted capability's portable files as listed in the ledger.
- `docs/agent-starting-prompts/` (our current prompt set — merge, don't overwrite project-specific content).
- `docs/packet-creation-guidance.md` (receives the review-response-tiers prose if adopted).
- `AGENTS.md` (receives managed blocks only if the owner approves).

Contracts to preserve:

- Local deliberate divergences stay unless the owner reverses them.
- The manifest must be truthful after this packet (plan-90's closure rule).
- Static Vite deployment; no server; no new dependencies without approval.
- Our packet lifecycle (delivered/in-progress repair cycle, gates) is practiced here — adoption prose must not contradict it.

## Scope

### In Scope

- Owner-approved capability adoptions, each as an incremental step: copy/update the portable files per the upstream ledger, merge managed-prose blocks, adjust local files minimally, validate each step.
- Manifest update (states, versions, audit date, skip/defer reasons).
- The packet-status-system state correction (our entry becomes adopted/current at the adopted version — no longer "ahead-of-bootstrap").

### Out of Scope

- Game code, levels, packet content, deployment.
- Any adoption not on the owner-approved list.
- Rewriting our packet tooling from scratch — resync means verifying/aligning, not replacing what already works.

### Files And Areas Likely Touched

- `.bootstrap-adoption.json`
- `scripts/dev/plan-status.js` (only if resync reveals real drift — verify first)
- `docs/agent-starting-prompts/*` (merge upstream prompt changes)
- `docs/packet-creation-guidance.md`, `AGENTS.md` (managed-prose blocks if adopted)
- Possibly `.claude/agents/` / `.codex/agents/` roster files (if that adoption is approved)
- Progress report artifacts

## Work Plan

1. Confirm the owner-approved triage list (edit this packet's table if the owner adjusts it).
2. For each approved capability, in separate commit-sized steps: read the upstream portable files, merge/adopt minimally, run targeted validation (`node scripts/dev/plan-status.js lint`, prompt-file sanity, `npm test`/`npm run build` if tooling changed).
3. Update `.bootstrap-adoption.json` truthfully.
4. Progress report: what was adopted, what was skipped/deferred and why, validation run.

## Implementation Requirements

### 1. Resync honesty

- The manifest entry for packet-status-system must stop claiming "ahead-of-bootstrap" unless we re-diverge deliberately. Record the resync (and the 2026-07-25 fleet-scan classification) in the progress report.

### 2. Merge, don't overwrite

- Our agent prompts and guidance contain project-specific content (pedagogy contracts, packet rules, copy voice). Upstream managed blocks go in as managed blocks; local prose stays.

### 3. Validation per step

- After each adoption step, run the relevant validation. A broken plan-status tool or a malformed prompt file is a stop-and-fix, not a ride-along.

## Commands

```powershell
node scripts/dev/plan-status.js lint
node scripts/dev/plan-status.js render
npm test
npm run build
```

## Validation Checklist

- [ ] Only owner-approved capabilities were adopted.
- [ ] Each adoption step validated with the area's commands.
- [ ] Manifest truthful: states, versions, `lastBootstrapAudit: 2026-08-10`, skip/defer reasons recorded.
- [ ] Managed-prose blocks are marked as managed; local content preserved.
- [ ] `npm test`, `npm run build`, `plan-status.js lint` pass.
- [ ] Progress report lists adoptions, decisions, validation, remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- An upstream portable file conflicts with a settled local convention (the conflict goes to the owner).
- The advisor-consultation adoption implies workflow changes beyond the owner's expectation (e.g. new mandatory steps in threads).
- Any adoption would require a dependency, deployment, or repository-settings change.
- Our packet tooling turns out to have drifted from upstream in ways that aren't a clean superset/subset (surface the diff, don't force a merge).
