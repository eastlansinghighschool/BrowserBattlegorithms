# Plan 62 Progress Report

## Workbench Access

- URL: `http://127.0.0.1:5173/workbench.html` in local development
- Dev-only gating: root-level `workbench.html` is excluded from the Vite production build inputs, and the main app only links to it when `import.meta.env.DEV` is true
- Read-only by design: the workbench reads guided-level context, readiness checks, and prompt output without writing files or mutating guided progress / project workspace state

## Panels Implemented

- Level selector over the guided manifest
- Level context panel with:
  - id, title, order, and kind
  - source path
  - project metadata
  - concept matrix row
  - fixture paths
- Readiness checks panel grouped by status
- Validation command panel
- Prompt textarea with copy/select affordances

## Prompt Sharing

- The workbench consumes the shared Plan 61 renderer in `src/dev/levelReadinessPrompt.js`
- Prompt output is rendered directly from the shared readiness result; the browser shell does not build a separate prompt template

## Tests Added / Updated

- `tests/browser/workbench.spec.js`
  - dev gating and header link
  - selected guided-level rendering
  - storage isolation
  - production build exclusion of `workbench.html`
- Smoke suite inclusion for `workbench.spec.js`
- Browser expectation updated to assert textarea value for the generated prompt

## Files Changed

- `C:/AI/BrowserBattlegorithms/workbench.html`
- `C:/AI/BrowserBattlegorithms/src/main.js`
- `C:/AI/BrowserBattlegorithms/src/workbench/workbenchApp.js`
- `C:/AI/BrowserBattlegorithms/src/workbench/workbenchData.js`
- `C:/AI/BrowserBattlegorithms/src/workbench/workbenchStyle.css`
- `C:/AI/BrowserBattlegorithms/src/dev/levelReadiness.js`
- `C:/AI/BrowserBattlegorithms/src/dev/levelLint.js`
- `C:/AI/BrowserBattlegorithms/src/shims/nodeFsPromises.js`
- `C:/AI/BrowserBattlegorithms/src/shims/nodePath.js`
- `C:/AI/BrowserBattlegorithms/src/shims/nodeUrl.js`
- `C:/AI/BrowserBattlegorithms/vite.config.js`
- `C:/AI/BrowserBattlegorithms/playwright.smoke.config.js`
- `C:/AI/BrowserBattlegorithms/tests/browser/workbench.spec.js`
- `C:/AI/BrowserBattlegorithms/docs/ARCHITECTURE.md`
- `C:/AI/BrowserBattlegorithms/docs/TESTING.md`
- `C:/AI/BrowserBattlegorithms/docs/development/README.md`

## Commands Run And Results

- `npx playwright test tests/browser/workbench.spec.js --reporter=line`
  - Passed: 3/3
- `npm run test:browser:smoke`
  - Passed: 78/78
- `npm run lint:levels`
  - Passed with the existing baseline warnings only
- `npm test`
  - Passed: 347/347
  - Existing `preferences` tests still print their expected localStorage warning messages
- `npm run build`
  - Passed
  - Existing Vite chunk-splitting and chunk-size warnings remain

## Notes

- The workbench now loads browser-side fixture text via Vite raw imports instead of relying on HTTP fetch fallbacks, which keeps the selected-level render stable in dev.
- The browser prompt assertion uses `toHaveValue()` because the generated prompt lives in a `<textarea>`.
- `docs/ARCHITECTURE.md` already contained the new `src/workbench/` surface map entry, so no additional subsystem note edit was needed beyond the packet-local testing docs.

## Approval Gates Honored

- No guided-level editing UI was added
- No filesystem writes were introduced
- No production build exposure was added
- No student-facing guided UI was redesigned

## Remaining Risks

- The workbench is intentionally local-dev only and depends on Vite dev behavior for access.
- The repository still carries the pre-existing Vite chunk warnings unrelated to this packet.

## Ready For Integration

yes
