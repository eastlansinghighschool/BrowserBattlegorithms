# Guided Level Dossier: Level 14: Jump the Gap

## Level Identity
- order: 15
- id: `jump-the-gap`
- title: Level 14: Jump the Gap
- category: ordinary
- level kind: not found
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js`
- project: not applicable

## Curriculum Row
- focus: Jump the gap
- new vocabulary: jump lane / landing
- new Blockly: Jump Forward
- assumptions: movement basics

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
- objective: Use Jump Forward as the one decisive action that clears a wall and lands on the goal side.
- intro: This lesson is about a single leap. One Jump Forward should carry the ally over the wall and into the winning lane.
- tips:
  - Jump Forward only goes forward.
  - There is no backward jump in this game.
  - The landing space still needs to be open.
  - This level is about noticing what one jump can do, not writing a long program.
- tutorial steps:
  - 1. Jump Is A One-Time Leap (level-14-jump)
    - body: Jump Forward moves two cells ahead and ignores the space in between, but you only get one jump each round. For this lesson, a single jump block is enough.
    - demo Blockly: not found
  - 2. No Backward Jump (level-14-no-backward-jump)
    - body: This game only supports jumping forward. The wall blocks the whole column, so the dramatic move here is to leap straight across it.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":3,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (3, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (3, 4)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: (2, 0) owner level_jump_barrier_1; (2, 1) owner level_jump_barrier_2; (2, 2) owner level_jump_barrier_3; (2, 3) owner level_jump_barrier_4; (2, 4) owner level_jump_barrier_5; (2, 5) owner level_jump_barrier_6; (2, 6) owner level_jump_barrier_7; (2, 7) owner level_jump_barrier_8

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
- authored toolbox block types: 6
- action: 6
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/jump-the-gap.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_jump_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Jump the gap
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 6 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level jump-the-gap --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/jump-the-gap.xml
