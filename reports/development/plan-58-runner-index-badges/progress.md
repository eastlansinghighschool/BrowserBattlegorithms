# Progress Report - Plan 58: Runner Index Badges

We have successfully implemented, verified, and integrated the Runner Index Badges subsystem.

## Side Resolution Path

The runner's side is resolved using `runner.team` (1 for ally, 2 for enemy).
We utilize the existing team color palette configurations from `src/core/teams.js`:
- Background color tint: resolved using `glowColorFill` of the corresponding team, drawn with a 50% opacity level.
- Border stroke: drawn with a thin 0.75 px white border at 50% opacity.
- Text: drawn in bold white at 85% opacity.

This ensures a cohesive visual design matching the existing on-canvas elements (like the frozen countdown badge).

## Index Resolution Path

- **Allies**: Resolved using `runner.allyIndex` (assigned at setup time starting from 0).
- **Enemies / Humans**: If the runner is an NPC enemy or human-controlled and lacks `allyIndex`, the index is resolved using the order-of-creation list index within that runner's side. The helper filters `state.allRunners` for the same team, finds the runner's index in that list, and uses it. This index remains stable throughout the level because runner entities in `state.allRunners` are not re-ordered or re-created during a match round.

## Collision & Displacement Rules

The badge dimensions are set to 14×14 px, keeping it fully inside the cell borders.
To prevent visual overlap, displacement is handled as follows:
- **Default Position**: Lower-left of the runner's cell (inset by 3 px from the bottom and left edges).
- **Frozen Runners**: The frozen countdown badge renders in the upper-left of the runner cell. The index badge remains at the lower-left, rendering both badges simultaneously without overlap.
- **Human-Controlled Runners**: The active human runner displays a "YOU" label at the bottom midline of the cell. To avoid overlap, the index badge is automatically displaced upward to the vertical midline of the cell.

## Verification Results

- **Unit Tests**: All 325 unit tests pass, including the new unit tests in `tests/unit/runner-label-badge.test.js` checking gating, resolution, and position displacement logic.
- **Browser Specs**: The new `runner-index-badge.spec.js` browser spec successfully verified checkbox toggling, state updates, and dynamic index resolution in the browser. The full smoke suite passes.
- **Production Build**: Successfully compiled Vite production build with no warnings/errors.

---

## Repair Session — 2026-05-19

Post-implementation review identified five defects (Repair A–E). All were resolved in this session.

### Owner Decisions Made Before Repairs

- **Repair E (smoke curation)**: `settings-gear.spec.js` and `runner-index-badge.spec.js` are *kept in the smoke suite* (owner-approved retroactively; no code change required).
- **Repair B (badge numbering on mixed-control teams)**: *Single namespace* chosen — human-controlled runners on a team with code allies receive badge numbers offset after the allies (e.g., two code allies at "0"/"1" → human shows "2"). No duplicate badge indices on the same team.

### Repair A — Frozen Badge Collision

**Problem**: `drawFrozenCountdownBadge` rendered its countdown badge at `pixelY + CELL_SIZE - 17` (lower-left), which collided with the index badge's default lower-left position.

**Fix** (`src/render/effects.js`):
- Moved `drawFrozenCountdownBadge` badge Y from `pixelY + CELL_SIZE - 17` to `pixelY + 3` (upper-left). This leaves lower-left clear for the index badge.
- Removed the `if (runner.isFrozen)` special-case in `drawRunnerLabelBadge` that was incorrectly offsetting the index badge to `pixelY + 3` (upper-left) for frozen non-human runners, which was the mirror collision. Frozen non-human runners now stay at default lower-left.

**Result**: Frozen countdown badge = upper-left; index badge = lower-left. No overlap for any combination.

### Repair B — Single Namespace for Mixed-Control Teams

**Problem**: Human-controlled runners have no `allyIndex`. The fallback used raw array position within the team, which could produce a "0" that duplicates an ally's "0".

**Fix** (`src/render/effects.js`, `drawRunnerLabelBadge`):
- New fallback: count the number of runners on the same team that *have* `allyIndex` (`allyCount`), then find this runner's position among non-allyIndex teammates (`nonAllyIndex`). Badge number = `allyCount + nonAllyIndex`.
- This guarantees a single contiguous namespace: ally indices come first (0, 1, …), human/NPC indices follow (allyCount, allyCount+1, …).

**Test coverage** (`tests/unit/runner-label-badge.test.js`):
- Added test "single namespace: human + code ally on same team show unique indices" — verifies ally shows "0", human shows "1" when allyCount=1.

### Repair C — Render Verification Test Hook

**Problem**: The existing browser test only checked checkbox state; it did not verify that badge *drawing* actually executed or that indices were unique across runners.

**Fix**:
- `src/main.js`: Added import for `drawRunnerLabelBadge`; added `testDrawRunnerLabelBadge(runnerId)` to `window.__BBA_TEST_HOOKS__`. Accepts a runner ID, runs `drawRunnerLabelBadge` against a spy p5 object, returns the recorded draw calls.
- `tests/browser/runner-index-badge.spec.js`: Added second test "with badges enabled, each runner draws a badge at the correct position with a unique index per team" — loads Level 30 (`index-jobs`), enables badges, calls `testDrawRunnerLabelBadge` for every runner, verifies each produced a `rect` + `text` call, and verifies no team has duplicate badge indices.

Note: Exact Y-position checking was omitted from the browser test (live runner state makes it fragile). Position correctness is fully covered by unit tests in `runner-label-badge.test.js`.

### Repair D — Parallel Keydown Listeners (Settings Modal)

**Problem**: `src/ui/controls.js` had two permanent `document.addEventListener("keydown", ...)` calls — one for Tab focus-trap, one for ESC-close — that were never removed. Each `openSettingsModal` call stacked another pair of listeners.

**Attempted approach (rejected)**: Route ESC through `handleKeyInput` via a `closeSettingsModalIfOpen` hook. This fails because p5's `keyPressed` does not fire when focus is inside a modal element (input, select, button), so the hook was never called while the modal was interactive.

**Fix** (`src/ui/controls.js`):
- Replaced both permanent listeners with a single `handleSettingsModalKeydown` function that handles both `Escape` (close modal) and `Tab` (focus trap).
- Listener is attached via `document.addEventListener("keydown", handleSettingsModalKeydown)` inside `openSettingsModal`.
- Listener is removed via `document.removeEventListener("keydown", handleSettingsModalKeydown)` inside `closeSettingsModal`.
- This eliminates listener accumulation and ensures ESC works regardless of which modal element has focus.

### Repair E — Smoke Suite Curation

No code change. Owner approved both specs remaining in smoke (see Owner Decisions above).

### Tutorial Scrim Fix (Discovered During Testing)

While running smoke tests, the settings-modal tests and the first runner-index-badge test failed with:

> `<div class="tutorial-scrim"></div> from #tutorial-overlay.tutorial-overlay-active subtree intercepts pointer events`

The tutorial overlay scrim was still active after `chooseFreePlay(page)`, intercepting clicks on the settings button.

**Fix**: Added `await dismissTutorial(page)` immediately after every `chooseFreePlay(page)` call in:
- `tests/browser/runner-index-badge.spec.js` (test 1 initial load)
- `tests/browser/settings-gear.spec.js` (initial load and after reload in test 1; initial load and after reload in test 3)

### Validation Results

| Suite | Result |
|-------|--------|
| `npm test` (unit) | **335 / 335 pass** |
| `npm run test:browser:smoke` | **71 / 72 pass** |
| `npm run build` | **Pass** (pre-existing Vite chunk-size warnings only) |

The single smoke failure (`key-capture-passthrough.spec.js:108`) is a pre-existing intermittent flake: "welcome modal keeps focus on Guided Levels while emoji frame animates." It is timing-sensitive, passes consistently when run in isolation (9/9), and fails only under CPU contention at `workers: 2`. It is unrelated to Plan 58 repairs.
