---
status: COMPLETE
tier: 1
level-id: flip-the-answer
level-title: "Level 25: Flip The Answer"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 2 tells the student exactly which condition to use ("NOT with a side check") and what to do with it — directive phrasing that removes the reasoning from the student.

## What to Read
- `src/config/levels.js` — find the object with `id: "flip-the-answer"`, then find the tutorial step with `id: "level-25-side"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-25-side"`:

```
Use NOT with a side check so the ally behaves differently after it leaves home territory.
```

Replace it with:

```
NOT reverses whatever boolean it wraps — a true becomes false and a false becomes true. Think about which condition is easier to express, and whether flipping it gets you what you need.
```

No other field in this step changes.

## What NOT to Change
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-25-side` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/09-flip-the-answer.md — [DATE]
- Level: Level 25: Flip The Answer
- Step id: level-25-side
- Field changed: body
- Status: COMPLETE
```
