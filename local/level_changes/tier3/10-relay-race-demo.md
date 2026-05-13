---
status: COMPLETE
tier: 3
level-id: relay-race
level-title: "Level 18: Relay Race"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`RELAY_RACE_DEMO_XML` shows `if_teammate_has_flag_else` with Move Toward HUMAN_RUNNER / move_forward — the exact solution to Level 18. The demo should use a condition block not in Level 18's toolbox.

Level 18 toolbox: `...TEAMMATE_FLAG_BLOCKS` (`IF_TEAMMATE_HAS_FLAG`, `IF_TEAMMATE_HAS_FLAG_ELSE`), `...MOVE_TOWARD_BLOCKS`, `...EXTENDED_MOVEMENT_BLOCKS`.
Replacement condition: `battlegorithms_if_barrier_in_front_else` (not in toolbox).

## What to Read
- `src/config/levels.js` — find the `const RELAY_RACE_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const RELAY_RACE_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_teammate_has_flag_else">
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">HUMAN_RUNNER</field>
          </block>
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
const RELAY_RACE_DEMO_XML = `
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
Find the step with `id: "level-18-support"` and update its `demoCaption`:

Old:
```
        demoCaption: "When a teammate already has the flag, this program switches from chasing forward to supporting the human runner."
```

New:
```
        demoCaption: "This example uses a different condition than the one available in this level. The structure — check a condition, then run different actions in each branch — is the same pattern you need here."
```

## What NOT to Change
- The constant name `RELAY_RACE_DEMO_XML`.
- The `demoBlocklyXml: RELAY_RACE_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const RELAY_RACE_DEMO_XML` and confirm it uses `battlegorithms_if_barrier_in_front_else`.
2. Re-read step `level-18-support` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/10-relay-race-demo.md — [DATE]
- Level: Level 18: Relay Race
- Constant changed: RELAY_RACE_DEMO_XML
- Old condition: if_teammate_has_flag_else with Move Toward (was solution)
- New condition: if_barrier_in_front_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE
```
