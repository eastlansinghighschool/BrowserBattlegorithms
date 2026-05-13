---
status: COMPLETE
tier: 4
level-id: relay-race
level-title: "Level 18: Relay Race"
change-type: board redesign (setupOverrides) — REQUIRES DEVELOPER DECISION
target-file: src/config/levels.js
---

## Summary
Level 18 teaches `if_teammate_has_flag` but the human runner starts with the enemy flag and never drops it (`humanTurnBehavior: AUTO_SKIP`). The condition is therefore always true — students never see the ELSE branch execute. This makes it a single-branch lesson disguised as a conditional.

This change requires a developer decision before the board coordinates can be finalized. Two options are documented below.

---

## The Problem
Current setup:
- `runner_1_HumanP1: { gridX: 6, gridY: 2, hasEnemyFlag: true }` — human starts with flag
- `humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP` — human never moves
- `if_teammate_has_flag` is true on turn 1 and stays true throughout
- Students see: condition fires, DO branch runs, ally approaches human. ELSE branch never executes.

---

## Option A — Add a second ally
Add a second ally (`runner_1_AI_AllyP2`) to the setup who starts near the enemy flag. The main ally (`runner_1_AI_AllyP1`) starts somewhere else. Both run the same program. During early turns, `if_teammate_has_flag` is false (nobody has the flag yet) → ELSE branch fires → main ally moves forward. After the second ally reaches and picks up the enemy flag, `if_teammate_has_flag` (from the main ally's perspective) becomes true → DO branch fires → main ally switches to support movement.

**Pros:** Both branches execute during normal play. Clean concept introduction.
**Cons:** Adds a second ally to a level that was designed for one. Requires defining a `winCondition` that still makes sense with two allies active.

Suggested coordinates (for developer to adjust):
- ally at (1,4) — runs the conditional program
- ally2 at (1,6) — moves forward toward flag at right side; wins once it picks up flag OR reaches a cell
- Human at (6,2) — stays still, acts as the support target
- NPC1/NPC2 stay frozen as before
- Win condition: ally reaches support square at (5,3) — adjacent to human
- Flag override: remove `hasEnemyFlag: true` from human; allow ally2 to pick it up by reaching the flag cell

**Developer note:** Verify that once ally2 picks up the enemy flag, `if_teammate_has_flag` correctly evaluates to true for ally (runner 1). This depends on whether the game considers allies on the same team as teammates for this check.

---

## Option B — Redesign the scenario without `if_teammate_has_flag` flipping
Accept that `if_teammate_has_flag` won't flip with AUTO_SKIP, and instead redesign the ELSE branch to be pedagogically useful for the early turns before the ally reaches the support zone.

In this model, the concept taught is: "when a teammate has the flag, switch from attacking to supporting." The ELSE branch can be a meaningful initial approach (e.g., move toward the enemy flag zone), and the DO branch kicks in from the start since the human already has the flag.

This doesn't fix the "always-true" issue but reframes it: the lesson becomes "how to react when a teammate has the flag" rather than "when does `if_teammate_has_flag` flip."

**If Option B is chosen:** No board changes are needed. The Tier 3 change (`tier3/10-relay-race-demo.md`) still applies. This Tier 4 file can be marked SKIPPED.

---

## Recommendation
Prefer Option A if a second ally can be added without destabilizing the `winCondition`. If Option A is too complex to implement cleanly, proceed with Option B (no board change, mark this file SKIPPED).

## Log Entry Template
```
## tier4/03-relay-race-board.md — [DATE]
- Level: Level 18: Relay Race
- Option chosen: [A or B]
- Changes made: [describe]
- Status: [COMPLETE or SKIPPED]
```
