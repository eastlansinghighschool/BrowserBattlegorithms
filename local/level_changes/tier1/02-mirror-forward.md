---
status: COMPLETE
tier: 1
level-id: mirror-forward
level-title: "Level 5: Forward Works Both Ways"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 2 names the block ("Try using Move Forward again") instead of letting the student infer the right block from the concept.

## What to Read
- `src/config/levels.js` — find the object with `id: "mirror-forward"`, then find the tutorial step with `id: "level-5-forward"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-5-forward"`:

```
Try using Move Forward again. This is the same idea as before, even though the ally is starting from the right side.
```

Replace it with:

```
The same block that worked on the left side of the board applies here too. Think about what forward means for a runner facing the other direction — the board orientation has changed but the concept has not.
```

No other field in this step changes.

## What NOT to Change
- The `title` of step `level-5-forward`.
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-5-forward` step and confirm the `body` matches exactly.

## Log Entry Template
```
## tier1/02-mirror-forward.md — [DATE]
- Level: Level 5: Forward Works Both Ways
- Step id: level-5-forward
- Field changed: body
- Status: COMPLETE
```
