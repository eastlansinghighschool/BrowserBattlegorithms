## Turn Engine Documentation Report

### Summary

The core turn engine is substantially more specific than the game spec, and the code is clearer than the docs in a few key places. The docs do cover the broad play loop, but they do not yet explain the actual execution order, the distinctions between a bounced move and an illegal move, or how scoring/round reset interacts with level completion.

This surface is important enough that future agents will likely get the wrong answer if they rely on the spec alone.

### What is strong

| Surface | Docs coverage | What is strong | Notes |
|---|---|---|---|
| One action per turn | Strong | The game spec and student-facing docs both state that only the first executed action matters. | This is the single clearest contract in the docs. |
| Core action families | Strong | Movement, jump, barrier placement, freeze, and stay-still are all described in the spec. | The high-level vocabulary matches the implementation well. |
| Scoring as a real win condition | Strong | The docs clearly say a point is scored by returning the enemy flag to base. | The level flow and match flow both reference scoring. |
| Collision concept | Medium-strong | The docs explain collisions and defender logic in a way that mostly matches the intended gameplay story. | The implementation is more nuanced, but the concept is documented. |
| Invariants as a testing concept | Medium | The test suite and docs both point to engine legality and state checks. | The docs hint at this, but the implementation provides the real guardrails. |

### What needs more documentation support

| Surface | Docs coverage | What is missing | Why it matters |
|---|---|---|---|
| Exact action precedence/order | Medium | The docs do not clearly state the actual runtime sequence inside a runner turn. | Agents need to know that action planning, execution, scoring checks, and round reset are not one flat step. |
| Invalid move vs bounce vs skip | Medium | The docs mention failed movement, but not the exact split between an illegal move, a bounce animation, and a skipped/ignored action. | This matters for rule explanations and student feedback copy. |
| Scoring vs level completion | Medium | The docs talk about scoring and winning, but not the exact relationship between `score_point`, `GAME_OVER`, and guided level pass/fail evaluation. | The same scoring event can end a round, end a match, or complete a guided level depending on context. |
| Frozen-turn behavior | Low-medium | The docs mention frozen runners, but not the precise turn handling for frozen runners who still occupy space. | The engine treats frozen runners as participants in the turn loop, not as absent entities. |
| Barrier removal by stay-still | Low-medium | The docs mention stay still, but not that it can remove a forward barrier in the current engine. | This is a subtle but real gameplay rule that affects teaching and troubleshooting. |
| Human input queuing vs AI planning | Low | The docs do not explain that human actions are queued, then resolved in the same runner-processing pipeline as AI actions. | Future agents can easily miss that the user input is still processed through the engine queue, not separately. |
| Free play game-over summary | Low | The docs do not call out the free-play summary event or how wins/losses are recorded. | That matters for usage evidence and admin review. |

### Areas that are messy or incorrect

These are the spots where the docs are not just incomplete; they are likely to mislead someone if left as-is.

1. **Turn order is not described quite accurately enough in the spec.**
   - `docs/GameSpecification.md` describes an alternating/randomized runner execution story.
   - The current engine actually advances through runners in a deterministic active-runner sequence, with the turn engine handling planning, execution, and advancement in one loop.
   - If the spec still claims alternating execution or randomization, that should be corrected or softened.

2. **The collision narrative is cleaner in the docs than in the code.**
   - The spec says the defender always wins the collision.
   - The implementation has a fuller rule tree involving map side, flag-carrying state, and grace-period behavior.
   - That richer behavior is real and testable, but the docs do not make the exceptions obvious.

3. **Round reset vs level reset are easy to conflate.**
   - The engine resets round state after scoring.
   - Guided level reset preserves some workspace state and re-enters the current level.
   - These are different systems, and the docs do not always keep them separate.

4. **The engine’s “first action only” model is technically correct, but the docs don’t explain the implication for extra blocks.**
   - Extra sequential blocks are ignored.
   - Unattached blocks are ignored.
   - The docs say this in places, but not always in the same language as the runtime warnings and ignored-block visuals.

### Core runtime order, as implemented

The report would benefit from a small runtime-order note in the docs. The actual flow is roughly:

1. A runner becomes active.
2. Human input may queue an action, or AI may choose one.
3. The turn engine resolves the queued action.
4. Movement/collision/barrier/freeze legality is checked.
5. The runner finishes the action or bounces.
6. Flag pickup is checked.
7. Scoring is checked.
8. Guided level progress may be evaluated.
9. The engine either resets the round, ends the game, or advances to the next runner.

That sequence is the real contract. The docs mostly describe the ingredients, not the recipe.

### Interactions with related surfaces

#### Movement

The turn engine depends heavily on [src/core/movement.js](../../../src/core/movement.js) for:
- target translation
- board blocking checks
- move-toward helper decisions

The docs explain the idea of movement, but they do not explain the runtime distinction between:
- a direct move action
- a translated helper action
- a blocked move that bounces

#### Conditions

The execution model depends on [src/core/conditions.js](../../../src/core/conditions.js) for:
- barrier sensing
- flag possession
- side-of-field checks
- teammate-has-flag checks
- sensor relation evaluation

This is mostly absent from the general docs beyond a broad Blockly summary.

#### Scoring

[src/core/scoring.js](../../../src/core/scoring.js) is where:
- flag pickup happens
- score events happen
- the game flips into `GAME_OVER` when a team reaches the win threshold

The docs need to state more clearly that scoring is not just “increment a number”; it can be the event that terminates the match or resolves a guided level.

#### Collision

[src/core/collisions.js](../../../src/core/collisions.js) handles:
- who wins
- who loses
- whether freeze applies
- what happens to a carried flag

This is another place where the implementation is more nuanced than the prose.

#### Invariants

[src/core/invariants.js](../../../src/core/invariants.js) acts as the safety net for:
- duplicate runner positions
- invalid barrier ownership
- illegal flag state
- team direction consistency

The docs mostly mention tests, not the actual invariant shapes.

### What I would document next

If we patch the docs, the highest-value additions would be:

- a compact “turn resolution order” note
- a “bounce vs illegal move vs skipped action” explanation
- a “scoring vs level completion vs round reset” clarification
- a collision rule summary that includes the real exceptions
- a short note that human input queues into the same engine pipeline as AI actions

### Evidence used

- [src/core/turnEngine.js](../../../src/core/turnEngine.js)
- [src/core/actions.js](../../../src/core/actions.js)
- [src/core/conditions.js](../../../src/core/conditions.js)
- [src/core/movement.js](../../../src/core/movement.js)
- [src/core/scoring.js](../../../src/core/scoring.js)
- [src/core/collisions.js](../../../src/core/collisions.js)
- [src/core/invariants.js](../../../src/core/invariants.js)
- [docs/GameSpecification.md](../../../docs/GameSpecification.md)
- [docs/TeacherGuide.md](../../../docs/TeacherGuide.md)
- [docs/StudentGuide.md](../../../docs/StudentGuide.md)
- [docs/TESTING.md](../../../docs/TESTING.md)

