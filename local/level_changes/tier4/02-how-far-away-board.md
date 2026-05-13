---
status: COMPLETE
tier: 4
level-id: how-far-away
level-title: "Level 22: How Far Away?"
change-type: board redesign (setup)
target-file: src/config/levels.js
---

## Summary
Level 22 introduces distance-to-enemy as a numeric value with comparison operators. The current board has ally at (1,4), target at (2,3), and the frozen enemy at (4,4). This is trivially solvable with `move_forward` then `move_up_screen` — the distance comparison concept is never required to win. The redesign places the target at (5,2) and moves the frozen enemy to (5,4), directly blocking the straight forward path. The ally can only reach the target by using a distance check to break off and go upward at the right moment.

## Map reference (12×8 grid, zero-indexed)
- Ally at (1,4), playing forward (+x direction).
- Enemy NPC at (5,4) frozen — blocks the forward lane at x=5.
- Target at (5,2) — requires navigating around the blocked cell.
- A pure forward-only approach fails: ally cannot enter (5,4) while enemy occupies it.
- With `if distance_to_closest_enemy <= 2 → move_up_screen, else → move_forward`: ally moves right to (3,4), (4,4). At (4,4), distance to enemy at (5,4) = 1 ≤ 2, so ally moves up to (4,3), then (4,2). Then forward to (5,2). Win.

## What to Read
- `src/config/levels.js` — find the object with `id: "how-far-away"` and its `setup` property.

## What to Change

### Replace the entire `setup` object
Find this exact `setup` block inside the `how-far-away` level object:

```
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      teams: {
        player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 4, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
      }
    }
```

Replace it with:

```
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      teams: {
        player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 5, gridY: 4, isFrozen: true, frozenTurnsRemaining: 999 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
      }
    }
```

### Also update the `winCondition` target cell
Find this `winCondition` line inside the `how-far-away` level object:

```
    winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 2, y: 3 } },
```

Replace it with:

```
    winCondition: { type: "runner_reaches_cell", runnerId: "runner_1_AI_AllyP1", targetCell: { x: 5, y: 2 } },
```

Key changes:
- NPC1 moved from `gridX: 4, gridY: 4` to `gridX: 5, gridY: 4` (blocks forward path to target).
- Target cell changed from `{ x: 2, y: 3 }` to `{ x: 5, y: 2 }` (requires navigating past the enemy blockade).

## What NOT to Change
- `failureCondition.maxTurns` — stays at 6. The new path requires approximately 5-6 moves, so 6 is tight but achievable.
- `toolboxBlockTypes` — unchanged.
- `tutorialSteps` — step 2 body already says "Try using the distance value to decide when the ally should break off and turn upward," which matches this redesign.
- Any other level object.

## Verification
Re-read the `how-far-away` level object and confirm:
1. NPC1 is at `gridX: 5, gridY: 4` (frozen).
2. `winCondition.targetCell` is `{ x: 5, y: 2 }`.
3. All other properties are unchanged.

## Log Entry Template
```
## tier4/02-how-far-away-board.md — [DATE]
- Level: Level 22: How Far Away?
- NPC1 position: (4,4) → (5,4)
- winCondition.targetCell: (2,3) → (5,2)
- Status: COMPLETE
```
