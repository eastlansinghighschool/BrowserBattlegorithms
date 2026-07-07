# Guided Reference Behavior Evidence: Level 27: Flip The Answer

## Level Identity
- order: 30
- id: `flip-the-answer`
- title: Level 27: Flip The Answer
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js`
- dossier link: [dossier](../level-dossiers/30-flip-the-answer.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-05.xml`
  - turns elapsed: 7
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - turns elapsed: 20
  - lastLevelResultReason: match_ended_without_level_win_condition_satisfied

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 7 | Team 1: 0, Team 2: 0 | 7 | no | none observed |
| project final | documented exception | 20 | Team 1: 1, Team 2: 0 | 20 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-05.xml`
- run status: pass
- result: PASSED
- turns elapsed: 7
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 7
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=false -> boolean `battlegorithms_logic_not` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=false -> boolean `battlegorithms_logic_not` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=false -> boolean `battlegorithms_logic_not` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 7 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 6
- blocks fired: 5
- blocks never fired: 1
- coverage ratio: 5 / 6 (83.3%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `D]yFvV|Olydwh*K3ltB$` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `~pr3a#8aW,uC(9eQ.3K_` | `battlegorithms_if_boolean_else` | If [boolean] else | 7 | fired |
| `ZX`Kft}nGQH(EA9DCvea` | `battlegorithms_logic_not` | not | 7 | fired |
| `MI+cr,L~7$8zN;,TuD=C` | `battlegorithms_move_up_screen` | Move Up (screen) | 2 | fired |
| `ZngvlLL#oAhYAQ*tB49j` | `battlegorithms_move_forward` | Move Forward | 5 | fired |
| `~F4B%)ej=da_NYTS5X]d` | `battlegorithms_boolean_on_my_side` | I am on my side | 7 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (993 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (993 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 20
- activeLevelResult: FAILED
- lastLevelResultReason: match_ended_without_level_win_condition_satisfied
- team scores: Team 1: 1, Team 2: 0
- documented exception: The cumulative Strategy Brain checkpoint keeps the later project shape instead of backtracking into the NOT lesson's intermediate routing.
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 20
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`
- live enemy acted: no
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
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.forcedFailedAtGameOver (reason=match_ended_without_level_win_condition_satisfied) | level.result (result=FAILED)
### Trace Tail
- turn 15 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 16 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 17 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 18 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 19 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 20 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 10 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 20 | `team.scored` | team 1 scored a point |
| 20 | `level.result` | level result: FAILED (reason: match_ended_without_level_win_condition_satisfied) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 6
- blocks fired: 4
- blocks never fired: 2
- coverage ratio: 4 / 6 (66.7%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `PYr#2i*$UI__6a{HiK#U` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `78,CD[WYPbp,gRXdXiVT` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 20 | fired |
| `p`f|,Tq577j=g(.HH7aL` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `V8AE;jWFSf/liPp[`:8u` | `battlegorithms_if_sensor_matches_else` | If | 10 | fired |
| `VHHFaKvJw-Tvt.wH$T_:` | `battlegorithms_move_up_screen` | Move Up (screen) | 0 | never fired |
| `k()C4?0K%bSgk~:TBl38` | `battlegorithms_move_toward` | Move Toward | 10 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (980 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (980 turns remaining)
- first enemy actions: none observed
