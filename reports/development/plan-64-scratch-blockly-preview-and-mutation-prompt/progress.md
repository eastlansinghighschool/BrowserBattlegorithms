# Plan 64 Progress Report

## Scratch Workspace Isolation

- Built a separate scratch Blockly workspace in the local-dev workbench.
- Scratch uses its own controller and never binds to the student guided workspace instance.
- Readiness simulations run with persistence suppressed, so scratch loads and scratch runs do not touch guided progress or project workspace storage.
- Switching levels refreshes the scratch workspace state instead of reusing a prior candidate.

## Supported Level Categories

- Ordinary guided levels support loading the canonical reference solution into scratch.
- Project levels support explicit target selection for step fixtures and final fixtures.
- Human-input and prediction levels are surfaced for readiness context, but the scratch runner follows the same canonical-run availability rules as the shared readiness engine.

## Fixture Target Rules

- Ordinary levels use their single reference fixture automatically.
- Project levels require an explicit fixture choice in the workbench before scratch loading or prompt generation.
- The workbench does not guess between step and final fixtures.
- The generated prompt names the selected fixture target and its repository path.

## Mutation Prompt Format

- The mutation prompt is deterministic Markdown.
- It includes:
  - selected level metadata
  - target fixture name and path
  - scratch XML payload
  - scratch result evidence
  - canonical comparison summary
  - do-not-touch list
  - validation commands
  - explicit confirmation that the workbench did not write files
- Failing scratch runs are framed as experiments, not ready repairs.

## Tests Added

- Browser tests for:
  - scratch workspace loading on an ordinary guided level
  - canonical fixture loading and run comparison
  - scratch XML edits changing only the scratch candidate
  - generated mutation prompt naming the correct fixture
  - localStorage remaining untouched
  - invalid scratch XML handling
- Unit tests for the pure mutation prompt renderer.

## Files Changed

- [`src/dev/levelReadiness.js`](C:/AI/BrowserBattlegorithms/src/dev/levelReadiness.js)
- [`src/core/levels.js`](C:/AI/BrowserBattlegorithms/src/core/levels.js)
- [`src/ai/blockly/workspace.js`](C:/AI/BrowserBattlegorithms/src/ai/blockly/workspace.js)
- [`src/workbench/workbenchData.js`](C:/AI/BrowserBattlegorithms/src/workbench/workbenchData.js)
- [`src/workbench/workbenchApp.js`](C:/AI/BrowserBattlegorithms/src/workbench/workbenchApp.js)
- [`src/workbench/workbenchStyle.css`](C:/AI/BrowserBattlegorithms/src/workbench/workbenchStyle.css)
- [`src/workbench/workbenchScratch.js`](C:/AI/BrowserBattlegorithms/src/workbench/workbenchScratch.js)
- [`src/workbench/workbenchMutationPrompt.js`](C:/AI/BrowserBattlegorithms/src/workbench/workbenchMutationPrompt.js)
- [`workbench.html`](C:/AI/BrowserBattlegorithms/workbench.html)
- [`tests/browser/workbench.spec.js`](C:/AI/BrowserBattlegorithms/tests/browser/workbench.spec.js)
- [`tests/unit/workbench-mutation-prompt.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/workbench-mutation-prompt.test.js)
- [`docs/development/README.md`](C:/AI/BrowserBattlegorithms/docs/development/README.md)
- [`docs/TESTING.md`](C:/AI/BrowserBattlegorithms/docs/TESTING.md)
- [`package.json`](C:/AI/BrowserBattlegorithms/package.json)

## Commands Run And Results

- `npm run lint:levels`
  - Passed with existing baseline warnings only.
- `npm test`
  - Passed: 352/352.
- `npm run build`
  - Passed.
  - Existing Vite dynamic-import and chunk-size warnings remain.
- `npm run test:browser:smoke`
  - Passed: 82/82.
- `npm run test:browser`
  - Passed: 129/129.
- Targeted browser and unit validation already in place before the final suite runs:
  - `npx playwright test tests/browser/workbench.spec.js --reporter=line`
  - `node --test --test-isolation=none tests/unit/workbench-mutation-prompt.test.js tests/unit/level-readiness.test.js tests/unit/workbench-run-panel.test.js`

## Remaining Risks

- The workbench relies on the local-dev readiness engine by design, so future changes to readiness shape may require prompt renderer updates.
- Vite still warns about the dynamic import in `src/dev/levelReadiness.js`, but it does not block build or browser coverage.

## Ready For Integration

- yes
