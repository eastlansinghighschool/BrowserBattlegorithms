# Guided Reference Behavior Evidence: Level 16: Jump If Ready

## Level Identity
- order: 18
- id: `jump-if-ready`
- title: Level 16: Jump If Ready
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
- dossier link: [dossier](../level-dossiers/18-jump-if-ready.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml`
  - turns elapsed: 2
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: fail
- fixture path: `tests/unit/fixtures/guided-naive-solutions/jump-if-ready.xml`
- turns elapsed: 9
- failure reason: `turn_limit_exceeded`
- final board state summary: Score: Team 1: 0, Team 2: 0. runner_1_HumanP1 at (1, 1) (frozen); runner_1_AI_AllyP1 at (6, 5) (frozen); runner_2_Npc1 at (6, 4); runner_2_Npc2 at (10, 6) (frozen). Flag 1 is at base; Flag 2 is at base.

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 2 | Team 1: 0, Team 2: 0 | 2 | yes | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml`
- run status: pass
- result: PASSED
- turns elapsed: 2
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 2
- distinct action types observed: `JUMP_FORWARD`, `MOVE_FORWARD`
- live enemy acted: yes
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | JUMP_FORWARD | jumped | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_can_jump_else` result=true -> action `battlegorithms_jump_forward` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | STAY_STILL | stayed | trace data not available |
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=JUMP_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=JUMP_FORWARD, outcome=jumped)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionChosen (runner=runner_2_Npc1, team=2, action=STAY_STILL, source=cpu) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_can_jump_else` result=true -> action `battlegorithms_jump_forward`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_can_jump_else` result=false -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
| turn | runner | behavior | from | to | action |
| --- | --- | --- | --- | --- | --- |
| 1 | `runner_2_Npc1` | GUIDED_CHARGER | (6, 5) | (6, 5) | STAY_STILL (stayed) |

**Static/Frozen NPCs:**
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 2 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 4
- blocks fired: 3
- blocks never fired: 1
- coverage ratio: 3 / 4 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `on_each_turn_1` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `if_can_jump_else_1` | `battlegorithms_if_can_jump_else` | If I Can Jump | 2 | fired |
| `jump_forward_1` | `battlegorithms_jump_forward` | Jump Forward | 1 | fired |
| `move_forward_1` | `battlegorithms_move_forward` | Move Forward | 1 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior GUIDED_CHARGER; start (6, 5); frozen no
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (998 turns remaining)
- first enemy actions:
  - turn 1: runner_2_Npc1 chose STAY_STILL via cpu; outcome stayed
