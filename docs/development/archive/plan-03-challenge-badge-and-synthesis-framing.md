# Plan 03: Challenge Badge And Synthesis Framing

## Packet Metadata

- Packet id: plan-03
- Packet title: Challenge Badge And Synthesis Framing
- Status: ready
- Owner/model: lower-cost implementation agent
- Date: 2026-05-12
- Packet type: frontend / implementation / pedagogy
- Mutation level: source-code / tests
- Approval gate: none
- Expected artifacts:
  - challenge/synthesis metadata on the intended guided levels
  - visible challenge signifier in the guided level picker
  - visible in-level challenge framing when a challenge level is selected
  - focused tests for metadata and rendered UI behavior
  - progress report
- Progress report folder: `reports/development/plan-03-challenge-badge-and-synthesis-framing/`
- Progress report file: `reports/development/plan-03-challenge-badge-and-synthesis-framing/progress.md`

## Packet Summary

Goal: Make guided challenge levels visibly distinct so students understand that these are "no new tools" synthesis moments where they should combine ideas they already learned.

Non-goals:

- Do not redesign the full guided level picker.
- Do not reorganize the campaign into phase headers.
- Do not change level mechanics, maps, turn limits, toolbox contents, or reference solutions.
- Do not add a new completion/reward system.
- Do not introduce new dependencies.

Depends on:

- Plan 01 level source split.
- Plan 02 guided test contract repair.

Blocks:

- Classroom playtesting where students need to distinguish learning levels from synthesis levels.
- Later guided pacing review.

Why this packet exists:

Browser Battlegorithms currently uses some source titles and copy to imply challenge levels, but the UI does not give students a consistent signal. For AP CSA and Hour-of-Code use, students need to recognize when the task has shifted from "learn this new block" to "design a strategy from existing tools." That distinction supports strategic boolean thinking, debugging, and decentralized ally rules instead of copy-following.

## Authority And Contracts

Required product contracts:

- Guided levels teach one primary concept at a time unless clearly marked as synthesis/challenge levels.
- Challenge levels should be student-facing "use what you know" moments, not hidden metadata only developers can see.
- Visible labels should be concise and classroom-friendly.
- UI should remain usable on student laptops and narrow screens.
- The app remains a static Vite app.

Do not redefine:

- The one-action-per-turn execution model.
- The guided campaign order.
- Which blocks are unlocked in each level.
- The current scoring and win-condition model.

## Required Reading

Read these first:

- `docs/development/README.md`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/ui/levels.js`
- `src/assets/styles/style.css`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/display-and-controls.test.js`

Use `rg "Challenge|No new tools|levelKind|lessonKind"` from the repository root if filenames or symbols have moved.

## Scope

In scope:

- Add explicit challenge metadata to guided level definitions.
- Update level normalization/manifest behavior if needed so metadata survives `getLevelDefinitions()`.
- Add a compact `Challenge` signifier in the guided level picker.
- Add a short in-level challenge callout when the selected guided level is a challenge.
- Add or update tests that prove the metadata and UI rendering contract.
- Keep copy short, student-facing, and consistent.

Out of scope:

- Full level-picker phase grouping.
- New animations, sounds, badges after completion, or scoring systems.
- Changes to tutorials beyond the challenge framing needed for this packet.
- Changes to guided level solutions.
- Free-play challenge labeling.

Files and areas likely touched:

- `src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js`
- `src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/ui/levels.js`
- `src/assets/styles/style.css`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/display-and-controls.test.js`

## Implementation Requirements

### 1. Add Explicit Challenge Metadata

Required behavior:

- Add an explicit metadata field to challenge/synthesis levels.
- Prefer a simple field such as `levelKind: "challenge"` unless the surrounding code suggests a better local name.
- The field must be preserved by `getLevelDefinitions()`.
- The manifest should expose this metadata so agents and tests can inspect it quickly.

Initial levels to mark:

- `dodge-and-deliver`
- `show-what-you-know`
- `full-team-tactics`
- `advanced-scrimmage`

Notes:

- `advanced-scrimmage` does not currently have a `Challenge` title, but it functions as the capstone synthesis level and should receive the same UI treatment unless review shows a better `levelKind` split such as `challenge` vs `capstone`.
- Student-facing label should be `Challenge` for all marked levels in this packet. Do not expose internal taxonomy such as "synthesis" unless there is a strong reason.

### 2. Level Picker Signifier

Required behavior:

- In the guided level picker, challenge levels show a compact `Challenge` badge or pill near the title or status.
- The badge must not replace status text such as `Available`, `Passed`, or `Locked`.
- The badge must remain visible for locked, available, current, and passed challenge levels.
- The current level trigger should also indicate `Challenge` when the selected level is a challenge, if it can do so without crowding.

Constraints:

- Keep the picker scannable.
- Avoid relying on title parsing.
- Avoid color-only meaning. The word `Challenge` must be visible to sighted users, and the text must be available to screen readers.

### 3. In-Level Challenge Framing

Required behavior:

- When a challenge level is selected, the lesson panel shows a short challenge callout near the title/intro.
- Recommended text:
  - title/label: `Challenge Level`
  - body: `No new blocks here. Use tools you already know to build a complete strategy.`
- The callout should appear before hints and tool listings.
- The callout should not appear in ordinary teaching levels or free play.

Constraints:

- Do not add long explanatory copy.
- Do not imply there is only one correct solution.
- Do not say the app is grading algorithm quality; it is marking the special learning moment.

### 4. Styling

Required behavior:

- Add small, readable CSS for the picker badge and challenge callout.
- Fit inside existing panel widths on mobile and desktop.
- Preserve current visual hierarchy: this is a signifier, not a new hero treatment.

Constraints:

- No new decorative backgrounds or large card nesting.
- Do not make the panel substantially taller for ordinary levels.
- Use existing color vocabulary where possible, but make the signifier distinct from pass/fail status.

### 5. Tests

Required behavior:

- Update guided contract tests to assert the intended challenge ids have `levelKind: "challenge"` or the chosen equivalent.
- Assert ordinary teaching levels do not accidentally inherit challenge metadata.
- Assert the manifest includes the challenge metadata.
- Add or update a UI rendering test that checks:
  - a challenge level picker item includes the visible `Challenge` signifier
  - an ordinary level picker item does not
  - selected challenge level summary includes the challenge framing

Do not overfit tests to exact CSS class names unless the existing display tests already do so. Prefer behavior and visible text.

## Work Plan

1. Inspect current challenge-like levels and confirm the intended four-level set.
2. Add metadata to level source and preserve it through `getLevelDefinitions()` and the manifest.
3. Render the level-picker badge and in-level challenge callout from metadata.
4. Style the badge and callout responsively.
5. Add focused unit/display tests.
6. Run targeted tests, then full validation.
7. Write the progress report with files changed, commands run, and any remaining risks.

## Validation Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/display-and-controls.test.js
npm test
npm run build
```

If the implementation changes layout enough that visual regressions are plausible, also run:

```powershell
npm run test:browser
```

## Validation Checklist

- [ ] Challenge metadata exists on the intended challenge/capstone levels.
- [ ] Ordinary teaching levels are not labeled as challenge levels.
- [ ] `getLevelDefinitions()` preserves the metadata.
- [ ] `GUIDED_LEVEL_MANIFEST` exposes the metadata.
- [ ] Guided level picker visibly marks challenge levels.
- [ ] Selected challenge level shows concise in-level challenge framing.
- [ ] Ordinary levels do not show the challenge framing.
- [ ] UI remains usable at narrow and desktop widths.
- [ ] Targeted tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No level mechanics, toolboxes, maps, win conditions, or reference solutions changed.
- [ ] Progress report exists at the required path.

## Stop Conditions

Stop and report for integration-owner review if:

- The only way to implement the signifier requires a broad level-picker redesign.
- The intended set of challenge levels is ambiguous after source/doc inspection.
- The UI would need a new design system or dependency.
- Tests reveal existing title/copy inconsistencies that imply a broader guided curriculum rewrite.
- The implementation would change gameplay behavior, Blockly behavior, or guided progression.

