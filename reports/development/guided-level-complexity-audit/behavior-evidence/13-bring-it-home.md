# Guided Reference Behavior Evidence: Level 12: Bring It Home

## Level Identity
- order: 13
- id: `bring-it-home`
- title: Level 12: Bring It Home
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`
- dossier link: [dossier](../level-dossiers/13-bring-it-home.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/bring-it-home.xml`
  - turns elapsed: 21
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 21 | Team 1: 1, Team 2: 0 | 21 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/bring-it-home.xml`
- run status: pass
- result: PASSED
- turns elapsed: 21
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 1, Team 2: 0
- score / blocked-scoring events: team.scored
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 21
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1); team.scored
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.result (result=PASSED)
### Trace Tail
- turn 16 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 17 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 18 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 19 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 20 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 21 runner runner_1_AI_AllyP1: condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 12 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 3) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (10, 3) and (10, 2)) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (10, 3) and (10, 2)) |
| 21 | `team.scored` | team 1 scored a point |
| 21 | `level.result` | level result: PASSED (reason: win_condition_met) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 4
- blocks fired: 3
- blocks never fired: 1
- coverage ratio: 3 / 4 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `hAa_i^A8910,1@S7mNC1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `zy]ht,e7hV7BKaFQWNqy` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 21 | fired |
| `U~Rp/Aj_C=!iI;Tvh%qX` | `battlegorithms_move_toward` | Move Toward | 9 | fired |
| `Kx8Bs^mHmq@6:lAK,|2U` | `battlegorithms_move_toward` | Move Toward | 12 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (979 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (979 turns remaining)
- first enemy actions: none observed
