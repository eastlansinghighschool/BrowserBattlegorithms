---
status: COMPLETE
tier: 1
level-id: this-or-that
level-title: "Level 24: This Or That"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 2 describes exactly what the ally should do ("change path once it crosses over or gets too close"), which tells the student both the condition and the response.

## What to Read
- `src/config/levels.js` — find the object with `id: "this-or-that"`, then find the tutorial step with `id: "level-24-path"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-24-path"`:

```
The ally should change path once it crosses over or gets too close to the enemy.
```

Replace it with:

```
Look at where the ally needs to go and what stands in the way. Think about when OR might let a single branch handle more than one kind of situation at the same time.
```

No other field in this step changes.

## What NOT to Change
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-24-path` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/08-this-or-that.md — [DATE]
- Level: Level 24: This Or That
- Step id: level-24-path
- Field changed: body
- Status: COMPLETE
```
