---
status: COMPLETE
tier: 2
level-id: barrier-specialist
level-title: "Level 33: Barrier Specialist"
change-type: property (failureCondition.maxTurns)
target-file: src/config/levels.js
---

## Summary
Level 33 requires one ally to place a barrier while the other advances to a target cell. The current turn limit of 3 is critically low for a puzzle combining index, barrier readiness, and movement — a student learning this combination for the first time cannot reasonably succeed. Raising it to 8 makes the level challenging without being unfair.

## What to Read
- `src/config/levels.js` — find the object with `id: "barrier-specialist"` and locate its `failureCondition` property.

## What to Change
Find this exact `failureCondition` line inside the `barrier-specialist` level object:

```
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 3 },
```

Replace it with:

```
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
```

No other property changes.

## What NOT to Change
- `failureCondition.type` — must remain `"turn_limit_exceeded"`.
- `failureCondition` values in any other level.
- Any other property of the `barrier-specialist` level object.

## Verification
Re-read the `failureCondition` line for `barrier-specialist` and confirm `maxTurns` is `8`.

## Log Entry Template
```
## tier2/03-barrier-specialist-turn-limit.md — [DATE]
- Level: Level 33: Barrier Specialist
- Field changed: failureCondition.maxTurns
- Old value: 3
- New value: 8
- Status: COMPLETE
```
