# Guided Reference Behavior Evidence: Level 31: First Two Defend

## Level Identity
- order: 36
- id: `first-two-defend`
- title: Level 31: First Two Defend
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js`
- dossier link: [dossier](../level-dossiers/36-first-two-defend.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-03.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 13
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 3 | Team 1: 0, Team 2: 0 | 9 | no | none observed |
| project final | documented exception | 13 | Team 1: 0, Team 2: 0 | 36 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-03.xml`
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
- reference action count: 9
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_UP_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_UP_SCREEN | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 2 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_up_screen`
- turn 3 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 2 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_forward`

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
- executable block count: 7
- blocks fired: 4
- blocks never fired: 3
- coverage ratio: 4 / 7 (57.1%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `GR8%IufeCMo|HwyusVg.` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `c9w=g/W/{`ImM|72SEo+` | `battlegorithms_if_boolean_else` | If [boolean] else | 9 | fired |
| `SF4N}r9PH013ghEMl+}o` | `battlegorithms_value_compare` | compare | 9 | fired |
| `Xc@1=}V]F]jL+O%syB}1` | `battlegorithms_move_up_screen` | Move Up (screen) | 6 | fired |
| `eIa;*nV}bD1~uH7D`Hh:` | `battlegorithms_move_forward` | Move Forward | 3 | fired |
| `sXUKdZEBr_s)e8(N00+6` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `G?dO{X[5;?QBZvL2RtL4` | `battlegorithms_value_number` | number | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 13
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint keeps the later role split rather than matching the earlier defender timing exactly.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 36
- distinct action types observed: `JUMP_FORWARD`, `MOVE_FORWARD`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 1 | `runner_1_AI_AllyP1_3` | JUMP_FORWARD | jumped | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | bounced | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | bounced | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=barrier) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 11 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 12 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 12 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (3, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (5, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_3 bounced (cell occupied) trying to reach (4, 4) |
| 13 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 13
- blocks never fired: 12
- coverage ratio: 13 / 25 (52.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `{RGa-RQaN!f{7Jy^x?R.` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `N)nP!Pmb%he!w2KNr4(-` | `battlegorithms_if_boolean_else` | If [boolean] else | 36 | fired |
| `8]U.;_Lo;6BkzObmNKl3` | `battlegorithms_value_compare` | compare | 36 | fired |
| `548CSQvvAb,O,DR{W.Is` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 12 | fired |
| `3eDwR_;PB|xU5fN(ybss` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 24 | fired |
| `u5Yh?SMlvVO5VFro!j,O` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `9i/A0!qb(7yBZT/5c1m8` | `battlegorithms_value_number` | number | 0 | never fired |
| `wr:He(OwMB4XG#)fc@4g` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `;]~c2MevDe{WS{`eI143` | `battlegorithms_move_toward` | Move Toward | 12 | fired |
| `BtYc@I~%o_o`S+_ICPt*` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `3+{bL~)HGy)%S=4]$`*^` | `battlegorithms_if_boolean_else` | If [boolean] else | 24 | fired |
| `%3l`{Fz,;ifQxN-fn`UW` | `battlegorithms_value_compare` | compare | 24 | fired |
| `T%VyL}#vlP%54)0gST{=` | `battlegorithms_move_forward` | Move Forward | 12 | fired |
| `9)#NeEa,~=gBy?HW~Q.F` | `battlegorithms_if_boolean_else` | If [boolean] else | 12 | fired |
| `z=.wP-F02~={A5U$EW:d` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `#PrRs2_Cc27z|]]$e06:` | `battlegorithms_value_number` | number | 0 | never fired |
| `E^lVN%8FtdIA/1kF;#k[` | `battlegorithms_value_compare` | compare | 12 | fired |
| `M%UJ%`C!~1G2%0JJ%Zm7` | `battlegorithms_if_can_jump_else` | If I Can Jump | 12 | fired |
| `X-wiD8)5^Z+*q*%_ZlKB` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `9!-PsqTEOs)G:qsBH`#5` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `HV2o?Hh2s0.~sKmRtKr.` | `battlegorithms_value_number` | number | 0 | never fired |
| `V|U}ivT1o/CaJa8(76UH` | `battlegorithms_jump_forward` | Jump Forward | 1 | fired |
| `DZxS247c.fE(QRcHIa,n` | `battlegorithms_move_forward` | Move Forward | 11 | fired |
| `xB5[$EwgX/9h5-.+VA[5` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `Q+@23hVnwuhs3?WE@XD)` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (987 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (987 turns remaining)
- first enemy actions: none observed
