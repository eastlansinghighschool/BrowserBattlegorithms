# Guided Reference Behavior Evidence: Level 25: Two Conditions At Once

## Level Identity
- order: 28
- id: `two-conditions-at-once`
- title: Level 25: Two Conditions At Once
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js`
- dossier link: [dossier](../level-dossiers/28-two-conditions-at-once.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-03.xml`
  - turns elapsed: 5
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - turns elapsed: 11
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 5 | Team 1: 0, Team 2: 0 | 5 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |
| project final | documented exception | 11 | Team 1: 0, Team 2: 0 | 4 | yes | none observed |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-03.xml`
- run status: pass
- result: PASSED
- turns elapsed: 5
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 5
- distinct action types observed: `FREEZE_OPPONENTS`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | FREEZE_OPPONENTS | freeze_applied | turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=true -> boolean `battlegorithms_logic_and` result=true -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=true -> boolean `battlegorithms_logic_and` result=true -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more)
- turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more)
- turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more)
- turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more)

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 3) | (7, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 4) | (8, 4) | MOVE (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 4 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (7, 4)) |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (8, 4)) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 4) |
| 5 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 9
- blocks fired: 7
- blocks never fired: 2
- coverage ratio: 7 / 9 (77.8%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 5 | fired |
| `logic_and_1` | `battlegorithms_logic_and` | and | 5 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 5 | fired |
| `value_distance_to_target_1` | `battlegorithms_value_distance_to_target` | distance to | 5 | fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `boolean_area_freeze_ready_1` | `battlegorithms_boolean_area_freeze_ready` | Area Freeze is ready | 5 | fired |
| `freeze_opponents_1` | `battlegorithms_freeze_opponents` | Freeze Opponents | 1 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 4 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (7, 3); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (995 turns remaining)
- first enemy actions:
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose MOVE via npc; outcome moved

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 11
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Strategy Brain checkpoint keeps the later project shape instead of reproducing the exact third-lesson freeze corridor and timing.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 4
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 10 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 10 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=moved)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 3) | (8, 3) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 3) | (8, 4) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 4) | (9, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 3) | MOVE (moved) |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 3) | MOVE (moved) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 11 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 6
- blocks fired: 3
- blocks never fired: 3
- coverage ratio: 3 / 6 (50.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 4 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `if_sensor_matches_else_1` | `battlegorithms_if_sensor_matches_else` | If | 4 | fired |
| `move_up_screen_1` | `battlegorithms_move_up_screen` | Move Up (screen) | 0 | never fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 4 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (7, 3); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (989 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose STAY_STILL via npc; outcome stayed
