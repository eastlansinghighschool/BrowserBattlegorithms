# Guided Level Dossier: Challenge 22: Show What You Know

## Level Identity
- order: 25
- id: `show-what-you-know`
- title: Challenge 22: Show What You Know
- category: challenge
- level kind: challenge
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- project: not applicable

## Curriculum Row
- focus: Show What You Know
- new vocabulary: live scrimmage; open goal
- new Blockly: none - synthesis only
- assumptions: Levels 1-22

## Tags / Signals
- category: challenge
- run mode: challenge
- project id: not applicable
- challenge: yes
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Score a point against live defenders using any tool you have learned so far.
- intro: No new tools this time. Two enemies are active. Use what you know to score.
- tips:
  - You have movement, sensing, flag state, helper blocks, barriers, jumping, and freeze.
  - There is more than one way to win — experiment with what you have.
  - Freeze is a team power that can give you a window to act.
- tutorial steps:
  - 1. No New Tools (show-what-you-know-challenge)
    - body: This level does not introduce anything new. Two enemies are active and you need to score a point — use any combination of what you have already learned.
    - demo Blockly: not found
  - 2. Think Like A Programmer (show-what-you-know-strategy)
    - body: There is no single right program. Think about what conditions matter, what actions respond to them, and what your ally should do when the situation changes.
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
- flags: opponent: (11, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (7, 2); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_VERTICAL_PATROL
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (8, 4); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_STAY_STILL
- opponent runner 2 (runner_2_Npc3) slot npc 2 at (9, 7); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_VERTICAL_PATROL

## Toolbox Facts
- authored toolbox block types: 25
- action: 9
  - Freeze Opponents (`battlegorithms_freeze_opponents`)
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Place Barrier (in front) (`battlegorithms_place_barrier`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 16
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready_else`)
  - If Barrier Is In Front (`battlegorithms_if_barrier_in_front`)
  - If Barrier Is In Front (`battlegorithms_if_barrier_in_front_else`)
  - If I Am On Enemy Side (`battlegorithms_if_on_enemy_side`)
  - If I Am On Enemy Side (`battlegorithms_if_on_enemy_side_else`)
  - If I Am On My Side (`battlegorithms_if_on_my_side`)
  - If I Am On My Side (`battlegorithms_if_on_my_side_else`)
  - If I Can Jump (`battlegorithms_if_can_jump`)
  - If I Can Jump (`battlegorithms_if_can_jump_else`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier_else`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
- present: yes
- metrics: blocks 14; distinct types 10; actions 7; conditions 6; boolean/comparison/value 0; max depth 6; decision points 6; runner index 0; resource readiness 2
- distinct block types: 10 types: `battlegorithms_freeze_opponents`, `battlegorithms_if_area_freeze_ready_else`, `battlegorithms_if_can_jump_else`, `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches`, `battlegorithms_jump_forward`, `battlegorithms_move_down_screen`, `battlegorithms_move_toward`, ...
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Show What You Know
- starter XML contains 1 blocks
- reference XML contains 14 blocks
- toolbox exposes 25 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level show-what-you-know --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml
