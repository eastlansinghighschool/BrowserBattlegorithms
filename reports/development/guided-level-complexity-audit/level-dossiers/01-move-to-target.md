# Guided Level Dossier: Level 1: Move to Target

## Level Identity
- order: 1
- id: `move-to-target`
- title: Level 1: Move to Target
- category: ordinary
- level kind: not found
- phase: foundations
- source file: `src/config/levels/phases/foundations/level-01-move-to-target.js`
- project: not applicable

## Curriculum Row
- focus: Move to target
- new vocabulary: ally runner, enemy runner, target, frozen
- new Blockly: On Each Turn + one move
- assumptions: none

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
- objective: Guide your ally runner to the highlighted target square.
- intro: This first level is a quiet practice board. Your block program controls the ally runner, and the other runners stay still so you can focus on one simple goal.
- tips:
  - Only the ally runner needs to reach the target.
  - Your program runs each time the ally gets a turn.
  - If you ever want the lesson again, use Show Tutorial.
- tutorial steps:
  - 1. Meet The Board (level-1-board)
    - body: The board is a grid of spaces. Your ally runner starts on the left, the enemy runners are on the right, and the highlighted square is today’s goal.
    - demo Blockly: not found
  - 2. Frozen Means Staying Still (level-1-frozen)
    - body: In this lesson, the enemy runners are frozen. That simply means they will not move while you practice the basics.
    - demo Blockly: not found
  - 3. Start With On Each Turn (level-1-event)
    - body: Every ally program begins with the On Each Turn block. Any blocks connected below it will run each time your ally takes a turn. The goal square is waiting — what would you tell the ally to do?
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":4,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (4, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (4, 4)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 1); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 4
- action: 4
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/foundations/level-01-move-to-target.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/move-to-target.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Move to target
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 4 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level move-to-target --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/move-to-target.xml
