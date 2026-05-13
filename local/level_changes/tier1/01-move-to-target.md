---
status: COMPLETE
tier: 1
level-id: move-to-target
level-title: "Level 1: Move to Target"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 3 tells students to "add a move" — directive phrasing that describes the action rather than the concept.

## What to Read
- `src/config/levels.js` — find the object with `id: "move-to-target"`, then find the tutorial step with `id: "level-1-event"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-1-event"`:

```
Every ally program begins with the On Each Turn block. Add one move underneath it so the ally knows what to do every turn.
```

Replace it with:

```
Every ally program begins with the On Each Turn block. Any blocks connected below it will run each time your ally takes a turn. The goal square is waiting — what would you tell the ally to do?
```

No other field in this step changes. The `id`, `title`, and `targetSelector` stay as-is.

## What NOT to Change
- Any other tutorial step in this level.
- Any other level object.
- Any field other than `body` in the `level-1-event` step.

## Verification
After editing, re-read the `level-1-event` step object and confirm the `body` field contains the new text and nothing else has changed.

## Log Entry Template
```
## tier1/01-move-to-target.md — [DATE]
- Level: Level 1: Move to Target
- Step id: level-1-event
- Field changed: body
- Old value (first 60 chars): "Every ally program begins with the On Each Turn block. Add…"
- New value (first 60 chars): "Every ally program begins with the On Each Turn block. Any…"
- Status: COMPLETE
```
