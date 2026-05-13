---
status: COMPLETE
tier: 3
level-id: sensor-barrier-branch
level-title: "Level 6: Barrier Sensor Branch"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`SENSOR_BARRIER_DEMO_XML` shows `if_sensor_matches_else` with BARRIER/DIRECTLY_IN_FRONT — the exact sensor object and relation used in the Level 6 solution. The demo should use a sensor object that is not available in Level 6, so students see the sensor block structure without getting the answer.

Level 6 sensor options: object = `BARRIER` only; relation = `DIRECTLY_IN_FRONT` only.
Replacement: sensor with object `ENEMY_RUNNER` and relation `WITHIN_2` (not available in Level 6).

## What to Read
- `src/config/levels.js` — find the `const SENSOR_BARRIER_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const SENSOR_BARRIER_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">BARRIER</field>
        <field name="RELATION">DIRECTLY_IN_FRONT</field>
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
const SENSOR_BARRIER_DEMO_XML = `
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
Find the step with `id: "level-6-generic-sensor"` and update its `demoCaption`:

Old:
```
        demoCaption: "This version uses the new generic sensor block to detect a barrier directly in front, then detours only when needed."
```

New:
```
        demoCaption: "The sensor block has two dropdowns: what to look for and how to describe its position. This example uses a different object and relation than the ones available here — your task is to pick the right values for this level."
```

## What NOT to Change
- The constant name `SENSOR_BARRIER_DEMO_XML`.
- The `demoBlocklyXml: SENSOR_BARRIER_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const SENSOR_BARRIER_DEMO_XML` and confirm it uses `ENEMY_RUNNER` and `WITHIN_2`.
2. Re-read step `level-6-generic-sensor` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/03-sensor-barrier-branch-demo.md — [DATE]
- Level: Level 6: Barrier Sensor Branch
- Constant changed: SENSOR_BARRIER_DEMO_XML
- Old sensor: BARRIER/DIRECTLY_IN_FRONT (was solution)
- New sensor: ENEMY_RUNNER/WITHIN_2 (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE
```
