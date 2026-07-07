# Plan Status Scan Prompt

Audit the development packets in `docs/development/` against repository reality and report discrepancies. You are producing a triage report for the orchestrator. You do not change any packet's status yourself, you do not edit the README packet index, and you do not fix any packet or code yourself.

## If the status tool exists, start there

If `scripts/dev/plan-status.js` exists, run `node scripts/dev/plan-status.js lint` and `node scripts/dev/plan-status.js list` first and treat their output as the baseline. Your job is then to verify the flagged items and spot-check the rest.

## Evidence hierarchy

Weigh evidence in this order, and when layers disagree, report the disagreement rather than picking silently:

1. Repository reality.
2. Git log.
3. Progress report content under `reports/development/<packet-folder>/progress.md`.
4. Packet frontmatter.
5. README index row, if the table is hand-maintained.

## Known failure modes to look for

- stale-ready / superseded-in-fact
- ran-but-never-closed
- intentionally-not-doing vs. forgotten
- delivered-but-unreviewed
- contradictory closure signals

## Scan Procedure

1. Identify scope: full sweep or topic-scoped.
2. Build a packet inventory.
3. Read each in-scope packet end-to-end.
4. Cross-compare claims across packet body, frontmatter, progress report, and reality.
5. Tag every finding.
6. Cite exact lines.
7. Write the report.
8. Hand off.

## Output Format

Write a single markdown report with:

1. Discrepancy table.
2. Healthy summary.
3. Dependency hazards.
4. Suggested orchestrator actions.

## Working Rules

- Use `rg` for searches.
- Read files rather than mutating them.
- Stay strictly within scope.
- Do not write a packet, draft a fix, or recommend implementation.
- If a finding is ambiguous, pick the higher-severity category and explain why.

