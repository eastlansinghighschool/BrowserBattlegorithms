---
status: COMPLETE
tier: 3
level-id: jump-if-ready
level-title: "Level 15: Jump If Ready"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`JUMP_IF_READY_DEMO_XML` shows `if_can_jump_else` with jump_forward/move_forward — the exact solution to Level 15. The demo should use a condition block not in Level 15's toolbox.

Level 15 toolbox: `...JUMP_CONDITION_BLOCKS` (`IF_CAN_JUMP`, `IF_CAN_JUMP_ELSE`), `...JUMP_BLOCKS` (`JUMP_FORWARD`), `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_have_enemy_flag_else` (not in toolbox).

## What to Read
- `src/config/levels.js` — find the `const JUMP_IF_READY_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const JUMP_IF_READY_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_can_jump_else">
        <statement name="DO">
          <block type="battlegorithms_jump_forward"></block>
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
const JUMP_IF_READY_DEMO_XML = `
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
Find the step with `id: "level-15-ready"` and update its `demoCaption`:

Old:
```
        demoCaption: "When the resource is available, the DO branch runs. After it is spent, the ELSE branch takes over — the same pattern works here with a different condition."
```

New:
```
        demoCaption: "The condition and actions here are not the ones this level uses. The structure shows how an if/else block checks a resource state and runs a different branch once that resource is gone."
```

**Note:** If the step with `id: "level-15-ready"` has a different `demoCaption` text than shown above, update it to the new text regardless — the goal is that the caption no longer implies the correct condition or actions.

## What NOT to Change
- The constant name `JUMP_IF_READY_DEMO_XML`.
- The `demoBlocklyXml: JUMP_IF_READY_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const JUMP_IF_READY_DEMO_XML` and confirm it uses `battlegorithms_if_have_enemy_flag_else`.
2. Re-read step `level-15-ready` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/08-jump-if-ready-demo.md — [DATE]
- Level: Level 15: Jump If Ready
- Constant changed: JUMP_IF_READY_DEMO_XML
- Old condition: if_can_jump_else (was solution)
- New condition: if_have_enemy_flag_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
