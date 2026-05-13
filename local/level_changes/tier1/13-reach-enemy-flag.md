---
status: COMPLETE
tier: 1
level-id: reach-enemy-flag
level-title: "Level 2: Reach Enemy Flag"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
After the Tier 4 board redesign of this level, the ally starts to the RIGHT of the enemy flag, making `move_backward` the required action rather than an optional fallback. The tutorial step 2 text must be updated to reflect that `move_backward` is the key concept for this level. Apply this change AFTER the Tier 4 board redesign is complete.

## Dependency
This change must be applied AFTER `tier4/01-reach-enemy-flag-board.md` is marked COMPLETE.

## What to Read
- `src/config/levels.js` — find the object with `id: "reach-enemy-flag"`, then find the tutorial step with `id: "level-2-new-block"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-2-new-block"`:

```
Move Backward is now in the toolbox. You may not need it here, but it is ready if your ally needs to step back into position.
```

Replace it with:

```
Move Backward moves the ally in the opposite direction of forward. Look at where your ally starts and where the flag is — sometimes the goal is behind you.
```

No other field in this step changes.

## What NOT to Change
- The `title` of step `level-2-new-block`.
- Step `level-2-goal` — unchanged.
- Any other level object.

## Verification
Re-read the `level-2-new-block` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/13-reach-enemy-flag.md — [DATE]
- Level: Level 2: Reach Enemy Flag
- Step id: level-2-new-block
- Field changed: body
- Status: COMPLETE
```
