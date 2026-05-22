# Guided Level Dossier: Level 18: Stay Still Can Do Something

## Level Identity
- order: 20
- id: `stay-still-can-do-something`
- title: Level 18: Stay Still Can Do Something
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
- project: not applicable

## Curriculum Row
- focus: Stay still can do something
- new vocabulary: clearing a barrier
- new Blockly: Stay Still as an action
- assumptions: barrier sensing

## Tags / Signals
- category: ordinary
- run mode: ordinary
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: yes
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Use Stay Still to remove a barrier that is directly in front of the ally.
- intro: Stay Still is not just a do-nothing block. When a barrier is in front, it can change the board by clearing that obstacle.
- tips:
  - If a barrier is directly in front, Stay Still removes it.
  - After the barrier is gone, the ally can continue moving.
  - This is a good level for combining sensing with a non-movement action.
- tutorial steps:
  - 1. Stay Still Can Change The Board (level-17-stay-still)
    - body: If a barrier is directly ahead, Stay Still removes it. This is one of the first times that not moving is the smart move.
    - demo Blockly: present
  - 2. Then Keep Going (level-17-after-removal)
    - body: Once the barrier is gone, the ally can go back to its normal path.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":4,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (4, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (4, 4)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: (2, 4) owner level_remove_barrier_1

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 7
- action: 5
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: Stay Still Can Change The Board
  - source: `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/stay-still-can-do-something.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Stay still can do something
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level stay-still-can-do-something --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/stay-still-can-do-something.xml
