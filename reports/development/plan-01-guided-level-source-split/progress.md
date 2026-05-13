# Progress Report: Plan 01 - Guided Level Source Split

- Packet id: plan-01
- Date: 2026-05-09
- Status: completed

## Summary

Successfully modularized the monolithic guided level definitions and test fixtures into a clean, directory-based structure. Parity with the original campaign behavior has been verified through unit tests and manual smoke checks.

## Files Changed / Created

### Level Source (Modularized)
- `src/config/levels/`
    - `index.js`: Main assembler and entrypoint.
    - `manifest.js`: Informational summary of all levels.
    - `shared/`:
        - `blocklyXml.js`: Shared XML constants and helpers.
        - `levelProgress.js`: Progress initialization logic.
        - `normalizeSetup.js`: Setup normalization helpers.
        - `toolboxes.js`: Shared toolbox block arrays.
    - `phases/`: 38 level files split into 7 phase subdirectories, all prefixed with `level-NN-`.
        - `foundations/`
        - `sensing/`
        - `movement-helpers/`
        - `resources-and-territory/`
        - `advanced-logic/`
        - `advanced-teamplay/`
        - `optional/`
- `src/config/levels.js`: Maintained as a compatibility re-export.

### Reference Solutions (Split)
- `tests/unit/fixtures/guided-reference-solutions/`: 37 standalone `.xml` documents.
- `tests/unit/fixtures/guidedReferenceSolutions.js`: Refactored to load XML documents from the new directory with error handling.

## Baseline vs Final Results

### Commands Run
```powershell
npm test
npm run build
node --input-type=module -e "import { getLevelDefinitions, createInitialLevelProgress } from './src/config/levels.js'; const levels = getLevelDefinitions(); console.log(levels.length, levels[0].id, levels.at(-1).id, Object.keys(createInitialLevelProgress()).length);"
```

### Results
- **`npm run build`**: PASS
- **`npm test`**: 65/69 PASS (4 failures preserved from baseline)
- **Smoke Check**: `38 move-to-target optional-random-lab 38` (SUCCESS)

### Known Failures Preserved
1. **Level Count Mismatch**: `38 !== 36` in `guided-level-contracts.test.js`.
2. **Toolbox Mismatch**: `sensor-barrier-branch` expects different block types.
3. **Demo XML Mismatch**: `find-the-human` tutorial step content mismatch.
4. **Turn Limit Exceeded**: `dodge-and-deliver` reference solution fails on time.

## Deviations from Target Structure
- None. The implementation strictly follows the recommended target structure, including the `level-` prefix for files.

## Follow-up Recommendations
- Resolve the level count drift in `guided-level-contracts.test.js`.
- Fix the `dodge-and-deliver` reference solution or increase the turn limit.
- Update stale toolbox expectations.
