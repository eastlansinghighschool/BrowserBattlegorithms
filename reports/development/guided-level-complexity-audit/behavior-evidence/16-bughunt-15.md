# Guided Reference Behavior Evidence: Bug Hunt: Flag Phase

## Level Identity
- order: 16
- id: `bughunt-15`
- title: Bug Hunt: Flag Phase
- category: bug hunt
- level kind: bug_hunt
- source file: `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- dossier link: [dossier](../level-dossiers/16-bughunt-15.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml`
  - turns elapsed: 18
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 18 | Team 1: 1, Team 2: 0 | 18 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml`
- run status: pass
- result: PASSED
- turns elapsed: 18
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 1, Team 2: 0
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 18
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 1 | `runner_2_Npc2` | MOVE_BACKWARD | moved | trace data not available |
| 2 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 2 | `runner_2_Npc2` | MOVE_DOWN_SCREEN | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_FORWARD, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.result (result=PASSED)
### Trace Tail
- turn 13 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 14 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 15 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 16 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 17 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 18 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 1 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 6) | (9, 6) | MOVE_BACKWARD (moved) |
| 2 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 6) | (9, 7) | MOVE_DOWN_SCREEN (moved) |
| 3 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 7) | (8, 7) | MOVE_FORWARD (moved) |
| 4 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 7) | (9, 7) | MOVE_BACKWARD (moved) |
| 5 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 7) | (9, 6) | MOVE_UP_SCREEN (moved) |
| 6 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 6) | (10, 6) | MOVE_BACKWARD (moved) |
| 7 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (10, 6) | (9, 6) | MOVE_FORWARD (moved) |
| 8 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 6) | (9, 7) | MOVE_DOWN_SCREEN (moved) |
| 9 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 7) | (9, 6) | MOVE_UP_SCREEN (moved) |
| 10 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 6) | (8, 6) | MOVE_FORWARD (moved) |
| 11 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 11 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 6) | (8, 5) | MOVE_UP_SCREEN (moved) |
| 12 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 5) | (8, 6) | MOVE_DOWN_SCREEN (moved) |
| 13 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (8, 6) | (9, 6) | MOVE_BACKWARD (moved) |
| 14 | `runner_2_Npc1` | GUIDED_STAY_STILL | (7, 3) | (7, 3) | STAY_STILL (stayed) |
| 14 | `runner_2_Npc2` | GUIDED_RANDOM_MOVE_ONLY | (9, 6) | (10, 6) | MOVE_BACKWARD (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 9 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 4) |
| 12 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 5)) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 3)) |
| 18 | `team.scored` | team 1 scored a point |
| 18 | `level.result` | level result: PASSED (reason: win_condition_met) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 8
- blocks fired: 6
- blocks never fired: 2
- coverage ratio: 6 / 8 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `){}*fu0K,,O;BSAA}BNX` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `C~xPwaEcK(hiy|^t0#9d` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 18 | fired |
| `nppt(h6#7RLNYrtK%j!$` | `battlegorithms_move_toward` | Move Toward | 9 | fired |
| `!?m28wTLYZW=bkI_SN@g` | `battlegorithms_if_sensor_matches_else` | If | 9 | fired |
| `.EB~J4azcUc|-vW)KZ9H` | `battlegorithms_if_sensor_matches_else` | If | 3 | fired |
| `8r1,S4,TW5y4Et;Giq^.` | `battlegorithms_move_toward` | Move Toward | 6 | fired |
| `2R@ww@;O*KMoF44cQzJ9` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `k=(lr1QY}#vN}[tI1{,c` | `battlegorithms_move_toward` | Move Toward | 3 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_STAY_STILL; start (7, 3); frozen no
- runner_2_Npc2: behavior GUIDED_RANDOM_MOVE_ONLY; start (8, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 1: runner_2_Npc2 chose MOVE_BACKWARD via cpu; outcome moved
  - turn 2: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 2: runner_2_Npc2 chose MOVE_DOWN_SCREEN via cpu; outcome moved
