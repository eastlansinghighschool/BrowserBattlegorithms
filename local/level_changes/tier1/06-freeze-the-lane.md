---
status: COMPLETE
tier: 1
level-id: freeze-the-lane
level-title: "Level 20: Freeze the Lane"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 3 tells students the guided experience is over ("You Are Ready For Free Play") immediately before five more concept levels begin. The title and body must be rewritten to a forward-reference instead.

## What to Read
- `src/config/levels.js` — find the object with `id: "freeze-the-lane"`, then find the tutorial step with `id: "level-20-free-play"`.

## What to Change

### Field 1 — `title`
Find this exact `title` string inside the step with `id: "level-20-free-play"`:

```
You Are Ready For Free Play
```

Replace it with:

```
The Single-Runner Toolkit Is Complete
```

### Field 2 — `body`
Find this exact `body` string inside the same step:

```
After this challenge, free play is where you can mix movement, sensing, helper blocks, barriers, jumping, and freeze powers however you want.
```

Replace it with:

```
You now have the full set of single-runner tools — movement, sensing, helper blocks, barriers, jumping, and freeze. These will also serve you in free play. The next levels go further, adding new ways to combine and express conditions.
```

Both changes are in the same step object. No other field in the step changes.

## What NOT to Change
- The `id: "level-20-free-play"` field.
- The `targetSelector` field.
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-20-free-play` step and confirm both `title` and `body` match the new values exactly.

## Log Entry Template
```
## tier1/06-freeze-the-lane.md — [DATE]
- Level: Level 20: Freeze the Lane
- Step id: level-20-free-play
- Fields changed: title, body
- Status: COMPLETE
```
