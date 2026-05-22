# Guided Level Dossier: Level 5: Forward Works Both Ways

## Level Identity
- order: 5
- id: `mirror-forward`
- title: Level 5: Forward Works Both Ways
- category: ordinary
- level kind: not found
- phase: foundations
- source file: `src/config/levels/phases/foundations/level-05-mirror-forward.js`
- project: not applicable

## Curriculum Row
- focus: Forward works both ways
- new vocabulary: relative forward / play direction
- new Blockly: same block, different orientation
- assumptions: Levels 1-4

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
- objective: See that Move Forward follows the runner’s own direction, not the screen.
- intro: Forward does not always mean right on the screen. It means moving toward that runner’s goal direction.
- tips:
  - The ally starts on the right this time.
  - Watch the runner, not the screen, to understand what forward means.
  - This level teaches relative direction before the sensing lessons begin.
- tutorial steps:
  - 1. Forward Is Relative (level-5-mirror)
    - body: This ally starts on the opposite side. Forward still works because it follows the runner's own goal direction, not the screen.
    - demo Blockly: not found
  - 2. The Same Block, A Different Facing (level-5-forward)
    - body: The same block that worked on the left side of the board applies here too. Think about what forward means for a runner facing the other direction — the board orientation has changed but the concept has not.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":7,"y":4}}
- objective: runner runner_1_AI_AllyP1 reaches (7, 4)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (7, 4)
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (10, 1); control human; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (10, 4); control ally; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (1, 2); control npc; frozen yes; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (1, 6); control npc; frozen yes; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
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
- source: `src/config/levels/phases/foundations/level-05-mirror-forward.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/mirror-forward.xml`
- present: yes
- metrics: blocks 2; distinct types 2; actions 1; conditions 0; boolean/comparison/value 0; max depth 2; decision points 0; runner index 0; resource readiness 0
- distinct block types: 2 types: `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Forward works both ways
- starter XML contains 1 blocks
- reference XML contains 2 blocks
- toolbox exposes 4 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level mirror-forward --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/mirror-forward.xml
