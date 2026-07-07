# Guided Reference Behavior Evidence: Level 24: How Far Away?

## Level Identity
- order: 27
- id: `how-far-away`
- title: Level 24: How Far Away?
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
- dossier link: [dossier](../level-dossiers/27-how-far-away.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-02.xml`
  - turns elapsed: 6
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - turns elapsed: 18
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 6 | Team 1: 0, Team 2: 0 | 6 | yes | none observed |
| project final | documented exception | 18 | Team 1: 0, Team 2: 0 | 17 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-02.xml`
- run status: pass
- result: PASSED
- turns elapsed: 6
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 6
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: yes
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=6 -> comparison `battlegorithms_value_compare` result=false compare=6 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 6 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=6 -> comparison `battlegorithms_value_compare` result=false compare=6 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (6, 4) | (7, 4) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 4) | (8, 4) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 4) | (9, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 7
- blocks fired: 5
- blocks never fired: 2
- coverage ratio: 5 / 7 (71.4%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 6 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 6 | fired |
| `value_distance_to_target_1` | `battlegorithms_value_distance_to_target` | distance to | 6 | fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_up_screen_1` | `battlegorithms_move_up_screen` | Move Up (screen) | 2 | fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 4 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (994 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose STAY_STILL via npc; outcome stayed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 18
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Strategy Brain checkpoint keeps the later project shape instead of recreating the load-bearing distance-check turn pattern from the middle lesson.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 17
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 12 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 14 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 15 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 16 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 17 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (6, 4) | (7, 4) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 4) | (8, 4) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 4) | (9, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 11 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 14 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (4, 4) |
| 18 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 6
- blocks fired: 3
- blocks never fired: 3
- coverage ratio: 3 / 6 (50.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 17 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `if_sensor_matches_else_1` | `battlegorithms_if_sensor_matches_else` | If | 17 | fired |
| `move_up_screen_1` | `battlegorithms_move_up_screen` | Move Up (screen) | 0 | never fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 17 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (982 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose STAY_STILL via npc; outcome stayed
