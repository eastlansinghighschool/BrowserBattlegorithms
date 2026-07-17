# Progress Report - Plan 95: Phase Copy Rewrites

## Overall Summary

Completed the first owner-selected Plan 95 phase dispatch and two requested orchestration repair passes for `resources-and-territory`. Built the durable all-level copy digest generator, regenerated its 46-level report, and performed a genuine in-world scout/coach voice pass across all six levels in the selected phase. The repair passes reduced prescriptive winning-sequence language, varied tutorial/demo phrasing, restored student decision space, named the Charger threat in Jump If Ready, restored Relay Race's keyboard/staging orientation, and corrected the barrier terminology in Stay Still without changing mechanics, board setup, toolboxes, win conditions, fixtures, NPC configuration, or runtime source.

Completed the owner-selected Plan 95 Phase 2 dispatch for `foundations`. The five novice levels now use concise, concrete board-facing copy while preserving their onboarding clarity. The phase's protected levels and complexity-protected Barrier Detour received prose-only changes; no mechanics, setup, toolbox, win-condition, fixture, or demo-Blockly fields changed.

Completed the owner-selected Plan 95 Phase 3 dispatch for `sensing`. The prediction checkpoint and Levels 6-9 now describe the visible starter code, frozen runner, map wall, human support square, and enemy flag rather than narrating curriculum progression or prescribing a movement sequence. No mechanics, setup, toolbox, win-condition, fixture, or demo-Blockly fields changed.

Board-settledness was confirmed for every dispatch: `resources-and-territory` by Plans 93/103, `movement-helpers` by Plan 92, and the static `foundations`/`sensing` boards by current source and behavior evidence. Existing `TeacherFacilitationKit.md` preserves the pedagogical framing and intervention prompts, so no teacher-doc move was needed.

## Files Changed

- `src/dev/levelCopyDigest.js` - reusable digest generation and Markdown rendering, including tutorial `demoTitle` and `demoCaption` fields.
- `scripts/level-copy-digest.js` - read-only CLI wrapper for the digest generator.
- `package.json` - added `level:copy-digest` and the focused unit test file to `test:unit`.
- `tests/unit/level-copy-digest.test.js` - deterministic rendering and missing-metadata coverage.
- `src/config/levels/phases/resources-and-territory/level-16-jump-if-ready.js` - prose-only rewrite.
- `src/config/levels/phases/resources-and-territory/level-17-build-the-barrier.js` - prose-only rewrite.
- `src/config/levels/phases/resources-and-territory/level-18-stay-still-can-do-something.js` - prose-only rewrite.
- `src/config/levels/phases/resources-and-territory/level-19-relay-race.js` - prose-only rewrite.
- `src/config/levels/phases/resources-and-territory/level-20-my-side-their-side.js` - prose-only rewrite of protected level copy.
- `src/config/levels/phases/resources-and-territory/level-21-freeze-the-lane.js` - prose-only rewrite.
- `src/config/levels/phases/foundations/level-01-move-to-target.js` - Phase 2 prose-only rewrite.
- `src/config/levels/phases/foundations/level-02-reach-enemy-flag.js` - Phase 2 prose-only rewrite.
- `src/config/levels/phases/foundations/level-03-score-a-point.js` - Phase 2 prose-only rewrite of protected level copy.
- `src/config/levels/phases/foundations/level-04-barrier-detour.js` - Phase 2 prose-only rewrite of complexity-protected level copy.
- `src/config/levels/phases/foundations/level-05-mirror-forward.js` - Phase 2 prose-only rewrite of protected level copy.
- `src/config/levels/phases/sensing/prediction-06-first-move.js` - Phase 3 prose-only rewrite.
- `src/config/levels/phases/sensing/level-06-sensor-barrier-branch.js` - Phase 3 prose-only rewrite.
- `src/config/levels/phases/sensing/level-07-watch-the-wall.js` - Phase 3 prose-only rewrite of complexity-protected level copy.
- `src/config/levels/phases/sensing/level-08-find-the-human.js` - Phase 3 prose-only rewrite of complexity-protected level copy.
- `src/config/levels/phases/sensing/level-09-find-the-enemy-flag.js` - Phase 3 prose-only rewrite.
- `reports/development/guided-level-complexity-audit/copy-digest.md` - generated all-level digest.
- `reports/development/plan-95-phase-copy-rewrites/progress.md` - this report.

## Artifacts Produced

- `reports/development/guided-level-complexity-audit/copy-digest.md`
  - 46 guided levels grouped by phase.
  - Verbatim `description`, `introText`, tips, tutorial-step titles/bodies, and available demo titles/captions.
  - Current copy-voice lint hits for each level.
  - Source path plus win condition, live/frozen opponent summary, and `boardDynamicsTier`.
- `scripts/level-copy-digest.js` with npm alias `level:copy-digest`.

The digest is deterministic and regenerable. Two consecutive generations produced the same SHA-256 hash.

## Commands Run And Results

- `node scripts/dev/plan-status.js check plan-95-phase-copy-rewrites` - passed; packet is runnable.
- `node --test --test-isolation=none tests/unit/level-copy-digest.test.js` - passed, 2/2 tests.
- `npm.cmd run level:copy-digest` - passed; generated the 46-level digest.
- `node scripts/level-copy-digest.js` twice with SHA-256 comparison - passed; output was identical.
- `node scripts/lint-levels.js` - passed with warning exit behavior; no errors.
- `npm.cmd run lint:levels` - passed after the second repair round with warning exit behavior; no errors.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all six selected-phase levels.
- `npm.cmd run test:unit` - passed after the second repair round, 478/478 tests.
- `npm.cmd run build` - passed after the second repair round; Vite production build completed successfully.
- `npm.cmd run lint:levels` - passed for Phase 2 with warning exit behavior; no errors.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all five foundations levels.
- `npm.cmd run level:copy-digest` - passed after the Phase 2 rewrite; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/level-copy-digest.test.js` - passed, 2/2 tests.
- `npm.cmd run test:unit` - passed after the Phase 2 rewrite, 478/478 tests.
- `npm.cmd run build` - passed after the Phase 2 rewrite; Vite production build completed successfully.
- `npm.cmd run lint:levels` - passed for Phase 3 with warning exit behavior; no errors.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all five sensing levels.
- `npm.cmd run level:copy-digest` - passed after the Phase 3 rewrite; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/level-copy-digest.test.js` - passed, 2/2 tests.
- `npm.cmd run test:unit` - passed after the Phase 3 rewrite, 478/478 tests.
- `npm.cmd run build` - passed after the Phase 3 rewrite; Vite production build completed successfully.
- `git diff --check` - passed; reported only existing line-ending normalization warnings.

## Validation Checks Performed

- Selected phase copy-voice warnings before rewrite: 3 (`jump-if-ready`, `stay-still-can-do-something`, and `my-side-their-side`).
- Selected phase copy-voice warnings after rewrite and orchestration repair: 0 across all six phase levels.
- The repair pass specifically reduced answer-prescribing language in `jump-if-ready`, `relay-race`, `my-side-their-side`, and `freeze-the-lane`, while retaining direct action rules where they are the level's actual concept in `build-the-barrier` and `stay-still-can-do-something`.
- The second repair round changed prose only in `jump-if-ready`, `stay-still-can-do-something`, and `relay-race`: Charger-specific threat language, keyboard/staging orientation, and `barrier` terminology respectively. The regenerated digest shows Jump If Ready's live collision-threat board summary alongside its Charger copy.
- Phase 2 began with 1 copy-voice warning in `mirror-forward` and ended with 0 across `foundations`.
- The Phase 2 pass kept novice operational cues concrete: frozen opponents, flag position, barrier placement, the single action per ally turn, and runner-facing direction.
- Protected-level checks confirm prose-only changes in `move-to-target`, `score-a-point`, and `mirror-forward`; the same boundary was confirmed for complexity-protected `barrier-detour`.
- Phase 3 began with 1 copy-voice warning in `watch-the-wall` and ended with 0 across `sensing`.
- The sensing copy names the actual static board features: the frozen lane runner, wall cell, human support square, enemy flag, and prediction starter program. Behavior evidence confirms no live opponent acts on the successful reference paths.
- Complexity-protected `watch-the-wall` and `find-the-human` changed only student-facing prose; their protected lesson shape, board setup, toolbox, win condition, turn limit, and demo Blockly structure remain unchanged.
- Digest tests now confirm that tutorial `demoTitle` and `demoCaption` are rendered alongside the other student-facing copy fields.
- No spoiler warnings were introduced in the selected phase.
- Protected `my-side-their-side` changed only prose fields: `description`, `introText`, `tips`, and tutorial-step title/body text. Its comments, mechanics, toolbox, win condition, failure condition, turn limit, board setup, NPC/tier metadata, and starter/reference structures were unchanged by this dispatch.
- Copy digest unit tests cover phase grouping, verbatim copy preservation, lint-hit rendering, live/frozen opponent counts, board-tier output, and honest missing metadata.
- Full tests and build confirm that the prose-only changes preserve existing contracts.

## Problems Encountered And How Resolved

- The repository has non-blocking warnings outside the completed phases, including copy-voice warnings in advanced logic, advanced teamplay, and optional levels, plus existing board-dynamics and turn-limit warnings. They remain outside this phase dispatch and were not silenced or modified.
- The first generator test command and direct generator command both passed before the packet-named npm command was rerun; the exact packet command was subsequently run and passed.
- The first full Phase 2 unit run exposed a stale onboarding assertion for `quiet practice board`; the phrase was retained in the concise Level 1 intro because it remains truthful board orientation, and the rerun passed 478/478.
- The first Phase 3 unit run exposed two authored tutorial-copy contract checks: the structural demo title `Example sensor branch` and the phrase `different object` in Find the Human's demo caption. Both were retained as truthful structural-demo orientation, and the rerun passed 478/478.

## Remaining Risks Or Follow-Ups

- Copy tone is a curriculum judgment and should receive owner/orchestration review before landing.
- The generated digest is intentionally a tracked report artifact; regenerate it after future level-copy or board changes before reviewing another phase.
- The remaining out-of-phase copy warnings should be handled by later Plan 95 dispatches, not folded into this phase.
- The accepted foundation copy remains the campaign's novice-facing baseline for direct operational orientation.
- Later phases should preserve Phase 3's balance: explain sensor vocabulary and visible board relationships directly while leaving the action choice and assembled program to the student.

## Phase 1 Review Outcome

Accepted after dual-orchestrator review and two bounded repair rounds. The reusable review lessons about tier-gated threat naming, sibling-archetype consistency, successful-path motion claims, operational cues, complexity-proportional scaffolding, and phase-specific lint acceptance were promoted into `docs/development/plan-95-phase-copy-rewrites.md` for later dispatches.

Plan 95 remains `ready` because this is a multi-phase packet. Completing `resources-and-territory` does not close the packet.

## Phase 1 Accepted: Yes

## Phase 2 Foundations Outcome

The `foundations` board is settled by default: its five authored boards use frozen opponents and have no pending living-board packet. The digest and dossiers confirm that the revised copy describes the visible novice boards without inventing threat behavior or changing protected lesson contracts.

Phase 2 changed only student-facing prose in the five foundation level files. Teacher-facing pedagogy remains covered by the existing teacher guidance; no TeacherGuide update was needed.

Plan 95 remains `ready` because additional phase dispatches remain. Packet status and the development README remain owner/orchestrator controlled.

## Phase 2 Review Outcome

Accepted after orchestration review. The five-level sequence preserves novice operational cues, keeps fully protected and complexity-protected mechanics frozen, uses direct rule explanations without prescribing complete programs, and ends with zero foundations copy-voice warnings. The reusable distinction between teaching a first-use rule and revealing an assembled solution was added to the Plan 95 Phase 1 review learnings for later dispatches.

## Phase 2 Accepted: Yes

## Phase 3 Sensing Review Outcome

The `sensing` board is settled by default: its authored boards use frozen opponents, and behavior evidence shows no live enemy action on the passing reference paths. The revised copy therefore names board geometry and targets rather than inventing threats or future-level claims.

Phase 3 changed only student-facing prose in the five sensing level files. Teacher-facing pedagogy remains covered by the existing teacher guidance; no TeacherGuide update was needed.

The mechanics boundary and phase-specific lint result are accepted. Orchestration review requested a narrow prose-only repair to remove remaining answer-key and generated-copy phrasing in Levels 6, 8, and 9 before accepting the phase. Packet status and the development README remain owner/orchestrator controlled.

## Phase 3 Narrow Repair Outcome

Completed the requested prose-only repair in three sensing levels:

- `sensor-barrier-branch` now turns the barrier demo caption into a coach question about the frozen runner.
- `find-the-human` now uses the natural "ally's point of view" phrasing.
- `find-the-enemy-flag` now points out that the flag can shift from above to directly ahead as the ally moves.

Validation after the repair:

- `npm.cmd run level:copy-digest` - passed; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/level-copy-digest.test.js` - passed, 2/2 tests.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all five sensing levels.
- `git diff --check` - passed; reported only line-ending normalization warnings.

Accepted after orchestration re-review. The repaired lines now read as teacher/coach guidance, and the Level 9 direction change matches the passing reference program: the ally moves up while the flag is above, then moves forward after becoming aligned. Plan 95 status stays `ready` because later phase dispatches remain.

## Phase 3 Accepted: Yes

## Phase 4 Movement Helpers Outcome

The `movement-helpers` board is settled by the completed Plan 92 living-board pilot. This phase changed only student-facing prose in its seven level files; no setup, toolbox, win condition, fixture, NPC behavior, or Blockly structure changed.

- Levels 10 and 11 retain direct novice operational cues for keyboard control, the human runner, and one action per ally turn.
- Levels 12 and 14 describe their flag and wall boards without treating their harmless background Sentries as consequential threats.
- Level 13 names the live Guard and its proximity-based movement without prescribing an action or assembled program.
- Challenge 15 distinguishes the defender holding the lane from the other moving enemy, so its board hazards are concrete and accurate.
- The protected and complexity-protected boundaries were preserved: Levels 10 and 11 are fully protected; Levels 12, 14, and the Challenge 15 bug hunt received prose-only changes.

## Phase 4 Files Changed

- `src/config/levels/phases/movement-helpers/level-10-human-runner-practice.js`
- `src/config/levels/phases/movement-helpers/level-11-move-toward-flag.js`
- `src/config/levels/phases/movement-helpers/level-12-bring-it-home.js`
- `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js`
- `src/config/levels/phases/movement-helpers/level-14-jump-the-gap.js`
- `src/config/levels/phases/movement-helpers/bughunt-15-flag-phase.js`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `reports/development/guided-level-complexity-audit/copy-digest.md` - regenerated.
- `reports/development/plan-95-phase-copy-rewrites/progress.md` - this shared progress report.

## Phase 4 Validation

- `node scripts/dev/plan-status.js check plan-95-phase-copy-rewrites` - passed; packet is runnable.
- `npm.cmd run lint:levels` - passed with the repository's existing warning exit behavior; 0 `copy-voice-*` warnings in `movement-helpers`.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all seven movement-helper levels.
- `npm.cmd run level:copy-digest` - passed; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/level-copy-digest.test.js` - passed, 29/29 tests.
- `npm.cmd run test:unit` - passed, 478/478 tests.
- `npm.cmd test` - passed, 478/478 tests; runs the unit suite through the packet's broader test alias.
- `npm.cmd run build` - passed; Vite production build completed successfully.
- `git diff --check` - passed; reported only line-ending normalization warnings.

## Phase 4 Problems And Resolution

The first validation run found two existing authored-copy assertions for Challenge 15: its description needed to state that the defender is distinct from the moving enemy, and its intro needed the precise stationary-role wording `holds the lane`. The final prose satisfies both truthful board-role checks without changing the level mechanics or tests.

## Phase 4 Remaining Risks Or Follow-Ups

- The phase is ready for orchestration voice review; copy quality remains a curriculum judgment even with clean phase lint.
- Existing out-of-phase lint warnings, including the pre-existing `jump-the-gap` turn-limit-floor warning, remain outside this prose-only dispatch.
- Plan 95 remains `ready`; packet status and the development README remain owner/orchestrator controlled.

Orchestration review accepted the mechanics boundary and validation evidence but requested a narrow prose repair: correct Level 12's implication that the flag changes the meaning of home, and distinguish Level 13's student-selected sensor distance from the Guard's separate authored activation radius.

## Phase 4 Initial Review: Prose Repair Requested

## Phase 4 Narrow Repair Outcome

Completed the requested prose-only corrections in two movement-helper levels:

- `bring-it-home` now says that the ally's next target changes after pickup; the home base itself remains fixed.
- `enemy-nearby` now presents `Within 2` and `Within 3` as the ally's chosen warning distance, separate from the Guard's authored activation behavior.

Validation after the repair:

- `npm.cmd run level:copy-digest` - passed; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/level-copy-digest.test.js` - passed, 29/29 tests.
- phase-only copy-voice diagnostic check - passed; 0 warnings across all seven movement-helper levels.
- `git diff --check` - passed; reported only line-ending normalization warnings.

The repair changes only `description`, `introText`, a tip, and a tutorial title/body. Mechanics, setup, toolboxes, win conditions, fixtures, NPC behavior, and Blockly structures remain unchanged.

Accepted after orchestration re-review. Level 12 now keeps home fixed while changing the helper target after pickup. Level 13 treats `Within 2`/`Within 3` as student-selected warning distances and does not conflate them with the Guard's separate radius-1 activation rule. Plan 95 remains `ready` because later phase dispatches remain.

## Phase 4 Accepted: Yes

## Phase 5 Advanced Logic Outcome

The owner selected `advanced-logic` after orchestration recommended it and Plan 104 completed the Field Decisions identity/continuity gate. The phase board is settled: no pending living-board packet changes its authored levels, and the current behavior evidence/digest were reviewed before copy mutation.

This dispatch rewrote only student-facing prose in all ten advanced-logic entries: Challenge 22, the first five Field Decisions levels, the AND prediction checkpoint, both bug hunts, and Challenge 28. The revised briefings name the actual lane features and actors (barriers, frozen runners, the midfield line, the flag, patrollers, and live defenders), retain direct explanations for comparison and boolean tools, and ask students to decide the program rather than narrating a finished branch or route. Challenge 28 retains the required human-with-keys plus one-Blockly-ally framing and Team Strategy Script handoff.

No protected level is in this phase. No TeacherGuide update was needed: the removed student-facing meta narration had no teacher-facing pedagogical content that lacked an existing durable home.

## Phase 5 Files Changed

- `src/config/levels/phases/advanced-logic/bughunt-22-readiness-order.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/config/levels/phases/advanced-logic/level-23-closest-threat.js`
- `src/config/levels/phases/advanced-logic/level-24-how-far-away.js`
- `src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js`
- `src/config/levels/phases/advanced-logic/level-26-this-or-that.js`
- `src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js`
- `src/config/levels/phases/advanced-logic/prediction-25-two-truths.js`
- `src/config/levels/phases/advanced-logic/bughunt-28-boolean-trap.js`
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `reports/development/guided-level-complexity-audit/copy-digest.md` - regenerated.
- `reports/development/plan-95-phase-copy-rewrites/progress.md` - this shared progress report.

## Phase 5 Validation

- `node scripts/dev/plan-status.js check plan-95-phase-copy-rewrites` - passed; packet was runnable before mutation.
- `npm.cmd run lint:levels` - passed with the repository's warning exit behavior. The advanced-logic phase has 0 `copy-voice-banned-phrase`, `copy-voice-spoiler-phrase`, and `copy-voice-prose-length` warnings, down from the two pre-pass prose-length warnings in `how-far-away` and `flip-the-answer`.
- `npm.cmd run level:copy-digest` - passed; regenerated the 46-level digest.
- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/level-copy-digest.test.js` - passed, 29/29 tests.
- `npm.cmd test` - passed, 479/479 tests.
- `npm.cmd run build` - passed. Existing Blockly dynamic/static import and Vite chunk-size warnings remain.
- Browser verification - passed at the Field Decisions start (Level 23), boolean middle (Level 25), and narrow 390x844 Challenge 28 capstone. The visible stage indicator, carried-program wording, AND prompt, human keyboard cue, one Blockly ally, and three-defender framing all matched the authored copy.
- `git diff --check` - passed with only Git line-ending normalization notices.

## Phase 5 Problems And Resolution

- The first focused contract run found two existing authored-copy assertions: Challenge 22 must retain the factual phrases `Two enemies are active` and `live defenders`; the Level 24 demo caption must mention the sensor/pieces structure. The revised coach copy preserves those truthful cues, and the rerun passed.

## Phase 5 Remaining Risks Or Follow-Ups

- The capstone also displays the shared UI sentence `This level teaches direct keyboard control` from `src/ui/levels.js`. It is outside the phase-specific level-copy scope and lint surface, so it was not changed here. A future shared UI voice pass should rephrase it without altering keyboard-control behavior.
- Out-of-phase lint warnings remain for advanced-teamplay and optional copy, plus existing non-copy level warnings. They are not waived or altered by this dispatch.
- Copy quality remains subject to orchestration/owner review. Plan 95 remains `ready`; packet status and the development README are owner/orchestrator controlled.

## Phase 5 Ready For Orchestration Review: Yes

## Phase 5 Narrow Repair Outcome (Accepted)

Accepted after orchestration re-review. The five requested copy corrections accurately describe the authored boards and mechanics, and the Challenge 22 assertion now protects the specific outer-patrol and middle-defender roles. Independent validation regenerated the 46-level copy digest, passed the 29 focused guided-level and digest tests, confirmed zero `copy-voice-*` warnings in `advanced-logic`, and passed scoped diff checking with only the repository's line-ending notice. Plan 95 remains open for the remaining phase dispatches.

Completed the orchestration-requested prose and contract repair without changing mechanics, setup, toolboxes, win/failure conditions, fixtures, or Blockly XML:

- Challenge 22 now names the two outer-lane patrols and the middle defender. Its focused contract assertion now protects those actual board roles instead of the stale phrase `Two enemies are active`.
- Level 24 now describes the defender as patrolling, matching the `PATROL_INTERCEPT` behavior evidence.
- Level 25 now states that Area Freeze starts ready to spend, rather than implying an initial cooldown.
- Level 26 now frames OR as either warning asking the same thing, not as a priority-order decision.
- Challenge 28 now describes the student's actual human-plus-Blockly-ally role instead of using the slogan-like `Field Decisions is on the field` line.

The requested `npm.cmd run level:copy-digest`, phase lint, and 29 focused-test reruns were started after the edit, but the local terminal service stopped returning output or completing processes, including a plain `cmd /c echo hi` probe. The repair remains **pending validation rerun**; do not treat the prior Phase 5 acceptance recommendation as renewed until the commands complete successfully. Packet status remains owner-controlled `ready`.
