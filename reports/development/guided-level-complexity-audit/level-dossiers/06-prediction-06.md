# Guided Level Dossier: Prediction: First Move

## Level Identity
- order: 6
- id: `prediction-06`
- title: Prediction: First Move
- category: prediction
- level kind: prediction
- phase: sensing
- source file: `src/config/levels/phases/sensing/prediction-06-first-move.js`
- project: not applicable

## Curriculum Row
- focus: First move prediction
- new vocabulary: commit to the ally's first movement before running
- new Blockly: prediction checkpoint; no new Blockly idea
- assumptions: Level 5

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
- objective: Predict the ally's first move before you run the program.
- intro: Read the starter code, choose your prediction, and then run the level to compare what happened.
- tips: not found
- tutorial steps:
  - 1. Predict Before You Run (prediction-06-intro)
    - body: Read the starter program, choose where the ally will move first, and then press Start Level to check your tracing.
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
- authored toolbox block types: 5
- action: 5
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/sensing/prediction-06-first-move.js`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/prediction-06.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- prediction checkpoint
- concept focus present: First move prediction
- starter XML contains 2 blocks
- reference XML contains 2 blocks
- toolbox exposes 5 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level prediction-06 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/prediction-06.xml
