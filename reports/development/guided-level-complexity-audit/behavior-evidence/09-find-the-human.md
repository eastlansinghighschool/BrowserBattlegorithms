# Guided Reference Behavior Evidence: Level 8: Find the Human

## Level Identity
- order: 9
- id: `find-the-human`
- title: Level 8: Find the Human
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/sensing/level-08-find-the-human.js`
- dossier link: [dossier](../level-dossiers/09-find-the-human.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/find-the-human.xml`
  - turns elapsed: 7
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 7 | Team 1: 0, Team 2: 0 | 7 | no | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/find-the-human.xml`
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
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
| 3 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward` |
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
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_up_screen`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward`
- turn 7 runner runner_1_AI_AllyP1: condition `battlegorithms_if_sensor_matches_else` result=false -> condition `battlegorithms_if_sensor_matches_else` result=true -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 7 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 6
- blocks fired: 4
- blocks never fired: 2
- coverage ratio: 4 / 6 (66.7%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `|$Za#Ni6$4C:$1|8hKp3` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `o{}?/7FSNp^^py82H_yP` | `battlegorithms_if_sensor_matches_else` | If | 7 | fired |
| `Vcx*zDS*Z%DO5k{zfLbw` | `battlegorithms_move_up_screen` | Move Up (screen) | 3 | fired |
| `:^(kgzu$CYG!vL8u$N$E` | `battlegorithms_if_sensor_matches_else` | If | 4 | fired |
| `#[lgff1eQl`fG@xV7K!8` | `battlegorithms_move_forward` | Move Forward | 4 | fired |
| `MT/(SheZ|)YQuau~rZ0G` | `battlegorithms_move_down_screen` | Move Down (screen) | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (993 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (993 turns remaining)
- first enemy actions: none observed
