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

## Naive Solution Run Proof
- status: no naive fixture

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
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=1 -> comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=2 -> comparison `battlegorithms_value_compare` result=true compare=2 vs 2 -> condition `battlegorithms_boolean_area_freeze_ready` result=false -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> … (+1 more) |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: value `battlegorithms_value_distance_to_target` result=3 -> comparison `battlegorithms_value_compare` result=false compare=3 vs 2 -> boolean `battlegorithms_logic_and` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 6 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 7 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 8 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 9 | `runner_2_Npc1` | MOVE | moved | trace data not available |
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

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (2, 4) | (3, 4) | MOVE (moved) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (3, 4) | (4, 4) | MOVE (moved) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (4, 4) | (5, 4) | MOVE (moved) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (5, 4) | (6, 4) | MOVE (moved) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (6, 4) | (7, 4) | MOVE (moved) |
| 11 | `runner_2_Npc1` | PATROL_INTERCEPT | (7, 4) | (8, 4) | MOVE (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (2, 4) and (3, 4)) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (2, 4) and (3, 4)) |
| 4 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (3, 4) and (2, 4)) |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 11 | `freeze` | runner runner_1_AI_AllyP1 used Area Freeze |
| 12 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 12 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 9
- blocks fired: 7
- blocks never fired: 2
- coverage ratio: 7 / 9 (77.8%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `%f.tVt/q(uS^)I;9}@fj` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `?U#3))D%t+uZ`F.]8(d:` | `battlegorithms_if_boolean_else` | If [boolean] else | 12 | fired |
| `X!A_cPj$|n+8`Bs25Upu` | `battlegorithms_logic_and` | and | 12 | fired |
| `vt!@1y%DeV9HfGDm7N.p` | `battlegorithms_freeze_opponents` | Freeze Opponents | 2 | fired |
| `^9Wl.j_Zh}Y7ob{sdwe0` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `*arI@r3)[e^F@K=_k`SK` | `battlegorithms_value_compare` | compare | 12 | fired |
| `m;I;~@hCgeqec}f@Ym@2` | `battlegorithms_boolean_area_freeze_ready` | Area Freeze is ready | 7 | fired |
| `f$YF;KUgd/Jn~N,BiDhh` | `battlegorithms_value_distance_to_target` | distance to | 12 | fired |
| `1mjf2?O83,?jLaB10-ww` | `battlegorithms_value_number` | number | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (3, 4); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (988 turns remaining)
- first enemy actions:
  - turn 6: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 7: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 8: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 9: runner_2_Npc1 chose MOVE via npc; outcome moved
