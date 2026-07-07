# Guided Reference Behavior Evidence: Level 34: Freeze Support

## Level Identity
- order: 39
- id: `freeze-support`
- title: Level 34: Freeze Support
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-34-freeze-support.js`
- dossier link: [dossier](../level-dossiers/39-freeze-support.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-06.xml`
  - turns elapsed: 5
  - lastLevelResultReason: win_condition_met
- project final: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 5
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 5 | Team 1: 0, Team 2: 0 | 9 | yes | resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); flag.pickedUp (carrier=runner_1_AI_AllyP1) |
| project final | pass | 5 | Team 1: 0, Team 2: 0 | 9 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-06.xml`
- run status: pass
- result: PASSED
- turns elapsed: 5
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS)
- branch/trace evidence present: yes
- reference action count: 9
- distinct action types observed: `FREEZE_OPPONENTS`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, reason=freeze_on_cooldown, action=FREEZE_OPPONENTS); flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | FREEZE_OPPONENTS | freeze_applied | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | FREEZE_OPPONENTS | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | FREEZE_OPPONENTS | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=FREEZE_OPPONENTS, source=blockly) | resource.unavailable (runner=runner_1_AI_AllyP1_2, team=1, action=FREEZE_OPPONENTS, reason=freeze_on_cooldown) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=FREEZE_OPPONENTS, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents`
- turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents`
- turn 4 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_freeze_opponents`
- turn 5 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 1) | (8, 2) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 2) | (8, 3) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 3) | (8, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 4) | (9, 4) | MOVE (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 1 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 3 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (8, 4)) |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 4 | `freeze` | runner runner_1_AI_AllyP1_2 used Area Freeze |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (10, 4) and (9, 4)) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 5 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 7
- blocks fired: 4
- blocks never fired: 3
- coverage ratio: 4 / 7 (57.1%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `rDFY_z-4yz-~$7^$D]56` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `(89^m3GQY?OMR5}jKVp}` | `battlegorithms_if_boolean_else` | If [boolean] else | 9 | fired |
| `iWPz_e__4oRItXiZa=5Q` | `battlegorithms_value_compare` | compare | 9 | fired |
| `o9-Wu@Ixs6+QgpF(5@,J` | `battlegorithms_freeze_opponents` | Freeze Opponents | 4 | fired |
| `4go$*i0f2#lBT)8-n(DG` | `battlegorithms_move_toward` | Move Toward | 5 | fired |
| `.ZK(E,hkymka$8dZS{nm` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `3RV|]HM0{EiNj|)Ws2hz` | `battlegorithms_value_number` | number | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (8, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (995 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose MOVE via npc; outcome moved

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
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
- reference action count: 9
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 4 | `runner_2_Npc1` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 4 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 4 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 5 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 1) | (8, 2) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 2) | (8, 3) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 3) | (8, 4) | MOVE (moved) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (8, 4) | (9, 4) | MOVE (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 2 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 3 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 4 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (9, 4) and (8, 4)) |
| 4 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 5) and (10, 6)) |
| 5 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (10, 4) and (9, 4)) |
| 5 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (10, 5) and (10, 6)) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 5 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 8
- blocks never fired: 17
- coverage ratio: 8 / 25 (32.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `3(-rBC}iQ4@Snxi%=.:G` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `$BcR|J1d(%K;tOo}N[qR` | `battlegorithms_if_boolean_else` | If [boolean] else | 9 | fired |
| `?wmOm~dxL_s1w%Bb7Y7]` | `battlegorithms_value_compare` | compare | 9 | fired |
| `Cfq0:D%rlsA=v-E5[qnM` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 5 | fired |
| `I7f|~$Tm[GW.I/Jd^8FI` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 4 | fired |
| `94Z6sYjLuE?J7=$cu3lS` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `P:IwxRubJGtf[o09rQIP` | `battlegorithms_value_number` | number | 0 | never fired |
| `)aIGQb/:j7*q!NM#nfM^` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `|9m+bn/w!$C/0V6[F0L_` | `battlegorithms_move_toward` | Move Toward | 5 | fired |
| `?pJKRvR;*1unZ@7f*lI%` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `JtD_UH/{o%T$WEhhnCxG` | `battlegorithms_if_boolean_else` | If [boolean] else | 4 | fired |
| `wW0GdKf@H0;q7WuLl)73` | `battlegorithms_value_compare` | compare | 4 | fired |
| `uzd2HgioAH!Ey|uS$yE$` | `battlegorithms_move_forward` | Move Forward | 4 | fired |
| `]uSmBA-1f(LY4G(YMwG^` | `battlegorithms_if_boolean_else` | If [boolean] else | 0 | never fired |
| `=,I-Ixf`SKZFePqdacQg` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `F4RdV=q7Rl-hm)zam_[s` | `battlegorithms_value_number` | number | 0 | never fired |
| ``Sn`o,l@E{UYUw^|BCof` | `battlegorithms_value_compare` | compare | 0 | never fired |
| `TJPh]H~6Uu#)5F#lw(%Y` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `zzso0j+)KJYKR/KDO}L:` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `/%PqcB0;#FL0yOqbYDZ9` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `xtol6SJ;R;{|]=E[#/+k` | `battlegorithms_value_number` | number | 0 | never fired |
| `$[MmzHl#g_(aQe[uzbfr` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `]XYr*N=)+cULR/LGB`e#` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |
| `*(ix,iqZW-0g/RXgT[Oi` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `%L6n+C/}Ywup_bzabkG?` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (8, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (995 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 4: runner_2_Npc1 chose MOVE via npc; outcome moved
