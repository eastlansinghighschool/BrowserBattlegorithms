# Guided Level Dossier: Level 24: How Far Away?

## Level Identity
- order: 27
- id: `how-far-away`
- title: Level 24: How Far Away?
- category: project
- level kind: not found
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
- project: `strategy-brain step 2`

## Curriculum Row
- focus: How far away?
- new vocabulary: distance as numeric value; barrier and enemy force a detour
- new Blockly: numeric compare
- assumptions: Level 13 distance idea

## Tags / Signals
- category: project
- run mode: project strategy-brain
- project id: strategy-brain
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: yes
- reference XML present: no
- project fixture XML present: yes

## Lesson Copy
- objective: Use a number comparison with distance to closest enemy.
- intro: The Strategy Brain now measures distance to the closest enemy as a number. Compare that value to a threshold and move up when the defender is at or more than a certain distance to move in a diagonal pattern.
- tips: not found
- tutorial steps:
  - 1. Distance Is A Number Now (level-24-distance)
    - body: The new compare piece turns distance into a number you can check with <, <=, >, and the other operator choices. This level is where range becomes part of the strategy.
    - demo Blockly: present
  - 2. Choose A Move By Range (level-24-compare)
    - body: The barrier and defender make the direct lane unreliable. Use the distance value to decide when the ally should break off and turn upward.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":2}}
- objective: runner runner_1_AI_AllyP1 reaches (5, 2)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (5, 2)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: (4, 4) owner strategy_brain_distance_barrier

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (6, 4); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 33
- action: 7
  - Freeze Opponents (`battlegorithms_freeze_opponents`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- boolean/logic: 11
  - and (`battlegorithms_logic_and`)
  - Area Freeze is ready (`battlegorithms_boolean_area_freeze_ready`)
  - I am on enemy side (`battlegorithms_boolean_on_enemy_side`)
  - I am on my side (`battlegorithms_boolean_on_my_side`)
  - I can jump (`battlegorithms_boolean_can_jump`)
  - I can place barrier (`battlegorithms_boolean_can_place_barrier`)
  - I have enemy flag (`battlegorithms_boolean_have_enemy_flag`)
  - not (`battlegorithms_logic_not`)
  - or (`battlegorithms_logic_or`)
  - sensor (`battlegorithms_boolean_sensor_matches`)
  - teammate has enemy flag (`battlegorithms_boolean_teammate_has_flag`)
- condition: 8
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If [boolean] (`battlegorithms_if_boolean`)
  - If [boolean] else (`battlegorithms_if_boolean_else`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready_else`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)
- value: 7
  - compare (`battlegorithms_value_compare`)
  - count of (`battlegorithms_value_count_within`)
  - distance to (`battlegorithms_value_distance_to_target`)
  - my runner index (`battlegorithms_value_runner_index`)
  - number (`battlegorithms_value_number`)
  - playDirection value (`battlegorithms_value_play_direction`)
  - random roll (1-6) (`battlegorithms_value_random_roll`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 5; distinct types 5; actions 2; conditions 1; boolean/comparison/value 1; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 5 types: `battlegorithms_boolean_sensor_matches`, `battlegorithms_if_boolean_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: Distance Is A Number Now
  - source: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
  - metrics: blocks 5; distinct types 5; actions 2; conditions 1; boolean/comparison/value 1; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 5 types: `battlegorithms_boolean_sensor_matches`, `battlegorithms_if_boolean_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- status: not found
### Project XML Fixtures
- Project step fixture 2: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-02.xml`
  - metrics: blocks 7; distinct types 7; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 0; resource readiness 0
  - distinct block types: 7 types: `battlegorithms_if_boolean_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`, `battlegorithms_value_compare`, `battlegorithms_value_distance_to_target`, `battlegorithms_value_number`
- Project final fixture: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - metrics: blocks 6; distinct types 5; actions 3; conditions 2; boolean/comparison/value 0; max depth 4; decision points 2; runner index 0; resource readiness 0
  - distinct block types: 5 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_toward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`

## Facts Only
- shared workspace project strategy-brain step 2
- concept focus present: How far away?
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- project fixture XML present (2 files)
- toolbox exposes 33 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level how-far-away --json
- Linter command: npm run lint:levels
- Project step fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/step-02.xml
- Project final fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml
