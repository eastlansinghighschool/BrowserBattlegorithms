# Guided Level Concept Matrix

This matrix tracks what each guided level introduces so the tutorial copy can avoid assuming ideas too early.

| Level | Focus | New vocabulary / board idea | New Blockly idea | Assumes |
| --- | --- | --- | --- | --- |
| 1 | Move to target | ally runner, enemy runner, target, frozen | `On Each Turn` + one move | none |
| 2 | Reach enemy flag | flag, enemy side; ally starts past the flag | backward move is load-bearing | Level 1 board vocabulary |
| 3 | Score a point | bring flag home, score | flag possession condition | Levels 1-2 |
| 4 | Barrier detour | barrier as obstacle | simple named conditional branch | Levels 1-3 |
| 5 | Forward works both ways | relative forward / play direction | same block, different orientation | Levels 1-4 |
| Prediction: First Move | First move prediction | commit to the ally's first movement before running | prediction checkpoint; no new Blockly idea | Level 5 |
| 6 | Enemy sensor branch | generic sensor; enemy runner blocking a lane | sensor object + relation dropdowns | Level 4 named check |
| 7 | Watch the wall | edge / wall | generic sensor reused on terrain | Level 6 sensor shape |
| 8 | Find the human | support square near teammate | directional sensing | Levels 6-7 |
| 9 | Find the enemy flag | sensing can point at goals | same sensor on a new target | Level 8 |
| 10 | Human runner practice | keyboard control, special actions | no new Blockly concept | beginner controls |
| 11 | Move Toward flag | helper target | `Move Toward enemy flag` | Levels 1-9 |
| 12 | Bring it home | helper target swap | helper + flag condition | Levels 3 and 11 |
| 13 | Enemy nearby | distance in spaces | distance-based sensing | generic sensor idea |
| 14 | Jump the gap | jump lane / landing | `Jump Forward` | movement basics |
| Bug Hunt: Flag Phase | Trace the flag bug | debugging checkpoint; reversed flag branch | repair `if_have_enemy_flag_else` target order | Levels 1-14 |
| **Challenge 15** | **Dodge and Deliver** | **live enemy; real scoring run** | **none - synthesis only** | **Levels 1-15** |
| 16 | Jump if ready | one-time jump resource | jump readiness condition | Level 14 |
| 17 | Build the barrier | barrier placement target | place barrier + readiness | Level 4 barrier idea |
| 18 | Stay still can do something | clearing a barrier | `Stay Still` as an action | barrier sensing |
| 19 | Relay race | staged carrier support | teammate-has-flag | scoring + helper targets |
| 20 | My side, their side | field halves (my side introduced) | territory conditions (my-side variants only) | board orientation |
| 21 | Freeze the lane | team freeze power | freeze readiness + helper return | prior resources |
| Bug Hunt: First Action Matters | Trace the first action | debugging checkpoint; an early action steals the turn | repair action ordering around barrier readiness | Levels 1-21 |
| **Challenge 22** | **Show What You Know** | **live scrimmage; open goal** | **none - synthesis only** | **Levels 1-22** |
| 23 | Closest threat | Strategy Brain start; intercept the nearest enemy | `Move Toward closest enemy` | helper target idea |
| 24 | How far away? | distance as numeric value; barrier and enemy force a detour | numeric compare | Level 13 distance idea |
| 25 | Two conditions at once | two truths required for the same strategy | `AND` | advanced value blocks |
| 26 | This or that | either warning matters | `OR` | advanced value blocks |
| 27 | Flip the answer | opposite condition | `NOT` | advanced value blocks |
| Prediction: Two Truths | Boolean prediction | commit to whether the AND branch is true | prediction checkpoint; no new Blockly idea | Levels 25-27 |
| Bug Hunt: Boolean Trap | Trace the boolean | debugging checkpoint; boolean choice fires too early | repair the boolean gate around freeze | Levels 1-27 |
| **Challenge 28** | **Full Team Tactics** | **Strategy Brain capstone; live defenders and full single-ally toolbox** | **none - synthesis only** | **Levels 1-28** |
| 29 | One program, two allies | shared program for allies | runner index | advanced value blocks |
| 30 | Index jobs | different ally roles | index comparison | Level 29 |
| 31 | First two defend | grouping allies by range | index `< 2` | Levels 29-30 |
| 32 | Escort the carrier | one ally starts with flag | teammate-has-flag + index | Levels 19, 29-31 |
| 33 | Closest enemy defender | split attack/defense jobs | index + closest enemy | Levels 23, 29-32 |
| 34 | Freeze support | shared team resource by role | index + freeze readiness | Levels 21, 29-33 |
| 35 | Barrier specialist | support wall for teammate | index + barrier readiness | Levels 17, 29-34 |
| 36 | Jump team | role-based jump route | index + jump resource | Levels 16, 29-35 |
| Prediction: Role Split | Runner index prediction | commit to which ally takes the first shared-program job | prediction checkpoint; no new Blockly idea | Levels 29-31 |
| Bug Hunt: Role Split | Trace the roles | debugging checkpoint; overlapping ally jobs | repair the runner-index branch split | Levels 23-36 |
| **Challenge 37** | **Advanced scrimmage** | **live team scrimmage** | **combined capstone** | **Levels 23-37** |
| Optional Lab: Move Randomly | randomness in action choice | randomness in action | `Move Randomly` | movement basics |
| Optional Lab: Double Carrier Showdown | carrier vulnerability under pressure | carrier vulnerability, runner index roles, teammate flag pressure | `runner index`, `teammate-has-flag`, `Move Toward` | Levels 19, 29-37 and the carrier collision rule |

## Copy Guidelines

- Introduce the board object before naming its state or behavior.
- Use overlays to name the new thing or twist, not to restate the whole lesson card.
- Keep puzzle-facing text descriptive rather than prescriptive; move exact code patterns into optional hints or demos.
- Use demo Blockly only when introducing a reusable pattern, not when the demo is the whole solution.
