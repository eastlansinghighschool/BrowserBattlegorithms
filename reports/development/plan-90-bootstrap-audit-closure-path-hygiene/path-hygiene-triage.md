# Plan 90 Path-Hygiene Triage

## Scope

Focused on durable docs touched by Plans 87-89:

- `.bootstrap-adoption.json`
- `docs/agent-starting-prompts/`
- `docs/development/README.md`
- `docs/packet-creation-guidance.md`
- `reports/development/plan-88-bootstrap-packet-frontmatter-index-migration/progress.md`
- `reports/development/plan-89-bootstrap-agent-prompts-falsification-adoption/progress.md`
- `reports/development/plan-90-bootstrap-audit-closure-path-hygiene/`

## Findings

### 1. New durable-doc leaks

None found.

The touched prompt bundle and guidance files use repo-relative links and no machine-specific absolute paths.

Bootstrap-expected compatibility copies were added under `docs/agent-starting-prompts/` so the audit can match the consumer repo to the upstream capability ledger without relying on a stale filename shape.

The Plan 90 progress and audit reports use `<bootstrap-repo>` for the Bootstrap checkout path instead of preserving the local absolute path from the review machine.

### 2. Intentional historical path mentions

Found only in older archival and progress-report material:

- `docs/development/README.md` still includes the archived Plan 20 row with `local/` in the historical summary.
- Older packet history continues to mention `local/` and absolute-path examples as part of prior classroom-data and workflow discussions.

These are not new leaks introduced by Plans 87-89, and they are left untouched per packet scope.

### 3. Privacy-sensitive local-data references

No new privacy-sensitive path exposure was introduced in the Plan 87-89 docs.

The repo still intentionally references ignored `local/` paths in packet guidance and cohort-privacy packets because those files describe where private classroom data must live.

## Classification

- Harmless progress-report transcript: none needing action
- Should become repo-relative: none in the touched Plan 87-89 docs
- Should become `<bootstrap-repo>` or another placeholder: none in the touched Plan 87-89 docs
- Privacy-sensitive local classroom path risk: none newly introduced

## Recommended Follow-Up

- Do not broaden this into a historical-doc rewrite.
- If a future cleanup wave is desired, handle `local/` mentions in archived packet history separately and intentionally.
