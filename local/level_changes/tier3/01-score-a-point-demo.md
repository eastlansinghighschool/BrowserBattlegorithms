---
status: COMPLETE
tier: 3
level-id: score-a-point
level-title: "Level 3: Score a Point"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`SCORE_SWITCH_DEMO_XML` shows `if_have_enemy_flag_else` with backward/forward movement — the exact solution to Level 3. The demo should illustrate the branching structure using a condition block that is not in Level 3's toolbox, so students see the pattern without seeing the answer.

Level 3 toolbox: `IF_HAVE_ENEMY_FLAG`, `IF_HAVE_ENEMY_FLAG_ELSE`, `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_barrier_in_front_else` (not in toolbox).

## What to Read
- `src/config/levels.js` — find the `const SCORE_SWITCH_DEMO_XML` declaration near the top of the file (before the `LEVEL_DEFINITIONS` array).

## What to Change

### Replace the constant content
Find this exact template literal content inside `const SCORE_SWITCH_DEMO_XML`:

```
const SCORE_SWITCH_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_have_enemy_flag_else">
        <statement name="DO">
          <block type="battlegorithms_move_backward"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();
```

Replace it with:

```
const SCORE_SWITCH_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_barrier_in_front_else">
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();
```

### Update the demoCaption in the tutorialSteps reference
Find the step with `id: "level-3-condition"` and update its `demoCaption`:

Old:
```
        demoCaption: "One branch handles the trip out, and another handles the trip home."
```

New:
```
        demoCaption: "An if/else block runs one branch when a condition is true and the other branch when it is false — the same structure you will use with a different condition here."
```

## What NOT to Change
- The constant name `SCORE_SWITCH_DEMO_XML` — do not rename it.
- The `demoBlocklyXml: SCORE_SWITCH_DEMO_XML` reference in the tutorialSteps — leave it pointing to the same constant.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const SCORE_SWITCH_DEMO_XML` and confirm it uses `battlegorithms_if_barrier_in_front_else`.
2. Re-read step `level-3-condition` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/01-score-a-point-demo.md — [DATE]
- Level: Level 3: Score a Point
- Constant changed: SCORE_SWITCH_DEMO_XML
- Old condition: if_have_enemy_flag_else (was solution)
- New condition: if_barrier_in_front_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
