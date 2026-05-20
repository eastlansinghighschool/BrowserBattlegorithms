# Plans 60-64 Repair Directions: Readiness Lint Contract Alignment

## Review Summary

Plans 60-64 are not ready for integration yet. The local-dev workbench, prompt renderer, canonical run panel, and scratch mutation flow are promising, but they currently sit on a readiness engine that does not preserve the authoritative level-lint contract from `scripts/lint-levels.js`.

The root repair belongs in Plan 60. Plans 61-64 should then be revalidated against the repaired engine because they consume its result shape and evidence.

## Blocking Finding

### 1. Readiness diagnostics disagree with the canonical level linter

The implementation added `src/workbench/workbenchLint.js` and made `src/dev/levelLint.js` re-export that reduced browser-oriented linter. As a result, `src/dev/levelReadiness.js` no longer consumes the full set of lint checks from `scripts/lint-levels.js`, even though Plan 60 explicitly required existing linter warnings/errors to remain visible.

Observed drift:

```text
move-toward-flag
  readiness: reference-solution-toolbox-compatibility
  full lint: win-condition-requires-named-mechanic

show-what-you-know
  readiness: reference-solution-toolbox-compatibility
  full lint: challenge-introduces-no-new-block, challenge-introduces-no-new-block

prediction-25
  readiness: reference-solution-toolbox-compatibility, turn-limit-floor
  full lint: turn-limit-floor, sensor-relation-policy

advanced-scrimmage
  readiness: reference-solution-toolbox-compatibility
  full lint: (none)
```

The readiness path is both hiding real canonical diagnostics and creating false diagnostics. The false toolbox warning appears because the reduced linter counts `battlegorithms_on_each_turn` as a missing toolbox block, while the canonical linter intentionally ignores that event wrapper.

This undermines:

- Plan 60 readiness check correctness.
- Plan 61 generated agent prompts, because they can route an implementer toward the wrong repair.
- Plan 62 workbench check display.
- Plan 64 mutation prompts when validation evidence is copied into a repair task.

## Secondary Finding

### 2. Readiness JSON leaks absolute local paths

`npm run level:readiness -- --level move-toward-flag --json` emits `C:\AI\BrowserBattlegorithms\docs\GUIDED_LEVEL_CONCEPT_MATRIX.md` in `checks[*].relatedFiles`. Plan 60 required repository-relative paths in JSON so reports are portable across machines, and Plan 61 required prompts to avoid absolute local paths.

This likely comes from constants such as `CONCEPT_MATRIX_PATH` being inserted into `relatedFiles` without `toRepoRelative()`.

## Recommended Repair

Use one canonical lint implementation for both CLI and browser/workbench consumers.

Preferred implementation path:

1. Extract the pure lint-check functions from `scripts/lint-levels.js` into a shared source module, for example `src/dev/levelLintCore.js`.
2. Keep Node filesystem loading and CLI formatting in `scripts/lint-levels.js`.
3. Have both `scripts/lint-levels.js` and `src/dev/levelReadiness.js` import the same shared `runLevelLint()` core.
4. Delete or sharply reduce `src/workbench/workbenchLint.js`; it must not become a second authoritative linter. If browser bundling needs a module inside `src/`, use the shared core from step 1.
5. In the workbench, build lint diagnostics from the full campaign context, not just the selected level. Then filter display to diagnostics for the selected level plus `campaign`, preserving cumulative checks such as concept matrix agreement and "challenge introduces no new block."
6. Ensure `battlegorithms_on_each_turn` remains excluded from toolbox compatibility diagnostics, matching the current canonical linter.
7. Normalize all `relatedFiles`, diagnostic `file` fields that enter readiness JSON, prompt output, and workbench display to repo-relative slash paths.

Acceptable alternate path:

- If extracting the full linter core is too broad for the repair, make `src/dev/levelReadiness.js` import `runLevelLint()` directly from `scripts/lint-levels.js` for the Node CLI path, and create a clearly documented browser adapter that consumes precomputed/canonical diagnostics from the same logic. Do not keep a handwritten linter subset that disagrees with `npm run lint:levels`.

## Required Tests

Add tests that fail on the current drift:

- `move-toward-flag` readiness lint evidence includes `win-condition-requires-named-mechanic` and does not include a false `reference-solution-toolbox-compatibility` warning for `battlegorithms_on_each_turn`.
- `show-what-you-know` readiness lint evidence includes `challenge-introduces-no-new-block`.
- `prediction-25` readiness lint evidence includes `sensor-relation-policy`.
- `advanced-scrimmage` readiness lint evidence does not invent a reference-solution toolbox warning.
- Readiness JSON and generated prompts contain no `C:\`, `/Users/`, or repo-root absolute path fragments in paths.
- Workbench rendering for one known baseline-warning level shows the same lint contract surfaced by `npm run lint:levels`.

## Validation Commands

Run from repo root:

```powershell
node --test --test-isolation=none tests/unit/level-readiness.test.js tests/unit/level-readiness-prompt.test.js tests/unit/workbench-run-panel.test.js tests/unit/workbench-mutation-prompt.test.js tests/unit/level-lint.test.js
npm run level:readiness -- --level move-toward-flag --json
npm run level:readiness -- --level show-what-you-know --json
npm run level:readiness -- --level prediction-25 --json
npm run level:readiness -- --level advanced-scrimmage --json
npm run lint:levels
npx playwright test tests/browser/workbench.spec.js --reporter=line
npm test
npm run build
npm run test:browser:smoke
```

Run the full browser suite if the workbench bundling or Vite aliases change:

```powershell
npm run test:browser
```

## Stop Conditions

Stop for owner/orchestrator review if:

- Sharing the full lint core with the browser requires a broad rewrite of `scripts/lint-levels.js`.
- The workbench cannot use canonical lint diagnostics without reintroducing Node filesystem APIs into production bundles.
- Any readiness check semantics need to be changed rather than faithfully represented.
- Repairing path normalization requires changing fixture locations or source-of-truth files.

## Ready Target

The repaired implementation is ready only when `level:readiness`, generated prompts, and the workbench all report the same selected-level lint evidence as `npm run lint:levels`, modulo intentional filtering to the selected level plus campaign diagnostics.
