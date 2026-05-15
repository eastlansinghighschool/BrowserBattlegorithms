# Plan 25: Slow-Speed Blockly Trace

## Packet Metadata

- Packet id: plan-25
- Packet title: Slow-Speed Blockly Trace
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: implementation / frontend / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - configurable speed-threshold setting for Blockly trace playback
  - Blockly evaluation trace collection that records checked conditions, branch outcomes, and the selected action block
  - slow-speed pre-action visual highlighting for the active Blockly-controlled runner
  - focused unit tests for trace collection and turn semantics
  - Playwright coverage proving the highlight appears at low speed, does not appear above threshold, and does not step on core UI controls
  - subsystem note updates for Blockly execution/turn timing contracts
  - progress report
- Progress report folder: `reports/development/plan-25-slow-speed-blockly-trace/`
- Progress report file: `reports/development/plan-25-slow-speed-blockly-trace/progress.md`

## Packet Summary

Goal: Add an educational Blockly tracing mode that automatically activates at slow game speeds. When the speed is at or below a configurable threshold, the app should briefly highlight the blocks and conditions evaluated for the active ally before the chosen action resolves.

Non-goals:

- Do not build a full debugger, replay timeline, trace panel, step button, or code-quality analyzer.
- Do not change which action a Blockly program chooses.
- Do not change one-action-per-turn semantics.
- Do not trace human-controlled keyboard decisions.
- Do not trace NPC/free-play CPU internals.
- Do not add a new student-facing settings panel unless it is clearly smaller and safer than a central config constant.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Current Blockly interpreter in `src/ai/blockly/workspace.js`.
- Current turn engine in `src/core/turnEngine.js`.
- Current speed slider and `animationSpeedFactor` mapping in `src/ui/controls.js`.

Blocks:

- Classroom use of slow-speed runs for explicit code tracing practice.
- Better Plan 06 diagnosis of whether browser-agent and student programs fail because of condition logic vs board movement.

Why this packet exists:

Students often see the runner move but do not know which condition was checked, which branch fired, or why a later block was ignored. Code.org-style execution highlighting makes the runtime path visible. This directly supports AP CSA trace-reading, conditional reasoning, and the app's one-action-per-turn learning model.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `playwright.config.js`
  - `src/ai/blockly/workspace.js`
  - `src/core/turnEngine.js`
  - `src/ui/controls.js`
  - `src/assets/styles/style.css`
  - `tests/unit/`
  - `tests/browser/`
- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/turn-engine.md`
  - `docs/subsystems/p5-surface-map.md`
  - `docs/subsystems/ui-mode-contract.md`

Required product contracts:

- Blockly programs still choose exactly one first reached action per ally turn.
- The trace is explanatory UI only; it must not alter action choice, collision outcomes, scoring, level completion, persistence, import/export, undo/redo, or project workspace behavior.
- Guided mode, Free Play PvCPU, and Free Play PvP must remain usable.
- The app remains static Vite output.
- The feature must be testable without drag-and-drop Blockly automation.

Do not redefine:

- The Blockly block set.
- The action-selection model.
- The speed slider's basic purpose.
- Free Play CPU behavior.
- Usage/export file formats unless a minimal event is explicitly required and approved.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/interpreter.js`
- `src/core/turnEngine.js`
- `src/core/state.js`
- `src/ui/controls.js`
- `src/render/p5App.js`
- `src/assets/styles/style.css`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/movement-and-collisions.test.js`
- `tests/browser/guided-ui.spec.js`
- `tests/browser/free-play.spec.js`

Use `rg "getFirstRunnableAction|resolveFirstRunnableAction|evaluateBlocklyBooleanValue|evaluateCondition|animationSpeedFactor|speedSlider|processTurnActions|highlightBlock|runnerActionHistory"` from the repository root if names have moved.

Optional/contextual:

- `docs/development/future-directions-analysis/gemini.md`
- `docs/development/future-directions-analysis/claude.md`
- `tests/unit/helpers/testHarness.js`
- `tests/browser/dev-guided-level-link.spec.js`

## Scope

### In scope

- Add a single named configurable threshold for trace activation.
  - Start with the owner-suggested default around `0.5` animation speed factor.
  - Keep the value easy to experiment with, such as an exported config constant and/or state field initialized from that constant.
  - Avoid hardcoded threshold literals scattered across files.
- Collect Blockly evaluation traces for visible Blockly-controlled runner turns.
- Highlight checked condition blocks and the final selected action block before the action resolves when speed is at or below the threshold.
- Show enough visual distinction that students can tell:
  - which block is currently being checked
  - whether a condition evaluated true or false, if feasible in the first pass
  - which final action was selected
- Clear highlights after trace playback, reset, level switch, workspace reload, undo/redo, and when speed rises above threshold.
- Add unit and browser tests.
- Update subsystem notes where trace behavior changes existing contracts.
- Write the Plan 25 progress report.

### Files and areas likely touched

- `src/config/constants.js` or another central config module
- `src/core/state.js`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/interpreter.js`
- `src/core/turnEngine.js`
- `src/ui/controls.js`
- `src/assets/styles/style.css`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/movement-and-collisions.test.js` or a new focused turn-engine test
- `tests/browser/guided-ui.spec.js` or a new focused browser spec
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- Possibly `docs/subsystems/p5-surface-map.md` or `docs/subsystems/ui-mode-contract.md`
- `reports/development/plan-25-slow-speed-blockly-trace/progress.md`

### Out of scope

- New Blockly blocks.
- A trace history panel.
- Student-facing threshold controls beyond the existing speed slider behavior.
- A separate debug mode toggle unless the implementer discovers a clear safety reason and reports it.
- Highlighting hidden PvP team workspaces while their tab is not visible.
- Tracing NPC/free-play CPU internals.
- Usage analytics schema changes.
- Dependency installs.
- GitHub workflow edits.
- Deployment or production action.

## Work Plan

1. Inspect the current Blockly action-selection recursion and turn-engine state transitions.
2. Add trace collection in the smallest way that preserves existing `getFirstRunnableAction()` behavior for callers that do not need traces.
3. Add trace playback state and a pre-action pause path only when trace is enabled by speed threshold.
4. Add visual highlighting and cleanup.
5. Add focused unit tests for trace collection and unchanged action semantics.
6. Add Playwright tests for low-speed/high-speed behavior and UI safety.
7. Update subsystem notes.
8. Run validation and write the progress report.

## Implementation Requirements

### Requirement 1: Configurable trace threshold

Required behavior:

- Trace mode activates when `app.state.animationSpeedFactor` is at or below a single configured threshold.
- The threshold starts around `0.5`.
- The threshold is easy for the integration owner to adjust later.

Constraints:

- Do not tie the threshold to raw slider values in multiple places; use animation speed factor or a clearly named conversion helper.
- Keep the default behavior understandable: slower speed means more visible tracing.
- Avoid adding a new visible setting unless absolutely necessary.

Edge cases:

- If the speed changes while a trace is pending, do not leave stale highlights behind.
- If the threshold is set to `0` or a very low value, the feature should effectively stay off without breaking action selection.

Expected artifact or code change:

- A named config value and a helper/state path for determining whether trace playback is active.

### Requirement 2: Trace collection without semantic changes

Required behavior:

- Blockly action selection can produce a trace containing:
  - the evaluated block id
  - block type
  - trace step kind, such as condition, boolean value, branch, or action
  - condition/boolean result where applicable
  - runner id/team if useful for debugging and tests
- Existing callers that only need the selected action still receive the same action as before.

Constraints:

- Preserve short-circuit semantics for `AND` and `OR`.
- Preserve value comparison and number/value block behavior.
- Preserve first reached action behavior.
- Do not evaluate conditions more times than before just to collect trace.
- Do not mutate Blockly XML or saved workspaces.

Edge cases:

- Empty event block should produce no action and no visual crash.
- Missing branch blocks should still be traceable without throwing.
- Hidden PvP workspace execution should not try to highlight blocks that are not in the visible workspace.

Expected artifact or code change:

- A helper such as `getFirstRunnableActionWithTrace()` or an optional trace collector passed through the existing resolver.

### Requirement 3: Pre-action trace playback

Required behavior:

- At or below the trace threshold, when a visible Blockly-controlled runner is about to act, the app pauses briefly before resolving the chosen action.
- During that pause, it highlights the relevant Blockly path in order.
- After trace playback completes, the already-selected action resolves through the normal turn engine.

Constraints:

- The trace pause must not change the chosen action.
- The pause must not consume an extra turn.
- The pause must not affect human input turns or NPC turns.
- Keep timing short enough for classroom usability.
- Scale playback duration sensibly with speed or use a small constant derived from the threshold design.

Edge cases:

- If the level is reset, mode changes, or game stops during trace playback, cancel the trace and clear highlights.
- If the highlighted block is deleted by a workspace edit while paused, clear safely and continue/cancel without throwing.
- If no trace steps exist, proceed normally.

Expected artifact or code change:

- Turn-engine or UI state that can represent "Blockly trace pre-action pause" without broad turn-state churn.

### Requirement 4: Visual highlighting

Required behavior:

- The current trace block is visually highlighted in the Blockly workspace.
- Condition result should be visually distinguishable as true/false if feasible in the first pass.
- The final selected action block should be highlighted clearly.
- Highlights clear after playback.

Constraints:

- Prefer Blockly-supported APIs such as `workspace.highlightBlock(blockId)` when suitable.
- If custom CSS classes are needed for true/false/action states, keep them scoped and remove them reliably.
- Do not conflict with existing ignored-block warning styling.
- Do not make blocks look disabled when they are merely being traced.

Accessibility:

- Do not rely on color alone if adding true/false distinctions; consider label text, status text, or CSS shape/outline differences where lightweight.
- Respect reduced-motion expectations where practical. If motion is reduced, keep a static highlight or shorter/no animation rather than hiding the trace entirely.

Expected artifact or code change:

- Minimal CSS/Blockly UI integration for trace highlighting.

### Requirement 5: Tests

Required behavior:

- Unit tests prove:
  - trace collection records condition checks and the selected action
  - true and false branches are represented
  - action selection remains unchanged with tracing enabled or disabled
  - short-circuit boolean behavior is not changed
- Browser tests prove:
  - at low speed, a Blockly block receives a visible trace highlight before the runner action resolves
  - above threshold, no trace pause/highlight occurs
  - normal guided controls remain usable after trace playback
  - reset or level switch clears trace highlight

Constraints:

- Do not use brittle drag-and-drop to build test programs; use existing test hooks/import XML paths.
- Keep Playwright waits based on observable states/classes/hooks, not arbitrary long sleeps.
- If a new test hook is needed, keep it narrow and dev/test-oriented.

Expected artifact or code change:

- Focused unit and Playwright tests for the feature.

### Requirement 6: Documentation and contracts

Required behavior:

- Update `docs/subsystems/blockly-workspace.md` to describe trace collection/highlighting and how it differs from ignored-block warnings.
- Update `docs/subsystems/turn-engine.md` if a pre-action trace pause becomes part of the turn timing contract.
- Update `docs/subsystems/p5-surface-map.md` or `docs/subsystems/ui-mode-contract.md` only if the implementation materially changes their described surfaces.

Constraints:

- Keep docs narrow.
- Do not overpromise a full debugger.
- Make clear that trace is visual/explanatory and does not alter program semantics.

Expected artifact or code change:

- Subsystem notes remain true after the change.

## Model-Specific Instructions

- Start by summarizing the intended MVP: slow-speed pre-action Blockly path highlighting, not a full debugger.
- Prefer a narrow trace collector plus playback queue over broad rewrites.
- Do not add async sleeps inside pure interpreter functions.
- Do not make Playwright tests depend on exact animation milliseconds if a test hook or CSS class can prove state directly.
- Stop and report if preserving action semantics requires a large turn-engine rewrite.
- Stop and report if Blockly highlighting APIs are insufficient and a custom SVG/CSS approach would risk warning-state or accessibility regressions.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-interpreter.test.js tests/unit/movement-and-collisions.test.js
npm test
npm run build
npm run test:browser
```

If browser validation is expensive while iterating, run the focused spec first, then `npm run test:browser` before final handoff.

## Validation Checklist

- [ ] Trace threshold is a named configurable value.
- [ ] Trace activates at or below the configured speed threshold.
- [ ] Trace does not activate above the threshold.
- [ ] Blockly action selection is unchanged with tracing enabled.
- [ ] Trace records condition checks and selected action blocks.
- [ ] Trace preserves boolean short-circuit behavior.
- [ ] Slow-speed trace highlights blocks before action resolution.
- [ ] Highlights clear after playback.
- [ ] Highlights clear on reset, level switch, mode switch, and workspace reload.
- [ ] Human turns and NPC turns are not traced.
- [ ] Hidden PvP team workspace execution does not throw or try to highlight invisible blocks.
- [ ] Existing ignored-block warnings still work.
- [ ] Targeted unit tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes.
- [ ] Relevant subsystem notes still read true.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run, threshold location, and remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- A correct pre-action trace requires broad turn-engine restructuring.
- The trace changes the action selected by any existing Blockly program.
- The feature conflicts with Blockly warning/disabled state in a way that could mislead students.
- Playwright cannot observe the feature without fragile sleeps and no stable hook/class can be added safely.
- The implementation requires dependency installs.
- The implementation would require changing usage/export schemas.
- The implementation would require production deployment or repository settings changes.
