# Guided Reference Behavior Evidence: Level 35: Barrier Specialist

## Level Identity
- order: 40
- id: `barrier-specialist`
- title: Level 35: Barrier Specialist
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js`
- dossier link: [dossier](../level-dossiers/40-barrier-specialist.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-07.xml`
  - turns elapsed: 11
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 14
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 11 | Team 1: 0, Team 2: 0 | 21 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1) |
| project final | documented exception | 14 | Team 1: 0, Team 2: 0 | 23 | yes | flag.pickedUp (carrier=runner_1_AI_AllyP1_2); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-07.xml`
- run status: pass
- result: PASSED
- turns elapsed: 11
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 21
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`, `PLACE_BARRIER_FORWARD`, `STAY_STILL`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | PLACE_BARRIER_FORWARD | barrier_placed | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=true -> action `battlegorithms_place_barrier` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
| 4 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_DOWN_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_DOWN_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_can_place_barrier_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 0) | MOVE_UP_SCREEN (moved) |
| 2 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 0) | (7, 1) | MOVE_DOWN_SCREEN (moved) |
| 3 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 2) | MOVE_DOWN_SCREEN (moved) |
| 4 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 3) | MOVE_DOWN_SCREEN (moved) |
| 5 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 3) | (7, 2) | MOVE_UP_SCREEN (moved) |
| 6 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 1) | MOVE_UP_SCREEN (moved) |
| 7 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 0) | MOVE_UP_SCREEN (moved) |
| 8 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 0) | (7, 1) | MOVE_DOWN_SCREEN (moved) |
| 9 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 2) | MOVE_DOWN_SCREEN (moved) |
| 10 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 3) | MOVE_DOWN_SCREEN (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 11 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (11, 4) |
| 11 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 9
- blocks fired: 6
- blocks never fired: 3
- coverage ratio: 6 / 9 (66.7%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `14_}aBsB4NnVJ78LOUeK` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `ScY$pJSD4FOuE^cdKaex` | `battlegorithms_if_boolean_else` | If [boolean] else | 21 | fired |
| `(z@Q,9C9K_N_/;M-,^zN` | `battlegorithms_value_compare` | compare | 21 | fired |
| `S[jf-:yc@ZlN2A^3V8U3` | `battlegorithms_if_can_place_barrier_else` | If I Can Place Barrier | 10 | fired |
| `h)qm^R{{9+gp8ZfRa^`9` | `battlegorithms_move_toward` | Move Toward | 11 | fired |
| `)faq$-vEuBI1/vT_b%Wd` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `)%AN,!p#hB:)YuRj;G+E` | `battlegorithms_value_number` | number | 0 | never fired |
| `~G*Y4O=;JV21rssDq-R{` | `battlegorithms_place_barrier` | Place Barrier (in front) | 1 | fired |
| `Rx[oUGqExyqwRUG#6.2p` | `battlegorithms_move_toward` | Move Toward | 9 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (989 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved
  - turn 4: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 14
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint moves index 1 forward rather than placing a barrier; the patrolling NPC reaches the attacker's lane and freezes ally0 before it can score within the turn limit.
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 23
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds)
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
| 1 | `runner_2_Npc1` | MOVE_UP_SCREEN | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
| 3 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
| 4 | `runner_2_Npc1` | MOVE_DOWN_SCREEN | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 11 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 12 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 12 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 13 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 13 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 0) | MOVE_UP_SCREEN (moved) |
| 2 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 0) | (7, 1) | MOVE_DOWN_SCREEN (moved) |
| 3 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 1) | (7, 2) | MOVE_DOWN_SCREEN (moved) |
| 4 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 2) | (7, 3) | MOVE_DOWN_SCREEN (moved) |
| 5 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 3) | (7, 4) | MOVE_DOWN_SCREEN (moved) |
| 6 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 4) | (7, 5) | MOVE_DOWN_SCREEN (moved) |
| 7 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 5) | (7, 6) | MOVE_DOWN_SCREEN (moved) |
| 8 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 6) | (7, 7) | MOVE_DOWN_SCREEN (moved) |
| 9 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 7) | (7, 6) | MOVE_UP_SCREEN (moved) |
| 10 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 6) | (7, 5) | MOVE_UP_SCREEN (moved) |
| 11 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 5) | (7, 4) | MOVE_UP_SCREEN (moved) |
| 12 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 4) | (7, 3) | MOVE_UP_SCREEN (moved) |
| 13 | `runner_2_Npc1` | GUIDED_VERTICAL_PATROL | (7, 3) | (7, 2) | MOVE_UP_SCREEN (moved) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 5 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (11, 4) |
| 6 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 5) and (7, 4)) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (7, 4) and (7, 5)) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1 bounced (cell occupied) trying to reach (11, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_2 bounced trying to reach (12, 4) |
| 14 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 8
- blocks never fired: 17
- coverage ratio: 8 / 25 (32.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `09-!N@WE/[3WO]b5U;eM` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `u]|!?OE6*.|ij7CmR_-l` | `battlegorithms_if_boolean_else` | If [boolean] else | 23 | fired |
| `{;Gq(31=vSRy_LzfYO_A` | `battlegorithms_value_compare` | compare | 23 | fired |
| `M%dm[5M/jI0sr0_i}MYe` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 10 | fired |
| `Fvc9ZGk`bxz~f}5Z3bI`` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 13 | fired |
| ``Ss!43GR0{3(JvCIasfY` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `ujDV2MmR9nUWQ=,.])Jc` | `battlegorithms_value_number` | number | 0 | never fired |
| `f5w|8bOGdS^DhmveAf*d` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `uH^c87r#wd`MNt*GG(!w` | `battlegorithms_move_toward` | Move Toward | 10 | fired |
| `R9i){ST%ehJ%gWT`Q!^V` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `p|+K[Jyp{_tTT/Ghi0m1` | `battlegorithms_if_boolean_else` | If [boolean] else | 13 | fired |
| `8IhxBLMS;cVSvx|(zj3{` | `battlegorithms_value_compare` | compare | 13 | fired |
| `v:zqXa#*.H.]}Al6k1!a` | `battlegorithms_move_forward` | Move Forward | 13 | fired |
| `{BjoUFHJ337:q}^N66Wm` | `battlegorithms_if_boolean_else` | If [boolean] else | 0 | never fired |
| `c0f.]292PeGbTey$5v+_` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `6z*:2LvAn}SL4VVQqXQU` | `battlegorithms_value_number` | number | 0 | never fired |
| `isa@*AFPPx}3|lir5ALy` | `battlegorithms_value_compare` | compare | 0 | never fired |
| `=%)!x-%ZnK;swV]|3jJ$` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `od,Bp4{_/tY:LTJlveWq` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `)w:_..su[/^?K4vl^~,9` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `XJ=dLSRhT:,u4E/fLS-i` | `battlegorithms_value_number` | number | 0 | never fired |
| `/LW)pc-CTN,!+/f!I5#6` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `g7RJww;o2y7l];3e@^==` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |
| `6(S*$@F(3keQ.HFv,zXb` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `)2,8O24q)@rALoB},X3x` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_VERTICAL_PATROL; start (7, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (986 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE_UP_SCREEN via cpu; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved
  - turn 3: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved
  - turn 4: runner_2_Npc1 chose MOVE_DOWN_SCREEN via cpu; outcome moved
