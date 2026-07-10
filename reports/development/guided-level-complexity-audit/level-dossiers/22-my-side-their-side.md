# Guided Level Dossier: Level 20: My Side, Their Side

## Level Identity
- order: 22
- id: `my-side-their-side`
- title: Level 20: My Side, Their Side
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
- project: not applicable

## Curriculum Row
- focus: My side, their side
- new vocabulary: field halves (my side introduced)
- new Blockly: territory conditions (my-side variants only)
- assumptions: board orientation

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
- objective: Use territory conditions so the ally changes behavior after crossing into the enemy half.
- intro: Some smart programs care about which side of the field they are on. This level teaches that field position can change what move makes sense.
- tips:
  - For Team 1, the left half is your side and the right half is the enemy side.
  - Try a plan that moves forward on your side and then changes behavior after crossing the middle.
  - This level is about territory awareness, not flag carrying yet.
- tutorial steps:
  - 1. The Field Has Sides (level-19-territory)
    - body: Your side and the enemy side are different spaces. Your program can check which half of the field the ally is in.
    - demo Blockly: not found
  - 2. Change Your Plan After Crossing (level-19-switch-sides)
    - body: The territory blocks let a program make different decisions depending on which half of the field the ally is in. Think about what move makes sense on your side, and what might make more sense once the ally crosses over.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- objective: runner runner_1_AI_AllyP1 reaches (6, 2)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (6, 2)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 6); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (8, 2); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_VERTICAL_PATROL
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
  - If I Am On My Side (`battlegorithms_if_on_my_side`)
  - If I Am On My Side (`battlegorithms_if_on_my_side_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_on_my_side_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: My side, their side
- starter XML contains 1 blocks
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level my-side-their-side --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml
