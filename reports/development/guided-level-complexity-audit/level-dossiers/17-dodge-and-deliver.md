# Guided Level Dossier: Challenge 15: Dodge and Deliver

## Level Identity
- order: 17
- id: `dodge-and-deliver`
- title: Challenge 15: Dodge and Deliver
- category: challenge
- level kind: challenge
- phase: movement-helpers
- source file: `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- project: not applicable

## Curriculum Row
- focus: Dodge and Deliver
- new vocabulary: live enemy; real scoring run
- new Blockly: none - synthesis only
- assumptions: Levels 1-15

## Tags / Signals
- category: challenge
- run mode: challenge
- project id: not applicable
- challenge: yes
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Pick up the enemy flag and bring it home while one defender guards the lane and another enemy keeps moving.
- intro: No new tools this time. One enemy holds the lane near the flag, and another keeps moving. Use what you know.
- tips:
  - One enemy guards the lane while another keeps moving. Watch both threats.
  - Checking the enemy's distance before committing to a direction can help you plan a safer route.
  - The enemy flag needs to come all the way back home to score a point.
- tutorial steps:
  - 1. A Real Game Situation (dodge-and-deliver-real-game)
    - body: This is a real game situation — one enemy guards the lane and another keeps moving. Your program needs to make progress while staying out of trouble.
    - demo Blockly: not found
  - 2. Your Full Toolkit (dodge-and-deliver-toolkit)
    - body: All the tools from the previous levels are here. There is no single right answer — think about how your ally should balance chasing the flag and handling both threats.
    - demo Blockly: not found

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
- flags: opponent: (10, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (7, 4); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_STAY_STILL
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (8, 6); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_RANDOM_MOVE_ONLY

## Toolbox Facts
- authored toolbox block types: 11
- action: 7
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 4
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- present: yes
- metrics: blocks 10; distinct types 8; actions 5; conditions 4; boolean/comparison/value 0; max depth 5; decision points 4; runner index 0; resource readiness 0
- distinct block types: 8 types: `battlegorithms_if_have_enemy_flag_else`, `battlegorithms_if_sensor_matches`, `battlegorithms_if_sensor_matches_else`, `battlegorithms_jump_forward`, `battlegorithms_move_down_screen`, `battlegorithms_move_toward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Dodge and Deliver
- starter XML contains 1 blocks
- reference XML contains 10 blocks
- toolbox exposes 11 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level dodge-and-deliver --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml
