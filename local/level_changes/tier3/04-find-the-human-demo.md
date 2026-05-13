---
status: COMPLETE
tier: 3
level-id: find-the-human
level-title: "Level 8: Find the Human"
change-type: demo XML replacement
target-file: src/config/levels.js
---

## Summary
`FIND_HUMAN_DEMO_XML` shows a nested sensor program that checks HUMAN_RUNNER/ANYWHERE_ABOVE then HUMAN_RUNNER/ANYWHERE_FORWARD — the exact sensor logic for navigating to the support square in Level 8. The demo should use a sensor object not available in Level 8.

Level 8 sensor options: object = `HUMAN_RUNNER` only; relations = `ANYWHERE_FORWARD`, `ANYWHERE_BEHIND`, `ANYWHERE_ABOVE`, `ANYWHERE_BELOW`.
Replacement: sensor with object `BARRIER` and relation `DIRECTLY_IN_FRONT` (BARRIER not available as a sensor object in Level 8).

## What to Read
- `src/config/levels.js` — find the `const FIND_HUMAN_DEMO_XML` declaration near the top of the file.

## What to Change

### Replace the constant content
Find this exact template literal content:

```
const FIND_HUMAN_DEMO_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">HUMAN_RUNNER</field>
        <field name="RELATION">ANYWHERE_ABOVE</field>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_if_sensor_matches_else">
            <field name="OBJECT">HUMAN_RUNNER</field>
            <field name="RELATION">ANYWHERE_FORWARD</field>
            <statement name="DO">
              <block type="battlegorithms_move_forward"></block>
            </statement>
            <statement name="ELSE">
              <block type="battlegorithms_move_down_screen"></block>
            </statement>
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
const FIND_HUMAN_DEMO_XML = `
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

### Update the demoCaption in the tutorialSteps reference
Find the step with `id: "level-8-human"` and update its `demoCaption`:

Old:
```
        demoCaption: "This pattern lines up with the human first, then moves forward into the marked support square beside them."
```

New:
```
        demoCaption: "This example sensor branch uses a different object than the one available here. Notice how the block has two dropdowns — one for what to sense and one for where to look."
```

## What NOT to Change
- The constant name `FIND_HUMAN_DEMO_XML`.
- The `demoBlocklyXml: FIND_HUMAN_DEMO_XML` reference in the tutorialSteps.
- The `demoTitle` field.
- Any other level object.

## Verification
1. Re-read `const FIND_HUMAN_DEMO_XML` and confirm it uses `BARRIER` and `DIRECTLY_IN_FRONT`.
2. Re-read step `level-8-human` and confirm the `demoCaption` matches the new text exactly.

## Log Entry Template
```
## tier3/04-find-the-human-demo.md — [DATE]
- Level: Level 8: Find the Human
- Constant changed: FIND_HUMAN_DEMO_XML
- Old sensor: HUMAN_RUNNER/ANYWHERE_ABOVE (nested, was solution)
- New sensor: BARRIER/DIRECTLY_IN_FRONT (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE
```
