# Guided Reference Behavior Evidence: Level 26: This Or That

## Level Identity
- order: 29
- id: `this-or-that`
- title: Level 26: This Or That
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`
- dossier link: [dossier](../level-dossiers/29-this-or-that.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-04.xml`
  - turns elapsed: 7
  - lastLevelResultReason: win_condition_met
- project final: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - turns elapsed: 7
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 7 | Team 1: 0, Team 2: 0 | 7 | no | none observed |
| project final | pass | 7 | Team 1: 0, Team 2: 0 | 7 | no | none observed |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-04.xml`
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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=true -> boolean `battlegorithms_logic_or` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=true -> boolean `battlegorithms_logic_or` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
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
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=true -> boolean `battlegorithms_logic_or` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=true -> boolean `battlegorithms_logic_or` result=true -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_on_enemy_side` result=false -> condition `battlegorithms_boolean_sensor_matches` result=false -> boolean `battlegorithms_logic_or` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen yes (993 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (993 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
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
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (6, 4); frozen yes (993 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (993 turns remaining)
- first enemy actions: none observed
