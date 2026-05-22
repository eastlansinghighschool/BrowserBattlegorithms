# Guided Reference Behavior Evidence: Level 31: First Two Defend

## Level Identity
- order: 36
- id: `first-two-defend`
- title: Level 31: First Two Defend
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js`
- dossier link: [dossier](../level-dossiers/36-first-two-defend.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-03.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 13
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 3 | Team 1: 0, Team 2: 0 | 9 | no | none observed |
| project final | documented exception | 13 | Team 1: 0, Team 2: 0 | 36 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-03.xml`
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
- reference action count: 9
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_UP_SCREEN | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_UP_SCREEN | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 3 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 13
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint keeps the later role split rather than matching the earlier defender timing exactly.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 36
- distinct action types observed: `JUMP_FORWARD`, `MOVE_FORWARD`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 1 | `runner_1_AI_AllyP1_3` | JUMP_FORWARD | jumped | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | stayed | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | stayed | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | stayed | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 11 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 12 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 12 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (987 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (987 turns remaining)
- first enemy actions: none observed
