# Plan 102 Repair Instructions

## Review Summary

The Plan 102 implementation is close and the Bootstrap `dev-console-hub` capability itself is now present. The centralized invocation helper, grouped menu shape, confirmation gates, and launch-error handling are broadly aligned with the packet.

Do not restart the packet. Repair the command-argument wiring and update the durable report.

## Required Repairs

### 1. Fix flagged command argument construction

Current behavior:
- `scripts/dev/control-console.js` stores only prompt labels in `promptArgs`.
- `executeAction()` appends the raw prompt answers directly to the npm script args.
- This makes some menu actions execute invalid commands:
  - `level:readiness` currently becomes `npm run level:readiness -- <levelId>`, but `scripts/level-readiness.js` requires `--level <levelId>`.
  - `usage:cohort` currently becomes `npm run usage:cohort -- <cohortId>`, but `scripts/usage-cohort-analysis.js` requires `--cohort <cohortId>` or `--input/--output`.

Required behavior:
- Add a structured way for menu actions to define fixed flags before prompted values.
- At minimum:
  - `level:readiness` must build args `["--level", "<levelId>"]`.
  - `usage:cohort` must build args `["--cohort", "<cohortId>"]`.
- Preserve the display/execution parity requirement: the displayed confirmation command must come from the same invocation object that executes.

Suggested implementation shape:

```js
promptArgs: [{ label: "Level ID", flag: "--level" }]
```

or an equivalent command-specific `buildArgs()` function. Keep it simple.

### 2. Add focused tests for flagged prompt args

Current tests verify that the registry marks mutating actions as confirmation-required, but they do not prove prompted commands are runnable.

Required test coverage:
- Test the registry/action argument builder for `level:readiness` and assert it produces `["--level", "move-to-target"]`.
- Test the registry/action argument builder for `usage:cohort` and assert it produces `["--cohort", "synthetic-demo"]`.
- If `executeAction()` is hard to test directly, extract a small pure helper such as `buildActionArgs(action, answers)` and test that.

Do not run the actual mutating `usage:cohort` action from the interactive console in tests.

### 3. Update the progress report after repair

The current progress report is mostly good, but after repair it should mention:
- The flagged-argument bug found during orchestration review.
- The focused test(s) added for flag/value argument construction.
- The final Bootstrap audit result.

Keep `<bootstrap-repo>` instead of a local absolute Bootstrap path.

## Already Repaired During Orchestration Review

The first Bootstrap audit rerun showed unrelated manifest drift:
- `agent-starting-prompts` expected `docs/agent-starting-prompts/00-implementer-thread-starting-prompt.md` and `docs/agent-starting-prompts/00-orchestrator-thread-starting-prompt.md`.
- `falsification-check` expected a marker in one of the audit's expected files.

I restored lightweight compatibility entries at those paths. A follow-up Bootstrap audit reported all adopted capabilities current. Leave those files in place unless the owner explicitly changes the Bootstrap compatibility policy.

## Validation Required After Repair

Run:

```powershell
node --test --test-isolation=none tests/unit/control-console.test.js
npm run plan:check -- plan-102-dev-console-hub-adoption
npm run plan:lint
node <bootstrap-repo>/scripts/bootstrap-audit.js . --report
```

If you run `npm test` and `npm run build`, record the results, but the focused console tests and Bootstrap audit are the important repair checks.

## Stop Conditions

Stop and escalate if:
- Supporting flagged arguments requires a broad console rewrite.
- The console would need a dependency.
- The fix would execute mutating/generated-output commands during tests.
- Bootstrap audit expectations change beyond the compatibility files already restored.
