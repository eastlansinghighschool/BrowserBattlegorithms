# Guided Level Dossier: Level 21: Freeze the Lane

## Level Identity
- order: 23
- id: `freeze-the-lane`
- title: Level 21: Freeze the Lane
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- project: not applicable

## Curriculum Row
- focus: Freeze the lane
- new vocabulary: team freeze power
- new Blockly: freeze readiness + helper return
- assumptions: prior resources

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
- objective: Spend Area Freeze, then let the ally keep moving toward the flag while the lane is safe and the cooldown runs.
- intro: Area Freeze is a team power, not a normal move. This puzzle is about spending it at the right time and then returning to the main plan while it cools down.
- tips:
  - Area Freeze affects nearby active enemies.
  - Think about what the ally should do before the freeze is spent and what it should do afterward.
  - After this level, free play is the best place to combine all the tools you have learned.
- tutorial steps:
  - 1. Team Freeze Cooldown (level-20-freeze)
    - body: Area Freeze can lock nearby enemies in place for a short time, then it cools down before your team can use it again. A simple if/else can spend it, then switch back to movement.
    - demo Blockly: present
  - 2. Use It At The Right Moment (level-20-timing)
    - body: This lane is dangerous because an enemy starts nearby. Freeze is strongest when you use it before that runner can block your path.
    - demo Blockly: not found
  - 3. The Single-Runner Toolkit Is Complete (level-20-free-play)
    - body: You now have the full set of single-runner tools — movement, sensing, helper blocks, barriers, jumping, and freeze. These will also serve you in free play. The next levels go further, adding new ways to combine and express conditions.
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
- barriers: (7, 0) owner level_freeze_barrier_1; (7, 1) owner level_freeze_barrier_2; (7, 2) owner level_freeze_barrier_3; (7, 5) owner level_freeze_barrier_4; (7, 6) owner level_freeze_barrier_5; (7, 7) owner level_freeze_barrier_6

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (6, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (7, 3); control npc; frozen no; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - cpu behavior: GUIDED_CHARGER
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 11
- action: 7
  - Freeze Opponents (`battlegorithms_freeze_opponents`)
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 4
  - If (`battlegorithms_if_sensor_matches`)
  - If (`battlegorithms_if_sensor_matches_else`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready`)
  - If Area Freeze Is Ready (`battlegorithms_if_area_freeze_ready_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
- aggregate distinct block types: 4 types: `battlegorithms_if_can_jump_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 1: Team Freeze Cooldown
  - source: `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
  - distinct block types: 4 types: `battlegorithms_if_can_jump_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
- distinct block types: 4 types: `battlegorithms_freeze_opponents`, `battlegorithms_if_area_freeze_ready_else`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Freeze the lane
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 11 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level freeze-the-lane --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml
