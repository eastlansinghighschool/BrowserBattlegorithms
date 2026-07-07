# Plan 89: Bootstrap Agent Prompts And Falsification Adoption

- Packet id: Plan 89
- Packet title: Bootstrap Agent Prompts And Falsification Adoption
- Status: ready
- Owner/model: lower-cost docs/tooling implementation agent
- Date: 2026-07-06
- Packet type: docs / workflow integration
- Mutation level: docs-only plus optional copied helper script
- Approval gate: before deleting old prompts, before changing packet approval policy, before adding dependencies
- Expected artifacts:
  - Bootstrap-derived agent-starting prompts adapted for Browser Battlegorithms
  - falsification-check convention adopted in packet guidance
  - old prompt files left as compatibility links or clearly marked transitional
  - progress report
- Progress report folder: `reports/development/plan-89-bootstrap-agent-prompts-falsification-adoption/`
- Progress report file: `reports/development/plan-89-bootstrap-agent-prompts-falsification-adoption/progress.md`

## Packet Summary

Goal: Adopt Bootstrap's reusable agent prompt set and falsification-check workflow so future Browser Battlegorithms implementers, orchestrators, design reviewers, packet scanners, and coverage scanners start with current repo contracts instead of ad hoc thread prompts.

Non-goals:
- Do not change game code, tests, guided levels, admin tooling, or usage tracking.
- Do not migrate packet frontmatter/index; that is Plan 88.
- Do not remove existing `docs/development/00-*` prompts unless the owner explicitly approves deletion.
- Do not make falsification-check a blocking CI step in this packet.
- Do not add dependencies.

Depends on:
- Plan 87 complete.
- Preferably Plan 88 complete so new prompts can reference Bootstrap packet-status commands accurately.

Blocks:
- More reliable implementer dispatch for the guided rewrite wave.
- Future lower-cost agent coverage scans and design reviews.

Why this packet exists:
Browser Battlegorithms is now using multi-agent workflows heavily. The most expensive mistakes have come from stale assumptions, over-broad edits, and reports that said "tests pass" without checking pedagogy or subsystem truth. Bootstrap's prompt and falsification conventions are specifically meant to reduce that flailing.

## Authority And Contracts

Required project contracts:
- `AGENTS.md`
- `docs/packet-creation-guidance.md`
- Existing `docs/development/00-*` starting prompts.
- Bootstrap `agent-starting-prompts` capability files.
- Bootstrap `falsification-check` capability files.
- `docs/development/README.md`

Do not redefine:
- The integration owner remains the authority for pedagogy, level sequence, privacy, and deployment decisions.
- Packet approval gates remain binding.
- Agents may not commit raw student exports or local private cohort data.
- Subsystem notes remain runtime contracts.

## Required Reading

Read before editing:
- This packet end-to-end.
- `AGENTS.md`
- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `docs/development/00-mini-packet-agent-starting-prompt.md`
- Other `docs/development/00-*` prompt files.
- From Bootstrap:
  - implementer prompt
  - orchestrator prompt
  - design-review prompt
  - plan-scan prompt
  - test-coverage-scan prompt
  - falsification-check instructions/convention

Use `rg` for:
- `falsification`
- `starting prompt`
- `mini-packet`
- `subsystem`
- `raw student`

## Scope

### In Scope

- Create a durable prompt folder such as `docs/agent-starting-prompts/`.
- Adapt Bootstrap prompts to Browser Battlegorithms' exact contracts.
- Preserve old prompt entry points as compatibility stubs or links to the new prompts.
- Add falsification-check expectations to `docs/packet-creation-guidance.md`.
- If Bootstrap provides a helper script for falsification checks, copy it only if it has no dependency or CI implications.

### Out Of Scope

- Changing packet status.
- Changing implementation packets' content beyond references to new prompts.
- CI enforcement.
- Browser or source validation.

### Files And Areas Likely Touched

- `docs/agent-starting-prompts/`
- `docs/development/00-*.md`
- `docs/packet-creation-guidance.md`
- optional `scripts/dev/` falsification helper if Bootstrap provides one
- `reports/development/plan-89-bootstrap-agent-prompts-falsification-adoption/progress.md`

## Implementation Requirements

### 1. Prompt Set

Required behavior:
- Add Browser Battlegorithms versions of the Bootstrap prompts for:
  - implementation agents
  - orchestrators
  - design reviewers
  - packet/status scanners
  - test-coverage scanners
- Each prompt must mention the project contracts that matter most: student learning, one-action-per-turn, static Vite deployment, subsystem notes, private data handling, and packet discipline.

Constraints:
- Prompts should route agents to current repo truth rather than embedding long stale summaries.
- Do not make every prompt enormous; prefer references to `AGENTS.md` and required docs.

### 2. Transitional Compatibility

Required behavior:
- Existing `docs/development/00-*` prompt files should either continue to work or clearly point to the new canonical prompt location.

Constraints:
- Do not delete the old files in this packet.
- Do not break existing packet required-reading links.

### 3. Falsification Check

Required behavior:
- Add a falsification-check section to packet guidance that asks implementers/reviewers to actively test how their change could be wrong.
- Include examples tailored to this repo:
  - "passing tests but lesson no longer requires the claimed block"
  - "generated report says complete but subsystem note is stale"
  - "usage report has counts but hides sequence story"
  - "private data path accidentally became tracked"

Constraints:
- Keep it advisory/workflow-level unless the owner later authorizes automated enforcement.

## Work Plan

1. Read Bootstrap prompt/falsification assets and existing Browser Battlegorithms prompts.
2. Create/adapt the new prompt folder.
3. Update old prompt files as transitional entry points.
4. Update packet guidance with falsification-check expectations.
5. Run docs search to confirm no required-reading link now points to a misleading prompt.
6. Write the progress report.

## Commands

Run from the repository root:

```powershell
rg "00-.*prompt|agent-starting-prompts|falsification" docs
npm run plan:check
```

If Plan 88 has not landed yet and `npm run plan:check` is unavailable, use the closest packet-status command from Plan 87 and record the substitution.

## Validation Checklist

- [ ] New prompt folder exists with all five adapted prompt types.
- [ ] Old prompt paths remain usable or clearly point to replacements.
- [ ] Packet guidance includes a Browser Battlegorithms-specific falsification-check convention.
- [ ] No source code, levels, tests, usage data, generated evidence, or private local files changed.
- [ ] Progress report lists copied/adapted Bootstrap assets and any deviations.

## Stop Conditions

- Bootstrap prompt assets are unavailable.
- Adapting prompts would require deciding pedagogy or owner policy not already recorded.
- A helper script would require new dependencies or CI changes.
- Old prompt links cannot be preserved without a broader docs migration.
