# Browser Battlegorithms: Future Directions Analysis

**Date:** 2026-05-12
**Scope:** Investigative — no mutations authorized

---

## 1. Turn Trace Debugger: "Why Did My Ally Do That?"

### The problem waiting to surface

The single most common student frustration in Blockly-driven games isn't "my code doesn't work" — it's **"I can't tell *which part* of my code ran this turn."** The current execution model resolves the first reached action silently. Students see the outcome (ally moved up) but have no way to trace *which conditional branch fired* or *why the condition was true/false* at that moment.

This is especially acute in the advanced levels where programs have nested AND/OR/NOT with multiple branches. The student's debugging loop becomes: stare at the board → guess which branch fired → change something → run again → repeat. That's a lot of guessing for a product that aims to teach boolean reasoning.

### The suggestion

Add an optional **turn trace panel** — a small, scrollable log that appears alongside the board after each turn. For each Blockly-controlled ally, show:

- The block that was evaluated
- Whether each condition was true or false (with the actual values: "distance to closest enemy = 4, threshold = 2 → false")
- The action that was ultimately selected
- Why the action succeeded or failed (bounced off wall, teammate in way, etc.)

This would be a collapsible panel, off by default, toggled with a "Show Trace" button. In guided mode, the trace could highlight the specific block in the Blockly workspace that was active.

### Why this matters more than it seems

- **AP CSA bridge:** This is exactly how students learn to trace through `if/else if/else` chains in Java. Seeing the trace in Blockly prepares them for desk-checking Java code.
- **Decentralized coordination debugging:** When two allies share a program, students can't currently tell which ally took which branch. The trace would show: "Ally 0: index == 0 → true → move toward flag" and "Ally 1: index == 0 → false → move toward closest enemy." This makes role-based programming legible.
- **Architecturally clean:** The `resolveFirstRunnableAction` function in `workspace.js` already walks the block tree. Adding a trace collector that records the path would be a targeted change to this one function, emitting events that the UI consumes.

### Risks
- Visual complexity on small screens. Must be collapsible and not interfere with the board or Blockly panel.
- Performance overhead from recording traces for large teams. Limit to Blockly-controlled allies only.

---

## 2. "Predict Before You Run" Mode

### The insight

Research on novice programming consistently shows that **prediction exercises** are more effective than trial-and-error at building mental models. Students who are asked "what will happen when you press Run?" before seeing the result learn the execution model faster.

### The suggestion

Before the level starts running, show the initial board state and ask the student to place a **prediction marker** — a draggable dot or cell highlight — on the square where they think their ally will end up after 1 turn (or after N turns for simple early levels). After the turn resolves, show whether the prediction was correct with a brief "✓ Correct!" or "✗ Your ally went to (3,4) instead — the condition [barrier in front] was true."

This could be:
- **Required** on first attempt of guided levels 1–5 (where the execution model is being established)
- **Optional toggle** everywhere else ("Predict mode")
- **Tracked in usage data** as a signal of whether the student has internalized the model

### Why this isn't feature creep
- The current app already has the concept of `MAIN_GAME_STATES.SETUP` before `RUNNING`. The prediction step fits naturally into this state.
- The core lesson of the product is "programs execute step-by-step with one action per turn." Prediction directly exercises that lesson.
- This is a known effective technique from CS education research (Lister et al., tracing vs. writing, etc.)

### Risks
- Students may find it annoying if overused. Keep it to the first few levels, then make it opt-in.
- Needs careful copy: "Where will your ally be?" not "Guess what happens" (prediction, not guessing).

---

## 3. Strategy Comparison View: "My Code vs. The Demo"

### The problem

Students currently can't compare their program structure to the demo Blockly or to any reference pattern. They see the demo once, close it, build their own code, and have no way to see them side by side. For students who are stuck, the demo is a one-shot exposure that disappears.

### The suggestion

Add a **split-view comparison mode** that shows the student's current workspace on the left and the level's demo Blockly on the right. The demo side is read-only. Differences in structure (missing branches, different conditions, extra blocks) could be subtly highlighted.

This isn't "showing the answer" — the demo already exists and is designed to show structure without revealing the exact solution. The split view just makes the comparison actionable.

### Architectural fit
- The Blockly library supports multiple workspace instances. A read-only workspace loaded with the demo XML is straightforward.
- The demo XML already exists per level (`demoBlocklyXml` in level configs, if present).
- The comparison could be gated behind a "Compare to Demo" button that only appears after the student has made at least one attempt.

### Risks
- If the demo is too close to the solution, split-view makes copying trivial. This reinforces the existing contract: demos must show structure, not solutions.
- Screen real estate. This only works on wider screens or as a modal overlay.

---

## 4. Block-to-Java Translator Panel

### The opportunity

The product's stated goal is bridging to AP CSA. Currently, that bridge is conceptual — students learn boolean reasoning through blocks and the teacher says "this is like Java." A **live Block-to-Java panel** would make the connection concrete.

### The suggestion

Add a read-only panel (collapsible, like the trace) that shows a pseudo-Java translation of the current Blockly program. For example:

```java
// On Each Turn
if (hasEnemyFlag()) {
    moveToward(MY_BASE);
} else if (distanceTo(CLOSEST_ENEMY) <= 2) {
    moveUp();
} else {
    moveToward(ENEMY_FLAG);
}
```

This would update live as the student edits blocks. It doesn't need to be compilable Java — it needs to be *readable* Java-like pseudocode that uses the same boolean operators, comparisons, and if/else structure the student will see in AP CSA.

### Why this is high-leverage
- The translation is mechanical. Each block type maps to exactly one Java statement or expression. There are ~40 block types. The translator could be a single pure function.
- Teachers can use it for AP CSA prep discussions: "See how your AND block becomes `&&`? That's exactly how Java works."
- The `runner index` comparison maps directly to method parameters and array indexing — concepts that are otherwise hard to motivate for beginners.

### Risks
- Students might try to "write Java" by editing the panel. It must be clearly read-only.
- The pseudo-Java must be honest. Don't show loops if the execution model doesn't have loops. Don't show classes if the program isn't object-oriented.

---

## 5. Classroom Tournament Mode

### The gap

The product supports PvP hot-seat play, but there's no structured way for a teacher to run a classroom tournament. Students can export programs, but there's no way to pit Program A against Program B without manually importing them on one machine.

### The suggestion

Add a **local tournament runner** — a special free-play mode where:

1. Students export their programs as XML files
2. The teacher (or a designated student) imports two programs into a tournament match
3. The match runs fully automated (no human runners — both sides are Blockly-controlled)
4. Results are displayed with a simple scoreboard

This stays fully static/local — no server needed. The teacher collects XML files (USB stick, shared folder, Google Drive) and runs brackets on the projector.

### Why this matters for classroom use
- Competition is a powerful motivator, but only if the competition structure is fair and visible.
- "All-Blockly" matches (no human runner advantage) test pure program quality — exactly what you want students competing on.
- Tournament brackets on the projector create a shared classroom event that discussions about strategy can hang on.

### Architectural fit
- The turn engine already supports fully-automated matches (guided levels auto-skip human turns).
- The PvP infrastructure already loads two separate programs.
- The tournament is just a UI mode that imports two XMLs and runs a match with `humanTurnBehavior: AUTO_SKIP` for both sides.

### Risks
- Students may copy each other's programs. Usage evidence (Plan 04) helps, but the tournament itself doesn't need to solve this.
- Very long matches if both programs are defensive. Add a tournament-specific turn limit (e.g., 60 turns) with a draw outcome.

---

## 6. Progressive Difficulty Free-Play Challenges ("Daily Puzzles")

### The gap

After completing the guided campaign, students have only open-ended free play. Some students thrive in sandboxes; others need structured challenges to stay engaged. There's no intermediate between "follow the guided campaign" and "do whatever you want."

### The suggestion

Add a **challenge board** — a rotating set of free-play scenarios with specific win conditions, constraints, and leaderboard-style metrics (fewest turns, smallest program, etc.). Examples:

- "Score against Tactical CPU using only 4 blocks"
- "Win with team size 6 on the narrow map"
- "Score without using Move Toward"
- "Win using only Stay Still and Place Barrier for one ally"

These are authored as level-like configs but live in a separate "Challenges" section, not the guided campaign. They don't teach new concepts — they test creative application of mastered ones.

### Why this fills a real gap
- The gap between "guided campaign complete" and "productive free play" is where many students disengage.
- Constraint-based challenges are a well-known technique for deepening mastery (cf. code golf, creative constraints in game design).
- These can be added incrementally without touching the guided campaign.

### Risks
- Scope creep if the challenge set grows without curation. Keep it small (5–10 challenges at launch).
- Must not confuse the distinction between guided levels and challenges. Separate UI section.

---

## 7. Accessibility Overhaul: Screen Reader and Keyboard-Only Play

### The problem waiting to surface

The current product relies heavily on visual board state (p5 canvas), emoji rendering, and mouse-based Blockly interaction. There is no screen-reader description of the board state, no keyboard-only alternative to mouse-driven Blockly, and no high-contrast mode beyond whatever the OS provides.

For a classroom product, this is a time bomb. The first time a visually impaired student or a student who can't use a mouse enrolls in the class, the product is unusable.

### The suggestion

Phase this in stages:

1. **Board state narration:** Add an `aria-live` region that describes the board state in text after each turn: "Turn 5. Your ally is at row 4, column 3. Enemy flag is at row 4, column 9. Barrier at row 4, column 5." This is a screen-reader-only feature that doesn't affect visual UI.

2. **Blockly keyboard navigation:** Blockly itself has [experimental keyboard navigation support](https://developers.google.com/blockly/guides/configure/web/keyboard-nav). Enable it and test it with the project's custom blocks.

3. **High-contrast board mode:** Offer a toggle that replaces the subtle color scheme with high-contrast cell borders, larger emoji, and text labels on each entity.

### Why this is not optional
- AP CSA classrooms serve students with a wide range of abilities and accommodations.
- The product already has `aria-label` on some buttons (good) but nothing for the game board itself.
- Doing this later is much harder than doing it now, because every new feature that touches rendering or board state will need accessibility retrofitting.

---

## 8. Deterministic Replay and Permalink System

### The opportunity

The current product has no way to replay a match or share a specific game state. The usage tracker (Plan 04) records snapshots, but there's no playback mechanism.

### The suggestion

Since the game is deterministic given:
- A map
- Initial runner positions
- Both programs (XML)
- A random seed (for Move Randomly and turn-order shuffling)

...the entire match can be replayed from a compact **replay descriptor**: `{ map, seed, programA_xml, programB_xml }`. This could be:

1. **Serialized as a URL hash** — a permalink that anyone can open to see the exact match play out
2. **Exported as a small JSON file** alongside the usage export
3. **Loaded in a "replay viewer" mode** that steps through turn-by-turn with play/pause/step controls

### Why this matters
- Teachers can review student work without being present during the session.
- Students can share interesting matches with each other ("look what my program did on turn 12!").
- Turn-by-turn step replay is a powerful debugging tool — better than re-running because the student can step forward and backward without changing the program.
- The current random seed situation is implicit (`Math.random`). Making it explicit and seedable would also fix the L33 NPC turn-order test sensitivity flagged in the Plan 08 audit.

### Architectural fit
- The turn engine is already sequential and frame-by-frame. Adding a seed parameter to `state.randomFn` is a small change.
- The replay viewer is essentially the existing game loop with input replaced by recorded actions.

### Risks
- Replay files could become large if they store per-turn state. Store only the initial descriptor and re-simulate.
- URL hash size limits could be a problem for large programs. Use compression (e.g., lz-string) or fall back to file export.

---

## 9. Map Editor for Teacher-Authored Challenges

### The opportunity

The product currently ships with a fixed set of predefined maps. Teachers who want to create custom challenges (e.g., "program your ally to navigate this maze") have no way to do so without editing source code.

### The suggestion

Add a simple **grid-based map editor** accessible from a teacher tools section:

- Click cells to toggle wall/floor
- Place starting positions for runners and flags
- Set team bases
- Export as a JSON map definition that can be imported into free play

The editor would be a separate page (like `help.html`) that doesn't affect the main game. It generates a map config that the existing `MAPS` system can consume.

### Why this connects to the learning mission
- Teachers can design puzzles that match their specific curriculum ("I want a narrow corridor to teach about barrier placement" or "I want an open field to demonstrate when Move Toward works and when it doesn't").
- Student-authored maps are a creative extension: "Design a map where your program wins but your opponent's doesn't."
- This extends the product's life beyond the guided campaign without requiring new game mechanics.

### Risks
- Map validation is non-trivial. Must ensure both teams have paths to each other's flags, that bases are on opposite sides, etc.
- Could become a distraction from the programming focus if overemphasized. Position it as a teacher/advanced tool.

---

## 10. Embedded Formative Assessment Checkpoints

### The instructional design gap

The product currently has binary outcomes: pass or fail each level. There's no assessment of *understanding* — only of *completion*. A student who copies the demo and passes every level shows the same profile as a student who deeply understands boolean composition.

### The suggestion

At key transition points in the campaign (after Challenge 15, after Challenge 22, after Challenge 28, after L37), add a **checkpoint screen** with 2–3 brief formative assessment questions:

- **Trace questions:** "Given this board state and this program, which cell will the ally be on after 2 turns?" (multiple choice with visual board)
- **Debugging questions:** "This program is supposed to score but the ally gets stuck. Which block should change?" (show a buggy program and board)
- **Design questions:** "Draw a program (arrange blocks) that would make the ally do X." (simplified Blockly with 3–4 blocks)

These are not graded — they're formative. The student sees their answer and an explanation. The usage tracker records the responses for teacher review.

### Why this is pedagogically high-leverage
- Completion ≠ comprehension. The current product can't distinguish between the two.
- Trace and debug questions are the two strongest predictors of programming success in novices (CS education research: Lister, Soloway, etc.)
- This is where the AP CSA bridge becomes measurable: "Can this student trace through a multi-branch conditional?" is exactly an AP CSA skill.
- Teachers get evidence of understanding, not just evidence of completion.

### Risks
- Questions must be carefully authored to avoid being too easy (just read the program) or too hard (require knowledge not yet taught).
- Must not block progression. Students should be able to skip the checkpoint and come back later.
- Authoring good formative questions is expensive. Start with 2–3 questions at 2 checkpoints, not 10 questions at 5 checkpoints.

---

## Summary: Priority × Leverage Matrix

| Suggestion | Learning impact | Architectural cost | When to build |
| --- | --- | --- | --- |
| 1. Turn trace debugger | ★★★★★ | Medium — touches `resolveFirstRunnableAction` + new UI panel | Before classroom rollout |
| 2. Predict-before-run | ★★★★ | Low — new SETUP sub-state + prediction marker | After guided playtest (Plan 06) |
| 3. Strategy comparison view | ★★★ | Low — second read-only Blockly workspace | After Plan 03 (demo XML audit) |
| 4. Block-to-Java translator | ★★★★ | Low — pure function, ~200 lines | After projects ship |
| 5. Classroom tournament | ★★★★ | Low — new UI mode using existing infrastructure | After Plans 03–07 ship |
| 6. Progressive difficulty challenges | ★★★ | Low — new config section, no engine changes | After campaign validated |
| 7. Accessibility overhaul | ★★★★★ | Medium–High — canvas narration, Blockly keyboard nav, contrast mode | Start immediately, ship incrementally |
| 8. Deterministic replay | ★★★ | Medium — seedable RNG, replay viewer mode | After Plan 17 (game history) |
| 9. Map editor | ★★ | Medium — new page, map validation | Post-classroom; teacher tool |
| 10. Formative assessment checkpoints | ★★★★★ | Medium — question authoring + checkpoint UI | Before classroom rollout if possible |
