# Plan 54 Progress Report: Count-Within Sensor Block

## Summary

This packet added the new Blockly value block `battlegorithms_value_count_within`, extended the sensing vocabulary with `ALLY_RUNNER`, and exposed the block in the Strategy Brain project arc, the Team Strategy Script project arc, and Free Play default.

The implementation stayed inside the packet contract:

- Manhattan distance remained the counting metric
- the countable set stayed locked to four object types
- the existing boolean sensor block gained `ALLY_RUNNER` symmetry
- no guided L1-L22 level toolbox gained the new block
- no reference solution was changed
- no new guided level, bug hunt, or prediction level was authored

## Files Changed

- [`src/config/constants.js`](C:/AI/BrowserBattlegorithms/src/config/constants.js) - added `ALLY_RUNNER` and the new `VALUE_COUNT_WITHIN` block type constant.
- [`src/core/conditions.js`](C:/AI/BrowserBattlegorithms/src/core/conditions.js) - added `countObjectsWithin()` and `ALLY_RUNNER` sensor support.
- [`src/ai/blockly/blocks.js`](C:/AI/BrowserBattlegorithms/src/ai/blockly/blocks.js) - registered the new count-within block and added `ALLY_RUNNER` to the sensor dropdown options.
- [`src/ai/blockly/workspace.js`](C:/AI/BrowserBattlegorithms/src/ai/blockly/workspace.js) - wired the new number block into Blockly evaluation and trace collection.
- [`src/config/levels/shared/toolboxes.js`](C:/AI/BrowserBattlegorithms/src/config/levels/shared/toolboxes.js) - exposed the new block through the shared advanced number block list used by project toolboxes and Free Play.
- [`src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js) - added `ALLY_RUNNER` to the project capstone sensor allowlist.
- [`tests/unit/count-within.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/count-within.test.js) - new focused tests for counting, boolean ally sensing, and trace recording.
- [`tests/unit/guided-level-contracts.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/guided-level-contracts.test.js) - verified the Strategy Brain capstone exposes the new block and ally runner dropdown.
- [`tests/unit/level-lint.test.js`](C:/AI/BrowserBattlegorithms/tests/unit/level-lint.test.js) - added a lint regression showing the project arc can introduce the block before later challenge reuse.
- [`docs/subsystems/blockly-workspace.md`](C:/AI/BrowserBattlegorithms/docs/subsystems/blockly-workspace.md) - updated the Blockly catalog to include count-within and ally runner availability.
- [`docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`](C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md) - added a note that count-within becomes available from Strategy Brain project entry.
- [`docs/development/future-directions-analysis/count-within-curriculum-introduction.md`](C:/AI/BrowserBattlegorithms/docs/development/future-directions-analysis/count-within-curriculum-introduction.md) - deferred lesson plan for the future introduction, bug hunt, prediction, and reference-solution cleanup.
- [`docs/development/README.md`](C:/AI/BrowserBattlegorithms/docs/development/README.md) - moved Plan 54 from active to completed packets.
- [`docs/development/plan-54-count-within-sensor-block.md`](C:/AI/BrowserBattlegorithms/docs/development/plan-54-count-within-sensor-block.md) - updated packet status to complete.
- [`package.json`](C:/AI/BrowserBattlegorithms/package.json) - added the new unit test file to the unit-test allowlist.

## Tuning Choices

- Count metric: Manhattan distance, `|dx| + |dy| <= N`.
- Distance dropdown: `1` through `6`.
- Countable objects: `ENEMY_RUNNER`, `BARRIER`, `HUMAN_RUNNER`, `ALLY_RUNNER`.
- Self-exclusion: the evaluator does not count itself for `ALLY_RUNNER` or `HUMAN_RUNNER`.
- Frozen runners: included in counts, matching the existing active-on-board sensing model.
- Jail: there is no active jail concept in the current runtime, so no special jail branch was needed.
- Toolbox placement: project toolboxes and Free Play only.
- Boolean sensor symmetry: `ALLY_RUNNER` is available in the generic sensor dropdown where the level allows the generic sensor block, including the project capstone allowlist.

Sample workspace XML exercised by the new tests:

```xml
<block type="battlegorithms_if_boolean_else">
  <value name="BOOL">
    <block type="battlegorithms_value_compare">
      <value name="LEFT">
        <block type="battlegorithms_value_count_within">
          <field name="OBJECT">BARRIER</field>
          <field name="DISTANCE">2</field>
        </block>
      </value>
      <field name="OPERATOR">GT</field>
      <value name="RIGHT">
        <block type="battlegorithms_value_number">
          <field name="VALUE">1</field>
        </block>
      </value>
    </block>
  </value>
</block>
```

## Validation

- `rg "battlegorithms_value_count_within|ALLY_RUNNER|countObjectsWithin" --no-heading src tests docs package.json`
  - Confirmed the new block appears in the shared toolboxes, project-capstone sensor allowlist, workspace evaluation path, tests, and docs.
- `node --test --test-isolation=none tests/unit/count-within.test.js`
  - Passed: 4/4.
- `node --test --test-isolation=none tests/unit/blockly-interpreter.test.js`
  - Passed: 10/10.
- `node --test --test-isolation=none tests/unit/blockly-trace-collection.test.js`
  - Passed: 6/6.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js`
  - Passed: 26/26.
- `node --test --test-isolation=none tests/unit/level-lint.test.js`
  - Passed: 31/31.
- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js`
  - Passed: 8/8.
- `npm run lint:levels`
  - Passed with the existing baseline warnings only.
- `npm test`
  - Passed: 308/308.
- `npm run build`
  - Passed.
- `npm run test:browser`
  - Passed: 113/113.
  - Ran in Playwright Chromium, which is the closest desktop-Chrome-class coverage available in this environment. No Chromebook hardware was available here.

## Notes

- The new count-within trace uses the existing value-step path, so it records the number result without introducing a new trace kind.
- The existing project toolbox tests continue to pass unchanged because the new block is additive and the shared toolbox lists now include it.
- No new guided lesson was authored; the deferred curriculum file captures the next likely teaching sequence when the pilot cycle is ready for it.

## Ready for integration

Yes.
