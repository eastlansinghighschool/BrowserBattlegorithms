---
status: COMPLETE
tier: 1
level-id: closest-threat
level-title: "Level 21: Closest Threat"
change-type: tutorial-text (step insertion)
target-file: src/config/levels.js
---

## Summary
Level 21 opens the advanced block layer (ADVANCED_ALL_BLOCKS) with no explanation of the new paradigm. A new first tutorial step must be inserted before the existing first step to orient students.

## What to Read
- `src/config/levels.js` — find the object with `id: "closest-threat"` and its `tutorialSteps` array.

## What to Change
Insert the following new step object as the **first element** of the `tutorialSteps` array for the level with `id: "closest-threat"`. It must appear before the existing step with `id: "level-21-target"`.

New step to insert:
```javascript
{
  id: "level-21-advanced-layer",
  title: "A New Set Of Tools",
  body: "This level introduces an expanded toolbox. The new blocks let your program work with numbers, compare values, and combine conditions. You will learn each of these in the coming levels — for now, focus on the Move Toward block.",
  targetSelector: "#blockly-region"
},
```

The existing steps (`level-21-target` and `level-21-board`) must remain in the array, unchanged, after the inserted step.

## What NOT to Change
- The existing step objects (`level-21-target`, `level-21-board`) — their content is unchanged.
- Any other field in the level object.
- Any other level object.

## Verification
Re-read the `tutorialSteps` array for `closest-threat` and confirm:
1. The first step has `id: "level-21-advanced-layer"` with the body text above.
2. The second step has `id: "level-21-target"` (unchanged).
3. The third step has `id: "level-21-board"` (unchanged).

## Log Entry Template
```
## tier1/07-closest-threat.md — [DATE]
- Level: Level 21: Closest Threat
- Action: Inserted new first tutorial step
- New step id: level-21-advanced-layer
- Existing steps unchanged: level-21-target, level-21-board
- Status: COMPLETE
```
