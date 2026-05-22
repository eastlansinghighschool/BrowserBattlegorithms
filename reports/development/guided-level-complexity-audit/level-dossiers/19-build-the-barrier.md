# Guided Level Dossier: Level 17: Build the Barrier

## Level Identity
- order: 19
- id: `build-the-barrier`
- title: Level 17: Build the Barrier
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js`
- project: not applicable

## Curriculum Row
- focus: Build the barrier
- new vocabulary: barrier placement target
- new Blockly: place barrier + readiness
- assumptions: Level 4 barrier idea

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
- objective: Place a barrier in front of the ally to learn how barrier placement works.
- intro: Barrier placement is another one-time resource. This level focuses on what the action does and when it is ready.
- tips:
  - A runner can only keep one active barrier on the map.
  - Place Barrier always targets the square directly in front.
  - The highlighted square shows where the barrier should appear.
- tutorial steps:
  - 1. Place A Barrier In Front (level-16-place-barrier)
    - body: This action creates a barrier in the square directly ahead of the runner if that space is open.
    - demo Blockly: not found
  - 2. Barrier Placement Has A Ready State (level-16-barrier-ready)
    - body: The If I Can Place Barrier condition helps the ally know whether that one-time action is still available.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"barrier_exists_at_cell","targetCell":{"x":4,"y":4}}
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
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (3, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 8
- action: 6
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Place Barrier (in front) (`battlegorithms_place_barrier`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/build-the-barrier.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_on_each_turn`, `battlegorithms_place_barrier`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Build the barrier
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 8 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level build-the-barrier --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/build-the-barrier.xml
