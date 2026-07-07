# Guided Reference Behavior Evidence: Level 30: Index Jobs

## Level Identity
- order: 35
- id: `index-jobs`
- title: Level 30: Index Jobs
- category: project
- level kind: not found
- source file: `src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js`
- dossier link: [dossier](../level-dossiers/35-index-jobs.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: pass
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-02.xml`
  - turns elapsed: 9
  - lastLevelResultReason: win_condition_met
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 11
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | pass | 9 | Team 1: 0, Team 2: 0 | 18 | no | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) |
| project final | documented exception | 11 | Team 1: 0, Team 2: 0 | 20 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-02.xml`
- run status: pass
- result: PASSED
- turns elapsed: 9
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 18
- distinct action types observed: `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds); runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 3 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen` |
| 3 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1, team=1, reason=out_of_bounds) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=stayed)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1_2, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 7 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 7 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=false compare=0 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_up_screen`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 6 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 7 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 8 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `bounce` | runner runner_1_AI_AllyP1 bounced trying to reach (7, -1) |
| 9 | `flag.pickedUp` | runner runner_1_AI_AllyP1_2 picked up flag 2 at (10, 5) |
| 9 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 7
- blocks fired: 4
- blocks never fired: 3
- coverage ratio: 4 / 7 (57.1%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 18 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 18 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 9 | fired |
| `move_up_screen_1` | `battlegorithms_move_up_screen` | Move Up (screen) | 9 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (991 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (991 turns remaining)
- first enemy actions: none observed

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 11
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint assigns index 0 as the primary attacker; level 30 places index 0 near the enemy flag, causing it to intercept before index 1 can score.
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 20
- distinct action types observed: `MOVE_BACKWARD`, `MOVE_FORWARD`, `STAY_STILL`
- live enemy acted: no
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
| 3 | `runner_1_AI_AllyP1_2` | MOVE_BACKWARD | moved | turn 3 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- level.result (result=FAILED)
### Trace Tail
- turn 8 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 8 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 9 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=true -> action `battlegorithms_move_toward`
- turn 10 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=true -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (10, 5) and (10, 6)) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 3 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 5) |
| 4 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1 (at (10, 5) and (10, 6)) |
| 11 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 10
- blocks never fired: 15
- coverage ratio: 10 / 25 (40.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 20 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 20 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 10 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 7 | fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 3 | fired |
| `if_teammate_has_flag_else_1` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 10 | fired |
| `move_toward_3` | `battlegorithms_move_toward` | Move Toward | 8 | fired |
| `if_boolean_else_2` | `battlegorithms_if_boolean_else` | If [boolean] else | 2 | fired |
| `value_compare_2` | `battlegorithms_value_compare` | compare | 2 | fired |
| `value_runner_index_2` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_2` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 2 | fired |
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
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (989 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (989 turns remaining)
- first enemy actions: none observed
