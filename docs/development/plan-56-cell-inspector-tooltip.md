# Plan 56: Cell Inspector Tooltip

## Packet Metadata

- Packet id: plan-56
- Packet title: Cell Inspector Tooltip
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-19
- Packet type: implementation / accessibility / UI / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing the canvas/DOM boundary (e.g., moving any existing canvas-drawn overlay into DOM, or vice versa), before exposing any field the inspector does not yet show, before adding interaction beyond hover+tap+ESC
- Expected artifacts:
  - new DOM tooltip element rendered adjacent to the p5 canvas, positioned via `getBoundingClientRect()` like `src/ui/goalBurstOverlay.js`
  - hover, touch-tap-to-pin, and ESC-to-clear interactions wired through `src/ui/`
  - tooltip text content driven by a pure read of `state`, with no mutation
  - `aria-live="polite"` mirror so screen readers announce hovered/pinned cell content
  - unit tests for the content builder (pure function, given a `state` + `(col, row)` → list of lines)
  - Playwright smoke spec covering hover-shows-content, tap-pins-content, ESC-clears, and out-of-bounds-hides
  - subsystem note update in `docs/subsystems/p5-surface-map.md` adding the inspector to the canvas-adjacent DOM table
  - progress report
- Progress report folder: `reports/development/plan-56-cell-inspector-tooltip/`
- Progress report file: `reports/development/plan-56-cell-inspector-tooltip/progress.md`

## Packet Summary

Goal: Add a generalized cell inspector that surfaces grid state on demand. On hover (mouse) or tap (touch), an overlay shows the cell coordinate plus any entities present: runners (side, control type, index, frozen state, flag-carry, resource readiness), flags (carried-by status), barriers, level goal, flag bases. Works symmetrically for ally and enemy runners. Always renders into a DOM overlay layered over the p5 canvas, never into the canvas itself.

Why this matters pedagogically: students writing index-based or condition-based programs need a way to *read* runtime state, not just infer it from sprite movement. The inspector turns the runtime into a readable surface — closer to a debugger view than a sprite — which directly supports the AP CSA transfer goal of boolean reasoning over named state.

Non-goals:

- Do not show NPC intent, planned next move, or any non-ground-truth field. Showing intent leaks the prediction-as-strategy loop and is explicitly out of scope.
- Do not show any rendering this packet has not already specified. If a candidate field exists on state but is not in the list below, stop and ask before adding it.
- Do not change collision, scoring, or any other rule. Inspector is read-only.
- Do not draw the tooltip into the p5 canvas. Use a DOM element. Canvas-drawn text fails the accessibility requirement.
- Do not add a keyboard cell-cycling navigation mode in this packet — that's a follow-up. Mouse hover + touch tap + ESC is enough.
- Do not gate the inspector behind a setting. It is always on. (Frequency-of-use is high enough that a toggle adds friction without a clear benefit.)
- Do not deploy.

Depends on:

- `src/ui/goalBurstOverlay.js` as the existing reference pattern for a canvas-adjacent DOM overlay positioned by canvas bounding box, including scroll/resize reposition.
- p5 surface map note (`docs/subsystems/p5-surface-map.md`) — the canvas-vs-DOM table is the authoritative seam this packet extends.

Blocks:

- Plan 57 (Settings Gear Panel) and Plan 58 (Runner Index Badges) can land in either order relative to this one, but the inspector is the canonical place students will look for "what's the index of this ally?" so it ships first.

Why this packet exists:

A pilot session on 2026-05-19 surfaced two real problems on Level 30 (Index Jobs): (a) students could not visually tell which ally was index 0 vs index 1, and (b) the p5 board was getting visually crowded with frozen badges, leaving little room for new always-on visuals. A generalized hover/tap inspector solves both: it exposes the index (and every other relevant state field) on demand, without committing to any always-on visual decoration.

The inspector also pays dividends across the curriculum, not just for index-themed levels: it makes "is this ally frozen?", "is that enemy carrying the flag?", "what's at (4, 3)?" inspectable without writing a sensor block.

## Required Reading

- `docs/subsystems/p5-surface-map.md` — canvas vs DOM seam; the inspector extends the canvas-adjacent DOM table.
- `src/ui/goalBurstOverlay.js` — reference implementation for a canvas-adjacent DOM overlay positioned by canvas bounding box, including scroll/resize repositioning behavior.
- `src/render/p5App.js` — where the p5 instance is created and where canvas DOM mounting happens; gives the canvas container the inspector will attach to.
- `src/core/state.js` — state shape. The inspector reads from `state` and `app`. Required so the implementer confirms the exact field names (`allRunners`, `gameFlags`, etc. — verify with `rg` before assuming).
- `src/entities/Runner.js` — runner property names (the inspector lists side, control kind, index, frozen, flag-carry, resource readiness; verify each property name).
- `src/core/levels.js` — `getLevelGoalCell(app)` for the goal-cell line.
- `src/config/constants.js` — `CELL_SIZE` for the column/row math.
- `docs/ARCHITECTURE.md` — section on where DOM UI lives (`src/ui/`).

Optional / contextual:

- `src/ui/tutorialOverlay.js` — second example of a DOM overlay positioned over the canvas.
- `docs/TESTING.md` — Playwright conventions for new smoke specs.

## Scope

In scope:

- New file `src/ui/cellInspectorOverlay.js` that owns the DOM element, position math, hover/tap/ESC handlers, and `aria-live` mirror.
- A small pure function `buildInspectorLines(state, app, col, row) → string[]` (export from the same file or a sibling). This is the testable surface.
- Hook the overlay's lifecycle into `src/main.js` or wherever `goalBurstOverlay` is initialized so it mounts/unmounts at the same boundary.
- Tooltip rendering: cell coordinate always; then runners on cell, flags on cell, barriers on cell, level goal marker, flag base marker — list everything that coincides.
- Mouse hover (move → reposition + repopulate; leave → hide unless pinned).
- Touch tap-to-pin (tap inside canvas → pin tooltip to that cell; tap outside or tap same cell → unpin).
- ESC anywhere → unpin and hide.
- Reposition on scroll/resize like the goal burst overlay.
- Update during a running turn (live). Acceptable extra work each frame because the tooltip content builder is a single pass over `state.allRunners` plus a handful of array lookups; if perf becomes visible on classroom hardware it is a follow-up packet, not a blocker here.
- CSS in an appropriate components stylesheet under `src/assets/styles/components/`, matching the dark-card visual language of the existing modal cards but smaller and lighter (no backdrop).
- Unit tests for `buildInspectorLines` covering: empty cell, cell with one ally runner, cell with one enemy runner, cell with carried flag, cell with placed barrier, cell with level goal, multi-entity cell (e.g., enemy runner + flag base + flag), frozen runner, runner carrying flag, runner with jump unavailable.
- Playwright smoke spec: load a level, move mouse over the ally, confirm tooltip text contains "Ally" and a coordinate; tap on a cell on a touch viewport, confirm tooltip pins; press ESC, confirm unpin.

Out of scope:

- Adding a keyboard cycling mode (Tab to next cell, arrows to move). Follow-up.
- Allowing the inspector to display any state field not listed. If a field looks worth showing and isn't here, stop and ask.
- Showing planned/intended moves, scheduled NPC actions, or any speculative state.
- Persistence (pinned cell does not survive reload).
- Any change to existing canvas rendering.

Files and areas likely touched:

- `src/ui/cellInspectorOverlay.js` (new)
- `src/main.js` (mount/init)
- `src/assets/styles/components/cellInspector.css` (new) or an existing components stylesheet
- `index.html` — only if a sibling DOM root is needed next to `#canvas-container`; prefer creating the element in JS like `goalBurstOverlay.js`
- `tests/unit/cell-inspector.test.js` (new)
- `tests/browser/specs/cell-inspector.spec.js` (new, smoke tier)
- `docs/subsystems/p5-surface-map.md` (canvas-vs-DOM table update + a short subsection on the inspector)

## Work Plan

1. Inspect current state shape and confirm field names with `rg`. In particular, confirm: `state.allRunners`, runner properties for side (`team`?), control kind (human vs code vs NPC — exact field), `allyIndex`, frozen state (`isFrozen`, `frozenTurnsRemaining`), flag-carry, `canJump`, barrier resource. Document the actual names you found at the top of the progress report. If a property you expected does not exist, stop and ask.
2. Build the pure function `buildInspectorLines(state, app, col, row)` and its tests first. No DOM yet.
3. Build the DOM overlay using `goalBurstOverlay.js` as the structural reference (canvas-adjacent, positioned by `getBoundingClientRect`, scroll/resize reposition). The overlay owns its own element creation and event listeners.
4. Wire hover, tap, and ESC.
5. Add the `aria-live="polite"` mirror node. When the pinned/hovered content changes, write the same string list (joined with commas or periods) into the aria-live node; debounce light updates so a hovering mouse does not spam the live region.
6. Add CSS.
7. Run unit + browser smoke. Confirm coverage of all listed scenarios.
8. Update the subsystem note.
9. Write the progress report. List every state property you read, every event you registered, and any open follow-ups.

## Implementation Requirements

### Req 1: DOM, not canvas

Required behavior: The inspector renders into an absolutely positioned `<div>` overlay anchored to the canvas container, not into p5 draw calls.

Constraints:

- Must not appear inside `src/render/`. The render directory is for canvas rendering only.
- Must not extend the p5 `draw()` loop. The overlay updates on DOM events (mousemove, touchstart, scroll, resize, ESC, internal state changes), not per-frame.

Edge cases:

- During an animating turn, `state` is changing. The tooltip should rebuild its lines whenever (a) the pointer moves to a new cell, (b) a turn boundary advances state, or (c) the pinned cell exists and its contents changed. A small subscription mechanism (e.g., on each `processTurnActions` boundary, ask the overlay to rebuild) is acceptable; an interval-based poll is acceptable as a fallback. Document which approach was chosen and why.
- Canvas resizes when the level changes or when the window resizes. Use the same reposition trigger pattern as `goalBurstOverlay`.

Expected artifact: `src/ui/cellInspectorOverlay.js` with a `initCellInspectorOverlay(app)` entry point.

### Req 2: Content surface — exact lines

Required behavior: The pure function `buildInspectorLines(state, app, col, row)` returns an ordered list of human-readable strings for the inspector to display. Exact lines (and only these lines) for v1:

1. Cell coordinate: `Cell: (col, row)`
2. Level goal marker if `getLevelGoalCell(app)` matches the cell: `Level goal`
3. Flag base markers (if a team's flag base is on this cell): `Team {teamId} flag base`
4. Flag markers (if a flag is on this cell, including a carrier line if carried): `Team {teamId} flag` (and below if carried, `  carried by {side} runner`)
5. Barrier marker if a barrier is on the cell: `Barrier (placed by Team {teamId})` if barrier ownership is exposed; otherwise just `Barrier`
6. For each runner on the cell:
   - `{Side} runner #{index}` for code-controlled (index suppressed if not applicable)
   - `{Side} human player` for human-controlled
   - `{Side} NPC runner` for NPC
   - sub-line `  Frozen ({N} turns remaining)` if frozen
   - sub-line `  Carrying flag` if carrying a flag
   - sub-line `  Jump: available` or `  Jump: used this round` — only if the runner has a jump resource concept at all (verify with `rg`)
   - sub-line `  Barrier: available` or `  Barrier: used this round` — only if the runner has a barrier resource concept at all

Constraints:

- Side labels are `Ally` / `Enemy` from the local viewport perspective. For PvP / Free Play hot-seat, use `Team 1` / `Team 2` instead. Determine viewport perspective from existing state (the same source the scoreboard uses); do not hardcode.
- No emoji prefixes. The aria-live mirror reads aloud and emoji become noise.
- Do not include any speculative or intent fields. If you find yourself wanting to display "next planned move", stop.
- If a runner property name is uncertain, fall back to *not displaying that line* rather than guessing a property name. Document the omission in the progress report.

Edge cases:

- Multi-entity cells: list everything. A runner standing on a flag base while carrying a flag should produce: cell coord, flag base, flag (with carrier sub-line), runner (with carrying sub-line).
- Empty cell: only the coordinate line.
- Out-of-grid coordinates: function returns `null` (or an empty list — pick one and stick to it); the overlay treats this as "hide tooltip."

Expected artifact: pure function and its tests.

### Req 3: Interaction model

Required behavior:

- Mouse hover over canvas → tooltip appears near pointer, positioned to avoid overflowing the viewport (mirror the existing pattern from any existing positioned tooltip if one exists; otherwise: prefer right-of-cursor, flip to left if it would overflow the right edge, prefer below cursor, flip above if it would overflow the bottom).
- Mouse leave canvas → tooltip hides (unless pinned).
- Tap on canvas (touch) → pin tooltip to that cell. The pinned tooltip displays the same content as a hover, but persists.
- Tap same pinned cell again → unpin.
- Tap a different cell while pinned → re-pin to the new cell.
- ESC key anywhere → unpin and hide.
- Pinned tooltip survives turn-state changes; its content rebuilds when state changes.

Constraints:

- Must not interfere with existing canvas click/tap handlers if any exist. Verify by running the keyboard/touch suite after wiring.
- Must not consume key events outside ESC. Reuse the project's existing `handleKeyInput` routing rather than adding a parallel keydown listener at the window level.

Edge cases:

- Touch device with no hover: hover code paths should be no-ops on touch (use pointer events with `pointerType === 'mouse'` to gate hover, and `pointerType === 'touch'` to gate tap-to-pin; or use `mousemove` and `touchstart` separately).
- Stylus / hybrid devices: prefer Pointer Events.

Expected artifact: event wiring in `cellInspectorOverlay.js`.

### Req 4: Accessibility surface

Required behavior:

- The tooltip element is `role="tooltip"`.
- A separate `aria-live="polite"` node (visually hidden) mirrors the tooltip's text content as a single concatenated string when the tooltip becomes visible or its content changes.
- When the tooltip hides, the aria-live node is cleared.
- The visually hidden aria-live node uses the project's existing `.sr-only`-style class if one exists; otherwise inline the standard pattern (`position: absolute; width: 1px; height: 1px; clip: rect(0 0 0 0); overflow: hidden;`).

Constraints:

- Debounce aria-live updates so a mouse moving across cells does not produce 60 announcements per second. A 150 ms debounce on aria-live content (but not on tooltip visual update) is the default.
- Plan 36 narration already uses `aria-live`; verify the inspector's polite region does not collide. Use a distinct node with `aria-atomic="true"`.

Edge cases:

- Screen readers already announcing turn narration: the inspector announcements will queue behind. That is the correct behavior — polite means polite.

Expected artifact: `aria-live` node creation and update path.

### Req 5: Visual style

Required behavior: Small dark card, soft shadow, ~12 px text, no header chrome. Reuse the visual idiom of existing UI cards but smaller. The tooltip should feel like a debugging panel, not a marketing tooltip.

Constraints:

- No more than ~280 px wide for typical content; allow grow to fit longer multi-entity cells.
- Respect `prefers-reduced-motion`: no fade-in/out animation if the user prefers reduced motion. Otherwise a 80–120 ms fade is fine.
- Color contrast ≥ 4.5:1 between text and card background.
- Z-index above canvas but below modals.

Expected artifact: a stylesheet under `src/assets/styles/components/`.

### Pedagogy checks

- Does this help students reason about `if`, `else`, comparisons, runner index, resource readiness? **Yes** — every named state field corresponds to a sensor block category.
- Does it preserve the one-action-per-turn execution model? **Yes** — read-only.
- Does it support decentralized ally behavior? **Yes** — index becomes visible without writing a sensor.
- Does it encourage prediction, debugging, iteration? **Yes** — that's the entire point.
- Is it usable on classroom projectors, narrow screens? **Yes** — DOM overlay scales with viewport.
- Keyboard, color contrast, sound, motion, screen reader: keyboard ESC, contrast ≥ 4.5:1, no sound, reduced-motion respected, aria-live mirror in place.

## Model-Specific Instructions

- Summarize the job in your own words before editing. List the exact files you will touch.
- Before assuming any property name on `state` or a runner, verify with `rg`. The previous attempt at this work used several incorrect property names; do not repeat that.
- Write `buildInspectorLines` and its tests first. Do not start on DOM until that pure function is green.
- Do not draw into the canvas. If you find yourself opening `effects.js` or `drawEntities.js` for this packet, stop — you are in the wrong file.
- Do not change the `draw()` loop in `p5App.js`. Do not add a per-frame call.
- Do not introduce any new always-on visual decoration on the board. That is Plan 58, not this packet.
- If you discover the property names imply enemy runners have an index too, do not surface it in v1 — index labeling for enemies is Plan 58's call to make.
- Stop and ask if: a needed property is missing, the DOM seam differs meaningfully from `goalBurstOverlay`, the subsystem note conflicts with what you found, or any test you write reveals a real bug in `state` shape.
- Do not run `git checkout` or any destructive command to recover from a bad edit. Use targeted Edit calls.

## Commands

```powershell
npm install
npm test
npm run build
npm run test:browser:smoke
npm run lint:levels
```

## Validation Checklist

- [ ] `buildInspectorLines` unit tests cover empty cell, ally runner, enemy runner, frozen, flag-carrier, barrier, level goal, flag base, multi-entity cell.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:smoke` passes, including the new inspector smoke spec.
- [ ] Inspector tooltip never appears inside the p5 canvas (visually inspect during smoke; the DOM element must be a sibling, not a canvas drawing).
- [ ] Hover over an ally on Level 30 shows the ally index in the tooltip.
- [ ] Touch tap pins; ESC unpins.
- [ ] aria-live mirror node is in the DOM and updates when tooltip text changes; verify with a quick devtools snapshot in the progress report.
- [ ] No unrelated files changed.
- [ ] `docs/subsystems/p5-surface-map.md` still reads true post-change. Specifically: the canvas-vs-DOM table now lists the inspector under DOM; the `draw()` loop description is unchanged.
- [ ] No new always-on canvas visual was introduced.
- [ ] Final report lists property names confirmed, commands run, and follow-ups.

## Stop Conditions

Stop and request review if:

- A property you need for inspector content does not exist with the name you expected.
- The `goalBurstOverlay` pattern cannot be reused (e.g., the canvas container has moved) and a new mount strategy is needed.
- Adding the live-during-turn rebuild introduces visible jank on smoke-tier hardware.
- The aria-live region collides observably with Plan 36 narration.
- A subsystem note other than `p5-surface-map.md` turns out to also need editing.
- Any pedagogy concern surfaces — e.g., an enemy field that students would interpret as "the enemy AI told me its plan."
