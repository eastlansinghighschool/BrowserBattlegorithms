# Guided Reference Behavior Evidence: Level 36: Jump Team

## Level Identity
- order: 41
- id: `jump-team`
- title: Level 36: Jump Team
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-36-jump-team.js`
- dossier link: [dossier](../level-dossiers/41-jump-team.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-08.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 16
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 3 | Team 1: 0, Team 2: 0 | 5 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) |
| project final | documented exception | 16 | Team 1: 0, Team 2: 0 | 30 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-08.xml`
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
- reference action count: 5
- distinct action types observed: `JUMP_FORWARD`, `MOVE_DOWN_SCREEN`, `MOVE_FORWARD`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | JUMP_FORWARD | jumped | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=true -> action `battlegorithms_jump_forward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_DOWN_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_down_screen` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_DOWN_SCREEN | bounced | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_down_screen` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_DOWN_SCREEN, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_DOWN_SCREEN, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=true -> action `battlegorithms_jump_forward`
- turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_down_screen`
- turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward`
- turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_down_screen`
- turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 2 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (1, 8) |
| 3 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 9
- blocks fired: 6
- blocks never fired: 3
- coverage ratio: 6 / 9 (66.7%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 5 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 5 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_can_jump_else_1` | `battlegorithms_if_can_jump_else` | If I Can Jump | 3 | fired |
| `jump_forward_1` | `battlegorithms_jump_forward` | Jump Forward | 1 | fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 2 | fired |
| `move_down_screen_1` | `battlegorithms_move_down_screen` | Move Down (screen) | 2 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 16
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint keeps the later role structure instead of re-specializing for the isolated jump lesson.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 30
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | bounced | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=barrier) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 13 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 14 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 14 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 15 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 15 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 1 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 2 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 3 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 8 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 9 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 10 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 11 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 12 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 13 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 14 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 15 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 6) and (10, 6)) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (2, 4) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_2 bounced (cell occupied) trying to reach (10, 6) |
| 16 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 8
- blocks never fired: 17
- coverage ratio: 8 / 25 (32.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 30 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 30 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 15 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 15 | fired |
| `if_teammate_has_flag_else_1` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 15 | fired |
| `move_toward_3` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `if_boolean_else_2` | `battlegorithms_if_boolean_else` | If [boolean] else | 15 | fired |
| `value_compare_2` | `battlegorithms_value_compare` | compare | 15 | fired |
| `value_runner_index_2` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_2` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 15 | fired |
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
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (984 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (984 turns remaining)
- first enemy actions: none observed
