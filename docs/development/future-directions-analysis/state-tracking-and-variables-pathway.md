# State Tracking And Variables Pathway

Status: deferred analysis
Date: 2026-05-21

## Context

Browser Battlegorithms intentionally avoids becoming a full Java course in the browser. Students should learn sequencing, boolean reasoning, comparisons, runner roles, local sensing, and decentralized coordination before the Java version opens the door to richer state and object design.

Plan 65 is the first narrow experiment in this direction: Free Play-only composable boolean blocks for recent runner state, without user-authored variables.

## Design Principle

Prefer game-provided state sensors before user-authored memory.

Good early blocks answer questions the game can already know:

- Did my last move get blocked?
- Have I stayed in the same cell for several of my turns?
- Is a resource ready?
- Does a teammate have the flag?

Riskier later blocks let students create or mutate state:

- set variable
- change counter
- remember a position
- compare remembered values

Those are powerful, but they add scope, persistence, debugging, and lesson-design weight.

## Candidate Block Pathway

### Tier 1: Bounded Recent-State Sensors

These are closest to the current browser model.

- `my last move was blocked`
- `I have not moved for [N] turns`
- `I moved last turn`
- `my last action was [move / jump / barrier / freeze / stay still]`
- `my last action succeeded`

Learning value:

- Helps students debug repeated local failures.
- Encourages fallback rules.
- Keeps state implicit and board-readable.

Good level ideas:

- Free Play inlet-recovery challenge card.
- Optional guided lab after movement helpers: runner bounces against wall, then uses a fallback vertical move.
- Optional guided lab after random movement: use random only after a blocked or no-movement streak, not every turn.

### Tier 2: Time-Since / Counter Sensors

These still use game-owned counters, not student variables.

- `turns since I moved`
- `turns since I picked up the flag`
- `turns since I was frozen`
- `turns since I placed a barrier`
- `turns since teammate picked up flag`

Learning value:

- Bridges to numeric comparisons and AP CSA conditionals.
- Lets students build patience/cooldown strategies without assignment.
- Supports "if stuck for too long, change plan" reasoning.

Good level ideas:

- Barrier specialist extension: place a barrier, retreat for two turns, then resume offense.
- Freeze support extension: use Area Freeze only after a teammate has carried the flag for several turns.
- Escort level extension: defender changes role after the carrier has been returning for two turns.

### Tier 3: Remembered Positions

These become more abstract and need careful wording.

- `my starting X`
- `my starting Y`
- `my previous X`
- `my previous Y`
- `distance from where I started`
- `distance from my previous position`

Learning value:

- Strong AP CSA bridge into variables and state snapshots.
- Helps explain coordinate systems and comparisons.

Risks:

- Students may confuse previous position, starting position, and current target.
- These blocks are easy to overuse without improving strategy.

Good level ideas:

- Patrol-escape lab: detect that a runner returned to the same coordinate pattern.
- "Hold the lane" lab: stay within distance 2 of a starting guard post unless teammate has flag.

### Tier 4: Goal-Relative Progress Sensors

These should wait until the wording is very precise.

- `I got closer to [enemy flag / my base / human runner / closest enemy] last turn`
- `I have not gotten closer to [target] for [N] turns`
- `distance to [target] decreased last turn`

Learning value:

- Teaches heuristic search and strategy evaluation.
- Strong bridge to pathfinding and AI topics.

Risks:

- "Progress" sounds intuitive but is not neutral. It depends on target selection and Manhattan distance.
- Moving away can be strategically correct while avoiding defenders.
- Students may think the game is doing pathfinding for them.

Good level ideas:

- Optional "Detour Is Progress" prediction level: sometimes distance to flag temporarily increases.
- Free Play strategy card: compare move-toward target with progress feedback.

### Tier 5: User-Authored Variables

This is likely better for the Java version or a very late optional browser lab.

Possible browser blocks:

- `set my counter to [number]`
- `change my counter by [number]`
- `my counter`
- `set team counter to [number]`
- `team counter`

Learning value:

- Direct bridge to AP CSA variables, fields, and stateful methods.
- Enables richer role protocols.

Risks:

- Introduces scope: per-runner vs per-team vs per-program.
- Requires UI, persistence, import/export, and reset/versioning decisions.
- Can undermine the browser version's focused learning model.
- Could encourage centralized command protocols instead of local rules.

Recommendation:

- Do not add user-authored variables until classroom evidence shows students have outgrown bounded state sensors.
- If added, begin with exactly one per-runner numeric counter in Free Play only.

## Guided Level Candidates

Potential future levels should be optional at first.

- **Optional Lab: Bounce Recovery**
  - New idea: `my last move was blocked`
  - Board: simple wall/inlet where Move Toward gets stuck.
  - Student task: use blocked-move feedback to switch to a vertical fallback.

- **Optional Lab: Stuck For Three Turns**
  - New idea: `I have not moved for [N] turns`
  - Board: runner can be boxed by barrier/wall interactions.
  - Student task: after a no-movement streak, choose a different action.

- **Optional Lab: Random As Fallback**
  - New idea: combine stuck condition with `Move Randomly`
  - Placement: after Optional Randomness Lab.
  - Student task: use random movement only when stuck.

- **Project Extension: Self-Correcting Roles**
  - New idea: a role-based team script where index 0 attacks, index 1 supports, but either can recover if blocked.
  - Placement: late optional Team Strategy Script extension.

- **Prediction Level: Did It Make Progress?**
  - New idea: distinguish movement from progress.
  - Placement: before any goal-relative progress block.
  - Student task: predict whether a move decreases distance to a target.

## Documentation Implications

If bounded state sensors move beyond Free Play:

- `docs/GameSpecification.md` should list runner recent-state memory as active match state.
- `docs/subsystems/blockly-workspace.md` should distinguish game-provided state sensors from variables.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` should add rows only when guided levels teach the new idea.
- Teacher-facing docs should frame these as debugging and fallback strategy tools, not as full variables.

If user-authored variables are ever added:

- The Blockly subsystem note needs a new section on variable scope and persistence.
- Free Play import/export and private program files need explicit variable serialization rules.
- Guided starter versioning needs a decision on whether variables are reset, preserved, or migrated.
- The future Java bridge should explain the connection to fields/local variables without pretending Blockly variables map one-to-one to Java.
