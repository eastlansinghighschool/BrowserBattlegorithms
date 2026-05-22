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
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=7 -> comparison `battlegorithms_value_compare` result=false compare=7 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=6 -> comparison `battlegorithms_value_compare` result=false compare=6 vs 5 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 6 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=5 -> comparison `battlegorithms_value_compare` result=true compare=5 vs 5 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | illegal_noop | trace data not available |
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

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (994 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 4: runner_2_Npc1 chose STAY_STILL via npc; outcome illegal_noop

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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | illegal_noop | trace data not available |
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

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (982 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 4: runner_2_Npc1 chose STAY_STILL via npc; outcome illegal_noop
