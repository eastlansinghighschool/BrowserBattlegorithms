# Guided Level Dossier: Bug Hunt: Flag Phase

## Level Identity
- order: 16
- id: `bughunt-15`
- title: Bug Hunt: Flag Phase
- category: bug hunt
- level kind: bug_hunt
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- project: not applicable

## Curriculum Row
- focus: Trace the flag bug
- new vocabulary: debugging checkpoint; reversed flag branch
- new Blockly: repair if_have_enemy_flag_else target order
- assumptions: Levels 1-14

## Tags / Signals
- category: bug hunt
- run mode: bug hunt
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: yes
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Trace the first action and repair the flag-phase bug before the lane turns into a full challenge.
- intro: This starter is almost right, but one branch is reversed. Read the first action carefully, then repair the flag switch so the ally chooses the right target at the right time.
- tips:
  - Only the first reached action runs on a turn, so start by checking the very top of the program.
  - When the ally has the enemy flag, the return-home branch should take over.
  - If the wrong branch runs first, the rest of the turn never gets a chance.
- tutorial steps:
  - 1. Trace The First Branch (bughunt-15-trace)
    - body: The starter is intentionally wrong. Trace the very first decision and ask whether the ally is headed toward the flag or back home when it should be doing the opposite.
    - demo Blockly: not found
  - 2. Repair The Flag Phase (bughunt-15-fix)
    - body: This is a debugging level, not a blank slate. Keep the same shape, but fix the reversed target so the ally can switch cleanly between the two phases.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- objective: team 1 scores a point with runner_1_AI_AllyP1
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: none
- jail cells: none
- flags: opponent: (10, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (7, 3); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_STAY_STILL
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (8, 6); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_RANDOM_MOVE_ONLY

## Toolbox Facts
- authored toolbox block types: 11
- action: 7
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 4
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- present: yes
- metrics: blocks 4; distinct types 3; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 3 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml`
- present: yes
- metrics: blocks 8; distinct types 5; actions 4; conditions 3; boolean/comparison/value 0; max depth 5; decision points 3; runner index 0; resource readiness 0
- distinct block types: 5 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches_else`, `battlegorithms_jump_forward`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- bug hunt checkpoint
- concept focus present: Trace the flag bug
- starter XML contains 4 blocks
- reference XML contains 8 blocks
- toolbox exposes 11 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level bughunt-15 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml
