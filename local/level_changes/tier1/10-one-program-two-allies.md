---
status: COMPLETE
tier: 1
level-id: one-program-two-allies
level-title: "Level 27: One Program, Two Allies"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 1 correctly states the shared-program model but is too brief. Expanding it to name the index numbers (0 and 1) and give a concrete example helps students form a usable mental model before the puzzle begins.

## What to Read
- `src/config/levels.js` — find the object with `id: "one-program-two-allies"`, then find the tutorial step with `id: "level-27-shared-program"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-27-shared-program"`:

```
Both allies run the same blocks. Runner index is how the program can tell them apart.
```

Replace it with:

```
Both allies run the same blocks every turn. The first ally has index 0 and the second has index 1. A check like "if runner index equals 0" means only the first ally follows that branch — the second skips it and does something else instead.
```

No other field in this step changes.

## What NOT to Change
- The `title` of step `level-27-shared-program`.
- Step `level-27-index` — unchanged.
- Any other level object.

## Verification
Re-read the `level-27-shared-program` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/10-one-program-two-allies.md — [DATE]
- Level: Level 27: One Program, Two Allies
- Step id: level-27-shared-program
- Field changed: body
- Status: COMPLETE
```
