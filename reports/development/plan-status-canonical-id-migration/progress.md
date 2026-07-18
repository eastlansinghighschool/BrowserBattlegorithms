# Canonical Packet-ID Migration Provenance

## Overall Summary

Browser Battlegorithms now uses short canonical packet IDs such as `plan-101` for status-tool display and lookup, while descriptive filenames remain unchanged.

## Commit Provenance

Commit `06206b0` combined this packet-ID migration with the already-reviewed Plan 95 advanced-teamplay/optional copy closeout, regenerated digest/progress artifacts, and Plan 95's transition from `ready` to `complete`. The commit is retained without history rewrite. This integration repair does not change any packet status.

## Integration Repair

- Updated current packet-body identifiers and preflight commands in Plans 102, 104, and 105 to use `plan-102`, `plan-104`, and `plan-105`.
- Preserved verbose report-folder paths and historical progress-report command evidence.
- Marked `packet-status-system` as `ahead-of-bootstrap` with a rationale in `.bootstrap-adoption.json`.
- Prepared a Bootstrap reverse-flow proposal for the generic canonical-ID behavior.

## Validation

- `node scripts/dev/plan-status.test.js` - passed, 102/102.
- `node scripts/dev/plan-status.js lint` - passed.
- `node scripts/dev/plan-status.js check plan-105` - passed.
- `git diff --check` - passed with line-ending normalization notices only.

## Remaining Follow-Up

Bootstrap ownership must triage the incoming proposal. After Bootstrap adopts and versions the generic canonical-ID behavior, Browser Battlegorithms can resync and return `packet-status-system` to `adopted`.
