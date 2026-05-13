---
status: COMPLETE
tier: 3
level-id: barrier-detour
level-title: "Level 4: Barrier Detour"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`BARRIER_DETOUR_DEMO_XML` shows `if_barrier_in_front_else` with down/forward movement — the exact solution to Level 4. The demo should illustrate the branching structure using a condition block that is not in Level 4's toolbox.

Level 4 toolbox: `IF_BARRIER_IN_FRONT`, `IF_BARRIER_IN_FRONT_ELSE`, `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_have_enemy_flag_else` (not in toolbox).

## What to Read
- `src/config/levels.js` — find the `const BARRIER_DETOUR_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const BARRIER_DETOUR_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_barrier_in_front_else">
        <statement name="DO">
          <block type="battlegorithms_move_down_screen"></block>
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
const BARRIER_DETOUR_DEMO_XML = `
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

### Update the demoCaption in the tutorialSteps reference
Find the step with `id: "level-4-condition"` and update its `demoCaption`:

Old:
```
        demoCaption: "This pattern separates the blocked case from the clear case without spelling out the whole puzzle solution."
```

New:
```
        demoCaption: "An if/else block runs the DO branch when its condition is true and the ELSE branch when it is false — the same two-path structure you will use here."
```

## What NOT to Change
- The constant name `BARRIER_DETOUR_DEMO_XML`.
- The `demoBlocklyXml: BARRIER_DETOUR_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const BARRIER_DETOUR_DEMO_XML` and confirm it uses `battlegorithms_if_have_enemy_flag_else`.
2. Re-read step `level-4-condition` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/02-barrier-detour-demo.md — [DATE]
- Level: Level 4: Barrier Detour
- Constant changed: BARRIER_DETOUR_DEMO_XML
- Old condition: if_barrier_in_front_else (was solution)
- New condition: if_have_enemy_flag_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
