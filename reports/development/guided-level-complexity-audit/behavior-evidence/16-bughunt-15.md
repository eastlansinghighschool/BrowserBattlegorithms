# Guided Reference Behavior Evidence: Bug Hunt: Flag Phase

## Level Identity
- order: 16
- id: `bughunt-15`
- title: Bug Hunt: Flag Phase
- category: bug hunt
- level kind: bug_hunt
- source file: `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- dossier link: [dossier](../level-dossiers/16-bughunt-15.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml`
  - turns elapsed: 18
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 18 | Team 1: 1, Team 2: 0 | 18 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-15.xml`
- run status: pass
- result: PASSED
- turns elapsed: 18
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 1, Team 2: 0
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 18
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`
- live enemy acted: yes
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
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | STAY_STILL | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | MOVE_BACKWARD | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | STAY_STILL | illegal_noop | trace data not available |
| 2 | `runner_2_Npc2` | MOVE_DOWN_SCREEN | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE_FORWARD, source=cpu) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.result (result=PASSED)
### Trace Tail
- turn 13 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 14 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 15 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 16 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 17 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 18 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_STAY_STILL; start (7, 3); frozen no
- runner_2_Npc2: behavior GUIDED_RANDOM_MOVE_ONLY; start (8, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose STAY_STILL via cpu; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose MOVE_BACKWARD via cpu; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose STAY_STILL via cpu; outcome illegal_noop
  - turn 2: runner_2_Npc2 chose MOVE_DOWN_SCREEN via cpu; outcome illegal_noop
