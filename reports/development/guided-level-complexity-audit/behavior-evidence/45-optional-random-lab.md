# Guided Reference Behavior Evidence: Optional Lab: Move Randomly

## Level Identity
- order: 45
- id: `optional-random-lab`
- title: Optional Lab: Move Randomly
- category: optional lab
- level kind: not found
- source file: `src/config/levels/phases/optional/level-38-optional-random-lab.js`
- dossier link: [dossier](../level-dossiers/45-optional-random-lab.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/optional-random-lab.xml`
  - turns elapsed: 3
  - lastLevelResultReason: win_condition_met

## Naive Solution Run Proof
- status: no naive fixture

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 3 | Team 1: 0, Team 2: 0 | 3 | no | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/optional-random-lab.xml`
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
- reference action count: 3
- distinct action types observed: `MOVE_DOWN_SCREEN`, `MOVE_FORWARD`, `MOVE_UP_SCREEN`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | MOVE_DOWN_SCREEN | moved | turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly` |
| 2 | `runner_1_AI_AllyP1` | MOVE_UP_SCREEN | moved | turn 2 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly` |
| 3 | `runner_1_AI_AllyP1` | MOVE_FORWARD | moved | turn 3 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_UP_SCREEN, outcome=illegal_noop)
- turn.started (runner=runner_2_Npc1, team=2) | runner.actionResolved (runner=runner_2_Npc1, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_2_Npc2, team=2) | runner.actionResolved (runner=runner_2_Npc2, team=2, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=MOVE_FORWARD, outcome=illegal_noop) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly`
- turn 2 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly`
- turn 3 runner runner_1_AI_AllyP1: action `battlegorithms_move_randomly`

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
- executable block count: 2
- blocks fired: 1
- blocks never fired: 1
- coverage ratio: 1 / 2 (50.0%)

| block id | block type | display label | fired count | status |
| --- | --- | --- | --- | --- |
| `@}|yNKSY=|?d`nyLrN:I` | `battlegorithms_on_each_turn` | battlegorithms_on_each_turn | 0 | never fired |
| `*y{GAjCJ5o3Hdg[W_]iu` | `battlegorithms_move_randomly` | Move Randomly | 3 | fired |

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (997 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (997 turns remaining)
- first enemy actions: none observed
