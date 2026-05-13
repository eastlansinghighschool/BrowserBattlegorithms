---
status: COMPLETE
tier: 3
level-id: stay-still-can-do-something
level-title: "Level 17: Stay Still Can Do Something"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`STAY_STILL_DEMO_XML` shows `if_sensor_matches_else` with BARRIER/DIRECTLY_IN_FRONT → stay_still/move_forward — the exact solution to Level 17. The demo should use a sensor object not available in Level 17.

Level 17 sensor options: object = `BARRIER` only; relation = `DIRECTLY_IN_FRONT` only.
Replacement: sensor with object `ENEMY_RUNNER` and relation `WITHIN_2` (ENEMY_RUNNER not available as a sensor object in Level 17).

## What to Read
- `src/config/levels.js` — find the `const STAY_STILL_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const STAY_STILL_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">BARRIER</field>
        <field name="RELATION">DIRECTLY_IN_FRONT</field>
        <statement name="DO">
          <block type="battlegorithms_stay_still"></block>
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
const STAY_STILL_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">ENEMY_RUNNER</field>
        <field name="RELATION">WITHIN_2</field>
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
Find the step with `id: "level-17-stay-still"` and update its `demoCaption`:

Old:
```
        demoCaption: "This pattern removes the barrier first, then resumes forward movement after the lane is clear."
```

New:
```
        demoCaption: "This sensor branch uses an object and relation that are not available in this level. The structure is the same one you need — fill in the correct object and relation, and choose what action makes sense in each branch."
```

## What NOT to Change
- The constant name `STAY_STILL_DEMO_XML`.
- The `demoBlocklyXml: STAY_STILL_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const STAY_STILL_DEMO_XML` and confirm it uses `ENEMY_RUNNER` and `WITHIN_2`.
2. Re-read step `level-17-stay-still` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/09-stay-still-can-do-something-demo.md — [DATE]
- Level: Level 17: Stay Still Can Do Something
- Constant changed: STAY_STILL_DEMO_XML
- Old sensor: BARRIER/DIRECTLY_IN_FRONT → stay_still (was solution)
- New sensor: ENEMY_RUNNER/WITHIN_2 (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE
```
