# Plan 57: Settings Gear Panel

## Packet Metadata

- Packet id: plan-57
- Packet title: Settings Gear Panel
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-19
- Packet type: implementation / UI / accessibility / persistence / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before introducing a new persistence layer beyond `localStorage`, before changing the meaning of `state.soundEnabled` or `prefers-reduced-motion`, before extending the gear to settings not listed in this packet
- Expected artifacts:
  - new gear icon button in the app header
  - new settings modal reusing the existing `.program-modal` visual idiom
  - migration of existing inline toggles (`#turnLogToggle`, `#coachingModeToggle`, `#voiceNarrationToggle`) and the existing `#soundToggleButton` into the gear
  - new toggles for low-motion override, runner movement animations, runner jumping animations, frozen-badge visibility, runner-index-badge visibility
  - global persistence to `localStorage` under a shared key prefix
  - `prefersReducedMotion(state)` honored across every effect site in `src/render/effects.js` (not just one)
  - focus trap, focus return, and ESC handling for the gear modal
  - unit tests for the persistence helper and default-resolution logic
  - Playwright smoke spec covering: gear opens, toggles persist across reload, ESC closes, focus returns to gear button
  - subsystem note update in `docs/subsystems/ui-mode-contract.md` (and `p5-surface-map.md` if a new render path is gated by a setting)
  - progress report
- Progress report folder: `reports/development/plan-57-settings-gear-panel/`
- Progress report file: `reports/development/plan-57-settings-gear-panel/progress.md`

## Packet Summary

Goal: Consolidate every UI-level preference into a single gear-icon modal. The modal absorbs the existing inline toggles (turn log, coaching mode, voice narration) and the existing sound button, and adds six new toggles: low-motion override, runner movement animations, runner jumping animations, show frozen badges, show runner-index badges, and (placeholder, gated by Plan 58) any future on-board visibility toggles. All settings persist to `localStorage` globally — not per-mode and not per-level. Defaults are conservative (low-motion off, animations on, frozen badges on, runner-index badges OFF).

Why this matters: the current control strip is crowded and the next packet (Plan 58) introduces another visibility toggle. Without a gear, every new toggle either lives inline (clutter) or is invisible (undiscovered). Consolidation now is the right move before Plan 58 lands.

Non-goals:

- Do not change game rules, level data, or any pedagogy.
- Do not introduce a new persistence layer beyond `localStorage`. Stay consistent with how Plan 38/39 persist their settings.
- Do not move settings into per-mode storage. One global value per setting.
- Do not add settings outside the six listed plus the four migrated. If you find another candidate, list it as a follow-up; do not add it.
- Do not re-design the existing modal CSS. Reuse `.program-modal`, `.program-modal-backdrop`, `.program-modal-card`, `.program-modal-check` exactly as they are.
- Do not change what `prefers-reduced-motion` means at the OS level; the low-motion toggle is an *override that ORs with the OS-level preference*.
- Do not deploy.

Depends on:

- Existing modal scaffolding (`#programExportModal`, `#privateImportModal`) for visual and structural reuse.
- `src/ui/sound.js` for the unified sound toggle (game SFX). Blockly's native sounds are read at inject time and live toggling does not work; this packet accepts reload-required for Blockly's audio and surfaces a single sentence in the modal explaining that.
- Plan 49 `prefersReducedMotion()` helper in `src/render/effects.js`. This packet broadens its use.

Blocks:

- Plan 58 (Runner Index Badges) — that packet's `showRunnerIndexBadges` toggle lands here; Plan 58 just adds the badge rendering controlled by that toggle.

Why this packet exists:

The integration owner identified two motivating signals during a 2026-05-19 Level 30 session: (a) the control strip is visibly crowded and adding more visibility toggles inline is not viable, (b) classroom accommodations (low motion, sound off, animation off) are scattered across inline controls, OS preferences, and existing modals. A single gear gives teachers one place to set classroom accommodations and gives the codebase one place to grow new visibility/preference toggles.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-19):

### Decision 1: Move every existing UI-level toggle into the gear

Turn Log, Coaching Mode, Voice Narration, and Sound all move into the gear. The pre-gear inline locations are removed. Rationale: one source of truth beats split visibility. Voice rate slider and voice picker (from Plan 39) also belong in the gear; if they were inline, move them.

### Decision 2: Global persistence

One `localStorage` value per setting, shared across Guided and Free Play. The previous practice of letting Guided and Free Play diverge applies to *program state and level state*, not to UI preferences.

### Decision 3: Defaults

- `soundEnabled`: true (unchanged)
- `coachingMode`: existing default (do not change)
- `voiceNarrationEnabled`: false (unchanged from Plan 39 default-off)
- `turnLogVisible`: existing default (do not change)
- `lowMotionOverride`: false (OS preference still applies; this toggle ORs with it)
- `runnerMovementAnimations`: true
- `runnerJumpingAnimations`: true
- `showFrozenBadges`: true
- `showRunnerIndexBadges`: **false** (default off; students enable on index-themed levels)

### Decision 4: Blockly sound is reload-required

Blockly reads its `sounds` option at injection time. Live toggling is not supported by this packet. The gear's sound toggle controls game SFX immediately and surfaces a single sentence in the modal: "Blockly editor sounds change on reload." A future packet can re-inject if it turns out to matter.

### Decision 5: `prefersReducedMotion` reach

The helper currently has one caller in `Runner.updateAnimation` (jump arc). This packet broadens the call site set so that every motion path in `src/render/effects.js` (active-runner glow pulse, area-freeze pulse, area-freeze flash, jump dust, takeoff lines, jump drop shadow) checks `prefersReducedMotion(state)` rather than only `window.matchMedia(...)`. The `lowMotionOverride` setting therefore actually affects motion across the board.

### Decision 6: Reduced-motion vs animation toggles — semantics

There are now three motion controls. Defined precedence:

1. If `runnerMovementAnimations` is off → runners snap to target cell with no slide easing. Jumps still arc if `runnerJumpingAnimations` is on.
2. If `runnerJumpingAnimations` is off → jumps snap (no arc, no shadow, no takeoff lines, no dust). Movement still slides if `runnerMovementAnimations` is on.
3. If `lowMotionOverride` is on OR the OS reports `prefers-reduced-motion: reduce` → all motion paths take the reduced-motion code path (subtler arcs, no pulses), but animations still play unless the per-feature toggles disable them.

In short: per-feature toggles are *off/on*; low-motion is *style*. They compose: a feature can be both reduced-motion and off (no-op), reduced-motion and on (subtle), or full and on (normal). The teacher copy in the modal explains this in plain language.

### Decision 7: Modal scaffolding

Reuse `.program-modal` classes. The gear modal is the same component family as the existing private-import and export modals; visual consistency wins.

### Decision 8: Focus management

The gear modal must have a focus trap, restore focus to the gear button on close, and close on ESC. This is the same accessibility standard the Plan 31 modal stability regression suite holds existing modals to; do not regress.

## Required Reading

- `docs/subsystems/ui-mode-contract.md` — what UI lives where; the gear belongs to global UI, not mode-scoped UI.
- `docs/subsystems/p5-surface-map.md` — to confirm the new toggles do not change the canvas/DOM seam.
- `src/ui/controls.js` — every inline toggle that gets migrated lives here; also where the new gear bindings go.
- `src/core/state.js` — defaults and persistence loading. Read carefully; the previous attempt used six near-identical 6-line ternaries for localStorage — please centralize into a helper instead.
- `src/render/effects.js` — every motion-path call site that needs to honor `prefersReducedMotion(state)`.
- `src/entities/Runner.js` — already calls `prefersReducedMotion()`; this packet plumbs `state` to it.
- `src/core/turnEngine.js` — only to confirm the `updateAnimation` call passes the right `state`.
- `src/ai/blockly/workspace.js` — for the reload-required Blockly sound note.
- `src/ui/sound.js` — for the SFX toggle (already exists; do not duplicate).
- `index.html` — gear button mount point, modal markup.
- `src/assets/styles/components/blockly.css` — existing modal CSS to reuse (do NOT modify the existing rules; add a new section if anything is genuinely needed).
- Test conventions:
  - `tests/unit/freeze-visualization.test.js` — example of how badge gating is tested today; the new `showFrozenBadges` toggle must not break this test or it must be updated explicitly with rationale.

Optional / contextual:

- `docs/TeacherGuide.md` — if the gear becomes part of the teacher-facing surface, the guide may want an update; surface as a follow-up packet rather than doing it here.

## Scope

In scope:

- New gear button in the app header, with the existing icon-button styling.
- New `#settingsModal` modal with the six new toggles plus the four migrated ones.
- Removal of the inline `#soundToggleButton` and the inline `#turnLogToggle`/`#coachingModeToggle`/`#voiceNarrationToggle` rendering (the *DOM IDs* may move into the modal; do not delete the persistence/event logic, just relocate the markup).
- A small persistence helper, e.g.:

  ```js
  // pseudocode
  function loadPreference(key, defaultValue, parser = String) {
    if (typeof window === "undefined" || !window.localStorage) return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return parser(raw);
  }
  function savePreference(key, value) { /* … */ }
  ```

  All settings load through this helper. State defaults are initialized with it in `createInitialState`.
- All new and migrated settings persist under the key prefix `bba:settings:` (e.g., `bba:settings:sound-enabled`, `bba:settings:low-motion-override`, `bba:settings:show-runner-index-badges`). Migrate the existing `bba:sound-enabled` key to `bba:settings:sound-enabled` with a read-old/write-new fallback so returning students do not lose their preference.
- `prefersReducedMotion(state)` updated to consult `state.lowMotionOverride` (renamed from any prior `lowMotionMode`); every motion call site in `src/render/effects.js` and `src/entities/Runner.js` that does `prefersReducedMotion()` becomes `prefersReducedMotion(state)`.
- New `state` properties: `lowMotionOverride`, `runnerMovementAnimations`, `runnerJumpingAnimations`, `showFrozenBadges`, `showRunnerIndexBadges` (default false), with localStorage round-trip.
- Existing `state.soundEnabled` remains, now loaded through the helper.
- Focus trap, focus return, ESC on the gear modal — match Plan 31's modal stability standard.
- Unit tests: persistence helper (mocked `localStorage`), default resolution when no stored value, round-trip, malformed stored value handling.
- Playwright smoke spec covering gear-opens, each new toggle is present, each new toggle persists across `page.reload()`, ESC closes, focus returns.

Out of scope:

- Adding the index-badge *rendering* gated by `showRunnerIndexBadges`. That is Plan 58.
- Per-level or per-mode setting variants.
- Migrating any setting to a sync'd account / cloud store.
- New animation feature work.
- Restyling any existing modal.

Files and areas likely touched:

- `index.html` — gear button, new modal markup, removal of inline toggle markup that moves into the modal.
- `src/ui/controls.js` — wire gear button, modal open/close, focus trap, bind new toggles, re-bind migrated toggles to new modal-internal IDs.
- `src/core/state.js` — add new defaults using the new helper.
- New `src/ui/preferences.js` (or extend an existing utilities file) for `loadPreference` / `savePreference` plus the localStorage key constants.
- `src/render/effects.js` — broaden `prefersReducedMotion(state)` usage at every motion-path site.
- `src/entities/Runner.js` — pass `state` to `prefersReducedMotion()` wherever it's called; gate snap-vs-animate per Decision 6.
- `src/core/turnEngine.js` — pass `state` to `updateAnimation` if not already.
- `src/ai/blockly/workspace.js` — read `state.soundEnabled` at inject time (this part is fine).
- `src/assets/styles/components/blockly.css` — only if a new minor selector is genuinely needed for the settings options list; otherwise do not touch.
- `tests/unit/preferences.test.js` (new)
- `tests/browser/specs/settings-gear.spec.js` (new, smoke tier)
- `docs/subsystems/ui-mode-contract.md` and possibly `p5-surface-map.md`

## Work Plan

1. Inspect current state of inline toggles, sound button, and `prefersReducedMotion` callers. List exact IDs and call sites in the progress report.
2. Build the persistence helper and its unit tests first. No UI work yet.
3. Migrate `state.soundEnabled` and the other already-persisted settings to use the helper. Confirm `npm test` still green.
4. Add new `state` properties using the helper with the Decision 3 defaults.
5. Add gear button to `index.html` header. Add modal markup. Reuse existing modal classes.
6. Migrate inline toggle markup into the modal. Update `controls.js` bindings to the new modal-internal IDs. Confirm Plan 36/38/39 narration and coaching still work end-to-end.
7. Add bindings for the six new toggles. Each binding writes to state and persists.
8. Plumb `state` through every `prefersReducedMotion()` call site (Req 4).
9. Plumb the per-feature animation toggles into the Runner animation path (Req 5).
10. Add focus trap, focus return, ESC handling.
11. Add browser smoke spec.
12. Update subsystem notes.
13. Write progress report. List every property, every key, every migration step, and any settings that needed special handling.

## Implementation Requirements

### Req 1: Gear button and modal mount

Required behavior: A gear icon button appears in the existing app header (same row as Help). Clicking opens `#settingsModal`. The modal uses `.program-modal` classes for visual consistency. Clicking the backdrop closes. ESC closes. Pressing the gear button again does nothing if the modal is already open.

Constraints:

- The gear button uses the same `.app-header-icon-button` styling as existing header icons.
- Modal HTML lives in `index.html` next to the other `.program-modal` blocks.
- The modal is `hidden` by default and toggled via `hidden` attribute plus `aria-hidden`.

Edge cases:

- If the user has another modal open when ESC fires, only the topmost modal closes. Verify this works with the existing modal stack.

Expected artifact: header markup + modal markup + open/close handlers in `controls.js`.

### Req 2: Settings persistence helper

Required behavior: `loadPreference(key, defaultValue, parser)` and `savePreference(key, value)` are the only two functions that touch `localStorage` for preferences. `createInitialState` uses `loadPreference` once per setting. Every toggle's `change` handler calls `savePreference`.

Constraints:

- Boolean parser handles `"true"` / `"false"` / anything else → default.
- Malformed values fall back to default and overwrite the malformed key with the default on next save.
- Module must be importable in a Node test environment with a mocked `localStorage`.
- Module must not crash if `window` or `localStorage` is undefined.

Edge cases:

- `localStorage` quota exceeded: catch the throw, log a console warning, continue. State is the source of truth in-session.

Expected artifact: `src/ui/preferences.js` (or equivalent) + tests.

### Req 3: Migrate existing toggles

Required behavior: Turn Log, Coaching Mode, Voice Narration (incl. voice picker + rate slider if present), and Sound move into the gear modal. Their existing IDs may change (e.g., `soundToggleButton` → `soundToggleCheckbox`); update every reference. Migrate the old `bba:sound-enabled` key to `bba:settings:sound-enabled` with a one-time read-old-write-new.

Constraints:

- Do not change the *behavior* of any migrated toggle. The change handlers stay the same; only the markup location changes.
- Voice picker and voice rate slider must continue to work end-to-end. Smoke spec must cover voice toggle persistence.

Edge cases:

- A returning student with the old localStorage key: on first load, read old key if new key is unset, write new key, leave old key in place (do not delete; harmless to keep).

Expected artifact: updated `controls.js` plus migration step.

### Req 4: Broaden `prefersReducedMotion`

Required behavior: `prefersReducedMotion(state)` returns `true` if `state.lowMotionOverride` is true OR if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

Constraints:

- Every existing call to `prefersReducedMotion()` in `src/render/effects.js` and `src/entities/Runner.js` becomes `prefersReducedMotion(state)`.
- If passing `state` requires plumbing through a function whose signature does not yet have it, plumb it. Do not introduce a global or a module-level cache.
- The function must remain safe to call with no arguments (return false-or-OS-only path) so tests that mock without state still work.

Edge cases:

- Tests that import `effects.js` and call its helpers with no state must still pass.

Expected artifact: updated helper + call sites.

### Req 5: Per-feature animation toggles

Required behavior:

- `state.runnerMovementAnimations === false` → `Runner.startMoveAnimation` and `Runner.startBounceAnimation` complete in 0 frames (snap to target/origin cell). The render result is correct but instantaneous.
- `state.runnerJumpingAnimations === false` → `Runner.startJumpAnimation` produces a snap (no arc, no shadow, no takeoff lines, no dust). The runner appears at the landing cell immediately.
- Both toggles do not affect game state, only rendering / animation duration.

Constraints:

- Failed jumps (the partial-arc reversal from Plan 52) snap to origin if `runnerJumpingAnimations` is off.
- Both toggles compose with `prefersReducedMotion` per Decision 6. If a feature is "off", the reduced-motion branch doesn't apply (nothing to reduce).
- The turn engine must not advance to the next turn before the runner reaches its visual destination. Verify: if animations snap, the turn engine still resolves correctly (no off-by-one, no missed event).

Edge cases:

- Snapping must not skip event emissions. Plan 35 events fire from the simulation tick, not the animation, so this should be safe — but verify and document.

Expected artifact: updated `Runner.js` animation methods + a short unit test that asserts snap behavior under each toggle off.

### Req 6: Frozen badge and runner-index badge toggle plumbing

Required behavior:

- `state.showFrozenBadges === false` → `drawFrozenCountdownBadge` is a no-op.
- `state.showRunnerIndexBadges === false` → renderer (Plan 58) is a no-op. This packet defines and persists the toggle; Plan 58 consumes it.

Constraints:

- The check pattern is `state?.showFrozenBadges !== false` (defaults to true if absent) so existing unit tests that mock minimal state do not regress.

Expected artifact: small change in `drawFrozenCountdownBadge`; no badge rendering in this packet.

### Req 7: Focus management

Required behavior:

- Opening the gear: focus moves to the first interactive element in the modal (the first checkbox).
- Tab and Shift+Tab cycle within the modal.
- ESC closes the modal and restores focus to the gear button.
- Clicking the backdrop closes the modal and restores focus to the gear button.

Constraints:

- Must match Plan 31 stability matrix expectations.
- Must not break existing modal focus behavior for `#programExportModal` and `#privateImportModal`.

Expected artifact: focus trap utility (or reuse if one exists) and tests in the smoke spec.

### Pedagogy checks

- Accessibility: low-motion override, sound off, frozen-badge off — all explicit teacher accommodations. Yes.
- Classroom projectors: gear is in a predictable place (header) at a predictable size. Yes.
- Keyboard: focus trap + ESC + Tab cycling. Yes.
- Color contrast: reuse existing modal contrast. Yes.
- Sound: unified toggle, with the reload-required note for Blockly. Yes.
- Does not change game rules or learning model. Yes.

## Model-Specific Instructions

- Summarize the job in your own words before editing.
- Write the persistence helper and its tests first. The previous attempt at this work inlined six near-identical 6-line ternaries into `state.js` — do not repeat that.
- Migrate the existing toggles before adding new ones. If the existing toggles break, stop.
- Do not modify the existing `.program-modal` CSS classes. If a new selector is genuinely needed, add it in a clearly separated section at the end of the relevant stylesheet; do not edit existing rules. The previous attempt thrashed the CSS file across 8 failed edits and resorted to `git checkout` — never use `git checkout` to recover from a bad edit in this packet.
- Do not introduce a `lowMotionMode` property name. Use `lowMotionOverride` to make the OR-with-OS semantics legible.
- Do not gate the cell inspector (Plan 56) behind any setting. The gear has nothing to do with inspector visibility.
- Do not deploy.

## Commands

```powershell
npm install
npm test
npm run build
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Gear button visible in app header on first load.
- [ ] Modal opens on gear click; closes on backdrop click, close button, and ESC.
- [ ] Focus moves into modal on open; ESC returns focus to gear button.
- [ ] Sound toggle works, persists across reload.
- [ ] Each migrated toggle (Turn Log, Coaching Mode, Voice Narration) still works end-to-end.
- [ ] Voice picker + voice rate slider still work (if present in current build).
- [ ] Each new toggle persists across `page.reload()`.
- [ ] `lowMotionOverride` ORs with OS preference; with toggle on, motion effects use reduced-motion paths.
- [ ] `runnerMovementAnimations` off snaps runner moves to target cell instantly.
- [ ] `runnerJumpingAnimations` off snaps jumps with no arc.
- [ ] `showFrozenBadges` off hides the freeze countdown badge.
- [ ] `showRunnerIndexBadges` persists but is consumed by Plan 58 (no rendering required here).
- [ ] Migration: old `bba:sound-enabled` key still respected on first load if `bba:settings:sound-enabled` is unset.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:smoke` passes including the new gear smoke spec.
- [ ] Plan 31 modal stability tests still pass.
- [ ] Subsystem notes (`ui-mode-contract.md`, `p5-surface-map.md`) still read true post-change.
- [ ] No unrelated files changed.
- [ ] Final report lists every state property, every storage key, every migrated handler, and any open follow-ups.

## Stop Conditions

Stop and request review if:

- A migrated toggle starts misbehaving in a way you cannot reproduce on `main`.
- Live-toggling Blockly sounds turns out to be needed by a smoke test (current decision is reload-required).
- The focus trap requirement requires a new dependency or a large new utility module — surface, do not invent.
- A `prefersReducedMotion()` call site cannot accept `state` without a structural refactor.
- Any pedagogy concern surfaces — e.g., a teacher accommodation toggle would mask a genuine bug.
- Plan 31 modal stability tests start failing for any reason.
