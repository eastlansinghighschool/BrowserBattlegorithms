# Plan 52: Jump Forward Animation and Flair

## Packet Metadata

- Packet id: plan-52
- Packet title: Jump Forward Animation and Flair
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: implementation / visual / audio / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing any game rule, swapping runner emoji, scaling text emoji non-uniformly (squash-and-stretch), adding new audio assets, or extending visual treatment to other actions
- Expected artifacts:
  - parabolic arc offset added to the jump animation in `src/entities/Runner.js`
  - drop shadow, converging takeoff lines, and dust ring effects in `src/render/effects.js`
  - synthesized takeoff and landing SFX cases in `src/ui/sound.js`
  - failed-jump partial-arc reversal behavior
  - minimum jump duration floor independent of the game-speed slider
  - reduced-motion paths for every new visual or audio cue
  - unit tests for the arc offset math and the failure-reversal math
  - Playwright spec confirming jump still produces the same game-state outcome as today (visuals only; no rule change)
  - subsystem note update in `docs/subsystems/p5-surface-map.md`
  - progress report
- Progress report folder: `reports/development/plan-52-jump-forward-animation-and-flair/`
- Progress report file: `reports/development/plan-52-jump-forward-animation-and-flair/progress.md`

## Packet Summary

Goal: Make the Jump Forward action look and sound like a jump. Today, [Runner.js:138-152](src/entities/Runner.js) shows `startJumpAnimation` setting `this.isMoving = true` and otherwise behaving identically to `startMoveAnimation` — same lerp, same easing, same render path. Visually it's a slide. A student pilot on 2026-05-18 flagged this; she suggested a small parabola. This packet does that and adds a complete jump visual+audio signature that matches the visual-effects vocabulary Plan 49 established for Area Freeze.

The packet is **visual and audio only**. No game rules change. No `canJump`/`jumpAvailable` semantics change. No collision behavior change. The same turn that resolves to "moved to (x,y)" today still resolves to "moved to (x,y)" after this packet — only the path on screen and the sound during animation differ.

Non-goals:

- Do not change any game rule. Jump distance, availability, cooldown, success conditions, collision priority, and resource semantics all stay exactly as they are.
- Do not change runner emoji at any point in the jump. Team identity (skin tone + gender + role + direction modifiers) is preserved frame-by-frame.
- Do not apply squash-and-stretch (non-uniform `p.scale`) to runner emoji. Text rendering quality varies by platform; cross-browser risk is real on the school Chromebook target.
- Do not add a glow-based anticipation effect. The active-runner glow and area-freeze runner flash already occupy the runner-halo visual layer; a third halo creates color/intensity conflicts. Converging takeoff lines (a different visual layer entirely) replace the glow idea.
- Do not introduce new audio asset files. The existing sound system in `src/ui/sound.js` is fully synthesized via Web Audio oscillators; jump SFX is added the same way.
- Do not extend the new visual vocabulary to Move Forward, Place Barrier, Freeze Opponents, or any other action in this packet. Only Jump Forward.
- Do not add per-team or per-runner jump variants. One jump visual, applied uniformly.
- Do not deploy.

Depends on:

- Plan 49 (Area Freeze board effect visualization) landed. `src/render/effects.js` is the established home for board-level visual effects with reduced-motion paths, and Plan 52 extends that pattern. The `prefersReducedMotion()` helper and the existing per-effect reduced-motion branches are the reference patterns.
- Plan 39 (Browser TTS) landed. Sound is already gated on `state.soundEnabled` and already ducked under active TTS via `setNarrationDucking`. New jump SFX inherits both contracts at zero cost.

Blocks:

- A consistent "special-ability visual signature" vocabulary across the game. Plan 49 established it for Area Freeze; Plan 52 establishes it for Jump Forward; future packets can extend the same pattern to Place Barrier or other special actions.
- Future pedagogical claims about the program-to-action visual chain (Plan 25b trace playback → action animation → outcome) reading clearly.

Why this packet exists:

A student in the 2026-05-18 pilot session noted that Jump Forward "should have a better animation than simply easing two spaces forward" — she suggested a small parabola. The orchestrator code review confirmed: jump and move share an animation path with no visual or audio distinction beyond the two-cell travel distance. A faster-moving runner is the only cue that something special happened, and even that vanishes once the easing brings the visible speed back down to a near-move pace.

This is a real pedagogy gap, not just polish. Plan 25b's pre-action trace playback highlights the `Jump Forward` block in the workspace before the action runs — but when the action runs, the visual reads as "move forward, just farther." Students don't get the visual confirmation that the program's jump block actually produced a jump. Closing that gap reinforces the program → action visual chain that the trace playback was built to teach.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-18):

### Decision 1: Six Tier 1 visual+audio elements

The baseline jump signature consists of six elements, all required:

1. **Parabolic arc.** Vertical offset `Math.sin(progress * π) * -CELL_SIZE * arcAmplitude` applied during render, where `arcAmplitude = 1.0` at normal motion and `0.3` under reduced motion. Apex at `progress = 0.5`, which is directly over the middle (skipped) cell. The peak-over-the-skipped-cell placement is pedagogically load-bearing: it visually reinforces that Jump Forward bypasses the intermediate cell, which is the rule's whole point.

2. **Drop shadow** at the runner's ground position during the entire jump animation, in `effects.js`. A translucent dark ellipse drawn at `(pixelX + CELL_SIZE/2, pixelY + CELL_SIZE - small offset)` — i.e., where the runner WOULD be if not airborne. Shadow shrinks (smaller ellipse) and lightens (lower alpha) as the runner approaches apex; grows and darkens on descent. Under reduced motion, the shadow is rendered at constant size and alpha (no shrink/grow), which still proves height visually but doesn't animate.

3. **Converging takeoff lines.** During `progress 0.0 - 0.15` (the anticipation window), 2-3 short horizontal strokes are drawn on each side of the runner's feet, at low opacity, close to the ground line of the takeoff cell. Strokes shrink in length and fade in opacity over `progress 0.15 - 0.25`, then are gone. The runner does not move horizontally or vertically during `progress 0.0 - 0.15` — only the takeoff lines render. From `0.15 - 1.0` the arc proceeds. Under reduced motion, the strokes render at fixed length and opacity for a single frame at `progress 0.0`, then are gone.

4. **Failed-jump partial-arc reversal.** When the landing cell is blocked (existing behavior triggers `startBounceAnimation` today), use a distinct animation path that:
   - plays the converging takeoff lines (anticipation reads correctly — the program intended a jump)
   - arcs partway forward (peak at ~60% of normal arc amplitude, traveling to roughly the midpoint between origin and landing)
   - reverses mid-flight back to origin cell
   - ends at the origin cell with the same final state as today's bounce
   - The existing `startBounceAnimation` path is preserved for failed *moves* (one-cell collisions, walls, etc.). Failed *jumps* get their own visual that clearly communicates "tried to jump, hit something, fell back." Plan 36 narration already says "bounced off [obstacle]" for both cases — the audio cue stays uniform; the visual newly distinguishes.

5. **Synthesized jump SFX.** Two new switch cases in `playSound` in [src/ui/sound.js](src/ui/sound.js):
   - `"jump-takeoff"` — fires when `startJumpAnimation` is called and succeeds. Suggested: a rising triangle wave (200 → 380 Hz over 80ms) — implementer may tune exact frequencies but the shape is "short rising whoosh."
   - `"jump-land"` — fires when the jump animation reaches `progress >= 1.0` and the jump succeeded. Suggested: a low square thud (100 Hz, 60ms, low gain) — implementer may tune. Failed jumps play `"jump-takeoff"` at the start but NOT `"jump-land"` (because there was no landing — the runner returned to origin). They may optionally play a quieter "fizzle" tone at reversal; implementer's call.
   - No new audio asset files. Two new `tone()` invocations in the existing synthesis pattern.

6. **Minimum jump duration floor.** Independent of the game-speed slider. The total visual jump duration (anticipation + arc + landing frame) must not drop below a minimum threshold (suggested: 320ms — implementer may tune within 280-380ms). At max game speed, jump animation runs at this floor; move animation continues to scale with `animationSpeedFactor` as today. This prevents the parabola from collapsing into a visual glitch at fast playback.

### Decision 2: One Tier 2 visual element

Required if scope allows; do not skip without reporting:

7. **Dust ring on landing.** A fast-expanding, fading gray circle centered on the landing cell at the moment `progress` hits `1.0` and the jump succeeded. Rendered in `effects.js`. Expansion duration ~150ms (or tied to a small frame count). Failed jumps do NOT play the dust ring (no landing happened). Under reduced motion, the dust ring is replaced with a single-frame flash at the landing cell — no expansion.

### Decision 3: Explicit non-goals

These are documented as "do NOT do" in implementation:

- Do not change any runner emoji at any point in the jump. The team identity matrix (skin tone + gender + role + direction modifier) is preserved frame-by-frame.
- Do not apply squash-and-stretch (non-uniform `p.scale`) to runner emoji. Cross-browser emoji rendering quality risk on the school Chromebook target is real and unaddressed.
- Do not add a glow-based anticipation effect. The active-runner glow and area-freeze runner flash already occupy the runner-halo visual layer. Converging takeoff lines (Decision 1, item 3) replace this idea with a non-conflicting visual primitive.
- Do not extend new visual vocabulary to Move Forward, Place Barrier, Freeze Opponents, or any other action. Only Jump Forward.

### Decision 4: Reduced motion is mandatory, not optional

Every Tier 1 and Tier 2 element has a reduced-motion path specified in its decision text. Compliance with `prefers-reduced-motion: reduce` is a hard requirement, not a polish item. The `prefersReducedMotion()` helper at [effects.js:16](src/render/effects.js:16) is the reference pattern. Each new effect function must check it and branch.

Pedagogically, reduced motion should still distinguish jump from move — the arc amplitude is reduced (not eliminated), the drop shadow is still drawn, the converging lines render at least once. A reduced-motion user must still be able to tell a jump happened by visual evidence; they only lose the animation flourish.

### Decision 5: Effects live in `src/render/effects.js`, alongside Plan 49

All new visual primitives (drop shadow, converging takeoff lines, dust ring) are new exported functions in `src/render/effects.js`. They follow the existing Plan 49 naming pattern:

- `drawJumpDropShadow(p, runner, jumpProgress)`
- `drawJumpTakeoffLines(p, runner, jumpProgress)`
- `drawJumpLandingDust(p, runner, landingProgress)`

Calls are wired into `runner.display(p, state)` at [Runner.js:62](src/entities/Runner.js:62) for the per-runner effects (shadow, takeoff lines), and into the main board render loop for the landing dust (which lives on the cell, not the runner, after the runner has moved).

### Decision 6: Animation timeline reorganization

The jump animation timeline becomes:

- `progress 0.00 - 0.15` — anticipation. Runner pixel position unchanged. Converging takeoff lines visible at full length and opacity.
- `progress 0.15 - 0.25` — takeoff lines shrink and fade. Arc begins (vertical offset starts ramping).
- `progress 0.15 - 1.00` — arc continues. Vertical offset follows `sin(remappedProgress * π) * arcAmplitude`, where `remappedProgress = (progress - 0.15) / 0.85`. Apex of remapped sin curve still falls over the skipped cell.
- `progress = 1.00` — landing. Dust ring spawns. Landing SFX fires.

This reorganization means the existing `easeInOutQuad` curve in `src/render/animation.js` is no longer the right easing for jump's horizontal interpolation. The implementer can either keep `easeInOutQuad` and accept slight visual asymmetry, or introduce a small `easeJumpHorizontal(progress)` variant. Document the choice in the progress report.

### Decision 7: State decoupling in `Runner.js`

`startJumpAnimation` currently sets `this.isMoving = true`. After this packet:

- Add a new state field `this.isJumping = false` to `resetToInitial()`.
- `startJumpAnimation` sets both `this.isMoving = true` AND `this.isJumping = true` (jumps still travel horizontally, so `isMoving` is still semantically correct — but `isJumping` is the new flag that gates arc/shadow/takeoff-lines/SFX).
- `updateAnimation` clears both flags when `animationProgress >= 1` (existing behavior; just clears the new flag too).
- For failed jumps, the same `isJumping` flag is true during the partial-arc reversal; a sibling flag `this.jumpFailedReversal = false` (or equivalent) marks reversal mode so the offset math knows to peak earlier and reverse. Implementer chooses the exact state shape.

`startMoveAnimation` does NOT set `isJumping`. Move and jump are now visually decoupled in state, not just by distance.

## Authority And Contracts

Sources of truth:

- `src/entities/Runner.js` — state and animation update; current `startJumpAnimation`, `startMoveAnimation`, `startBounceAnimation`, `updateAnimation`, and `display` methods.
- `src/render/effects.js` — Plan 49 visual-effects module; reduced-motion patterns; existing pulse/flash/badge effects as authoritative reference.
- `src/render/drawEntities.js` — `drawRunners` calls `runner.display(p, state)`. May gain a separate landing-dust pass that's not per-runner (since the runner has moved by then).
- `src/render/animation.js` — easing helpers; possibly grows by one function.
- `src/ui/sound.js` — synthesized SFX via `tone(freq, durMs, gain, type)`.
- `src/config/constants.js` — tuning constants if any are introduced. Prefer module-local constants in `effects.js` unless the value needs to be shared with `Runner.js`.
- `docs/subsystems/p5-surface-map.md` — subsystem note that must describe the new jump visual layer.

Required product contracts:

- Game-state outcome for any jump (success or failure) is identical before and after this packet. Same final cell. Same `canJump` clearing. Same collision results. Same narration text from Plan 36. Same learning-moment classification from Plan 37.
- The visual jump duration at max game-speed is no shorter than the minimum-duration floor (Decision 1 item 6).
- Reduced motion preserves the jump-vs-move visual distinction.
- No emoji change at any point in the animation.
- No new audio asset files. SFX is fully synthesized.
- Existing modal-stability and key-capture Playwright tests continue to pass without modification.
- The app remains a static Vite deployment.

Do not redefine:

- Jump rule semantics (distance, availability, success/failure conditions, collision priority).
- Move animation behavior. Move continues exactly as today.
- The failed-move bounce animation (`startBounceAnimation`). Only failed *jumps* get a new path.
- The active-runner glow (`drawActiveRunnerGlow`) or the area-freeze runner flash (`drawAreaFreezeRunnerFlash`). New jump effects must not conflict with these.
- Plan 36 narration text. Existing "Ally 0 jumped to row X, column Y" and "Ally 0 bounced off [obstacle]" wording stays.
- Plan 37 learning-moment classification.
- Plan 38 coaching cadence or text.

## Required Reading

Read before any mutation:

- `docs/packet-creation-guidance.md`
- `docs/subsystems/p5-surface-map.md` — current rendering contract; update target
- `docs/subsystems/turn-engine.md` — confirms jump's role in turn resolution; no edits needed but worth a skim
- `docs/development/archive/plan-49-area-freeze-board-effect-visualization.md` — the structural model; the reduced-motion patterns and `effects.js` function shapes are the reference
- `reports/development/plan-49-area-freeze-board-effect-visualization/progress.md` — implementation notes from Plan 49 for any tuning lessons learned
- `src/entities/Runner.js` — focus on lines 62-93 (display), 138-152 (startJumpAnimation), 154-167 (startMoveAnimation), 169-186 (startBounceAnimation), 188+ (updateAnimation)
- `src/render/effects.js` — focus on lines 16-30 (`prefersReducedMotion`), 31-78 (`drawActiveRunnerGlow`), 80-115 (`drawAreaFreezePulse`), 117-160 (`drawAreaFreezeRunnerFlash`)
- `src/render/animation.js` — short file; understand `easeInOutQuad` shape
- `src/render/drawEntities.js` — focus on `drawRunners`
- `src/ui/sound.js` — focus on `playSound` and existing synthesized cases
- `tests/unit/movement-and-collisions.test.js` and any other jump-touching unit test — confirm the game-state assertions stay green after this packet

Use `rg "startJumpAnimation|isJumping|canJump|JUMP_FORWARD"` from the repo root to confirm the touch list before final commit.

## Scope

### In scope

- New state fields on Runner: `isJumping` (boolean), and a small flag for failed-jump reversal (implementer chooses shape).
- Reorganized animation timeline per Decision 6.
- Vertical-offset arc math during `progress 0.15 - 1.0`.
- Drop shadow rendered in `effects.js` as a new exported function, called from `runner.display`.
- Converging takeoff lines in `effects.js` as a new exported function, called from `runner.display` during `progress 0.0 - 0.25`.
- Failed-jump partial-arc reversal: new branch in `updateAnimation` when the jump target was blocked. Distinguish from the existing `startBounceAnimation` path so failed *moves* and failed *jumps* render differently.
- Two new synthesized SFX cases in `playSound`: `"jump-takeoff"` and `"jump-land"`.
- Optional small "fizzle" SFX at reversal moment of a failed jump — implementer's call, document choice in progress report.
- Dust ring on landing in `effects.js`, called from the board render loop (not per-runner).
- Reduced-motion paths for every new visual; SFX is unchanged under reduced motion (audio doesn't have a reduced-motion equivalent worth implementing here).
- Minimum jump duration floor in `updateAnimation`.
- Unit tests for: arc offset math at progress = 0.0, 0.15, 0.25, 0.5, 0.75, 1.0; failed-jump reversal final position equals origin; takeoff-line opacity ramp at progress = 0.0, 0.15, 0.25.
- Playwright spec confirming: jump completes to the same final cell as a move with equal distance would; jump animation visibly differs from move (e.g., asserts the runner's rendered y-position differs from `gridY * CELL_SIZE` at mid-animation); failed-jump returns runner to origin with `canJump = false`.
- `docs/subsystems/p5-surface-map.md` update with a new "Jump visuals" section.
- Progress report including:
  - tuning values chosen (arc amplitude reduced-motion factor, minimum duration, line stroke count/length/opacity, dust ring expansion duration, SFX frequencies and durations)
  - cross-browser smoke notes (verify the dust ring and converging lines render acceptably on the school Chromebook target if available; desktop Chrome at minimum)
  - any squash-and-stretch temptations encountered and rejected per Decision 3

### Files and areas likely touched

- `src/entities/Runner.js` (state fields, animation update, display call sites)
- `src/render/effects.js` (three new exported functions)
- `src/render/drawEntities.js` (board-level call site for the landing dust ring)
- `src/render/animation.js` (possible new easing helper)
- `src/ui/sound.js` (two new SFX cases)
- `src/config/constants.js` (only if a tuning constant needs to be shared between Runner and effects)
- `docs/subsystems/p5-surface-map.md`
- `tests/unit/jump-animation.test.js` (new) or extension of `tests/unit/movement-and-collisions.test.js`
- `tests/browser/jump-animation.spec.js` (new) or addition to an existing animation spec
- `reports/development/plan-52-jump-forward-animation-and-flair/progress.md`

### Out of scope

- Game rule changes (jump distance, availability, success conditions, collision priority).
- Emoji changes.
- Squash-and-stretch on runner emoji.
- Glow-based anticipation effects.
- Extending the new visual vocabulary to any other action.
- New audio asset files.
- Per-team or per-runner jump variants.
- Changes to `startBounceAnimation` or the failed-move visual.
- Changes to `drawActiveRunnerGlow` or `drawAreaFreezeRunnerFlash`.
- Plan 36 narration text changes.
- Plan 37 / 38 / 39 changes.
- Updates to the Student Guide, Teacher Guide, or game spec (visual flair is implementation detail, not a rule).
- Source-level lessons about jump (concept matrix unchanged).
- Deployment.

## Work Plan

1. Read every required-reading file. Confirm Plan 49 patterns. Run `rg "startJumpAnimation"` to confirm there are no surprise call sites.
2. Add new state fields to `Runner.js`. Update `resetToInitial`, `startJumpAnimation`, `updateAnimation`. Confirm existing tests still pass (no visual changes yet).
3. Add the arc vertical offset math to `display()` (or wherever the most natural seam lives — implementer judgment). Add a unit test for the offset math first; then wire it in. At this point the runner should arc visibly during jumps.
4. Add `drawJumpDropShadow` in `effects.js`. Wire into `runner.display`. Verify shadow renders correctly during jump and is invisible during move.
5. Add `drawJumpTakeoffLines` in `effects.js`. Wire into `runner.display`. Verify lines appear during `progress 0.0 - 0.25` and are invisible otherwise.
6. Add the failed-jump partial-arc reversal path in `updateAnimation`. Add a unit test asserting the final position equals origin on failure. Verify the existing failed-move bounce path is untouched.
7. Add the two new SFX cases in `sound.js`. Wire `"jump-takeoff"` into `startJumpAnimation` (success path). Wire `"jump-land"` into `updateAnimation` at `progress >= 1.0` on jump success. Implementer's-call: optional fizzle SFX on failure.
8. Add `drawJumpLandingDust` in `effects.js`. Wire into the board render loop in `drawEntities.js` (this one is not per-runner; it lives on the cell after the runner has moved). Verify the ring expands and fades on successful landing only.
9. Add the minimum-duration floor in `updateAnimation`. Test by setting `animationSpeedFactor` to max and confirming the jump still takes at least the floor duration.
10. Add reduced-motion branches in each effects.js function. Test with `prefers-reduced-motion: reduce` simulated.
11. Write the Playwright spec confirming game-state regression-free and visual difference.
12. Update `docs/subsystems/p5-surface-map.md` with the new "Jump visuals" section.
13. Write the progress report including tuning values and cross-browser smoke notes.

## Implementation Requirements

### Requirement 1: State decoupling (Decision 7)

Required behavior:

- `Runner.js` gains `this.isJumping = false` field, initialized in `resetToInitial`.
- `startJumpAnimation` sets `this.isJumping = true` in addition to existing state changes.
- `startMoveAnimation` does NOT touch `isJumping`.
- `updateAnimation` clears `this.isJumping = false` when the jump completes (success or failed-reversal end state).
- A sibling state field (e.g., `this.jumpFailedReversal = false`) marks failed-jump reversal mode. Set when the jump target is blocked; cleared when reversal completes.

Constraints:

- Do not remove or repurpose `this.isMoving`. Jump animations still travel horizontally; `isMoving` continues to be true during jumps as it is today.
- Do not change the public API of any Runner method beyond adding/setting new fields.

### Requirement 2: Parabolic arc with apex over skipped cell (Decision 1 item 1, Decision 6)

Required behavior:

- During `progress 0.0 - 0.15`, the runner does not move horizontally or vertically — `pixelX` and `pixelY` stay at the takeoff cell.
- During `progress 0.15 - 1.0`, horizontal position interpolates from takeoff to landing (existing lerp, possibly with a new easing helper).
- Vertical offset is applied at render time in `display()` (or equivalent): `verticalOffset = isJumping ? Math.sin(remappedProgress * Math.PI) * -CELL_SIZE * arcAmplitude : 0`, where `remappedProgress = max(0, (progress - 0.15) / 0.85)` and `arcAmplitude = prefersReducedMotion() ? 0.3 : 1.0`.
- The offset is applied via `p.translate(0, verticalOffset)` inside the `display()` push/pop block.
- The apex of the arc (peak offset) coincides with `progress = 0.575` (i.e., `remappedProgress = 0.5`), which is when the runner is positioned midway between takeoff and landing — directly over the skipped cell.

Constraints:

- Do not change the horizontal interpolation curve unless a new easing helper is genuinely needed (document choice in progress report).
- Do not apply the vertical offset during move animations. Only when `isJumping` is true.
- The apex-over-skipped-cell placement is load-bearing. Document with a code comment so a future implementer doesn't tune the apex away.

### Requirement 3: Drop shadow (Decision 1 item 2)

Required behavior:

- New exported function `drawJumpDropShadow(p, runner, jumpProgress)` in `src/render/effects.js`.
- Called from `runner.display` when `runner.isJumping` is true.
- Renders a translucent dark ellipse at the runner's current horizontal position (which is moving toward the landing cell during the arc) and at the ground line (vertical-offset of 0, i.e., where the runner would be without the arc).
- Size and alpha modulate with arc height: smaller and lighter at apex, larger and darker at takeoff/land. Suggested: width and alpha scale linearly with `(1 - abs(verticalOffset / -CELL_SIZE))`.
- Reduced-motion: render at constant size and alpha throughout the jump. No modulation. Shadow still proves height (because the runner's rendered y differs from the shadow's y), but no animation.

Constraints:

- Shadow is drawn BEFORE the runner emoji so the emoji renders on top.
- Shadow must not conflict with `drawActiveRunnerGlow` or `drawAreaFreezeRunnerFlash`. The shadow is at the ground line (under the runner); the glow/flash are around the runner's body (above the shadow). Visually layered, not overlapping.

### Requirement 4: Converging takeoff lines (Decision 1 item 3)

Required behavior:

- New exported function `drawJumpTakeoffLines(p, runner, jumpProgress)` in `src/render/effects.js`.
- Called from `runner.display` when `runner.isJumping` is true AND `jumpProgress < 0.25`.
- Renders 2-3 short horizontal strokes on each side of the runner's feet, drawn close to the ground line of the takeoff cell. Initial stroke length and stroke weight per implementer's small visual prototype; suggested length ~CELL_SIZE * 0.2, weight ~2.
- Strokes are at full opacity from `progress 0.0 - 0.15`. From `progress 0.15 - 0.25`, length and opacity ramp linearly to zero. From `progress 0.25` onward, function returns early (renders nothing).
- Strokes are positioned at the *takeoff* cell, not the runner's current horizontal position. Once the runner has begun arcing, the lines remain anchored to the takeoff point.
- Color: a low-saturation muted color (suggested: gray or a very dim version of the team's accent). Implementer picks something that reads as "force lines" without clashing with the runner's emoji or the drop shadow.
- Reduced-motion: render strokes at full length and opacity for the single frame at `progress = 0.0`, then return early on all subsequent frames. No animation.

Constraints:

- Avoid more than 3 strokes per side (6 total). More reads as glitch art per the orchestrator's design note.
- Stroke weight must not visually compete with the runner emoji or barrier graphics.

### Requirement 5: Failed-jump partial-arc reversal (Decision 1 item 4)

Required behavior:

- When the jump target cell is blocked (existing detection logic that today routes to `startBounceAnimation`), instead invoke a new path that:
  - Sets `runner.isJumping = true` and `runner.jumpFailedReversal = true` (or equivalent state shape).
  - Plays the converging takeoff lines effect (anticipation reads correctly).
  - Arcs partway forward: peak vertical offset at ~60% of normal arc amplitude (i.e., `arcAmplitude = 0.6` for failed-jump reversal under normal motion; `0.2` under reduced motion).
  - Horizontal position travels to approximately the midpoint between origin and intended landing, then reverses back to origin. The math is: `pixelX = lerp(originPixelX, midpointPixelX, sin(remappedProgress * Math.PI))`, which peaks at midpoint and returns to origin.
  - Ends at the origin cell with `gridX = originGridX`, `gridY = originGridY`, `canJump = false` (jump availability was consumed even on failure per existing rules — verify this matches current behavior).
  - Existing `runner.actionResolved` event with outcome `"stayed"` and `runner.blockedOrBounced` event with the appropriate `reason` are still emitted (no narration/event change).
- Existing `startBounceAnimation` is preserved unchanged. Failed *moves* still use that path. Failed *jumps* use the new path.

Constraints:

- Do not change Plan 36 narration text.
- Do not change Plan 37 learning-moment classification (the `bounced` moment kind still fires for failed jumps, with the appropriate metadata).
- Do not allow the runner's final position to differ from origin by even one cell. Reversal must end exactly at the takeoff cell.

### Requirement 6: Synthesized jump SFX (Decision 1 item 5)

Required behavior:

- New `case "jump-takeoff":` in `playSound` at [src/ui/sound.js](src/ui/sound.js). Suggested composition: `tone(200, 80, 0.03, "triangle"); tone(380, 60, 0.025, "triangle");` — a rising whoosh. Implementer may tune frequencies/durations within reason.
- New `case "jump-land":` in `playSound`. Suggested composition: `tone(100, 60, 0.04, "square");` — a low thud. Implementer may tune.
- `playSound(state, "jump-takeoff")` invoked when `startJumpAnimation` returns true (jump succeeded in starting; whether it lands or fails is a separate matter, but the takeoff sound fires either way).
- `playSound(state, "jump-land")` invoked when `updateAnimation` transitions a jump to `progress >= 1` AND the jump succeeded (NOT failed-reversal).
- Optional: a small "fizzle" SFX on failed-jump reversal moment. Implementer's choice; document.

Constraints:

- No new audio asset files. SFX must be synthesized via the existing `tone()` function.
- SFX is gated on `state.soundEnabled` automatically (existing contract).
- SFX is ducked under active TTS automatically via Plan 39's `setNarrationDucking` — no new wiring needed.

### Requirement 7: Dust ring on landing (Decision 2 — Tier 2)

Required behavior:

- New exported function `drawJumpLandingDust(p, cellX, cellY, ringProgress)` in `src/render/effects.js`.
- Triggered at the moment a successful jump's `updateAnimation` transitions to `progress >= 1`. Implementer chooses state shape — likely a small per-cell or per-runner counter that decays over ~150ms (12-15 frames at 60fps).
- Renders a fast-expanding, fading gray circle (stroke, no fill) centered on the landing cell. Starts small and lightly transparent, expands to roughly `CELL_SIZE * 1.2` and fully transparent over the duration.
- Failed jumps do NOT trigger the dust ring.
- Reduced-motion: render a single-frame static gray circle at moderate radius (suggested `CELL_SIZE * 0.6`) and moderate alpha on the landing frame, then nothing. No expansion animation.

Constraints:

- The dust ring is a board-level effect, not per-runner. After the runner has moved to the landing cell, the runner's `display` no longer knows it just landed. The state needs to live somewhere a render-loop call can find it (suggested: a `state.activeJumpLandingDust = { cellX, cellY, framesRemaining }` field, updated in `updateAnimation`, drained in the render loop). Implementer chooses exact shape.
- The dust ring must not be drawn during Move animations or any non-Jump action.

### Requirement 8: Minimum duration floor (Decision 1 item 6)

Required behavior:

- The total visual jump duration (anticipation + arc + landing frame) must be at least 320ms regardless of `animationSpeedFactor`. Implementer may tune within 280-380ms; document the chosen value.
- The floor applies to jump animations only. Move animations continue to scale freely with the game-speed slider.
- Implementation pattern: clamp the per-frame `animationProgress` increment so that at max `animationSpeedFactor`, the jump still takes the floor duration to complete.

Constraints:

- Do not slow move animations.
- Do not change `BASE_ANIMATION_SPEED` for moves or any other action.
- The floor must not affect the proportion of time spent in anticipation vs. arc (anticipation stays at 0.0-0.15 of total progress).

### Requirement 9: Reduced motion paths (Decision 4)

Required behavior:

- Every new visual effect (drop shadow, converging takeoff lines, dust ring, arc) has a reduced-motion branch that consults `prefersReducedMotion()` and renders an alternative as specified in Decisions 1 and 2.
- Under reduced motion, a jump is still visually distinguishable from a move:
  - Arc still applies, at 30% amplitude.
  - Drop shadow still renders, statically.
  - Converging takeoff lines still render at the takeoff frame, statically.
  - Dust ring is replaced with a single-frame static circle at landing.
- SFX is unchanged under reduced motion. Audio doesn't have a "reduced motion" equivalent that's worth implementing in this packet.

Constraints:

- Do not skip the reduced-motion paths "for now." The contract is established by Plan 29 and Plan 49.
- Each reduced-motion branch is testable — note in the progress report which branches were exercised during manual testing.

### Requirement 10: Unit tests

Required behavior, in `tests/unit/jump-animation.test.js` (new) or as additions to `tests/unit/movement-and-collisions.test.js`:

- Arc offset math returns the expected vertical offset at `progress = 0.0` (0), `0.15` (still 0, anticipation), `0.25` (small positive offset starting), `0.575` (peak: `-CELL_SIZE`), `0.75` (descending), and `1.0` (0, landed). Note: offsets in p5 coordinates are negative for "up", so peak is `-CELL_SIZE`.
- Failed-jump reversal: a Runner with `isJumping = true` and `jumpFailedReversal = true`, starting at (originX, originY), ends with `pixelX = originX * CELL_SIZE`, `pixelY = originY * CELL_SIZE`, and `canJump = false` after `updateAnimation` reaches progress 1.
- Takeoff line opacity ramp: at `progress = 0.0` opacity is full (1.0), at `progress = 0.15` opacity is still full, at `progress = 0.20` opacity is ~0.5, at `progress = 0.25` opacity is 0.
- Minimum duration floor: at `animationSpeedFactor = 20` (max), the number of `updateAnimation` calls to complete a jump is at least the floor / 16ms (or whatever the frame budget calc resolves to).

Constraints:

- Tests use pure math; no DOM, no Blockly, no p5 instance.
- Add new test files to `package.json`'s `test:unit` allowlist.

### Requirement 11: Playwright spec

Required behavior, in `tests/browser/jump-animation.spec.js` (new):

- Open a guided level that has Jump Forward available and a known-passable jump (e.g., the `jump-the-gap` level if it's still in the campaign).
- Programmatically place a Jump Forward block in the workspace via test hooks.
- Start the level. Wait for the jump turn to begin.
- Assert that during the jump animation (mid-progress, before completion), the runner's rendered y-position differs from `gridY * CELL_SIZE` by more than a small epsilon — proving the arc renders.
- Assert that after the jump completes, the runner's `gridX` and `gridY` match the expected landing cell (no game-state regression).
- A second case: a level with a blocked jump target. Assert the runner's `gridX` and `gridY` equal the origin cell after the failed-jump animation, and `canJump` is false.

Constraints:

- The spec uses real browser pipeline. No bypassing DOM with test hooks beyond the workspace seeding.
- The spec asserts visible visual difference (rendered y) without asserting exact pixel values (which would be brittle).
- Existing modal-stability and key-capture specs are not touched.

### Requirement 12: Subsystem doc update

Required behavior:

- `docs/subsystems/p5-surface-map.md` gains a new section "Jump visuals" describing:
  - The four jump-specific effects (arc offset, drop shadow, converging takeoff lines, landing dust ring) and where their state lives.
  - The animation timeline (anticipation 0.0-0.15, arc 0.15-1.0, landing at 1.0).
  - The failed-jump reversal path, distinct from `startBounceAnimation`.
  - The minimum duration floor.
  - Reduced-motion behavior for each effect.

Constraints:

- The section uses the same heading style and tone as the rest of the file.
- Do not duplicate the contents of Plan 49's area-freeze section. Link if cross-reference is needed.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/jump-animation.test.js
node --test --test-isolation=none tests/unit/movement-and-collisions.test.js
npx playwright test tests/browser/jump-animation.spec.js --reporter=line
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line
npm test
npm run test:browser
npm run build
```

## Validation Checklist

- [ ] `Runner.js` has new `isJumping` field and (if applicable) `jumpFailedReversal` field; both reset in `resetToInitial`.
- [ ] `startJumpAnimation` sets `isJumping = true`; `startMoveAnimation` does not.
- [ ] `updateAnimation` clears `isJumping` at jump completion.
- [ ] Arc vertical offset applies during `progress 0.15 - 1.0` only; peak coincides with skipped cell.
- [ ] `drawJumpDropShadow` rendered during jump only; modulates with height under normal motion; static under reduced motion.
- [ ] `drawJumpTakeoffLines` rendered during `progress 0.0 - 0.25` only; lines anchored to takeoff cell; ramps to invisible under normal motion; static single frame under reduced motion.
- [ ] Failed-jump partial-arc reversal: distinct visual from failed-move bounce; ends at origin cell; `canJump` cleared; narration and learning-moment classification unchanged.
- [ ] `"jump-takeoff"` SFX fires at start of successful jump; `"jump-land"` SFX fires at end of successful jump.
- [ ] `drawJumpLandingDust` fires on successful landing only; expands and fades under normal motion; single-frame static under reduced motion.
- [ ] Minimum jump duration floor holds at max game-speed.
- [ ] Move animation unchanged in all respects.
- [ ] Existing `startBounceAnimation` (failed-move) unchanged.
- [ ] No emoji change at any point in the jump.
- [ ] No squash-and-stretch scaling applied to any runner emoji.
- [ ] No glow effect added for jump (converging lines replace the glow idea).
- [ ] No new audio asset files. All SFX synthesized.
- [ ] Reduced-motion paths exist for arc, shadow, takeoff lines, and dust ring; each is tested.
- [ ] Unit tests for arc math, reversal end position, takeoff line opacity ramp, and minimum duration floor pass.
- [ ] New unit test file added to `package.json`'s `test:unit` allowlist.
- [ ] Playwright spec confirms jump produces same final cell as expected; visual y-position differs mid-animation; failed jump returns to origin.
- [ ] Existing modal-stability and key-capture specs pass without modification.
- [ ] `npm test` passes with new tests included in the count.
- [ ] `npm run test:browser` passes.
- [ ] `npm run build` passes.
- [ ] `docs/subsystems/p5-surface-map.md` has the new "Jump visuals" section.
- [ ] Progress report lists tuning values chosen, cross-browser smoke results, and any temptations encountered (e.g., squash-and-stretch reconsiderations) that were rejected per the non-goals.

## Stop Conditions

Stop and report for owner review if:

- Squash-and-stretch starts to feel necessary to sell the jump (it should not — arc + shadow + lines + dust + SFX should be sufficient).
- The converging takeoff lines pattern proves visually unworkable (e.g., the lines blend into board grid lines or barrier graphics in a way that creates noise rather than clarity). Surface for visual-vocabulary adjustment before continuing.
- A reduced-motion path cannot be cleanly implemented for one of the effects (e.g., the dust ring "single-frame static circle" looks broken). Surface for design adjustment.
- Cross-browser smoke on the school Chromebook target shows the converging lines or dust ring rendering poorly. Surface before attempting workarounds.
- The minimum duration floor surfaces a timing conflict with Plan 25b's trace playback (e.g., the trace-then-jump sequence becomes too long to feel responsive). Surface for owner-mediated timing decision.
- A unit test reveals that today's `canJump` clearing behavior differs from what Decision 7 / Requirement 5 assume.
- The failed-jump reversal animation duration causes any narration timing or learning-moment classification side effect.
- Any change beyond the documented scope would be required to make the visual+audio work.

## Notes For Future Self

- **Crouch anticipation via squash-and-stretch** is the obvious stretch follow-up. Drop scoped here because the cross-browser emoji rendering quality risk on Chromebooks is unaddressed. A future micro-packet could prototype on actual target browsers and add only if acceptable. Combined with the converging takeoff lines, the result would be "lines converge + emoji briefly compresses + emoji leaps" — a polished three-beat takeoff. Wait for classroom evidence that students miss the takeoff cue before pursuing.
- **Other special abilities deserve parallel treatment.** Plan 49 did Area Freeze. Plan 52 does Jump Forward. Place Barrier currently has minimal visual signature; a future packet could give it its own (e.g., a brief "construction" particle effect at the placement cell). Be consistent with the visual vocabulary: each ability gets one distinctive board-level signature that obeys the reduced-motion contract.
- **Per-team SFX variants** could differentiate Team 1 jumps from Team 2 jumps audibly. Out of scope here (the existing SFX system is team-agnostic). A future packet could split the takeoff/land tones by team if classroom audio cues matter.
- **The minimum-duration floor pattern** is now established for jumps. If any future special ability also needs an animation that must not collapse under high game-speed, this pattern is the precedent: clamp the per-frame progress increment based on a minimum duration, independent of `animationSpeedFactor`.
- **The 2026-05-18 pilot student feedback** is the canonical user-story for this packet. Keep the credit visible: a real student noticed a real gap and the visual upgrade improves both polish and pedagogy. Future visual-flair packets that emerge from pilot feedback should follow the same evidence trail.
