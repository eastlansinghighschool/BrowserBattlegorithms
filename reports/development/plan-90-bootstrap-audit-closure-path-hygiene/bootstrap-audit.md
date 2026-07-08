# Plan 90 Bootstrap Audit Report

## Command

Run from the Browser Battlegorithms repository root:

```powershell
node <bootstrap-repo>\scripts\bootstrap-audit.js . --report
```

## Result

Audit date: 2026-07-07

Mode: tracked (`.bootstrap-adoption.json` found)

| capability | verdict | detail |
| --- | --- | --- |
| `packet-status-system` | current | v1.1.0 matches ledger |
| `packet-status-set-verb` | current | v1.0.0 matches ledger |
| `dev-console-hub` | deferred | No dev:console hub exists yet in this repo. |
| `agent-starting-prompts` | current | v1.3.0 matches ledger |
| `falsification-check` | current | v3 marker matches ledger |
| `reports-archive` | current | v1.0.0 matches ledger |
| `root-agent-guide` | current | v1.0.0 matches ledger |
| `decision-log` | current | v1.1.0 matches ledger |

## Drift Sections

- Silently honored intentional divergence: none
- Manifest-honesty failures: none
- Ahead / distill-back items: none
- Behind items: none
- Rationale gaps: none
