# Guided Project Sequence Decisions

Date: 2026-05-12  
Status: authoritative Plan 08 decision record  
Applies to: Plans 09-14  

## Decision Summary

Browser Battlegorithms will add two shared-code guided projects in the late guided campaign:

- `strategy-brain`: a single-ally advanced logic project from L23 through L28.
- `team-strategy-script`: a multi-ally coordination project from L29 through L37.

Project levels use shared latest code by project id. Navigating forward or backward inside a project loads the same latest project workspace. Project toolboxes are technically broad from the project start so later-step blocks remain editable when a student revisits an earlier project level. UI and lesson copy should focus student attention on the current concept without hiding blocks that the shared project code may already use.

## Approved Project Membership

### Strategy Brain

- Project id: `strategy-brain`
- Student-facing name: Strategy Brain
- Placement: after `show-what-you-know`
- Levels: L23-L28
- Capstone: L28 `full-team-tactics`
- Learning arc: students grow one single-ally decision program from target choice into distance comparisons, boolean composition, resource checks, and a final solo scoring challenge.

`show-what-you-know` remains a standalone gateway challenge before the project. It should be framed as "you are ready for the advanced layer," not as shared-code carryover.

### Team Strategy Script

- Project id: `team-strategy-script`
- Student-facing name: Team Strategy Script
- Placement: after `full-team-tactics`
- Levels: L29-L37
- Capstone: L37 `advanced-scrimmage`
- Learning arc: students grow one shared program that multiple allies execute independently, using runner index, teammate state, local sensing, resource readiness, and role assignment.

## Toolbox Policy

Project toolboxes are broad from the first project step. This is required by the approved backtracking behavior: if a student uses a later-step block and returns to an earlier project level, the carried code must remain visible, editable, and saveable.

### Strategy Brain Toolbox

Plan 11 should use a Strategy Brain toolbox that includes:

- `ADVANCED_ALL_BLOCKS`
- `MOVE_TOWARD_BLOCKS`
- `AREA_FREEZE_BLOCKS`
- `EXTENDED_MOVEMENT_BLOCKS`
- all `MOVE_TOWARD_TARGETS` needed by the project, including enemy flag, my base, and closest enemy

Plan 11 may add additional single-ally blocks if required to make L28 a fair capstone, but should avoid bloating the project with team-only tools.

### Team Strategy Script Toolbox

Plan 12 should use `ADVANCED_CAPSTONE_BLOCKS` from the project start.

By L29, students have already encountered the individual resource families. The team project is about composition, role assignment, and decentralized coordination, so all project code must remain editable throughout the arc.

## Persistence And Navigation Semantics

Plan 09 should implement these as fixed contracts:

- Non-project guided levels keep per-level guided workspace persistence.
- Each project has one shared latest workspace, keyed by project id.
- Suggested key pattern: `bba:guided-project-workspace:<projectId>`.
- Entering any level in a project loads that project workspace if it exists.
- If no project workspace exists, the project loads the level's starter XML, normally `STARTER_EVENT_XML`.
- Editing a project level saves to the project key, not to a per-level key.
- Going backward inside a project loads the shared latest project code.
- Going forward inside a project loads the shared latest project code.
- Leaving a project does not clear project code.
- Project workspaces do not leak into ordinary guided levels, Free Play, or other projects.
- `Reset Level` resets board/runtime state but preserves project code.
- A future version-history or project-reset design may add recovery/reset affordances, but ordinary level reset must not erase shared project work.

## UI And Student Framing

Plan 10 should implement project signifiers that are distinct from challenge signifiers:

- Level picker project badge/grouping for all project levels.
- One-time project-start callout near Blockly on L23 and L29.
- Quiet persistent project indicator on all project levels.
- Capstone levels inside projects can show both project and challenge/capstone framing.

Approved project-start message, adaptable for UI space:

> This icon means this level is part of a larger project. Changes will be saved across these levels.

Student-facing copy should emphasize:

- the same code will keep growing across project levels
- going back tests the latest project script on an earlier scenario
- each ally runs the same program independently
- runner index and local state allow allies to choose roles without central command

L32 needs persistent state framing because the lead ally starts with the flag. A student returning to L32 with later project code should be reminded that this board begins in a special carrier state.

## Required Curriculum Revisions

### L24 Repair

L24 `how-far-away` must be redesigned before classroom rollout. The distance comparison must become load-bearing or strongly necessary. The current board can be solved with simple movement and does not reliably teach the numeric comparison concept that later project steps assume.

This is a hard requirement for Plan 11.

### L28 Capstone Revision

L28 `full-team-tactics` is approved as the Strategy Brain capstone, but its current source was authored more like a pre-advanced single-ally toolbox challenge. Plan 11 must revise L28 so it truly pays off the Strategy Brain project:

- use the approved Strategy Brain toolbox or a compatible capstone superset
- frame it as the final test of the evolved Strategy Brain program
- keep it single-ally
- preserve its bridge role before team programming begins
- ensure its canonical solution and tests reflect advanced logic rather than only old statement-block tactics

### L34-L36 Specialist Levels

Keep `freeze-support`, `barrier-specialist`, and `jump-team` as separate Team Strategy Script steps for the first implementation. They should be playtested for repetition later.

Plan 12 may modestly loosen tight turn limits, especially L35 and L36, to give students room to iterate with an evolved shared script. A likely target is 10-12 turns, subject to source validation.

### L37 Capstone Revision

L37 `advanced-scrimmage` remains the Team Strategy Script capstone. Plan 12 and Plan 13 must repair it so it validates team strategy:

- replace the current minimal two-branch reference solution with a runner-index role-based team script
- prefer relaxing the capstone win condition so any ally can score for the team
- if ally 0 remains the required scorer, copy must explicitly teach that index 0 is the attacker role
- preserve the capstone goal of decentralized multi-ally coordination

## Testing Strategy

Plan 13 should use a hybrid test strategy:

- Keep independent reference solution coverage for one-off guided levels.
- Keep or create per-step/checkpoint project fixtures to show each project step is solvable at that point in the evolving script.
- Add cumulative project tests:
  - a final Strategy Brain project program should pass Strategy Brain steps
  - a final Team Strategy Script project program should pass Team Strategy Script steps
- Add or preserve browser tests for project workspace persistence:
  - forward navigation shares latest project code
  - backward navigation shares latest project code
  - ordinary guided levels remain isolated
  - projects do not leak into each other
  - Free Play remains isolated
  - reset level preserves project code
- Check live-enemy references for determinism or use seeded/repeated runs where needed.

Passing tests should prove both solvability and evolvability. They should not merely prove that a brittle minimal program can score by accident.

## Downstream Packet Contracts

Plans 09-14 must consume this document and `docs/development/project-level-map.md` as authoritative.

- Plan 09 implements metadata and shared latest workspace behavior only.
- Plan 10 implements project UI signifiers and student-facing shared-code framing.
- Plan 11 revises Strategy Brain levels, including L24 repair and L28 capstone revision.
- Plan 12 revises Team Strategy Script levels, including L37 capstone repair and specialist-level framing.
- Plan 13 implements hybrid project solution and test coverage.
- Plan 14 designs version history against the shared latest project model.

Later packets should not redefine project membership, project ids, toolbox policy, or shared-code semantics without integration-owner approval.

## Remaining Owner Decisions

These are not blockers for Plan 09, but should be decided before or during the relevant later packet:

- Exact final L24 board/setup repair.
- Exact L28 capstone board/setup and whether it needs a compatible toolbox superset beyond the base Strategy Brain toolbox.
- Exact L37 scoring rule: any ally can score is recommended, but owner approval should be confirmed during Plan 12.
- Exact turn-limit values for L35 and L36 after implementation testing.
- Whether both projects ship in the first classroom run or Project 2 is staged after Project 1 playtesting.
