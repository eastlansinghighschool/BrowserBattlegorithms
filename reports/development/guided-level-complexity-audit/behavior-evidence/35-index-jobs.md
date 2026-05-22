# Guided Reference Behavior Evidence: Level 30: Index Jobs

## Level Identity
- order: 35
- id: `index-jobs`
- title: Level 30: Index Jobs
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js`
- dossier link: [dossier](../level-dossiers/35-index-jobs.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-02.xml`
  - turns elapsed: 9
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 11
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 9 | Team 1: 0, Team 2: 0 | 18 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) |
| project final | documented exception | 11 | Team 1: 0, Team 2: 0 | 20 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-02.xml`
- run status: pass
- result: PASSED
- turns elapsed: 9
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 18
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 7 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (991 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (991 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 11
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint assigns index 0 as the primary attacker; level 30 places index 0 near the enemy flag, causing it to intercept before index 1 can score.
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 20
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `STAY_STILL`
- live enemy acted: no
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (989 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (989 turns remaining)
- first enemy actions: none observed
