# Guided Level Dossier: Level 19: Relay Race

## Level Identity
- order: 21
- id: `relay-race`
- title: Level 19: Relay Race
- category: ordinary
- level kind: not found
- phase: resources-and-territory
- source file: `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- project: not applicable

## Curriculum Row
- focus: Relay race
- new vocabulary: staged carrier support
- new Blockly: teammate-has-flag
- assumptions: scoring + helper targets

## Tags / Signals
- category: ordinary
- run mode: human input
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: no
- optional lab: no
- human input: yes
- demo Blockly present: yes
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Use the teammate flag condition so the ally stages on defense first, then supports the human carrier after the enemy flag is picked up.
- intro: This relay uses both keyboard control and Blockly. Move the human runner to the enemy flag, and have the ally stage first before switching into carrier support.
- tips:
  - The human runner starts without the enemy flag and has to pick it up first.
  - The ally should reach the staging square near the top before the human carries the flag.
  - The teammate condition is true when another runner on your team has the flag.
  - After the human becomes the carrier, the ally should switch from staging to carrier support.
  - The highlighted goal marker changes with the relay phase, so watch it after the flag pickup.
- tutorial steps:
  - 1. Move The Human Runner First (level-19-human-route)
    - body: You control the human runner in this level. Get to the enemy flag first, then watch the ally switch from the top staging square to carrier support once a teammate has the flag.
    - demo Blockly: not found
  - 2. Stage, Then Support (level-19-support)
    - body: Use the teammate flag condition to change the ally's job after the human becomes the carrier. The structure is a branch: one action before the flag, another after it.
    - demo Blockly: present

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"relay_support_after_teammate_has_flag","runnerId":"runner_1_AI_AllyP1","stagingCell":{"x":4,"y":0}}
- objective: not found
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: not found
- wall cells: none
- jail cells: none
- flags: not found
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 4); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (4, 5); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 1); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 8
- action: 6
  - Move Backward (`battlegorithms_move_backward`)
  - Move Down (screen) (`battlegorithms_move_down_screen`)
  - Move Forward (`battlegorithms_move_forward`)
  - Move Toward (`battlegorithms_move_toward`)
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If Teammate Has Enemy Flag (`battlegorithms_if_teammate_has_flag`)
  - If Teammate Has Enemy Flag (`battlegorithms_if_teammate_has_flag_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
- present: yes
- metrics: blocks 1; distinct types 1; actions 0; conditions 0; boolean/comparison/value 0; max depth 1; decision points 0; runner index 0; resource readiness 0
- distinct block types: 1 types: `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Demo XML
- tutorial steps with demo Blockly: 1
- aggregate metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- aggregate distinct block types: 4 types: `battlegorithms_if_barrier_in_front_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- demo 1: Tutorial step 2: Stage, Then Support
  - source: `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`
  - metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
  - distinct block types: 4 types: `battlegorithms_if_barrier_in_front_else`, `battlegorithms_move_forward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/relay-race.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 0
- distinct block types: 4 types: `battlegorithms_if_teammate_has_flag_else`, `battlegorithms_move_toward`, `battlegorithms_move_up_screen`, `battlegorithms_on_each_turn`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- concept focus present: Relay race
- starter XML contains 1 blocks
- demo XML present in 1 tutorial step
- reference XML contains 4 blocks
- toolbox exposes 8 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level relay-race --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/relay-race.xml
