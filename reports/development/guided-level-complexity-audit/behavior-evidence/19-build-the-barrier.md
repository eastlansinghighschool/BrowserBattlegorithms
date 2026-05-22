# Guided Reference Behavior Evidence: Level 17: Build the Barrier

## Level Identity
- order: 19
- id: `build-the-barrier`
- title: Level 17: Build the Barrier
- category: ordinary
- level kind: not found
- source file: `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js`
- dossier link: [dossier](../level-dossiers/19-build-the-barrier.md)
- summary index: [behavior-summary-index](../behavior-summary-index.md)

## Fixture Overview
- status: pass
- runnable fixture count: 1
- one-off reference: pass
  - fixture path: `tests/unit/fixtures/guided-reference-solutions/build-the-barrier.xml`
  - turns elapsed: 1
  - lastLevelResultReason: win_condition_met

## Runtime Evidence
| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |
| --- | --- | --- | --- | --- | --- | --- |
| one-off reference | pass | 1 | Team 1: 0, Team 2: 0 | 1 | no | none observed |

### one-off reference
- fixture path: `tests/unit/fixtures/guided-reference-solutions/build-the-barrier.xml`
- run status: pass
- result: PASSED
- turns elapsed: 1
- activeLevelResult: PASSED
- lastLevelResultReason: win_condition_met
- team scores: Team 1: 0, Team 2: 0
- score / blocked-scoring events: none observed
- flag pickup / drop events: none observed
- resource unavailable events: none observed
- branch/trace evidence present: yes
- reference action count: 1
- distinct action types observed: `PLACE_BARRIER_FORWARD`
- live enemy acted: no
- enemy interaction events: none observed
- ignored/extra-action evidence: none observed
### Reference action summary
| turn | runner | action | outcome | trace summary |
| --- | --- | --- | --- | --- |
| 1 | `runner_1_AI_AllyP1` | PLACE_BARRIER_FORWARD | barrier_placed | turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_place_barrier` |
### Enemy action summary
- none observed
### Event Tail
- turn.started (runner=runner_1_HumanP1, team=1) | runner.actionResolved (runner=runner_1_HumanP1, team=1, action=STAY_STILL, outcome=skipped_frozen)
- turn.started (runner=runner_1_AI_AllyP1, team=1) | runner.actionChosen (runner=runner_1_AI_AllyP1, team=1, action=PLACE_BARRIER_FORWARD, source=blockly) | runner.actionResolved (runner=runner_1_AI_AllyP1, team=1, action=PLACE_BARRIER_FORWARD, outcome=barrier_placed) | level.result (result=PASSED)
### Trace Tail
- turn 1 runner runner_1_AI_AllyP1: action `battlegorithms_place_barrier`

#### NPC / Enemy Snapshot
## Enemy / NPC Behavior
- runner_2_Npc1: behavior PATROL_INTERCEPT; start (10, 2); frozen yes (999 turns remaining)
- runner_2_Npc2: behavior PATROL_INTERCEPT; start (10, 6); frozen yes (999 turns remaining)
- first enemy actions: none observed
