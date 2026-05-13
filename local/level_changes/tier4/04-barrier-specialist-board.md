---
status: COMPLETE
tier: 4
level-id: barrier-specialist
level-title: "Level 33: Barrier Specialist"
change-type: board redesign (setup — NPC repositioning)
target-file: src/config/levels.js
---

## Summary
Level 33's turn limit fix (Tier 2, `tier2/03-barrier-specialist-turn-limit.md`) raises `maxTurns` from 3 to 8. With the extended limit, NPC1 has time to threaten the ally's path — but NPC1 currently starts at (8,5), far enough away that the threat is not immediate. Moving NPC1 to (6,5) makes the barrier specialist's job genuinely necessary earlier in the run.

Apply this change AFTER `tier2/03-barrier-specialist-turn-limit.md` is marked COMPLETE.

## Map reference (12×8 grid, zero-indexed)
- ally (attacker) at (3,4), moving toward target at (5,4)
- ally2 (specialist) at (3,5)
- NPC1 moves leftward (-x) each turn toward the player side
- NPC1 at (8,5) → needs 5 turns to reach (3,5) (ally2's lane) — barrier specialist can wait
- NPC1 at (6,5) → needs 3 turns to reach (3,5) — specialist must act during turns 1-3

The barrier specialist's role: place a barrier at (4,5) or (5,5) to block NPC1's advance while the attacker (ally) reaches (5,4).

## What to Read
- `src/config/levels.js` — find the object with `id: "barrier-specialist"` and its `setup` property, specifically the opponent runners.

## What to Change

### Update NPC1's starting position
Find this exact opponent runners block inside the `barrier-specialist` level's `setup`:

```
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 8, gridY: 5 }, { slot: "npc2", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }] }
```

Replace it with:

```
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 6, gridY: 5 }, { slot: "npc2", gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }] }
```

Key change: NPC1 `gridX` moves from `8` to `6` (2 squares closer to the player side).

## What NOT to Change
- NPC1's `gridY` — stays at 5.
- NPC2's position or frozen state.
- `failureCondition.maxTurns` — this was changed by Tier 2 (`tier2/03-barrier-specialist-turn-limit.md`); do not revert it.
- Any other property of the `barrier-specialist` level object.
- Any other level object.

## Verification
Re-read the `barrier-specialist` `setup.teams.opponent.runners` and confirm NPC1 is at `gridX: 6, gridY: 5` without `isFrozen`.

## Log Entry Template
```
## tier4/04-barrier-specialist-board.md — [DATE]
- Level: Level 33: Barrier Specialist
- Change: NPC1 repositioned from (8,5) to (6,5)
- Status: COMPLETE
```
