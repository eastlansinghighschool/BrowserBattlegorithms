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
A stray action steals the turn before the barrier check can run.
~~~
- introText:
~~~text
This program already knows how to place a barrier, but one move block sits in front of the real decision. Trace the order, fix the first action, and keep the barrier logic readable.
~~~
#### Tips
- tip 1:
~~~text
Only the first action reached on a turn runs, so a move block can hide everything after it.
~~~
- tip 2:
~~~text
The barrier check is already there; the bug is that it never gets the chance to run first.
~~~
- tip 3:
~~~text
Fixing a bug hunt usually means repairing the smallest broken piece, not rebuilding the whole program.
~~~
#### Tutorial Steps
##### Step 1: Trace The Top Of The Stack
- id: bughunt-22-trace
- demo Blockly: no
- body:
~~~text
The first action is the important one here. Ask what the runner does before the barrier check ever starts.
~~~
##### Step 2: Put The Check First
- id: bughunt-22-order
- demo Blockly: no
- body:
~~~text
The fix should be small: move the readiness branch back to the front so the barrier action can run before any extra motion.
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
Score a point against live defenders using any tool you have learned so far.
~~~
- introText:
~~~text
No new tools this time. Two enemies are active. Use what you know to score.
~~~
#### Tips
- tip 1:
~~~text
You have movement, sensing, flag state, helper blocks, barriers, jumping, and freeze.
~~~
- tip 2:
~~~text
There is more than one way to win — experiment with what you have.
~~~
- tip 3:
~~~text
Freeze is a team power that can give you a window to act.
~~~
#### Tutorial Steps
##### Step 1: No New Tools
- id: show-what-you-know-challenge
- demo Blockly: no
- body:
~~~text
This level does not introduce anything new. Two enemies are active and you need to score a point — use any combination of what you have already learned.
~~~
##### Step 2: Think Like A Programmer
- id: show-what-you-know-strategy
- demo Blockly: no
- body:
~~~text
There is no single right program. Think about what conditions matter, what actions respond to them, and what your ally should do when the situation changes.
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
Start the Strategy Brain by using Move Toward on the closest enemy.
~~~
- introText:
~~~text
This is the first step of your shared Strategy Brain. It learns to track the closest threat and begin a project-sized response.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: A New Set Of Tools
- id: level-21-advanced-layer
- demo Blockly: no
- body:
~~~text
This first project level introduces the Strategy Brain. The toolbox is broader now because later steps will add numbers and boolean choices; for the moment, focus on how Move Toward can track the nearest threat.
~~~
##### Step 2: A New Move Toward Target
- id: level-21-target
- demo Blockly: no
- body:
~~~text
Closest enemy picks the nearest active opponent and steps toward them. Your shared program starts by deciding who matters most.
~~~
##### Step 3: Intercept The Runner
- id: level-21-board
- demo Blockly: no
- body:
~~~text
This step is about tracking a threat, not chasing a flag. Watch how the target sits off the main lane and ask where the strategy should bend.
~~~

### Level 24: How Far Away?
- id: `how-far-away`
- source: `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":2}}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-prose-length: introText is 39 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
Use a number comparison with distance to closest enemy.
~~~
- introText:
~~~text
The Strategy Brain now measures distance to the closest enemy as a number. Compare that value to a threshold and move up when the defender is at or more than a certain distance to move in a diagonal pattern.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Distance Is A Number Now
- id: level-24-distance
- demo Blockly: yes
- demoTitle:
~~~text
Example piece-by-piece selection
~~~
- demoCaption:
~~~text
The demo shows how the new if/else block (found in the Advanced block drawer) can be built from smaller pieces. The sensor is familiar; the shape is the new idea.
~~~
- body:
~~~text
The new compare piece turns distance into a number you can check with <, <=, >, and the other operator choices. This level is where range becomes part of the strategy.
~~~
##### Step 2: Choose A Move By Range
- id: level-24-compare
- demo Blockly: no
- body:
~~~text
The barrier and defender make the direct lane unreliable. Use the distance value to decide when the ally should break off and turn upward.
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
Use AND so freeze only happens when the enemy is close and the team power is ready again.
~~~
- introText:
~~~text
The same Strategy Brain can wait for two truths at once. Here it should only spend the freeze when both the distance and readiness checks say to act.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Both Must Be True
- id: level-23-and
- demo Blockly: no
- body:
~~~text
AND is useful for a timed power: close enough to matter, and ready to use again. That is how the shared program decides when to spend its freeze.
~~~
##### Step 2: Freeze Then Continue
- id: level-23-lane
- demo Blockly: no
- body:
~~~text
After the freeze is spent, the ally should keep moving toward the flag. The Strategy Brain should not get stuck on the special action.
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
Use OR to react when either danger condition becomes true.
~~~
- introText:
~~~text
This level has two danger checks: one for crossing into enemy territory, and one for an enemy runner nearby. OR lets either one trigger the same response.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Either Warning Works
- id: level-24-or
- demo Blockly: no
- body:
~~~text
OR is true when at least one of its inputs is true. That makes one branch react to two different kinds of danger without rewriting the whole program.
~~~
##### Step 2: Cross Then Turn
- id: level-24-path
- demo Blockly: no
- body:
~~~text
Look at where the ally needs to go and what stands in the way. Think about when OR lets the Strategy Brain keep one rule for two situations.
~~~

### Level 27: Flip The Answer
- id: `flip-the-answer`
- source: `src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":6,"y":2}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-prose-length: introText is 45 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
Use NOT to reverse a boolean check.
~~~
- introText:
~~~text
NOT turns a true test into a false one and vice versa, which is often the cleanest way to say what you mean.  Use NOT to flip on my side into not on my side. That lets the Strategy Brain react after it crosses midfield.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Reverse The Boolean
- id: level-25-not
- demo Blockly: no
- body:
~~~text
NOT is useful when the easier idea to say is the opposite of what you want to test. Your shared program can express the idea either way.
~~~
##### Step 2: Change After Crossing
- id: level-25-side
- demo Blockly: no
- body:
~~~text
NOT reverses whatever boolean it wraps — a true becomes false and a false becomes true. Think about which condition is easier to express, and whether flipping it gets the Strategy Brain what it needs.
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
Predict whether the AND branch runs before you observe the result.
~~~
- introText:
~~~text
The starter program checks two truths at once. Pick whether the branch is true, then run it and compare the outcome.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Trace Both Halves
- id: prediction-25-intro
- demo Blockly: no
- body:
~~~text
The AND block only returns true when both inputs are true. Read the board, choose your answer, and then run to check the branch.
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
A boolean operator is too eager, so the freeze fires before both facts are true.
~~~
- introText:
~~~text
This is a repair checkpoint for the Strategy Brain. The shape is almost right, but the boolean choice needs to wait for both truths at the same time.
~~~
#### Tips
- tip 1:
~~~text
If a boolean uses OR where AND is needed, it can fire much too early.
~~~
- tip 2:
~~~text
Think about what should be true together before the freeze happens.
~~~
- tip 3:
~~~text
The bug is in the boolean choice, not in the rest of the pathing.
~~~
#### Tutorial Steps
##### Step 1: Trace The Boolean
- id: bughunt-28-trace
- demo Blockly: no
- body:
~~~text
Read the condition piece by piece. The branch should wait until the ally is close enough and the freeze is still ready.
~~~
##### Step 2: Repair The Gate
- id: bughunt-28-fix
- demo Blockly: no
- body:
~~~text
The starter is intentionally using the wrong boolean shape. Swap the operator so both facts have to be true before the special action runs.
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
Put your complete Strategy Brain to the test against live defenders.
~~~
- introText:
~~~text
This is the final solo test of the Strategy Brain project. Three defenders are live, and your shared program should now do the whole job before team programming begins.
~~~
#### Tips
- tip 1:
~~~text
You have the full Strategy Brain toolkit — sensing, territory, NOT, freeze, barriers, and more.
~~~
- tip 2:
~~~text
Think about which tools matter most when an enemy is nearby and the whole program has to carry the run.
~~~
- tip 3:
~~~text
The next project changes everything — two allies will share one program.
~~~
#### Tutorial Steps
##### Step 1: One Last Solo Challenge
- id: full-team-tactics-last-solo
- demo Blockly: no
- body:
~~~text
This is the capstone for your Strategy Brain. Use any part of the single-ally toolkit to score against live defenders.
~~~
##### Step 2: What Comes Next
- id: full-team-tactics-next
- demo Blockly: no
- body:
~~~text
You have written programs that sense, decide, and use special actions. The next challenge asks you to do this for three enemies at once, but now with your ally as a teammate to your human runner.
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
- copy-voice-prose-length: introText is 50 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
Two allies now share one workspace. Use runner index so one ally attacks and the other supports.
~~~
- introText:
~~~text
This is the beginning of Team Strategy Script.  You want the ally with runner index 0 to be doing the scoring in this level, not the ally with runner index 1. The same program runs on both allies, so runner index has to decide which one takes the scoring job.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Workspace, Two Allies
- id: level-27-shared-program
- demo Blockly: no
- body:
~~~text
Both allies run the same blocks every turn. The first ally has index 0 and the second has index 1. A check like "if runner index equals 0" means only the first ally follows that branch — the second skips it and does something else instead.
~~~
##### Step 2: Index 0 And Index 1
- id: level-27-index
- demo Blockly: no
- body:
~~~text
Only one ally should take the scoring job here. The other ally needs to stay clear of the lane so the shared script stays readable.
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
Use runner index comparisons so one ally attacks and the other patrols upward.
~~~
- introText:
~~~text
The shared script is getting a job system. One ally is already pushing deep into enemy territory. Have that runner move out of the way, and send the other runner to score.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Compare The Index
- id: level-28-index-compare
- demo Blockly: no
- body:
~~~text
You can compare runner index to a number to choose different branches for different allies. That is how the shared script starts assigning jobs.
~~~
##### Step 2: Attacker And Patrol
- id: level-28-jobs
- demo Blockly: no
- body:
~~~text
Each index value can be assigned a different role. Think about which ally is better positioned for the scoring job, and what the other should do to stay out of the way.
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
Teach range checks on runner index so two allies take one job and the third takes another.
~~~
- introText:
~~~text
Now the team has three program-controlled allies. Index < 2 is a clean way to group the first two together and move them out of the way, while the third ally runs forward.
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
Index < 2 can group the first two allies together while index 2 heads forward. That keeps the shared script simple and readable.
~~~
##### Step 2: Three Allies, One Program
- id: level-29-three-allies
- demo Blockly: no
- body:
~~~text
Two allies need to clear space so the third runner can finish the puzzle.
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
Combine teammate-has-flag with runner index to send one ally home and another into support mode.
~~~
- introText:
~~~text
The lead ally starts with the flag already and should move back to base.  The other ally should move forward to support.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: One Ally Has The Flag
- id: level-30-teammate
- demo Blockly: no
- body:
~~~text
The lead ally begins as the carrier. Use teammate-has-flag plus index to send the second ally into position.
~~~
##### Step 2: Escort The Return
- id: level-30-support
- demo Blockly: no
- body:
~~~text
This challenge is about support movement, not chasing a new flag. The same script should protect the carrier and keep the lane open.
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
One ally attacks while another uses closest-enemy targeting as a defender.
~~~
- introText:
~~~text
This is the first advanced level where one ally chases the goal and another reacts to live enemies that have already crossed onto your side. The shared script is starting to split attack and defense.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Split The Team Jobs
- id: level-31-split
- demo Blockly: no
- body:
~~~text
Use runner index to make the first ally attack and the second react to the closest enemy. Each ally is still running the same code, just with a different role.
~~~
##### Step 2: Defend Your Side First
- id: level-31-pressure
- demo Blockly: no
- body:
~~~text
The defender’s job starts on your side of the field while the attacker keeps advancing.
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
One ally spends the freeze while another keeps advancing.
~~~
- introText:
~~~text
In this level, the lower ally is the freezer and the ally in line with the enemy flag runs to get it.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: A Team Freeze Specialist
- id: level-32-role
- demo Blockly: no
- body:
~~~text
Use runner index so only one ally spends the team freeze while the other keeps advancing. The freeze role should stay local and simple.
~~~
##### Step 2: Support The Run
- id: level-32-timing
- demo Blockly: no
- body:
~~~text
The freezer should act early enough to open the lane for the attacker.
~~~

### Level 35: Barrier Specialist
- id: `barrier-specialist`
- source: `src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js`

#### Board Summary
- win condition: {"type":"runner_reaches_enemy_flag","runnerId":"runner_1_AI_AllyP1"}
- opponent runners: 1 live, 1 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-prose-length: introText is 47 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
One ally places the team barrier to stop a patrolling NPC, opening the lane for the attacker.
~~~
- introText:
~~~text
An enemy is patrolling up and down the column your attacker needs to cross. Without a barrier, it will be in the attacker's lane at exactly the wrong moment. Have one ally place the barrier to cap the patrol, then keep the attacker moving toward the flag.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Only One Ally Should Place
- id: level-35-index-barrier
- demo Blockly: no
- body:
~~~text
Use runner index so the support ally places the barrier early, then retreats. The attacker should keep advancing toward the flag every turn.
~~~
##### Step 2: Cap The Patrol Lane
- id: level-35-patrol
- demo Blockly: no
- body:
~~~text
Watch where the patrolling NPC turns around. A barrier placed in its path limits how far it can travel, keeping the attacker's row clear.
~~~

### Level 36: Jump Team
- id: `jump-team`
- source: `src/config/levels/phases/advanced-teamplay/level-36-jump-team.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-prose-length: introText is 36 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
One ally uses the jump route while another takes a support path.
~~~
- introText:
~~~text
Resources can be assigned by role too. This level gives one ally the dramatic jump job, but that jumper still has to keep moving afterward, using the same shared script as the rest of the team.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Give The Jump To One Ally
- id: level-34-jump-role
- demo Blockly: no
- body:
~~~text
Index can decide which ally gets the jump job and which ally avoids the obstacle.
~~~
##### Step 2: One Dramatic Leap
- id: level-34-wall
- demo Blockly: no
- body:
~~~text
Only one ally should take the jump route. The second ally needs a different role, so the script stays decentralized.
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
Predict which runner takes the forward job when one program runs on both allies.
~~~
- introText:
~~~text
The shared program now runs on two allies. Pick which runner takes the first action, then run and compare the outcome.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Trace the Runner Index
- id: prediction-31-intro
- demo Blockly: no
- body:
~~~text
The same program runs on both allies, but runner index lets you choose which one takes the action. Read the branch, then make your prediction before you press Start Level.
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
Two allies are taking the same job, so one role never gets a useful branch.
~~~
- introText:
~~~text
This starter is a shared-program debugging checkpoint for the team-strategy arc. One runner should attack while the other stays out of the lane, but the else branch is wrong.
~~~
#### Tips
- tip 1:
~~~text
Runner index is what lets one program mean different jobs for different allies.
~~~
- tip 2:
~~~text
If two allies chase the same target, one of them is probably missing a distinct role.
~~~
- tip 3:
~~~text
A good fix gives each runner a useful local job without inventing a second program.
~~~
#### Tutorial Steps
##### Step 1: Trace The Roles
- id: bughunt-37-trace
- demo Blockly: no
- body:
~~~text
This shared program should give each ally a different job. Check which runner index enters the attack branch and whether the other ally gets a support job.
~~~
##### Step 2: Split The Jobs
- id: bughunt-37-fix
- demo Blockly: no
- body:
~~~text
The bug is that the second branch duplicates the wrong target. Change it so the allies do not all chase the same thing.
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
Use one shared program for three allies in a real capture-the-flag scrimmage.
~~~
- introText:
~~~text
This capstone brings together indexing, comparisons, movement helpers, and team strategy in one bigger match. It is the final test of the same shared program you have been improving all project long.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: A Full Team Script
- id: level-35-capstone
- demo Blockly: no
- body:
~~~text
This final level is a real scrimmage. One shared program has to divide attacking, defending, and support work across the team.
~~~
##### Step 2: Score For Real
- id: level-35-real-score
- demo Blockly: no
- body:
~~~text
The capstone only passes when your team actually scores a point in live play. Any ally can bring the point home, so focus on the role the script has assigned.
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
Try the Move Randomly block in a small sandbox challenge.
~~~
- introText:
~~~text
This optional lab is here to show the random movement block directly. It is not part of the main advanced unlock path.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Optional Randomness Lab
- id: level-36-random
- demo Blockly: no
- body:
~~~text
Move Randomly picks one of the four cardinal directions each turn. This lab is optional because randomness is harder to predict.
~~~
##### Step 2: Try A Few Runs
- id: level-36-lab
- demo Blockly: no
- body:
~~~text
Some attempts will finish faster than others. That is the point of the lab: to see how a random action feels in the game.
~~~

### Optional Lab: Double Carrier Showdown
- id: `optional-double-carrier-showdown`
- source: `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`

#### Board Summary
- win condition: {"type":"team_scores_point","teamId":1,"runnerId":"runner_1_HumanP1"}
- opponent runners: 3 live, 0 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-prose-length: introText is 55 words, over the ~35-word pre-play prose cap (charter S4)

- description:
~~~text
Both teams start with a carrier. Your team cannot score while your own flag is away — stop the enemy carrier to unblock the run.
~~~
- introText:
~~~text
Both teams start with a flag carrier already in motion. Under the scoring rules, your team cannot score while your own flag is away — stopping the enemy carrier is the only way to unblock your run. This lab is about using runner roles to escort your carrier and intercept theirs at the same time.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Two Carriers, One Decision
- id: optional-double-carrier-intro
- demo Blockly: no
- body:
~~~text
Your runner starts with the enemy flag, and Team 2 already has your flag. Your team cannot score while your own flag is away — stopping the enemy carrier is not optional, it is what unblocks the scoring run.
~~~
##### Step 2: Split Escort And Intercept
- id: optional-double-carrier-roles
- demo Blockly: no
- body:
~~~text
Use runner index and teammate-has-flag to give one ally escort duty and one ally interception duty. Intercepting the enemy carrier returns your flag home and unblocks the scoring run.
~~~
