# Guided Reference Behavior Evidence: Bug Hunt: Boolean Trap

## Level Identity
- order: 32
- id: `bughunt-28`
- title: Bug Hunt: Boolean Trap
- category: bug hunt
- level kind: bug_hunt
- source file: `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`
- dossier link: [dossier](../level-dossiers/32-bughunt-28.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-28.xml`
  - turns elapsed: 12
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 12 | Team 1: 0, Team 2: 0 | 12 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/bughunt-28.xml`
- run status: pass
- result: PASSED
- turns elapsed: 12
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 12
- distinct action types observed: `FREEZE_OPPONENTS`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | FREEZE_OPPONENTS | freeze_applied | turn 1 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=true -> boolean `battlegorithms_logic_and` result=true -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 6 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 6 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 7 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 8 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 9 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=FREEZE_OPPONENTS, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=FREEZE_OPPONENTS, outcome=freeze_applied)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 7 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=true -> boolean `battlegorithms_logic_and` result=true -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 12 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more)

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (3, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (988 turns remaining)
- first enemy actions:
  - turn 6: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 7: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 8: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 9: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
