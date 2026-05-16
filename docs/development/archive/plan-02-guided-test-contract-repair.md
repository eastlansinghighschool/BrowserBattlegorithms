# Plan 02: Guided Test Contract Repair

- Packet id: plan-02
- Packet title: Guided Test Contract Repair
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-09
- Packet type: testing / implementation
- Mutation level: tests / source-code if required / docs-only progress report
- Approval gate: none
- Expected artifacts:
  - Passing `npm test`
  - Updated guided level contract tests aligned with the current 38-level campaign
  - A passing canonical reference solution for every non-human guided level
  - A progress report at `reports/development/plan-02-guided-test-contract-repair/progress.md`
- Progress report folder: `reports/development/plan-02-guided-test-contract-repair/`
- Progress report file: `reports/development/plan-02-guided-test-contract-repair/progress.md`

## Goal

Repair the current guided-level unit test failures after the guided campaign changes and Plan 01 source split.

This is a small-scale correctness packet. It should reconcile tests and canonical XML solutions with the current authored campaign, not redesign the guided sequence.

Current failing baseline from 2026-05-09:

- `npm test` fails 4 assertions.
- `npm run build` passed after Plan 01.

Failing tests:

1. `tests/unit/guided-level-contracts.test.js`
   - `level definitions load with the expected starter and advanced level order`
   - current actual level count is `38`; the test still expects `36`
   - test still expects removed/renumbered IDs such as `enemy-side-decision-making`

2. `tests/unit/guided-level-contracts.test.js`
   - `guided toolbox restriction reflects the curriculum unlock path`
   - `sensor-barrier-branch` now intentionally senses `ENEMY_RUNNER`, while the test still expects `BARRIER`

3. `tests/unit/guided-level-contracts.test.js`
   - `generic sensing authored levels keep their support targets open`
   - test expects the `find-the-human` demo XML to include `ANYWHERE_FORWARD`, but the current demo intentionally uses a different object/relation so it does not give away the puzzle

4. `tests/unit/guided-reference-solutions.test.js`
   - `reference code-block programs solve every non-human guided level`
   - `dodge-and-deliver` reference solution exceeds the turn limit

## Non-Goals

- Do not perform a broad guided-level redesign.
- Do not rewrite tutorial copy except where a test reveals a real typo or mismatch.
- Do not change Blockly block semantics.
- Do not change core game rules.
- Do not add new guided levels.
- Do not remove guided levels.
- Do not update broad public docs such as `README.md` or `docs/DevelopmentPhases.md`; that belongs in a separate documentation alignment packet unless the integration owner asks to combine it.
- Do not add dependencies or generated test tooling.

## Depends On

- Plan 01 completed source split.
- `docs/development/plan-01-guided-level-source-split.md`
- `reports/development/plan-01-guided-level-source-split/progress.md`

## Blocks

This packet should restore the baseline needed before future guided-level pedagogy packets:

- challenge badge / synthesis framing
- docs level-count alignment
- late multi-ally level repair
- build-size review

## Why This Packet Exists

The current test failures are no longer useful signal. Some assertions protect stale campaign facts, and one canonical solution no longer proves its level. Future guided-level changes need a clean test baseline so regressions are visible.

For student learning, the canonical solution tests matter because they prove every non-human guided level is solvable by the authored Blockly tools. For AP CSA alignment, these tests should protect the intended reasoning contract: the campaign order, toolbox restrictions, and canonical solutions should match the strategy concepts students are supposed to practice.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `docs/development/plan-01-guided-level-source-split.md`
- `reports/development/plan-01-guided-level-source-split/progress.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/config/levels/phases/`
- `src/config/levels/shared/blocklyXml.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guidedReferenceSolutions.js`
- `tests/unit/fixtures/guided-reference-solutions/`

## Scope

In scope:

- Update stale guided-level contract assertions to match the current authored campaign.
- Update stale test names if needed so they describe the current contract.
- Update the canonical `dodge-and-deliver` XML solution if a valid solution exists within the current level rules.
- If no reasonable canonical XML solution exists within the current turn limit, make the smallest level-source adjustment needed to make the intended challenge solvable, then document why.
- Add focused assertions that protect the new source-split structure where useful.
- Create the required progress report.

Out of scope:

- Public doc wording updates outside the progress report.
- Broad demo XML redesign.
- Broad campaign balance work.
- Browser UI changes.
- Playwright changes unless a unit-test fix exposes a genuine browser-only risk.

Likely files touched:

- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- Possibly `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- Possibly `src/config/levels/manifest.js` if tests reveal an obvious manifest bug
- `reports/development/plan-02-guided-test-contract-repair/progress.md`

## Current Campaign Order Contract

Update the stale order test to match the current source order:

1. `move-to-target`
2. `reach-enemy-flag`
3. `score-a-point`
4. `barrier-detour`
5. `mirror-forward`
6. `sensor-barrier-branch`
7. `watch-the-wall`
8. `find-the-human`
9. `find-the-enemy-flag`
10. `human-runner-practice`
11. `move-toward-flag`
12. `bring-it-home`
13. `enemy-nearby`
14. `jump-the-gap`
15. `dodge-and-deliver`
16. `jump-if-ready`
17. `build-the-barrier`
18. `stay-still-can-do-something`
19. `relay-race`
20. `my-side-their-side`
21. `freeze-the-lane`
22. `show-what-you-know`
23. `closest-threat`
24. `how-far-away`
25. `two-conditions-at-once`
26. `this-or-that`
27. `flip-the-answer`
28. `full-team-tactics`
29. `one-program-two-allies`
30. `index-jobs`
31. `first-two-defend`
32. `escort-the-carrier`
33. `closest-enemy-defender`
34. `freeze-support`
35. `barrier-specialist`
36. `jump-team`
37. `advanced-scrimmage`
38. `optional-random-lab`

Preserve this order unless source inspection proves the current order itself is wrong. If so, stop and report.

## Detailed Requirements

### 1. Refresh Level Count And Order Test

Update the first guided-level contract test so it expects 38 definitions and the exact current ID order.

Also assert the useful curriculum landmarks:

- `dodge-and-deliver` title starts with `Challenge 15`
- `show-what-you-know` title starts with `Challenge 22`
- `full-team-tactics` title starts with `Challenge 28`
- `optional-random-lab` remains last

Do not make the test derive the expected list from `GUIDED_LEVEL_MANIFEST`; that would make the test circular.

### 2. Refresh Sensor Level Contract

Update the `sensor-barrier-branch` expectation to match current authored behavior:

- `sensorObjectTypes` should be `[SENSOR_OBJECT_TYPES.ENEMY_RUNNER]`
- `sensorRelationTypes` should be `[SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT]`
- The level intro/tutorial should still communicate the bridge from earlier barrier-specific checks to the generic sensor.

This is not a behavior bug. The current level title and description say the student should sense an enemy runner.

### 3. Refresh Demo XML Contract

Do not restore the old expectation that `find-the-human` demo XML includes `ANYWHERE_FORWARD`. That expectation conflicts with the current anti-spoiler demo strategy.

Instead, test the intended contract:

- `find-the-human` should expose directional relation types, including `ANYWHERE_FORWARD`.
- `find-the-human` demo XML should exist.
- The demo XML should not use `HUMAN_RUNNER`.
- The demo caption should communicate that the example uses a different object than the level.

This preserves the learning goal: demo Blockly should show structure, not reveal the exact solution.

### 4. Repair `dodge-and-deliver` Canonical Solution

Try to solve this by editing only:

- `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`

Preferred outcome:

- A canonical solution that passes the existing `dodge-and-deliver` source with `failureCondition.maxTurns: 22`
- The solution uses only blocks available in the level toolbox
- The solution expresses a plausible student strategy using flag possession, sensing and/or helper movement

If no canonical solution can pass within 22 turns after a reasonable attempt:

- Make the smallest source adjustment needed, likely increasing `failureCondition.maxTurns` in `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- Keep the challenge meaning intact
- Explain in the progress report why the turn limit, not the XML, was the issue

Do not weaken the win condition from score-based to target-cell-based.

### 5. Keep Reference Solution Coverage Strong

The following tests should pass and continue to mean something:

- every non-human guided level has a reference XML file
- every non-human guided reference XML solves its level
- canonical solutions use valid Blockly block XML

If the current fixture loader silently accepts extra XML files for non-existent levels, consider adding a focused assertion or loader check to report extras. Keep this small.

### 6. Optional Manifest Sanity

If touching tests anyway, add one small non-circular manifest sanity check only if it is natural:

- manifest count matches `getLevelDefinitions().length`
- manifest first/last IDs match `move-to-target` / `optional-random-lab`

Do not make production code depend on the manifest.

### 7. Progress Report

Create `reports/development/plan-02-guided-test-contract-repair/progress.md` with:

- Summary
- Files changed
- Failures found at baseline
- For each of the 4 failures: stale test, source bug, fixture bug, or level balance issue
- What changed for each failure
- Commands run and results
- Any remaining risks
- Recommended next packet(s)

## Validation

Run before editing:

```powershell
npm test
```

Run after editing:

```powershell
npm test
npm run build
```

Also run this focused smoke check:

```powershell
node --input-type=module -e "import { getLevelDefinitions } from './src/config/levels.js'; const levels = getLevelDefinitions(); console.log(levels.length, levels[14].id, levels[21].id, levels[27].id, levels.at(-1).id);"
```

Expected output:

```text
38 dodge-and-deliver show-what-you-know full-team-tactics optional-random-lab
```

## Stop Conditions

Stop and report if:

- The current source order appears accidentally wrong rather than intentionally updated.
- Passing the tests requires removing a guided level or changing a level ID.
- The only way to pass `dodge-and-deliver` is to substantially redesign the board, NPC behavior, or win condition.
- A test assertion would force solution-revealing demo XML back into the campaign.
- Validation exposes new failures outside guided-level contracts and canonical solutions.
- The dirty working tree contains conflicting user edits in the same test or level files.

## Final Response Requirements

The implementing agent should report:

- Packet: Plan 02 Guided Test Contract Repair
- Summary of each repaired failure
- Files changed
- Whether `npm test` passes
- Whether `npm run build` passes
- Whether `dodge-and-deliver` now has a passing canonical XML solution or a minimally adjusted turn limit
- Any remaining risks or follow-ups
- Ready for integration: yes/no
