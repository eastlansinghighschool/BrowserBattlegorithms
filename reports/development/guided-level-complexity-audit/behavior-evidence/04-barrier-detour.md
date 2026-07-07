# Guided Reference Behavior Evidence: Level 4: Barrier Detour

## Level Identity
- order: 4
- id: `barrier-detour`
- title: Level 4: Barrier Detour
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/foundations/level-04-barrier-detour.js`
- dossier link: [dossier](../level-dossiers/04-barrier-detour.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/barrier-detour.xml`
  - turns elapsed: 6
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 6 | Team 1: 0, Team 2: 0 | 6 | no | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/barrier-detour.xml`
- run status: pass
- result: PASSED
- turns elapsed: 6
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 6
- distinct action types observed: `MOVE_DOWN_SCREEN`, `MOVE_FORWARD`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_DOWN_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=true -> action `battlegorithms_move_down_screen` |
| 2 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward` |
| 4 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward` |
| 5 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward` |
| 6 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=true -> action `battlegorithms_move_down_screen`
- turn 2 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward`
- turn 3 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward`
- turn 4 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward`
- turn 5 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward`
- turn 6 runner runner_1_AI_AllyP1: condition `battlegorithms_if_barrier_in_front_else` result=false -> action `battlegorithms_move_forward`

#### Enemy Movement Timeline
- no live NPC movement observed

**Static/Frozen NPCs:**
- `runner_2_Npc1`: behavior PATROL_INTERCEPT, starting cell (10, 2) (frozen/static)
- `runner_2_Npc2`: behavior PATROL_INTERCEPT, starting cell (10, 6) (frozen/static)

#### Interaction Timeline
| turn | event | details |
| --- | --- | --- |
| 6 | `level.result` | level result: PASSED (reason: win_condition_met) |

#### Blockly Reference Solution Execution Trace Coverage
- executable block count: 4
- blocks fired: 3
- blocks never fired: 1
- coverage ratio: 3 / 4 (75.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `XfNc`wM{;;t1@B(_281D` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `41bF]l(lrx-h*Ima19=%` | `battlegorithms_if_barrier_in_front_else` | If Barrier Is In Front | 6 | fired |
| `Qg?bwkeTzz$s`Q2GW]qR` | `battlegorithms_move_down_screen` | Move Down (screen) | 1 | fired |
| `!}CUtDS,O8U!S$UQFPC(` | `battlegorithms_move_forward` | Move Forward | 5 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (994 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (994 turns remaining)
- first enemy actions: none observed
