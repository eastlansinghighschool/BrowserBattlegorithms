Recommendation: after Plans 09-14, I’d bias toward **learning visibility and classroom robustness**, not more mechanics. The game already has enough raw strategic surface area. The next value is helping students predict, debug, explain, compare, and transfer.

Here are 9 concrete directions I think are worth considering.

1. **Turn Trace / “Why Did My Ally Do That?” Debugger**

Add a student-facing turn trace that explains the first reached action for each ally: condition checked, result, chosen branch, action attempted, and outcome. This directly supports the one-action-per-turn model and would make advanced/project levels far more teachable.

Why it is not creep: it clarifies existing behavior instead of adding new behavior.

Problem waiting to surface: shared project code will make failures harder to diagnose. Students may see “my team script is bad” when the real issue is one branch, one runner index, or one blocked move.

2. **Prediction-First Challenge Prompts**

For selected guided/project levels, ask students to predict what their ally will do before running: “Which runner will move first?”, “Will index 0 or index 1 take this branch?”, “Will freeze happen this turn?” Could be lightweight, local-only, maybe logged in usage evidence.

This carries the mission beautifully: students stop treating Blockly as trial-and-error and start reading programs like AP CSA control flow.

High leverage: pair this with usage export so teachers can see not just completion, but reasoning attempts.

3. **AP CSA Bridge Mode / Java Preview Cards**

After students solve advanced Blockly levels, show a compact Java-like pseudocode preview of the same logic:

```java
if (runnerIndex == 0 && distanceToClosestEnemy <= 2) {
    freezeOpponents();
} else {
    moveToward(enemyFlag);
}
```

Not editable at first. Just a “same idea in code” bridge.

Why it fits: the project’s long-term goal includes AP CSA transfer. This would connect boolean expressions, comparisons, method-like decomposition, and event-loop thinking without turning the app into a Java IDE.

4. **Strategy Reflection Export**

Extend the usage evidence idea with one or two short reflection fields at project/capstone completion:

- “What role does runner index 0 have?”
- “What condition prevents wasting freeze?”
- “What would you change for a different map?”

This can be local and static, no server. It would make the teacher artifact more meaningful than raw pass/fail and code snapshots.

Problem waiting to surface: teachers may receive usage files but still struggle to infer understanding from Blockly XML alone.

5. **Guided Misconception Detectors**

Add local checks for common student mistakes and provide targeted, non-spoiler feedback:

- blocks outside `On Each Turn`
- multiple sequential actions where only the first can run
- no branch for a runner index that exists on the board
- later project code chasing enemy flag on a level where the ally already starts with the flag
- resource action used without readiness guard

This is a strong instructional layer because it points at mental models, not answers.

6. **Level Authoring Contract Linter**

Create a developer tool that audits guided levels for curriculum contracts:

- win condition requires the named concept
- toolbox includes all blocks used by reference/project fixtures
- demo XML does not solve the active puzzle
- project levels include project metadata
- turn limits leave reasonable debugging slack
- runner IDs in win conditions do not accidentally punish alternate valid strategies

This is a software lifecycle upgrade with curriculum value. It reduces regressions as the campaign grows.

7. **Teacher “Playtest Script” And Classroom Timing Kit**

Plan 06 covers playtest triage, but I’d make a teacher-facing artifact too: expected time bands, likely stuck points, suggested discussion questions, and “skip/extension” advice per phase or project.

This matters because an hour-of-code classroom activity lives or dies by pacing. The app can be correct and still fail if a teacher cannot decide when to intervene.

8. **Scenario Cards For Free Play**

Instead of only adding stronger AI opponents, add printable or in-app “scenario cards” for Free Play:

- “One runner must defend, one must escort.”
- “No Move Toward enemy flag allowed.”
- “Win using a barrier specialist.”
- “Design a team where index 0 never scores.”

This turns Free Play from sandbox sprawl into purposeful practice while preserving student agency.

9. **Accessibility And Classroom Display Pass**

Do a focused pass on projector readability, keyboard-only flows, modal focus trapping, reduced motion, color-independent status, and screen-reader labels for core controls. Some ARIA is already present, but the game has overlays, canvas, Blockly, sounds, modals, and emoji-rendered entities: that combination is fragile.

This is not glamorous, but it is classroom readiness. It also protects static deployment by avoiding “works on my laptop” assumptions.

My top three would be: **turn trace debugger**, **prediction/reflection layer**, and **level contract linter**. Together they make the app more teachable, more debuggable, and safer to evolve without just piling on more blocks or maps.