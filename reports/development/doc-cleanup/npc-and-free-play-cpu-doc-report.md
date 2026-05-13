# NPC and Free Play CPU Documentation Report

## Summary

This surface is split in a way the docs only partly reflect. The repository has two different kinds of autonomous opponents:

- guided / teaching NPC behaviors for authored levels
- free-play CPU behaviors for sandbox matches

The high-level docs understand that distinction in broad strokes, but they do not yet make the runtime contract clear enough for future agents. The result is that someone can read the spec and still miss where to change behavior, what can safely be randomized, and which pieces are deterministic enough for tests.

The code is fairly coherent. The docs are the part that need the extra map.

## What is strong

| Surface | Docs coverage | What is strong | Notes |
|---|---|---|---|
| Existence of NPC opponents | Strong | `docs/GameSpecification.md` and `docs/DevelopmentPhases.md` clearly describe Player-vs-NPC as a supported mode. | The broad idea of built-in opponents is not mysterious. |
| Free Play CPU as a distinct product feature | Medium-strong | `docs/ARCHITECTURE.md`, `docs/DevelopmentLog.md`, and the Phase 9 material all say Free Play has its own CPU strategy layer. | This is the best-documented part of the split. |
| Free Play tactical intent | Medium | The docs do say there is a tactical attacker/defender split, with barrier, freeze, and flag pressure behavior. | The behavior family is named correctly even if the details are not fully mapped. |
| Basic NPC teaching intent | Medium | The development phases describe NPC Type 1 and Type 2 as simple hardcoded teaching opponents. | The pedagogical role is present in the docs, if only at a high level. |

## What needs more documentation support

| Surface | Docs coverage | What is missing | Why it matters |
|---|---|---|---|
| Teaching NPC vs competitive CPU | Low-medium | The docs do not clearly separate guided NPC logic from free-play CPU logic as two different tuning goals. | Future agents may change the wrong file or assume one behavior family should be reused in the other. |
| Which behaviors are deterministic | Low | The docs do not say that `npcType1`, `npcType2`, and the tactical pathing helper are deterministic heuristics, while Free Play Easy is intentionally random within legal moves. | Tests and debugging depend on knowing what can be asserted exactly. |
| Where randomness is allowed | Low | The docs do not spell out that only Free Play Easy should be freely randomized, while the guided teaching NPCs should stay legible and predictable. | Randomizing the wrong behavior would make levels and tests harder to reason about. |
| Shared pathing helper behavior | Low | The docs do not clearly mention that `src/ai/npc/pathing.js` is a shared deterministic one-step move-toward helper. | This is a shared seam between Type 2 and Free Play tactical CPU. |
| CPU role assignment in Free Play | Low | The docs do not explain that tactical Free Play creates attacker and defender roles from the active free-play mode. | That mapping happens in setup, not in the UI, and is easy to miss. |
| Test hooks for randomness | Low | The docs do not note that the CPU layer accepts a `state.randomFn` hook for deterministic testing. | Without that note, future agents may think the AI is nondeterministic by design in tests. |

## What is messy or incorrect

1. **The docs blur the boundary between guided NPCs and Free Play CPU.**
   - `docs/GameSpecification.md` still reads as if “NPC logic” is one general concept.
   - In the code, `npcType1.js` and `npcType2.js` are simple opponent behaviors used for authored/NPC-style play, while `freePlayCpu.js` is a separate free-play strategy layer.
   - The architectural notes do mention separation, but the docs do not make the policy boundary easy to find.

2. **The spec is not clear enough about what is being randomized.**
   - Free Play Easy is intentionally chaotic and low-skill.
   - Tactical Free Play is mostly deterministic and only falls back to randomness for legal tie-breaking or fallback choice.
   - Guided NPC logic should remain predictable enough to teach from and test against.
   - The docs do not say that explicitly, so future agents may over-randomize the wrong surface.

3. **The docs do not distinguish “movement heuristic” from “pathfinding.”**
   - `src/ai/npc/pathing.js` is not full pathfinding; it is a deterministic one-step move-toward heuristic with obstacle fallback.
   - `npcType1.js` has its own axis-prioritized chase heuristic.
   - `npcType2.js` and the Free Play tactical CPU both use the shared helper.
   - That distinction matters for performance expectations and test predictability.

## Code-level behavior worth documenting

### Guided / teaching NPC behaviors

The teaching NPCs are not meant to be sophisticated. Their role is to be understandable and stable.

- `src/ai/npc/npcType1.js`
  - chases the enemy flag when it is loose
  - chases the carrier if the enemy flag is carried
  - returns toward its own flag approach if it is holding the enemy flag
  - uses a simple axis-prioritized move heuristic
  - has no random branch

- `src/ai/npc/npcType2.js`
  - checks for nearby threats around its own flag home
  - patrols within a radius around the flag area
  - uses the shared deterministic pathing helper
  - has no random branch

These are the behaviors that are easiest to treat as deterministic in tests.

### Free Play CPU behaviors

The free-play CPU is a different design goal.

- `src/ai/npc/freePlayCpu.js`
  - `FREE_PLAY_EASY` picks from legal actions at random
  - `FREE_PLAY_TACTICAL_ATTACKER` chases the enemy flag or returns home when carrying it
  - `FREE_PLAY_TACTICAL_DEFENDER` protects the home side, freezes nearby threats, or repositions near a defense cell
  - the tactical modes are largely deterministic once the state is fixed
  - the easy mode uses `state.randomFn` if available, otherwise `Math.random`

This is the surface where docs should explicitly say “random by design” versus “deterministic by design.”

### Shared pathing helper

`src/ai/npc/pathing.js` is shared by the Type 2 NPC and the Free Play tactical CPU. It is deliberately simple:

- choose the dominant axis first
- try the preferred move
- fall back to the orthogonal move if blocked
- otherwise stay still

That helper is deterministic enough for tests and should probably be documented as a heuristic, not as full pathfinding.

## Interactions with other surfaces

### Setup and team assignment

The CPU layer is not just a behavior function. It is wired through team setup:

- `src/core/teams.js` assigns `cpuBehavior` and `cpuRole`
- tactical Free Play creates attacker and defender roles from the free-play mode
- the active team setup determines which opponent logic runs

The docs mention Free Play mode, but they do not make this setup-to-behavior mapping obvious.

### Turn engine

The CPU logic feeds into the same turn engine as human and Blockly actions.

That means:

- the behavior functions should return legal actions, not state changes
- determinism matters because the turn engine is what ultimately resolves those actions
- random choices should still be constrained by legality checks

The docs touch turn order, but not the contract between CPU decision code and turn resolution.

### Movement and collision rules

The CPU logic depends on the same movement legality and collision logic as the rest of the game.

This is especially important for:

- freeze radius decisions
- legal fallback movement
- barrier placement checks
- avoiding blocked cells when a preferred move is unavailable

The docs explain the game rules in broad terms, but they do not clearly state that the CPU layer is written to those same rules rather than bypassing them.

### Free Play UI and setup

Free Play mode selection in the UI determines whether the user sees:

- PvP
- PvCPU Easy
- PvCPU Tactical

The docs mention those modes, but they do not clearly connect them to the actual CPU behavior selection in code.

## What is well documented versus what needs help

### Well documented

- NPC opponents exist
- Free Play has its own CPU strategy layer
- Tactical Free Play has attacker and defender roles
- Free Play Easy is meant to be lower skill
- Player vs NPC is a distinct mode from Free Play

### Needs more documentation help

- where the guided teaching NPCs end and Free Play CPU begins
- what is deterministic enough for tests
- where randomness is intentional and where it is not
- how the shared pathing helper is used
- how mode/setup maps to `cpuBehavior` and `cpuRole`

## Practical recommendation

This surface deserves a short internal doc note or architecture appendix that says:

1. guided NPC logic and Free Play CPU are separate systems
2. NPC Type 1 and Type 2 are deterministic teaching opponents
3. Free Play Easy is intentionally random within legal actions
4. Free Play Tactical is a role-based heuristic system
5. `pathing.js` is a shared deterministic move-toward helper
6. `state.randomFn` exists so tests can pin down behavior when needed

That would keep future agents from mixing up the teaching AI and the sandbox AI.

## Evidence used

- [src/ai/npc/freePlayCpu.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/npc/freePlayCpu.js)
- [src/ai/npc/npcType1.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/npc/npcType1.js)
- [src/ai/npc/npcType2.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/npc/npcType2.js)
- [src/ai/npc/pathing.js](C:/Codex/BrowserBattlegorithms_CODEX/src/ai/npc/pathing.js)
- [src/core/teams.js](C:/Codex/BrowserBattlegorithms_CODEX/src/core/teams.js)
- [src/config/constants.js](C:/Codex/BrowserBattlegorithms_CODEX/src/config/constants.js)
- [docs/GameSpecification.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/GameSpecification.md)
- [docs/TeacherGuide.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/TeacherGuide.md)
- [docs/ARCHITECTURE.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/ARCHITECTURE.md)
- [docs/DevelopmentPhases.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/DevelopmentPhases.md)
- [docs/DevelopmentLog.md](C:/Codex/BrowserBattlegorithms_CODEX/docs/DevelopmentLog.md)
