# Guided Reference Behavior Evidence: Level 11: Shortcut Block - Move Toward the Flag

## Level Identity
- order: 12
- id: `move-toward-flag`
- title: Level 11: Shortcut Block - Move Toward the Flag
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`
- dossier link: [dossier](../level-dossiers/12-move-toward-flag.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/move-toward-flag.xml`
  - turns elapsed: 13
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 13 | Team 1: 0, Team 2: 0 | 13 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/move-toward-flag.xml`
- run status: pass
- result: PASSED
- turns elapsed: 13
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 13
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 4 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 5 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 6 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 8 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1: action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 1); frozen yes (987 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (987 turns remaining)
- first enemy actions: none observed
