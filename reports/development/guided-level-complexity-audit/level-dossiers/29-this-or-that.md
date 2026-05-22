# Guided Level Dossier: Level 26: This Or That

## Level Identity
- order: 29
- id: `this-or-that`
- title: Level 26: This Or That
- category: project
- level kind: not found
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`
- project: `strategy-brain step 4`

## Curriculum Row
- focus: This or that
- new vocabulary: either warning matters
- new Blockly: OR
- assumptions: advanced value blocks

## Tags / Signals
- category: project
- run mode: project strategy-brain
- project id: strategy-brain
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: no
- project fixture XML present: yes

## Lesson Copy
- objective: Use OR to react when either danger condition becomes true.
- intro: This level has two danger checks: one for crossing into enemy territory, and one for an enemy runner nearby. OR lets either one trigger the same response.
- tips: not found
- tutorial steps:
  - 1. Either Warning Works (level-24-or)
    - body: OR is true when at least one of its inputs is true. That makes one branch react to two different kinds of danger without rewriting the whole program.
    - demo Blockly: not found
  - 2. Cross Then Turn (level-24-path)
    - body: Look at where the ally needs to go and what stands in the way. Think about when OR lets the Strategy Brain keep one rule for two situations.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `midfieldPressure`
- map label: Midfield Pressure
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- objective: runner runner_1_AI_AllyP1 reaches (6, 2)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (6, 2)
- wall cells: (4, 1), (5, 1), (7, 1), (8, 1), (4, 2), (8, 2), (6, 3), (5, 4), (4, 5), (8, 5), (4, 6), (5, 6), (7, 6), (8, 6)
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (6, 4); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
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
- source: `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- status: not found
### Project XML Fixtures
- Project step fixture 4: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-04.xml`
  - metrics: blocks 7; distinct types 7; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 0; resource readiness 0
  - distinct block types: 7 types: `battlegorithms_boolean_on_enemy_side`, `battlegorithms_boolean_sensor_matches`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_or`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- Project final fixture: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - metrics: blocks 6; distinct types 5; actions 3; conditions 2; boolean/comparison/value 0; max depth 4; decision points 2; runner index 0; resource readiness 0
  - distinct block types: 5 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_toward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`

## Facts Only
- shared workspace project strategy-brain step 4
- concept focus present: This or that
- starter XML contains 1 blocks
- project fixture XML present (2 files)
- toolbox exposes 33 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level this-or-that --json
- Linter command: npm run lint:levels
- Project step fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/step-04.xml
- Project final fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml
