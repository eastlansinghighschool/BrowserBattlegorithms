# Progress Report: Plan 97 Inversion Level Prototype

## Summary

Implemented and repaired Plan 97's Inversion Level Prototype as an optional lab (`optional-inversion-lab`) placed at the end of the campaign. The prototype reuses the prediction-checkpoint multiple-choice framework to present a locked conditional program (`IF square ahead is blocked → Stay Still, ELSE → Move Forward`) and asks students to reason from code to board setup, choosing the board setup where the program successfully reaches the target.

## Files Changed

- **[NEW]** `src/config/levels/phases/optional/level-40-optional-inversion-lab.js`: Inversion prototype level definition with `levelKind: "prediction"`, empty toolbox `toolboxBlockTypes: []` for locked program enforcement, `// Non-runnable prediction-style choice level: pass-star-only.` comment, no `starCriteria`, and 3 board-choice options.
- **[MODIFY]** `src/config/levels/phases/optional/index.js`: Registered `level40` (`optional-inversion-lab`) in the optional levels export array.
- **[MODIFY]** `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`: Added 47th row `Optional Lab: Code Inversion` detailing code-to-board conditional reasoning and required prior concepts (`IF/ELSE`, `square-ahead-blocked` sensing).
- **[MODIFY]** `src/dev/levelLintCore.js`: Added a narrow exemption in `checkReferenceSolutionToolboxCompatibility` for intentionally locked levels with an empty toolbox (`toolboxBlockTypes: []`), preserving fixture validity for simulation checks.
- **[NEW]** `tests/unit/fixtures/guided-reference-solutions/optional-inversion-lab.xml`: Reference solution XML fixture for `optional-inversion-lab`.
- **[NEW]** `tests/unit/prediction-inversion-level.test.js`: Unit tests verifying metadata, locked program structure, prediction choice initial state, choice selection flow, and absence of `starCriteria`.
- **[MODIFY]** `tests/unit/guided-level-contracts.test.js`: Updated level definition list to 47 levels including `optional-inversion-lab`.
- **[MODIFY]** `tests/unit/level-dossiers.test.js`: Updated level dossiers count assertion to 47.
- **[MODIFY]** `tests/unit/level-lint.test.js`: Added unit test verifying the empty toolbox lint exemption in `checkReferenceSolutionToolboxCompatibility`.
- **[MODIFY]** `package.json`: Registered `tests/unit/prediction-inversion-level.test.js` in `test:unit`.
- **[NEW]** `reports/development/guided-level-complexity-audit/level-dossiers/47-optional-inversion-lab.md`: Generated 47th level dossier.
- **[NEW]** `reports/development/guided-level-complexity-audit/behavior-evidence/47-optional-inversion-lab.md`: Generated 47th level behavior evidence file (not-applicable summary for non-runnable prediction level).
- **[MODIFY]** `reports/development/guided-level-complexity-audit/summary-index.md`: Updated level summary index.
- **[MODIFY]** `reports/development/guided-level-complexity-audit/behavior-summary-index.md`: Updated behavior summary index.
- **[MODIFY]** `reports/development/guided-level-complexity-audit/par-candidates.json`: Updated par candidates summary.
- **[NEW]** `reports/development/plan-97-inversion-level-prototype/progress.md`: Progress report document.

## Locking Enforcement Note

Program locking is enforced by setting `toolboxBlockTypes: []` (empty toolbox), preventing students from dragging new blocks into the workspace. Existing blocks in `initialBlocklyXml` remain movable/rearrangeable in the Blockly canvas; the existing "Reset to Starter" toolbar button serves as the recovery mechanism if a student rearranges or deletes starter blocks.

## Commands Run & Validation Results

1. `npm run lint:levels`
   - Real output: **0 errors, 53 warnings** (51 baseline warnings + 2 expected new warnings for `optional-inversion-lab`: turn-limit-floor 6 below 8, and untiered board-dynamics-tier, matching existing prediction checkpoints and optional labs).

2. `npm test`
   - Executed 552 unit tests across all test suites (including 2 new tests in `prediction-inversion-level.test.js`, 1 new test in `level-lint.test.js`, and updated level contract assertions).
   - Result: **Passed (552/552 tests pass)**.

3. `npm run build`
   - Executed Vite production build.
   - Result: **Success (built static dist/ in 7.14s)**.

4. `npm run level:dossiers` & `npm run level:behavior-evidence`
   - Generated dossier and behavior evidence artifacts for 47th level `optional-inversion-lab` without churn on existing 01-46 level files.

5. Star criteria audit: `starCriteria` is absent from `level-40-optional-inversion-lab.js` per pass-star-only ruling.

## Problems Encountered and How Resolved (Repair Pass 01)

- **Lint errors resolved**: Added 47th row to `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (resolving 2 matrix agreement errors) and added narrow `toolboxBlockTypes: []` exemption to `checkReferenceSolutionToolboxCompatibility` in `src/dev/levelLintCore.js` with unit test (resolving 4 fixture compatibility errors).
- **Star criteria removed**: Removed `starCriteria: { turnPar: 1 }` from `level-40-optional-inversion-lab.js` per gate ruling and `// Non-runnable prediction-style choice level: pass-star-only.` comment.
- **Distractor 3 label updated**: Updated to `"Either board — the ELSE branch moves when it's clear, and Stay Still also reaches the target when blocked."` per orchestrator decision.
- **Artifacts regenerated**: Generated 47th level dossier and behavior evidence files without unexpected churn on existing level files.

## Remaining Risks or Follow-ups

- None. The level is isolated as an optional lab at campaign end and does not alter campaign numbering or existing level requirements.

## Ready for Orchestrator Review

**Yes.**
