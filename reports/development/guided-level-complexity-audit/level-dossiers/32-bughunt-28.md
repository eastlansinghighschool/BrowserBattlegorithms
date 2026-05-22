# Guided Level Dossier: Bug Hunt: Boolean Trap

## Level Identity
- order: 32
- id: `bughunt-28`
- title: Bug Hunt: Boolean Trap
- category: bug hunt
- level kind: bug_hunt
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`
- project: not applicable

## Curriculum Row
- focus: Trace the boolean
- new vocabulary: debugging checkpoint; boolean choice fires too early
- new Blockly: repair the boolean gate around freeze
- assumptions: Levels 1-27

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
- objective: A boolean operator is too eager, so the freeze fires before both facts are true.
- intro: This is a repair checkpoint for the Strategy Brain. The shape is almost right, but the boolean choice needs to wait for both truths at the same time.
- tips:
  - If a boolean uses OR where AND is needed, it can fire much too early.
  - Think about what should be true together before the freeze happens.
  - The bug is in the boolean choice, not in the rest of the pathing.
- tutorial steps:
  - 1. Trace The Boolean (bughunt-28-trace)
    - body: Read the condition piece by piece. The branch should wait until the ally is close enough and the freeze is still ready.
    - demo Blockly: not found
  - 2. Repair The Gate (bughunt-28-fix)
    - body: The starter is intentionally using the wrong boolean shape. Swap the operator so both facts have to be true before the special action runs.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- objective: runner runner_1_AI_AllyP1 reaches enemy flag at (11, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (11, 4)
- wall cells: none
- jail cells: none
- flags: opponent: (11, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (3, 4); control npc; frozen no; enemy flag no
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
- source: `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`
- present: yes
- metrics: blocks 9; distinct types 9; actions 2; conditions 1; boolean/comparison/value 5; max depth 5; decision points 3; runner index 0; resource readiness 1
- distinct block types: 9 types: `battlegorithms_boolean_area_freeze_ready`, `battlegorithms_freeze_opponents`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_or`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`, `battlegorithms_value_compare`, `battlegorithms_value_distance_to_target`, ...
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/bughunt-28.xml`
- present: yes
- metrics: blocks 9; distinct types 9; actions 2; conditions 1; boolean/comparison/value 5; max depth 5; decision points 3; runner index 0; resource readiness 1
- distinct block types: 9 types: `battlegorithms_boolean_area_freeze_ready`, `battlegorithms_freeze_opponents`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_and`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`, `battlegorithms_value_compare`, `battlegorithms_value_distance_to_target`, ...
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- bug hunt checkpoint
- concept focus present: Trace the boolean
- starter XML contains 9 blocks
- reference XML contains 9 blocks
- toolbox exposes 33 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level bughunt-28 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/bughunt-28.xml
