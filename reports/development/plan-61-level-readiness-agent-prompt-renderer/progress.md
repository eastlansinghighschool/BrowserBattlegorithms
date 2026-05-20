# Plan 61 Progress Report: Level Readiness Agent Prompt Renderer

## Prompt Template Sections

The renderer now produces deterministic Markdown with these sections:

- Task
- Selected Level
- Required Reading
- Readiness Snapshot
- Observed Facts
- Likely Repair Options
- Allowed Files and Areas
- Owner Decisions To Avoid Making Silently
- Validation
- Expected Final Report Fields

The prompt separates observed facts from recommendations and keeps the repair advice narrow to the files named by the readiness evidence.

## CLI Examples

- `npm run level:readiness -- --level dodge-and-deliver --prompt`
- `npm run level:readiness -- --level dodge-and-deliver --json`

The CLI now rejects `--json` and `--prompt` when they are used together.

## Fact / Recommendation Separation

The renderer treats readiness checks as facts:

- It lists each check with `id`, `status`, `severity`, and `message`.
- For failed and warning checks, it renders the check evidence in a JSON code block.
- It includes related files for each check in repo-relative form only.

Recommendations are rendered in a separate section and stay conservative:

- concept matrix mismatches point to the level source plus the concept matrix
- lint diagnostics point to the files named by the evidence
- reference and project fixture problems point to the matching fixture and level source
- documented project exceptions remain documented instead of being silently rewritten into passes

## Validation Status

All requested validation passes.

- `node --test --test-isolation=none tests/unit/level-readiness.test.js tests/unit/level-readiness-prompt.test.js`
  - Passed: 9/9
- `npm run level:readiness -- --level dodge-and-deliver --prompt`
  - Passed
- `npm run level:readiness -- --level dodge-and-deliver --json --prompt`
  - Failed clearly with `Use only one of --json or --prompt.`
- `npm test`
  - Passed: 347/347
- `npm run build`
  - Passed

## Files Changed

- `src/dev/levelReadinessPrompt.js`
- `scripts/level-readiness.js`
- `tests/unit/level-readiness-prompt.test.js`
- `tests/unit/level-readiness.test.js`
- `package.json`
- `docs/TESTING.md`
- `docs/development/README.md`

## Remaining Risks

- The prompt renderer depends on the Plan 60 readiness schema staying stable.
- The current output intentionally stays conservative; broader repair guidance should remain a human decision instead of becoming prompt-generated policy.

## Ready For Integration

yes
