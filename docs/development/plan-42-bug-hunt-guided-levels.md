# Plan 42: Bug Hunt Guided Levels Before Challenges

## Packet Metadata

- Packet id: plan-42
- Packet title: Bug Hunt Guided Levels Before Challenges
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / curriculum / guided-level-authoring / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing core game rules, Blockly semantics, project membership, or challenge goals beyond the specific pre-challenge bug hunt insertions
- Expected artifacts:
  - four new guided bug hunt levels, one immediately before each current challenge
  - updated guided level order, unlock flow, concept matrix, and student/teacher-facing docs where level counts/order are named
  - starter Blockly programs that are intentionally broken but repairable
  - reference solutions and guided-level tests updated for the new order
  - progress report
- Progress report folder: `reports/development/plan-42-bug-hunt-guided-levels/`
- Progress report file: `reports/development/plan-42-bug-hunt-guided-levels/progress.md`

## Packet Summary

Goal: Add one bug hunt guided level before each synthesis challenge so students practice reading, predicting, running, and repairing plausible broken Blockly programs before they enter open-ended challenge levels.

Non-goals:

- Do not add new Blockly blocks, new sensors, new game rules, or new failure conditions.
- Do not redesign the four existing challenge levels except for renumbering/order metadata needed after inserting new levels.
- Do not convert bug hunts into multiple-choice prediction levels; Plan 43 owns prediction interactions.
- Do not reveal exact challenge solutions in bug hunt starter programs, demos, hints, or reference copy.
- Do not change project membership decisions from Plans 08-14.
- Do not deploy.

Depends on:

- Current guided level campaign after Plans 23, 24, 26, and 34 repairs.
- `npm run lint:levels` from Plan 34.
- Existing guided starter XML/reference-solution/test harness patterns.

Blocks:

- Pilot readiness improvements around debugging practice.
- Future teacher facilitation prompts that ask students to identify bugs before coding from scratch.
- Future prediction-level work in Plan 43, which should align vocabulary with these debugging levels.

Why this packet exists:

The campaign currently teaches concepts and then asks students to synthesize them in challenges. That is good, but pilot students will also need explicit debugging practice: reading an existing program, predicting what it will do, noticing why it fails, and making a small repair. Bug hunt levels strengthen AP CSA transfer because students practice code tracing, branch reasoning, first-action semantics, boolean logic, and role-based decomposition without always starting from a blank workspace.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-17):

### Decision 1: Id/namespace scheme — separate namespace, no existing renumbering

Bug hunt levels live in their own id namespace: `bughunt-N` where `N` is the associated challenge level number. The four new levels are:

- `bughunt-15` — before challenge `level-15` (flag-phase / first-action)
- `bughunt-22` — before challenge `level-22` (readiness / branch ordering)
- `bughunt-28` — before challenge `level-28` (boolean composition, Strategy Brain capstone)
- `bughunt-37` — before challenge `level-37` (runner-index roles, Team Strategy Script capstone)

Filenames follow the same pattern: `src/config/levels/phases/<phase>/bughunt-15-<slug>.js`, etc. Visible titles can read "Bug Hunt: Flag Phase" or similar — the visible numbering shown to students is decoupled from the file id and may render as "Level 14b" or "Bonus Debugging" per implementer judgment. No existing `level-NN-*.js` file is renamed, no existing id changes. Campaign-order arrays (`src/config/levels/index.js`, manifest) insert four new entries in the right positions; that is the only ordering change.

### Decision 2: New `levelKind` value — `"bug_hunt"`

Bug hunt levels set `levelKind: "bug_hunt"` in their level definition. This is the second recognized `levelKind` value (alongside the existing `"challenge"` value used by the four challenge levels in `src/config/levels/phases/`). Levels without a `levelKind` continue to be the implicit "lesson/tutorial" default.

`scripts/lint-levels.js` gains new contracts that fire on `levelKind === "bug_hunt"`:

- **`bug-hunt-introduces-no-new-block`** (warning): every block type in the bug hunt's toolbox must already have been introduced in an earlier campaign level. Mirrors the existing `challenge-introduces-no-new-block` contract.
- **`bug-hunt-has-broken-starter`** (warning): the bug hunt's `starterWorkspace` (or equivalent starter XML field) must be present and non-empty. A bug hunt with an empty starter is not a bug hunt.
- **`bug-hunt-has-reference-solution`** (warning): the level must define a canonical fixed solution under the existing reference-solution mechanism. Reuses the existing reference-solution lint surface.

Test coverage for the new contracts is added to `tests/unit/level-lint.test.js`.

### Decision 3: Broken-starter validation test contract

Each bug hunt level adds an entry to a new fixture in `tests/unit/guided-bug-hunt-contracts.test.js` (or extends `guided-reference-solutions.test.js`, implementer's call) asserting two facts:

- The broken starter program, run through the same harness that validates reference solutions, **fails** the level (does not reach the success condition within the level's turn budget).
- The reference solution **passes** as it already does for every authored level.

This pair of assertions is the contract that locks down the pedagogy: the broken starter must actually be broken, and the minimal repair must actually work. If the broken starter accidentally passes, the test fails loudly.

### Decision 4: Authoring efficiency

Author each broken starter by **copying the reference solution's Blockly XML and applying one targeted break** — flip a comparison operator, swap `AND` for `OR`, reorder two action branches, remove a readiness guard, point a runner-index branch at the wrong index, etc. Do not hand-build broken XML from scratch. The targeted break should match the bug hunt's intended repair (see "Suggested bug hunt concepts" below). Document the break in the progress report alongside the bug story.

### Decision 5: Coordination with Plan 43 (prediction levels)

Plan 43 inserts 2–3 multiple-choice prediction levels at high-value reasoning cliffs, with pilot placements that overlap conceptually with the bug hunts in this packet (boolean composition, runner-index roles). Coordination rules:

- Plan 42 lands first. Plan 43's placement decisions reference the post-Plan-42 campaign order.
- Plan 42 does **not** add prediction prompts to bug hunt levels. Predictions and bug hunts are distinct interaction patterns; Plan 43 owns predictions exclusively.
- A future packet may add prediction prompts that point at the bug hunts ("predict what this broken program will do, then find the bug"). That composition is intentional but out of scope here.
- Vocabulary should be deliberately compatible: bug hunt copy uses terms like "trace," "first action," "branch," "readiness check," "runner role" — the same vocabulary Plan 43 will use in its prediction prompts. Plan 43 reads this packet's authored copy and aligns to it.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `docs/development/archive/plan-08-guided-project-sequence-design.md`
- `docs/development/archive/plan-11-strategy-brain-project-revision.md`
- `docs/development/archive/plan-12-team-strategy-script-project-revision.md`
- `docs/development/archive/plan-34-level-authoring-contract-linter.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/levels/`
- `tests/unit/`
- `tests/browser/`

Required product contracts:

- Guided levels should teach or reinforce one primary idea at a time unless explicitly marked synthesis/challenge/project.
- Bug hunt levels reinforce already-taught ideas; they must not introduce new blocks or hidden game rules.
- Student programs still run from the required `On Each Turn` event block.
- Only the first reached action executes for a runner turn.
- Demo Blockly should show structure, not reveal the exact solution.
- Project levels carry shared code only through existing project metadata rules.
- Challenge levels remain synthesis moments with no new tools.
- The app remains a static Vite deployment.

Do not redefine:

- Core CTF rules, collision rules, flag/base rules, resource readiness semantics, or one-action-per-turn behavior.
- Existing challenge learning goals.
- Existing project ids, project membership, or project toolbox policy.
- Plan 43 prediction-level interaction design.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `docs/development/archive/plan-34-level-authoring-contract-linter.md`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/config/levels/shared/blocklyXml.js`
- `src/config/levels/shared/levelProgress.js`
- `src/config/levels/shared/project.js`
- `src/config/levels/shared/projectToolboxes.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `scripts/lint-levels.js`

Use `rg "levelKind|challenge|starter|starterXml|reference|project|unlock|nextLevel"` from the repository root to find the exact source/test surfaces if names have shifted.

## Scope

### In scope

- Add four bug hunt guided levels with ids `bughunt-15`, `bughunt-22`, `bughunt-28`, `bughunt-37` (see Decision 1). Each inserts immediately before its associated challenge in campaign order.
- Add `levelKind: "bug_hunt"` to those four level definitions (see Decision 2).
- Add three linter contracts on `levelKind === "bug_hunt"` (see Decision 2) and matching tests in `tests/unit/level-lint.test.js`.
- Add broken-starter validation tests (see Decision 3) — broken starter must fail, reference solution must pass.
- Update campaign-order arrays and unlock prerequisites so the four new levels appear in the right slots. Do **not** rename or renumber existing `level-NN-*.js` files or ids.
- Update concept matrix and student/teacher docs only where they reference campaign length or insert visible step counts. Visible titles may render as e.g. "Level 14b: Bug Hunt — Flag Phase" or implementer choice; bare title visibility is not contract-load-bearing.
- Add intentionally broken starter Blockly for each bug hunt.
- Add copy that tells students they are debugging a program, not starting from scratch.
- Add hints that encourage tracing: first action reached, branch truth, resource readiness, runner index role, or flag-state check.
- Add or update canonical reference solutions.
- Update concept matrix and relevant student/teacher docs to show bug hunt placement.
- Update linter expectations if the new level kind or naming pattern needs linter awareness.
- Write a progress report with each bug hunt's intended bug, expected misconception, and validation.

### Suggested bug hunt concepts

Bug hunt before the first challenge:

- Broken idea: the runner can get the enemy flag but does not switch cleanly into return-home behavior, or the flag condition is reversed.
- Concepts reinforced: flag possession, two-phase scoring, first reached action.
- Avoid: live randomness or complex defenders.

Bug hunt before the resource/territory challenge:

- Broken idea: an unconditional action appears before the readiness/condition branch, or a resource action is attempted without checking readiness.
- Concepts reinforced: one-action-per-turn, readiness checks, branch ordering.
- Avoid: requiring a new UI explanation or new failure condition.

Bug hunt before the Strategy Brain capstone:

- Broken idea: boolean logic uses `OR` where `AND` is needed, uses `NOT` on the wrong condition, or checks the right facts in the wrong branch.
- Concepts reinforced: AP CSA boolean reasoning, condition composition, code tracing.
- Avoid: a bug that is only visible after a long run.

Bug hunt before the Team Strategy Script capstone:

- Broken idea: runner index roles overlap, leave one runner without a useful branch, or make every ally chase the same target.
- Concepts reinforced: shared program, runner index roles, decentralized coordination.
- Avoid: central-command framing or per-runner custom programs.

### Files and areas likely touched

- `src/config/levels/phases/**`
- `src/config/levels/phases/*/index.js`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/config/levels/shared/blocklyXml.js`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/StudentGuide.md`
- `docs/TeacherGuide.md`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`
- `tests/browser/guided-ui.spec.js`
- `scripts/lint-levels.js` only if the linter needs a small policy update for the new bug hunt level kind
- `reports/development/plan-42-bug-hunt-guided-levels/progress.md`

### Out of scope

- Multiple-choice prediction UI.
- A new bug hunt engine mode.
- Source changes in `src/core/` unless a test exposes a genuine pre-existing bug and the integration owner approves a repair.
- New Blockly blocks.
- New NPC behavior.
- Deployment.

## Work Plan

1. Summarize the packet and inspect the current guided order, challenge ids, level numbering, reference solutions, and linter state.
2. Decide the exact four insertion points and level ids, then stop if renumbering would collide with owner expectations.
3. Author one bug hunt at a time with starter XML, copy, hints, reference solution, and focused tests.
4. Update campaign order, docs, linter expectations, and project fixtures after all four levels exist.
5. Run targeted tests after the first bug hunt before repeating the pattern.
6. Run full guided validation and broad validation.
7. Write the progress report with each bug hunt's bug story, validation, and remaining risks.

## Implementation Requirements

### Requirement 1: Bug hunts must be repair-focused

Required behavior:

- Each bug hunt loads with a broken starter program.
- The starter program must be plausible for a student who just learned the relevant concept.
- The failure must be visible within a short run.
- The expected repair should be small: reorder, flip a condition, add/readiness guard, change a dropdown, or repair an index branch.

Constraints:

- Do not require students to delete the whole program and rebuild from scratch.
- Do not hide the bug in timing randomness.
- Do not use concepts not yet taught.

### Requirement 2: Placement must support challenge readiness

Required behavior:

- Each bug hunt appears immediately before its associated challenge.
- The associated challenge still reads as a synthesis level after the bug hunt.
- Unlock flow and `Next Level` flow remain coherent.

Constraints:

- If visible numbering changes, update all docs/tests that depend on level titles or counts.
- If renumbering creates too much churn, stop and propose an owner decision before editing many files.

### Requirement 3: Copy must teach debugging habits

Required behavior:

- Lesson text should frame the task as "find and fix the bug."
- Hints should ask students to trace behavior before offering a fix.
- Copy should distinguish student-facing bug causes from implementation terms.

Constraints:

- Do not reveal exact final code in primary directions.
- Do not blame the student. The tone should make debugging feel normal and expected.

### Requirement 4: Broken starter is verified broken

Required behavior:

- A new test fixture (`tests/unit/guided-bug-hunt-contracts.test.js`, or an extension of `guided-reference-solutions.test.js`) loads each bug hunt and asserts:
  - the broken starter program does **not** satisfy the level's success condition within the level's turn budget;
  - the reference solution satisfies the success condition (this is the existing contract, just confirmed for bug hunts too).
- The test runs through the same harness reference solutions already use. No new engine hooks.

Constraints:

- If the broken starter accidentally passes, the test fails and the implementer must adjust the targeted break — not the assertion.
- Do not skip this test for any of the four bug hunts.

### Requirement 5: Linter contracts on `levelKind === "bug_hunt"`

Required behavior:

- `scripts/lint-levels.js` gains three contracts (Decision 2 enumerates them).
- `tests/unit/level-lint.test.js` exercises each new contract with at least one passing and one failing fixture.
- `npm run lint:levels` produces no new errors on the authored bug hunts; warnings are surfaced and triaged in the progress report.

Constraints:

- Do not weaken existing linter contracts.
- Do not introduce a new `levelKind` value beyond `"bug_hunt"` in this packet.

### Requirement 6: Tests and linter stay aligned

Required behavior:

- `npm run lint:levels` should pass or report only pre-existing/approved warnings.
- Guided reference solutions must still pass.
- Project final/cumulative fixture tests must still reflect the authored project contracts.
- Browser tests that rely on challenge numbering/order must be updated.

Constraints:

- Do not weaken tests merely to fit new levels.
- If a linter warning exposes a real curriculum mismatch, fix the level or stop for owner review.

## Commands

Run from the repository root:

```powershell
npm run lint:levels
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npm test
npm run test:browser
npm run build
```

If you add or modify a focused browser spec, run that spec directly before the broad browser suite.

## Validation Checklist

- [ ] Four bug hunt levels (`bughunt-15`, `bughunt-22`, `bughunt-28`, `bughunt-37`) exist with `levelKind: "bug_hunt"` and are placed immediately before their associated challenge levels.
- [ ] No existing `level-NN-*.js` file or id was renamed.
- [ ] Each bug hunt starts with an intentionally broken but plausible starter program, authored by copying the reference solution XML and applying one targeted break.
- [ ] Broken-starter validation test asserts broken starter fails and reference solution passes for all four bug hunts.
- [ ] Three new linter contracts on `levelKind === "bug_hunt"` are implemented with passing+failing fixtures in `level-lint.test.js`.
- [ ] Each bug hunt reinforces previously taught concepts only.
- [ ] Each bug hunt has a concise bug story and repair target documented in the progress report.
- [ ] Level order, titles, unlock flow, and `Next Level` flow are coherent.
- [ ] Concept matrix reflects the new levels.
- [ ] Student/teacher docs reflect updated campaign shape where needed.
- [ ] Reference solutions solve all authored non-human guided levels.
- [ ] Project fixture tests still match authored project behavior.
- [ ] `npm run lint:levels` passes or only reports approved warnings.
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] `npm run build` passes.
- [ ] No core game-rule behavior changed.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report before broadening scope if:

- Inserting four levels requires a broad campaign renumbering decision beyond straightforward title/order updates.
- A proposed bug hunt needs a new block, new rule, new NPC behavior, or new UI surface.
- A bug hunt cannot be made legible without revealing a challenge solution.
- Existing reference/project tests fail in a way that implies a broader campaign design issue.
- The linter flags new errors that require curriculum-owner judgment.
- A subsystem note becomes untrue and the correct contract wording requires owner judgment.
- Any production deploy, dependency install, or workflow change appears necessary.
