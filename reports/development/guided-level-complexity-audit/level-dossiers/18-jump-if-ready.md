# Guided Level Dossier: Level 16: Jump If Ready

## Level Identity
- order: 18
- id: `jump-if-ready`
- title: Level 16: Jump If Ready
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
- project: not applicable

## Curriculum Row
- focus: Jump if ready
- new vocabulary: one-time jump resource
- new Blockly: jump readiness condition
- assumptions: Level 14

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
- objective: Use a condition so the ally jumps once and then switches back to normal movement.
- intro: Conditions can check the runner's resources too. In this level, the ally should jump when it can and walk after the jump has been spent.
- tips:
  - Think about what should happen before the jump is spent and after it is gone.
  - After the jump is used, the condition changes and the else move takes over.
  - This is your first resource-aware lesson.
- tutorial steps:
  - 1. Your Program Can Check What Is Ready (level-15-ready)
    - body: The If I Can Jump condition changes based on whether the ally has already spent the jump resource this round. Think about how the ally should behave before the jump is gone, and how that should change after it has been used.
    - demo Blockly: present
  - 2. Resources Can Change During A Match (level-15-resource)
    - body: Jump is not permanent. This level teaches how to leap once and then keep walking after the jump resource is gone.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":8,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (8, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (8, 4)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: (6, 0) owner level_jump_ready_barrier_1; (6, 1) owner level_jump_ready_barrier_2; (6, 2) owner level_jump_ready_barrier_3; (6, 3) owner level_jump_ready_barrier_4; (6, 6) owner level_jump_ready_barrier_7; (6, 7) owner level_jump_ready_barrier_8

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (5, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (6, 5); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_CHARGER
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 8
- action: 6
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If I Can Jump (`battlegorithms_if_can_jump`)
  - If I Can Jump (`battlegorithms_if_can_jump_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_move_backward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: Your Program Can Check What Is Ready
  - source: `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_move_backward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
- distinct block types: 4 types: `battlegorithms_if_can_jump_else`, `battlegorithms_jump_forward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Jump if ready
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 8 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level jump-if-ready --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml
