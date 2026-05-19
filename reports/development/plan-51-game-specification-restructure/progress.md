# Plan 51 Progress Report

## Scope
- Rewrote `docs/GameSpecification.md` in place as a shorter, more logically ordered rules spec.
- Moved Blockly workspace content into `docs/subsystems/blockly-workspace.md`.
- Moved the old Section 9 placeholder into `docs/development/future-directions-analysis/fun-factor-enhancements.md`.
- Kept the spec readable as a current rules document, not a versioned changelog.

## Rule Preservation Working List
- [x] Overview and learning intent from the original opening paragraphs -> `docs/GameSpecification.md`
- [x] Learning objectives and classroom strategy goals -> `docs/GameSpecification.md`
- [x] Board setup: fixed grid, opposite sides, team identity, forward direction, free-play randomization, spawn positions, team sizes, starter flags, tabletop tokens, base areas, board immutability, and round resets -> `docs/GameSpecification.md`
- [x] Jail description rewritten to match runtime truth as a visual/designated cell type rather than a separate movement blocker -> `docs/GameSpecification.md`
- [x] Runner rules: team membership, control modes, frozen state, jump availability, barrier availability, and shared ally-program coordination -> `docs/GameSpecification.md`
- [x] Flag rules: one flag per team, carried-flag state, home/base behavior, and scoring eligibility -> `docs/GameSpecification.md`
- [x] Barrier rules: one active barrier per runner, direct-forward removal, temporary map-shaping, and placement/resource restoration -> `docs/GameSpecification.md`
- [x] Special-action rules: Area Freeze as the only special action, team-wide readiness, and team-wide resource timing -> `docs/GameSpecification.md`
- [x] Turn structure: one runner at a time, frozen skips, action choice, and deterministic runner sequencing -> `docs/GameSpecification.md`
- [x] Blockly workspace execution model: first reachable action only, later sequential actions ignored, and block inventory context -> `docs/subsystems/blockly-workspace.md`
- [x] Movement legality: off-board, wall, barrier, home-flag-at-base, friendly-active-runner, and frozen-opposing-runner outcomes -> `docs/GameSpecification.md`
- [x] Collision legality and priority: active opposing runner target cells create immediate collisions, with flag-carrier priority preserved -> `docs/GameSpecification.md`
- [x] Jump Forward legality: same landing-cell rules as movement, intermediate cell ignored, jump resource consumed when attempted -> `docs/GameSpecification.md`
- [x] Place Barrier legality: directly forward only, resource required, and target cell must be clear and on-board -> `docs/GameSpecification.md`
- [x] Stay Still legality: may remove the barrier directly in front and restore that barrier owner's placement resource -> `docs/GameSpecification.md`
- [x] Enemy-flag pickup rule when a runner ends movement on the enemy flag cell and the flag is not already carried -> `docs/GameSpecification.md`
- [x] Collision resolution: map-side defender, carrier priority, loser freeze, flag return, origin-cell reset, and winner hold on the collision cell -> `docs/GameSpecification.md`
- [x] Area Freeze timing, radius, frozen duration, and shared cooldown -> `docs/GameSpecification.md`
- [x] Scoring and win conditions: base-area scoring, round reset, threshold win, and authored pass/fail compatibility -> `docs/GameSpecification.md`
- [x] Configurable parameters: board, team size, points to win, collision freeze duration, Area Freeze settings, and side randomization -> `docs/GameSpecification.md`
- [x] Levels section: campaign inventory and links to the concept matrix plus student guide -> `docs/GameSpecification.md`
- [x] Modes of play: PvNPC, Hot-Seat, Free-Play PvP, and Free-Play PvCPU variants -> `docs/GameSpecification.md`
- [x] Old Section 9 placeholder moved out as a minimal future-directions note rather than kept as versioned prose -> `docs/development/future-directions-analysis/fun-factor-enhancements.md`

## Removed Obsolete Wording
- [x] Removed the negative-feature trap callout because the packet asked for current-game rules only.
- [x] Reworded the jail line so it now matches runtime truth as a designated visual cell type.

## Board Game Test Walkthrough
1. I set up a notional guided match using only the rewritten spec and checked the rules in this order:
   - board and setup from the setup section
   - runner, flag, barrier, and freeze definitions from the entity and action sections
   - turn order and first-action-only behavior from the turn section and Blockly workspace note
   - movement legality and jump legality from the actions section
   - collision priority from the collision section
   - flag pickup and scoring from the actions and scoring sections
   - round reset from the scoring section
2. Team 1 starts on the left, Team 2 on the right, with flags in their own bases and jails shown as designated cells.
3. Team 1 takes its turn with an `On Each Turn` program whose first reachable action is `Move Toward Enemy Flag`.
4. The runner crosses the map legally, reaches the enemy flag, and picks it up.
5. Team 2 replies on its next turn; if a collision happens, the collision section decides the loser before scoring is considered.
6. Team 1 returns the carrier to its own base.
7. The scoring section awards Team 1 a point, then the round resets: flags return home, runners return to their start states, and the match is ready for the next round.
8. This walkthrough confirmed that the restructured spec still reaches the full play loop without relying on the old Section 6/Section 9 layout.

## Validation
- `rg "GameSpecification" --no-heading`
  - Returned the expected active path references and archived packet references.
- PowerShell line counts:
  - `docs/GameSpecification.md`: 226 lines
  - `docs/subsystems/blockly-workspace.md`: 165 lines
  - `docs/development/future-directions-analysis/fun-factor-enhancements.md`: 4 lines
- Banned-phrase search on the edited docs:
  - No matches for the packet's banned wording list.

## Notes
- I did not edit source code, tests, level data, architecture docs, or the teacher/student guides.
- The “Fun Factor” move is preserved as a tiny future-directions note because the live spec only contained a placeholder and no substantive content to preserve.
