# Guided Reference Behavior Evidence: Level 33: Closest Enemy Defender

## Level Identity
- order: 38
- id: `closest-enemy-defender`
- title: Level 33: Closest Enemy Defender
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js`
- dossier link: [dossier](../level-dossiers/38-closest-enemy-defender.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-05.xml`
  - turns elapsed: 10
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 19
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 10 | Team 1: 0, Team 2: 0 | 19 | yes | runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) |
| project final | documented exception | 19 | Team 1: 0, Team 2: 0 | 17 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-05.xml`
- run status: pass
- result: PASSED
- turns elapsed: 10
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 19
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | bounced | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | bounced | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | MOVE | bounced | trace data not available |
| 2 | `runner_2_Npc2` | MOVE | bounced | trace data not available |
| 3 | `runner_2_Npc2` | MOVE | bounced | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_BACKWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_BACKWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (4, 2) | (4, 2) | MOVE (illegal_noop) |
| 1 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (bounced) |
| 2 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (bounced) |
| 3 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (bounced) |
| 4 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (bounced) |
| 5 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (illegal_noop) |
| 9 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (3, 2) | MOVE (bounced) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 1 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (4, 2) |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (4, 2) |
| 2 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (4, 2) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (4, 2) |
| 3 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (4, 2) |
| 4 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (4, 2) |
| 4 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (4, 2) |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 5 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (3, 2)) |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (5, 2)) |
| 6 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (3, 2)) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (5, 2) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (5, 2)) |
| 7 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (3, 2)) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (5, 2) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (5, 2)) |
| 8 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (4, 2) and (3, 2)) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (4, 2) |
| 9 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (4, 2) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (5, 2) and (4, 2)) |
| 10 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 10 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 7
- blocks fired: 4
- blocks never fired: 3
- coverage ratio: 4 / 7 (57.1%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `~{yvB%FCewA9{@^:2~J]` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `Zh.hUcO+h$mL8|cbpNj#` | `battlegorithms_if_boolean_else` | If [boolean] else | 19 | fired |
| `#7U#FBzKB;Y0^h15w}j;` | `battlegorithms_value_compare` | compare | 19 | fired |
| `H%^kYo@EQHA@NGi5{!CK` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `0/=x.!xL]Y%IuQ+EwPIN` | `battlegorithms_move_toward` | Move Toward | 9 | fired |
| `n[Rm{ll~E#EA9C+xZdYw` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `11HEZG+`V]N[{MQEOnlj` | `battlegorithms_value_number` | number | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (4, 2); frozen yes (1 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (3, 2); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose MOVE via npc; outcome bounced
  - turn 2: runner_2_Npc2 chose MOVE via npc; outcome bounced
  - turn 3: runner_2_Npc2 chose MOVE via npc; outcome bounced

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 19
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint sends index 1 forward rather than toward the closest enemy; the repositioned NPCs on the player's side reach the player's flag and alter midfield state before index 0 can score within the turn limit.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 17
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 1 | `runner_2_Npc2` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc2` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 6 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 7 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 15 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (4, 2) | (5, 2) | MOVE (moved) |
| 1 | `runner_2_Npc2` | PATROL_INTERCEPT | (3, 2) | (4, 2) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (5, 2) | (6, 2) | MOVE (moved) |
| 2 | `runner_2_Npc2` | PATROL_INTERCEPT | (4, 2) | (5, 2) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (6, 2) | (7, 2) | MOVE (moved) |
| 3 | `runner_2_Npc2` | PATROL_INTERCEPT | (5, 2) | (6, 2) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 2) | (8, 2) | MOVE (moved) |
| 4 | `runner_2_Npc2` | PATROL_INTERCEPT | (6, 2) | (7, 2) | MOVE (moved) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 2) | (9, 2) | MOVE (moved) |
| 5 | `runner_2_Npc2` | PATROL_INTERCEPT | (7, 2) | (8, 2) | MOVE (moved) |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 2) | (10, 2) | MOVE (moved) |
| 6 | `runner_2_Npc2` | PATROL_INTERCEPT | (8, 2) | (9, 2) | MOVE (moved) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (10, 2) | (11, 2) | MOVE (moved) |
| 7 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 2) | (9, 3) | MOVE (moved) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 2) | (11, 3) | MOVE (moved) |
| 8 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 3) | (11, 3) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 3) | (11, 2) | MOVE (moved) |
| 10 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 4) | (9, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 2) | (11, 2) | MOVE (bounced) |
| 11 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 4) | (9, 3) | MOVE (moved) |
| 12 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 2) | (11, 2) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 13 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 2) | (11, 2) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 14 | `runner_2_Npc1` | PATROL_INTERCEPT | (11, 2) | (11, 3) | MOVE (moved) |
| 14 | `runner_2_Npc2` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (11, 2) and (10, 2)) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (11, 2) and (10, 2)) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 2) |
| 7 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (9, 2)) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 8 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 3) and (9, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 3) and (9, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 10 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 3) and (9, 4)) |
| 11 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (10, 2) |
| 12 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (9, 3)) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 12 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 13 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (9, 3)) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 13 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (9, 3)) |
| 14 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 2) and (11, 2)) |
| 15 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (9, 3) and (9, 4)) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (11, 2) and (11, 3)) |
| 19 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 8
- blocks never fired: 17
- coverage ratio: 8 / 25 (32.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `^z:/*EaY%cK=kQ~t;};Y` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `|:#dQ5U1qWACrI3Zm}2U` | `battlegorithms_if_boolean_else` | If [boolean] else | 17 | fired |
| `PTJLnJJVueG)d68``XPI` | `battlegorithms_value_compare` | compare | 17 | fired |
| `5Z5Wp2?LSW8jZh_N+Vpi` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 8 | fired |
| `6%q=Tjdy5S~.J{^#jf%:` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 9 | fired |
| `gL54g^1e[B*=dV$HySM*` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `ZWfS[RQq?u!0d%Jl-7;:` | `battlegorithms_value_number` | number | 0 | never fired |
| `_?L508sR4;E5~mm^GCFe` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `I_)S6S=%yg00}QxOVr)_` | `battlegorithms_move_toward` | Move Toward | 8 | fired |
| `fmtaRQKO8jO`oE-Ww%m?` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `6u|(6C]30JCvp:z:t[l0` | `battlegorithms_if_boolean_else` | If [boolean] else | 9 | fired |
| `0U2#g[J$~UM#20pA2qq0` | `battlegorithms_value_compare` | compare | 9 | fired |
| `2v90f[jDJETi%*5%uA$t` | `battlegorithms_move_forward` | Move Forward | 9 | fired |
| `-h86TjHmKPXEbx.1SNBP` | `battlegorithms_if_boolean_else` | If [boolean] else | 0 | never fired |
| `-,mNZ6,B_yh/Y1hO}x_v` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `[a6HQZt(4nS4/;s*ZeIb` | `battlegorithms_value_number` | number | 0 | never fired |
| `g=RyR+:%6r+:)dymz=Wk` | `battlegorithms_value_compare` | compare | 0 | never fired |
| `|52cf_TN;HPI!.~dZa,v` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `E3NTo*Ls/}~Hd8(6?dR6` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `L1?p%v:nk2%qD{vzK(YV` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `w6IM@j1n{(mJJ)gvjz*^` | `battlegorithms_value_number` | number | 0 | never fired |
| `g;nsyAUJf%oV/}COreoI` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `f.WIh?I%|{N_Xf!Q^zB3` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |
| `KS{if.qxvlfML2b%tjAu` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `$9gZFj{6IM,OkshRFuJy` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (4, 2); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (3, 2); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 1: runner_2_Npc2 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc2 chose MOVE via npc; outcome moved
