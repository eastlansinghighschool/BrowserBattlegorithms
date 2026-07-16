# Teacher Facilitation Kit

> v0.1 - pacing estimates and stuck points are predictions pending classroom evidence. Refine after the first pilot session and update this file in place.

This kit complements [Teacher Guide](TeacherGuide.md) and [Student Guide](StudentGuide.md). Use it when you want pacing, intervention prompts, and discussion cues for a live classroom session.

## At a Glance

- Audience: a first-time teacher running Browser Battlegorithms as an hour-of-code activity or AP CSA bridge.
- Format: short facilitation companion, not a curriculum rewrite and not a level-by-level answer key.
- Time: the full campaign is about 2.5-3 hours across multiple sessions.
- Students should already know: they will build a Blockly program under `On Each Turn`, and only the first action reached runs.
- Be ready to discuss: one-action-per-turn execution, boolean reasoning, runner roles, local sensing, and when to trace before changing code.

## Prediction Checkpoints

- Prediction levels ask students to commit to an answer before they press **Start Level**.
- The useful teacher move is to ask, "What do you expect to happen first?" and wait for a concrete answer before the class runs the board.
- After the run, ask students to compare their prediction to the observed result using the words `trace`, `branch`, `direction`, or `runner index`.
- If a student wants to change code before predicting, redirect them back to the starter program and have them read the board first.
- In this curriculum, the pilot prediction checkpoints sit after L5, after L27, and after L36 so students can practice the habit before movement, boolean, and shared-program reasoning get more complex.

## Hour-of-Code Subset

### 50-minute visit

- Use a contiguous prefix: **L1-L7**.
- Warmup: **10 minutes** total.
  - 5 minutes to introduce the board, Blockly workspace, and one-action-per-turn rule.
  - 5 minutes to launch the first guided level together and show how to start/stop safely.
- Main play: **35 minutes** for L1-L7.
- Wrap-up: **5 minutes**.
- Buffer: if the class is moving slowly, keep the buffer for troubleshooting; if they fly through, stretch to L8 and use the extra time to preview the first debugging checkpoint later in the campaign.

### What students should leave with

Students should leave with the execution-model lesson: programs run one action at a time, conditionals decide which branch fires, and a simple Blockly loop can already make a teammate behave strategically.

## Per-Phase Facilitation

### Foundations (L1-L5)

- Concept introduced: movement, board vocabulary, and the idea that one turn produces one action. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **10-15 minutes**.
- Likely stuck points:
  - [predicted] L1-L2: students may stack multiple actions or expect every block to run.
  - [predicted] L5: students may treat "forward" as a fixed direction instead of a play-direction-relative idea.
- Intervention prompts:
  - "What is the one thing your ally should do on this turn?"
  - "If your ally turns around, what still counts as forward?"
  - "What changes when the board faces the other way?"
- Discussion question:
  - "How is this like tracing an `if` statement in Java, where only one path actually executes?"
- Extension idea:
  - Ask early finishers to predict a move before running, then explain why the board result matched or differed.

### Sensors & Branches (L6-L14)

- Concept introduced: sensor objects, relation dropdowns, edge/wall sensing, distance, and the first named conditional branches. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **25-35 minutes**.
- Likely stuck points:
  - [predicted] L6-L7: students may mix up object vs. relation dropdowns.
  - [predicted] L8-L10: students may think a sensor is a fact about the whole board, not a question about one target.
  - [predicted] L13-L14: students may overuse movement blocks instead of reading the sensor first.
- Intervention prompts:
  - "What exactly is this sensor asking about?"
  - "Which target are you checking, and what answer do you expect?"
  - "What does your code do when the sensor is false?"
  - "How could the same condition work on a different map?"
- Discussion question:
  - "Where do you see the same boolean idea that Java uses in `if (condition)` and `else`?"
- Extension idea:
  - Ask students to compare two sensor choices on the same board and explain which one is more precise.

### Bug Hunt 15 (after L14)

- Concept introduced: debugging a broken flag-phase program before the first synthesis challenge. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [predicted] students may trace the wrong branch because the starter already looks close to correct.
  - [predicted] students may forget that the first reached action owns the whole turn.
- Intervention prompts:
  - "What does the very top branch do before anything else can happen?"
  - "If the ally has the enemy flag, which target should it be moving toward?"
  - "What is the smallest change that repairs the bug?"
- Discussion question:
  - "How is debugging this level different from solving a blank-slate challenge?"
- Extension idea:
  - Ask early finishers to explain the bug aloud using the words `trace`, `branch`, and `target`.

### Synthesis Challenge 15 (authored L15)

- Concept introduced: no new tools; students combine movement, sensing, and scoring under pressure after the Bug Hunt 15 checkpoint. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [evidence] Students may think "no new tools" means something is missing instead of combining what they already know. Plan 23 repaired this level with a stationary defender and a wandering enemy to reduce luck-based attempts.
- Intervention prompts:
  - "Which tools from the earlier levels still fit this board?"
  - "What happens if you trace your program one turn at a time?"
  - "Which sensor would help you decide when to commit?"
- Discussion question:
  - "Why is synthesis harder than a brand-new block? What changes when the challenge is combining tools instead of learning one?"
- Extension idea:
  - Invite a faster student to explain the same solution in fewer blocks or with a different branch order.

### Resources & Territory (L16-L21)

- Concept introduced: readiness checks, resource actions, teammate state, territory conditions, and Area Freeze timing. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **30-40 minutes**.
- Likely stuck points:
  - [predicted] L17-L18: students may use a resource action without guarding it with readiness.
  - [predicted] L20-L21: students may confuse team-side thinking with literal left/right board position.
  - [evidence] L21: freeze timing is easiest to misuse if students do not ask whether the team resource is ready or cooling down.
- Intervention prompts:
  - "What must be true at the same time before this branch should run?"
  - "What does a readiness check buy you before a resource action?"
  - "Which part of the board state changes your choice?"
  - "If this resource has a ready or cooldown state, when should your code spend it?"
- Discussion question:
  - "Which board condition best matches the English phrase you would say out loud, and why?"
- Extension idea:
  - Ask students to restate one branch in plain English before they run it, then compare that sentence to the Blockly structure.

### Bug Hunt 22 (after L21)

- Concept introduced: debugging a barrier program where an early action steals the turn. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [predicted] students may focus on the barrier action and miss the stray move block above it.
  - [predicted] students may assume every visible block runs on the same turn.
- Intervention prompts:
  - "Which action happens first?"
  - "What does the runner do before the readiness check can even run?"
  - "How could you move the helpful branch back to the top?"
- Discussion question:
  - "Why is the order of blocks as important as the blocks themselves?"
- Extension idea:
  - Ask students to describe the bug as a `first action` problem rather than a barrier problem.

### Synthesis Challenge 22 (authored L22)

- Concept introduced: no new tools; a live scrimmage that asks students to apply everything from L1-L21 plus the Bug Hunt 22 checkpoint. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [evidence] Plan 26 repaired this level with deterministic vertical-patrol defenders so the challenge is about strategy, not luck.
  - [predicted] students may chase defenders instead of predicting patrol movement.
- Intervention prompts:
  - "Where do you think the defender will be next turn?"
  - "Which earlier concept tells you when to move and when to wait?"
  - "What would your program do if the defender were one square farther away?"
- Discussion question:
  - "What changes when a challenge stops giving you a new block and starts asking you to combine old ideas well?"
- Extension idea:
  - Challenge early finishers to beat the level with a shorter or clearer program, then explain the tradeoff.

### Bug Hunt 28 (after Prediction: Two Truths)

- Concept introduced: repairing boolean logic before the Field Decisions capstone. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [predicted] students may know the branch words but not the boolean logic that controls them.
  - [predicted] students may spend the freeze too early if they do not trace the condition carefully and watch the cooldown.
- Intervention prompts:
  - "Which two facts have to be true at the same time?"
  - "What happens if the boolean gate opens too early?"
  - "What is the smallest operator change that matches the intended behavior?"
- Discussion question:
  - "How does a bug hunt help you practice tracing boolean expressions before a capstone?"
- Extension idea:
  - Ask students to say the condition out loud in plain English before changing the blocks.

### Field Decisions Project (L23-L28)

- Concept introduced: shared latest code across a project arc, closest-threat targeting, numeric comparisons, boolean composition, and a project-capstone mindset. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **30-45 minutes**.
- Likely stuck points:
  - [evidence] L23-L24: students may not notice that code persists across levels once the project starts.
  - [evidence] L25-L27: numeric and boolean blocks can feel abstract unless students say the condition in board language first.
  - [evidence] Bug Hunt 28 and Challenge 28 benefit from slow-speed trace before changing code.
- Project callout:
  - Shared code means students should think in roles, not just in individual turns.
  - When the project-start callout appears, pause and name the persistence change before letting them edit.
  - If a team is stuck on the capstone, ask them to trace one runner at a time and look for the first branch that matters.
- Intervention prompts:
  - "How does the project remind you that code carries forward?"
  - "Which threat, distance, or side condition are you trying to reason about right now?"
  - "What is the first branch that makes this Field Decisions program work?"
- Discussion question:
  - "How are `AND`, `OR`, and `NOT` like Java boolean expressions?"
- Extension idea:
  - Ask students to describe their Field Decisions program in terms of board facts: threat, distance, side, resource, and flag state.

### Bug Hunt 37 (after Prediction: Role Split)

- Concept introduced: debugging a shared-program role split before the final team scrimmage. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **5-10 minutes**.
- Likely stuck points:
  - [predicted] students may let both allies chase the same target because the branches look symmetrical.
  - [predicted] students may forget that one runner index can support while another attacks.
- Intervention prompts:
  - "What job should runner 0 have that runner 1 should not?"
  - "Which branch is supposed to keep the second ally out of the lane?"
  - "How does the shared program need to split roles to stay readable?"
- Discussion question:
  - "Why does one shared program still need different jobs for different allies?"
- Extension idea:
  - Ask students to explain the fix as a role split, not just as a block swap.

### Team Strategy Script Project (L29-L37)

- Concept introduced: multi-ally coordination, runner-index grouping, and a second shared-code arc. See [the concept matrix](GUIDED_LEVEL_CONCEPT_MATRIX.md).
- Expected time band: **30-45 minutes**.
- Likely stuck points: [evidence] L29 project start is easy to miss; [evidence] L31-L36 role mapping is easy to mix up; [evidence] Bug Hunt 37 and Challenge 37 need deliberate tracing and review.
- Project callout: one program coordinates several allies through local rules, so pause at project start to name the role split before editing.
- If a team gets stuck on the capstone, have them test one role path at a time and compare outputs before adding complexity.
- Intervention prompts:
  - "How does your code treat the first ally differently from the others?"
  - "Which runner should become the escort, and which should stay defensive?"
- Discussion question: "Why is the shared-program idea a better fit for team coordination than writing a separate program for each runner?"
- Extension idea: invite students to redesign the role split for a different map and explain what would have to change.

## Discussion Prompts by AP CSA Theme

| Theme | Best moment to ask | Prompt |
| --- | --- | --- |
| Conditional control flow | End of Foundations, after L5 | "Which part of your program runs only when the condition is true, and which part runs otherwise?" |
| Boolean composition | Field Decisions, after L27 | "Why do `AND`, `OR`, and `NOT` let you say something a single sensor cannot?" |
| Trace before run | Before any Challenge level | "Before you press Play, which branch will fire first and why?" |
| Method-like decomposition via runner index | Start of Team Strategy Script, around L29-L31 | "How does `runner index` let one program behave like two role-specific methods?" |
| Resource management | After L16-L21 or at Challenge 22 | "When should your code spend a timed resource instead of saving it for later?" |

## Troubleshooting Quick Reference

| Student symptom | Teacher action |
| --- | --- |
| "My ally won't move." | Ask them to check that exactly one action is attached under `On Each Turn`, then use slow-speed trace to see which branch fired. |
| "I typed into a number block and nothing happened." | Ask them to click directly on the number field and confirm the value with Enter or Tab. |
| "My program looks right but the runner does the wrong thing." | Ask what the code does on the first turn that matches the board state, then turn on trace and watch the branch choice. |
| "I'm stuck on a challenge level." | Remind them the level is synthesis, not a new block, and ask which earlier tools still fit the board. |
| "I finished the campaign in 20 minutes." | Send them to Free Play or the next project as an extension instead of rushing the whole class forward. |
| "My PvP partner imported my code." | Remind them Private Export is for hot-seat privacy and use regular XML if they want to share code intentionally. |
| "I clicked Reset and lost my project workspace." | Explain that `Reset Level` restores the board but keeps project code; return to the project level and reload the current workspace if needed. |

## What to Do Next Session

- After the guided campaign, move students into the project arcs already shipped in the packet index: **Field Decisions** and **Team Strategy Script**.
- For open-ended practice, use **Free Play** with a map and team size that match the learning goal you want to discuss.
- If a future **Tournament mode** ships, it fits naturally after Free Play as a classroom competition layer.
- Revisit this kit after the first pilot session and replace the predicted pacing/stuck-point notes with classroom evidence.
