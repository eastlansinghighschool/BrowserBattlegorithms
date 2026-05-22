# Guided Reference Behavior Evidence: Level 20: My Side, Their Side

## Level Identity
- order: 22
- id: `my-side-their-side`
- title: Level 20: My Side, Their Side
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
- dossier link: [dossier](../level-dossiers/22-my-side-their-side.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml`
  - turns elapsed: 9
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 9 | Team 1: 0, Team 2: 0 | 9 | no | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml`
- run status: pass
- result: PASSED
- turns elapsed: 9
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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | illegal_noop | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen` |
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
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen`
- turn 8 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen`
- turn 9 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (991 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (991 turns remaining)
- first enemy actions: none observed
