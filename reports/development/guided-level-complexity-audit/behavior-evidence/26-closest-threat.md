# Guided Reference Behavior Evidence: Level 23: Closest Threat

## Level Identity
- order: 26
- id: `closest-threat`
- title: Level 23: Closest Threat
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`
- dossier link: [dossier](../level-dossiers/26-closest-threat.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-01.xml`
  - turns elapsed: 5
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
  - turns elapsed: 16
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 5 | Team 1: 0, Team 2: 0 | 5 | no | none observed |
| project final | documented exception | 16 | Team 1: 0, Team 2: 0 | 15 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/step-01.xml`
- run status: pass
- result: PASSED
- turns elapsed: 5
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 5
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 2 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 4 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
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
- turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 2 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 3 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (5, 2); frozen yes (995 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (995 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 16
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Strategy Brain checkpoint keeps the later project shape instead of recreating the exact introductory intercept timing from the first project lesson.
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 15
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
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
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 10 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 11 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 14 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 15 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (5, 2); frozen yes (984 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (984 turns remaining)
- first enemy actions: none observed
