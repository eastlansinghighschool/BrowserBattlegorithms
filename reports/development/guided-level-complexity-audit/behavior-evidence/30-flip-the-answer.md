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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=true -> boolean `battlegorithms_logic_not` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_my_side` result=false -> boolean `battlegorithms_logic_not` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
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

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (980 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (980 turns remaining)
- first enemy actions: none observed
