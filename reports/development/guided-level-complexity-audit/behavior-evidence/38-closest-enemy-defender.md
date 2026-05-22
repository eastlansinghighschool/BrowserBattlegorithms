# Guided Reference Behavior Evidence: Level 33: Closest Enemy Defender

## Level Identity
- order: 38
- id: `closest-enemy-defender`
- title: Level 33: Closest Enemy Defender
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js`
- dossier link: [dossier](../level-dossiers/38-closest-enemy-defender.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-05.xml`
  - turns elapsed: 10
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 19
  - lastLevelResultReason: turn_limit_exceeded

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 10 | Team 1: 0, Team 2: 0 | 19 | yes | runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) |
| project final | documented exception | 19 | Team 1: 0, Team 2: 0 | 17 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-05.xml`
- run status: pass
- result: PASSED
- turns elapsed: 10
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 19
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | stayed | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | stayed | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 1 | `runner_2_Npc2` | MOVE | stayed | trace data not available |
| 2 | `runner_2_Npc2` | MOVE | stayed | trace data not available |
| 3 | `runner_2_Npc2` | MOVE | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_BACKWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_BACKWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (4, 2); frozen yes (1 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (3, 2); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 1: runner_2_Npc2 chose MOVE via npc; outcome stayed
  - turn 2: runner_2_Npc2 chose MOVE via npc; outcome stayed
  - turn 3: runner_2_Npc2 chose MOVE via npc; outcome stayed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 19
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint sends index 1 forward rather than toward the closest enemy; the repositioned NPCs on the player's side reach the player's flag and alter midfield state before index 0 can score within the turn limit.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 17
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_2, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_2_Npc2, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | illegal_noop | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 1 | `runner_2_Npc2` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | illegal_noop | trace data not available |
| 2 | `runner_2_Npc2` | MOVE | illegal_noop | trace data not available |
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 6 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 7 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward`
- turn 11 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)
- turn 15 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more)

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (4, 2); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (3, 2); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 1: runner_2_Npc2 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome illegal_noop
  - turn 2: runner_2_Npc2 chose MOVE via npc; outcome illegal_noop
