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
Guide your ally runner to the highlighted target square.
~~~
- introText:
~~~text
This first level is a quiet practice board. Your block program controls the ally runner, and the other runners stay still so you can focus on one simple goal.
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
If you ever want the lesson again, use Show Tutorial.
~~~
#### Tutorial Steps
##### Step 1: Meet The Board
- id: level-1-board
- demo Blockly: no
- body:
~~~text
The board is a grid of spaces. Your ally runner starts on the left, the enemy runners are on the right, and the highlighted square is today’s goal.
~~~
##### Step 2: Frozen Means Staying Still
- id: level-1-frozen
- demo Blockly: no
- body:
~~~text
In this lesson, the enemy runners are frozen. That simply means they will not move while you practice the basics.
~~~
##### Step 3: Start With On Each Turn
- id: level-1-event
- demo Blockly: no
- body:
~~~text
Every ally program begins with the On Each Turn block. Any blocks connected below it will run each time your ally takes a turn. The goal square is waiting — what would you tell the ally to do?
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
Start thinking of the enemy flag as your goal.
~~~
- introText:
~~~text
Your ally needs to reach the enemy flag, not just a target square.
~~~
#### Tips
- tip 1:
~~~text
A flag marks each team’s side of the field.
~~~
- tip 2:
~~~text
Move Backward moves in the opposite direction of forward — that might be exactly what this board needs.
~~~
- tip 3:
~~~text
You still only get one action from the program each ally turn.
~~~
#### Tutorial Steps
##### Step 1: New Goal: Reach The Enemy Flag
- id: level-2-goal
- demo Blockly: no
- body:
~~~text
This time the goal is the enemy flag on the right side of the board instead of a practice target square.
~~~
##### Step 2: A New Move Is Available
- id: level-2-new-block
- demo Blockly: no
- body:
~~~text
Move Backward moves the ally in the opposite direction of forward. Look at where your ally starts and where the flag is — sometimes the goal is behind you.
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
Bring the enemy flag back home to score a point.
~~~
- introText:
~~~text
This puzzle has two phases: first go get the enemy flag, then bring it back to your own side.
~~~
#### Tips
- tip 1:
~~~text
Scoring happens when your ally returns with the enemy flag.
~~~
- tip 2:
~~~text
Think about how the ally should behave before pickup and after pickup.
~~~
- tip 3:
~~~text
The enemy runners are still frozen so the challenge stays focused on scoring.
~~~
#### Tutorial Steps
##### Step 1: Two Jobs In One Puzzle
- id: level-3-flag
- demo Blockly: no
- body:
~~~text
Reaching the enemy flag is only the first half of the job. Your ally then has to carry it all the way back home.
~~~
##### Step 2: A Condition Can Split The Two Phases
- id: level-3-condition
- demo Blockly: yes
- demoTitle:
~~~text
Pattern preview
~~~
- demoCaption:
~~~text
An if/else block runs one branch when a condition is true and the other branch when it is false — the same structure you will use with a different condition here.
~~~
- body:
~~~text
The new flag check can help the ally change plans once it is carrying the enemy flag. Try to make the program notice when the job changes.
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
Notice the obstacle ahead and choose a detour.
~~~
- introText:
~~~text
The direct lane is blocked. This is the first time the ally needs to look at the board and react instead of repeating the same move forever.
~~~
#### Tips
- tip 1:
~~~text
The obstacle in front of the ally is intentional.
~~~
- tip 2:
~~~text
Think about what should happen when the path is blocked and when it is clear.
~~~
- tip 3:
~~~text
You still only get one action each ally turn.
~~~
#### Tutorial Steps
##### Step 1: A Barrier Blocks The Lane
- id: level-4-barrier
- demo Blockly: no
- body:
~~~text
Straight ahead no longer works. The ally needs to notice the obstacle and choose another move.
~~~
##### Step 2: Use A Board Check
- id: level-4-condition
- demo Blockly: yes
- demoTitle:
~~~text
Pattern preview
~~~
- demoCaption:
~~~text
An if/else block runs the DO branch when its condition is true and the ELSE branch when it is false — the same two-path structure you will use here.
~~~
- body:
~~~text
The new barrier condition lets your program ask whether the path ahead is blocked. That helps the ally decide when it should detour.
~~~

### Level 5: Forward Works Both Ways
- id: `mirror-forward`
- source: `src/config/levels/phases/foundations/level-05-mirror-forward.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":7,"y":4}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-banned-phrase: tips[2] contains banned meta phrase "this level teaches" (charter S5 voice contract)

- description:
~~~text
See that Move Forward follows the runner’s own direction, not the screen.
~~~
- introText:
~~~text
Forward does not always mean right on the screen. It means moving toward that runner’s goal direction.
~~~
#### Tips
- tip 1:
~~~text
The ally starts on the right this time.
~~~
- tip 2:
~~~text
Watch the runner, not the screen, to understand what forward means.
~~~
- tip 3:
~~~text
This level teaches relative direction before the sensing lessons begin.
~~~
#### Tutorial Steps
##### Step 1: Forward Is Relative
- id: level-5-mirror
- demo Blockly: no
- body:
~~~text
This ally starts on the opposite side. Forward still works because it follows the runner's own goal direction, not the screen.
~~~
##### Step 2: The Same Block, A Different Facing
- id: level-5-forward
- demo Blockly: no
- body:
~~~text
The same block that worked on the left side of the board applies here too. Think about what forward means for a runner facing the other direction — the board orientation has changed but the concept has not.
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
Predict the ally's first move before you run the program.
~~~
- introText:
~~~text
Read the starter code, choose your prediction, and then run the level to compare what happened.
~~~
#### Tips
- none
#### Tutorial Steps
##### Step 1: Predict Before You Run
- id: prediction-06-intro
- demo Blockly: no
- body:
~~~text
Read the starter program, choose where the ally will move first, and then press Start Level to check your tracing.
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
Use the generic sensor block to detect an enemy directly in front and route around it.
~~~
- introText:
~~~text
The sensing system becomes more flexible here. One sensor block shape can ask about different board objects — not just barriers.
~~~
#### Tips
- tip 1:
~~~text
The generic sensor block has two dropdowns: what to look for, and how to describe its position.
~~~
- tip 2:
~~~text
An enemy is sitting in the lane ahead — you need to sense it and choose a different move.
~~~
- tip 3:
~~~text
Later levels will use this same block to sense flags, walls, and more.
~~~
#### Tutorial Steps
##### Step 1: One Block Shape, Many Sensor Ideas
- id: level-6-generic-sensor
- demo Blockly: yes
- demoTitle:
~~~text
Example sensor branch
~~~
- demoCaption:
~~~text
This example detects a barrier directly in front and steps up to detour around it. Your level uses the same relation but a different object — swap the object dropdown to match what is actually in the lane.
~~~
- body:
~~~text
In an earlier level you used a block that checked for a barrier specifically. This new sensor block works the same way — but the dropdowns let you describe other objects and positions too. The demo below shows it checking for a barrier; your level needs you to check for something else.
~~~
##### Step 2: Route Around The Enemy
- id: level-6-barrier
- demo Blockly: no
- body:
~~~text
An enemy runner is frozen in the lane ahead. Sense it directly in front and step up to go around — then resume forward progress once you are past it.
~~~

### Level 7: Watch the Wall
- id: `watch-the-wall`
- source: `src/config/levels/phases/sensing/level-07-watch-the-wall.js`

#### Board Summary
- win condition: {"type":"runner_reaches_cell","runnerId":"runner_1_AI_AllyP1","targetCell":{"x":5,"y":5}}
- opponent runners: 0 live, 2 frozen
- boardDynamicsTier: not set

#### Copy-Voice Lint Hits
- copy-voice-banned-phrase: tips[0] contains banned meta phrase "beginner-friendly" (charter S5 voice contract)

- description:
~~~text
Use the generic sensor to detect an edge or wall and steer around it.
~~~
- introText:
~~~text
The same sensor family can notice map walls too, not just placed barriers.
~~~
#### Tips
- tip 1:
~~~text
Edge or wall is a beginner-friendly sensing target in this phase.
~~~
- tip 2:
~~~text
This map uses real wall cells instead of a temporary barrier.
~~~
- tip 3:
~~~text
You still only get one move each ally turn.
~~~
#### Tutorial Steps
##### Step 1: Walls Count Too
- id: level-7-wall
- demo Blockly: no
- body:
~~~text
The Edge or Wall option can notice map geometry. Here, the ally needs to react to wall cells in the way.
~~~
##### Step 2: Relation Means How The Object Is Positioned
- id: level-7-relation
- demo Blockly: no
- body:
~~~text
The relation dropdown tells the sensor what kind of position to check. This level uses directly in front.
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
Use directional sensing to move the ally toward the human runner.
~~~
- introText:
~~~text
Now the sensor can describe where something is on the board, not just whether it is immediately in front.
~~~
#### Tips
- tip 1:
~~~text
Use the human runner as the sensed object.
~~~
- tip 2:
~~~text
The highlighted support square next to the human is the goal, not the occupied human cell.
~~~
- tip 3:
~~~text
Think about how you would describe the human’s position from the ally’s point of view.
~~~
- tip 4:
~~~text
You may need more than one check to guide the ally to the support square.
~~~
#### Tutorial Steps
##### Step 1: Use A Sensor To Find The Human
- id: level-8-human
- demo Blockly: yes
- demoTitle:
~~~text
Example support-route program
~~~
- demoCaption:
~~~text
This example sensor branch uses a different object than the one available here. Notice how the block has two dropdowns — one for what to sense and one for where to look.
~~~
- body:
~~~text
The sensor block can now look for the human runner and describe whether that runner is forward, behind, above, or below. Your goal is to guide the ally to the marked support square beside the human.
~~~
##### Step 2: Forward And Above Are Different Ideas
- id: level-8-axes
- demo Blockly: no
- body:
~~~text
Forward and behind use the ally's play direction. Above and below still use the screen.
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
Use directional sensing to guide the ally to the enemy flag.
~~~
- introText:
~~~text
The same sensing pattern can point at goals like the enemy flag, not just runners.
~~~
#### Tips
- tip 1:
~~~text
This time the target is the enemy flag instead of the human runner.
~~~
- tip 2:
~~~text
The relation dropdown still describes the flag's position relative to the ally.
~~~
- tip 3:
~~~text
Notice how the same sensor idea can shift from runners to goals.
~~~
#### Tutorial Steps
##### Step 1: Sense The Flag's Position
- id: level-9-flag-sensor
- demo Blockly: no
- body:
~~~text
The sensor block can also look for the enemy flag. Use the same forward, behind, above, and below ideas to steer toward it.
~~~
##### Step 2: Reusable Thinking
- id: level-9-reuse
- demo Blockly: no
- body:
~~~text
You are reusing the same condition pattern on a different object. That is a big step toward more flexible programs.
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
Use the human runner controls, then reach the goal only after you use Jump or Place Barrier first.
~~~
- introText:
~~~text
This level is about you, not the ally program. Move the human runner with the keyboard and use Jump or Place Barrier before reaching the goal.
~~~
#### Tips
- tip 1:
~~~text
Use W A S D to move the human runner on screen.
~~~
- tip 2:
~~~text
Press F to jump, B to place a barrier, and X to stay still.
~~~
- tip 3:
~~~text
The goal only counts after you have used Jump or Place Barrier first.
~~~
- tip 4:
~~~text
The program panel stays on screen, but this lesson is about direct player control.
~~~
#### Tutorial Steps
##### Step 1: Now You Control The Human Runner
- id: level-10-human-focus
- demo Blockly: no
- body:
~~~text
This lesson pauses the ally idea for a moment so you can practice what the human runner does in the match.
~~~
##### Step 2: Keyboard Controls
- id: level-10-human-keys
- demo Blockly: no
- body:
~~~text
Use W A S D to move. Press F to jump, B to place a barrier, and X to stay still. In free play, these human actions happen alongside your ally program.
~~~
##### Step 3: Try One Special Action First
- id: level-10-human-special
- demo Blockly: no
- body:
~~~text
This challenge only passes if you reach the goal after you use Jump or Place Barrier first. Reaching the goal without one of those actions does not count yet.
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
Use the Move Toward helper block to take one smart step toward the enemy flag.
~~~
- introText:
~~~text
Move Toward is a shortcut block. It chooses one step toward a target, but it does not magically find a full path.
~~~
#### Tips
- tip 1:
~~~text
This helper chooses one move each turn, not a whole route.
~~~
- tip 2:
~~~text
It works best on open maps and simple corridors.
~~~
- tip 3:
~~~text
You can still compare it with the regular movement blocks.
~~~
#### Tutorial Steps
##### Step 1: Meet Move Toward
- id: level-11-helper
- demo Blockly: no
- body:
~~~text
This block takes one step toward the target you choose. Here the only target is the enemy flag.
~~~
##### Step 2: It Is A Helper, Not Magic
- id: level-11-not-pathfinding
- demo Blockly: no
- body:
~~~text
Move Toward is useful on open maps like this one. Later you will learn when helper moves work well and when you need more detailed logic.
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
Use Move Toward for the trip out and the trip back.
~~~
- introText:
~~~text
The helper block now has two jobs: head toward the enemy flag first, then turn back toward home after pickup.
~~~
#### Tips
- tip 1:
~~~text
Think about how the target should change after pickup.
~~~
- tip 2:
~~~text
Move Toward enemy flag works on the way out, even when the route needs both horizontal and vertical steps.
~~~
- tip 3:
~~~text
Move Toward my base works on the way home.
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
An if/else block checks a condition each turn and runs a different branch depending on the result. The condition and actions here are different from what this level needs — use this just to see the structure.
~~~
- body:
~~~text
This helper block can point at different goals. Here the ally should chase the enemy flag first and then head for home.
~~~
##### Step 2: Switch Targets After Pickup
- id: level-12-switch
- demo Blockly: no
- body:
~~~text
The If I Have Enemy Flag condition is the bridge that tells the ally when to stop chasing the flag and start going home.
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
Use distance sensing to react when an enemy runner gets close.
~~~
- introText:
~~~text
Distance sensors use ideal move count, not line-of-sight. That means the game measures how many grid steps away something is.
~~~
#### Tips
- tip 1:
~~~text
Within 2 spaces and within 3 spaces use Manhattan distance.
~~~
- tip 2:
~~~text
Try giving the ally one response for danger and another response for normal progress.
~~~
- tip 3:
~~~text
This level is easier if you think about ideal grid moves, not straight-line distance.
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
This sensor branch uses an object and relation that are not available in this level. The structure is the same one you will use — pick the right object and relation from the dropdowns for this puzzle.
~~~
- body:
~~~text
Within 2 spaces means the target is close in ideal grid moves. It does not mean the target is visible in a straight line.
~~~
##### Step 2: Notice The Enemy Before It Is Too Close
- id: level-13-nearby-enemy
- demo Blockly: no
- body:
~~~text
Use the distance check to change the ally's move when the enemy runner gets nearby, then fall back to forward progress when the lane feels safe.
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
Use Jump Forward as the one decisive action that clears a wall and lands on the goal side.
~~~
- introText:
~~~text
This lesson is about a single leap. One Jump Forward should carry the ally over the wall and into the winning lane.
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
This level is about noticing what one jump can do, not writing a long program.
~~~
#### Tutorial Steps
##### Step 1: Jump Is A One-Time Leap
- id: level-14-jump
- demo Blockly: no
- body:
~~~text
Jump Forward moves two cells ahead and ignores the space in between, but you only get one jump each round. For this lesson, a single jump block is enough.
~~~
##### Step 2: No Backward Jump
- id: level-14-no-backward-jump
- demo Blockly: no
- body:
~~~text
This game only supports jumping forward. The wall blocks the whole column, so the dramatic move here is to leap straight across it.
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
Trace the first action and repair the flag-phase bug before the lane turns into a full challenge.
~~~
- introText:
~~~text
This starter is almost right, but one branch is reversed. Read the first action carefully, then repair the flag switch so the ally chooses the right target at the right time.
~~~
#### Tips
- tip 1:
~~~text
Only the first reached action runs on a turn, so start by checking the very top of the program.
~~~
- tip 2:
~~~text
When the ally has the enemy flag, the return-home branch should take over.
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
The starter is intentionally wrong. Trace the very first decision and ask whether the ally is headed toward the flag or back home when it should be doing the opposite.
~~~
##### Step 2: Repair The Flag Phase
- id: bughunt-15-fix
- demo Blockly: no
- body:
~~~text
This is a debugging level, not a blank slate. Keep the same shape, but fix the reversed target so the ally can switch cleanly between the two phases.
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
Pick up the enemy flag and bring it home while one defender guards the lane and another enemy keeps moving.
~~~
- introText:
~~~text
No new tools this time. One enemy holds the lane near the flag, and another keeps moving. Use what you know.
~~~
#### Tips
- tip 1:
~~~text
One enemy guards the lane while another keeps moving. Watch both threats.
~~~
- tip 2:
~~~text
Checking the enemy's distance before committing to a direction can help you plan a safer route.
~~~
- tip 3:
~~~text
The enemy flag needs to come all the way back home to score a point.
~~~
#### Tutorial Steps
##### Step 1: A Real Game Situation
- id: dodge-and-deliver-real-game
- demo Blockly: no
- body:
~~~text
This is a real game situation — one enemy guards the lane and another keeps moving. Your program needs to make progress while staying out of trouble.
~~~
##### Step 2: Your Full Toolkit
- id: dodge-and-deliver-toolkit
- demo Blockly: no
- body:
~~~text
All the tools from the previous levels are here. There is no single right answer — think about how your ally should balance chasing the flag and handling both threats.
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
