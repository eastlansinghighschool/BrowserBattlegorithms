# Guided Reference Behavior Evidence: Challenge 37: Advanced Scrimmage

## Level Identity
- order: 44
- id: `advanced-scrimmage`
- title: Challenge 37: Advanced Scrimmage
- category: project
- level kind: challenge
- source file: `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- dossier link: [dossier](../level-dossiers/44-advanced-scrimmage.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: documented exception
- runnable fixture count: 2
- project checkpoint: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
  - turns elapsed: 56
  - lastLevelResultReason: turn_limit_exceeded
- project final: documented exception (documented exception)
  - fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
  - turns elapsed: 56
  - lastLevelResultReason: turn_limit_exceeded

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| project checkpoint | documented exception | 56 | Team 1: 0, Team 2: 0 | 70 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) |
| project final | documented exception | 56 | Team 1: 0, Team 2: 0 | 70 | yes | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) |

### project checkpoint
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/step-09.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 56
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The step-09 fixture for advanced-scrimmage has not yet been tuned to the current NPC layout (NPC2 at (10,4) guards the flag at (11,4), making the direct escape route unavailable to simple scripts). A reliable capstone solution is pending.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 70
- distinct action types observed: `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | bounced | turn 2 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | stayed | trace data not available |
| 1 | `runner_2_Npc3` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc3, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 50 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 51 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 52 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 53 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 54 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`
- turn 55 runner runner_1_AI_AllyP1_3: condition `battlegorithms_boolean_have_enemy_flag` result=false -> condition `battlegorithms_if_boolean_else` result=false -> action `battlegorithms_move_toward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 1) | (9, 2) | MOVE (moved) |
| 1 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 1 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 6) | (9, 5) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 2) | (9, 3) | MOVE (moved) |
| 2 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 5) | (9, 4) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 3 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 4 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 5 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 6 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 7 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 7 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (8, 4) | MOVE (moved) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 8 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 9 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |
| 10 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 3) | MOVE (moved) |
| 12 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 3) | MOVE (bounced) |
| 13 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 3) | MOVE (moved) |
| 13 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 3) | MOVE (bounced) |
| 14 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 14 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 14 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 4) | MOVE (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 2 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 7 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (8, 4) and (9, 4)) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 8 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 8 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 8 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 8 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 9 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 9 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 10 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 10 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 10 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 11 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 11 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (9, 4)) |
| 12 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 12 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (8, 3)) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 12 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 3) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (9, 4)) |
| 13 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 13 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (8, 3)) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 13 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 13 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 3) |
| 14 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 14 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 14 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 15 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 15 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 15 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 15 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 56 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 5
- blocks fired: 3
- blocks never fired: 2
- coverage ratio: 3 / 5 (60.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 70 | fired |
| `boolean_have_enemy_flag_1` | `battlegorithms_boolean_have_enemy_flag` | I have enemy flag | 70 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 70 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (9, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 4); frozen no
- runner_2_Npc3: behavior PATROL_INTERCEPT; start (9, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 1: runner_2_Npc2 chose STAY_STILL via npc; outcome stayed
  - turn 1: runner_2_Npc3 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved

### project final
- fixture path: `tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml`
- run status: documented exception
- result: FAILED
- turns elapsed: 56
- activeLevelResult: FAILED
- lastLevelResultReason: turn_limit_exceeded
- team scores: Team 1: 0, Team 2: 0
- documented exception: The cumulative Team Strategy Script checkpoint is role-based but still short of the final scrimmage's full live-board timing.
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 70
- distinct action types observed: `JUMP_FORWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall); runner.blockedOrBounced (runner=runner_2_Npc1, team=2, reason=runner_collision_bounce); runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 1 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 1 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 1 | `runner_1_AI_AllyP1_3` | JUMP_FORWARD | bounced | turn 1 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: comparison `battlegorithms_value_compare` result=true compare=0 vs 0 -> condition `battlegorithms_if_boolean_else` result=true -> condition `battlegorithms_if_have_enemy_flag_else` result=false -> action `battlegorithms_move_toward` |
| 2 | `runner_1_AI_AllyP1_2` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_2: comparison `battlegorithms_value_compare` result=false compare=1 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=true compare=1 vs 1 -> condition `battlegorithms_if_boolean_else` result=true -> … (+1 more) |
| 2 | `runner_1_AI_AllyP1_3` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more) |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | MOVE | moved | trace data not available |
| 1 | `runner_2_Npc2` | STAY_STILL | stayed | trace data not available |
| 1 | `runner_2_Npc3` | MOVE | moved | trace data not available |
| 2 | `runner_2_Npc1` | MOVE | moved | trace data not available |
### Event Tail
- turn.started (runner=runner_2_Npc3, team=2) | runner.actionChosen (runner=runner_2_Npc3, team=2, action=MOVE, source=npc) | runner.blockedOrBounced (runner=runner_2_Npc3, team=2, reason=runner_collision_bounce) | runner.actionResolved (runner=runner_2_Npc3, team=2, action=MOVE, outcome=stayed)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_2, team=1) | runner.actionResolved (runner=runner_1_AI_AllyP1_2, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1_3, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, source=blockly) | runner.blockedOrBounced (runner=runner_1_AI_AllyP1_3, team=1, reason=wall) | runner.actionResolved (runner=runner_1_AI_AllyP1_3, team=1, action=MOVE_FORWARD, outcome=stayed)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=MOVE, source=npc) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=MOVE, outcome=moved)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionChosen (runner=runner_2_Npc2, team=2, action=STAY_STILL, source=npc) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=illegal_noop)
- level.result (result=FAILED)
### Trace Tail
- turn 50 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 51 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 52 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 53 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 54 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)
- turn 55 runner runner_1_AI_AllyP1_3: comparison `battlegorithms_value_compare` result=false compare=2 vs 0 -> condition `battlegorithms_if_boolean_else` result=false -> condition `battlegorithms_if_teammate_has_flag_else` result=false -> comparison `battlegorithms_value_compare` result=false compare=2 vs 1 -> condition `battlegorithms_if_boolean_else` result=false -> … (+4 more)

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 1) | (9, 2) | MOVE (moved) |
| 1 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 1 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 6) | (9, 5) | MOVE (moved) |
| 2 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 2) | (9, 3) | MOVE (moved) |
| 2 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 2 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 5) | (9, 4) | MOVE (moved) |
| 3 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 3 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 3 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 4 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 4 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 5 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 5 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 6 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 6 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 7 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 7 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 7 | `runner_2_Npc3` | PATROL_INTERCEPT | (9, 4) | (8, 4) | MOVE (moved) |
| 8 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 8 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 8 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 9 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 9 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 9 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 10 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 4) | MOVE (moved) |
| 10 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 10 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 11 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 4) | (8, 3) | MOVE (moved) |
| 12 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 12 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 3) | MOVE (bounced) |
| 13 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 4) | (9, 3) | MOVE (moved) |
| 13 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | STAY_STILL (stayed) |
| 13 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 3) | MOVE (bounced) |
| 14 | `runner_2_Npc1` | PATROL_INTERCEPT | (9, 3) | (9, 3) | MOVE (bounced) |
| 14 | `runner_2_Npc2` | PATROL_INTERCEPT | (10, 4) | (10, 4) | MOVE (bounced) |
| 14 | `runner_2_Npc3` | PATROL_INTERCEPT | (8, 3) | (8, 4) | MOVE (moved) |

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 1 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 3 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 4 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 5 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 6 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 7 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (8, 4) and (9, 4)) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 7 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 8 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 8 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 8 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 8 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 8 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 8 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 9 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 9 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 9 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 9 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 9 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 10 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 10 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 10 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 10 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 10 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 11 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 11 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 3) |
| 11 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (9, 4)) |
| 12 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 12 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 12 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (8, 3)) |
| 12 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 12 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 3) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (9, 4)) |
| 13 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 13 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (9, 4)) |
| 13 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 3) and (8, 3)) |
| 13 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 13 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 13 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 3) |
| 14 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 4) and (8, 3)) |
| 14 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 14 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 14 | `bounce` | runner runner_2_Npc2 bounced (cell occupied) trying to reach (9, 4) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (9, 3)) |
| 15 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1 (at (8, 3) and (8, 4)) |
| 15 | `near-miss` | enemy runner_2_Npc1 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (9, 3)) |
| 15 | `near-miss` | enemy runner_2_Npc2 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (10, 4)) |
| 15 | `near-miss` | enemy runner_2_Npc3 within 1 cell of player runner_1_AI_AllyP1_2 (at (9, 4) and (8, 4)) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_1_AI_AllyP1_3 bounced trying to reach (3, 5) |
| 15 | `bounce` | runner runner_2_Npc1 bounced (cell occupied) trying to reach (9, 4) |
| 15 | `bounce` | runner runner_2_Npc3 bounced (cell occupied) trying to reach (9, 4) |
| 56 | `level.result` | level result: FAILED (reason: turn_limit_exceeded) |
| ... | `info` | later events omitted after evidence window |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 25
- blocks fired: 13
- blocks never fired: 12
- coverage ratio: 13 / 25 (52.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_boolean_else_1` | `battlegorithms_if_boolean_else` | If [boolean] else | 70 | fired |
| `value_compare_1` | `battlegorithms_value_compare` | compare | 70 | fired |
| `value_runner_index_1` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_1` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_have_enemy_flag_else_1` | `battlegorithms_if_have_enemy_flag_else` | If I Have Enemy Flag | 8 | fired |
| `move_toward_1` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `move_toward_2` | `battlegorithms_move_toward` | Move Toward | 8 | fired |
| `if_teammate_has_flag_else_1` | `battlegorithms_if_teammate_has_flag_else` | If Teammate Has Enemy Flag | 62 | fired |
| `move_toward_3` | `battlegorithms_move_toward` | Move Toward | 0 | never fired |
| `if_boolean_else_2` | `battlegorithms_if_boolean_else` | If [boolean] else | 62 | fired |
| `value_compare_2` | `battlegorithms_value_compare` | compare | 62 | fired |
| `value_runner_index_2` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_2` | `battlegorithms_value_number` | number | 0 | never fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 7 | fired |
| `if_boolean_else_3` | `battlegorithms_if_boolean_else` | If [boolean] else | 55 | fired |
| `value_compare_3` | `battlegorithms_value_compare` | compare | 55 | fired |
| `value_runner_index_3` | `battlegorithms_value_runner_index` | my runner index | 0 | never fired |
| `value_number_3` | `battlegorithms_value_number` | number | 0 | never fired |
| `if_can_jump_else_1` | `battlegorithms_if_can_jump_else` | If I Can Jump | 55 | fired |
| `jump_forward_1` | `battlegorithms_jump_forward` | Jump Forward | 1 | fired |
| `move_forward_2` | `battlegorithms_move_forward` | Move Forward | 54 | fired |
| `if_can_jump_else_2` | `battlegorithms_if_can_jump_else` | If I Can Jump | 0 | never fired |
| `jump_forward_2` | `battlegorithms_jump_forward` | Jump Forward | 0 | never fired |
| `move_forward_3` | `battlegorithms_move_forward` | Move Forward | 0 | never fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (9, 1); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 4); frozen no
- runner_2_Npc3: behavior PATROL_INTERCEPT; start (9, 6); frozen no
- first enemy actions:
  - turn 1: runner_2_Npc1 chose MOVE via npc; outcome moved
  - turn 1: runner_2_Npc2 chose STAY_STILL via npc; outcome stayed
  - turn 1: runner_2_Npc3 chose MOVE via npc; outcome moved
  - turn 2: runner_2_Npc1 chose MOVE via npc; outcome moved
