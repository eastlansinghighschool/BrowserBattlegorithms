# Guided Reference Behavior Evidence: Level 32: Escort The Carrier

## Level Identity
- order: 37
- id: `escort-the-carrier`
- title: Level 32: Escort The Carrier
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js`
- dossier link: [dossier](../level-dossiers/37-escort-the-carrier.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-04.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 6
  - lastLevelResultReason: match_ended_without_level_win_condition_satisfied

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 3 | Team 1: 0, Team 2: 0 | 6 | no | none observed |
| project final | documented exception | 6 | Team 1: 1, Team 2: 0 | 11 | no | team.scored |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-04.xml`
- run status: pass
- result: PASSED
- turns elapsed: 3
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 6
- distinct action types observed: `MOVE_FORWARD`, `STAY_STILL`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | STAY_STILL | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | STAY_STILL | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | STAY_STILL | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 3 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 6
- activeLevelResult: FAILED
- lastLevelResultReason: match_ended_without_level_win_condition_satisfied
- team scores: Team 1: 1, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint uses the later role-composition shape and does not fully recreate the escort-specific pathing setup.
- score / blocked-scoring events: team.scored
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 11
- distinct action types observed: `MOVE_BACKWARD`, `STAY_STILL`
- live enemy acted: no
- enemy interaction events: team.scored
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | STAY_STILL | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | STAY_STILL | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.forcedFailedAtGameOver (reason=match_ended_without_level_win_condition_satisfied) | level.result (result=FAILED)
### Trace Tail
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 6 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (994 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (994 turns remaining)
- first enemy actions: none observed
