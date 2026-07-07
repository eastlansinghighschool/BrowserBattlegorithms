# Guided Reference Behavior Evidence: Level 2: Reach Enemy Flag

## Level Identity
- order: 2
- id: `reach-enemy-flag`
- title: Level 2: Reach Enemy Flag
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js`
- dossier link: [dossier](../level-dossiers/02-reach-enemy-flag.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/reach-enemy-flag.xml`
  - turns elapsed: 1
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: fail
- fixture path: `tests/unit/fixtures/guided-naive-solutions/reach-enemy-flag.xml`
- turns elapsed: 15
- failure reason: `turn_limit_exceeded`
- final board state summary: Score: Team 1: 0, Team 2: 0. runner_1_HumanP1 at (1, 1) (frozen); runner_1_AI_AllyP1 at (11, 4); runner_2_Npc1 at (10, 2) (frozen); runner_2_Npc2 at (10, 6) (frozen). Flag 1 is at base; Flag 2 is at base.

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 1 | Team 1: 0, Team 2: 0 | 1 | no | flag.pickedUp (carrier=runner_1_AI_AllyP1) |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/reach-enemy-flag.xml`
- run status: pass
- result: PASSED
- turns elapsed: 1
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2)
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 1
- distinct action types observed: `MOVE_BACKWARD`
- live enemy acted: no
- enemy interaction events: flag.pickedUp (carrier=runner_1_AI_AllyP1)
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_BACKWARD | moved | turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_backward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_BACKWARD, outcome=illegal_noop) | flag.pickedUp (carrier=runner_1_AI_AllyP1, flagTeam=2) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_backward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 1 | `flag.pickedUp` | runner runner_1_AI_AllyP1 picked up flag 2 at (10, 4) |
| 1 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 2
- blocks fired: 1
- blocks never fired: 1
- coverage ratio: 1 / 2 (50.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `move_backward_1` | `battlegorithms_move_backward` | Move Backward | 1 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (999 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (999 turns remaining)
- first enemy actions: none observed
