# Guided Reference Behavior Evidence: Challenge 22: Show What You Know

## Level Identity
- order: 25
- id: `show-what-you-know`
- title: Challenge 22: Show What You Know
- category: challenge/synthesis
- level kind: challenge
- source file: `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- dossier link: [dossier](../level-dossiers/25-show-what-you-know.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
  - turns elapsed: 35
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 35 | Team 1: 1, Team 2: 0 | 29 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/show-what-you-know.xml`
- run status: pass
- result: PASSED
- turns elapsed: 35
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 1, Team 2: 0
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 29
- distinct action types observed: `FREEZE_OPPONENTS`, `MOVE_BACKWARD`, `MOVE_DOWN_SCREEN`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | FREEZE_OPPONENTS | freeze_applied | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=true -> condition `battlegorithms_if_area_freeze_ready_else` result=true -> action `battlegorithms_freeze_opponents` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | moved | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | stayed | trace data not available |
| 1 | `runner_2_Npc3` | MOVE_UP_SCREEN | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_UP_SCREEN | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.result (result=PASSED)
### Trace Tail
- turn 30 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 31 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 32 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 33 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 34 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`
- turn 35 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 1) | MOVE_UP_SCREEN (moved) |
| 1 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 1 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 7) | (9, 6) | MOVE_UP_SCREEN (moved) |
| 2 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 0) | MOVE_UP_SCREEN (moved) |
| 2 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 6) | (9, 5) | MOVE_UP_SCREEN (moved) |
| 3 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 0) | (7, 1) | MOVE_DOWN_SCREEN (moved) |
| 3 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 5) | (9, 4) | MOVE_UP_SCREEN (moved) |
| 4 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 2) | MOVE_DOWN_SCREEN (moved) |
| 4 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 4) | (9, 3) | MOVE_UP_SCREEN (moved) |
| 5 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 3) | MOVE_DOWN_SCREEN (moved) |
| 5 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 3) | (9, 2) | MOVE_UP_SCREEN (moved) |
| 6 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 2) | (9, 1) | MOVE_UP_SCREEN (moved) |
| 7 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 1) | (9, 0) | MOVE_UP_SCREEN (moved) |
| 8 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 3) | (7, 4) | MOVE_DOWN_SCREEN (moved) |
| 8 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 0) | (9, 1) | MOVE_DOWN_SCREEN (moved) |
| 9 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 4) | (7, 5) | MOVE_DOWN_SCREEN (moved) |
| 9 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 1) | (9, 2) | MOVE_DOWN_SCREEN (moved) |
| 10 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 5) | (7, 6) | MOVE_DOWN_SCREEN (moved) |
| 10 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 2) | (9, 3) | MOVE_DOWN_SCREEN (moved) |
| 11 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 6) | (7, 7) | MOVE_DOWN_SCREEN (moved) |
| 11 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 11 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 3) | (9, 4) | MOVE_DOWN_SCREEN (moved) |
| 12 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 7) | (7, 7) | MOVE_UP_SCREEN (bounced) |
| 12 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 4) | (9, 5) | MOVE_DOWN_SCREEN (moved) |
| 13 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 7) | (7, 7) | MOVE_UP_SCREEN (bounced) |
| 13 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 5) | (9, 6) | MOVE_DOWN_SCREEN (moved) |
| 14 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 7) | (7, 6) | MOVE_UP_SCREEN (moved) |
| 14 | `runner_2_Npc2` | GUIDED_STAY_STILL | (8, 4) | (8, 4) | STAY_STILL (stayed) |
| 14 | `runner_2_Npc3` | GUIDED_VERTICAL_PATROL | (9, 6) | (9, 7) | MOVE_DOWN_SCREEN (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 5) and (7, 4)) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 5) and (7, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 6) and (7, 5)) |
| 11 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 7) and (7, 6)) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, 8) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 6) and (7, 7)) |
| 12 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (7, 6) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 6) and (7, 7)) |
| 13 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (7, 6) |
| 14 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 6) and (7, 7)) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 7) and (7, 6)) |
| 35 | `team.scored` | team 1 scored a point |
| 35 | `level.result` | level result: PASSED (reason: win_condition_met) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 14
- blocks fired: 10
- blocks never fired: 4
- coverage ratio: 10 / 14 (71.4%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `vL4)4tX)%c77J5ES$;dB` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `sYFrt1n.C;o|5]U{p$)c` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 29 | fired |
| `[OSf[de=#3Uj^ivKALfi` | `battlegorithms_if_sensor_matches` | If | 11 | fired |
| `hmDb!839ld*2wD?=:N/]` | `battlegorithms_if_sensor_matches` | If | 18 | fired |
| `bB5||LkXShZ,?;ts3QYB` | `battlegorithms_move_up_screen` | Move Up (screen) | 1 | fired |
| `}d58a@;3kI7E?:+L2pIB` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `bOF@}p45}pLByyd=kj?T` | `battlegorithms_if_area_freeze_ready_else` | If Area Freeze Is Ready | 5 | fired |
| `^tsqS@KKxC@jnQGo/_s3` | `battlegorithms_if_sensor_matches` | If | 13 | fired |
| `*y8)7YNgP_k{Wm(k)YL6` | `battlegorithms_freeze_opponents` | Freeze Opponents | 1 | fired |
| `?BVbbOYtCLV{67X,Ob3`` | `battlegorithms_move_down_screen` | Move Down (screen) | 4 | fired |
| ``Us,6+tJUmSIZ})jb|gA` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `O#xg[`q6Z6Q@sZFi:quj` | `battlegorithms_move_toward` | Move Toward | 13 | fired |
| `JO[3UKH9Pmmn`:_GA]mT` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `b!zbq%|M%BZ:QnMr2Q5]` | `battlegorithms_move_up_screen` | Move Up (screen) | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 2); frozen no
- runner_2_Npc2: behavior GUIDED_STAY_STILL; start (8, 4); frozen no
- runner_2_Npc3: behavior GUIDED_VERTICAL_PATROL; start (9, 7); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome moved
  - turn 1: runner_2_Npc2 chose STAY_STILL via cpu; outcome stayed
  - turn 1: runner_2_Npc3 chose MOVE_UP_SCREEN via cpu; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome moved
