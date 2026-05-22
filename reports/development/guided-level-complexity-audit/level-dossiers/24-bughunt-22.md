# Guided Level Dossier: Bug Hunt: First Action Matters

## Level Identity
- order: 24
- id: `bughunt-22`
- title: Bug Hunt: First Action Matters
- category: bug hunt
- level kind: bug_hunt
- phase: advanced-logic
- source file: `src/config/levels/phases/advanced-logic/bughunt-22-readiness-order.js`
- project: not applicable

## Curriculum Row
- focus: Trace the first action
- new vocabulary: debugging checkpoint; an early action steals the turn
- new Blockly: repair action ordering around barrier readiness
- assumptions: Levels 1-21

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
- objective: A stray action steals the turn before the barrier check can run.
- intro: This program already knows how to place a barrier, but one move block sits in front of the real decision. Trace the order, fix the first action, and keep the barrier logic readable.
- tips:
  - Only the first action reached on a turn runs, so a move block can hide everything after it.
  - The barrier check is already there; the bug is that it never gets the chance to run first.
  - Fixing a bug hunt usually means repairing the smallest broken piece, not rebuilding the whole program.
- tutorial steps:
  - 1. Trace The Top Of The Stack (bughunt-22-trace)
    - body: The first action is the important one here. Ask what the runner does before the barrier check ever starts.
    - demo Blockly: not found
  - 2. Put The Check First (bughunt-22-order)
    - body: The fix should be small: move the readiness branch back to the front so the barrier action can run before any extra motion.
    - demo Blockly: not found

## Board / Setup Facts
- map key: `simpleAisle`
- map label: Simple Aisle
- dimensions: 12 x 8
- win condition: {"type":"barrier_exists_at_cell","targetCell":{"x":4,"y":4}}
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
- player runner 1 (runner_1_AI_AllyP1) slot ally 0 at (3, 4); control ally; frozen no; enemy flag no
  - play direction: 1; home side: left; can jump: yes; can place barrier: no
- opponent runner 0 (runner_2_Npc1) slot npc 0 at (10, 2); control npc; frozen yes; enemy flag no
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
  - Move Up (screen) (`battlegorithms_move_up_screen`)
  - Place Barrier (in front) (`battlegorithms_place_barrier`)
  - Stay Still (`battlegorithms_stay_still`)
- condition: 2
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier`)
  - If I Can Place Barrier (`battlegorithms_if_can_place_barrier_else`)

## XML Facts
### Starter XML
- source: `src/config/levels/phases/advanced-logic/bughunt-22-readiness-order.js`
- present: yes
- metrics: blocks 5; distinct types 5; actions 3; conditions 1; boolean/comparison/value 0; max depth 4; decision points 1; runner index 0; resource readiness 1
- distinct block types: 5 types: `battlegorithms_if_can_place_barrier_else`, `battlegorithms_move_forward`, `battlegorithms_on_each_turn`, `battlegorithms_place_barrier`, `battlegorithms_stay_still`
- first-action-only risk markers: none found
### Demo XML
- status: not found
### Reference XML
- source: `tests/unit/fixtures/guided-reference-solutions/bughunt-22.xml`
- present: yes
- metrics: blocks 4; distinct types 4; actions 2; conditions 1; boolean/comparison/value 0; max depth 3; decision points 1; runner index 0; resource readiness 1
- distinct block types: 4 types: `battlegorithms_if_can_place_barrier_else`, `battlegorithms_on_each_turn`, `battlegorithms_place_barrier`, `battlegorithms_stay_still`
- first-action-only risk markers: none found
### Project XML Fixtures
- status: not applicable

## Facts Only
- bug hunt checkpoint
- concept focus present: Trace the first action
- starter XML contains 5 blocks
- reference XML contains 4 blocks
- toolbox exposes 8 authored block types

## Validation Pointers
- Readiness command: npm run level:readiness -- --level bughunt-22 --json
- Linter command: npm run lint:levels
- Reference fixture: tests/unit/fixtures/guided-reference-solutions/bughunt-22.xml
