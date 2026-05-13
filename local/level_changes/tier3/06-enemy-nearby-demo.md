---
status: COMPLETE
tier: 3
level-id: enemy-nearby
level-title: "Level 13: Enemy Nearby"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`ENEMY_NEARBY_DEMO_XML` shows `if_sensor_matches_else` with ENEMY_RUNNER/WITHIN_2 and move_up_screen/move_forward — essentially the solution to Level 13. The demo should use a sensor object not available in Level 13.

Level 13 sensor options: object = `ENEMY_RUNNER` only; relations = `WITHIN_2`, `WITHIN_3`.
Replacement: sensor with object `BARRIER` and relation `DIRECTLY_IN_FRONT` (BARRIER not available as a sensor object in Level 13).

## What to Read
- `src/config/levels.js` — find the `const ENEMY_NEARBY_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const ENEMY_NEARBY_DEMO_XML = `
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

Replace it with:

```
const ENEMY_NEARBY_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">BARRIER</field>
        <field name="RELATION">DIRECTLY_IN_FRONT</field>
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
Find the step with `id: "level-13-distance"` and update its `demoCaption`:

Old:
```
        demoCaption: "When the enemy gets within 2 spaces, this program reacts by stepping up. Otherwise it keeps moving forward toward the target."
```

New:
```
        demoCaption: "This sensor branch uses an object and relation that are not available in this level. The structure is the same one you will use — pick the right object and relation from the dropdowns for this puzzle."
```

## What NOT to Change
- The constant name `ENEMY_NEARBY_DEMO_XML`.
- The `demoBlocklyXml: ENEMY_NEARBY_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const ENEMY_NEARBY_DEMO_XML` and confirm it uses `BARRIER` and `DIRECTLY_IN_FRONT`.
2. Re-read step `level-13-distance` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/06-enemy-nearby-demo.md — [DATE]
- Level: Level 13: Enemy Nearby
- Constant changed: ENEMY_NEARBY_DEMO_XML
- Old sensor: ENEMY_RUNNER/WITHIN_2 (was solution)
- New sensor: BARRIER/DIRECTLY_IN_FRONT (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE
```
