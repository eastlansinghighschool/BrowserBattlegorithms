# Guided Level Dossier: Optional Lab: Code Inversion

## Level Identity
- order: 47
- id: `optional-inversion-lab`
- title: Optional Lab: Code Inversion
- category: prediction
- level kind: prediction
- phase: optional
- source file: `src/config/levels/phases/optional/level-40-optional-inversion-lab.js`
- project: not applicable

## Curriculum Row
- focus: code-to-board reasoning
- new vocabulary: predict which board setup satisfies a locked program
- new Blockly: inversion checkpoint; no new Blockly idea
- assumptions: IF/ELSE, square-ahead-blocked sensing

## Tags / Signals
- category: prediction
- run mode: prediction checkpoint
- project id: not applicable
- challenge: no
- prediction: yes
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Read the locked program and choose which board setup lets it succeed.
- intro: Read the locked program below. The ally must reach the target at (2, 4). Predict which board setup allows this program to reach the goal!
- tips: not found
- tutorial steps:
  - 1. Read the Program First (inversion-40-intro)
    - body: Trace the IF condition on candidate boards. Select which board setup lets the ally make progress, then start the level to compare.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":2,"y":4},"actionTypes":["MOVE_FORWARD"]}
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
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- status: not found

## XML Facts
### Starter XML
- source: `src/config/levels/phases/optional/level-40-optional-inversion-lab.js`
- present: yes
- metrics: blocks 5; distinct types 5; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 5 types: `battlegorithms_boolean_square_ahead_blocked`, `battlegorithms_if_boolean_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/optional-inversion-lab.xml`
- present: yes
- metrics: blocks 5; distinct types 5; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 5 types: `battlegorithms_boolean_square_ahead_blocked`, `battlegorithms_if_boolean_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- prediction checkpoint
- optional lab
- concept focus present: code-to-board reasoning
- starter XML contains 5 blocks
- reference XML contains 5 blocks

## Validation Pointers
- Readiness command: npm run level:readiness -- --level optional-inversion-lab --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/optional-inversion-lab.xml
