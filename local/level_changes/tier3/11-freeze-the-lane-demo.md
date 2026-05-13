---
status: COMPLETE
tier: 3
level-id: freeze-the-lane
level-title: "Level 20: Freeze the Lane"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`FREEZE_THE_LANE_DEMO_XML` shows `if_area_freeze_ready_else` with freeze_opponents / Move Toward ENEMY_FLAG — the exact solution to Level 20. The demo should use a condition block not in Level 20's toolbox.

Level 20 toolbox: `...AREA_FREEZE_BLOCKS` (`FREEZE_OPPONENTS`, `IF_AREA_FREEZE_READY`, `IF_AREA_FREEZE_READY_ELSE`), `...GENERIC_SENSOR_BLOCKS`, `...MOVE_TOWARD_BLOCKS`, `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_can_jump_else` (jump condition blocks are not in Level 20's toolbox).

## What to Read
- `src/config/levels.js` — find the `const FREEZE_THE_LANE_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const FREEZE_THE_LANE_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_area_freeze_ready_else">
        <statement name="DO">
          <block type="battlegorithms_freeze_opponents"></block>
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
const FREEZE_THE_LANE_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_can_jump_else">
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
Find the step with `id: "level-20-freeze"` and update its `demoCaption`:

Old:
```
        demoCaption: "Use the freeze while it is still ready. After that one-time action is spent, the else branch keeps the ally moving toward the enemy flag."
```

New:
```
        demoCaption: "This example checks a one-time resource using a condition not available in this level. The pattern — spend the resource in the DO branch, then fall back to normal movement in the ELSE branch — is the same structure you need here."
```

## What NOT to Change
- The constant name `FREEZE_THE_LANE_DEMO_XML`.
- The `demoBlocklyXml: FREEZE_THE_LANE_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const FREEZE_THE_LANE_DEMO_XML` and confirm it uses `battlegorithms_if_can_jump_else`.
2. Re-read step `level-20-freeze` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/11-freeze-the-lane-demo.md — [DATE]
- Level: Level 20: Freeze the Lane
- Constant changed: FREEZE_THE_LANE_DEMO_XML
- Old condition: if_area_freeze_ready_else (was solution)
- New condition: if_can_jump_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
