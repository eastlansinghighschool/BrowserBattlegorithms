# Browser Battlegorithms — Game Specification
*Last reviewed: 2026-05-18*

Browser Battlegorithms is a two-team, turn-based, grid-based capture-the-flag game for students learning programming strategy in a browser or on paper.
The rules below describe the game itself; the subsystem notes cover implementation details.
The document is intentionally game-first rather than software-first.
It is meant to read cleanly as a classroom rules handout.
The same core rules apply across every mode described later.

## 1. Overview
Browser Battlegorithms is designed so a reader can understand the game without reading the code.
It supports classroom play, ally coordination, and strategic reasoning through simple grid rules.

## 2. Learning Objectives
- Teach sequencing, branching, and turn-by-turn planning.
- Encourage students to reason about local sensing, roles, and resource timing.
- Show how simple rules create coordination without a central commander.
- Support strategic decomposition for ally runners sharing one program.
- Provide a gentle bridge from visual programming to deeper CS ideas.
- Reinforce that local sensing and resource checks matter more than guessing.
- Keep the game legible enough that students can explain it back to each other.
- Make runner roles and shared strategy visible instead of hidden.
- Give students a concrete way to talk about timing, spacing, and positioning.

## 3. Board and Setup
- This section describes the physical board and the default starting state for a match.
- The game is played on a static 2D grid of floor, wall, base, and jail cells.
- Each match uses one fixed map layout until the match ends.
- The two teams always start on opposite sides of the board.
- Team identity determines home side, flag home location, and forward direction.
- Free Play may randomize which team starts on the left or right.
- The teams still face opposite directions in every match.
- Each team has spawn positions for its runners and a starting flag location in its home area.
- Each team fields one human runner and a small number of allies in modes that use them.
- The team setup determines which runner is controlled directly and which runners share the ally program.
- Runners start in their own territory rather than in the middle of the map.
- A tabletop player can model the board using tokens for runners, flags, barriers, and jails.
- Jails appear in the lower corners as visually designated cells; they do not add a separate movement rule unless a map also marks them as a wall or barrier.
- A team's base area is the place where its own flag starts and where an enemy flag must be returned to score.
- Board size, team size, points to win, and similar knobs are configurable per mode or level.
- The map does not regenerate during a match.
- A match keeps the same board until a round reset or full match reset occurs.
- If a level authors a custom setup, it still respects the same board rules and side assignment logic.
- The board can be played with tokens and paper if the rules are followed faithfully.
- Setup is the point where the match decides who starts where, not where the core rules change.

## 4. Game Entities
The entities below are the persistent objects that the rules move around and update.
### Runners
- Each runner belongs to a team and has a grid position.
- A runner may be human-controlled, ally-controlled, or NPC-controlled depending on the mode.
- Runners inherit their forward direction from their team setup.
- Runners track enemy-flag state, frozen state, frozen-turn countdown, jump availability, and barrier availability.
- The human runner is the direct-input runner for that team.
- Ally runners may share one Blockly program, so a single strategy can coordinate several bodies.
- Frozen runners still occupy space and cannot act until they thaw.
- A runner's team identity is what ties together its direction, base, and scoring side.
- The runner list and the flag list are the active state a match keeps track of from turn to turn.

### Flags
- Each team has one flag.
- A flag has a team, a current grid position, an at-base state, and an optional carrying runner id.
- Flags move only when carried.
- A flag stays at its home unless a runner carries it away or a round reset returns it home.
- When a flag is carried, its visible position follows the carrier.
- A runner can only score with the enemy flag, not with its own flag.

### Barriers
- A barrier has a grid position and the id of the runner who placed it.
- A runner may have only one active barrier at a time.
- A runner who stands still can remove the barrier directly in front of them if that barrier belongs to a runner.
- Barriers are temporary board objects, not team-wide structures.
- Removing a barrier restores that runner's ability to place another one.
- Barriers exist to create tactical detours, not to permanently reshape the map.
- Barrier placement and removal are how the game creates short-lived map puzzles.

### Special actions
- Area Freeze is the only team special action.
- The special-action slot is team-wide, not tied to one specific runner.
- Special actions are resources, so the team must decide when spending them is worth it.

## 5. Turn Structure
This section is the canonical order of play for a single runner turn.
- Runners act one at a time in a fixed sequence.
- At the start of a runner's turn, the game checks whether that runner is frozen.
- Frozen runners skip their action and thaw one step as the sequence continues.
- Otherwise the active runner chooses one action for the turn.
- Human runners choose with keyboard input.
- AI allies and free-play CPU runners choose through the same action pipeline via their mode.
- The engine resolves the chosen action, then applies movement legality, collisions, flag pickup, and scoring.
- Movement legality is checked before any move, jump, barrier, or collision is finalized.
- A blocked move bounces if the target cell is off-board, a wall, a barrier, the runner's own home-flag cell while that flag is still at base, an active friendly runner, or a frozen opposing runner.
- A target cell with an active opposing runner creates an immediate collision instead of a bounce.
- Jump Forward uses the same landing-cell legality as movement, ignores the intermediate cell, and consumes the jump resource when attempted.
- Place Barrier can place only in the cell directly forward, only when barrier resource is available, and only if that cell is on-board and not occupied by a wall, barrier, runner, or home flag at base.
- Stay Still may remove a barrier directly forward and restore that barrier owner's placement resource.
- A runner picks up the enemy flag when it successfully ends movement on that flag's cell and the flag is not already carried.
- Successful moves may animate.
- Blocked moves bounce back.
- Illegal no-op actions consume the turn without movement.
- After the active runner finishes, the next runner becomes active.
- When the sequence wraps back to the first runner, the current turn number advances.
- The active runner is the only runner who may act at that moment.
- The turn engine's deterministic order is what makes the game readable on paper.
- For the exact runtime order, see the turn-engine subsystem note.
- A round ends only when scoring or another match-level rule says it should.
- A turn can still advance even when the action was a no-op.
- A frozen runner still counts as part of the sequence even though its action is skipped.
- The turn structure is intentionally simple enough that students can track it by hand.

## 6. Actions
Human-controlled runners use keyboard input; AI allies select from the same action set through Blockly programs, and the current block inventory is documented in the Blockly workspace subsystem note.
Each runner may execute only one action per turn.
- The difference between human and AI control is input path, not the underlying action rules.

- Move: step one cell in a cardinal direction.
- Move Forward / Backward / Up / Down: team-relative move actions used by Blockly.
- Move Randomly: choose a legal cardinal move.
- Move Toward [target]: take one step toward the chosen target without full pathfinding.
- Jump Forward: move two cells forward if jump is available; it ignores the intermediate cell and uses the same landing-cell legality as movement.
- Place Barrier: place a barrier directly in front if barrier is available and that cell is valid.
- Stay Still: do nothing for the turn.
- Stay Still can also remove a barrier directly in front of the runner and restore that barrier owner's placement resource.
- Use Area Freeze: if the team power is ready, freeze opposing runners in range and start the cooldown.
- The action set is mode-agnostic even when the input medium differs.
- Move Up / Down / Left / Right are the screen-keyboard actions a human runner uses.
- Move Forward / Backward are the same movement idea expressed through team direction.
- Jump Forward and Place Barrier each consume a limited resource until the next reset or removal.
- Move Toward is a helper action, not a full pathfinder.
- Use Area Freeze targets the caster's location and then affects opposing runners within range around it.
- Movement fails or bounces when the target cell is off-board, a wall, a barrier, the runner's own home-flag cell while that flag is still at base, an active friendly runner, or a frozen opposing runner.
- An active opposing runner in the target cell creates an immediate collision.
- The first reachable Blockly action under `On Each Turn` is the one that matters for execution.
- Any later sequential Blockly action is ignored by the engine.
- Free-play CPU modes still choose from the same underlying action family.
- Students can explain the game as "pick one action, then let the engine resolve it."

## 7. Collision Resolution
When an active runner moves into a cell occupied by an active opposing runner, resolve the collision immediately.
The map-side defender is the team whose home side contains the collision cell.
- A collision only happens when the target cell is occupied by an active opposing runner.

- If exactly one runner carries the enemy flag, that flag carrier loses.
- If both runners carry the enemy flag, the moving attacker loses.
- If neither runner carries the enemy flag, the map-side defender wins.
- The loser becomes frozen for the collision freeze duration.
- If the loser carries a flag, that flag returns to its home base.
- The loser is moved back to the attacker's origin cell.
- The winner remains on the collision cell.
- Frozen opponents still block space.
- The old percent-chance collision rule is not used.
- The defender is defined by the collision cell's home side, not by a fixed team number.
- Collision resolution therefore stays correct even when Free Play randomizes the left/right assignment.
- A collision never leaves two runners stacked on the same square.
- The collision rule is what makes flag-carrying play more dangerous and more interesting.
- Collisions are resolved before the next runner gets a turn.
- If a collision happens during a carrier run, the flag logic stays part of the same immediate resolution.

## 8. Area Freeze
Area Freeze is a team power with a shared readiness cooldown.
A team may use it only when the shared helper says it is ready.
- The power is ready or not ready for the whole team, not for individual runners.

- The power freezes opposing runners within the Area Freeze radius around the caster.
- Frozen runners remain disabled for the frozen duration.
- Using the power spends it even if no opponents are in range.
- After use, the team must wait for the cooldown window before using it again.
- Readiness is tracked by the shared cooldown helper used by the runtime and the UI.
- The radius is measured with Manhattan distance.
- The frozen duration for Area Freeze is two turns.
- The resource is team-wide, so one ally's use affects the whole team clock.
- Area Freeze matters most when a team wants to protect a carrier or create space for a run.
- The action still counts as spent even if it does not freeze anyone.
- The power is local, so it changes a nearby lane rather than the whole board.
- The shared cooldown is what keeps the power from being spammed every turn.

## 9. Scoring and Win Conditions
A point is scored when a runner carrying the enemy flag reaches any cell in its own team's base area.
When scoring happens, the flag returns home, the round resets, and play continues unless the match is over.
The first team to reach the points-to-win threshold wins the match.
Guided levels may add authored pass/fail conditions on top of these match rules.
- Scoring uses the current base area, not a separate goal cell.
- Round reset returns runners to their starting positions and resets their jump, barrier, and frozen states.
- Area Freeze readiness also resets on round reset.
- The map itself stays the same across rounds in a match.
- Scoring is the thing that turns a successful flag run into a completed round.
- A full match can contain several scored rounds before one team reaches the win threshold.
- A round reset happens immediately after the point is awarded.
- The match is over only when a team reaches the win threshold.

## 10. Configurable Parameters
- Board dimensions and map layout.
- Team size and the free-play mode's player/CPU split.
- Points required to win the match.
- Collision freeze duration.
- Area Freeze radius, freeze duration, and cooldown length.
- Whether free play randomizes which team starts on which side.
- The active map and the runner spawn setup for the current level or match.
- The default board remains 12 columns by 8 rows unless a level or mode overrides it.
- Free Play team size can vary within the authored sandbox limits.
- Collision freeze duration is separate from Area Freeze duration and cooldown.
- Configurable parameters change the match feel without changing the core rules.
- The same rules still apply when a level chooses a smaller or larger map.
- Level authors can tune the board and the starting setup without rewriting the rules.
- Player-facing modes can expose different sandbox breadth while keeping the same match logic.

## 11. Levels
Browser Battlegorithms ships with a guided campaign of progressive levels.
See [`GUIDED_LEVEL_CONCEPT_MATRIX.md`](./GUIDED_LEVEL_CONCEPT_MATRIX.md) for the canonical level inventory and [`StudentGuide.md`](./StudentGuide.md) for student-facing descriptions.
The spec does not list the levels individually.
The level matrix is the place to look for order, unlocks, and level-specific teaching goals.
- Guided level names, objectives, and toolbox shaping live outside this rules doc.
- This keeps the rules doc stable even when the campaign grows.

## 12. Modes of Play
- PvNPC: one human player controls their team's human runner and programs allies, while the opposing team uses built-in NPC behavior. See [`ui-mode-contract.md`](./subsystems/ui-mode-contract.md) for runtime control details.
- Hot-Seat: two human players share one machine, each controlling their own human runner and ally program. See the ui-mode contract note for how the shared UI switches between players.
- Free-Play PvP: both teams are human-facing free-play teams with separate Blockly tabs. See the ui-mode contract note for how the tabs, scoreboard, and controls change.
- Free-Play PvCPU Easy: the player team uses Blockly allies while the CPU team plays a simpler legal-action style. See the ui-mode contract note for the control layout.
- Free-Play PvCPU Tactical: the player team uses Blockly allies while the CPU team uses a more role-based defender/attacker strategy. See the ui-mode contract note for the control layout.
- The mode descriptions here stay short on purpose; the ui-mode contract note owns the exact control visibility and UI behavior.
- Guided levels sit on top of these modes rather than replacing them.
- Each mode keeps the same core rules; only the controlling agents and UI framing change.
- Mode choice changes who decides the action, not what the board rules are.
- The scoreboard and control surface adapt to the selected mode, but the match rules do not.
- The same board, collision, flag, and scoring rules continue to apply in every mode.
