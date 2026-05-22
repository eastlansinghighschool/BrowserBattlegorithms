# Guided Level Dossier: Prediction: Two Truths

## Level Identity
- order: 31
- id: `prediction-25`
- title: Prediction: Two Truths
- category: prediction
- level kind: prediction
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js`
- project: not applicable

## Curriculum Row
- focus: Boolean prediction
- new vocabulary: commit to whether the AND branch is true
- new Blockly: prediction checkpoint; no new Blockly idea
- assumptions: Levels 25-27

## Tags / Signals
- category: prediction
- run mode: prediction checkpoint
- project id: not applicable
- challenge: no
- prediction: yes
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Predict whether the AND branch runs before you observe the result.
- intro: The starter program checks two truths at once. Pick whether the branch is true, then run it and compare the outcome.
- tips: not found
- tutorial steps:
  - 1. Trace Both Halves (prediction-25-intro)
    - body: The AND block only returns true when both inputs are true. Read the board, choose your answer, and then run to check the branch.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":1,"y":4},"actionTypes":["MOVE_BACKWARD"]}
- objective: not found
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (2, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (3, 4); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 25
- action: 5
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
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
- condition: 2
  - If [boolean] (`battlegorithms_if_boolean`)
  - If [boolean] else (`battlegorithms_if_boolean_else`)
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
- source: `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js`
- present: yes
- metrics: blocks 7; distinct types 6; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 0; resource readiness 0
- distinct block types: 6 types: `battlegorithms_boolean_sensor_matches`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_and`, `battlegorithms_move_backward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/prediction-25.xml`
- present: yes
- metrics: blocks 7; distinct types 6; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 0; resource readiness 0
- distinct block types: 6 types: `battlegorithms_boolean_sensor_matches`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_and`, `battlegorithms_move_backward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- prediction checkpoint
- concept focus present: Boolean prediction
- starter XML contains 7 blocks
- reference XML contains 7 blocks
- toolbox exposes 25 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level prediction-25 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/prediction-25.xml
