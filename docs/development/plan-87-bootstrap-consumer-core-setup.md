---
id: plan-87-bootstrap-consumer-core-setup
title: "Bootstrap Consumer Core Setup"
status: complete
depends_on: []
gate: "before adding dependencies, before renaming Bootstrap-managed files, before deleting or archiving existing packet docs"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Adopt Bootstrap's packet-status core for Browser Battlegorithms: adoption manifest, copied status tooling with ESM/CommonJS compatibility, npm packet-status scripts, and initial decision/open-question scaffolds without migrating packet frontmatter yet.
---
# Plan 87: Bootstrap Consumer Core Setup

- Packet id: Plan 87
- Packet title: Bootstrap Consumer Core Setup
- Status: (see frontmatter)
- Owner/model: lower-cost implementation agent with repo-tooling care
- Date: 2026-07-06
- Packet type: tooling / docs / integration
- Mutation level: docs-only plus dev tooling scripts/config; no runtime source
- Approval gate: before adding dependencies, before renaming Bootstrap-managed files, before deleting or archiving existing packet docs
- Expected artifacts:
  - `.bootstrap-adoption.json` recording Browser Battlegorithms as a Bootstrap consumer
  - Bootstrap packet-status core files copied with minimal compatibility shims
  - npm scripts for rendering/checking/linting packet status
  - initial `docs/decision-log.md` and `docs/open-questions.md` scaffolds
  - focused validation of the copied packet-status tooling
  - progress report
- Progress report folder: `reports/development/plan-87-bootstrap-consumer-core-setup/`
- Progress report file: `reports/development/plan-87-bootstrap-consumer-core-setup/progress.md`

## Packet Summary

Goal: Make Browser Battlegorithms a clean consumer of the local Bootstrap repository's core packet-status capability before the guided-campaign rewrite wave begins, without changing game behavior or migrating every packet yet.

Non-goals:
- Do not migrate packet frontmatter or regenerate the packet index; that is Plan 88.
- Do not adopt Bootstrap agent prompts or falsification-check prose yet; that is Plan 89.
- Do not introduce a dev console hub unless the owner explicitly expands scope.
- Do not move completed packet files into an archive.
- Do not edit guided levels, game runtime code, usage tracking code, or generated audit evidence.
- Do not add dependencies.

Depends on:
- Local Bootstrap repository availability. The owner should supply the local path at dispatch time; committed config/docs should use repo-relative paths or `<bootstrap-repo>` placeholders rather than encoding a machine path.
- Current Browser Battlegorithms packet docs under `docs/development/`.
- Existing root `AGENTS.md`.

Blocks:
- Plan 88 packet frontmatter and generated-index migration.
- Plan 89 Bootstrap agent prompt/falsification adoption.
- Plan 90 Bootstrap audit closure.
- Cleaner downstream guided-campaign rewrite packet tracking.

Why this packet exists:
The guided rewrite is about to create a long chain of implementation, scan, repair, and review packets. Browser Battlegorithms already has a manual packet index, but Bootstrap now provides reusable packet-status tooling, generated index conventions, agent-starting prompts, and audit checks. Adopting the core tooling first lowers coordination cost before the campaign rewrite work multiplies the packet count.

## Authority And Contracts

Required project contracts:
- `AGENTS.md`
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `package.json`
- Bootstrap source repository, especially:
  - `bootstrap-capabilities.json`
  - `scripts/bootstrap-audit.js`
  - `scripts/dev/plan-status.js`
  - `scripts/dev/plan-status.test.js`
  - any Bootstrap packet-status templates or workflow docs those files reference

Do not redefine:
- Browser Battlegorithms remains a static Vite browser app.
- Existing packet docs remain readable in their current locations.
- Existing completed packet evidence under `reports/development/` remains untouched.
- Private/local classroom data stays under ignored `local/` paths only.

Compatibility decision:
- Browser Battlegorithms uses ESM in `package.json`. Bootstrap's current `scripts/dev/plan-status.js` is CommonJS. Prefer preserving the Bootstrap filename and file contents by adding `scripts/dev/package.json` with `{ "type": "commonjs" }` rather than renaming Bootstrap-managed files to `.cjs`. If that strategy fails, stop and report before inventing a divergent path.

## Required Reading

Read before editing:
- This packet end-to-end.
- `AGENTS.md`
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `package.json`
- From Bootstrap:
  - `bootstrap-capabilities.json`
  - `README.md` or equivalent consumer guidance if present
  - `scripts/bootstrap-audit.js`
  - `scripts/dev/plan-status.js`
  - `scripts/dev/plan-status.test.js`
  - packet-status workflow/template docs referenced by the capability manifest

Use `rg` for:
- `plan-status`
- `bootstrap-adoption`
- `decision-log`
- `open-questions`

## Scope

### In Scope

- Create `.bootstrap-adoption.json`.
- Copy Bootstrap packet-status core files needed for local packet status operations.
- Add the minimal `scripts/dev/package.json` CommonJS compatibility shim if needed.
- Add npm scripts for packet status operations.
- Create initial decision/open-question scaffolds if Bootstrap capability guidance expects them.
- Run the Bootstrap audit before and after, and summarize capability status in the progress report.

### Out Of Scope

- Packet frontmatter migration.
- README generated-index conversion.
- Agent prompt migration.
- Falsification-check prose insertion.
- Game source, level source, runtime behavior, usage tracking, or generated guided audit artifacts.
- Dependency installation.

### Files And Areas Likely Touched

- `.bootstrap-adoption.json`
- `scripts/dev/`
- `package.json`
- `docs/decision-log.md`
- `docs/open-questions.md`
- `reports/development/plan-87-bootstrap-consumer-core-setup/progress.md`

## Implementation Requirements

### 1. Bootstrap Audit Baseline

Required behavior:
- Run the Bootstrap audit against Browser Battlegorithms before edits.
- Record the baseline capability statuses in the progress report.

Constraints:
- Do not commit machine-specific absolute paths in repo docs except in the progress report command transcript if unavoidable.
- If Bootstrap is unavailable, stop and report.

### 2. Adoption Manifest

Required behavior:
- Add `.bootstrap-adoption.json` with repo-relative capability paths and explicit adopted/deferred status.
- Mark only capabilities actually present after this packet as adopted.
- Mark agent prompts, falsification check, frontmatter/index migration, and dev console hub as deferred if not completed here.

Constraints:
- Keep the manifest stable and human-reviewable.
- Do not claim compatibility that the post-edit audit does not support.

### 3. Packet Status Core

Required behavior:
- Copy Bootstrap's packet-status core files needed to run local status checks.
- Add npm scripts using the existing repo style. Preferred names:
  - `plan:list`
  - `plan:check`
  - `plan:lint`
  - `plan:render`
  - `plan:set`
- Validate the copied script and tests.

Constraints:
- Preserve Bootstrap-managed file names where possible.
- Do not migrate existing packet content in this packet.
- If the copied script cannot operate without frontmatter migration, document that Plan 88 is required and make sure the command fails clearly rather than silently misreporting status.

### 4. Decision And Open-Question Scaffolds

Required behavior:
- If Bootstrap expects these docs, create `docs/decision-log.md` and `docs/open-questions.md`.
- Seed them only with high-level orientation and current open gates, not a full historical reconstruction.

Constraints:
- Do not present inferred old decisions as owner-accepted unless already recorded in an existing packet.
- Keep entries short enough that future orchestrators can maintain them.

## Work Plan

1. Run the Bootstrap audit and inspect the relevant Bootstrap capability files.
2. Add the adoption manifest and packet-status core files with the CommonJS compatibility shim if needed.
3. Add npm scripts.
4. Add decision/open-question scaffolds only as required by the Bootstrap convention.
5. Run targeted packet-status tests and a post-edit Bootstrap audit.
6. Write the progress report with before/after capability status, commands run, and any deferred capabilities.

## Commands

Run from the repository root unless noted:

```powershell
node <bootstrap-repo>\scripts\bootstrap-audit.js . --report
node scripts/dev/plan-status.test.js
npm run plan:list
npm run plan:check
```

If package scripts changed:

```powershell
npm test
```

## Validation Checklist

- [ ] Bootstrap baseline audit was recorded.
- [ ] `.bootstrap-adoption.json` exists and does not overclaim adopted capabilities.
- [ ] Packet-status core files run under Browser Battlegorithms' ESM package without renaming Bootstrap-managed files.
- [ ] npm packet-status scripts exist and are documented by their names.
- [ ] No game runtime, level, usage, or generated audit evidence files changed.
- [ ] No dependencies were added.
- [ ] Progress report lists commands run, results, deferred capabilities, and risks.

## Stop Conditions

- Bootstrap files are unavailable or materially different from the capability manifest.
- The CommonJS compatibility shim does not work and the only alternative is renaming Bootstrap-managed files.
- The packet-status script requires broad packet-frontmatter edits to run at all.
- A dependency install appears necessary.
- Any change would touch guided level source, runtime source, or private/local classroom data.
