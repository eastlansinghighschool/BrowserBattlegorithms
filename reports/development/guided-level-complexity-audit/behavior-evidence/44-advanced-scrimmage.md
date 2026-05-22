# Guided Reference Behavior Evidence: Challenge 37: Advanced Scrimmage

## Level Identity
- order: 44
- id: `advanced-scrimmage`
- title: Challenge 37: Advanced Scrimmage
- category: project
- level kind: challenge
- source file: `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- dossier link: [dossier](../level-dossiers/44-advanced-scrimmage.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
  - turns elapsed: 56
  - lastLevelResultReason: turn_limit_exceeded
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 56
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | documented exception | 56 | Team 1: 0, Team 2: 0 | 70 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) |
| project final | documented exception | 56 | Team 1: 0, Team 2: 0 | 70 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 56
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The step-09 fixture for advanced-scrimmage has not yet been tuned to the current NPC layout (NPC2 at (10,4) guards the flag at (11,4), making the direct escape route unavailable to simple scripts). A reliable capstone solution is pending.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 70
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | stayed | turn 2 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | illegal_noop | trace data not available |
| 1 | `runner_2_Npc3` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc3, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 50 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 51 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 52 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 53 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 54 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 55 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (9, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 4); frozen no
- runner_2_Npc3: behavior PATROL_INTERCEPT; start (9, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose STAY_STILL via npc; outcome illegal_noop
  - turn 1: runner_2_Npc3 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 56
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint is role-based but still short of the final scrimmage's full live-board timing.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 70
- distinct action types observed: `JUMP_FORWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 1 | `runner_1_AI_AllyP1_3` | JUMP_FORWARD | stayed | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | illegal_noop | trace data not available |
| 1 | `runner_2_Npc3` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc3, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 50 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 51 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 52 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 53 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 54 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 55 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (9, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 4); frozen no
- runner_2_Npc3: behavior PATROL_INTERCEPT; start (9, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose STAY_STILL via npc; outcome illegal_noop
  - turn 1: runner_2_Npc3 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
