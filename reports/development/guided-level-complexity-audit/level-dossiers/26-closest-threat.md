# Guided Level Dossier: Level 23: Closest Threat

## Level Identity
- order: 26
- id: `closest-threat`
- title: Level 23: Closest Threat
- category: project
- level kind: not found
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`
- project: `strategy-brain step 1`

## Curriculum Row
- focus: Closest threat
- new vocabulary: Strategy Brain start; intercept the nearest enemy
- new Blockly: Move Toward closest enemy
- assumptions: helper target idea

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
- objective: Start the Strategy Brain by using Move Toward on the closest enemy.
- intro: This is the first step of your shared Strategy Brain. It learns to track the closest threat and begin a project-sized response.
- tips: not found
- tutorial steps:
  - 1. A New Set Of Tools (level-21-advanced-layer)
    - body: This first project level introduces the Strategy Brain. The toolbox is broader now because later steps will add numbers and boolean choices; for the moment, focus on how Move Toward can track the nearest threat.
    - demo Blockly: not found
  - 2. A New Move Toward Target (level-21-target)
    - body: Closest enemy picks the nearest active opponent and steps toward them. Your shared program starts by deciding who matters most.
    - demo Blockly: not found
  - 3. Intercept The Runner (level-21-board)
    - body: This step is about tracking a threat, not chasing a flag. Watch how the target sits off the main lane and ask where the strategy should bend.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":3}}
- objective: runner runner_1_AI_AllyP1 reaches (5, 3)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (5, 3)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (2, 5); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (5, 2); control npc; frozen yes; enemy flag no
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
- source: `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- status: not found
### Project XML Fixtures
- Project step fixture 1: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-01.xml`
  - metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
  - distinct block types: 2 types: `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- Project final fixture: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - metrics: blocks 6; distinct types 5; actions 3; conditions 2; boolean/comparison/value 0; max depth 4; decision points 2; runner index 0; resource readiness 0
  - distinct block types: 5 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_toward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`

## Facts Only
- shared workspace project strategy-brain step 1
- concept focus present: Closest threat
- starter XML contains 1 blocks
- project fixture XML present (2 files)
- toolbox exposes 33 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level closest-threat --json
- Linter command: npm run lint:levels
- Project step fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/step-01.xml
- Project final fixture: tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml
