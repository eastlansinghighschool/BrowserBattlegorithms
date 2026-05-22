# Guided Level Dossier: Level 8: Find the Human

## Level Identity
- order: 9
- id: `find-the-human`
- title: Level 8: Find the Human
- category: ordinary
- level kind: not found
- phase: sensing
- source file: `src/config/levels/phases/sensing/level-08-find-the-human.js`
- project: not applicable

## Curriculum Row
- focus: Find the human
- new vocabulary: support square near teammate; directional sensing with above/below analogs on the same board axis
- new Blockly: directional sensing
- assumptions: Levels 6-7

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
- objective: Use directional sensing to move the ally toward the human runner.
- intro: Now the sensor can describe where something is on the board, not just whether it is immediately in front.
- tips:
  - Use the human runner as the sensed object.
  - The highlighted support square next to the human is the goal, not the occupied human cell.
  - Think about how you would describe the human’s position from the ally’s point of view.
  - You may need more than one check to guide the ally to the support square.
- tutorial steps:
  - 1. Use A Sensor To Find The Human (level-8-human)
    - body: The sensor block can now look for the human runner and describe whether that runner is forward, behind, above, or below. Your goal is to guide the ally to the marked support square beside the human.
    - demo Blockly: present
  - 2. Forward And Above Are Different Ideas (level-8-axes)
    - body: Forward and behind use the ally's play direction. Above and below still use the screen.
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
- barriers: (6, 1) owner level_find_human_barrier_1; (7, 2) owner level_find_human_barrier_2; (6, 3) owner level_find_human_barrier_3

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (6, 2); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 5); control ally; frozen no; enemy flag no
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
- source: `src/config/levels/phases/sensing/level-08-find-the-human.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`
- demo 1: Tutorial step 1: Use A Sensor To Find The Human
  - source: `src/config/levels/phases/sensing/level-08-find-the-human.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/find-the-human.xml`
- present: yes
- metrics: blocks 6; distinct types 5; actions 3; conditions 2; boolean/comparison/value 0; max depth 4; decision points 2; runner index 0; resource readiness 0
- distinct block types: 5 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_down_screen`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Find the human
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 6 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level find-the-human --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/find-the-human.xml
