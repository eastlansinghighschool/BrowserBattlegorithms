# Plan 28: style.css Component Split

## Packet Metadata

- Packet id: plan-28
- Packet title: style.css Component Split
- Status: ready
- Owner/model: implementation agent (small/cheap model, with care on import order)
- Date: 2026-05-15
- Packet type: refactor / frontend / docs
- Mutation level: source-code (CSS only)
- Approval gate: none for implementation; integration owner verifies visual smoke before considering this packet closed
- Expected artifacts:
  - new `src/assets/styles/components/` directory containing partial stylesheets
  - `src/assets/styles/style.css` reduced to a small entry point that `@import`s the partials in defined order
  - no change to `index.html` (`<link>` still references `style.css`)
  - no behavior or visual change
  - progress report
- Progress report folder: `reports/development/plan-28-style-css-component-split/`
- Progress report file: `reports/development/plan-28-style-css-component-split/progress.md`

## Packet Summary

Goal: Split the 1560-line `src/assets/styles/style.css` into a small set of component-scoped partials under `src/assets/styles/components/`, keeping `style.css` itself as the single entry point referenced from `index.html`. No visual change. No behavior change. The split is purely an ergonomic improvement so future visual work touches a small, named partial instead of scrolling through a monolith.

Non-goals:

- Do not change any rule's selector, declaration, value, or specificity.
- Do not reorder rules in a way that changes cascade outcome. Within a partial, preserve original source order; across partials, set `@import` order so the resulting effective cascade matches the original file.
- Do not introduce CSS preprocessors, PostCSS plugins, or new build tooling.
- Do not switch from `<link>` to a JS-imported CSS path.
- Do not consolidate "duplicate" rules even if they look redundant. Cascade semantics depend on order and specificity; leave de-duplication for a separate, deliberate packet.
- Do not introduce new naming conventions (BEM, utility classes, design tokens) in this packet.
- Do not deploy.

Depends on:

- Current `src/assets/styles/style.css`.
- `index.html` reference to `./src/assets/styles/style.css` (unchanged).
- Vite's native handling of CSS `@import` (Vite resolves and bundles CSS `@import` at build time; no plugin needed).

Blocks:

- Future visual work on Blockly trace, level-picker signifiers, lesson panel, admin page, and overlays — each becomes a single small file to scan.
- Component-scoped style review during code review.

Why this packet exists:

`style.css` is the largest file in the repo by raw size after `package-lock.json` and has minimal section comments. Visual edits today require scanning 1560 lines to find the right rule, and unrelated rules sit next to one another. The trace highlight rules added in Plan 25b (≈80 lines) are a natural seam — the Blockly UI now has enough dedicated styling to deserve its own partial. Splitting now is low-risk because no `@keyframes`/`animation`/`transition` are involved (verified during Plan 25b review), the file is `<link>`-loaded as static CSS, and Vite handles `@import` natively.

## Authority And Contracts

Sources of truth:

- `src/assets/styles/style.css` — current authoritative styles.
- `index.html` — the entry point that loads the stylesheet.
- `vite.config.js` — build config (read-only for this packet).
- `docs/subsystems/ui-mode-contract.md` and `docs/subsystems/blockly-workspace.md` — describe UI surfaces that have styling; the split must not break the visible behavior they document.

Required product contracts:

- Visual output is byte-for-byte identical (or as close as preprocessing allows). A diff of rendered pages before/after this packet should be empty under manual smoke and under any existing Playwright visual checks.
- `index.html` still references a single `style.css` URL. No new `<link>` tags. No JS-side CSS imports.
- The build still produces working static Vite output.
- The cascade is preserved: import order in the new `style.css` entry point reproduces the original top-to-bottom order of rules in the monolithic file.

Do not redefine:

- The file path `src/assets/styles/style.css` referenced by `index.html`.
- Existing CSS class names, IDs, or selector targets.
- Any styling behavior described in subsystem notes.

## Required Reading

- `src/assets/styles/style.css` (full file).
- `index.html` (for the `<link>` tag).
- `vite.config.js` (confirm no CSS plugin assumptions).
- `docs/subsystems/blockly-workspace.md` (the trace UI section names CSS classes by prefix; the split must keep them findable).
- `docs/subsystems/ui-mode-contract.md` (surfaces guided vs free play UI).

Use `rg "bba-trace-|blocklyDiv|blockly-workspace-shell|level-picker|lesson-panel|admin-|tutorial|mode-picker|goal-burst"` to find selector clusters in the CSS.

## Scope

### In scope

- Read the current `style.css` end-to-end and identify natural seams. Recommended seams (the implementer may adjust if a rule resists clean placement, but should document any deviation):
  - `base.css` — element resets, body, typography defaults, root color tokens if any, any global rules that must come first.
  - `layout.css` — top-level page layout, regions, panels, columns, responsive media queries that span multiple components.
  - `blockly.css` — everything scoped to `#blocklyDiv`, `#blockly-workspace-shell`, `.bba-trace-*`, ignored-block styling, undo/redo controls, panel size controls, demo Blockly panel.
  - `controls.css` — speed slider, mode-switch buttons, top-bar controls that are not Blockly-specific and not part of a larger panel.
  - `lesson-panel.css` — guided-mode lesson panel, hints, badges, project callouts.
  - `level-picker.css` — level grid, badges, locked/unlocked states, project signifiers, synthesis/challenge styling.
  - `admin.css` — admin page styling (only if the admin page is served via the same `style.css`; if it has its own entry point, leave admin styles alone and note that in the progress report).
  - `overlays.css` — tutorial overlay, mode picker, goal-burst overlay, level-result overlay, end-state overlay.
  - `loading.css` — loading skeletons and retry cards.
- Create `src/assets/styles/components/` and place the partials there. Each partial should contain only the rules that originally lived in the corresponding span(s) of `style.css`, preserving original source order within each partial.
- Rewrite `style.css` to contain only:
  - a short top-of-file comment block (≤10 lines) listing the imports and noting the cascade-order rule.
  - a sequence of `@import "./components/<name>.css";` statements in the order that reproduces the original cascade.
- Verify `npm run build` succeeds and the bundled CSS produced by Vite is functionally equivalent to the pre-split build (size will be similar but not identical due to `@import` inlining).
- Visual smoke: load the app locally (`npm run dev` or open the built `dist/index.html`) and confirm guided level picker, a guided level (preferably one with trace at low speed), Free Play setup, and one PvP team tab look unchanged.
- Update neither `docs/subsystems/blockly-workspace.md` nor `docs/subsystems/ui-mode-contract.md` unless a rule's *location in the codebase* is referenced. Spot-check both notes: if neither names `style.css`, no doc update is needed. If either references the monolith, add a one-line note pointing at `src/assets/styles/components/` while keeping the cited class names intact.
- Write the Plan 28 progress report.

### Files and areas likely touched

- `src/assets/styles/style.css` (rewritten as a small entry point).
- `src/assets/styles/components/*.css` (new partials).
- Possibly `docs/subsystems/blockly-workspace.md` and/or `docs/subsystems/ui-mode-contract.md` if and only if they reference the monolithic file path.
- `reports/development/plan-28-style-css-component-split/progress.md` (new).

### Out of scope

- Any JS, HTML, or build-config change.
- Any selector rename, rule reordering beyond the cascade-preserving split, or rule deletion.
- Introducing design tokens, custom properties beyond what already exists, or theming variables.
- Renaming any existing CSS class.
- Touching admin-only styles if the admin page has its own separate stylesheet.
- Splitting partials further than the recommended ≈9 files. If a recommended partial would be under ~30 lines, fold it into a neighbor and note the merge in the progress report.

## Work Plan

1. Read `style.css` end-to-end. Note the natural seams. Compare against the recommended list in "In scope" and decide on the final partial list. Document any deviations in the progress report up front.
2. Create `src/assets/styles/components/`.
3. For each partial, copy the matching contiguous span(s) of rules from `style.css` into a new partial file. Preserve original source order within and across spans.
4. Rewrite `style.css` to a short entry point: top comment + a sequence of `@import "./components/<name>.css";` statements in original cascade order.
5. Run `npm run build` and confirm no errors. Diff the produced bundled CSS against a pre-split build if feasible; otherwise rely on visual smoke.
6. `npm run dev` and walk the smoke checklist: guided level picker, a guided level with Blockly trace at low speed (Plan 25b feature), Free Play PvCPU setup, Free Play PvP with a team tab switch, admin page if applicable.
7. Run `npm test` and `npm run test:browser`. Neither should regress; if `test:browser` has any visual-diff coverage, ensure it still passes.
8. Write the progress report listing partial filenames, line counts, the final import order, and the smoke results.

## Implementation Requirements

### Requirement 1: Cascade preservation

Required behavior:

- The new `style.css` entry point's `@import` order produces the same effective cascade as the original monolithic file.
- Within each partial, rules appear in the same order they appeared in the original file.

Constraints:

- Do not move a rule across partials in a way that changes which selector wins when specificities tie.
- If a rule legitimately straddles two component concerns (e.g. a `.level-picker .blockly-preview` selector that mixes level-picker and blockly responsibilities), prefer keeping it with the component whose selectors lead. Note the call in the progress report.

Edge cases:

- If two parts of the original file style the same selector in different sections (e.g. a base rule and a media-query override later), keep both occurrences in their original order — the override partial must `@import` after the base partial.
- `@media` blocks that contain rules across multiple components: leave the block intact in whichever partial owns the bulk of its rules; note the placement in the progress report. Do not split a single `@media` block across partials.

Expected artifact:

- New `style.css` entry point + partials whose combined order matches the original cascade.

### Requirement 2: Entry-point file shape

Required behavior:

- `src/assets/styles/style.css` after the split contains only:
  - a top comment block of ≤10 lines naming the partials, noting that import order is load-bearing, and pointing at this packet's progress report.
  - a sequence of `@import "./components/<name>.css";` lines, one per partial, in cascade order.
- No CSS rules of its own.

Constraints:

- Use relative `@import` paths so Vite resolves them at build time.
- Do not introduce `@import` chains (a partial importing another partial). Imports live only in `style.css`.

Expected artifact:

- Minimal `style.css` entry point.

### Requirement 3: Partial file shape

Required behavior:

- Each partial is a plain CSS file under `src/assets/styles/components/`.
- Filenames are kebab-case and descriptive: `base.css`, `layout.css`, `blockly.css`, `controls.css`, `lesson-panel.css`, `level-picker.css`, `admin.css`, `overlays.css`, `loading.css`. Adjust if the recommended list is wrong for this codebase, but stay in the 6-10 file range.
- Each partial opens with a single-line comment naming the component (e.g. `/* Blockly workspace, panel, trace highlight, ignored-block warnings. */`).

Constraints:

- No partial contains rules that don't fit its name. If a rule resists placement, surface it in the progress report; do not invent a "misc.css" catch-all unless the alternative is splitting a coherent group.

Edge cases:

- If a recommended partial would be under ~30 lines, fold it into the closest neighbor. Document the merge.

Expected artifact:

- 6-10 cleanly named partial files.

### Requirement 4: Visual + build validation

Required behavior:

- `npm run build` succeeds with no new warnings beyond the existing Blockly chunking + 500 kB chunk-size warnings.
- A manual visual smoke walk through the surfaces listed in step 6 of the Work Plan shows no rendering regression.
- `npm test` and `npm run test:browser` pass.

Constraints:

- Visual smoke is the primary regression check; if anything looks off, stop and report rather than fix forward.

Expected artifact:

- Validation results in the progress report.

### Requirement 5: Documentation

Required behavior:

- If `docs/subsystems/blockly-workspace.md` or `docs/subsystems/ui-mode-contract.md` reference `style.css` directly, update the reference to point at `src/assets/styles/` (the directory) or the specific partial.
- If neither references the file directly, no doc update is needed.

Constraints:

- Do not rewrite existing subsystem-note language. Single-line surgical edits only.

Expected artifact:

- Subsystem notes still read true post-split.

## Model-Specific Instructions

- Start by reading `style.css` end-to-end and proposing the final partial list (file names + the line ranges they will absorb) before writing any code. Include this proposal at the top of the progress report so the owner can sanity-check the seams.
- Use copy-paste for content moves, then delete originals after diffing. Do not rewrite or reformat rules during the move.
- After the move, run `git diff --stat` and confirm the deletions in `style.css` line-balance the additions in the partials — give or take the new entry-point comment block and `@import` lines.
- Do not optimize, deduplicate, or "clean up" rules. The point of this packet is structure, not refactor.
- Stop and report if any of the following:
  - A rule cannot be placed in any partial without distorting its component meaning.
  - The cascade-preserving import order cannot be expressed without splitting an `@media` block.
  - Visual smoke shows any regression, however small.
  - Vite emits a new warning or error.
  - The admin page is served via a different stylesheet than the main app and the implementer is uncertain how to handle admin-related rules.

## Commands

Run from the repository root:

```powershell
git status
npm run build
npm test
npm run test:browser
npm run dev
```

`npm run dev` is for visual smoke and should be stopped before the packet is marked complete.

## Validation Checklist

- [ ] `src/assets/styles/components/` exists with 6-10 partials, each named for its component.
- [ ] `src/assets/styles/style.css` contains only a small comment block and `@import` lines (no CSS rules).
- [ ] `index.html` is unchanged.
- [ ] Cascade order is preserved: import order in `style.css` matches the original top-to-bottom rule order.
- [ ] Within each partial, rules appear in original source order.
- [ ] No rule was renamed, reformatted, deduplicated, or deleted.
- [ ] No `@media` block was split across partials.
- [ ] `npm run build` succeeds with no new warnings.
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] Manual visual smoke confirms: guided level picker, guided level with Blockly trace at low speed, Free Play PvCPU setup, Free Play PvP with team tab switch, admin page (if served via this stylesheet) all render unchanged.
- [ ] Subsystem notes still read true (with minimal surgical edits if they referenced the monolithic file path).
- [ ] No unrelated files changed.
- [ ] Progress report includes the partial list, per-partial line counts, the final import order, smoke results, and any flagged rules-without-a-home or `@media` placement calls.

## Stop Conditions

Stop and report for integration-owner review if:

- A rule resists placement and cannot be assigned to any partial without distorting component meaning.
- An `@media` block contains rules spanning multiple components and splitting it would be the only way to keep partials clean.
- Visual smoke shows any regression.
- `npm run build` emits a new error or warning.
- The admin page's stylesheet relationship is ambiguous.
- Vite handling of `@import` produces a different bundled CSS in a way that suggests rule precedence changed.
- The implementer is tempted to "clean up" the CSS during the split — this is explicitly out of scope.
