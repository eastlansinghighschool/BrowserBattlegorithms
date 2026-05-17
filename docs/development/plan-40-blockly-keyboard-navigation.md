# Plan 40: Blockly Keyboard Navigation Integration

## Packet Metadata

- Packet id: plan-40
- Packet title: Blockly Keyboard Navigation Integration
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / accessibility / testing / integration
- Mutation level: source-code / tests / docs / dependency
- Approval gate: none for the exact dependency named in this packet; before any other dependency, broad keyboard policy change, or production/deployment action
- Expected artifacts:
  - Blockly keyboard-navigation plugin integrated into the live workspace
  - focused Playwright coverage for keyboard construction/editing in Blockly
  - regression coverage showing existing game and UI keyboard behavior still works
  - subsystem doc update if the Blockly keyboard contract changes
  - progress report
- Progress report folder: `reports/development/plan-40-blockly-keyboard-navigation/`
- Progress report file: `reports/development/plan-40-blockly-keyboard-navigation/progress.md`

## Packet Summary

Goal: Enable usable keyboard navigation and keyboard block construction inside the Blockly workspace by integrating Blockly's official keyboard-navigation plugin, while preserving Browser Battlegorithms' existing gameplay, modal, form, slider, browser-shortcut, and Blockly undo/redo keyboard behavior.

Non-goals:

- Do not redesign the Blockly UI, toolbox categories, block definitions, guided level content, or one-action-per-turn execution model.
- Do not remove or rewrite Plan 22's dev-guided Blockly assist in this packet unless it directly breaks keyboard navigation and the repair is small.
- Do not change human-runner key bindings or p5 gameplay input semantics.
- Do not change tutorial overlay behavior except as needed to keep keyboard focus testable.
- Do not create or run the revived Gemini playthrough campaign; Plan 41 owns that.
- Do not add a custom keyboard-navigation system when the Blockly plugin can satisfy the need.
- Do not deploy.

Depends on:

- `blockly@12.5.1` or another version compatible with `@blockly/keyboard-navigation`.
- Plan 30 complete, because it defines the global key-capture safety contract.
- Plan 31 complete, because modal focus stability should stay protected.
- Plan 22 complete, because dev-guided mode remains a browser-agent support surface until keyboard navigation proves it can replace or simplify it.

Blocks:

- Plan 41, the revived Gemini guided playthrough campaign using keyboard-first Blockly instructions.
- A future decision about whether Plan 22's dev-guided geometry assist can be simplified or retired.
- Stronger accessibility claims for Blockly authoring.

Why this packet exists:

Students and browser agents should not need pixel-perfect drag-and-drop to author Blockly programs. Blockly now provides keyboard navigation through the `@blockly/keyboard-navigation` plugin, including workspace navigation, toolbox access, block insertion, field editing, and keyboard help. Integrating it carefully can improve accessibility and gives Gemini a deterministic interaction path for guided playtesting. The risk is key ownership: Browser Battlegorithms already uses keyboard input for gameplay and UI. This packet must make Blockly keyboard authoring work without reviving global key-capture regressions.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/StudentGuide.md`
  - `docs/TeacherGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
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
  - `docs/subsystems/p5-surface-map.md`
  - `docs/subsystems/ui-mode-contract.md`
  - `docs/subsystems/turn-engine.md`
- Upstream Blockly references:
  - Blockly keyboard navigation docs: `https://developers.google.com/blockly/guides/configure/web/keyboard-nav`
  - Blockly keyboard shortcuts docs: `https://developers.google.com/blockly/guides/configure/web/keyboard-shortcuts`
  - `@blockly/keyboard-navigation` package README from npm

Required product contracts:

- Student programs still run from the required `On Each Turn` event block.
- Only the first reached action executes for a runner turn.
- Blockly authoring remains visually understandable to mouse users.
- Existing mouse/touch Blockly behavior must keep working.
- Existing app keyboard behavior must remain focus-scoped and predictable.
- p5 `keyPressed()` remains only for in-game runner actions. Blockly shortcuts, tutorial navigation, and panel controls belong to DOM/Blockly listeners.
- The app remains a static Vite deployment.

Do not redefine:

- Human runner key bindings.
- Guided level order, IDs, project membership, toolboxes, or reference solutions.
- Plan 22's `devGuidedLevel` activation contract, except to document any observed interaction with keyboard navigation.
- Plan 25b/29 trace highlighting behavior.
- Plan 36/39 narration or speech behavior.

## Required Reading

Read these first:

- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/development/archive/plan-30-global-key-capture-bugfix.md`
- `docs/development/archive/plan-31-modal-stability-regression-suite.md`
- `docs/development/archive/plan-22-dev-guided-blockly-assist.md`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/blocks.js`
- `src/render/p5App.js`
- `src/ui/keyboard.js` or the current file found by `rg "handleKeyInput|keyPressed|queuedActionForCurrentRunner" src`
- `tests/browser/key-capture-passthrough.spec.js`
- `tests/browser/modal-stability.spec.js`
- `tests/browser/persistence.spec.js`
- `tests/browser/guided-ui.spec.js`

Use `rg "Blockly.inject|ShortcutRegistry|keyboardNavigation|blocklyDiv|keyPressed|handleKeyInput|preventDefault|Control\\+z|Tab navigation"` from the repository root if file names or symbols have moved.

Optional/contextual:

- `tests/browser/dev-guided-level-link.spec.js`
- `tests/browser/guided-play.spec.js`
- `src/ai/blockly/traceRenderer.js`
- `src/assets/styles/components/blockly.css`
- `reports/development/plan-22-dev-guided-blockly-assist/`

## Scope

### In scope

- Install the exact dependency `@blockly/keyboard-navigation` if it is compatible with the current Blockly version.
- Register plugin styles before `Blockly.inject(...)`.
- Register the plugin's navigation-deferring toolbox before `Blockly.inject(...)`, unless the current Blockly package/plugin version documents a different required setup.
- Instantiate keyboard navigation for the main Blockly workspace after injection.
- Add the plugin's required shortcuts/help host element, such as `#shortcuts`, in the appropriate DOM surface.
- Preserve mouse/touch Blockly behavior.
- Preserve existing app-level keyboard behavior outside Blockly focus.
- Add tests proving keyboard-first Blockly authoring is possible.
- Add tests proving gameplay and UI key handling did not regress.
- Update `docs/subsystems/blockly-workspace.md` if the workspace contract now includes keyboard navigation.
- Update `docs/subsystems/p5-surface-map.md` only if key-routing wording needs clarification.
- Write the progress report.

### Files and areas likely touched

- `package.json`
- `package-lock.json`
- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js` or whichever DOM module owns the Blockly workspace shell
- `src/assets/styles/components/blockly.css`
- `tests/browser/key-capture-passthrough.spec.js`
- new or existing browser spec such as `tests/browser/blockly-keyboard-navigation.spec.js`
- `docs/subsystems/blockly-workspace.md`
- optional: `docs/subsystems/p5-surface-map.md`
- `reports/development/plan-40-blockly-keyboard-navigation/progress.md`

### Out of scope

- Guided campaign playthrough reports.
- Rewriting Plan 06 artifacts.
- Any generated Gemini prompt changes.
- New custom Blockly blocks.
- Level source, reference solution, or concept matrix changes.
- Free Play mode redesign.
- GitHub Actions/workflow changes.
- Deployment.

## Work Plan

1. Summarize the job and confirm the current Blockly/plugin versions.
2. Inspect existing key routing and Blockly initialization before editing.
3. Install only `@blockly/keyboard-navigation` if compatible; stop if npm reports a peer mismatch that cannot be resolved with the current Blockly version.
4. Integrate the plugin in the smallest Blockly-owned setup path.
5. Add keyboard-help host markup and any minimal styling required for visibility and non-overlap.
6. Add focused Playwright tests for keyboard Blockly authoring.
7. Run existing keyboard/modal/persistence browser tests to catch regressions.
8. Update subsystem notes only where the runtime contract changed.
9. Run validation and write the progress report.

## Implementation Requirements

### Requirement 1: Use Blockly's plugin, not a custom navigation layer

Required behavior:

- Use `@blockly/keyboard-navigation` as the keyboard navigation implementation.
- Register plugin styles once before `Blockly.inject(...)`.
- Initialize keyboard navigation once for the main rendered workspace.
- Store any plugin instance on the app or workspace only if needed to avoid garbage collection or to clean up later.

Constraints:

- Do not fork Blockly.
- Do not implement a custom block traversal model.
- Do not add global document keydown handlers for Blockly navigation when the plugin owns that behavior.

Stop if:

- The plugin's documented API differs substantially from the current docs/package README.
- The plugin requires a Blockly upgrade with meaningful compatibility risk.

### Requirement 2: Keyboard construction must work in the live app

Required behavior:

- A keyboard user can reach the Blockly workspace/toolbox.
- A keyboard user can open or navigate the toolbox.
- A keyboard user can insert at least one simple movement block into the starter program or otherwise place it at a cursor location the plugin supports.
- A keyboard user can edit at least one field/dropdown on an existing or inserted block.
- The `/` keyboard command help surface appears if the plugin provides it and a host element is required.

Constraints:

- Tests may use the simplest guided level or Free Play setup that exposes stable blocks.
- Tests should verify user-visible or Blockly-state outcomes, not private plugin internals unless no public signal exists.
- Do not rely on exact focus element ids generated by Blockly unless no better selector/state exists.

### Requirement 3: Existing key routing must not regress

Required behavior:

- Human runner keyboard input still works when game focus is not inside Blockly.
- Blockly keyboard actions do not queue human runner actions while Blockly owns focus.
- Existing browser shortcuts such as refresh/find/devtools-style modified keys remain unblocked by p5 when not consumed by the game.
- Existing Blockly undo/redo keyboard shortcuts still work.
- Tab navigation still reaches focusable controls and keeps advancing.
- Range slider arrow keys still adjust a focused slider.
- Enter/Space still activate focused DOM controls as currently designed.
- Modal focus stability tests still pass.

Constraints:

- Do not broaden `preventDefault()`.
- Do not add p5 key handling for Blockly.
- Any keyboard conflict resolution must be focus-scoped.

### Requirement 4: Preserve Plan 22 dev-guided assist behavior

Required behavior:

- Valid local-dev `?devGuidedLevel=<id>` still starts the requested guided level.
- The dev-guided assist may continue to open a toolbox category if this does not fight the plugin.
- If the plugin makes the geometry assist obsolete but not harmful, leave cleanup to a future packet.
- If the plugin and Plan 22 assist conflict, prefer the smallest repair and document the conflict in the progress report.

Constraints:

- Do not redesign dev-guided layout in this packet.
- Do not change normal student-facing guided startup behavior.

### Requirement 5: Documentation and reporting

Required behavior:

- Update `docs/subsystems/blockly-workspace.md` with the new keyboard navigation contract if the integration lands.
- If p5 key-routing docs need clarification, update `docs/subsystems/p5-surface-map.md`.
- Progress report must include:
  - exact plugin version installed
  - files changed
  - commands run
  - keyboard workflows verified
  - any unresolved browser-agent or accessibility risks
  - whether Plan 41 is unblocked

## Commands

Run from the repository root:

```powershell
npm install @blockly/keyboard-navigation --save
npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npx playwright test tests/browser/persistence.spec.js --grep "Blockly undo and redo" --reporter=line
npx playwright test tests/browser/dev-guided-level-link.spec.js --reporter=line
npm test
npm run test:browser
npm run build
```

If you add a new focused browser spec, run it directly before the broader browser suite.

## Validation Checklist

- [ ] `@blockly/keyboard-navigation` is installed at a version compatible with the current Blockly package.
- [ ] Keyboard navigation plugin is initialized once for the live Blockly workspace.
- [ ] Keyboard help host exists if required by the plugin.
- [ ] Browser test proves keyboard user can insert or place a Blockly block.
- [ ] Browser test proves keyboard user can edit a Blockly field/dropdown.
- [ ] Browser test proves Blockly focus does not queue human-runner actions.
- [ ] Existing key-capture passthrough tests pass.
- [ ] Modal stability tests pass.
- [ ] Blockly undo/redo keyboard shortcut tests pass.
- [ ] Dev-guided deep-link test still passes.
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes, or any failure is clearly unrelated and rerun evidence is included.
- [ ] `npm run build` passes.
- [ ] Relevant subsystem note still reads true post-change.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report before broadening scope if:

- The plugin cannot be installed without changing Blockly major/minor version.
- The plugin conflicts with p5/gameplay key routing in a way that requires redesigning human controls.
- The plugin requires broad DOM/layout rewrites.
- The only way to pass tests is to weaken existing keyboard regression coverage.
- Keyboard navigation works only by changing Blockly semantics or authored programs.
- Dev-guided behavior breaks and the repair requires another layout packet.
- A subsystem note would become untrue and the correct contract wording requires owner judgment.
- Any dependency other than `@blockly/keyboard-navigation` appears necessary.

## Handoff Notes For Plan 41

At the end of the progress report, include a short "Plan 41 readiness" section:

- Is keyboard-first Blockly construction usable enough for Gemini?
- What exact keystroke workflows are reliable?
- What workflows remain mouse-only or brittle?
- Should Gemini use the new keyboard workflow by default, or only when drag/drop fails?
- Are there any levels or block types that need special Gemini instructions?
