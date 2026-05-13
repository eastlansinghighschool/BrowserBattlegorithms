---
status: COMPLETE
tier: 1
level-id: jump-if-ready
level-title: "Level 15: Jump If Ready"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 1 tells students this is "the right place for a jump first, then walking later" — describing the solution sequence rather than the concept.

## What to Read
- `src/config/levels.js` — find the object with `id: "jump-if-ready"`, then find the tutorial step with `id: "level-15-ready"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-15-ready"`:

```
The If I Can Jump condition lets the ally behave one way before the jump is used and another way after it is gone. This is the right place for a jump first, then walking later.
```

Replace it with:

```
The If I Can Jump condition changes based on whether the ally has already spent the jump resource this round. Think about how the ally should behave before the jump is gone, and how that should change after it has been used.
```

No other field in this step changes.

## What NOT to Change
- The `demoBlocklyXml`, `demoTitle`, or `demoCaption` properties of this step (those are changed in Tier 3).
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-15-ready` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/04-jump-if-ready.md — [DATE]
- Level: Level 15: Jump If Ready
- Step id: level-15-ready
- Field changed: body
- Status: COMPLETE
```
