# Guided Level Dossier: Level 11: Shortcut Block - Move Toward the Flag

## Level Identity
- order: 12
- id: `move-toward-flag`
- title: Level 11: Shortcut Block - Move Toward the Flag
- category: ordinary
- level kind: not found
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`
- project: not applicable

## Curriculum Row
- focus: Move Toward flag
- new vocabulary: helper target
- new Blockly: Move Toward enemy flag
- assumptions: Levels 1-9

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
- objective: Use the Move Toward helper block to take one smart step toward the enemy flag.
- intro: Move Toward is a shortcut block. It chooses one step toward a target, but it does not magically find a full path.
- tips:
  - This helper chooses one move each turn, not a whole route.
  - It works best on open maps and simple corridors.
  - You can still compare it with the regular movement blocks.
- tutorial steps:
  - 1. Meet Move Toward (level-11-helper)
    - body: This block takes one step toward the target you choose. Here the only target is the enemy flag.
    - demo Blockly: not found
  - 2. It Is A Helper, Not Magic (level-11-not-pathfinding)
    - body: Move Toward is useful on open maps like this one. Later you will learn when helper moves work well and when you need more detailed logic.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- objective: runner runner_1_AI_AllyP1 reaches enemy flag at (11, 3)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (11, 3)
- wall cells: none
- jail cells: none
- flags: opponent: (11, 3)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 6); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 1); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 6
- action: 6
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/move-toward-flag.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Move Toward flag
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 6 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level move-toward-flag --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/move-toward-flag.xml
