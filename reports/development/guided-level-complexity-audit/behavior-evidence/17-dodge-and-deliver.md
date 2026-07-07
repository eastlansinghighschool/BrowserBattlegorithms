# Guided Reference Behavior Evidence: Challenge 15: Dodge and Deliver

## Level Identity
- order: 17
- id: `dodge-and-deliver`
- title: Challenge 15: Dodge and Deliver
- category: challenge/synthesis
- level kind: challenge
- source file: `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- dossier link: [dossier](../level-dossiers/17-dodge-and-deliver.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
  - turns elapsed: 26
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 26 | Team 1: 1, Team 2: 0 | 23 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1); flag.dropped (reason=collision_lost); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml`
- run status: pass
- result: PASSED
- turns elapsed: 26
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 1, Team 2: 0
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2); flag.dropped (reason=collision_lost, flagTeam=2); flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 23
- distinct action types observed: `JUMP_FORWARD`, `MOVE_BACKWARD`, `MOVE_DOWN_SCREEN`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1); flag.dropped (reason=collision_lost); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | JUMP_FORWARD | jumped | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=true -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_jump_forward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 1 | `runner_2_Npc2` | MOVE_FORWARD | moved | trace data not available |
| 2 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 2 | `runner_2_Npc2` | MOVE_UP_SCREEN | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_DOWN_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_DOWN_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.result (result=PASSED)
### Trace Tail
- turn 21 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 22 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 23 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 24 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 25 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 26 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 1 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 6) | (7, 6) | MOVE_FORWARD (moved) |
| 2 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (7, 6) | (7, 5) | MOVE_UP_SCREEN (moved) |
| 3 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (7, 5) | (6, 5) | MOVE_FORWARD (moved) |
| 4 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (6, 5) | (6, 6) | MOVE_DOWN_SCREEN (moved) |
| 5 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (6, 6) | (5, 6) | MOVE_FORWARD (moved) |
| 6 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (5, 6) | (6, 6) | MOVE_BACKWARD (moved) |
| 7 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (6, 6) | (6, 5) | MOVE_UP_SCREEN (moved) |
| 8 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (6, 5) | (7, 5) | MOVE_BACKWARD (moved) |
| 9 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (7, 5) | (8, 5) | MOVE_BACKWARD (moved) |
| 10 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 5) | (8, 4) | MOVE_UP_SCREEN (moved) |
| 11 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 11 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 4) | (8, 4) | MOVE_FORWARD (bounced) |
| 12 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 4) | (8, 3) | MOVE_UP_SCREEN (moved) |
| 13 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 3) | (8, 2) | MOVE_UP_SCREEN (moved) |
| 14 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 14 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 2) | (7, 2) | MOVE_FORWARD (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (6, 4) and (7, 4)) |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (6, 4) and (7, 4)) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (7, 4)) |
| 8 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 4) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (7, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 5)) |
| 10 | `flag.dropped` | flag 2 dropped by runner runner_1_AI_AllyP1 at (8, 4) due to collision_lost |
| 11 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (8, 5) and (8, 4)) |
| 11 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (7, 4) |
| 12 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (8, 5) and (8, 4)) |
| 26 | `team.scored` | team 1 scored a point |
| 26 | `level.result` | level result: PASSED (reason: win_condition_met) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 10
- blocks fired: 8
- blocks never fired: 2
- coverage ratio: 8 / 10 (80.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `rArC4=3zzuxfkG(ONg|q` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `|1GNri[4:|0x.vT^bq,M` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 23 | fired |
| `jQdHPN|Ue-Q6=bza}uQo` | `battlegorithms_if_sensor_matches` | If | 12 | fired |
| `ME2G;Piohnu)fP$oX}`o` | `battlegorithms_if_sensor_matches` | If | 11 | fired |
| `iq0odl3U*z+#iX#a*p*;` | `battlegorithms_move_down_screen` | Move Down (screen) | 1 | fired |
| `]F]i0g-$G;]jcGNvCH6!` | `battlegorithms_move_toward` | Move Toward | 11 | fired |
| `{+xA3xBZ4xy^bBnaD@bG` | `battlegorithms_if_sensor_matches_else` | If | 1 | fired |
| `rU+6w-KG+K#`!(m];Lou` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `Mi_(aYw:mYo+j_)F{s}{` | `battlegorithms_jump_forward` | Jump Forward | 1 | fired |
| `X=oqv!3NX@-YBQ=1~Hrt` | `battlegorithms_move_up_screen` | Move Up (screen) | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_STAY_STILL; start (7, 4); frozen no
- runner_2_Npc2: behavior GUIDED_RANDOM_MOVE_ONLY; start (8, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 1: runner_2_Npc2 chose MOVE_FORWARD via cpu; outcome moved
  - turn 2: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 2: runner_2_Npc2 chose MOVE_UP_SCREEN via cpu; outcome moved
