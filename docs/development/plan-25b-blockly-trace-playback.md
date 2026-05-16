# Plan 25b: Blockly Trace Playback (UI)

## Packet Metadata

- Packet id: plan-25b
- Packet title: Blockly Trace Playback (UI)
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: implementation / frontend / testing / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none for implementation — pedagogy/UX decisions are recorded inline below
- Expected artifacts:
  - new turn state for pre-action trace playback, advanced per frame
  - Blockly block highlighting and true/false visual treatment
  - cleanup on reset, level switch, mode switch, workspace reload, game-over, and threshold-crossing
  - focused unit tests for new turn-state transitions
  - Playwright coverage proving the highlight appears at low speed, does not appear above threshold, and does not break normal controls
  - subsystem note updates for `turn-engine.md` and `blockly-workspace.md`
  - progress report
- Progress report folder: `reports/development/plan-25b-blockly-trace-playback/`
- Progress report file: `reports/development/plan-25b-blockly-trace-playback/progress.md`

## Packet Summary

Goal: Render the Blockly evaluation trace collected by Plan 25a as a brief pre-action visual highlight in the Blockly workspace, gated by the same speed threshold. The student sees which conditions were checked, whether they were true or false, and which final action was selected, before the runner animation begins. The trace is explanatory UI only and does not alter program semantics.

Non-goals:

- Do not change the trace data shape produced by Plan 25a.
- Do not change which action a Blockly program chooses.
- Do not change one-action-per-turn semantics.
- Do not build a full debugger, replay timeline, trace panel, or step button.
- Do not add a student-facing settings panel.
- Do not trace human-controlled keyboard decisions, NPCs, or free-play CPU runners.
- Do not render trace state in the demo Blockly panel.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Plan 25a complete and merged. Specifically:
  - `BLOCKLY_TRACE_SPEED_THRESHOLD` constant.
  - `isBlocklyTraceCollectionActive(state)` helper.
  - `getFirstRunnableActionWithTrace(app, runner)` returning `{ action, trace }`.
  - Trace step shape with `kind`, `result`, `numericLeft`/`numericRight`, `blockId`.
- Current turn engine in `src/core/turnEngine.js` (`processTurnActions`, `TURN_STATES`).
- Current Blockly workspace in `src/ai/blockly/workspace.js` (warning/disabled lifecycle, `hideChaff`).
- Current speed slider and `animationSpeedFactor` mapping in `src/ui/controls.js` (read-only).

Blocks:

- Classroom use of slow-speed runs for explicit code tracing practice.
- Plan 06 student-program diagnosis: seeing the actual evaluated path is the missing link between "the runner moved wrong" and "the condition I wrote was false."

Why this packet exists:

Plan 25a gives the runtime path data; Plan 25b makes it legible to students. Code.org-style execution highlighting is a well-understood teaching pattern for boolean reasoning and conditional control flow, and matches the AP CSA trace-reading skill the campaign already builds toward. The risk concentrated in this packet is real (turn-engine state machine, Blockly visual API, accessibility, animation timing, classroom usability bounds), which is why it is split out from collection.

## Recorded Decisions

Integration owner accepted all four recommendations on 2026-05-15.

### Decision 1: Trace content to render — **Full evaluated path**

Playback walks every step the resolver visited, in the order the resolver visited them: conditions that returned false (and were therefore skipped over by the resolver), the eventually chosen condition path, and the final selected action. Short-circuited boolean operands are not in the trace (Plan 25a already enforces this at collection time) and therefore not in playback. This matches AP CSA trace-reading practice and explains *why the runner did not do the other thing*.

### Decision 2: True/false visual treatment — **Thick outline + inline glyph + redundant color**

Condition results are visually distinguished by three channels at once so the signal survives color-blindness, projector washout, and reduced-motion:

- **Outline:** a thicker SVG outline around the condition block while it is the current trace step, kept slightly thinner once the step has passed.
- **Glyph:** a small inline adornment next to the condition block — a check mark for `true`, a cross for `false`. Glyph stays visible for the rest of the trace playback so students can read the whole evaluated path at once.
- **Color:** green for `true`, red for `false`, used as a redundant signal not the primary one.

The selected action block gets its own treatment — a distinct outline/highlight (no true/false glyph, since it is not a condition).

### Decision 3: Empty-program / no-action-selected UX — **Workspace-edge hint at low speed only**

When the resolver returns no action and the trace ends in an `"empty"` step, a brief non-blocking message appears at the edge of the Blockly workspace: "No action selected this turn — your conditions all evaluated false, or your program has no action blocks." The hint:

- appears only when `isBlocklyTraceCollectionActive(state)` is true (i.e. at or below the speed threshold);
- is shown for the duration of the empty trace step plus a brief tail, then fades out;
- does not block input or interrupt the turn flow;
- is cleared on the same cleanup paths as the rest of the trace playback;
- does not appear for human turns, NPC turns, or hidden PvP team workspaces.

The runner still falls back to `STAY_STILL` as before. This packet does not change the silent above-threshold behavior.

### Decision 4: Cost cap — **6 steps / ~1.5s equivalent / truncate with "…" badge on the event block**

- `BLOCKLY_TRACE_MAX_STEPS = 6`
- `BLOCKLY_TRACE_MAX_DURATION_FRAMES` chosen so that a full 6-step trace at the threshold speed factor plays in roughly 1.5 seconds of wall time. Implementation derives this from the same `animationSpeedFactor` clock used by `Runner.updateAnimation` so trace and runner animation breathe at the same rate.
- Overflow: if the collected trace has more steps than the cap, playback renders the first `BLOCKLY_TRACE_MAX_STEPS - 1` steps plus the final `"action"` (or `"empty"`) step. The event block receives a small "…" badge for the duration of playback to signal that intermediate steps were elided. The badge clears with the rest of trace state.
- Always show the action step (or empty step). Never truncate the final outcome.

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
  - `src/ai/blockly/interpreter.js`
  - `src/core/turnEngine.js`
  - `src/core/state.js`
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

- The action selected by the resolver in Plan 25a is the action that resolves through the engine. Playback never re-evaluates the program or changes the action.
- The trace pause is part of the turn but does not consume an additional turn, does not skip the runner, and does not change collision/scoring/level-completion outcomes.
- Guided mode, Free Play PvCPU, and Free Play PvP must remain usable. Demo Blockly is never traced.
- The app remains static Vite output.
- Playback must be testable without drag-and-drop Blockly automation.

Do not redefine:

- Trace data shape from Plan 25a.
- Action-selection model.
- Speed slider's basic purpose or `animationSpeedFactor` mapping.
- Free Play CPU behavior.
- Usage/export file formats.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/development/plan-25a-blockly-trace-collection.md`
- `src/core/turnEngine.js`
- `src/core/state.js`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/interpreter.js`
- `src/ui/controls.js`
- `src/render/p5App.js`
- `src/assets/styles/style.css`
- `tests/unit/movement-and-collisions.test.js`
- `tests/browser/guided-ui.spec.js`
- `tests/browser/free-play.spec.js`

Use `rg "processTurnActions|TURN_STATES|currentTurnState|queuedActionForCurrentRunner|animationSpeedFactor|highlightBlock|hideChaff|setWarningText|setBlocklyEditable"` from the repository root if symbol names have moved.

Optional/contextual:

- `tests/browser/dev-guided-level-link.spec.js`
- `docs/subsystems/usage-and-admin.md` (only to confirm usage tracker is not impacted)

## Scope

### In scope

- A new turn state (working name `TRACING_PRE_ACTION`) that sits between action planning and action execution.
- Per-frame playback advanced inside `processTurnActions`, using a frame counter scaled by `animationSpeedFactor` for consistency with `Runner.updateAnimation`. No `setTimeout`/`setInterval`/`Promise`-based delays.
- Block highlighting via `workspace.highlightBlock(blockId)` plus a small set of CSS classes for true/false condition results and the selected action.
- `Blockly.hideChaff()` on trace start to dismiss any open warning bubbles or context menus that would co-render with the highlight.
- Cleanup paths: trace state and DOM highlights cleared on level reset, level switch, mode switch, workspace reload, game-over, threshold crossing (speed raised above threshold mid-trace), and PvP team tab switch.
- Threshold-crossing rule: if `animationSpeedFactor` rises above `BLOCKLY_TRACE_SPEED_THRESHOLD` mid-playback, remaining trace steps are dropped immediately, the queued action resolves this same turn, the trace is not retried.
- Demo Blockly is never traced. The visible PvP inactive-team workspace is never traced (Plan 25a already prevents collection on that path).
- Empty-program / no-action UX implementing Decision 3.
- Cost cap implementing Decision 4.
- Observable hooks for tests:
  - `state.currentTurnState === TURN_STATES.TRACING_PRE_ACTION` (or the agreed name).
  - A deterministic CSS class on the highlighted block's SVG element, suggested `bba-trace-current` for the in-progress step and `bba-trace-result-true` / `bba-trace-result-false` / `bba-trace-selected-action` for kind-specific styling.
  - Optional `state.traceStepIndex` for sequencing.
- Unit tests for the new turn-state transitions and threshold-crossing flush.
- Playwright tests for low-speed visible highlight, above-threshold no-highlight, normal controls after playback, and cleanup on reset/level switch.
- Subsystem note updates.
- Plan 25b progress report.

### Files and areas likely touched

- `src/config/constants.js` — possible new `TURN_STATES.TRACING_PRE_ACTION`, cost-cap constants from Decision 4.
- `src/core/state.js` — trace playback state fields (current trace, step index, frame counter).
- `src/core/turnEngine.js` — new turn-state branch in `processTurnActions`; transition wiring around `planActionForActiveRunner`.
- `src/ai/blockly/interpreter.js` or a new `src/ai/blockly/traceRenderer.js` — DOM/Blockly highlight application and cleanup.
- `src/ai/blockly/workspace.js` — cleanup hooks on reset/load/team-switch paths.
- `src/assets/styles/style.css` — CSS classes for true/false and selected-action visuals.
- `src/ui/controls.js` — speed-slider listener may need to fire a cleanup callback when speed crosses the threshold upward.
- `tests/unit/` — turn-engine transition tests (new file or extension).
- `tests/browser/` — Playwright spec (new file likely cleaner than extending an existing one).
- `docs/subsystems/turn-engine.md` — Turn resolution order gains the pre-action trace step; cleanup invariants noted.
- `docs/subsystems/blockly-workspace.md` — trace highlight described as a third UI signal alongside disabled-reason and warning bubbles.
- `reports/development/plan-25b-blockly-trace-playback/progress.md` — progress report.

### Out of scope

- New Blockly blocks.
- Changes to Plan 25a's trace data shape.
- A trace history panel, replay timeline, or step button.
- Student-facing threshold controls beyond the existing speed slider.
- Highlighting hidden PvP team workspaces.
- Tracing NPC/free-play CPU internals.
- Usage analytics schema changes.
- Dependency installs, workflow edits, deployment.

## Work Plan

1. Re-read Plan 25a's `getFirstRunnableActionWithTrace` to confirm the trace shape; re-read `processTurnActions` and `TURN_STATES`.
2. Add the new turn state and trace playback state fields.
3. Wire the planning step in `processTurnActions` to call `getFirstRunnableActionWithTrace` when `isBlocklyTraceCollectionActive(state)` is true and the runner is the active Blockly-controlled runner on the visible workspace.
4. Implement per-frame trace playback as a new branch in `processTurnActions`, advancing a step counter against a frame budget derived from `animationSpeedFactor` and the cost-cap constants.
5. Implement block highlighting and CSS classes; ensure `hideChaff()` is called on trace start.
6. Implement cleanup hooks on reset, level switch, mode switch, workspace reload, game-over, threshold crossing, and PvP team tab switch.
7. Implement the empty-program / no-action UX from Decision 3.
8. Implement the cost cap and overflow indicator from Decision 4.
9. Add unit tests for turn-state transitions and threshold-crossing flush.
10. Add Playwright tests for visible/no-visible highlight and cleanup.
11. Update `docs/subsystems/turn-engine.md` and `docs/subsystems/blockly-workspace.md`.
12. Run validation. Write the progress report.

## Implementation Requirements

### Requirement 1: Turn state and per-frame playback

Required behavior:

- Add a new turn state `TURN_STATES.TRACING_PRE_ACTION` (or an equivalent, clearly named constant in the same module as the existing turn states).
- Modify `processTurnActions` in `src/core/turnEngine.js` so the runner-planning step for a Blockly-controlled, non-human, non-frozen, visible-workspace runner branches as follows when `isBlocklyTraceCollectionActive(state)` is true:
  1. Call `getFirstRunnableActionWithTrace(app, runner)`.
  2. Queue the returned `action` exactly as the existing planner does today.
  3. Stash the returned `trace` on `state` (e.g. `state.activeBlocklyTrace = { steps, runnerId, runnerTeam, levelId, turnNumber }`) and initialize playback bookkeeping (current step index, frame counter, max-steps badge flag from Decision 4).
  4. Transition the turn state to `TRACING_PRE_ACTION` instead of `PROCESSING_ACTION`.
  5. Call `Blockly.hideChaff()` once on transition into `TRACING_PRE_ACTION` so any open warning bubbles do not co-render with the highlight.
- While the turn state is `TRACING_PRE_ACTION`, each `processTurnActions` invocation advances the per-frame counter for the current trace step. When the counter exceeds the step's frame budget, move to the next step. When the final rendered step finishes, transition to `PROCESSING_ACTION` and let the existing execution path resolve the already-queued action.
- The frame budget per step is derived from `animationSpeedFactor` using the same scaling pattern as `Runner.updateAnimation`. Provide a single helper, e.g. `getBlocklyTraceFrameBudgetPerStep(state)`, so the budget is computed in one place. Total playback for a maximum-length trace at the threshold speed factor should be roughly 1.5 seconds of wall time per Decision 4.
- The `TRACING_PRE_ACTION` branch must never call the resolver, never re-evaluate conditions, and never mutate the queued action.

Constraints:

- No `setTimeout`, `setInterval`, `requestAnimationFrame`-driven side channels, or `Promise`-based delays for the pause. Per-frame state machine only, advanced by `processTurnActions`.
- The pause must not consume an additional turn, skip the runner, or change collision/scoring/level-completion outcomes.
- The pause must not affect human input turns, NPC turns, or hidden PvP team execution. For those runners the existing `AWAITING_INPUT` → `PROCESSING_ACTION` path is used unchanged.
- When `animationSpeedFactor === 0` (paused), the per-frame counter does not advance; trace playback freezes alongside runner animation. Resuming the slider above `0` (still at or below the threshold) resumes from the current step.
- Threshold crossing mid-playback (slider raised above `BLOCKLY_TRACE_SPEED_THRESHOLD` while `TRACING_PRE_ACTION` is active): drop remaining trace steps immediately, clear all highlight DOM/CSS, transition straight to `PROCESSING_ACTION`, and let the queued action resolve this same turn. Do not retry the trace later. The action choice does not change.
- Game-over, reset, level switch, mode switch, workspace reload, and PvP team tab switch while in `TRACING_PRE_ACTION` must drop trace state and clear highlights before the engine performs its own state transition. See Requirement 3.

Edge cases:

- If `getFirstRunnableActionWithTrace` returns an empty trace (defensive — should not happen for the visible-workspace path), skip `TRACING_PRE_ACTION` and go directly to `PROCESSING_ACTION`.
- If the trace contains only an `"action"` step, render only that one step; no condition replay.
- If the trace ends in an `"empty"` step, render the empty step using the Decision 3 workspace-edge hint, then transition to `PROCESSING_ACTION` so the runner's `STAY_STILL` fallback executes through the normal pipeline.
- If a back-to-back ally turn begins immediately after a trace ends, trace state must be cleared between the two turns so the new trace starts at step index `0`.

Expected artifacts:

- New turn-state constant.
- `state` fields for trace playback bookkeeping, all reset by the same cleanup helper used in Requirement 3.
- New branch in `processTurnActions`.
- `getBlocklyTraceFrameBudgetPerStep(state)` helper alongside the existing `animationSpeedFactor` consumers.

### Requirement 2: Block highlighting and visual treatment

Required behavior:

- For each rendered trace step, the corresponding Blockly block receives:
  - `workspace.highlightBlock(blockId)` for the in-progress step, cleared when the step ends.
  - A CSS class on the block's SVG element. The class set is:
    - `bba-trace-current` while the step is the in-progress step.
    - `bba-trace-result-true` for `condition` / `boolean` / `comparison` steps with `result: true`.
    - `bba-trace-result-false` for the same kinds with `result: false`.
    - `bba-trace-selected-action` for the final `action` step.
  - The result classes stay applied for the remainder of trace playback (so students see the whole evaluated path at once), and are cleared together at the end of playback / on any cleanup path.
- The `…` overflow badge from Decision 4 is rendered on the `On Each Turn` event block when the collected trace exceeded `BLOCKLY_TRACE_MAX_STEPS`. Use a CSS class such as `bba-trace-overflow-badge` applied to the event block's SVG. Badge is cleared with the rest of trace state.
- CSS in `src/assets/styles/style.css` provides the visual treatment from Decision 2: thicker outline for `bba-trace-current`, redundant green outline for `bba-trace-result-true`, redundant red outline for `bba-trace-result-false`, and a distinct selected-action outline for `bba-trace-selected-action`. The check / cross glyph for true / false is rendered as a small `::after` adornment or inline SVG attached to the block's outer SVG group, sized to remain visible on classroom projectors but small enough to avoid overlapping adjacent blocks.

Constraints:

- Color is never the sole signal. Outline weight + glyph are required for the true/false distinction; color is redundant.
- The trace highlight must visually differ from the existing ignored-block warning state (the disabled-reason styling owned by the workspace scanner). Pick CSS class names and colors that do not collide with the warning icon, the disabled-block dimming, or the existing ignored-block outline.
- Do not call `setWarningText` or `setDisabledReason` from playback code. Those are owned by the execution-hint scanner and must not be repurposed for trace display.
- `Blockly.hideChaff()` is called once when entering `TRACING_PRE_ACTION` (Requirement 1) so open warning bubbles do not co-render. Do not call `hideChaff` repeatedly per step.
- Demo Blockly is never traced — the playback code path runs only for the live student workspace bound to `app.blocklyWorkspace`, never for any demo panel instance.
- Reduced motion: if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, the per-step frame budget is still honored but Blockly's native `highlightBlock` animation pulse is suppressed where feasible — either by applying a static-highlight CSS class instead of the animated one, or by reducing the frame budget's pulse cycles. Static outline + glyph + color are sufficient on their own.
- Hidden PvP team workspace runners never reach this code path (Plan 25a does not collect traces for them, and the visible-workspace gate in Requirement 1 excludes them).

Edge cases:

- If the highlighted block no longer exists at the moment playback tries to apply CSS (e.g. workspace was reloaded between decision and playback, even though editability should be locked during running), skip that step's highlight without throwing and continue to the next step.
- If two consecutive trace steps refer to the same block id (shouldn't happen for distinct steps, but defensively), the second step's `bba-trace-current` replaces the first's without flicker.
- Selected-action step must always be highlighted, even if the trace was truncated by the cost cap.

Expected artifacts:

- A small `traceRenderer` module (e.g. `src/ai/blockly/traceRenderer.js`) exporting `applyTraceStep(workspace, step)`, `clearTraceStepCurrent(workspace, step)`, and `clearAllTraceClasses(workspace)`. Keeping renderer concerns out of `processTurnActions` keeps the turn-engine change small.
- CSS classes and rules in `src/assets/styles/style.css`.

### Requirement 3: Cleanup

Required behavior:

- A single `clearBlocklyTracePlayback(app)` helper is responsible for:
  - clearing `state.activeBlocklyTrace`, step index, frame counter, and overflow-badge flag;
  - calling `clearAllTraceClasses(app.blocklyWorkspace)` from Requirement 2;
  - clearing the workspace-edge empty-program hint (Requirement 4) if visible;
  - calling `workspace.highlightBlock(null)` to drop any in-progress Blockly highlight;
  - leaving the queued action and turn state alone — cleanup is about *trace presentation*, not about cancelling the action.
- `clearBlocklyTracePlayback(app)` is called from every cleanup path that today drops or replaces workspace/runner state:
  - level reset
  - level switch
  - mode switch (guided ↔ free play)
  - workspace reload (`loadWorkspaceXml` and friends)
  - game-over transition
  - PvP team tab switch (`switchActiveBlocklyTeamTab`)
  - threshold-crossing upward in the speed-slider listener (Requirement 1)
- If cleanup is called while turn state is `TRACING_PRE_ACTION`, the caller is responsible for also transitioning the turn state appropriately (the engine's existing reset/level-switch paths already handle this). Cleanup itself does not mutate `currentTurnState`.

Constraints:

- No code path may leak CSS classes or stale `state.activeBlocklyTrace` data between turns, runners, levels, or modes.
- Cleanup must be idempotent — calling it twice in a row is a no-op the second time.
- Cleanup must not throw if `app.blocklyWorkspace` is `null` or the workspace has already been disposed.

Edge cases:

- Cleanup called from inside `processTurnActions` (e.g. threshold-crossing branch) must complete before the engine continues the same tick.
- Cleanup at game-over must run before the end-state overlay renders, so the overlay does not show through a stale highlight.
- A frozen runner whose turn is currently in `TRACING_PRE_ACTION` (shouldn't happen — frozen runners skip planning — but defensively) is handled by cleanup as if the trace ended.

Expected artifact:

- `clearBlocklyTracePlayback(app)` helper, called from each named site. Listed call sites must be enumerated in the progress report.

### Requirement 4: Empty-program / no-action-selected UX

Required behavior:

- When the trace's terminal step has `kind === "empty"`, playback renders the empty step by:
  - showing a non-blocking message at the edge of the Blockly workspace with text "No action selected this turn — your conditions all evaluated false, or your program has no action blocks.";
  - applying no block-level CSS highlight for the empty step (the event block does not get `bba-trace-current` for the empty case);
  - using the same per-step frame budget as other steps, so the hint is visible for a perceivable but brief moment;
  - clearing the hint on the same cleanup paths as the rest of trace playback (Requirement 3).
- The hint is shown only when `isBlocklyTraceCollectionActive(state)` is true. Above the threshold the existing silent `STAY_STILL` fallback is unchanged.
- The hint is never shown for human turns, NPC turns, or hidden PvP team execution.

Constraints:

- The hint must not block input, intercept clicks, or interrupt the turn flow.
- The hint must not overlap critical Blockly controls (toolbox, trashcan, zoom). Position at a clearly empty edge of the workspace area, e.g. top of the workspace panel.
- Use a single CSS class (e.g. `bba-trace-empty-hint`) on a small DOM node that is created lazily and reused; do not append/remove nodes every turn.

Edge cases:

- If the trace was truncated by the cost cap and the terminal step happened to be `"empty"`, still render the hint (the empty terminal is preserved per Decision 4: "always show the action step (or empty step)").
- If a workspace edit somehow happens during the empty-step display (workspace should be locked during running), clear the hint on the next cleanup invocation.

Expected artifact:

- Hint DOM node + CSS class + show/hide functions; integrated with the trace renderer.

### Requirement 5: Cost cap and overflow

Required behavior:

- Define and export the constants:
  - `BLOCKLY_TRACE_MAX_STEPS = 6`
  - `BLOCKLY_TRACE_MAX_DURATION_FRAMES` chosen so a 6-step playback at the threshold speed factor runs ~1.5 seconds of wall time.
- At trace-playback start, compare `state.activeBlocklyTrace.steps.length` to `BLOCKLY_TRACE_MAX_STEPS`. If it exceeds the cap:
  - the rendered sequence is `steps.slice(0, BLOCKLY_TRACE_MAX_STEPS - 1)` followed by `steps[steps.length - 1]` (the terminal `"action"` or `"empty"` step);
  - the `bba-trace-overflow-badge` class is applied to the event block's SVG for the duration of playback;
  - the badge is cleared by `clearBlocklyTracePlayback`.
- The terminal step is always rendered, even when truncated. The action choice is never affected.

Constraints:

- Cost cap is a render-time concern. It does not change the trace data produced by Plan 25a; the full trace is retained on `state.activeBlocklyTrace` for the dev-only `window.__bbaLastBlocklyTrace` stash and for future diagnostics.
- Do not omit the overflow badge when truncation occurs — students should see that intermediate steps were elided.

Edge cases:

- A trace of length exactly `BLOCKLY_TRACE_MAX_STEPS` does not truncate and does not show the badge.
- A trace of length `BLOCKLY_TRACE_MAX_STEPS + 1` shows the first `BLOCKLY_TRACE_MAX_STEPS - 1` steps plus the terminal step (one step elided); the badge appears.

Expected artifact:

- Constants exported from the same module as `BLOCKLY_TRACE_SPEED_THRESHOLD`.
- Truncation logic inside the playback initializer in Requirement 1.

### Requirement 6: Tests

Required behavior:

- Unit tests (`tests/unit/`, either extending `tests/unit/movement-and-collisions.test.js` or a new sibling `tests/unit/blockly-trace-playback.test.js`):
  - Turn state transitions: a Blockly-controlled runner at or below the threshold transitions `AWAITING_INPUT` → `TRACING_PRE_ACTION` → `PROCESSING_ACTION` → ... → back to `AWAITING_INPUT` for the next runner.
  - Above the threshold, the runner skips `TRACING_PRE_ACTION` entirely.
  - The action queued in `TRACING_PRE_ACTION` is the same action the resolver would have queued without tracing — verified by comparing to an above-threshold control run.
  - Threshold-crossing flush: raising the speed factor above the threshold mid-playback drops trace state and lands in `PROCESSING_ACTION` on the next tick with the original queued action intact.
  - Back-to-back ally turns each start playback at step index `0`.
  - Cleanup helper is idempotent and clears all documented state fields.
- Playwright tests (`tests/browser/`, new file likely cleaner — e.g. `tests/browser/blockly-trace-playback.spec.js`):
  - At low speed, an ally turn produces a visible `bba-trace-current` class on a Blockly block before the runner animation begins.
  - At high speed, no `bba-trace-current` class appears on any Blockly block during ally turns; runner animation begins immediately after planning.
  - True and false condition results produce `bba-trace-result-true` / `bba-trace-result-false` classes respectively, and the glyph adornment is present.
  - The selected-action block ends playback with `bba-trace-selected-action`.
  - Empty-program: an ally with no reachable action shows the `bba-trace-empty-hint` element at low speed and not at high speed.
  - Cost-cap overflow: a program exceeding `BLOCKLY_TRACE_MAX_STEPS` evaluated steps shows the `bba-trace-overflow-badge` class on the event block.
  - Reset clears all trace classes within one frame of the reset action.
  - Level switch and mode switch clear all trace classes.
  - Demo Blockly never receives any `bba-trace-*` class.
  - Human turns and NPC turns never enter `TRACING_PRE_ACTION`.
  - Normal guided controls (Play, Reset, Next Level when applicable) remain usable immediately after a trace plays out.

Constraints:

- Build test programs via existing test hooks or XML loading. Do not use drag-and-drop.
- Wait on observable state — turn-state value, presence of CSS classes, presence of the empty-hint DOM node — not arbitrary sleeps.
- If a new dev/test-only hook is required to inject programs into Free Play or guided workspaces, keep it narrow and document it in the progress report.

Expected artifacts:

- Unit tests as listed.
- Playwright spec as listed.

### Requirement 7: Documentation

Required behavior:

- Update `docs/subsystems/turn-engine.md`:
  - In the "Turn resolution order" section, insert the pre-action trace step between current steps 2 (action chosen) and 3 (engine resolves the queued action). Describe it as: "If the runner is a Blockly-controlled, visible-workspace runner and `animationSpeedFactor` is at or below `BLOCKLY_TRACE_SPEED_THRESHOLD`, the engine enters `TRACING_PRE_ACTION` and renders the evaluation trace before resolving the queued action. The queued action is not re-evaluated."
  - Add a short note that the trace pause does not consume an extra turn, does not change collision/scoring/level-completion outcomes, and is cleared on reset, level switch, mode switch, workspace reload, game-over, threshold-crossing upward, and PvP team tab switch.
- Update `docs/subsystems/blockly-workspace.md`:
  - Add a section (or extend the trace-collection section added by Plan 25a) describing trace highlight as a third, distinct UI signal alongside Blockly's native disabled state and the app's ignored-block warning bubbles. Clarify that trace highlight uses CSS classes (`bba-trace-*`) and `workspace.highlightBlock`, never `setWarningText` or `setDisabledReason`.
  - Document the `hideChaff()` call on trace start.
  - Note that the overflow badge and empty-program hint are part of the trace UI surface, cleared together with block highlights.

Constraints:

- Keep both updates narrow. Do not restate the entire feature; document the contract.
- Preserve all existing text in both notes that this packet does not invalidate.

Expected artifact:

- Updated subsystem notes.

## Model-Specific Instructions

- Start by summarizing the four recorded decisions in one paragraph and the intended MVP: a new `TRACING_PRE_ACTION` turn state advanced per frame, full-evaluated-path playback consuming Plan 25a's trace, outline + glyph + redundant color for true/false, a workspace-edge empty-program hint at low speed only, and a 6-step / ~1.5s cap with a "…" overflow badge.
- Read Plan 25a's `getFirstRunnableActionWithTrace` and the trace step shape before touching the turn engine. Playback consumes the trace; it does not re-evaluate the program.
- Implement the turn-engine change first (Requirement 1), then renderer (Requirement 2), then cleanup (Requirement 3), then empty-program hint (Requirement 4), then cost cap (Requirement 5). This order keeps unit tests usable as soon as Requirement 1 lands.
- No `setTimeout`, `setInterval`, `requestAnimationFrame`-driven side channels, or `Promise`-based delays for the pre-action pause. Per-frame state machine only, advanced by `processTurnActions`.
- Keep DOM/Blockly rendering in a small `traceRenderer` module. Do not inline renderer concerns into `processTurnActions`.
- Do not call `setWarningText` or `setDisabledReason` from any playback code path. Those are owned by the workspace execution-hint scanner.
- Use the existing `animationSpeedFactor` clock for per-step frame budgets. Do not introduce a parallel timing source.
- When in doubt about CSS class collisions with existing ignored-block styling, prefer adding new, scoped classes over modifying existing ones.
- Stop and report if Blockly's `highlightBlock` cannot be paired with a CSS class to meet Decision 2 (color + outline + glyph) without modifying Blockly internals.
- Stop and report if any cleanup path leaks DOM classes or stale `state.activeBlocklyTrace` data across turns, runners, levels, or modes in unit or Playwright runs.
- Stop and report if the turn-engine change requires touching collision, scoring, level-completion, or invariants code paths. Playback is a presentation layer above the existing pipeline.
- Stop and report if a needed test would require drag-and-drop Blockly automation. Add a narrow dev/test-only XML-injection hook and document it instead.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-interpreter.test.js tests/unit/movement-and-collisions.test.js
npm test
npm run build
npm run test:browser
```

## Validation Checklist

- [ ] New `TURN_STATES.TRACING_PRE_ACTION` (or equivalent) defined; transitions wired in `processTurnActions`.
- [ ] No `setTimeout`/`setInterval`/`requestAnimationFrame` side channel / `Promise`-based delays for the pause.
- [ ] Per-frame playback uses the same `animationSpeedFactor` clock as runner animation; one shared helper computes frame budget.
- [ ] `getFirstRunnableActionWithTrace` is called only for Blockly-controlled, non-human, non-frozen, visible-workspace runners at or below the threshold.
- [ ] Action selected by Plan 25a's resolver resolves unchanged through the engine — verified against an above-threshold control run in tests.
- [ ] Highlight visible at or below `BLOCKLY_TRACE_SPEED_THRESHOLD`; absent above it.
- [ ] Full evaluated path is rendered (Decision 1), capped at `BLOCKLY_TRACE_MAX_STEPS = 6` with terminal step always preserved.
- [ ] True/false visual uses outline + glyph + redundant color (Decision 2); not color alone.
- [ ] Selected-action block ends playback with `bba-trace-selected-action`.
- [ ] `Blockly.hideChaff()` called once on entry to `TRACING_PRE_ACTION`.
- [ ] `clearBlocklyTracePlayback(app)` exists, is idempotent, and is wired into: reset, level switch, mode switch, workspace reload, game-over, threshold-crossing upward, PvP team tab switch.
- [ ] Cleanup helper does not throw on null/disposed workspace.
- [ ] Demo Blockly is not traced — no `bba-trace-*` classes ever applied there.
- [ ] Human and NPC turns are not traced — never enter `TRACING_PRE_ACTION`.
- [ ] PvP inactive-team hidden-workspace runs do not attempt playback (already trace-free by Plan 25a).
- [ ] Cost cap and overflow badge from Decision 4 enforced; terminal step always rendered.
- [ ] Empty-program workspace-edge hint from Decision 3 appears at low speed only, never blocks input, never overlaps controls.
- [ ] Threshold crossing mid-trace drops remaining steps, clears highlights, and resolves the queued action this same turn without retrying.
- [ ] Back-to-back ally turns each begin playback at step index `0`.
- [ ] `prefers-reduced-motion` is honored where feasible (static highlight instead of animated pulse).
- [ ] Observable hooks (`state.currentTurnState`, `bba-trace-*` CSS classes, `bba-trace-empty-hint` DOM node, optional `state.traceStepIndex`) present and used by tests.
- [ ] Targeted unit tests pass.
- [ ] Playwright spec passes for low-speed visible, high-speed absent, true/false classes, selected-action class, empty-program hint, overflow badge, reset cleanup, level/mode switch cleanup, demo-Blockly exclusion, human/NPC exclusion, controls usable post-playback.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes.
- [ ] `docs/subsystems/turn-engine.md` updated with the new step in "Turn resolution order" and cleanup invariants.
- [ ] `docs/subsystems/blockly-workspace.md` updated with the trace-highlight UI surface and `hideChaff` cooperation note.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run, decisions implemented, all `clearBlocklyTracePlayback` call sites, any new dev/test-only hooks, and remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- Open Decisions 1–4 are not yet recorded.
- The new turn state cannot be added without restructuring `processTurnActions` beyond the planning/playback/execution boundary.
- Action selection or collision/scoring/level-completion behavior would change.
- Blockly's `highlightBlock` cannot meet Decision 2 accessibility constraints and a custom SVG/CSS path would risk warning-state regressions.
- Playwright cannot observe playback without arbitrary sleeps and no stable hook/class can be added safely.
- Implementation requires dependency installs, usage/export schema changes, deployment, or repository settings changes.
