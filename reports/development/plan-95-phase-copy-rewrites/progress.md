# Progress Report - Plan 95: Phase Copy Rewrites

## Overall Summary

Completed the first owner-selected Plan 95 phase dispatch and two requested orchestration repair passes for `resources-and-territory`. Built the durable all-level copy digest generator, regenerated its 46-level report, and performed a genuine in-world scout/coach voice pass across all six levels in the selected phase. The repair passes reduced prescriptive winning-sequence language, varied tutorial/demo phrasing, restored student decision space, named the Charger threat in Jump If Ready, restored Relay Race's keyboard/staging orientation, and corrected the barrier terminology in Stay Still without changing mechanics, board setup, toolboxes, win conditions, fixtures, NPC configuration, or runtime source.

The phase board is settled for this dispatch: the packet identifies `resources-and-territory` as settled by Plans 93/103, and the current source/dossiers show the authored charger, patrol, and frozen-opponent arrangements that the revised copy describes. Existing `TeacherFacilitationKit.md` already preserves the phase's pedagogical framing and intervention prompts, so no teacher-doc move was needed.

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
- `git diff --check` - passed; reported only existing line-ending normalization warnings.

## Validation Checks Performed

- Selected phase copy-voice warnings before rewrite: 3 (`jump-if-ready`, `stay-still-can-do-something`, and `my-side-their-side`).
- Selected phase copy-voice warnings after rewrite and orchestration repair: 0 across all six phase levels.
- The repair pass specifically reduced answer-prescribing language in `jump-if-ready`, `relay-race`, `my-side-their-side`, and `freeze-the-lane`, while retaining direct action rules where they are the level's actual concept in `build-the-barrier` and `stay-still-can-do-something`.
- The second repair round changed prose only in `jump-if-ready`, `stay-still-can-do-something`, and `relay-race`: Charger-specific threat language, keyboard/staging orientation, and `barrier` terminology respectively. The regenerated digest shows Jump If Ready's live collision-threat board summary alongside its Charger copy.
- Digest tests now confirm that tutorial `demoTitle` and `demoCaption` are rendered alongside the other student-facing copy fields.
- No spoiler warnings were introduced in the selected phase.
- Protected `my-side-their-side` changed only prose fields: `description`, `introText`, `tips`, and tutorial-step title/body text. Its comments, mechanics, toolbox, win condition, failure condition, turn limit, board setup, NPC/tier metadata, and starter/reference structures were unchanged by this dispatch.
- Copy digest unit tests cover phase grouping, verbatim copy preservation, lint-hit rendering, live/frozen opponent counts, board-tier output, and honest missing metadata.
- Full tests and build confirm that the prose-only changes preserve existing contracts.

## Problems Encountered And How Resolved

- The repository has many non-blocking warnings outside the selected phase, including existing copy-voice warnings in foundations, sensing, advanced logic, advanced teamplay, and optional levels, plus existing board-dynamics and turn-limit warnings. They remain outside this phase dispatch and were not silenced or modified.
- The first generator test command and direct generator command both passed before the packet-named npm command was rerun; the exact packet command was subsequently run and passed.

## Remaining Risks Or Follow-Ups

- Copy tone is a curriculum judgment and should receive owner/orchestration review before landing.
- The generated digest is intentionally a tracked report artifact; regenerate it after future level-copy or board changes before reviewing another phase.
- The remaining out-of-phase copy warnings should be handled by later Plan 95 dispatches, not folded into this phase.

## Phase 1 Review Outcome

Accepted after dual-orchestrator review and two bounded repair rounds. The reusable review lessons about tier-gated threat naming, sibling-archetype consistency, successful-path motion claims, operational cues, complexity-proportional scaffolding, and phase-specific lint acceptance were promoted into `docs/development/plan-95-phase-copy-rewrites.md` for later dispatches.

Plan 95 remains `ready` because this is a multi-phase packet. Completing `resources-and-territory` does not close the packet.

## Phase 1 Accepted: Yes
