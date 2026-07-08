# Browser Battlegorithms Agent Guide

This file gives repository-wide guidance for coding and orchestration agents. More specific `AGENTS.md` files in subdirectories, if added later, override this file for work inside those folders.

Browser Battlegorithms is a browser-first, static Vite app for a Blockly-driven capture-the-flag programming strategy game. Treat the docs as the contract and keep changes scoped, testable, and consistent with the packet or task you are following.

## Start Here

- Read the task or packet first. If a development packet exists, treat it as the work order.
- If the user asks for analysis, review, packet planning, or curriculum/product judgment, do not jump into source edits unless explicitly asked.
- Then read the authoritative docs for the area you are changing:
  - `docs/packet-creation-guidance.md` when creating or revising packets
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/workflows/packet-tracking-system.md` when touching packet-status tooling or plan sequencing
  - `docs/subsystems/*.md` for any runtime area you will touch
  - `docs/development/README.md` for packet status and sequencing
- If the task is packet-based, also read the packet fully and note its progress-report folder under `reports/development/`.
- Prefer current repository truth over old summaries. Use `rg` to find symbols, level ids, packet names, and subsystem notes.

## Where Things Live

- Core rules and invariants: `src/core/`
- Rendering and animation: `src/render/`
- DOM and UI state: `src/ui/`
- Blockly workspace and block behavior: `src/ai/blockly/`
- NPC / CPU logic: `src/ai/npc/`
- Usage tracking and admin analysis: `src/usage/` and `src/admin/`
- Local-only workbench tools: `src/workbench/`
- Packet docs and sequencing: `docs/development/`
- Generated packet evidence: `reports/development/`
- Local private or cohort usage data: `local/` only, and it must remain untracked

## Working Rules

- Prefer the smallest change that solves the task.
- Use `rg` for search and `apply_patch` for manual edits.
- Do not use destructive git commands, hard resets, or repo-wide rewrites unless explicitly authorized.
- Do not broaden a packet into unrelated refactors or redesigns.
- Do not amend commits, create deployment artifacts, install dependencies, or change repository settings unless the task explicitly authorizes that scope.
- If a change would make a subsystem note untrue, update the note in the same patch or stop and surface the conflict.
- Keep the app static and browser-only; do not introduce server dependencies or deployment steps unless the task explicitly authorizes them.
- Preserve student learning goals: one-action-per-turn execution, clear guided sequencing, boolean reasoning, local sensing, runner roles, and decentralized ally strategy.
- Keep core game rules in `src/core/`, rendering in `src/render/`, UI state in `src/ui/`, Blockly behavior in `src/ai/blockly/`, and NPC logic in `src/ai/npc/`.
- Never commit raw student exports, identity maps, local cohort databases, or other private classroom data. Use ignored `local/` locations for private analysis inputs and outputs.
- Generated outputs should be produced only when the packet asks for them or they are part of an accepted evidence bundle.
- If you encounter unrelated modified files, leave them alone unless the user explicitly asks you to handle them.

## Validation Expectations

- Run targeted tests first, then broader validation only as needed.
- Use the repo scripts rather than inventing ad hoc commands.
- Common commands:
  - `npm run dev:console` (centralized interactive developer console hub)
  - `npm test`
  - `npm run build`
  - `npm run test:browser:smoke`
  - `npm run test:browser`
  - `npm run test:browser:tooling`
  - `npm run test:regression`
  - `npm run level:readiness -- --level <levelId>`
  - `npm run level:dossiers`
  - `npm run level:behavior-evidence`
  - `npm run lint:levels`
  - `npm run analyze:usage`
- If you touch browser-visible UI, confirm the result in the in-app browser when practical.
- If a validation command fails, report whether the failure appears related to your change or pre-existing. Do not hide partial validation.

## Packet Discipline

- Keep progress reports under `reports/development/<packet-name>/progress.md` unless the packet says otherwise.
- Do not write generated outputs unless the packet asks for them or they are part of the accepted evidence bundle.
- Keep `docs/development/README.md` synchronized when adding, completing, superseding, or materially revising packets.
- Follow `docs/packet-creation-guidance.md` for packet metadata, required reading, validation commands, stop conditions, and approval gates.
- Stop and ask for review when the task crosses a contract boundary, changes canonical game rules, changes pedagogy, or requires a deployment, dependency, privacy, or source-of-truth decision that the packet did not authorize.

## Review Expectations

- For code review requests, prioritize bugs, regressions, contract drift, missing tests, and stale docs. Put findings before summaries.
- Treat passing tests as evidence, not proof. Check whether visible behavior still makes sense for a student encountering the UI or level for the first time.
- When reviewing packet work, verify relevant `docs/subsystems/*.md` notes still read true after the change.
- If a report says a command passed, prefer spot-checking the command or the changed test area when practical.

## Final Reporting

When you finish, report:

- what changed
- which files changed
- what validation ran
- what remains risky or unfinished
- whether the work is ready for integration
