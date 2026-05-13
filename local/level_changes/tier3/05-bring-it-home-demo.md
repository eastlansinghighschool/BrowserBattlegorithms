---
status: COMPLETE
tier: 3
level-id: bring-it-home
level-title: "Level 12: Bring It Home"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`BRING_IT_HOME_DEMO_XML` shows `if_have_enemy_flag_else` with Move Toward MY_BASE / Move Toward ENEMY_FLAG — the exact solution to Level 12. The demo should use a condition block not in Level 12's toolbox.

Level 12 toolbox: `IF_HAVE_ENEMY_FLAG`, `IF_HAVE_ENEMY_FLAG_ELSE`, `...MOVE_TOWARD_BLOCKS`, `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_can_jump_else` (not in toolbox).

## What to Read
- `src/config/levels.js` — find the `const BRING_IT_HOME_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const BRING_IT_HOME_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_have_enemy_flag_else">
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">MY_BASE</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();
```

Replace it with:

```
const BRING_IT_HOME_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_can_jump_else">
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_down_screen"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();
```

### Update the demoCaption in the tutorialSteps reference
Find the step with `id: "level-12-two-targets"` and update its `demoCaption`:

Old:
```
        demoCaption: "The same helper block can aim at the enemy flag on the way out and your base on the way back."
```

New:
```
        demoCaption: "An if/else block checks a condition each turn and runs a different branch depending on the result. The condition and actions here are different from what this level needs — use this just to see the structure."
```

## What NOT to Change
- The constant name `BRING_IT_HOME_DEMO_XML`.
- The `demoBlocklyXml: BRING_IT_HOME_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const BRING_IT_HOME_DEMO_XML` and confirm it uses `battlegorithms_if_can_jump_else`.
2. Re-read step `level-12-two-targets` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/05-bring-it-home-demo.md — [DATE]
- Level: Level 12: Bring It Home
- Constant changed: BRING_IT_HOME_DEMO_XML
- Old condition: if_have_enemy_flag_else with Move Toward (was solution)
- New condition: if_can_jump_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
