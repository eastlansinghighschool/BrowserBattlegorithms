# Guided Level Dossier: Level 9: Find the Enemy Flag

## Level Identity
- order: 10
- id: `find-the-enemy-flag`
- title: Level 9: Find the Enemy Flag
- category: ordinary
- level kind: not found
- phase: sensing
- source file: `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js`
- project: not applicable

## Curriculum Row
- focus: Find the enemy flag
- new vocabulary: sensing can point at goals
- new Blockly: same sensor on a new target
- assumptions: Level 8

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
- objective: Use directional sensing to guide the ally to the enemy flag.
- intro: The same sensing pattern can point at goals like the enemy flag, not just runners.
- tips:
  - This time the target is the enemy flag instead of the human runner.
  - The relation dropdown still describes the flag's position relative to the ally.
  - Notice how the same sensor idea can shift from runners to goals.
- tutorial steps:
  - 1. Sense The Flag's Position (level-9-flag-sensor)
    - body: The sensor block can also look for the enemy flag. Use the same forward, behind, above, and below ideas to steer toward it.
    - demo Blockly: not found
  - 2. Reusable Thinking (level-9-reuse)
    - body: You are reusing the same condition pattern on a different object. That is a big step toward more flexible programs.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- objective: runner runner_1_AI_AllyP1 reaches enemy flag at (10, 3)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (10, 3)
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
- source: `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/find-the-enemy-flag.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_sensor_matches_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Find the enemy flag
- starter XML contains 1 blocks
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level find-the-enemy-flag --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/find-the-enemy-flag.xml
