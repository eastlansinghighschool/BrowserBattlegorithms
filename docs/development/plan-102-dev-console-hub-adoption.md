---
id: plan-102-dev-console-hub-adoption
title: "Dev Console Hub Adoption"
status: ready
depends_on: [plan-87-bootstrap-consumer-core-setup, plan-88-bootstrap-packet-frontmatter-index-migration, plan-90-bootstrap-audit-closure-path-hygiene]
gate: "before adding dependencies, before executing mutating menu actions during implementation validation, before broadening the console into a general task runner"
superseded_by: null
resolution: null
summary: >-
  Adopt Bootstrap's optional dev-console-hub pattern by adding a local submenu-driven `npm run dev:console` command hub for common development, testing, build, and packet-status tasks, with centralized platform-aware package-script invocation, confirmation-gated mutating actions, launch-error reporting, focused tests, and Bootstrap audit closeout.
---
# Plan 102: Dev Console Hub Adoption

- Packet id: Plan 102
- Packet title: Dev Console Hub Adoption
- Status: (see frontmatter)
- Owner/model: implementation agent with tooling/process care
- Date: 2026-07-08
- Packet type: implementation / developer tooling / Bootstrap adoption / tests / docs
- Mutation level: source-code / tests / docs
- Approval gate: before adding dependencies, before executing mutating menu actions during implementation validation, before broadening the console into a general task runner
- Expected artifacts:
  - local `npm run dev:console` command hub
  - centralized package-script invocation helper
  - focused tests for menu shape, package-script invocation, confirmation gating, and launch-error surfacing
  - `.bootstrap-adoption.json` updated from deferred to adopted for `dev-console-hub` after validation
  - docs updated to mention the console
  - progress report
- Progress report folder: `reports/development/plan-102-dev-console-hub-adoption/`
- Progress report file: `reports/development/plan-102-dev-console-hub-adoption/progress.md`

## Packet Summary

Goal: Adopt Bootstrap's `dev-console-hub` capability for Browser Battlegorithms by adding a small local developer command hub exposed as:

```powershell
npm run dev:console
```

The hub should make common safe read paths easy to find: dev server, tests, build, guided evidence generators, usage tooling, and packet-status visibility. It should also expose packet-status mutation actions carefully, behind explicit confirmation gates, because those actions change packet frontmatter and the generated index.

Non-goals:
- Do not add dependencies.
- Do not build a GUI.
- Do not replace normal package scripts; this is a discoverability wrapper, not the new source of truth.
- Do not run mutating actions as part of validation except through dry-run/test doubles.
- Do not add production deployment, GitHub, remote, or network actions.
- Do not import Autodrills-specific console code wholesale; use the Bootstrap pattern and this repo's needs.

Depends on:
- Plan 87, Plan 88, and Plan 90: packet-status tooling, generated index, Bootstrap manifest, and audit workflow are already established.

Blocks:
- Nothing student-facing.
- Future lower-cost implementer onboarding can use the console once adopted.

Why this packet exists:
The Bootstrap audit currently marks `dev-console-hub` as deferred with the local rationale "No dev:console hub exists yet in this repo." That was a practical deferral, not a product objection. Browser Battlegorithms now has many useful local commands (`plan:*`, level evidence, usage cohort tooling, browser tiers, linting), and a discoverable console can reduce agent flailing and owner command friction. The capability is also a good fit because the repo already adopted Bootstrap packet-status tooling.

## Authority And Contracts

Required project contracts:
- `.bootstrap-adoption.json`
- `package.json`
- `docs/workflows/packet-tracking-system.md`
- `docs/development/README.md`
- `docs/packet-creation-guidance.md`
- `docs/TESTING.md`
- `AGENTS.md`
- Bootstrap guidance in `<bootstrap-repo>/docs/bootstrap-capabilities.md` for `dev-console-hub`
- Bootstrap incoming note `<bootstrap-repo>/docs/bootstrap-dev/incoming/2026-07-01-autodrills-dev-console-npm-invocation.md`

Do not redefine:
- Packet status remains owned by `scripts/dev/plan-status.js`.
- `npm run plan:set` remains orchestrator-only in normal workflow. The console may expose it only with a strong confirmation gate and warning.
- Generated cohort outputs and raw student exports remain under ignored `local/`.
- Browser Battlegorithms remains a static Vite app. The console is local developer tooling only.

## Required Reading

Read before editing:
- This packet end-to-end.
- `package.json`
- `scripts/dev/plan-status.js`
- `scripts/dev/plan-status.test.js`
- `docs/workflows/packet-tracking-system.md`
- `docs/TESTING.md`
- `docs/CohortUsageAnalysis.md`
- `.bootstrap-adoption.json`
- `<bootstrap-repo>/docs/bootstrap-capabilities.md` — `dev-console-hub` row.
- `<bootstrap-repo>/docs/bootstrap-dev/incoming/2026-07-01-autodrills-dev-console-npm-invocation.md`

Use `rg` for:
- `dev:console`
- `plan:set`
- `npm run`
- `test:browser`
- `level:`
- `usage:cohort`

## Scope

### In Scope

- Add a Node-based local console script, likely under `scripts/dev/`.
- Add a package-script helper that all console package-script actions use.
- Add `dev:console` to `package.json`.
- Add focused tests for the helper/console.
- Update docs that list common local commands.
- Update `.bootstrap-adoption.json` to:

```json
{
  "capability": "dev-console-hub",
  "state": "adopted",
  "capabilityVersion": "1.1.0"
}
```

only after the local implementation and Bootstrap audit pass.

### Out Of Scope

- Adding dependencies such as `inquirer`, `prompts`, or UI libraries.
- Running the dev server indefinitely during automated tests.
- Production deploy, GitHub actions, branch/commit automation, or network actions.
- A full task runner or plugin framework.
- Student-facing UI changes.
- Changing packet-status semantics.

### Files And Areas Likely Touched

- `package.json`
- `scripts/dev/control-console.js` or similar
- `scripts/lib/package-scripts.js` or similar
- focused tests under `scripts/dev/` or `tests/unit/`
- `.bootstrap-adoption.json`
- `AGENTS.md` and/or `docs/TESTING.md` if command discovery should mention the console
- `reports/development/plan-102-dev-console-hub-adoption/progress.md`

## Implementation Requirements

### 1. Console Shape

Required behavior:
- `npm run dev:console` launches an interactive text menu.
- The top-level menu groups commands rather than listing everything flat.
- Minimum menu groups:
  - Local dev lifecycle
  - Tests and builds
  - Packet status
  - Guided-level tooling
  - Usage/admin tooling
  - Exit
- Include read-only packet-status options such as `plan:list`, `plan:check`, and `plan:lint`.
- Mutating packet-status actions such as `plan:set` must be visibly separated and confirmation-gated.

Constraints:
- Keep copy plain and teacher/operator friendly.
- The console is local tooling; do not include it in Vite build inputs.
- Menus should work in PowerShell on Windows.

### 2. Centralized Package-Script Invocation

Required behavior:
- All console actions that execute `npm run <script>` must route through one helper.
- The helper must build a platform-aware invocation object.
- On Windows, use a safe wrapper such as `cmd.exe /d /s /c "npm run <script> -- <args>"` with the outer spawn using `shell: false`, or an equivalent tested strategy.
- Do not spawn `npm.cmd` directly at individual menu sites.
- The command displayed to the user before a confirmed action must come from the same invocation object that will be executed.
- Launch/spawn errors must be reported distinctly from ordinary nonzero exit codes.

Constraints:
- No dependency installs.
- Avoid ad hoc string concatenation for arguments where an array representation can be preserved.

### 3. Confirmation Gates

Required behavior:
- Any action that mutates packet frontmatter, generated packet index, generated evidence, local cohort outputs, or other files must require explicit confirmation.
- Confirmation text must show the command that will run.
- If the user declines, no command runs.

Suggested gated actions:
- `plan:set`
- `plan:render`
- `level:dossiers`
- `level:behavior-evidence`
- `usage:cohort`

Read-only actions like `plan:list`, `plan:check`, `plan:lint`, and focused test commands may run without extra confirmation.

### 4. Command Coverage

Recommended commands to expose:
- Local dev lifecycle:
  - `dev`
  - `preview`
- Tests and builds:
  - `test`
  - `build`
  - `test:browser:smoke`
  - `test:browser:tooling`
- Packet status:
  - `plan:list`
  - `plan:check`
  - `plan:lint`
  - `plan:render` (confirm)
  - `plan:set` (confirm; strongly warn orchestrator-only)
- Guided-level tooling:
  - `lint:levels`
  - `level:readiness`
  - `level:dossiers` (confirm)
  - `level:behavior-evidence` (confirm)
- Usage/admin tooling:
  - `analyze:usage`
  - `usage:cohort` (confirm; remind that real files stay under `local/usage-cohorts/`)

If a command needs extra arguments, the console may prompt for them or print the exact package-script syntax and return to the menu. Do not overbuild argument forms.

### 5. Bootstrap Manifest And Audit

Required behavior:
- After the console exists, update `.bootstrap-adoption.json` so `dev-console-hub` is adopted at version `1.1.0`.
- Run the Bootstrap audit:

```powershell
node <bootstrap-repo>/scripts/bootstrap-audit.js . --report
```

- Save a durable audit note or include the audit result in the progress report.

Constraints:
- Use `<bootstrap-repo>` in durable docs/progress reports rather than machine-specific absolute paths.

### 6. Tests

Required behavior:
- Add focused tests that do not require a real interactive terminal.
- Tests must cover:
  - `package.json` exposes `dev:console`.
  - package-script invocation helper builds a safe Windows invocation and a non-Windows invocation.
  - command display string comes from the same invocation object used for execution.
  - launch errors are surfaced distinctly from nonzero exit status.
  - at least one mutating action is marked confirmation-required in the console registry.

Constraints:
- Do not start the dev server in tests.
- Do not execute mutating commands in tests.

## Work Plan

1. Inspect current package scripts and Bootstrap `dev-console-hub` guidance.
2. Design a small command registry with metadata: label, group, package script, args prompt/notes, mutating/confirmation flag.
3. Implement the package-script invocation helper.
4. Implement the interactive console using Node built-ins only.
5. Add `dev:console` package script.
6. Add focused tests.
7. Update docs and `.bootstrap-adoption.json`.
8. Run validation.
9. Write progress report.

## Commands

Run from the repository root:

```powershell
node scripts/dev/control-console.test.js
npm run plan:lint
npm run plan:check -- plan-102-dev-console-hub-adoption
node <bootstrap-repo>/scripts/bootstrap-audit.js . --report
```

If the tests are placed under `tests/unit/`, also run:

```powershell
npm test
```

If only local tooling and docs changed, `npm run build` is optional but welcome. Do not run long-lived `npm run dev` as validation.

## Validation Checklist

- [ ] `npm run dev:console` exists.
- [ ] The console uses grouped submenus.
- [ ] All package-script actions go through a centralized invocation helper.
- [ ] Windows package-script invocation is covered by tests.
- [ ] Launch errors are reported distinctly from nonzero exit codes.
- [ ] Mutating/generated-output actions require confirmation.
- [ ] `plan:set` is labeled orchestrator-only / high-caution.
- [ ] No dependencies were added.
- [ ] `.bootstrap-adoption.json` marks `dev-console-hub` adopted at version `1.1.0`.
- [ ] Bootstrap audit reports `dev-console-hub` current/adopted.
- [ ] Progress report uses repo-relative paths and `<bootstrap-repo>` instead of local absolute Bootstrap paths.

## Stop Conditions

Stop and report if:
- A dependency appears necessary for a usable console.
- The implementation would need to alter packet-status semantics.
- Windows-safe invocation cannot be tested without broad platform-specific churn.
- The console design would encourage lower-cost implementers to run mutating orchestration commands without owner/orchestrator review.
- Bootstrap audit expectations differ from the current `dev-console-hub` guidance.
