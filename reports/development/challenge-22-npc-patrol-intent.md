# Change Intent Report: Challenge 22 NPC Patrol Direction

## What We Are Trying To Change

Challenge 22, `show-what-you-know`, currently works best when the opponent runners stay near the center lane instead of aggressively chasing the ally around the board. The intended next step is to make the level easier to solve and more readable by changing the opponent behavior from reactive pursuit to a simple patrol pattern, likely a vertical up/down patrol.

The high-level goal is:

- keep Challenge 22 challenging enough to feel like a live scrimmage
- reduce route brittleness caused by mobile defenders chasing the ally
- make the canonical solution more stable and classroom-friendly
- introduce a small reusable NPC capability that could be used in other levels later

## Why We Want This

The current Challenge 22 setup can become inconsistent or overly brittle when the defenders actively track the ally. That makes the level harder for the wrong reason: students can be forced into trial-and-error around moving obstacles instead of reasoning about the advanced logic tools the level is meant to synthesize.

A patrol-style defender would:

- keep the board readable
- preserve some live-opponent pressure
- avoid the “enemy follows me everywhere” dynamic
- make the sensor relations and branch logic feel load-bearing rather than incidental

This is especially useful because Challenge 22 is a synthesis gateway level, not a new-mechanic lesson. Its purpose is to let students combine tools they already know, not to introduce a new enemy AI challenge.

## Candidate Behavior Idea

The idea under discussion is a deterministic patrol behavior, most likely:

- move up until a boundary or blocked cell is reached
- reverse direction and move down
- repeat that cycle

This would not be a Blockly feature. It would be an engine-side NPC behavior.

Important distinction:

- Blockly variables are not currently available in the student toolbox
- the patrol direction would instead be stored in NPC state or runner-local engine memory
- that means the new behavior can exist without changing the student programming surface

## Why Not Use Blockly Variables

We checked whether the current Blockly setup supports stateful variables for this idea. It does not.

Current Blockly support includes:

- conditions and branching
- boolean and numeric value blocks
- sensor checks
- movement and action blocks
- read-only values like runner index, playDirection, and distance to target

It does **not** include:

- variable get/set blocks
- mutable student-defined state
- persistent per-turn memory in Blockly programs

So if we want a patrol enemy, it should be implemented in CPU logic, not as a student-facing Blockly capability.

## Likely Touch Points

### Core NPC behavior

Primary file:

- `src/ai/npc/freePlayCpu.js`

Likely work:

- add a new NPC behavior branch for patrol
- decide whether the patrol is vertical-only or patrol-with-boundary-reversal
- make it deterministic and legal under map boundaries and obstacles
- keep it separate from existing `FREE_PLAY_EASY`, `FREE_PLAY_TACTICAL_ATTACKER`, and `FREE_PLAY_TACTICAL_DEFENDER`

### NPC behavior constants

Primary file:

- `src/config/constants.js`

Likely work:

- add a new `NPC_BEHAVIORS` enum entry if needed
- decide whether to reuse `PATROL_INTERCEPT` or add a more explicit patrol name
- keep the enum readable for future reuse

### Challenge 22 level authoring

Primary file:

- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`

Likely work:

- assign the new patrol behavior to one or both enemy runners
- keep the current center-lane layout if it produces the intended classroom challenge
- verify the board still reads as a live-defender synthesis challenge

### Guided reference solution

Primary file:

- `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`

Likely work:

- confirm the canonical solution still passes on the new patrol board
- replace the current XML if the new board encourages a different intended strategy

### Contract and regression tests

Primary files:

- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- possibly `tests/unit/conditions.test.js` if the patrol logic needs a new runtime helper

Likely work:

- assert the authored Challenge 22 NPC behavior values
- check that the new patrol setup preserves the intended level shape
- validate the reference solution on deterministic or representative patrol runs
- avoid introducing a fragile pass-rate threshold unless there is real randomness in the behavior

### Documentation

Potential docs to update if the behavior becomes reusable:

- `docs/subsystems/npc-and-cpu.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/development/README.md`

Likely work:

- explain the new patrol behavior contract
- clarify whether it is guided-only, free-play only, or reusable across both
- record any curriculum reasoning if Challenge 22 becomes easier by design

## Open Questions For Orchestrator Review

These are the details that likely need confirmation before the packet is written:

1. Should the patrol behavior be a new reusable NPC behavior name, or should it reuse `PATROL_INTERCEPT`?
2. Should the patrol be strictly vertical, or should it support a small horizontal/vertical loop?
3. Should the patrol be available only for guided challenge authoring, or also for free play or future levels?
4. Should Challenge 22 keep the same canonical solution, or should the reference solution be updated to a more explicit center-lane strategy?
5. Should the behavior be deterministic only, or should it allow a small random component?

## Recommended Framing

If this is turned into a packet, the packet should frame the work as:

- a small reusable NPC capability
- used first to improve Challenge 22 readability and solve stability
- potentially reusable in other guided or free-play levels
- not a Blockly or student-programming feature

That keeps the change intent history clear: this is about authored enemy behavior, not a curriculum expansion of Blockly state or variables.

