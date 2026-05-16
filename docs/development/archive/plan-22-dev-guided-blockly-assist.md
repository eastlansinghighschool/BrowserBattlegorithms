# Plan 22: Dev Guided Blockly Assist

## Packet Metadata

- Packet id: plan-22
- Packet title: Dev Guided Blockly Assist
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-14
- Packet type: implementation / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - dev-only Blockly assist behavior for `devGuidedLevel` links
  - focused tests proving assisted Blockly startup behavior and production safety
  - review/update of Plan 06 Gemini prompt/instruction files only where stale directions would hinder the assisted UI
  - progress report
- Progress report folder: `reports/development/plan-22-dev-guided-blockly-assist/`
- Progress report file: `reports/development/plan-22-dev-guided-blockly-assist/progress.md`

## Packet Summary

Goal: Make Plan 06 local-dev deep-link playtesting less brittle for browser agents by opening the first Blockly drawer and placing the required `On Each Turn` block visibly to the right of that drawer when a valid `devGuidedLevel` shortcut is active.

Non-goals:

- Do not change normal student-facing Guided Levels or Free Play Blockly startup behavior.
- Do not add a new public URL parameter, visible feature flag, help-page mention, or classroom-facing setting.
- Do not change Blockly semantics, available blocks, toolbox policy, level definitions, reference solutions, game rules, guided progression, or localStorage unlock state.
- Do not redesign the Blockly panel for Chromebook/student screen widths.
- Do not run the Plan 06 campaign playtest.
- Do not install dependencies.
- Do not deploy.

Depends on:

- Plan 19 complete.
- Plan 06 in progress and using the Plan 19 `devGuidedLevel` harness.

Blocks:

- More efficient Plan 06 Gemini/browser-agent guided playtest runs.
- Cleaner distinction between app learning friction and browser-agent Blockly manipulation friction.

Why this packet exists:

Plan 06 asks Gemini or another browser-capable playtester to use Blockly like a student, but the browser agent is wasting effort opening the drawer and dragging blocks from a position that visually overlaps the default event-block location. This packet improves the local-dev playtest harness without changing the student-facing classroom experience.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
  - `docs/development/plan-06-guided-playtest-triage.md`
  - `docs/development/plan-19-guided-playtest-harness-and-gemini-scaffolding.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `vite.config.js`
  - `playwright.config.js`
  - `src/`
  - `tests/`
- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/ui-mode-contract.md`

Required product contracts:

- The app remains a static Vite deployment.
- The assist behavior is local-dev-only and tied to a valid `devGuidedLevel` shortcut.
- Production builds must ignore `devGuidedLevel` and must not expose the assist behavior.
- Normal app entry, normal guided navigation, and Free Play must keep their existing Blockly startup behavior.
- Guided mode still uses the required `On Each Turn` block and one-action-per-turn behavior.
- The assist is a playtest-harness convenience, not a student-facing pedagogy decision.

Do not redefine:

- Guided level order, IDs, project membership, or project names.
- Guided unlock progression.
- Student-facing navigation, tutorial, Blockly copy, or help copy.
- Blockly toolbox restrictions or block availability.
- Any subsystem runtime contract unless the implementation directly changes it and the update is plainly mechanical.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/development/plan-06-guided-playtest-triage.md`
- `docs/development/plan-19-guided-playtest-harness-and-gemini-scaffolding.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/ui/devGuidedLevelLink.js`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/blocks.js`
- `src/ui/blocklyPanel.js`
- `tests/unit/dev-guided-level-link.test.js`
- `tests/browser/dev-guided-level-link.spec.js`
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- `reports/development/plan-06-guided-playtest-triage/progress.md`
- `reports/development/plan-06-guided-playtest-triage/level-context/`

Use `rg "devGuidedLevel|guidedLevelDevAccess|Blockly.inject|buildDefaultWorkspaceXml|updateToolbox|selectItemByPosition|On Each Turn"` from the repository root if names have moved.

Optional/contextual:

- `tests/browser/guided-ui.spec.js`
- `tests/browser/startup.spec.js`
- `src/ui/blocklyLayout.js`
- `src/assets/styles/style.css`

## Scope

### In scope

- When a valid local-dev `devGuidedLevel` shortcut is active, make the Blockly workspace start in an agent-assisted state:
  - first available toolbox category/drawer open by default
  - default or rebuilt `On Each Turn` block positioned visibly to the right of the open drawer
  - workspace resized/scrolled if needed so both the drawer and event block are visible
- Keep the trigger tied to the existing valid `devGuidedLevel` path; do not require rewriting Plan 06 level URLs.
- Add focused unit/browser tests for the assist trigger and visible startup behavior.
- Review Plan 06 Gemini prompt/instruction files and update only directions that would be actively hindered by the assisted Blockly UI.
- Write the Plan 22 progress report.

### Files and areas likely touched

- `src/ui/devGuidedLevelLink.js`
- `src/ai/blockly/workspace.js`
- Optional small helper near Blockly workspace setup if that keeps the implementation clean
- `tests/unit/dev-guided-level-link.test.js` or a new focused unit test
- `tests/browser/dev-guided-level-link.spec.js` or a new focused browser test
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- Possibly selected files under `reports/development/plan-06-guided-playtest-triage/level-context/` only if they contain stale navigation instructions
- `reports/development/plan-22-dev-guided-blockly-assist/progress.md`
- `docs/subsystems/blockly-workspace.md` only if the implementation changes the documented workspace lifecycle contract

### Out of scope

- Student-facing layout redesign.
- A separate `devBlocklyAssist` parameter.
- Changes to toolbox contents, block definitions, block labels, or level-specific toolbox policy.
- Changes to mode chooser, tutorial overlays, project callouts, usage export, Free Play, NPC/CPU, or turn engine behavior.
- Changes to Plan 06 playtest findings or per-level reports.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

## Implementation Requirements

### Requirement 1: Dev-guided Blockly assist trigger

Required behavior:

- In local dev mode, a valid `?devGuidedLevel=<levelId>` or supported `#devGuidedLevel=<levelId>` shortcut activates the Blockly assist.
- Missing or invalid `devGuidedLevel` values do not activate the assist.
- Production builds do not activate the assist.

Constraints:

- Reuse the existing Plan 19 dev-guided shortcut path instead of adding a new URL parameter.
- Keep trigger state explicit enough that tests can distinguish normal dev startup from assisted dev-guided startup.
- Do not mutate guided unlock progress or localStorage as part of the assist.

Edge cases:

- If the editor initializes after the level shortcut is applied, the assist must still apply once Blockly is ready.
- If toolbox categories are empty for any unexpected reason, do not crash; leave normal workspace behavior and report the limitation.

Expected artifact or code change:

- Small source change that records and consumes dev-guided assist state.

### Requirement 2: Assisted Blockly startup layout

Required behavior:

- The first available toolbox category opens automatically when assist mode is active.
- The required `On Each Turn` event block starts or is rebuilt far enough to the right that it is visible alongside the open drawer.
- The block remains immovable, undeletable, and warning-free as before.

Constraints:

- Preserve existing default event-block placement outside assist mode.
- Preserve `loadWorkspaceXml()`, reset, project-shared workspace, and undo-history semantics from `docs/subsystems/blockly-workspace.md`.
- Do not change available block categories or toolbox filtering.
- Prefer Blockly APIs such as toolbox selection and block positioning over DOM-coordinate hacks.

Edge cases:

- Existing saved workspaces should not be unexpectedly rewritten merely because the deep link was opened.
- If a saved workspace already has an `On Each Turn` block, do not relocate the student's existing workspace unless the behavior is clearly limited to the default/rebuilt starter block and documented in the progress report.

Expected artifact or code change:

- Focused Blockly workspace startup adjustment.

### Requirement 3: Prompt and instruction compatibility review

Required behavior:

- Review the Plan 06 Gemini prompt, `progress.md`, and representative/current level-context instructions for directions that may be actively hindered by the assisted UI.
- Update only instructions that would make Gemini fight the new assisted starting state, such as assuming the drawer begins closed or requiring an initial drawer-opening click.

Constraints:

- Do not rewrite the Plan 06 playtest methodology.
- Do not add broad explanation of the assist feature.
- Do not pre-fill or alter playtest findings.
- Do not bulk-edit all level contexts unless there is a repeated stale instruction pattern.

Edge cases:

- If no prompt/context wording conflicts with the assist UI, record that in the Plan 22 progress report instead of making unnecessary edits.

Expected artifact or code change:

- Minimal Plan 06 prompt/context update if needed, or progress-report note that no changes were needed.

### Requirement 4: Focused validation

Required behavior:

- Add or update tests proving:
  - valid local-dev `devGuidedLevel` activates the assist
  - normal startup or invalid deep links do not activate the assist
  - the first toolbox category is open in the assisted browser startup path
  - the `On Each Turn` block is visible to the right of the open drawer in the assisted browser startup path, using a robust assertion rather than a brittle screenshot if possible

Constraints:

- Keep tests focused on the harness behavior; do not retest the entire level picker or Blockly interpreter.
- Do not make tests depend on guided levels being globally unlocked.
- Production gating can be covered by existing dev-link helper tests plus `npm run build` if a full production browser test is too expensive.

Edge cases:

- If browser-level visibility is hard to assert through stable selectors, add the smallest reasonable test hook and document why.

Expected artifact or code change:

- Updated unit/browser tests.

### Requirement 5: Handoff report

Required behavior:

- Create the Plan 22 progress report.
- List files changed.
- List commands run.
- Note whether Plan 06 prompt/context files needed edits.
- Note any residual risk for Gemini/browser-agent Blockly dragging.
- Note whether `docs/subsystems/blockly-workspace.md` still reads true or was updated.

Constraints:

- Do not claim Plan 06 has been completed or playtested.
- Do not include production deployment steps.

Expected artifact or code change:

- `reports/development/plan-22-dev-guided-blockly-assist/progress.md`.

## Work Plan

1. Inspect current dev-guided shortcut state, Blockly injection/load paths, and relevant tests.
2. Implement the smallest dev-only assist tied to valid `devGuidedLevel` activation.
3. Add focused unit and browser coverage.
4. Review Plan 06 Gemini prompt/instruction files for stale directions and make minimal compatibility edits only if needed.
5. Run targeted validation, then broader validation required by this packet.
6. Write the progress report with commands, remaining risks, and any prompt/doc changes.

## Commands

Run from the repository root:

```powershell
npm test
npm run build
npm run test:browser
```

Targeted unit or Playwright tests may be run first, but the final report should list the validation actually completed.

## Validation Checklist

- [ ] Valid local-dev `devGuidedLevel` activates Blockly assist.
- [ ] Missing or invalid `devGuidedLevel` does not activate Blockly assist.
- [ ] Production build ignores the shortcut/assist path.
- [ ] First available toolbox category opens by default in assisted startup.
- [ ] `On Each Turn` is visible to the right of the open drawer in assisted startup.
- [ ] Normal app entry keeps existing Blockly startup behavior.
- [ ] Free Play keeps existing Blockly startup behavior.
- [ ] Existing Blockly semantics and one-action-per-turn behavior are unchanged.
- [ ] Existing workspace persistence/reset/project-shared behavior is preserved.
- [ ] Plan 06 Gemini prompt/instruction files were reviewed for stale assisted-UI blockers.
- [ ] Any Plan 06 prompt/context edits are minimal and do not pre-fill playtest findings.
- [ ] Targeted unit/browser tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes, or any failure is documented with owner review.
- [ ] No dependency, GitHub workflow, deployment, or production action was taken.
- [ ] No unrelated files were changed.
- [ ] If `docs/subsystems/blockly-workspace.md` behavior changed, the note still reads true post-change.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report if:

- Implementing the assist requires broad rewrites of Blockly workspace lifecycle, guided progression, or mode state.
- The only viable implementation changes normal student-facing Blockly startup behavior.
- The assist would be visible in production/static builds.
- The assist requires changing Blockly semantics, block availability, toolbox policy, or game rules.
- Existing saved/project workspaces would be unexpectedly relocated or rewritten.
- Browser tests cannot observe the behavior without adding broad or misleading test hooks.
- Plan 06 prompt/context compatibility review reveals a bigger playtest-methodology issue.
- Validation fails in a way that changes the packet scope.
- A dependency, workflow, deployment, or production choice appears necessary.
- A UI or Blockly behavior could mislead students about game rules or boolean semantics.
- The packet would invalidate a statement in `docs/subsystems/*.md` and the corrected wording requires pedagogy, architecture, or contract judgment beyond this packet.
