# Guided Level Dossier: Challenge 37: Advanced Scrimmage

## Level Identity
- order: 44
- id: `advanced-scrimmage`
- title: Challenge 37: Advanced Scrimmage
- category: project
- level kind: challenge
- phase: advanced-teamplay
- source file: `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- project: `team-strategy-script step 9`

## Curriculum Row
- focus: Advanced scrimmage
- new vocabulary: live team scrimmage
- new Blockly: combined capstone
- assumptions: Levels 23-37

## Tags / Signals
- category: project
- run mode: project team-strategy-script
- project id: team-strategy-script
- challenge: yes
- prediction: no
- bug hunt: no
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: no
- project fixture XML present: yes

## Lesson Copy
- objective: Three allies face three live defenders across a wide field.
- intro: Your team needs a point against three live defenders. One shared program must give each ally a useful local response as the field changes.
- tips: not found
- tutorial steps:
  - 1. A Full Team Script (level-35-capstone)
    - body: Three allies run one shared program against three live defenders on the far side. Build local rules that give the team different work.
    - demo Blockly: not found
  - 2. Bring A Point Home (level-35-real-score)
    - body: A point is the goal. Any ally can carry it home, so watch what each runner sees as the scrimmage shifts.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `wideScrimmage`
- map label: Wide Scrimmage
- dimensions: 12 x 8
- win condition: {"type":"team_scores_point","teamId":1}
- objective: team 1 scores a point
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: (3, 1), (6, 1), (3, 2), (6, 2), (3, 5), (6, 5), (3, 6), (6, 6)
- jail cells: none
- flags: opponent: (11, 4)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 3); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 2 (runner_1_AI_AllyP1_2) slot ally 1 at (1, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 3 (runner_1_AI_AllyP1_3) slot ally 2 at (1, 5); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (9, 1); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 4); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 2 (runner_2_Npc3) slot npc 2 at (9, 6); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no

## Toolbox Facts
- authored toolbox block types: 48
- action: 10
  - Freeze Opponents (`battlegorithms_freeze_opponents`)
  - Jump Forward (`battlegorithms_jump_forward`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Randomly (`battlegorithms_move_randomly`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Place Barrier (in front) (`battlegorithms_place_barrier`)
  - Stay Still (`battlegorithms_stay_still`)
- boolean/logic: 11
  - and (`battlegorithms_logic_and`)
  - Area Freeze is ready (`battlegorithms_boolean_area_freeze_ready`)
  - I am on enemy side (`battlegorithms_boolean_on_enemy_side`)
  - I am on my side (`battlegorithms_boolean_on_my_side`)
  - I can jump (`battlegorithms_boolean_can_jump`)
  - I can place barrier (`battlegorithms_boolean_can_place_barrier`)
  - I have enemy flag (`battlegorithms_boolean_have_enemy_flag`)
  - not (`battlegorithms_logic_not`)
  - or (`battlegorithms_logic_or`)
  - sensor (`battlegorithms_boolean_sensor_matches`)
  - teammate has enemy flag (`battlegorithms_boolean_teammate_has_flag`)
- condition: 20
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If [boolean] (`battlegorithms_if_boolean`)
  - If [boolean] else (`battlegorithms_if_boolean_else`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready_else`)
  - If Barrier Is In Front (`battlegorithms_if_barrier_in_front`)
  - If Barrier Is In Front (`battlegorithms_if_barrier_in_front_else`)
  - If I Am On Enemy Side (`battlegorithms_if_on_enemy_side`)
  - If I Am On Enemy Side (`battlegorithms_if_on_enemy_side_else`)
  - If I Am On My Side (`battlegorithms_if_on_my_side`)
  - If I Am On My Side (`battlegorithms_if_on_my_side_else`)
  - If I Can Jump (`battlegorithms_if_can_jump`)
  - If I Can Jump (`battlegorithms_if_can_jump_else`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier_else`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag`)
  - If I Have Enemy Flag (`battlegorithms_if_have_enemy_flag_else`)
  - If Teammate Has Enemy Flag (`battlegorithms_if_teammate_has_flag`)
  - If Teammate Has Enemy Flag (`battlegorithms_if_teammate_has_flag_else`)
- value: 7
  - compare (`battlegorithms_value_compare`)
  - count of (`battlegorithms_value_count_within`)
  - distance to (`battlegorithms_value_distance_to_target`)
  - my runner index (`battlegorithms_value_runner_index`)
  - number (`battlegorithms_value_number`)
  - playDirection value (`battlegorithms_value_play_direction`)
  - random roll (1-6) (`battlegorithms_value_random_roll`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- status: not found
### Project XML Fixtures
- Project step fixture 9: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
  - metrics: blocks 32; distinct types 16; actions 8; conditions 7; boolean/comparison/value 16; max depth 8; decision points 13; runner index 1; resource readiness 1
  - distinct block types: 16 types: `battlegorithms_boolean_area_freeze_ready`, `battlegorithms_boolean_have_enemy_flag`, `battlegorithms_boolean_on_enemy_side`, `battlegorithms_boolean_on_my_side`, `battlegorithms_boolean_sensor_matches`, `battlegorithms_freeze_opponents`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_and`, ...
- Project final fixture: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - metrics: blocks 32; distinct types 16; actions 8; conditions 7; boolean/comparison/value 16; max depth 8; decision points 13; runner index 1; resource readiness 1
  - distinct block types: 16 types: `battlegorithms_boolean_area_freeze_ready`, `battlegorithms_boolean_have_enemy_flag`, `battlegorithms_boolean_on_enemy_side`, `battlegorithms_boolean_on_my_side`, `battlegorithms_boolean_sensor_matches`, `battlegorithms_freeze_opponents`, `battlegorithms_if_boolean_else`, `battlegorithms_logic_and`, ...

## Facts Only
- shared workspace project team-strategy-script step 9
- concept focus present: Advanced scrimmage
- starter XML contains 1 blocks
- project fixture XML present (2 files)
- toolbox exposes 48 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level advanced-scrimmage --json
- Linter command: npm run lint:levels
- Project step fixture: tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml
- Project final fixture: tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml
