# Guided Level Dossier: Level 3: Score a Point

## Level Identity
- order: 3
- id: `score-a-point`
- title: Level 3: Score a Point
- category: ordinary
- level kind: not found
- phase: foundations
- source file: `src/config/levels/phases/foundations/level-03-score-a-point.js`
- project: not applicable

## Curriculum Row
- focus: Score a point
- new vocabulary: bring flag home, score
- new Blockly: flag possession condition
- assumptions: Levels 1-2

## Tags / Signals
- category: ordinary
- run mode: ordinary
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: yes
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Bring the enemy flag back home to score a point.
- intro: This puzzle has two phases: first go get the enemy flag, then bring it back to your own side.
- tips:
  - Scoring happens when your ally returns with the enemy flag.
  - Think about how the ally should behave before pickup and after pickup.
  - The enemy runners are still frozen so the challenge stays focused on scoring.
- tutorial steps:
  - 1. Two Jobs In One Puzzle (level-3-flag)
    - body: Reaching the enemy flag is only the first half of the job. Your ally then has to carry it all the way back home.
    - demo Blockly: not found
  - 2. A Condition Can Split The Two Phases (level-3-condition)
    - body: The new flag check can help the ally change plans once it is carrying the enemy flag. Try to make the program notice when the job changes.
    - demo Blockly: present

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- objective: team 1 scores a point with runner_1_AI_AllyP1
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
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/foundations/level-03-score-a-point.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_barrier_in_front_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 2: A Condition Can Split The Two Phases
  - source: `src/config/levels/phases/foundations/level-03-score-a-point.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_barrier_in_front_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/score-a-point.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_move_backward`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Score a point
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level score-a-point --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/score-a-point.xml
