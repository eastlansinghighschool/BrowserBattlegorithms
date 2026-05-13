---
status: COMPLETE
tier: 2
level-id: jump-team
level-title: "Level 34: Jump Team"
change-type: property (failureCondition.maxTurns)
target-file: src/config/levels.js
---

## Summary
Level 34 requires one ally to jump over an obstacle while the other takes a support path, with the jumper needing to continue moving after landing. The current turn limit of 3 is insufficient for a student coordinating two allies with distinct roles for the first time. Raising it to 8 aligns it with other multi-mechanic levels.

## What to Read
- `src/config/levels.js` — find the object with `id: "jump-team"` and locate its `failureCondition` property.

## What to Change
Find this exact `failureCondition` line inside the `jump-team` level object:

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
- Any other property of the `jump-team` level object.

## Verification
Re-read the `failureCondition` line for `jump-team` and confirm `maxTurns` is `8`.

## Log Entry Template
```
## tier2/04-jump-team-turn-limit.md — [DATE]
- Level: Level 34: Jump Team
- Field changed: failureCondition.maxTurns
- Old value: 3
- New value: 8
- Status: COMPLETE
```
