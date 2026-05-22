# Guided Reference Behavior Evidence: Level 35: Barrier Specialist

## Level Identity
- order: 40
- id: `barrier-specialist`
- title: Level 35: Barrier Specialist
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js`
- dossier link: [dossier](../level-dossiers/40-barrier-specialist.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-07.xml`
  - turns elapsed: 11
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 14
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 11 | Team 1: 0, Team 2: 0 | 21 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |
| project final | documented exception | 14 | Team 1: 0, Team 2: 0 | 23 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1_2); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-07.xml`
- run status: pass
- result: PASSED
- turns elapsed: 11
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 21
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`, `PLACE_BARRIER_FORWARD`, `STAY_STILL`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | PLACE_BARRIER_FORWARD | barrier_placed | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=true -> action `battlegorithms_place_barrier` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
| 3 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
| 4 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_DOWN_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_DOWN_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (989 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
  - turn 3: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
  - turn 4: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 14
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint moves index 1 forward rather than placing a barrier; the patrolling NPC reaches the attacker's lane and freezes ally0 before it can score within the turn limit.
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 23
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
| 3 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
| 4 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 12 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 13 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (986 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
  - turn 3: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
  - turn 4: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
