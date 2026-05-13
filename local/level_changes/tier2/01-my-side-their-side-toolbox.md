---
status: COMPLETE
tier: 2
level-id: my-side-their-side
level-title: "Level 19: My Side, Their Side"
change-type: property (toolboxBlockTypes)
target-file: src/config/levels.js
---

## Summary
Level 19 exposes all four territory blocks (`TERRITORY_BLOCKS`), including the enemy-side variants. However, Level 25 later teaches the "enemy side" concept as if it is new. Scoping L19 to the my-side variants only preserves that payoff and avoids giving students a block they won't need until six levels later.

## What to Read
- `src/config/levels.js` — find the object with `id: "my-side-their-side"` and locate its `toolboxBlockTypes` property.
- `src/config/levels.js` lines ~264–269 — the `TERRITORY_BLOCKS` constant, to understand what is currently included.

## What to Change
Find this exact `toolboxBlockTypes` line inside the `my-side-their-side` level object:

```
    toolboxBlockTypes: [...TERRITORY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS],
```

Replace it with:

```
    toolboxBlockTypes: [BLOCK_TYPES.IF_ON_MY_SIDE, BLOCK_TYPES.IF_ON_MY_SIDE_ELSE, ...EXTENDED_MOVEMENT_BLOCKS],
```

No other property in the level object changes.

## What NOT to Change
- The `TERRITORY_BLOCKS` constant definition (do not modify it).
- `toolboxBlockTypes` values in any other level.
- Any other property of the `my-side-their-side` level object.

## Verification
Re-read the `toolboxBlockTypes` line for `my-side-their-side` and confirm it references only `BLOCK_TYPES.IF_ON_MY_SIDE`, `BLOCK_TYPES.IF_ON_MY_SIDE_ELSE`, and `...EXTENDED_MOVEMENT_BLOCKS`.

## Log Entry Template
```
## tier2/01-my-side-their-side-toolbox.md — [DATE]
- Level: Level 19: My Side, Their Side
- Field changed: toolboxBlockTypes
- Old value: [...TERRITORY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS]
- New value: [BLOCK_TYPES.IF_ON_MY_SIDE, BLOCK_TYPES.IF_ON_MY_SIDE_ELSE, ...EXTENDED_MOVEMENT_BLOCKS]
- Status: COMPLETE
```
