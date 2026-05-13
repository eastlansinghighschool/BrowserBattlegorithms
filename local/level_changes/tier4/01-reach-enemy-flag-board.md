---
status: COMPLETE
tier: 4
level-id: reach-enemy-flag
level-title: "Level 2: Reach Enemy Flag"
change-type: board redesign (setupOverrides)
target-file: src/config/levels.js
---

## Summary
Level 2 introduces `move_backward` but the current board places the ally to the LEFT of the enemy flag (ally at x=1, flag far right). For Team 1 with playDirection=1, "forward" is rightward — so `move_forward` reaches the flag and `move_backward` is never needed. The redesign places the ally to the RIGHT of the enemy flag, making `move_backward` immediately necessary.

After this change, apply `tier1/13-reach-enemy-flag.md` to update the tutorial text.

## Map reference (12×8 grid, zero-indexed: x ∈ 0–11, y ∈ 0–7)
- Team 1 (player) plays left-to-right: `move_forward` = +x.
- Team 2 (opponent) plays right-to-left.
- Home base for Team 1 is the left side; enemy flag (Team 2's flag) defaults to the right side unless overridden.

## What to Read
- `src/config/levels.js` — find the object with `id: "reach-enemy-flag"` and its `setupOverrides` property.

## What to Change

### Replace the entire `setupOverrides` object
Find this exact `setupOverrides` block inside the `reach-enemy-flag` level object:

```
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
```

Replace it with:

```
    setupOverrides: {
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      pointsToWin: 1,
      runnerOverrides: {
        runner_1_HumanP1: { gridX: 1, gridY: 1 },
        runner_1_AI_AllyP1: { gridX: 9, gridY: 4 },
        runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 },
        runner_2_Npc2: { gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }
      },
      flagOverrides: {
        2: { gridX: 7, gridY: 4 }
      }
    }
```

Key changes:
- Ally `gridX` moves from `1` to `9` (ally now starts to the right of the flag).
- `flagOverrides` added: Team 2's flag repositioned to `gridX: 7, gridY: 4` (to the left of the ally).
- Ally must use `move_backward` (leftward for Team 1) to reach the flag at x=7 from starting position x=9.

## What NOT to Change
- `winCondition` — stays as `runner_reaches_enemy_flag`.
- `failureCondition.maxTurns` — stays at 14.
- `toolboxBlockTypes` — unchanged.
- `tutorialSteps` — tutorial text is updated separately in `tier1/13-reach-enemy-flag.md`.
- Any other level object.

## Verification
Re-read the `reach-enemy-flag` `setupOverrides` and confirm:
1. Ally (`runner_1_AI_AllyP1`) starts at `gridX: 9, gridY: 4`.
2. `flagOverrides` sets Team 2 flag to `gridX: 7, gridY: 4`.
3. All other runner positions are unchanged.

## Log Entry Template
```
## tier4/01-reach-enemy-flag-board.md — [DATE]
- Level: Level 2: Reach Enemy Flag
- Field changed: setupOverrides
- Ally position: (1,4) → (9,4)
- Flag override added: Team 2 flag at (7,4)
- Status: COMPLETE
```
