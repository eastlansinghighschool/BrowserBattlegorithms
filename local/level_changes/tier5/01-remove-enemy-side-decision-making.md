---
status: COMPLETE
tier: 5
level-id: enemy-side-decision-making
level-title: "Level 26: Enemy-Side Decision Making"
change-type: level removal
target-file: src/config/levels.js
---

## Summary
Level 26 is functionally redundant with Level 19 (`my-side-their-side`). Both levels use territory conditions to change behavior after crossing midfield. Level 26's "new" concept — a named block for one specific territory state — was already available to students in Level 19's toolbox (`TERRITORY_BLOCKS` includes both `IF_ON_ENEMY_SIDE` variants), and Level 25 taught NOT as a way to invert territory conditions. The level should be removed.

The Tier 2 change (`tier2/01-my-side-their-side-toolbox.md`) now restricts L19 to the my-side variants only, which partially restores the conceptual distinction — but L26 still teaches a concept students can derive from L25. Removal is the recommendation.

After removal, Tier 7 renumbering will update all level titles. Do not manually update any title strings in this step.

## Dependency
This change may be applied independently of other tiers.

## What to Read
- `src/config/levels.js` — find the object with `id: "enemy-side-decision-making"` and verify it matches the content below before removing it.

## What to Change

### Remove the Level 26 object from LEVEL_DEFINITIONS
Find this exact sequence in the file (last line of Level 25 closing + entire Level 26 + first line of Level 27 opening):

```
    }
  },
  {
    id: "enemy-side-decision-making",
    title: "Level 26: Enemy-Side Decision Making",
    description: "Use If On Enemy Side as an explicit advanced territory check.",
    introText: "Sometimes a named condition is still clearer than a value block. This level uses the existing enemy-side condition directly.",
    mode: GAME_MODES.PLAYER_VS_NPC,
    mapKey: "simpleAisle",
    humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
    toolboxBlockTypes: [BLOCK_TYPES.IF_ON_ENEMY_SIDE, BLOCK_TYPES.IF_ON_ENEMY_SIDE_ELSE, ...EXTENDED_MOVEMENT_BLOCKS],
    initialBlocklyXml: STARTER_EVENT_XML,
    winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 6, y: 2 } },
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 12 },
    tutorialSteps: [
      { id: "level-26-enemy-side", title: "A Named Territory Check", body: "This block asks directly whether the runner is on the enemy side of the field.", targetSelector: "#blockly-region" },
      { id: "level-26-shift", title: "Cross Then Change", body: "Move one way on your side, then switch behavior once you cross midfield.", targetSelector: "#canvas-container" }
    ],
    setupOverrides: {
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      pointsToWin: 1,
      runnerOverrides: {
        runner_1_HumanP1: { gridX: 1, gridY: 1 },
        runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
        runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
        runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
      }
    }
  },
  {
    id: "one-program-two-allies",
```

Replace it with (Level 26 removed, Level 25 closing connected directly to Level 27 opening):

```
    }
  },
  {
    id: "one-program-two-allies",
```

## What NOT to Change
- Any other level object.
- The `TERRITORY_BLOCKS` constant.
- Any other property of any adjacent level.

## Verification
After removal:
1. Search the file for `id: "enemy-side-decision-making"` — it must not appear.
2. Confirm the level with `id: "flip-the-answer"` (formerly L25) is immediately followed by the level with `id: "one-program-two-allies"` (formerly L27) with no object between them.
3. Confirm the JavaScript array syntax is valid (no missing or extra commas).

## Log Entry Template
```
## tier5/01-remove-enemy-side-decision-making.md — [DATE]
- Level removed: Level 26: Enemy-Side Decision Making (id: enemy-side-decision-making)
- Verified: id not found in file after removal
- Verified: flip-the-answer now adjacent to one-program-two-allies
- Status: COMPLETE
```
