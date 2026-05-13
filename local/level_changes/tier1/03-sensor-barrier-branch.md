---
status: COMPLETE
tier: 1
level-id: sensor-barrier-branch
level-title: "Level 6: Barrier Sensor Branch"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Level 6 introduces the generic sensor block without acknowledging that students already used a specific barrier-check block in Level 4. Adding a bridging sentence removes the apparent contradiction.

## What to Read
- `src/config/levels.js` — find the object with `id: "sensor-barrier-branch"`, then find the tutorial step with `id: "level-6-generic-sensor"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-6-generic-sensor"`:

```
The new sensor block lets you pick what to look for and how to describe its position. Here it is focused on a barrier directly in front.
```

Replace it with:

```
In an earlier level you used a block that checked for a barrier specifically. This new sensor block works the same way — but the dropdowns let you describe other objects and positions too, not just barriers. Here it is focused on a barrier directly in front.
```

No other field in this step changes.

## What NOT to Change
- The `demoBlocklyXml`, `demoTitle`, or `demoCaption` properties of this step (those are changed in Tier 3).
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-6-generic-sensor` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/03-sensor-barrier-branch.md — [DATE]
- Level: Level 6: Barrier Sensor Branch
- Step id: level-6-generic-sensor
- Field changed: body
- Status: COMPLETE
```
