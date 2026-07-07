# Guided Reference Behavior Evidence: Level 32: Escort The Carrier

## Level Identity
- order: 37
- id: `escort-the-carrier`
- title: Level 32: Escort The Carrier
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js`
- dossier link: [dossier](../level-dossiers/37-escort-the-carrier.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-04.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 6
  - lastLevelResultReason: match_ended_without_level_win_condition_satisfied

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 3 | Team 1: 0, Team 2: 0 | 6 | no | none observed |
| project final | documented exception | 6 | Team 1: 1, Team 2: 0 | 11 | no | team.scored |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-04.xml`
- run status: pass
- result: PASSED
- turns elapsed: 3
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 6
- distinct action types observed: `MOVE_FORWARD`, `STAY_STILL`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | STAY_STILL | stayed | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | STAY_STILL | stayed | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | STAY_STILL | stayed | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_teammate_has_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_stay_still`
- turn 3 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_teammate_has_flag` result=true -> condition `battlegorithms_if_boolean_else` result=true -> comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 3 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 10
- blocks fired: 6
- blocks never fired: 4
- coverage ratio: 6 / 10 (60.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 6 | fired |
| `boolean_teammate_has_flag_1` | `battlegorithms_boolean_teammate_has_flag` | teammate has enemy flag | 6 | fired |
| `if_boolean_else_2` | `battlegorithms_if_boolean_else` | If [boolean] else | 3 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 3 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 3 | fired |
| `stay_still_1` | `battlegorithms_stay_still` | Stay Still | 3 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 6
- activeLevelResult: FAILED
- lastLevelResultReason: match_ended_without_level_win_condition_satisfied
- team scores: Team 1: 1, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint uses the later role-composition shape and does not fully recreate the escort-specific pathing setup.
- score / blocked-scoring events: team.scored
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 11
- distinct action types observed: `MOVE_BACKWARD`, `STAY_STILL`
- live enemy acted: no
- enemy interaction events: team.scored
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | STAY_STILL | stayed | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | STAY_STILL | stayed | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | team.scored | level.forcedFailedAtGameOver (reason=match_ended_without_level_win_condition_satisfied) | level.result (result=FAILED)
### Trace Tail
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 5 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 6 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `team.scored` | team 1 scored a point |
| 6 | `level.result` | level result: FAILED (reason: match_ended_without_level_win_condition_satisfied) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 6
- blocks never fired: 19
- coverage ratio: 6 / 25 (24.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 11 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 11 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 6 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 6 | fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `if_teammate_has_flag_else_1` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 5 | fired |
| `move_toward_3` | `battlegorithms_move_toward` | Move Toward | 5 | fired |
| `if_boolean_else_2` | `battlegorithms_if_boolean_else` | If [boolean] else | 0 | never fired |
| `value_compare_2` | `battlegorithms_value_compare` | compare | 0 | never fired |
| `value_runner_index_2` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_2` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |
| `if_boolean_else_3` | `battlegorithms_if_boolean_else` | If [boolean] else | 0 | never fired |
| `value_compare_3` | `battlegorithms_value_compare` | compare | 0 | never fired |
| `value_runner_index_3` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_3` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_can_jump_else_1` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `jump_forward_1` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `move_forward_2` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |
| `if_can_jump_else_2` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `jump_forward_2` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `move_forward_3` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (994 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (994 turns remaining)
- first enemy actions: none observed
