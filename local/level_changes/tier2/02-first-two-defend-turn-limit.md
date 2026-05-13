---
status: COMPLETE
tier: 2
level-id: first-two-defend
level-title: "Level 29: First Two Defend"
change-type: property (failureCondition.maxTurns)
target-file: src/config/levels.js
---

## Summary
Level 29 uses three allies to clear a barrier and reach a target cell. The current turn limit of 6 is too tight for a student learning index-range grouping for the first time. Raising it to 10 gives them enough room to experiment without removing all pressure.

## What to Read
- `src/config/levels.js` — find the object with `id: "first-two-defend"` and locate its `failureCondition` property.

## What to Change
Find this exact `failureCondition` line inside the `first-two-defend` level object:

```
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 6 },
```

Replace it with:

```
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 10 },
```

No other property changes.

## What NOT to Change
- `failureCondition.type` — must remain `"turn_limit_exceeded"`.
- `failureCondition` values in any other level.
- Any other property of the `first-two-defend` level object.

## Verification
Re-read the `failureCondition` line for `first-two-defend` and confirm `maxTurns` is `10`.

## Log Entry Template
```
## tier2/02-first-two-defend-turn-limit.md — [DATE]
- Level: Level 29: First Two Defend
- Field changed: failureCondition.maxTurns
- Old value: 6
- New value: 10
- Status: COMPLETE
```
