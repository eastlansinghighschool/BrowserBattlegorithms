# Plan 15: Pilot Readiness

## Packet Metadata

- Packet id: plan-15
- Packet title: Pilot Readiness
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-13
- Packet type: implementation / docs / frontend
- Mutation level: source-code / docs
- Approval gate: none (all changes are bounded, non-architectural, and reversible)
- Expected artifacts:
  - updated `help.html` with new sections
  - updated `src/config/constants.js` with unlock flag set to `false`
  - progress report
- Progress report folder: `reports/development/plan-15-pilot-readiness/`
- Progress report file: `reports/development/plan-15-pilot-readiness/progress.md`

## Packet Summary

Goal: Make the app student-ready for a short classroom pilot by fixing the all-levels-unlocked flag, expanding the help page to cover project levels and usage export, and verifying the challenge/capstone badge interaction on L28.

Non-goals:

- Do not add new game mechanics, blocks, or levels.
- Do not change Blockly, turn engine, or game rules.
- Do not redesign the help page layout or CSS. Use the existing help.html structure and help.css classes.
- Do not change the usage tracker internals. Only verify its output.
- Do not deploy to production. The integration owner handles deployment after review.
- Do not implement any future directions features (turn trace, prediction mode, Java panel, etc.).

Depends on: Plans 01–14 (excluding Plan 06).

Blocks: nothing.

Why this packet exists: The integration owner is about to run a classroom pilot with non-AP-CSA students. Three issues could cause day-1 confusion:

1. All guided levels are unlocked, defeating the progressive scaffolding and making usage data meaningless for tracking earned progression.
2. The help page has no mention of projects (shared-code behavior added in Plans 09–12) or usage export (added in Plan 04), so students have no reference material for the two most important pilot features.
3. L28 has both `levelKind: "challenge"` and `project.isCapstone: true`, which may produce conflicting badge/label signals in the level picker.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md` for game rules and terminology
- `docs/ARCHITECTURE.md` for module boundaries
- `docs/development/README.md` for cross-packet contracts
- `docs/development/project-sequence-decisions.md` for project definitions
- `help.html` for the current help page structure
- `src/assets/styles/help.css` for help page CSS classes

Do not redefine:

- The one-action-per-turn execution model.
- Project membership, toolbox policy, or level ordering (settled in Plans 08–12).
- Usage tracker behavior or schema (settled in Plan 04).
- Challenge vs. synthesis level distinction (settled in Plan 03).

## Required Reading

- `help.html` — current help page, target of most edits in this packet
- `src/assets/styles/help.css` — help page CSS classes available for new sections
- `src/config/constants.js` — line 18, `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING`
- `src/config/levels/shared/project.js` — project metadata shape
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js` — L28 with both challenge and capstone metadata

Optional/contextual reading:

- `src/ui/controls.js` lines 326–367 — usage export button handler (to verify wording in help text)
- `src/ui/levelPicker.js` — level picker rendering (to verify badge interaction)
- `docs/development/project-sequence-decisions.md` — project vocabulary and student-facing framing
- `index.html` lines 14–33 — usage export button HTML and aria-label

## Scope

### In scope

1. Set `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` to `false`.
2. Add a "Projects" help section to `help.html`.
3. Add a "Saving Your Work" help section to `help.html` covering usage export.
4. Expand the "How Block Programs Work" section to mention shared programs.
5. Expand the "Guided Levels vs Free Play" section to mention project levels.
6. Add practical usage guidance to the most complex advanced block descriptions.
7. Verify L28 badge interaction in level picker source and document any conflict.

### Out of scope

- Any changes to game rules, Blockly semantics, turn engine, or rendering.
- Any changes to `style.css`, `index.html`, or the main application UI.
- Changing level order, level count, toolbox restrictions, or project membership.
- Adding new help page CSS styles beyond reusing existing classes.
- Changing usage tracker behavior or export format.
- Deployment.

### Files and areas likely touched

- `src/config/constants.js` — one constant value change
- `help.html` — new sections, expanded existing sections, expanded block descriptions
- `src/ui/levelPicker.js` — read-only inspection for badge logic (no edit expected)

## Work Plan

1. Read `help.html` and `help.css` to understand the current section structure and available CSS classes.
2. Read `src/config/constants.js` and set `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` to `false`.
3. Read `src/config/levels/shared/project.js` and `docs/development/project-sequence-decisions.md` to confirm project vocabulary.
4. Add a "Projects" section to the help page sidebar and main content area.
5. Add a "Saving Your Work" section to the help page covering usage export.
6. Expand the "How Block Programs Work" section to explain shared programs.
7. Expand the "Guided Levels vs Free Play" section to mention project grouping.
8. Expand block descriptions for runner index, distance to target, AND, OR, NOT, and compare values with 1–2 sentence usage examples.
9. Read `src/ui/levelPicker.js` to check how `levelKind` and `project.isCapstone` interact in badge rendering. Document any conflict found.
10. Run `npm test` and `npm run build`.
11. Write progress report.

## Implementation Requirements

### Requirement 1: Disable all-levels-unlocked flag

Required behavior: Set `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` to `false` in `src/config/constants.js`.

Constraints:
- This is a one-line change.
- Do not add any conditional logic or environment-variable switching. The flag should be `false` for all builds.

Edge cases:
- Tests may rely on all levels being unlocked. If any test fails because of this change, document the failure and restore the flag to `true` only if the test suite cannot pass otherwise. In that case, stop and report.

Expected artifact: updated `src/config/constants.js`.

### Requirement 2: Add "Projects" help section

Required behavior: Add a new section in `help.html` that explains:

- Some guided levels are grouped into projects.
- In a project, your code carries forward from one level to the next.
- Each level asks you to improve the same program.
- "Reset Level" resets the board but keeps your project code.
- The two projects are "Strategy Brain" (solo logic) and "Team Strategy Script" (multi-ally coordination).
- Students do not need to understand project internals. The key message is: your code carries forward, and each level adds something new to it.

Constraints:
- Use the existing `help-section` class and sidebar `help-nav-group` structure.
- Add the new section in the sidebar under a new "Projects" nav group, positioned after the "General" group and before the "Blocks" group.
- Keep the language simple. These are non-AP-CSA students.
- Do not mention implementation details like localStorage, project IDs, or workspace persistence.

Edge cases:
- If the sidebar nav groups use a different pattern than described, match the existing pattern.

Expected artifact: new section in `help.html`.

### Requirement 3: Add "Saving Your Work" help section

Required behavior: Add a new section that explains:

- Your progress is saved automatically in your browser.
- To share your work with your teacher, click the download icon in the top-right header.
- You will be asked to type your name. Use the name your teacher expects.
- A file will download. Share that file with your teacher when asked.
- The file includes your progress, code snapshots, and a verification code that helps your teacher confirm the work is yours.

Constraints:
- Add this section in the sidebar under the "General" nav group or as a standalone nav group after "General."
- Do not describe the JSON format, hash algorithm, or tamper detection. Keep it student-facing.
- Reference the button's visual appearance (download icon in the header) so students can find it.

Expected artifact: new section in `help.html`.

### Requirement 4: Expand existing help sections

Required behavior:

**"How Block Programs Work" section** — add a short paragraph after the existing content:

- Explain that in project levels and free play, multiple allies can share the same program.
- Each ally runs the program on its own turn.
- Two allies may take different branches of the same `if/else` block, depending on their position, what they are carrying, or their runner index.

**"Guided Levels vs Free Play" section** — add one bullet:

- Some guided levels are grouped into projects where your code carries forward.

Constraints:
- Keep additions short. 2–3 sentences max per expansion.
- Do not rewrite existing content. Append to it.

Expected artifact: expanded sections in `help.html`.

### Requirement 5: Expand advanced block descriptions

Required behavior: Add 1–2 sentence usage examples to these block cards in the "Advanced Logic And Value Blocks" section:

| Block | Current description | Add |
| --- | --- | --- |
| Runner index | "Shows which shared-program ally this runner is: 0, 1, 2, and so on." | "Use it with Compare values to give different allies different jobs — for example, make index 0 chase the flag while index 1 defends." |
| Distance to target | "Returns the grid distance to a chosen target." | "This counts how many squares away the target is. Use it with Compare values to react when something gets close or far away." |
| AND | "True only when both inputs are true." | "Use it when two things must both be true before acting — for example, an enemy is nearby AND you have freeze ready." |
| OR | "True when either input is true." | "Use it when either warning sign should trigger the same response." |
| NOT | "Flips true to false and false to true." | "Use it to say 'do this when the condition is NOT true' instead of writing a separate else branch." |
| Compare values | "Compare two number blocks with =, ≠, <, ≤, >, or ≥." | "Use it with Runner index or Distance to target to make number-based decisions." |

Constraints:
- Keep the additions brief. They supplement, not replace, the existing description.
- Use the same `<p>` tag pattern as the existing descriptions.
- Do not add new block cards. Only expand existing ones.

Expected artifact: expanded block descriptions in `help.html`.

### Requirement 6: Verify L28 badge interaction

Required behavior: Read `src/ui/levelPicker.js` and check how levels with both `levelKind: "challenge"` and `project.isCapstone: true` are rendered.

- If the badge logic shows both a challenge badge and a project capstone badge, document the conflict and recommend a resolution (do not fix it — the integration owner will decide).
- If the badges compose correctly (e.g., capstone overrides challenge, or both are shown without conflict), document that it works.

Constraints:
- This is a read-only inspection. Do not edit `levelPicker.js`.
- Document findings in the progress report.

Expected artifact: findings in the progress report.

## Pedagogy Checks

- The unlock flag change restores progressive scaffolding, which is core to the guided learning model.
- The help page additions explain shared-code behavior, which is the central concept of the project arcs.
- The expanded block descriptions connect number comparison and runner index to strategic decisions, which supports AP CSA boolean reasoning.
- The usage export explanation helps students understand why they are saving work, which supports classroom accountability without surveillance.
- No game rules, block semantics, or execution model details are changed.
- All new help content uses simple language suitable for non-AP-CSA students.

## Commands

```powershell
npm test
npm run build
```

## Validation Checklist

- [ ] `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` is `false` in `src/config/constants.js`.
- [ ] `help.html` has a "Projects" section in the sidebar and main content.
- [ ] `help.html` has a "Saving Your Work" section in the sidebar and main content.
- [ ] "How Block Programs Work" mentions shared programs and multiple allies.
- [ ] "Guided Levels vs Free Play" mentions project levels.
- [ ] Runner index, Distance to target, AND, OR, NOT, and Compare values block cards have expanded descriptions.
- [ ] L28 badge interaction is documented in the progress report.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated files were changed.
- [ ] Progress report lists changes made and any remaining risks.

## Stop Conditions

Stop and report if:

- Any test fails because of the `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` change in a way that requires broader test changes.
- The help page structure is significantly different from what this packet assumes (different CSS classes, different section pattern).
- The level picker badge logic for L28 reveals a conflict that requires source changes beyond this packet's scope.
- Any change would alter game rules, block semantics, or the execution model.
