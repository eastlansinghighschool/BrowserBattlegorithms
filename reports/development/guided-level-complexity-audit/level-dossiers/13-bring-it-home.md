# Guided Level Dossier: Level 12: Bring It Home

## Level Identity
- order: 13
- id: `bring-it-home`
- title: Level 12: Bring It Home
- category: ordinary
- level kind: not found
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`
- project: not applicable

## Curriculum Row
- focus: Bring it home
- new vocabulary: helper target swap
- new Blockly: helper + flag condition
- assumptions: Levels 3 and 11

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
- objective: Use Move Toward for the trip out and the trip back.
- intro: The helper block now has two jobs: head toward the enemy flag first, then turn back toward home after pickup.
- tips:
  - Think about how the target should change after pickup.
  - Move Toward enemy flag works on the way out, even when the route needs both horizontal and vertical steps.
  - Move Toward my base works on the way home.
- tutorial steps:
  - 1. One Helper, Two Targets (level-12-two-targets)
    - body: This helper block can point at different goals. Here the ally should chase the enemy flag first and then head for home.
    - demo Blockly: present
  - 2. Switch Targets After Pickup (level-12-switch)
    - body: The If I Have Enemy Flag condition is the bridge that tells the ally when to stop chasing the flag and start going home.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- objective: team 1 scores a point with runner_1_AI_AllyP1
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: none
- jail cells: none
- flags: opponent: (10, 3)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 6); control ally; frozen no; enemy flag no
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
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
- aggregate distinct block types: 4 types: `battlegorithms_if_can_jump_else`, `battlegorithms_move_down_screen`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: One Helper, Two Targets
  - source: `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
  - distinct block types: 4 types: `battlegorithms_if_can_jump_else`, `battlegorithms_move_down_screen`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/bring-it-home.xml`
- present: yes
- metrics: blocks 4; distinct types 3; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 3 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Bring it home
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 8 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level bring-it-home --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/bring-it-home.xml
