# Guided Level Dossier: Level 7: Watch the Wall

## Level Identity
- order: 8
- id: `watch-the-wall`
- title: Level 7: Watch the Wall
- category: ordinary
- level kind: not found
- phase: sensing
- source file: `src/config/levels/phases/sensing/level-07-watch-the-wall.js`
- project: not applicable

## Curriculum Row
- focus: Watch the wall
- new vocabulary: edge / wall
- new Blockly: generic sensor reused on terrain
- assumptions: Level 6 sensor shape

## Tags / Signals
- category: ordinary
- run mode: ordinary
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Use the generic sensor to detect an edge or wall and steer around it.
- intro: The same sensor family can notice map walls too, not just placed barriers.
- tips:
  - Edge or wall is a beginner-friendly sensing target in this phase.
  - This map uses real wall cells instead of a temporary barrier.
  - You still only get one move each ally turn.
- tutorial steps:
  - 1. Walls Count Too (level-7-wall)
    - body: The Edge or Wall option can notice map geometry. Here, the ally needs to react to wall cells in the way.
    - demo Blockly: not found
  - 2. Relation Means How The Object Is Positioned (level-7-relation)
    - body: The relation dropdown tells the sensor what kind of position to check. This level uses directly in front.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `complex`
- map label: Complex
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":5}}
- objective: runner runner_1_AI_AllyP1 reaches (5, 5)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6)
- goal cell: (5, 5)
- wall cells: (4, 0), (5, 0), (4, 1), (5, 1), (8, 2), (3, 3), (7, 3), (8, 3), (3, 4), (7, 4), (8, 5), (4, 6), (5, 6), (4, 7), (5, 7)
- jail cells: (0, 7), (11, 7)
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (2, 3); control ally; frozen no; enemy flag no
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
- source: `src/config/levels/phases/sensing/level-07-watch-the-wall.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/watch-the-wall.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_down_screen`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Watch the wall
- starter XML contains 1 blocks
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level watch-the-wall --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/watch-the-wall.xml
