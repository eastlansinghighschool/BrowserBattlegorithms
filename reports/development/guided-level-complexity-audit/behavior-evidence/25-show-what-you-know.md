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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> condition `battlegorithms_if_sensor_matches` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | FREEZE_OPPONENTS | freeze_applied | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches` result=true -> condition `battlegorithms_if_area_freeze_ready_else` result=true -> action `battlegorithms_freeze_opponents` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | illegal_noop | trace data not available |
| 1 | `runner_2_Npc3` | MOVE_UP_SCREEN | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_UP_SCREEN | illegal_noop | trace data not available |
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

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 2); frozen no
- runner_2_Npc2: behavior GUIDED_STAY_STILL; start (8, 4); frozen no
- runner_2_Npc3: behavior GUIDED_VERTICAL_PATROL; start (9, 7); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose STAY_STILL via cpu; outcome illegal_noop
  - turn 1: runner_2_Npc3 chose MOVE_UP_SCREEN via cpu; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome illegal_noop
