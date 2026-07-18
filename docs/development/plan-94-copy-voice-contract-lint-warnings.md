---
id: plan-94
title: "Copy Voice Contract And Lint Warnings"
status: complete
resolution: "Orchestrator-verified 2026-07-08 (Claude implementer). Charter S5 voice contract converted to durable docs + non-blocking lint, NO level copy rewritten. VERIFIED: three new rules in levelLintCore.js -- copy-voice-banned-phrase (3 literal meta phrases), copy-voice-spoiler-phrase (narrow 5-phrase deterministic list, deliberately not fuzzy to avoid false positives), copy-voice-prose-length (~35-word cap) -- all SEVERITIES.WARNING, all wired into runLevelLint. Critical property holds: lint:levels exits 0 with the new warnings present (non-blocking; the campaign gate is safe). Banned/spoiler checks scan description/introText/tips/tutorialSteps.body; length cap correctly scoped to description+introText only (tips exempt). docs/CopyVoiceContract.md (new) documents the contract with a rule->lint table whose phrase lists match the code exactly; pointers added to packet-creation-guidance.md and TeacherGuide.md. Scope clean: no src/config/levels file changed by this packet (the L20/blockly-workspace edits in the tree are pre-existing Plan 103; the banned-phrase warning fires on L20's UNCHANGED introText, confirming copy untouched). Real pre-existing copy debt surfaced and RECORDED FOR PLAN 95, not fixed: 5 banned-phrase hits (mirror-forward, watch-the-wall, jump-if-ready, stay-still, my-side-their-side), 6 prose-length hits, 0 spoiler hits. Tests: 9 new lint tests incl. tips-exempt-from-length coverage; full suite 476/476, lint exit 0, build clean. Implementer left status for orchestration; README/index untouched."
depends_on: [plan-85]
gate: "before mutation; do not run until Plan 85 voice contract is accepted"
summary: >-
  Convert Plan 85's student-facing voice contract into docs and lint warnings before broad copy rewrites.
---
# Plan 94: Copy Voice Contract And Lint Warnings

- Packet id: Plan 94
- Packet title: Copy Voice Contract And Lint Warnings
- Status: (see frontmatter)
- Owner/model: implementation agent with curriculum-copy care
- Date: 2026-07-06
- Packet type: docs / testing / level tooling
- Mutation level: source-code tooling/tests plus docs; no level copy rewrites except fixtures for tests
- Approval gate: before mutation; do not run until Plan 85 voice contract is accepted
- Expected artifacts:
  - documented student-facing copy voice contract
  - lint warnings for banned/meta phrases and excessive pre-play prose length
  - tests for the lint warnings
  - progress report
- Progress report folder: `reports/development/plan-94-copy-voice-contract-lint-warnings/`
- Progress report file: `reports/development/plan-94-copy-voice-contract-lint-warnings/progress.md`

## Packet Summary

Goal: Convert Plan 85's student-facing voice contract into durable docs and lint warnings before broad copy rewrites begin.

Non-goals:
- Do not rewrite level copy in this packet.
- Do not fail CI on existing copy unless the owner explicitly authorizes a breaking lint mode.
- Do not implement earned hints.
- Do not change tutorials, demos, or Blockly behavior.

Depends on:
- Plan 85 accepted, especially S4 and S5.
- Existing level lint tooling.

Blocks:
- Plan 95 phase copy rewrites.
- Safer copy edits in Plans 92 and 93, if those are waiting for lint support.

Why this packet exists:
The current student-facing copy often explains pedagogy from the designer's chair. The rewrite wants an in-world scout/coach voice, short pre-play text, and no solution spoilers. A lint warning layer prevents future packets from reintroducing the old voice.

## Authority And Contracts

Required project contracts:
- Plan 85 S4 and S5.
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- Existing level lint tooling.
- `docs/subsystems/blockly-workspace.md` for demo/no-spoiler expectations.

Do not redefine:
- Teacher-facing pedagogy can remain explicit in teacher docs.
- Student-facing mission text should not reveal exact solutions.
- Demo Blockly remains structural.

## Required Reading

Read before editing:
- This packet end-to-end.
- Plan 85.
- Existing level lint source and tests, located via `rg "lint:levels|level lint|banned"`.
- A sample of current level copy around early, resource, and project phases.

Use `rg` for:
- `this level teaches`
- `beginner-friendly`
- `good level`
- `tip`
- `objective`
- `intro`

## Scope

### In Scope

- Add docs for the student-facing voice contract.
- Add lint warnings for:
  - banned/meta phrases
  - overlong pre-play prose fields
  - obvious solution-spoiler phrasing where a deterministic rule can detect it
- Add focused tests.

### Out Of Scope

- Rewriting existing level copy.
- Enforcing all warnings as hard failures.
- Designing earned hint UI.
- Changing teacher docs beyond pointing to the new contract.

## Implementation Requirements

### 1. Voice Contract Documentation

Required behavior:
- Document the in-world scout/coach voice in a durable place.
- Include examples of acceptable and unacceptable phrasing.

Constraints:
- Keep examples generic; do not rewrite specific levels here.

### 2. Lint Warnings

Required behavior:
- Extend level lint tooling to warn on banned/meta phrases and excessive pre-play prose length.
- Warnings must identify level id and field.

Constraints:
- Default mode should not fail the entire suite on existing copy unless owner approved.
- Avoid brittle NLP; use transparent phrase/length checks.

### 3. Tests

Required behavior:
- Add tests for banned phrases, length warning, and a clean example.

## Work Plan

1. Confirm Plan 85 S4/S5 acceptance.
2. Inspect current lint tooling.
3. Add voice contract docs.
4. Add warning rules and tests.
5. Run targeted lint tests and `npm run lint:levels`.
6. Write progress report.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
npm test
```

If there is a focused lint test command, run it first and record it.

## Validation Checklist

- [ ] Voice contract docs exist.
- [ ] Banned/meta phrase warnings work.
- [ ] Length warnings work.
- [ ] Existing level copy was not rewritten.
- [ ] `npm run lint:levels` behavior is documented, including whether warnings are non-blocking.
- [ ] Progress report lists any current copy debt surfaced by warnings.

## Stop Conditions

- Plan 85 voice contract not accepted.
- Lint tooling cannot support warnings without broad rewrite.
- A proposed warning rule requires subjective curriculum judgment.
