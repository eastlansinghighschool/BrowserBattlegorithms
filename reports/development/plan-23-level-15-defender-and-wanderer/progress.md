# Plan 23 Progress Report

## Summary

Reworked Challenge 15, `Dodge and Deliver`, so it now uses two explicit guided CPU behaviors: a stationary defender and a movement-only wandering enemy. The defender is placed on the enemy side as a lane guard, while the wanderer applies pressure without bringing jump, barrier, or freeze actions into the level.

### What changed

- Added two explicit guided NPC behaviors to `NPC_BEHAVIORS`:
  - `GUIDED_STAY_STILL`
  - `GUIDED_RANDOM_MOVE_ONLY`
- Extended the CPU action picker so those behaviors can be routed through the existing NPC pipeline without changing `FREE_PLAY_EASY`.
- Re-authored Level 15 to use:
  - one stationary active defender
  - one movement-only wandering enemy
- Updated Level 15 copy so the challenge is clearly framed as a lane defender plus a moving threat.
- Kept the level in the same campaign position and left the toolbox unchanged.
- Updated the canonical Level 15 reference solution so it remains classroom-ready with the new enemy shape.
- Added focused unit coverage for:
  - the authored defender/wanderer setup
  - the new guided behavior constants
  - movement-only random action selection under pinned `state.randomFn`
  - the Level 15 reference solution under representative random rolls
- Updated the NPC subsystem note to distinguish Free Play Easy from the new guided exception behaviors.

### Final authored Level 15 shape

- Player ally: `runner_1_AI_AllyP1` starts at `1,4`
- Stationary defender: `runner_2_Npc1` at `7,3` with `GUIDED_STAY_STILL`
- Wandering enemy: `runner_2_Npc2` at `8,6` with `GUIDED_RANDOM_MOVE_ONLY`
- Enemy flag: `10,4`

The defender remains on the enemy side and reads as a lane guard, while the wanderer starts behind and offset so the challenge stays teachable instead of becoming a coin flip.

### Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/free-play-contracts.test.js`
- `npm test`
- `npm run build`

### Validation result

- Focused unit suites passed.
- `npm test` passed.
- `npm run build` passed.
- The Level 15 reference solution passed under representative pinned random rolls `0`, `0.5`, and `0.99`.

### Files changed

- `src/config/constants.js`
- `src/ai/npc/freePlayCpu.js`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- `docs/subsystems/npc-and-cpu.md`
- `docs/development/README.md`

### Remaining risk

- The wandering enemy is still randomized by design, but the behavior is now movement-only and the reference solution is verified against representative pinned random rolls.
