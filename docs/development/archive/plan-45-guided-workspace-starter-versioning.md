# Plan 45: Guided Workspace Starter Versioning and Stale Replace

## Packet Metadata

- Packet id: plan-45
- Packet title: Guided Workspace Starter Versioning and Stale Replace
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-17
- Packet type: implementation / persistence / bugfix / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing the storage-key prefixes used by existing students, changing free play persistence semantics, requiring crypto libraries, or introducing a build-time hashing step
- Expected artifacts:
  - per-guided-level starter XML versioning (content-derived hash computed at module load)
  - stale-replace logic that prefers the current `initialBlocklyXml` over a stored workspace when the version metadata disagrees
  - one-time migration grace for stored workspaces that pre-date this packet
  - "Reset Workspace to Starter" button in the Blockly toolbar with native confirm dialog
  - regression-resistant unit tests for the version-compare logic and the reset action
  - Playwright spec that simulates a pre-existing stale workspace and asserts the current starter loads
  - Playwright spec that exercises the reset button (confirm and cancel paths)
  - subsystem doc update describing the new persistence contract and the reset affordance
  - progress report
- Progress report folder: `reports/development/plan-45-guided-workspace-starter-versioning/`
- Progress report file: `reports/development/plan-45-guided-workspace-starter-versioning/progress.md`

## Packet Summary

Goal: When the integration owner fixes a guided level's `initialBlocklyXml` (for example, the bughunt-22 XML repair on 2026-05-17), students who previously opened that level must receive the corrected starter on their next visit. Today they do not — Blockly's persistence layer at [src/ai/blockly/workspace.js](src/ai/blockly/workspace.js) prefers the stored workspace in `localStorage` over the level's `initialBlocklyXml`, so an authored fix is invisible to any returning student.

This is a pilot-critical fix. School-managed Chromebooks lock students out of DevTools, so the operational escape hatch (manual `localStorage.removeItem`) is unavailable. Without a versioning layer, the orchestrator's only recourse is renaming the level id, which cascades through campaign order, references, tests, and concept matrix — disproportionate cost for what should be a single XML edit.

The fix is small: hash each guided level's starter XML at module load, write the hash alongside the stored workspace, and on load replace stored content whenever the recorded hash disagrees with the current hash. No crypto dependency. No build-time step. Free play and project shared workspaces are intentionally exempt (see Decision 3). All existing stored workspaces receive a one-time grace stamp on first load so students do not lose in-flight work the day this packet deploys (see Decision 5).

Non-goals:

- Do not change free play persistence behavior (free play workspaces are student-authored programs, not authored content; they must persist across sessions unchanged).
- Do not change project shared workspaces in this packet (see Decision 3 — separate, lower-frequency problem; revisit if classroom feedback shows project-level authoring fixes are also blocked).
- Do not add a UI affordance ("your level was updated") in this packet. Replace is silent by design (see Decision 2).
- Do not add new dependencies. No `crypto-js`, no Node `crypto.subtle` in browser path. Use a small inline hash function.
- Do not change level ids, campaign order, reference solutions, or any other authored content.
- Do not weaken the existing "Reset Level" button contract — reset still re-applies `initialBlocklyXml`.
- Do not deploy.

Depends on:

- Existing Blockly workspace persistence path in [src/ai/blockly/workspace.js](src/ai/blockly/workspace.js).
- Existing level definitions under `src/config/levels/phases/`.
- Plan 42 (bug hunt levels) and Plan 43 (prediction levels) complete — bug hunts in particular are where stale-starter risk is highest because the starter IS the lesson.

Blocks:

- Pilot rollout under realistic "students return after orchestrator pushes a level fix" conditions.
- Any future packet that revises authored starter XML in a guided level.

Why this packet exists:

On 2026-05-17 the integration owner discovered that a starter-XML fix to bughunt-22 (corrected the malformed `<next>` nesting that caused Blockly to silently drop the if-can-place-barrier-else block) did not reach a real Chrome session, because localStorage had already cached the broken parse result. The discovery only happened because the orchestrator could open DevTools. In a Chromebook classroom this would have been invisible — the orchestrator pushes a fix, students still see the broken level, no one knows why. This packet closes that hole.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-17):

### Decision 1: Versioning mechanism — content-derived hash of the starter XML

Each guided level's starter XML is hashed at module load time. The hash is a short, stable, non-cryptographic digest (FNV-1a 32-bit is sufficient; output as 8-character lowercase hex). The hash function lives in `src/ai/blockly/workspace.js` (or a small new helper module under `src/ai/blockly/`) and is exported for tests.

Rationale: the orchestrator should not have to remember to bump a version number after each starter edit. Hashing the content gives "automatic correctness" — any byte-level change to `initialBlocklyXml` produces a new hash, which triggers stale replace on the next student visit. The hash is normalized first (whitespace-collapsed) to avoid spurious mismatches from formatting-only edits — see Requirement 1 for the exact normalization rule.

### Decision 2: Stale behavior — silent replace with the current starter

When a stored workspace's recorded hash differs from the current level's computed hash, the stored workspace is discarded and `initialBlocklyXml` is loaded as if the student were visiting fresh. No toast, no modal, no warning copy. The student sees the corrected starter.

Rationale: in a pilot, the orchestrator is the source of truth for authored content. Students do not benefit from knowing the level changed; they need to see the right level. A toast adds new UI surface (Plan 31 modal-stability risk) and a copy-authoring burden disproportionate to the value. The existing Reset button already handles "I want to start over." This decision is revisitable if classroom feedback shows students complaining about lost in-flight work — but that complaint should come from real students, not be pre-mitigated.

Cost acknowledged: a student who has progressed significantly on a level loses that progress when the author edits that level's starter. This is acceptable in pilot context because:

- Bug hunts (the highest-risk class for authoring fixes) are short, structured-repair levels — a few minutes of work, not a session.
- Most authoring fixes will be to broken levels, where the student's "progress" was actually progress on a broken target.
- The orchestrator can announce significant level revisions out-of-band when needed.

### Decision 3: Scope — guided non-project levels only

Versioning applies to storage keys with the `bba:guided-workspace:` prefix (the `GUIDED_WORKSPACE_STORAGE_PREFIX` in workspace.js).

**Exempt for this packet:**

- Free play workspaces (`bba:free-play-workspace`, `bba:free-play-pvp-team:N`): student-authored content. Must persist unchanged across sessions.
- Project shared workspaces (`bba:guided-project-workspace:{projectId}`): one workspace shared across all levels in a project arc. Versioning here is more delicate because the canonical "starter" lives on the first level of the project, but subsequent project levels reuse the same key. Stale-replace on a project workspace would destroy multi-level cumulative work. Project-level authoring fixes are rare and orchestrator can communicate them out-of-band for now.

If classroom feedback shows project shared workspaces need the same protection, a future packet revisits — likely with versioning against the project's canonical starter rather than per-level.

### Decision 4: Hash timing — computed at module load, cached per level

Each level definition gets a derived `starterXmlVersion` property computed once when its module is imported. The implementation can either:

- (a) Add an explicit `starterXmlVersion: hashStarterXml(BUGHUNT_22_STARTER_XML)` field to each level definition file, or
- (b) Compute it lazily in `getLevelDefinitions()` (or the levels-loader path) by iterating definitions and setting `level.starterXmlVersion = hashStarterXml(level.initialBlocklyXml)`.

Recommend (b) — central, no per-level authoring burden, one place to maintain. The implementer may pick (a) if there's a clear reason (e.g., easier to read in tests). Document the choice in the progress report.

The hash is recomputed on every page load. This is cheap (FNV-1a over a few hundred bytes per level, ~40 levels) and avoids any build-time step.

### Decision 5: Migration of pre-existing stored workspaces — one-time grace stamp

Stored workspaces written before this packet ships have no recorded hash. On first load after deploy, the loader detects the missing hash and stamps the stored workspace with the current level's hash, treating it as if the student's version were current. The student keeps their in-flight work.

From the second load onward, the stamp is present and the normal compare logic applies — any author edit since the stamp produces a mismatch and triggers replace.

Rationale: the alternative (replace-on-absent-hash) wipes every student's in-flight workspace across every level the day the packet deploys. Unacceptable in pilot. The grace stamp gives one free pass, after which authoring fixes start reaching students reliably.

Trade-off acknowledged: if an author edits a level's starter *between* the deploy and a returning student's first post-deploy load, that student's grace stamp captures the new hash and they keep their (pre-fix) stored workspace. This is the same as "they happened to log in before the author fixed it." A small window. Documented in the progress report.

### Decision 6: Hash storage shape — sibling key, not embedded in stored XML

The hash is stored under a sibling localStorage key, not inside the workspace XML itself:

- Workspace key: `bba:guided-workspace:bughunt-22` (existing)
- Version key: `bba:guided-workspace-version:bughunt-22` (new)

Rationale: embedding metadata in the XML would either pollute the parsed workspace (Blockly would see and possibly choke on unknown attributes) or require a wrapper format change that complicates every reader. Sibling key is the smallest change, additive, easy to migrate, and easy to clear independently if needed.

### Decision 7: Manual reset button — "Reset Workspace to Starter" with native confirm

Add a button to `#blockly-toolbar` (next to the existing undo/redo controls) that resets the Blockly workspace to the level's current `initialBlocklyXml`. The button:

- Is visible only when `currentModeView === GUIDED_LEVELS` and the current level has a non-empty `initialBlocklyXml`. Hidden in Free Play, hidden on project shared-workspace levels (Decision 3 scope), hidden if the level has no starter.
- On click, shows a `window.confirm()` dialog with text: "Reset your blocks to the starter program for this level? Your current blocks will be lost."
- On confirm, replaces the workspace with the level's current `initialBlocklyXml`, writes the current `starterXmlVersion` to the sibling key, and triggers `syncUi`.
- On cancel, does nothing.
- Is keyboard reachable (Tab order after undo/redo), has `aria-label="Reset workspace to the starter program"` and a `title` tooltip with the same text.
- Is visually distinct from undo/redo (destructive action). Use a different icon (e.g., a circular arrow or "↻" glyph) and slightly muted-warning color treatment in `src/assets/styles/components/blockly.css`.

Why native `confirm()` and not a custom modal:

- Zero new UI infrastructure. Plan 31 modal stability concerns do not apply to browser primitives.
- Works on locked-down Chromebooks without any policy adjustment.
- Keyboard accessible by default (Enter to confirm, Esc to cancel).
- Screen-reader announced by default.

Behavior with the versioning system (Decisions 1–6):

- The reset path is the same code path used by stale-replace in Requirement 4: discard stored workspace, write current `initialBlocklyXml`, stamp current `starterXmlVersion`. The button just invokes this path manually instead of waiting for a hash mismatch.
- After reset, the next save (any Blockly edit) writes both keys normally.

Future-history interaction (acknowledged, not implemented here):

- When a workspace version-history feature later lands, the reset button should remain "go to authoritative current starter" and the history feature offers a separate "restore to my earlier version X" surface. The two affordances are distinct and the button copy ("Reset to starter") is unambiguous enough to coexist. The implementer should not architect the button to be extensible for history — keep the wiring simple now. The future packet will add what it needs.

## Authority And Contracts

Sources of truth:

- `src/ai/blockly/workspace.js` (storage prefixes, key derivation, `getStoredWorkspaceXmlText`, `loadWorkspaceFromLocalStorage`, `saveWorkspaceToLocalStorage`)
- `src/config/levels.js` and `src/config/levels/index.js` (level loading and `getLevelDefinitions`)
- `docs/subsystems/blockly-workspace.md` (current persistence contract)
- `docs/subsystems/ui-mode-contract.md`

Required product contracts:

- A student returning to a guided level after the orchestrator updates that level's `initialBlocklyXml` sees the new starter on their next visit, without any DevTools or admin action.
- A student returning to a guided level whose starter has not changed sees their previously stored workspace, unchanged.
- Free play workspaces persist across sessions exactly as today.
- Project shared workspaces persist across sessions exactly as today.
- The Reset Level button continues to re-apply `initialBlocklyXml` regardless of stored content.
- No new dependencies, no build-time steps, no admin-only escape hatches.
- The app remains a static Vite deployment.

Do not redefine:

- Storage key prefixes (`bba:guided-workspace:`, `bba:free-play-workspace`, `bba:free-play-pvp-team:`, `bba:guided-project-workspace:`).
- Free play persistence semantics.
- Project shared workspace semantics.
- Level ids, campaign order, reference solutions, toolboxes, win/failure conditions, or any other authored content.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md`
- `src/ai/blockly/workspace.js` — focus on lines 30–60 (storage prefixes), 240–260 (`getWorkspaceStorageKey`), 895–960 (load/save paths)
- `src/main.js` lines 90–120 (entry-point workspace loading)
- `src/config/levels.js` and `src/config/levels/index.js` (`getLevelDefinitions` and the phase index files)
- `tests/unit/blockly-interpreter.test.js` and `tests/unit/blockly-trace-collection.test.js` as patterns for using Blockly in node tests
- The 2026-05-17 bughunt-22 incident in this orchestrator session for context on why this packet exists

Use `rg "bba:guided-workspace|getWorkspaceStorageKey|getStoredWorkspaceXmlText|saveWorkspaceToLocalStorage|loadWorkspaceFromLocalStorage"` from the repository root to surface all touch points.

## Scope

### In scope

- A small hash function (FNV-1a 32-bit or equivalent) in `src/ai/blockly/workspace.js` (or a new helper) that produces a stable 8-character hex digest from normalized starter XML.
- A `normalizeStarterXmlForHashing(xml)` helper that collapses insignificant whitespace so formatting-only edits do not trigger a stale replace. Exact rule in Requirement 1.
- A `starterXmlVersion` property on each guided level definition, populated at level-load time via the chosen approach in Decision 4.
- A new sibling localStorage key per guided level recording the stamped hash.
- Updated `getStoredWorkspaceXmlText` (or a new path adjacent to it) that compares the stored hash against the current hash and returns the level's `initialBlocklyXml` instead when they disagree.
- Migration path that stamps the current hash on first load when the version key is absent.
- Unit tests covering: hash stability under formatting changes, hash sensitivity to real content changes, version-key absent → grace stamp behavior, version-key mismatched → replace behavior, version-key matched → preserve behavior.
- A Playwright spec that simulates "stored workspace from a prior version" by writing both keys to localStorage before page load, then asserts the current `initialBlocklyXml` is rendered, not the stored one.
- A new "Reset Workspace to Starter" button in `#blockly-toolbar` per Decision 7, wired through `src/ui/blocklyPanel.js` (or `src/ui/controls.js` if that's where toolbar controls bind today — implementer chooses based on existing seams).
- Visual treatment for the reset button distinct from undo/redo, in `src/assets/styles/components/blockly.css`.
- Subsystem doc update: `docs/subsystems/blockly-workspace.md` gains a "Starter versioning" section AND a brief note on the reset affordance.
- Progress report.

### Files and areas likely touched

- `src/ai/blockly/workspace.js`
- `src/config/levels.js` (or the levels-loader path that owns `getLevelDefinitions`)
- `src/ui/blocklyPanel.js` (reset button wiring)
- `src/assets/styles/components/blockly.css` (reset button styling)
- `index.html` (reset button DOM in `#blockly-toolbar`)
- `tests/unit/blockly-workspace.test.js` (new) or extension of an existing workspace test file
- `tests/browser/workspace-starter-versioning.spec.js` (new)
- `tests/browser/workspace-reset-button.spec.js` (new) or extension of the versioning spec
- `docs/subsystems/blockly-workspace.md`
- `reports/development/plan-45-guided-workspace-starter-versioning/progress.md`

### Out of scope

- Free play persistence.
- Project shared workspace versioning.
- Any UI affordance announcing a level update to the student.
- Server-side versioning, remote config, or feature flags.
- Hash function changes after this packet ships (the chosen function is the contract; future packets do not silently swap it without versioning the algorithm too).
- Crypto libraries, build-time hashing, or any new npm dependency.
- Renaming level ids or moving levels to handle staleness — the whole point of this packet is to make renames unnecessary.
- Changes to existing tests beyond what this packet's new behavior requires.

## Work Plan

1. Read the required references. Confirm the exact lines that own `getStoredWorkspaceXmlText`, `saveWorkspaceToLocalStorage`, and the entry-point loader in `main.js`.
2. Add the hash function with unit tests for stability and sensitivity. Land this first as a pure helper before wiring anything to it.
3. Add the `starterXmlVersion` derivation to `getLevelDefinitions` (Decision 4 approach b) with a unit test confirming each guided level has a non-empty version string.
4. Add the version key write path inside `saveWorkspaceToLocalStorage` so any save also stamps the current version. Add unit tests.
5. Add the version-compare branch inside `getStoredWorkspaceXmlText` (and any caller that bypasses it). Implement the Decision 5 grace stamp for absent version keys.
6. Add the Playwright spec.
7. Update `docs/subsystems/blockly-workspace.md`.
8. Run the full validation. Confirm the bughunt-22 manual repro from 2026-05-17 is now self-healing: simulate the stale-stored-workspace condition, observe the current starter loading.
9. Write the progress report including the bughunt-22 repro walkthrough.

## Implementation Requirements

### Requirement 1: Hash function and XML normalization

Required behavior:

- A function `hashStarterXml(xml: string): string` returns an 8-character lowercase hex digest.
- The function applies `normalizeStarterXmlForHashing` before hashing. Normalization rule:
  - Collapse all runs of whitespace (including newlines and tabs) inside element content to a single space.
  - Strip leading/trailing whitespace.
  - Strip `x="…"` and `y="…"` attributes from any element (these are Blockly's saved positions and are not semantic).
  - Do not normalize attribute order, case, or quote style. These are stable in authored XML.
- The function is pure and deterministic. Same input → same digest forever.
- Use FNV-1a 32-bit (or an equivalent small inline hash). Do not use `crypto.subtle` (introduces async + browser/node split). Do not add a dependency.

Constraints:

- The function must work identically in node (for tests) and browser (for runtime).
- Output format is exactly 8 lowercase hex characters, zero-padded if needed.
- Edge cases: empty string input returns a deterministic digest (the FNV-1a offset basis, formatted). Null/undefined input returns the same as empty string.

### Requirement 2: `starterXmlVersion` on every guided level definition

Required behavior:

- After level definitions are loaded by `getLevelDefinitions` (or the equivalent path), each guided level (any level with a non-empty `initialBlocklyXml`) has a `starterXmlVersion` property equal to `hashStarterXml(level.initialBlocklyXml)`.
- A unit test iterates all guided levels and asserts every one has a non-empty 8-character hex version.
- Levels without an `initialBlocklyXml` (if any exist in the campaign) get `starterXmlVersion: null` or are skipped — implementer choice, document in progress report.

Constraints:

- Do not modify the source level definition files to add the field — derive it at load time (Decision 4 approach b).
- Do not change the order of levels or any other property.

### Requirement 3: Save path stamps the version key

Required behavior:

- Inside `saveWorkspaceToLocalStorage` (or wherever the write happens), when the storage key has the `bba:guided-workspace:` prefix, also write the current level's `starterXmlVersion` to a sibling key `bba:guided-workspace-version:{levelId}`.
- Free play and project shared workspace saves do not write a version key.

Constraints:

- The sibling write happens in the same call, not deferred. If localStorage is unavailable, both writes are skipped together — never partial state.

### Requirement 4: Load path detects stale and replaces

Required behavior:

- Inside `getStoredWorkspaceXmlText` (or its caller in the guided path), after retrieving the stored XML, also retrieve the stored version from the sibling key.
- If the stored version is absent (Decision 5 — pre-packet migration): treat as fresh, stamp the current `starterXmlVersion` to the sibling key, and return the stored XML unchanged.
- If the stored version matches the current `starterXmlVersion`: return the stored XML unchanged (normal case).
- If the stored version is present and differs from the current `starterXmlVersion`: discard the stored XML, write the current `starterXmlVersion` to the sibling key, and return the level's `initialBlocklyXml` (the `fallbackXml` argument is the right source).
- All comparisons are byte-exact on the version strings; no normalization at compare time (normalization happens before hashing).

Constraints:

- The replace path must also clear (or overwrite on next save) the workspace key so a subsequent save doesn't restore the stale content. Simplest: on stale-replace, immediately write the new starter XML to the workspace key, then return it.
- Free play and project shared workspace reads do not consult the version key.
- Do not log to console at normal verbosity. If a debug log is helpful during development, gate it on `import.meta.env.DEV`.

Edge cases:

- localStorage unavailable: behave as today (the in-memory cache and fallback chain).
- Version key present but workspace key missing: ignore the orphan version key, return `fallbackXml`.
- Workspace key present but malformed (Blockly will throw on parse): out of scope; this packet does not introduce parser hardening.

### Requirement 5: Unit tests

Required behavior, in a new file `tests/unit/blockly-workspace.test.js` (or an extension of an existing workspace test file, implementer's call):

- `hashStarterXml` returns the same digest for two strings that differ only in whitespace, indentation, and `x="…"`/`y="…"` position attributes.
- `hashStarterXml` returns different digests for two strings that differ in block type, field value, or `<next>` nesting.
- `hashStarterXml` returns an 8-character lowercase hex string for every input including empty and null.
- Every guided level definition has a non-empty `starterXmlVersion` after load.
- `getStoredWorkspaceXmlText` returns stored content when stored version matches.
- `getStoredWorkspaceXmlText` returns `fallbackXml` when stored version differs.
- `getStoredWorkspaceXmlText` returns stored content AND stamps the current version when stored version is absent (Decision 5 grace).
- The save path writes both the workspace key and the version key for guided non-project levels.
- The save path writes only the workspace key for free play and project shared levels.

Constraints:

- Tests use an in-memory localStorage shim, not the real `window.localStorage`.
- No DOM, no Blockly workspace instances required for the unit tests in this requirement.
- Add the new file(s) to the `test:unit` allowlist in `package.json`.

### Requirement 6: Playwright regression spec

Required behavior, in a new file `tests/browser/workspace-starter-versioning.spec.js`:

- Test opens the app, before page load uses `page.addInitScript` to seed localStorage with:
  - A workspace key for a stable guided level (e.g., `level-05-mirror-forward` or `bughunt-22`) containing an obviously-different XML (e.g., a single `stay_still` block, easy to assert against).
  - A version key containing a known-wrong hash like `"deadbeef"`.
- Test navigates to the level via `?devGuidedLevel=<id>`.
- Test asserts the rendered Blockly workspace contains the current `initialBlocklyXml`'s block structure (a positive assertion on a block type that's in the current starter but not in the seeded stale XML).
- A second case seeds the workspace key but omits the version key (Decision 5 grace), navigates, and asserts the stored XML is preserved.
- A third case seeds both keys with matching current hash, navigates, and asserts the stored XML is preserved.

Constraints:

- The spec uses real browser pipeline, not test hooks that bypass DOM.
- The spec does not modify existing tests or seed data outside the scope of its three cases.
- The spec must run cleanly when the bughunt-22 starter XML is the current source-of-truth fix from 2026-05-17.

### Requirement 7: Reset Workspace to Starter button (Decision 7)

Required behavior:

- A new button `#resetWorkspaceToStarterButton` (or equivalent id, implementer's call) is added to `#blockly-toolbar` in `index.html` after the existing `#blockly-history-controls` div. Use the same `<button type="button">` shape as undo/redo.
- The button has `aria-label="Reset workspace to the starter program"` and a `title` attribute with the same text.
- The button's visible content is an icon (SVG or unicode glyph like "↻") plus optional text label; the implementer picks based on what fits the toolbar visual rhythm. A small text label is acceptable if the icon-only treatment is hard to distinguish from undo/redo.
- Visibility: shown only when `currentModeView === GUIDED_LEVELS` AND `getCurrentLevel(app)` has a non-empty `initialBlocklyXml` AND the level is not a project level (no `level.project?.id`). Hidden otherwise. Visibility sync happens in the same place undo/redo enabled-state is synced (around `blocklyPanel.js:102-109`).
- On click: shows `window.confirm("Reset your blocks to the starter program for this level? Your current blocks will be lost.")`. On confirm-true: replaces the workspace XML with the current level's `initialBlocklyXml`, writes the current `starterXmlVersion` to the sibling key, calls `app.syncUi()`. On confirm-false: no state change.
- The reset uses the same internal path as the stale-replace branch from Requirement 4 — it does not introduce a parallel code path. Factor out a helper if needed, e.g. `resetWorkspaceToCurrentStarter(app)`.
- The button is disabled (not just hidden) when the Blockly editor is not yet ready (matches the existing `editorReady` gate on undo/redo at `blocklyPanel.js:109`). When disabled, the confirm dialog does not fire.

Constraints:

- Use `window.confirm()`. Do not build a custom modal or reuse the tutorial overlay.
- Do not change the existing Play/Reset button's behavior (that one resets game state and preserves workspace; this packet's button is distinct).
- Do not show the button on free play or project-shared-workspace levels.
- Keyboard reach: the button must appear in tab order after the redo button. No custom focus handling beyond what the browser provides for `<button>`.
- Do not log to console at normal verbosity. Optional DEV-only log gated on `import.meta.env.DEV`.

Edge cases:

- localStorage unavailable: the reset still works in-memory; the version-stamp write is skipped (consistent with existing save behavior).
- User confirms but the level is in the middle of a running turn: the reset still proceeds (consistent with how undo/redo behave during play). If this turns out to be surprising in playtesting, a future packet can refine; do not gate on game state here.

### Requirement 8: Playwright coverage for the reset button

Required behavior, in `tests/browser/workspace-reset-button.spec.js` (or as additional cases in `workspace-starter-versioning.spec.js`):

- Test opens a guided level, modifies the workspace (drag a block or programmatically set the XML to something different from the starter), then clicks the reset button.
- Use `page.on("dialog", ...)` to assert the confirm dialog appears with the expected text, then accept it.
- After accept, assert the workspace XML matches `initialBlocklyXml` (normalized for the `x`/`y` attributes).
- A second case clicks the reset button, the dialog handler dismisses it instead of accepting, and the test asserts the workspace XML is unchanged.
- A third case opens Free Play and asserts the reset button is not visible.
- A fourth case opens a project-shared-workspace level and asserts the reset button is not visible.

Constraints:

- Tests use real browser pipeline. No bypassing the DOM with test hooks.
- `page.on("dialog")` is the standard Playwright pattern for native confirm dialogs.
- The dialog text assertion must match the exact copy from Decision 7.

### Requirement 9: Subsystem doc update

Required behavior:

- `docs/subsystems/blockly-workspace.md` gains a new section "Starter XML versioning" describing:
  - Why versioning exists (the 2026-05-17 bughunt-22 incident as the canonical example).
  - The hash function and normalization rule (Requirement 1).
  - The two-key storage shape (workspace key + version key).
  - The replace-on-mismatch behavior and silent-by-design choice.
  - The grace stamp for absent version keys.
  - The scope: guided non-project levels only.
  - What is NOT versioned: free play, project shared workspaces.
  - The manual reset affordance: button in `#blockly-toolbar`, native `confirm()`, same internal code path as stale-replace. Note that it is distinct from the Play/Reset button (which preserves workspace and resets game state).

Constraints:

- The section uses the same heading style and tone as the rest of the file.
- Do not move or rewrite existing sections.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-workspace.test.js
npx playwright test tests/browser/workspace-starter-versioning.spec.js --reporter=line
npx playwright test tests/browser/modal-stability.spec.js --reporter=line
npx playwright test tests/browser/key-capture-passthrough.spec.js --reporter=line
npm test
npm run test:browser
npm run build
npm run lint:levels
```

If a different filename for the unit tests is chosen, run that file directly first.

## Validation Checklist

- [ ] `hashStarterXml` returns 8-character lowercase hex; stable under whitespace and `x`/`y` attribute changes; sensitive to real content changes.
- [ ] Every guided level definition has a non-empty `starterXmlVersion` after load.
- [ ] `getStoredWorkspaceXmlText` returns stored content when versions match.
- [ ] `getStoredWorkspaceXmlText` returns `fallbackXml` when versions disagree.
- [ ] `getStoredWorkspaceXmlText` stamps the current hash and preserves stored content when the version key is absent (Decision 5 grace).
- [ ] `saveWorkspaceToLocalStorage` writes both keys for guided non-project saves.
- [ ] `saveWorkspaceToLocalStorage` writes only the workspace key for free play and project shared saves.
- [ ] Stale-replace path also writes the new starter to the workspace key so a follow-up save does not restore stale content.
- [ ] Playwright spec covers all three versioning cases (stale, absent, current).
- [ ] Reset button is visible on guided non-project levels with a non-empty starter.
- [ ] Reset button is hidden on Free Play and project-shared-workspace levels.
- [ ] Reset button click → confirm-accept → workspace matches current `initialBlocklyXml` and version key is stamped.
- [ ] Reset button click → confirm-cancel → workspace is unchanged.
- [ ] Reset button is keyboard-reachable and announces an accessible label.
- [ ] Reset button uses the same internal code path as stale-replace (no parallel implementation).
- [ ] Reset button is distinct visually from undo/redo (different icon and/or color treatment).
- [ ] Existing Play/Reset button behavior is unchanged.
- [ ] New test files are added to `package.json`'s `test:unit` allowlist.
- [ ] `npm test` passes with the new tests included in the count.
- [ ] `npm run test:browser` passes (existing modal-stability and key-capture specs unchanged).
- [ ] `npm run build` passes.
- [ ] `npm run lint:levels` passes (no new warnings).
- [ ] `docs/subsystems/blockly-workspace.md` has the new "Starter XML versioning" section and accurately describes the implementation.
- [ ] Progress report includes a walkthrough of the bughunt-22 self-heal scenario: seed stale workspace + wrong version, navigate, observe current starter.

## Stop Conditions

Stop and report for owner review if:

- The hash function produces collisions on realistic guided starter XML during testing (extremely unlikely with FNV-1a 32-bit over our content, but stop if it happens).
- The Decision 4 derivation path (`getLevelDefinitions` setting `starterXmlVersion`) is owned by code that has surprising load-order constraints making in-place modification risky.
- The version-key write happens through a code path that also touches free play or project shared workspaces (cross-contamination risk; pause and surface).
- Any existing Playwright test fails because of the new replace behavior (this would indicate the test was relying on stale-stored content; flag rather than weaken).
- A subsystem note would become untrue beyond the addition this packet adds.
- Any dependency install, build-time step, or remote-config change appears necessary.
- The orchestrator's manual recovery procedure for bughunt-22 (DevTools `localStorage.removeItem`) is no longer effective after the change — that would indicate the load path is taking an unexpected branch.
- The reset button's `window.confirm()` dialog text differs from Decision 7's exact copy due to platform or browser quirks (e.g., some Chromebook policy alters dialog text). Surface and decide whether to keep `confirm()` or move to a custom modal.
- The reset button visibility logic surfaces an edge-case level kind (e.g., a future prediction level with no `initialBlocklyXml`) where neither "show" nor "hide" is obviously correct.

## Notes For Future Self

- **Project shared workspace versioning** is the obvious follow-up. The right design is probably: version against the project's first-level starter, replace on mismatch with the same grace stamp, but with a UX consideration that destroying a multi-level project workspace is much costlier than destroying a single-level one. Worth a small UX choice (toast? confirm dialog? silent?) when the orchestrator first wants to push a fix to a project arc. The reset button from Decision 7 might also gain a "Reset entire project" mode at that time, with stronger confirm copy.
- **Version history (planned future packet) interaction with the reset button.** When workspace version history lands, the reset button should remain "go to authoritative current starter" — distinct from "restore my earlier work." The history surface is the place for the latter. Keep Decision 7's button copy ("Reset Workspace to Starter") so the two affordances stay legible side-by-side. The future packet should not attempt to overload the reset button.
- **Hash algorithm versioning.** If a future packet ever wants to change the hash function, the version key needs to encode which algorithm produced it (e.g., `fnv1a-32:abc12345`). The current packet ships a single algorithm, so the version key is just the digest. Document this constraint in `blockly-workspace.md` so a future implementer knows not to silently swap algorithms.
- **Telemetry.** If usage export ever needs to report "this student got a stale-replace event," the load path is the obvious instrumentation point. Out of scope here, but the hook would be cheap to add later.
- **Free play parity.** If returning students ever complain about free play workspaces becoming stale relative to authoring fixes, the same versioning pattern applies — but free play has no authored starter, so the contract is different. Probably a future packet, not this one.
- The bughunt-22 incident from 2026-05-17 is the canonical example for explaining this layer to future contributors. Keep the doc section concrete and reference the date.
