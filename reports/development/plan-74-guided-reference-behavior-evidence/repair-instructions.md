# Plan 74 Repair Instructions — Human-Input Project Classification

## Context

Plan 74 generated useful behavior evidence for guided-level complexity audit work, but one generated result currently risks misleading Plan 75 auditors:

- `reports/development/guided-level-complexity-audit/behavior-evidence/33-full-team-tactics.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`

`full-team-tactics` is a project capstone with `humanTurnBehavior: WAIT_FOR_INPUT`. The simulator cannot advance it without live student input, so the generated evidence currently reports it as `fail` / `IN_PROGRESS` with zero reference actions. That is not a real reference-solution failure and should not be presented as one.

## Required Reading

- `docs/development/plan-74-guided-reference-behavior-evidence.md`
- `src/dev/levelBehaviorEvidence.js`
- `tests/unit/level-behavior-evidence.test.js`
- `src/config/levels/level-28-full-team-tactics.js`
- `reports/development/guided-level-complexity-audit/behavior-evidence/21-relay-race.md`
- `reports/development/guided-level-complexity-audit/behavior-evidence/33-full-team-tactics.md`
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md`

## Required Repair

1. Update the Plan 74 generator so project levels with `humanTurnBehavior: WAIT_FOR_INPUT` are classified as non-runnable / not applicable before attempting project fixture simulation.
2. Preserve existing behavior for ordinary human-input levels such as `relay-race`.
3. Preserve existing behavior for documented auto-skip project capstones such as `advanced-scrimmage`.
4. Regenerate the Plan 74 artifacts so:
   - `33-full-team-tactics.md` no longer reports a runtime `fail`.
   - `behavior-summary-index.md` no longer lists `full-team-tactics` as `fail`.
   - The output clearly explains that the level has project fixtures but requires live human input, so runtime behavior evidence is not available from this static generator.
5. Add or update focused tests so this classification cannot regress.
6. Update packet bookkeeping after the repair:
   - Set `docs/development/plan-74-guided-reference-behavior-evidence.md` to `Status: complete` only after the repair is validated.
   - Update `reports/development/plan-74-guided-reference-behavior-evidence/progress.md` with a repair-pass note.
   - Keep `docs/development/README.md` synchronized.

## Validation

Run these commands after the repair:

```powershell
node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js
npm run level:behavior-evidence
npm test
npm run build
```

If full `npm test` is not run, do not describe it as verified in the README or progress report. Say exactly which validation was run.

## Stop Conditions

Stop and ask for guidance before changing guided level source, reference fixtures, game rules, or Plan 75 audit criteria. This repair should only adjust evidence classification, generated Plan 74 artifacts, tests, and packet bookkeeping.
