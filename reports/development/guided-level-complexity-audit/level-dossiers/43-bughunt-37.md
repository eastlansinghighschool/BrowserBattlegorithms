# Guided Level Dossier: Bug Hunt: Role Split

## Level Identity
- order: 43
- id: `bughunt-37`
- title: Bug Hunt: Role Split
- category: bug hunt
- level kind: bug_hunt
- phase: advanced-teamplay
- source file: `src/config/levels/phases/advanced-teamplay/bughunt-37-role-split.js`
- project: not applicable

## Curriculum Row
- focus: Trace the roles
- new vocabulary: debugging checkpoint; overlapping ally jobs
- new Blockly: repair the runner-index branch split
- assumptions: Levels 23-36

## Tags / Signals
- category: bug hunt
- run mode: bug hunt
- project id: not applicable
- challenge: no
- prediction: no
- bug hunt: yes
- optional lab: no
- human input: no
- demo Blockly present: no
- reference XML present: yes
- project fixture XML present: no

## Lesson Copy
- objective: Two allies are taking the same job, so one role never gets a useful branch.
- intro: This starter is a shared-program debugging checkpoint for the team-strategy arc. One runner should attack while the other stays out of the lane, but the else branch is wrong.
- tips:
  - Runner index is what lets one program mean different jobs for different allies.
  - If two allies chase the same target, one of them is probably missing a distinct role.
  - A good fix gives each runner a useful local job without inventing a second program.
- tutorial steps:
  - 1. Trace The Roles (bughunt-37-trace)
    - body: This shared program should give each ally a different job. Check which runner index enters the attack branch and whether the other ally gets a support job.
    - demo Blockly: not found
  - 2. Split The Jobs (bughunt-37-fix)
    - body: The bug is that the second branch duplicates the wrong target. Change it so the allies do not all chase the same thing.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- objective: runner runner_1_AI_AllyP1 reaches enemy flag at (10, 5)
- team 1 base cells: (0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2), (0, 3), (1, 3), (0, 4), (1, 4), (0, 5), (1, 5), (0, 6), (1, 6), (0, 7), (1, 7)
- team 2 base cells: (10, 0), (11, 0), (10, 1), (11, 1), (10, 2), (11, 2), (10, 3), (11, 3), (10, 4), (11, 4), (10, 5), (11, 5), (10, 6), (11, 6), (10, 7), (11, 7)
- goal cell: (10, 5)
- wall cells: none
- jail cells: none
- flags: opponent: (10, 5)
- barriers: none

## Runner Facts
- player runner 0 (runner_1_HumanP1) slot human at (1, 1); control human; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (1, 2); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- player runner 2 (runner_1_AI_AllyP1_2) slot ally 1 at (1, 5); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999
- opponent runner 1 (runner_2_Npc2) slot npc 1 at (10, 6); control npc; frozen yes; enemy flag no
  - play direction: -1; home side: right; can jump: yes; can place barrier: no
  - frozen turns remaining: 999

## Toolbox Facts
- authored toolbox block types: 7
- action: 2
  - Move Toward (`battlegorithms_move_toward`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If [boolean] (`battlegorithms_if_boolean`)
  - If [boolean] else (`battlegorithms_if_boolean_else`)
- value: 3
  - compare (`battlegorithms_value_compare`)
  - my runner index (`battlegorithms_value_runner_index`)
  - number (`battlegorithms_value_number`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/advanced-teamplay/bughunt-37-role-split.js`
- present: yes
- metrics: blocks 7; distinct types 6; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 1; resource readiness 0
- distinct block types: 6 types: `battlegorithms_if_boolean_else`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`, `battlegorithms_value_compare`, `battlegorithms_value_number`, `battlegorithms_value_runner_index`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/bughunt-37.xml`
- present: yes
- metrics: blocks 7; distinct types 7; actions 2; conditions 1; boolean/comparison/value 3; max depth 4; decision points 2; runner index 1; resource readiness 0
- distinct block types: 7 types: `battlegorithms_if_boolean_else`, `battlegorithms_move_toward`, `battlegorithms_on_each_turn`, `battlegorithms_stay_still`, `battlegorithms_value_compare`, `battlegorithms_value_number`, `battlegorithms_value_runner_index`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- bug hunt checkpoint
- concept focus present: Trace the roles
- starter XML contains 7 blocks
- reference XML contains 7 blocks
- toolbox exposes 7 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level bughunt-37 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/bughunt-37.xml
