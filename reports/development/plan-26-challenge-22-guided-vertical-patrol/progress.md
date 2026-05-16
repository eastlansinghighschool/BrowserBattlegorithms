# Plan 26 Progress Report: Challenge 22 Guided Vertical Patrol

## What changed

- Added `NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL` as a new guided-only CPU behavior.
- Implemented the patrol in `src/ai/npc/freePlayCpu.js` as a deterministic up/down vertical patrol with runner-local direction memory.
- Stored patrol direction on the runner object and cleared it on runner reset so the behavior does not carry stale direction across rounds.
- Re-authored Challenge 22 opponent setup so both defenders use the new patrol behavior at the requested center-lane positions:
  - `npc1` at `(7, 4)`
  - `npc2` at `(8, 5)`
- Updated NPC/CPU subsystem documentation to describe the new guided patrol behavior.
- Added focused unit coverage for patrol direction changes, Challenge 22 authoring, and reset cleanup.

## Why

Challenge 22 is a synthesis level, not a chase-AI lesson. The vertical patrol keeps the level readable and lively while reducing the brittle “enemy follows me everywhere” feeling that can distract from the intended Blockly strategy work.

## Validation

- `node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/teams-and-setup.test.js`
  - passed
- `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js`
  - passed
- `npm test`
  - passed, `110/110`
- `npm run build`
  - passed
  - existing Blockly chunking warnings remain

## Reference solution status

- The canonical Challenge 22 reference solution in `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml` still passes with the new patrol defenders.
- No fixture update was needed.

## Remaining risks

- The patrol is deterministic, but future edits to Challenge 22 start positions or board geometry should re-run the guided reference suite because the patrol lane is now authored behavior, not a free-play default.
- The behavior is guided-only by convention and level authoring, so future packets should avoid surfacing it in Free Play UI or conflating it with tactical CPU modes.
