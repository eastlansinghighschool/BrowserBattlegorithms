# Guided Level Numbering Sequence Review

Scope: inspect the authored campaign titles, compare them against the current level order, and identify every place where a visible number shown to students no longer advances in a predictable sequence.

## What I Checked

- The ordered campaign titles from `getLevelDefinitions()`.
- The current concept matrix in [docs/GUIDED_LEVEL_CONCEPT_MATRIX.md](C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md).
- The authored prediction levels in:
  - [prediction-06-first-move.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/sensing/prediction-06-first-move.js)
  - [prediction-25-two-truths.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/prediction-25-two-truths.js)
  - [prediction-31-index-role-split.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-teamplay/prediction-31-index-role-split.js)
- The authored bug-hunt levels, which already use unnumbered titles.

## Current Visible Sequence

In campaign order, the player-facing titles currently read:

1. Level 1 through Level 5
2. Prediction 6: First Move
3. Level 6 through Level 14
4. Bug Hunt: Flag Phase
5. Challenge 15: Dodge and Deliver
6. Level 16 through Level 21
7. Bug Hunt: First Action Matters
8. Challenge 22: Show What You Know
9. Level 23 through Level 27
10. Prediction 28: Two Truths
11. Bug Hunt: Boolean Trap
12. Challenge 28: Full Team Tactics
13. Level 29 through Level 36
14. Prediction 31: Role Split
15. Bug Hunt: Role Split
16. Challenge 37: Advanced Scrimmage
17. Optional Lab: Move Randomly

## Discrepancies

### 1. `prediction-25` is visibly numbered as 28

- File: [prediction-25-two-truths.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/prediction-25-two-truths.js)
- Current title: `Prediction 28: Two Truths`
- Campaign position: immediately after Level 27 and before Challenge 28

This creates a duplicate visible `28` right before the real Challenge 28. It also makes the sequence look like it jumps from the late-20s into a prediction checkpoint that shares the same number as the next challenge.

### 2. Prediction checkpoints still expose numbers in the UI

- `Prediction 6: First Move`
- `Prediction 28: Two Truths`
- `Prediction 31: Role Split`

Even though these are not normal lesson steps, they still show student-facing numbers. That means the visible title stream is no longer a clean “next lesson number” sequence unless the prediction checkpoints are treated as part of the numbering system.

### 3. The bug-hunt levels are already unnumbered, which is good

- `Bug Hunt: Flag Phase`
- `Bug Hunt: First Action Matters`
- `Bug Hunt: Boolean Trap`
- `Bug Hunt: Role Split`

These do not interfere with the guided numbering sequence. They are already consistent with the user’s requested policy of leaving nonstandard checkpoints unnumbered.

## What Is Still Stable

- The ordinary guided levels themselves still advance in order.
- Challenge numbers match their campaign positions:
  - Challenge 15
  - Challenge 22
  - Challenge 28
  - Challenge 37
- The only hard collision in the current visible titles is the `Prediction 28` / `Challenge 28` duplication.

## What Would Need To Change To Fix It

Recommended policy:

1. Keep the standard lesson numbers on the ordinary guided levels and challenges.
2. Remove visible numbers from prediction titles.
3. Leave bug hunts unnumbered.

That would produce a cleaner student-facing sequence:

- Level 1 through Level 5
- Prediction checkpoint
- Level 6 through Level 14
- Bug Hunt
- Challenge 15
- Level 16 through Level 21
- Bug Hunt
- Challenge 22
- Level 23 through Level 27
- Prediction checkpoint
- Bug Hunt
- Challenge 28
- Level 29 through Level 36
- Prediction checkpoint
- Bug Hunt
- Challenge 37
- Optional Lab

## Files That Would Need Follow-Up Edits

- Prediction titles in:
  - [prediction-06-first-move.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/sensing/prediction-06-first-move.js)
  - [prediction-25-two-truths.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-logic/prediction-25-two-truths.js)
  - [prediction-31-index-role-split.js](C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-teamplay/prediction-31-index-role-split.js)
- The concept matrix row labels for prediction rows in [docs/GUIDED_LEVEL_CONCEPT_MATRIX.md](C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md)
- Any tests that currently assert the prediction titles start with `Prediction NN`, especially:
  - [tests/unit/guided-level-contracts.test.js](C:/AI/BrowserBattlegorithms/tests/unit/guided-level-contracts.test.js)

## Bottom Line

The campaign is no longer using a single predictable visible numbering scheme. The bug hunts are already handled correctly by being unnumbered, but the prediction checkpoints still show numbers and one of them now collides with Challenge 28.

If the goal is a stable student-facing sequence, the clean fix is to remove the visible numbers from prediction titles and keep the ordinary lesson/challenge numbering intact.
