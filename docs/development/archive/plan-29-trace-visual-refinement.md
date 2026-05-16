# Plan 29: Trace Visual Refinement

## Packet Metadata

- Packet id: plan-29
- Packet title: Trace Visual Refinement
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: implementation / frontend / docs
- Mutation level: source-code / docs-only
- Approval gate: none for implementation; integration owner verifies the visual smoke before considering this packet closed
- Expected artifacts:
  - outline fade animation on `bba-trace-result-true` / `bba-trace-result-false`, persistent glyph unchanged
  - brightness + saturation boost on `bba-trace-current` while a block is the active step
  - pacing tweaks: bump `BLOCKLY_TRACE_MAX_DURATION_FRAMES` and add a `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP` floor
  - speed-slider threshold marker (vertical tick + small eye icon + tooltip on hover)
  - `@media (prefers-reduced-motion: reduce)` block that disables the fade and suppresses the brightness boost cleanly
  - subsystem note touch describing the fade-and-glyph contract
  - progress report
- Progress report folder: `reports/development/plan-29-trace-visual-refinement/`
- Progress report file: `reports/development/plan-29-trace-visual-refinement/progress.md`

## Packet Summary

Goal: Refine the Plan 25b trace visuals based on classroom-eye observation. The current implementation correctly walks the evaluated path, but persistent red/green outlines stack across nested `if`s and swamp the per-step "currently executing" signal. This packet swaps which channel is durable and which is transient: glyphs stay as the persistent record, outlines fade to transparent over ~1s after each step, and the current step gets a clearer "live" signal via brightness + saturation on top of its existing orange outline. Also: small pacing bump, minimum-per-step floor, and a speed-slider threshold marker so students and teachers can see at a glance where trace mode activates.

Non-goals:

- Do not change Plan 25a's trace data shape or collector.
- Do not change Plan 25b's `TRACING_PRE_ACTION` turn state or per-frame state machine architecture.
- Do not change the cost cap (`BLOCKLY_TRACE_MAX_STEPS = 6`) or the "always preserve terminal step" rule.
- Do not change the empty-program hint copy or behavior.
- Do not change the trace-content choice (Decision 1: full evaluated path stays).
- Do not redesign the slider beyond adding the marker overlay.
- Do not introduce design tokens, CSS-in-JS, or a new styling system.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Plan 25a complete (collector + trace shape).
- Plan 25b complete (`TRACING_PRE_ACTION`, renderer, cleanup helper, CSS class set).
- Existing `src/assets/styles/style.css` (Plan 28 may or may not have landed; this packet edits whichever file currently owns the `bba-trace-*` rules — `style.css` if pre-28, `components/blockly.css` if post-28).

Blocks:

- Classroom legibility of trace playback on guided levels with nested conditionals (Challenge 22 was the catalyst).

Why this packet exists:

The integration owner observed Plan 25b in actual use and reported two issues: a wall-of-red effect on nested-`if` programs (because outlines persist for the duration of playback), and a related perceived pacing inequality across steps. Root-cause: persistent result outlines stack across every visited block, drowning the per-step orange "current" signal so the eye loses track of which block is the live one. Bumping the per-step duration alone wouldn't fix the legibility problem. Fading outlines while making the current block brighter solves the legibility issue at its source; the pacing constants are a complementary tune.

## Amendments to Plan 25b

This packet explicitly amends two recorded decisions from `plan-25b-blockly-trace-playback.md`. Future readers should treat the amendments below as the new contract.

### Amendment to Decision 2 (visual treatment)

Plan 25b Decision 2 made the result classes persistent for the duration of playback. This packet changes that: result outlines fade to fully transparent over ~1s after they are applied. Glyphs remain persistent (still the durable evaluated-path record). The current-step block additionally receives a brightness + saturation filter while it is the active step, giving the live block a clearer "lit up" treatment beyond the existing orange stroke. The "outline + glyph + redundant color" model is preserved in spirit, but the outline is now transient and the glyph carries the persistence load.

### Amendment to Decision 4 (cost cap)

Plan 25b Decision 4 chose `BLOCKLY_TRACE_MAX_DURATION_FRAMES = 45` (≈1.5s total at threshold speed). This packet raises the constant to give short traces more breathing room and adds a minimum-per-step floor so the cost cap math cannot rush very short traces. The cap on step count (6) is unchanged. The "always preserve terminal step" rule is unchanged.

## Authority And Contracts

Sources of truth:

- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/turn-engine.md`
- Implementation:
  - `src/config/constants.js`
  - `src/core/turnEngine.js` (only `getBlocklyTraceFrameBudgetPerStep`)
  - `src/ai/blockly/traceRenderer.js`
  - `src/ui/controls.js` (slider marker DOM + position)
  - The CSS file that currently owns the `bba-trace-*` rules: `src/assets/styles/style.css` or `src/assets/styles/components/blockly.css` depending on whether Plan 28 has landed.
  - `index.html` (only if slider marker requires a sibling DOM element near the slider; prefer creating the element via JS in `controls.js` to keep HTML stable).
- Tests:
  - `tests/browser/blockly-trace-playback.spec.js`

Required product contracts:

- Action invariance from Plan 25a is preserved (this packet does not touch the resolver).
- Turn-state machine from Plan 25b is preserved (this packet does not touch `processTurnActions`).
- Glyphs remain the durable persistent record of evaluated-path history.
- Reduced-motion users get a cleanly degraded experience: no fade, no brightness pulse (if any pulse is used), no motion. The current-step signal under reduced motion is the existing static orange stroke alone. Outlines are not rendered at all under reduced motion (since their value is the motion of fading).
- No new dependency. No new build tooling. Static Vite build remains green.

Do not redefine:

- Plan 25a collector or trace shape.
- Plan 25b turn state, cleanup helper, or class names.
- Decision 1 (full evaluated path).
- Decision 3 (empty-program hint).
- The 6-step cost cap and always-preserve-terminal rule.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md` (current Trace section)
- `docs/subsystems/turn-engine.md` ("Turn resolution order" — confirm the pre-action trace step is still accurately documented after this packet's pacing changes)
- `docs/development/plan-25b-blockly-trace-playback.md` (Decisions 2 and 4 are the ones being amended)
- `src/ai/blockly/traceRenderer.js`
- `src/core/turnEngine.js` lines around `getBlocklyTraceFrameBudgetPerStep` and `startBlocklyTracePlayback`
- `src/config/constants.js` (threshold + duration + max-steps constants)
- `src/ui/controls.js` (speed slider listener and DOM)
- The CSS file that owns the `bba-trace-*` rules
- `tests/browser/blockly-trace-playback.spec.js`

Use `rg "bba-trace-|BLOCKLY_TRACE_|getBlocklyTraceFrameBudgetPerStep|speedSlider|getAnimationSpeedFactorFromSliderValue"` to find the relevant clusters.

## Scope

### In scope

- Outline fade animation on result classes (`bba-trace-result-true`, `bba-trace-result-false`). CSS-only, applied via a single `@keyframes` rule that targets the `.blocklyPath` stroke and drop-shadow on those classes. Animation duration ~1s, ease-out, fades to fully transparent, plays once on class application, no repeat.
- Brightness + saturation boost on `bba-trace-current .blocklyPath` via CSS `filter`. Static (no animation), applied while the class is present. Chained with the existing drop-shadow so both effects render together.
- Glyphs (`✓` / `✕`) remain unchanged. The glyph adornment SVG groups must continue to render with full opacity for the duration of playback regardless of the outline fade. Verify the CSS selectors for the result classes target only `.blocklyPath` (and possibly the drop-shadow filter) so the glyph child elements are unaffected.
- Speed-slider threshold marker: a small vertical tick plus a tiny eye icon, positioned at the slider position corresponding to `BLOCKLY_TRACE_SPEED_THRESHOLD`. Tooltip on hover (HTML `title` attribute) explaining what it marks. No text label on the slider itself. Tick + icon styled subtly so they don't compete with the slider thumb.
- Pacing tuning: bump `BLOCKLY_TRACE_MAX_DURATION_FRAMES` from 45 to 60 (so 6-step trace at threshold ≈ 2s wall time at 30 FPS, and a 3-step trace gets ~1s). Add `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP = 10` (≈333 ms at threshold speed). Update `getBlocklyTraceFrameBudgetPerStep` in `turnEngine.js` to use `Math.max(BLOCKLY_TRACE_MIN_FRAMES_PER_STEP, Math.round(scaledBudget))`.
- `@media (prefers-reduced-motion: reduce)` block in the trace CSS that:
  - sets `animation: none` on the result classes (so they don't fade — they also should not render the outline at all under reduced motion, since the outline's purpose is the motion);
  - sets the `.bba-trace-result-true .blocklyPath` and `.bba-trace-result-false .blocklyPath` strokes to `transparent` or removes the stroke rule's effect, so reduced-motion users see only the glyph as the durable record and the current-step signal for the live block;
  - removes the brightness/saturation filter from `.bba-trace-current .blocklyPath` (the static orange stroke remains as the current-step signal).
- Subsystem note touch in `docs/subsystems/blockly-workspace.md` Trace section: replace the prior wording about persistent result classes with the fade-and-glyph contract. One short paragraph.
- Update `tests/browser/blockly-trace-playback.spec.js` only if existing assertions verify *persistent* result classes on past steps. If they do, the test must be updated to assert glyph persistence and current-step transience. If they do not, the spec passes unchanged.
- Plan 29 progress report.

### Files and areas likely touched

- `src/config/constants.js` — bumped `BLOCKLY_TRACE_MAX_DURATION_FRAMES`, new `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP`.
- `src/core/turnEngine.js` — only the `getBlocklyTraceFrameBudgetPerStep` helper.
- `src/ai/blockly/traceRenderer.js` — likely no changes required; the fade is CSS-driven. Confirm by inspection. If the renderer currently force-removes result classes anywhere, ensure that path still works with the fade animation (the animation completes well before the next step under normal pacing).
- The CSS file that owns the `bba-trace-*` rules — fade animation, brightness filter, reduced-motion block, slider marker styling.
- `src/ui/controls.js` — slider marker element creation and position computation.
- `index.html` — only if the slider marker is structurally easier as a sibling element added in HTML; prefer JS-created DOM in `controls.js` to keep HTML stable.
- `docs/subsystems/blockly-workspace.md` — Trace section update.
- `tests/browser/blockly-trace-playback.spec.js` — only if existing assertions need updating per the rule above.
- `reports/development/plan-29-trace-visual-refinement/progress.md` — new.

### Out of scope

- Changes to Plan 25a's collector or resolver.
- Changes to the `TRACING_PRE_ACTION` turn state, cleanup helper, or class name set.
- Changes to the 6-step cost cap or terminal-step preservation rule.
- Changes to the empty-program hint copy or behavior.
- Adding new trace step kinds or new CSS classes beyond what's needed for the marker.
- Redesigning the speed slider itself, the slider's value-to-factor mapping, or its labels.
- Any unrelated CSS refactor (Plan 28 owns structural splits).

## Work Plan

1. Read the current `traceRenderer.js` and the CSS file that owns the `bba-trace-*` rules to confirm the renderer applies result classes and never removes them mid-playback. If the renderer removes result classes anywhere, document the call site and decide whether the fade animation needs JS coordination or can stay CSS-only.
2. Add `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP = 10` and bump `BLOCKLY_TRACE_MAX_DURATION_FRAMES` to 60 in `constants.js`. Update `getBlocklyTraceFrameBudgetPerStep` to honor the new floor.
3. Add the fade animation to the result classes. Make sure the animation targets only `.blocklyPath` (and the drop-shadow `filter` if currently on the same selector) so glyph adornments are unaffected.
4. Add the brightness + saturation filter to `.bba-trace-current .blocklyPath`, chained with any existing filter so all effects compose.
5. Add the slider threshold marker DOM in `controls.js` (preferred over editing `index.html`). Compute its position from the slider's value range and the threshold's slider-value equivalent. Use existing `getAnimationSpeedFactorFromSliderValue` to determine which slider value maps to `BLOCKLY_TRACE_SPEED_THRESHOLD`; if the mapping isn't invertible analytically, scan slider values 1..10 and pick the largest value whose mapped factor is ≤ threshold. Apply CSS styling for the tick + eye icon and `title` attribute for the tooltip.
6. Add the `@media (prefers-reduced-motion: reduce)` block.
7. Update `docs/subsystems/blockly-workspace.md` Trace section: replace persistence wording with the fade-and-glyph contract.
8. Run validation: `npm test`, `npm run build`, `npm run test:browser`. Visual smoke on a guided level with nested `if`s (Challenge 22 or Level 3) at low speed: confirm outlines fade, glyphs persist, current block lights up, slider marker is visible at threshold.
9. Write the progress report.

## Implementation Requirements

### Requirement 1: Outline fade

Required behavior:

- When a block receives `bba-trace-result-true` or `bba-trace-result-false`, the block's `.blocklyPath` stroke and any associated drop-shadow fade from full opacity to fully transparent over approximately 1 second using ease-out timing. The animation plays once per class application.
- The glyph adornment SVG group attached to the same block is unaffected — its background fill, stroke, and text remain fully visible.
- Multiple blocks fading concurrently is supported (no shared animation state). Each block's fade is independent of the others.

Constraints:

- CSS-only implementation. No JS coordination required for the fade itself.
- Animation duration is a fixed wall-clock value (~1s), not scaled with `animationSpeedFactor`.
- Animation must not loop. After it completes, the outline stays at transparent.
- Selectors target only the path/filter, never glyph child classes (`-bg`, `-mark`).

Edge cases:

- If the current step happens to land on a block that already has a faded-or-fading result class (resolver visits a block whose ancestor was just evaluated), the new `bba-trace-current` class adds the bright orange + brightness on top regardless of fade state — fade animation only governs the result-class visuals.
- If playback is interrupted (reset, level switch, etc.), `clearAllTraceClasses` removes all classes including the result classes; the in-progress animation aborts when the class is removed. This is the existing behavior — no new code path needed.

Expected artifact:

- A `@keyframes` rule (or equivalent CSS animation declaration) in the trace CSS, plus the existing result-class selectors gaining `animation: <name> 1s ease-out forwards`.

### Requirement 2: Current-step brightness boost

Required behavior:

- While `bba-trace-current` is on a block, its `.blocklyPath` renders with `filter: brightness(1.15) saturate(1.2) <existing drop-shadow filter>`. The block visibly "lights up" compared to its neighbors.
- Static effect, no animation. The boost appears the moment the class is applied and disappears the moment it is removed.

Constraints:

- Filter chain must compose cleanly with any existing `drop-shadow` on `.bba-trace-current .blocklyPath`. Use a single `filter:` declaration that includes all functions.
- Do not introduce a brightness pulse, glow animation, or other motion in the default treatment. The user did not request motion here; the static boost combined with faded surroundings is the design.

Edge cases:

- If the implementer adds a brightness pulse for emphasis, it must be disabled under reduced motion. The default recommendation is no pulse.

Expected artifact:

- Updated `.bba-trace-current .blocklyPath` rule with the chained filter.

### Requirement 3: Pacing constants

Required behavior:

- `BLOCKLY_TRACE_MAX_DURATION_FRAMES` is increased from 45 to 60.
- A new constant `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP = 10` is exported from the same module.
- `getBlocklyTraceFrameBudgetPerStep(state)` returns `Math.max(BLOCKLY_TRACE_MIN_FRAMES_PER_STEP, Math.round(scaledBudget))`, with `scaledBudget` computed the same way as today.

Constraints:

- Do not change the threshold constant.
- Do not change the max step count.
- The min-floor must apply to every step uniformly. No special-case logic for terminal vs intermediate steps.

Edge cases:

- At slower-than-threshold speeds, the scaled budget grows; the floor has no effect because the scaled value exceeds it.
- At pause (factor 0), the existing helper returns `BLOCKLY_TRACE_MAX_DURATION_FRAMES`. This behavior is unchanged by the bump or floor.

Expected artifact:

- Constants updated; helper updated.

### Requirement 4: Speed-slider threshold marker

Required behavior:

- A small visual marker appears on (or immediately adjacent to) the speed slider at the position corresponding to `BLOCKLY_TRACE_SPEED_THRESHOLD`. The marker consists of:
  - a thin vertical tick aligned with the slider track,
  - a small eye icon (SVG, ~14-16 px) immediately above or beside the tick,
  - an HTML `title` attribute (or equivalent accessible label) reading something like "Trace mode activates at or below this speed" so hover reveals the meaning.
- The marker is subtle: low contrast, no animation, does not compete with the slider thumb or value display.
- The marker is created and positioned by JS in `src/ui/controls.js` so `index.html` remains unchanged. If structural simplicity requires an `index.html` edit, surface the rationale in the progress report.

Constraints:

- Position computation must reflect the actual slider value range and the threshold's slider-value equivalent. Use `getAnimationSpeedFactorFromSliderValue` to find the slider value whose factor is `BLOCKLY_TRACE_SPEED_THRESHOLD`. If the mapping isn't analytically invertible, scan integer slider values from min to max and pick the largest value whose mapped factor is `≤ threshold`.
- The marker must reposition correctly if the slider's pixel width changes (responsive layout). Either use percentage-based positioning relative to the slider container, or recompute on window resize.
- The marker must not intercept pointer events or block slider interaction. Use `pointer-events: none` on the marker container.

Edge cases:

- If the slider DOM is not present (e.g. an alternate layout), the marker creation no-ops silently. Do not throw.
- If the threshold's slider-value equivalent is at the slider's min or max, the marker still renders (clipped naturally by the slider container's edge).

Expected artifact:

- Marker DOM creation and positioning in `controls.js`; styling rules in the trace CSS (or a dedicated `.bba-speed-threshold-marker` block in the same file).

### Requirement 5: Reduced-motion handling

Required behavior:

- A `@media (prefers-reduced-motion: reduce)` block exists in the trace CSS and:
  - sets `animation: none` on the result classes so the fade does not run;
  - sets the result-class `.blocklyPath` stroke to `transparent` (or otherwise suppresses its visible rendering) so no outline is shown to reduced-motion users — the glyph alone carries the persistent record;
  - removes the brightness + saturation filter from `.bba-trace-current .blocklyPath` (the existing orange stroke remains as the current-step signal).
- Glyph rendering and the current-step orange stroke remain visible under reduced motion.

Constraints:

- Do not disable the entire trace feature for reduced-motion users. They should still see the glyph history and current-step indication.
- Do not omit the slider threshold marker — it is static and reduced-motion-safe.

Expected artifact:

- A single `@media` block in the trace CSS.

### Requirement 6: Documentation

Required behavior:

- Update the Trace section of `docs/subsystems/blockly-workspace.md`. Replace any wording implying persistent result outlines with the new contract: result outlines fade to transparent over ~1s, glyphs persist as the durable evaluated-path record, current-step block gets a static brightness + saturation boost, reduced-motion users see only glyph + current-step orange.
- Keep the update narrow — one short paragraph, no bulleted lists added.
- Do not touch `docs/subsystems/turn-engine.md`. The turn state and per-frame state machine are unchanged.

Constraints:

- Preserve existing language about `hideChaff`, cleanup paths, and the class set (`bba-trace-*`).
- Mention Plan 29 by number for traceability.

Expected artifact:

- Updated subsystem note.

### Requirement 7: Test alignment

Required behavior:

- Inspect `tests/browser/blockly-trace-playback.spec.js` for any assertion that requires result classes to be *present* on past (non-current) steps after the current step has advanced. If such an assertion exists, replace it with an assertion that the glyph adornment is present and the result class either still exists with a fading/transparent stroke or has been replaced by a glyph-only state.
- Do not add new tests unless the existing spec fails. The visual smoke is the primary regression check for this packet.

Constraints:

- Test waits remain hook/class-based, not sleep-based.
- Reduced-motion behavior is not exercised by the automated suite. Manual smoke under an emulated reduced-motion media setting is acceptable; document the result in the progress report.

Edge cases:

- If the existing test relies on result-class persistence in a way that conflicts with the new fade, prefer to amend the assertion to check glyph presence rather than rip out the test.

Expected artifact:

- Tests still pass; any necessary amendments documented.

## Model-Specific Instructions

- Start by reading `traceRenderer.js` and the current trace CSS end-to-end. Confirm the renderer applies result classes but does not remove them mid-playback. The fade is CSS-only; no JS coordination should be needed.
- Do not touch the resolver, the turn-state machine, the cleanup helper, or the cost-cap logic.
- Do not introduce new `bba-trace-*` class names. The only new class added in this packet should be the slider marker container (`bba-speed-threshold-marker` or similar).
- Do not add animation to the current-step brightness boost. Static filter only.
- Treat the slider marker as a small accessibility-aware UI element: pointer-events disabled, semantic title, keyboard-irrelevant.
- Stop and report if:
  - the renderer turns out to depend on persistent result classes for correctness (e.g. clearing logic that requires them to still be on the block);
  - the slider's value-to-factor mapping has been refactored since this packet was written and no obvious inversion path exists;
  - any existing Playwright test asserts persistence in a way that cannot be cleanly amended.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-trace-playback.test.js tests/unit/blockly-trace-collection.test.js
npm test
npm run build
npm run test:browser
npm run dev
```

`npm run dev` is for visual smoke on a guided level with nested conditionals (Challenge 22 or Level 3) at low speed; stop the dev server before marking the packet complete.

## Validation Checklist

- [ ] Result outlines fade to fully transparent over ~1s after class application, ease-out, no loop.
- [ ] Glyphs (`✓`/`✕`) remain visible at full opacity for the duration of trace playback.
- [ ] `.bba-trace-current .blocklyPath` renders with brightness + saturation boost chained with the existing drop-shadow filter; static, no animation.
- [ ] `BLOCKLY_TRACE_MAX_DURATION_FRAMES` is 60.
- [ ] `BLOCKLY_TRACE_MIN_FRAMES_PER_STEP` is 10 and is honored by `getBlocklyTraceFrameBudgetPerStep`.
- [ ] Speed-slider threshold marker is rendered, positioned at the slider value corresponding to `BLOCKLY_TRACE_SPEED_THRESHOLD`, includes an eye icon and tooltip via `title`, does not intercept pointer events.
- [ ] Marker repositions on window resize (or uses percentage positioning so it stays correct without explicit recompute).
- [ ] `@media (prefers-reduced-motion: reduce)` block disables the fade animation, suppresses result-class outline rendering, and removes the brightness filter from the current step. Glyph and existing orange-stroke current signal still render.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes (with any necessary spec amendments documented).
- [ ] Manual visual smoke on a nested-`if` guided level at low speed: outlines fade as the step advances, no wall-of-red, current block visibly lights up, glyphs accumulate as the evaluated-path record, slider marker visible at threshold.
- [ ] `docs/subsystems/blockly-workspace.md` Trace section updated with the fade-and-glyph contract and references Plan 29.
- [ ] No unrelated files changed.
- [ ] Progress report lists commands run, visual smoke observations, reduced-motion check, and any flagged risks.

## Stop Conditions

Stop and report for integration-owner review if:

- The renderer depends on persistent result classes for correctness in a way that conflicts with the fade.
- The slider's value-to-factor mapping has changed since this packet was written and the marker position cannot be computed cleanly.
- The brightness + saturation filter visually clashes with Blockly's existing block rendering in a way that mis-reads.
- The fade animation interacts poorly with browser repaints during fast-moving traces.
- Implementation would require dependency installs, schema changes, deployment, or repository settings changes.
- Any existing Playwright test asserts result-class persistence in a way that cannot be cleanly amended.
