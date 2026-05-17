# Plan 30: Global Key-Capture Bugfix

## Packet Metadata

- Packet id: plan-30
- Packet title: Global Key-Capture Bugfix
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-16
- Packet type: bugfix / accessibility / testing
- Mutation level: source-code / tests / docs-only
- Approval gate: none for implementation; integration owner verifies the manual smoke before considering this packet closed
- Expected artifacts:
  - one-function fix in `src/render/p5App.js` so `p.keyPressed` only calls `preventDefault()` (via `return false`) when `handleKeyInput` actually consumed the key, and never when a modifier key is held
  - unit-test coverage that locks the `handleKeyInput` true/false contract the p5 callback now depends on
  - Playwright coverage proving the fix in real browser conditions across the listed scenarios
  - subsystem note touch if any covered note describes the keyboard pipeline
  - progress report
- Progress report folder: `reports/development/plan-30-global-key-capture-bugfix/`
- Progress report file: `reports/development/plan-30-global-key-capture-bugfix/progress.md`

## Packet Summary

Goal: Stop the global keystroke capture caused by `p.keyPressed` unconditionally returning `false` from p5's window-level key listener. Today every key on the page gets `event.preventDefault()` called on it, which silently breaks Blockly text inputs, tab navigation, focused-button activation, page scrolling via arrow keys, the speed slider's keyboard adjustment, browser shortcuts (Ctrl+R, F12, Ctrl+F, etc.), Blockly's native keyboard shortcuts, and accessibility tools. The fix is small; the test surface is what's load-bearing.

Non-goals:

- Do not change any keybinding (`P1_KEY_BINDINGS`, `P2_KEY_BINDINGS`, or the maps in `src/config/keybindings.js`).
- Do not change `handleKeyInput`'s signature, return contract, or the order of its guard checks.
- Do not restructure p5 initialization beyond the one callback body.
- Do not introduce a new global key router or DOM event delegation layer.
- Do not change Blockly configuration.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Current p5 binding in `src/render/p5App.js`.
- Current keyboard handler in `src/ui/controls.js` (`handleKeyInput`).
- Current keybindings in `src/config/keybindings.js`.

Blocks:

- Classroom usability of Level 24 and any future guided level that asks students to type into a Blockly number or text field.
- Accessibility for keyboard-only users (Tab navigation, focused-button activation, range-input arrow keys).
- Basic browser-shortcut expectations (Ctrl+R, F12, Ctrl+F) during play sessions.

Why this packet exists:

The integration owner observed that a Blockly `VALUE_NUMBER` field would not accept typed digits in Level 24 and Free Play. Investigation traced the symptom up through Blockly to `p.keyPressed`, which has been returning `false` unconditionally since p5 was wired up. Per p5's documented behavior, returning `false` from `keyPressed` calls `event.preventDefault()` on the underlying `KeyboardEvent`. Because p5 attaches `keyPressed` as a window-level listener, *every* keystroke on the page has its default action cancelled. The number-input issue is one visible symptom; the larger blast radius is page-wide loss of native keyboard behavior including accessibility primitives and browser shortcuts.

`handleKeyInput` in `src/ui/controls.js` already returns `true` only when a key actually matched a player binding during a valid human turn, and `false` in every guard-fail case. The fix is to thread that boolean back through p5's callback and additionally pass through modifier-decorated keys (Ctrl/Alt/Meta) untouched, since those combinations belong to the browser, not the game.

## Authority And Contracts

Sources of truth:

- `src/render/p5App.js` — p5 lifecycle wiring.
- `src/ui/controls.js` — `handleKeyInput` and player-binding dispatch.
- `src/config/keybindings.js` — bindings map.
- `docs/subsystems/turn-engine.md` — describes human input as flowing through the same engine pipeline as AI input; the keyboard pipeline upstream of `handlePlayerInput` is implicit.
- `docs/subsystems/ui-mode-contract.md` — touches mode-specific UI surfaces.

Required product contracts:

- Player movement keys (`w`/`s`/`a`/`d`/`f`/`b`/`x` for P1, `o`/`l`/`k`/`;`/`m`/`i`/`.` for P2) continue to trigger their respective actions during a valid human turn in both guided mode and Free Play (including the active team's turn in PvP).
- After the fix, those same keys still call `event.preventDefault()` when consumed, so they do not also produce side effects in any focused DOM element.
- Non-binding keys (digits, letters not in any binding, Tab, Enter, arrow keys, function keys, modifier-decorated combinations, etc.) reach their native browser default behavior unchanged.
- Modifier-decorated keys (Ctrl, Alt, Meta held) are never consumed by the game, even when the un-modified key would have been a binding. (Example: Ctrl+W is the browser's close-tab shortcut; the game must not eat it during P1's turn.)
- One-action-per-turn semantics are preserved. The fix changes only when `preventDefault()` is called, not which action is queued.
- Static Vite build remains green.

Do not redefine:

- Player keybinding values.
- The shape of `handleKeyInput(app, rawKey)` — still takes `(app, rawKey)` and returns boolean.
- The p5 lifecycle (`p.setup` / `p.draw` are untouched).

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/turn-engine.md` (Human-input section)
- `src/render/p5App.js`
- `src/ui/controls.js` (`handleKeyInput`)
- `src/config/keybindings.js`
- `tests/browser/guided-play.spec.js` (existing keyboard-practice coverage)

Use `rg "keyPressed|keyReleased|handleKeyInput|preventDefault"` from the repository root if symbol names have moved.

Optional/contextual:

- p5.js docs for `keyPressed` and the relationship between return value and `preventDefault()`. Confirm via the p5 source or docs that returning anything other than `false` (including `undefined`) leaves the default action intact.

## Scope

### In scope

- Replace the body of `p.keyPressed` in `src/render/p5App.js` with a guarded version that:
  - accepts the `event` argument (p5's `keyPressed` callback receives the underlying `KeyboardEvent`);
  - returns `undefined` immediately when `event.ctrlKey || event.altKey || event.metaKey` is true, so modifier-decorated keys pass through untouched;
  - otherwise calls `handleKeyInput(app, p.key)` and returns `false` only when the result is exactly `true` (the key was actually consumed), `undefined` in all other cases.
- Add unit-test coverage in `tests/unit/` (extend `tests/unit/turn-engine.test.js` or add a focused `tests/unit/keyboard-input.test.js`) that locks the `handleKeyInput` return contract across every guard branch.
- Add Playwright coverage that exercises the scenarios listed in Requirement 3.
- Update `docs/subsystems/turn-engine.md` only if its current text implies that all keys are intercepted, or otherwise misstates the post-fix behavior. A small surgical edit is fine; a full rewrite is out of scope.
- Write the Plan 30 progress report.

### Files and areas likely touched

- `src/render/p5App.js` — the `p.keyPressed` body.
- `tests/unit/keyboard-input.test.js` (new) or extension of an existing unit-test file.
- `tests/browser/key-capture-passthrough.spec.js` (new) or extension of `tests/browser/guided-play.spec.js`.
- `docs/subsystems/turn-engine.md` — only if a current sentence misstates the post-fix keyboard contract.
- `reports/development/plan-30-global-key-capture-bugfix/progress.md` — new.

### Out of scope

- Changes to `handleKeyInput`, the keybinding maps, or the turn engine.
- A new global key router or DOM event delegation layer.
- Refactoring p5 initialization.
- Blockly configuration changes.
- Any source change unrelated to the keyboard pipeline.
- New Playwright coverage for surfaces unaffected by this bug (Plan 25b's trace spec, the usage-pipeline regression, etc.).

## Work Plan

1. Read `src/render/p5App.js` and `src/ui/controls.js` (`handleKeyInput`). Confirm the return contract of `handleKeyInput` matches what the new p5 callback expects: `true` only when an action was queued, `false` otherwise.
2. Replace the body of `p.keyPressed`.
3. Add unit tests for `handleKeyInput` covering each guard branch.
4. Add Playwright tests for the user-facing scenarios in Requirement 3.
5. Run validation (`npm test`, `npm run build`, `npm run test:browser`).
6. Manually smoke the four owner-facing scenarios in Requirement 4 in a real browser.
7. Touch the subsystem note only if its text currently misstates the keyboard contract.
8. Write the progress report.

## Implementation Requirements

### Requirement 1: The fix

Required behavior:

- After this packet, the body of `p.keyPressed` in `src/render/p5App.js` is functionally equivalent to:

  ```js
  p.keyPressed = (event) => {
    if (event && (event.ctrlKey || event.altKey || event.metaKey)) {
      return undefined;
    }
    const handled = handleKeyInput(app, p.key);
    return handled === true ? false : undefined;
  };
  ```

- The exact code shape is the implementer's call (early return vs ternary, etc.), but the three semantic guarantees are:
  1. modifier-decorated keys pass through untouched (return `undefined`);
  2. unconsumed keys pass through untouched (return `undefined`);
  3. consumed keys cancel the default action (return `false`).

Constraints:

- Do not change `handleKeyInput`'s signature or behavior.
- Do not change any keybinding.
- Do not add any other event listeners.
- Do not call `preventDefault()` directly on the event; let p5 handle that via its return-value convention.

Edge cases:

- `event` may be `undefined` in some test harnesses or older p5 versions. The modifier-check guard must short-circuit safely if so (the `event && ...` pattern handles this).
- `p.key` may be `""` or an unexpected value. `handleKeyInput` already normalizes via `${rawKey || ""}.toLowerCase()`, so no extra defense is needed at the p5 callback layer.
- Multiple keys held simultaneously: p5 fires `keyPressed` per key event; behavior is unchanged.

Expected artifact:

- Updated `p.keyPressed` body.

### Requirement 2: Unit tests for `handleKeyInput`

Required behavior:

- A unit-test file (new `tests/unit/keyboard-input.test.js` or extension of an existing one) covers every branch of `handleKeyInput`'s return contract. Concretely:

  1. **Active tutorial guard:** `state.activeTutorial` truthy → returns `false` for every input.
  2. **Main game state guard:** `state.mainGameState !== RUNNING` → returns `false`.
  3. **Game-over guard:** `state.currentTurnState === "GAME_OVER"` → returns `false`.
  4. **No current runner:** `state.allRunners[activeRunnerIndex]` undefined → returns `false`.
  5. **Current runner not human:** AI or NPC runner active → returns `false`.
  6. **Runner currently moving:** `currentPlayer.isMoving === true` → returns `false`.
  7. **Runner currently bouncing:** `currentPlayer.isBouncing === true` → returns `false`.
  8. **Wrong turn state:** `state.currentTurnState !== "AWAITING_INPUT"` → returns `false`.
  9. **Unmatched key during valid P1 turn:** key is not in `P1_KEY_BINDINGS` → returns `false`. Examples worth covering: a digit (`"5"`), a letter not in any binding (`"q"`), an empty string.
  10. **Valid P1 movement key during P1 human turn:** returns `true`, and `handlePlayerInput` was invoked with the matching action (`UP`/`DOWN`/`LEFT`/`RIGHT`). Cover at least one direction plus `JUMP`, `PLACE_BARRIER`, and `STAY_STILL` to exercise all action families.
  11. **Valid P2 movement key during P2 human turn:** same coverage as P1 with `P2_KEY_BINDINGS`. Includes `";"` (P2 RIGHT) and `"."` (P2 STAY_STILL) to cover the punctuation bindings.
  12. **P1 key during P2 turn:** returns `false` (wrong team's key during the other team's turn).
  13. **P2 key during P1 turn:** returns `false`.

Constraints:

- Use existing test-harness helpers (`tests/unit/helpers/`) to build app state. Do not stub `handlePlayerInput` away — assert it was invoked on the success path.
- Tests are pure unit tests against the exported `handleKeyInput` function; no DOM, no p5, no Playwright.
- Do not import `p5App.js` from a unit test. The p5 callback is verified at the browser-test layer.

Expected artifact:

- One new test file (or one extension) that locks the 13 branches above.

### Requirement 3: Playwright tests for browser behavior

Required behavior:

- A Playwright spec (`tests/browser/key-capture-passthrough.spec.js`, or an extension of `tests/browser/guided-play.spec.js` if structurally cleaner) covers the scenarios below. Use existing test hooks/XML-injection paths for workspace setup; do not rely on drag-and-drop.

  1. **Number-input typing in Blockly works.** In a context where a `VALUE_NUMBER` block can be placed in the workspace (Free Play or Level 24), click the number field, type `42`, blur, and assert the field's value (or the workspace's serialized XML) reflects `42`. This is the original user-reported regression.

  2. **Tab navigation reaches focusable elements.** Load the app to its initial state. Press `Tab` from the document body. Assert the active element advances to the first focusable element in the page's tab order (whatever it currently is — the test should query `document.activeElement` rather than hardcode an expectation). Press `Tab` a second time and assert the active element advances again.

  3. **Enter activates a focused button.** Tab (or programmatically focus) to a known activatable control such as the Play button or a mode-picker button. Press `Enter`. Assert the expected side effect occurred (game starts, mode switches, etc.). Pick whichever control is most reliably available in the test harness.

  4. **Arrow keys adjust the focused speed slider.** Focus the `#speedSlider` element. Capture its current value. Press `ArrowLeft` (or `ArrowDown`) once. Assert the value decreased by the slider's step. Press `ArrowRight` once; assert the value returned. This proves arrow-key default handling reaches `<input type="range">`.

  5. **Non-binding key during a running game does not trigger a player action.** Start a game state where a human runner is awaiting input. Press `"r"` (not in any binding). Assert no movement, no `handlePlayerInput` call, no turn-state transition. The most robust assertion is that the active runner's grid position is unchanged.

  6. **Modifier-decorated binding key during a running game does not trigger a player action.** With P1 awaiting input, press `Ctrl+w` (P1 UP). Assert the runner did not move. This proves the modifier guard prevents the game from eating browser shortcuts that happen to overlap player bindings.

  7. **P1 binding key during P1 turn still works** (regression check). With P1 awaiting input, press `"w"`. Assert P1 moved up.

  8. **P2 binding key during P2 turn still works in PvP** (regression check). Set up a PvP Free Play match and advance to P2's turn. Press a P2 binding (`"o"` for UP, or `";"` for RIGHT — whichever is easier to assert from a known start position). Assert P2 moved.

Constraints:

- Waits are hook/class/value-based, not arbitrary sleeps.
- If a scenario requires a workspace state that's awkward to construct in Playwright today, use the existing dev/test workspace-injection paths or add a narrow new one and document it in the progress report.
- Do not change the `tests/browser/blockly-trace-playback.spec.js` or `tests/browser/usage-pipeline.spec.js` scope. They should continue to pass unchanged.

Expected artifact:

- One Playwright file with the 8 scenarios above (or extensions of existing files; one new file is usually cleaner).

### Requirement 4: Owner manual smoke

Required behavior:

- After unit + browser tests pass, the implementer manually verifies in a real browser:
  1. Open the app via `npm run dev`. Press `F12`. Assert devtools opens.
  2. Press `Ctrl+R` (or Cmd+R). Assert the page refreshes.
  3. Place a `VALUE_NUMBER` block in Free Play. Click the field, type a multi-digit number, blur. Assert the value persists.
  4. Tab through the page from the title bar; assert focus rings appear and advance through controls.

- These are pass/fail by direct observation. The progress report lists each as pass or fail with a short note.

Constraints:

- Manual smoke is not a substitute for the Playwright coverage in Requirement 3; both are required.
- If any manual smoke item fails, stop and report rather than rationalize the result.

Expected artifact:

- Manual smoke notes in the progress report.

### Requirement 5: Documentation

Required behavior:

- If `docs/subsystems/turn-engine.md`'s human-input section currently implies that the keyboard pipeline intercepts all keys, add or amend one short sentence: "The p5 `keyPressed` callback calls `preventDefault()` only when a key was consumed as a player action and never when a modifier (Ctrl/Alt/Meta) is held; all other keys reach their native browser default behavior."
- If the note does not currently misstate the keyboard contract, no doc change is needed. The progress report should explicitly note which case applied.

Constraints:

- Keep the addition narrow. Do not restructure the note's section ordering.
- Do not touch `docs/subsystems/blockly-workspace.md` or `docs/subsystems/ui-mode-contract.md` unless they actively misstate the keyboard contract (they don't, but verify).

Expected artifact:

- Subsystem note still reads true post-fix.

## Model-Specific Instructions

- Start by reading the current `p.keyPressed` body and `handleKeyInput`. Summarize the return contract of `handleKeyInput` in one paragraph before editing.
- Make the source change first, then write the unit tests, then write the Playwright tests, then run validation. Tests written before the fix should fail on `main`; tests written after should pass. The progress report should note which tests were written first.
- Do not stub `handlePlayerInput` in unit tests — call the real function and assert observable state.
- Do not chase unrelated keyboard improvements (custom focus traps, additional shortcuts, etc.). Out of scope.
- Stop and report if:
  - p5's documented behavior for `keyPressed` return values differs from the assumption (`false` → preventDefault, otherwise → default behavior intact);
  - the modifier guard breaks an existing test that depended on Ctrl-decorated keys being consumed (none should, but verify);
  - the unit-test contract reveals a hidden branch in `handleKeyInput` that the requirement list missed;
  - a Playwright scenario cannot be observed without arbitrary sleeps and no stable hook can be added safely.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/keyboard-input.test.js
npm test
npm run build
npm run test:browser
npm run dev
```

`npm run dev` is for the manual smoke; stop the dev server before marking the packet complete.

## Validation Checklist

- [ ] `p.keyPressed` in `src/render/p5App.js` honors the three-rule contract (modifier passthrough, unconsumed passthrough, consumed preventDefault).
- [ ] No other source file changed.
- [ ] No keybinding value changed.
- [ ] Unit tests cover all 13 branches in Requirement 2 and pass.
- [ ] Playwright spec covers all 8 scenarios in Requirement 3 and passes.
- [ ] Manual smoke in Requirement 4 confirms F12, Ctrl+R, Blockly typing, and Tab navigation all work in a real browser.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes.
- [ ] Existing keyboard-practice coverage in `tests/browser/guided-play.spec.js` still passes unchanged.
- [ ] Subsystem note still reads true (with surgical edit if needed; documented either way).
- [ ] No unrelated files changed.
- [ ] Progress report includes: the cause restated, the diff, commands run, unit-test and Playwright counts, manual smoke pass/fail per item, and any remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- p5's actual behavior for `keyPressed` return values is not what the packet assumes.
- Any existing test fails in a way that suggests the modifier guard or unconsumed-passthrough breaks intended behavior (none expected, but verify).
- A Playwright scenario cannot be observed deterministically and no stable hook can be added safely.
- The bug turns out to have a second contributing factor (e.g. a second global key handler elsewhere) that this fix alone does not resolve.
- Manual smoke fails on any item after the unit and Playwright suites pass — that indicates the test layer is missing something the human eye sees.
- The fix requires dependency installs, deployment, or repository settings changes.
