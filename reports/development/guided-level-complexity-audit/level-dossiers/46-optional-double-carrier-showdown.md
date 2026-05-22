# Guided Level Dossier: Optional Lab: Double Carrier Showdown

## Level Identity
- order: 46
- id: `optional-double-carrier-showdown`
- title: Optional Lab: Double Carrier Showdown
- category: optional lab
- level kind: not found
- phase: optional
- source file: `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`
- project: not applicable

## Curriculum Row
- focus: own-flag-home scoring; escort and intercept coordination
- new vocabulary: scoring is blocked when own flag is away; carrier interception unblocks the score; runner index roles
- new Blockly: runner index, teammate-has-flag, Move Toward
- assumptions: Levels 19, 29-37, the carrier collision rule, and the own-flag-home scoring rule

## Tags / Signals
- category: optional lab
- run mode: human input
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: yes
- human input: yes
- demo Blockly present: no
- reference XML present: no
- project fixture XML present: no

## Lesson Copy
- objective: Both teams start with a carrier. Your team cannot score while your own flag is away — stop the enemy carrier to unblock the run.
- intro: Both teams start with a flag carrier already in motion. Under the scoring rules, your team cannot score while your own flag is away — stopping the enemy carrier is the only way to unblock your run. This lab is about using runner roles to escort your carrier and intercept theirs at the same time.
- tips: not found
- tutorial steps:
  - 1. Two Carriers, One Decision (optional-double-carrier-intro)
    - body: Your runner starts with the enemy flag, and Team 2 already has your flag. Your team cannot score while your own flag is away — stopping the enemy carrier is not optional, it is what unblocks the scoring run.
    - demo Blockly: not found
  - 2. Split Escort And Intercept (optional-double-carrier-roles)
    - body: Use runner index and teammate-has-flag to give one ally escort duty and one ally interception duty. Intercepting the enemy carrier returns your flag home and unblocks the scoring run.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `wideScrimmage`
- map label: Wide Scrimmage
- dimensions: 12 x 8
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_HumanP1"}
- objective: team 1 scores a point with runner_1_HumanP1
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: (3, 1), (6, 1), (3, 2), (6, 2), (3, 5), (6, 5), (3, 6), (6, 6)
- jail cells: none
- flags: opponent: (not found, not found) carried by runner_1_HumanP1; player: (not found, not found) carried by runner_2_Npc1
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (6, 4); control human; frozen no; enemy flag yes
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (5, 3); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 2 (runner_1_AI_AllyP1_2) slot ally 1 at (5, 5); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (3, 3); control npc; frozen no; enemy flag yes
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (7, 4); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
- opponent runner 2 (runner_2_Npc3) slot npc 2 at (7, 5); control npc; frozen no; enemy flag no
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
- source: `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`
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
- optional lab
- concept focus present: own-flag-home scoring; escort and intercept coordination
- starter XML contains 1 blocks
- toolbox exposes 48 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level optional-double-carrier-showdown --json
- Linter command: npm run lint:levels
