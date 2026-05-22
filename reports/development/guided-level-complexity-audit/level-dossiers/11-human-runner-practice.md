# Guided Level Dossier: Level 10: Human Runner Practice

## Level Identity
- order: 11
- id: `human-runner-practice`
- title: Level 10: Human Runner Practice
- category: ordinary
- level kind: not found
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`
- project: not applicable

## Curriculum Row
- focus: Human runner practice
- new vocabulary: keyboard control, special actions
- new Blockly: no new Blockly concept
- assumptions: beginner controls

## Tags / Signals
- category: ordinary
- run mode: human input
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: yes
- demo Blockly present: no
- reference XML present: no
- project fixture XML present: no

## Lesson Copy
- objective: Use the human runner controls, then reach the goal only after you use Jump or Place Barrier first.
- intro: This level is about you, not the ally program. Move the human runner with the keyboard and use Jump or Place Barrier before reaching the goal.
- tips:
  - Use W A S D to move the human runner on screen.
  - Press F to jump, B to place a barrier, and X to stay still.
  - The goal only counts after you have used Jump or Place Barrier first.
  - The program panel stays on screen, but this lesson is about direct player control.
- tutorial steps:
  - 1. Now You Control The Human Runner (level-10-human-focus)
    - body: This lesson pauses the ally idea for a moment so you can practice what the human runner does in the match.
    - demo Blockly: not found
  - 2. Keyboard Controls (level-10-human-keys)
    - body: Use W A S D to move. Press F to jump, B to place a barrier, and X to stay still. In free play, these human actions happen alongside your ally program.
    - demo Blockly: not found
  - 3. Try One Special Action First (level-10-human-special)
    - body: This challenge only passes if you reach the goal after you use Jump or Place Barrier first. Reaching the goal without one of those actions does not count yet.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_HumanP1","targetCell":{"x":4,"y":4},"actionTypes":["JUMP_FORWARD","PLACE_BARRIER_FORWARD"]}
- objective: not found
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: none
- jail cells: none
- flags: not found
- barriers: (2, 4) owner level_human_barrier_1

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 4); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 1); control ally; frozen yes; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
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
- source: `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- status: not found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Human runner practice
- starter XML contains 1 blocks
- toolbox exposes 4 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level human-runner-practice --json
- Linter command: npm run lint:levels
