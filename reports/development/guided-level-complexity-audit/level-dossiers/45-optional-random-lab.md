# Guided Level Dossier: Optional Lab: Move Randomly

## Level Identity
- order: 45
- id: `optional-random-lab`
- title: Optional Lab: Move Randomly
- category: optional lab
- level kind: not found
- phase: optional
- source file: `src/config/levels/phases/optional/level-38-optional-random-lab.js`
- project: not applicable

## Curriculum Row
- focus: randomness in action choice
- new vocabulary: randomness in action
- new Blockly: Move Randomly
- assumptions: movement basics

## Tags / Signals
- category: optional lab
- run mode: optional lab
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: yes
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Try the Move Randomly block in a small sandbox challenge.
- intro: This optional lab is here to show the random movement block directly. It is not part of the main advanced unlock path.
- tips: not found
- tutorial steps:
  - 1. Optional Randomness Lab (level-36-random)
    - body: Move Randomly picks one of the four cardinal directions each turn. This lab is optional because randomness is harder to predict.
    - demo Blockly: not found
  - 2. Try A Few Runs (level-36-lab)
    - body: Some attempts will finish faster than others. That is the point of the lab: to see how a random action feels in the game.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":2,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (2, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (2, 4)
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
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 2
- action: 2
  - Move Randomly (`battlegorithms_move_randomly`)
  - Stay Still (`battlegorithms_stay_still`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/optional/level-38-optional-random-lab.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/optional-random-lab.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_randomly`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- optional lab
- concept focus present: randomness in action choice
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 2 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level optional-random-lab --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/optional-random-lab.xml
