# Guided Reference Behavior Evidence: Level 13: Enemy Nearby

## Level Identity
- order: 14
- id: `enemy-nearby`
- title: Level 13: Enemy Nearby
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js`
- dossier link: [dossier](../level-dossiers/14-enemy-nearby.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/enemy-nearby.xml`
  - turns elapsed: 8
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 8 | Team 1: 0, Team 2: 0 | 8 | yes | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/enemy-nearby.xml`
- run status: pass
- result: PASSED
- turns elapsed: 8
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 8
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: yes
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 2 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 3 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
| 4 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 8 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc1` | GUIDED_GUARD | (7, 4) | (7, 4) | STAY_STILL (stayed) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 8 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 4
- blocks fired: 3
- blocks never fired: 1
- coverage ratio: 3 / 4 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_sensor_matches_else_1` | `battlegorithms_if_sensor_matches_else` | If | 8 | fired |
| `move_up_screen_1` | `battlegorithms_move_up_screen` | Move Up (screen) | 2 | fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 6 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_GUARD; start (7, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (992 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 2: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 3: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
  - turn 4: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
