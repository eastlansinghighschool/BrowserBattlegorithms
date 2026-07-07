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

## Naive Solution Run Proof
- status: no naive fixture

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
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=true -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_on_my_side_else` result=false -> action `battlegorithms_move_up_screen` |
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

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 9 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 4
- blocks fired: 3
- blocks never fired: 1
- coverage ratio: 3 / 4 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `3|f4]Gon`sT5`^t^h_52` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `O@kgPCJ+.Wqu]gyYzcXW` | `battlegorithms_if_on_my_side_else` | If I Am On My Side | 9 | fired |
| `h5Ds85D9O~iHAw!GjY;y` | `battlegorithms_move_forward` | Move Forward | 5 | fired |
| `yaW7.A`R):=p|WN2y:c+` | `battlegorithms_move_up_screen` | Move Up (screen) | 4 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (991 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (991 turns remaining)
- first enemy actions: none observed
