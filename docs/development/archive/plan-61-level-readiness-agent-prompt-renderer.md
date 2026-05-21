# Plan 61: Level Readiness Agent Prompt Renderer

## Packet Metadata

- Packet id: plan-61
- Packet title: Level Readiness Agent Prompt Renderer
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-20
- Packet type: implementation / developer tooling / testing
- Mutation level: source-code / tests / docs
- Approval gate: before making prompt output authoritative for product decisions, before adding filesystem writes, before changing readiness checks from Plan 60
- Expected artifacts:
  - deterministic Markdown prompt renderer fed by Plan 60 readiness results
  - CLI `--prompt` mode
  - tests for prompt sections and fact/recommendation separation
  - progress report
- Progress report folder: `reports/development/plan-61-level-readiness-agent-prompt-renderer/`
- Progress report file: `reports/development/plan-61-level-readiness-agent-prompt-renderer/progress.md`

## Packet Summary

Goal: Convert structured level readiness results into a deterministic implementation-agent prompt that names the exact level, files, failures, allowed change surfaces, stop conditions, and validation commands.

Why this packet exists:

The fastest way to reduce guided-level repair churn is to stop making each implementation agent rediscover the same level context. A prompt renderer lets a human or future workbench generate a bounded, high-context repair packet for one level without giving the browser tool filesystem write power.

Non-goals:

- Do not add a browser UI.
- Do not edit guided levels or fixtures.
- Do not add prompt modes for broad campaign redesign.
- Do not make the prompt renderer choose product direction when owner judgment is required.
- Do not add filesystem writes.

Depends on:

- Plan 60 complete and integrated.

Blocks:

- Plan 62 Local Dev Workbench Shell can display the generated prompt.
- Plan 65+ future preview-edit packets can reuse the prompt renderer.

## Authority And Contracts

Authoritative sources:

- Plan 60 readiness result schema.
- `docs/development/00-mini-packet-agent-starting-prompt.md`
- `docs/development/00-level-editing-agent-starting-prompt.md`
- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- Existing guided tests and linter contracts.

Contracts this packet must preserve:

- Prompt output must distinguish observed facts from recommendations.
- Prompt output must include owner-decision gates for pedagogy, broad campaign structure, rules, Blockly semantics, and docs source-of-truth changes.
- Prompt output must not suggest broad source edits for a narrow level failure unless readiness evidence requires it.

## Required Reading

- `docs/development/00-level-editing-agent-starting-prompt.md`
- `docs/development/00-mini-packet-agent-starting-prompt.md`
- `docs/packet-creation-guidance.md`
- Plan 60 progress report
- Plan 60 implementation files
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`

## Scope

In scope:

- Add a pure prompt-rendering function that accepts a Plan 60 readiness result.
- Add CLI `--prompt` mode to the readiness command.
- Include concise but complete repair guidance for one selected level.
- Add tests that compare stable prompt fragments.

Out of scope:

- Browser UI.
- Prompting for multi-level lesson redesign.
- File writes.
- Automated source patch generation.
- Changing readiness check semantics.

Files and areas likely touched:

- Plan 60 readiness CLI/module files
- `package.json` only if command shape changes
- `tests/unit/`
- `docs/TESTING.md` if command docs change
- progress report

## Work Plan

1. Inspect Plan 60 readiness result shape.
2. Design a deterministic Markdown prompt template.
3. Implement fact/recommendation/owner-decision sections.
4. Add `--prompt` mode.
5. Add tests for ordinary, project, and not-applicable level cases.
6. Run validation and write progress report.

## Implementation Requirements

### Requirement 1: Prompt Structure

Required behavior:

Generated prompts must include:

- task title
- selected level id/title
- authoritative source files
- required reading
- observed readiness failures/warnings
- evidence, including trace tail when present
- likely repair surfaces
- allowed files/areas
- explicit do-not-touch list
- owner-decision stop conditions
- validation commands
- expected final report fields

Constraints:

- Keep prompts deterministic and stable enough for tests.
- Use repository-relative paths.
- Do not include absolute local machine paths.

### Requirement 2: Fact vs Recommendation

Required behavior:

- Label observed facts separately from recommendations.
- If a readiness check fails, quote the check id and evidence from the readiness result.
- Recommendations may name likely repair surfaces but must not assert product decisions as facts.

Example headings:

- `Observed Facts`
- `Likely Repair Options`
- `Owner Decisions To Avoid Making Silently`
- `Validation`

### Requirement 3: Scoped Change Surfaces

Required behavior:

The prompt should infer conservative allowed surfaces from readiness evidence:

- reference fixture failure: level source and matching fixture only, plus concept matrix if the learning goal changes
- linter/schema failure: named source/doc/fixture files from diagnostic evidence
- project fixture failure: matching project checkpoint/final fixture and level source
- concept matrix mismatch: level source plus concept matrix

Constraints:

- Always include a do-not-touch list covering core rules, Blockly semantics, unrelated levels, static deployment, and broad docs unless evidence says otherwise.

### Requirement 4: CLI

Required behavior:

Example:

```powershell
npm run level:readiness -- --level dodge-and-deliver --prompt
```

- Output Markdown to stdout.
- If `--json` and `--prompt` are both passed, fail clearly or document precedence. Prefer failing clearly.

## Testing Requirements

Add tests for:

- prompt includes selected level title/id and source path
- prompt includes failed/warning check evidence when fixture output is synthetic
- prompt includes validation commands
- prompt distinguishes owner decisions from implementation details
- prompt does not include absolute paths

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/<prompt-renderer-test>.test.js tests/unit/<readiness-test>.test.js
npm run level:readiness -- --level dodge-and-deliver --prompt
npm test
npm run build
```

## Validation Checklist

- [ ] `--prompt` output is valid Markdown.
- [ ] Prompt output is deterministic.
- [ ] Prompt output uses repo-relative paths.
- [ ] Prompt separates observed facts from recommendations.
- [ ] Prompt includes owner-decision stop conditions.
- [ ] No source levels or fixtures changed.
- [ ] No filesystem write behavior was added.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- The renderer needs to invent repair logic not supported by readiness evidence.
- Prompt generation requires changing Plan 60 result schema in a breaking way.
- Any useful prompt would need broad campaign redesign advice instead of one-level repair guidance.
- A dependency, server, or filesystem write behavior seems necessary.

## Progress Report Requirements

Write `reports/development/plan-61-level-readiness-agent-prompt-renderer/progress.md` with:

- prompt template sections
- CLI examples
- how fact/recommendation separation is enforced
- files changed
- commands run and results
- ready-for-integration yes/no
