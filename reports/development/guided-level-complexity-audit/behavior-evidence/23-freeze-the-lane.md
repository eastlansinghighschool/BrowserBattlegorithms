# Guided Reference Behavior Evidence: Level 21: Freeze the Lane

## Level Identity
- order: 23
- id: `freeze-the-lane`
- title: Level 21: Freeze the Lane
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- dossier link: [dossier](../level-dossiers/23-freeze-the-lane.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml`
  - turns elapsed: 5
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 5 | Team 1: 0, Team 2: 0 | 5 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml`
- run status: pass
- result: PASSED
- turns elapsed: 5
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 5
- distinct action types observed: `FREEZE_OPPONENTS`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | FREEZE_OPPONENTS | freeze_applied | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=true -> action `battlegorithms_freeze_opponents` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 3 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 4 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=true -> action `battlegorithms_freeze_opponents`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_area_freeze_ready_else` result=false -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (7, 3); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (995 turns remaining)
- first enemy actions:
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 4: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
