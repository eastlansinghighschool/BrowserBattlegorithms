---
id: plan-77-pre-challenge-22-compound-condition-uplift
title: "Pre-Challenge 22 Compound-Condition Uplift"
status: superseded
depends_on: []
gate: "before any board layout or win-condition change that materially alters the puzzle, and before any reference-solution shape deviates from the per-level spec below"
superseded_by: plan-93
resolution: "Superseded by Plan 93."
summary: >-
  Preserved as raw per-level analysis for the pre-Challenge-22 resource cliff, but no longer executable as written because Plan 85 reframed the rewrite around living boards, protected levels, voice policy, and Bootstrap-backed packet sequencing.
---
# Plan 77: Pre-Challenge 22 Compound-Condition Uplift

- Packet id: Plan 77
- Packet title: Pre-Challenge 22 Compound-Condition Uplift
- Status: (see frontmatter)
- Owner/model: level-editing specialist
- Date: 2026-05-22
- Packet type: implementation / curriculum / level-editing
- Mutation level: source-code (level source, reference fixture XML, lesson copy, toolbox composition) + tests
- Approval gate: before any board layout or win-condition change that materially alters the puzzle, and before any reference-solution shape deviates from the per-level spec below
- Expected artifacts:
  - revised source for the four named levels
  - revised reference-solution fixtures for the four named levels
  - revised lesson copy (objective/intro/tips/tutorial) for the four named levels
  - revised demo Blockly where currently present, kept structural (not solution-revealing)
  - toolbox additions per spec
  - regenerated Plan 73 dossiers and Plan 74 behavior evidence for the four levels
  - concept matrix row review (update only if the primary concept changes; otherwise leave row text as-is)
  - progress report under `reports/development/plan-77-pre-challenge-22-compound-condition-uplift/progress.md`
- Progress report folder: `reports/development/plan-77-pre-challenge-22-compound-condition-uplift/`
- Progress report file: `reports/development/plan-77-pre-challenge-22-compound-condition-uplift/progress.md`

## Packet Summary

Supersession note (2026-07-06): do not implement this packet as written. Plan 85 reframed the guided-campaign rewrite around living boards, protected-level rules, board-dynamics tiers, voice/hint policy, and Bootstrap-backed packet sequencing. Plan 93 replaces this packet with a living-board-aware Pre-Challenge 22 resource uplift. The per-level analysis below remains useful raw material, but the frozen-board implementation assumptions are stale.

Goal: Close the largest documented learning cliff in the campaign — the jump from one-branch resource/territory lessons (L16–L21) into Challenge 22's 14-block, 6-decision, two-resource-readiness live scrimmage — by adding one compound condition to each of four targeted lesson levels. The reference solution for each level should require students to combine the new block with a prior block in the same `On Each Turn` program. Block introductions become integrated introductions: the level still introduces its named concept, but the win condition requires that concept paired with one already-mastered idea.

Non-goals:
- Do not touch Challenge 22 (`show-what-you-know`) itself.
- Do not touch `bughunt-22` (deferred to a separate future packet).
- Do not touch Challenge 15 or any pre-Challenge 15 level.
- Do not touch Strategy Brain or Team Strategy Script levels.
- Do not introduce the Advanced boolean blocks (`AND`/`OR`/`NOT`) at these levels. Compose with nested `if`/`if-else` only. Advanced boolean operators belong to Strategy Brain (L23 onward) and remain unintroduced here.
- Do not introduce the `count_within` value block at these levels.
- Do not add new mandatory levels. The four levels in scope are existing levels.
- Do not change the concept matrix's "new Blockly idea" column for these levels — the new block is still the named one. You may revise the "assumes" column if the implementing edits genuinely depend on a different prior block than the matrix currently lists.

Depends on:
- Plan 60–64 readiness/workbench tooling (used for validation).
- Plan 73 dossier generator and Plan 74 behavior evidence generator (used to regenerate per-level evidence after edits).
- Plan 75 audits (Codex and Claude) and Plan 76 syntheses (Codex, Claude Opus, Gemini) — all in `reports/development/guided-level-complexity-audit/`.

Blocks:
- Plan 78 (bug-hunt variety packet — including `bughunt-22` calibration). Plan 77 must land before Plan 78 because `bughunt-22`'s starter bug plausibility depends on the resource-readiness ramp Plan 77 establishes.

Why this packet exists:
All three Plan 76 syntheses ranked the pre-Challenge 22 compound-condition uplift as the #1 unanimous fast-track. Both Plan 75 audits identified Challenge 22 as the campaign's largest cliff. The pilot has finished, so cohort-boundary constraints no longer block in-place edits. The owner has chosen the "uplift intros directly" policy (no protected-as-pure-intro carve-outs), and has explicitly approved the `freeze-the-lane` uplift that was the most disputed single recommendation in the audit comparison. This packet implements that decision.

The four targeted levels are the levels where the audits agree the rehearsal debt actually lives:

| level id | curriculum number | order | dossier number | named concept (unchanged) | compound to add |
| --- | --- | --- | --- | --- | --- |
| `jump-if-ready` | 16 | 18 | 18 | Jump readiness | jump-readiness nested with a barrier sensor |
| `stay-still-can-do-something` | 18 | 20 | 20 | Stay Still as a deliberate action | stay-still nested with jump readiness (wait-then-jump shape) |
| `my-side-their-side` | 20 | 22 | 22 | Territory sensor (my-side) | territory nested with carrier state |
| `freeze-the-lane` | 21 | 23 | 23 | Area Freeze readiness | freeze-readiness nested with an enemy sensor |

The "compound to add" column is the contract this packet creates. The reference solution for each level must materially exercise it.

## Authority And Contracts

Required project contracts (do not redefine):
- Guided mode generally teaches one primary concept at a time. After Plan 77, these four levels still introduce their named concept; the compound check rehearses one previously introduced idea alongside it. The concept matrix's "new Blockly idea" column is unchanged.
- Demo Blockly shows structure, not the exact active solution. The current demos for these levels do not reveal the new compound shape and must not begin to do so as part of this packet.
- Student programs run from `On Each Turn`. The compound shape is expressed with nested `if`/`if-else` blocks below `On Each Turn`. The first reached action under `On Each Turn` is the one that resolves.
- Only the first reached action executes each turn. Compound shapes must respect this — the reference solution cannot rely on multiple actions per turn.
- Decentralized ally coordination through local sensing, conditions, and resource checks is the long-term goal. Compound conditions directly serve this goal.
- The app remains a static Vite deployment with no server dependencies.
- `src/core/` owns game rules; `src/render/` owns drawing; `src/ui/` owns DOM state; `src/ai/blockly/` owns Blockly. This packet should not need changes outside `src/config/levels/`, `tests/unit/fixtures/guided-reference-solutions/`, and the matching test/dossier areas.

Authority files (sources of truth this packet must respect):
- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/ARCHITECTURE.md`
- `docs/subsystems/blockly-workspace.md` — workspace lifecycle, toolbox composition, ignored vs disabled blocks, warning lifecycle, demo XML semantics
- `docs/subsystems/turn-engine.md` — only relevant if a board change would alter collision, bounce, or scoring behavior. No such change is intended in this packet. If the implementer believes a change requires touching turn-engine semantics, stop and ask.
- `docs/packet-creation-guidance.md`

This packet does NOT change runtime contracts. The four edits are curriculum/data edits: board layout, win conditions (if needed), reference fixture shape, toolbox membership, lesson copy. No subsystem note rewrite is anticipated. If during implementation you find a subsystem note would become untrue after the edit, stop and surface the conflict.

## Required Reading

Read before editing:
- This packet end-to-end.
- `docs/packet-creation-guidance.md`
- `docs/development/00-level-editing-agent-starting-prompt.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- The four current level source files:
  - `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
  - `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
  - `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
  - `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- The four current reference fixtures:
  - `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml`
  - `tests/unit/fixtures/guided-reference-solutions/stay-still-can-do-something.xml`
  - `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml`
  - `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml`
- The four current dossiers:
  - `reports/development/guided-level-complexity-audit/level-dossiers/18-jump-if-ready.md`
  - `reports/development/guided-level-complexity-audit/level-dossiers/20-stay-still-can-do-something.md`
  - `reports/development/guided-level-complexity-audit/level-dossiers/22-my-side-their-side.md`
  - `reports/development/guided-level-complexity-audit/level-dossiers/23-freeze-the-lane.md`
- Both Plan 75 audits' rows and recommendations for these four levels:
  - `reports/development/guided-level-complexity-audit/model-audits/codex-audit.md`
  - `reports/development/guided-level-complexity-audit/model-audits/claude-audit.md`
- The three Plan 76 syntheses for cross-checks:
  - `reports/development/guided-level-complexity-audit/syntheses/codex-plan76-synthesis.md`
  - `reports/development/guided-level-complexity-audit/syntheses/gemini-synthesis.md`
  - `reports/development/guided-level-complexity-audit/syntheses/claude-opus-synthesis.md`

Optional/contextual:
- `src/config/levels/shared/toolboxes.js` and `src/config/levels/shared/blocklyXml.js` when adding toolbox blocks.
- `src/config/levels/manifest.js` for level ordering invariants (do not change ordering).
- `tests/unit/fixtures/guided-reference-solutions/` neighbors for current XML conventions.
- `docs/TeacherFacilitationKit.md` if pacing or facilitation copy needs revision (likely not required).

## Scope

### In scope

- Edit board layouts, starting positions, and (where necessary) win conditions for the four named levels so the named compound condition is required by the win condition, not merely possible.
- Edit toolbox membership for each level to expose the prior block(s) the compound shape uses.
- Replace each level's reference solution XML with a solution that materially exercises the compound shape.
- Update lesson copy (objective, intro, tips, tutorial steps) so the student knows what the level is asking. Copy should describe the compound idea in plain English; copy should not name the exact block combination.
- Update demo Blockly where present so it still shows reusable structure without revealing the new compound solution. If the current demo would now read as the answer, simplify it back to a structural sketch.
- Regenerate Plan 73 dossiers and Plan 74 behavior evidence for the four levels.
- Add/adjust unit tests so the canonical reference solution passes and a degenerate one-branch solution fails. The degenerate-fail test is part of the contract this packet creates.

### Out of scope

- Any change to Challenge 22, `bughunt-22`, Challenge 15, `bughunt-15`, or Challenge 28.
- Any change to Strategy Brain or Team Strategy Script levels.
- Introducing Advanced boolean blocks (`AND`/`OR`/`NOT`) at these levels.
- Introducing `count_within`.
- Adding new mandatory or optional levels.
- Renumbering levels or changing level order.
- Plan 67 / own-flag-home scoring changes.
- Concept matrix "new Blockly idea" column rewrites.
- Subsystem note rewrites (if one becomes untrue, stop and ask).
- Free Play, Admin, Workbench, or NPC behavior changes.
- TeacherGuide / StudentGuide rewrites beyond minor wording corrections that flow naturally from the lesson copy change.
- Bug-hunt-level changes.

### Files and areas likely touched

- `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js`
- `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js`
- `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js`
- `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js`
- `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml`
- `tests/unit/fixtures/guided-reference-solutions/stay-still-can-do-something.xml`
- `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml`
- `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml`
- `src/config/levels/shared/toolboxes.js` (or whichever toolbox composition file applies — confirm via the level source's toolbox key)
- `tests/unit/` — guided reference-solution tests; possibly the level-authoring linter assertions
- `reports/development/guided-level-complexity-audit/level-dossiers/{18,20,22,23}-*.md` — regenerated via `npm run level:dossiers` (or equivalent — confirm the Plan 73 entry point)
- `reports/development/guided-level-complexity-audit/behavior-evidence/{18,20,22,23}-*.md` — regenerated via `npm run level:behavior-evidence`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — assumptions column only, only if implementation reveals a prior-block dependency that differs from the current row

## Work Plan

1. Read every file under "Required reading."
2. Confirm the current behavior of each of the four levels by running `npm run level:readiness -- --level <id> --json` for each.
3. For each of the four levels, draft the compound spec in detail per "Implementation Requirements" below. Confirm the compound shape can be satisfied by a 5–7 block reference solution and that a one-branch (pre-uplift) solution would now fail the level. If either condition is not satisfiable without extending toolbox or changing the win condition more than the spec allows, stop and report.
4. Implement the four edits one level at a time. After each level, run:
   - `npm test -- guided-reference-solutions` (or the equivalent narrowed unit test invocation)
   - `npm run lint:levels`
   - `npm run level:readiness -- --level <id> --json`
5. After all four levels pass narrowed validation, run the full suites:
   - `npm test`
   - `npm run build`
   - `npm run test:browser:smoke`
   - `npm run test:browser:focus`
6. Regenerate Plan 73 dossiers and Plan 74 behavior evidence for the four levels and confirm the regeneration is clean (no new not-applicable cases or unexpected diffs in surrounding levels).
7. Write the progress report describing per-level decisions, the resulting reference-solution shapes, any toolbox additions, and any surprises that warranted owner review.

## Implementation Requirements

Every requirement below applies to a single level. The shared contract is: **the level still introduces its named concept; the win condition requires the named concept paired with one previously introduced idea via nested `if`/`if-else`.** No Advanced boolean operators. No `count_within`.

### Requirement 1 — `jump-if-ready`

Required behavior:
- The named concept remains "Jump if ready" (jump readiness condition).
- The compound to add is: jump readiness paired with a sensor check that determines whether jumping is the right choice on the current cell. A degenerate solution that always jumps when ready (the current reference shape) must no longer reach the goal within the level's turn limit.
- Acceptable compound shapes for the reference solution:
  - `if (barrier directly ahead) { if (can jump) jump else stay-still-or-bounce-safe-move } else move-forward`
  - `if (can jump) { if (barrier directly ahead) jump else move-forward } else move-forward`
  - Either nested orientation is fine. Pick the one that reads most naturally given the resulting board layout.

Constraints:
- Toolbox must add `battlegorithms_if_sensor_matches` and `battlegorithms_if_sensor_matches_else`. These blocks are already taught at L6 (`sensor-barrier-branch`), so this is a re-exposure, not a new introduction.
- Toolbox keeps all current blocks. Do not remove existing options.
- Lesson copy: objective updates to name the compound idea in plain English (e.g. "Use the jump only when a barrier is in the way"). Tips revise to point at the combination. The phrase "If I Can Jump" stays in the intro; the phrase "sensor" stays out of the objective copy (it is a teacher term, not a student term in this campaign's voice).
- Demo Blockly stays at most 4 blocks; keep it structural; do not show the nested-compound shape. If the current demo would now read as the answer, replace with a simpler `if I have enemy flag / move backward / else move forward` analogy demo or similar reusable structure that does not encode this level's solution.

Edge cases:
- The board must contain cells where jumping is wrong (no barrier ahead → plain forward should win) and cells where jumping is right (barrier ahead → jump is required). Both must occur on the path from start to goal so that the reference solution actually exercises both branches.
- Jump resource is currently `yes`. Keep it `yes`; the level still teaches readiness.
- Turn limit: confirm or set a turn limit that gives the compound solution comfortable room and the one-branch solution insufficient room. Document the turn limit in the progress report.

Expected artifacts:
- Edited `level-16-jump-if-ready.js`
- Rewritten `tests/unit/fixtures/guided-reference-solutions/jump-if-ready.xml` (5–7 blocks)
- Updated lesson copy in the level source
- Demo Blockly preserved or simplified per constraints

### Requirement 2 — `stay-still-can-do-something`

Required behavior:
- The named concept remains "Stay Still as a deliberate action" (clearing a barrier or otherwise timing a no-move turn).
- The compound to add is: Stay Still paired with jump readiness — a "wait then jump" or "remove the barrier and then jump when ready" shape. A degenerate solution that only uses stay-still-to-clear-then-move-forward (the current reference shape) must no longer reach the goal within the level's turn limit.
- Acceptable compound shapes for the reference solution:
  - `if (barrier directly ahead) stay-still else { if (can jump) jump else move-forward }`
  - `if (can jump and the path is open) jump else { if (barrier directly ahead) stay-still else move-forward }` (expressed via nested `if`s, not boolean AND)
  - Three-branch sequencing of barrier-clear, jump-when-ready, walk-otherwise is acceptable.

Constraints:
- Toolbox must add `battlegorithms_if_can_jump`, `battlegorithms_if_can_jump_else`, and `battlegorithms_jump_forward`. These are already taught at L16 (`jump-if-ready`), so this is a re-exposure.
- Toolbox keeps all current blocks.
- Lesson copy: objective updates to name the compound idea in plain English (e.g. "Clear the barrier, then jump when the path is open"). Tips revise accordingly. Keep the campaign's voice — student-facing, not teacher-facing.
- Demo Blockly stays structural and at most 4 blocks; do not show the new compound. Replace if necessary.

Edge cases:
- The board must require both a barrier removal and a jump on the path to the goal. The barrier comes first (stay-still removes it), then a gap or column that requires a jump.
- Ensure the ally cannot brute-force the level by always moving forward when no barrier is ahead — there must be a forced jump cell.
- Jump resource is currently `yes` for the ally. Keep it `yes`. After the jump is spent, walking finishes the level — that part of the lesson stays.
- Turn limit: confirm or set to allow the compound solution and reject one-branch solutions.

Expected artifacts:
- Edited `level-18-stay-still-can-do-something.js`
- Rewritten `tests/unit/fixtures/guided-reference-solutions/stay-still-can-do-something.xml` (5–7 blocks)
- Updated lesson copy

### Requirement 3 — `my-side-their-side`

Required behavior:
- The named concept remains "Territory sensor (my-side)".
- The compound to add is: territory sensor paired with carrier state (`if have enemy flag`). A degenerate solution that only checks `on_my_side` (the current reference shape) must no longer reach the goal within the level's turn limit.
- Acceptable compound shapes for the reference solution:
  - `if (have enemy flag) { if (on my side) score/stop-style move else return-home-direction } else move-toward-enemy-flag`
  - `if (on my side) { if (have enemy flag) move-toward-home else move-forward } else { if (have enemy flag) move-toward-home else move-toward-enemy-flag }`
  - Any nested combination where both territory and carrier state must be checked to choose the right move on at least one cell of the path.

Constraints:
- Win condition currently reaches a cell. To make the compound condition load-bearing, the level needs a flag to pick up and a return. The new win condition should be either:
  - `runner_returns_with_enemy_flag` (or whichever existing condition encodes pickup + return), or
  - retain `runner_reaches_cell` with the cell on the home side and add an enemy flag the ally must carry through to that cell.
- Add an enemy flag at a sensible position on the enemy side. The team's own flag remains at its home base (so own-flag-home scoring is satisfied automatically and not the lesson here).
- Toolbox must add `battlegorithms_if_have_enemy_flag` and `battlegorithms_if_have_enemy_flag_else` (already taught at L3 / `score-a-point`), and `battlegorithms_move_toward` (already taught at L11 / `move-toward-flag`). Re-exposure, not new introduction.
- Lesson copy: objective updates to name the compound idea (e.g. "Grab the enemy flag and behave differently once you cross back to your side"). Keep "field halves" / "my side" / "their side" vocabulary from the existing intro.
- Demo Blockly: currently absent. Either leave absent or add a structural demo that shows nested `if` shape without encoding the solution.

Edge cases:
- The compound must matter on at least one cell. A path that happens to work with a single-sensor solution is not acceptable.
- Ally's starting position and the enemy flag position should be chosen so the ally must change behavior after pickup. Concretely: starting on home side without flag → move toward enemy flag; after pickup on enemy side → move back; once back on home side → finish.
- Live enemies remain frozen (status quo). Do not add a live enemy here.
- Turn limit: confirm or set to allow the compound solution and reject one-branch solutions.

Expected artifacts:
- Edited `level-20-my-side-their-side.js`
- Rewritten `tests/unit/fixtures/guided-reference-solutions/my-side-their-side.xml` (5–7 blocks)
- Updated lesson copy and tutorial steps
- New enemy-flag entity in the level setup

### Requirement 4 — `freeze-the-lane`

Required behavior:
- The named concept remains "Area Freeze readiness".
- The compound to add is: freeze readiness paired with an enemy-proximity sensor — freeze should be used only when there is actually an enemy in range. A degenerate solution that always freezes when ready (the current reference shape) must no longer reach the goal within the level's turn limit (or must waste freeze so that the ally arrives at the flag without the protection actually doing anything useful, then fails some condition).
- Acceptable compound shapes for the reference solution:
  - `if (area freeze ready) { if (enemy directly ahead) freeze else move-toward enemy-flag } else move-toward enemy-flag`
  - `if (enemy directly ahead) { if (area freeze ready) freeze else stay-still-or-detour } else move-toward enemy-flag`

Constraints:
- The board must make wasting freeze a losing move. The cleanest way: position the live enemy so that on the first turn the enemy is **not** in range; the ally must walk forward a few turns before the enemy enters range. A degenerate "always freeze first turn" solution then fails to neutralize the threat when it matters.
- Toolbox must add `battlegorithms_if_sensor_matches` and `battlegorithms_if_sensor_matches_else` (already taught at L6) so the proximity check is expressible.
- Toolbox keeps all current blocks.
- The level already has one live and one frozen enemy. The live enemy may be moved to a position that triggers the timing problem described above. The frozen enemy may stay or be removed at the implementer's discretion.
- Lesson copy: objective updates to "Spend Area Freeze only when an enemy is actually in your way." Tips revise. Tutorial step 1 ("Team Freeze Cooldown") can stay; tutorial step 2 ("Use It At The Right Moment") needs minor revision to match the compound idea. Tutorial step 3 ("The Single-Runner Toolkit Is Complete") can stay.
- Demo Blockly: current demo shows a 4-block `if can jump else` shape that is structural-only. Keep structural — do not switch the demo to a freeze example, since that would point too directly at the answer.

Edge cases:
- The live enemy should be deterministic in its movement so the reference solution is reproducible (Plan 74 evidence will regenerate from a deterministic run).
- Confirm via `npm run level:behavior-evidence` that the resulting reference run shows freeze being used on a turn when the enemy is in range, not on turn 1.
- Turn limit: confirm or set to allow the compound solution and reject one-branch solutions.

Expected artifacts:
- Edited `level-21-freeze-the-lane.js`
- Rewritten `tests/unit/fixtures/guided-reference-solutions/freeze-the-lane.xml` (5–7 blocks)
- Updated lesson copy
- Possibly repositioned live enemy NPC

### Cross-cutting requirements

Pedagogy checks (apply to all four levels):
- Does the level still teach one new Blockly idea (the named one), with the compound idea being a rehearsal of a prior block? **Yes** is required.
- Does the lesson copy explain the compound in plain English without naming exact blocks? **Yes** is required.
- Does the demo Blockly still illustrate reusable structure without revealing the level's solution? **Yes** is required.
- Does the reference solution use nested `if`/`if-else` rather than Advanced boolean operators (`AND`/`OR`/`NOT`)? **Yes** is required.
- Does a one-branch (pre-uplift-shape) solution fail the level? **Yes** is required.
- Does the resulting program still execute one action per turn under `On Each Turn`? **Yes** is required.
- Is the level usable on classroom projectors and narrow screens? Board sizes and entity counts in this packet stay within current norms — confirm rather than re-derive.
- Are keyboard, color contrast, sound, motion, and screen reader basics preserved? No UI changes are in scope, so the answer is yes by construction; confirm by running the smoke browser suite.

Subsystem note check:
- This packet should not need to touch any `docs/subsystems/*.md` note. The edits are curriculum/data-level. If during implementation you find a subsystem note would become untrue after the edit — for example, if you find yourself wanting to change turn-engine or NPC behavior to make a level work — **stop and surface the conflict for owner review** rather than proceeding.

## Model-Specific Instructions

You are a level-editing implementation thread. Before editing:
- Summarize back, in three sentences per level, what compound shape you intend to implement and what board change supports it. Wait for any owner correction before mass edits.
- Keep the write scope tight. The packet names four level source files, four reference fixtures, one toolbox composition file (only if toolboxes need re-exposure), and the regenerated dossier/behavior-evidence files. Edits outside that set require justification.
- Do not redesign Challenge 22, the surrounding `bughunt-22`, or any other level.
- Do not introduce Advanced boolean operators.
- Do not "fix" anything that is not in this packet's scope. If you spot a real bug while reading neighboring code, log it in the progress report and continue.
- Use small commits or a single coherent commit per level. Tests must pass between levels.
- Prefer faithful re-exposure of existing blocks to inventing new ones.
- If a level cannot be made to require the compound shape without a board redesign beyond the scope of "reposition entities, move the goal cell, possibly add one flag," **stop and surface to owner**.

## Commands

From repository root, in PowerShell:

```powershell
npm install
npm run level:readiness -- --level jump-if-ready --json
npm run level:readiness -- --level stay-still-can-do-something --json
npm run level:readiness -- --level my-side-their-side --json
npm run level:readiness -- --level freeze-the-lane --json
npm test
npm run lint:levels
npm run build
npm run test:browser:smoke
npm run test:browser:focus
npm run level:behavior-evidence
```

Plan 73 dossier regeneration: invoke the same dossier script Plan 73 used. Confirm the entry point from `package.json` (`npm run level:dossiers` is the expected name based on the README's validation baseline language). If the script name differs, use the actual name and note it in the progress report.

Do NOT run `npm run test:browser` (full extended suite) unless smoke and focus pass and a regression is suspected. Do NOT deploy.

## Validation Checklist

- [ ] All four level source files edited.
- [ ] All four reference-solution fixtures rewritten and exercise the compound shape.
- [ ] Toolboxes for the four levels expose the additional re-exposed blocks per spec.
- [ ] Lesson copy (objective, intro, tips, tutorial steps) for all four levels updated; copy describes the compound idea in plain English without naming exact blocks.
- [ ] Demo Blockly for each level that previously had a demo still shows reusable structure and does not reveal the level's solution.
- [ ] Unit tests pass (`npm test`) including the canonical reference-solution tests.
- [ ] A degenerate one-branch reference (the pre-uplift shape) is verified to fail the level. This is part of the test contract; add or extend a test that demonstrates the failure.
- [ ] `npm run lint:levels` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:smoke` and `npm run test:browser:focus` pass.
- [ ] Plan 73 dossiers regenerated for the four levels.
- [ ] Plan 74 behavior evidence regenerated for the four levels and shows the compound shape exercising both branches in the deterministic run.
- [ ] No Advanced boolean operator (`AND`/`OR`/`NOT`) introduced at these levels.
- [ ] No `count_within` introduced at these levels.
- [ ] Challenge 22, `bughunt-22`, Challenge 15, `bughunt-15`, Strategy Brain, and Team Strategy Script levels are untouched.
- [ ] `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` "new Blockly idea" column is unchanged for these four rows.
- [ ] No `docs/subsystems/*.md` note was touched, or any touched note has been verified to still read true post-change and the touch was surfaced to owner.
- [ ] `docs/development/README.md` updated to mark Plan 77 status as `complete` only after owner sign-off.
- [ ] Progress report written under `reports/development/plan-77-pre-challenge-22-compound-condition-uplift/progress.md`, including per-level decisions, the resulting reference-solution shapes, turn limits, any surprises, and any items deferred or surfaced to owner.

## Stop Conditions

Stop and ask for owner review if:
- Any level cannot be made to require its named compound shape without a board redesign larger than "reposition entities, move goal cell, possibly add one flag, possibly extend the toolbox by re-exposure of an already-taught block."
- A board change you would need to make appears to violate or invalidate a `docs/subsystems/*.md` note.
- A reference-solution shape genuinely needs an Advanced boolean operator (`AND`/`OR`/`NOT`) to express cleanly. Do not introduce them at these levels; surface the conflict.
- A pedagogy check fails — e.g. the only solution you can find encodes the level's answer in the demo, or the lesson copy ends up naming exact blocks to make sense.
- A test you expected to pass fails and the cause is not localized to your edits.
- The campaign sequence or level order would need to change.
- The compound shape would require touching Challenge 22 or `bughunt-22` to remain coherent.
- Plan 74 evidence regeneration shows unexpected diffs in levels other than the four in scope (could indicate a shared-source regression).
- The pilot owner indicates a student is still mid-arc on one of these specific levels and an in-place change would disrupt them.
