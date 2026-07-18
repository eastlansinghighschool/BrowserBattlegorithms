# Guided Level Copy Digest

Generated from `getLevelDefinitions()` through the level readiness context. This file is regenerable; level source remains authoritative.

The digest includes student-facing copy, current copy-voice lint hits, and a compact board summary so voice review can catch claims that no longer match a level's board.

## Phase: foundations

### Level 1: Move to Target
- id: `move-to-target`
- source: `src/config/levels/phases/foundations/level-01-move-to-target.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":4,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The highlighted square is waiting. Can your ally reach it?
~~~
- introText:
~~~text
The ally waits on the left. Enemy runners stand frozen on this quiet practice board. Guide your runner to the highlighted target square.
~~~
#### Tips
- tip 1:
~~~text
Only the ally runner needs to reach the target.
~~~
- tip 2:
~~~text
Your program runs each time the ally gets a turn.
~~~
- tip 3:
~~~text
Need another look? Show Tutorial is still here.
~~~
#### Tutorial Steps
##### Step 1: Meet The Board
- id: level-1-board
- demo Blockly: no
- body:
~~~text
A grid, two teams, one highlighted square. Your ally starts on the left; the frozen enemy runners stand on the right.
~~~
##### Step 2: Frozen Means Staying Still
- id: level-1-frozen
- demo Blockly: no
- body:
~~~text
The enemy runners are frozen. They will not move while you practice the first route.
~~~
##### Step 3: Start With On Each Turn
- id: level-1-event
- demo Blockly: no
- body:
~~~text
Start with On Each Turn. Blocks connected below it run when the ally takes a turn. The target is waiting.
~~~

### Level 2: Reach Enemy Flag
- id: `reach-enemy-flag`
- source: `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The enemy flag is the target this time.
~~~
- introText:
~~~text
The ally starts beyond the enemy flag. Reach that flag to clear the level.
~~~
#### Tips
- tip 1:
~~~text
A flag marks each team's side of the field. The enemy flag is behind the ally.
~~~
- tip 2:
~~~text
Move Backward sends the ally opposite Move Forward. Check the ally's position.
~~~
- tip 3:
~~~text
One action runs on each ally turn.
~~~
#### Tutorial Steps
##### Step 1: The Enemy Flag Is The Goal
- id: level-2-goal
- demo Blockly: no
- body:
~~~text
The enemy flag on the right is the goal, not the practice square.
~~~
##### Step 2: Check The Ally's Facing
- id: level-2-new-block
- demo Blockly: no
- body:
~~~text
Move Backward sends the ally opposite Move Forward. Look at where the ally starts and where the flag waits.
~~~

### Level 3: Score a Point
- id: `score-a-point`
- source: `src/config/levels/phases/foundations/level-03-score-a-point.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The enemy flag must come home.
~~~
- introText:
~~~text
The ally has two jobs: reach the enemy flag, then bring it home.
~~~
#### Tips
- tip 1:
~~~text
The point comes when the ally returns with the enemy flag.
~~~
- tip 2:
~~~text
Watch for the moment the flag changes hands.
~~~
- tip 3:
~~~text
The enemy runners stay frozen, leaving the route clear.
~~~
#### Tutorial Steps
##### Step 1: The Flag Changes The Job
- id: level-3-flag
- demo Blockly: no
- body:
~~~text
Reaching the enemy flag starts the return trip. The ally must carry it home.
~~~
##### Step 2: Watch The Flag
- id: level-3-condition
- demo Blockly: yes
- demoTitle:
~~~text
One Question, Two Paths
~~~
- demoCaption:
~~~text
An if/else asks a question, then chooses a path for each answer. The demo uses another condition.
~~~
- body:
~~~text
The flag check tells the program when the ally is carrying. Use that change to think about the next action.
~~~

### Level 4: Barrier Detour
- id: `barrier-detour`
- source: `src/config/levels/phases/foundations/level-04-barrier-detour.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A barrier blocks the direct lane.
~~~
- introText:
~~~text
The direct lane ends at a barrier. Read the space ahead before the ally moves.
~~~
#### Tips
- tip 1:
~~~text
The barrier is directly in front of the ally.
~~~
- tip 2:
~~~text
Watch what changes when the lane is blocked or clear.
~~~
- tip 3:
~~~text
One action runs on each ally turn.
~~~
#### Tutorial Steps
##### Step 1: A Barrier Blocks The Lane
- id: level-4-barrier
- demo Blockly: no
- body:
~~~text
The space directly ahead is blocked. The ally must notice that barrier before choosing a move.
~~~
##### Step 2: Ask About The Space Ahead
- id: level-4-condition
- demo Blockly: yes
- demoTitle:
~~~text
Two Paths
~~~
- demoCaption:
~~~text
The demo shows an if/else with a different condition. Notice how its two branches answer the same board question.
~~~
- body:
~~~text
The barrier check asks whether the space ahead is blocked. Use its two paths to handle the blocked and open lane.
~~~

### Level 5: Forward Works Both Ways
- id: `mirror-forward`
- source: `src/config/levels/phases/foundations/level-05-mirror-forward.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":7,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Forward follows the runner's facing.
~~~
- introText:
~~~text
The ally starts on the right and faces left. Here, forward points toward the ally's goal, not the screen's right edge.
~~~
#### Tips
- tip 1:
~~~text
Watch the ally's facing.
~~~
- tip 2:
~~~text
Forward follows that facing, not the screen direction.
~~~
- tip 3:
~~~text
Same block, different orientation.
~~~
#### Tutorial Steps
##### Step 1: Forward Follows Facing
- id: level-5-mirror
- demo Blockly: no
- body:
~~~text
This ally starts on the opposite side. Forward follows the runner's own goal direction, not the screen.
~~~
##### Step 2: Same Block, New Direction
- id: level-5-forward
- demo Blockly: no
- body:
~~~text
The same Move Forward block works when the ally faces left. Read the board orientation before choosing.
~~~

## Phase: sensing

### Prediction: First Move
- id: `prediction-06`
- source: `src/config/levels/phases/sensing/prediction-06-first-move.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":2,"y":4},"actionTypes":["MOVE_FORWARD"]}
- opponent runners: 0 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Trace the ally's first move before the board runs.
~~~
- introText:
~~~text
Read the starter blocks. Choose where the ally goes first, then start the level and see.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Trace Before You Run
- id: prediction-06-intro
- demo Blockly: no
- body:
~~~text
Read the starter blocks. Commit to the ally's first move, then press Start Level and check your trace.
~~~

### Level 6: Enemy Sensor Branch
- id: `sensor-barrier-branch`
- source: `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":3}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A frozen enemy runner blocks the lane.
~~~
- introText:
~~~text
A frozen enemy runner stands ahead. The sensor's two menus can describe what the ally sees and where it sees it.
~~~
#### Tips
- tip 1:
~~~text
Choose the object and its position in the sensor menus.
~~~
- tip 2:
~~~text
The frozen enemy runner is directly in front of the ally.
~~~
- tip 3:
~~~text
The sensor can watch runners as well as barriers.
~~~
#### Tutorial Steps
##### Step 1: Choose What To Watch
- id: level-6-generic-sensor
- demo Blockly: yes
- demoTitle:
~~~text
Example sensor branch
~~~
- demoCaption:
~~~text
This demo watches a barrier directly ahead. What would you change so this branch watches the frozen runner?
~~~
- body:
~~~text
The sensor has two menus: one names what to watch, the other names where it is. This demo watches a barrier; the lane holds something else.
~~~
##### Step 2: The Frozen Runner
- id: level-6-barrier
- demo Blockly: no
- body:
~~~text
A frozen enemy runner stands in the lane ahead. What should the ally notice before choosing a move?
~~~

### Level 7: Watch the Wall
- id: `watch-the-wall`
- source: `src/config/levels/phases/sensing/level-07-watch-the-wall.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":5}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Walls close off parts of this map.
~~~
- introText:
~~~text
A wall is directly ahead of the ally. This sensor can watch the map itself, not only runners or barriers.
~~~
#### Tips
- tip 1:
~~~text
The Edge or Wall option watches map walls and edges.
~~~
- tip 2:
~~~text
The wall ahead is part of the map, not a placed barrier.
~~~
- tip 3:
~~~text
One action runs on each ally turn.
~~~
#### Tutorial Steps
##### Step 1: Walls Count Too
- id: level-7-wall
- demo Blockly: no
- body:
~~~text
The Edge or Wall option notices the map's walls and edges. This lane has a wall directly ahead.
~~~
##### Step 2: Describe Where It Is
- id: level-7-relation
- demo Blockly: no
- body:
~~~text
The relation menu says where to look. Here, look directly in front of the ally.
~~~

### Level 8: Find the Human
- id: `find-the-human`
- source: `src/config/levels/phases/sensing/level-08-find-the-human.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":2}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The marked support square waits beside the human runner.
~~~
- introText:
~~~text
The human runner is ahead and above the ally. Guide the ally to the highlighted square beside them.
~~~
#### Tips
- tip 1:
~~~text
The human runner is the object to watch.
~~~
- tip 2:
~~~text
The highlighted support square beside the human is the goal, not the occupied cell.
~~~
- tip 3:
~~~text
Describe the human's position from the ally's point of view.
~~~
- tip 4:
~~~text
More than one check may help the ally reach the support square.
~~~
#### Tutorial Steps
##### Step 1: Find The Human
- id: level-8-human
- demo Blockly: yes
- demoTitle:
~~~text
A Direction Question
~~~
- demoCaption:
~~~text
This example uses a different object. Notice its two menus: what to watch and where to look.
~~~
- body:
~~~text
The sensor can watch the human runner and ask whether they are forward, behind, above, or below. The marked support square beside them is the goal.
~~~
##### Step 2: Two Directions
- id: level-8-axes
- demo Blockly: no
- body:
~~~text
Forward and behind follow the ally's facing. Above and below follow the screen.
~~~

### Level 9: Find the Enemy Flag
- id: `find-the-enemy-flag`
- source: `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The enemy flag waits ahead and above.
~~~
- introText:
~~~text
The sensor can watch the enemy flag, too. Guide the ally to the flag at the far side of the field.
~~~
#### Tips
- tip 1:
~~~text
The enemy flag is the object to watch.
~~~
- tip 2:
~~~text
The relation menu describes the flag's position from the ally.
~~~
- tip 3:
~~~text
Runners and flags can both appear in the sensor menu.
~~~
#### Tutorial Steps
##### Step 1: Watch The Enemy Flag
- id: level-9-flag-sensor
- demo Blockly: no
- body:
~~~text
The sensor can watch the enemy flag. Its relation menu describes where the flag is from the ally.
~~~
##### Step 2: Follow The Clues
- id: level-9-reuse
- demo Blockly: no
- body:
~~~text
As the ally moves, the flag can shift from above to directly ahead. Keep checking where it is.
~~~

## Phase: movement-helpers

### Level 10: Human Runner Practice
- id: `human-runner-practice`
- source: `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_HumanP1","targetCell":{"x":4,"y":4},"actionTypes":["JUMP_FORWARD","PLACE_BARRIER_FORWARD"]}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Drive the human runner to the goal, but use Jump or Place Barrier first.
~~~
- introText:
~~~text
You are driving this runner. Use the keyboard, try Jump or Place Barrier, then head for the goal.
~~~
#### Tips
- tip 1:
~~~text
Use W A S D to move the human runner.
~~~
- tip 2:
~~~text
Press F to jump, B to place a barrier, and X to stay still.
~~~
- tip 3:
~~~text
The goal counts only after Jump or Place Barrier.
~~~
- tip 4:
~~~text
Leave the program alone for this run; your keys drive the human runner.
~~~
#### Tutorial Steps
##### Step 1: You Drive This Runner
- id: level-10-human-focus
- demo Blockly: no
- body:
~~~text
The human runner is yours this round. The ally is frozen while you try the match controls.
~~~
##### Step 2: Keyboard Controls
- id: level-10-human-keys
- demo Blockly: no
- body:
~~~text
Use W A S D to move. Press F to jump, B to place a barrier, and X to stay still.
~~~
##### Step 3: Try A Special Action First
- id: level-10-human-special
- demo Blockly: no
- body:
~~~text
The goal counts only after you use Jump or Place Barrier. Reaching it first does not count yet.
~~~

### Level 11: Shortcut Block - Move Toward the Flag
- id: `move-toward-flag`
- source: `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: static-prop

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The enemy flag is across an open field. Try Move Toward.
~~~
- introText:
~~~text
Move Toward picks one step toward its target. The enemy flag is the only target on this open field.
~~~
#### Tips
- tip 1:
~~~text
The helper chooses one move each turn, not a whole route.
~~~
- tip 2:
~~~text
This open field leaves room for the helper to work.
~~~
- tip 3:
~~~text
Regular movement blocks are still available.
~~~
#### Tutorial Steps
##### Step 1: Meet Move Toward
- id: level-11-helper
- demo Blockly: no
- body:
~~~text
This block takes one step toward the target you choose. Here, that target is the enemy flag.
~~~
##### Step 2: One Step At A Time
- id: level-11-not-pathfinding
- demo Blockly: no
- body:
~~~text
On open ground, the helper has room to work. Watch each step; it chooses one at a time.
~~~

### Level 12: Bring It Home
- id: `bring-it-home`
- source: `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: background-motion

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Once the ally picks up the flag, its next target must change.
~~~
- introText:
~~~text
The enemy flag is across the field. Once the ally carries it, the next target is home.
~~~
#### Tips
- tip 1:
~~~text
Watch what changes after the flag pickup.
~~~
- tip 2:
~~~text
Move Toward can aim at a different target each turn.
~~~
- tip 3:
~~~text
The ally needs a target for the trip home, too.
~~~
#### Tutorial Steps
##### Step 1: One Helper, Two Targets
- id: level-12-two-targets
- demo Blockly: yes
- demoTitle:
~~~text
Example two-target program
~~~
- demoCaption:
~~~text
This demo asks a different question. Notice how each branch can choose a target.
~~~
- body:
~~~text
This helper can point at different targets. The flag changes what the ally carries; what target should matter next?
~~~
##### Step 2: After The Pickup
- id: level-12-switch
- demo Blockly: no
- body:
~~~text
Pickup changes the board. What target should matter once the ally is carrying the flag?
~~~

### Level 13: Enemy Nearby
- id: `enemy-nearby`
- source: `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":7,"y":2}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: collision-threat

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A Guard watches the lane. The ally needs to notice when it closes in.
~~~
- introText:
~~~text
The Guard moves when a runner gets close. Within 2 and Within 3 count grid steps, not a straight line.
~~~
#### Tips
- tip 1:
~~~text
Within 2 and Within 3 count grid steps.
~~~
- tip 2:
~~~text
Choose how early the ally should react.
~~~
- tip 3:
~~~text
Grid steps matter, not straight-line distance.
~~~
#### Tutorial Steps
##### Step 1: Distance Uses Grid Steps
- id: level-13-distance
- demo Blockly: yes
- demoTitle:
~~~text
Example nearby-enemy reaction
~~~
- demoCaption:
~~~text
This demo asks a different sensor question. Notice how a distance check selects one of two actions.
~~~
- body:
~~~text
Within 2 spaces means two ideal grid moves away. A clear straight line is not required.
~~~
##### Step 2: Choose Your Warning Distance
- id: level-13-nearby-enemy
- demo Blockly: no
- body:
~~~text
The Guard moves when a runner gets close. How early should the ally react?
~~~

### Level 14: Jump the Gap
- id: `jump-the-gap`
- source: `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":3,"y":4}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: background-motion

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A wall splits the lane. The goal is on the far side.
~~~
- introText:
~~~text
Jump Forward can clear the wall, but it only goes ahead and needs open ground to land.
~~~
#### Tips
- tip 1:
~~~text
Jump Forward only goes forward.
~~~
- tip 2:
~~~text
There is no backward jump in this game.
~~~
- tip 3:
~~~text
The landing space still needs to be open.
~~~
- tip 4:
~~~text
The wall seals the whole column.
~~~
#### Tutorial Steps
##### Step 1: Jump Is A One-Time Leap
- id: level-14-jump
- demo Blockly: no
- body:
~~~text
Jump Forward moves two cells ahead and ignores the space in between. You get one jump each round.
~~~
##### Step 2: No Backward Jump
- id: level-14-no-backward-jump
- demo Blockly: no
- body:
~~~text
This game only supports jumping forward. The wall blocks the whole column; check which way the ally faces.
~~~

### Bug Hunt: Flag Phase
- id: `bughunt-15`
- source: `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 2 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The starter takes the wrong flag-phase action. Trace its first branch.
~~~
- introText:
~~~text
The flag changes hands, but the starter sends the ally toward the wrong target. Find the reversal.
~~~
#### Tips
- tip 1:
~~~text
Only the first reached action runs, so start at the top of the program.
~~~
- tip 2:
~~~text
When the ally carries the enemy flag, a different target should matter.
~~~
- tip 3:
~~~text
If the wrong branch runs first, the rest of the turn never gets a chance.
~~~
#### Tutorial Steps
##### Step 1: Trace The First Branch
- id: bughunt-15-trace
- demo Blockly: no
- body:
~~~text
The starter is intentionally wrong. Trace the first decision: does the ally head toward the flag or back home at the right time?
~~~
##### Step 2: Repair The Flag Phase
- id: bughunt-15-fix
- demo Blockly: no
- body:
~~~text
This is a debugging level, not a blank slate. Keep the shape, but repair the reversed target.
~~~

### Challenge 15: Dodge and Deliver
- id: `dodge-and-deliver`
- source: `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 2 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A defender guards the lane while another enemy keeps moving.
~~~
- introText:
~~~text
A defender holds the lane near the flag while another enemy keeps moving. Bring the enemy flag home.
~~~
#### Tips
- tip 1:
~~~text
One enemy guards the lane while another keeps moving. Watch both.
~~~
- tip 2:
~~~text
Distance gives warning before a nearby enemy crowds the route.
~~~
- tip 3:
~~~text
The enemy flag must come all the way home to score.
~~~
#### Tutorial Steps
##### Step 1: The Lane Is Contested
- id: dodge-and-deliver-real-game
- demo Blockly: no
- body:
~~~text
One defender holds the lane near the flag. Another enemy keeps moving. The route will not stay empty.
~~~
##### Step 2: Read The Field
- id: dodge-and-deliver-toolkit
- demo Blockly: no
- body:
~~~text
No new blocks here. Read the flag, the defender, and the moving enemy before you choose a plan.
~~~

## Phase: resources-and-territory

### Level 16: Jump If Ready
- id: `jump-if-ready`
- source: `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":8,"y":4}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: collision-threat

#### Copy-Voice Lint Hits
- none

- description:
~~~text
One jump is waiting in the lane. What should the ally notice before it spends it?
~~~
- introText:
~~~text
A Charger guards the lane. The ally's jump is ready now; after it is spent, watch where the Charger stands.
~~~
#### Tips
- tip 1:
~~~text
The jump is ready at the start.
~~~
- tip 2:
~~~text
What will the ally notice after it is spent?
~~~
- tip 3:
~~~text
Trace the lane before you choose a branch.
~~~
#### Tutorial Steps
##### Step 1: A Resource With A Limit
- id: level-15-ready
- demo Blockly: yes
- demoTitle:
~~~text
A Ready Check
~~~
- demoCaption:
~~~text
This example watches a resource that is not the jump. Look at the question it asks, not the actions it chooses.
~~~
- body:
~~~text
The jump check changes when the ally spends its jump. Watch the state change, then decide what the next turn needs.
~~~
##### Step 2: When The Jump Is Gone
- id: level-15-resource
- demo Blockly: no
- body:
~~~text
After the jump is spent, the Charger may be in a new spot. Read the lane again before choosing.
~~~

### Level 17: Build the Barrier
- id: `build-the-barrier`
- source: `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js`

#### Board Summary
- win condition: {"type":"barrier_exists_at_cell","targetCell":{"x":4,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Place a barrier in the marked square ahead of the ally.
~~~
- introText:
~~~text
The ally can place one barrier. Watch the open square in front and whether the action is available.
~~~
#### Tips
- tip 1:
~~~text
The barrier belongs in the highlighted square.
~~~
- tip 2:
~~~text
Place Barrier acts on the square directly ahead.
~~~
- tip 3:
~~~text
A runner can keep only one active barrier.
~~~
#### Tutorial Steps
##### Step 1: Place The Barrier
- id: level-16-place-barrier
- demo Blockly: no
- body:
~~~text
This action creates a barrier in the square directly ahead of the runner if that space is open.
~~~
##### Step 2: Is The Space Open?
- id: level-16-barrier-ready
- demo Blockly: no
- body:
~~~text
The ready check tells the ally whether barrier placement is still available.
~~~

### Level 18: Stay Still Can Do Something
- id: `stay-still-can-do-something`
- source: `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":4,"y":4}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: background-motion

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Clear the barrier blocking the ally's path.
~~~
- introText:
~~~text
A barrier blocks the ally's lane. Stay Still can change the board when the barrier is directly ahead.
~~~
#### Tips
- tip 1:
~~~text
Look directly ahead for the barrier.
~~~
- tip 2:
~~~text
When it is gone, the route opens again.
~~~
- tip 3:
~~~text
The pause can be the move that changes the lane.
~~~
#### Tutorial Steps
##### Step 1: Still Can Mean Action
- id: level-17-stay-still
- demo Blockly: yes
- demoTitle:
~~~text
Example removal program
~~~
- demoCaption:
~~~text
The sample uses a different sensor and relation. Notice the barrier in front, then decide what each path should do.
~~~
- body:
~~~text
When the barrier is directly ahead, Stay Still clears it. Read the board before choosing the next action.
~~~
##### Step 2: Then Continue
- id: level-17-after-removal
- demo Blockly: no
- body:
~~~text
Once the barrier is clear, the ally can return to the route.
~~~

### Level 19: Relay Race
- id: `relay-race`
- source: `src/config/levels/phases/resources-and-territory/level-19-relay-race.js`

#### Board Summary
- win condition: {"type":"relay_support_after_teammate_has_flag","runnerId":"runner_1_AI_AllyP1","stagingCell":{"x":4,"y":0}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The flag changes hands in this relay. Watch both runners and decide how their jobs should change.
~~~
- introText:
~~~text
Drive the human runner with the arrow keys. The ally heads for a staging spot; the flag handoff will change the field.
~~~
#### Tips
- tip 1:
~~~text
Watch where the ally starts.
~~~
- tip 2:
~~~text
The staging spot waits above the shared lane.
~~~
- tip 3:
~~~text
Notice what changes when a teammate reaches the enemy flag.
~~~
- tip 4:
~~~text
The goal marker moves after the flag pickup.
~~~
- tip 5:
~~~text
Which runner should move, wait, or support?
~~~
- tip 6:
~~~text
Read the next turn before you change the plan.
~~~
#### Tutorial Steps
##### Step 1: Watch The Handoff
- id: level-19-human-route
- demo Blockly: no
- body:
~~~text
Drive the human runner with the arrow keys. Watch the ally, the staging spot, and the flag as the round unfolds.
~~~
##### Step 2: Name The New Job
- id: level-19-support
- demo Blockly: yes
- demoTitle:
~~~text
A Board Question
~~~
- demoCaption:
~~~text
This sample asks a different board question. Notice how the answer can change what happens next.
~~~
- body:
~~~text
A teammate carrying the flag changes the situation. What should the ally do now?
~~~

### Level 20: My Side, Their Side
- id: `my-side-their-side`
- source: `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: background-motion

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The middle of the field is about to matter. Guide the ally across it.
~~~
- introText:
~~~text
Your side and their side are different ground. Watch the ally approach the middle and decide what should change.
~~~
#### Tips
- tip 1:
~~~text
Team 1's side is the left half; the enemy side is the right.
~~~
- tip 2:
~~~text
Watch for the moment the ally crosses the middle.
~~~
- tip 3:
~~~text
What should the route do on each side?
~~~
- tip 4:
~~~text
No flag is in this lane. Read the territory first.
~~~
#### Tutorial Steps
##### Step 1: The Field Has Sides
- id: level-19-territory
- demo Blockly: no
- body:
~~~text
The field has two halves. The territory block can tell your program which half the ally occupies.
~~~
##### Step 2: After The Middle
- id: level-19-switch-sides
- demo Blockly: no
- body:
~~~text
The ally will cross the middle. Trace one turn before and one turn after that change.
~~~

### Level 21: Freeze the Lane
- id: `freeze-the-lane`
- source: `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: collision-threat

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A Charger is closing on the lane. Decide when Area Freeze should matter.
~~~
- introText:
~~~text
The Charger starts near the ally, and the freeze window is brief. Watch the lane before you spend a team power.
~~~
#### Tips
- tip 1:
~~~text
The Charger can reach nearby lanes.
~~~
- tip 2:
~~~text
Area Freeze touches nearby active enemies.
~~~
- tip 3:
~~~text
When would a short safe window help?
~~~
- tip 4:
~~~text
Watch the cooldown after the power is spent.
~~~
#### Tutorial Steps
##### Step 1: Read The Freeze Window
- id: level-20-freeze
- demo Blockly: yes
- demoTitle:
~~~text
A Resource Question
~~~
- demoCaption:
~~~text
This sample watches a different cooling resource. Notice how the board state decides whether the action is available.
~~~
- body:
~~~text
Area Freeze stops nearby enemies briefly. Watch the resource and the Charger together.
~~~
##### Step 2: Choose The Moment
- id: level-20-timing
- demo Blockly: no
- body:
~~~text
The Charger starts near the lane. What would make this the right turn to spend the power?
~~~
##### Step 3: Carry The Toolkit
- id: level-20-free-play
- demo Blockly: no
- body:
~~~text
Movement, sensing, helper actions, barriers, jumping, and freeze are on the table. Free play opens the next board.
~~~

## Phase: advanced-logic

### Bug Hunt: First Action Matters
- id: `bughunt-22`
- source: `src/config/levels/phases/advanced-logic/bughunt-22-readiness-order.js`

#### Board Summary
- win condition: {"type":"barrier_exists_at_cell","targetCell":{"x":4,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A stray move is crowding out the barrier order.
~~~
- introText:
~~~text
The marked square needs a barrier, but a move is getting in the way. Trace which action reaches the runner first.
~~~
#### Tips
- tip 1:
~~~text
Only the first action reached on a turn runs, so a move block can hide everything after it.
~~~
- tip 2:
~~~text
The barrier branch is already on the board. Find out what stops the runner from reaching it.
~~~
- tip 3:
~~~text
Keep the repair small. Change only the part that blocks the barrier order.
~~~
#### Tutorial Steps
##### Step 1: Trace The Top Of The Stack
- id: bughunt-22-trace
- demo Blockly: no
- body:
~~~text
Ask which action the runner reaches before it can consider the barrier branch.
~~~
##### Step 2: Put The Check First
- id: bughunt-22-order
- demo Blockly: no
- body:
~~~text
The marked square is waiting. Repair the order so the barrier branch gets its turn.
~~~

### Challenge 22: Show What You Know
- id: `show-what-you-know`
- source: `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 3 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Score against live defenders holding the far side.
~~~
- introText:
~~~text
Two defenders patrol the outer lanes while a third holds the middle. Reach their flag and bring it home.
~~~
#### Tips
- tip 1:
~~~text
The toolbox holds the tools you have earned: sensing, helpers, barriers, jumping, and freeze.
~~~
- tip 2:
~~~text
Watch the lanes first. More than one route can work.
~~~
- tip 3:
~~~text
Freeze can buy a short opening when a defender closes in.
~~~
#### Tutorial Steps
##### Step 1: Read The Field
- id: show-what-you-know-challenge
- demo Blockly: no
- body:
~~~text
The outer lanes have moving defenders, and one runner holds the middle. Your ally needs a route to the far flag and back.
~~~
##### Step 2: Make A Field Plan
- id: show-what-you-know-strategy
- demo Blockly: no
- body:
~~~text
Notice what changes near each defender, at the flag, and on the trip home. Build rules your ally can use when the field changes.
~~~

### Level 23: Closest Threat
- id: `closest-threat`
- source: `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":3}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A frozen runner waits above the main lane.
~~~
- introText:
~~~text
Field Decisions begins here. Your saved ally program carries forward as the field changes. Decide whether the runner above the lane belongs in its path.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Program, Changing Field
- id: level-21-advanced-layer
- demo Blockly: no
- body:
~~~text
Field Decisions keeps one ally program as the field changes. The toolbox is broad; begin by deciding what the runner above the lane should mean to your ally.
~~~
##### Step 2: A New Move Toward Target
- id: level-21-target
- demo Blockly: no
- body:
~~~text
Closest enemy finds the nearest opponent and takes one step toward it. Which runner should your ally notice first?
~~~
##### Step 3: Runner Off The Lane
- id: level-21-board
- demo Blockly: no
- body:
~~~text
The frozen runner is above the main lane, not on it. Watch how that position changes the ground ahead.
~~~

### Level 24: How Far Away?
- id: `how-far-away`
- source: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":2}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A barrier closes the center lane while a defender patrols ahead.
~~~
- introText:
~~~text
The barrier and patrolling defender make distance matter. How far away is it when your ally should change course?
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Distance Is A Number
- id: level-24-distance
- demo Blockly: yes
- demoTitle:
~~~text
Example piece-by-piece selection
~~~
- demoCaption:
~~~text
The familiar sensor feeds a distance value into a compare block with two paths. The board decides which path matters.
~~~
- body:
~~~text
The compare block checks a distance value with <, <=, >, and the other operators. Use it to ask how far the defender is from your ally.
~~~
##### Step 2: Read The Range
- id: level-24-compare
- demo Blockly: no
- body:
~~~text
The barrier blocks the center lane, and the defender patrols beyond it. Decide what distance should change your ally's plan.
~~~

### Level 25: Two Conditions At Once
- id: `two-conditions-at-once`
- source: `src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A defender crowds the flag lane while Area Freeze is ready to spend.
~~~
- introText:
~~~text
The defender is close, and the team power may be ready. What has to be true before your ally spends that opening?
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Both Must Be True
- id: level-23-and
- demo Blockly: no
- body:
~~~text
AND is true only when both checks are true. Use it when the defender's distance and your team's readiness must agree.
~~~
##### Step 2: After The Opening
- id: level-23-lane
- demo Blockly: no
- body:
~~~text
Once the power is spent, the field changes. What should the same program do while it waits to recharge?
~~~

### Level 26: This Or That
- id: `this-or-that`
- source: `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Midfield and a frozen defender can both change the lane.
~~~
- introText:
~~~text
The territory line and frozen defender each give the ally a warning. Either warning can matter on the same turn.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Either Warning Works
- id: level-24-or
- demo Blockly: no
- body:
~~~text
OR is true when at least one input is true. One branch can notice both the midfield line and a nearby defender.
~~~
##### Step 2: Two Warnings, One Lane
- id: level-24-path
- demo Blockly: no
- body:
~~~text
The midfield line and frozen defender are different warnings. Decide when they should ask the same thing of your ally.
~~~

### Level 27: Flip The Answer
- id: `flip-the-answer`
- source: `src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Midfield splits the map, and your ally needs a rule for the far side.
~~~
- introText:
~~~text
Midfield is behind the ally now. On enemy territory, the same check can mean the opposite thing.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Reverse The Boolean
- id: level-25-not
- demo Blockly: no
- body:
~~~text
NOT flips a boolean: true becomes false, and false becomes true. Use it when the opposite check says the field situation more clearly.
~~~
##### Step 2: After Midfield
- id: level-25-side
- demo Blockly: no
- body:
~~~text
The ally's side changes at midfield. Decide whether reversing a territory check gives the far side its own rule.
~~~

### Prediction: Two Truths
- id: `prediction-25`
- source: `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":1,"y":4},"actionTypes":["MOVE_BACKWARD"]}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Two checks face the lane. Will they both hold?
~~~
- introText:
~~~text
The starter watches the runner and the space ahead. Choose whether both checks are true, then run it and see.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Trace Both Halves
- id: prediction-25-intro
- demo Blockly: no
- body:
~~~text
AND returns true only when both inputs are true. Read the runner and the space ahead, make your call, then run it.
~~~

### Bug Hunt: Boolean Trap
- id: `bughunt-28`
- source: `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
The freeze gate opens before the field is ready.
~~~
- introText:
~~~text
A live defender starts in the lane, but the freeze branch opens too soon. Trace the two checks and repair the gate.
~~~
#### Tips
- tip 1:
~~~text
A gate using OR can open when only one check is true.
~~~
- tip 2:
~~~text
Ask which two facts must be true together before the freeze fires.
~~~
- tip 3:
~~~text
The pathing is already there. Focus on the boolean gate.
~~~
#### Tutorial Steps
##### Step 1: Trace The Boolean
- id: bughunt-28-trace
- demo Blockly: no
- body:
~~~text
Read the two checks piece by piece. Which facts should the freeze gate require together?
~~~
##### Step 2: Repair The Gate
- id: bughunt-28-fix
- demo Blockly: no
- body:
~~~text
The boolean gate has the wrong shape. Repair it so the freeze waits for the field you identified.
~~~

### Challenge 28: Full Team Tactics
- id: `full-team-tactics`
- source: `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1}
- opponent runners: 3 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Work beside your Blockly ally against three defenders.
~~~
- introText:
~~~text
Drive the human runner with the keys while one Blockly ally follows its saved program. Three defenders guard the far side.
~~~
#### Tips
- tip 1:
~~~text
Your ally carries the Field Decisions toolkit: sensing, territory, NOT, freeze, barriers, and more.
~~~
- tip 2:
~~~text
Watch the defenders and choose the rules that give your ally room to work.
~~~
- tip 3:
~~~text
Ahead: Team Strategy Script puts one shared program on several allies. Runner index gives them different jobs.
~~~
#### Tutorial Steps
##### Step 1: Human Plus Ally Capstone
- id: full-team-tactics-last-solo
- demo Blockly: no
- body:
~~~text
Drive the human runner with the keys while one Blockly ally follows its saved program. Work the same field together.
~~~
##### Step 2: What Comes Next
- id: full-team-tactics-next
- demo Blockly: no
- body:
~~~text
Field Decisions gives one ally local rules. Next, Team Strategy Script uses runner index so one shared program can give several allies different jobs.
~~~

## Phase: advanced-teamplay

### Level 29: One Program, Two Allies
- id: `one-program-two-allies`
- source: `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Two allies share one program but need different jobs.
~~~
- introText:
~~~text
Team Strategy Script begins here. Two allies leave different lanes, but both run the same blocks. Runner index gives the shared program separate jobs.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Workspace, Two Allies
- id: level-27-shared-program
- demo Blockly: no
- body:
~~~text
Both allies run the same blocks every turn. The first has index 0 and the second has index 1. An index check can send them down different branches.
~~~
##### Step 2: Two Lanes
- id: level-27-index
- demo Blockly: no
- body:
~~~text
One ally has a clear route to the flag. Look for a different job that keeps its teammate from crowding that lane.
~~~

### Level 30: Index Jobs
- id: `index-jobs`
- source: `src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1_2"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
One ally is deep in enemy territory; the other waits near home.
~~~
- introText:
~~~text
The two allies begin in very different places. Their shared script needs runner-index rules that fit the ground each one stands on.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Compare The Index
- id: level-28-index-compare
- demo Blockly: no
- body:
~~~text
Compare runner index to a number to choose different branches for different allies. One shared script can still assign separate jobs.
~~~
##### Step 2: Read Their Positions
- id: level-28-jobs
- demo Blockly: no
- body:
~~~text
One ally starts near the far flag while the other is back at home. Decide what each position asks of its runner.
~~~

### Level 31: First Two Defend
- id: `first-two-defend`
- source: `src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1_3","targetCell":{"x":4,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Three allies crowd a barrier in the center lane.
~~~
- introText:
~~~text
Three allies share the field, but the first two face the same blocked row. An index range can group that pair and leave another job open.
~~~
#### Tips
- tip 1:
~~~text
Stay Still can remove a barrier directly in front — remember that from an earlier level?
~~~
#### Tutorial Steps
##### Step 1: Index Ranges Create Teams
- id: level-29-range
- demo Blockly: no
- body:
~~~text
An index range such as < 2 can group the first two allies. The remaining index can follow a different branch in the same program.
~~~
##### Step 2: Three Allies, One Program
- id: level-29-three-allies
- demo Blockly: no
- body:
~~~text
The barrier makes the center row crowded. Decide which runners need the same response and which one needs a different route.
~~~

### Level 32: Escort The Carrier
- id: `escort-the-carrier`
- source: `src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1_2","targetCell":{"x":5,"y":5}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
One ally begins with the enemy flag while another waits near home.
~~~
- introText:
~~~text
Your lead ally already carries the flag. The second ally sees a different part of the field. The shared program needs local jobs for both runners.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Ally Has The Flag
- id: level-30-teammate
- demo Blockly: no
- body:
~~~text
The lead ally begins as the carrier. Teammate-has-flag and runner index can give the other ally a different response.
~~~
##### Step 2: Watch The Return
- id: level-30-support
- demo Blockly: no
- body:
~~~text
The carrier and the nearby ally are not in the same situation. Build local rules that notice the flag and the lane around it.
~~~

### Level 33: Closest Enemy Defender
- id: `closest-enemy-defender`
- source: `src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 2 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Two live defenders have crossed onto your side of the field.
~~~
- introText:
~~~text
One ally has a route to the far flag while two defenders press close to home. The same program must notice both jobs.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Split The Team Jobs
- id: level-31-split
- demo Blockly: no
- body:
~~~text
Runner index can give one ally a flag-focused branch and another a closest-enemy branch. Both still follow the same shared code.
~~~
##### Step 2: Pressure At Home
- id: level-31-pressure
- demo Blockly: no
- body:
~~~text
The two defenders are already on your side. Decide what the nearby ally should notice while its teammate works the far lane.
~~~

### Level 34: Freeze Support
- id: `freeze-support`
- source: `src/config/levels/phases/advanced-teamplay/level-34-freeze-support.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A patrolling defender guards the flag lane, and the team has one freeze power.
~~~
- introText:
~~~text
Two allies wait near the flag lane as a defender patrols toward them. Area Freeze belongs to the whole team, so the approaching patrol creates an opening.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Team Power
- id: level-32-role
- demo Blockly: no
- body:
~~~text
Runner index can give one ally the freeze branch. Because the power belongs to the team, its timing changes the field for both allies.
~~~
##### Step 2: Watch The Opening
- id: level-32-timing
- demo Blockly: no
- body:
~~~text
The defender patrols beside the flag lane. Decide what should make the shared program spend its one opening.
~~~

### Level 35: Barrier Specialist
- id: `barrier-specialist`
- source: `src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A patroller crosses the row leading to the enemy flag.
~~~
- introText:
~~~text
The patroller keeps cutting across the flag lane. Your team has one barrier and two allies. What role could change that crossing?
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Barrier Role
- id: level-35-index-barrier
- demo Blockly: no
- body:
~~~text
Runner index can reserve the barrier branch for one ally while the other follows a different field rule.
~~~
##### Step 2: Watch The Patrol
- id: level-35-patrol
- demo Blockly: no
- body:
~~~text
Watch where the patroller turns. A barrier in its path changes how far it can travel across the flag lane.
~~~

### Level 36: Jump Team
- id: `jump-team`
- source: `src/config/levels/phases/advanced-teamplay/level-36-jump-team.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A wall splits the two allies as they leave home.
~~~
- introText:
~~~text
One ally can jump the wall while the other faces a different lane. Runner index gives each runner a useful response.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Give The Jump To One Ally
- id: level-34-jump-role
- demo Blockly: no
- body:
~~~text
Runner index can send one ally to a jump branch while the other follows a different rule around the wall.
~~~
##### Step 2: Two Sides Of The Wall
- id: level-34-wall
- demo Blockly: no
- body:
~~~text
The wall puts the allies in different situations. Decide what each runner should notice from its own lane.
~~~

### Prediction: Role Split
- id: `prediction-31`
- source: `src/config/levels/phases/advanced-teamplay/prediction-31-index-role-split.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell_after_action","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":2,"y":4},"actionTypes":["MOVE_FORWARD"]}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
One branch faces two allies. Which runner enters it?
~~~
- introText:
~~~text
The same starter runs on both allies, but their indexes differ. Make your call before the first turn reveals the branch.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Trace the Runner Index
- id: prediction-31-intro
- demo Blockly: no
- body:
~~~text
The same program runs on both allies, but runner index can separate their branches. Read the check, then make your prediction before Start Level.
~~~

### Bug Hunt: Role Split
- id: `bughunt-37`
- source: `src/config/levels/phases/advanced-teamplay/bughunt-37-role-split.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Two allies are crowding the same lane.
~~~
- introText:
~~~text
The shared starter sends both allies toward the same ground. Trace the runner-index branches and find where their jobs stop being different.
~~~
#### Tips
- tip 1:
~~~text
Runner index is what lets one program mean different jobs for different allies.
~~~
- tip 2:
~~~text
When two allies chase the same target, check whether one index lost its own branch.
~~~
- tip 3:
~~~text
Repair the local jobs without adding a second program.
~~~
#### Tutorial Steps
##### Step 1: Trace The Roles
- id: bughunt-37-trace
- demo Blockly: no
- body:
~~~text
Trace each runner index through the shared program. Where do the two allies begin making the same choice?
~~~
##### Step 2: Split The Jobs
- id: bughunt-37-fix
- demo Blockly: no
- body:
~~~text
One branch is sending both runners to the same ground. Repair the split so each index has its own local job.
~~~

### Challenge 37: Advanced Scrimmage
- id: `advanced-scrimmage`
- source: `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1}
- opponent runners: 3 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Three allies face three live defenders across a wide field.
~~~
- introText:
~~~text
Your team needs a point against three live defenders. One shared program must give each ally a useful local response as the field changes.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: A Full Team Script
- id: level-35-capstone
- demo Blockly: no
- body:
~~~text
Three allies run one shared program against three live defenders on the far side. Build local rules that give the team different work.
~~~
##### Step 2: Bring A Point Home
- id: level-35-real-score
- demo Blockly: no
- body:
~~~text
A point is the goal. Any ally can carry it home, so watch what each runner sees as the scrimmage shifts.
~~~

## Phase: optional

### Optional Lab: Move Randomly
- id: `optional-random-lab`
- source: `src/config/levels/phases/optional/level-38-optional-random-lab.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":2,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
A clear lane leaves the next move to chance.
~~~
- introText:
~~~text
Move Randomly chooses a direction each turn. Run the same program more than once and watch how the path changes.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: A Random Direction
- id: level-36-random
- demo Blockly: no
- body:
~~~text
Move Randomly picks one of the four directions each turn. The runner does not know which direction comes next.
~~~
##### Step 2: Run It Again
- id: level-36-lab
- demo Blockly: no
- body:
~~~text
One run may reach the marker quickly; another may wander. Watch what stays the same and what chance changes.
~~~

### Optional Lab: Double Carrier Showdown
- id: `optional-double-carrier-showdown`
- source: `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_HumanP1"}
- opponent runners: 3 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- none

- description:
~~~text
Both teams begin with a carrier, and neither can score while its own flag is away.
~~~
- introText:
~~~text
You carry the enemy flag, but Team 2 carries yours. Bring your flag home before your carrier can score. The field needs escort and interception.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Two Carriers, One Decision
- id: optional-double-carrier-intro
- demo Blockly: no
- body:
~~~text
Your human runner starts with the enemy flag, and Team 2 already has yours. Your team cannot score until your own flag returns home.
~~~
##### Step 2: Split Escort And Intercept
- id: optional-double-carrier-roles
- demo Blockly: no
- body:
~~~text
Runner index and teammate-has-flag can give allies different views of the two carriers. Decide who should watch each side of the field.
~~~
