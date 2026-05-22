# Guided Level Dossier: Level 6: Enemy Sensor Branch

## Level Identity
- order: 7
- id: `sensor-barrier-branch`
- title: Level 6: Enemy Sensor Branch
- category: ordinary
- level kind: not found
- phase: sensing
- source file: `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`
- project: not applicable

## Curriculum Row
- focus: Enemy sensor branch
- new vocabulary: generic sensor; enemy runner blocking a lane
- new Blockly: sensor object + relation dropdowns
- assumptions: Level 4 named check

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
- objective: Use the generic sensor block to detect an enemy directly in front and route around it.
- intro: The sensing system becomes more flexible here. One sensor block shape can ask about different board objects — not just barriers.
- tips:
  - The generic sensor block has two dropdowns: what to look for, and how to describe its position.
  - An enemy is sitting in the lane ahead — you need to sense it and choose a different move.
  - Later levels will use this same block to sense flags, walls, and more.
- tutorial steps:
  - 1. One Block Shape, Many Sensor Ideas (level-6-generic-sensor)
    - body: In an earlier level you used a block that checked for a barrier specifically. This new sensor block works the same way — but the dropdowns let you describe other objects and positions too. The demo below shows it checking for a barrier; your level needs you to check for something else.
    - demo Blockly: present
  - 2. Route Around The Enemy (level-6-barrier)
    - body: An enemy runner is frozen in the lane ahead. Sense it directly in front and step up to go around — then resume forward progress once you are past it.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":3}}
- objective: runner runner_1_AI_AllyP1 reaches (6, 3)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (6, 3)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (4, 4); control npc; frozen yes; enemy flag no
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
- source: `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: One Block Shape, Many Sensor Ideas
  - source: `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/sensor-barrier-branch.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Enemy sensor branch
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level sensor-barrier-branch --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/sensor-barrier-branch.xml
