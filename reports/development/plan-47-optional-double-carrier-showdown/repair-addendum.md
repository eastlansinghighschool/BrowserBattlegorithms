# Plan 47 Repair Addendum

Date: 2026-05-18

## Integration Review Finding

Plan 47 adds the optional level in the right curriculum neighborhood, but it is not integration-ready. The main defect is the new failure-condition shape:

```js
failureCondition: { type: "team_scores_point", teamId: 2, maxTurns: 20 }
```

`evaluateLevelProgress()` only enforces `maxTurns` when `failureCondition.type === "turn_limit_exceeded"`, so the reported turn cap for `optional-double-carrier-showdown` is not actually functional.

There is also a student-facing polish gap: `humanizeResultReason()` does not know the new `team_scores_point` failure reason, so a failed level can display raw implementation text.

## Owner Decision Options

Option A — recommended: add explicit multi-failure support.

- Add a new canonical level schema field such as:

  ```js
  failureConditions: [
    { type: "team_scores_point", teamId: 2 },
    { type: "turn_limit_exceeded", maxTurns: 20 }
  ]
  ```

- Preserve the existing singular `failureCondition` path for all current levels.
- Update `evaluateLevelProgress()` to normalize singular and plural conditions into an array and evaluate each failure condition.
- Update manifest/linter helpers so a turn limit can come from either `failureCondition.maxTurns` or any entry in `failureConditions`.
- Update docs to describe authored guided levels as allowing multiple failure conditions.

This is the clearest source-of-truth model and avoids overloading a single `type` with unrelated fields.

Option B — smaller but less clean: treat `failureCondition.maxTurns` as an additional check regardless of `failureCondition.type`.

- This is a narrower code patch.
- It preserves the current authored level object.
- It makes the schema less explicit and easier for future packet authors to misunderstand.

Recommendation: choose Option A unless schedule pressure is extreme.

## Required Repair Scope

1. Fix the failure-condition representation and evaluator behavior using the selected option.

2. Add focused tests:

   - Team 2 scoring fails `optional-double-carrier-showdown`.
   - Exceeding the optional level turn cap fails it.
   - Existing single-condition turn-limit levels still fail as before.
   - Manifest/linter turn-limit handling still sees the optional level's cap.
   - UI result copy humanizes the new team-score failure reason.

3. Update docs:

   - `docs/GameSpecification.md`
   - `docs/subsystems/turn-engine.md`
   - any level-authoring or linter wording touched by the schema change.

4. Re-run:

   ```powershell
   npm run lint:levels
   node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/scoring-and-level-state.test.js tests/unit/level-lint.test.js
   npm test
   npm run build
   npm run test:browser
   ```

5. Keep the new optional level optional and late. Do not move it into the required campaign or add new Blockly blocks.

## Additional Review Notes

- The new level's starter XML is appropriately structural (`STARTER_EVENT_XML`) and does not reveal the solution.
- The setup meets the packet's headline shape: one human Team 1 carrier, two Blockly allies, three Team 2 NPCs, and valid carried flags for both teams.
- The implementer should include a brief fairness note in the progress report after repair: why the human route plus two ally roles is playable without being guaranteed.
- Regression profile filtering from one hard-coded optional id to `level.id.startsWith("optional-")` is a reasonable update.

## Stop Conditions

Stop for owner review if:

- supporting multiple failure conditions requires a broad level-state or UI rewrite;
- the optional level cannot be made winnable without revealing a solved Blockly program;
- the repair requires changing Plan 46 collision semantics;
- unrelated Plan 48/49 work is needed to make Plan 47 tests run.

## Ready Criteria

- The optional level has both functional enemy-score failure and functional turn-limit failure.
- Failure copy is student-readable.
- `npm run lint:levels`, `npm test`, `npm run build`, and `npm run test:browser` pass in an isolated Plan 46/47 worktree.
- The Plan 47 progress report is updated from "not ready" to a clear integration status with exact validation results.
