---
status: COMPLETE
tier: 1
level-id: first-two-defend
level-title: "Level 29: First Two Defend"
change-type: property addition (tips array)
target-file: src/config/levels.js
---

## Summary
Level 29 is the only level in the multi-ally phase that has no `tips` array. A barrier is present on the board that requires the Stay Still block to clear — a technique taught in an earlier level. Adding a single tip nudges students who are stuck without revealing the solution.

## What to Read
- `src/config/levels.js` — find the object with `id: "first-two-defend"`. Confirm it currently has **no** `tips` property between its `tutorialSteps` array and its `setup` object.

## What to Change
Find this exact sequence in the `first-two-defend` level object:

```
    ],
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      barriers: [
```

(The `]` closes the `tutorialSteps` array; `setup` immediately follows.)

Insert a `tips` property between `tutorialSteps` and `setup` so the result reads:

```
    ],
    tips: ["Stay Still can remove a barrier directly in front — remember that from an earlier level?"],
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      barriers: [
```

Nothing else in the level object changes.

## What NOT to Change
- The `tutorialSteps` array contents.
- The `setup` object or anything inside it.
- Any other level object.

## Verification
Re-read the `first-two-defend` object and confirm:
1. A `tips` array exists immediately before `setup`.
2. The array contains exactly the one string: `"Stay Still can remove a barrier directly in front — remember that from an earlier level?"`
3. Both `tutorialSteps` and `setup` are unchanged.

## Log Entry Template
```
## tier1/12-first-two-defend.md — [DATE]
- Level: Level 29: First Two Defend
- Action: Added tips array (was missing)
- tip[0]: "Stay Still can remove a barrier directly in front — remember that from an earlier level?"
- Status: COMPLETE
```
