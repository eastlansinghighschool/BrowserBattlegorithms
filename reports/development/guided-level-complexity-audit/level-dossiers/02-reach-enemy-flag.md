# Guided Level Dossier: Level 2: Reach Enemy Flag

## Level Identity
- order: 2
- id: `reach-enemy-flag`
- title: Level 2: Reach Enemy Flag
- category: ordinary
- level kind: not found
- phase: foundations
- source file: `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js`
- project: not applicable

## Curriculum Row
- focus: Reach enemy flag
- new vocabulary: flag, enemy side; ally starts past the flag
- new Blockly: backward move is load-bearing
- assumptions: Level 1 board vocabulary

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
- objective: Start thinking of the enemy flag as your goal.
- intro: Your ally needs to reach the enemy flag, not just a target square.
- tips:
  - A flag marks each team’s side of the field.
  - Move Backward moves in the opposite direction of forward — that might be exactly what this board needs.
  - You still only get one action from the program each ally turn.
- tutorial steps:
  - 1. New Goal: Reach The Enemy Flag (level-2-goal)
    - body: This time the goal is the enemy flag on the right side of the board instead of a practice target square.
    - demo Blockly: not found
  - 2. A New Move Is Available (level-2-new-block)
    - body: Move Backward moves the ally in the opposite direction of forward. Look at where your ally starts and where the flag is — sometimes the goal is behind you.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- objective: runner runner_1_AI_AllyP1 reaches enemy flag at (10, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (10, 4)
- wall cells: none
- jail cells: none
- flags: opponent: (10, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (11, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 5
- action: 5
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/reach-enemy-flag.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_backward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Reach enemy flag
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 5 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level reach-enemy-flag --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/reach-enemy-flag.xml
